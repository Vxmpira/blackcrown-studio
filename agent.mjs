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
const POLL_SECONDS = Math.max(30, Number(process.env.AGENT_POLL_SECONDS || 60));
const MODEL = process.env.AGENT_MODEL || "claude-sonnet-4-6";

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || "").trim();
const CHANNEL_ID = (process.env.DISCORD_SEO_CHANNEL_ID || "").trim();
const WEBHOOK_URL = (process.env.DISCORD_SEO_WEBHOOK || "").trim();

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
let feeds = {
  stats: () => null, // () => parsed studio-stats.json
  uptime: () => null, // () => uptime summary
  audit: () => null, // () => runs the audit, returns pages
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
    return JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("agent returned no JSON");
    return JSON.parse(m[0]);
  }
}

const IDENTITY = `You are ${AGENT_NAME}, the autonomous SEO and growth agent of BlackCrownVxJ LLC. You run every day on the company server. Your owner is Vxmpira.N; you report to him in a private Discord channel and in the admin panel.

THE COMPANY: BlackCrown builds for independent operators. Products: Korvus (korvus.industries, a 24/7 market intelligence terminal for index futures traders, the main revenue product, Observer free tier and Operator paid tier), BlackCrown Intelligence (a private AI workspace), LodeStone (a TradingView indicator sold with Operator), and Eclipse-X (the free Discord community, the top of the funnel). Brand voice: confident, direct, a little defiant, never corporate hype. The signature line: a crown is not handed down, it is built.

YOUR JOB: grow qualified traffic to blackcrownvxj.com and push it toward Korvus signups. You study the first-party analytics, find patterns, keep your markdown brain sharp, and propose concrete moves.

HARD RULES:
- You PROPOSE. You never claim to have changed the site, posted content, or spent money. The owner approves everything.
- Ground every claim in the numbers you are given. If data is thin, say so and propose how to get more.
- Never use em dashes or en dashes anywhere. Use a period or a comma.
- Be concise. The owner reads this on his phone.`;

const CYCLE_SYSTEM = `${IDENTITY}

You are running your daily cycle. You get: this week's analytics, the site audit, uptime, your brain files, open tasks and pending proposals.

Respond with ONLY one JSON object, no markdown fences, in exactly this shape:
{
 "thought": "2-4 sentences: what you see today and why your focus is what it is",
 "focus": "one line, your current focus",
 "patterns_md": "the full new content of Patterns.md: keep what still holds, update confidence, add what the new data shows, drop what died. Use markdown bullets and [[wikilinks]]",
 "tasks": [{"title":"short task","status":"open|doing|done"}],
 "proposals": [{"page":"file or area","kind":"title|meta|content|campaign|other","summary":"one line","detail":"the exact change or plan, ready to approve"}],
 "discord": "the update you post to the owner's channel: what happened, what you learned, then your numbered asks. Number NEW proposals starting at the number given to you. Plain text, short lines."
}
Propose at most 3 new proposals per cycle, only ones worth the owner's time. Do not re-propose anything already pending or decided.`;

const REACT_SYSTEM = `${IDENTITY}

The owner just wrote in your Discord channel. You get his message(s), your pending proposals (with ids and numbers), recent context and your focus. Interpret him naturally: he may approve by number or name, reject, ask for a change, ask a question, or hand you a new task.

Respond with ONLY one JSON object:
{
 "reply": "what you say back in the channel, plain text, short",
 "decisions": [{"id":"proposal id","action":"approve|reject|change","note":"his reasoning or the change he wants"}],
 "new_tasks": [{"title":"short task"}],
 "focus": "updated one-line focus, or the same one"
}
If a proposal is approved and it is a title or meta change, include the exact final tag line(s) in your reply so he can ship them. Only include decisions he clearly made.`;

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
    for (const p of Array.isArray(out.proposals) ? out.proposals.slice(0, 3) : []) {
      state.proposals.push({
        id: crypto.randomBytes(5).toString("hex"),
        number: n++,
        page: String(p.page || "site").slice(0, 60),
        kind: String(p.kind || "other").slice(0, 20),
        summary: String(p.summary || "").slice(0, 160),
        detail: String(p.detail || "").slice(0, 2000),
        status: "pending",
        createdAt: Date.now(),
      });
    }
    state.proposals = state.proposals.slice(-60);

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

    if (out.discord) await discordSend(String(out.discord));
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
      decideProposal(d.id, d.action, d.note, "discord");
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
  // minute tick: daily cycle at the set ET hour
  setInterval(() => {
    if (!state.enabled || busy) return;
    if (etHour() === CYCLE_HOUR_ET && state.lastCycleDay !== etDayKey()) {
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
  log("boot", `${AGENT_NAME} online. Discord: ${discordMode()}. Cycle hour: ${CYCLE_HOUR_ET}:00 ET.`);
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
