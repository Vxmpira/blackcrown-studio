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

async function discordSend(content) {
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
  uptime: () => null, // () => uptime summary
  audit: () => null, // () => runs the audit, returns pages
  revenue: null, // async () => stripe summary or null
  money: null, // () => expense/income month summary
  engine: null, // async () => live TikTok Engine config text or null
};
export function wireFeeds(f) {
  feeds = { ...feeds, ...f };
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

function parseModelJson(text) {
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
  return parseModelJson(text);
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

kinds: "title" and "meta" (site tag rewrites; green light means Regent edits the live file on the server), "content" (page copy; include the exact CURRENT block so Regent can replace it precisely), "automation" (an edit to the TikTok Engine prompt or briefs in Make; CURRENT and NEW are the exact prompt text; green light means the owner pastes NEW into Make), "campaign" (a plan), "creative" (a new TikTok carousel; ALSO include "slides": ["one image prompt per slide, single line, dark premium near black, royal accents, one focal point, text centered, right edge and bottom 15 percent empty, destination small above the bottom fifth"], "caption": "keyword first line, 2-3 short lines, Link in bio plus destination, exactly 4 hashtags", "brand": "korvus" or "default"; green light means Regent renders the slides through Bloom, which spends Bloom credits, and posts the package for the owner to post manually).`;

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
 "proposals": [{"page":"...","kind":"...","summary":"...","detail":"...","slides":["..."],"caption":"...","brand":"korvus"}],
 "discord": "the daily update, exactly in the template"
}
Max 6 tasks. Max 2 new proposals per cycle, only ones worth his time; zero is fine. Never re-propose anything pending or decided. Number new proposals starting at the number given.
When this cycle shows nothing materially new since the last one (flat traffic, no findings, nothing to file), set "discord" to "" and send nothing. You run around the clock; speak only when you have something. Silence beats noise.`;

const REACT_SYSTEM = `${IDENTITY}

${FORMAT_RULES}

The owner wrote in the channel. He may approve or reject by number, ask for a change, ask a question, or hand you a task. Only record decisions he clearly made.

Respond with ONLY one JSON object that passes JSON.parse (line breaks inside strings written as \\n):
{
 "reply": "**CORVID //** then 1-3 short lines",
 "decisions": [{"id":"proposal id","action":"approve|reject|change","note":"his words, short"}],
 "new_tasks": [{"title":"max 7 words"}],
 "focus": "max 8 words, or the same"
}
If he makes a decision, acknowledge in one line that it goes to Regent, who executes and confirms; never state the change as done yourself. On a change request: acknowledge in one line; the reworked version comes in the next cycle.`;

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
      audit = feeds.audit() || [];
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
    const pending = state.proposals.filter((p) => p.status === "pending");
    const nextNumber =
      state.proposals.reduce((a, p) => Math.max(a, p.number || 0), 0) + 1;

    const user = [
      `Today (ET): ${etDayKey()}`,
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

    const out = await think(CYCLE_SYSTEM, user, 2800);

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
    let n = nextNumber;
    for (const p of Array.isArray(out.proposals) ? out.proposals.slice(0, 2) : []) {
      state.proposals.push({
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
        status: "pending",
        createdAt: Date.now(),
      });
    }
    state.proposals = state.proposals.slice(-60);
    const filedNow = state.proposals.filter((p) => p.number >= nextNumber);
    if (filedNow.length && hooks.onFiled) {
      hooks.onFiled(filedNow).catch((e) => log("error", `Regent intake failed: ${e.message || e}`));
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
    state.lastCycleAt = Date.now();
    state.lastCycleDay = etDayKey();
    state.status = "watching";
    log("cycle", "Cycle finished");
    saveState();
    return { ok: true };
  } catch (e) {
    state.status = "error";
    log("error", `Cycle failed: ${e.message || e}`);
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
    ...good.map((u, i) => `${i + 1}. ${u}`),
    ``,
    `**CAPTION**`,
    p.caption || "(no caption stored)",
    ``,
    `Post manually. Images by Bloom.`,
  ];
  await discordSend(lines.join("\n"));
  log("render", `#${p.number} delivered ${good.length}/${slides.length} slides`);
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
    const out = await think(REACT_SYSTEM, user, 1600);
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
export function startAgent() {
  ensureBrain();
  if (state.status === "thinking") state.status = "watching";
  saveState();
  // minute tick: around the clock every N hours, or once daily at the set hour
  setInterval(() => {
    if (!state.enabled || busy) return;
    if (CYCLE_EVERY_H > 0) {
      if (!state.lastCycleAt || Date.now() - state.lastCycleAt >= CYCLE_EVERY_H * 3600 * 1000) {
        runCycle("schedule").catch(() => {});
      }
    } else if (etHour() === CYCLE_HOUR_ET && state.lastCycleDay !== etDayKey()) {
      runCycle("schedule").catch(() => {});
    }
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
      CYCLE_EVERY_H > 0 ? `every ${CYCLE_EVERY_H}h, around the clock` : `daily ${CYCLE_HOUR_ET}:00 ET`
    }.`
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
    lastCycleAt: state.lastCycleAt,
    currentFocus: state.currentFocus,
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
  return t;
}
export async function sendTest() {
  return discordSend(
    `${AGENT_NAME} here. The line to this channel works. Next daily cycle runs at ${CYCLE_HOUR_ET}:00 ET, or hit Run cycle now in the admin.`
  );
}
