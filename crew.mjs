// crew.mjs: the floor's shared rules, so five desks work like one crew.
//
// 1. The request ledger. Every desk-to-desk ask is recorded once. A repeat of
//    an open ask merges into it, a desk holds at most two open asks to any
//    other desk, the same ask from a second desk joins the first, and asks
//    expire after a day. The desks stop asking each other the same thing
//    every cycle.
// 2. The tool-gap list. What no desk and no tool can see. A desk answers
//    CAN'T SEE once, the gap lands here for the owner, and nobody asks for it
//    again until he closes it.
// 3. Wake rules. A request from another desk nudges the receiver's task engine
//    at most once every 15 minutes; it never orders a full paid cycle.
// 4. Queue hygiene. Duplicate tasks merge, open queues cap at 15, tasks with no
//    movement for 72 hours close, and a cycle's task list merges into the
//    queue instead of replacing it, so page sources, parks, waits and
//    measurements survive the cycle.
// 5. Eyes for minions. A minion brief that names a page gets that page's real
//    title, headings, links and visible text attached by the server, so no
//    minion ever works blind or asks a desk to paste html.
//
// This module imports nothing from the desks, so every desk can use it.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { tune } from "./tuning.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREW_PATH = process.env.CREW_STATE_PATH || path.join(__dirname, "studio-crew.json");
// live dials from the owner's tuner (Settings tab), .env values as defaults
export const queueCap = () => Math.max(5, Number(tune.queueCap()) || 15);
export const staleHours = () => Math.max(12, Number(tune.staleHours()) || 72);
export const wakeGapMin = () => Math.max(1, Number(tune.wakeGapMin()) || 15);
const REQUEST_TTL_H = 24;
const MAX_OPEN_PER_PAIR = 2;
const DUP_AT = 0.55; // similarity at which two asks or two tasks are the same thing
const GAP_AT = 0.5;
const TICKET_AT = 0.45;
const TICKET_QUIET_DAYS = 7; // an open ticket nobody has hit again for this long closes itself

// ---------------------------------------------------------------------------
// state
// ---------------------------------------------------------------------------
function fresh() {
  return { requests: [], gaps: [], tickets: [], wakes: {}, digestDay: "" };
}
let crew = load();
function load() {
  try {
    return { ...fresh(), ...JSON.parse(fs.readFileSync(CREW_PATH, "utf8")) };
  } catch {
    return fresh();
  }
}
function save() {
  try {
    fs.writeFileSync(CREW_PATH, JSON.stringify(crew, null, 2));
  } catch {
    // best effort, like every other state file on this box
  }
}
const id = (n = 3) => crypto.randomBytes(n).toString("hex");
const deskKey = (s) => String(s || "").trim().toLowerCase();

// ---------------------------------------------------------------------------
// similarity: cheap word overlap, good enough to see that "Paste live Observer
// CTA text with URL and capture time" and "Paste live Observer CTA text, page
// URL and capture time, verbatim" are the same ask
// ---------------------------------------------------------------------------
const STOP = new Set(
  (
    "a an the and or but to of for from with without by on in at as is are be been it its this that these those " +
    "me my your our you we i us them they their so can could would should will just now today tonight this cycle " +
    "please send paste give share post return reply confirm provide get pull tell show copy copied " +
    "verbatim exact exactly literal literally full complete whole same again still current currently live " +
    "desk desks text line lines string html find"
  ).split(/\s+/)
);
export function words(s) {
  const out = new Set();
  const clean = String(s || "")
    .toLowerCase()
    .replace(/^\s*(from\s+)?(corvid|herald|steward|bard|regent)\s*:\s*/, "")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, " ");
  for (let w of clean.split(/\s+/)) {
    if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1);
    if (w.length < 2 || STOP.has(w)) continue;
    out.add(w);
  }
  return out;
}
export function similarity(a, b) {
  const A = words(a);
  const B = words(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  const jaccard = inter / (A.size + B.size - inter);
  const small = Math.min(A.size, B.size);
  const contain = small >= 3 ? (inter / small) * 0.85 : 0;
  return Math.max(jaccard, contain);
}

// ---------------------------------------------------------------------------
// 1 and 2: the request ledger and the tool-gap list
// ---------------------------------------------------------------------------
function sweep() {
  const now = Date.now();
  let changed = false;
  for (const r of crew.requests) {
    if (r.status === "open" && now - r.at > REQUEST_TTL_H * 3600000) {
      r.status = "expired";
      r.closedAt = now;
      changed = true;
    }
  }
  for (const t of crew.tickets || []) {
    if (t.status === "open" && now - (t.lastAt || t.firstAt) > TICKET_QUIET_DAYS * 864e5) {
      t.status = "expired";
      t.closedAt = now;
      changed = true;
    }
  }
  if (changed) save();
}

// Decide whether a desk-to-desk ask goes through. Returns {ok, id} when it is
// new, or {ok:false, reason} when it merged, hit the pair cap, or names
// something on the tool-gap list. A refused ask costs nothing: no task, no wake.
export function admitRequest(from, to, ask) {
  sweep();
  from = deskKey(from);
  to = deskKey(to);
  const text = String(ask || "").trim().replace(/^from \w+:\s*/i, "");
  if (!text || !to || from === to) return { ok: false, reason: "empty ask or an ask to yourself" };
  const gap = crew.gaps.find((g) => g.status === "open" && similarity(g.what, text) >= GAP_AT);
  if (gap) {
    gap.asks = (gap.asks || 0) + 1;
    save();
    return { ok: false, gap: true, reason: `no desk can see that, it is on the owner's tool-gap list ("${gap.what}")` };
  }
  const openPair = crew.requests.filter((r) => r.status === "open" && r.from === from && r.to === to);
  const dup = openPair.find((r) => similarity(r.ask, text) >= DUP_AT);
  if (dup) {
    dup.repeats = (dup.repeats || 0) + 1;
    dup.lastAskedAt = Date.now();
    save();
    return { ok: false, dup: true, id: dup.id, reason: `already asked ${to} (request ${dup.id}), still open` };
  }
  const joined = crew.requests.find((r) => r.status === "open" && r.to === to && similarity(r.ask, text) >= DUP_AT);
  if (joined) {
    joined.alsoFrom = [...new Set([...(joined.alsoFrom || []), from])];
    save();
    return { ok: false, dup: true, id: joined.id, reason: `${joined.from} already asked ${to} the same thing (request ${joined.id})` };
  }
  if (openPair.length >= MAX_OPEN_PER_PAIR) {
    return { ok: false, reason: `${to} already holds ${openPair.length} open asks from ${from}; wait for those answers` };
  }
  const r = { id: id(), from, to, ask: text.slice(0, 160), at: Date.now(), status: "open" };
  crew.requests.push(r);
  crew.requests = crew.requests.slice(-200);
  save();
  return { ok: true, id: r.id };
}
export function closeRequest(reqId, how = "answered", note = "") {
  if (!reqId) return null;
  const r = crew.requests.find((x) => x.id === reqId);
  if (!r || r.status !== "open") return null;
  r.status = how;
  r.closedAt = Date.now();
  if (note) r.note = String(note).slice(0, 160);
  save();
  return r;
}
export function findRequest(reqId) {
  return crew.requests.find((x) => x.id === reqId) || null;
}
export function openRequests() {
  sweep();
  return crew.requests.filter((r) => r.status === "open");
}

export function recordGap(desk, what, context = "") {
  const text = String(what || "").trim().replace(/—|–/g, ", ").slice(0, 140);
  if (!text) return null;
  const g = crew.gaps.find((x) => x.status === "open" && similarity(x.what, text) >= GAP_AT);
  if (g) {
    g.count = (g.count || 1) + 1;
    g.desks = [...new Set([...(g.desks || []), deskKey(desk)])];
    g.lastAt = Date.now();
    save();
    return g;
  }
  const n = {
    id: id(),
    what: text,
    context: String(context || "").slice(0, 160),
    desks: [deskKey(desk)],
    count: 1,
    firstAt: Date.now(),
    lastAt: Date.now(),
    status: "open",
    reported: false,
  };
  crew.gaps.push(n);
  crew.gaps = crew.gaps.slice(-60);
  save();
  return n;
}
export function closeGap(gapId) {
  const g = crew.gaps.find((x) => x.id === gapId);
  if (!g) return null;
  g.status = "closed";
  g.closedAt = Date.now();
  save();
  return g;
}
// a one-time sweep: when a release wires the tools behind the open gaps, their
// cards close once so the desks stop routing around walls that are gone
export function sweepGaps(flag, note) {
  crew.flags = crew.flags || {};
  if (crew.flags[flag]) return 0;
  let n = 0;
  for (const g of crew.gaps) {
    if (g.status !== "open") continue;
    g.status = "closed";
    g.closedAt = Date.now();
    g.note = note;
    n++;
  }
  crew.flags[flag] = Date.now();
  save();
  return n;
}
export function openGaps() {
  return crew.gaps.filter((g) => g.status === "open");
}
// One digest a day of gaps the owner has not heard about yet. Returns the
// text to send, or "" when there is nothing new or it already went today.
export function gapDigest(day) {
  if (crew.digestDay === day) return "";
  const fresh = openGaps().filter((g) => !g.reported);
  if (!fresh.length) return "";
  crew.digestDay = day;
  for (const g of fresh) g.reported = true;
  save();
  return [
    "**CREW // TOOL GAPS**",
    "The desks hit these walls and stopped asking each other about them. Each one needs a tool, a feed, or your word:",
    ...fresh.map((g) => `- ${g.what} (${g.desks.join(", ")}, hit ${g.count}x)`),
    "Close one in the admin once it is wired or no longer matters.",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// 2b: owner tickets. A gap is something a desk cannot SEE. A ticket is
// something a desk can see is broken or blocked and cannot CHANGE with any
// proposal: how a server behaves, a setting, a balance, a quota, an
// owner-only file. A person in the role would raise it once with the
// evidence and get on with other work; this is that. One ticket per problem
// across all desks, one card to the owner, and every desk sees it is handled.
// ---------------------------------------------------------------------------
const clean = (x, n) => String(x || "").trim().replace(/\u2014|\u2013/g, ", ").replace(/\s+/g, " ").slice(0, n);
export function sameAsTicket(text) {
  sweep();
  const t = clean(text, 220);
  if (!t) return null;
  return (crew.tickets || []).find((x) => x.status === "open" && similarity(x.what, t) >= TICKET_AT) || null;
}
export function recordTicket(desk, what, evidence = "") {
  const text = clean(what, 220);
  if (!text) return null;
  crew.tickets = crew.tickets || [];
  const t = sameAsTicket(text);
  if (t) {
    t.count = (t.count || 1) + 1;
    t.desks = [...new Set([...(t.desks || []), deskKey(desk)])];
    t.lastAt = Date.now();
    if (evidence && !t.evidence) t.evidence = clean(evidence, 240);
    save();
    return t;
  }
  const n = {
    id: id(),
    what: text,
    evidence: clean(evidence, 240),
    desks: [deskKey(desk)],
    count: 1,
    firstAt: Date.now(),
    lastAt: Date.now(),
    status: "open",
    reported: false,
  };
  crew.tickets.push(n);
  crew.tickets = crew.tickets.slice(-40);
  save();
  return n;
}
export function closeTicket(ticketId, note = "") {
  const t = (crew.tickets || []).find((x) => x.id === ticketId);
  if (!t) return null;
  t.status = "closed";
  t.closedAt = Date.now();
  if (note) t.note = clean(note, 200);
  save();
  return t;
}
export function openTickets() {
  sweep();
  return (crew.tickets || []).filter((t) => t.status === "open");
}
// tickets the owner has not been shown yet, as one card. "" when none.
export function ticketCard() {
  const fresh = openTickets().filter((t) => !t.reported);
  if (!fresh.length) return "";
  for (const t of fresh) t.reported = true;
  save();
  return [
    "**CREW // OWNER TICKETS**",
    "The desks found these and no proposal of theirs can change them. Each needs you or your engineer:",
    ...fresh.map((t) => `- ${t.what}${t.evidence ? ` Evidence: ${t.evidence}` : ""} (raised by ${t.desks.join(", ")})`),
    "The desks have stopped refiling these and are working on other things. Close one in the Tuner when it is fixed; an untouched ticket closes itself after a week.",
  ].join("\n");
}
// tickets a release opens or settles on the desks' behalf, once per flag
export function seedTickets(flag, list) {
  crew.flags = crew.flags || {};
  if (crew.flags[flag]) return 0;
  let n = 0;
  for (const it of list || []) {
    const t = recordTicket(it.desk || "engineer", it.what, it.evidence || "");
    if (!t) continue;
    t.reported = true; // the owner already knows; no card
    if (it.fixed) {
      t.status = "closed";
      t.closedAt = Date.now();
      t.note = clean(it.fixed, 200);
    }
    n++;
  }
  crew.flags[flag] = Date.now();
  save();
  return n;
}

// ---------------------------------------------------------------------------
// 3: wake rules
// ---------------------------------------------------------------------------
// True at most once per WAKE_GAP_MIN per desk. Callers use it to decide
// whether a desk-to-desk ask may nudge the receiver's task engine now.
export function shouldWake(desk) {
  const k = deskKey(desk);
  const last = crew.wakes[k] || 0;
  if (Date.now() - last < wakeGapMin() * 60000) return false;
  crew.wakes[k] = Date.now();
  save();
  return true;
}

// ---------------------------------------------------------------------------
// 4: queue hygiene
// ---------------------------------------------------------------------------
const isOpen = (t) => t && t.status !== "done";
export function isRequestTask(t) {
  return Boolean(t && (t.reqId || /^\s*(from \w+\s*:|steward\s*:)/i.test(String(t.title || ""))));
}
export function newTask(title, extra = {}) {
  return { id: crypto.randomBytes(4).toString("hex"), title: String(title || "").slice(0, 120), status: "open", createdAt: Date.now(), ...extra };
}
// An open task already on the queue that says the same thing, or null.
export function findTwin(tasks, title) {
  return (tasks || []).find((t) => isOpen(t) && similarity(t.title, title) >= DUP_AT) || null;
}

// Clean a queue in place of the old one. protect(t) marks tasks that must never
// be closed by hygiene (measurements, tasks waiting on a pending proposal).
// Returns {tasks, closed}; the caller closes ledger requests for closed tasks.
export function tidyQueue(list, opts = {}) {
  const cap = opts.cap || queueCap();
  const protect = opts.protect || (() => false);
  const staleMs = (opts.staleHours || staleHours()) * 3600000;
  const keepDone = opts.keepDone ?? 12;
  const now = Date.now();
  const tasks = Array.isArray(list) ? list.filter(Boolean) : [];
  const closed = [];
  const close = (t, why) => {
    t.status = "done";
    t.closed = why;
    t.closedAt = now;
    closed.push(t);
  };
  for (const t of tasks) if (!t.createdAt && !t.seenAt) t.seenAt = now;

  // duplicates: the first one on the queue stays, a twin holding a page source
  // hands it over before it closes
  const kept = [];
  for (const t of tasks.filter(isOpen)) {
    if (protect(t)) {
      kept.push(t);
      continue;
    }
    const twin = kept.find((k) => !protect(k) && similarity(k.title, t.title) >= DUP_AT);
    if (twin) {
      if (t.source && !twin.source) twin.source = t.source;
      twin.merged = (twin.merged || 0) + 1;
      close(t, `duplicate of "${String(twin.title).slice(0, 60)}"`);
    } else kept.push(t);
  }
  // stale: no step, no birth, no sighting in STALE_HOURS
  for (const t of kept) {
    if (!isOpen(t) || protect(t)) continue;
    if (t.parkUntil && t.parkUntil > now) continue;
    const last = Math.max(t.lastStepAt || 0, t.createdAt || 0, t.seenAt || 0);
    if (now - last > staleMs) close(t, `stale, no movement in ${Math.round(staleMs / 3600000)} hours`);
  }
  // cap: close asks from other desks first, oldest first, then the rest oldest first
  const openNow = () => tasks.filter(isOpen).length;
  if (openNow() > cap) {
    const order = tasks
      .map((t, i) => ({ t, i }))
      .filter((x) => isOpen(x.t) && !protect(x.t))
      .sort((a, b) => Number(isRequestTask(b.t)) - Number(isRequestTask(a.t)) || a.i - b.i);
    for (const { t } of order) {
      if (openNow() <= cap) break;
      close(t, `queue cap, the desk holds ${cap} open tasks at most`);
    }
  }
  // keep every open task and only the most recent finished ones
  const done = tasks
    .filter((t) => !isOpen(t))
    .sort((a, b) => (b.closedAt || b.lastStepAt || 0) - (a.closedAt || a.lastStepAt || 0))
    .slice(0, keepDone);
  const keepIds = new Set([...tasks.filter(isOpen), ...done].map((t) => t.id));
  return { tasks: tasks.filter((t) => keepIds.has(t.id)), closed };
}

// A cycle restates the desk's task list. Merge it into the queue instead of
// replacing it: a restated task keeps its id, page source, park, wait and
// request link; a task the cycle forgot survives only when it is protected or
// holds a page source mid-read. Returns {tasks, dropped}.
export function mergeCycleTasks(prev, out, opts = {}) {
  const max = opts.max || 8;
  const protect = opts.protect || (() => false);
  const before = Array.isArray(prev) ? prev.filter(Boolean) : [];
  const used = new Set();
  const next = [];
  const dropped = [];
  for (const raw of (Array.isArray(out) ? out : []).slice(0, max)) {
    const title = String((raw && raw.title) || "").trim().slice(0, 120);
    if (!title) continue;
    const status = ["open", "doing", "done"].includes(raw.status) ? raw.status : "open";
    let best = null;
    let bestScore = 0;
    for (const p of before) {
      if (used.has(p.id)) continue;
      const s = similarity(p.title, title);
      if (s > bestScore) {
        bestScore = s;
        best = p;
      }
    }
    if (best && bestScore >= DUP_AT) {
      used.add(best.id);
      next.push({ ...best, status });
    } else {
      next.push(newTask(title, { status }));
    }
  }
  for (const p of before) {
    if (used.has(p.id) || !isOpen(p)) continue;
    if (protect(p) || p.source) next.push(p);
    else dropped.push(p);
  }
  return { tasks: next, dropped };
}

// The task engine's pick: a task holding a page source it asked for goes first
// (the read is wasted otherwise), then the task stepped longest ago.
export function pickNext(tasks, eligible = () => true) {
  return (tasks || [])
    .filter((t) => isOpen(t) && eligible(t))
    .sort((a, b) => Number(Boolean(b.source)) - Number(Boolean(a.source)) || (a.lastStepAt || 0) - (b.lastStepAt || 0))[0];
}

// ---------------------------------------------------------------------------
// 5: eyes for minions, and the page lines the Board shows every desk
// ---------------------------------------------------------------------------
const REF_RE = /\b((?:korvus|crown):[A-Za-z0-9_./-]+\.(?:html?|md|txt|xml|py|css|js|json))|(?:^|[\s"'(`])([A-Za-z0-9_-]+\.html?)\b/g;
export function pageRefs(text) {
  const out = [];
  for (const m of String(text || "").matchAll(REF_RE)) {
    const ref = m[1] || m[2];
    if (ref && !out.includes(ref)) out.push(ref);
  }
  return out.slice(0, 2);
}
function strip(h) {
  return String(h || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
function cleanHtml(src) {
  return String(src || "")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(style|script|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/data:[^"')\s]+/g, "data-uri");
}
function linksOf(html) {
  const seen = new Set();
  const out = [];
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = (m[1].match(/href\s*=\s*["']([^"']*)["']/i) || [])[1] || "";
    const label = strip(m[2]);
    if (!label) continue;
    const line = `"${label.slice(0, 80)}" -> ${href.slice(0, 120)}`;
    if (seen.has(line)) continue;
    seen.add(line);
    out.push({ label, href, line });
  }
  return out;
}
// What a minion needs from a page, without the inlined css and base64 noise.
export function digestPage(src) {
  const raw = String(src || "");
  if (!/<html|<body|<h1|<a\b/i.test(raw)) return raw.slice(0, 3000);
  const title = strip((raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const desc = (raw.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1] || "";
  const html = cleanHtml(raw);
  const heads = [...html.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => `h${m[1]}: ${strip(m[2]).slice(0, 140)}`)
    .filter((s) => s.length > 4)
    .slice(0, 14);
  const links = linksOf(html).slice(0, 24).map((l) => l.line);
  const body = strip(html.replace(/<head\b[\s\S]*?<\/head>/i, " ")).slice(0, 2400);
  return [
    `TITLE: ${title || "(none)"}`,
    desc ? `META DESCRIPTION: ${desc}` : "",
    heads.length ? `HEADINGS:\n${heads.join("\n")}` : "",
    links.length ? `LINKS (visible text -> href):\n${links.join("\n")}` : "",
    `VISIBLE TEXT (from the top):\n${body}`,
  ]
    .filter(Boolean)
    .join("\n");
}
// The few lines every desk keeps asking for: title, first headline, and the
// calls to action with their exact text and href.
export function keyLines(src) {
  const raw = String(src || "");
  const title = strip((raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const html = cleanHtml(raw);
  const h1 = strip((html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || "");
  const ctas = linksOf(html)
    // by where the link goes (signup, login, checkout, the Crown console at
    // /chat) or by what it says (open, get, try, free...). Crown's buttons all
    // point at /chat, which the old list of words missed entirely.
    .filter((l) =>
      /signup|sign-up|register|join|discord\.gg|upgrade|pricing|checkout|subscribe|trial|login|\/chat(\.html)?([?#]|$)/i.test(l.href) ||
      /\b(sign ?up|join|start|open|get|try|create|upgrade|subscribe|log ?in|free|pricing)\b/i.test(l.label))
    .slice(0, 8)
    .map((l) => l.line);
  return `title "${title.slice(0, 90)}"; h1 "${h1.slice(0, 120)}"; calls to action: ${ctas.join("; ") || "none found"}`;
}
// Attach the real pages a minion's brief names. readPage(page, find, max) is
// the server's reader; a page it cannot open is simply left out.
export function minionEyes(text, readPage) {
  if (typeof readPage !== "function") return "";
  const parts = [];
  for (const ref of pageRefs(text)) {
    try {
      const r = readPage(ref, "", 2000000);
      if (r && !r.err && r.text) {
        parts.push(`LIVE PAGE ${r.page || ref}, read by the server just now, this IS the real page:\n${digestPage(r.text).slice(0, 3600)}`);
      }
    } catch {
      // a page that will not open is left out, never guessed
    }
  }
  return parts.join("\n\n");
}

// ---------------------------------------------------------------------------
// the Board's crew section and the admin view
// ---------------------------------------------------------------------------
export function crewBoardLines() {
  const lines = [];
  const reqs = openRequests();
  const ago = (t) => {
    const m = Math.round((Date.now() - t) / 60000);
    return m < 60 ? `${m}m` : `${Math.round(m / 60)}h`;
  };
  lines.push(
    `OPEN ASKS BETWEEN DESKS (already asked, never ask again, the receiver answers in its own time): ${
      reqs.length ? reqs.slice(-12).map((r) => `${r.from}>${r.to} "${r.ask.slice(0, 70)}" ${ago(r.at)} ago`).join("; ") : "none"
    }`
  );
  const gaps = openGaps();
  lines.push(
    `TOOL GAPS (no desk can see these yet, never ask a desk for them, the owner has the list): ${
      gaps.length ? gaps.slice(-10).map((g) => g.what).join("; ") : "none"
    }`
  );
  const tix = openTickets();
  lines.push(
    `OWNER TICKETS (broken or blocked things no proposal can change; already raised, the owner has them. Never refile one, never file a page edit or a check for one, never spend a task on one, mention it in a log at most once; work on what you can ship): ${
      tix.length ? tix.slice(-10).map((t) => `"${t.what.slice(0, 120)}" raised ${ago(t.firstAt)} ago by ${t.desks.join(", ")}`).join("; ") : "none"
    }`
  );
  const fixed = (crew.tickets || []).filter((t) => t.status === "closed" && Date.now() - (t.closedAt || 0) < 3 * 864e5);
  if (fixed.length) {
    lines.push(`TICKETS SETTLED IN THE LAST 3 DAYS (done, stop routing around them): ${fixed.slice(-6).map((t) => `"${t.what.slice(0, 90)}"${t.note ? `: ${t.note}` : ""}`).join("; ")}`);
  }
  return lines.join("\n");
}
export function crewState() {
  sweep();
  return {
    requests: crew.requests.slice(-60).reverse(),
    gaps: crew.gaps.slice().reverse(),
    tickets: (crew.tickets || []).slice().reverse(),
    rules: { queueCap: queueCap(), staleHours: staleHours(), wakeGapMin: wakeGapMin(), requestTtlHours: REQUEST_TTL_H, maxOpenPerPair: MAX_OPEN_PER_PAIR },
  };
}

// Text the work prompts carry so every desk knows the rules above.
export const CREW_RULES = `CREW RULES, how the desks work together:
- THE BOARD in your data holds the facts every desk keeps needing (live page titles, headlines and calls to action, renders with links, the Bloom balance, the Regent ledger, open asks, tool gaps). Read it before you ask anyone for anything; never ask a desk for something the Board shows.
- Asks to another desk are for WORK only that desk can do (a render, a caption, a page, a test). Never ask a desk to paste data, numbers, html or a balance: read the page yourself with "read", or it is a tool gap.
- CAN'T SEE: when a task needs something no tool and no Board line gives you, set "cant_see" to what is missing (max 12 words) and the task closes. The server puts it on the owner's tool-gap list and answers the asking desk for you. Never re-ask for anything on the tool-gap list.
- CAN'T FIX: when you find something broken or blocked that no proposal of yours can change (how a server behaves, a setting, credits or a balance, a quota, a sign-in or billing flow, an owner-only file), do what a good employee does: raise it ONCE, with the number that proves it. Set "cant_fix" to the problem and its evidence (max 30 words). The task closes, the owner gets one ticket card, and every desk sees it under OWNER TICKETS. Never dress it up as a page edit, never invent a CURRENT for it, and never withdraw quietly and hope.
- One owner per problem: anything under OWNER TICKETS is handled. Do not refile it, do not ask another desk about it, do not make it your focus again. Pick the next thing in YOUR role that you can ship today.
- A bounce is feedback, not a fight: read the reason and fix that exact thing once. If the same ask bounces twice, stop; raise it with cant_fix instead of a third try.
- Stay in your lane: Corvid owns search and the pages, Herald owns sales copy and offers, Bard owns video, Steward owns the schedule and follow-through. When you spot a problem on another desk's ground, send that desk ONE ask or check it is already raised, then return to your own work.
- One open ask per topic: an ask already listed under OPEN ASKS is still in flight; asking again does nothing.
- Your queue holds a capped number of open tasks and duplicates merge, so queue the work that moves a number, not reminders.`;
