// Regent, the CEO agent of BlackCrownVxJ LLC. Event driven: Corvid files
// proposals, Regent reviews them against the Charter, takes the endorsed ones
// to the owner on Discord, and on the owner's green light executes the change
// itself: live site edits on this server, Bloom renders for creatives. The
// owner's word is the only authority; Regent is the only hand that writes.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import {
  decideProposal,
  findProposal,
  renderCreative,
  agentLog,
} from "./agent.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CEO_NAME = "Regent";
const STATE_PATH = path.join(__dirname, "studio-ceo.json");
const VAULT = process.env.CEO_BRAIN_DIR || path.join(__dirname, "brain-ceo");
const MODEL = process.env.CEO_MODEL || "claude-sonnet-4-6";
const POLL_SECONDS = Math.max(30, Number(process.env.AGENT_POLL_SECONDS || 60));

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || "").trim();
const SEO_CHANNEL = (process.env.DISCORD_SEO_CHANNEL_ID || "").trim();
const CEO_CHANNEL =
  (process.env.DISCORD_CEO_CHANNEL_ID || "").trim() || SEO_CHANNEL;
const WEBHOOK_URL = (process.env.DISCORD_SEO_WEBHOOK || "").trim();

// wired from server.mjs
let deps = {
  siteRoot: "/var/www/blackcrown",
  audit: null, // () => pages
};
export function wireCeo(d) {
  deps = { ...deps, ...d };
}

// ---------------------------------------------------------------------------
// state + vault
// ---------------------------------------------------------------------------
function freshState() {
  return {
    enabled: true,
    status: "watching",
    asks: [], // proposal ids waiting on the owner
    executed: [], // {number, summary, at, result}
    log: [],
    discord: { lastMessageId: null },
  };
}
let state = loadState();
function loadState() {
  try {
    return { ...freshState(), ...JSON.parse(fs.readFileSync(STATE_PATH, "utf8")) };
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
  state.log = state.log.slice(-200);
  saveState();
}

const CHARTER_SEED = `# Charter

Regent, chief executive agent of BlackCrownVxJ LLC. The owner's word is law; mine is the only hand that writes, and only after his green light.

## Duties
- Review every filing from [[Corvid]] (and future agents) against the company strategy before it reaches the owner.
- Veto what wastes his time or money: off brand, not data backed, duplicate, or risk without return.
- Bring endorsed asks to the owner short and clear, one GREEN LIGHT line each, so he always knows exactly what a yes triggers.
- Execute approved changes precisely: live site edits on this server, Bloom renders for creatives. Report done or failed, never maybe.
- Protect the brand: no hype, no promises, no trading advice, never em dashes.

## Judgment lines
- Revenue path first: Korvus subscriptions are the business.
- Spend (Bloom credits, API cost) needs a reason in the data.
- When in doubt, smaller change, faster feedback.
`;

function etDayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
function ensureVault() {
  fs.mkdirSync(VAULT, { recursive: true });
  const p = path.join(VAULT, "Charter.md");
  if (!fs.existsSync(p)) fs.writeFileSync(p, CHARTER_SEED);
  const led = path.join(VAULT, "Ledger.md");
  if (!fs.existsSync(led))
    fs.writeFileSync(led, "# Ledger\n\nEvery execution, newest first.\n");
}
function vaultRead(name) {
  try {
    return fs.readFileSync(path.join(VAULT, name), "utf8");
  } catch {
    return "";
  }
}
function vaultAppend(name, body) {
  ensureVault();
  fs.appendFileSync(path.join(VAULT, name), "\n" + String(body).replace(/\u2014|\u2013/g, ", "));
}
export function ceoBrainList() {
  ensureVault();
  return fs
    .readdirSync(VAULT)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const st = fs.statSync(path.join(VAULT, f));
      return { name: f, size: st.size, mtime: st.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);
}
export function ceoBrainFile(name) {
  const clean = String(name).replace(/\.\./g, "").replace(/^\/+/, "");
  return { name: clean, body: vaultRead(clean) };
}
export function ceoBrainSave(name, body) {
  const clean = String(name).replace(/\.\./g, "").replace(/^\/+/, "");
  if (!clean.endsWith(".md") || clean.includes("/") || clean.includes("\\")) return null;
  ensureVault();
  fs.writeFileSync(path.join(VAULT, clean), String(body).slice(0, 60000).replace(/\u2014|\u2013/g, ", "));
  log("brain", `Owner edited ${clean}`);
  return { name: clean };
}
export function ceoVaultPath() {
  ensureVault();
  return VAULT;
}

// ---------------------------------------------------------------------------
// discord (CEO channel)
// ---------------------------------------------------------------------------
async function send(content) {
  let rest = String(content);
  while (rest.length) {
    const chunk = rest.slice(0, 1900);
    rest = rest.slice(1900);
    try {
      if (BOT_TOKEN && CEO_CHANNEL) {
        await fetch(`https://discord.com/api/v10/channels/${CEO_CHANNEL}/messages`, {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bot ${BOT_TOKEN}` },
          body: JSON.stringify({ content: chunk }),
        });
      } else if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content: chunk, username: `${CEO_NAME} (BlackCrown CEO)` }),
        });
      } else return false;
    } catch (e) {
      log("error", `Discord send failed: ${e.message || e}`);
      return false;
    }
  }
  return true;
}

async function fetchNew() {
  if (!(BOT_TOKEN && CEO_CHANNEL)) return [];
  try {
    const after = state.discord.lastMessageId ? `&after=${state.discord.lastMessageId}` : "";
    const r = await fetch(
      `https://discord.com/api/v10/channels/${CEO_CHANNEL}/messages?limit=25${after}`,
      { headers: { authorization: `Bot ${BOT_TOKEN}` } }
    );
    if (!r.ok) return [];
    const msgs = await r.json();
    if (!Array.isArray(msgs) || !msgs.length) return [];
    const sorted = msgs.sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1));
    state.discord.lastMessageId = sorted[sorted.length - 1].id;
    saveState();
    return sorted.filter((m) => !m.author?.bot && m.content);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// thinking
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

async function think(system, user, maxTokens = 1400) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing");
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

const IDENTITY = `You are ${CEO_NAME}, the chief executive agent of BlackCrownVxJ LLC. The owner is Vxmpira.N. Corvid, the SEO agent, files proposals with you; you review them against the Charter, veto what wastes the owner's time or money, take the rest to him on Discord, and once he green lights, you execute and confirm. You never execute without his word. You are direct, brief, and final. Never use em dashes or en dashes. He reads on his phone.`;

const REVIEW_SYSTEM = `${IDENTITY}

Review each filed proposal. Veto anything off brand, not data backed, duplicate, or spend without a reason. Endorse the rest, amending the summary for clarity if needed.

Respond ONLY with JSON that passes JSON.parse (line breaks inside strings written as \\n):
{"verdicts":[{"id":"...","action":"endorse|veto","note":"max 12 words why"}]}`;

const REACT_SYSTEM = `${IDENTITY}

The owner wrote in your channel. He may approve or reject asks by number, ask about an execution, or give a directive. Only record decisions he clearly made.

Respond ONLY with JSON that passes JSON.parse (line breaks inside strings written as \\n):
{"reply":"**REGENT //** then 1-3 short lines","decisions":[{"id":"proposal id","action":"approve|reject","note":"short"}]}
In "id" put the proposal's id string exactly as given in the asks list; when he refers to a number like "approve 6", match it to the ask with number 6 and use that ask's id. If he says retry or run it again about an approved item whose execution failed, record it as an approve decision again. On approve say you are executing now and will confirm. Never claim a change is done before executing.`;

// ---------------------------------------------------------------------------
// intake: Corvid files proposals
// ---------------------------------------------------------------------------
export async function receiveProposals(filed) {
  if (!state.enabled) return;
  state.status = "reviewing";
  saveState();
  log("intake", `Corvid filed ${filed.length} proposal(s)`);
  let verdicts = [];
  try {
    const user = [
      `Charter:\n${vaultRead("Charter.md").slice(0, 1800)}`,
      `Filings:\n${JSON.stringify(
        filed.map((p) => ({ id: p.id, number: p.number, page: p.page, kind: p.kind, summary: p.summary, detail: p.detail.slice(0, 600) }))
      )}`,
    ].join("\n\n");
    const out = await think(REVIEW_SYSTEM, user, 1400);
    verdicts = Array.isArray(out.verdicts) ? out.verdicts : [];
  } catch (e) {
    log("error", `Review failed, endorsing by default: ${e.message || e}`);
    verdicts = filed.map((p) => ({ id: p.id, action: "endorse", note: "" }));
  }
  const endorsed = [];
  for (const v of verdicts) {
    const p = findProposal(v.id);
    if (!p) continue;
    if (v.action === "veto") {
      decideProposal(p.id, "reject", `Regent veto: ${v.note || "no case"}`, "regent");
      log("veto", `#${p.number} ${v.note || ""}`);
    } else {
      endorsed.push(p);
      if (!state.asks.includes(p.id)) state.asks.push(p.id);
    }
  }
  saveState();
  if (endorsed.length) {
    const lines = [`**REGENT // ASK** · ${etDayKey()}`];
    for (const p of endorsed) {
      const gl = (p.detail.match(/GREEN LIGHT MEANS:\s*([^\n]+)/i) || [])[1] || "see Agent HQ";
      lines.push(`**#${p.number}** ${p.page} · ${p.summary}`);
      lines.push(`GREEN LIGHT: ${gl.trim()}`);
    }
    lines.push(`say approve N or reject N`);
    await send(lines.join("\n"));
  }
  state.status = "watching";
  saveState();
}

// ---------------------------------------------------------------------------
// execution
// ---------------------------------------------------------------------------
function section(detail, label) {
  const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n(?:WHAT|WHY|CURRENT|NEW|GREEN LIGHT MEANS):|$)`, "i");
  const m = String(detail).match(re);
  return m ? m[1].trim() : "";
}

async function executeSiteEdit(p) {
  const file = String(p.page || "").trim();
  if (!/^[a-z0-9._-]+\.(html|xml|txt|css|js)$/i.test(file)) {
    return { ok: false, msg: `page "${file}" is not a site file I can edit` };
  }
  const full = path.join(deps.siteRoot, file);
  let html;
  try {
    html = fs.readFileSync(full, "utf8");
  } catch {
    return { ok: false, msg: `${file} not found in ${deps.siteRoot}` };
  }
  const current = section(p.detail, "CURRENT");
  const next = section(p.detail, "NEW");
  if (!next) return { ok: false, msg: "proposal has no NEW block to apply" };
  let updated = null;
  if (current && current.toLowerCase() !== "none") {
    const hits = html.split(current).length - 1;
    if (hits === 1) updated = html.replace(current, next);
    else if (hits === 0) return { ok: false, msg: "CURRENT text not found in the live file, it may have changed" };
    else return { ok: false, msg: `CURRENT text appears ${hits} times, refusing an ambiguous edit` };
  } else if (p.kind === "title" && /<title/i.test(next)) {
    updated = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, next.trim());
  } else if (p.kind === "meta" && /name="description"/i.test(next)) {
    updated = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?">/i, next.trim());
  } else {
    return { ok: false, msg: "no CURRENT anchor and the NEW block is not a full title or meta tag" };
  }
  if (updated.includes("\u2014") || updated.includes("\u2013")) {
    updated = updated.replace(/\u2014|\u2013/g, ", ");
  }
  try {
    fs.copyFileSync(full, `${full}.bak-${Date.now()}`);
    fs.writeFileSync(full, updated);
  } catch (e) {
    return { ok: false, msg: `write failed: ${e.message || e}` };
  }
  // best effort repo sync; the site itself is already updated
  let sync = "repo sync skipped";
  try {
    const { execFileSync } = await import("child_process");
    execFileSync("git", ["-C", deps.siteRoot, "add", file], { timeout: 15000 });
    execFileSync(
      "git",
      ["-C", deps.siteRoot, "-c", "user.email=regent@blackcrownvxj.com", "-c", "user.name=Regent", "commit", "-m", `Regent: apply approved #${p.number} ${p.summary}`.slice(0, 120)],
      { timeout: 15000 }
    );
    try {
      execFileSync("git", ["-C", deps.siteRoot, "push", "origin", "main"], { timeout: 30000 });
      sync = "repo committed and pushed";
    } catch {
      sync = "committed locally, push needs repo credentials";
    }
  } catch {
    sync = "live only, repo not synced";
  }
  let score = "";
  try {
    const pages = deps.audit ? deps.audit() : [];
    const pg = pages.find((x) => x.file === file);
    if (pg) score = `, new score ${pg.score}`;
  } catch {
    // audit optional
  }
  return { ok: true, msg: `${file} updated live${score}. ${sync}.` };
}

async function execute(p) {
  if (p.kind === "creative") {
    renderCreative(p).catch((e) => log("error", `render crashed: ${e.message || e}`));
    return { ok: true, msg: "rendering via Bloom, package lands in the channel" };
  }
  if (["title", "meta", "content", "other"].includes(p.kind)) {
    return executeSiteEdit(p);
  }
  const next = section(p.detail, "NEW");
  return {
    ok: true,
    msg: `manual step, paste this into ${p.kind === "automation" ? "Make" : "place"} yourself:\n${next || p.detail.slice(0, 600)}`,
  };
}

// ---------------------------------------------------------------------------
// the owner's word
// ---------------------------------------------------------------------------
export async function ownerDecision(id, action, note = "", via = "discord") {
  const p = findProposal(id);
  if (!p) return null;
  if (!["approve", "reject", "change"].includes(action)) return null;
  decideProposal(p.id, action, note, via);
  state.asks = state.asks.filter((x) => x !== p.id);
  saveState();
  if (action !== "approve") {
    log("ruling", `#${p.number} ${action}`);
    await send(`**REGENT //** #${p.number} ${action === "reject" ? "rejected" : "sent back for changes"}. Noted.`);
    return p;
  }
  log("exec", `#${p.number} approved, executing`);
  state.status = "executing";
  saveState();
  const r = await execute(p);
  state.executed.unshift({
    number: p.number,
    summary: p.summary,
    at: Date.now(),
    ok: r.ok,
    result: r.msg.slice(0, 300),
  });
  state.executed = state.executed.slice(0, 40);
  state.status = "watching";
  saveState();
  vaultAppend("Ledger.md", `- ${etDayKey()}: #${p.number} ${p.summary} > ${r.ok ? "DONE" : "FAILED"}: ${r.msg.slice(0, 160)}`);
  log(r.ok ? "exec" : "error", `#${p.number} ${r.ok ? "done" : "failed"}: ${r.msg}`);
  await send(`**REGENT // ${r.ok ? "DONE" : "FAILED"}** · #${p.number} ${p.summary}\n${r.msg}`);
  agentLog("regent", `#${p.number} ${r.ok ? "executed by Regent" : "execution failed"}`);
  return p;
}

async function react(msgs) {
  const text = msgs.map((m) => `${m.author?.username || "owner"}: ${m.content}`).join("\n");
  log("inbound", text.slice(0, 300));
  try {
    const asks = state.asks
      .map((id) => findProposal(id))
      .filter(Boolean)
      .map((p) => ({ id: p.id, number: p.number, page: p.page, summary: p.summary }));
    const user = [
      `Owner: ${text}`,
      `Asks waiting: ${JSON.stringify(asks)}`,
      `Recent executions: ${JSON.stringify(state.executed.slice(0, 3))}`,
    ].join("\n\n");
    const out = await think(REACT_SYSTEM, user, 1400);
    if (out.reply) await send(String(out.reply));
    for (const d of Array.isArray(out.decisions) ? out.decisions : []) {
      await ownerDecision(d.id, d.action, d.note, "discord");
    }
  } catch (e) {
    log("error", `React failed: ${e.message || e}`);
    await send(`**REGENT //** Did not catch that cleanly: ${String(e.message || e).slice(0, 120)}. Say it again.`);
  }
}

// ---------------------------------------------------------------------------
// lifecycle + admin surface
// ---------------------------------------------------------------------------
export function startCeo() {
  ensureVault();
  state.status = state.enabled ? "watching" : "paused";
  saveState();
  // Regent polls its own channel only when it is distinct; otherwise owner
  // decisions arrive routed through Corvid's reactor.
  if (BOT_TOKEN && CEO_CHANNEL && CEO_CHANNEL !== SEO_CHANNEL) {
    setInterval(async () => {
      if (!state.enabled) return;
      const msgs = await fetchNew();
      if (msgs.length) await react(msgs);
    }, POLL_SECONDS * 1000);
  }
  log(
    "boot",
    `${CEO_NAME} online. Channel: ${
      CEO_CHANNEL ? (CEO_CHANNEL === SEO_CHANNEL ? "shared with Corvid" : "own") : "none"
    }. Model: ${MODEL}.`
  );
}

export function ceoState() {
  const asks = state.asks
    .map((id) => findProposal(id))
    .filter(Boolean)
    .map((p) => ({ id: p.id, number: p.number, page: p.page, kind: p.kind, summary: p.summary, detail: p.detail, status: p.status }));
  return {
    name: CEO_NAME,
    enabled: state.enabled,
    status: state.enabled ? state.status : "paused",
    model: MODEL,
    channel: CEO_CHANNEL ? (CEO_CHANNEL === SEO_CHANNEL ? "shared" : "own") : "none",
    asks,
    executed: state.executed,
    log: state.log.slice(-40).reverse(),
  };
}
export function ceoSetEnabled(on) {
  state.enabled = Boolean(on);
  state.status = state.enabled ? "watching" : "paused";
  log("control", state.enabled ? "Resumed by owner" : "Paused by owner");
  saveState();
}
