// Vault reads for the desks. Every desk writes notes (Corvid's Page-Frame,
// Bard's shot drafts, Steward's hero checks), but "read" only opened site
// files, so a desk could never read a note back and filed "tool gap" cards
// instead. A read whose target ends in .md now opens the note from the vaults.
import fs from "fs";
import path from "path";

const DESKS = ["corvid", "regent", "herald", "steward", "bard"];
let roots = {};

// roots: { corvid: dir, regent: dir, herald: dir, ... }
export function wireVault(r) {
  roots = Object.fromEntries(Object.entries(r || {}).filter(([, d]) => d));
}

const isNote = (page) => /\.md$/i.test(String(page || "").trim()) && !/^(korvus|crown):/i.test(String(page || "").trim());
export { isNote };

function walk(dir, rel = "", out = [], depth = 0) {
  if (depth > 4) return out;
  let list = [];
  try {
    list = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const d of list) {
    if (d.name.startsWith(".")) continue;
    const r = rel ? `${rel}/${d.name}` : d.name;
    if (d.isDirectory()) walk(path.join(dir, d.name), r, out, depth + 1);
    else if (d.name.toLowerCase().endsWith(".md")) out.push(r);
  }
  return out;
}

function inside(root, rel) {
  const full = path.resolve(root, rel);
  return full.startsWith(path.resolve(root) + path.sep) ? full : null;
}

const words = (s) => new Set(String(s).toLowerCase().replace(/\.md$/, "").split(/[^a-z0-9]+/).filter((w) => w.length > 1));
function closest(name, all) {
  const want = words(path.basename(name));
  return all
    .map((n) => {
      const have = words(path.basename(n));
      let hit = 0;
      for (const w of want) if (have.has(w)) hit++;
      return { n, score: hit / Math.max(1, want.size) };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => x.n);
}

// the desk's own newest note names, for its work prompt
export function recentNotes(desk, n = 8) {
  const root = roots[desk];
  if (!root) return [];
  return walk(root)
    .map((r) => {
      let t = 0;
      try {
        t = fs.statSync(path.join(root, r)).mtimeMs;
      } catch {}
      return { r, t };
    })
    .filter((x) => !/^Log\//.test(x.r))
    .sort((a, b) => b.t - a.t)
    .slice(0, n)
    .map((x) => x.r);
}

// name: "Page-Frame.md", "corvid/Page-Frame.md", "bard/Minions/Director/x.md"
export function readNote(name, find = "", who = "") {
  const raw = String(name || "").trim().replace(/^vault:/i, "").replace(/^\/+/, "").replace(/\\/g, "/");
  if (raw.includes("..")) return { err: "refusing that note path" };
  const seg = raw.split("/");
  const tries = [];
  if (DESKS.includes(seg[0].toLowerCase()) && seg.length > 1) tries.push([seg[0].toLowerCase(), seg.slice(1).join("/")]);
  // a bare name: the reader's own vault first, then Corvid's, then the rest
  const order = [who, "corvid", ...DESKS].filter((d, i, a) => d && a.indexOf(d) === i);
  for (const d of order) tries.push([d, raw]);
  for (const [desk, rel] of tries) {
    const root = roots[desk];
    if (!root) continue;
    const full = inside(root, rel);
    if (full && fs.existsSync(full)) return slice(`vault ${desk}/${rel}`, fs.readFileSync(full, "utf8"), find);
  }
  // same file name anywhere in any vault (a desk often drops the folder)
  const base = path.basename(raw).toLowerCase();
  const all = [];
  for (const d of order) {
    const root = roots[d];
    if (!root) continue;
    for (const r of walk(root)) {
      all.push(`${d}/${r}`);
      if (path.basename(r).toLowerCase() === base) return slice(`vault ${d}/${r}`, fs.readFileSync(path.join(root, r), "utf8"), find);
    }
  }
  const near = closest(raw, all);
  return {
    err: `vault note ${raw} does not exist${near.length ? `; nearest notes: ${near.join(", ")}` : ""}. Write it first, or read one of those`,
  };
}

// the whole note, from whichever desk's vault holds it ("" when none does)
export function noteBody(name, who = "") {
  const raw = String(name || "").trim().replace(/^vault:/i, "").replace(/^\/+/, "").replace(/\\/g, "/");
  if (!raw || raw.includes("..")) return "";
  const seg = raw.split("/");
  const tries = [];
  if (DESKS.includes(seg[0].toLowerCase()) && seg.length > 1) tries.push([seg[0].toLowerCase(), seg.slice(1).join("/")]);
  for (const d of [String(who || "").toLowerCase(), "corvid", ...DESKS].filter((d, i, a) => d && a.indexOf(d) === i)) tries.push([d, raw]);
  for (const [desk, rel] of tries) {
    const root = roots[desk];
    if (!root) continue;
    const full = inside(root, rel);
    try {
      if (full && fs.existsSync(full)) {
        const body = fs.readFileSync(full, "utf8");
        if (body.trim()) return body;
      }
    } catch {}
  }
  return "";
}

function slice(page, text, find) {
  let from = 0;
  if (find) {
    const at = text.toLowerCase().indexOf(String(find).toLowerCase());
    if (at >= 0) from = Math.max(0, at - 500);
  }
  const out = text.slice(from, from + 7000);
  return { page, from, text: out, size: text.length, more: from + out.length < text.length };
}
