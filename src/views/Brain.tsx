import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { getBrainGraph, getBrainNote, type BrainGraph, type BrainNote } from "../api";

// The vault as a galaxy, in the house colors. The Institution is a black hole
// with a pink and violet accretion disk, a holographic crown turning above it
// and three ravens (the watchers) circling; the crown seal is etched into the
// floor. Each desk is a star cluster in its own nebula; every note is a star;
// wikilinks are threads with data pulses. Korvus Intel, the crawler, sits out
// on the rim as an outpost with a scanner sweep, pulling streams in from the
// open web. Quality adapts to the viewer's GPU so it stays smooth anywhere.

type Desk = { key: string; name: string; role: string; color: number; css: string; outpost?: boolean };
const DESKS: Desk[] = [
  { key: "corvid", name: "Corvid", role: "growth + SEO", color: 0xff2d95, css: "#ff2d95" },
  { key: "herald", name: "Herald", role: "sales", color: 0x46e6ff, css: "#46e6ff" },
  { key: "steward", name: "Steward", role: "projects", color: 0x35e08f, css: "#35e08f" },
  { key: "bard", name: "Bard", role: "studio", color: 0xb15bff, css: "#b15bff" },
  { key: "regent", name: "Regent", role: "the CEO", color: 0xf2c94c, css: "#f2c94c" },
  { key: "intel", name: "Korvus Intel", role: "the crawler", color: 0xff7a2f, css: "#ff7a2f", outpost: true },
];
const RING = DESKS.filter((d) => !d.outpost);
const DESK = Object.fromEntries(DESKS.map((d) => [d.key, d]));
const CLUSTER_R = 34;
const BH_R = 3.0;
const OUTPOST_R = 54;

// accretion disk: Keplerian shear (inner orbits faster), two-phase flow so the
// pattern never winds itself into noise, temperature gradient, and relativistic
// beaming that brightens the side swinging toward the camera
const DISK_VS = `
uniform vec3 uCam; uniform float uBeam;
varying vec2 vLocal; varying float vBeam;
void main(){
  vLocal = position.xy;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vec3 tang = normalize(mat3(modelMatrix) * vec3(-position.y, position.x, 0.0));
  float b = 1.0 + uBeam * dot(tang, normalize(uCam - wp.xyz));
  vBeam = pow(max(b, 0.12), 2.4);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const DISK_FS = `
uniform float uTime; uniform float uInner; uniform float uOuter; uniform float uGain; uniform sampler2D uTex;
varying vec2 vLocal; varying float vBeam;
vec2 layer(float lt, float ang, float t){
  float spin = lt * (0.16 + 0.8 * (1.0 - t));
  return texture2D(uTex, vec2((ang - spin) * 0.15915494, t)).rg;
}
void main(){
  float r = length(vLocal);
  float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
  float ang = atan(vLocal.y, vLocal.x);
  float P = 40.0;
  float t1 = mod(uTime, P), t2 = mod(uTime + P * 0.5, P);
  float w = abs(t1 / P * 2.0 - 1.0);
  vec2 n2 = layer(t1, ang, t) * (1.0 - w) + layer(t2, ang, t) * w;
  float n = n2.x;
  float bands = 0.72 + 0.28 * sin(r * 8.5 + n * 7.0);
  float dens = pow(n, 1.4) * 1.9 * bands;
  float fall = pow(1.0 - t, 1.6) * smoothstep(0.0, 0.07, t);
  vec3 c0 = vec3(1.0, 0.93, 0.97), c1 = vec3(1.0, 0.2, 0.6), c2 = vec3(0.5, 0.12, 0.85), c3 = vec3(0.14, 0.04, 0.3);
  vec3 col = mix(c0, c1, smoothstep(0.0, 0.24, t));
  col = mix(col, c2, smoothstep(0.24, 0.62, t));
  col = mix(col, c3, smoothstep(0.62, 1.0, t));
  col += vec3(1.0, 0.76, 0.38) * smoothstep(0.66, 0.86, n2.y) * 0.85 * (1.0 - t);
  gl_FragColor = vec4(col * dens * fall * vBeam * uGain, 1.0);
}`;

// stars: soft core plus halo, gentle twinkle, HDR so bloom catches the bright ones
const STAR_VS = `
attribute float size; attribute float phase;
uniform float uTime; uniform float uScale; uniform float uPR; uniform float uAtten;
varying vec3 vColor; varying float vTw;
void main(){
  vColor = color;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vTw = 0.8 + 0.2 * sin(uTime * (0.7 + phase * 1.7) + phase * 31.0);
  float s = uAtten > 0.5 ? size * uScale / max(1.0, -mv.z) : size;
  gl_PointSize = clamp(s, 1.0, 22.0) * uPR;
  gl_Position = projectionMatrix * mv;
}`;
const STAR_FS = `
uniform float uGain; varying vec3 vColor; varying float vTw;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d2 = dot(c, c);
  float a = exp(-d2 * 80.0) + 0.16 * exp(-d2 * 14.0);
  if (a < 0.012) discard;
  gl_FragColor = vec4(vColor * a * uGain * vTw, 1.0);
}`;

// the holographic floor: polar grid with anti-aliased lines and a radar sweep
const GRID_VS = `varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const GRID_FS = `
uniform float uTime; varying vec3 vW;
void main(){
  float TAU = 6.2831853;
  float r = length(vW.xz);
  float rs = r / 12.0;
  float rd = abs(fract(rs - 0.5) - 0.5);
  float rl = 1.0 - smoothstep(0.0, fwidth(rs) * 1.4, rd);
  float a = atan(vW.z, vW.x);
  float sp = a / (TAU / 36.0);
  float sd = abs(fract(sp - 0.5) - 0.5);
  float sl = (1.0 - smoothstep(0.0, fwidth(sp) * 1.4, sd)) * smoothstep(10.0, 26.0, r);
  float ph = fract(a / TAU - uTime * 0.045);
  float sweep = pow(1.0 - ph, 7.0);
  float fade = smoothstep(170.0, 40.0, r) * smoothstep(5.0, 14.0, r);
  float lines = (rl * 0.55 + sl * 0.22) * fade;
  vec3 col = vec3(1.0, 0.18, 0.58) * lines * (0.3 + 0.5 * sweep) + vec3(1.0, 0.76, 0.4) * fade * sweep * (lines * 1.6 + 0.05);
  gl_FragColor = vec4(col * 0.5, 1.0);
}`;

// the lens: chromatic aberration toward the edges, vignette, film grain,
// a whisper of scanlines and a deep-space tint
const LensShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
float rnd(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 d = vUv - 0.5; float r2 = dot(d, d);
  float ca = 0.012 * r2;
  vec3 col;
  col.r = texture2D(tDiffuse, vUv + d * ca).r;
  col.g = texture2D(tDiffuse, vUv).g;
  col.b = texture2D(tDiffuse, vUv - d * ca).b;
  col += vec3(0.012, 0.008, 0.03) * (1.0 - r2 * 2.2);
  col *= 1.0 - r2 * 0.95;
  col += (rnd(vUv * uRes + fract(uTime)) - 0.5) * 0.03;
  col *= 0.975 + 0.025 * sin(vUv.y * uRes.y * 1.3);
  gl_FragColor = vec4(col, 1.0);
}`,
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}
function ago(ms: number) {
  const s = Math.max(0, (Date.now() - ms) / 1000);
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// tiny safe markdown: escape first, then a few structural transforms
function renderMd(md: string) {
  const out: string[] = [];
  let inList = false;
  for (const raw of md.replace(/^---[\s\S]*?\n---\n/, "").split("\n")) {
    let l = esc(raw);
    l = l
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[\[([^\]|#]+)(?:[#|]([^\]]*))?\]\]/g, (_m, t, alias) => `<a class="bx-wl" data-t="${t.trim()}">${alias || t}</a>`);
    const li = /^\s*[-*]\s+(.*)$/.exec(l);
    if (li) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${li[1]}</li>`);
      continue;
    }
    if (inList) { out.push("</ul>"); inList = false; }
    const h = /^(#{1,4})\s+(.*)$/.exec(l);
    if (h) out.push(`<h${Math.min(4, h[1].length + 1)}>${h[2]}</h${Math.min(4, h[1].length + 1)}>`);
    else if (l.trim()) out.push(`<p>${l}</p>`);
  }
  if (inList) out.push("</ul>");
  return out.join("");
}


// soft volumetric cloud texture for nebulae and the galactic dust lane
function cloudTexture(seed: number) {
  const S = 256;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const img = g.createImageData(S, S);
  const h = (x: number, y: number) => {
    const v = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const vn = (x: number, y: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    let fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    const a = h(ix, iy), b = h(ix + 1, iy), cc = h(ix, iy + 1), d = h(ix + 1, iy + 1);
    return a + (b - a) * fx + (cc - a) * fy + (a - b - cc + d) * fx * fy;
  };
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let v = 0, amp = 0.5, f = 3.2;
      for (let o = 0; o < 5; o++) {
        v += amp * vn((x / S) * f, (y / S) * f);
        f *= 2.05;
        amp *= 0.5;
      }
      const dx = x / S - 0.5, dy = y / S - 0.5;
      const fall = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) * 2);
      const a = Math.min(1, Math.max(0, (v - 0.32) * 1.9)) * fall * fall;
      const i = (y * S + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// the accretion flow, baked once: seamless around the orbit (periodic lattice
// in x), streaky along it. R = gas density, G = an independent field for the
// gold flecks. Replaces two 5-octave noise stacks per pixel per frame.
function diskTexture() {
  const W = 1024, Hh = 128;
  const data = new Uint8Array(W * Hh * 4);
  const h = (x: number, y: number, sd: number) => {
    const v = Math.sin(x * 127.1 + y * 311.7 + sd * 74.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const vn = (x: number, y: number, per: number, sd: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    let fx = x - ix, fy = y - iy;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    const x0 = ((ix % per) + per) % per, x1 = (x0 + 1) % per;
    const a = h(x0, iy, sd), b = h(x1, iy, sd), c = h(x0, iy + 1, sd), d = h(x1, iy + 1, sd);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
  const fbm = (u: number, v: number, sd: number) => {
    let s = 0, amp = 0.5, px = 14, py = 7;
    for (let o = 0; o < 5; o++) {
      s += amp * vn(u * px, v * py + o * 3.1, px, sd + o);
      px *= 2;
      py *= 2;
      amp *= 0.5;
    }
    return s;
  };
  for (let y = 0; y < Hh; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / Hh;
      const i = (y * W + x) * 4;
      data[i] = Math.round(Math.min(1, fbm(u, v, 1) * 1.25) * 255);
      data[i + 1] = Math.round(Math.min(1, fbm(u, v * 1.7, 9)) * 255);
      data[i + 3] = 255;
    }
  }
  const t = new THREE.DataTexture(data, W, Hh, THREE.RGBAFormat);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  t.magFilter = t.minFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

// the watchers: a raven in silhouette with a neon edge and a gold eye, two
// wing frames, drawn facing each way (sprite scale cannot mirror)
function ravenTextures() {
  const frame = (up: boolean, left: boolean) => {
    const S = 128;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const g = c.getContext("2d")!;
    g.translate(S / 2, S / 2);
    if (left) g.scale(-1, 1);
    g.lineJoin = "round";
    g.beginPath();
    g.moveTo(-40, 6); // tail
    g.lineTo(-22, 2);
    if (up) {
      g.quadraticCurveTo(-14, -30, -30, -50);
      g.quadraticCurveTo(-2, -36, 6, -6);
      g.quadraticCurveTo(14, -40, 34, -46);
      g.quadraticCurveTo(22, -18, 14, -2);
    } else {
      g.quadraticCurveTo(-18, 26, -34, 40);
      g.quadraticCurveTo(-4, 30, 6, 6);
      g.quadraticCurveTo(16, 30, 30, 36);
      g.quadraticCurveTo(22, 14, 14, -2);
    }
    g.quadraticCurveTo(24, -8, 30, -6); // head
    g.lineTo(44, -3); // beak
    g.lineTo(30, 2);
    g.quadraticCurveTo(10, 12, -22, 10);
    g.lineTo(-40, 6);
    g.closePath();
    g.fillStyle = "#0b0710";
    g.fill();
    g.strokeStyle = "#ff2d95";
    g.lineWidth = 3;
    g.shadowColor = "#ff2d95";
    g.shadowBlur = 8;
    g.stroke();
    g.shadowBlur = 0;
    g.fillStyle = "#ffc857";
    g.beginPath();
    g.arc(29, -5, 2.4, 0, Math.PI * 2);
    g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  return { upR: frame(true, false), dnR: frame(false, false), upL: frame(true, true), dnL: frame(false, true) };
}

type Quality = "auto" | "high" | "eco";
const QKEY = "bx-quality";
function loadQuality(): Quality {
  try {
    const q = localStorage.getItem(QKEY);
    return q === "high" || q === "eco" ? q : "auto";
  } catch {
    return "auto";
  }
}

const STAR_TEMPS: [number, number, number][] = [
  [0.62, 0.74, 1.0],
  [0.85, 0.9, 1.0],
  [1.0, 0.97, 0.9],
  [1.0, 0.84, 0.62],
  [1.0, 0.66, 0.5],
];

export const Brain: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const lockRef = useRef<HTMLDivElement>(null);
  const teleRef = useRef<HTMLDivElement>(null);
  const hoverIdx = useRef(-1);
  const [graph, setGraph] = useState<BrainGraph | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<"galaxy" | "dashboard">("galaxy");
  const [note, setNote] = useState<BrainNote | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState(-1);
  const [boot, setBoot] = useState(true);
  const [quality, setQuality] = useState<Quality>(loadQuality);
  const applyQuality = useRef<(q: Quality) => void>(() => {});
  const pickQuality = (q: Quality) => {
    setQuality(q);
    try {
      localStorage.setItem(QKEY, q);
    } catch {}
    applyQuality.current(q);
  };
  const flyTo = useRef<(i: number) => void>(() => {});
  const focusDesk = useRef<(k: string) => void>(() => {});
  const focusCore = useRef<() => void>(() => {});

  useEffect(() => {
    let live = true;
    const load = () =>
      getBrainGraph().then((g) => {
        if (!live) return;
        if (g) setGraph(g);
        else setFailed(true);
      });
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (!graph) return;
    const t = setTimeout(() => setBoot(false), 2500);
    return () => clearTimeout(t);
  }, [graph]);

  const byTitle = useMemo(() => {
    const m = new Map<string, number>();
    graph?.nodes.forEach((n, i) => {
      if (!m.has(n.t.toLowerCase())) m.set(n.t.toLowerCase(), i);
      m.set(n.id.replace(/\.md$/, "").toLowerCase(), i);
    });
    return m;
  }, [graph]);

  const openNote = async (id: string) => {
    setLoadingNote(true);
    const n = await getBrainNote(id);
    setLoadingNote(false);
    if (n) setNote(n);
    const i = graph?.nodes.findIndex((x) => x.id === id) ?? -1;
    if (i >= 0 && view === "galaxy") flyTo.current(i);
  };
  const openNoteRef = useRef(openNote);
  openNoteRef.current = openNote;

  // the galaxy scene; rebuilt only when the graph itself changes
  useEffect(() => {
    if (!graph || view !== "galaxy" || !mount.current) return;
    const el = mount.current;
    const W = () => el.clientWidth || 800;
    const H = () => el.clientHeight || 600;
    const DPR = window.devicePixelRatio || 1;
    // AUTO starts at 1x and trims render scale down to 0.6x if the GPU
    // struggles; HIGH renders up to 1.5x retina; ECO is 0.7x without bloom
    const startQ = loadQuality();
    const scaleFor = (q: Quality) => (q === "high" ? Math.min(DPR, 1.5) : q === "eco" ? 0.7 : Math.min(DPR, 1));
    let pr = scaleFor(startQ);
    let ceiling = pr;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 2000);
    camera.position.set(0, 150, 300);
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(pr);
    renderer.setSize(W(), H());
    renderer.setClearColor(0x020206, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    el.appendChild(renderer.domElement);

    // no MSAA (the composer clones this target for every pass); FXAA instead
    const rt = new THREE.WebGLRenderTarget(W() * pr, H() * pr, { type: THREE.HalfFloatType });
    const composer = new EffectComposer(renderer, rt);
    composer.setPixelRatio(pr);
    composer.setSize(W(), H());
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.75, 0.18, 0.82);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const fxaa = new ShaderPass(FXAAShader);
    fxaa.uniforms.resolution.value.set(1 / (W() * pr), 1 / (H() * pr));
    composer.addPass(fxaa);
    bloom.enabled = startQ !== "eco";
    const lens = new ShaderPass(LensShader);
    lens.uniforms.uRes.value.set(W() * pr, H() * pr);
    composer.addPass(lens);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 7;
    controls.maxDistance = 260;
    controls.autoRotateSpeed = 0.16;
    controls.maxPolarAngle = Math.PI * 0.62;

    const disposables: { dispose: () => void }[] = [];
    const keep = <T extends { dispose: () => void }>(x: T) => {
      disposables.push(x);
      return x;
    };
    const timeUniforms: { value: number }[] = [];
    const starMat = (atten: boolean, gain: number) => {
      const m = keep(
        new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uScale: { value: H() / 2 }, uPR: { value: pr }, uAtten: { value: atten ? 1 : 0 }, uGain: { value: gain } },
          vertexShader: STAR_VS,
          fragmentShader: STAR_FS,
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      timeUniforms.push(m.uniforms.uTime);
      return m;
    };
    const starMats: THREE.ShaderMaterial[] = [];

    // deep field: temperature-colored stars plus a galactic band
    {
      const N = 3000, BAND = 1800;
      const pos = new Float32Array((N + BAND) * 3);
      const col = new Float32Array((N + BAND) * 3);
      const size = new Float32Array(N + BAND);
      const phase = new Float32Array(N + BAND);
      const tilt = new THREE.Matrix4().makeRotationX(0.45).multiply(new THREE.Matrix4().makeRotationZ(0.3));
      const v = new THREE.Vector3();
      for (let i = 0; i < N + BAND; i++) {
        if (i < N) {
          const r = 520 + Math.random() * 420;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          v.set(r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
        } else {
          const th = Math.random() * Math.PI * 2;
          const spread = (Math.random() + Math.random() + Math.random() - 1.5) * 60;
          v.set(Math.cos(th) * 600, spread, Math.sin(th) * 600).applyMatrix4(tilt);
        }
        pos.set([v.x, v.y, v.z], i * 3);
        const tc = STAR_TEMPS[Math.floor(Math.random() * STAR_TEMPS.length)];
        const b = i < N ? 0.25 + Math.pow(Math.random(), 3) * 1.4 : 0.18 + Math.random() * 0.45;
        col.set([tc[0] * b, tc[1] * b, tc[2] * b], i * 3);
        size[i] = i < N ? 1.4 + Math.pow(Math.random(), 4) * 4.2 : 1.1 + Math.random() * 1.4;
        phase[i] = Math.random();
      }
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.BufferAttribute(col, 3));
      g.setAttribute("size", new THREE.BufferAttribute(size, 1));
      g.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
      const m = starMat(false, 1.0);
      starMats.push(m);
      scene.add(new THREE.Points(g, m));
    }

    // the holographic floor, with the crown seal etched into it
    const gridMat = keep(
      new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: GRID_VS, fragmentShader: GRID_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    timeUniforms.push(gridMat.uniforms.uTime);
    const grid = new THREE.Mesh(keep(new THREE.PlaneGeometry(360, 360)), gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -17;
    scene.add(grid);

    // the black hole: event horizon, Doppler-beamed disk, lensed halo, photon ring
    const core = new THREE.Group();
    scene.add(core);
    core.add(new THREE.Mesh(keep(new THREE.SphereGeometry(BH_R, 64, 64)), keep(new THREE.MeshBasicMaterial({ color: 0x000000 }))));
    const flowTex = keep(diskTexture());
    const diskUniforms = (inner: number, outer: number, gain: number, beam: number) => ({
      uTex: { value: flowTex },
      uTime: { value: 0 },
      uInner: { value: inner },
      uOuter: { value: outer },
      uGain: { value: gain },
      uBeam: { value: beam },
      uCam: { value: camera.position },
    });
    const diskMat = keep(
      new THREE.ShaderMaterial({
        uniforms: diskUniforms(BH_R * 1.85, BH_R * 5.2, 0.95, 0.72),
        vertexShader: DISK_VS,
        fragmentShader: DISK_FS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );
    timeUniforms.push(diskMat.uniforms.uTime);
    const disk = new THREE.Mesh(keep(new THREE.RingGeometry(BH_R * 1.85, BH_R * 5.2, 256, 6)), diskMat);
    disk.rotation.x = -Math.PI / 2 + 0.16;
    core.add(disk);
    const haloMat = keep(
      new THREE.ShaderMaterial({
        uniforms: diskUniforms(BH_R * 1.12, BH_R * 1.9, 0.42, 0.0),
        vertexShader: DISK_VS,
        fragmentShader: DISK_FS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );
    timeUniforms.push(haloMat.uniforms.uTime);
    const halo = new THREE.Mesh(keep(new THREE.RingGeometry(BH_R * 1.12, BH_R * 1.9, 192, 4)), haloMat);
    core.add(halo);
    const photonMat = keep(new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    photonMat.color.setRGB(1.9, 1.35, 1.6);
    const photon = new THREE.Mesh(keep(new THREE.RingGeometry(BH_R * 1.02, BH_R * 1.07, 160)), photonMat);
    core.add(photon);

    // the crown: a hologram turning above the singularity
    const crown = new THREE.Group();
    crown.position.y = BH_R + 4.2;
    scene.add(crown);
    const crownMat = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
    crownMat.color.setRGB(2.6, 0.5, 1.5);
    {
      const R = 3.6, PK = 5, seg: number[] = [];
      const at = (a: number, r: number, y: number) => [Math.cos(a) * r, y, Math.sin(a) * r];
      const ring = (r: number, y: number) => {
        for (let i = 0; i < 48; i++) seg.push(...at((i / 48) * Math.PI * 2, r, y), ...at(((i + 1) / 48) * Math.PI * 2, r, y));
      };
      ring(R, 0);
      ring(R * 1.05, -0.55);
      ring(R * 1.0, 0.42);
      for (let j = 0; j < PK * 2; j++) {
        const a0 = (j / (PK * 2)) * Math.PI * 2, a1 = ((j + 1) / (PK * 2)) * Math.PI * 2;
        const y0 = j % 2 ? 1.15 : 2.9, y1 = (j + 1) % 2 ? 1.15 : 2.9;
        seg.push(...at(a0, R * (j % 2 ? 1 : 1.05), y0), ...at(a1, R * ((j + 1) % 2 ? 1 : 1.05), y1));
        seg.push(...at(a0, R * (j % 2 ? 1 : 1.05), y0), ...at(a0, R, 0.42));
      }
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
      crown.add(new THREE.LineSegments(g, crownMat));
      const glass = keep(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      glass.color.setRGB(1.0, 0.2, 0.6);
      const band = new THREE.Mesh(keep(new THREE.CylinderGeometry(R, R * 1.05, 0.97, 48, 1, true)), glass);
      band.position.y = -0.065;
      crown.add(band);
    }
    const jewelMat = (() => {
      const m = keep(
        new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uScale: { value: H() / 2 }, uPR: { value: pr }, uAtten: { value: 1 }, uGain: { value: 1 } },
          vertexShader: STAR_VS,
          fragmentShader: STAR_FS,
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      timeUniforms.push(m.uniforms.uTime);
      return m;
    })();
    {
      const jp: number[] = [], jc: number[] = [], js: number[] = [], jph: number[] = [];
      for (let j = 0; j < 5; j++) {
        const a = (j / 5) * Math.PI * 2;
        jp.push(Math.cos(a) * 3.78, 2.9, Math.sin(a) * 3.78);
        jp.push(Math.cos(a + Math.PI / 5) * 3.6, 0.2, Math.sin(a + Math.PI / 5) * 3.6);
        jc.push(2.2, 1.6, 0.6, 1.9, 0.4, 1.2);
        js.push(3.2, 2.2);
        jph.push(j / 5, j / 5 + 0.5);
      }
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(jp, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(jc, 3));
      g.setAttribute("size", new THREE.Float32BufferAttribute(js, 1));
      g.setAttribute("phase", new THREE.Float32BufferAttribute(jph, 1));
      crown.add(new THREE.Points(g, jewelMat));
    }

    // the seal on the floor: the house crown mark inside a ring of ticks
    const sealRing = new THREE.Group();
    {
      const sealMat = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
      sealMat.color.setRGB(1.0, 0.74, 0.38);
      const FY = -16.9, SC = 2.0;
      const mark: [number, number][] = [[4, 24], [4, 9], [12, 16], [18, 5], [24, 16], [32, 9], [32, 24], [4, 24]];
      const seg: number[] = [];
      const P3 = (x: number, y: number) => [(x - 18) * SC, FY, (y - 16.5) * SC];
      for (let i = 0; i < mark.length - 1; i++) seg.push(...P3(...mark[i]), ...P3(...mark[i + 1]));
      seg.push(...P3(8, 28), ...P3(28, 28));
      // an inner stroke so the mark still reads at a low angle
      const IN = 0.93;
      const P3i = (x: number, y: number) => [(x - 18) * SC * IN, FY, (y - 16.5) * SC * IN];
      for (let i = 0; i < mark.length - 1; i++) seg.push(...P3i(...mark[i]), ...P3i(...mark[i + 1]));
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
      scene.add(new THREE.LineSegments(g, sealMat));
      const rs: number[] = [];
      const circ = (r: number) => {
        for (let i = 0; i < 128; i++) {
          const a0 = (i / 128) * Math.PI * 2, a1 = ((i + 1) / 128) * Math.PI * 2;
          rs.push(Math.cos(a0) * r, FY, Math.sin(a0) * r, Math.cos(a1) * r, FY, Math.sin(a1) * r);
        }
      };
      circ(30);
      circ(31.4);
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2, r2 = i % 6 ? 32.4 : 33.6;
        rs.push(Math.cos(a) * 31.4, FY, Math.sin(a) * 31.4, Math.cos(a) * r2, FY, Math.sin(a) * r2);
      }
      const rg = keep(new THREE.BufferGeometry());
      rg.setAttribute("position", new THREE.Float32BufferAttribute(rs, 3));
      const ringMat = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
      ringMat.color.setRGB(1.0, 0.3, 0.7);
      sealRing.add(new THREE.LineSegments(rg, ringMat));
      scene.add(sealRing);
    }

    // the watchers: three ravens on slow orbits around the core
    const rav = ravenTextures();
    Object.values(rav).forEach((t) => keep(t));
    const watchers = [
      { r: 11, y: 4, w: 0.18, ph: 0.0 },
      { r: 15, y: 7.5, w: -0.13, ph: 2.1 },
      { r: 19.5, y: 2.5, w: 0.1, ph: 4.2 },
    ].map((o) => {
      const m = keep(new THREE.SpriteMaterial({ map: rav.upR, transparent: true, depthWrite: false, alphaTest: 0.04 }));
      m.color.setRGB(1.7, 1.7, 1.7);
      const sp = new THREE.Sprite(m);
      sp.scale.set(3.6, 3.6, 1);
      scene.add(sp);
      return { ...o, sp, m, left: false, up: true };
    });

    // desk cluster centers on a ring around the core
    const centers: Record<string, THREE.Vector3> = {};
    RING.forEach((d, i) => {
      const a = (i / RING.length) * Math.PI * 2 + 0.4;
      centers[d.key] = new THREE.Vector3(Math.cos(a) * CLUSTER_R, (hash(d.key) - 0.5) * 6, Math.sin(a) * CLUSTER_R);
    });
    // the crawler works out on the rim, between two desks, facing the open web
    const OA = 0.4 + (Math.PI * 2 * 3.5) / RING.length;
    const intelC = new THREE.Vector3(Math.cos(OA) * OUTPOST_R, 8, Math.sin(OA) * OUTPOST_R);
    centers.intel = intelC;
    const ember = new THREE.Color(DESK.intel.color);

    // the outpost: a scanner sweep, a range ring and a beacon
    const scanner = new THREE.Group();
    scanner.position.copy(intelC).add(new THREE.Vector3(0, -2.5, 0));
    scene.add(scanner);
    const sweep = new THREE.Group();
    scanner.add(sweep);
    [0.1, 0.05, 0.022].forEach((op, k) => {
      const m = keep(new THREE.MeshBasicMaterial({ color: ember, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      const sec = new THREE.Mesh(keep(new THREE.RingGeometry(2.5, 14, 24, 1, -k * 0.22, 0.22)), m);
      sec.rotation.x = -Math.PI / 2;
      sweep.add(sec);
    });
    {
      const m = keep(new THREE.MeshBasicMaterial({ color: ember, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      const rr = new THREE.Mesh(keep(new THREE.RingGeometry(13.85, 14.1, 96)), m);
      rr.rotation.x = -Math.PI / 2;
      scanner.add(rr);
    }
    const beaconMat = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
    beaconMat.color.copy(ember).multiplyScalar(2.2);
    scanner.add(new THREE.Line(keep(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 13, 0)])), beaconMat));

    // nebulae: layered clouds in each desk's color
    const neb = [keep(cloudTexture(1)), keep(cloudTexture(2))];
    const nebSprites: THREE.Sprite[] = [];
    DESKS.forEach((d) => {
      const n = graph.stats.perDesk[d.key] || 0;
      const base = 12 + Math.min(30, Math.sqrt(n) * 0.95);
      for (let k = 0; k < 2; k++) {
        const sp = new THREE.Sprite(
          keep(new THREE.SpriteMaterial({ map: neb[k], color: d.color, transparent: true, opacity: 0.045 + k * 0.015, blending: THREE.AdditiveBlending, depthWrite: false }))
        );
        const s = base * (1.25 - k * 0.22);
        sp.scale.set(s, s * (0.75 + hash(d.key + k) * 0.4), 1);
        sp.position.copy(centers[d.key]).add(new THREE.Vector3((hash(d.key + "x" + k) - 0.5) * 6, (hash(d.key + "y" + k) - 0.5) * 3, (hash(d.key + "z" + k) - 0.5) * 6));
        sp.material.rotation = hash(d.key + "r" + k) * Math.PI;
        scene.add(sp);
        nebSprites.push(sp);
      }
    });

    // note stars
    const N = graph.nodes.length;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const size = new Float32Array(N);
    const phase = new Float32Array(N);
    const nowS = Date.now() / 1000;
    const perDeskIndex: Record<string, number> = {};
    const c = new THREE.Color();
    graph.nodes.forEach((n, i) => {
      const center = centers[n.d] || new THREE.Vector3();
      const k = (perDeskIndex[n.d] = (perDeskIndex[n.d] || 0) + 1);
      const subOff = n.s ? new THREE.Vector3((hash(n.s) - 0.5) * 9, (hash(n.s + "y") - 0.5) * 3, (hash(n.s + "z") - 0.5) * 9) : new THREE.Vector3();
      const r = 0.6 + Math.sqrt(k) * 0.42 * (1 + hash(n.id) * 0.35);
      const th = k * 2.39996 + hash(n.id + "a") * 0.6;
      const y = (hash(n.id + "b") - 0.5) * (2 + r * 0.25);
      pos.set([center.x + subOff.x + Math.cos(th) * r, center.y + subOff.y + y, center.z + subOff.z + Math.sin(th) * r], i * 3);
      const ageDays = (nowS - n.m) / 86400;
      const fresh = ageDays < 1 ? 1.35 : Math.max(0.42, 1.0 - ageDays / 30);
      c.setHex(DESK[n.d]?.color ?? 0xffffff).multiplyScalar(fresh);
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = 0.9 + Math.min(3.2, n.g * 0.4) + (ageDays < 1 ? 0.4 : 0);
      phase[i] = hash(n.id + "p");
    });
    const noteGeo = keep(new THREE.BufferGeometry());
    noteGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    noteGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    noteGeo.setAttribute("size", new THREE.BufferAttribute(size, 1));
    noteGeo.setAttribute("phase", new THREE.BufferAttribute(phase, 1));
    const noteMat = starMat(true, 1.0);
    starMats.push(noteMat);
    const stars = new THREE.Points(noteGeo, noteMat);
    scene.add(stars);

    // link threads
    const E = graph.edges.slice(0, 3500);
    {
      const lp = new Float32Array(E.length * 6);
      const lc = new Float32Array(E.length * 6);
      E.forEach(([a, b], i) => {
        lp.set([pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2], pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]], i * 6);
        lc.set([col[a * 3], col[a * 3 + 1], col[a * 3 + 2], col[b * 3], col[b * 3 + 1], col[b * 3 + 2]], i * 6);
      });
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.BufferAttribute(lp, 3));
      g.setAttribute("color", new THREE.BufferAttribute(lc, 3));
      scene.add(new THREE.LineSegments(g, keep(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }))));
    }

    // curved tethers from each desk down into the core
    const bez = (a: THREE.Vector3, ctrl: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) => {
      const u = 1 - t;
      return out.set(u * u * a.x + 2 * u * t * ctrl.x + t * t * b.x, u * u * a.y + 2 * u * t * ctrl.y + t * t * b.y, u * u * a.z + 2 * u * t * ctrl.z + t * t * b.z);
    };
    const ORIGIN = new THREE.Vector3();
    const tetherCtrl: Record<string, THREE.Vector3> = {};
    DESKS.forEach((d) => {
      const ctrl = centers[d.key].clone().multiplyScalar(0.5).add(new THREE.Vector3(0, 9, 0));
      tetherCtrl[d.key] = ctrl;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 40; i++) pts.push(bez(centers[d.key], ctrl, ORIGIN, i / 40, new THREE.Vector3()));
      const g = keep(new THREE.BufferGeometry().setFromPoints(pts));
      scene.add(new THREE.Line(g, keep(new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false }))));
    });

    // data pulses: knowledge flowing along links and down into the Institution
    const P = 150;
    const pPos = new Float32Array(P * 3);
    const pCol = new Float32Array(P * 3);
    const pSize = new Float32Array(P).fill(1.8);
    const pPhase = new Float32Array(P).map(() => Math.random());
    type Pulse = { a: THREE.Vector3; ctrl: THREE.Vector3; b: THREE.Vector3; t: number; sp: number; color: THREE.Color };
    const pulses: Pulse[] = [];
    const spawn = (p?: Pulse): Pulse => {
      const q = p || ({ a: new THREE.Vector3(), ctrl: new THREE.Vector3(), b: new THREE.Vector3(), t: 0, sp: 0, color: new THREE.Color() } as Pulse);
      const roll = Math.random();
      if (roll < 0.16) {
        // crawl ingress: streams from the open web landing on the outpost
        const dir = intelC.clone().normalize().add(new THREE.Vector3(Math.random() - 0.5, (Math.random() - 0.3) * 0.7, Math.random() - 0.5).multiplyScalar(1.3)).normalize();
        q.a.copy(intelC).addScaledVector(dir, 110 + Math.random() * 90);
        q.b.copy(intelC).add(new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 3));
        q.ctrl.copy(q.a).add(q.b).multiplyScalar(0.5).add(new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 30));
        q.color.copy(ember).lerp(new THREE.Color(1, 0.95, 0.85), 0.25);
        q.sp = 0.22 + Math.random() * 0.2;
      } else if (E.length && roll < 0.66) {
        const [ia, ib] = E[Math.floor(Math.random() * E.length)];
        q.a.set(pos[ia * 3], pos[ia * 3 + 1], pos[ia * 3 + 2]);
        q.b.set(pos[ib * 3], pos[ib * 3 + 1], pos[ib * 3 + 2]);
        q.ctrl.copy(q.a).add(q.b).multiplyScalar(0.5);
        q.ctrl.y += q.a.distanceTo(q.b) * 0.18;
        q.color.setHex(DESK[graph.nodes[ia].d]?.color ?? 0xffffff);
        q.sp = 0.25 + Math.random() * 0.35;
      } else {
        const d = DESKS[Math.floor(Math.random() * DESKS.length)];
        if (!centers[d.key]) return spawn(q);
        q.a.copy(centers[d.key]).add(new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 4));
        q.ctrl.copy(tetherCtrl[d.key]);
        q.b.set(0, 0, 0);
        q.color.setHex(d.color);
        q.sp = 0.12 + Math.random() * 0.12;
      }
      q.t = p ? 0 : Math.random();
      return q;
    };
    for (let i = 0; i < P; i++) pulses.push(spawn());
    const pGeo = keep(new THREE.BufferGeometry());
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    pGeo.setAttribute("size", new THREE.BufferAttribute(pSize, 1));
    pGeo.setAttribute("phase", new THREE.BufferAttribute(pPhase, 1));
    const pMat = starMat(true, 1.0);
    starMats.push(pMat);
    scene.add(new THREE.Points(pGeo, pMat));

    // target lock: four arcs that spin around the selected star
    const lock = new THREE.Group();
    const lockMat = keep(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    lockMat.color.setRGB(2.2, 2.2, 2.4);
    for (let i = 0; i < 4; i++) {
      lock.add(new THREE.Mesh(keep(new THREE.RingGeometry(1.5, 1.62, 24, 1, (i * Math.PI) / 2 + 0.25, Math.PI / 2 - 0.5)), lockMat));
    }
    scene.add(lock);

    // camera flights, idle auto-orbit
    let flight: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; t: number; sp: number } | null = null;
    let idleSince = performance.now();
    const fly = (target: THREE.Vector3, dist: number, sp = 0.9, fromDir?: THREE.Vector3) => {
      const dir = (fromDir || camera.position.clone().sub(controls.target)).clone().normalize();
      flight = { from: camera.position.clone(), to: target.clone().add(dir.multiplyScalar(dist)), tFrom: controls.target.clone(), tTo: target.clone(), t: 0, sp };
      controls.autoRotate = false;
      idleSince = performance.now();
    };
    controls.addEventListener("start", () => {
      flight = null;
      controls.autoRotate = false;
      idleSince = Number.POSITIVE_INFINITY;
    });
    controls.addEventListener("end", () => {
      idleSince = performance.now();
    });
    flyTo.current = (i: number) => {
      const p = new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      lock.position.copy(p);
      lockMat.opacity = 1;
      fly(p, 13);
    };
    focusDesk.current = (k: string) => {
      if (centers[k]) fly(centers[k], 32);
    };
    focusCore.current = () => fly(new THREE.Vector3(), 20);
    // cinematic arrival
    fly(new THREE.Vector3(), 104, 0.42, new THREE.Vector3(0, 0.42, 1));

    // picking
    const ray = new THREE.Raycaster();
    ray.params.Points = { threshold: 0.7 };
    const mouse = new THREE.Vector2();
    const pick = (ev: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObject(stars)[0];
      return hit ? hit.index ?? -1 : -1;
    };
    let downAt = { x: 0, y: 0 };
    const onDown = (ev: PointerEvent) => {
      downAt = { x: ev.clientX, y: ev.clientY };
    };
    const onUp = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 5) return;
      const i = pick(ev);
      if (i >= 0) openNoteRef.current(graph.nodes[i].id);
    };
    let lastMove = 0;
    const onMove = (ev: PointerEvent) => {
      const now = performance.now();
      if (now - lastMove < 50) return;
      lastMove = now;
      const i = pick(ev);
      if (i !== hoverIdx.current) {
        hoverIdx.current = i;
        setHover(i);
      }
      renderer.domElement.style.cursor = i >= 0 ? "pointer" : "grab";
    };
    const onLeave = () => {
      hoverIdx.current = -1;
      setHover(-1);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const resize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(pr);
      renderer.setSize(W(), H());
      composer.setPixelRatio(pr);
      composer.setSize(W(), H());
      fxaa.uniforms.resolution.value.set(1 / (W() * pr), 1 / (H() * pr));
      lens.uniforms.uRes.value.set(W() * pr, H() * pr);
      for (const m of [...starMats, jewelMat]) {
        m.uniforms.uScale.value = H() / 2;
        m.uniforms.uPR.value = pr;
      }
    };
    window.addEventListener("resize", resize);
    let curQ = startQ;
    let slowFor = 0, fastFor = 0;
    applyQuality.current = (q: Quality) => {
      curQ = q;
      pr = ceiling = scaleFor(q);
      bloom.enabled = q !== "eco";
      slowFor = fastFor = 0;
      resize();
    };
    // nothing renders while the map is scrolled out of view or the tab is hidden
    let onScreen = true;
    const io = new IntersectionObserver((ents) => {
      onScreen = ents[0]?.isIntersecting ?? true;
    });
    io.observe(el);

    // holographic desk tags with leader lines, projected each frame
    const labelEls: Record<string, HTMLDivElement> = {};
    if (labelsRef.current) {
      labelsRef.current.innerHTML = "";
      const mk = (key: string, name: string, sub: string, css: string, onClick: () => void) => {
        const div = document.createElement("div");
        div.className = key === "__core" ? "bx-tag bx-tag-down" : key === "intel" ? "bx-tag bx-tag-out" : "bx-tag";
        div.style.setProperty("--c", css);
        div.innerHTML = `<div class="bx-tag-box"><b>${name}</b><span>${sub}</span></div><div class="bx-tag-line"></div><div class="bx-tag-dot"></div>`;
        div.onclick = onClick;
        labelsRef.current!.appendChild(div);
        labelEls[key] = div;
      };
      DESKS.forEach((d) => mk(d.key, d.name.toUpperCase(), `${d.role} &middot; ${(graph.stats.perDesk[d.key] || 0).toLocaleString()} nodes`, d.css, () => focusDesk.current(d.key)));
      mk("__core", "THE INSTITUTION", "the crown's law", "#ffc857", () => {
        if (graph.stats.core) openNoteRef.current(graph.stats.core);
        focusCore.current();
      });
    }

    let raf = 0;
    let last = performance.now();
    const t0 = last;
    let ema = 16, warm = 0, teleAt = 0;
    const v = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const tmp = new THREE.Vector3();
    const labCache: Record<string, { d: string; tf: string; op: string }> = {};
    const setLab = (k: string, d: string, tf: string, op: string) => {
      const c = labCache[k] || (labCache[k] = { d: "", tf: "", op: "" });
      const st = labelEls[k].style;
      if (c.d !== d) st.display = c.d = d;
      if (d === "none") return;
      if (c.tf !== tf) st.transform = c.tf = tf;
      if (c.op !== op) st.opacity = c.op = op;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      if (!onScreen || document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;
      for (const u of timeUniforms) u.value = t;
      lens.uniforms.uTime.value = t;

      halo.lookAt(camera.position);
      photon.lookAt(camera.position);
      lock.lookAt(camera.position);
      lock.rotateZ(t * 0.9);
      if (lockMat.opacity > 0) lock.scale.setScalar(1 + Math.sin(t * 3.2) * 0.08);
      nebSprites.forEach((s, i) => {
        s.material.rotation += dt * (i % 2 ? 0.006 : -0.004);
      });
      crown.rotation.y = t * 0.22;
      crown.position.y = BH_R + 4.2 + Math.sin(t * 0.8) * 0.3;
      crownMat.opacity = 0.8 + 0.12 * Math.sin(t * 2.3) + (Math.sin(t * 17.0) > 0.985 ? -0.35 : 0);
      sealRing.rotation.y = -t * 0.02;
      sweep.rotation.y = -t * 1.1;
      beaconMat.opacity = 0.35 + 0.55 * Math.pow(0.5 + 0.5 * Math.sin(t * 3.4), 6);
      for (const wch of watchers) {
        const a = wch.ph + t * wch.w;
        wch.sp.position.set(Math.cos(a) * wch.r, wch.y + Math.sin(t * 0.7 + wch.ph) * 0.8, Math.sin(a) * wch.r);
        // face the direction of travel on screen
        v.copy(wch.sp.position).project(camera);
        v2.set(Math.cos(a + 0.05 * Math.sign(wch.w)) * wch.r, wch.sp.position.y, Math.sin(a + 0.05 * Math.sign(wch.w)) * wch.r).project(camera);
        const left = v2.x < v.x;
        const up = Math.sin(t * 7.5 + wch.ph * 3) > 0;
        if (left !== wch.left || up !== wch.up) {
          wch.left = left;
          wch.up = up;
          wch.m.map = left ? (up ? rav.upL : rav.dnL) : up ? rav.upR : rav.dnR;
        }
      }

      // pulses
      for (let i = 0; i < P; i++) {
        const q = pulses[i];
        q.t += dt * q.sp;
        if (q.t >= 1) spawn(q);
        bez(q.a, q.ctrl, q.b, q.t, tmp);
        pPos[i * 3] = tmp.x;
        pPos[i * 3 + 1] = tmp.y;
        pPos[i * 3 + 2] = tmp.z;
        const f = Math.sin(Math.PI * q.t) * 2.2;
        pCol[i * 3] = q.color.r * f;
        pCol[i * 3 + 1] = q.color.g * f;
        pCol[i * 3 + 2] = q.color.b * f;
      }
      pGeo.attributes.position.needsUpdate = true;
      pGeo.attributes.color.needsUpdate = true;

      if (flight) {
        flight.t = Math.min(1, flight.t + dt * flight.sp);
        const e = 1 - Math.pow(1 - flight.t, 3);
        camera.position.lerpVectors(flight.from, flight.to, e);
        controls.target.lerpVectors(flight.tFrom, flight.tTo, e);
        if (flight.t >= 1) {
          flight = null;
          idleSince = now;
        }
      } else if (now - idleSince > 14000) {
        controls.autoRotate = true;
      }
      controls.update();
      composer.render(dt);

      // AUTO: trim render scale while frames run long, give it back while they
      // run clean, never returning to a scale that was already too slow
      ema = ema * 0.94 + dt * 1000 * 0.06;
      warm += dt;
      if (curQ === "auto" && warm > 2.5) {
        slowFor = ema > 24 ? slowFor + dt : 0;
        fastFor = ema < 18.5 ? fastFor + dt : 0;
        if (slowFor > 1.5) {
          slowFor = 0;
          if (pr > 0.65) {
            ceiling = pr - 0.05;
            pr = Math.max(0.6, pr - 0.1);
            resize();
          } else if (bloom.enabled && ema > 30) {
            bloom.enabled = false;
          }
        } else if (fastFor > 5) {
          fastFor = 0;
          if (pr + 0.1 <= ceiling) {
            pr += 0.1;
            resize();
          }
        }
      }

      const w = W(), h = H();
      const anchors: Record<string, [number, number]> = {};
      for (const k in labelEls) {
        v.copy(k === "__core" ? ORIGIN : centers[k]);
        v.project(camera);
        const vis = v.z < 1 && Math.abs(v.x) < 1.2 && Math.abs(v.y) < 1.2;
        const sx = Math.round(((v.x + 1) / 2) * w), sy = Math.round(((1 - v.y) / 2) * h);
        anchors[k] = [sx, sy];
        if (k !== "__core") setLab(k, vis ? "flex" : "none", `translate(${sx}px,${sy}px) translate(-50%,-100%)`, "1");
        else labelEls[k].dataset.vis = vis ? "1" : "";
      }
      // the core tag steps back whenever a desk tag crowds it
      if (labelEls.__core && anchors.__core) {
        const [cx, cy] = anchors.__core;
        let crowded = false;
        for (const k in anchors) {
          if (k === "__core") continue;
          const [x, y] = anchors[k];
          if (Math.abs(x - cx) < 130 && y - cy > -10 && y - cy < 150) crowded = true;
        }
        const [sx, sy] = anchors.__core;
        setLab("__core", labelEls.__core.dataset.vis ? "flex" : "none", `translate(${sx}px,${sy}px) translate(-50%,0%)`, crowded ? "0.12" : "1");
      }
      const hi = hoverIdx.current;
      if (lockRef.current) {
        if (hi >= 0) {
          v.set(pos[hi * 3], pos[hi * 3 + 1], pos[hi * 3 + 2]).project(camera);
          lockRef.current.style.display = v.z < 1 ? "block" : "none";
          lockRef.current.style.transform = `translate(${((v.x + 1) / 2) * w}px,${((1 - v.y) / 2) * h}px)`;
        } else {
          lockRef.current.style.display = "none";
        }
      }
      if (teleRef.current && now - teleAt > 250) {
        teleAt = now;
        const range = camera.position.distanceTo(controls.target);
        const az = ((THREE.MathUtils.radToDeg(controls.getAzimuthalAngle()) + 360) % 360).toFixed(0).padStart(3, "0");
        const el2 = (THREE.MathUtils.radToDeg(Math.PI / 2 - controls.getPolarAngle())).toFixed(0);
        teleRef.current.innerHTML = `<span>RNG <b>${range.toFixed(1)}</b></span><span>AZ <b>${az}&deg;</b></span><span>EL <b>${el2}&deg;</b></span><span>FPS <b>${Math.round(1000 / ema)}</b></span><span>RES <b>${pr.toFixed(1)}x</b></span><span>${bloom.enabled ? "HDR" : "PERF"}</span>`;
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      applyQuality.current = () => {};
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
      bloom.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      if (labelsRef.current) labelsRef.current.innerHTML = "";
    };
  }, [graph, view]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!graph || q.length < 2) return [];
    return graph.nodes.filter((n) => n.t.toLowerCase().includes(q)).slice(0, 12);
  }, [query, graph]);

  const onReaderClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest(".bx-wl") as HTMLElement | null;
    if (!a || !graph) return;
    const i = byTitle.get(String(a.dataset.t || "").toLowerCase());
    if (i !== undefined) openNote(graph.nodes[i].id);
  };

  const s = graph?.stats;
  const maxDay = Math.max(1, ...(s?.days || [1]));
  const maxDesk = Math.max(1, ...Object.values(s?.perDesk || { a: 1 }));
  const maxDeg = Math.max(1, ...(s?.connected.map((c) => c.deg) || [1]));
  const hn = graph && hover >= 0 ? graph.nodes[hover] : null;
  const synced = graph ? new Date(graph.builtAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York" }) : "";
  const spark = (vals: number[]) => {
    const mx = Math.max(1, ...vals);
    return vals.map((x, i) => `${(i / (vals.length - 1)) * 100},${30 - (x / mx) * 26}`).join(" ");
  };
  const noteDesk = note ? DESK[note.id.split("/")[0]] : null;

  return (
    <div className="bx">
      <div className="bx-top">
        <div>
          <div className="eyebrow">The Brain</div>
          <h1 className="bx-h1">The mind of the company</h1>
        </div>
        <div className="bx-top-r">
          {graph ? (
            <span className="bx-live">
              <i /> LIVE <em>synced {synced} ET</em>
            </span>
          ) : null}
          <div className="bx-pills">
            <button className={view === "galaxy" ? "on" : ""} onClick={() => setView("galaxy")}>
              Galaxy
            </button>
            <button className={view === "dashboard" ? "on" : ""} onClick={() => setView("dashboard")}>
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {!graph ? (
        <div className="bx-empty">
          <div className="bx-boot-in">
            <div className="bx-boot-t">NEURAL MAP</div>
            <div className="bx-boot-l">{failed ? "vault link ............ FAILED. Check the brain sync." : "vault link ............ reading"}</div>
            {!failed ? (
              <div className="bx-boot-bar">
                <i />
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="bx-body">
          {view === "galaxy" ? (
            <div className="bx-stage" key="galaxy">
              <div ref={mount} className="bx-canvas" />
              <div ref={labelsRef} className="bx-labels" />
              <div ref={lockRef} className="bx-lock">
                <i />
                <i />
                <i />
                <i />
                {hn ? (
                  <div className="bx-lock-info" style={{ ["--c" as string]: DESK[hn.d]?.css }}>
                    <em>NODE LOCK // {DESK[hn.d]?.name.toUpperCase()}</em>
                    <b>{hn.t}</b>
                    <span>
                      {hn.g} link{hn.g === 1 ? "" : "s"} &middot; {ago(hn.m * 1000)}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="bx-frame">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="bx-hud bx-tl">
                <div className="bx-hud-t">
                  <svg className="bx-crown" viewBox="0 0 36 32" aria-hidden="true"><path d="M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z" /><path d="M8 28 L28 28" /></svg>
                  BLACKCROWN <span>// NEURAL MAP</span> <em>LIVE</em>
                </div>
                <div className="bx-hud-row">
                  <span>
                    NODES <b>{s!.notes.toLocaleString()}</b>
                  </span>
                  <span>
                    LINKS <b>{s!.links.toLocaleString()}</b>
                  </span>
                  <span>
                    TODAY <b>{s!.updatedToday}</b>
                  </span>
                </div>
              </div>
              <div className="bx-legend">
                {DESKS.map((d) => (
                  <button key={d.key} onClick={() => focusDesk.current(d.key)} style={{ ["--c" as string]: d.css }}>
                    <i />
                    {d.name}
                    <b>{(s!.perDesk[d.key] || 0).toLocaleString()}</b>
                  </button>
                ))}
                <button onClick={() => focusCore.current()} style={{ ["--c" as string]: "#ffc857" }}>
                  <i />
                  Institution
                  <b>core</b>
                </button>
              </div>
              <div ref={teleRef} className="bx-hud bx-tele" />
              <div className="bx-qual" role="group" aria-label="Render quality">
                {(["auto", "high", "eco"] as Quality[]).map((q) => (
                  <button key={q} className={quality === q ? "on" : ""} onClick={() => pickQuality(q)} title={q === "auto" ? "Adapts to your GPU" : q === "high" ? "Full resolution, full glow" : "Lightest load, no glow"}>
                    {q}
                  </button>
                ))}
              </div>
              <div className="bx-hint">Drag to orbit &middot; scroll to zoom &middot; click a desk to fly &middot; click a star to read</div>
              <div className="bx-ticker">
                <span className="bx-ticker-k">ACTIVITY</span>
                <div className="bx-ticker-win">
                  <div className="bx-ticker-track">
                    {[0, 1].map((rep) =>
                      s!.recent.map((r) => (
                        <button key={`${rep}-${r.id}`} onClick={() => openNote(r.id)}>
                          <i style={{ background: DESK[r.desk]?.css }} />
                          {DESK[r.desk]?.name.toUpperCase()} <em>{r.title}</em> {ago(r.mtime)}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
              {boot ? (
                <div className="bx-boot">
                  <div className="bx-boot-in">
                    <div className="bx-boot-t">
                      <svg className="bx-crown" viewBox="0 0 36 32" aria-hidden="true"><path d="M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z" /><path d="M8 28 L28 28" /></svg>
                      BLACKCROWN
                    </div>
                    <div className="bx-boot-l" style={{ animationDelay: "0.1s" }}>vault link ............ ok</div>
                    <div className="bx-boot-l" style={{ animationDelay: "0.35s" }}>nodes ................. {s!.notes.toLocaleString()}</div>
                    <div className="bx-boot-l" style={{ animationDelay: "0.6s" }}>links ................. {s!.links.toLocaleString()}</div>
                    <div className="bx-boot-l" style={{ animationDelay: "0.85s" }}>crawler feed .......... {(s!.perDesk.intel || 0).toLocaleString()} nodes</div>
                    <div className="bx-boot-l" style={{ animationDelay: "1.1s" }}>crown link ............ sealed</div>
                    <div className="bx-boot-l" style={{ animationDelay: "1.35s" }}>watchers .............. aloft</div>
                    <div className="bx-boot-m" style={{ animationDelay: "1.6s" }}>Claim your crown.</div>
                    <div className="bx-boot-bar">
                      <i />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="bx-dash" key="dashboard">
              <div className="bx-cards">
                {[
                  { k: "Notes", v: s!.notes, sub: "five desks and the crawler", c: "#ff2d95", spark: null as number[] | null },
                  { k: "Crawler feed", v: s!.perDesk.intel || 0, sub: "Korvus Intel notes in the vault", c: "#ff7a2f", spark: null },
                  { k: "Touched today", v: s!.updatedToday, sub: "14 day activity", c: "#35e08f", spark: s!.days },
                  { k: "Links", v: s!.links, sub: `wikilinks between notes, ${s!.lessons} healer lessons`, c: "#ffc857", spark: null },
                ].map((cd) => (
                  <div className="bx-card" key={cd.k} style={{ ["--c" as string]: cd.c }}>
                    <div className="bx-card-k">{cd.k}</div>
                    <div className="bx-card-v">{cd.v.toLocaleString()}</div>
                    {cd.spark ? (
                      <svg className="bx-spark" viewBox="0 0 100 32" preserveAspectRatio="none">
                        <polyline points={spark(cd.spark)} />
                      </svg>
                    ) : null}
                    <div className="bx-card-s">{cd.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bx-grid">
                <div className="bx-panel bx-wide">
                  <div className="bx-panel-h">Vault activity // last 14 days</div>
                  <div className="bx-bars">
                    {s!.days.map((d, i) => (
                      <div key={i} className="bx-bar" title={`${d} notes`}>
                        <i style={{ height: `${(d / maxDay) * 100}%` }} />
                        <span>{i === 13 ? "today" : i % 3 === 1 ? `-${13 - i}d` : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bx-panel">
                  <div className="bx-panel-h">Nodes by desk</div>
                  {DESKS.map((d) => (
                    <div className="bx-row" key={d.key} style={{ ["--c" as string]: d.css }}>
                      <span className="bx-row-k">{d.name}</span>
                      <span className="bx-row-bar">
                        <i style={{ width: `${((s!.perDesk[d.key] || 0) / maxDesk) * 100}%` }} />
                      </span>
                      <span className="bx-row-v">{(s!.perDesk[d.key] || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="bx-panel">
                  <div className="bx-panel-h">Most connected nodes</div>
                  {s!.connected.map((cn) => (
                    <button className="bx-row bx-link" key={cn.id} onClick={() => openNote(cn.id)} style={{ ["--c" as string]: DESK[cn.desk]?.css }}>
                      <span className="bx-row-k">{cn.title}</span>
                      <span className="bx-row-bar">
                        <i style={{ width: `${(cn.deg / maxDeg) * 100}%` }} />
                      </span>
                      <span className="bx-row-v">{cn.deg}</span>
                    </button>
                  ))}
                </div>
                <div className="bx-panel bx-wide">
                  <div className="bx-panel-h">Recent activity</div>
                  {s!.recent.map((r) => (
                    <button className="bx-act" key={r.id} onClick={() => openNote(r.id)}>
                      <i style={{ background: DESK[r.desk]?.css }} />
                      <span className="bx-act-t">{r.title}</span>
                      <span className="bx-act-d">{DESK[r.desk]?.name}</span>
                      <span className="bx-act-a">{ago(r.mtime)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <aside className="bx-reader">
            <div className="bx-search">
              <span className="bx-prompt">&gt;</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="query the vault" spellCheck={false} />
              {matches.length ? (
                <div className="bx-results">
                  {matches.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setQuery("");
                        openNote(m.id);
                      }}
                    >
                      <i style={{ background: DESK[m.d]?.css }} />
                      {m.t}
                      <span>{DESK[m.d]?.name}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {note ? (
              <div className="bx-note" key={note.id} style={{ ["--c" as string]: noteDesk?.css || "#ff2d95" }}>
                <div className="bx-note-bar">
                  <span>NODE INSPECTOR</span>
                  <button className="bx-x" onClick={() => setNote(null)} aria-label="Close">
                    &times;
                  </button>
                </div>
                <span className="bx-tag-chip">{noteDesk?.name || "Vault"}</span>
                <h2>{note.title}</h2>
                <div className="bx-note-meta">
                  <span>{note.id}</span>
                  <span>updated {ago(note.mtime)}</span>
                </div>
                <div className="bx-md" onClick={onReaderClick} dangerouslySetInnerHTML={{ __html: renderMd(note.text) }} />
                {note.truncated ? <div className="bx-note-meta">Long note, showing the first 80 KB.</div> : null}
              </div>
            ) : (
              <div className="bx-note-empty">
                <div className="bx-radar">
                  <i />
                </div>
                <b>{loadingNote ? "ACQUIRING..." : "AWAITING TARGET"}</b>
                <span>Select a star, a desk, or query the vault to read what the agents wrote.</span>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};
