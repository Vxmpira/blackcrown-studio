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
  brainFile,
  brainSave,
  addTask,
  buildEmbeds,
  recordSpend,
  agentState,
  spendSummary,
  institutionBlock,
} from "./agent.mjs";
import { staffStates } from "./staff.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CEO_NAME = "Regent";
const STATE_PATH = path.join(__dirname, "studio-ceo.json");
const VAULT = process.env.CEO_BRAIN_DIR || path.join(__dirname, "brain-ceo");
const MODEL = process.env.CEO_MODEL || "claude-fable-5";
const POLL_SECONDS = Math.max(30, Number(process.env.AGENT_POLL_SECONDS || 60));
const INITIATIVE_EVERY_H = Math.max(2, Number(process.env.CEO_CYCLE_EVERY_H || 6));

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || "").trim();
const SEO_CHANNEL = (process.env.DISCORD_SEO_CHANNEL_ID || "").trim();
const CEO_CHANNEL =
  (process.env.DISCORD_CEO_CHANNEL_ID || "").trim() || SEO_CHANNEL;
const WEBHOOK_URL = (process.env.DISCORD_SEO_WEBHOOK || "").trim();

// Repos Regent may edit, as name:path pairs. "site" is the brand site and
// always exists; add korvus and crown clones on this box to put those
// products in reach. Their boxes auto-pull what Regent pushes.
export const REPO_ROOTS = Object.fromEntries(
  (process.env.CEO_REPO_ROOTS ||
    "site:/var/www/blackcrown,korvus:/home/ubuntu/fleet/korvus-engine,crown:/home/ubuntu/fleet/crown")
    .split(",")
    .map((pair) => {
      const i = pair.indexOf(":");
      return [pair.slice(0, i).trim(), pair.slice(i + 1).trim()];
    })
    .filter(([k, v]) => k && v)
);

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
    try {
      const s = JSON.parse(fs.readFileSync(STATE_PATH + ".snap", "utf8"));
      console.log("regent state restored from snapshot");
      return { ...freshState(), ...s };
    } catch {
      return freshState();
    }
  }
}
let ceoSnapAt = 0;
function saveState() {
  try {
    if (Date.now() - ceoSnapAt > 3600000) {
      ceoSnapAt = Date.now();
      try { fs.writeFileSync(STATE_PATH + ".snap", JSON.stringify(state)); } catch {}
    }
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
  const payload = { content: "", embeds: buildEmbeds(content, 0xf2c94c, "Regent, CEO") };
  try {
    if (BOT_TOKEN && CEO_CHANNEL) {
      const r = await fetch(`https://discord.com/api/v10/channels/${CEO_CHANNEL}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bot ${BOT_TOKEN}` },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`discord ${r.status}`);
      return true;
    } else if (WEBHOOK_URL) {
      const r = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, username: `${CEO_NAME} (BlackCrown CEO)` }),
      });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      return true;
    }
    return false;
  } catch (e) {
    log("error", `Discord embed send failed (${e.message || e}), falling back to plain text`);
  }
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
    } catch (e2) {
      log("error", `Discord send failed: ${e2.message || e2}`);
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
  system = system + institutionBlock();
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
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!r.ok) throw new Error(`Anthropic (${r.status})`);
  const data = await r.json();
  recordSpend("regent", MODEL, data.usage);
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

The owner wrote in your channel. He may approve or reject asks by number, ask about an execution, ask how the agents are doing, or give a directive. Only record decisions he clearly made.
Answer status and progress questions from the LIVE DESK STATUS data: each desk's state, open and done task counts, current focus, and today's token spend. A rejected or closed ask is finished business, never call it active or pending. A note starting "preflight:" means the ask BOUNCED before the owner ever saw it; bounced asks cannot be retried, the fix already sits on the filing desk as a task, say so when asked. If the data does not cover what he asked, say what you do not have instead of guessing.

Respond ONLY with JSON that passes JSON.parse (line breaks inside strings written as \\n):
{"reply":"**REGENT //** then 1-3 short lines","decisions":[{"id":"proposal id","action":"approve|reject","note":"short"}]}
A proposal page like "korvus:path/file.js" or "crown:path/file" targets that product's repo; its box deploys the push within a minute. In "id" put the proposal's id string exactly as given in the asks list; when he refers to a number like "approve 6", match it to the ask with number 6 and use that ask's id. If he says retry or run it again about an approved item whose execution failed, record it as an approve decision again. On approve say you are executing now and will confirm. Never claim a change is done before executing.`;

// ---------------------------------------------------------------------------
// intake: Corvid files proposals
// ---------------------------------------------------------------------------
// preflight: a filing that would predictably fail never reaches the owner.
// It bounces straight back to the desk that filed it, with the reason.
function preflightProposal(p) {
  try {
    const kind = String(p.kind || "").toLowerCase();
    const detail = String(p.detail || "");
    const page = String(p.page || "");
    const cur = String(section(detail, "CURRENT") || "").trim();
    const isNew = /^\(new file\)$/i.test(cur);
    const plat = (detail.match(/PLATFORM:\s*(\S+)/i) || [])[1];
    if (kind === "post" || plat) {
      if (!plat) return "post asks need a PLATFORM line";
      if (plat.toLowerCase() !== "youtube") return `platform ${plat} is not wired; youtube is the only wired platform`;
      const media = (detail.match(/MEDIA:\s*(\S+)/i) || [])[1];
      if (!media || !/^https?:\/\//i.test(media)) return "MEDIA must be the full https url of the rendered file";
      return null;
    }
    if (kind === "job" || /SCHEDULE:/i.test(detail)) {
      if (!/SCHEDULE:/i.test(detail)) return "job asks need a SCHEDULE line";
      if (!/CHANNEL:/i.test(detail)) return "job asks need a CHANNEL line";
      try {
        const names = deps.jobNames ? deps.jobNames() : [];
        const mine = String(p.summary || "").toLowerCase();
        for (const n of names) {
          if (n && (mine.includes(n.toLowerCase()) || n.toLowerCase().includes(mine))) {
            return `a server job named "${n}" already covers this; never register duplicates`;
          }
        }
      } catch {}
      return null;
    }
    if (kind === "brain" || kind === "creative" || kind === "automation" || /^make(:|$)/i.test(page)) return null;
    if (!page) return null;
    const loc = resolveSiteFile(page);
    if (loc.err) return loc.err;
    const exists = fs.existsSync(loc.full);
    if (!exists && !isNew) {
      return `${loc.file} does not exist in that repo; target a page the audit lists, or create one with CURRENT exactly (new file)`;
    }
    if (isNew) {
      let body = String(section(detail, "NEW") || "");
      const fromNote = body.trim().match(/^FROM NOTE:\s*(.+)$/i);
      if (fromNote) {
        try {
          body = String((brainFile(fromNote[1].trim()) || {}).body || "");
        } catch {
          body = "";
        }
        if (!body.trim()) return `vault note ${fromNote[1].trim()} is empty or missing; have the minion write the full page first`;
        body = body.replace(/^```(html)?\s*/i, "").replace(/```\s*$/i, "");
        const doc = body.match(/<!doctype html>[\s\S]*<\/html>/i);
        if (doc) body = doc[0];
      }
      if (/\.html?$/i.test(loc.file)) {
        const b = body.trim();
        const hasDoc = /^<!doctype html>/i.test(b);
        const hasClose = /<\/html>\s*$/i.test(b);
        if (hasDoc && !hasClose) {
          return "the page is TRUNCATED: it starts correctly but cuts off before </html>. The minion ran out of room; have it rewrite the page shorter and simpler so the whole document finishes";
        }
        if (!hasDoc || !hasClose || !/<title>[^<]{3,}<\/title>/i.test(b) || !/<\/head>/i.test(b)) {
          return "the page is not a complete html document (doctype through closing html tag with head and title); finish it in the vault before filing";
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function receiveProposals(filed) {
  if (!state.enabled) return;
  // bounce the predictable failures back to their desks before review
  const bounced = [];
  filed = filed.filter((p) => {
    const why = preflightProposal(p);
    if (!why) return true;
    bounced.push({ p, why });
    return false;
  });
  for (const { p, why } of bounced) {
    try {
      decideProposal(p.id, "reject", `preflight: ${why}`, "preflight");
      log("ruling", `#${p.number} bounced in preflight: ${why}`);
      if (deps.assignFix) deps.assignFix(p.author || "Corvid", `Refile #${p.number} correctly: ${why}`.slice(0, 180));
      await send(`**REGENT // BOUNCED** · #${p.number} ${p.summary}\nNever reached the owner: ${why}. Fix it and refile; this is on your desk, not his.`);
    } catch {}
  }
  if (!filed.length) {
    state.status = "watching";
    saveState();
    return;
  }
  state.status = "reviewing";
  saveState();
  log("intake", `Corvid filed ${filed.length} proposal(s)`);
  let verdicts = [];
  try {
    const user = [
      `Charter:\n${vaultRead("Charter.md").slice(0, 1800)}`,
      `Company strategy (Corvid's vault):\n${brainFile("Strategy.md").body.slice(0, 1600)}`,
      `What the data says (Patterns):\n${brainFile("Patterns.md").body.slice(0, 1000)}`,
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
    for (const p of endorsed) {
      await sendAskCard(p);
    }
  }
  state.status = "watching";
  saveState();
}

// one card per ask, check and X pre-attached: a reaction is a ruling
const OWNER_ID = (process.env.DISCORD_OWNER_ID || "").trim();
async function sendAskCard(p) {
  const gl = ((p.detail.match(/GREEN LIGHT MEANS:\s*([^\n]+)/i) || [])[1] || "see Agent HQ").trim();
  const content = [
    `**REGENT // ASK** · #${p.number} · ${etDayKey()}`,
    `${p.page} · ${p.summary}${p.author && p.author !== "Corvid" ? `  (filed by ${p.author})` : ""}`,
    `**GREEN LIGHT MEANS**`,
    gl,
    `**YOUR MOVE**`,
    `React with the check to approve or the X to reject. Words work too: approve ${p.number}.`,
  ].join("\n");
  if (!(BOT_TOKEN && CEO_CHANNEL)) {
    await send(content);
    return;
  }
  // one approval desk: every ask lands in the boardroom only, so rulings
  // never split across channels (owner's call, 2026-10-26)
  const channels = [CEO_CHANNEL];
  let posted = 0;
  for (const ch of channels) {
    try {
      const r = await fetch(`https://discord.com/api/v10/channels/${ch}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bot ${BOT_TOKEN}` },
        body: JSON.stringify({ content: "", embeds: buildEmbeds(content, 0xf2c94c, "Regent, CEO") }),
      });
      const j = await r.json().catch(() => null);
      if (!r.ok || !j?.id) continue;
      posted++;
      for (const emoji of ["✅", "❌"]) {
        await fetch(
          `https://discord.com/api/v10/channels/${ch}/messages/${j.id}/reactions/${encodeURIComponent(emoji)}/@me`,
          { method: "PUT", headers: { authorization: `Bot ${BOT_TOKEN}` } }
        ).catch(() => {});
      }
      state.askMsgs = (state.askMsgs || []).slice(-30);
      state.askMsgs.push({ msgId: j.id, pid: p.id, number: p.number, ch });
      saveState();
    } catch (e) {
      log("error", `ask card failed in a channel (${e.message || e})`);
    }
  }
  if (!posted) await send(content);
}

async function checkAskReactions() {
  if (!(BOT_TOKEN && CEO_CHANNEL)) return;
  const live = (state.askMsgs || []).filter((x) => {
    const p = findProposal(x.pid);
    return p && p.status === "pending";
  });
  state.askMsgs = live;
  for (const x of live) {
    for (const [emoji, action] of [
      ["✅", "approve"],
      ["❌", "reject"],
    ]) {
      try {
        const r = await fetch(
          `https://discord.com/api/v10/channels/${x.ch || CEO_CHANNEL}/messages/${x.msgId}/reactions/${encodeURIComponent(emoji)}?limit=10`,
          { headers: { authorization: `Bot ${BOT_TOKEN}` } }
        );
        if (!r.ok) continue;
        const users = await r.json();
        const human = Array.isArray(users) && users.find((u) => !u.bot && (!OWNER_ID || u.id === OWNER_ID));
        if (human) {
          log("ruling", `#${x.number} ${action} via reaction`);
          await ownerDecision(x.pid, action, "", "reaction");
          break;
        }
      } catch {
        // next poll catches it
      }
    }
  }
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

function resolveSiteFile(page) {
  let file = String(page || "").trim();
  // "korvus:engine/feed.js" or "crown:server/config.json" routes to that repo;
  // a bare file name means the brand site.
  let rootKey = "site";
  const ci = file.indexOf(":");
  if (ci > 0) {
    const maybe = file.slice(0, ci);
    if (REPO_ROOTS[maybe]) {
      rootKey = maybe;
      file = file.slice(ci + 1).trim();
    }
  }
  const rootDir = rootKey === "site" ? deps.siteRoot : REPO_ROOTS[rootKey];
  if (!rootDir || !fs.existsSync(rootDir)) {
    return { err: `repo "${rootKey}" is not set up on this server yet` };
  }
  if (
    !/^[a-z0-9._\/-]+\.(html|xml|txt|css|js|mjs|cjs|ts|tsx|jsx|json|md|py|yml|yaml|conf|sh)$/i.test(file) ||
    file.includes("..") ||
    file.startsWith("/") ||
    /(^|\/)\.env/i.test(file)
  ) {
    return { err: `"${file}" is not a file I can edit` };
  }
  return { rootKey, file, rootDir, full: path.join(rootDir, file) };
}

// the safety guard: refuse to write a result that would break the file
async function validateEdit(file, before, after) {
  if (!after || !after.trim()) return "the result would leave the file empty";
  const ext = ((file.match(/\.([a-z0-9]+)$/i) || [])[1] || "").toLowerCase();
  const count = (s, re) => (s.match(re) || []).length;
  if (ext === "html" || ext === "htm") {
    const dupIds = (s) => {
      const seen = {};
      const d = new Set();
      for (const m of s.matchAll(/\bid\s*=\s*["']([^"']+)["']/g)) {
        if (seen[m[1]]) d.add(m[1]);
        seen[m[1]] = 1;
      }
      return d;
    };
    const beforeDup = dupIds(before);
    for (const id of dupIds(after)) {
      if (!beforeDup.has(id)) return `the edit would create a duplicate id "${id}", that section already exists on the page`;
    }
    if (count(after, /<[^>]+>\s*$/) && /<\/body>[\s\S]*<section/i.test(after) && !/<\/body>[\s\S]*<section/i.test(before)) {
      return "the edit would place a section after the closing body tag";
    }
  }
  if (ext === "json") {
    try {
      JSON.parse(after);
    } catch (e) {
      return `the result is not valid JSON (${e.message})`;
    }
  }
  if (ext === "xml") {
    if (count(after, /<url>/gi) !== count(after, /<\/url>/gi)) return "unbalanced url tags in the result";
    if (/<\/urlset>/i.test(before) && !/<\/urlset>/i.test(after)) return "the result lost the closing urlset tag";
  }
  if (ext === "html" || ext === "htm") {
    for (const tag of ["</head>", "</body>", "</html>", "</title>"]) {
      if (before.includes(tag) && !after.includes(tag)) return `the result lost ${tag}`;
    }
    if (count(after, /<title\b/gi) > Math.max(1, count(before, /<title\b/gi))) return "the result duplicated the title tag";
    if (count(after, /<head\b/gi) > count(before, /<head\b/gi)) return "the result duplicated the head tag";
  }
  if (["js", "mjs", "cjs"].includes(ext)) {
    try {
      const { execFileSync } = await import("child_process");
      const os = await import("os");
      const tmp = path.join(os.tmpdir(), `regent-check-${Date.now()}.${ext}`);
      fs.writeFileSync(tmp, after);
      try {
        execFileSync(process.execPath, ["--check", tmp], { timeout: 10000, stdio: ["ignore", "ignore", "pipe"] });
      } finally {
        try { fs.unlinkSync(tmp); } catch { /* best effort */ }
      }
    } catch (e) {
      const err = (e.stderr ? String(e.stderr) : String(e.message || e)).split("\n").slice(0, 3).join(" ");
      return `the result fails a JavaScript syntax check: ${err.slice(0, 220)}`;
    }
  }
  return null;
}

async function executeSiteEdit(p) {
  const loc = resolveSiteFile(p.page);
  if (loc.err) return { ok: false, msg: loc.err };
  const { rootKey, file, rootDir, full } = loc;
  // fresh eyes first: fleet clones go stale whenever work ships from elsewhere
  try {
    const { execFileSync } = await import("child_process");
    execFileSync("git", ["-C", rootDir, "pull", "--rebase", "--autostash", "origin", "main"], { timeout: 20000 });
  } catch {}
  let html;
  let creating = false;
  let createBody = "";
  try {
    html = fs.readFileSync(full, "utf8");
  } catch {
    const curNF = String(section(p.detail, "CURRENT") || "").trim().toLowerCase();
    let body = String(section(p.detail, "NEW") || "");
    const fromNote = body.trim().match(/^FROM NOTE:\s*(.+)$/i);
    if (fromNote) {
      try {
        body = String((brainFile(fromNote[1].trim()) || {}).body || "");
      } catch {
        body = "";
      }
      if (!body.trim()) {
        return { ok: false, msg: `vault note ${fromNote[1].trim()} is empty or missing; have the minion write the full page there first` };
      }
      body = body.replace(/^```(html)?\s*/i, "").replace(/```\s*$/i, "");
      const doc = body.match(/<!doctype html>[\s\S]*<\/html>/i);
      if (doc) body = doc[0];
    }
    if (curNF !== "(new file)" || !body.trim()) {
      return { ok: false, msg: `${file} not found in ${rootDir}. To create a brand new page, set CURRENT to exactly (new file) and NEW to the complete document` };
    }
    if (rootKey === "korvus" && !/^pages\/[a-z0-9][a-z0-9-]{0,60}\.html$/.test(file)) {
      return { ok: false, msg: "new korvus pages only serve from the pages folder: use page korvus:pages/<name>.html (lowercase, digits, hyphens) and it goes live at /p/<name>" };
    }
    if (!/^[\w][\w./-]*$/.test(file) || file.includes("..")) {
      return { ok: false, msg: "refusing that path for a new file" };
    }
    if (/\.html?$/i.test(file)) {
      const b = body.trim();
      if (!/^<!doctype html>/i.test(b) || !/<\/html>\s*$/i.test(b) || !/<title>[^<]{3,}<\/title>/i.test(b) || !/<\/head>/i.test(b) || !/<meta\s+name="viewport"/i.test(b)) {
        return { ok: false, msg: "new page rejected: NEW must be one complete html document with doctype, head, title, viewport meta and a closing html tag" };
      }
    }
    html = "";
    creating = true;
    createBody = body;
  }
  const current = section(p.detail, "CURRENT");
  const next = section(p.detail, "NEW");
  if (!next) return { ok: false, msg: "proposal has no NEW block to apply" };
  let updated = null;
  let how = "";
  if (creating) {
    updated = (createBody || next).trim() + "\n";
    how = "new page created";
  }
  if (/sitemap\.xml$/i.test(file) && /<\/urlset>/i.test(html) && /<url>/i.test(next)) {
    // sitemap append: insert only the <url> blocks whose <loc> is not already listed
    const blocks = next.match(/<url>[\s\S]*?<\/url>/gi) || [];
    const fresh = blocks.filter((b) => {
      const loc = (b.match(/<loc>([^<]+)<\/loc>/i) || [])[1];
      return loc && !html.includes(`<loc>${loc}</loc>`);
    });
    if (fresh.length) {
      updated = html.replace(/<\/urlset>/i, `  ${fresh.join("\n  ")}\n</urlset>`);
      how = `appended ${fresh.length} new entr${fresh.length === 1 ? "y" : "ies"}`;
    } else {
      return { ok: true, msg: `${file} already lists every entry, nothing to add` };
    }
  }
  if (updated === null && /\.html?$/i.test(file) && /<\/head>/i.test(html)) {
    // head upsert: a NEW block that is nothing but meta and link tags gets merged
    // into the head. Each tag replaces its existing counterpart (same rel, property,
    // or name) or is inserted before </head>. Runs before the CURRENT match so a
    // guessed anchor can never eat the closing tag.
    const titleTag = ((next.match(/<title[^>]*>[\s\S]*?<\/title>/i) || [])[0] || "").trim();
    const rest = titleTag ? next.replace(/<title[^>]*>[\s\S]*?<\/title>/i, "") : next;
    const tags = rest.match(/<(?:meta|link)\b[^>]*>/gi) || [];
    const leftover = rest
      .replace(/<(?:meta|link)\b[^>]*>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();
    if ((tags.length || titleTag) && !leftover) {
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      let out = html;
      const inserts = [];
      let swapped = 0;
      for (const raw of tags) {
        const t = raw.trim();
        const rel = /^<link/i.test(t) && t.match(/\brel\s*=\s*["']([^"']+)["']/i);
        const prop = t.match(/\bproperty\s*=\s*["']([^"']+)["']/i);
        const nm = t.match(/\bname\s*=\s*["']([^"']+)["']/i);
        const re = rel
          ? new RegExp(`<link\\b[^>]*\\brel\\s*=\\s*["']${esc(rel[1])}["'][^>]*>`, "i")
          : prop
            ? new RegExp(`<meta\\b[^>]*\\bproperty\\s*=\\s*["']${esc(prop[1])}["'][^>]*>`, "i")
            : nm
              ? new RegExp(`<meta\\b[^>]*\\bname\\s*=\\s*["']${esc(nm[1])}["'][^>]*>`, "i")
              : null;
        const existing = re ? out.match(re) : null;
        if (existing) {
          if (existing[0].trim() !== t) {
            out = out.replace(re, t);
            swapped++;
          }
          continue;
        }
        if (!out.includes(t)) inserts.push(t);
      }
      if (titleTag) {
        const curTitle = out.match(/<title[^>]*>[\s\S]*?<\/title>/i);
        if (curTitle) {
          if (curTitle[0].trim() !== titleTag) {
            out = out.replace(/<title[^>]*>[\s\S]*?<\/title>/i, titleTag);
            swapped++;
          }
        } else {
          inserts.unshift(titleTag);
        }
      }
      if (inserts.length) {
        out = out.replace(/<\/head>/i, `  ${inserts.join("\n  ")}\n</head>`);
      }
      if (inserts.length || swapped) {
        updated = out;
        const parts = [];
        if (inserts.length) parts.push(`inserted ${inserts.length} new head tag${inserts.length === 1 ? "" : "s"}`);
        if (swapped) parts.push(`updated ${swapped} existing`);
        how = parts.join(", ");
      } else {
        return { ok: true, msg: `${file} already carries every tag in NEW, nothing to change` };
      }
    }
  }
  if (updated === null && current && current.toLowerCase() !== "none") {
    const hits = html.split(current).length - 1;
    if (hits === 1) {
      updated = html.replace(current, next);
      how = "exact match";
    } else if (hits > 1) {
      return { ok: false, msg: `CURRENT text appears ${hits} times, refusing an ambiguous edit` };
    } else {
      // whitespace-tolerant second pass: same tokens, any spacing
      const fuzzy = new RegExp(
        current
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\s+/g, "[\\s]+"),
        "g"
      );
      const m = html.match(fuzzy);
      if (m && m.length === 1) {
        updated = html.replace(fuzzy, next);
        how = "whitespace-tolerant match";
      }
    }
  }
  if (updated === null && current && current.toLowerCase() !== "none") {
    return { ok: false, msg: "CURRENT text not found in the live file, it may have changed" };
  }
  if (updated === null && p.kind === "title" && /<title/i.test(next)) {
    updated = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, next.trim());
    how = "title tag swap";
  }
  if (updated === null && p.kind === "meta" && /name="description"/i.test(next)) {
    updated = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?">/i, next.trim());
    how = "meta tag swap";
  }
  if (updated === null) {
    return { ok: false, msg: "no CURRENT anchor matched and the NEW block is not a title, meta, or link tag set I can place" };
  }
  if (updated.includes("\u2014") || updated.includes("\u2013")) {
    updated = updated.replace(/\u2014|\u2013/g, ", ");
  }
  const invalid = await validateEdit(file, html, updated);
  if (invalid) {
    return { ok: false, msg: `safety guard blocked the write: ${invalid}` };
  }
  try {
    if (!creating) fs.copyFileSync(full, `${full}.bak-${Date.now()}`);
    fs.writeFileSync(full, updated);
  } catch (e) {
    return { ok: false, msg: `write failed: ${e.message || e}` };
  }
  // best effort repo sync; the site itself is already updated
  let sync = "repo sync skipped";
  try {
    const { execFileSync } = await import("child_process");
    execFileSync("git", ["-C", rootDir, "add", file], { timeout: 15000 });
    execFileSync(
      "git",
      ["-C", rootDir, "-c", "user.email=regent@blackcrownvxj.com", "-c", "user.name=Regent", "commit", "-m", `Regent: apply approved #${p.number} ${p.summary}`.slice(0, 120)],
      { timeout: 15000 }
    );
    try {
      execFileSync("git", ["-C", rootDir, "push", "origin", "main"], { timeout: 30000 });
      sync = "repo committed and pushed";
    } catch {
      // remote moved ahead or the wire blinked: pull its work under ours, push again
      try {
        execFileSync("git", ["-C", rootDir, "pull", "--rebase", "--autostash", "origin", "main"], { timeout: 30000 });
        execFileSync("git", ["-C", rootDir, "push", "origin", "main"], { timeout: 30000 });
        sync = "repo committed and pushed, after pulling newer remote work";
      } catch {
        sync = "committed locally, push blocked, check the repo's deploy key or rebase by hand";
      }
    }
  } catch {
    sync = "live only, repo not synced";
  }
  let score = "";
  try {
    const pages = rootKey === "site" && deps.audit ? await deps.audit() : [];
    const pg = pages.find((x) => x.file === file);
    if (pg) score = `, new score ${pg.score}`;
  } catch {
    // audit optional
  }
  return { ok: true, msg: `${file} updated live (${how})${score}. ${sync}.` };
}

// self repair: when a site edit fails, Regent pulls the live file and
// re-derives the edit itself, grounded in what is actually there, then
// runs it once more through the same executor and safety guard.
const REPAIR_SYSTEM = `You repair a failed website edit for BlackCrownVxJ. You receive an approved proposal and the live file it targets. Output STRICT JSON only, one of:
{"current":"...","new":"..."}  or  {"done":true}
Rules:
- "current" is copied byte for byte from the LIVE FILE below, unique within it, under 400 characters. Never invent or paraphrase it.
- "new" is the exact final text that replaces "current" and fulfills the proposal's intent.
- To ADD meta or link head tags, or sitemap url entries, set "current" to "none" and make "new" only those tags or entries; the executor merges them safely.
- If the live file already satisfies the proposal, output {"done":true}.
- Escape every line break inside strings as \\n. The whole output must pass JSON.parse.
- Never use em dashes anywhere, write a comma or the word "to" instead.`;

async function selfRepair(p, failMsg) {
  const loc = resolveSiteFile(p.page);
  if (loc.err) return null;
  let body;
  try {
    body = fs.readFileSync(loc.full, "utf8");
  } catch {
    return null;
  }
  const excerpt =
    body.length <= 7000
      ? body
      : body.slice(0, 5200) + "\n...[middle of file omitted]...\n" + body.slice(-1800);
  const user = `PROPOSAL #${p.number} (kind: ${p.kind}) targeting ${loc.file}:\n${String(p.detail || "").slice(0, 1500)}\n\nFIRST ATTEMPT FAILED WITH: ${failMsg}\n\nLIVE FILE (${loc.file}):\n${excerpt}`;
  const j = await think(REPAIR_SYSTEM, user, 1800);
  if (!j) return null;
  if (j.done) {
    return { ok: true, msg: `${loc.file} already satisfies the ask, verified against the live file, nothing to change` };
  }
  if (!j.new) return null;
  const cur = j.current && String(j.current).trim() ? String(j.current) : "none";
  const detail = `WHAT: ${p.summary}\nCURRENT: ${cur}\nNEW: ${String(j.new)}`;
  return executeSiteEdit({ ...p, detail });
}

async function execute(p) {
  if (p.kind === "brain") {
    const name = String(p.page || "").replace(/[^a-zA-Z0-9 ._-]/g, "");
    const current = section(p.detail, "CURRENT");
    const next = section(p.detail, "NEW");
    if (!name.endsWith(".md") || !next) return { ok: false, msg: "brain edits need a .md page and a NEW block" };
    const existing = brainFile(name).body || "";
    let body;
    if (current && current.toLowerCase() !== "none" && existing.includes(current)) {
      body = existing.replace(current, next);
    } else if (!existing || (current || "").toLowerCase() === "none") {
      body = next;
    } else {
      return { ok: false, msg: "CURRENT passage not found in that vault note" };
    }
    const saved = brainSave(name, body);
    return saved
      ? { ok: true, msg: `${name} updated in the vault, now law` }
      : { ok: false, msg: "vault write refused" };
  }
  if (p.kind === "creative") {
    renderCreative(p).catch((e) => log("error", `render crashed: ${e.message || e}`));
    return { ok: true, msg: "rendering via Bloom, package lands in the channel" };
  }
  // publishing to the outside web: a PLATFORM line (or kind post) hands the
  // approved content to the owner's Make publisher webhook, which posts with
  // the owner's own platform connections. The server never holds those keys.
  const platformLine = (String(p.detail || "").match(/PLATFORM:\s*([a-z0-9 _-]+)/i) || [])[1];
  if ((p.kind === "post" || platformLine) && deps.publish) {
    const postBody = section(p.detail, "NEW");
    if (!postBody) return { ok: false, msg: "post proposals need NEW carrying the exact final content" };
    const media =
      (String(p.detail).match(/MEDIA:\s*(\S+)/i) || [])[1] ||
      (Array.isArray(p.rendered) && p.rendered[0]) ||
      undefined;
    return deps.publish({
      platform: (platformLine || "unspecified").trim().toLowerCase(),
      content: postBody,
      media,
      number: p.number,
      summary: p.summary,
    });
  }
  // anything carrying a SCHEDULE line is a server job, whatever kind label
  // the agent chose; the shape outranks the tag
  if (deps.createJob && /SCHEDULE:\s*(daily|weekly)/i.test(String(p.detail || ""))) {
    const r = deps.createJob(p);
    if (r) return r;
  }
  // the TikTok Engine: page "make" (or make:scenarioId) edits the live
  // Make scenario's content strings, with a server-side backup first
  if (/^make(:\d+)?$/i.test(String(p.page || "").trim()) && deps.makeEdit) {
    const current = section(p.detail, "CURRENT");
    const next = section(p.detail, "NEW");
    if (!next) return { ok: false, msg: "proposal has no NEW block to apply" };
    const sid = (String(p.page).match(/^make:(\d+)/i) || [])[1];
    return deps.makeEdit({ scenarioId: sid, current, next });
  }
  if (["title", "meta", "content", "other"].includes(p.kind)) {
    let r = await executeSiteEdit(p);
    if (!r.ok && !/not set up on this server|not a file I can edit|write failed/i.test(r.msg)) {
      log("repair", `#${p.number}: ${r.msg}. Running self repair against the live file.`);
      try {
        const r2 = await selfRepair(p, r.msg);
        if (r2 && r2.ok) {
          r = { ok: true, msg: `${r2.msg} (self repaired)` };
        } else if (r2) {
          r = { ok: false, msg: `${r.msg}. Self repair also failed: ${r2.msg}` };
        }
      } catch (e) {
        log("error", `self repair crashed: ${e.message || e}`);
      }
    }
    return r;
  }
  // recurring reports and automations: register with the in-house jobs
  // engine when the proposal carries a schedule; the server runs it forever
  if (["job", "automation", "campaign"].includes(p.kind) && deps.createJob) {
    const r = deps.createJob(p);
    if (r) return r;
  }
  const next = section(p.detail, "NEW");
  return {
    ok: true,
    msg: `manual step, no SCHEDULE line found so I cannot register it as a server job. Paste this yourself or refile as kind job with SCHEDULE and CHANNEL lines:\n${(next || p.detail).slice(0, 600)}`,
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
  if (!r.ok && deps.assignFix) {
    try {
      deps.assignFix(p.author || "Corvid", `Fix and refile #${p.number}: ${r.msg.slice(0, 150)}`);
      await send(`**REGENT //** Routed the fix to ${p.author || "Corvid"}'s desk; the owner does not debug.`);
    } catch {}
  }
  agentLog("regent", `#${p.number} ${r.ok ? "executed by Regent" : "execution failed"}`);
  return p;
}

function deskSnapshot() {
  const out = {};
  try {
    const a = agentState();
    out.corvid = {
      status: a.status,
      focus: a.currentFocus || "",
      openTasks: (a.tasks || []).filter((x) => x.status !== "done").map((x) => x.title).slice(0, 8),
      doneTasks: (a.tasks || []).filter((x) => x.status === "done").length,
      pendingAsks: (a.proposals || []).filter((x) => x.status === "pending").map((x) => `#${x.number} ${x.summary}`).slice(0, 6),
      recentlyDecided: (a.proposals || [])
        .filter((x) => x.status !== "pending")
        .slice(0, 6)
        .map((x) => `#${x.number} ${x.status}${x.note ? `: ${String(x.note).slice(0, 70)}` : ""}`),
    };
  } catch {}
  try {
    for (const s of staffStates()) {
      out[s.key] = {
        status: s.status,
        focus: s.focus || "",
        openTasks: (s.tasks || []).filter((x) => x.status !== "done").map((x) => x.title).slice(0, 8),
        doneTasks: (s.tasks || []).filter((x) => x.status === "done").length,
      };
    }
  } catch {}
  try { out.spend = spendSummary(); } catch {}
  return out;
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
      `Recent executions: ${JSON.stringify(state.executed.slice(0, 6))}`,
      `LIVE DESK STATUS: ${JSON.stringify(deskSnapshot())}`,
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
// initiative: Regent runs the business, not just the approvals
// ---------------------------------------------------------------------------
const INITIATIVE_SYSTEM = `${IDENTITY}

Initiative cycle. You are given the company strategy, the data patterns, your execution ledger, open asks and Corvid's open tasks. Set the business agenda: what matters most right now for revenue and growth, and what Corvid should be working on.

Respond ONLY with JSON that passes JSON.parse (line breaks inside strings written as \\n):
{
 "agenda_md": "full content of Agenda.md: the top 3-5 business priorities, each one line with a reason, markdown bullets, [[wikilinks]] where apt",
 "directives": [{"task":"max 10 words, a concrete job for Corvid"}],
 "note": "one or two short lines to the owner ONLY if priorities genuinely shifted, else empty string"
}
Max 2 directives; zero is fine. Never direct what is already an open task or pending ask.`;

let initiativeBusy = false;
export async function runInitiative(trigger = "schedule") {
  if (initiativeBusy || !state.enabled) return { ok: false };
  initiativeBusy = true;
  state.status = "planning";
  saveState();
  try {
    const user = [
      `Strategy:\n${brainFile("Strategy.md").body.slice(0, 1800)}`,
      `Patterns:\n${brainFile("Patterns.md").body.slice(0, 1200)}`,
      `My Ledger (recent):\n${vaultRead("Ledger.md").split("\n").filter((l) => l.startsWith("- ")).slice(-8).join("\n")}`,
      `Open asks: ${JSON.stringify(state.asks.map((id) => findProposal(id)).filter(Boolean).map((p) => p.summary))}`,
      `Corvid open tasks: ${JSON.stringify(
        JSON.parse(JSON.stringify((brainFile("Tasks.md").body.match(/- \[ \][^\n]+/g) || []).slice(0, 10)))
      )}`,
      `Current Agenda:\n${vaultRead("Agenda.md").slice(0, 900)}`,
    ].join("\n\n");
    const out = await think(INITIATIVE_SYSTEM, user, 1400);
    if (out.agenda_md) {
      ensureVault();
      fs.writeFileSync(path.join(VAULT, "Agenda.md"), String(out.agenda_md).slice(0, 8000).replace(/\u2014|\u2013/g, ", "));
    }
    for (const d of Array.isArray(out.directives) ? out.directives.slice(0, 2) : []) {
      if (d.task) {
        addTask(`Regent: ${String(d.task).slice(0, 110)}`);
        log("directive", `to Corvid: ${String(d.task).slice(0, 90)}`);
      }
    }
    if (out.note && String(out.note).trim()) {
      await send(`**REGENT // AGENDA** ${String(out.note).trim()}`);
    }
    state.lastInitiativeAt = Date.now();
    log("initiative", `Agenda set (${trigger})`);
  } catch (e) {
    log("error", `Initiative failed: ${e.message || e}`);
  } finally {
    initiativeBusy = false;
    state.status = state.enabled ? "watching" : "paused";
    saveState();
  }
  return { ok: true };
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
  setInterval(() => {
    if (!state.enabled || initiativeBusy) return;
    if (!state.lastInitiativeAt || Date.now() - state.lastInitiativeAt >= INITIATIVE_EVERY_H * 3600000) {
      runInitiative("schedule").catch(() => {});
    }
  }, 60 * 1000);
  if (BOT_TOKEN && CEO_CHANNEL && CEO_CHANNEL !== SEO_CHANNEL) {
    setInterval(async () => {
      if (!state.enabled) return;
      await checkAskReactions().catch(() => {});
      const msgs = await fetchNew();
      if (msgs.length) await react(msgs);
    }, POLL_SECONDS * 1000);
  } else if (BOT_TOKEN && CEO_CHANNEL) {
    // shared channel: Corvid answers the words there, Regent still reads reactions
    setInterval(async () => {
      if (!state.enabled) return;
      await checkAskReactions().catch(() => {});
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
    lastInitiativeAt: state.lastInitiativeAt || null,
    log: state.log.slice(-40).reverse(),
  };
}
export function ceoSetEnabled(on) {
  state.enabled = Boolean(on);
  state.status = state.enabled ? "watching" : "paused";
  log("control", state.enabled ? "Resumed by owner" : "Paused by owner");
  saveState();
}
