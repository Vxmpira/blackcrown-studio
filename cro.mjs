// cro.mjs: THE CONVERSION DESK TOOL. Turns the counters the company already
// keeps (Korvus server counts per day, the brand site's page beacon) into
// what a conversion optimizer actually needs:
//   1. the funnel as rates, each with its honest margin of error,
//   2. the leaks: where the most people are lost, and the weakest step among
//      people who already showed intent,
//   3. a test book: a desk states a hypothesis and a metric, the server
//      measures before against after and calls it only when the numbers can
//      carry a verdict,
//   4. a sample-size answer, so nobody calls a winner off twelve visitors.
//
// These are before/after tests, not split tests: every visitor sees the same
// page, so a change in who is visiting can move a number as much as the edit
// did. Every verdict says so.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, "studio-cro.json");

let deps = { korvus: async () => null, brand: () => ({}), executed: () => [] };
export function wireCro(d) {
  deps = { ...deps, ...d };
}
let state = load();
function load() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { tests: [], seq: 0 };
  }
}
function save() {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } catch {}
}

// ---------------------------------------------------------------------------
// the data: one table of days, { "2026-11-20": { korvus:{...}, brand:{...} } }
// ---------------------------------------------------------------------------
let cache = { at: 0, days: {}, since: "", err: "" };
const etDay = (offset = 0) => new Date(Date.now() - offset * 86400000).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
export async function refresh(force = false) {
  if (!force && cache.at && Date.now() - cache.at < 10 * 60000) return cache;
  const days = {};
  let since = "", err = "";
  try {
    const j = await deps.korvus();
    if (j && j.series) {
      since = j.counting_since || "";
      for (const [d, v] of Object.entries(j.series)) (days[d] = days[d] || {}).korvus = v;
    } else err = "the Korvus feed did not answer";
  } catch (e) {
    err = `the Korvus feed did not answer (${String(e?.message || e).slice(0, 60)})`;
  }
  try {
    for (const [d, v] of Object.entries(deps.brand() || {})) if (/^\d{4}-\d\d-\d\d$/.test(d)) (days[d] = days[d] || {}).brand = v;
  } catch {}
  cache = { at: Date.now(), days, since, err };
  return cache;
}

const sum = (o) => Object.values(o || {}).reduce((a, b) => a + (Number(b) || 0), 0);
const pick = (o, keys) => keys.reduce((a, k) => a + (Number((o || {})[k]) || 0), 0);
const SIGNUP_CLICKS = ["hero_primary", "nav_signup", "pricing_observer", "pricing_operator"];
// what one day holds, as people counts (form-spam bots taken out)
function dayCounts(d) {
  const k = (d && d.korvus) || {}, b = (d && d.brand) || {};
  const st = k.step || {};
  const bots = Number(st.signup_honeypot) || 0;
  return {
    k_home: Number((k.view_h || {}).home) || 0,
    k_views: sum(k.view_h),
    k_cta: pick(k.click, SIGNUP_CLICKS),
    k_operator: Number((k.click || {}).pricing_operator) || 0,
    k_form: Math.max(0, (Number((k.view_h || {}).signup) || 0) - bots),
    k_submit: Math.max(0, (Number(st.signup_submit) || 0) - bots),
    k_account: Number(st.signup_created) || 0,
    k_verified: Number(st.email_verified) || 0,
    b_visit: sum(b.visit),
    b_click: sum(b.click),
    b_signup: sum(b.signup),
  };
}
// the metrics a test may be opened on: [numerator, denominator, plain name]
export const METRICS = {
  "korvus.home_to_signup_click": ["k_cta", "k_home", "Korvus home visitors who click a signup button"],
  "korvus.home_to_operator_click": ["k_operator", "k_home", "Korvus home visitors who click the Operator price"],
  "korvus.form_to_submit": ["k_submit", "k_form", "people who open the Korvus signup form and submit it"],
  "korvus.submit_to_account": ["k_account", "k_submit", "Korvus submits that become accounts"],
  "korvus.account_to_verified": ["k_verified", "k_account", "new Korvus accounts that verify their email"],
  "korvus.home_to_account": ["k_account", "k_home", "Korvus home visitors who end up with an account"],
  "brand.visit_to_product_click": ["b_click", "b_visit", "brand site visitors who click through to a product"],
  "brand.visit_to_signup": ["b_signup", "b_visit", "brand site visitors who become Korvus signups"],
};
function windowCounts(fromDay, toDay) {
  const out = {};
  let n = 0;
  for (const [d, v] of Object.entries(cache.days)) {
    if (d < fromDay || d > toDay) continue;
    n++;
    for (const [k, x] of Object.entries(dayCounts(v))) out[k] = (out[k] || 0) + x;
  }
  return { counts: out, days: n };
}

// ---------------------------------------------------------------------------
// the arithmetic
// ---------------------------------------------------------------------------
// Wilson interval: the honest range a rate could really be, at 95 percent
export function wilson(x, n) {
  if (!n) return [0, 0];
  const z = 1.96, p = Math.min(1, x / n);
  const den = 1 + (z * z) / n;
  const mid = (p + (z * z) / (2 * n)) / den;
  const half = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / den;
  return [Math.max(0, mid - half), Math.min(1, mid + half)];
}
function normCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
// two-proportion z test, two sided
export function pValue(x1, n1, x2, n2) {
  if (!n1 || !n2) return 1;
  const p = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1 / n1 + 1 / n2));
  if (!se) return 1;
  const z = (x2 / n2 - x1 / n1) / se;
  return 2 * (1 - normCdf(Math.abs(z)));
}
// visitors needed in EACH period to see a relative lift, 95 percent confidence, 80 percent power
export function sampleSize(baseRate, relLift) {
  const p1 = Math.min(0.99, Math.max(0.0005, Number(baseRate) || 0));
  const p2 = Math.min(0.995, p1 * (1 + Math.max(0.01, Number(relLift) || 0)));
  const n = (Math.pow(1.96 + 0.8416, 2) * (p1 * (1 - p1) + p2 * (1 - p2))) / Math.pow(p2 - p1, 2);
  return Math.ceil(n);
}
const pct = (x, n) => (n ? `${((100 * x) / n).toFixed(1)}%` : "no data");
const range = (x, n) => {
  if (!n) return "";
  const [a, b] = wilson(x, n);
  return ` (could really be ${(a * 100).toFixed(1)} to ${(b * 100).toFixed(1)}%)`;
};

// ---------------------------------------------------------------------------
// the funnel report
// ---------------------------------------------------------------------------
export function funnelText() {
  if (!Object.keys(cache.days).length) return `CRO: no day-by-day counts are loaded yet${cache.err ? ` (${cache.err})` : ""}.`;
  const now = windowCounts(etDay(6), etDay(0)).counts;
  const was = windowCounts(etDay(13), etDay(7)).counts;
  const g = (o, k) => o[k] || 0;
  const chain = [
    ["home visits", "k_home"],
    ["signup button clicks", "k_cta"],
    ["signup form opened", "k_form"],
    ["form submitted", "k_submit"],
    ["account created", "k_account"],
    ["email verified", "k_verified"],
  ];
  const steps = [];
  let worst = null, weak = null;
  for (let i = 1; i < chain.length; i++) {
    const from = g(now, chain[i - 1][1]), to = g(now, chain[i][1]);
    const lost = from - to;
    // more people at a later step than the one before means they arrived by a direct link; that is not a rate
    if (to > from) {
      steps.push(`${chain[i - 1][0]} ${from} > ${chain[i][0]} ${to}: more people reached this step than the one before (they came by a direct link), so no rate is shown`);
      continue;
    }
    const wf = g(was, chain[i - 1][1]), wt = g(was, chain[i][1]);
    steps.push(`${chain[i - 1][0]} ${from} > ${chain[i][0]} ${to}: ${pct(to, from)}${range(to, from)}, 7 days before ${wt > wf ? "not comparable" : pct(wt, wf)}`);
    if (from >= 10 && lost > 0 && (!worst || lost > worst.lost)) worst = { lost, from, to, a: chain[i - 1][0], b: chain[i][0] };
    // once someone has shown intent (opened the form), the weakest step is the lowest rate
    if (i >= 3 && from >= 10 && (!weak || to / from < weak.rate)) weak = { rate: to / from, from, to, a: chain[i - 1][0], b: chain[i][0] };
  }
  const small = g(now, "k_home") < 200;
  const lines = [
    `CRO FUNNEL, korvus.industries, people only (form-spam bots removed), last 7 days:`,
    ...steps.map((s) => `- ${s}`),
    worst ? `MOST PEOPLE LOST: ${worst.a} to ${worst.b} loses ${worst.lost} of ${worst.from}. The top of a funnel always loses the most, so this is where a bold change to the promise or the first screen pays most.` : "MOST PEOPLE LOST: no step has 10 people in it yet, so none can be named.",
    weak ? `WEAKEST STEP AFTER INTENT: ${weak.a} to ${weak.b}, ${weak.to} of ${weak.from} (${pct(weak.to, weak.from)}). These people already wanted in; losing them is the cheapest leak to fix.` : "",
    `Operator price clicks: ${g(now, "k_operator")} of ${g(now, "k_home")} home visits (${pct(g(now, "k_operator"), g(now, "k_home"))}).`,
    `BRAND SITE: ${g(now, "b_visit")} visits > ${g(now, "b_click")} product clicks (${pct(g(now, "b_click"), g(now, "b_visit"))}${range(g(now, "b_click"), g(now, "b_visit"))}) > ${g(now, "b_signup")} Korvus signups by first source.`,
    small ? `SMALL NUMBERS WARNING: at ${g(now, "k_home")} home visits a week, most rate changes are noise. Trust a step only when its range above is narrow, and prefer bold changes over small ones: only a big lift can be seen at this traffic.` : "",
    cache.since ? `Korvus counts start ${cache.since}.` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

// ---------------------------------------------------------------------------
// the test book
// ---------------------------------------------------------------------------
const open = () => (state.tests || []).filter((t) => t.status === "waiting" || t.status === "running");
function shipDay(t) {
  if (!t.proposal) return null;
  try {
    const e = (deps.executed() || []).find((x) => Number(x.number) === Number(t.proposal) && x.ok !== false);
    return e && e.at ? new Date(e.at).toLocaleDateString("en-CA", { timeZone: "America/New_York" }) : null;
  } catch {
    return null;
  }
}
// move each open test along; returns nothing, writes the verdicts into state
export function judge() {
  let changed = false;
  for (const t of open()) {
    if (t.status === "waiting") {
      const d = shipDay(t);
      if (d) {
        t.status = "running";
        t.start = d;
        changed = true;
      } else {
        if (Date.now() - t.openedAt > 10 * 86400000) {
          t.status = "dropped";
          t.verdict = `Dropped: ask #${t.proposal} never shipped within 10 days.`;
          changed = true;
        }
        continue;
      }
    }
    const [num, den, name] = METRICS[t.metric];
    const dayMs = 86400000;
    const startMs = Date.parse(`${t.start}T12:00:00Z`);
    const ran = Math.floor((Date.now() - startMs) / dayMs);
    // the ship day itself is left out of both sides: it is half old page, half new
    const before = windowCounts(new Date(startMs - 14 * dayMs).toISOString().slice(0, 10), new Date(startMs - dayMs).toISOString().slice(0, 10)).counts;
    const after = windowCounts(new Date(startMs + dayMs).toISOString().slice(0, 10), etDay(0)).counts;
    const x1 = Math.min(before[num] || 0, before[den] || 0), n1 = before[den] || 0;
    const x2 = Math.min(after[num] || 0, after[den] || 0), n2 = after[den] || 0;
    const p = pValue(x1, n1, x2, n2);
    const need = sampleSize(n1 ? Math.max(x1, 1) / n1 : 0.05, 0.5);
    t.read = `${name}: before ${x1}/${n1} (${pct(x1, n1)}), after ${x2}/${n2} (${pct(x2, n2)}), day ${Math.max(0, ran)} of the test`;
    const enough = n1 >= 30 && n2 >= 30 && x1 + x2 >= 10 && ran >= 7;
    let verdict = "";
    if (enough && p < 0.05) verdict = `${x2 / n2 > x1 / n1 ? "WIN" : "LOSS"}: ${pct(x1, n1)} to ${pct(x2, n2)}, and a gap this size would show up by chance ${p < 0.01 ? "less than 1 time" : `about ${Math.round(p * 100)} times`} in 100. ${x2 / n2 > x1 / n1 ? "Keep the change and write the rule into the Playbook." : "File the ask that puts the old version back."}`;
    else if (ran >= 28) verdict = `NO CLEAR RESULT after 28 days: ${pct(x1, n1)} to ${pct(x2, n2)} on ${n2} visitors. At this traffic the change is too small to see; it would take about ${need} visitors per side to see even a 50 percent lift. Keep whichever version reads better and test something bolder.`;
    if (verdict) {
      t.status = "called";
      t.calledAt = Date.now();
      t.verdict = `${verdict} Before and after, not a split test: a shift in who visited can move this number too.`;
      changed = true;
    } else t.wait = n2 < 30 ? `too early: ${n2} of at least 30 visitors seen since it shipped` : ran < 7 ? `too early: day ${Math.max(0, ran)} of at least 7` : `no verdict yet (the gap could still be chance); runs to day 28 at most`;
  }
  if (changed) save();
}
export function openTest(desk, a) {
  const metric = String(a.metric || "").trim();
  if (!METRICS[metric]) return { err: `metric must be one of: ${Object.keys(METRICS).join(", ")}` };
  const hypothesis = String(a.hypothesis || "").replace(/\s+/g, " ").trim().slice(0, 240);
  if (hypothesis.length < 20) return { err: "a test needs a hypothesis: who the visitor is, what stops them, and what change should move the metric" };
  const proposal = Number(a.proposal) || 0;
  const start = /^\d{4}-\d\d-\d\d$/.test(String(a.start || "")) ? String(a.start) : "";
  if (!proposal && !start) return { err: "name the ask that carries the change (proposal: its number) or, for a change already live, the day it shipped (start: YYYY-MM-DD)" };
  if (start && (start > etDay(0) || start < etDay(21))) return { err: "start must be a day in the last 3 weeks" };
  const clash = open().find((t) => t.metric === metric);
  if (clash) return { err: `test ${clash.id} is already running on ${metric}; two changes on one metric cannot be told apart. Wait for its verdict or pick another step of the funnel` };
  if (open().length >= 4) return { err: "4 tests are open, the most this traffic can carry; wait for a verdict" };
  state.seq = (state.seq || 0) + 1;
  const t = { id: `T${state.seq}`, desk, metric, hypothesis, page: String(a.page || "").slice(0, 80), proposal, status: start ? "running" : "waiting", start, openedAt: Date.now() };
  state.tests = [...(state.tests || []), t].slice(-60);
  save();
  return { note: `test ${t.id} opened`, text: `${t.id} on ${METRICS[metric][2]}. ${start ? `Counting from ${start}.` : `It starts the day ask #${proposal} ships.`} The server compares the 14 days before against the days after and calls it when at least 7 days and 30 visitors are in, or at day 28. Do not change anything else that moves this metric until it is called.` };
}
export function testsText(all = false) {
  judge();
  const rows = (state.tests || []).filter((t) => all || t.status === "waiting" || t.status === "running" || (t.status === "called" && Date.now() - (t.calledAt || 0) < 14 * 86400000));
  if (!rows.length) return "CRO TESTS: none open. The desk that changes a conversion page opens one, so the change gets a verdict.";
  return `CRO TESTS (before and after, called by the server):\n${rows
    .slice(-10)
    .map((t) => `- ${t.id} ${t.desk}, ${t.metric}${t.proposal ? `, ask #${t.proposal}` : ""}: "${t.hypothesis.slice(0, 110)}". ${t.status === "waiting" ? "Waiting for the ask to ship." : t.status === "running" ? `${t.read || "running"}; ${t.wait || ""}` : t.verdict}`)
    .join("\n")}`;
}
function sizeText(a) {
  const metric = String(a.metric || "").trim();
  let base = Number(a.rate) > 1 ? Number(a.rate) / 100 : Number(a.rate) || 0;
  const now = windowCounts(etDay(13), etDay(0));
  let perDay = 0;
  if (METRICS[metric]) {
    const [num, den] = METRICS[metric];
    const n = now.counts[den] || 0;
    if (!base && n) base = Math.max(now.counts[num] || 0, 1) / n;
    perDay = n / Math.max(1, now.days);
  }
  if (!base) return { err: "give a metric from the CRO list, or rate: the current rate as a percent" };
  const lifts = [0.2, 0.5, 1];
  return {
    note: "how many visitors a test needs",
    text: lifts.map((l) => {
      const n = sampleSize(base, l);
      return `To see a ${Math.round(l * 100)}% relative lift from ${(base * 100).toFixed(1)}%: about ${n} visitors after the change${perDay ? `, roughly ${Math.ceil(n / Math.max(perDay, 0.1))} days at the current ${perDay.toFixed(0)} a day` : ""}.`;
    }).join("\n") + "\nIf the days run past 28, the change is too small for this traffic: test a bolder one, or work on the step with more people in it.",
  };
}
// the workbench tools
export const croTools = {
  "cro.funnel": async () => {
    await refresh();
    return { note: "the conversion funnel, measured", text: `${funnelText()}\n\n${testsText()}` };
  },
  "cro.size": async (_d, a) => {
    await refresh();
    return sizeText(a || {});
  },
  "cro.test": async (d, a) => {
    await refresh();
    return openTest(d, a || {});
  },
  "cro.tests": async () => {
    await refresh();
    return { note: "the test book", text: testsText(true) };
  },
};
// one block for the Board and for Regent's review
export function croBoard() {
  try {
    return `${funnelText()}\n${testsText()}`;
  } catch {
    return "";
  }
}
export function croState() {
  judge();
  return { tests: state.tests || [], funnel: funnelText(), metrics: Object.fromEntries(Object.entries(METRICS).map(([k, v]) => [k, v[2]])), dataDays: Object.keys(cache.days).length, err: cache.err };
}
