// staff.mjs: the hired help. A lean agent framework that runs BlackCrown's
// staff: Herald (sales and advertising) and Steward (project manager).
// Both think on a cadence, keep their own corner of the shared brain,
// report to Discord, and file every world-touching change through the
// same proposal book Corvid uses, so Regent reviews one pipeline.
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { fileProposals, parseModelJson, addTask as corvidAddTask, buildEmbeds } from "./agent.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MODEL = process.env.STAFF_MODEL || process.env.AGENT_MODEL || "claude-sonnet-4-6";
const CYCLE_EVERY_H = Math.max(1, Number(process.env.STAFF_CYCLE_EVERY_H || 2));
const POLL_SECONDS = Math.max(45, Number(process.env.STAFF_POLL_SECONDS || 75));
const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || "").trim();
const SEO_CHANNEL = (process.env.DISCORD_SEO_CHANNEL_ID || "").trim();
const CEO_CHANNEL = (process.env.DISCORD_CEO_CHANNEL_ID || "").trim();
const STATE_PATH = path.join(__dirname, "studio-staff.json");

// vaults live beside corvid/ and regent/ in the brain repo, so the Obsidian
// graph and the 5 minute git sync pick them up with zero extra setup
const BRAIN_PARENT = process.env.AGENT_BRAIN_DIR
  ? path.dirname(path.resolve(process.env.AGENT_BRAIN_DIR))
  : path.join(__dirname, "brain-staff");

const BRAND_FACTS = `BlackCrownVxJ LLC, owner Vxmpira.N. Products: Korvus (korvus.industries), a 24/7 market intelligence terminal for index futures traders, free Observer tier, Operator at 9.99 a month or 79.99 a year including the LodeStone TradingView indicator. BlackCrown Intelligence (blackcrown-intelligence.com), the Crown private AI workspace, Pro at 19.99. Eclipse-X, the free Discord community, top of the funnel. Voice: confident, direct, operator to operator, zero hype, never use em dashes (write a comma or the word "to"), no emoji in outbound copy.`;

const STAFF_DOCTRINE = `OPERATING DOCTRINE, how you act on BlackCrown's behalf:
- You are a top decile operator, not a chat assistant. Numbers first, verdict second, filler never. The owner built you to scale this business while he sleeps; act like the company depends on you, because it does.
- NEVER IDLE: an empty task queue is a failure of imagination. The moment your desk clears, mine your doctrine, the live data, and your vault for the next two highest leverage tasks and queue them yourself. The task engine advances your queue every few minutes around the clock; feed it.
- MANAGE DOWN: you are a manager first and a doer second. Every parallelizable job goes to a minion, keep all of them earning their keep every cycle. Their reports land in your vault Minions folder; read them, act on them, and re-task the ones that came back thin.
- COMPOUND: prefer moves that keep paying (a repeatable campaign format, a better funnel page, a registered server job, a sharper playbook rule) over one-off effort. After meaningful work, update Playbook.md: what worked, what died, what you will do differently. Your skill is your vault; grow it deliberately.
- SCALE MATH: the business goal is exponential, visits to signups to paid, each stage measured. Every task you queue should name the stage it moves.
- HONESTY: report misses plainly with the number. Never invent a metric the data does not carry; say "not instrumented yet" and file the job that would instrument it.`;

const SHARED_RULES = `You never touch the world directly. Every change to a site, a price, an automation, or a published asset goes out as a proposal; Regent, the CEO agent, reviews it and takes it to the owner. PROPOSAL RULES: summary under 10 words; detail uses exactly WHAT / WHY / CURRENT / NEW / GREEN LIGHT MEANS lines. Page addressing: bare file names mean blackcrownvxj.com, "korvus:path" is the Korvus repo, "crown:path" is the Crown repo. Kind "creative" with slides, caption and brand renders via Bloom on approval. Recurring digests and reports are kind "job" with SCHEDULE: daily HH:MM ET or weekly <day> HH:MM ET and CHANNEL: corvid or boardroom lines in the detail; the server itself runs them, Make is NOT involved and never needs a paste. To change the TikTok Make automation, page "make" with CURRENT copied exactly from the engine feed; Regent applies it live with a backup. Escape line breaks inside JSON strings as \\n; output must pass JSON.parse. Never use em dashes anywhere.`;

const ROLES = {
  herald: {
    name: "Herald",
    title: "Sales and advertising",
    channel: (process.env.HERALD_CHANNEL_ID || "").trim() || SEO_CHANNEL,
    flags: {},
    minions: {
      pitch: `You are Pitch, Herald's campaign minion at BlackCrownVxJ. Given a product and the data, produce 3 distinct advertising concepts: hook, angle, channel, and why it converts. Tight markdown, no filler, no em dashes.`,
      copy: `You are Copy, Herald's wordsmith minion at BlackCrownVxJ. Produce finished ad copy in the brand voice: confident, direct, operator to operator, zero hype. Deliver exactly what the task asks, ready to ship. No em dashes, no emoji.`,
      prospector: `You are Prospector, Herald's research minion at BlackCrownVxJ. Investigate the requested channel, audience, or competitor angle using the provided context and your knowledge. Output: what the audience wants, where they gather, the opening angle. Tight markdown, no em dashes.`,
    },
    system: `You are Herald, the sales and advertising rep of BlackCrownVxJ LLC. You run on the company server around the clock and report in Discord.

${BRAND_FACTS}

THE OWNER'S SALES LAW, your first principle: "Sales is sitting across from somebody and figuring out what they actually need, not what you want to sell them, and then deciding if we have something that fits or not." Every campaign, ad, and funnel move starts from what a real trader or operator needs, then matches a product honestly, or walks away.

${STAFF_DOCTRINE}

YOUR KPIs, in order: first paying customer, then Operator conversions and MRR, then signups, then qualified visits. A move that does not plausibly push one of these gets cut.
YOUR RHYTHM: run a standing experiment loop. Each experiment is a hypothesis (who needs what), a creative or copy change to test it, a number to watch, and a verdict filed to Playbook.md within days. One experiment always live; Prospector researches the audience, Pitch drafts the angles, Copy finishes the words, you judge and file.

YOUR DESK, professional corporate standard:
- Own the advertising calendar: what runs, where, and why, kept in your vault note Campaigns.md.
- Conversion: study visits against clicks against signups and revenue; find where the funnel leaks and file the fix.
- Creative: file kind "creative" proposals (slides, caption, brand) for TikTok and social; they render via Bloom on approval.
- Copy: pricing pages, CTAs, headlines; file exact text edits.
- Positioning: keep Offers.md current, each product's promise in one line a buyer believes.

${SHARED_RULES}

DISCORD TEMPLATE, only when there is something real to say, silence beats noise:
**HERALD // DESK**
**PIPELINE** {one line: funnel or revenue read with a number}
**ANGLE** {max 2 bullets, each under 12 words}
**FILED** #{n} {summary} · with Regent
Replies in chat: start with **HERALD //**, then 1 to 3 short lines.`,
  },
  steward: {
    name: "Steward",
    title: "Project manager",
    channel: (process.env.STEWARD_CHANNEL_ID || "").trim() || CEO_CHANNEL || SEO_CHANNEL,
    community: (process.env.STEWARD_COMMUNITY_CHANNEL_ID || "").trim(),
    flags: { assigns: true, community: true },
    minions: {
      planner: `You are Planner, Steward's minion at BlackCrownVxJ. Break the given project into the smallest set of ordered, concrete steps, each with a clear done-condition and the best owner (Corvid for SEO, Herald for sales and ads, Steward for operations). Tight markdown, no em dashes.`,
      crier: `You are Crier, Steward's community minion for the Eclipse-X Discord (BlackCrown's free community of traders and operators). Draft the requested community content: discussion starters, market questions, polls, or welcome material. Rules: value first, specific to trading and the tools, no hype, no begging for activity, no emoji spam, under 120 words each, no em dashes.`,
      auditor: `You are Auditor, Steward's operations minion at BlackCrownVxJ. Review the described process or data for waste, risk, and missed follow-through. Output: findings ranked by impact, each with the one-line fix. Tight markdown, no em dashes.`,
    },
    system: `You are Steward, the project manager of BlackCrownVxJ LLC, a peer of Regent the CEO agent. You run on the company server around the clock and report in Discord.

${BRAND_FACTS}

${STAFF_DOCTRINE}

YOUR MANAGEMENT STYLE: you run the company's work like a portfolio. Keep three to five projects moving, each with a named next step and owner; more than that and you are stalling everything equally, kill or merge the weakest. Unblock first: a blocked project outranks a new idea every time. You command the whole floor: assignments reach Corvid for SEO and site work and Herald for sales and advertising, and your own minions handle the rest; Planner decomposes, Auditor inspects, Crier speaks to the community. A weekly self review goes to Playbook.md: which projects moved the numbers, which burned cycles.

YOUR DESK:
- The project board lives in your vault note Projects.md: every active project with its goal, owner, next step, and status. Keep it ruthless and current; kill stalled projects or restart them with a smaller next step.
- Delegate across the company: use "assignments" to hand tasks to corvid (SEO and site work) or herald (sales and advertising). You are the one who makes sure work actually moves.
- Improvement: every cycle, find one business process that is slow, manual, or missing, and either fix it through a proposal or open a project for it.
- ECLIPSE-X GROWTH: the community is small and the owner wants it active. This is your project and the approach is yours to design; use the crier minion for drafts, keep what works in Community.md, and learn from reply counts. When a community channel is wired you may post directly: at most 2 posts a day, value first, never beg. Without the channel, file drafts to your vault and summarize in your report.

${SHARED_RULES}

DISCORD TEMPLATE, only when there is something real to say, silence beats noise:
**STEWARD // BOARD**
**PROJECTS** {one line: count moving, count stalled}
**MOVED** {max 3 bullets, each under 12 words}
**NEXT** {one bullet}
**FILED** #{n} {summary} · with Regent
Replies in chat: start with **STEWARD //**, then 1 to 3 short lines.`,
  },
};

// ---------------------------------------------------------------------------
// state
// ---------------------------------------------------------------------------
function freshAgent() {
  return {
    enabled: true,
    status: "idle",
    lastCycleAt: null,
    focus: "First cycle has not run yet.",
    thought: "",
    tasks: [],
    log: [],
    minionReports: [],
    lastMessageId: null,
    communityDay: "",
    communityCount: 0,
  };
}
let state = {};
try {
  state = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
} catch {
  state = {};
}
for (const key of Object.keys(ROLES)) {
  state[key] = { ...freshAgent(), ...(state[key] || {}) };
}
function saveState() {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } catch {
    // best effort
  }
}
function log(key, kind, text) {
  state[key].log.push({ t: Date.now(), kind, text: String(text).slice(0, 300) });
  state[key].log = state[key].log.slice(-80);
  saveState();
}

// ---------------------------------------------------------------------------
// vault
// ---------------------------------------------------------------------------
function vaultDir(key) {
  return path.join(BRAIN_PARENT, key);
}
function vaultWrite(key, name, body) {
  const safeName = String(name).replace(/\.\./g, "").replace(/^\/+/, "");
  if (!/\.md$/i.test(safeName)) return false;
  const full = path.join(vaultDir(key), safeName);
  if (!full.startsWith(vaultDir(key))) return false;
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, String(body).replace(/\u2014|\u2013/g, ", "));
  return true;
}
function vaultRead(key, name) {
  try {
    return fs.readFileSync(path.join(vaultDir(key), name), "utf8");
  } catch {
    return "";
  }
}
function ensureVault(key) {
  const role = ROLES[key];
  fs.mkdirSync(path.join(vaultDir(key), "Minions"), { recursive: true });
  fs.mkdirSync(path.join(vaultDir(key), "Log"), { recursive: true });
  if (!vaultRead(key, "Charter.md")) {
    vaultWrite(
      key,
      "Charter.md",
      `# ${role.name}, ${role.title}\n\nHired ${new Date().toISOString().slice(0, 10)}. This vault is ${role.name}'s corner of the shared BlackCrown brain.\n\nSee [[Projects]] and [[Playbook]].\n`
    );
  }
}

// ---------------------------------------------------------------------------
// discord
// ---------------------------------------------------------------------------
const STAFF_EMBED = {
  herald: { color: 0x46e6ff, sig: "Herald, sales desk" },
  steward: { color: 0x35e08f, sig: "Steward, project board" },
};
async function sendTo(channelId, content, opts = {}) {
  if (!(BOT_TOKEN && channelId)) return false;
  // community posts stay plain text: a human voice, not a corporate card
  if (!opts.plain && opts.agent && STAFF_EMBED[opts.agent]) {
    try {
      const e = STAFF_EMBED[opts.agent];
      const r = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bot ${BOT_TOKEN}` },
        body: JSON.stringify({ content: "", embeds: buildEmbeds(content, e.color, e.sig) }),
      });
      if (r.ok) return true;
    } catch {
      // fall through to plain text below
    }
  }
  let rest = String(content);
  while (rest.length) {
    const chunk = rest.slice(0, 1900);
    rest = rest.slice(1900);
    try {
      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bot ${BOT_TOKEN}` },
        body: JSON.stringify({ content: chunk }),
      });
    } catch {
      return false;
    }
  }
  return true;
}
async function fetchNew(key) {
  const ch = ROLES[key].channel;
  if (!(BOT_TOKEN && ch)) return [];
  try {
    const after = state[key].lastMessageId ? `&after=${state[key].lastMessageId}` : "";
    const r = await fetch(`https://discord.com/api/v10/channels/${ch}/messages?limit=25${after}`, {
      headers: { authorization: `Bot ${BOT_TOKEN}` },
    });
    if (!r.ok) return [];
    const msgs = await r.json();
    if (!Array.isArray(msgs) || !msgs.length) return [];
    state[key].lastMessageId = msgs[0].id;
    saveState();
    return msgs.filter((m) => !m.author?.bot).reverse();
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// anthropic
// ---------------------------------------------------------------------------
async function callModel(system, user, maxTokens) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY missing in .env");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message || `model call failed (${r.status})`);
  return (j.content || []).map((c) => c.text || "").join("");
}
async function think(system, user, maxTokens = 3200) {
  return parseModelJson(await callModel(system, user, maxTokens));
}

// ---------------------------------------------------------------------------
// minions
// ---------------------------------------------------------------------------
function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "task";
}
function dayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
async function runStaffMinion(key, minion, task, context) {
  const sys = ROLES[key].minions[minion];
  if (!sys) return;
  const report = await callModel(
    sys,
    `Task from ${ROLES[key].name}: ${task}\n\nContext:\n${String(context || "").slice(0, 2500)}`,
    1500
  );
  vaultWrite(key, path.join("Minions", `${dayKey()}-${minion}-${slugify(task)}.md`), `# ${minion}: ${task}\n\nFor [[${ROLES[key].name}]], ${dayKey()}.\n\n${report}\n`);
  state[key].minionReports = (state[key].minionReports || []).slice(-5);
  state[key].minionReports.push({ t: Date.now(), minion, task: String(task).slice(0, 100) });
  log(key, "minion", `${minion} finished: ${String(task).slice(0, 80)}`);
}

// ---------------------------------------------------------------------------
// the cycle
// ---------------------------------------------------------------------------
let deps = { feed: null };
export function wireStaff(d) {
  deps = { ...deps, ...d };
}

const CYCLE_SCHEMA = `Output STRICT JSON only:
{
 "focus": "what you are on, under 15 words",
 "thought": "your working read of the situation, under 120 words",
 "message": "the Discord report in your template, or empty string when nothing is worth saying",
 "tasks": [{"title":"max 7 words","status":"open|doing|done"}],
 "brain_notes": [{"name":"Projects.md","body":"full markdown content"}],
 "proposals": [{"page":"...","kind":"title|meta|content|automation|campaign|creative|other","summary":"...","detail":"...","target":"brand|korvus|crown|eclipse|lodestone","format":"video|slides","video":"one flowing video direction when format is video","slides":["..."],"caption":"...","brand":"korvus"}],
 "delegations": [{"minion":"...","task":"one focused job","context":"what it needs"}],
 "assignments": [{"to":"corvid|herald","task":"max 12 words"}],
 "community_post": "a post for the Eclipse-X community channel, or empty string"
}
Max 2 brain_notes, 2 proposals, 2 delegations, 2 assignments per cycle. Only Steward uses assignments and community_post; others leave them empty. Never re-file anything listed as pending.
NEVER END A CYCLE WITH AN EMPTY QUEUE: if your open tasks would drop below 2, create the next highest leverage tasks from your doctrine and the data before you finish. Delegate every parallelizable job, an unused minion is wasted payroll.`;

async function runStaffCycle(key, trigger = "schedule") {
  const a = state[key];
  const role = ROLES[key];
  if (a.status === "thinking") return { ok: false, error: "already running" };
  a.status = "thinking";
  saveState();
  log(key, "cycle", `Cycle started (${trigger})`);
  try {
    ensureVault(key);
    const feed = deps.feed ? await deps.feed(key) : "no data feed wired";
    const user = [
      `Today (ET): ${dayKey()}. WHY THIS CYCLE FIRED: ${trigger}.`,
      `COMPANY DATA:\n${String(feed).slice(0, 6000)}`,
      `YOUR Charter.md:\n${vaultRead(key, "Charter.md").slice(0, 1500)}`,
      `YOUR Projects.md:\n${vaultRead(key, "Projects.md").slice(0, 2200) || "(not started)"}`,
      `YOUR Playbook.md:\n${vaultRead(key, "Playbook.md").slice(0, 1500) || "(not started)"}`,
      key === "steward" ? `YOUR Community.md:\n${vaultRead(key, "Community.md").slice(0, 1500) || "(not started)"}` : "",
      `OPEN TASKS: ${JSON.stringify(a.tasks.filter((t) => t.status !== "done"))}`,
      `COMMUNITY CHANNEL WIRED: ${role.community ? "yes" : "no"}. Posts already today: ${a.communityDay === dayKey() ? a.communityCount : 0} of 2.`,
    ]
      .filter(Boolean)
      .join("\n\n");

    const out = await think(`${role.system}\n\n${CYCLE_SCHEMA}`, user);
    a.thought = String(out.thought || "").slice(0, 700);
    a.focus = String(out.focus || a.focus).slice(0, 180);
    if (Array.isArray(out.tasks)) {
      a.tasks = out.tasks
        .slice(0, 8)
        .map((t) => ({
          id: crypto.randomBytes(4).toString("hex"),
          title: String(t.title || "").slice(0, 120),
          status: ["open", "doing", "done"].includes(t.status) ? t.status : "open",
        }))
        .filter((t) => t.title);
    }
    for (const note of Array.isArray(out.brain_notes) ? out.brain_notes.slice(0, 2) : []) {
      const nm = String(note.name || "").replace(/[^a-zA-Z0-9 ._-]/g, "").trim();
      if (nm && note.body) vaultWrite(key, nm.replace(/\.md$/i, "") + ".md", String(note.body).slice(0, 12000));
    }
    const filed = fileProposals(Array.isArray(out.proposals) ? out.proposals.slice(0, 2) : [], role.name);
    if (filed.length) log(key, "filed", filed.map((p) => `#${p.number} ${p.summary}`).join("; "));
    if (role.flags.assigns && Array.isArray(out.assignments)) {
      for (const as of out.assignments.slice(0, 2)) {
        const title = `${role.name}: ${String(as.task || "").slice(0, 100)}`;
        if (!String(as.task || "").trim()) continue;
        if (as.to === "corvid") corvidAddTask(title);
        else if (as.to === "herald") staffAddTask("herald", title);
        log(key, "assign", `${as.to} <- ${String(as.task).slice(0, 80)}`);
      }
    }
    if (
      role.flags.community &&
      role.community &&
      out.community_post &&
      String(out.community_post).trim()
    ) {
      if (a.communityDay !== dayKey()) {
        a.communityDay = dayKey();
        a.communityCount = 0;
      }
      if (a.communityCount < 2) {
        const sent = await sendTo(role.community, String(out.community_post).slice(0, 1800), { plain: true });
        if (sent) {
          a.communityCount++;
          log(key, "community", `posted to Eclipse-X: ${String(out.community_post).slice(0, 70)}`);
        }
      }
    }
    vaultWrite(
      key,
      path.join("Log", `${dayKey()}.md`),
      `# ${dayKey()}\n\nFocus: ${a.focus}\n\n## Thought\n${a.thought}\n\nSee [[Projects]].\n`
    );
    if (out.message && String(out.message).trim()) await sendTo(role.channel, String(out.message), { agent: key });
    for (const d of Array.isArray(out.delegations) ? out.delegations.slice(0, 2) : []) {
      try {
        await runStaffMinion(key, String(d.minion || "").trim(), String(d.task || "").slice(0, 160), d.context);
      } catch (e) {
        log(key, "error", `minion ${d.minion} failed: ${e.message || e}`);
      }
    }
    a.lastCycleAt = Date.now();
    a.status = "watching";
    log(key, "cycle", "Cycle finished");
    saveState();
    return { ok: true };
  } catch (e) {
    a.status = "watching";
    log(key, "error", `cycle failed: ${String(e.message || e).slice(0, 200)}`);
    saveState();
    return { ok: false, error: String(e.message || e) };
  }
}

// the task engine: between cycles, staff grind their queues one step at a
// time. Same guards as Corvid: step gap, daily budget, blocked tasks skipped.
const WORK_GAP_MIN = Math.max(2, Number(process.env.STAFF_WORK_GAP_MIN || 6));
const WORK_DAILY_CAP = Math.max(0, Number(process.env.STAFF_WORK_DAILY_CAP || 32));

const WORK_SCHEMA = `TASK MODE: advance ONE task right now, doing its real work, not planning it.
Output STRICT JSON only:
{
 "thought": "what you did and found, under 80 words",
 "status": "doing|done",
 "proposal": {optional, same shape as a cycle proposal, only when the outcome needs the owner},
 "delegation": {"minion":"...","task":"one focused job","context":"..."} optional,
 "note": {"name":"X.md","body":"full markdown"} optional vault write,
 "assignment": {"to":"corvid|herald","task":"max 12 words"} optional, Steward only,
 "say": "one short line for the channel ONLY when something shipped or broke, otherwise empty"
}
Rules: finish aggressively; a task whose proposal, delegation, note, or assignment just went out is done unless it waits on the owner, then keep status doing. Never re-file pending work. "say" is almost always empty. Line breaks as \\n, must pass JSON.parse, never em dashes.`;

async function staffWorkTick(key) {
  const a = state[key];
  const role = ROLES[key];
  if (!a.enabled || a.status === "thinking") return;
  const t = a.tasks.find((x) => x.status !== "done");
  if (!t) return;
  const day = dayKey();
  if (a.workDay !== day) {
    a.workDay = day;
    a.workSteps = 0;
  }
  if (WORK_DAILY_CAP && (a.workSteps || 0) >= WORK_DAILY_CAP) return;
  if (a.lastWorkAt && Date.now() - a.lastWorkAt < WORK_GAP_MIN * 60000) return;
  if (a.lastCycleAt && Date.now() - a.lastCycleAt < 2 * 60000) return;
  a.status = "thinking";
  a.lastWorkAt = Date.now();
  a.workSteps = (a.workSteps || 0) + 1;
  saveState();
  log(key, "work", `advancing: ${t.title}`);
  try {
    const user = [
      `THE TASK: ${t.title}`,
      `Current focus: ${a.focus}`,
      `Other open tasks (context only): ${JSON.stringify(a.tasks.filter((x) => x.status !== "done" && x.id !== t.id).map((x) => x.title))}`,
      `YOUR Playbook.md (excerpt):\n${vaultRead(key, "Playbook.md").slice(0, 800) || "(not started)"}`,
      key === "steward" ? `YOUR Projects.md (excerpt):\n${vaultRead(key, "Projects.md").slice(0, 1200) || "(not started)"}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");
    const out = await think(`${role.system}\n\n${WORK_SCHEMA}`, user, 2000);
    if (out.thought) a.thought = String(out.thought).slice(0, 700);
    t.status = out.status === "done" ? "done" : "doing";
    if (out.proposal && out.proposal.summary) {
      const filed = fileProposals([out.proposal], role.name);
      if (filed.length) log(key, "filed", `#${filed[0].number} ${filed[0].summary}`);
    }
    if (out.note && out.note.name && out.note.body) {
      const nm = String(out.note.name).replace(/[^a-zA-Z0-9 ._-]/g, "").trim();
      if (nm) vaultWrite(key, nm.replace(/\.md$/i, "") + ".md", String(out.note.body).slice(0, 12000));
    }
    if (out.delegation && out.delegation.minion) {
      await runStaffMinion(key, String(out.delegation.minion).trim(), String(out.delegation.task || t.title).slice(0, 160), out.delegation.context);
    }
    if (role.flags.assigns && out.assignment && out.assignment.to && out.assignment.task) {
      const title = `${role.name}: ${String(out.assignment.task).slice(0, 100)}`;
      if (out.assignment.to === "corvid") corvidAddTask(title);
      else if (out.assignment.to === "herald") staffAddTask("herald", title);
      log(key, "assign", `${out.assignment.to} <- ${String(out.assignment.task).slice(0, 80)}`);
    }
    if (out.say && String(out.say).trim()) {
      await sendTo(role.channel, `**${role.name.toUpperCase()} //** ${String(out.say).slice(0, 300)}`, { agent: key });
    }
    log(key, "work", `step done: ${t.title} -> ${t.status}`);
  } catch (e) {
    log(key, "error", `work step failed: ${String(e.message || e).slice(0, 200)}`);
  } finally {
    a.status = "watching";
    saveState();
  }
}

const REACT_SCHEMA = `The owner just spoke in your channel. Output STRICT JSON only: {"reply":"your answer, template voice, 1 to 3 short lines","tasks":[{"title":"max 7 words"}]}. tasks is only for new work he just handed you, max 2, usually empty.`;

async function reactToMessages(key, msgs) {
  const role = ROLES[key];
  const text = msgs.map((m) => `${m.author?.username || "owner"}: ${String(m.content).slice(0, 400)}`).join("\n");
  try {
    const out = await think(
      `${role.system}\n\n${REACT_SCHEMA}`,
      `Your current focus: ${state[key].focus}\nOpen tasks: ${JSON.stringify(state[key].tasks.filter((t) => t.status !== "done"))}\n\nNew messages:\n${text}`,
      1200
    );
    if (out.reply) await sendTo(role.channel, String(out.reply).slice(0, 1800), { agent: key });
    for (const t of Array.isArray(out.tasks) ? out.tasks.slice(0, 2) : []) {
      if (t.title) staffAddTask(key, String(t.title));
    }
  } catch (e) {
    log(key, "error", `react failed: ${e.message || e}`);
  }
}

// ---------------------------------------------------------------------------
// scheduler and api surface
// ---------------------------------------------------------------------------
export function startStaff() {
  for (const key of Object.keys(ROLES)) {
    ensureVault(key);
    if (state[key].status === "thinking") state[key].status = "watching";
  }
  saveState();
  setInterval(() => {
    for (const key of Object.keys(ROLES)) {
      const a = state[key];
      if (!a.enabled || a.status === "thinking") continue;
      // a fresh task never waits for the schedule: cycle within the minute
      if (a.asap && (!a.lastCycleAt || Date.now() - a.lastCycleAt > 2 * 60000)) {
        const why = a.asap;
        a.asap = "";
        saveState();
        runStaffCycle(key, `event: ${why}`).catch(() => {});
        continue;
      }
      if (!a.lastCycleAt || Date.now() - a.lastCycleAt >= CYCLE_EVERY_H * 3600000) {
        runStaffCycle(key, "schedule").catch(() => {});
        continue;
      }
      // no cycle due: grind the queue
      staffWorkTick(key).catch(() => {});
    }
  }, 60 * 1000);
  // two way chat only in a channel of its own; shared channels already have
  // Corvid or Regent answering, two voices would collide
  for (const key of Object.keys(ROLES)) {
    const ch = ROLES[key].channel;
    if (BOT_TOKEN && ch && ch !== SEO_CHANNEL && ch !== CEO_CHANNEL) {
      setInterval(async () => {
        if (!state[key].enabled || state[key].status === "thinking") return;
        const msgs = await fetchNew(key);
        if (msgs.length) await reactToMessages(key, msgs);
      }, POLL_SECONDS * 1000);
    }
  }
  for (const key of Object.keys(ROLES)) {
    log(
      key,
      "boot",
      `${ROLES[key].name} hired and online. Cadence: every ${CYCLE_EVERY_H}h. Channel: ${
        ROLES[key].channel ? (ROLES[key].channel === SEO_CHANNEL || ROLES[key].channel === CEO_CHANNEL ? "shared" : "own, two-way") : "none"
      }.${key === "steward" ? ` Community posting: ${ROLES[key].community ? "armed, max 2 a day" : "not wired"}.` : ""}`
    );
  }
}

export function staffStates() {
  return Object.keys(ROLES).map((key) => ({
    key,
    name: ROLES[key].name,
    title: ROLES[key].title,
    enabled: state[key].enabled,
    status: state[key].enabled ? state[key].status : "paused",
    lastCycleAt: state[key].lastCycleAt,
    cycleEveryH: CYCLE_EVERY_H,
    focus: state[key].focus,
    thought: state[key].thought,
    tasks: state[key].tasks,
    minionReports: (state[key].minionReports || []).slice(-6).reverse(),
    log: state[key].log.slice(-40).reverse(),
    channel: ROLES[key].channel
      ? ROLES[key].channel === SEO_CHANNEL || ROLES[key].channel === CEO_CHANNEL
        ? "shared"
        : "own"
      : "none",
    community: key === "steward" ? Boolean(ROLES[key].community) : undefined,
  }));
}
export function staffSetEnabled(key, on) {
  if (!state[key]) return null;
  state[key].enabled = Boolean(on);
  state[key].status = state[key].enabled ? "watching" : "paused";
  log(key, "control", state[key].enabled ? "Resumed by owner" : "Paused by owner");
  return state[key].enabled;
}
export function staffRunCycle(key) {
  if (!ROLES[key]) return Promise.resolve({ ok: false, error: "no such agent" });
  return runStaffCycle(key, "owner pressed Run cycle now");
}
// Herald's copy pass: called by the render pipeline before any creative
// ships, so every caption and tag set is tuned to the one destination the
// post is selling. Returns {caption, hashtags} or null to keep the draft.
const TARGET_CTA = {
  brand: "blackcrownvxj.com",
  korvus: "korvus.industries, start with the free Observer account",
  crown: "blackcrown-intelligence.com",
  eclipse: "the free Eclipse-X Discord, link in bio",
  lodestone: "the LodeStone indicator, included with Korvus Operator at korvus.industries",
};
export async function heraldCopyPass(input) {
  const target = TARGET_CTA[input.target] ? input.target : "korvus";
  const sys = ROLES.herald.system + '\n\nOutput STRICT JSON only: {"caption":"...","hashtags":["","","",""]}. Caption rules: under 140 characters, hook first, one clear call to action pointing at ' + TARGET_CTA[target] + ', no emoji, no double quotes inside the caption, never an em dash. Exactly 4 hashtags, lowercase, no spaces: one broad, two niche futures or trading tags, one brand tag. Fold in at most one provided trend tag and only when it truly fits.';
  const user = "Finalize the caption and hashtags for a TikTok " + (input.format || "post") + " selling " + target + ".\nDRAFT CAPTION: " + (input.caption || "(none)") + "\nVISUAL OR SCRIPT:\n" + (Array.isArray(input.slides) ? input.slides.join("\n") : "").slice(0, 1200) + "\nTIKTOK TRENDS:\n" + String(input.trends || "none available").slice(0, 700);
  const out = await think(sys, user, 500);
  if (out && out.caption) {
    log("herald", "copy", "finalized caption for a " + (input.format || "post") + " selling " + target);
    return out;
  }
  return null;
}

export function staffAddTask(key, title) {
  if (!state[key]) return null;
  const t = { id: crypto.randomBytes(4).toString("hex"), title: String(title || "").slice(0, 120), status: "open" };
  if (!t.title) return null;
  state[key].tasks.push(t);
  state[key].tasks = state[key].tasks.slice(-12);
  state[key].asap = `a new task just landed: ${t.title}`.slice(0, 140);
  log(key, "task", `queued: ${t.title}`);
  saveState();
  return t;
}
