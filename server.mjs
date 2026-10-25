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
} from "./agent.mjs";
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
} from "./ceo.mjs";
import { startStaff, wireStaff, staffStates, staffSetEnabled, staffRunCycle, staffAddTask, heraldCopyPass } from "./staff.mjs";
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
    if ((e === "visit" || e === "click") && k) {
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
        model: "claude-sonnet-4-6",
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
      if (depth > 2 || found.length >= 12) return;
      let entries = [];
      try {
        entries = fs.readdirSync(d, { withFileTypes: true });
      } catch {
        return;
      }
      for (const f of entries) {
        if (found.length >= 12) break;
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
        model: "claude-sonnet-4-6",
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

const companyFeed = async (key) => {
    const lines = [];
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
      lines.push(`TRAFFIC: today ${sum(dk, "visit")} visits ${sum(dk, "click")} clicks; 7d ${v7} visits ${c7} clicks`);
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
wireStaff({ feed: companyFeed });

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
    const text = await thinkText(JOB_SYSTEM, `REPORT SPEC:\n${job.spec}\n\nLIVE COMPANY DATA:\n${data}`, 1200);
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

wireCeo({ siteRoot: SITE_ROOT, audit: async () => (await doAudit()).pages, createJob: createJobFromProposal });
wireHooks({
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
