// Small render + generation service. The admin page calls this; this calls
// your AWS for rendering and the Anthropic API for writing new ads.
// All keys are read from .env and never leave your machine.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderMediaOnLambda, getRenderProgress } from "@remotion/lambda/client";

dotenv.config();

const region = process.env.REMOTION_AWS_REGION;
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME;
const serveUrl = process.env.REMOTION_SERVE_URL;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB_PATH = path.join(__dirname, "studio-ads.json");
const BRIEF_PATH = path.join(__dirname, "marketing-brief.md");

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

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
    framesPerLambda: 200,
    generatedCount: loadGenerated().length,
  });
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BlackCrown render + generation service on http://localhost:${PORT}`);
});
