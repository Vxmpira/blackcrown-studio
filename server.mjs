// Small render + generation service. The admin page calls this; this calls
// your AWS for rendering and the Anthropic API for writing new ads.
// All keys are read from .env and never leave your machine.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { renderMediaOnLambda, getRenderProgress } from "@remotion/lambda/client";

dotenv.config();

import {
  startAgent,
  wireFeeds,
  runCycle,
  agentState,
  setEnabled,
  addTask,
  sendTest,
  decideProposal,
  retryCreative,
  brainList,
  brainFile,
  brainSave,
  brainDirPath,
  wireHooks,
  thinkText,
  buildEmbeds,
  findProposal,
  bloomCredits,
  agentLog,
  getSpend,
  spendSummary,
  heal as corvidHeal,
  librarian as corvidLibrarian,
} from "./agent.mjs";
import { startGateway, wireGateway } from "./gateway.mjs";
import { usageReport } from "./llm.mjs";
import {
  startCeo,
  wireCeo,
  receiveProposals,
  ownerDecision,
  ceoState,
  ceoSetEnabled,
  ceoBrainList,
  ceoBrainFile,
  ceoBrainSave,
  ceoVaultPath,
  REPO_ROOTS,
  readPageSource,
} from "./ceo.mjs";
import { startStaff, wireStaff, staffStates, staffSetEnabled, staffRunCycle, staffAddTask, heraldCopyPass, staffHeal, staffLibrarian } from "./staff.mjs";
import { execFile as execFileCb } from "child_process";

const region = process.env.REMOTION_AWS_REGION;
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME;
const serveUrl = process.env.REMOTION_SERVE_URL;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB_PATH = path.join(__dirname, "studio-ads.json");
const BRIEF_PATH = path.join(__dirname, "marketing-brief.md");
const STATS_PATH = path.join(__dirname, "studio-stats.json");
const SESS_PATH = path.join(__dirname, "studio-sessions.json");
const UPTIME_PATH = path.join(__dirname, "studio-uptime.json");

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// ----- login (replaces the nginx basic-auth popup) -------------------------
// Set ADMIN_USER and ADMIN_PASSWORD in .env on the server. Until both exist,
// the admin stays locked and the login page explains what to set.
const ADMIN_USER = (process.env.ADMIN_USER || "").trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_DAYS = 30;

function loadSessions() {
  try {
    const s = JSON.parse(fs.readFileSync(SESS_PATH, "utf8"));
    const now = Date.now();
    for (const t of Object.keys(s)) if (!s[t] || s[t].exp < now) delete s[t];
    return s;
  } catch {
    return {};
  }
}
function saveSessions(s) {
  try {
    fs.writeFileSync(SESS_PATH, JSON.stringify(s));
  } catch {
    // disk hiccup: sessions fall back to memory only
  }
}
let sessions = loadSessions();

function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return "";
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) {
    // compare against self to keep timing flat, then fail
    crypto.timingSafeEqual(ab, ab);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

// simple per-IP lockout: 8 failed logins per 15 minutes
const loginFails = new Map();
function failKey(req) {
  return String(req.headers["x-real-ip"] || req.ip || "ip");
}
function tooManyFails(req) {
  const rec = loginFails.get(failKey(req));
  if (!rec) return false;
  if (Date.now() - rec.t > 15 * 60 * 1000) {
    loginFails.delete(failKey(req));
    return false;
  }
  return rec.n >= 8;
}
function noteFail(req) {
  const k = failKey(req);
  const rec = loginFails.get(k);
  if (rec && Date.now() - rec.t <= 15 * 60 * 1000) rec.n += 1;
  else loginFails.set(k, { n: 1, t: Date.now() });
}

function isAuthed(req) {
  const t = readCookie(req, "bc_admin");
  if (!t) return false;
  const s = sessions[t];
  if (!s) return false;
  if (s.exp < Date.now()) {
    delete sessions[t];
    saveSessions(sessions);
    return false;
  }
  return true;
}

app.get("/api/me", (req, res) => {
  res.json({
    authed: isAuthed(req),
    user: ADMIN_USER || null,
    setup: !(ADMIN_USER && ADMIN_PASSWORD),
  });
});

app.post("/api/login", (req, res) => {
  if (!(ADMIN_USER && ADMIN_PASSWORD)) {
    return res.status(503).json({
      error:
        "Login is not configured yet. Add ADMIN_USER and ADMIN_PASSWORD to .env on the server, then restart the service.",
    });
  }
  if (tooManyFails(req)) {
    return res
      .status(429)
      .json({ error: "Too many attempts. Wait 15 minutes and try again." });
  }
  const user = String(req.body?.user ?? "");
  const pass = String(req.body?.pass ?? "");
  const okUser = safeEqual(user, ADMIN_USER);
  const okPass = safeEqual(pass, ADMIN_PASSWORD);
  if (!(okUser && okPass)) {
    noteFail(req);
    return res.status(401).json({ error: "Wrong name or password." });
  }
  loginFails.delete(failKey(req));
  const token = crypto.randomBytes(32).toString("hex");
  sessions[token] = { user, exp: Date.now() + SESSION_DAYS * 864e5 };
  saveSessions(sessions);
  res.set(
    "Set-Cookie",
    `bc_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${
      SESSION_DAYS * 86400
    }`
  );
  res.json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  const t = readCookie(req, "bc_admin");
  if (t && sessions[t]) {
    delete sessions[t];
    saveSessions(sessions);
  }
  res.set("Set-Cookie", "bc_admin=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0");
  res.json({ ok: true });
});

// Everything under /api needs a session, except the public beacon and the
// login endpoints themselves.
const PUBLIC_API = new Set(["/api/track", "/api/login", "/api/logout", "/api/me"]);
app.use("/api", (req, res, next) => {
  // live data, never let the browser or a proxy serve a stale copy
  res.setHeader("Cache-Control", "no-store");
  if (PUBLIC_API.has(req.baseUrl + req.path) || PUBLIC_API.has("/api" + req.path)) {
    return next();
  }
  // the Eclipse-X games are public; players identify through Discord
  if (req.path.startsWith("/activity/")) return next();
  // finished marketing videos are public: Discord, X and the owner's phone
  // open them by link. They live under /api because the web server only
  // forwards /api to this process; anything else gets the admin page.
  if (req.path.startsWith("/renders/")) return next();
  if (isAuthed(req)) return next();
  res.status(401).json({ error: "Not signed in." });
});

function assertConfigured() {
  const missing = [];
  if (!region) missing.push("REMOTION_AWS_REGION");
  if (!functionName) missing.push("REMOTION_LAMBDA_FUNCTION_NAME");
  if (!serveUrl) missing.push("REMOTION_SERVE_URL");
  if (!process.env.REMOTION_AWS_ACCESS_KEY_ID) missing.push("REMOTION_AWS_ACCESS_KEY_ID");
  if (!process.env.REMOTION_AWS_SECRET_ACCESS_KEY) missing.push("REMOTION_AWS_SECRET_ACCESS_KEY");
  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(", ")} in .env. Finish the AWS setup in RUNBOOK.md.`
    );
  }
}

// ----- generated-ad library (persisted to disk) ---------------------------
function loadGenerated() {
  try {
    const list = JSON.parse(fs.readFileSync(LIB_PATH, "utf8"));
    return Array.isArray(list) ? list.map(normalizeAdSpacing) : [];
  } catch {
    return [];
  }
}
function saveGenerated(list) {
  fs.writeFileSync(LIB_PATH, JSON.stringify(list, null, 2));
}

// ----- the marketing brief (the "script" the AI follows) -------------------
// You can edit this from the Settings tab. It is the strategy and voice the
// generator works from. The technical output rules below are appended
// automatically and are NOT editable, so the brief can never break exports.
const DEFAULT_BRIEF = `You are BlackCrown's lead growth marketer and short-form video strategist. You have spent years making vertical video ads that stop the scroll and convert for founder-led brands. You think like a performance marketer, not a poet.

EVERY AD HAS ONE JOB: stop the scroll, create tension, deliver a payoff, and drive one action. If a line does not earn the next second of attention, cut it.

AUDIENCE: independent operators. Traders watching the open and solo founders shipping after hours. They are smart, skeptical, allergic to corporate hype, and proud of doing it themselves. Speak to their identity and their frustration with gatekeepers and tools built for big institutions.

STRUCTURE every ad:
1. Hook (first scene): earn the next second. Open with a pattern interrupt, a bold or contrarian claim, a direct callout to the viewer, a sharp tension, or a number. Never open with a logo or a soft warm-up.
2. Build (middle scenes): agitate the problem or escalate the idea using concrete, specific language. No filler, no buzzwords.
3. Turn (payoff): position the BlackCrown product as the resolution, framed as an outcome and a benefit, never a feature list.
4. Close: one clear next action.

VARY THE HOOK every time so the feed never feels templated. Rotate between a question, a bold claim, a callout, a contrarian take, a short story, and a stat.

VOICE: confident, direct, a little defiant. The signature idea is that a crown is not handed down, it is built. Sound like a sharp operator talking to a peer, never like a brand talking down to a customer.

PUNCTUATION: never use em dashes or en dashes, not in the lines and not in the caption. Use a period or a comma instead. This is a hard brand rule, no exceptions.

THE CAPTION is your distribution engine. Write it to earn saves and shares, speak to one person, and end with a clear nudge to the link in bio.

PRODUCTS you can feature:
- Korvus Industries: a real-time market news and intel terminal for traders.
- BlackCrown Intelligence: a personal AI tuned to how the user thinks.
- The Collective: a private network (Discord) for independent operators.
You can also write a brand-level ad about BlackCrown as a whole.`;

const OUTPUT_RULES = `OUTPUT RULES (these are fixed, follow them exactly):
- Never use em dashes or en dashes ( the long dash characters ) anywhere, in the lines or the caption. Use a period or a comma instead.
- Spacing: every line must read as natural words separated by single spaces. When you split a line into segments to accent a word, keep the spaces inside the segments, for example [{"t":"Others "},{"t":"were","accent":true},{"t":" already in."}] so the words never run together.
- Each on-screen line must be SHORT so it fits the frame: aim for 18 characters or fewer per line, never more than 24.
- 3 or 4 scenes. Each scene has 1 or 2 lines.
- Mark at most one or two key words per ad with accent (neon pink) by setting "accent": true on that segment.
- A line is an array of segments. To accent only one word, split the line, e.g. [{"t":"You "},{"t":"build","accent":true},{"t":" it."}].
- durationInFrames is at 30fps: use 50 to 60 per scene.
- caption is the post text (not shown in the video): 1 to 3 sentences, end with "Link in bio."
- hashtags: 4 to 5 items, each starting with #, and always include "#BlackCrown".

Return ONLY a single JSON object, no markdown, no backticks, in exactly this shape:
{"scenes":[{"eyebrow":"optional short label","lines":[[{"t":"text","accent":false}]],"durationInFrames":54}],"cta":"blackcrownvxj.com","caption":"...","hashtags":["#BlackCrown"]}`;

function readBrief() {
  try {
    const t = fs.readFileSync(BRIEF_PATH, "utf8");
    if (t && t.trim()) return t;
  } catch {
    // not created yet
  }
  // seed the file so it is editable, then use the default
  try {
    fs.writeFileSync(BRIEF_PATH, DEFAULT_BRIEF);
  } catch {
    // read-only fs, fall back to in-memory default
  }
  return DEFAULT_BRIEF;
}

// ----- render --------------------------------------------------------------
app.post("/api/render", async (req, res) => {
  try {
    assertConfigured();
    const { compositionId, inputProps } = req.body ?? {};
    if (!compositionId) throw new Error("compositionId is required");
    const { renderId, bucketName } = await renderMediaOnLambda({
      region,
      functionName,
      serveUrl,
      composition: compositionId,
      inputProps: inputProps ?? {},
      codec: "h264",
      framesPerLambda: 200,
      privacy: "public",
    });
    res.json({ renderId, bucketName });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "render error" });
  }
});

app.get("/api/progress", async (req, res) => {
  try {
    assertConfigured();
    const { renderId, bucketName } = req.query;
    const p = await getRenderProgress({
      renderId: String(renderId),
      bucketName: String(bucketName),
      functionName,
      region,
    });
    res.json({
      done: p.done,
      overallProgress: p.overallProgress,
      outputFile: p.outputFile ?? null,
      error: p.fatalErrorEncountered
        ? p.errors?.[0]?.message ?? "Render failed on AWS."
        : undefined,
    });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "progress error" });
  }
});

// ----- ad library ----------------------------------------------------------
app.get("/api/ads", (_req, res) => {
  res.json({ ads: loadGenerated() });
});

app.delete("/api/ads/:id", (req, res) => {
  const list = loadGenerated().filter((a) => a.id !== req.params.id);
  saveGenerated(list);
  res.json({ ok: true });
});

// ----- marketing brief (the editable script) -------------------------------
app.get("/api/brief", (_req, res) => {
  res.json({ brief: readBrief() });
});

app.post("/api/brief", (req, res) => {
  if (req.body?.reset) {
    fs.writeFileSync(BRIEF_PATH, DEFAULT_BRIEF);
    return res.json({ brief: DEFAULT_BRIEF });
  }
  const brief = String(req.body?.brief ?? "").trim();
  if (!brief) return res.status(400).json({ error: "brief cannot be empty" });
  fs.writeFileSync(BRIEF_PATH, brief);
  res.json({ brief });
});

// ----- config (non-secret status for the Settings tab) ---------------------
app.get("/api/config", (_req, res) => {
  res.json({
    region: region ?? null,
    functionName: functionName ?? null,
    serveUrlSet: Boolean(serveUrl),
    awsKeysSet: Boolean(
      process.env.REMOTION_AWS_ACCESS_KEY_ID &&
        process.env.REMOTION_AWS_SECRET_ACCESS_KEY
    ),
    anthropicKeySet: Boolean(process.env.ANTHROPIC_API_KEY),
    stripeKeySet: Boolean((process.env.STRIPE_SECRET_KEY || "").trim()),
    framesPerLambda: 200,
    generatedCount: loadGenerated().length,
  });
});

// ----- first-party analytics (visits + product click-throughs) ------------
function loadStats() {
  try {
    return JSON.parse(fs.readFileSync(STATS_PATH, "utf8"));
  } catch {
    return {};
  }
}
function saveStats(s) {
  fs.writeFileSync(STATS_PATH, JSON.stringify(s));
}
function dayKey(offset = 0) {
  return new Date(Date.now() - offset * 864e5).toISOString().slice(0, 10);
}

// Turns a raw document.referrer into a short source bucket.
function refBucket(r) {
  let host = "";
  try {
    host = new URL(r).hostname.toLowerCase();
  } catch {
    return "direct";
  }
  if (!host) return "direct";
  if (/blackcrownvxj\.com$/.test(host)) return ""; // internal hop, skip
  if (/google\./.test(host)) return "google";
  if (/bing\.com$/.test(host)) return "bing";
  if (/duckduckgo/.test(host)) return "duckduckgo";
  if (/discord/.test(host)) return "discord";
  if (/(^|\.)t\.co$|twitter\.com$|(^|\.)x\.com$/.test(host)) return "x";
  if (/instagram/.test(host)) return "instagram";
  if (/tiktok/.test(host)) return "tiktok";
  if (/youtube|youtu\.be/.test(host)) return "youtube";
  if (/reddit/.test(host)) return "reddit";
  if (/facebook|fb\.com/.test(host)) return "facebook";
  if (/linkedin/.test(host)) return "linkedin";
  return "other";
}

// Public beacon. The sites call this on each visit and each product click.
// It is the one endpoint that skips the login, by design.
app.get("/api/track", (req, res) => {
  try {
    const e = String(req.query.e || "").slice(0, 16);
    const k = String(req.query.k || "")
      .slice(0, 32)
      .replace(/[^a-z0-9_-]/gi, "");
    if ((e === "visit" || e === "click" || e === "signup") && k) {
      const s = loadStats();
      const d = dayKey();
      s[d] = s[d] || {};
      s[d][e] = s[d][e] || {};
      s[d][e][k] = (s[d][e][k] || 0) + 1;
      if (e === "visit") {
        // device: m (phone) or d (desktop/tablet)
        const dev = String(req.query.d || "") === "m" ? "mobile" : "desktop";
        s[d].dev = s[d].dev || {};
        s[d].dev[dev] = (s[d].dev[dev] || 0) + 1;
        // traffic source from the referrer
        const src = refBucket(String(req.query.r || "").slice(0, 300));
        if (src) {
          s[d].src = s[d].src || {};
          s[d].src[src] = (s[d].src[src] || 0) + 1;
        }
        // hour of day, US Eastern, so "best hours" matches your clock.
        // Some Node builds report midnight as "24", so wrap with % 24.
        const rawHr = new Date()
          .toLocaleString("en-US", { hour: "2-digit", hour12: false, timeZone: "America/New_York" })
          .slice(0, 2);
        const hr = String((parseInt(rawHr, 10) || 0) % 24).padStart(2, "0");
        s[d].hr = s[d].hr || {};
        s[d].hr[hr] = (s[d].hr[hr] || 0) + 1;
      }
      const cutoff = dayKey(120);
      for (const day of Object.keys(s)) if (day < cutoff) delete s[day];
      saveStats(s);
    }
  } catch {
    // never let tracking break a page load
  }
  res.set("Content-Type", "image/gif");
  res.set("Cache-Control", "no-store");
  res.end(
    Buffer.from("R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", "base64")
  );
});

// Read totals (behind the app login).
app.get("/api/stats", (_req, res) => {
  const s = loadStats();
  const days = Object.keys(s).sort();
  const windowSum = (n) => {
    const since = dayKey(n - 1);
    const out = { visit: {}, click: {}, src: {}, dev: {}, hr: {} };
    for (const day of days) {
      if (day < since) continue;
      for (const e of ["visit", "click", "src", "dev", "hr"]) {
        const obj = (s[day] && s[day][e]) || {};
        for (const k of Object.keys(obj)) out[e][k] = (out[e][k] || 0) + obj[k];
      }
    }
    return out;
  };
  const daySum = (day, e) => {
    const obj = (s[day] && s[day][e]) || {};
    return Object.values(obj).reduce((a, b) => a + b, 0);
  };
  const series = [];
  for (let i = 13; i >= 0; i--) {
    const day = dayKey(i);
    series.push({ day, visits: daySum(day, "visit") });
  }
  const series30 = [];
  for (let i = 29; i >= 0; i--) {
    const day = dayKey(i);
    series30.push({ day, visits: daySum(day, "visit"), clicks: daySum(day, "click") });
  }
  // today vs the average of the 7 days before it
  let prev = 0;
  for (let i = 1; i <= 7; i++) prev += daySum(dayKey(i), "visit");
  res.json({
    w7: windowSum(7),
    w30: windowSum(30),
    series,
    series30,
    today: { visits: daySum(dayKey(), "visit"), clicks: daySum(dayKey(), "click") },
    prev7avg: Math.round((prev / 7) * 10) / 10,
  });
});

// ----- uptime watch for the three properties --------------------------------
const WATCH_SITES = [
  { key: "brand", label: "blackcrownvxj.com", url: "https://blackcrownvxj.com" },
  { key: "korvus", label: "korvus.industries", url: "https://korvus.industries" },
  {
    key: "intelligence",
    label: "blackcrown-intelligence.com",
    url: "https://blackcrown-intelligence.com",
  },
];
const UPTIME_KEEP = 288; // 24h of 5-minute checks

function loadUptime() {
  try {
    const u = JSON.parse(fs.readFileSync(UPTIME_PATH, "utf8"));
    return u && typeof u === "object" ? u : {};
  } catch {
    return {};
  }
}
let uptime = loadUptime();
function saveUptime() {
  try {
    fs.writeFileSync(UPTIME_PATH, JSON.stringify(uptime));
  } catch {
    // best effort
  }
}

async function checkSite(site) {
  const started = Date.now();
  let ok = false;
  let status = 0;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 10000);
    const r = await fetch(site.url, {
      redirect: "follow",
      signal: ctl.signal,
      headers: { "user-agent": "BlackCrown-Admin-Uptime/1.0" },
    });
    clearTimeout(t);
    status = r.status;
    ok = r.status >= 200 && r.status < 400;
  } catch {
    ok = false;
  }
  const ms = Date.now() - started;
  const list = uptime[site.key] || [];
  list.push({ t: Date.now(), ok, ms, status });
  uptime[site.key] = list.slice(-UPTIME_KEEP);
}

async function checkAllSites() {
  await Promise.all(WATCH_SITES.map(checkSite));
  saveUptime();
}
checkAllSites().catch(() => {});
setInterval(() => checkAllSites().catch(() => {}), 5 * 60 * 1000);

app.get("/api/uptime", async (req, res) => {
  if (req.query.now) await checkAllSites().catch(() => {});
  const out = WATCH_SITES.map((site) => {
    const list = uptime[site.key] || [];
    const last = list[list.length - 1] || null;
    const dayAgo = Date.now() - 864e5;
    const recent = list.filter((x) => x.t >= dayAgo);
    const okCount = recent.filter((x) => x.ok).length;
    return {
      key: site.key,
      label: site.label,
      url: site.url,
      up: last ? last.ok : null,
      status: last ? last.status : null,
      ms: last ? last.ms : null,
      checkedAt: last ? last.t : null,
      pct24h: recent.length ? Math.round((okCount / recent.length) * 1000) / 10 : null,
    };
  });
  res.json({ sites: out });
});

// ----- AI ad generation ----------------------------------------------------
function stripDashes(s) {
  return String(s).replace(/\s*[\u2014\u2013]\s*/g, ", ");
}

function slugify(s) {
  return (
    String(s || "ad")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 24)
      .replace(/-+$/g, "") || "ad"
  );
}

// Guarantees natural spacing between segments. If one segment ends in a word
// character and the next begins with one, a single space is inserted, so a
// line split for accent coloring can never render words glued together.
function fixSpacing(segs) {
  for (let i = 0; i < segs.length - 1; i++) {
    const a = segs[i] && segs[i].t ? segs[i].t : "";
    const b = segs[i + 1] && segs[i + 1].t ? segs[i + 1].t : "";
    if (!a || !b) continue;
    const wordA = /[A-Za-z0-9]/.test(a[a.length - 1]);
    const wordB = /[A-Za-z0-9]/.test(b[0]);
    if (wordA && wordB) {
      segs[i] = { ...segs[i], t: a + " " };
    }
  }
  return segs;
}

function normalizeAdSpacing(ad) {
  if (!ad || !Array.isArray(ad.scenes)) return ad;
  return {
    ...ad,
    scenes: ad.scenes.map((sc) => ({
      ...sc,
      lines: Array.isArray(sc.lines)
        ? sc.lines.map((line) =>
            Array.isArray(line) ? fixSpacing(line.map((s) => ({ ...s }))) : line
          )
        : sc.lines,
    })),
  };
}

function validateAd(raw) {
  if (!raw || typeof raw !== "object") throw new Error("model returned no ad object");
  const scenes = Array.isArray(raw.scenes) ? raw.scenes.slice(0, 4) : [];
  if (scenes.length < 2) throw new Error("ad needs at least 2 scenes");
  const cleanScenes = scenes.map((sc) => {
    const lines = (Array.isArray(sc.lines) ? sc.lines : []).slice(0, 2).map((line) => {
      const segs = (Array.isArray(line) ? line : [{ t: String(line) }])
        .slice(0, 4)
        .map((seg) => ({
          t: stripDashes(seg && seg.t != null ? seg.t : ""),
          ...(seg && seg.accent ? { accent: true } : {}),
        }))
        .filter((seg) => seg.t.length > 0);
      return segs.length ? fixSpacing(segs) : [{ t: " " }];
    });
    let d = Number(sc.durationInFrames);
    if (!Number.isFinite(d)) d = 54;
    d = Math.max(45, Math.min(70, Math.round(d)));
    const out = { lines: lines.length ? lines : [[{ t: " " }]], durationInFrames: d };
    if (sc.eyebrow) out.eyebrow = stripDashes(sc.eyebrow).slice(0, 28);
    return out;
  });
  let hashtags = Array.isArray(raw.hashtags) ? raw.hashtags : [];
  hashtags = hashtags
    .map((h) => String(h).trim())
    .map((h) => (h.startsWith("#") ? h : "#" + h.replace(/^#*/, "")))
    .filter(Boolean)
    .slice(0, 6);
  if (!hashtags.some((h) => h.toLowerCase() === "#blackcrown")) hashtags.push("#BlackCrown");
  return {
    scenes: cleanScenes,
    cta: raw.cta ? stripDashes(raw.cta).slice(0, 40) : "blackcrownvxj.com",
    caption: stripDashes(raw.caption || "Built for independent operators. Link in bio."),
    hashtags,
  };
}

app.post("/api/generate", async (req, res) => {
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set in .env. Add it (from console.anthropic.com) and restart the service."
      );
    }
    const topic = String(req.body?.topic || "the BlackCrown brand as a whole").slice(0, 200);
    const system = `${readBrief()}\n\n${OUTPUT_RULES}`;
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 1500,
        system,
        messages: [
          {
            role: "user",
            content: `Write one new ad about: ${topic}. Make it distinct from a generic template and pick a hook angle you have not just used. Return only the JSON object.`,
          },
        ],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Anthropic API error (${r.status}): ${t.slice(0, 200)}`);
    }
    const data = await r.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim()
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("could not parse the model's JSON");
      parsed = JSON.parse(m[0]);
    }
    const ad = validateAd(parsed);
    const base = slugify(topic);
    ad.id = `${base}-${Date.now().toString(36).slice(-4)}`;
    ad.generated = true;
    const list = loadGenerated();
    list.push(ad);
    saveGenerated(list);
    res.json({ ad });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "generate error" });
  }
});

// ----- Command tab: box vitals, service status, SSL expiry ------------------
import os from "os";
import tls from "tls";
import { execFile } from "child_process";

const COMMAND_SERVICES = (process.env.COMMAND_SERVICES ||
  "nginx,blackcrown-render,blackcrown-support")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const CERT_HOSTS = [
  "blackcrownvxj.com",
  "admin.blackcrownvxj.com",
  "korvus.industries",
  "blackcrown-intelligence.com",
];

function serviceState(name) {
  return new Promise((resolve) => {
    execFile("systemctl", ["is-active", name], { timeout: 4000 }, (err, stdout) => {
      const state = String(stdout || "").trim() || "unknown";
      resolve({ name, active: state === "active", state });
    });
  });
}

function certDays(host) {
  return new Promise((resolve) => {
    const done = (out) => resolve(out);
    try {
      const sock = tls.connect(
        { host, port: 443, servername: host, timeout: 6000 },
        () => {
          try {
            const cert = sock.getPeerCertificate();
            const validTo = cert && cert.valid_to ? new Date(cert.valid_to) : null;
            const days = validTo
              ? Math.floor((validTo.getTime() - Date.now()) / 864e5)
              : null;
            done({ host, daysLeft: days, validTo: validTo ? validTo.toISOString() : null });
          } catch {
            done({ host, daysLeft: null, validTo: null });
          }
          sock.end();
        }
      );
      sock.on("error", () => done({ host, daysLeft: null, validTo: null }));
      sock.on("timeout", () => {
        sock.destroy();
        done({ host, daysLeft: null, validTo: null });
      });
    } catch {
      done({ host, daysLeft: null, validTo: null });
    }
  });
}

let certCache = { at: 0, list: [] };

app.get("/api/system", async (_req, res) => {
  // vitals
  let disk = null;
  try {
    const st = fs.statfsSync("/");
    const total = st.blocks * st.bsize;
    const free = st.bavail * st.bsize;
    disk = {
      totalGb: Math.round((total / 1073741824) * 10) / 10,
      freeGb: Math.round((free / 1073741824) * 10) / 10,
      usedPct: Math.round(((total - free) / total) * 100),
    };
  } catch {
    // statfs unavailable
  }
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const load = os.loadavg();
  const vitals = {
    disk,
    mem: {
      totalGb: Math.round((totalMem / 1073741824) * 10) / 10,
      usedPct: Math.round(((totalMem - freeMem) / totalMem) * 100),
    },
    load1: Math.round(load[0] * 100) / 100,
    cores: os.cpus().length,
    cpuPct: Math.min(100, Math.round((load[0] / Math.max(1, os.cpus().length)) * 100)),
    bootDays: Math.round((os.uptime() / 86400) * 10) / 10,
  };
  const services = await Promise.all(COMMAND_SERVICES.map(serviceState));
  if (Date.now() - certCache.at > 60 * 60 * 1000) {
    certCache = { at: Date.now(), list: await Promise.all(CERT_HOSTS.map(certDays)) };
  }
  res.json({ vitals, services, certs: certCache.list });
});

// ----- Command tab: money (income and expenses, stored on disk) -------------
const MONEY_PATH = path.join(__dirname, "studio-money.json");

function loadMoney() {
  try {
    const list = JSON.parse(fs.readFileSync(MONEY_PATH, "utf8"));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
function saveMoney(list) {
  fs.writeFileSync(MONEY_PATH, JSON.stringify(list, null, 2));
}

app.get("/api/money", (_req, res) => {
  const entries = loadMoney().sort((a, b) => (a.date < b.date ? 1 : -1));
  // 12-month rollup
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ month: key, income: 0, expense: 0, net: 0 });
  }
  const byKey = Object.fromEntries(months.map((m) => [m.month, m]));
  for (const e of entries) {
    const key = String(e.date || "").slice(0, 7);
    const m = byKey[key];
    if (!m) continue;
    const amt = Number(e.amount) || 0;
    if (e.type === "income") m.income += amt;
    else m.expense += amt;
  }
  for (const m of months) {
    m.income = Math.round(m.income * 100) / 100;
    m.expense = Math.round(m.expense * 100) / 100;
    m.net = Math.round((m.income - m.expense) * 100) / 100;
  }
  res.json({ entries: entries.slice(0, 100), months });
});

app.post("/api/money", (req, res) => {
  const type = req.body?.type === "expense" ? "expense" : "income";
  const product = ["korvus", "crown", "brand"].includes(req.body?.product)
    ? req.body.product
    : "brand";
  const label = String(req.body?.label || "").slice(0, 80).trim();
  const amount = Math.round((Number(req.body?.amount) || 0) * 100) / 100;
  let date = String(req.body?.date || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) date = dayKey();
  if (!label || !amount) {
    return res.status(400).json({ error: "label and a non-zero amount are required" });
  }
  const list = loadMoney();
  const entry = {
    id: crypto.randomBytes(6).toString("hex"),
    date,
    type,
    product,
    label,
    amount,
  };
  list.push(entry);
  saveMoney(list);
  res.json({ entry });
});

app.delete("/api/money/:id", (req, res) => {
  saveMoney(loadMoney().filter((e) => e.id !== req.params.id));
  res.json({ ok: true });
});

// ----- Stripe: live revenue from what customers actually pay ----------------
// Set STRIPE_SECRET_KEY in .env. A restricted read-only key is enough and
// safer: Stripe dashboard, Developers, API keys, Create restricted key, give
// it Read on everything, no writes.
const STRIPE_KEY = (process.env.STRIPE_SECRET_KEY || "").trim();

async function stripeGet(pathAndQuery) {
  const r = await fetch(`https://api.stripe.com/v1/${pathAndQuery}`, {
    headers: { Authorization: `Bearer ${STRIPE_KEY}` },
  });
  const j = await r.json();
  if (!r.ok) {
    throw new Error(j?.error?.message || `Stripe error (${r.status})`);
  }
  return j;
}

const productNameCache = new Map();
async function productName(id) {
  if (!id) return "Other";
  if (productNameCache.has(id)) return productNameCache.get(id);
  try {
    const p = await stripeGet(`products/${id}`);
    const name = p?.name || "Other";
    productNameCache.set(id, name);
    return name;
  } catch {
    return "Other";
  }
}

function monthlyAmount(item) {
  const price = item?.price;
  if (!price || price.unit_amount == null) return 0;
  const qty = item.quantity || 1;
  let amt = (price.unit_amount * qty) / 100;
  const rec = price.recurring || {};
  const count = rec.interval_count || 1;
  if (rec.interval === "year") amt = amt / (12 * count);
  else if (rec.interval === "week") amt = (amt * 4.345) / count;
  else if (rec.interval === "day") amt = (amt * 30.4) / count;
  else amt = amt / count; // month
  return amt;
}

let revenueCache = { at: 0, data: null };

async function buildRevenue() {
  // active + trialing subscriptions -> MRR and per-product split
  const products = {};
  let mrr = 0;
  let subCount = 0;
  for (const status of ["active", "trialing"]) {
    let startingAfter = "";
    for (let page = 0; page < 5; page++) {
      const q = `subscriptions?status=${status}&limit=100${
        startingAfter ? `&starting_after=${startingAfter}` : ""
      }`;
      const res = await stripeGet(q);
      const subs = res.data || [];
      for (const sub of subs) {
        subCount += 1;
        for (const item of sub.items?.data || []) {
          const amt = monthlyAmount(item);
          mrr += amt;
          const name = await productName(item?.price?.product);
          products[name] = (products[name] || 0) + amt;
        }
      }
      if (!res.has_more || !subs.length) break;
      startingAfter = subs[subs.length - 1].id;
    }
  }
  // charges this month (gross collected) + recent payments
  const now = new Date();
  const monthStart = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000
  );
  let monthGross = 0;
  let monthCount = 0;
  const recent = [];
  let startingAfter = "";
  for (let page = 0; page < 5; page++) {
    const q = `charges?limit=100&created[gte]=${monthStart}${
      startingAfter ? `&starting_after=${startingAfter}` : ""
    }`;
    const res = await stripeGet(q);
    const charges = res.data || [];
    for (const c of charges) {
      if (c.paid && c.status === "succeeded" && !c.refunded) {
        monthGross += c.amount / 100;
        monthCount += 1;
        if (recent.length < 10) {
          recent.push({
            t: c.created * 1000,
            amount: c.amount / 100,
            desc: c.description || c.calculated_statement_descriptor || "Payment",
            customer: c.billing_details?.name || c.billing_details?.email || "",
          });
        }
      }
    }
    if (!res.has_more || !charges.length) break;
    startingAfter = charges[charges.length - 1].id;
  }
  const round = (n) => Math.round(n * 100) / 100;
  return {
    configured: true,
    mrr: round(mrr),
    subscribers: subCount,
    monthGross: round(monthGross),
    monthPayments: monthCount,
    products: Object.fromEntries(
      Object.entries(products).map(([k, v]) => [k, round(v)])
    ),
    recent,
    fetchedAt: Date.now(),
  };
}

app.get("/api/revenue", async (req, res) => {
  if (!STRIPE_KEY) return res.json({ configured: false });
  if (!req.query.fresh && revenueCache.data && Date.now() - revenueCache.at < 5 * 60 * 1000) {
    return res.json(revenueCache.data);
  }
  try {
    const data = await buildRevenue();
    revenueCache = { at: Date.now(), data };
    res.json(data);
  } catch (e) {
    res.status(500).json({
      configured: true,
      error: e instanceof Error ? e.message : "Stripe error",
    });
  }
});

// ----- SEO Agent: audits the live site files, AI writes the fixes -----------
const SITE_ROOT = process.env.SITE_ROOT || "/var/www/blackcrown";
const SEO_PATH = path.join(__dirname, "studio-seo.json");

function loadSeo() {
  try {
    return JSON.parse(fs.readFileSync(SEO_PATH, "utf8"));
  } catch {
    return { auditedAt: null, pages: [], reviews: {} };
  }
}
function saveSeo(s) {
  fs.writeFileSync(SEO_PATH, JSON.stringify(s));
}

function grab(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : "";
}
function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function auditPage(file, html, sitemapUrls, skipSitemap = false) {
  const issues = [];
  const title = grab(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDesc = grab(
    html,
    /<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i
  );
  const canonical = grab(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const imgsNoAlt = imgs.filter((t) => !/\salt=["'][^"']+["']/i.test(t)).length;
  const ogTitle = /property=["']og:title["']/i.test(html);
  const ogImage = /property=["']og:image["']/i.test(html);
  const favicon = /rel=["']icon["']/i.test(html);
  const viewport = /name=["']viewport["']/i.test(html);
  const text = stripTags(html);
  const words = text ? text.split(" ").length : 0;
  const inSitemap = sitemapUrls.some((u) => u.endsWith("/" + file) || (file === "index.html" && /blackcrownvxj\.com\/?$/.test(u)));

  if (!title) issues.push({ sev: "high", msg: "Missing <title>" });
  else if (title.length > 60) issues.push({ sev: "med", msg: `Title is ${title.length} chars, Google trims past 60` });
  else if (title.length < 25) issues.push({ sev: "low", msg: `Title is short (${title.length} chars), room for a keyword` });
  if (!metaDesc) issues.push({ sev: "high", msg: "Missing meta description" });
  else if (metaDesc.length > 160) issues.push({ sev: "med", msg: `Meta description is ${metaDesc.length} chars, trims past 160` });
  else if (metaDesc.length < 70) issues.push({ sev: "low", msg: `Meta description is short (${metaDesc.length} chars)` });
  if (!canonical) issues.push({ sev: "med", msg: "No canonical URL" });
  if (h1s === 0) issues.push({ sev: "high", msg: "No <h1> on the page" });
  if (h1s > 1) issues.push({ sev: "med", msg: `${h1s} <h1> tags, keep one` });
  if (imgsNoAlt > 0) issues.push({ sev: "med", msg: `${imgsNoAlt} image${imgsNoAlt === 1 ? "" : "s"} missing alt text` });
  if (!ogTitle) issues.push({ sev: "low", msg: "No og:title, shares look bare" });
  if (!ogImage) issues.push({ sev: "med", msg: "No og:image, no preview card on shares" });
  if (!favicon) issues.push({ sev: "low", msg: "No favicon link" });
  if (!viewport) issues.push({ sev: "high", msg: "No viewport meta, fails mobile-friendly" });
  if (words < 150) issues.push({ sev: "med", msg: `Thin content (${words} words of visible text)` });
  if (!skipSitemap && !inSitemap) issues.push({ sev: "med", msg: "Not listed in sitemap.xml" });

  const weights = { high: 18, med: 9, low: 4 };
  const score = Math.max(
    0,
    100 - issues.reduce((a, i) => a + (weights[i.sev] || 5), 0)
  );
  return {
    file,
    title,
    metaDesc,
    words,
    score,
    issues,
  };
}

const SKIP_PAGES = new Set(["blackcrown-bar.html"]);

const REMOTE_AUDITS = [
  { file: "korvus.industries", url: "https://korvus.industries" },
  { file: "blackcrown-intelligence.com", url: "https://blackcrown-intelligence.com" },
];
let remoteAuditCache = { at: 0, pages: [] };

async function auditRemotes() {
  if (Date.now() - remoteAuditCache.at < 2 * 3600 * 1000) return remoteAuditCache.pages;
  const pages = [];
  for (const t of REMOTE_AUDITS) {
    try {
      const ctl = new AbortController();
      const tm = setTimeout(() => ctl.abort(), 8000);
      const r = await fetch(t.url, {
        signal: ctl.signal,
        headers: { "user-agent": "BlackCrown-Corvid-Audit/1.0" },
      });
      clearTimeout(tm);
      if (!r.ok) continue;
      const html = await r.text();
      pages.push(auditPage(t.file, html, [], true));
    } catch {
      // unreachable right now; next refresh retries
    }
  }
  if (pages.length) remoteAuditCache = { at: Date.now(), pages };
  return remoteAuditCache.pages;
}

async function doAudit() {
  const files = fs
    .readdirSync(SITE_ROOT)
    .filter((f) => f.endsWith(".html") && !SKIP_PAGES.has(f))
    .sort();
  if (!files.length) throw new Error(`No pages found in ${SITE_ROOT}`);
  let sitemapUrls = [];
  try {
    const sm = fs.readFileSync(path.join(SITE_ROOT, "sitemap.xml"), "utf8");
    sitemapUrls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  } catch {
    // no sitemap
  }
  const pages = files.map((f) =>
    auditPage(f, fs.readFileSync(path.join(SITE_ROOT, f), "utf8"), sitemapUrls)
  );
  pages.push(...(await auditRemotes()));
  // product codebases: audit their html the moment the fleet clones exist,
  // addressed as korvus:path and crown:path so proposals can target them
  for (const [key, dir] of Object.entries(REPO_ROOTS)) {
    if (key === "site" || !dir || !fs.existsSync(dir)) continue;
    const found = [];
    const walk = (d, depth) => {
      if (depth > 2 || found.length >= 18) return;
      let entries = [];
      try {
        entries = fs.readdirSync(d, { withFileTypes: true });
      } catch {
        return;
      }
      for (const f of entries) {
        if (found.length >= 18) break;
        if (f.name.startsWith(".") || f.name === "node_modules" || f.name === "dist") continue;
        const fp = path.join(d, f.name);
        if (f.isDirectory()) walk(fp, depth + 1);
        else if (f.name.endsWith(".html")) found.push(fp);
      }
    };
    walk(dir, 0);
    for (const fp of found) {
      try {
        pages.push(auditPage(`${key}:${path.relative(dir, fp)}`, fs.readFileSync(fp, "utf8"), [], true));
      } catch {
        // unreadable file, skip
      }
    }
  }
  const seo = loadSeo();
  seo.auditedAt = Date.now();
  seo.pages = pages;
  saveSeo(seo);
  return seo;
}

app.post("/api/seo/audit", async (_req, res) => {
  try {
    const seo = await doAudit();
    res.json({ auditedAt: seo.auditedAt, pages: seo.pages, reviews: seo.reviews || {} });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "audit error" });
  }
});

app.get("/api/seo", (_req, res) => {
  const s = loadSeo();
  res.json({ auditedAt: s.auditedAt, pages: s.pages || [], reviews: s.reviews || {} });
});

const SEO_SYSTEM = `You are BlackCrown's in-house SEO strategist. The brand builds tools for independent operators: Korvus (korvus.industries, a real-time market intelligence terminal for index futures traders), BlackCrown Intelligence (a private AI workspace), LodeStone (a TradingView indicator) and the Eclipse-X community.

You are given one page of blackcrownvxj.com: its file name, current title, meta description, detected issues and the visible text. Produce a tight, actionable review:

1. VERDICT: one sentence on what this page is doing well or badly for search.
2. TARGET KEYWORDS: 3 to 5 phrases this page should rank for, matched to what traders and operators actually type.
3. REWRITES: a new title tag (under 60 chars) and meta description (under 155 chars), written to earn the click, in the brand voice (confident, direct, no hype).
4. FIXES, in priority order: the 3 to 6 highest-impact changes, each one line, concrete enough to act on today.

Rules: plain text, numbered sections exactly as above, no markdown symbols, never use em dashes or en dashes anywhere, use a period or comma instead.`;

app.post("/api/seo/review", async (req, res) => {
  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("ANTHROPIC_API_KEY is not set in .env on the server.");
    const file = String(req.body?.file || "");
    const seo = loadSeo();
    const page = (seo.pages || []).find((p) => p.file === file);
    if (!page) throw new Error("Run an audit first, then review a page.");
    const html = fs.readFileSync(path.join(SITE_ROOT, file), "utf8");
    const text = stripTags(html).slice(0, 6000);
    const issueLines = page.issues.map((i) => `- [${i.sev}] ${i.msg}`).join("\n");
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 1200,
        system: SEO_SYSTEM,
        messages: [
          {
            role: "user",
            content: `Page: ${file}\nCurrent title: ${page.title || "(none)"}\nCurrent meta description: ${
              page.metaDesc || "(none)"
            }\nDetected issues:\n${issueLines || "(none)"}\n\nVisible text:\n${text}`,
          },
        ],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      throw new Error(`Anthropic API error (${r.status}): ${t.slice(0, 200)}`);
    }
    const data = await r.json();
    const review = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim()
      .replace(/\s*[\u2014\u2013]\s*/g, ", ");
    seo.reviews = seo.reviews || {};
    seo.reviews[file] = { at: Date.now(), text: review };
    saveSeo(seo);
    res.json({ file, review: seo.reviews[file] });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "review error" });
  }
});

// ----- the SEO agent (Corvid): state, controls, brain -----------------------
app.get("/api/agent", (_req, res) => {
  res.json(agentState());
});

app.post("/api/agent/cycle", async (_req, res) => {
  const out = await runCycle("manual");
  if (!out.ok) return res.status(500).json(out);
  res.json({ ...out, state: agentState() });
});

app.post("/api/agent/enabled", (req, res) => {
  setEnabled(Boolean(req.body?.on));
  res.json({ ok: true, state: agentState() });
});

app.post("/api/agent/task", (req, res) => {
  const t = addTask(req.body?.title);
  if (!t) return res.status(400).json({ error: "title required" });
  res.json({ task: t });
});

app.post("/api/agent/test", async (_req, res) => {
  const ok = await sendTest();
  if (!ok)
    return res.status(500).json({
      error:
        "No Discord route configured or the send failed. Set DISCORD_BOT_TOKEN and DISCORD_SEO_CHANNEL_ID (or DISCORD_SEO_WEBHOOK) in .env and restart.",
    });
  res.json({ ok: true });
});

app.post("/api/agent/proposal/:id", async (req, res) => {
  const p = await ownerDecision(
    req.params.id,
    String(req.body?.action || ""),
    String(req.body?.note || ""),
    "admin"
  );
  if (!p) return res.status(400).json({ error: "unknown proposal or action" });
  res.json({ proposal: p });
});

// ----- Regent, the CEO agent -----------------------------------------------
app.get("/api/ceo", (_req, res) => res.json(ceoState()));
app.post("/api/ceo/enabled", (req, res) => {
  ceoSetEnabled(Boolean(req.body?.on));
  res.json({ ok: true, state: ceoState() });
});
app.get("/api/ceo/brain", (_req, res) => res.json({ files: ceoBrainList() }));
app.get("/api/ceo/brain/file", (req, res) => {
  res.json(ceoBrainFile(String(req.query.name || "")));
});
app.post("/api/ceo/brain/file", (req, res) => {
  const out = ceoBrainSave(String(req.body?.name || ""), String(req.body?.body || ""));
  if (!out) return res.status(400).json({ error: "only .md files inside the vault" });
  res.json(out);
});
app.get("/api/ceo/brain.tgz", (_req, res) => {
  const dir = ceoVaultPath();
  res.set("Content-Type", "application/gzip");
  res.set("Content-Disposition", 'attachment; filename="regent-brain.tgz"');
  execFileCb("tar", ["-czf", "-", "-C", dir, "."], { maxBuffer: 64 * 1024 * 1024, encoding: "buffer" }, (err, stdout) => {
    if (err) return res.status(500).end();
    res.end(stdout);
  });
});

app.get("/api/agent/brain", (_req, res) => {
  res.json({ files: brainList() });
});

app.get("/api/agent/brain/file", (req, res) => {
  const f = brainFile(String(req.query.name || ""));
  if (!f.body && !f.name) return res.status(404).json({ error: "not found" });
  res.json(f);
});

app.get("/api/agent/brain.tgz", (_req, res) => {
  const dir = brainDirPath();
  res.set("Content-Type", "application/gzip");
  res.set("Content-Disposition", 'attachment; filename="blackcrown-brain.tgz"');
  const child = execFileCb("tar", ["-czf", "-", "-C", dir, "."], {
    maxBuffer: 64 * 1024 * 1024,
    encoding: "buffer",
  }, (err, stdout) => {
    if (err) return res.status(500).end();
    res.end(stdout);
  });
  void child;
});

app.post("/api/agent/brain/file", (req, res) => {
  const out = brainSave(String(req.body?.name || ""), String(req.body?.body || ""));
  if (!out) return res.status(400).json({ error: "only .md files inside the vault" });
  res.json(out);
});

app.post("/api/agent/proposal/:id/retry", (req, res) => {
  const p = retryCreative(req.params.id);
  if (!p) return res.status(400).json({ error: "not an approved creative" });
  res.json({ ok: true });
});

// ----- read access to the live TikTok Engine in Make (read only) -----------
const MAKE_TOKEN = (process.env.MAKE_API_TOKEN || "").trim();
const MAKE_ZONE = process.env.MAKE_ZONE || "us2.make.com";
const TIKTOK_SCENARIO_ID = process.env.TIKTOK_SCENARIO_ID || "5822164";
let engineCache = { at: 0, text: null };

function scrubSecrets(s) {
  return String(s)
    .replace(/sk-ant-[A-Za-z0-9_-]+/g, "[key]")
    .replace(/bloom_sk_[A-Za-z0-9]+/g, "[key]")
    .replace(/Bot\s+[A-Za-z0-9._-]{30,}/g, "Bot [token]");
}

// write access to Make, used ONLY by Regent executing an owner-approved ask.
// Edits land on content strings inside the blueprint (prompts, captions,
// variable values), never module wiring; a raw backup is saved first and
// nothing from the blueprint is ever logged or echoed.
function walkReplace(node, current, next, stats) {
  if (!node || typeof node !== "object") return;
  const entries = Array.isArray(node) ? node.map((v, i) => [i, v]) : Object.entries(node);
  for (const [k, v] of entries) {
    if (typeof v === "string") {
      if (v.includes(current)) {
        stats.hits += v.split(current).length - 1;
        stats.fields++;
        node[k] = v.split(current).join(next);
      }
    } else if (v && typeof v === "object") {
      walkReplace(v, current, next, stats);
    }
  }
}
async function applyMakeEdit({ scenarioId, current, next }) {
  if (!MAKE_TOKEN) return { ok: false, msg: "MAKE_API_TOKEN is not set in .env" };
  const id = String(scenarioId || TIKTOK_SCENARIO_ID).replace(/[^0-9]/g, "") || TIKTOK_SCENARIO_ID;
  if (!current || current.toLowerCase() === "none") {
    return { ok: false, msg: "Make edits need CURRENT copied exactly from the engine feed, none given" };
  }
  if (!next) return { ok: false, msg: "no NEW text to apply" };
  try {
    const r = await fetch(`https://${MAKE_ZONE}/api/v2/scenarios/${id}/blueprint`, {
      headers: { Authorization: `Token ${MAKE_TOKEN}` },
    });
    if (!r.ok) return { ok: false, msg: `could not read scenario ${id} (${r.status}), check the token` };
    const j = await r.json();
    const bp = j?.response?.blueprint || j?.blueprint;
    if (!bp) return { ok: false, msg: "Make returned no blueprint" };
    const dir = path.join(__dirname, "make-backups");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${id}-${Date.now()}.json`), JSON.stringify(bp));
    const stats = { hits: 0, fields: 0 };
    walkReplace(bp, current, String(next).replace(/\u2014|\u2013/g, ", "), stats);
    if (stats.hits === 0) {
      return { ok: false, msg: "CURRENT text not found in the live blueprint, it may have changed, pull the engine feed again" };
    }
    if (stats.hits > 3) {
      return { ok: false, msg: `CURRENT appears ${stats.hits} times in the blueprint, refusing an ambiguous edit` };
    }
    const w = await fetch(`https://${MAKE_ZONE}/api/v2/scenarios/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Token ${MAKE_TOKEN}`, "content-type": "application/json" },
      body: JSON.stringify({ blueprint: JSON.stringify(bp) }),
    });
    if (!w.ok) {
      const et = scrubSecrets(await w.text().catch(() => ""));
      return {
        ok: false,
        msg: `Make refused the write (${w.status}): ${et.slice(0, 160)}. The token likely needs the scenarios write scope`,
      };
    }
    engineCache = { at: 0, text: null };
    return {
      ok: true,
      msg: `TikTok Engine scenario ${id} updated live, ${stats.hits} occurrence(s) across ${stats.fields} field(s). Raw backup saved on the server first.`,
    };
  } catch (e) {
    return { ok: false, msg: `Make edit failed: ${scrubSecrets(String(e.message || e)).slice(0, 160)}` };
  }
}

async function readEngine() {
  if (!MAKE_TOKEN) return null;
  if (engineCache.text && Date.now() - engineCache.at < 6 * 3600 * 1000) {
    return engineCache.text;
  }
  try {
    const r = await fetch(
      `https://${MAKE_ZONE}/api/v2/scenarios/${TIKTOK_SCENARIO_ID}/blueprint`,
      { headers: { Authorization: `Token ${MAKE_TOKEN}` } }
    );
    if (!r.ok) return engineCache.text;
    const j = await r.json();
    const bp = j?.response?.blueprint || j?.blueprint || j;
    const flow = Array.isArray(bp?.flow) ? bp.flow : [];
    const parts = [`TikTok Engine live config (scenario ${TIKTOK_SCENARIO_ID}, read ${new Date().toISOString().slice(0, 10)})`];
    for (const m of flow) {
      if (m.module === "util:SetVariables" && m.mapper?.variables) {
        for (const v of m.mapper.variables) {
          if (["product", "brief", "why", "cta", "slides"].includes(v.name)) {
            parts.push(`${v.name}: ${scrubSecrets(v.value)}`);
          }
        }
      }
      if (
        m.module === "http:ActionSendData" &&
        typeof m.mapper?.url === "string" &&
        m.mapper.url.includes("api.anthropic.com") &&
        typeof m.mapper?.data === "string"
      ) {
        parts.push(`writer prompt payload: ${scrubSecrets(m.mapper.data)}`);
      }
    }
    engineCache = { at: Date.now(), text: parts.join("\n\n").slice(0, 12000) };
    try {
      fs.writeFileSync(
        path.join(brainDirPath(), "TikTok-Engine-Live.md"),
        `# TikTok-Engine-Live\n\nAuto refreshed from Make, read only. Secrets scrubbed.\n\n${engineCache.text}\n`
      );
    } catch {
      // vault write is best effort
    }
    return engineCache.text;
  } catch {
    return engineCache.text;
  }
}

// ----- TikTok trending hashtags (Creative Center, best effort) --------------
let trendsCache = { at: 0, text: null };
async function readTrends() {
  if (trendsCache.text && Date.now() - trendsCache.at < 6 * 3600 * 1000) {
    return trendsCache.text;
  }
  const headers = {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    referer:
      "https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en",
    accept: "application/json",
    lang: "en",
  };
  for (const period of [7, 30]) {
    try {
      const r = await fetch(
        `https://ads.tiktok.com/creative_radar_api/v1/popular_trend/hashtag/list?page=1&limit=20&period=${period}&country_code=US&sort_by=popular`,
        { headers }
      );
      if (!r.ok) continue;
      const j = await r.json();
      const list = j?.data?.list;
      if (!Array.isArray(list) || !list.length) continue;
      const lines = list
        .slice(0, 20)
        .map((h, i) => {
          const name = h.hashtag_name || h.hashtagName || h.name;
          if (!name) return null;
          const posts = h.publish_cnt || h.publishCnt || h.video_views || "";
          return `${i + 1}. #${name}${posts ? ` (${posts} posts)` : ""}`;
        })
        .filter(Boolean);
      if (!lines.length) continue;
      trendsCache = {
        at: Date.now(),
        text: `US TikTok trending hashtags, last ${period} days:\n${lines.join("\n")}`,
      };
      try {
        fs.writeFileSync(
          path.join(brainDirPath(), "TikTok-Trends.md"),
          `# TikTok-Trends\n\nAuto refreshed from TikTok Creative Center, best effort. Pair one trend with niche tags only when it genuinely fits the post.\n\n${trendsCache.text}\n`
        );
      } catch {
        // vault write best effort
      }
      return trendsCache.text;
    } catch {
      // try next period or give up
    }
  }
  return trendsCache.text;
}

// hand the agent the same data the admin sees, business wide, read only
wireFeeds({
  stats: () => loadStats(),
  // cheap signals for the watchman tick, no model call, no network
  pulse: () => {
    let down = 0;
    for (const site of WATCH_SITES) {
      const list = uptime[site.key] || [];
      const last = list[list.length - 1];
      if (last && !last.ok) down++;
    }
    const s = loadStats();
    const obj = (s[dayKey()] && s[dayKey()].visit) || {};
    const visits = Object.values(obj).reduce((a, b) => a + b, 0);
    return { visits, down };
  },
  uptime: () =>
    WATCH_SITES.map((site) => {
      const list = uptime[site.key] || [];
      const last = list[list.length - 1] || null;
      return { site: site.label, up: last ? last.ok : null, ms: last ? last.ms : null };
    }),
  audit: async () => (await doAudit()).pages,
  revenue: async () => {
    if (!STRIPE_KEY) return null;
    if (revenueCache.data && Date.now() - revenueCache.at < 30 * 60 * 1000) {
      return revenueCache.data;
    }
    try {
      const data = await buildRevenue();
      revenueCache = { at: Date.now(), data };
      return data;
    } catch {
      return revenueCache.data;
    }
  },
  money: () => {
    const key = new Date().toISOString().slice(0, 7);
    let income = 0;
    let expense = 0;
    for (const e of loadMoney()) {
      if (String(e.date || "").slice(0, 7) !== key) continue;
      if (e.type === "income") income += Number(e.amount) || 0;
      else expense += Number(e.amount) || 0;
    }
    return { month: key, income: Math.round(income * 100) / 100, expense: Math.round(expense * 100) / 100 };
  },
  engine: readEngine,
  trends: readTrends,
  ledger: () => {
    const body = ceoBrainFile("Ledger.md").body || "";
    const lines = body.trim().split("\n").filter((l) => l.startsWith("- "));
    return lines.slice(-8).join("\n");
  },
});
// ----- brain sync: push the vaults to a git repo so Obsidian stays live ----
// Set BRAIN_SYNC=1 and point AGENT_BRAIN_DIR / CEO_BRAIN_DIR inside a cloned
// repo (see the setup notes). Pull before, push after, every 5 minutes.
const BRAIN_SYNC = process.env.BRAIN_SYNC === "1";
const BRAIN_REPO_DIR =
  process.env.BRAIN_REPO_DIR || path.resolve(brainDirPath(), "..");

import { execFileSync as gitExec } from "child_process";
function brainGit(args, timeout = 30000) {
  return gitExec("git", ["-C", BRAIN_REPO_DIR, ...args], {
    timeout,
    encoding: "utf8",
  });
}

let brainSyncFailed = false;
async function syncBrains() {
  if (!BRAIN_SYNC) return;
  try {
    try {
      brainGit(["pull", "--rebase"]);
    } catch {
      // offline or conflict; local wins for now
    }
    brainGit(["add", "-A"]);
    const status = brainGit(["status", "--porcelain"]);
    if (status.trim()) {
      brainGit([
        "-c", "user.email=corvid@blackcrownvxj.com",
        "-c", "user.name=BlackCrown Brains",
        "commit", "-m", `brain sync ${new Date().toISOString().slice(0, 16)}`,
      ]);
    }
    brainGit(["push", "origin", "main"], 45000);
    brainSyncFailed = false;
  } catch (e) {
    // a conflicted rebase leaves the repo stuck and every later sync dead:
    // abort whatever is half done, merge with local wins, push again
    try { brainGit(["rebase", "--abort"]); } catch {}
    try { brainGit(["merge", "--abort"]); } catch {}
    try {
      brainGit(["pull", "--no-rebase", "-X", "ours"]);
      brainGit(["push", "origin", "main"], 45000);
      console.log("brain sync recovered after conflict");
      brainSyncFailed = false;
      return;
    } catch {}
    if (!brainSyncFailed) {
      brainSyncFailed = true;
      console.log("brain sync failed:", e.message || e);
    }
  }
}
if (BRAIN_SYNC) {
  setTimeout(() => syncBrains(), 20 * 1000);
  setInterval(() => syncBrains(), 5 * 60 * 1000);
}

// ----- Korvus Intel paper bot: read-only view of intel/ in the brain repo ----
// The Korvus server pushes intel/ into blackcrown-brain; brain sync above
// pulls it here every 5 minutes. Nothing in this admin ever writes to it.
const INTEL_DIR = process.env.INTEL_DIR || path.join(BRAIN_REPO_DIR, "intel");

function readJsonl(file, limit = 5000) {
  try {
    const lines = fs.readFileSync(file, "utf8").split("\n").filter(Boolean);
    return lines.slice(-limit).map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function etDay(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  } catch {
    return "";
  }
}

app.get("/api/intel", (_req, res) => {
  const dataDir = path.join(INTEL_DIR, "data");
  if (!fs.existsSync(dataDir)) {
    return res.json({ configured: false, dir: INTEL_DIR });
  }
  let board = null;
  try {
    board = JSON.parse(fs.readFileSync(path.join(dataDir, "scoreboard.json"), "utf8"));
  } catch {}
  const trades = readJsonl(path.join(dataDir, "trades.jsonl"));
  const filings = readJsonl(path.join(dataDir, "filings.jsonl"), 400);
  const today = etDay(new Date().toISOString());
  const scored = filings.filter((f) => f.summary);
  // The scoreboard only counts the current rule version (a rule change starts
  // a fresh one), so the curve does too. Trades taken under retired rules stay
  // on the record: they are summarised here so the tab can show them plainly.
  const current = board?.scoreboard?.strategy || board?.rules?.strategy || null;
  const retiredMap = {};
  for (const t of trades) {
    if (t.status !== "closed" || !current || t.strategy === current) continue;
    const r = (retiredMap[t.strategy] ||= { strategy: t.strategy, trades: 0, wins: 0, losses: 0, pnl: 0, last_utc: null });
    r.trades++;
    if ((Number(t.pnl) || 0) > 0) r.wins++;
    else r.losses++;
    r.pnl = Math.round((r.pnl + (Number(t.pnl) || 0)) * 100) / 100;
    if (!r.last_utc || String(t.exit_utc) > r.last_utc) r.last_utc = t.exit_utc;
  }
  // cumulative paper P&L after each closed trade, for the equity curve
  let cum = 0;
  const equity = trades
    .filter((t) => t.status === "closed" && (!current || t.strategy === current))
    .sort((a, b) => String(a.exit_utc).localeCompare(String(b.exit_utc)))
    .map((t) => ({ t: t.exit_utc, v: Math.round((cum += Number(t.pnl) || 0) * 100) / 100, sym: t.symbol }));
  let dataMtime = null;
  try {
    dataMtime = fs.statSync(path.join(dataDir, "filings.jsonl")).mtime.toISOString();
  } catch {}
  res.json({
    configured: true,
    dataMtime,
    equity,
    board,
    retired: Object.values(retiredMap),
    open: trades.filter((t) => t.status === "open").reverse(),
    recent: trades.filter((t) => t.status === "closed").slice(-25).reverse(),
    filingsToday: filings.filter((f) => etDay(f.seen_utc) === today).length,
    filings: scored.slice(-15).reverse().map((f) => ({
      symbol: f.symbol, headline: f.headline, seen_utc: f.seen_utc, url: f.url,
      impact: f.impact, direction: f.direction, confidence: f.confidence, catalyst: f.catalyst,
      summary: f.summary,
    })),
  });
});

// Live crawler status straight from the Korvus server (key stays server-side).
// KORVUS_INTEL_STATUS_URL + KORVUS_INTEL_KEY in .env; the same key is
// INTEL_STATUS_KEY on the Korvus box. Cached 4s so many tabs = one request.
const INTEL_STATUS_URL =
  process.env.KORVUS_INTEL_STATUS_URL || "https://korvus.industries/api/feed/intel-status";
const INTEL_KEY = process.env.KORVUS_INTEL_KEY || "";
let intelLive = { at: 0, data: null };
app.get("/api/intel/live", async (_req, res) => {
  if (!INTEL_KEY) return res.json({ configured: false });
  if (intelLive.data && Date.now() - intelLive.at < 4000) return res.json(intelLive.data);
  try {
    const r = await fetch(INTEL_STATUS_URL, {
      headers: { "X-Intel-Key": INTEL_KEY },
      signal: AbortSignal.timeout(6000),
    });
    const j = await r.json().catch(() => ({}));
    const data = r.ok
      ? { configured: true, reachable: true, ...j }
      : { configured: true, reachable: false, error: r.status === 403 ? "key rejected by Korvus" : `HTTP ${r.status}` };
    intelLive = { at: Date.now(), data };
    res.json(data);
  } catch (e) {
    res.json({ configured: true, reachable: false, error: String(e?.message || e) });
  }
});

// The futures strategy lab on the Korvus box: every strategy the bot has
// created per market, why, and how each one is doing. Same key as the status.
let labCache = { at: 0, data: null };
app.get("/api/intel/lab", async (_req, res) => {
  if (!INTEL_KEY) return res.json({ configured: false });
  if (labCache.data && Date.now() - labCache.at < 15000) return res.json(labCache.data);
  try {
    const r = await fetch(INTEL_STATUS_URL.replace(/intel-status\/?$/, "lab"), {
      headers: { "X-Intel-Key": INTEL_KEY },
      signal: AbortSignal.timeout(8000),
    });
    const j = await r.json().catch(() => ({}));
    const data = r.ok
      ? { configured: true, reachable: true, ...j }
      : { configured: true, reachable: false, error: r.status === 404 ? "the lab is not deployed on Korvus yet" : r.status === 403 ? "key rejected by Korvus" : `HTTP ${r.status}` };
    labCache = { at: Date.now(), data };
    res.json(data);
  } catch (e) {
    res.json({ configured: true, reachable: false, error: String(e?.message || e) });
  }
});

// ----- staff: Herald (sales and ads) and Steward (project manager) ----------
app.get("/api/staff", (_req, res) => res.json({ agents: staffStates() }));
app.post("/api/staff/:key/cycle", async (req, res) => {
  const r = await staffRunCycle(String(req.params.key));
  if (!r.ok) return res.status(500).json({ error: r.error || "cycle failed" });
  res.json({ ok: true });
});
app.post("/api/staff/:key/enabled", (req, res) => {
  const on = staffSetEnabled(String(req.params.key), Boolean(req.body?.on));
  if (on === null) return res.status(404).json({ error: "no such agent" });
  res.json({ ok: true, enabled: on });
});
app.post("/api/staff/:key/task", (req, res) => {
  const t = staffAddTask(String(req.params.key), String(req.body?.title || ""));
  if (!t) return res.status(400).json({ error: "task needs a title" });
  res.json({ ok: true, task: t });
});

// eclipse-x pulse: the agents learn the server as a whole, members, channels, heat
let eclipseCache = { at: 0, line: "" };
async function eclipsePulse() {
  const tok = (process.env.DISCORD_BOT_TOKEN || "").trim();
  const gid = (process.env.DISCORD_GUILD_ID || "").trim();
  if (!tok || !gid) return "";
  if (Date.now() - eclipseCache.at < 30 * 60 * 1000) return eclipseCache.line;
  try {
    const H = { authorization: `Bot ${tok}` };
    const g = await (await fetch(`https://discord.com/api/v10/guilds/${gid}?with_counts=true`, { headers: H })).json();
    const chans = await (await fetch(`https://discord.com/api/v10/guilds/${gid}/channels`, { headers: H })).json();
    const now = Date.now();
    const ageDays = (snow) => (snow ? (now - (Number(BigInt(snow) >> 22n) + 1420070400000)) / 864e5 : 999);
    const texts = (Array.isArray(chans) ? chans : []).filter((c) => c.type === 0);
    const hot = texts.filter((c) => ageDays(c.last_message_id) < 1).map((c) => `#${c.name}`);
    const cold = texts.filter((c) => ageDays(c.last_message_id) > 3).map((c) => `#${c.name}`);
    eclipseCache = {
      at: Date.now(),
      line: `ECLIPSE-X SERVER: ${g.approximate_member_count || "?"} members, ${g.approximate_presence_count || "?"} online now; ${texts.length} text channels; active in the last day: ${hot.slice(0, 10).join(" ") || "none"}; quiet 3d+: ${cold.slice(0, 8).join(" ") || "none"}`,
    };
  } catch {
    eclipseCache = { at: Date.now(), line: "" };
  }
  return eclipseCache.line;
}

// indexnow: every page an agent ships is pushed to the engines that accept
// pushes (Bing, Yandex). Google discovers via robots sitemaps and GSC.
const INDEXNOW_KEY = "bc1f4e2a7d5946c8a3b0e6d1f8279c4b";
const INDEXNOW_HOSTS = { site: "blackcrownvxj.com", korvus: "korvus.industries" };
function submitIndexNow(rootKey, file) {
  try {
    const host = INDEXNOW_HOSTS[rootKey];
    if (!host) return;
    let url = null;
    if (rootKey === "site" && /\.html?$/i.test(file)) {
      url = `https://${host}/${file === "index.html" ? "" : file}`;
    } else if (rootKey === "korvus") {
      const m = file.match(/^pages\/([a-z0-9-]+)\.html$/i);
      if (m) url = `https://${host}/p/${m[1]}`;
    }
    if (!url) return;
    fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`, urlList: [url] }),
    }).catch(() => {});
    console.log("indexnow pushed:", url);
  } catch {}
}

const companyFeed = async (key) => {
    const lines = [];
    try { lines.push(spendSummary()); } catch {}
    try {
      const js = loadJobs();
      if (js.length) lines.push(`SERVER JOBS already registered, never file duplicates: ${js.map((j) => `"${j.name}" (${j.schedule || "?"} to ${j.channel || "?"}${j.enabled === false ? ", off" : ""})`).join("; ")}`);
    } catch {}
    try {
      const ep = await eclipsePulse();
      if (ep) lines.push(ep);
    } catch {}
    try {
      const s = loadStats();
      const dk = dayKey();
      const sum = (day, e) => Object.values((s[day] && s[day][e]) || {}).reduce((a, b) => a + b, 0);
      let v7 = 0;
      let c7 = 0;
      for (let i = 0; i < 7; i++) {
        v7 += sum(dayKey(i), "visit");
        c7 += sum(dayKey(i), "click");
      }
      let sg7 = 0;
      for (let i = 0; i < 7; i++) sg7 += sum(dayKey(i), "signup");
      const sgSrc = Object.entries((s[dk] && s[dk].signup) || {}).map(([a, b]) => `${a} ${b}`).join(", ");
      lines.push(`TRAFFIC: today ${sum(dk, "visit")} visits ${sum(dk, "click")} clicks ${sum(dk, "signup")} korvus signups${sgSrc ? ` (${sgSrc})` : ""}; 7d ${v7} visits ${c7} clicks ${sg7} signups`);
    } catch {
      lines.push("TRAFFIC: unavailable");
    }
    try {
      const sites = WATCH_SITES.map((site) => {
        const list = uptime[site.key] || [];
        const last = list[list.length - 1];
        return `${site.label} ${last ? (last.ok ? "up" : "DOWN") : "?"}`;
      });
      lines.push(`UPTIME: ${sites.join(", ")}`);
    } catch {
      // optional
    }
    try {
      if (STRIPE_KEY && revenueCache.data) {
        lines.push(
          `REVENUE: MRR $${revenueCache.data.mrr || 0}, ${revenueCache.data.subscribers || 0} subscribers, $${revenueCache.data.monthGross || 0} this month`
        );
      } else {
        lines.push("REVENUE: Stripe shows $0 MRR, 0 subscribers, first paying customer is still the goal");
      }
    } catch {
      // optional
    }
    try {
      const seo = loadSeo();
      const worst = (seo.pages || []).slice().sort((a, b) => a.score - b.score).slice(0, 5);
      lines.push(`SEO WORST PAGES: ${worst.map((p) => `${p.file} ${p.score}`).join("; ") || "no audit yet"}`);
    } catch {
      // optional
    }
    if (key === "herald") {
      try {
        const t = await readTrends();
        if (t) lines.push(`TIKTOK TRENDS: ${String(t).slice(0, 900)}`);
      } catch {
        // optional
      }
      try {
        const e = await readEngine();
        if (e) lines.push(`TIKTOK ENGINE: ${String(e).slice(0, 1200)}`);
      } catch {
        // optional
      }
    }
    if (key === "steward") {
      try {
        const body = ceoBrainFile("Ledger.md").body || "";
        const tail = body.trim().split("\n").filter((l) => l.startsWith("- ")).slice(-6).join("\n");
        lines.push(`REGENT LEDGER (recent executions):\n${tail || "nothing yet"}`);
      } catch {
        // optional
      }
      try {
        const a = agentState();
        lines.push(`CORVID: ${a.status}, focus: ${a.currentFocus}, open tasks ${a.tasks.filter((t) => t.status !== "done").length}`);
      } catch {
        // optional
      }
    }
    return lines.join("\n");
};
wireStaff({ feed: companyFeed, wire: recordWire });

// ---------------------------------------------------------------------------
// the immune system: every 10 minutes the healer makes the floor whole again.
// It cannot fix the unknown, but nothing known gets to break twice, and
// nothing transient gets to page the owner at all.
// ---------------------------------------------------------------------------
process.on("unhandledRejection", (e) => console.log("unhandled rejection, absorbed:", e?.message || e));
process.on("uncaughtException", (e) => console.log("uncaught exception, absorbed:", e?.message || e));
function diskHygiene() {
  try {
    const cutoff = Date.now() - 7 * 864e5;
    for (const root of Object.values(REPO_ROOTS || {})) {
      try {
        for (const f of fs.readdirSync(root)) {
          if (/\.bak-\d+$/.test(f)) {
            const fp = path.join(root, f);
            if (fs.statSync(fp).mtimeMs < cutoff) fs.unlinkSync(fp);
          }
        }
      } catch {}
    }
  } catch {}
}
function runHealer() {
  try { corvidHeal(); } catch (e) { console.log("healer corvid:", e?.message || e); }
  try { staffHeal(); } catch (e) { console.log("healer staff:", e?.message || e); }
  try { diskHygiene(); } catch {}
}
setTimeout(runHealer, 90 * 1000);
setInterval(runHealer, 10 * 60 * 1000);

// the librarian: daily at 04:40 ET, old minion notes condense into digests
let librarianDay = "";
async function runLibrarian() {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "2-digit", hour12: false }).format(new Date());
    const hr = parseInt(parts, 10) % 24;
    const day = dayKey();
    if (hr !== 4 || librarianDay === day) return;
    librarianDay = day;
    const a = await corvidLibrarian();
    const b = await staffLibrarian();
    console.log("librarian pass:", a, b.join(", ") || "staff vaults lean");
  } catch (e) {
    console.log("librarian:", e?.message || e);
  }
}
setInterval(runLibrarian, 10 * 60 * 1000);
// run one catch-up pass shortly after boot since the vaults are already heavy
setTimeout(async () => {
  try {
    console.log("librarian catch-up:", await corvidLibrarian(), (await staffLibrarian()).join(", "));
  } catch {}
}, 4 * 60 * 1000);

// ----- scheduled jobs: the in-house automation engine -----------------------
// Agents file kind "job" proposals; on approval Regent registers them here
// and the server runs them on schedule, no Make, no manual pasting. A job is
// a stored report spec: at fire time the live company data is gathered, the
// report is written, and the card posts to the chosen channel.
const JOBS_PATH = path.join(__dirname, "studio-jobs.json");
const JOBS_BOT = (process.env.DISCORD_BOT_TOKEN || "").trim();
const JOBS_CH = {
  corvid: (process.env.DISCORD_SEO_CHANNEL_ID || "").trim(),
  boardroom: (process.env.DISCORD_CEO_CHANNEL_ID || "").trim() || (process.env.DISCORD_SEO_CHANNEL_ID || "").trim(),
};
function loadJobs() {
  try {
    return JSON.parse(fs.readFileSync(JOBS_PATH, "utf8"));
  } catch {
    return [];
  }
}
function saveJobs(j) {
  try {
    fs.writeFileSync(JOBS_PATH, JSON.stringify(j, null, 2));
  } catch {
    // best effort
  }
}
const JOB_DAYS = { sunday: "Sunday", monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday", saturday: "Saturday" };
function parseJobDetail(detail) {
  const d = String(detail || "");
  const sm = d.match(/SCHEDULE:\s*(daily|weekly)\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)?\s*(\d{1,2}):(\d{2})/i);
  if (!sm) return null;
  const kind = sm[1].toLowerCase();
  const day = kind === "weekly" ? JOB_DAYS[(sm[2] || "monday").toLowerCase()] : null;
  const channel = ((d.match(/CHANNEL:\s*(corvid|boardroom)/i) || [])[1] || "corvid").toLowerCase();
  const spec = ((d.match(/NEW:\s*([\s\S]*?)(?=\nGREEN LIGHT MEANS:|$)/i) || [])[1] || d).trim().slice(0, 1600);
  return { kind, day, hour: Math.min(23, parseInt(sm[3], 10) || 9), minute: Math.min(59, parseInt(sm[4], 10) || 0), channel, spec };
}
export function createJobFromProposal(p) {
  const parsed = parseJobDetail(p.detail);
  if (!parsed) return null;
  const jobs = loadJobs();
  const job = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: String(p.summary || "report").slice(0, 80),
    ...parsed,
    enabled: true,
    lastRunAt: null,
    createdAt: Date.now(),
    fromNumber: p.number,
  };
  jobs.push(job);
  saveJobs(jobs);
  const when = `${job.kind === "weekly" ? `every ${job.day}` : "daily"} at ${String(job.hour).padStart(2, "0")}:${String(job.minute).padStart(2, "0")} ET`;
  return { ok: true, msg: `job registered: "${job.name}", ${when}, posts to ${job.channel}. The server runs it from now on, no Make needed.` };
}
const JOB_SYSTEM = `You are The Desk, BlackCrownVxJ LLC's automated reporting service. Write the requested report from the live data exactly per the spec: numbers first, bold section headers, tight lines, week over week deltas where the data allows, zero filler, never use em dashes (write a comma instead), honest about any metric the data does not carry yet. Plain markdown, under 220 words.`;
async function runJob(job) {
  try {
    const data = await companyFeed("jobs");
    const text = await thinkText(JOB_SYSTEM, `REPORT SPEC:\n${job.spec}\n\nLIVE COMPANY DATA:\n${data}`, 1200, { tier: "hands", who: "jobs", priority: "owner" });
    const content = `**THE DESK // ${job.name.toUpperCase().slice(0, 60)}** · ${new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" })}\n${text}`;
    const channelId = JOBS_CH[job.channel] || JOBS_CH.corvid;
    if (JOBS_BOT && channelId) {
      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bot ${JOBS_BOT}` },
        body: JSON.stringify({ content: "", embeds: buildEmbeds(content, 0xb9b6c9, "The Desk, scheduled reports") }),
      });
    }
    const jobs = loadJobs();
    const j = jobs.find((x) => x.id === job.id);
    if (j) {
      j.lastRunAt = Date.now();
      saveJobs(jobs);
    }
    return true;
  } catch (e) {
    console.error("job run failed:", job.name, e.message || e);
    return false;
  }
}
const jobsClock = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "long",
  hour: "numeric",
  minute: "numeric",
  hour12: false,
});
setInterval(() => {
  const parts = Object.fromEntries(jobsClock.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const hour = parseInt(parts.hour, 10) % 24;
  const minute = parseInt(parts.minute, 10);
  for (const job of loadJobs()) {
    if (!job.enabled) continue;
    if (job.hour !== hour || job.minute !== minute) continue;
    if (job.kind === "weekly" && job.day !== parts.weekday) continue;
    if (job.lastRunAt && Date.now() - job.lastRunAt < 20 * 3600 * 1000) continue;
    runJob(job);
  }
}, 60 * 1000);

app.get("/api/jobs", (_req, res) => res.json({ jobs: loadJobs() }));
app.get("/api/usage", (_req, res) => res.json({ spend: getSpend(), summary: spendSummary(), ...usageReport() }));
app.post("/api/jobs/:id/run", async (req, res) => {
  const job = loadJobs().find((x) => x.id === req.params.id);
  if (!job) return res.status(404).json({ error: "no such job" });
  const ok = await runJob(job);
  res.json({ ok });
});
app.post("/api/jobs/:id/toggle", (req, res) => {
  const jobs = loadJobs();
  const job = jobs.find((x) => x.id === req.params.id);
  if (!job) return res.status(404).json({ error: "no such job" });
  job.enabled = !job.enabled;
  saveJobs(jobs);
  res.json({ ok: true, enabled: job.enabled });
});
app.delete("/api/jobs/:id", (req, res) => {
  const jobs = loadJobs();
  const idx = jobs.findIndex((x) => x.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "no such job" });
  jobs.splice(idx, 1);
  saveJobs(jobs);
  res.json({ ok: true });
});

// ----- the bot, alive: gateway presence + owner slash commands --------------
const GUILD_ID = (process.env.DISCORD_GUILD_ID || "").trim();
const OWNER_DISCORD_ID = (process.env.DISCORD_OWNER_ID || "").trim();
const BOT = (process.env.DISCORD_BOT_TOKEN || "").trim();
let discordAppId = null;
async function getAppId() {
  if (discordAppId || !BOT) return discordAppId;
  try {
    const r = await fetch("https://discord.com/api/v10/applications/@me", {
      headers: { authorization: `Bot ${BOT}` },
    });
    const j = await r.json();
    if (r.ok) discordAppId = j.id;
  } catch {
    // retried on next need
  }
  return discordAppId;
}
const SLASH = [
  { name: "status", description: "Company pulse: traffic, money, agents", default_member_permissions: "8" },
  {
    name: "cycle",
    description: "Run an agent's cycle now",
    default_member_permissions: "8",
    options: [
      {
        type: 3,
        name: "agent",
        description: "which agent",
        required: true,
        choices: [
          { name: "corvid", value: "corvid" },
          { name: "herald", value: "herald" },
          { name: "steward", value: "steward" },
        ],
      },
    ],
  },
  {
    name: "approve",
    description: "Approve an ask by number",
    default_member_permissions: "8",
    options: [{ type: 4, name: "number", description: "ask number", required: true }],
  },
  {
    name: "reject",
    description: "Reject an ask by number",
    default_member_permissions: "8",
    options: [{ type: 4, name: "number", description: "ask number", required: true }],
  },
  { name: "credits", description: "Bloom credit balance", default_member_permissions: "8" },
];
async function registerSlash() {
  if (!GUILD_ID) {
    agentLog("gateway", "DISCORD_GUILD_ID not set, slash commands skipped");
    return;
  }
  const id = await getAppId();
  if (!id) return;
  try {
    const r = await fetch(`https://discord.com/api/v10/applications/${id}/guilds/${GUILD_ID}/commands`, {
      method: "PUT",
      headers: { authorization: `Bot ${BOT}`, "content-type": "application/json" },
      body: JSON.stringify(SLASH),
    });
    if (r.ok) agentLog("gateway", "slash commands live: /status /cycle /approve /reject /credits");
    else agentLog("error", `slash registration refused (${r.status}), re-invite the bot with the applications.commands scope`);
  } catch (e) {
    agentLog("error", `slash registration failed: ${e.message || e}`);
  }
}
async function slashReply(i, content) {
  await fetch(`https://discord.com/api/v10/interactions/${i.id}/${i.token}/callback`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ type: 4, data: { content: String(content).slice(0, 1900), flags: 64 } }),
  }).catch(() => {});
}
wireGateway({
  log: (k, t) => agentLog(k, t),
  onInteraction: async (i) => {
    if (i.type !== 2) return;
    const uid = i.member?.user?.id || i.user?.id;
    if (OWNER_DISCORD_ID && uid !== OWNER_DISCORD_ID) return slashReply(i, "Owner only.");
    const name = i.data?.name;
    const opt = (n) => (i.data?.options || []).find((o) => o.name === n)?.value;
    if (name === "status") {
      const s = loadStats();
      const dk = dayKey();
      const sum = (day, e) => Object.values((s[day] && s[day][e]) || {}).reduce((a, b) => a + b, 0);
      const a = agentState();
      const c = ceoState();
      const staff = staffStates();
      const rev = revenueCache.data;
      return slashReply(
        i,
        [
          "**BLACKCROWN // PULSE**",
          `Visits today ${sum(dk, "visit")}, clicks ${sum(dk, "click")}`,
          rev ? `MRR $${rev.mrr || 0}, ${rev.subscribers || 0} subscribers` : "Stripe not read yet",
          `Corvid ${a.status} · Regent ${c.status}, ${c.asks.length} ask(s) waiting`,
          ...staff.map((x) => `${x.name} ${x.status}, ${x.tasks.filter((t) => t.status !== "done").length} open task(s)`),
        ].join("\n")
      );
    }
    if (name === "cycle") {
      const who = opt("agent");
      if (who === "corvid") runCycle("owner slash command").catch(() => {});
      else staffRunCycle(who).catch(() => {});
      return slashReply(i, `${who} cycle fired. Watch the channel.`);
    }
    if (name === "approve" || name === "reject") {
      const num = opt("number");
      const p = findProposal(num);
      if (!p) return slashReply(i, `No ask #${num}.`);
      if (p.status !== "pending") return slashReply(i, `#${num} is already ${p.status}.`);
      ownerDecision(p.id, name, "", "slash").catch(() => {});
      return slashReply(i, `#${num} ${name === "approve" ? "approved" : "rejected"}. Regent is on it, confirmation lands in the channel.`);
    }
    if (name === "credits") {
      const c = await bloomCredits(true);
      return slashReply(i, c ? (c.unlimited ? "Bloom: unlimited plan." : `Bloom balance: ${c.balance} credits.`) : "Bloom balance unavailable.");
    }
    return slashReply(i, "Unknown command.");
  },
});

// expression pack: the bot stocks the server with the branded emoji set
const STICKER_META = {
  blkc_approved: { description: "BlackCrown approval stamp", tags: "white_check_mark" },
  blkc_onit: { description: "Corvid is on it", tags: "bird" },
  blkc_filed: { description: "Filed with Regent", tags: "file_folder" },
};
app.post("/api/discord/expressions", async (_req, res) => {
  if (!(BOT && GUILD_ID)) return res.status(400).json({ error: "Set DISCORD_GUILD_ID in .env first" });
  const out = { emojis: [], stickers: [] };
  const edir = path.join(__dirname, "assets/discord/emoji");
  for (const f of fs.existsSync(edir) ? fs.readdirSync(edir).filter((x) => x.endsWith(".png")) : []) {
    const name = f.replace(/\.png$/, "");
    try {
      const b64 = fs.readFileSync(path.join(edir, f)).toString("base64");
      const r = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/emojis`, {
        method: "POST",
        headers: { authorization: `Bot ${BOT}`, "content-type": "application/json" },
        body: JSON.stringify({ name, image: `data:image/png;base64,${b64}` }),
      });
      const j = await r.json().catch(() => ({}));
      out.emojis.push(`${name}: ${r.ok ? "added" : j?.message || r.status}`);
    } catch (e) {
      out.emojis.push(`${name}: ${e.message || e}`);
    }
  }
  const sdir = path.join(__dirname, "assets/discord/stickers");
  for (const f of fs.existsSync(sdir) ? fs.readdirSync(sdir).filter((x) => x.endsWith(".png")) : []) {
    const name = f.replace(/\.png$/, "");
    const meta = STICKER_META[name] || { description: "BlackCrown sticker", tags: "crown" };
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", meta.description);
      fd.append("tags", meta.tags);
      fd.append("file", new Blob([fs.readFileSync(path.join(sdir, f))], { type: "image/png" }), f);
      const r = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/stickers`, {
        method: "POST",
        headers: { authorization: `Bot ${BOT}` },
        body: fd,
      });
      const j = await r.json().catch(() => ({}));
      out.stickers.push(`${name}: ${r.ok ? "added" : j?.message || r.status}`);
    } catch (e) {
      out.stickers.push(`${name}: ${e.message || e}`);
    }
  }
  res.json(out);
});

if (startGateway()) registerSlash();

// the publisher: an approved post is handed to the owner's Make webhook,
// where the owner's own platform connections (TikTok, X, wherever) post it
const PUBLISH_WEBHOOK = (process.env.MAKE_PUBLISH_WEBHOOK || "").trim();
const PUBLISH_SECRET = (process.env.PUBLISH_SECRET || "").trim();
const PUBLISH_PLATFORMS = (process.env.PUBLISH_PLATFORMS || "youtube")
  .toLowerCase()
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (!PUBLISH_PLATFORMS.includes("x")) PUBLISH_PLATFORMS.push("x");

// --- X, posted direct with the owner's own developer keys. No Make, no
// middleman service; the keys live in .env and never leave this machine.
// Free tier covers roughly 500 posts a month, far above the desks' cadence.
const X_KEYS = {
  key: (process.env.X_API_KEY || "").trim(),
  secret: (process.env.X_API_SECRET || "").trim(),
  token: (process.env.X_ACCESS_TOKEN || "").trim(),
  tokenSecret: (process.env.X_ACCESS_SECRET || "").trim(),
};
const xConfigured = () => !!(X_KEYS.key && X_KEYS.secret && X_KEYS.token && X_KEYS.tokenSecret);
const pctEnc = (s) =>
  encodeURIComponent(s).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
function oauth1Header(method, url) {
  const u = new URL(url);
  const params = {
    oauth_consumer_key: X_KEYS.key,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: X_KEYS.token,
    oauth_version: "1.0",
  };
  const all = { ...params };
  u.searchParams.forEach((v, k) => {
    all[k] = v;
  });
  const paramStr = Object.keys(all)
    .sort()
    .map((k) => `${pctEnc(k)}=${pctEnc(all[k])}`)
    .join("&");
  const baseStr = [method.toUpperCase(), pctEnc(u.origin + u.pathname), pctEnc(paramStr)].join("&");
  const signKey = `${pctEnc(X_KEYS.secret)}&${pctEnc(X_KEYS.tokenSecret)}`;
  params.oauth_signature = crypto.createHmac("sha1", signKey).update(baseStr).digest("base64");
  return (
    "OAuth " +
    Object.keys(params)
      .sort()
      .map((k) => `${pctEnc(k)}="${pctEnc(params[k])}"`)
      .join(", ")
  );
}
const X_UPLOAD = "https://upload.twitter.com/1.1/media/upload.json";
async function xUploadVideo(mediaUrl) {
  // our own renders are read straight from disk
  const own = String(mediaUrl).match(/\/(?:api\/)?renders\/([A-Za-z0-9-]+\.mp4)(?:\?|$)/);
  let buf;
  if (own && fs.existsSync(path.join(RENDERS_DIR, own[1]))) buf = fs.readFileSync(path.join(RENDERS_DIR, own[1]));
  else {
    const dl = await fetch(fixRenderUrl(mediaUrl));
    if (!dl.ok) throw new Error(`media download failed (${dl.status})`);
    buf = Buffer.from(await dl.arrayBuffer());
    if (/^text\/html/i.test(dl.headers.get("content-type") || "")) throw new Error("media link returned a web page, not a video");
  }
  if (buf.length > 512 * 1024 * 1024) throw new Error("video exceeds the 512MB X limit");
  return xUploadBuffer(buf, "video/mp4", "tweet_video");
}
// Every X post carries a picture. A post with no video gets the branded card
// for the product it is about, so it never shows as a bare link preview (X
// often fails to load other sites' preview images, Discord's included).
const X_CARDS = path.join(__dirname, "assets", "x-cards");
function cardFor(text) {
  const t = String(text || "");
  if (/lodestone/i.test(t)) return "lodestone";
  if (/discord\.(gg|com)|eclipse[- ]?x/i.test(t)) return "eclipse";
  if (/korvus/i.test(t)) return "korvus";
  if (/blackcrown-intelligence|\bcrown\b/i.test(t)) return "crown";
  return "blackcrown";
}
async function xUploadCard(text) {
  const file = path.join(X_CARDS, `${cardFor(text)}.jpg`);
  return xUploadBuffer(fs.readFileSync(file), "image/jpeg", "tweet_image");
}
async function xUploadBuffer(buf, mediaType, category) {
  const q = (o) => X_UPLOAD + "?" + new URLSearchParams(o).toString();
  let url = q({
    command: "INIT",
    total_bytes: String(buf.length),
    media_type: mediaType,
    media_category: category,
  });
  let r = await fetch(url, { method: "POST", headers: { authorization: oauth1Header("POST", url) } });
  let j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`media INIT refused (${r.status}): ${JSON.stringify(j.errors || j).slice(0, 140)}`);
  const mediaId = j.media_id_string;
  const CH = 4 * 1024 * 1024;
  for (let i = 0; i * CH < buf.length; i++) {
    const fd = new FormData();
    fd.append("media", new Blob([buf.subarray(i * CH, Math.min((i + 1) * CH, buf.length))]));
    url = q({ command: "APPEND", media_id: mediaId, segment_index: String(i) });
    r = await fetch(url, { method: "POST", headers: { authorization: oauth1Header("POST", url) }, body: fd });
    if (!r.ok && r.status !== 204) throw new Error(`media APPEND chunk ${i} refused (${r.status})`);
  }
  url = q({ command: "FINALIZE", media_id: mediaId });
  r = await fetch(url, { method: "POST", headers: { authorization: oauth1Header("POST", url) } });
  j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`media FINALIZE refused (${r.status}): ${JSON.stringify(j.errors || j).slice(0, 140)}`);
  const t0 = Date.now();
  let wait = j.processing_info?.check_after_secs || 0;
  while (j.processing_info && j.processing_info.state !== "succeeded") {
    if (j.processing_info.state === "failed")
      throw new Error(`X video processing failed: ${j.processing_info.error?.message || "unknown"}`);
    if (Date.now() - t0 > 180000) throw new Error("X video processing timed out after 3 minutes");
    await new Promise((res) => setTimeout(res, Math.max(wait, 2) * 1000));
    url = q({ command: "STATUS", media_id: mediaId });
    r = await fetch(url, { headers: { authorization: oauth1Header("GET", url) } });
    j = await r.json().catch(() => ({}));
    wait = j.processing_info?.check_after_secs || 3;
  }
  return mediaId;
}
async function postToX({ content, media }) {
  let text = String(content || "").trim();
  const weight = () => text.replace(/https?:\/\/\S+/g, "x".repeat(23)).length;
  while (weight() > 280 && /\s/.test(text)) text = text.replace(/\s+\S+$/, "");
  const payload = { text };
  if (media) payload.media = { media_ids: [await xUploadVideo(media)] };
  else {
    try {
      payload.media = { media_ids: [await xUploadCard(text)] };
    } catch (e) {
      agentLog("error", `X card image skipped, posting text only: ${String(e?.message || e).slice(0, 140)}`);
    }
  }
  const url = "https://api.twitter.com/2/tweets";
  const r = await fetch(url, {
    method: "POST",
    headers: { authorization: oauth1Header("POST", url), "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok)
    throw new Error(`X refused the post (${r.status}): ${JSON.stringify(j.errors || j.detail || j).slice(0, 160)}`);
  return j.data?.id || "";
}
async function publishPost({ platform, content, media, number, summary }) {
  if (!PUBLISH_PLATFORMS.includes(platform)) {
    return {
      ok: false,
      msg: `platform "${platform}" is not wired in the publisher yet (wired: ${PUBLISH_PLATFORMS.join(", ")}). Refile for a wired platform, or wire it in Make and extend PUBLISH_PLATFORMS`,
    };
  }
  if (platform === "youtube" && !media) {
    return { ok: false, msg: "youtube posts need MEDIA carrying the video url" };
  }
  if (media && !/^https?:\/\/\S+$/i.test(String(media))) {
    return {
      ok: false,
      msg: `MEDIA must be the full https link to the rendered file, not "${String(media).slice(0, 40)}". Refile with the exact video url from the render delivery`,
    };
  }
  if (platform === "x") {
    if (!xConfigured()) {
      return {
        ok: false,
        msg: "X posting needs X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET in the server .env; the owner creates these once in the X developer console, then restarts the service",
      };
    }
    try {
      const id = await postToX({ content, media });
      return { ok: true, msg: `posted to X with the brand account${id ? ` (post ${id})` : ""}` };
    } catch (e) {
      return { ok: false, msg: `X publish failed: ${String(e.message || e).slice(0, 160)}` };
    }
  }
  if (!PUBLISH_WEBHOOK) {
    return {
      ok: false,
      msg: "the publisher is not wired yet: build a Make scenario starting with a Custom Webhook, route by platform to your connected accounts, and put the webhook url in .env as MAKE_PUBLISH_WEBHOOK",
    };
  }
  try {
    const r = await fetch(PUBLISH_WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: PUBLISH_SECRET,
        platform,
        title: String(summary || "BlackCrown").replace(/[<>]/g, "").slice(0, 98),
        content: String(content).replace(/[<>]/g, ""),
        media: media || null,
        number,
        summary,
        from: "BlackCrown Regent",
      }),
    });
    if (!r.ok) return { ok: false, msg: `publisher webhook refused (${r.status}), check the Make scenario` };
    return { ok: true, msg: `handed to the publisher for ${platform}; Make posts it through your own account connections` };
  } catch (e) {
    return { ok: false, msg: `publisher unreachable: ${String(e.message || e).slice(0, 120)}` };
  }
}

wireCeo({
  indexNow: submitIndexNow,
  siteRoot: SITE_ROOT,
  audit: async () => (await doAudit()).pages,
  createJob: createJobFromProposal,
  makeEdit: applyMakeEdit,
  publish: publishPost,
  staffChannels: {
    Herald: (process.env.HERALD_CHANNEL_ID || "").trim(),
    Steward: (process.env.STEWARD_CHANNEL_ID || "").trim(),
  },
  jobNames: () => loadJobs().map((j) => j.name).filter(Boolean),
  assignFix: (author, text) => {
    const key = String(author || "").toLowerCase();
    if (key === "herald" || key === "steward") return staffAddTask(key, text);
    return addTask(text);
  },
});
// ---------------------------------------------------------------------------
// the forge: deterministic brand text baked onto generated footage. Words on
// video come from literal strings through ffmpeg, never from a video model,
// so spelling is perfect every time.
// ---------------------------------------------------------------------------
const RENDERS_DIR = path.join(__dirname, "renders");
try { fs.mkdirSync(RENDERS_DIR, { recursive: true }); } catch {}
app.use("/api/renders", express.static(RENDERS_DIR, { maxAge: "7d" }));
app.use("/renders", express.static(RENDERS_DIR, { maxAge: "7d" }));
// links handed out before the move pointed at /renders/, which the web server
// never forwarded here; this turns any such link into the one that works
function fixRenderUrl(u) {
  return String(u || "").replace(/(admin\.blackcrownvxj\.com)\/renders\//i, "$1/api/renders/");
}
const ADMIN_PUBLIC_URL = (process.env.ADMIN_PUBLIC_URL || "https://admin.blackcrownvxj.com").replace(/\/$/, "");
const FORGE_FONT = path.join(__dirname, "assets", "fonts", "DejaVuSans-Bold.ttf");
function forgeEscape(s) {
  return String(s)
    .replace(/[\\'"]/g, "")
    .replace(/:/g, "\\:")
    .replace(/%/g, "\\%")
    .replace(/[\u2014\u2013]/g, ", ")
    .slice(0, 48)
    .trim();
}
const ENDCARDS = path.join(__dirname, "assets", "endcards");
function endCardFor(target) {
  const t = String(target || "").toLowerCase();
  const k = ["korvus", "lodestone", "crown", "eclipse"].find((x) => t.includes(x)) || "brand";
  const f = path.join(ENDCARDS, `${k}.png`);
  return fs.existsSync(f) ? f : null;
}
async function forgeOverlay({ src, lines, name, target }) {
  // Text is typeset with libass (the bundled ffmpeg has no drawtext filter,
  // which is why early clips shipped raw). Two looks: "caption", the bold
  // lower-third line, and "word", the MONOLITH format: one letter-spaced
  // capital word per shot, dead center, fading in and out over a cold
  // desaturated grade.
  const raw = Array.isArray(lines) ? lines : [];
  const monolith = raw.some((l) => String(l.style || "").toLowerCase() === "word");
  const assText = (s) =>
    String(s || "")
      .replace(/[{}\\\r\n]/g, " ")
      .replace(/[\u2014\u2013]/g, ", ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 48);
  const safe = raw
    .map((l) => ({
      text: assText(l.text),
      word: monolith || String(l.style || "").toLowerCase() === "word",
      accent: String(l.color || "").toLowerCase() === "accent",
      t: Math.max(0, Number(l.t) || 0),
      d: Math.min(15, Math.max(0.8, Number(l.d) || 2.5)),
    }))
    .filter((l) => l.text)
    .slice(0, monolith ? 14 : 3);
  const card = endCardFor(target);
  if (!safe.length && !card) return null;
  const clean = String(name).replace(/[^a-z0-9-]/gi, "").slice(0, 40) || `clip-${Date.now()}`;
  const srcFile = path.join(RENDERS_DIR, `${clean}-src.mp4`);
  const assFile = path.join(RENDERS_DIR, `${clean}.ass`);
  const outFile = path.join(RENDERS_DIR, `${clean}.mp4`);
  const r = await fetch(src);
  if (!r.ok) throw new Error(`source download failed (${r.status})`);
  fs.writeFileSync(srcFile, Buffer.from(await r.arrayBuffer()));
  const ts = (sec) => {
    const cs = Math.round(sec * 100);
    const h = Math.floor(cs / 360000), m = Math.floor((cs % 360000) / 6000), s = Math.floor((cs % 6000) / 100), c = cs % 100;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
  };
  const ass = [
    "[Script Info]",
    "ScriptType: v4.00+",
    "PlayResX: 720",
    "PlayResY: 1280",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    "Style: Caption,DejaVu Sans,78,&H00F5F8F6,&H00FFFFFF,&H000D0A0A,&H590D0A0A,-1,0,0,0,100,100,0,0,3,10,0,2,60,60,380,1",
    "Style: Word,DejaVu Sans,46,&H00F5F2F2,&H00FFFFFF,&H00000000,&H8C000000,-1,0,0,0,100,100,14,0,1,0,3,5,40,40,0,1",
    "Style: WordAccent,DejaVu Sans,46,&H00952DFF,&H00FFFFFF,&H00000000,&H8C000000,-1,0,0,0,100,100,14,0,1,0,3,5,40,40,0,1",
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ...safe.map((l) => {
      const style = l.word ? (l.accent ? "WordAccent" : "Word") : "Caption";
      const fade = l.word ? `{\\fad(${Math.round(Math.min(300, l.d * 250))},${Math.round(Math.min(300, l.d * 250))})}` : "{\\fad(120,120)}";
      const body = l.word ? l.text.toUpperCase() : l.text;
      return `Dialogue: 0,${ts(l.t)},${ts(l.t + l.d)},${style},,0,0,0,,${fade}${body}`;
    }),
    "",
  ].join("\n");
  fs.writeFileSync(assFile, ass);
  const fontsDir = path.dirname(FORGE_FONT);
  const esc = (s) => s.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "");
  const grade = monolith ? ["eq=saturation=0.22:contrast=1.1:brightness=-0.03", "colorbalance=bs=0.10:bm=0.05", "vignette=PI/4.5"] : [];
  const textFx = safe.length ? [`ass='${esc(assFile)}':fontsdir='${esc(fontsDir)}'`] : [];
  const { default: ffmpegPath } = await import("ffmpeg-static");
  const { execFileSync, spawnSync } = await import("child_process");
  // the edit: footage at 720x1280, graded and captioned, then a crossfade into
  // the product's branded end card, with the sound faded out under it
  const probe = String(spawnSync(ffmpegPath, ["-hide_banner", "-i", srcFile], { encoding: "utf8" }).stderr || "");
  const dm = probe.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  const dur = dm ? +dm[1] * 3600 + +dm[2] * 60 + +dm[3] : 0;
  const hasAudio = /Stream #\S+.*Audio:/.test(probe);
  const fit = "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,setsar=1,fps=24,format=yuv420p";
  let args;
  if (card && dur > 2) {
    const CARD = 2.5, XF = 0.5, off = Math.max(0.5, dur - XF).toFixed(2);
    const fc = [
      `[0:v]${[fit, ...grade, ...textFx].join(",")}[main]`,
      `[1:v]scale=720:1280,setsar=1,fps=24,format=yuv420p[card]`,
      `[main][card]xfade=transition=fade:duration=${XF}:offset=${off}[v]`,
    ];
    if (hasAudio) fc.push(`[0:a]afade=t=out:st=${Math.max(0, dur - 1.2).toFixed(2)}:d=1.2,apad=pad_dur=${CARD}[a]`);
    args = ["-y", "-i", srcFile, "-loop", "1", "-t", String(CARD + XF), "-i", card, "-filter_complex", fc.join(";"), "-map", "[v]",
      ...(hasAudio ? ["-map", "[a]", "-c:a", "aac", "-b:a", "160k"] : []),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", outFile];
  } else {
    args = ["-y", "-i", srcFile, "-vf", [...grade, ...textFx].join(",") || "null", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", outFile];
  }
  try {
    execFileSync(ffmpegPath, args, { timeout: 300000, stdio: ["ignore", "ignore", "pipe"] });
  } catch (e) {
    const tail = String(e.stderr || e.message || e).split("\n").filter(Boolean).slice(-3).join(" | ");
    throw new Error(`forge ffmpeg failed: ${tail.slice(0, 300)}`);
  } finally {
    try { fs.unlinkSync(srcFile); } catch {}
    try { fs.unlinkSync(assFile); } catch {}
  }
  // keep the folder lean: drop forged clips older than 14 days
  try {
    const cutoff = Date.now() - 14 * 864e5;
    for (const f of fs.readdirSync(RENDERS_DIR)) {
      const fp = path.join(RENDERS_DIR, f);
      if (fs.statSync(fp).mtimeMs < cutoff) fs.unlinkSync(fp);
    }
  } catch {}
  return `${ADMIN_PUBLIC_URL}/api/renders/${clean}.mp4`;
}

// ---------------------------------------------------------------------------
// THE FURNACE: video rendering on the company's own AWS. An approved creative
// boots a spot GPU, renders an open model, uploads here, and terminates
// itself. Cost is spot-minutes on the owner's existing bill, with a hard
// monthly ceiling. The instance role on this box grants the authority; no
// keys live in .env.
// ---------------------------------------------------------------------------
const AWS_REGION = (process.env.AWS_RENDER_REGION || "us-east-2").trim();
const AWS_RENDER_TYPES = (process.env.AWS_RENDER_TYPES || "g5.xlarge,g4dn.xlarge")
  .split(",").map((s) => s.trim()).filter(Boolean);
const AWS_RENDER_CAP_MIN = Math.max(30, Number(process.env.AWS_RENDER_MONTHLY_MINUTES || 600));
const AWS_LEDGER_PATH = path.join(__dirname, "aws-render-ledger.json");
function awsLedger() {
  const month = new Date().toISOString().slice(0, 7);
  let l = { month, minutes: 0 };
  try { const j = JSON.parse(fs.readFileSync(AWS_LEDGER_PATH, "utf8")); if (j.month === month) l = j; } catch {}
  return l;
}
function awsLedgerAdd(mins) {
  const l = awsLedger();
  l.minutes = Math.round((l.minutes + mins) * 10) / 10;
  try { fs.writeFileSync(AWS_LEDGER_PATH, JSON.stringify(l)); } catch {}
  return l;
}
const awsJobs = new Map(); // job -> { status, error, notes: [] }
app.post("/api/render-note", (req, res) => {
  const { job, note } = req.body || {};
  const j = awsJobs.get(String(job || ""));
  if (j && note) {
    j.notes.push(String(note).slice(0, 200));
    if (/^FAILED/i.test(String(note))) { j.status = "failed"; j.error = String(note).slice(0, 200); }
    agentLog("render", `furnace ${job}: ${String(note).slice(0, 160)}`);
  }
  res.json({ ok: true });
});
app.post("/api/render-upload", express.raw({ type: () => true, limit: "400mb" }), (req, res) => {
  const secret = String(req.headers["x-render-secret"] || "");
  const job = String(req.headers["x-render-job"] || "").replace(/[^a-z0-9-]/gi, "").slice(0, 40);
  if (!PUBLISH_SECRET || secret !== PUBLISH_SECRET || !job) return res.status(403).json({ error: "no" });
  if (!req.body || !req.body.length) return res.status(400).json({ error: "empty" });
  try {
    fs.writeFileSync(path.join(RENDERS_DIR, `aws-${job}.mp4`), req.body);
    const j = awsJobs.get(job);
    if (j) j.status = "done";
    agentLog("render", `furnace ${job}: footage received, ${Math.round(req.body.length / 1024)}KB`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});
async function awsReapStale(ec2, cmds) {
  try {
    const d = await ec2.send(new cmds.DescribeInstancesCommand({
      Filters: [
        { Name: "tag:purpose", Values: ["blackcrown-render"] },
        { Name: "instance-state-name", Values: ["running", "pending"] },
      ],
    }));
    const stale = [];
    for (const r of d.Reservations || []) for (const i of r.Instances || []) {
      if (Date.now() - new Date(i.LaunchTime).getTime() > 75 * 60 * 1000) stale.push(i.InstanceId);
    }
    if (stale.length) {
      await ec2.send(new cmds.TerminateInstancesCommand({ InstanceIds: stale }));
      agentLog("render", `furnace reaped ${stale.length} stale worker(s)`);
    }
  } catch {}
}
async function awsRenderVideo({ prompt, number, seconds }) {
  let EC2, SSM;
  try {
    EC2 = await import("@aws-sdk/client-ec2");
    SSM = await import("@aws-sdk/client-ssm");
  } catch {
    throw new Error("AWS SDK not installed yet; the box deploys it on the next pull, retry in a few minutes");
  }
  const led = awsLedger();
  if (led.minutes >= AWS_RENDER_CAP_MIN) {
    throw new Error(`monthly GPU budget reached (${Math.round(led.minutes)} of ${AWS_RENDER_CAP_MIN} minutes); raise AWS_RENDER_MONTHLY_MINUTES in .env or wait for the new month`);
  }
  const ec2 = new EC2.EC2Client({ region: AWS_REGION });
  const ssm = new SSM.SSMClient({ region: AWS_REGION });
  await awsReapStale(ec2, EC2);
  const amiParam = await ssm.send(new SSM.GetParameterCommand({
    Name: "/aws/service/deeplearning/ami/x86_64/base-oss-nvidia-driver-gpu-ubuntu-22.04/latest/ami-id",
  }));
  const ami = amiParam?.Parameter?.Value;
  if (!ami) throw new Error("could not resolve the GPU machine image");
  const job = crypto.randomBytes(5).toString("hex");
  const segFrames = 193; // 8 seconds per segment at 24fps, two segments concat to 16s
  const segs = Math.max(1, Math.min(5, Math.round((Number(seconds) || 32) / 8)));
  const script = `#!/bin/bash
set -uo pipefail
JOB="${job}"; ADMIN="${ADMIN_PUBLIC_URL}"; SEC="${PUBLISH_SECRET}"
note(){ curl -s -m 10 -X POST -H "content-type: application/json" -d "{\\"job\\":\\"$JOB\\",\\"note\\":\\"$1\\"}" "$ADMIN/api/render-note" >/dev/null 2>&1 || true; }
fail(){ note "FAILED: $1"; sleep 2; shutdown -h now; exit 1; }
echo "${Buffer.from(String(prompt)).toString("base64")}" | base64 -d > /tmp/prompt.txt || fail "prompt decode"
note "worker booted, installing stack"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y >/dev/null 2>&1; apt-get install -y ffmpeg python3-venv python3-pip >/dev/null 2>&1 || fail "apt install"
python3 -m venv /opt/v || fail "venv"
. /opt/v/bin/activate
pip -q install --upgrade pip >/dev/null 2>&1
pip -q install torch --index-url https://download.pytorch.org/whl/cu121 || fail "torch install"
pip -q install diffusers transformers accelerate sentencepiece protobuf imageio imageio-ffmpeg opencv-python-headless || fail "diffusers install"
note "stack ready, loading model"
cat > /tmp/r.py <<'PYEOFX'
import torch, sys
from diffusers import LTXPipeline
from diffusers.utils import export_to_video
cap = torch.cuda.get_device_capability()[0]
dtype = torch.bfloat16 if cap >= 8 else torch.float16
pipe = LTXPipeline.from_pretrained("Lightricks/LTX-Video", torch_dtype=dtype)
pipe.to("cuda")
prompt = open("/tmp/prompt.txt").read()
neg = "text, letters, words, numbers, captions, subtitles, logos, watermarks, typography, ui, low quality, worst quality, deformed"
segs = int(sys.argv[1]); frames = int(sys.argv[2])
for i in range(segs):
    out = pipe(prompt=prompt, negative_prompt=neg, width=480, height=832,
               num_frames=frames, num_inference_steps=30, guidance_scale=3.2).frames[0]
    export_to_video(out, f"/tmp/seg{i}.mp4", fps=24)
PYEOFX
python3 /tmp/r.py ${segs} ${segFrames} || fail "render"
note "render done, encoding"
if [ ${segs} -gt 1 ]; then
  IN=""; FC=""
  for i in $(seq 0 $((${segs}-1))); do IN="$IN -i /tmp/seg$i.mp4"; FC="$FC[$i:v]"; done
  ffmpeg -y $IN -filter_complex "\${FC}concat=n=${segs}:v=1:a=0[v]" -map "[v]" -c:v libx264 -preset veryfast -crf 20 -movflags +faststart /tmp/out.mp4 || fail "concat"
else
  ffmpeg -y -i /tmp/seg0.mp4 -c:v libx264 -preset veryfast -crf 20 -movflags +faststart /tmp/out.mp4 || fail "encode"
fi
note "uploading"
curl -s -m 300 -X POST -H "x-render-secret: $SEC" -H "x-render-job: $JOB" -H "content-type: video/mp4" --data-binary @/tmp/out.mp4 "$ADMIN/api/render-upload" || fail "upload"
note "complete"
sleep 2
shutdown -h now
`;
  awsJobs.set(job, { status: "launching", notes: [], error: null });
  let instanceId = null, lastErr = null;
  for (const itype of AWS_RENDER_TYPES) {
    try {
      const run = await ec2.send(new EC2.RunInstancesCommand({
        ImageId: ami, InstanceType: itype, MinCount: 1, MaxCount: 1,
        InstanceInitiatedShutdownBehavior: "terminate",
        InstanceMarketOptions: { MarketType: "spot", SpotOptions: { SpotInstanceType: "one-time", InstanceInterruptionBehavior: "terminate" } },
        TagSpecifications: [{ ResourceType: "instance", Tags: [
          { Key: "Name", Value: `blackcrown-render-${job}` },
          { Key: "purpose", Value: "blackcrown-render" },
        ] }],
        UserData: Buffer.from(script).toString("base64"),
      }));
      instanceId = run?.Instances?.[0]?.InstanceId || null;
      if (instanceId) { agentLog("render", `furnace ${job}: ${itype} spot launched (${instanceId})`); break; }
    } catch (e) {
      lastErr = e;
      agentLog("render", `furnace ${job}: ${itype} refused: ${String(e.message || e).slice(0, 140)}`);
    }
  }
  if (!instanceId) {
    awsJobs.delete(job);
    const msg = String(lastErr?.message || lastErr || "no instance type available");
    if (/MaxSpotInstanceCount|Max spot instance count|VcpuLimitExceeded/i.test(msg)) {
      throw new Error("AWS refused the spot GPU: the G-instance spot quota is still 0. Approve the Service Quotas request (All G and VT Spot Instance Requests) and retry");
    }
    if (/service-linked role/i.test(msg)) {
      throw new Error("AWS has never run a spot instance on this account, and this server is not allowed to create the one-time spot role. Fix once, as the account owner, in AWS CloudShell: aws iam create-service-linked-role --aws-service-name spot.amazonaws.com  Then retry the render");
    }
    throw new Error(`could not launch a GPU worker: ${msg.slice(0, 180)}`);
  }
  const t0 = Date.now();
  try {
    for (;;) {
      await new Promise((r) => setTimeout(r, 15000));
      const j = awsJobs.get(job);
      if (j?.status === "done") break;
      if (j?.status === "failed") throw new Error(j.error || "worker reported failure");
      if (Date.now() - t0 > 40 * 60 * 1000) throw new Error("GPU render timed out after 40 minutes");
    }
  } catch (e) {
    try { await ec2.send(new EC2.TerminateInstancesCommand({ InstanceIds: [instanceId] })); } catch {}
    awsLedgerAdd((Date.now() - t0) / 60000);
    awsJobs.delete(job);
    throw e;
  }
  try { await ec2.send(new EC2.TerminateInstancesCommand({ InstanceIds: [instanceId] })); } catch {}
  const l = awsLedgerAdd((Date.now() - t0) / 60000);
  awsJobs.delete(job);
  agentLog("render", `furnace ${job}: delivered in ${Math.round((Date.now() - t0) / 60000)} min; ${Math.round(l.minutes)} of ${AWS_RENDER_CAP_MIN} GPU minutes used this month`);
  return `${ADMIN_PUBLIC_URL}/api/renders/aws-${job}.mp4`;
}

// ---------------------------------------------------------------------------
// THE BRAIN GALAXY: the vault as a graph. Built lazily on request and cached
// five minutes, so the server does zero work unless someone is looking; all
// rendering happens in the viewer's browser.
// ---------------------------------------------------------------------------
// "intel" is the Korvus crawler's ecosystem (korvus_vault.py on the Korvus box
// writes intel/README, Universe, Filings/, Tickers/, Bot/, Bot/Trades/)
const BRAIN_DESKS = ["corvid", "herald", "steward", "bard", "regent", "intel"];
let brainGraphCache = { at: 0, data: null };
function buildBrainGraph() {
  const root = BRAIN_REPO_DIR;
  const nodes = [];
  const byName = new Map();
  const walk = (dir, desk, sub, depth) => {
    let ents = [];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of ents) {
      if (e.name.startsWith(".")) continue;
      const fp = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (depth < 4) walk(fp, desk, sub || e.name, depth + 1);
      } else if (e.name.endsWith(".md")) {
        let st;
        try { st = fs.statSync(fp); } catch { continue; }
        const id = path.relative(root, fp).split(path.sep).join("/");
        const title = e.name.replace(/\.md$/, "");
        const n = { id, title, desk, sub: sub || "", mtime: st.mtimeMs, size: st.size, out: [], deg: 0 };
        nodes.push(n);
        const key = title.toLowerCase();
        if (!byName.has(key)) byName.set(key, n);
        byName.set(id.replace(/\.md$/, "").toLowerCase(), n);
      }
    }
  };
  for (const d of BRAIN_DESKS) walk(path.join(root, d), d, "", 0);
  const edges = [];
  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  for (const n of nodes) {
    let text = "";
    try {
      const fd = fs.openSync(path.join(root, n.id), "r");
      const buf = Buffer.alloc(Math.min(n.size, 24000));
      fs.readSync(fd, buf, 0, buf.length, 0);
      fs.closeSync(fd);
      text = buf.toString("utf8");
    } catch {}
    const seen = new Set();
    for (const m of text.matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) {
      const t = byName.get(m[1].trim().toLowerCase());
      if (!t || t === n || seen.has(t.id)) continue;
      seen.add(t.id);
      edges.push([idx.get(n.id), idx.get(t.id)]);
      t.deg++;
      n.deg++;
    }
  }
  const DAY = 86400000;
  const now = Date.now();
  const days = Array.from({ length: 14 }, () => 0);
  const perDesk = {};
  for (const d of BRAIN_DESKS) perDesk[d] = 0;
  for (const n of nodes) {
    perDesk[n.desk]++;
    const ago = Math.floor((now - n.mtime) / DAY);
    if (ago >= 0 && ago < 14) days[13 - ago]++;
  }
  let lessons = 0;
  try { lessons = (fs.readFileSync(path.join(root, "corvid", "Patterns.md"), "utf8").match(/HEALER LESSON/g) || []).length; } catch {}
  const pick = (arr) => arr.map((n) => ({ id: n.id, title: n.title, desk: n.desk, mtime: n.mtime, deg: n.deg }));
  return {
    builtAt: now,
    nodes: nodes.map((n) => ({ id: n.id, t: n.title, d: n.desk, s: n.sub, m: Math.round(n.mtime / 1000), g: n.deg })),
    edges: edges.slice(0, 8000),
    stats: {
      notes: nodes.length,
      links: edges.length,
      perDesk,
      updatedToday: days[13],
      days,
      lessons,
      core: nodes.find((n) => n.id === "corvid/Institution.md") ? "corvid/Institution.md" : null,
      connected: pick([...nodes].sort((a, b) => b.deg - a.deg).slice(0, 8)),
      recent: pick([...nodes].sort((a, b) => b.mtime - a.mtime).slice(0, 10)),
    },
  };
}
app.get("/api/brain-graph", (_req, res) => {
  try {
    if (!brainGraphCache.data || Date.now() - brainGraphCache.at > 5 * 60 * 1000) {
      brainGraphCache = { at: Date.now(), data: buildBrainGraph() };
    }
    res.json(brainGraphCache.data);
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});
app.get("/api/brain-note", (req, res) => {
  const id = String(req.query.id || "");
  const root = path.resolve(BRAIN_REPO_DIR);
  const fp = path.resolve(root, id);
  if (!id.endsWith(".md") || !fp.startsWith(root + path.sep)) return res.status(400).json({ error: "bad note" });
  try {
    const st = fs.statSync(fp);
    const text = fs.readFileSync(fp, "utf8").slice(0, 80000);
    res.json({ id, title: path.basename(fp, ".md"), mtime: st.mtimeMs, text, truncated: st.size > 80000 });
  } catch {
    res.status(404).json({ error: "note not found" });
  }
});

// ---------------------------------------------------------------------------
// THE ECLIPSE-X ARCADE: a Discord Activity with four games. Read the Tape,
// Headline or Hoax, The Open, Daily Cipher. Zero AI spend: real historical
// futures bars, real headlines, a curated word list. Scores live server side
// so the weekly board can be trusted.
// ---------------------------------------------------------------------------
const ARCADE_PATH = path.join(__dirname, "arcade-scores.json");
const arcadeRounds = new Map(); // round id -> server-side truth
const ACT_UA = "Mozilla/5.0 (compatible; BlackCrownArcade/1.0)";
function etParts(ms) {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short" });
  const o = {};
  for (const p of f.formatToParts(new Date(ms))) o[p.type] = p.value;
  return { day: `${o.year}-${o.month}-${o.day}`, h: Number(o.hour) % 24, m: Number(o.minute), wd: o.weekday };
}
function arcadeWeek(ms = Date.now()) {
  const d = new Date(ms);
  const day = (d.getUTCDay() + 6) % 7;
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
  return monday.toISOString().slice(0, 10);
}
function arcadeLoad() {
  let s = { week: arcadeWeek(), users: {} };
  try { s = JSON.parse(fs.readFileSync(ARCADE_PATH, "utf8")); } catch {}
  if (s.week !== arcadeWeek()) {
    for (const u of Object.values(s.users || {})) { u.tape = 0; u.hoax = 0; u.openBest = null; }
    s.week = arcadeWeek();
  }
  s.users = s.users || {};
  return s;
}
function arcadeSave(s) {
  try { fs.writeFileSync(ARCADE_PATH, JSON.stringify(s)); } catch {}
}
function arcadeUser(s, who) {
  const u = (s.users[who.id] = s.users[who.id] || { tape: 0, hoax: 0, openBest: null, streak: 0, lastSolved: null, cipher: null });
  u.name = who.name;
  u.avatar = who.avatar || null;
  return u;
}
function newRoundId() {
  for (const [k, v] of arcadeRounds) if (Date.now() - v.at > 30 * 60 * 1000) arcadeRounds.delete(k);
  return crypto.randomBytes(8).toString("hex");
}

// identity: a Discord access token from the Embedded App SDK, verified with
// Discord and cached. Browser visitors play as guests and never touch the board.
const actTokens = new Map();
async function actWho(req) {
  const tok = String(req.headers["x-activity-token"] || "");
  if (!tok) return null;
  const hit = actTokens.get(tok);
  if (hit && Date.now() - hit.at < 10 * 60 * 1000) return hit.user;
  try {
    const r = await fetch("https://discord.com/api/v10/users/@me", { headers: { authorization: `Bearer ${tok}` } });
    if (!r.ok) return null;
    const j = await r.json();
    const user = {
      id: String(j.id),
      name: String(j.global_name || j.username || "player").slice(0, 32),
      avatar: j.avatar ? `https://cdn.discordapp.com/avatars/${j.id}/${j.avatar}.png?size=64` : null,
    };
    actTokens.set(tok, { at: Date.now(), user });
    if (actTokens.size > 2000) actTokens.clear();
    return user;
  } catch {
    return null;
  }
}
let actClientId = (process.env.DISCORD_CLIENT_ID || "").trim();
async function actGetClientId() {
  if (actClientId) return actClientId;
  const bot = (process.env.DISCORD_BOT_TOKEN || "").trim();
  if (!bot) return "";
  try {
    const r = await fetch("https://discord.com/api/v10/oauth2/applications/@me", { headers: { authorization: `Bot ${bot}` } });
    if (r.ok) actClientId = String((await r.json()).id || "");
  } catch {}
  return actClientId;
}
app.get("/api/activity/config", async (_req, res) => {
  res.json({ clientId: await actGetClientId(), ready: !!(process.env.DISCORD_CLIENT_SECRET || "").trim() });
});
app.post("/api/activity/token", async (req, res) => {
  const code = String(req.body?.code || "");
  const secret = (process.env.DISCORD_CLIENT_SECRET || "").trim();
  const id = await actGetClientId();
  if (!code || !secret || !id) return res.status(400).json({ error: "activity not configured: DISCORD_CLIENT_SECRET missing in .env" });
  try {
    const r = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: id, client_secret: secret, grant_type: "authorization_code", code }),
    });
    const j = await r.json();
    if (!r.ok || !j.access_token) return res.status(400).json({ error: j.error_description || "token exchange failed" });
    res.json({ access_token: j.access_token });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

// market bars: real 5 minute ES and NQ history, cached six hours, with a
// labelled simulation fallback so a data outage never breaks the games
const barCache = {};
async function arcadeBars(sym) {
  const c = barCache[sym];
  if (c && Date.now() - c.at < 6 * 3600 * 1000) return c;
  try {
    const r = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=5m&range=60d`, { headers: { "user-agent": ACT_UA } });
    const j = await r.json();
    const res0 = j?.chart?.result?.[0];
    const q = res0?.indicators?.quote?.[0];
    const ts = res0?.timestamp || [];
    const bars = [];
    ts.forEach((t, i) => {
      const o = q.open[i], h = q.high[i], l = q.low[i], cl = q.close[i];
      if ([o, h, l, cl].every((x) => typeof x === "number" && isFinite(x))) bars.push({ t: t * 1000, o, h, l, c: cl });
    });
    if (bars.length > 500) {
      barCache[sym] = { at: Date.now(), bars, simulated: false };
      return barCache[sym];
    }
  } catch {}
  // simulation: volatility-clustered random walk at index-futures scale
  const bars = [];
  let p = sym.startsWith("NQ") ? 21000 : 6000, vol = p * 0.0009, t = Date.now() - 4000 * 300000;
  for (let i = 0; i < 4000; i++) {
    vol = Math.max(p * 0.0003, Math.min(p * 0.003, vol * (0.9 + Math.random() * 0.22)));
    const o = p, cl = p + (Math.random() - 0.5) * 2 * vol;
    bars.push({ t, o, h: Math.max(o, cl) + Math.random() * vol * 0.6, l: Math.min(o, cl) - Math.random() * vol * 0.6, c: cl });
    p = cl;
    t += 300000;
  }
  barCache[sym] = { at: Date.now(), bars, simulated: true };
  return barCache[sym];
}
const round2 = (x) => Math.round(x * 100) / 100;
const packBars = (bars) => bars.map((b) => [round2(b.o), round2(b.h), round2(b.l), round2(b.c)]);

// 1. READ THE TAPE: 30 bars shown, six calls on the next three bars each
app.get("/api/activity/tape", async (_req, res) => {
  const sym = Math.random() < 0.5 ? "ES=F" : "NQ=F";
  const { bars, simulated } = await arcadeBars(sym);
  const need = 30 + 6 * 3;
  let start = 0;
  for (let tries = 0; tries < 40; tries++) {
    start = Math.floor(Math.random() * (bars.length - need));
    const span = bars[start + need - 1].t - bars[start].t;
    if (span < need * 300000 * 1.5) break; // contiguous session, no weekend gap
  }
  const win = bars.slice(start, start + need);
  const body = win.slice(0, 30).reduce((a, b) => a + Math.abs(b.c - b.o), 0) / 30;
  const id = newRoundId();
  arcadeRounds.set(id, { at: Date.now(), kind: "tape", win, thr: body * 0.6, step: 0, score: 0 });
  res.json({ id, symbol: sym.replace("=F", ""), simulated, bars: packBars(win.slice(0, 30)), steps: 6 });
});
app.post("/api/activity/tape/call", async (req, res) => {
  const r = arcadeRounds.get(String(req.body?.id || ""));
  if (!r || r.kind !== "tape" || r.step >= 6) return res.status(400).json({ error: "round over" });
  const call = String(req.body?.call || "");
  const from = 30 + r.step * 3;
  const reveal = r.win.slice(from, from + 3);
  const move = reveal[2].c - r.win[from - 1].c;
  const truth = move > r.thr ? "up" : move < -r.thr ? "down" : "chop";
  const correct = call === truth;
  if (correct) r.score++;
  r.step++;
  let total = null;
  if (r.step >= 6) {
    const who = await actWho(req);
    if (who) {
      const s = arcadeLoad();
      const u = arcadeUser(s, who);
      u.tape += r.score;
      arcadeSave(s);
      total = u.tape;
    }
  }
  res.json({ truth, correct, move: round2(move), bars: packBars(reveal), score: r.score, done: r.step >= 6, weekTotal: total });
});

// 2. HEADLINE OR HOAX: one real headline, one with its facts flipped
let headlineCache = { at: 0, list: [] };
const HEADLINE_FALLBACK = [
  "Fed raises rates by 75 basis points, the largest hike since 1994",
  "S&P 500 closes at a record high as tech stocks rally",
  "Nasdaq falls 3% as bond yields jump",
  "Oil prices surge after OPEC+ announces surprise production cuts",
  "US economy adds 263,000 jobs, beating expectations",
  "Consumer prices rise 0.4% in March as gasoline costs climb",
  "Dow drops more than 500 points as recession fears mount",
  "Treasury 10-year yield climbs above 4% for the first time since 2008",
  "Nvidia shares jump 24% after blowout earnings forecast",
  "Gold hits record high above $2,400 an ounce",
  "Fed holds rates steady and signals three cuts this year",
  "Unemployment rate rises to 4.3%, highest in nearly three years",
  "Retail sales fall 0.9% in December, missing forecasts",
  "Apple becomes the first company to reach a $3 trillion market value",
  "Bitcoin falls below $20,000 as crypto selloff deepens",
  "ECB raises rates by half a point to fight inflation",
  "Inflation cools to 3.2% in October, lower than expected",
  "Stocks rally as cooler inflation data fuels rate cut hopes",
];
async function arcadeHeadlines() {
  if (headlineCache.list.length && Date.now() - headlineCache.at < 30 * 60 * 1000) return headlineCache.list;
  const feeds = ["https://www.cnbc.com/id/20910258/device/rss/rss.html", "https://feeds.content.dowjones.io/public/rss/mw_topstories"];
  const out = [];
  for (const f of feeds) {
    try {
      const r = await fetch(f, { headers: { "user-agent": ACT_UA } });
      const x = await r.text();
      for (const m of x.matchAll(/<item>[\s\S]*?<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/g)) {
        const t = m[1].replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
        if (t.length > 25 && t.length < 140) out.push(t);
      }
    } catch {}
  }
  headlineCache = { at: Date.now(), list: out.length >= 8 ? out : HEADLINE_FALLBACK };
  return headlineCache.list;
}
const HOAX_SWAPS = [
  ["rises", "falls"], ["rise", "fall"], ["gains", "losses"], ["beats", "misses"], ["beating", "missing"],
  ["hike", "cut"], ["higher", "lower"], ["jumps", "slumps"], ["jump", "slump"],
  ["surges", "plunges"], ["surge", "plunge"], ["rally", "slump"], ["rallies", "sinks"], ["climbs", "sinks"],
  ["record high", "record low"], ["above", "below"], ["up", "down"], ["more than expected", "less than expected"],
  ["cools", "heats up"], ["drops", "soars"], ["falls", "climbs"], ["soars", "tumbles"],
];
const HOAX_PHRASES = [
  ["falls below", "rises above"], ["drops below", "climbs above"], ["sinks below", "jumps above"],
  ["rises above", "falls below"], ["climbs above", "drops below"], ["tops", "falls short of"],
  ["beats expectations", "misses expectations"], ["beating expectations", "missing expectations"],
  ["raises rates", "cuts rates"], ["cuts rates", "raises rates"], ["record high", "record low"],
];
function hoaxOf(h) {
  let out = h, changed = false;
  for (const [a, b] of HOAX_PHRASES) {
    const re = new RegExp(`\\b${a}\\b`, "i");
    if (re.test(out)) {
      out = out.replace(re, (m) => (m[0] === m[0].toUpperCase() ? b[0].toUpperCase() + b.slice(1) : b));
      changed = true;
      break;
    }
  }
  if (!changed) for (const [a, b] of HOAX_SWAPS.sort(() => Math.random() - 0.5)) {
    const re = new RegExp(`\\b(${a}|${b})\\b`, "i");
    const m = out.match(re);
    if (m) {
      const w = m[1].toLowerCase() === a ? b : a;
      const keepCap = m[1][0] === m[1][0].toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w;
      out = out.replace(re, keepCap);
      changed = true;
      break;
    }
  }
  // only mutate figures that are clearly data: dollar amounts, percentages,
  // point moves, or comma-grouped counts; never names like S&P 500 or years
  const num = out.match(/(\$)(\d[\d,]*\.?\d*)( trillion| billion| million)?|(\d[\d,]*\.?\d*)(%| basis points| points)|(\d{1,3}(?:,\d{3})+)/);
  if (num && (!changed || Math.random() < 0.5)) {
    const raw = num[2] || num[4] || num[6];
    const pre = num[1] || "";
    const suf = num[3] || num[5] || "";
    const v = Number(raw.replace(/,/g, ""));
    if (isFinite(v) && v > 0) {
      const nv = v * (Math.random() < 0.5 ? 0.6 + Math.random() * 0.25 : 1.2 + Math.random() * 0.35);
      const step = raw.includes(",") ? 1000 : 1;
      const fmt = raw.includes(".") ? nv.toFixed(1) : (Math.round(nv / step) * step).toLocaleString("en-US");
      out = out.replace(num[0], `${pre}${fmt}${suf}`);
      changed = true;
    }
  }
  return changed && out !== h ? out : null;
}
app.get("/api/activity/hoax", async (_req, res) => {
  const list = await arcadeHeadlines();
  for (let i = 0; i < 30; i++) {
    const real = list[Math.floor(Math.random() * list.length)];
    const fake = hoaxOf(real);
    if (!fake) continue;
    const realFirst = Math.random() < 0.5;
    const id = newRoundId();
    arcadeRounds.set(id, { at: Date.now(), kind: "hoax", real: realFirst ? "a" : "b" });
    return res.json({ id, a: realFirst ? real : fake, b: realFirst ? fake : real });
  }
  res.status(503).json({ error: "no headlines right now, try again shortly" });
});
app.post("/api/activity/hoax/answer", async (req, res) => {
  const id = String(req.body?.id || "");
  const r = arcadeRounds.get(id);
  if (!r || r.kind !== "hoax") return res.status(400).json({ error: "round expired" });
  arcadeRounds.delete(id);
  const correct = String(req.body?.pick || "") === r.real;
  let total = null;
  const who = await actWho(req);
  if (who && correct) {
    const s = arcadeLoad();
    const u = arcadeUser(s, who);
    u.hoax++;
    arcadeSave(s);
    total = u.hoax;
  }
  res.json({ correct, real: r.real, weekTotal: total });
});

// 3. THE OPEN: a real historical open, 9:00 to 10:45 ET, replayed bar by bar
app.get("/api/activity/open", async (_req, res) => {
  const sym = Math.random() < 0.5 ? "ES=F" : "NQ=F";
  const { bars, simulated } = await arcadeBars(sym);
  const days = {};
  for (const b of bars) {
    const e = etParts(b.t);
    if (e.wd === "Sat" || e.wd === "Sun") continue;
    const mins = e.h * 60 + e.m;
    if (mins >= 540 && mins < 645) (days[e.day] = days[e.day] || []).push(b);
  }
  const full = Object.values(days).filter((d) => d.length >= 20);
  const session = simulated || !full.length ? bars.slice(-21) : full[Math.floor(Math.random() * full.length)].slice(0, 21);
  const id = newRoundId();
  arcadeRounds.set(id, { at: Date.now(), kind: "open", session, sym });
  res.json({ id, symbol: sym.replace("=F", ""), simulated, bars: packBars(session), openIndex: 6, pointValue: sym.startsWith("NQ") ? 20 : 50 });
});
app.post("/api/activity/open/finish", async (req, res) => {
  const id = String(req.body?.id || "");
  const r = arcadeRounds.get(id);
  if (!r || r.kind !== "open") return res.status(400).json({ error: "session expired" });
  arcadeRounds.delete(id);
  // positions[i] is -1, 0 or 1, held from the close of bar i to the close of bar i+1
  const pos = Array.isArray(req.body?.positions) ? req.body.positions.map((x) => Math.max(-1, Math.min(1, Math.round(Number(x) || 0)))) : [];
  let pnl = 0, peak = 0, dd = 0, trades = 0;
  for (let i = 0; i < r.session.length - 1; i++) {
    const p = pos[i] || 0;
    if (i > 0 && p !== (pos[i - 1] || 0)) trades++;
    pnl += p * (r.session[i + 1].c - r.session[i].c);
    peak = Math.max(peak, pnl);
    dd = Math.max(dd, peak - pnl);
  }
  const score = round2(pnl - dd * 0.5);
  let best = null;
  const who = await actWho(req);
  if (who) {
    const s = arcadeLoad();
    const u = arcadeUser(s, who);
    if (u.openBest === null || score > u.openBest) u.openBest = score;
    arcadeSave(s);
    best = u.openBest;
  }
  res.json({ pnl: round2(pnl), drawdown: round2(dd), trades, score, weekBest: best });
});

// 4. DAILY CIPHER: one five-letter market word a day, six guesses, streaks
const CIPHER_WORDS = [
  "TREND", "SHORT", "PRICE", "DELTA", "GAMMA", "THETA", "YIELD", "HEDGE", "LIMIT", "STOPS",
  "BEARS", "BULLS", "RALLY", "FLOAT", "BONDS", "INDEX", "PIVOT", "SWING", "SCALP", "TAPER",
  "ASSET", "BASIS", "STOCK", "SPLIT", "QUOTE", "TRADE", "RANGE", "ALPHA", "GREED", "PANIC",
  "CRASH", "SPIKE", "WHALE", "ORDER", "BLOCK", "FILLS", "LONGS", "CLOSE", "CHART", "MACRO",
  "RATES", "CYCLE", "SHARE", "VALUE", "ENTRY", "TICKS", "BOOKS", "LEVEL", "SWAPS",
  "WICKS", "OFFER", "MONEY", "RISKS", "GAINS", "BREAK", "FLOOR", "PROXY", "BASES",
];
function cipherWordFor(day) {
  let h = 0;
  for (const ch of `eclipse-x:${day}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return CIPHER_WORDS[h % CIPHER_WORDS.length];
}
function cipherScore(guess, word) {
  const res = Array(5).fill("miss");
  const left = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === word[i]) res[i] = "hit";
    else left[word[i]] = (left[word[i]] || 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (res[i] !== "hit" && left[guess[i]]) { res[i] = "near"; left[guess[i]]--; }
  }
  return res;
}
const guestCipher = new Map();
app.get("/api/activity/cipher", async (req, res) => {
  const day = etParts(Date.now()).day;
  const who = await actWho(req);
  let st = null, streak = 0;
  if (who) {
    const s = arcadeLoad();
    const u = arcadeUser(s, who);
    if (!u.cipher || u.cipher.day !== day) u.cipher = { day, guesses: [], solved: false };
    arcadeSave(s);
    st = u.cipher;
    streak = u.streak;
  } else {
    const g = String(req.headers["x-guest"] || "guest").slice(0, 40);
    st = guestCipher.get(g);
    if (!st || st.day !== day) { st = { day, guesses: [], solved: false }; guestCipher.set(g, st); }
  }
  const word = cipherWordFor(day);
  res.json({ day, guesses: st.guesses.map((g) => ({ word: g, marks: cipherScore(g, word) })), solved: st.solved, over: st.solved || st.guesses.length >= 6, streak, answer: st.solved || st.guesses.length >= 6 ? word : null });
});
app.post("/api/activity/cipher/guess", async (req, res) => {
  const guess = String(req.body?.guess || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (guess.length !== 5) return res.status(400).json({ error: "five letters" });
  const day = etParts(Date.now()).day;
  const word = cipherWordFor(day);
  const who = await actWho(req);
  let st, s = null, u = null;
  if (who) {
    s = arcadeLoad();
    u = arcadeUser(s, who);
    if (!u.cipher || u.cipher.day !== day) u.cipher = { day, guesses: [], solved: false };
    st = u.cipher;
  } else {
    const g = String(req.headers["x-guest"] || "guest").slice(0, 40);
    st = guestCipher.get(g);
    if (!st || st.day !== day) { st = { day, guesses: [], solved: false }; guestCipher.set(g, st); }
  }
  if (st.solved || st.guesses.length >= 6) return res.status(400).json({ error: "today is done, come back tomorrow" });
  st.guesses.push(guess);
  if (guess === word) st.solved = true;
  const over = st.solved || st.guesses.length >= 6;
  if (u && over) {
    const yesterday = etParts(Date.now() - 86400000).day;
    if (st.solved) {
      u.streak = u.lastSolved === yesterday || u.lastSolved === day ? (u.lastSolved === day ? u.streak : u.streak + 1) : 1;
      u.lastSolved = day;
    } else {
      u.streak = 0;
    }
  }
  if (s) arcadeSave(s);
  res.json({ marks: cipherScore(guess, word), solved: st.solved, over, answer: over ? word : null, streak: u ? u.streak : 0 });
});

// the weekly board
app.get("/api/activity/board", (_req, res) => {
  const s = arcadeLoad();
  const all = Object.entries(s.users).map(([id, u]) => ({ id, name: u.name, avatar: u.avatar, tape: u.tape || 0, hoax: u.hoax || 0, openBest: u.openBest, streak: u.streak || 0 }));
  const top = (k, f = (x) => x[k]) => all.filter((u) => f(u) !== null && f(u) > 0).sort((a, b) => f(b) - f(a)).slice(0, 5).map((u) => ({ name: u.name, avatar: u.avatar, v: f(u) }));
  res.json({ week: s.week, tape: top("tape"), hoax: top("hoax"), open: top("openBest"), streak: top("streak") });
});

// the wire: a live ledger of desk-to-desk handoffs, drawn in the city
const WIRE = [];
function recordWire(from, to, text) {
  WIRE.unshift({ t: Date.now(), from: String(from).toLowerCase(), to: String(to).toLowerCase(), text: String(text).replace(/^From \w+: /, "").slice(0, 120) });
  if (WIRE.length > 80) WIRE.length = 80;
}
app.get("/api/wire", (_req, res) => res.json({ wire: WIRE.slice(0, 40) }));

wireHooks({
  readPage: (page, find) => readPageSource(page, find),
  forge: forgeOverlay,
  awsRender: awsRenderVideo,
  requestStaff: (to, title) => {
    if (["herald", "steward", "bard"].includes(to)) {
      staffAddTask(to, title);
      recordWire("corvid", to, title);
    }
  },
  onFiled: receiveProposals,
  ownerDecision,
  // every approved creative passes through the sales desk before it ships
  copyPass: async (input) => heraldCopyPass({ ...input, trends: await readTrends().catch(() => null) }),
});
startAgent();
startCeo();
startStaff();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BlackCrown render + generation service on http://localhost:${PORT}`);
});
