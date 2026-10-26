// The BlackCrown SEO agent. Fully server-side: it wakes on a daily cycle,
// reads the company's real numbers, thinks with the Anthropic API, keeps an
// Obsidian-style markdown brain, posts to a Discord channel, and reacts to
// what the owner writes back there. It PROPOSES changes; it never edits the
// live site on its own. Designed so a second agent (CEO) can reuse the same
// frame later.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// config
// ---------------------------------------------------------------------------
const AGENT_NAME = "Corvid";
const STATE_PATH = path.join(__dirname, "studio-agent.json");
const BRAIN_DIR = process.env.AGENT_BRAIN_DIR || path.join(__dirname, "brain");
const CYCLE_HOUR_ET = Number(process.env.AGENT_CYCLE_HOUR || 9); // 9am ET
// Set AGENT_CYCLE_EVERY_H (1-24) to run around the clock instead of once a day.
const CYCLE_EVERY_H = Math.max(0, Number(process.env.AGENT_CYCLE_EVERY_H || 0));
// For a truly constant operator: AGENT_CYCLE_EVERY_MIN (1 or more) beats the hourly
// setting. Every cycle is a paid model call, so short cadences cost real money; the
// watchman tick below already reacts within a minute for free when something happens.
const CYCLE_EVERY_MIN = Math.max(0, Number(process.env.AGENT_CYCLE_EVERY_MIN || 0));
const CYCLE_MS = CYCLE_EVERY_MIN >= 1 ? CYCLE_EVERY_MIN * 60000 : CYCLE_EVERY_H > 0 ? CYCLE_EVERY_H * 3600000 : 0;
const POLL_SECONDS = Math.max(30, Number(process.env.AGENT_POLL_SECONDS || 60));
const MODEL = process.env.AGENT_MODEL || "claude-sonnet-4-6";

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || "").trim();
const CHANNEL_ID = (process.env.DISCORD_SEO_CHANNEL_ID || "").trim();
const WEBHOOK_URL = (process.env.DISCORD_SEO_WEBHOOK || "").trim();

// Bloom image rendering, used ONLY after the owner approves a creative.
const BLOOM_KEY = (process.env.BLOOM_API_KEY || "").trim();
const BLOOM_BRANDS = {
  korvus: process.env.BLOOM_BRAND_KORVUS || "4c2723d4-ad2b-4b52-bd20-f5b3ee65641b",
  default: process.env.BLOOM_BRAND_DEFAULT || "c5d8f6df-bb5e-40f8-a064-4e1462d76bf5",
};
// keep this many credits in reserve; renders pause below it so the month
// never ends at zero. Owner tunes with BLOOM_MIN_RESERVE in .env.
const BLOOM_MIN_RESERVE = Math.max(0, Number(process.env.BLOOM_MIN_RESERVE || 10));
let creditsCache = { at: 0, data: null };
export async function bloomCredits(fresh = false) {
  if (!BLOOM_KEY) return null;
  if (!fresh && creditsCache.data && Date.now() - creditsCache.at < 30 * 60 * 1000) return creditsCache.data;
  try {
    const r = await fetch("https://www.trybloom.ai/api/v1/credits", { headers: { "x-api-key": BLOOM_KEY } });
    const j = await r.json();
    if (r.ok && j?.data) {
      creditsCache = { at: Date.now(), data: { balance: j.data.balance, unlimited: Boolean(j.data.unlimited) } };
      return creditsCache.data;
    }
  } catch {
    // balance is a nicety, never a blocker for knowing it
  }
  return creditsCache.data;
}

// ---------------------------------------------------------------------------
// state
// ---------------------------------------------------------------------------
function freshState() {
  return {
    enabled: true,
    status: "idle",
    lastCycleAt: null,
    lastCycleDay: null,
    currentFocus: "First cycle has not run yet.",
    lastThought: "",
    tasks: [],
    proposals: [],
    log: [],
    discord: { lastMessageId: null, lastOutboundAt: null, lastInboundAt: null },
  };
}
let state = loadState();
function loadState() {
  try {
    const s = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
    return { ...freshState(), ...s };
  } catch {
    return freshState();
  }
}
function saveState() {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state));
  } catch {
    // best effort
  }
}
function log(kind, text) {
  state.log.push({ t: Date.now(), kind, text: String(text).slice(0, 600) });
  state.log = state.log.slice(-250);
  saveState();
}

// ---------------------------------------------------------------------------
// brain (an Obsidian vault: plain markdown with [[wikilinks]])
// ---------------------------------------------------------------------------
function etDayKey(offsetDays = 0) {
  const d = new Date(Date.now() - offsetDays * 864e5);
  return d.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
function etHour() {
  return (
    parseInt(
      new Date().toLocaleString("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      }),
      10
    ) % 24
  );
}

const SEED_FILES = {
  "Strategy.md": `# Strategy

The mission: grow qualified traffic and paying customers for BlackCrown.
Primary funnel: blackcrownvxj.com into [[Korvus]] subscriptions, with
[[Crown]] and Eclipse-X as supporting fronts.

Principles
- Sell to the independent operator. Traders watching the open, founders shipping after hours.
- Figure out what visitors actually need, then show where BlackCrown fits. Never hype.
- Proposals only. The owner approves everything before it touches the live site.
- Every claim backed by a number from [[Patterns]].
`,
  "Patterns.md": `# Patterns

What the data keeps saying. Updated every cycle. Confidence grows with evidence.

(nothing learned yet, first cycles will fill this in)
`,
  "Decisions.md": `# Decisions

Owner rulings on proposals, newest first. These are law.
`,
  "Tasks.md": `# Tasks

The working queue. Mirrored in the admin.
`,
};

function ensureBrain() {
  fs.mkdirSync(path.join(BRAIN_DIR, "Log"), { recursive: true });
  // richer seeds shipped with the repo win over the built-in minimal ones
  const seedDir = path.join(__dirname, "brain-seed");
  try {
    for (const f of fs.readdirSync(seedDir)) {
      if (!f.endsWith(".md")) continue;
      const p = path.join(BRAIN_DIR, f);
      if (!fs.existsSync(p)) fs.copyFileSync(path.join(seedDir, f), p);
    }
  } catch {
    // no seed dir
  }
  for (const [name, body] of Object.entries(SEED_FILES)) {
    const p = path.join(BRAIN_DIR, name);
    if (!fs.existsSync(p)) fs.writeFileSync(p, body);
  }
}
function brainRead(name) {
  try {
    return fs.readFileSync(path.join(BRAIN_DIR, name), "utf8");
  } catch {
    return "";
  }
}
function brainWrite(name, body) {
  ensureBrain();
  const safe = String(body).replace(/\u2014|\u2013/g, ", ");
  fs.writeFileSync(path.join(BRAIN_DIR, name), safe);
}
function brainAppend(name, body) {
  ensureBrain();
  const p = path.join(BRAIN_DIR, name);
  const safe = String(body).replace(/\u2014|\u2013/g, ", ");
  fs.appendFileSync(p, (fs.existsSync(p) ? "\n" : "") + safe);
}
export function brainList() {
  ensureBrain();
  const out = [];
  const walk = (dir, rel) => {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const r = rel ? `${rel}/${f}` : f;
      const st = fs.statSync(full);
      if (st.isDirectory()) walk(full, r);
      else out.push({ name: r, size: st.size, mtime: st.mtimeMs });
    }
  };
  walk(BRAIN_DIR, "");
  return out.sort((a, b) => b.mtime - a.mtime);
}
export function brainFile(name) {
  const clean = String(name).replace(/\.\./g, "");
  return { name: clean, body: brainRead(clean) };
}
export function brainSave(name, body) {
  const clean = String(name).replace(/\.\./g, "").replace(/^\/+/, "");
  if (!clean.endsWith(".md") || clean.includes("\\")) return null;
  brainWrite(clean, String(body).slice(0, 60000));
  log("brain", `Owner edited ${clean}`);
  return { name: clean };
}
export function brainDirPath() {
  ensureBrain();
  return BRAIN_DIR;
}

// ---------------------------------------------------------------------------
// discord
// ---------------------------------------------------------------------------
export function discordMode() {
  if (BOT_TOKEN && CHANNEL_ID) return "bot";
  if (WEBHOOK_URL) return "webhook";
  return "none";
}

// branded embeds: the first **HEADER** line becomes the card title, the
// crown marks the author row and footer, ALL CAPS bold section leads
// (**PULSE**, **LEARNED**, **GREEN LIGHT MEANS**) become spaced fields so
// nothing reads cramped, and deliveries carry their art in the card.
const EMBED_ICON = (process.env.EMBED_ICON_URL || "https://blackcrownvxj.com/crown-mark.png").trim();
export function buildEmbeds(content, color, signature, opts = {}) {
  const text = String(content).trim();
  const m = text.match(/^\*\*([^\n]+?)\*\*(\s*·\s*([^\n]*))?\n*/);
  let title = null;
  let rest = text;
  if (m) {
    title = (m[1] + (m[3] ? " · " + m[3] : "")).replace(/\*\*/g, "").trim().slice(0, 256);
    rest = text.slice(m[0].length);
  }
  let body = rest.length ? rest : text;
  const base = {
    color,
    author: { name: "BLACKCROWNVXJ LLC", icon_url: EMBED_ICON },
    footer: { text: signature, icon_url: EMBED_ICON },
  };
  // section layout: a line that LEADS with short all caps bold starts a field
  const fields = [];
  const pre = [];
  let cur = null;
  for (const ln of body.split("\n")) {
    const sm = ln.match(/^\*\*([A-Z][A-Z0-9 /&-]{1,28})\*\*:?\s*(.*)$/);
    if (sm) {
      if (cur) fields.push(cur);
      cur = { name: sm[1].trim(), value: sm[2] ? sm[2].trim() : "" };
    } else if (cur) {
      cur.value += (cur.value ? "\n" : "") + ln;
    } else {
      pre.push(ln);
    }
  }
  if (cur) fields.push(cur);
  if (fields.length && fields.length <= 24 && fields.every((f) => f.value.length <= 1000)) {
    return [
      {
        ...base,
        title: title || undefined,
        description: pre.join("\n").trim() || undefined,
        fields: fields.map((f) => ({ name: f.name, value: f.value.trim() || "•", inline: false })),
        timestamp: new Date().toISOString(),
        image: opts.image ? { url: opts.image } : undefined,
      },
    ];
  }
  // long or unstructured content: description pages
  const parts = [];
  if (!body.trim()) body = " ";
  while (body.length > 3900) {
    parts.push(body.slice(0, 3900));
    body = body.slice(3900);
  }
  parts.push(body);
  return parts.slice(0, 10).map((d, i) => ({
    ...base,
    title: i === 0 && title ? title : undefined,
    description: d.trim() || undefined,
    timestamp: i === parts.length - 1 ? new Date().toISOString() : undefined,
    image: i === 0 && opts.image ? { url: opts.image } : undefined,
  }));
}

async function discordSend(content, opts = {}) {
  const payload = {
    content: opts.link ? String(opts.link).slice(0, 1900) : "",
    embeds: buildEmbeds(content, 0xff2d95, "Corvid, SEO desk", opts),
  };
  try {
    if (BOT_TOKEN && CHANNEL_ID) {
      const r = await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bot ${BOT_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`discord ${r.status}`);
    } else if (WEBHOOK_URL) {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, username: `${AGENT_NAME} (BlackCrown SEO)` }),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
    } else {
      return false;
    }
    return true;
  } catch (e) {
    log("error", `Discord embed send failed (${e.message || e}), falling back to plain text`);
  }
  // plain fallback so a bad embed never silences the agent
  const chunks = [];
  let rest = String(content);
  while (rest.length) {
    chunks.push(rest.slice(0, 1900));
    rest = rest.slice(1900);
  }
  for (const chunk of chunks) {
    try {
      if (BOT_TOKEN && CHANNEL_ID) {
        await fetch(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bot ${BOT_TOKEN}`,
          },
          body: JSON.stringify({ content: chunk }),
        });
      } else if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: chunk, username: `${AGENT_NAME} (BlackCrown SEO)` }),
        });
      } else {
        return false;
      }
    } catch (e) {
      log("error", `Discord send failed: ${e.message || e}`);
      return false;
    }
  }
  state.discord.lastOutboundAt = Date.now();
  saveState();
  return true;
}

async function discordFetchNew() {
  if (!(BOT_TOKEN && CHANNEL_ID)) return [];
  try {
    const after = state.discord.lastMessageId
      ? `&after=${state.discord.lastMessageId}`
      : "";
    const r = await fetch(
      `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages?limit=25${after}`,
      { headers: { authorization: `Bot ${BOT_TOKEN}` } }
    );
    if (!r.ok) {
      if (r.status === 401 || r.status === 403)
        log("error", `Discord read refused (${r.status}), check the bot token and channel permissions`);
      return [];
    }
    const msgs = await r.json();
    if (!Array.isArray(msgs) || !msgs.length) return [];
    const sorted = msgs.sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1));
    state.discord.lastMessageId = sorted[sorted.length - 1].id;
    saveState();
    // only humans; ignore the agent's own posts and other bots
    return sorted.filter((m) => !m.author?.bot && m.content);
  } catch (e) {
    log("error", `Discord read failed: ${e.message || e}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// data feeds (injected from server.mjs so the agent sees what the admin sees)
// ---------------------------------------------------------------------------
let hooks = { onFiled: null, ownerDecision: null };
export function wireHooks(h) {
  hooks = { ...hooks, ...h };
}

let feeds = {
  stats: () => null, // () => parsed studio-stats.json
  pulse: null, // () => { visits, down } cheap signals for the watchman
  uptime: () => null, // () => uptime summary
  audit: () => null, // () => runs the audit, returns pages
  revenue: null, // async () => stripe summary or null
  money: null, // () => expense/income month summary
  engine: null, // async () => live TikTok Engine config text or null
  trends: null, // async () => trending hashtags text or null
  ledger: null, // () => Regent's recent executions
};
export function wireFeeds(f) {
  feeds = { ...feeds, ...f };
}

// ---------------------------------------------------------------------------
// watchman: a free check every minute; a full cycle fires only on a real event
// ---------------------------------------------------------------------------
let cycleAsap = "";
let lastPulse = null;
let lastEventCycleAt = 0;
export function pokeCycle(reason) {
  cycleAsap = String(reason || "something changed").slice(0, 140);
}
async function watchEvents() {
  const events = [];
  if (cycleAsap) {
    events.push(cycleAsap);
    cycleAsap = "";
  }
  if (feeds.pulse) {
    try {
      const p = await feeds.pulse();
      if (p && lastPulse) {
        if ((p.down || 0) > (lastPulse.down || 0)) events.push("a site just went DOWN");
        if ((p.down || 0) < (lastPulse.down || 0)) events.push("a site came back up");
        const jump = (p.visits || 0) - (lastPulse.visits || 0);
        if (jump >= 5) events.push(`traffic spike, ${jump} visits in the last minute`);
      }
      if (p) lastPulse = p;
    } catch {
      // pulse is best effort
    }
  }
  return events;
}

function aggregates() {
  const s = feeds.stats() || {};
  const days = Object.keys(s).sort();
  const sumWin = (n) => {
    const since = etDayKey(n - 1);
    const out = { visit: {}, click: {}, src: {}, dev: {}, hr: {} };
    for (const day of days) {
      if (day < since) continue;
      for (const e of Object.keys(out)) {
        const obj = (s[day] && s[day][e]) || {};
        for (const k of Object.keys(obj)) out[e][k] = (out[e][k] || 0) + obj[k];
      }
    }
    return out;
  };
  const tot = (o) => Object.values(o || {}).reduce((a, b) => a + b, 0);
  const w7 = sumWin(7);
  const w7prev = (() => {
    const since = etDayKey(13);
    const until = etDayKey(7);
    const out = { visit: {} };
    for (const day of days) {
      if (day < since || day >= until) continue;
      const obj = (s[day] && s[day].visit) || {};
      for (const k of Object.keys(obj)) out.visit[k] = (out.visit[k] || 0) + obj[k];
    }
    return out;
  })();
  const visits7 = tot(w7.visit);
  const visitsPrev7 = tot(w7prev.visit);
  return {
    visits7,
    visitsPrev7,
    deltaPct: visitsPrev7 ? Math.round(((visits7 - visitsPrev7) / visitsPrev7) * 100) : null,
    clicks7: w7.click,
    pages7: w7.visit,
    sources7: w7.src,
    devices7: w7.dev,
    hours7: w7.hr,
  };
}

// ---------------------------------------------------------------------------
// anthropic
// ---------------------------------------------------------------------------

// Models sometimes put literal newlines inside JSON strings. Walk the text
// and escape control characters that appear inside string literals so
// JSON.parse survives.
function repairJson(text) {
  let out = "";
  let inStr = false;
  let esc = false;
  for (const ch of String(text)) {
    if (esc) {
      out += ch;
      esc = false;
      continue;
    }
    if (ch === "\\") {
      out += ch;
      esc = inStr;
      continue;
    }
    if (ch === '"') {
      inStr = !inStr;
      out += ch;
      continue;
    }
    if (inStr && ch === "\n") {
      out += "\\n";
      continue;
    }
    if (inStr && ch === "\r") continue;
    if (inStr && ch === "\t") {
      out += "\\t";
      continue;
    }
    out += ch;
  }
  return out;
}

export function parseModelJson(text) {
  const tries = [];
  tries.push(text);
  tries.push(repairJson(text));
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    tries.push(m[0]);
    tries.push(repairJson(m[0]));
  }
  for (const t of tries) {
    try {
      return JSON.parse(t);
    } catch {
      // next
    }
  }
  throw new Error("agent returned no parseable JSON");
}

async function think(system, user, maxTokens = 2000) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing in .env");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Anthropic (${r.status}): ${t.slice(0, 180)}`);
  }
  const data = await r.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/i, "")
    .trim()
    .replace(/\u2014|\u2013/g, ", ");
  try {
    return parseModelJson(text);
  } catch (e) {
    const head = text.slice(0, 140).replace(/\n/g, " ");
    throw new Error(`${e.message}. Output head: ${head}`);
  }
}

export async function thinkText(system, user, maxTokens = 1400) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing in .env");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!r.ok) throw new Error(`Anthropic (${r.status})`);
  const data = await r.json();
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim()
    .replace(/\u2014|\u2013/g, ", ");
}

// The minions: small single-purpose workers Corvid can delegate to. Each is
// one focused model call; the report lands in the vault and feeds the next
// cycle, so knowledge compounds instead of piling onto one context.
const MINIONS = {
  scout: `You are Scout, a research minion of BlackCrown's SEO agent Corvid. You dig into one question about search behavior, keywords, trends, or competitors for the BlackCrown family (Korvus market terminal, Crown private AI, Eclipse-X community). Output a tight markdown report: a one-line finding first, then evidence bullets, then 2-3 recommended moves. Ground claims in the provided data; say plainly when you are reasoning from general knowledge instead. Never use em dashes.`,
  scribe: `You are Scribe, a writing minion of BlackCrown's SEO agent Corvid. You produce finished copy in the house voice: anti guru, honest, specific, short sentences, no hype, no promised outcomes, never trading advice, no em dashes, no emojis. Deliver exactly what the task asks, ready to use, in markdown.`,
  analyst: `You are Analyst, a numbers minion of BlackCrown's SEO agent Corvid. You take the provided metrics and extract what matters: trends, anomalies, ratios, and the single most actionable insight. Output tight markdown: headline insight, the numbers behind it, what to do about it. No filler, no em dashes.`,
};

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "task";
}

async function runMinion(name, task, context) {
  const sys = MINIONS[name];
  if (!sys) return null;
  const report = await thinkText(sys, `Task from Corvid: ${task}\n\nContext:\n${String(context || "").slice(0, 3000)}`, 1600);
  const file = path.join("Minions", `${etDayKey()}-${name}-${slugify(task)}.md`);
  fs.mkdirSync(path.join(BRAIN_DIR, "Minions"), { recursive: true });
  brainWrite(file, `# ${name}: ${task}\n\nFor [[Corvid]], ${etDayKey()}.\n\n${report}\n`);
  state.minionReports = (state.minionReports || []).slice(-5);
  state.minionReports.push({ t: Date.now(), minion: name, task: String(task).slice(0, 100), file });
  log("minion", `${name} finished: ${String(task).slice(0, 80)}`);
  saveState();
  // a report that lands long after the cycle that ordered it deserves prompt attention
  if (!state.lastCycleAt || Date.now() - state.lastCycleAt > 10 * 60000) {
    pokeCycle(`minion ${name} delivered a report: ${String(task).slice(0, 80)}`);
  }
  return report;
}

const IDENTITY = `You are ${AGENT_NAME}, the autonomous SEO and growth agent of BlackCrownVxJ LLC. You run every day on the company server. Your owner is Vxmpira.N; you report to him in a private Discord channel and in the admin panel.

THE COMPANY: BlackCrown builds for independent operators. Products: Korvus (korvus.industries, a 24/7 market intelligence terminal for index futures traders, the main revenue product, Observer free tier and Operator paid tier), BlackCrown Intelligence (a private AI workspace), LodeStone (a TradingView indicator sold with Operator), and Eclipse-X (the free Discord community, the top of the funnel). Brand voice: confident, direct, a little defiant, never corporate hype. The signature line: a crown is not handed down, it is built.

YOUR JOB: grow qualified traffic to blackcrownvxj.com and push it toward Korvus signups. You study the first-party analytics, find patterns, keep your markdown brain sharp, and propose concrete moves.

HARD RULES:
- You PROPOSE. You never claim to have changed the site, posted content, or spent money. The owner approves everything.
- Ground every claim in the numbers you are given. If data is thin, say so and propose how to get more.
- Never use em dashes or en dashes anywhere. Use a period or a comma.
- Be concise. The owner reads this on his phone.`;

const FORMAT_RULES = `MESSAGE FORMAT, non negotiable. Discord markdown only (**bold**). Tight, titled, phone first.

Daily update template, follow it exactly, max 16 lines total:
**CORVID // DAILY** · {date}
**PULSE** · visits {n} ({delta}) · K {n} · Crown {n} · EX {n}
**LEARNED**
- {max 2 bullets, each under 12 words, data backed}
**ON IT**
- {max 2 bullets, each under 10 words}
**FILED**
#{n} {page}: {summary under 10 words} · with Regent
(omit FILED entirely when there are no new proposals; omit LEARNED when data is flat and say so in one PULSE word. You never ask for approvals yourself; Regent, the CEO agent, reviews your filings and takes them to the owner.)

Replies in chat: start with **CORVID //** then 1 to 3 short lines. No greetings, no filler, no restating his message.`;

const PROPOSAL_RULES = `PROPOSAL RULES. summary: under 10 words. detail MUST use exactly this labeled layout so the owner knows what a yes triggers:
WHAT: {one line}
WHY: {one line with a number from the data}
CURRENT: {exact current text, or "none"}
NEW: {exact final text, ready to paste}
GREEN LIGHT MEANS: {one line, precisely what happens on approve and who does it}

PAGE ADDRESSING: a bare file name like korvus.html means the brand site. Prefix with a repo to reach a product codebase: "korvus:relative/path/file.ext" is the Korvus engine, "crown:relative/path/file.ext" is Crown. Use ONLY file paths the audit actually lists, never guess conventional names; the korvus.industries homepage is korvus:korvus_landing.html (there is no index.html in that repo), and its other pages are korvus_ prefixed at the repo root. Only propose repo edits when you know the exact file and exact CURRENT text.
TIKTOK ENGINE EDITS: to change the Make automation itself (writer prompts, captions, slide specs, variable values), file with page "make", CURRENT an exact passage copied from the TIKTOK ENGINE feed, NEW the replacement. Content strings only, never urls, keys, tokens, or module wiring. GREEN LIGHT MEANS Regent applies it to the live scenario, raw backup saved first.
RECURRING REPORTS, kind "job": for any recurring digest, report, or monitoring post, file kind "job" instead of an automation paste. The server itself runs these, no Make involved. detail MUST carry, each on its own line: SCHEDULE: daily HH:MM ET, or weekly <monday..sunday> HH:MM ET. CHANNEL: corvid or boardroom. NEW: the exact content spec, what the report covers, in what order, pulled from live analytics, revenue, uptime, and SEO data. GREEN LIGHT MEANS the server registers the job and posts the report on schedule from then on.
ADDING HEAD TAGS: to add canonical, og, twitter, or other meta and link tags to an html page, set CURRENT: none and make NEW only the tags themselves, nothing else. Regent merges them into the head, updating any tag that already exists and inserting the rest. Never guess head text as a CURRENT anchor. Sitemap entries work the same way: NEW is just the url blocks, Regent appends what is missing.
kinds: "title" and "meta" (site tag rewrites; green light means Regent edits the live file on the server), "content" (page copy; include the exact CURRENT block so Regent can replace it precisely), "automation" (page "make" edits to the TikTok Engine; green light means Regent applies it to the live scenario, backup first), "campaign" (a plan), "job" (a recurring server-run report, see RECURRING REPORTS), "creative" (a new TikTok post, VIDEO or slides; set "format":"video" with "video" carrying the full clip direction, or "format":"slides" with "slides": ["one image prompt per slide, single line, under 300 characters, dark premium near black, royal accents, one focal point, text centered, right edge and bottom 15 percent empty, destination small above the bottom fifth"]; always "caption": "keyword first line, 2-3 short lines, Link in bio plus destination", "target": the destination it sells, "brand": "korvus" or "default"; green light means Regent renders it through Bloom, video or stills, Herald finalizes the caption and hashtags for the target, and the finished package posts in this channel for the owner to post manually).`;

const CYCLE_SYSTEM = `${IDENTITY}

${FORMAT_RULES}

${PROPOSAL_RULES}

Daily cycle. You get: the week's analytics, Stripe revenue, the expense ledger, the site audit, uptime, the TikTok Engine config, your brain, open tasks, pending proposals.

Respond with ONLY one JSON object, no fences. It must pass JSON.parse: inside every string value write line breaks as \\n, never as a real newline.
{
 "thought": "max 2 sentences",
 "focus": "max 8 words",
 "patterns_md": "full new Patterns.md: keep what holds, update confidence, add what the data shows, drop what died. Bullets and [[wikilinks]], under 30 lines",
 "tasks": [{"title":"max 7 words","status":"open|doing|done"}],
 "proposals": [{"page":"...","kind":"...","summary":"...","detail":"...","target":"brand|korvus|crown|eclipse|lodestone","format":"video|slides","video":"one flowing video direction when format is video: shots, motion, on-screen text, 10 to 15 seconds vertical","slides":["..."],"caption":"...","brand":"korvus"}],
 "brain_notes": [{"name":"Keywords.md","body":"full markdown content"}],
 "delegations": [{"minion":"scout|scribe|analyst","task":"one focused job","context":"what it needs to know"}],
 "discord": "the daily update, exactly in the template"
}
BRAIN ECOSYSTEM: grow the vault into a real knowledge base. Use brain_notes (max 2 per cycle) to create or fully update topic notes: Keywords.md, Competitors.md, Funnel.md, Korvus-Site.md, Crown-Site.md, whatever the work needs. Wikilink them from each other and keep each note current rather than ever-growing.
GROWTH MANDATE: you run SEO for all three properties: blackcrownvxj.com (bare file names), korvus.industries (repo prefix korvus:), and blackcrown-intelligence.com (repo prefix crown:). The audit now covers every page it can reach, including product repo pages when their clones live on this box. STANDING ORDER: drive every audited page to a score of 100. Any page sitting below 100 is always a valid target, file the exact fix that closes the gap, highest impact first. Beyond scores, hunt at least one concrete growth lever in the data every cycle (a page leaking visitors, a source worth doubling, a product with clicks but no signups, a keyword gap) and either act on it, delegate it to a minion, or file it. Curiosity is free; use it constantly.
SELF IMPROVEMENT: once per day (first cycle after midnight ET), review your own performance against [[Ledger]] outcomes and the data, then update two vault notes via brain_notes: Skills.md (what worked, what failed, what you will do differently) and Playbook.md (your current best tactics, kept sharp, not ever-growing). Your skill is your brain; grow it deliberately.
STRATEGY EVOLUTION: when the data says your Strategy itself should change, file a proposal with kind "brain", page set to the vault file name (for example Strategy.md), CURRENT the exact passage to replace, NEW the replacement. The owner's approval makes it law and Regent writes it.
MINIONS: delegate instead of piling work on yourself. Use delegations (max 2 per cycle) for jobs a specialist does better: scout for research questions, scribe for finished copy, analyst for digging into the numbers. Their reports land in the vault Minions folder and come back to you next cycle.
Max 6 tasks. Max 2 new proposals per cycle, only ones worth his time; zero is fine. Never re-propose anything pending or decided. Number new proposals starting at the number given.
When this cycle shows nothing materially new since the last one (flat traffic, no findings, nothing to file), set "discord" to "" and send nothing. You run around the clock; speak only when you have something. Silence beats noise.
DAILY CREATIVE: if CREATIVE FILED TODAY is no, one of this cycle's proposals MUST be a "creative", built from the current data and TIKTOK TRENDS when available. Prefer "format":"video" (one vertical clip with a video direction in "video") over "slides"; stills are the fallback. Every creative MUST declare "target": the ONE destination this post sells, brand (blackcrownvxj.com), korvus (korvus.industries), crown (blackcrown-intelligence.com), eclipse (the free Discord), or lodestone (the indicator). On render, Herald the sales agent finalizes the caption and hashtags for that target, so focus your energy on the visual concept.
CREATIVE BUDGET: the company has 200 Bloom credits a month and a video costs several times a still. Watch BLOOM CREDITS in your feed and pace the month deliberately: video for the strongest concept, slides for routine posts, and when the balance runs ahead of the calendar, file slides or skip a day. Running dry mid-month is a failure; ending the month with credits unspent on weak posts is not. The daily creative counts as something worth sending, so the discord update goes out with it.`;

const REACT_SYSTEM = `${IDENTITY}

${FORMAT_RULES}

The owner wrote in the channel. He may approve or reject by number, ask for a change, ask a question, or hand you a task. Only record decisions he clearly made.

WHAT YOU CAN DO, never claim otherwise: produce TikTok VIDEOS and slide carousels (you file a kind creative proposal, format video or slides; on his approval Bloom renders the actual video or images, Herald finalizes the caption, and the finished package lands in this channel); edit any page on all three sites and the sitemap; edit the live TikTok Engine in Make (page "make"); register recurring server-run reports (kind "job"); delegate to minions. When he asks for any of these, queue the task, it files within minutes through your task engine, not "next cycle".

Respond with ONLY one JSON object that passes JSON.parse (line breaks inside strings written as \\n):
{
 "reply": "**CORVID //** then 1-3 short lines",
 "decisions": [{"id":"proposal id","action":"approve|reject|change","note":"his words, short"}],
 "new_tasks": [{"title":"max 7 words"}],
 "focus": "max 8 words, or the same"
}
If he makes a decision, acknowledge in one line that it goes to Regent, who executes and confirms; never state the change as done yourself. On a change request: acknowledge in one line; the rework files within minutes.`;

// ---------------------------------------------------------------------------
// the daily cycle
// ---------------------------------------------------------------------------
let busy = false;

export async function runCycle(trigger = "schedule") {
  if (busy) return { ok: false, error: "already running" };
  busy = true;
  state.status = "thinking";
  saveState();
  log("cycle", `Cycle started (${trigger})`);
  try {
    ensureBrain();
    const agg = aggregates();
    const up = feeds.uptime() || [];
    let audit = [];
    try {
      audit = (await feeds.audit()) || [];
    } catch (e) {
      log("error", `Audit inside cycle failed: ${e.message || e}`);
    }
    let rev = null;
    try {
      rev = feeds.revenue ? await feeds.revenue() : null;
    } catch {
      rev = null;
    }
    const money = feeds.money ? feeds.money() : null;
    let engine = null;
    try {
      engine = feeds.engine ? await feeds.engine() : null;
    } catch {
      engine = null;
    }
    let trends = null;
    try {
      trends = feeds.trends ? await feeds.trends() : null;
    } catch {
      trends = null;
    }
    const today = etDayKey();
    const creativeToday = state.proposals.some(
      (p) =>
        p.kind === "creative" &&
        (p.status === "pending" ||
          new Date(p.createdAt).toLocaleDateString("en-CA", { timeZone: "America/New_York" }) === today)
    );
    const pending = state.proposals.filter((p) => p.status === "pending");
    const nextNumber =
      state.proposals.reduce((a, p) => Math.max(a, p.number || 0), 0) + 1;

    const user = [
      `Today (ET): ${etDayKey()}`,
      `WHY THIS CYCLE FIRED: ${trigger}. If it fired on an event, deal with that event first and keep the rest of the cycle short.`,
      `ANALYTICS 7d: visits ${agg.visits7} (prev 7d ${agg.visitsPrev7}${
        agg.deltaPct === null ? "" : `, ${agg.deltaPct >= 0 ? "+" : ""}${agg.deltaPct}%`
      })`,
      `Clicks 7d: ${JSON.stringify(agg.clicks7)}`,
      `Visits by page 7d: ${JSON.stringify(agg.pages7)}`,
      `Sources 7d: ${JSON.stringify(agg.sources7)}`,
      `Devices 7d: ${JSON.stringify(agg.devices7)}`,
      `Visit hours 7d (ET): ${JSON.stringify(agg.hours7)}`,
      `UPTIME: ${JSON.stringify(up)}`,
      `REVENUE (Stripe): ${
        rev
          ? JSON.stringify({ mrr: rev.mrr, subs: rev.subscribers, monthGross: rev.monthGross, products: rev.products })
          : "not connected"
      }`,
      `EXPENSES this month (manual ledger): ${money ? JSON.stringify(money) : "none logged"}`,
      `TIKTOK ENGINE (live config): ${engine ? engine.slice(0, 3200) : "Make read key not set, see brain [[TikTok-Engine]] for the design"}`,
      `TIKTOK TRENDS: ${trends ? trends.slice(0, 1200) : "feed unavailable today, use your own judgment on tags"}`,
      `CREATIVE FILED TODAY: ${creativeToday ? "yes" : "no"}`,
      `BLOOM CREDITS: ${await bloomCredits().then((c) => (c ? (c.unlimited ? "unlimited" : `${c.balance} left of 200 monthly`) : "unknown"))}`,
      `REGENT LEDGER (what got executed, confirm wins against it): ${
        feeds.ledger ? feeds.ledger() || "nothing yet" : "n/a"
      }`,
      `MINION REPORTS (recent, read the vault Minions folder for full text): ${JSON.stringify(
        (state.minionReports || []).slice(-4).map((m) => ({ minion: m.minion, task: m.task, file: m.file }))
      )}`,
      `AUDIT (worst first): ${JSON.stringify(
        audit
          .slice()
          .sort((a, b) => a.score - b.score)
          .slice(0, 6)
          .map((p) => ({ file: p.file, score: p.score, issues: p.issues.map((i) => i.msg) }))
      )}`,
      `BRAIN Strategy.md:\n${brainRead("Strategy.md").slice(0, 2500)}`,
      `BRAIN Patterns.md:\n${brainRead("Patterns.md").slice(0, 2500)}`,
      `BRAIN Decisions.md (recent):\n${brainRead("Decisions.md").slice(0, 1500)}`,
      `OPEN TASKS: ${JSON.stringify(state.tasks.filter((t) => t.status !== "done"))}`,
      `PENDING PROPOSALS (do not repeat): ${JSON.stringify(
        pending.map((p) => ({ number: p.number, page: p.page, summary: p.summary }))
      )}`,
      `Number NEW proposals starting at: ${nextNumber}`,
    ].join("\n\n");

    const out = await think(CYCLE_SYSTEM, user, 6000);

    state.lastThought = String(out.thought || "").slice(0, 800);
    state.currentFocus = String(out.focus || state.currentFocus).slice(0, 200);
    if (out.patterns_md) brainWrite("Patterns.md", out.patterns_md);
    if (Array.isArray(out.tasks)) {
      state.tasks = out.tasks
        .slice(0, 20)
        .map((t) => ({
          id: crypto.randomBytes(4).toString("hex"),
          title: String(t.title || "").slice(0, 120),
          status: ["open", "doing", "done"].includes(t.status) ? t.status : "open",
        }))
        .filter((t) => t.title);
      brainWrite(
        "Tasks.md",
        `# Tasks\n\n${state.tasks.map((t) => `- [${t.status === "done" ? "x" : " "}] ${t.title} (${t.status})`).join("\n")}\n`
      );
    }
    // staff agents may have filed while this cycle was thinking; take the
    // live max so two filings never share a number
    let n = Math.max(nextNumber, state.proposals.reduce((a, p) => Math.max(a, p.number || 0), 0) + 1);
    const pushedNow = [];
    for (const p of Array.isArray(out.proposals) ? out.proposals.slice(0, 2) : []) {
      pushedNow.push({
        id: crypto.randomBytes(5).toString("hex"),
        number: n++,
        page: String(p.page || "site").slice(0, 60),
        kind: String(p.kind || "other").slice(0, 20),
        summary: String(p.summary || "").slice(0, 120),
        detail: String(p.detail || "").slice(0, 2400),
        slides: Array.isArray(p.slides)
          ? p.slides.slice(0, 6).map((s) => String(s).slice(0, 480))
          : undefined,
        caption: p.caption ? String(p.caption).slice(0, 900) : undefined,
        brand: p.brand === "korvus" ? "korvus" : p.brand ? "default" : undefined,
        target: ["brand", "korvus", "crown", "eclipse", "lodestone"].includes(p.target) ? p.target : undefined,
        format: p.format === "video" ? "video" : undefined,
        video: p.video ? String(p.video).slice(0, 1200) : undefined,
        status: "pending",
        createdAt: Date.now(),
      });
    }
    state.proposals.push(...pushedNow);
    state.proposals = state.proposals.slice(-60);
    for (const note of Array.isArray(out.brain_notes) ? out.brain_notes.slice(0, 2) : []) {
      const nm = String(note.name || "").replace(/[^a-zA-Z0-9 _-]/g, "").trim();
      if (nm && note.body) brainWrite(`${nm.replace(/\.md$/i, "")}.md`, String(note.body).slice(0, 12000));
    }
    const delegations = Array.isArray(out.delegations) ? out.delegations.slice(0, 2) : [];
    // hand Regent only what THIS cycle pushed; staff filings already went
    if (pushedNow.length && hooks.onFiled) {
      hooks.onFiled(pushedNow).catch((e) => log("error", `Regent intake failed: ${e.message || e}`));
    }

    // daily note in the vault
    const note = [
      `# ${etDayKey()}`,
      ``,
      `Focus: ${state.currentFocus}`,
      ``,
      `## Observations`,
      `- Visits 7d: ${agg.visits7} (prev ${agg.visitsPrev7})`,
      `- Top sources: ${Object.entries(agg.sources7).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k} ${v}`).join(", ") || "none yet"}`,
      `- Clicks: ${Object.entries(agg.clicks7).map(([k, v]) => `${k} ${v}`).join(", ") || "none yet"}`,
      ``,
      `## Thought`,
      state.lastThought,
      ``,
      `See [[Patterns]] and [[Tasks]].`,
    ].join("\n");
    brainWrite(path.join("Log", `${etDayKey()}.md`), note);

    if (out.discord && String(out.discord).trim()) await discordSend(String(out.discord));
    for (const d of delegations) {
      try {
        await runMinion(String(d.minion || "").trim(), String(d.task || "").slice(0, 160), d.context);
      } catch (e) {
        log("error", `Minion ${d.minion} failed: ${e.message || e}`);
      }
    }
    state.lastCycleAt = Date.now();
    state.lastCycleDay = etDayKey();
    state.status = "watching";
    log("cycle", "Cycle finished");
    saveState();
    return { ok: true };
  } catch (e) {
    state.status = "error";
    log("error", `Cycle failed: ${e.message || e}`);
    if (!state.lastErrorPingAt || Date.now() - state.lastErrorPingAt > 6 * 3600 * 1000) {
      state.lastErrorPingAt = Date.now();
      await discordSend(
        `**CORVID // ERROR** cycle failed: ${String(e.message || e).slice(0, 180)}. I will keep retrying on schedule; check Agent HQ if this repeats.`
      ).catch(() => {});
    }
    saveState();
    return { ok: false, error: e.message || "cycle error" };
  } finally {
    busy = false;
  }
}

// ---------------------------------------------------------------------------
// reacting to the owner's channel messages
// ---------------------------------------------------------------------------
// Renders an approved creative through Bloom and delivers the package to the
// channel. The ONLY write action the agent performs, and only after a green
// light. Spends Bloom credits.
async function executeCreative(p) {
  if (!BLOOM_KEY) {
    log("error", `#${p.number} approved but BLOOM_API_KEY is not set, cannot render`);
    await discordSend(
      `**CORVID //** #${p.number} is approved but I cannot render: BLOOM_API_KEY is missing in .env. Add it and tell me to retry.`
    );
    return;
  }
  // budget guard: pause renders when the balance sits at or below the reserve
  const creditsBefore = await bloomCredits(true);
  if (creditsBefore && !creditsBefore.unlimited && creditsBefore.balance <= BLOOM_MIN_RESERVE) {
    log("error", `#${p.number} render paused: Bloom balance ${creditsBefore.balance} is at the ${BLOOM_MIN_RESERVE} credit reserve`);
    await discordSend(
      `**CORVID //** #${p.number} is approved but I paused the render: Bloom balance is ${creditsBefore.balance} credits, at the ${BLOOM_MIN_RESERVE} reserve. Top up or lower BLOOM_MIN_RESERVE, then say retry ${p.number}.`
    );
    return;
  }
  // sales pass: Herald finalizes the caption and hashtags for the post's target
  if (hooks.copyPass) {
    try {
      const polished = await hooks.copyPass({
        target: p.target || (p.brand === "korvus" ? "korvus" : "brand"),
        format: p.format === "video" ? "video" : "slides",
        caption: p.caption || "",
        slides: Array.isArray(p.slides) ? p.slides : [],
      });
      if (polished && polished.caption) {
        let cap = String(polished.caption).slice(0, 600);
        if (Array.isArray(polished.hashtags) && polished.hashtags.length) {
          cap += "\n" + polished.hashtags.slice(0, 5).map((h) => "#" + String(h).replace(/^#+/, "").replace(/\s+/g, "")).join(" ");
        }
        p.caption = cap;
        saveState();
        log("render", `#${p.number} caption and tags finalized by Herald for target ${p.target || "korvus"}`);
      }
    } catch (e) {
      log("error", `Herald copy pass failed, shipping the draft caption: ${e.message || e}`);
    }
  }
  if (p.format === "video") {
    return executeVideo(p);
  }
  const slides = Array.isArray(p.slides) ? p.slides : [];
  if (!slides.length) {
    log("error", `#${p.number} has no slide prompts to render`);
    return;
  }
  log("render", `#${p.number} rendering ${slides.length} slides via Bloom`);
  const brandSessionId = BLOOM_BRANDS[p.brand === "korvus" ? "korvus" : "default"];
  const urls = [];
  for (const prompt of slides) {
    try {
      const gen = await fetch("https://www.trybloom.ai/api/v1/images/generations", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": BLOOM_KEY },
        body: JSON.stringify({
          brandSessionId,
          prompt,
          aspectRatio: "9:16",
          imageSize: "2K",
          model: "pro",
        }),
      });
      const gj = await gen.json();
      const imgId = gj?.data?.ids?.[0];
      if (!gen.ok || !imgId) throw new Error(gj?.error?.message || `generation refused (${gen.status})`);
      const got = await fetch(`https://www.trybloom.ai/api/v1/images/${imgId}?wait=true`, {
        headers: { "x-api-key": BLOOM_KEY },
      });
      const ij = await got.json();
      if (ij?.data?.status === "completed" && ij?.data?.imageUrl) urls.push(ij.data.imageUrl);
      else throw new Error(`slide not completed (${ij?.data?.status || got.status})`);
    } catch (e) {
      log("error", `#${p.number} slide render failed: ${e.message || e}`);
      urls.push(null);
    }
  }
  const good = urls.filter(Boolean);
  p.rendered = good;
  saveState();
  const lines = [
    `**CORVID // DELIVERY** · #${p.number} ${p.page}`,
    `${good.length}/${slides.length} slides rendered, swipe order:`,
    ...good.map((u, i) => `${i + 1}. [slide ${i + 1}](${u})`),
    ``,
    `**CAPTION**`,
    p.caption || "(no caption stored)",
    ``,
    `Post manually. Images by Bloom.`,
  ];
  const after = await bloomCredits(true);
  if (after && !after.unlimited) lines.push(`Bloom balance: ${after.balance} credits.`);
  await discordSend(lines.join("\n"), { image: good[0] });
  log("render", `#${p.number} delivered ${good.length}/${slides.length} slides`);
}

// video track: Bloom's generations API. Model discovered once from the
// catalog (Seedance preferred), overridable with BLOOM_VIDEO_MODEL in .env.
let videoModelCache = { at: 0, id: null };
async function bloomVideoModel() {
  const forced = (process.env.BLOOM_VIDEO_MODEL || "").trim();
  if (forced) return forced;
  if (videoModelCache.id && Date.now() - videoModelCache.at < 12 * 3600 * 1000) return videoModelCache.id;
  const r = await fetch("https://www.trybloom.ai/api/v1/models?type=video&limit=20", {
    headers: { "x-api-key": BLOOM_KEY },
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message || `model catalog refused (${r.status})`);
  const models = (j?.data?.models || []).filter((m) => (m.capabilities || []).includes("text-to-video"));
  const pick = models.find((m) => /seedance/i.test(m.id)) || models[0];
  if (!pick) throw new Error("no text-to-video model available on this Bloom plan");
  videoModelCache = { at: Date.now(), id: pick.id };
  return pick.id;
}

async function executeVideo(p) {
  const prompt = [p.video || "", ...(Array.isArray(p.slides) ? p.slides : [])]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2400);
  if (!prompt) {
    log("error", `#${p.number} has no video direction to render`);
    return;
  }
  const brandSessionId = BLOOM_BRANDS[p.brand === "korvus" ? "korvus" : "default"];
  log("render", `#${p.number} rendering a video via Bloom, this takes minutes`);
  try {
    const model = await bloomVideoModel();
    const start = (input) =>
      fetch("https://www.trybloom.ai/api/v1/generations", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": BLOOM_KEY },
        body: JSON.stringify({ brandSessionId, model, input }),
      });
    let r = await start({ prompt, aspect_ratio: "9:16" });
    let j = await r.json();
    if (r.status === 400) {
      // model schema may not take aspect_ratio; retry with the prompt alone
      r = await start({ prompt });
      j = await r.json();
    }
    const genId = j?.data?.id;
    if (!r.ok || !genId) throw new Error(j?.error?.message || `video generation refused (${r.status})`);
    let final = null;
    for (let i = 0; i < 6; i++) {
      const g = await fetch(`https://www.trybloom.ai/api/v1/generations/${genId}?wait=true&timeout=120`, {
        headers: { "x-api-key": BLOOM_KEY },
      });
      const gj = await g.json();
      const st = gj?.data?.status;
      if (st === "completed") {
        final = gj.data;
        break;
      }
      if (st === "failed") {
        throw new Error(gj?.data?.failure?.message || "video generation failed");
      }
    }
    const url = final?.outputs?.find((o) => o.available && o.url)?.url;
    if (!url) throw new Error("video did not finish within 12 minutes, check Bloom and tell me to retry");
    p.rendered = [url];
    saveState();
    const lines = [
      `**CORVID // DELIVERY** · #${p.number} ${p.page}`,
      `Video ready${p.target ? `, selling ${p.target}` : ""}, player above.`,
      ``,
      `**CAPTION**`,
      p.caption || "(no caption stored)",
      ``,
      `Post manually. Video by Bloom.`,
    ];
    const after = await bloomCredits(true);
    if (after && !after.unlimited) lines.push(`Bloom balance: ${after.balance} credits.`);
    await discordSend(lines.join("\n"), { link: url });
    log("render", `#${p.number} video delivered`);
  } catch (e) {
    log("error", `#${p.number} video render failed: ${e.message || e}`);
    await discordSend(`**CORVID //** #${p.number} video render failed: ${String(e.message || e).slice(0, 240)}. Say retry ${p.number} to run it again.`);
  }
}

export function decideProposal(id, action, note = "", via = "admin") {
  const p = state.proposals.find((x) => x.id === id || String(x.number) === String(id));
  if (!p) return null;
  if (!["approve", "reject", "change"].includes(action)) return null;
  p.status = action === "approve" ? "approved" : action === "reject" ? "rejected" : "changes";
  p.decidedAt = Date.now();
  p.note = String(note || "").slice(0, 400);
  brainAppend(
    "Decisions.md",
    `- ${etDayKey()}: [${p.status.toUpperCase()}] #${p.number} ${p.summary}${p.note ? ` (note: ${p.note})` : ""} (via ${via})`
  );
  log("decision", `#${p.number} ${p.status}${p.note ? `: ${p.note}` : ""}`);
  saveState();
  return p;
}
export function findProposal(id) {
  return (
    state.proposals.find((x) => x.id === id || String(x.number) === String(id)) || null
  );
}
export async function renderCreative(p) {
  return executeCreative(p);
}
export function agentLog(kind, text) {
  log(kind, text);
}
export function retryCreative(id) {
  const p = state.proposals.find((x) => x.id === id || String(x.number) === String(id));
  if (!p || p.kind !== "creative" || p.status !== "approved") return null;
  executeCreative(p).catch((e) => log("error", `render crashed: ${e.message || e}`));
  return p;
}

async function reactToMessages(msgs) {
  const text = msgs.map((m) => `${m.author?.username || "owner"}: ${m.content}`).join("\n");
  state.discord.lastInboundAt = Date.now();
  log("inbound", text.slice(0, 300));
  try {
    const pending = state.proposals.filter((p) => p.status === "pending");
    const user = [
      `Owner message(s):\n${text}`,
      `Current focus: ${state.currentFocus}`,
      `Pending proposals: ${JSON.stringify(
        pending.map((p) => ({ id: p.id, number: p.number, page: p.page, summary: p.summary, detail: p.detail.slice(0, 400) }))
      )}`,
      `Open tasks: ${JSON.stringify(state.tasks.filter((t) => t.status !== "done").map((t) => t.title))}`,
      `Recent log: ${JSON.stringify(state.log.slice(-6).map((l) => l.text))}`,
    ].join("\n\n");
    const out = await think(REACT_SYSTEM, user, 2400);
    for (const d of Array.isArray(out.decisions) ? out.decisions : []) {
      if (hooks.ownerDecision) await hooks.ownerDecision(d.id, d.action, d.note, "discord");
      else decideProposal(d.id, d.action, d.note, "discord");
    }
    for (const t of Array.isArray(out.new_tasks) ? out.new_tasks.slice(0, 5) : []) {
      if (t.title)
        state.tasks.push({
          id: crypto.randomBytes(4).toString("hex"),
          title: String(t.title).slice(0, 120),
          status: "open",
        });
    }
    if (out.focus) state.currentFocus = String(out.focus).slice(0, 200);
    saveState();
    if (out.reply) await discordSend(String(out.reply));
  } catch (e) {
    log("error", `React failed: ${e.message || e}`);
    await discordSend(
      `Hit an error reading that: ${String(e.message || e).slice(0, 140)}. Say it again or check the admin log.`
    );
  }
}

// ---------------------------------------------------------------------------
// scheduler
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// the task engine: awake between cycles, grinding the queue one step at a
// time until it is empty, then silent. Guards: a gap between steps, a daily
// step budget, and tasks blocked on an owner decision are skipped until the
// decision lands, so a self-feeding queue can never become runaway spend.
// ---------------------------------------------------------------------------
const WORK_GAP_MIN = Math.max(2, Number(process.env.AGENT_WORK_GAP_MIN || 5));
const WORK_DAILY_CAP = Math.max(0, Number(process.env.AGENT_WORK_DAILY_CAP || 48));

const WORK_SYSTEM = `${IDENTITY}
${PROPOSAL_RULES}
TASK MODE: between your scheduled cycles you stay awake and advance ONE task at a time. Do the real work of that task right now, not a plan for later.
Output STRICT JSON only:
{
 "thought": "what you did and found, under 80 words",
 "status": "doing|done",
 "proposal": {optional, same shape as a cycle proposal, only when this task's outcome is a change that needs the owner},
 "delegation": {"minion":"scout|scribe|analyst","task":"one focused job","context":"what it needs"} optional,
 "note": {"name":"X.md","body":"full markdown"} optional vault write,
 "blocked_on": optional proposal number this task now waits on,
 "say": "one short line for the channel ONLY when something shipped or broke, otherwise empty"
}
Rules: finish aggressively; a task whose proposal, delegation, or note just went out is done unless it waits on the owner, then set blocked_on and keep status doing. Never re-file a pending proposal. "say" is almost always empty, the daily report covers routine progress. Line breaks as \\n, output must pass JSON.parse, never use em dashes.`;

function pickOpenTask() {
  return state.tasks.find(
    (t) =>
      t.status !== "done" &&
      !(t.wait && state.proposals.some((p) => p.number === t.wait && p.status === "pending"))
  );
}

async function workTick() {
  if (busy || !state.enabled) return;
  const t = pickOpenTask();
  if (!t) return;
  const day = etDayKey();
  if (state.workDay !== day) {
    state.workDay = day;
    state.workSteps = 0;
  }
  if (WORK_DAILY_CAP && (state.workSteps || 0) >= WORK_DAILY_CAP) return;
  if (state.lastWorkAt && Date.now() - state.lastWorkAt < WORK_GAP_MIN * 60000) return;
  if (state.lastCycleAt && Date.now() - state.lastCycleAt < 2 * 60000) return;
  busy = true;
  state.lastWorkAt = Date.now();
  state.workSteps = (state.workSteps || 0) + 1;
  saveState();
  log("work", `advancing: ${t.title}`);
  try {
    const agg = aggregates();
    const pending = state.proposals
      .filter((p) => p.status === "pending")
      .map((p) => ({ number: p.number, summary: p.summary }));
    const user = [
      `THE TASK: ${t.title}`,
      `Current focus: ${state.currentFocus}`,
      `Other open tasks (context only, work THE TASK): ${JSON.stringify(
        state.tasks.filter((x) => x.status !== "done" && x.id !== t.id).map((x) => x.title)
      )}`,
      `ANALYTICS 7d: visits ${agg.visits7} (prev ${agg.visitsPrev7})`,
      `PENDING PROPOSALS (never re-file): ${JSON.stringify(pending)}`,
      `BRAIN Strategy.md (excerpt):\n${brainRead("Strategy.md").slice(0, 1200)}`,
      `BRAIN Playbook.md (excerpt):\n${brainRead("Playbook.md").slice(0, 800)}`,
    ].join("\n\n");
    const out = await think(WORK_SYSTEM, user, 2400);
    if (out.thought) state.lastThought = String(out.thought).slice(0, 800);
    t.status = out.status === "done" ? "done" : "doing";
    if (out.proposal && out.proposal.summary) {
      const filed = fileProposals([out.proposal], AGENT_NAME);
      if (filed.length && t.status !== "done") t.wait = filed[0].number;
    }
    if (out.blocked_on) t.wait = Number(out.blocked_on) || t.wait;
    if (out.note && out.note.name && out.note.body) {
      const nm = String(out.note.name).replace(/[^a-zA-Z0-9 ._-]/g, "").trim();
      if (nm) brainWrite(`${nm.replace(/\.md$/i, "")}.md`, String(out.note.body).slice(0, 12000));
    }
    if (out.delegation && out.delegation.minion) {
      await runMinion(
        String(out.delegation.minion).trim(),
        String(out.delegation.task || t.title).slice(0, 160),
        out.delegation.context
      );
    }
    if (out.say && String(out.say).trim()) {
      await discordSend(`**CORVID //** ${String(out.say).slice(0, 300)}`);
    }
    brainWrite(
      "Tasks.md",
      `# Tasks\n\n${state.tasks.map((x) => `- [${x.status === "done" ? "x" : " "}] ${x.title} (${x.status})`).join("\n")}\n`
    );
    log("work", `step done: ${t.title} -> ${t.status}${t.wait ? `, waiting on #${t.wait}` : ""}`);
    saveState();
  } catch (e) {
    log("error", `work step failed: ${String(e.message || e).slice(0, 200)}`);
  } finally {
    busy = false;
  }
}

export function startAgent() {
  ensureBrain();
  if (state.status === "thinking") state.status = "watching";
  saveState();
  // minute tick: around the clock every N hours, or once daily at the set hour
  setInterval(async () => {
    if (!state.enabled || busy) return;
    // watchman first: react within a minute when something real happens,
    // with a 3 minute cooldown so one event never becomes a paid loop
    try {
      const events = await watchEvents();
      if (
        events.length &&
        Date.now() - lastEventCycleAt > 3 * 60000 &&
        (!state.lastCycleAt || Date.now() - state.lastCycleAt > 2 * 60000)
      ) {
        lastEventCycleAt = Date.now();
        log("watch", `event: ${events.join("; ")}`);
        runCycle(`event: ${events.join("; ")}`).catch(() => {});
        return;
      }
    } catch {
      // watchman is best effort, the schedule below still runs
    }
    if (CYCLE_MS > 0) {
      if (!state.lastCycleAt || Date.now() - state.lastCycleAt >= CYCLE_MS) {
        runCycle("schedule").catch(() => {});
        return;
      }
    } else if (etHour() === CYCLE_HOUR_ET && state.lastCycleDay !== etDayKey()) {
      runCycle("schedule").catch(() => {});
      return;
    }
    // no cycle due: the task engine keeps the agent working the queue
    workTick().catch(() => {});
  }, 60 * 1000);
  // inbound polling
  if (discordMode() === "bot") {
    setInterval(async () => {
      if (!state.enabled || busy) return;
      const msgs = await discordFetchNew();
      if (msgs.length) await reactToMessages(msgs);
    }, POLL_SECONDS * 1000);
  }
  log(
    "boot",
    `${AGENT_NAME} online. Discord: ${discordMode()}. Cadence: ${
      CYCLE_MS > 0
        ? `every ${CYCLE_EVERY_MIN >= 1 ? CYCLE_EVERY_MIN + "min" : CYCLE_EVERY_H + "h"}, around the clock`
        : `daily ${CYCLE_HOUR_ET}:00 ET`
    } Watchman: checking signals every minute, cycles fire instantly on events.`
  );
}

// ---------------------------------------------------------------------------
// admin surface
// ---------------------------------------------------------------------------
export function agentState() {
  return {
    name: AGENT_NAME,
    enabled: state.enabled,
    status: state.enabled ? state.status : "paused",
    discordMode: discordMode(),
    cycleHourEt: CYCLE_HOUR_ET,
    cycleEveryH: CYCLE_EVERY_H,
    cycleEveryMin: CYCLE_EVERY_MIN >= 1 ? CYCLE_EVERY_MIN : 0,
    lastCycleAt: state.lastCycleAt,
    currentFocus: state.currentFocus,
    minionReports: (state.minionReports || []).slice(-6).reverse(),
    lastThought: state.lastThought,
    tasks: state.tasks,
    proposals: state.proposals.slice().reverse().slice(0, 25),
    log: state.log.slice(-40).reverse(),
    discord: state.discord,
  };
}
export function setEnabled(on) {
  state.enabled = Boolean(on);
  state.status = state.enabled ? "watching" : "paused";
  log("control", state.enabled ? "Resumed by owner" : "Paused by owner");
  saveState();
}
export function addTask(title) {
  const t = {
    id: crypto.randomBytes(4).toString("hex"),
    title: String(title || "").slice(0, 120),
    status: "open",
  };
  if (!t.title) return null;
  state.tasks.push(t);
  saveState();
  log("task", `queued: ${t.title}`);
  pokeCycle(`a new task just landed in my queue: ${t.title}`);
  return t;
}
// staff agents (Herald, Steward) file through the same book so Regent reviews
// everything in one pipeline and numbering never collides
export function fileProposals(list, author = "staff") {
  const filed = [];
  let n = state.proposals.reduce((a, p) => Math.max(a, p.number || 0), 0) + 1;
  for (const p of (Array.isArray(list) ? list : []).slice(0, 3)) {
    const rec = {
      id: crypto.randomBytes(5).toString("hex"),
      number: n++,
      author,
      page: String(p.page || "site").slice(0, 60),
      kind: String(p.kind || "other").slice(0, 20),
      summary: String(p.summary || "").slice(0, 120),
      detail: String(p.detail || "").slice(0, 2400),
      slides: Array.isArray(p.slides) ? p.slides.slice(0, 6).map((s) => String(s).slice(0, 480)) : undefined,
      caption: p.caption ? String(p.caption).slice(0, 900) : undefined,
      brand: p.brand === "korvus" ? "korvus" : p.brand ? "default" : undefined,
      target: ["brand", "korvus", "crown", "eclipse", "lodestone"].includes(p.target) ? p.target : undefined,
      format: p.format === "video" ? "video" : undefined,
      video: p.video ? String(p.video).slice(0, 1200) : undefined,
      status: "pending",
      createdAt: Date.now(),
    };
    if (!rec.summary) continue;
    state.proposals.push(rec);
    log("filed", `#${rec.number} from ${author}: ${rec.summary}`);
    filed.push(rec);
  }
  if (filed.length) {
    state.proposals = state.proposals.slice(-60);
    saveState();
    if (hooks.onFiled) {
      hooks.onFiled(filed).catch((e) => log("error", `Regent intake failed: ${e.message || e}`));
    }
  }
  return filed;
}

export async function sendTest() {
  return discordSend(
    `${AGENT_NAME} here. The line to this channel works. Next daily cycle runs at ${CYCLE_HOUR_ET}:00 ET, or hit Run cycle now in the admin.`
  );
}
