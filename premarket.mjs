// premarket.mjs: the Pre-market Brief. Every market day before the open the
// server reads Korvus's overnight scored stories, the futures board and the
// day's calendar, writes a 35 second vertical brief, renders it on this box
// with ffmpeg and libass and its own synthesized score (no Bloom, no GPU, no
// credits, no licensed audio), and delivers it:
//   - the finished MP4 and a ready-to-paste caption land in the owner's
//     TikTok channel on Discord, to download and post by hand
//   - an X post and a YouTube post are filed as asks through Regent, so the
//     owner's approval gate still decides what goes out under the brand
// Every claim on screen comes from Korvus's own feed; the writer is told to
// invent nothing, predict nothing and advise nothing.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(__dirname, "studio-premarket.json");
const BG = path.join(__dirname, "assets", "brief", "bg.png");
const FONTS = path.join(__dirname, "assets", "fonts");
const W = 1080;
const H = 1920;

let deps = {
  feedUrl: "",
  feedKey: "",
  rendersDir: "",
  publicUrl: "",
  callJSON: null, // (opts, parser) => object
  parseJson: null,
  model: "",
  drop: null, // async ({file, url, caption, title}) => bool, the TikTok channel delivery
  fileAsks: null, // (list, author) => filed proposals
  community: null, // async (text) => bool, optional Eclipse-X post
  settings: () => ({}), // live tuner values for the brief
  log: (...a) => console.log("[premarket]", ...a),
};
export function wirePremarket(d) {
  deps = { ...deps, ...d };
}

let state = load();
function load() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch {
    return { lastDay: "", runs: [] };
  }
}
function save() {
  try {
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } catch {}
}
export function premarketState() {
  return { lastDay: state.lastDay, running: Boolean(state.running), runs: (state.runs || []).slice(-10).reverse() };
}

// ---------------------------------------------------------------------------
// clock: market days only, from the set time until 8:30 AM ET
// ---------------------------------------------------------------------------
function etParts(d = new Date()) {
  const f = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, wd: p.weekday, hour: Number(p.hour) % 24, minute: Number(p.minute) };
}
export function premarketDue(now = new Date()) {
  const s = deps.settings() || {};
  if (s.enabled === false || state.running) return false;
  const t = etParts(now);
  if (["Sat", "Sun"].includes(t.wd)) return false;
  if (state.lastDay === t.day) return false;
  const [hh, mm] = String(s.time || "05:30").split(":").map(Number);
  const mins = t.hour * 60 + t.minute;
  return mins >= hh * 60 + (mm || 0) && mins <= 8 * 60 + 30;
}

// ---------------------------------------------------------------------------
// 1. the data
// ---------------------------------------------------------------------------
async function readFeed() {
  if (!deps.feedUrl || !deps.feedKey) throw new Error("the Korvus brief feed is not configured (KORVUS_INTEL_KEY)");
  const r = await fetch(`${deps.feedUrl}?hours=16`, { headers: { "X-Intel-Key": deps.feedKey }, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`Korvus brief feed answered ${r.status}`);
  return r.json();
}
const BOARD = [
  ["MES", "S&P 500"],
  ["MNQ", "NASDAQ 100"],
  ["MYM", "DOW"],
  ["CL", "CRUDE"],
  ["GC", "GOLD"],
];
function boardRows(board) {
  return BOARD.map(([sym, label]) => {
    const q = board && board[sym];
    const pct = q && Number.isFinite(Number(q.chg_pct)) ? Number(q.chg_pct) : null;
    return pct === null ? null : { label, pct };
  }).filter(Boolean);
}

// ---------------------------------------------------------------------------
// 2. the words
// ---------------------------------------------------------------------------
const WRITER = `You write the Korvus Pre-market Brief, a 35 second vertical video for index futures traders, plus its captions.
Korvus is a market intelligence terminal. The brief explains what moved overnight and why, so a trader understands the session before the open. It never predicts price, never promises profit, never gives trading advice.
Use ONLY the stories and numbers provided. Invent nothing. If a fact is not in the data, leave it out.
Voice: a sharp trader talking to another trader. Plain words, short sentences, zero hype. Never use em dashes or en dashes, never emoji, never double quote characters.
Output STRICT JSON only:
{"hook":"max 40 characters, the single most important overnight story as a punchy line, no question marks",
 "stories":[{"index":"one of S&P, Nasdaq, Dow, Crude, Gold, Bonds, Yen, Dollar, Index futures","dir":"up|down|mixed","impact":"high|med|low","headline":"max 52 characters, what happened","why":"max 95 characters, why it matters for index futures today"}],
 "caption":"TikTok caption: first line leads with the plain keywords traders search (for example ES and NQ futures news before the open), then 2 short lines naming today's story, then the line Free overnight read at korvus.industries, then the line Education only, not financial advice., then exactly 4 lowercase hashtags on the last line. Under 600 characters.",
 "x_post":"one X post, max 230 characters including the link korvus.industries and the words Not financial advice, at most 2 hashtags",
 "yt_title":"max 90 characters, starts with Pre-market Brief and the date, then the main story",
 "yt_description":"2 to 4 short lines summarizing the stories, then Free overnight read at korvus.industries, then Education only, not financial advice."}
Exactly 3 stories, highest impact first. Use line breaks inside strings as \\n.`;

function clean(s, max) {
  let t = String(s || "")
    .replace(/\\n/g, "\n")
    .replace(/\s*[\u2014\u2013]\s*/g, ", ")
    .replace(/["\u201c\u201d]/g, "'")
    .replace(/[{}\\]/g, " ")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
  if (max && t.length > max) t = t.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
  return t;
}
async function writeBrief(feed, dateLabel) {
  const items = (feed.items || []).slice(0, 14).map((i) => ({
    time_et: i.t, impact: i.impact, direction: i.dir, instruments: i.inst, headline: i.headline, summary: i.summary, why: i.impact_desc,
  }));
  if (!items.length) throw new Error("Korvus returned no scored stories for the overnight window");
  const user = [
    `DATE: ${dateLabel}`,
    `OVERNIGHT STORIES, scored by Korvus, highest impact first:\n${JSON.stringify(items)}`,
    `FUTURES BOARD, percent change: ${JSON.stringify(boardRows(feed.board))}`,
    `TODAY'S US CALENDAR: ${JSON.stringify(feed.calendar || [])}`,
  ].join("\n\n");
  const out = await deps.callJSON(
    { who: "brief", model: deps.model, system: WRITER, user, maxTokens: 1800, priority: "owner" },
    deps.parseJson
  );
  const stories = (Array.isArray(out.stories) ? out.stories : []).slice(0, 3).map((s) => ({
    index: clean(s.index, 16) || "Index futures",
    dir: ["up", "down", "mixed"].includes(String(s.dir)) ? String(s.dir) : "mixed",
    impact: ["high", "med", "low"].includes(String(s.impact)) ? String(s.impact) : "med",
    headline: clean(s.headline, 56),
    why: clean(s.why, 100),
  })).filter((s) => s.headline);
  if (!stories.length) throw new Error("the writer returned no usable stories");
  return {
    hook: clean(out.hook, 44) || stories[0].headline,
    stories,
    caption: clean(out.caption, 900).replace(/ ?\\n ?/g, "\n"),
    x_post: clean(out.x_post, 240),
    yt_title: clean(out.yt_title, 95),
    yt_description: clean(out.yt_description, 900).replace(/ ?\\n ?/g, "\n"),
  };
}

// ---------------------------------------------------------------------------
// 3. the picture: libass typesetting over the brand backdrop
// ---------------------------------------------------------------------------
const C = {
  white: "&H00F7F2F5",
  gray: "&H00C6BDC9",
  dim: "&H00908598",
  pink: "&H008F2DFF",
  green: "&H0097DC3D",
  red: "&H006D4DFF",
};
function ts(sec) {
  const cs = Math.max(0, Math.round(sec * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
}
// Word wrap by an average glyph width; libass gets explicit line breaks so a
// long word can never run off the right edge into TikTok's buttons.
function wrap(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= maxChars) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/[.,;:]?$/, "…");
    return kept.join("\\N");
  }
  return lines.join("\\N");
}
function ev(start, end, style, text, extra = "") {
  return `Dialogue: 0,${ts(start)},${ts(end)},${style},,0,0,0,,${extra}${text}`;
}
// fade in with a short rise, fade out; x,y is the top-left anchor
function line(start, end, style, x, y, text, rise = 26) {
  const fin = 260;
  const fout = 220;
  return ev(start, end, style, text, `{\\an7\\move(${x},${y + rise},${x},${y},0,${fin})\\fad(${fin},${fout})}`);
}
function arrow(dir) {
  return dir === "up" ? "▲" : dir === "down" ? "▼" : "◆";
}
export function buildAss(brief, board, calendar, dateLabel) {
  const L = 90; // left margin; the right 150px stay clear for TikTok's buttons
  const evs = [];
  const starts = []; // when each scene begins, for the sound hits
  let t = 0;
  // 1. the hook
  const s1 = 4.4;
  evs.push(line(0.1, s1, "Kicker", L, 330, "KORVUS  //  PRE-MARKET BRIEF", 0));
  evs.push(line(0.3, s1, "Mono", L, 395, dateLabel.toUpperCase(), 0));
  const hook = wrap(brief.hook.toUpperCase(), 16, 4);
  evs.push(line(0.6, s1, "Hook", L, 500, hook));
  const subY = 500 + hook.split("\\N").length * 168 + 70;
  // the number first: the biggest overnight move on the board, in its colour.
  // A figure pulls the eye harder than a sentence does.
  const rows = boardRows(board);
  // an index first (this is an index futures brief); crude or gold only when
  // no index moved enough to show
  const big = (list) => list.slice().sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))[0];
  const idx = big(rows.filter((r) => ["S&P 500", "NASDAQ 100", "DOW"].includes(r.label)));
  const top = idx && Math.abs(idx.pct) >= 0.05 ? idx : big(rows);
  if (top && Math.abs(top.pct) >= 0.05) {
    const col = top.pct > 0 ? C.green : C.red;
    evs.push(line(1.4, s1, "Mono", L, subY, `${top.label}  OVERNIGHT`, 0));
    evs.push(ev(1.5, s1, "Big", `${top.pct > 0 ? "▲ +" : "▼ "}${top.pct.toFixed(2)}%`, `{\\an7\\pos(${L},${subY + 56})\\c${col}\\fscx70\\fscy70\\t(0,320,0.6,\\fscx100\\fscy100)\\fad(160,220)}`));
  } else {
    evs.push(line(1.6, s1, "Sub", L, subY, wrap("What moved overnight and why it matters before the open.", 34, 2)));
  }
  starts.push(0);
  t = s1;
  // 2. the board, only when Korvus had prices
  if (rows.length) {
    const s2 = t + 4.4;
    starts.push(t);
    const span = Math.max(...rows.map((r) => Math.abs(r.pct)), 0.25);
    evs.push(line(t + 0.1, s2, "Kicker", L, 330, "OVERNIGHT FUTURES", 0));
    rows.slice(0, 5).forEach((r, i) => {
      const y = 460 + i * 150;
      const up = r.pct > 0.02;
      const down = r.pct < -0.02;
      const col = up ? C.green : down ? C.red : C.gray;
      const pct = `${up ? "▲" : down ? "▼" : "◆"} ${r.pct > 0 ? "+" : ""}${r.pct.toFixed(2)}%`;
      evs.push(line(t + 0.25 + i * 0.18, s2, "Board", L, y, r.label));
      evs.push(line(t + 0.35 + i * 0.18, s2, "BoardPct", 590, y + 6, `{\\c${col}}${pct}`));
      // a bar that grows to the size of the move, so the board reads at a glance
      const bw = Math.max(14, Math.round((Math.abs(r.pct) / span) * 880));
      const b0 = Math.round((t + 0.45 + i * 0.18) * 1000) - Math.round((t + 0.35 + i * 0.18) * 1000);
      evs.push(ev(t + 0.35 + i * 0.18, s2, "Rail", `m 0 0 l ${bw} 0 ${bw} 8 0 8`, `{\\an7\\pos(${L},${y + 108})\\p1\\c${col}\\fscx0\\t(${b0},${b0 + 700},0.5,\\fscx100)\\fad(0,220)}`));
    });
    evs.push(line(t + 1.4, s2, "Dim", L, 1230, "Micro contracts shown, same index moves."));
    t = s2;
  }
  // 3. the stories
  brief.stories.forEach((s, i) => {
    const end = t + 7.2;
    starts.push(t);
    const col = s.dir === "up" ? C.green : s.dir === "down" ? C.red : C.gray;
    const tag = `0${i + 1}  /  ${s.index.toUpperCase()}  {\\c${col}}${arrow(s.dir)}{\\c${C.pink}}  ${s.impact === "high" ? "HIGH IMPACT" : s.impact === "med" ? "MEDIUM IMPACT" : "LOW IMPACT"}`;
    evs.push(line(t + 0.1, end, "Kicker", L, 330, tag, 0));
    const head = wrap(s.headline, 24, 4);
    evs.push(line(t + 0.3, end, "Head", L, 440, head));
    evs.push(line(t + 1.1, end, "Why", L, 440 + head.split("\\N").length * 122 + 70, wrap(s.why, 38, 4)));
    t = end;
  });
  // 4. the calendar
  const cal = (calendar || []).slice(0, 4);
  const s4 = t + 3.6;
  starts.push(t);
  evs.push(line(t + 0.1, s4, "Kicker", L, 330, "ON TODAY'S CALENDAR", 0));
  if (cal.length) {
    cal.forEach((c, i) => {
      evs.push(line(t + 0.3 + i * 0.2, s4, "Cal", L, 450 + i * 190, clean(c.time, 9)));
      evs.push(line(t + 0.4 + i * 0.2, s4, "CalTitle", L, 510 + i * 190, wrap(clean(c.title, 40), 26, 1)));
    });
  } else {
    evs.push(line(t + 0.3, s4, "Head", L, 450, wrap("No major US releases on the calendar today.", 24, 3)));
  }
  t = s4;
  // 5. the close
  const s5 = t + 4.2;
  starts.push(t);
  evs.push(line(t + 0.1, s5, "Hook", L, 500, wrap("GET THIS EVERY MORNING. FREE.", 16, 3)));
  evs.push(line(t + 0.5, s5, "Url", L, 1010, "korvus.industries"));
  evs.push(line(t + 0.9, s5, "Dim", L, 1150, "Education only. Not financial advice."));
  t = s5;
  // the progress rail along the bottom, the whole length of the clip
  evs.push(ev(0, t, "Rail", `m 0 0 l 900 0 900 6 0 6`, `{\\an7\\pos(${L},1590)\\p1\\fscx0\\t(0,${Math.round(t * 1000)},\\fscx100)}`));
  const head = [
    "[Script Info]",
    "ScriptType: v4.00+",
    `PlayResX: ${W}`,
    `PlayResY: ${H}`,
    "WrapStyle: 2",
    "ScaledBorderAndShadow: yes",
    "",
    "[V4+ Styles]",
    "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
    `Style: Kicker,JetBrains Mono,42,${C.pink},&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,4,0,1,0,0,7,0,0,0,1`,
    `Style: Mono,JetBrains Mono,38,${C.gray},&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,2,0,1,0,0,7,0,0,0,1`,
    `Style: Hook,Space Grotesk,148,${C.white},&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,0,4,7,0,0,0,1`,
    `Style: Big,JetBrains Mono,150,${C.white},&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,0,3,7,0,0,0,1`,
    `Style: Sub,Space Grotesk,58,${C.gray},&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    `Style: Board,Space Grotesk,84,${C.white},&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    `Style: BoardPct,JetBrains Mono,72,${C.white},&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    `Style: Head,Space Grotesk,106,${C.white},&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,0,3,7,0,0,0,1`,
    `Style: Why,Space Grotesk,62,${C.gray},&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    `Style: Cal,JetBrains Mono,44,${C.pink},&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    `Style: CalTitle,Space Grotesk,78,${C.white},&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    `Style: Url,Space Grotesk,112,${C.pink},&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    `Style: Dim,JetBrains Mono,36,${C.dim},&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,0,0,7,0,0,0,1`,
    `Style: Rail,Space Grotesk,10,${C.pink},&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0,1`,
    "",
    "[Events]",
    "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
  ];
  return { ass: [...head, ...evs, ""].join("\n"), seconds: Math.ceil(t * 10) / 10, starts };
}

// The score, made by ffmpeg from plain maths on this box: no sample packs, no
// licence, no cost, nothing a platform can mute or claim. A minor-key pad, an
// eighth-note pluck line that walks four chords, a soft kick on the beat, and
// a low hit on every scene change so the cuts land.
export function scoreGraph(seconds, starts) {
  const T = Number(seconds).toFixed(2);
  const root = "st(1, floor(mod(t/8,4))); st(2, if(eq(ld(1),0),0, if(eq(ld(1),1),-4, if(eq(ld(1),2),3,-2))));";
  const step = "st(3, floor(mod(t/0.25,8))); st(4, if(eq(ld(3),0),0, if(eq(ld(3),1),7, if(eq(ld(3),2),12, if(eq(ld(3),3),15, if(eq(ld(3),4),12, if(eq(ld(3),5),7, if(eq(ld(3),6),3,7))))))));";
  const pluck = `${root} ${step} st(5, 220*pow(2,(ld(2)+ld(4))/12)); st(6, mod(t,0.25)); 0.16*(sin(2*PI*ld(5)*t)+0.35*sin(4*PI*ld(5)*t))*exp(-9*ld(6))*min(1,ld(6)*400)`;
  const pad = `${root} st(5, 110*pow(2,ld(2)/12)); (0.5+0.5*sin(2*PI*0.07*t))*(0.07*sin(2*PI*ld(5)*t)+0.06*sin(2*PI*ld(5)*1.4983*t)+0.05*sin(2*PI*ld(5)*2*t)+0.04*sin(2*PI*ld(5)*2.3784*t))`;
  const kick = "st(6, mod(t,1)); 0.5*sin(2*PI*(45*ld(6)+11*(1-exp(-12*ld(6)))))*exp(-7*ld(6))";
  const hit = "0.75*sin(2*PI*(38*t+7*(1-exp(-8*t))))*exp(-2.6*t)+0.22*(random(0)*2-1)*exp(-10*t)";
  const n = Math.max(1, starts.length);
  const parts = [
    `aevalsrc='${pluck}':s=44100:d=${T},aecho=0.8:0.7:375:0.35,highpass=f=180[pl]`,
    `aevalsrc='${pad}':s=44100:d=${T}[pd]`,
    `aevalsrc='${kick}':s=44100:d=${T},lowpass=f=900[kk]`,
    `aevalsrc='${hit}':s=44100:d=2.2,asplit=${n}${starts.map((_, i) => `[h${i}]`).join("")}`,
    ...starts.map((at, i) => `[h${i}]adelay=${Math.max(0, Math.round(at * 1000))}:all=1[d${i}]`),
    `[pl][pd][kk]${starts.map((_, i) => `[d${i}]`).join("")}amix=inputs=${3 + n}:normalize=0:duration=first,` +
      `alimiter=limit=0.85,afade=t=in:d=0.4,afade=t=out:st=${Math.max(0, seconds - 1.6).toFixed(2)}:d=1.6,` +
      `aformat=channel_layouts=stereo,asplit=2[aout][aviz]`,
  ];
  return parts.join(";");
}

async function render(ass, seconds, name, starts = [0], sound = true) {
  const { default: ffmpegPath } = await import("ffmpeg-static");
  const { execFileSync } = await import("child_process");
  fs.mkdirSync(deps.rendersDir, { recursive: true });
  const assFile = path.join(deps.rendersDir, `${name}.ass`);
  const outFile = path.join(deps.rendersDir, `${name}.mp4`);
  fs.writeFileSync(assFile, ass);
  const esc = (s) => s.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "");
  // the backdrop drifts slowly so the frame never sits dead still
  const vf = [
    "scale=1188:2112",
    "crop=1080:1920:x='54+30*sin(t/5)':y='96+40*cos(t/6)'",
    "format=yuv420p",
    `ass='${esc(assFile)}':fontsdir='${esc(FONTS)}'`,
  ].join(",");
  // with sound: the score plays, and a thin live waveform of it rides above
  // the progress rail so the frame moves with the music
  const graph = sound
    ? [
        scoreGraph(seconds, starts),
        `[0:v]${vf}[bg]`,
        `[aviz]showwaves=s=900x110:mode=cline:rate=30:scale=sqrt:draw=full:colors=0xFF2D8F,format=rgba,colorkey=black:0.12:0.2,colorchannelmixer=aa=0.7[wv]`,
        `[bg][wv]overlay=90:1455:shortest=1,format=yuv420p[vout]`,
      ].join(";")
    : `[0:v]${vf}[vout];anullsrc=r=44100:cl=stereo[aout]`;
  const args = [
    "-y", "-loop", "1", "-framerate", "30", "-i", BG,
    "-filter_complex", graph, "-map", "[vout]", "-map", "[aout]",
    "-t", String(seconds),
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-r", "30",
    "-c:a", "aac", "-b:a", "128k", "-ar", "44100", "-movflags", "+faststart", outFile,
  ];
  try {
    execFileSync(ffmpegPath, args, { timeout: 300000, stdio: ["ignore", "ignore", "pipe"] });
  } catch (e) {
    const tail = String(e.stderr || e.message || e).split("\n").filter(Boolean).slice(-3).join(" | ");
    throw new Error(`brief render failed: ${tail.slice(0, 300)}`);
  } finally {
    try { fs.unlinkSync(assFile); } catch {}
  }
  return { file: outFile, url: `${deps.publicUrl}/api/renders/${name}.mp4`, bytes: fs.statSync(outFile).size };
}

// ---------------------------------------------------------------------------
// 4. the run
// ---------------------------------------------------------------------------
export const _render = render;
export async function runPremarket({ force = false, reason = "schedule" } = {}) {
  if (state.running) return { ok: false, error: "a brief is already rendering" };
  const t = etParts();
  if (!force && state.lastDay === t.day) return { ok: false, error: "today's brief already shipped" };
  state.running = true;
  save();
  const rec = { at: Date.now(), day: t.day, reason };
  try {
    const feed = await readFeed();
    const dateLabel = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "short", month: "short", day: "numeric" });
    const brief = await writeBrief(feed, dateLabel);
    const { ass, seconds, starts } = buildAss(brief, feed.board, feed.calendar, `${dateLabel}  ·  ${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")} ET`);
    const name = `brief-${t.day}-${String(Date.now()).slice(-5)}`;
    const vid = await render(ass, seconds, name, starts, (deps.settings() || {}).sound !== false);
    rec.url = vid.url;
    rec.seconds = seconds;
    rec.mb = Math.round((vid.bytes / 1048576) * 10) / 10;
    rec.hook = brief.hook;
    rec.stories = brief.stories.map((s) => s.headline);
    const s = deps.settings() || {};
    // the owner's TikTok channel: the file to download and the caption to paste
    if (s.tiktokDrop !== false && deps.drop) {
      rec.dropped = await deps.drop({ file: vid.file, url: vid.url, caption: brief.caption, title: `PRE-MARKET BRIEF · ${dateLabel}`, note: brief.stories.map((x, i) => `${i + 1}. ${x.headline}`).join("\n") }).catch((e) => {
        deps.log(`drop failed: ${e.message || e}`);
        return false;
      });
    }
    // the outside web goes through Regent and the owner's green light
    const asks = [];
    if (s.fileX !== false && brief.x_post) {
      asks.push({
        page: "x",
        kind: "post",
        target: "korvus",
        summary: `Pre-market Brief video on X, ${dateLabel}`,
        detail: `WHAT: today's Pre-market Brief video posted on the brand X account.\nWHY: the brief is Korvus's own overnight read, the free daily demo of the product.\nPLATFORM: x\nMEDIA: ${vid.url}\nCURRENT: none (new post)\nNEW: ${brief.x_post}\nGREEN LIGHT MEANS: the brief video and this text post on the brand X account, once.`,
      });
    }
    if (s.fileYouTube !== false) {
      asks.push({
        page: "youtube",
        kind: "post",
        target: "korvus",
        summary: brief.yt_title || `Pre-market Brief ${dateLabel}`,
        detail: `WHAT: today's Pre-market Brief as a YouTube Short.\nWHY: searchable daily proof of what Korvus reads overnight.\nPLATFORM: youtube\nMEDIA: ${vid.url}\nCURRENT: none (new upload)\nNEW: ${brief.yt_description || brief.caption}\nGREEN LIGHT MEANS: the brief uploads to the brand YouTube channel through the Make publisher, once.`,
      });
    }
    if (asks.length && deps.fileAsks) {
      const filed = deps.fileAsks(asks, "Brief") || [];
      rec.asks = filed.map((p) => p.number);
    }
    if (s.communityPost && deps.community) {
      const text = [`**Pre-market Brief · ${dateLabel}**`, ...brief.stories.map((x) => `${arrow(x.dir)} **${x.index}**: ${x.headline}. ${x.why}`), "", "Full overnight read, free: <https://korvus.industries>", "_Education only, not financial advice._"].join("\n");
      rec.community = await deps.community(text).catch(() => false);
    }
    rec.ok = true;
    state.lastDay = t.day;
    deps.log(`brief shipped: ${vid.url} (${seconds}s, ${rec.mb} MB)`);
    return { ok: true, ...rec };
  } catch (e) {
    rec.ok = false;
    rec.error = String(e.message || e).slice(0, 300);
    deps.log(`brief failed: ${rec.error}`);
    return { ok: false, error: rec.error };
  } finally {
    state.running = false;
    state.runs = [...(state.runs || []), rec].slice(-30);
    save();
  }
}
