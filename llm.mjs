// llm.mjs: the one door every agent uses to reach the model. Corvid, Regent,
// Bard, Herald, Steward, their minions and the server's scheduled jobs all
// call through here, so caching, model choice, the spend meter and the daily
// budget live in one place instead of five copies of the same fetch.
//
// How a request is laid out, most stable first, because the cache matches on
// an exact prefix:
//   1. the company constitution (Institution.md). Byte for byte the same for
//      every agent, so agents on the same model share one cached copy. It is
//      cached for an hour and every read renews the hour, so it stays warm
//      around the clock.
//   2. the role prompt (who the agent is, its rules, the output shape). Cached
//      for an hour when the same prompt is in regular use; a prompt that only
//      runs now and then is sent plain, because a cache write nobody reads
//      costs more than not caching at all.
//   3. the live data and the task. Changes on every call, never cached.
//
// The default 5 minute cache was the old leak: the task engine waits at least
// 5 minutes between steps, so the cache had always just expired and every
// call paid the write premium without ever getting a read.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SPEND_PATH = path.join(__dirname, "studio-spend.json");

// Three tiers. HEAD thinks (strategy cycles, reviews, anything the owner
// reads). HANDS does (task steps, scheduled reports). MINION fetches and
// drafts. Each agent file can still override its own model from .env.
export const MODELS = {
  head: (process.env.MODEL_HEAD || "claude-fable-5-2").trim(),
  hands: (process.env.MODEL_HANDS || "claude-sonnet-5-5").trim(),
  minion: (process.env.MINION_MODEL || "claude-haiku-5-5").trim(),
};

// USD per million tokens: input, output, cache read, 5 minute write, 1 hour write.
// From platform.claude.com/docs/en/about-claude/pricing, checked 2026-11-11.
const PRICES = {
  "claude-fable-5-2": [8, 40, 0.2, 10, 16],
  "claude-mythos-5-2": [8, 40, 0.2, 10, 16],
  "claude-fable-5-1": [10, 50, 0.25, 12.5, 20],
  "claude-fable-5": [10, 50, 1, 12.5, 20],
  "claude-opus-5-5": [4, 20, 0.2, 5, 8],
  "claude-opus-5": [5, 25, 0.5, 6.25, 10],
  "claude-sonnet-5-5": [2, 10, 0.1, 2.5, 4],
  "claude-sonnet-5": [2, 10, 0.2, 2.5, 4],
  "claude-haiku-5-5": [0.1, 0.5, 0.01, 0.125, 0.2],
  "claude-haiku-4-5": [1, 5, 0.1, 1.25, 2],
};
function priceOf(model) {
  if (PRICES[model]) return PRICES[model];
  // dated ids such as claude-sonnet-5-5-20260801: longest known prefix wins
  const k = Object.keys(PRICES)
    .filter((p) => String(model).startsWith(p))
    .sort((a, b) => b.length - a.length)[0];
  // unknown model: assume the dearest so the budget errs on the safe side
  return PRICES[k] || PRICES["claude-fable-5"];
}
export function costOf(model, usage) {
  if (!usage) return 0;
  const [pin, pout, pread, pw5, pw1] = priceOf(model);
  const cc = usage.cache_creation || {};
  const w1 = cc.ephemeral_1h_input_tokens || 0;
  const w5 = cc.ephemeral_5m_input_tokens != null ? cc.ephemeral_5m_input_tokens : Math.max(0, (usage.cache_creation_input_tokens || 0) - w1);
  return (
    ((usage.input_tokens || 0) * pin +
      (usage.output_tokens || 0) * pout +
      (usage.cache_read_input_tokens || 0) * pread +
      w5 * pw5 +
      w1 * pw1) /
    1e6
  );
}

// ---------------------------------------------------------------------------
// spend meter: tokens and dollars per agent per day, kept for 14 days
// ---------------------------------------------------------------------------
function dayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
let spend = null;
function loadSpend() {
  if (spend) return spend;
  try {
    spend = JSON.parse(fs.readFileSync(SPEND_PATH, "utf8"));
  } catch {
    spend = {};
  }
  return spend;
}
export function recordSpend(who, model, usage) {
  try {
    if (!usage) return;
    const all = loadSpend();
    const d = dayKey();
    all[d] = all[d] || {};
    const e = (all[d][who] = all[d][who] || { calls: 0, in: 0, out: 0, cacheRead: 0, cacheWrite: 0, usd: 0 });
    e.calls += 1;
    e.in += usage.input_tokens || 0;
    e.out += usage.output_tokens || 0;
    e.cacheRead += usage.cache_read_input_tokens || 0;
    e.cacheWrite += usage.cache_creation_input_tokens || 0;
    e.usd = Math.round(((e.usd || 0) + costOf(model, usage)) * 1e5) / 1e5;
    e.model = model;
    for (const k of Object.keys(all).sort().slice(0, -14)) delete all[k];
    fs.writeFileSync(SPEND_PATH, JSON.stringify(all));
  } catch {
    // the meter never takes an agent down
  }
}
export function getSpend() {
  return loadSpend();
}
export function spentToday() {
  const d = loadSpend()[dayKey()] || {};
  return Object.values(d).reduce((a, e) => a + (e.usd || 0), 0);
}

// ---------------------------------------------------------------------------
// daily budget: the wallet's guard rail. Owner-facing calls (his messages,
// reviews of what reaches him, executing what he approved) always run.
// Background work slows at 70 percent of the day's budget and pauses at 100
// percent until midnight New York time. AGENT_DAILY_BUDGET_USD=0 turns it off.
// ---------------------------------------------------------------------------
const rawBudget = Number(process.env.AGENT_DAILY_BUDGET_USD);
export const DAILY_BUDGET = Number.isFinite(rawBudget) && rawBudget >= 0 ? rawBudget : 5;
export function budget() {
  const spent = spentToday();
  const cap = DAILY_BUDGET;
  const level = !cap ? "off" : spent >= cap ? "out" : spent >= cap * 0.7 ? "tight" : "ok";
  return { cap, spent: Math.round(spent * 100) / 100, left: cap ? Math.max(0, Math.round((cap - spent) * 100) / 100) : null, level };
}
export function canSpend() {
  return budget().level !== "out";
}
export function thrift() {
  return budget().level === "tight" ? 2 : 1;
}
export function spendSummary() {
  try {
    const d = loadSpend()[dayKey()] || {};
    const k = (n) => (n >= 1000 ? Math.round(n / 1000) + "k" : String(n));
    const parts = Object.entries(d).map(([w, e]) => {
      const total = e.in + e.cacheRead + e.cacheWrite;
      const hit = total ? Math.round((e.cacheRead / total) * 100) : 0;
      return `${w} $${(e.usd || 0).toFixed(2)} (${k(total)} in, ${hit}% from cache, ${k(e.out)} out, ${e.calls} calls)`;
    });
    const b = budget();
    const head = b.cap ? `TOKEN SPEND today: $${b.spent.toFixed(2)} of $${b.cap.toFixed(2)} budget` : `TOKEN SPEND today: $${b.spent.toFixed(2)}`;
    return parts.length ? `${head}. ${parts.join("; ")}` : `${head}, nothing yet`;
  } catch {
    return "TOKEN SPEND: unavailable";
  }
}
export function usageReport() {
  const all = loadSpend();
  const days = Object.keys(all).sort().slice(-14).map((day) => {
    const agents = Object.entries(all[day]).map(([who, e]) => {
      const total = e.in + e.cacheRead + e.cacheWrite;
      return { who, model: e.model || "", calls: e.calls, input: total, cached: e.cacheRead, written: e.cacheWrite, output: e.out, usd: Math.round((e.usd || 0) * 100) / 100, cacheHitPct: total ? Math.round((e.cacheRead / total) * 100) : 0 };
    });
    return { day, usd: Math.round(agents.reduce((a, x) => a + x.usd, 0) * 100) / 100, agents };
  });
  return { budget: budget(), models: MODELS, days };
}

// ---------------------------------------------------------------------------
// the call
// ---------------------------------------------------------------------------
const FALLBACK = { "claude-fable-5-2": "claude-fable-5", "claude-sonnet-5-5": "claude-sonnet-5" };
const swapped = new Map();
let institution = () => "";
export function setInstitution(fn) {
  institution = fn;
}
// A block must be about 512 tokens before the API will cache it. 2600
// characters clears that with room to spare for dense text.
const MIN_CACHE_CHARS = 2600;
let HOUR = { type: "ephemeral", ttl: "1h" };
const lastUse = new Map();
function inRegularUse(key) {
  const t = lastUse.get(key);
  lastUse.set(key, Date.now());
  return Boolean(t) && Date.now() - t < 55 * 60000;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// o: { who, model, system, user, maxTokens, hot, priority, bare }
//   hot       this prompt runs many times an hour, cache it from the first call
//   priority  "owner" for anything the owner is waiting on; skips the budget pause
//   bare      leave the constitution out (tiny utility calls)
export async function callLLM(o) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY missing in .env");
  if (o.priority !== "owner" && !canSpend()) {
    throw new Error("daily model budget reached, background work is paused until midnight ET");
  }
  let model = swapped.get(o.model || MODELS.head) || o.model || MODELS.head;
  const inst = o.bare ? "" : String(institution() || "").trim();
  let role = String(o.system || "");
  const system = [];
  if (inst.length >= MIN_CACHE_CHARS) system.push({ type: "text", text: inst, cache_control: HOUR });
  else if (inst) role = `${inst}\n\n${role}`;
  const useKey = crypto.createHash("sha1").update(`${model}\n${role}`).digest("hex");
  const regular = inRegularUse(useKey);
  if (role) {
    const cache = (o.hot || regular) && inst.length + role.length >= MIN_CACHE_CHARS;
    system.push(cache ? { type: "text", text: role, cache_control: HOUR } : { type: "text", text: role });
  }
  const build = () =>
    JSON.stringify({
      model,
      max_tokens: o.maxTokens || 1400,
      system: system.map((b) => (b.cache_control ? { ...b, cache_control: HOUR } : b)),
      messages: [{ role: "user", content: String(o.user || "") }],
    });
  let body = build();
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0 && lastErr && !/\(400\)/.test(lastErr.message)) await sleep(attempt === 1 ? 2500 : 8000);
    let r;
    try {
      r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body,
      });
    } catch (e) {
      lastErr = new Error(`Anthropic unreachable: ${e.message || e}`);
      continue;
    }
    if (r.ok) {
      const data = await r.json();
      recordSpend(o.who || "other", model, data.usage);
      const text = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      return { text, usage: data.usage || {}, stop: data.stop_reason || "", model };
    }
    const t = await r.text();
    lastErr = new Error(`Anthropic (${r.status}): ${t.slice(0, 180)}`);
    // a model this key cannot reach: step down to the one it replaced for the
    // rest of the run, so a wrong id never takes every desk offline
    if ([400, 403, 404].includes(r.status) && /model/i.test(t) && FALLBACK[model] && !/ttl|cache_control/i.test(t)) {
      console.error(`[llm] ${model} refused (${r.status}), using ${FALLBACK[model]} instead`);
      swapped.set(model, FALLBACK[model]);
      model = FALLBACK[model];
      body = build();
      attempt = Math.min(attempt, 1) - 1;
      continue;
    }
    // if this account or model ever refuses the 1 hour lifetime, drop to the
    // default one for the rest of the run instead of failing every call
    if (r.status === 400 && HOUR.ttl && /ttl|cache_control/i.test(t)) {
      HOUR = { type: "ephemeral" };
      body = build();
      attempt = Math.min(attempt, 1) - 1;
      continue;
    }
    // only overload and rate limits are worth a second try; a refused request is not billed
    if (![429, 500, 502, 503, 529].includes(r.status)) break;
  }
  throw lastErr;
}

export function tidy(text) {
  return String(text || "")
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/i, "")
    .trim()
    .replace(/\u2014|\u2013/g, ", ");
}

const REPAIR_SYSTEM =
  "You repair malformed JSON. The user message is one JSON object with syntax damage: stray prose around it, raw line breaks inside strings, unescaped quotes, a trailing comma, or a missing closing bracket. Return ONLY the corrected JSON object. Change nothing but the syntax: every key and every value stays word for word.";
const REMINDER =
  "\n\nREMINDER: your whole reply must be ONLY the JSON object, starting with { and ending with }. No prose, no code fences. Keep every string tight so the full object fits.";

// Ask for a JSON object. When the reply does not parse, the cheap fix comes
// first: the smallest model mends the syntax for a fraction of a cent. Only a
// reply that was cut off at the token limit, or that the mend could not save,
// is asked for again in full.
export async function callJSON(o, parse) {
  const first = await callLLM(o);
  const raw = tidy(first.text);
  try {
    return parse(raw);
  } catch (e) {
    if (raw && first.stop !== "max_tokens" && raw.length < 48000) {
      try {
        const fix = await callLLM({
          who: o.who,
          model: MODELS.minion,
          system: REPAIR_SYSTEM,
          user: raw,
          maxTokens: Math.min(16000, Math.ceil(raw.length / 2.4) + 500),
          priority: o.priority,
          bare: true,
        });
        return parse(tidy(fix.text));
      } catch {
        // fall through to the full second ask
      }
    }
    // an empty or cut-off reply usually means the token ceiling was too low
    // for this model; the second ask gets double the room
    const roomier = first.stop === "max_tokens" || !raw ? Math.min(16000, (o.maxTokens || 1400) * 2) : o.maxTokens;
    const second = await callLLM({ ...o, maxTokens: roomier, user: `${o.user}${REMINDER}` });
    try {
      return parse(tidy(second.text));
    } catch {
      const head = raw ? raw.slice(0, 140).replace(/\n/g, " ") : `(empty reply, stop reason ${first.stop || "unknown"}, ${first.usage.output_tokens || 0} output tokens, then ${second.stop || "unknown"})`;
      throw new Error(`${e.message}. Output head: ${head}`);
    }
  }
}
