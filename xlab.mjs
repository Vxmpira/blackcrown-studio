// xlab.mjs: THE X LAB. X exists to pull strangers toward the products, so
// every post is also a test. Each post is filed under one sales ANGLE, the
// server records which angle each published post used, reads the numbers back
// from X, and keeps a scoreboard by angle. The desks write the next posts off
// that scoreboard: more of what is working, and a steady share on angles that
// have not had a fair try yet.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, "studio-xlab.json");

// the sales approaches a post can take; one per post
export const ANGLES = {
  curiosity: "an open loop: a surprising fact or question the click answers",
  pain: "names a problem the trader already feels (missed the overnight move, nine tabs open)",
  proof: "a specific result or number from the product itself, shown not claimed",
  contrarian: "disagrees with something traders commonly believe, then backs it",
  story: "a short scene: one trader, one morning, what happened",
  howto: "teaches one useful thing in the post itself, the product is the next step",
  news: "ties the product to something happening in the market today",
  offer: "the plain deal: what is free, what it costs, what you get",
  question: "asks the reader something they want to answer or argue with",
  community: "invites people into Eclipse-X or shows what happens there",
};
export const ANGLE_LIST = Object.keys(ANGLES);

let state = load();
function load() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { posts: [], readAt: 0, readErr: "" };
  }
}
function save() {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } catch {}
}

// How X itself weighs a post: any link counts 23 whatever its length, plain
// Latin text counts 1 a character, and emoji, arrows and most symbols count 2.
// The cap is 280.
export function xWeight(text) {
  let t = String(text || "").trim().normalize("NFC");
  let w = 0;
  t = t.replace(/(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi, () => {
    w += 23;
    return "";
  });
  for (const ch of t) {
    const c = ch.codePointAt(0);
    w += (c <= 4351) || (c >= 8192 && c <= 8205) || (c >= 8208 && c <= 8223) || (c >= 8242 && c <= 8247) ? 1 : 2;
  }
  return w;
}
export function angleOf(detail) {
  const a = ((String(detail || "").match(/^\s*ANGLE:\s*([a-z-]+)/im) || [])[1] || "").toLowerCase();
  return ANGLE_LIST.includes(a) ? a : "";
}

export function recordPost({ id, angle, number, text, at }) {
  if (!id || (state.posts || []).some((p) => p.id === String(id))) return;
  state.posts = [...(state.posts || []), { id: String(id), angle: angle || "unlabeled", number: number || 0, at: at || Date.now(), text: String(text || "").replace(/\s+/g, " ").slice(0, 110) }].slice(-600);
  save();
}
// which posts still need their numbers read: young ones every pass, and each
// post one last time after it is two days old, then never again
export function idsToRead(max = 40) {
  const now = Date.now();
  return (state.posts || [])
    .filter((p) => !p.final && now - p.at < 21 * 86400000)
    .sort((a, b) => b.at - a.at)
    .slice(0, max)
    .map((p) => p.id);
}
export function storeMetrics(rows) {
  const now = Date.now();
  for (const r of rows || []) {
    const p = (state.posts || []).find((x) => x.id === String(r.id));
    if (!p) continue;
    p.m = { imp: r.imp ?? null, likes: r.likes ?? 0, reposts: r.reposts ?? 0, replies: r.replies ?? 0, clicks: r.clicks ?? null, profile: r.profile ?? null };
    p.mAt = now;
    if (now - p.at > 48 * 3600000) p.final = true;
  }
  state.readAt = now;
  state.readErr = "";
  save();
}
export function noteReadError(msg) {
  state.readAt = Date.now();
  state.readErr = String(msg || "").slice(0, 160);
  save();
}
export function lastRead() {
  return { at: state.readAt || 0, err: state.readErr || "" };
}

export function scoreboard(days = 14) {
  const since = Date.now() - days * 86400000;
  const posts = (state.posts || []).filter((p) => p.at >= since);
  const by = {};
  for (const p of posts) {
    const a = (by[p.angle] = by[p.angle] || { angle: p.angle, n: 0, read: 0, imp: 0, clicks: 0, profile: 0, engage: 0, best: null });
    a.n++;
    if (!p.m || p.m.imp == null) continue;
    a.read++;
    a.imp += p.m.imp;
    a.clicks += p.m.clicks || 0;
    a.profile += p.m.profile || 0;
    a.engage += (p.m.likes || 0) + (p.m.reposts || 0) + (p.m.replies || 0);
    if (!a.best || p.m.imp > a.best.imp) a.best = { imp: p.m.imp, text: p.text, id: p.id };
  }
  const rows = Object.values(by).map((a) => ({ ...a, avg: a.read ? a.imp / a.read : null })).sort((x, y) => (y.avg ?? -1) - (x.avg ?? -1));
  return { rows, total: posts.length, untested: ANGLE_LIST.filter((k) => !by[k] || by[k].n < 5) };
}
export function scoreboardText() {
  const { rows, total, untested } = scoreboard();
  const lr = lastRead();
  const head = `X LAB, the last 14 days by sales angle (X exists to pull strangers to the products; every post is a test):`;
  if (!total) return `${head}\nNo post has been filed under an angle yet. Every X ask now carries ANGLE: one of ${ANGLE_LIST.join(", ")}.`;
  const lines = rows.map((a) => `- ${a.angle}: ${a.n} posts${a.read ? `, ${a.avg.toFixed(1)} impressions a post, ${a.clicks} link clicks, ${a.profile} profile clicks, ${a.engage} likes+reposts+replies${a.best && a.best.imp > 0 ? `; best (${a.best.imp}): "${a.best.text.slice(0, 70)}"` : ""}` : ", numbers not read yet"}`);
  const labelled = rows.filter((a) => a.angle !== "unlabeled" && a.read >= 3);
  const lead = labelled[0];
  const verdict = !lead
    ? "No angle has 3 measured posts yet, so there is no leader. Spread the next posts across angles."
    : lead.avg < 20
    ? `Nothing is breaking through: the best angle (${lead.angle}) averages ${lead.avg.toFixed(1)} impressions a post. At that level the account has no audience to test on, and the words are not the problem; reach is. Keep rotating angles, lean on what X shows to non-followers (a tag a trader searches, a post tied to today's market, a video), and say so if this holds for a week.`
    : `LEADER: ${lead.angle} at ${lead.avg.toFixed(1)} impressions a post. Put two of every three posts on the top two angles and the third on an untested one.`;
  return [head, ...lines, verdict, untested.length ? `Angles with fewer than 5 posts, each still owed a fair test: ${untested.join(", ")}.` : "", lr.err ? `X would not give numbers on the last read: ${lr.err}` : ""].filter(Boolean).join("\n");
}
export function xlabState() {
  return { ...scoreboard(), angles: ANGLES, lastRead: lastRead(), posts: (state.posts || []).slice(-40).reverse() };
}

export const X_RULES = `X IS THE COMPANY'S TRAFFIC ENGINE, the owner's standing order: its one job is to make a stranger curious enough to click through to us. Volume stays up; what changes is that every post is a test. EVERY X ask carries a line ANGLE: with exactly one of ${ANGLE_LIST.join(", ")} (${Object.entries(ANGLES).map(([k, v]) => `${k} = ${v}`).join("; ")}). Put the ANGLE line above NEW, never inside it. Read X LAB on the Board before you write: two of every three posts go to the angles winning on impressions and link clicks, the third to an angle with fewer than 5 posts, so every approach gets a fair test and the winners get more room. CRAFT: the first line is the hook and has to stand alone in a feed; one idea a post; talk to one trader, not to "traders"; never reuse a line that already ran; one or two tags a futures trader actually searches ($NQ $ES #futures #daytrading), never more; end on the link with utm_source=x&utm_medium=social&utm_content=<the angle> so clicks can be traced to the angle. LENGTH is weighed the way X weighs it: any link counts 23 whatever its length, emoji and arrows count 2 each, the cap is 280 and the server refuses anything over. Herald runs X as the company's social desk; any other desk with an idea for a post sends it to Herald with a memo instead of filing its own.`;
