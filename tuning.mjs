// tuning.mjs: the owner's live dials for every agent, set from the admin's
// Settings tab and applied on the very next tick. No .env edit, no restart.
// The .env values are the defaults; anything saved here overrides them.
// Every value is clamped to a safe range, so no setting can run an agent
// wild or stop the floor by accident.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TUNING_PATH = process.env.TUNING_PATH || path.join(__dirname, "studio-tuning.json");
const env = (k, d) => {
  const v = Number(process.env[k]);
  return Number.isFinite(v) && process.env[k] !== "" && process.env[k] != null ? v : d;
};
const envStr = (k) => String(process.env[k] || "").trim();

// The schema the admin renders: one entry per dial, with its range.
export const TUNING_SCHEMA = {
  "budget.dailyUsd": { label: "Daily model budget", unit: "USD", min: 0, max: 200, step: 0.5, def: env("AGENT_DAILY_BUDGET_USD", 5) },
  "budget.nightThrottle": { label: "Night throttle, 1 to 7 AM ET runs at half pace", type: "bool", def: true },
  "budget.cacheKeeper": { label: "Keep prompts warm in the model cache (a tiny ping before each one expires)", type: "bool", def: true },
  "shares.corvid": { label: "Corvid share of the budget", unit: "%", min: 5, max: 100, step: 5, def: env("AGENT_SHARE_CORVID", 0.4) * 100 },
  "shares.herald": { label: "Herald share", unit: "%", min: 5, max: 100, step: 5, def: env("AGENT_SHARE_HERALD", 0.3) * 100 },
  "shares.steward": { label: "Steward share", unit: "%", min: 5, max: 100, step: 5, def: env("AGENT_SHARE_STEWARD", 0.3) * 100 },
  "shares.bard": { label: "Bard share", unit: "%", min: 5, max: 100, step: 5, def: env("AGENT_SHARE_BARD", 0.3) * 100 },
  "corvid.model": { label: "Corvid cycle model", type: "model", def: envStr("AGENT_MODEL") },
  "corvid.workModel": { label: "Corvid task model", type: "model", def: envStr("AGENT_WORK_MODEL") },
  "corvid.cycleEveryMin": {
    label: "Corvid full cycle every",
    unit: "min",
    min: 30,
    max: 1440,
    step: 15,
    def: env("AGENT_CYCLE_EVERY_MIN", 0) >= 1 ? env("AGENT_CYCLE_EVERY_MIN", 0) : env("AGENT_CYCLE_EVERY_H", 0) > 0 ? env("AGENT_CYCLE_EVERY_H", 0) * 60 : 1440,
  },
  "corvid.workGapMin": { label: "Corvid minutes between task steps", unit: "min", min: 2, max: 120, step: 1, def: env("AGENT_WORK_GAP_MIN", 5) },
  "corvid.dailySteps": { label: "Corvid task steps per day", unit: "steps", min: 0, max: 200, step: 4, def: env("AGENT_WORK_DAILY_CAP", 48) },
  "staff.model": { label: "Herald, Steward and Bard model", type: "model", def: envStr("STAFF_MODEL") },
  "staff.cycleEveryH": { label: "Staff full cycle every", unit: "h", min: 1, max: 24, step: 1, def: env("STAFF_CYCLE_EVERY_H", 2) },
  "staff.workGapMin": { label: "Staff minutes between task steps", unit: "min", min: 2, max: 120, step: 1, def: env("STAFF_WORK_GAP_MIN", 6) },
  "staff.dailySteps": { label: "Staff task steps per desk per day", unit: "steps", min: 0, max: 200, step: 4, def: env("STAFF_WORK_DAILY_CAP", 32) },
  "crew.queueCap": { label: "Open tasks per desk, max", unit: "tasks", min: 5, max: 60, step: 1, def: env("CREW_QUEUE_CAP", 15) },
  "crew.staleHours": { label: "Close tasks with no movement after", unit: "h", min: 12, max: 336, step: 12, def: env("CREW_STALE_HOURS", 72) },
  "crew.wakeGapMin": { label: "Desk-to-desk asks wake a desk at most every", unit: "min", min: 1, max: 240, step: 1, def: env("CREW_WAKE_GAP_MIN", 15) },
  "regent.dailyBrief": { label: "Regent posts one Daily Brief each evening: what shipped, what failed, what waits on you", type: "bool", def: true },
  "regent.briefTime": { label: "Daily Brief time, ET", type: "time", def: "20:00" },
  "coach.enabled": { label: "The Coach reviews every desk each morning and writes its notes for the day", type: "bool", def: true },
  "coach.time": { label: "Coach review time, ET", type: "time", def: "04:45" },
  "coach.post": { label: "Post the Coach's daily card in the boardroom", type: "bool", def: true },
  "brief.enabled": { label: "Pre-market Brief runs every market day", type: "bool", def: true },
  "brief.time": { label: "Brief start time, ET", type: "time", def: "05:30" },
  "brief.sound": { label: "Brief plays its music score (off renders silent)", type: "bool", def: true },
  "brief.musicLevel": { label: "Brief music volume", unit: "%", min: 0, max: 100, step: 1, def: 22 },
  "brief.tiktokDrop": { label: "Drop the video and caption in the TikTok channel", type: "bool", def: true },
  "brief.fileX": { label: "File an X post ask with the video", type: "bool", def: true },
  "brief.fileYouTube": { label: "File a YouTube Short ask with the video", type: "bool", def: true },
  "brief.communityPost": { label: "Post the brief text in Eclipse-X", type: "bool", def: false },
  "videos.tiktokDrop": { label: "Every finished video also lands in the TikTok channel", type: "bool", def: true },
};

let saved = load();
function load() {
  try {
    return JSON.parse(fs.readFileSync(TUNING_PATH, "utf8")) || {};
  } catch {
    return {};
  }
}
function persist() {
  try {
    fs.writeFileSync(TUNING_PATH, JSON.stringify(saved, null, 2));
  } catch {
    // the dials fall back to defaults; nothing breaks
  }
}

function clampValue(key, value) {
  const s = TUNING_SCHEMA[key];
  if (!s) return undefined;
  if (s.type === "bool") return Boolean(value);
  if (s.type === "model") return String(value || "").trim().replace(/[^a-z0-9.-]/gi, "").slice(0, 60);
  if (s.type === "time") {
    const m = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return s.def;
    const h = Math.min(8, Math.max(3, Number(m[1])));
    const mi = Math.min(59, Math.max(0, Number(m[2])));
    return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  }
  const n = Number(value);
  if (!Number.isFinite(n)) return s.def;
  return Math.min(s.max, Math.max(s.min, n));
}

// A flat view: every key with its live value and whether it is overridden.
export function tuningFlat() {
  const out = {};
  for (const [k, s] of Object.entries(TUNING_SCHEMA)) {
    const has = Object.prototype.hasOwnProperty.call(saved, k);
    out[k] = { value: has ? saved[k] : s.def, overridden: has, def: s.def };
  }
  return out;
}
// The live value of one dial.
export function tv(key) {
  const s = TUNING_SCHEMA[key];
  if (!s) return undefined;
  return Object.prototype.hasOwnProperty.call(saved, key) ? saved[key] : s.def;
}
// Save a patch of {key: value}; null or "default" puts a dial back on its .env default.
export function setTuning(patch) {
  const changed = [];
  for (const [k, v] of Object.entries(patch || {})) {
    if (!TUNING_SCHEMA[k]) continue;
    if (v === null || v === "default") {
      if (Object.prototype.hasOwnProperty.call(saved, k)) {
        delete saved[k];
        changed.push(k);
      }
      continue;
    }
    const c = clampValue(k, v);
    if (c === undefined) continue;
    if (saved[k] !== c) {
      saved[k] = c;
      changed.push(k);
    }
  }
  if (changed.length) persist();
  return changed;
}
// Convenience readers the desks call on every tick.
export const tune = {
  budgetUsd: () => Number(tv("budget.dailyUsd")),
  nightThrottle: () => tv("budget.nightThrottle") !== false,
  cacheKeeper: () => tv("budget.cacheKeeper") !== false,
  share: (who) => {
    const v = TUNING_SCHEMA[`shares.${who}`] ? Number(tv(`shares.${who}`)) / 100 : null;
    return v && v > 0 ? Math.min(1, v) : null;
  },
  corvidModel: () => String(tv("corvid.model") || ""),
  corvidWorkModel: () => String(tv("corvid.workModel") || ""),
  corvidCycleMs: () => Number(tv("corvid.cycleEveryMin")) * 60000,
  corvidWorkGapMin: () => Number(tv("corvid.workGapMin")),
  corvidDailySteps: () => Number(tv("corvid.dailySteps")),
  staffModel: () => String(tv("staff.model") || ""),
  staffCycleMs: () => Number(tv("staff.cycleEveryH")) * 3600000,
  staffWorkGapMin: () => Number(tv("staff.workGapMin")),
  staffDailySteps: () => Number(tv("staff.dailySteps")),
  queueCap: () => Number(tv("crew.queueCap")),
  staleHours: () => Number(tv("crew.staleHours")),
  wakeGapMin: () => Number(tv("crew.wakeGapMin")),
  regentBrief: () => ({ on: tv("regent.dailyBrief") !== false, time: String(tv("regent.briefTime") || "20:00") }),
  coach: () => ({ enabled: tv("coach.enabled") !== false, time: String(tv("coach.time") || "04:45"), post: tv("coach.post") !== false }),
  brief: () => ({
    enabled: tv("brief.enabled") !== false,
    time: tv("brief.time"),
    sound: tv("brief.sound") !== false,
    musicLevel: Number(tv("brief.musicLevel") ?? 22),
    tiktokDrop: tv("brief.tiktokDrop") !== false,
    fileX: tv("brief.fileX") !== false,
    fileYouTube: tv("brief.fileYouTube") !== false,
    communityPost: tv("brief.communityPost") === true,
  }),
  videoDrop: () => tv("videos.tiktokDrop") !== false,
};
