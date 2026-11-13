// brandlaw.mjs: what the desks may never change, checked in code.
//
// The agents run the three sites: they rewrite copy, restructure sections,
// add pages, fix what leaks visitors. What they do not get to touch is the
// brand itself and the things only the owner decides. A prompt asking them to
// behave is not a guardrail; this is. Every site edit passes through here
// twice: once when it is filed (so a bad one never reaches the owner) and
// again at the moment of writing (so nothing slips through on a stale read).
//
// The law, in order:
//   1. Owner-only files      legal pages, the design system, money, sign-in,
//                            deploy and server config
//   2. The look              no colour outside the house palette, no new
//                            typeface, the crown mark stays
//   3. The names             BlackCrown, Korvus, LodeStone, Crown, Eclipse-X,
//                            spelled exactly
//   4. The prices            only the owner's price list, never a new number
//   5. Honest claims         no invented numbers or reviews, no promised
//                            profits, no trade signals, never "unlimited",
//                            and Crown is never sold on "AI that forgets you"
//   6. The frame             header, footer, tracking, canonical and index
//                            status stay; no outside scripts or embeds; no
//                            gutting a page in one edit
//
// brandLaw() returns null when an edit is lawful, or one plain sentence
// saying which law it broke, written for the desk that has to fix it.

const PALETTE = [
  "ff2d95", "ff6fb6", "ffe3f1", "c81e73", // house pink and its shades
  "8b5cff", "7a3cff", "b15bff",           // violet
  "49d7ff",                               // LodeStone cyan
  "e8c77f",                               // gold
  "35e08f", "ff5a5a", "ff6b6b",           // up and down
];
const FONTS = [
  "space grotesk", "manrope", "jetbrains mono", "dejavu sans",
  "system-ui", "-apple-system", "blinkmacsystemfont", "segoe ui", "roboto", "helvetica neue", "helvetica", "arial",
  "ui-monospace", "sf mono", "sfmono-regular", "menlo", "consolas", "monaco", "courier new",
  "sans-serif", "serif", "monospace", "inherit", "initial", "unset",
];
// the owner's price list; anything else needs him
const PRICES = (process.env.BRAND_PRICES || "0,4.99,9.99,19.99,49.99,79.99,100,149").split(",").map((s) => Number(s.trim()));
const CROWN_MARK = "M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z";

const OWNER_FILES = {
  site: [
    /^(terms|privacy|disclaimer)\.html$/i,
    /^assets\/(site\.css|site\.js|space\.js|art\.js|crown3d\.js|bc3d\.js)$/i,
    /^blackcrown-bar\.html$/i,
    /^robots\.txt$/i,
  ],
  korvus: [
    /^korvus_(legal|login|signup|forgot|reset|account|upgrade|admin)\.html$/i,
    /^admin\.html$/i,
    /^blackcrown-bar\.html$/i,
  ],
  crown: [
    /^(admin|acceptable-use)\.html$/i,
    /^blackcrown-bar\.html$/i,
  ],
  any: [
    /(^|\/)\.env/i,
    /(stripe|billing|payment|checkout|webhook|auth|password|secret|credential|token)/i,
    /(^|\/)(deploy|\.github)\//i,
    /(gunicorn|requirements\.txt|package(-lock)?\.json|\.service|\.conf|\.sh|\.ya?ml)$/i,
    /(terms|privacy|disclaimer)[^/]*\.html$/i,
  ],
};
const ALLOW_CODE = /^(1|true|yes|on)$/i.test(String(process.env.BRAND_ALLOW_CODE || "").trim());
const EXTRA = (process.env.BRAND_PROTECTED || "").split(",").map((s) => s.trim()).filter(Boolean);

const count = (s, re) => (String(s).match(re) || []).length;
// a claim only counts when the page asserts it: "no trade signals" and "never
// unlimited" are the brand saying the opposite, and those stay legal
const NEGATED = /\b(no|not|never|without|nor|neither|isn'?t|aren'?t|don'?t|doesn'?t|won'?t|cannot|can'?t|zero|instead of|rather than)\b[^.!?]{0,48}$/i;
function asserted(text, re) {
  const hits = [];
  for (const m of String(text).matchAll(re)) {
    if (!NEGATED.test(String(text).slice(Math.max(0, m.index - 60), m.index))) hits.push(m[0]);
  }
  return hits;
}

function hexes(text) {
  const out = new Set();
  for (const m of String(text).matchAll(/#([0-9a-f]{3,8})\b/gi)) {
    let h = m[1].toLowerCase();
    if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split("").map((c) => c + c).join("");
    else if (h.length === 6 || h.length === 8) h = h.slice(0, 6);
    else continue;
    out.add(h);
  }
  for (const m of String(text).matchAll(/rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/gi)) {
    const v = [m[1], m[2], m[3]].map((n) => Math.min(255, +n).toString(16).padStart(2, "0")).join("");
    out.add(v);
  }
  return out;
}
const rgb = (h) => [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
function onBrand(h) {
  const [r, g, b] = rgb(h);
  const hi = Math.max(r, g, b), lo = Math.min(r, g, b);
  if (hi - lo <= 28) return true;          // black, white and every grey
  if (hi <= 72) return true;               // the near-black panels, any tint
  if (lo >= 200) return true;              // the near-white tints
  return PALETTE.some((p) => {
    const [pr, pg, pb] = rgb(p);
    return Math.hypot(r - pr, g - pg, b - pb) <= 62; // a shade of a house colour
  });
}
function fonts(text) {
  const out = new Set();
  for (const m of String(text).matchAll(/font-family\s*:\s*([^;}<>]+)/gi)) {
    for (const f of m[1].split(/["']\s*$/)[0].split(",")) {
      const n = f.replace(/!important/i, "").replace(/['"]/g, "").trim().toLowerCase();
      if (n && !/^var\(/.test(n)) out.add(n);
    }
  }
  for (const m of String(text).matchAll(/fonts\.googleapis\.com\/css2?\?([^"'\s>]+)/gi)) {
    for (const f of m[1].matchAll(/family=([^:&]+)/gi)) out.add(decodeURIComponent(f[1]).replace(/\+/g, " ").trim().toLowerCase());
  }
  return out;
}
function dollars(text) {
  const out = new Set();
  for (const m of String(text).matchAll(/\$\s?(\d[\d,]*(?:\.\d{1,2})?)/g)) out.add(Number(m[1].replace(/,/g, "")));
  return out;
}
const visible = (html) => String(html).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, " ").replace(/\s+/g, " ").trim();
const block = (html, re) => (String(html).match(re) || [""])[0];

// claims that may never be added to a page; [pattern, what to tell the desk]
const CLAIMS = [
  [/forgets?\s+(you|everything|your)|ai that forgets|never forgets|remembers everything|no memory of you/gi,
    "Crown is never sold on memory or forgetting; its case is ownership (never sold, never trained on)"],
  [/\bunlimited\b/gi, "nothing here is unlimited; say what the plan actually includes"],
  [/guaranteed?\s+(profits?|returns?|wins?|income|results?)|risk[- ]free|can'?t lose|get rich|sure thing|100%\s+(win|accura)/gi,
    "no promised outcomes; this house sells information, not results"],
  [/\b(buy|sell|trade|trading|entry|exit)\s+signals?\b|signal service|copy[- ]trad/gi,
    "we do not sell signals; the standard is information, never signals"],
  [/\b\d[\d,.]*\s?[kKmM]?\+?\s+(traders|users|members|customers|subscribers|clients|investors)\b|trusted by\s+\d|rated\s+\d(\.\d)?\s*(\/|out of)\s*5|[★⭐]{3,}/gi,
    "no customer counts, ratings or star reviews unless the owner supplies real ones"],
  [/\b(as seen (on|in)|featured (on|in)|award[- ]winning|#1\b|number one|best[- ]in[- ]class|industry[- ]leading)\b/gi,
    "no borrowed authority or superlatives we cannot prove"],
];
// misspellings of the house names; [wrong, right]
const NAMES = [
  [/\bBlack Crown\b/g, "BlackCrown"],
  [/\bLode Stone\b|\bLodestone\b(?![.\w/-])/g, "LodeStone"],
  [/\bEclipse X\b|\bEclipseX\b/g, "Eclipse-X"],
  [/\bCorvus\b|\bKorvous\b|\bKorvis\b/g, "Korvus"],
];

export function ownerOnly(repo, file) {
  const f = String(file || "");
  const lists = [...(OWNER_FILES[repo] || []), ...OWNER_FILES.any];
  if (lists.some((re) => re.test(f))) return true;
  return EXTRA.some((x) => x === f || x === `${repo}:${f}`);
}

// repo: "site" | "korvus" | "crown"; before is "" for a new file
export function brandLaw({ repo = "site", file = "", before = "", after = "", reference = "" }) {
  const f = String(file);
  const ext = ((f.match(/\.([a-z0-9]+)$/i) || [])[1] || "").toLowerCase();
  const creating = !before;

  // 1. owner-only files
  if (ownerOnly(repo, f)) {
    return `${f} is owner-only (legal text, the design system, money, sign-in and server config are his alone). Find the result you want in a page you may edit, or ask him`;
  }
  // code is behaviour, and behaviour is the owner's: a desk that wants the
  // product to work differently asks him. BRAND_ALLOW_CODE=1 lifts this.
  if (!ALLOW_CODE && ["js", "mjs", "cjs", "ts", "tsx", "jsx", "py", "sh"].includes(ext)) {
    return `${f} is code. The desks own words, structure and pages; how the product behaves is the owner's. Describe the change you want and ask him`;
  }
  if (!["html", "htm", "css", "js", "mjs", "jsx", "tsx", "md", "txt", "xml", "json", "py"].includes(ext)) return null;
  const known = `${before}\n${reference}`;
  const isMarkup = ["html", "htm", "css"].includes(ext);

  // 2. the look
  if (isMarkup) {
    const had = hexes(known);
    for (const h of hexes(after)) {
      if (!had.has(h) && !onBrand(h)) return `#${h} is not a house colour. Use the palette already on the page (pink #FF2D95, cyan #49D7FF for LodeStone, gold #E8C77F, violet #8B5CFF, and the blacks, whites and greys)`;
    }
    const hadFonts = fonts(known);
    for (const n of fonts(after)) {
      if (!hadFonts.has(n) && !FONTS.includes(n)) return `"${n}" is not a house typeface. The brand is Space Grotesk for headings, Manrope for text, JetBrains Mono for data`;
    }
  }
  if (["html", "htm"].includes(ext) && before.includes(CROWN_MARK) && !after.includes(CROWN_MARK)) {
    return "the edit removes the crown mark; the logo stays exactly as it is";
  }

  // 3. the names
  for (const [re, right] of NAMES) {
    if (count(after, re) > count(before, re)) return `a house name is misspelled; it is written ${right}`;
  }

  // 4. the prices
  if (ext !== "py" && ext !== "json") {
    const hadPrices = dollars(before);
    const landing = repo === "korvus" && /landing/i.test(f);
    for (const d of dollars(after)) {
      if (hadPrices.has(d)) continue;
      if (landing) return `the Korvus landing page takes its prices from Stripe; never write a dollar amount into it ($${d})`;
      if (!PRICES.includes(d)) return `$${d} is not on the owner's price list. Prices are his alone; use an existing price or leave the number out`;
    }
  }

  // 5. honest claims
  if (ext !== "py" && ext !== "json") {
    const a = ["html", "htm"].includes(ext) ? visible(after) : after;
    const b = ["html", "htm"].includes(ext) ? visible(before) : before;
    for (const [re, why] of CLAIMS) {
      const now = asserted(a, re);
      if (now.length > asserted(b, re).length) {
        return `"${String(now[now.length - 1]).trim().slice(0, 40)}": ${why}`;
      }
    }
  }

  // 6. the frame
  if (["html", "htm"].includes(ext)) {
    if (!creating) {
      for (const [name, re] of [["site header", /<header class="site-head"[\s\S]*?<\/header>/i], ["site footer", /<footer class="site-foot"[\s\S]*?<\/footer>/i]]) {
        const was = block(before, re);
        if (was && block(after, re) !== was) return `the edit changes the ${name}; the header and footer are the same on every page and stay as they are`;
      }
      if (/data-track=/.test(before) && !/data-track=/.test(after)) return "the edit removes the page's visit tracking";
      if (/rel=["']canonical["']/i.test(before) && !/rel=["']canonical["']/i.test(after)) return "the edit removes the canonical link";
      const vb = visible(before).length, va = visible(after).length;
      if (vb > 1500 && va < vb * 0.6) return `the edit removes ${Math.round((1 - va / vb) * 100)} percent of the page's text in one go; change one section at a time`;
    }
    if (count(after, /noindex/gi) > count(before, /noindex/gi)) return "the edit hides the page from search engines (noindex)";
    const scripts = (s) => (String(s).match(/<script\b[^>]*>/gi) || []).filter((t) => !/application\/ld\+json/i.test(t));
    const outside = (t) => /src\s*=\s*["']\s*(https?:)?\/\//i.test(t) && !/src\s*=\s*["']\s*https?:\/\/(www\.)?(blackcrownvxj\.com|korvus\.industries|blackcrown-intelligence\.com)\//i.test(t);
    const hadScripts = scripts(before);
    for (const t of scripts(after)) {
      if (outside(t) && !hadScripts.includes(t)) return "the edit loads a script from another website; only our own scripts and structured data (JSON-LD) may be added";
    }
    if (!creating && scripts(after).length > hadScripts.length) return "the edit adds a script to the page; copy and structured data (JSON-LD) are yours, behaviour is not";
    if (!creating && !ALLOW_CODE) {
      const code = (s) => [...String(s).matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter((m) => !/application\/ld\+json/i.test(m[1])).map((m) => m[2].trim()).join("\n@@\n");
      if (code(before) !== code(after)) return "the edit changes the page's script; copy, structure and structured data are yours, behaviour is the owner's";
    }
    if (count(after, /<iframe\b/gi) > count(before, /<iframe\b/gi)) return "the edit embeds another site in the page (iframe)";
    if (count(after, /<form\b[^>]*action\s*=\s*["']\s*(https?:)?\/\//gi) > count(before, /<form\b[^>]*action\s*=\s*["']\s*(https?:)?\/\//gi)) {
      return "the edit adds a form that sends visitors' details to another website";
    }
  }
  return null;
}

// one paragraph the desks carry in their orders, so they know the law before they file
export const BRAND_LAW_TEXT = `THE BRAND LAW, enforced in code, an edit that breaks it never reaches the owner: (1) OWNER-ONLY FILES: terms, privacy and disclaimer pages, the design system files (assets/site.css and the site scripts), blackcrown-bar.html, robots.txt, the sign-in, account and admin pages, and anything that handles money, deploys or server config; code files and page scripts are the owner's too, describe a behaviour change and ask him. (2) THE LOOK: no colour outside the palette already on the page (pink #FF2D95, LodeStone cyan #49D7FF, gold #E8C77F, violet #8B5CFF, blacks, whites, greys), no new typeface, the crown mark untouched. (3) THE NAMES, spelled exactly: BlackCrown, Korvus, LodeStone, Crown, Eclipse-X. (4) PRICES are the owner's: restate an existing price or leave the number out, and never write a dollar amount into the Korvus landing page. (5) HONEST CLAIMS: no invented customer counts, ratings or testimonials, no promised profits, no signals, never "unlimited", no superlatives we cannot prove, and Crown is sold on ownership (never sold, never trained on), never on memory or forgetting. (6) THE FRAME: the header and footer, visit tracking, canonical link and search visibility stay; no scripts or embeds from other sites; change one section at a time, never gut a page. Inside that law the sites are yours: rewrite any headline, lead, section, call to action, title, description or internal link, reorder sections, add structured data, and build new pages.`;
