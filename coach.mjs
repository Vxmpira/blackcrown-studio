// coach.mjs: THE COACH. Once a day it reads what every desk actually did and
// what the numbers did in return, grades each desk on results (not on
// activity), and writes each one a short set of notes for the day: what to
// do, what to stop. Those notes ride at the top of every call the desks
// make, and the next morning the coach checks whether they were followed.
//
// One model call a day. It does not file asks, edit pages, or touch the
// desks' queues; it changes what they pay attention to.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MODELS, callJSON } from "./llm.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, "studio-coach.json");
export const COACHED = ["corvid", "herald", "steward", "bard", "regent"];

let state = load();
state.running = false;
function load() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { lastRunDay: "", running: false, today: null, history: [] };
  }
}
function save() {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } catch {}
}
const etDay = (ms = Date.now()) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "America/New_York" });

const one = (s, n = 220) => String(s || "").replace(/\s+/g, " ").replace(/—|–/g, ", ").trim().slice(0, n);
const list = (a, max, n = 200) => (Array.isArray(a) ? a : a ? [a] : []).map((x) => one(x, n)).filter((x) => x.length > 8).slice(0, max);

// The notes as the desks read them. Fresh for 40 hours, so a missed morning
// leaves yesterday's notes in force instead of none.
export function coachBlock() {
  const t = state.today;
  if (!t || Date.now() - (t.at || 0) > 40 * 3600000) return "";
  const lines = [
    `COACH'S NOTES for ${t.day}, written from yesterday's measured results. They outrank habit and the order of your queue. Find your own desk below, do what it says today, and expect tomorrow's notes to say whether you did:`,
    t.team ? `THE WHOLE TEAM: ${t.team}` : "",
    ...COACHED.map((k) => {
      const d = (t.desks || {})[k];
      if (!d) return "";
      return `${k.toUpperCase()}: ${d.do.length ? `DO: ${d.do.join(" | ")}` : ""}${d.stop.length ? ` STOP: ${d.stop.join(" | ")}` : ""}`.trim();
    }),
  ].filter(Boolean);
  return lines.join("\n").slice(0, 3600);
}

const SYSTEM = `You are the Coach of a five-desk AI company (BlackCrownVxJ LLC: Korvus, a market intelligence terminal for index futures traders, and Crown, a private AI workspace). The desks are Corvid (SEO and site), Herald (sales and offers), Steward (project manager and community), Bard (video) and Regent (the CEO desk that approves or vetoes every ask). The owner is one person with little time. The company's goal is its first paying customers.

Each morning you get every desk's scorecard, its own log of what it worked on, the ledger of what actually shipped, and the company's real numbers. You write today's coaching.

HOW YOU JUDGE:
- By RESULTS, never by activity. A shipped edit nobody saw, a post with no impressions, a video that never rendered and a report nobody needed are all zero. Say so plainly.
- Use only numbers that are in front of you. Never invent or round up a figure. If a number is missing, say it is missing.
- Find the real bottleneck for the whole company first. If almost nobody is visiting, then page polish and conversion tests cannot matter yet and the work has to move to getting real people in front of the product. If people visit and do not act, the work moves to the offer and the page.
- Money counts. Compare what a desk cost with what it shipped that a customer could see.
- Name waste concretely: the task that looped, the ask refiled three times, the work aimed at a tool that is down, the same post sent again and again to no audience.
- Check follow-through: you are shown the notes you gave yesterday. For each desk say whether it followed them (yes, partly, no) from the evidence, not from what it claims.

WHAT YOU WRITE:
- For each desk at most 3 DO lines and at most 2 STOP lines. Each is one plain sentence a desk can act on TODAY and that can be checked tomorrow. Prefer one strong note over three weak ones; an empty list is fine for a desk that is on course.
- Never ask a desk for something it cannot do: desks cannot post by hand, cannot buy ads, cannot fix AWS, cannot see private dashboards. Anything only the owner can do goes in "owner", at most 3 items, each a decision or an action with the reason in one clause.
- Do not ask for new scheduled reports, new status notes or new logs. The company has too many already.
- Regent's notes are about its approving: what it should have vetoed, what it should wave through faster.
- Plain words, no em dashes, no hype, no praise that the numbers do not earn.

Return ONLY valid JSON, no markdown fences:
{"bottleneck":"one sentence naming the single thing holding the company back right now, with the number that shows it","team":"one or two sentences every desk should carry today","desks":{"corvid":{"grade":"A|B|C|D|F","followed":"yes|partly|no|first day","worked":"one sentence, or none","wasted":"one sentence, or none","do":["..."],"stop":["..."]},"herald":{...},"steward":{...},"bard":{...},"regent":{...}},"owner":["..."]}`;

// inputs: { scorecards, logs, ledger, board } all plain text built by the server
export async function runCoach(inputs, { force = false } = {}) {
  const day = etDay();
  if (state.running) return { ok: false, msg: "the coach is already at work" };
  if (!force && state.lastRunDay === day) return { ok: false, msg: "the coach already ran today" };
  state.running = true;
  // one attempt a day, pass or fail: a review that errors must never be
  // retried on a loop at full price. "Run the review now" forces another.
  state.lastRunDay = day;
  state.lastError = "";
  save();
  try {
    const prev = state.today;
    const user = [
      `TODAY: ${day}`,
      prev
        ? `THE NOTES YOU GAVE ON ${prev.day}:\n${COACHED.map((k) => {
            const d = (prev.desks || {})[k];
            return d ? `${k}: DO ${d.do.join(" | ") || "nothing"}; STOP ${d.stop.join(" | ") || "nothing"}` : "";
          }).filter(Boolean).join("\n")}`
        : "THE NOTES YOU GAVE YESTERDAY: none, this is your first day.",
      `SCORECARDS (money, steps, asks):\n${inputs.scorecards}`,
      `WHAT SHIPPED, from the ledger of executed asks (the last 7 days, newest last):\n${inputs.ledger}`,
      `EACH DESK'S OWN LOG (what it says it worked on):\n${inputs.logs}`,
      `THE COMPANY'S REAL NUMBERS AND OPEN PROBLEMS (the Board):\n${inputs.board}`,
    ].join("\n\n");
    const parse = (raw) => {
      const a = raw.indexOf("{"), b = raw.lastIndexOf("}");
      if (a < 0 || b <= a) throw new Error("no JSON object in the reply");
      return JSON.parse(raw.slice(a, b + 1));
    };
    // bare: the coach gets the evidence above, not the desks' constitution
    // (and not its own notes read back to it)
    const out = await callJSON({ who: "coach", model: (process.env.COACH_MODEL || MODELS.hands).trim(), system: SYSTEM, user, maxTokens: 12000, priority: "owner", bare: true }, parse);
    const desks = {};
    for (const k of COACHED) {
      const d = (out.desks || {})[k] || {};
      desks[k] = {
        grade: /^[A-DF]$/.test(String(d.grade || "").trim().toUpperCase()) ? String(d.grade).trim().toUpperCase() : "",
        followed: one(d.followed, 12),
        worked: one(d.worked),
        wasted: one(d.wasted),
        do: list(d.do, 3),
        stop: list(d.stop, 2),
      };
    }
    const today = { day, at: Date.now(), bottleneck: one(out.bottleneck, 300), team: one(out.team, 360), desks, owner: list(out.owner, 3, 260) };
    state.history = [...(state.history || []), { day, bottleneck: today.bottleneck, grades: Object.fromEntries(COACHED.map((k) => [k, desks[k].grade])), followed: Object.fromEntries(COACHED.map((k) => [k, desks[k].followed])) }].slice(-60);
    state.today = today;
    state.lastRunDay = day;
    return { ok: true, today };
  } catch (e) {
    state.lastError = String(e?.message || e).slice(0, 300);
    return { ok: false, msg: state.lastError };
  } finally {
    state.running = false;
    save();
  }
}
export function coachState() {
  return { lastRunDay: state.lastRunDay, running: Boolean(state.running), lastError: state.lastError || "", today: state.today, history: (state.history || []).slice(-14) };
}
// the owner's card: short enough to read on a phone
export function coachCard(t) {
  if (!t) return "";
  const lines = [
    `**THE COACH** · ${t.day}`,
    t.bottleneck ? `**BOTTLENECK** ${t.bottleneck}` : "",
    ...COACHED.map((k) => {
      const d = t.desks[k];
      const bits = [d.wasted && !/^none\.?$/i.test(d.wasted) ? `Wasted: ${d.wasted.replace(/\.$/, "")}.` : "", d.do[0] ? `Today: ${d.do[0]}` : ""].filter(Boolean).join(" ");
      return `**${k.toUpperCase()}** ${d.grade || "?"}${d.followed && !/first/i.test(d.followed) ? `, followed yesterday's notes: ${d.followed}` : ""}. ${bits}`.slice(0, 420);
    }),
    t.owner.length ? `**ONLY YOU CAN** ${t.owner.map((x, i) => `${i + 1}) ${x}`).join(" ")}` : "",
  ].filter(Boolean);
  return lines.join("\n").slice(0, 3800);
}
