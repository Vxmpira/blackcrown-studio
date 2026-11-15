// The Eclipse-X expression shelf importer. The owner hands over a list of
// licensed emoji.gg files; this queue pulls each one from emoji.gg's CDN,
// fits it to Discord's limits, and uploads it at whatever pace Discord's rate
// limits allow (emoji creation is throttled hard, so a full shelf takes hours).
// The queue lives on disk, so a restart picks up where it left off.
import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";

const API = "https://discord.com/api/v10";
const HOSTS = new Set(["cdn3.emoji.gg"]);
const EMOJI_MAX = 256 * 1024;
const STICKER_MAX = 512 * 1024;
const GAP_MS = 1500;

let cfg = { bot: "", guild: "", file: "", shelf: null };
let st = { queue: [], log: [], added: 0, skipped: 0, failed: 0, nextAt: 0, running: false, lastError: "" };

const save = () => {
  try {
    fs.writeFileSync(cfg.file, JSON.stringify({ ...st, running: false }, null, 1));
  } catch {}
};
const note = (it, result, ok) => {
  st.log.unshift({ at: Date.now(), kind: it.kind, name: it.name, result });
  st.log = st.log.slice(0, 200);
  if (ok === true) st.added++;
  else if (ok === false) st.failed++;
  else st.skipped++;
};
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
export const cleanName = (s, max) => {
  let n = String(s || "").replace(/[^A-Za-z0-9_]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").toLowerCase().slice(0, max);
  return n.length >= 2 ? n : "";
};

export function wireShelf({ bot, guild, file, shelf }) {
  cfg = { bot, guild, file, shelf };
  try {
    const saved = JSON.parse(fs.readFileSync(file, "utf8"));
    st = { ...st, ...saved, running: false };
  } catch {}
  if (st.queue.length) setTimeout(() => runShelf(), 15000);
}

export function shelfState() {
  return {
    left: st.queue.length,
    leftEmojis: st.queue.filter((x) => x.kind === "emoji").length,
    leftStickers: st.queue.filter((x) => x.kind === "sticker").length,
    added: st.added,
    skipped: st.skipped,
    failed: st.failed,
    running: st.running,
    waitingUntil: st.nextAt > Date.now() ? st.nextAt : 0,
    lastError: st.lastError,
    log: st.log.slice(0, 30),
  };
}

// items: [{ kind: "emoji"|"sticker", name, file | url, description?, tags? }]
export async function queueShelf(items) {
  const shelf = await cfg.shelf();
  const have = { emoji: new Set(shelf.emojiNames), sticker: new Set(shelf.stickerNames) };
  const queued = new Set(st.queue.map((x) => x.kind + ":" + x.name));
  let added = 0;
  const refused = [];
  for (const raw of Array.isArray(items) ? items.slice(0, 600) : []) {
    const kind = raw?.kind === "sticker" ? "sticker" : "emoji";
    const name = cleanName(raw?.name, kind === "sticker" ? 30 : 32);
    let url = String(raw?.url || (raw?.file ? `https://cdn3.emoji.gg/emojis/${encodeURIComponent(raw.file)}` : ""));
    let host = "";
    try {
      const u = new URL(url);
      host = u.protocol === "https:" ? u.hostname : "";
    } catch {}
    if (!name || !HOSTS.has(host)) {
      refused.push(`${raw?.name || "?"}: ${!name ? "bad name" : "only emoji.gg's CDN is allowed"}`);
      continue;
    }
    if (have[kind].has(name) || queued.has(kind + ":" + name)) continue;
    queued.add(kind + ":" + name);
    st.queue.push({
      kind,
      name,
      url,
      description: String(raw?.description || "Eclipse-X reaction").slice(0, 100),
      tags: cleanName(raw?.tags || name, 30) || "eclipse",
    });
    added++;
  }
  save();
  runShelf();
  return { queued: added, refused, left: st.queue.length };
}

export function clearShelfQueue() {
  const n = st.queue.length;
  st.queue = [];
  save();
  return n;
}

// keeps the oldest copy of every sticker name, deletes the rest
export async function dedupeStickers() {
  const h = { authorization: `Bot ${cfg.bot}` };
  const list = await fetch(`${API}/guilds/${cfg.guild}/stickers`, { headers: h }).then((r) => r.json());
  if (!Array.isArray(list)) throw new Error(list?.message || "could not list stickers");
  const byName = {};
  for (const s of list) (byName[s.name] ||= []).push(s);
  const out = [];
  for (const [name, copies] of Object.entries(byName)) {
    if (copies.length < 2) continue;
    copies.sort((a, b) => (BigInt(a.id) < BigInt(b.id) ? -1 : 1));
    for (const extra of copies.slice(1)) {
      const r = await fetch(`${API}/guilds/${cfg.guild}/stickers/${extra.id}`, { method: "DELETE", headers: h });
      out.push(`${name}: ${r.status === 204 ? "extra copy deleted" : `HTTP ${r.status}`}`);
      await sleep(800);
    }
  }
  return { checked: list.length, removed: out };
}

async function fetchBytes(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "user-agent": "BlackCrown shelf importer" } });
  if (!r.ok) throw new Error(`source HTTP ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length > 4 * 1024 * 1024) throw new Error("source file over 4 MB");
  return buf;
}

// ffmpeg pass: stickers become 320x320 (Discord's sticker size), and an
// animated emoji over 256 KB is shrunk to 128px with a fresh palette
async function reshape(buf, ext, mode) {
  const { default: ffmpegPath } = await import("ffmpeg-static");
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "shelf-"));
  const src = path.join(dir, "in." + ext);
  const dst = path.join(dir, "out." + ext);
  fs.writeFileSync(src, buf);
  const fit = (s) => `scale=${s}:${s}:force_original_aspect_ratio=decrease:flags=lanczos,pad=${s}:${s}:(ow-iw)/2:(oh-ih)/2:color=black@0`;
  const vf = ext === "gif"
    ? `${fit(mode === "sticker" ? 320 : 128)},split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=alpha_threshold=128`
    : `${fit(320)},format=rgba`;
  try {
    execFileSync(ffmpegPath, ["-hide_banner", "-loglevel", "error", "-y", "-i", src, "-filter_complex", vf, ...(ext === "gif" ? ["-loop", "0"] : []), dst], { timeout: 60000 });
    return fs.readFileSync(dst);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function uploadOne(it, slots) {
  const ext = /\.gif(\?|$)/i.test(it.url) ? "gif" : "png";
  const animated = ext === "gif";
  if (it.kind === "emoji" && (animated ? slots.animated : slots.static) <= 0) return { skip: `no ${animated ? "animated" : "static"} slots left` };
  if (it.kind === "sticker" && slots.sticker <= 0) return { skip: "no sticker slots left" };
  let buf = await fetchBytes(it.url);
  if (it.kind === "sticker") {
    try { buf = await reshape(buf, ext, "sticker"); } catch {}
    if (buf.length > STICKER_MAX) return { skip: "too big for a sticker" };
  } else if (buf.length > EMOJI_MAX) {
    if (animated) {
      try { buf = await reshape(buf, ext, "emoji"); } catch {}
    }
    if (buf.length > EMOJI_MAX) return { skip: "too big for an emoji" };
  }
  const h = { authorization: `Bot ${cfg.bot}` };
  let r;
  if (it.kind === "emoji") {
    r = await fetch(`${API}/guilds/${cfg.guild}/emojis`, {
      method: "POST",
      headers: { ...h, "content-type": "application/json", "x-audit-log-reason": "Eclipse-X shelf import (emoji.gg)" },
      body: JSON.stringify({ name: it.name, image: `data:image/${ext};base64,${buf.toString("base64")}` }),
    });
  } else {
    const fd = new FormData();
    fd.append("name", it.name);
    fd.append("description", it.description);
    fd.append("tags", it.tags);
    fd.append("file", new Blob([buf], { type: `image/${ext}` }), `${it.name}.${ext}`);
    r = await fetch(`${API}/guilds/${cfg.guild}/stickers`, { method: "POST", headers: h, body: fd });
  }
  const j = await r.json().catch(() => ({}));
  if (r.status === 429) return { wait: Math.ceil((Number(j?.retry_after) || 60) * 1000) + 500 };
  if (!r.ok) {
    const msg = String(j?.message || `HTTP ${r.status}`);
    if (/maximum number/i.test(msg)) return { skip: msg, full: true };
    return { fail: msg };
  }
  if (it.kind === "sticker") slots.sticker--;
  else if (animated) slots.animated--;
  else slots.static--;
  return { ok: true };
}

export async function runShelf() {
  if (st.running || !st.queue.length || !(cfg.bot && cfg.guild)) return;
  st.running = true;
  try {
    let slots = null;
    let n = 0;
    while (st.queue.length) {
      const wait = st.nextAt - Date.now();
      if (wait > 0) await sleep(Math.min(wait, 60 * 60 * 1000));
      if (!slots || n % 25 === 0) {
        const s = await cfg.shelf();
        slots = { static: s.emojiLimit - s.staticUsed, animated: s.emojiLimit - s.animatedUsed, sticker: s.stickerLimit - s.stickersUsed };
      }
      n++;
      const it = st.queue[0];
      let res;
      try {
        res = await uploadOne(it, slots);
      } catch (e) {
        res = { fail: String(e?.message || e).slice(0, 160) };
      }
      if (res.wait) {
        st.nextAt = Date.now() + res.wait;
        st.lastError = `Discord rate limit, resuming in ${Math.round(res.wait / 60000)} min`;
        save();
        continue;
      }
      st.queue.shift();
      if (res.ok) note(it, "added", true);
      else if (res.skip) note(it, res.skip, null);
      else note(it, res.fail, false);
      if (res.full) slots[it.kind === "sticker" ? "sticker" : /\.gif/i.test(it.url) ? "animated" : "static"] = 0;
      st.lastError = res.fail || "";
      st.nextAt = Date.now() + GAP_MS;
      save();
    }
  } finally {
    st.running = false;
    save();
  }
}
