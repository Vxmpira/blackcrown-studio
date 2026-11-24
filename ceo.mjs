// Regent, the CEO agent of BlackCrownVxJ LLC. Event driven: Corvid files
// proposals, Regent reviews them against the Charter, takes the endorsed ones
// to the owner on Discord, and on the owner's green light executes the change
// itself: live site edits on this server, Bloom renders for creatives. The
// owner's word is the only authority; Regent is the only hand that writes.
import { xWeight, xClean, angleOf, ANGLE_LIST } from "./xlab.mjs";
import { noteBody } from "./vault.mjs";
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
  bookMeasurement,
  buildEmbeds,
  agentState,
  spendSummary,
} from "./agent.mjs";
import { MODELS, callJSON, canSpend } from "./llm.mjs";
import { brandLaw, engineLaw, BRAND_LAW_TEXT } from "./brandlaw.mjs";
import { staffStates } from "./staff.mjs";
import { recordTicket, sameAsTicket, ticketCard, similarity } from "./crew.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CEO_NAME = "Regent";
const STATE_PATH = path.join(__dirname, "studio-ceo.json");
const VAULT = process.env.CEO_BRAIN_DIR || path.join(__dirname, "brain-ceo");
const MODEL = (process.env.CEO_MODEL || MODELS.head).trim();
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

// Regent rules on what reaches the owner and edits live files, so every call
// stays on the head model. Reviews, replies and repairs are owner priority and
// run even when the day's budget for background work is spent.
async function think(system, user, maxTokens = 1400, opts = {}) {
  return callJSON(
    { who: "regent", model: MODEL, system, user, maxTokens, hot: opts.hot, priority: opts.priority || "owner" },
    parseModelJson
  );
}

const IDENTITY = `You are ${CEO_NAME}, the chief executive agent of BlackCrownVxJ LLC. The owner is Vxmpira.N. Corvid, the SEO agent, files proposals with you; you review them against the Charter, veto what wastes the owner's time or money, take the rest to him on Discord, and once he green lights, you execute and confirm. You never execute without his word. You are direct, brief, and final. Never use em dashes or en dashes. He reads on his phone.`;

const REVIEW_SYSTEM = `${IDENTITY}

Review each filed proposal. Veto anything off brand, not data backed, duplicate, or spend without a reason. THE ASK IS THE LOCK: the owner's green light on an ask approves everything inside it, overlay lines, copy, and spec included. NEVER veto for missing approvals, locks, or sign-offs that the green light itself would grant, and never invent new approval layers; there is exactly one approval: the owner's word on the ask. Endorse the rest, amending the summary for clarity if needed.

Respond ONLY with JSON that passes JSON.parse (line breaks inside strings written as \\n):
{"verdicts":[{"id":"...","action":"endorse|veto","note":"max 12 words why"}]}

CRO REVIEW, you are the gate that keeps conversion work honest. The CRO FUNNEL and CRO TESTS above are measured by the server. For any filing that changes a page, an offer, a button, a form or a signup path: endorse it only when its WHY names the funnel step it moves and why that visitor would act differently; veto "improvements" aimed at a step that is not leaking while a bigger leak sits untouched, and say which step to aim at instead. Veto a second change to a step that already has a test running: two changes on one metric cannot be told apart. Veto any claim of a winner the server has not called. A small-numbers warning in the funnel means word swaps cannot be measured; prefer the bolder filing.

${BRAND_LAW_TEXT} You hold the desks to this law: veto any filing that restyles a page, renames anything, moves a price, or makes a claim we cannot prove, however good the conversion argument sounds. Improving the sites means sharper words and structure inside the brand, never a different brand.`;

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
// An ask that is really a problem report (how a server behaves, a setting, an
// owner-only file) can never pass as a page edit. Preflight answers those with
// a reason that starts TICKET: and intake turns them into one owner ticket
// instead of ordering the desk to refile something that can only bounce again.
const TICKET_KINDS = /^(ticket|bug|incident|server|backend|config|setting|behaviou?r|owner|engineering|infra|outage|blocker)$/;
const NOT_PAGE_TEXT = /^\((behaviou?r|server|backend|logic|config|setting|flow|none on page|not on (the )?page|n\/?a)\b/i;
function preflightProposal(p) {
  try {
    const kind = String(p.kind || "").toLowerCase();
    const detail = String(p.detail || "");
    const page = String(p.page || "");
    const cur = String(section(detail, "CURRENT") || "").trim();
    const isNew = /^\(new file\)$/i.test(cur);
    if (TICKET_KINDS.test(kind)) return "TICKET: filed as a problem report, not a change";
    if (NOT_PAGE_TEXT.test(cur)) return "TICKET: this describes how something behaves, not text on a page, so no edit can make it";
    const plat = (detail.match(/PLATFORM:\s*(\S+)/i) || [])[1];
    if (kind === "post" || plat) {
      if (!plat) return "post asks need a PLATFORM line";
      const pl = plat.toLowerCase();
      if (pl !== "youtube" && pl !== "x") return `platform ${plat} is not wired; wired platforms: youtube, x`;
      const media = (detail.match(/MEDIA:\s*(\S+)/i) || [])[1];
      if (pl === "youtube") {
        if (!media || !/^https?:\/\//i.test(media)) return "MEDIA must be the full https url of the rendered file";
      } else {
        if (media && !/^https?:\/\//i.test(media)) return "MEDIA, when present, must be the full https url of the rendered file";
        const body = String(section(detail, "NEW") || "").trim();
        if (!body) return "x posts need NEW carrying the exact final text";
        const len = xWeight(body);
        if (len > 280) return `x posts cap at 280 as X weighs them (any link counts 23, emoji and arrows count 2); this one weighs ${len}. Cut ${len - 280} and refile`;
        // every X post is a test of one sales angle; the brief is the one house format that is always "news"
        if (!angleOf(detail)) return `x asks carry a line ANGLE: with one of ${ANGLE_LIST.join(", ")} (above NEW), so the X LAB can tell which approach pulls people in`;
      }
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
    if (kind === "creative") {
      const author = String(p.author || "Corvid");
      const isVideo = String(p.format || "").toLowerCase() === "video" || p.video;
      if (isVideo && !/^bard$/i.test(author)) {
        return `CREATIVE IS BARD'S DESK: video creatives come only from Bard's studio pipeline (director, quill, critic). Hand the angle to Bard with a request instead`;
      }
      return null;
    }
    if (/^make(:|$)/i.test(page)) {
      if (deps.makeAllowed && !deps.makeAllowed(page)) return "engine law: that Make scenario is not one the desks may edit; only the TikTok engine (page make) is open";
      const why = engineLaw({ current: section(p.detail, "CURRENT"), next: section(p.detail, "NEW"), engine: deps.engineText ? deps.engineText() || "" : "" });
      return why ? `engine law: ${why}` : null;
    }
    if (kind === "brain" || kind === "automation") return null;
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
          // the filing desk's own vault first: a page a desk's minion wrote lives
          // in that desk's vault, not Corvid's
          body = noteBody(fromNote[1].trim(), String(p.author || "")) || String((brainFile(fromNote[1].trim()) || {}).body || "");
        } catch {
          body = "";
        }
        if (!body.trim()) return `vault note ${fromNote[1].trim()} is empty or missing; have the minion write the full page first`;
        body = body.replace(/^```(html)?\s*/i, "").replace(/```\s*$/i, "");
        const doc = body.match(/<!doctype html>[\s\S]*?<\/html>/i);
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
        // the owner's layout law, checked mechanically
        if (!/name="viewport"/i.test(b)) {
          return "the page has no viewport meta; build inside the Page Frame (corvid/Page-Frame.md), never your own scaffolding";
        }
        if (/<table/i.test(b) && !/tablewrap/i.test(b)) {
          return "the page has a table outside a tablewrap rail, it will bleed off phone screens; wrap every table in <div class=\"tablewrap\"> per the Page Frame";
        }
        // Korvus /p/ pages are dressed by the Korvus server itself (fonts,
        // colours, the atmosphere background), so they need no style of
        // their own; demanding one made the page too long for a minion to finish
        const dressed = loc.rootKey === "korvus" && /^pages\//.test(loc.file);
        if (!dressed && !/radial-gradient/i.test(b)) {
          return "the page has a flat background; the Page Frame's atmosphere block (glows, grid, vignette) is law on every page";
        }
      }
      const law = brandLaw({ repo: loc.rootKey, file: loc.file, before: "", after: body, reference: brandReference(loc.rootKey, loc.rootDir) });
      if (law) return /is owner-only/.test(law) ? `TICKET: ${law.split(". ")[0]}` : `brand law: ${law}`;
      return null;
    }
    // an edit to a live file: apply it in memory and hold the result to the law
    {
      const before = fs.readFileSync(loc.full, "utf8");
      // a CURRENT the desk guessed instead of reading: when even its visible
      // words are nowhere on the page, bounce it so the desk reads and refiles
      // (markup-only drift still goes through; the executor self repairs that)
      if (cur && !isNew && cur.toLowerCase() !== "none" && !before.includes(cur)) {
        const flat = (x) => String(x).replace(/\s+/g, " ").trim().toLowerCase();
        const words = flat(cur.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " "));
        if (!flat(before).includes(flat(cur)) && words.length >= 3 && !flat(before.replace(/<[^>]*>/g, " ")).includes(words)) {
          return `CURRENT is not on ${loc.file}: "${words.slice(0, 80)}" appears nowhere in the live page. Read the page first ("read" with that file) and copy CURRENT exactly from its source`;
        }
      }
      const next = String(section(detail, "NEW") || "");
      const after = cur && before.includes(cur) ? before.replace(cur, next) : `${before}\n${next}`;
      const law = brandLaw({ repo: loc.rootKey, file: loc.file, before, after, reference: brandReference(loc.rootKey, loc.rootDir) });
      if (law) return /is owner-only/.test(law) ? `TICKET: ${law.split(". ")[0]}` : `brand law: ${law}`;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export const preflightForTest = (p) => preflightProposal(p);
export const repairWindowForTest = (b, p) => repairWindow(b, p);

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
  for (const b of bounced) {
    // the third bounce of the same ask is a loop a person would have stopped
    try {
      // an ask that bounces AND matches an open ticket is that ticket again
      if (!/^TICKET: /.test(b.why) && sameAsTicket(`${b.p.summary || ""} ${section(b.p.detail, "WHAT") || ""}`)) {
        b.why = "TICKET: this is already with the owner as a ticket";
      }
      if (!/^TICKET: /.test(b.why)) {
        const now = Date.now();
        state.bounces = (state.bounces || []).filter((x) => now - x.at < 72 * 3600000).slice(-40);
        const before = state.bounces.filter((x) => similarity(x.summary, b.p.summary || "") >= 0.5).length;
        state.bounces.push({ summary: String(b.p.summary || "").slice(0, 120), at: now });
        if (before >= 2) b.why = `TICKET: this ask has now bounced ${before + 1} times (last reason: ${b.why.slice(0, 120)})`;
      }
    } catch {}
  }
  for (const { p, why } of bounced) {
    if (/^TICKET: /.test(why)) {
      try {
        const reason = why.replace(/^TICKET: /, "");
        decideProposal(p.id, "reject", `ticket: ${reason}`, "preflight");
        const what = `${p.summary || ""}. ${String(section(p.detail, "WHAT") || "").replace(/\s+/g, " ").slice(0, 130)}`.trim();
        const tk = recordTicket(p.author || "Corvid", what, String(section(p.detail, "WHY") || "").replace(/\s+/g, " "));
        log("ruling", `#${p.number} is a problem report, not an edit (${reason}); ${tk && tk.count > 1 ? "added to the open ticket" : "raised to the owner as a ticket"}`);
        const card = ticketCard();
        if (card) await send(card);
      } catch {}
      continue;
    }
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
      ...(deps.cro ? [String(deps.cro() || "").slice(0, 2600)].filter(Boolean) : []),
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


// ---------------------------------------------------------------------------
// THE OWNER'S CARDS. Every card answers, in the same order every time: what
// is this, why, exactly what changes (the words before and after, or the
// post itself), where to see it, and what is wanted from him. Sections are
// short labelled blocks so a card can be read at a glance or in full.
// ---------------------------------------------------------------------------
const clip = (s, n) => {
  const t = String(s || "").replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
};
const quote = (s, n) => {
  const t = clip(String(s || "").replace(/<[^>]+>/g, " "), n);
  return t ? `> ${t}` : "";
};
// WHAT and WHY can trail the ask's machine lines; those are shown elsewhere on the card
const tidySection = (t) => String(t || "").split("\n").filter((l) => !/^\s*(PLATFORM|MEDIA|ANGLE|SCHEDULE|CHANNEL):/i.test(l)).join("\n").trim();
// where a changed file can be seen by a visitor
export function liveUrl(page) {
  const pg = String(page || "").trim();
  if (!pg || /^make(:|$)/i.test(pg)) return "";
  let m;
  if ((m = pg.match(/^korvus:pages\/([a-z0-9-]+)\.html$/i))) return `https://korvus.industries/p/${m[1]}`;
  if (/^korvus:korvus_landing\.html$/i.test(pg)) return "https://korvus.industries/";
  if ((m = pg.match(/^korvus:korvus_([a-z]+)\.html$/i))) return `https://korvus.industries/${m[1]}`;
  if (/^korvus:/i.test(pg)) return "https://korvus.industries/";
  if (/^crown:index\.html$/i.test(pg)) return "https://blackcrown-intelligence.com/";
  if (/^crown:/i.test(pg)) return "https://blackcrown-intelligence.com/";
  if (/^[a-z0-9._-]+\.html$/i.test(pg)) return `https://blackcrownvxj.com/${/^index\.html$/i.test(pg) ? "" : pg}`;
  return "";
}
const PRODUCT = (page) => (/^korvus:/i.test(page) ? "Korvus site" : /^crown:/i.test(page) ? "Crown site" : /^make/i.test(page) ? "automation" : "brand site");
// the heart of a card: what exactly changes, in the reader's words
function changeLines(p) {
  const d = String(p.detail || "");
  const plat = ((d.match(/PLATFORM:\s*([a-z0-9]+)/i) || [])[1] || "").toLowerCase();
  const cur = section(d, "CURRENT"), next = section(d, "NEW");
  const kind = String(p.kind || "").toLowerCase();
  if (plat === "x") {
    const media = (d.match(/MEDIA:\s*(\S+)/i) || [])[1];
    return [
      `**THE POST** (X, ${xWeight(next)} of 280${angleOf(d) ? `, angle: ${angleOf(d)}` : ""})`,
      xClean(next).slice(0, 700).split("\n").map((l) => `> ${l}`).join("\n"),
      media ? `**VIDEO** ${media}` : "",
    ];
  }
  if (plat === "youtube") {
    return [`**THE UPLOAD** (YouTube)`, quote(next, 500), `**VIDEO** ${(d.match(/MEDIA:\s*(\S+)/i) || [])[1] || "not attached"}`];
  }
  if (/SCHEDULE:\s*(daily|weekly)/i.test(d)) {
    return [`**THE REPORT** ${clip((d.match(/SCHEDULE:\s*([^\n]+)/i) || [])[1], 60)}, posts in ${(d.match(/CHANNEL:\s*(\w+)/i) || [])[1] || "corvid"}`, quote(next, 420)];
  }
  if (["creative", "video", "furnace"].includes(kind) || /furnace|monolith|creative/i.test(p.summary || "")) {
    return [`**THE VIDEO** what gets made`, quote(next || section(d, "WHAT"), 560)];
  }
  const url = liveUrl(p.page);
  const fresh = /^\(new file\)$/i.test(cur.trim()) || /^none\b/i.test(cur.trim());
  const fromNote = (next.match(/^FROM NOTE:\s*(.+)$/im) || [])[1];
  return [
    `**WHERE** ${PRODUCT(p.page)}, ${String(p.page).replace(/^[a-z]+:/i, "")}${url ? `\n${url}` : ""}`,
    fresh ? `**NEW PAGE** ${fromNote ? `built from the desk's note "${clip(fromNote, 80)}"` : "added"}` : `**NOW READS**`,
    fresh ? (fromNote ? "" : quote(next, 420)) : quote(cur, 380) || "> (nothing there yet)",
    fresh ? "" : `**WILL READ**`,
    fresh ? "" : quote(next, 380),
  ];
}
function askCard(p) {
  const d = String(p.detail || "");
  const gl = clip((d.match(/GREEN LIGHT MEANS:\s*([^\n]+)/i) || [])[1] || "see Agent HQ", 300);
  return [
    `**REGENT // ASK** · #${p.number} · ${etDayKey()}`,
    `${clip(p.summary, 160)}`,
    `Filed by ${p.author || "Corvid"}. Regent reviewed it and passes it to you.`,
    `**WHAT** ${clip(tidySection(section(d, "WHAT")) || p.summary, 320)}`,
    tidySection(section(d, "WHY")) ? `**WHY** ${clip(tidySection(section(d, "WHY")), 380)}` : "",
    ...changeLines(p),
    `**GREEN LIGHT MEANS** ${gl}`,
    `**YOUR MOVE** React with the check to approve or the X to reject. Words work too: approve ${p.number}.`,
  ].filter(Boolean).join("\n");
}
// what one executed ask did, as a sentence a person can check
function doneSentence(p, r) {
  const d = String(p.detail || "");
  const plat = ((d.match(/PLATFORM:\s*([a-z0-9]+)/i) || [])[1] || "").toLowerCase();
  const xid = (String(r.msg).match(/\bpost (\d{15,22})\b/) || [])[1];
  if (plat === "x") return { what: `Posted on the brand X account${angleOf(d) ? ` (angle: ${angleOf(d)})` : ""}.`, show: quote(section(d, "NEW"), 420), see: xid ? `https://x.com/i/status/${xid}` : "" };
  if (plat === "youtube") return { what: "Handed to the publisher for YouTube.", show: quote(section(d, "NEW"), 300), see: "" };
  if (/job registered/i.test(r.msg)) return { what: "A scheduled report was registered; the server runs it from now on.", show: "", see: "" };
  if (/rendering/i.test(r.msg)) return { what: "The video was sent to render. This is the start, not the finished file; the package lands in the channel only if the render completes.", show: "", see: "" };
  if (/already (carries|satisfies)|nothing to change/i.test(r.msg)) return { what: "Nothing needed changing: the live page already had it.", show: "", see: liveUrl(p.page) };
  const cur = section(d, "CURRENT"), next = section(d, "NEW");
  const fresh = /^\(new file\)$/i.test(cur.trim());
  return {
    what: fresh ? `A new page went live on the ${PRODUCT(p.page)}.` : `The ${PRODUCT(p.page)} was edited (${String(p.page).replace(/^[a-z]+:/i, "")}) and is live.`,
    show: fresh ? "" : [cur ? `Was: ${clip(cur.replace(/<[^>]+>/g, " "), 200)}` : "", next ? `Now: ${clip(next.replace(/<[^>]+>/g, " "), 240)}` : ""].filter(Boolean).map((x) => `> ${x}`).join("\n"),
    see: liveUrl(p.page),
  };
}
function doneCard(p, r, measured) {
  if (!r.ok) {
    return [
      `**REGENT // FAILED** · #${p.number} · ${etDayKey()}`,
      clip(p.summary, 160),
      `**WHAT WENT WRONG** ${clip(r.msg, 420)}`,
      `**WHO FIXES IT** ${p.author || "Corvid"}'s desk has the fix as a task. Nothing is needed from you.`,
    ].join("\n");
  }
  const s = doneSentence(p, r);
  return [
    `**REGENT // DONE** · #${p.number} · ${etDayKey()}`,
    clip(p.summary, 160),
    `**WHAT GOT DONE** ${s.what}`,
    s.show,
    s.see ? `**SEE IT** ${s.see}` : "",
    `**RECORD** ${clip(r.msg, 260)}`,
    measured ? `**NEXT** Corvid reads the effect on this page in 7 days.` : "",
    `**FILED BY** ${p.author || "Corvid"}`,
  ].filter(Boolean).join("\n");
}

// THE DAILY BRIEF: one card each evening that says what the company actually
// did today, grouped and in plain words, with what is waiting on the owner.
// Built from the day's records; no model call.
export function dailyBriefCard() {
  const day = etDayKey();
  const todays = (state.executed || []).filter((e) => new Date(e.at).toLocaleDateString("en-CA", { timeZone: "America/New_York" }) === day).reverse();
  const ok = todays.filter((e) => e.ok), bad = todays.filter((e) => !e.ok);
  const is = (re) => (e) => re.test(String(e.result));
  const xs = ok.filter(is(/posted to X/i));
  const yt = ok.filter(is(/youtube/i));
  const vid = ok.filter(is(/^rendering/i));
  const jobs = ok.filter(is(/job registered/i));
  const edits = ok.filter((e) => !xs.includes(e) && !yt.includes(e) && !vid.includes(e) && !jobs.includes(e));
  const bullets = (list, f, max = 6) => (list.length ? [...list.slice(0, max).map((e) => `• #${e.number} ${f(e)}`), list.length > max ? `• and ${list.length - max} more` : ""].filter(Boolean).join("\n").slice(0, 980) : "");
  const xid = (e) => (String(e.result).match(/\bpost (\d{15,22})\b/) || [])[1];
  const pend = state.asks.map((id) => findProposal(id)).filter((p) => p && p.status === "pending");
  const vetoes = (state.log || []).filter((l) => l.kind === "veto" && new Date(l.t || l.at || 0).toLocaleDateString("en-CA", { timeZone: "America/New_York" }) === day);
  let spent = "";
  try {
    spent = ` Model spend today: $${Number(deps.spentToday ? deps.spentToday() : 0).toFixed(2)}.`;
  } catch {}
  if (!todays.length && !pend.length && !vetoes.length) return "";
  return [
    `**REGENT // DAILY BRIEF** · ${day}`,
    `${ok.length} shipped, ${bad.length} failed, ${pend.length} waiting on you, ${vetoes.length} vetoed before reaching you.${spent}`,
    xs.length ? `**X POSTS** ${xs.length} went out\n${bullets(xs, (e) => `${clip(e.summary, 70)}${xid(e) ? ` · https://x.com/i/status/${xid(e)}` : ""}`, 5)}` : "",
    edits.length ? `**SITE CHANGES** ${edits.length} live\n${bullets(edits, (e) => `${clip(e.summary, 70)}: ${clip(String(e.result).replace(/ repo committed and pushed\.?/, ""), 80)}`)}` : "",
    yt.length ? `**YOUTUBE** ${yt.length} handed to the publisher\n${bullets(yt, (e) => clip(e.summary, 90))}` : "",
    vid.length ? `**VIDEO** ${vid.length} sent to render (started, not confirmed finished)\n${bullets(vid, (e) => clip(e.summary, 90))}` : "",
    jobs.length ? `**REPORTS** ${jobs.length} new scheduled\n${bullets(jobs, (e) => clip(e.summary, 90))}` : "",
    bad.length ? `**FAILED** ${bad.length}, each routed back to its desk\n${bullets(bad, (e) => `${clip(e.summary, 60)}: ${clip(e.result, 110)}`)}` : "",
    pend.length ? `**WAITING ON YOU** ${pend.length}\n${bullets(pend, (p) => `${clip(p.summary, 80)} (${p.author || "Corvid"})`)}` : "",
    vetoes.length ? `**VETOED BY REGENT** ${vetoes.length}\n${vetoes.slice(0, 5).map((l) => `• ${clip(l.text, 110)}`).join("\n")}` : "",
  ].filter(Boolean).join("\n");
}
export async function sendDailyBrief(force = false) {
  const day = etDayKey();
  if (!force && state.lastBriefDay === day) return { ok: false, msg: "already sent today" };
  const card = dailyBriefCard();
  state.lastBriefDay = day;
  saveState();
  if (!card) return { ok: false, msg: "nothing happened today, so no brief" };
  await send(card);
  return { ok: true };
}

// one card per ask, check and X pre-attached: a reaction is a ruling
const OWNER_ID = (process.env.DISCORD_OWNER_ID || "").trim();
async function sendAskCard(p) {
  const content = askCard(p);
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
  const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n(?:WHAT|WHY|CURRENT|NEW|GREEN LIGHT MEANS|ANGLE):|$)`, "i");
  const m = String(detail).match(re);
  return m ? m[1].trim() : "";
}

// what "the brand" looks like in each repo: the files a new colour or
// typeface is compared against, so product pages keep their own palette
const BRAND_REFS = { site: ["assets/site.css"], korvus: ["korvus_landing.html", "korvus_lodestone.html"], crown: ["index.html"] };
let refCache = {};
function brandReference(rootKey, rootDir) {
  const c = refCache[rootKey];
  if (c && Date.now() - c.at < 10 * 60000) return c.text;
  let text = "";
  for (const f of BRAND_REFS[rootKey] || []) {
    try {
      text += fs.readFileSync(path.join(rootDir, f), "utf8").slice(0, 400000) + "\n";
    } catch {}
  }
  try {
    text += String((brainFile("Page-Frame.md") || {}).body || "");
  } catch {}
  refCache[rootKey] = { at: Date.now(), text };
  return text;
}

// labels the desks use for page edits besides the official title/meta/content
const EDIT_KINDS = /^(edit|copy|copyedit|cta|fix|seo|html|text|page|update|change|rewrite|hero|button|ux|conversion|ab_?test|experiment|layout|section)$/;

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

// Read-only view of a site or product file, for the desks that write the
// fixes. Same address rules as an edit (so never .env, never outside the
// repos). Returns a window of the file: around "find" when given, otherwise
// the head and the first stretch of the body.
export function readPageSource(page, find = "", max = 7000) {
  const r = resolveSiteFile(page);
  if (r.err) return { err: r.err };
  if (!fs.existsSync(r.full)) return { err: `${page} does not exist yet` };
  const text = fs.readFileSync(r.full, "utf8");
  let at = 0;
  const needle = String(find || "").trim();
  if (needle) {
    const i = text.toLowerCase().indexOf(needle.toLowerCase());
    if (i >= 0) at = Math.max(0, i - Math.floor(max / 3));
    else return { err: `"${needle.slice(0, 60)}" is not in ${page}`, size: text.length };
  }
  return { page, size: text.length, from: at, text: text.slice(at, at + max), more: at + max < text.length };
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
    if (count(after, /<head\b/gi) > Math.max(1, count(before, /<head\b/gi))) return "the result duplicated the head tag";
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
        // the filing desk's own vault first: a page a desk's minion wrote lives
          // in that desk's vault, not Corvid's
          body = noteBody(fromNote[1].trim(), String(p.author || "")) || String((brainFile(fromNote[1].trim()) || {}).body || "");
      } catch {
        body = "";
      }
      if (!body.trim()) {
        return { ok: false, msg: `vault note ${fromNote[1].trim()} is empty or missing; have the minion write the full page there first` };
      }
      body = body.replace(/^```(html)?\s*/i, "").replace(/```\s*$/i, "");
      const doc = body.match(/<!doctype html>[\s\S]*?<\/html>/i);
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
  // the no-dash law covers the words Regent writes, not the rest of the
  // file: a stylesheet marker like content:"\2013" elsewhere stays as is
  const next = String(section(p.detail, "NEW") || "").replace(/\s*[\u2014\u2013]\s*/g, ", ");
  if (!next) return { ok: false, msg: "proposal has no NEW block to apply" };
  let updated = null;
  let how = "";
  if (creating) {
    // a brand new page is all Regent's words, so the whole thing is scrubbed
    updated = String(createBody || next).replace(/\s*[\u2014\u2013]\s*/g, ", ").trim() + "\n";
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
  const invalid = await validateEdit(file, html, updated);
  if (invalid) {
    return { ok: false, msg: `safety guard blocked the write: ${invalid}` };
  }
  const law = brandLaw({ repo: rootKey, file, before: html, after: updated, reference: brandReference(rootKey, rootDir) });
  if (law) {
    return { ok: false, msg: `brand law blocked the write: ${law}` };
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
  try {
    if (deps.indexNow) deps.indexNow(rootKey, file);
  } catch {}
  return { ok: true, msg: `${file} updated live (${how})${score}. ${sync}.` };
}

// self repair: when a site edit fails, Regent pulls the live file and
// re-derives the edit itself, grounded in what is actually there, then
// runs it once more through the same executor and safety guard.
const REPAIR_SYSTEM = `You repair a failed website edit for BlackCrownVxJ. You receive an approved proposal and the live file it targets. Output STRICT JSON only, one of:
{"current":"...","new":"..."}  or  {"done":true}
Rules:
- "current" is copied byte for byte from the LIVE FILE below, unique within it, under 400 characters. Never invent or paraphrase it.
- "new" is the exact final text that replaces "current" and fulfills the proposal's intent. The proposal's own CURRENT may be a guess at the markup: find the live element it means (same role on the page, for example the hero's primary or secondary button) and change only what the proposal changes (its words, its link target), keeping the live classes and attributes.
- To ADD meta or link head tags, or sitemap url entries, set "current" to "none" and make "new" only those tags or entries; the executor merges them safely.
- If the live file already satisfies the proposal, output {"done":true}.
- Escape every line break inside strings as \\n. The whole output must pass JSON.parse.
- Never use em dashes anywhere, write a comma or the word "to" instead.`;

// the part of a big file the repair model should see: around the words the
// ask quotes, else its link targets, else its summary words, searched in the
// body so a stylesheet rule named "hero" never wins over the hero itself.
// The old head-and-tail cut never showed a mid-page hero, so repairs of
// long pages came back empty.
const REPAIR_STOP = new Set(["text", "change", "button", "link", "page", "test", "with", "from", "that", "this", "copy", "home", "korvus", "update", "wording", "clicks", "free"]);
function repairWindow(body, p, size = 7000) {
  if (body.length <= size) return body;
  const cur = String(section(p.detail, "CURRENT") || "");
  const text = cur.replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
  const attrs = [...cur.matchAll(/(?:href|id|src)\s*=\s*["']([^"']{2,})["']/gi)].map((m) => `"${m[1]}"`);
  const words = String(p.summary || "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !REPAIR_STOP.has(w));
  const lower = body.toLowerCase();
  const start = Math.max(0, lower.indexOf("<body"));
  let at = -1;
  for (const n of [text, ...attrs, ...words]) {
    if (!n || n.length < 3) continue;
    const i = lower.indexOf(n.toLowerCase(), start);
    if (i >= 0) {
      at = i;
      break;
    }
  }
  if (at < 0) return body.slice(0, 5200) + "\n...[middle of file omitted]...\n" + body.slice(-1800);
  const from = Math.max(0, at - 2500);
  return (from ? "...[earlier part of the file omitted]...\n" : "") + body.slice(from, from + size) + (from + size < body.length ? "\n...[rest of the file omitted]..." : "");
}

async function selfRepair(p, failMsg) {
  const loc = resolveSiteFile(p.page);
  if (loc.err) return null;
  let body;
  try {
    body = fs.readFileSync(loc.full, "utf8");
  } catch {
    return null;
  }
  const excerpt = repairWindow(body, p);
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
    return { ok: true, msg: "rendering, package lands in the channel" };
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
      angle: angleOf(p.detail),
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
    // the law is checked again at the moment of writing, after the approval
    const why = engineLaw({ current, next, engine: "" });
    if (why) return { ok: false, msg: `engine law blocked the write: ${why}` };
    const sid = (String(p.page).match(/^make:(\d+)/i) || [])[1];
    return deps.makeEdit({ scenarioId: sid, current, next });
  }
  // a page edit is a page edit whatever label the desk wrote on it ("edit",
  // "copy", "cta"...): the shape outranks the tag, same as SCHEDULE above
  const kind = String(p.kind || "").trim().toLowerCase();
  const fileEdit =
    !["post", "creative", "job", "automation", "campaign", "brain"].includes(kind) &&
    !!section(p.detail, "NEW") &&
    !resolveSiteFile(p.page).err;
  if (["title", "meta", "content", "other"].includes(kind) || EDIT_KINDS.test(kind) || fileEdit) {
    let r = await executeSiteEdit(p);
    if (!r.ok && !/not set up on this server|not a file I can edit|write failed/i.test(r.msg)) {
      log("repair", `#${p.number}: ${r.msg}. Running self repair against the live file.`);
      try {
        const r2 = await selfRepair(p, r.msg);
        if (r2 && r2.ok) {
          r = { ok: true, msg: `${r2.msg} (self repaired)` };
        } else if (r2) {
          r = { ok: false, msg: `${r.msg}. Self repair also failed: ${r2.msg}` };
        } else {
          r = { ok: false, msg: `${r.msg}. Self repair could not place it either; the desk must read the page and refile with CURRENT copied exactly` };
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
  // a plan with no schedule is a decision on record, nothing to run
  if (kind === "campaign") {
    return { ok: true, msg: "plan approved and logged. It carries no SCHEDULE line, so nothing runs on the server; its pieces ship as their own content, post or job asks." };
  }
  // never report DONE for something that did not happen: this goes back to
  // the desk that filed it, as a failure, so it gets refiled in a shape the
  // executor can carry out
  return {
    ok: false,
    msg: `NOT applied: a "${p.kind || "?"}" ask on "${p.page || "?"}" is not something I can execute. Page edits need a real file (bare name, korvus:path or crown:path) with exact CURRENT and NEW blocks; reports need kind job with SCHEDULE and CHANNEL lines.`,
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
  // a site change that shipped gets measured a week later
  const measured = Boolean(r.ok && (["title", "meta", "content"].includes(String(p.kind || "").toLowerCase()) || EDIT_KINDS.test(String(p.kind || "").toLowerCase())) && p.page && !/^make(:|$)/i.test(String(p.page)));
  if (measured) bookMeasurement(p.number, p.page, p.summary);
  log(r.ok ? "exec" : "error", `#${p.number} ${r.ok ? "done" : "failed"}: ${r.msg}`);
  await send(doneCard(p, r, measured));
  if (!r.ok && deps.assignFix) {
    try {
      deps.assignFix(p.author || "Corvid", `Fix and refile #${p.number}: ${r.msg.slice(0, 150)}`);
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
    const out = await think(INITIATIVE_SYSTEM, user, 1400, { priority: "background" });
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
    try {
      const b = deps.briefSettings ? deps.briefSettings() : { on: true, time: "20:00" };
      const now = new Date().toLocaleTimeString("en-GB", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit" });
      if (state.enabled && b.on && state.lastBriefDay !== etDayKey() && now >= b.time) sendDailyBrief().catch(() => {});
    } catch {}
  }, 60 * 1000);
  setInterval(() => {
    if (!state.enabled || initiativeBusy) return;
    if (canSpend() && (!state.lastInitiativeAt || Date.now() - state.lastInitiativeAt >= INITIATIVE_EVERY_H * 3600000)) {
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
