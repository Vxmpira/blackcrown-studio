import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

// The Grid: a night city on a real street plan. Every tower face is drawn
// window by window in the shader (lit floors, blinds, the odd light switching
// on or off), the roads are wet asphalt that mirrors the skyline, traffic runs
// the avenues, lamps pool light on the sidewalks, and an eclipse hangs behind
// the skyline. Each landmark tower is trimmed in its desk color and reacts to
// real state: a paused agent's tower goes dark, a down site flashes red, a
// handoff on the wire lights the receiving tower. Hover to highlight, click a
// tower or its tag to fly in. Rendered in HDR with bloom; render scale adapts
// to the GPU and nothing draws while the city is off screen.

export type CityData = {
  trafficPackets: number;
  clicksActive: boolean;
  goldActive: boolean;
  status: { site: boolean | null; korvus: boolean | null; crown: boolean | null };
  worldSub: string;
  stripeSub: string;
  regentSub: string;
  heraldSub?: string;
  stewardSub?: string;
  bardSub?: string;
  // optional extras: any district's sub line, and how awake its tower is (0 to 1)
  subs?: Record<string, string>;
  power?: Record<string, number>;
  wire?: { t: number; from: string; to: string }[];
};

type Shape = "classic" | "stepped" | "slab" | "terminal";
type District = { key: string; label: string; gx: number; gz: number; h: number; big?: boolean; shape: Shape };

// street plan: blocks sit on a 7 unit pitch, roads run between them
const P = 7;
const RW = 1.0; // half the road width
const SWK = 0.45; // sidewalk
const BX = 6; // blocks out from center on x
const BZ = 5; // and on z

const DISTRICTS: District[] = [
  { key: "world", label: "THE WORLD", gx: -4, gz: 1, h: 4.4, shape: "terminal" },
  { key: "site", label: "BLACKCROWNVXJ.COM", gx: 0, gz: 0, h: 10.6, big: true, shape: "stepped" },
  { key: "korvus", label: "KORVUS", gx: 3, gz: -2, h: 7.6, shape: "classic" },
  { key: "crown", label: "CROWN", gx: 3, gz: 0, h: 7.9, shape: "stepped" },
  { key: "eclipse", label: "ECLIPSE-X", gx: 3, gz: 2, h: 6.2, shape: "slab" },
  { key: "stripe", label: "STRIPE", gx: -2, gz: 3, h: 5.6, shape: "classic" },
  { key: "corvid", label: "CORVID", gx: -2, gz: -1, h: 7.1, shape: "stepped" },
  { key: "herald", label: "HERALD", gx: -4, gz: -1, h: 6.6, shape: "classic" },
  { key: "steward", label: "STEWARD", gx: -2, gz: -3, h: 7.3, shape: "slab" },
  { key: "bard", label: "BARD", gx: -4, gz: -3, h: 6.8, shape: "stepped" },
  { key: "regent", label: "REGENT", gx: 0, gz: -3, h: 8.4, shape: "classic" },
  { key: "you", label: "YOU", gx: 2, gz: -4, h: 10.9, big: true, shape: "stepped" },
];

const COLORS = {
  pink: 0xff2d95,
  cyan: 0x46e6ff,
  gold: 0xf2c94c,
  up: 0x35e08f,
  down: 0xff5a5a,
};

// each district's trim color: the agents wear their desk colors
const ACCENT: Record<string, number> = {
  world: COLORS.cyan,
  site: COLORS.pink,
  korvus: COLORS.pink,
  crown: COLORS.pink,
  eclipse: COLORS.pink,
  stripe: COLORS.gold,
  corvid: COLORS.pink,
  herald: COLORS.cyan,
  steward: COLORS.up,
  bard: 0xb15bff,
  regent: COLORS.gold,
  you: 0xffffff,
};

const HASH = `
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
`;

// tower faces: unit boxes scaled per building, windows laid out in world units
// so every building gets whole columns and floors whatever its size
const FACADE_VS = `
#ifdef USE_INSTANCING
attribute float aSeed;
#endif
uniform float uSeed;
varying vec3 vLocal; varying vec3 vN; varying vec3 vScale; varying float vSeed; varying float vDepth; varying vec3 vWorld; varying vec4 vStyle;
${HASH}
void main(){
  mat4 mm = modelMatrix;
  #ifdef USE_INSTANCING
    mm = modelMatrix * instanceMatrix;
    vSeed = aSeed;
  #else
    vSeed = uSeed;
  #endif
  // per-building look, worked out once per vertex instead of once per pixel:
  // window width, window height, how many windows are lit, warm stone or not
  float sd = floor(vSeed + 0.5);
  vStyle = vec4(mix(0.6, 0.92, h21(vec2(sd, 3.0))), mix(0.46, 0.7, h21(vec2(sd, 9.0))), mix(0.24, 0.56, h21(vec2(sd, 1.0))), step(0.6, h21(vec2(sd, 5.0))));
  vScale = vec3(length(mm[0].xyz), length(mm[1].xyz), length(mm[2].xyz));
  vLocal = position;
  vN = normal;
  vec4 wp = mm * vec4(position, 1.0);
  vWorld = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const FACADE_FS = `
uniform float uTime; uniform vec3 uAccent; uniform float uTrim; uniform float uPower; uniform float uHover;
uniform float uPulse; uniform float uAlert; uniform float uMirror; uniform vec3 uFogColor; uniform float uFogDensity; uniform vec3 uMoonDir;
varying vec3 vLocal; varying vec3 vN; varying vec3 vScale; varying float vSeed; varying float vDepth; varying vec3 vWorld; varying vec4 vStyle;
${HASH}
void main(){
  vec3 n = normalize(vN);
  float sd = floor(vSeed + 0.5);
  float hgt = (vLocal.y + 0.5) * vScale.y;
  float atGround = step(abs(vWorld.y) - hgt, 0.4);
  vec3 col; vec3 emis = vec3(0.0);
  float awake = clamp(uPower, 0.0, 1.0);
  float trim = uTrim * (0.3 + 0.7 * awake) * (1.0 + uHover * 0.9 + uPulse * 1.2);
  #ifdef MIRROR
  if (abs(n.y) > 0.5) { gl_FragColor = vec4(uFogColor * 0.25, 1.0); return; }
  #endif
  if (abs(n.y) > 0.5) {
    // roof: slab, parapet, the odd plant unit, and a lit rim on landmark towers
    vec2 edge = (0.5 - abs(vLocal.xz)) * vScale.xz;
    float e = min(edge.x, edge.y);
    float parapet = 1.0 - smoothstep(0.07, 0.11, e);
    col = mix(vec3(0.016, 0.016, 0.022), vec3(0.05, 0.05, 0.062), parapet);
    vec2 rc = floor(vLocal.xz * vScale.xz * 1.7) + sd;
    float unit = step(0.8, h21(rc)) * step(0.32, e);
    col = mix(col, vec3(0.04, 0.04, 0.05), unit);
    emis += uAccent * trim * parapet * 1.1;
  } else {
    bool xf = abs(n.x) > 0.5;
    float width = xf ? vScale.z : vScale.x;
    float along = (xf ? vLocal.z : vLocal.x) + 0.5;
    float faceId = n.x > 0.5 ? 1.0 : n.x < -0.5 ? 2.0 : n.z > 0.5 ? 3.0 : 4.0;
    float ncol = max(1.0, floor(width / 0.33));
    float nrow = max(1.0, floor(vScale.y / 0.37));
    vec2 uv = vec2(along * ncol, (vLocal.y + 0.5) * nrow);
    vec2 cell = floor(uv), f = fract(uv);
    vec2 aa = fwidth(uv) * 1.1;
    // street level is storefront glass: taller panes, mostly lit, some in neon
    float shop = atGround * step(cell.y, 0.5);
    float wx = mix(vStyle.x, 0.9, shop);
    float wy = mix(vStyle.y, 0.74, shop);
    float x0 = 0.5 * (1.0 - wx), y0 = mix(0.2, 0.08, shop);
    float mx = smoothstep(x0 - aa.x, x0 + aa.x, f.x) * (1.0 - smoothstep(1.0 - x0 - aa.x, 1.0 - x0 + aa.x, f.x));
    float my = smoothstep(y0 - aa.y, y0 + aa.y, f.y) * (1.0 - smoothstep(y0 + wy - aa.y, y0 + wy + aa.y, f.y));
    float win = mx * my;
    vec2 id = cell + vec2(faceId * 37.0 + sd, sd * 3.0);
    float r1 = h21(id), r2 = fract(r1 * 17.31 + 0.123), r3 = fract(r1 * 91.73 + 0.71);
    // some floors work late, some are dark; a paused tower is mostly asleep
    float floorLit = h21(vec2(cell.y + faceId * 61.0, sd));
    float litP = vStyle.z * mix(0.55, 1.6, step(0.72, floorLit));
    litP = mix(litP, 0.72, shop);
    litP = mix(litP * 0.07, litP, awake) + uPulse * 0.8;
    float lit = step(1.0 - litP, r1);
    // a few windows change their mind every half minute or so
    float sw = step(0.94, r3) * step(0.5, fract(uTime * 0.03 * (0.5 + r2) + r1 * 10.0));
    lit = mix(lit, 1.0 - lit, sw * step(0.3, awake));
    vec3 wc = r2 < 0.45 ? vec3(1.0, 0.76, 0.48) : r2 < 0.8 ? vec3(0.95, 0.92, 1.0) : vec3(0.6, 0.8, 1.0);
    wc = mix(wc, vec3(1.0, 0.18, 0.58), step(0.95, r3));
    wc = mix(wc, vec3(0.27, 0.9, 1.0), step(0.985, r2));
    wc = mix(wc, r3 < 0.4 ? vec3(1.0, 0.2, 0.6) : r3 < 0.62 ? vec3(0.3, 0.9, 1.0) : vec3(1.0, 0.8, 0.52), shop);
    wc = mix(wc, vec3(1.0, 0.1, 0.08), uAlert * (0.55 + 0.45 * sin(uTime * 5.0)));
    float inten = mix(mix(0.4, 1.3, r3 * r3), 1.25, shop);
    // inside the window: light falls off toward the sill, blinds split the pane
    float up01 = clamp((f.y - y0) / wy, 0.0, 1.0);
    float interior = mix(0.5, 1.0, up01) * (0.78 + 0.22 * step(0.5, fract(f.x * 3.0 + r1)));
    interior *= 1.0 - 0.55 * step(0.6, r2) * step(up01, 0.35 + 0.4 * r1);
    vec3 glass = mix(vec3(0.006, 0.007, 0.014), vec3(0.028, 0.018, 0.05), clamp(hgt / 12.0, 0.0, 1.0));
    vec3 wall = vec3(0.011, 0.011, 0.016) * (0.75 + 0.5 * fract(r1 * 7.7 + floor(f.x * 3.0) * 0.37 + floor(f.y * 3.0) * 0.61));
    wall = mix(wall, vec3(0.02, 0.016, 0.014), vStyle.w * 0.6);
    float ndl = max(dot(n, uMoonDir), 0.0);
    wall *= 1.0 + ndl * 1.6;
    glass += vec3(0.022, 0.014, 0.034) * ndl;
    wall += vec3(0.045, 0.026, 0.014) * exp(-hgt * 1.1);
    wall += uAccent * uTrim * 0.05 * (uHover + uPulse);
    col = mix(wall, glass, win);
    vec3 detailed = wc * inten * interior * win * lit * 1.15;
    vec3 mean = mix(vec3(1.0, 0.82, 0.62), wc, 0.35) * litP * wx * wy * 0.55;
    float fine = 1.0 - smoothstep(0.4, 1.0, max(aa.x, aa.y));
    emis += mix(mean, detailed, fine);
    // LED trim: corner strips and a band at the top of each tier
    float de = (0.5 - abs(along - 0.5)) * width;
    float strip = 1.0 - smoothstep(0.035, 0.07, de);
    float band = 1.0 - smoothstep(0.05, 0.1, vScale.y - hgt);
    emis += uAccent * trim * (strip + band) * 1.3;
  }
  if (uMirror > 0.5) {
    // the reflection in the wet street: lights only, fading with height
    col = uFogColor * 0.25;
    emis *= 0.6 * exp(-hgt * 0.1);
  }
  col += emis;
  float fog = 1.0 - exp(-pow(vDepth * uFogDensity, 2.0));
  gl_FragColor = vec4(mix(col, uFogColor, fog), 1.0);
}`;

// the ground: asphalt, lane paint, crosswalks, sidewalks, lamp pools and the
// plaza rings, with wet patches that let the mirrored city show through
const GROUND_VS = `
varying vec3 vWorld; varying float vDepth;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;
const GROUND_FS = `
#define ND ${DISTRICTS.length}
uniform float uTime; uniform float uRain; uniform vec3 uFogColor; uniform float uFogDensity;
uniform vec4 uDist[ND]; uniform vec3 uDistCol[ND]; uniform sampler2D uNoise;
varying vec3 vWorld; varying float vDepth;
float ln(float dist, float hw, float aw){ return (1.0 - smoothstep(hw, hw + aw, dist)) * clamp(hw * 2.5 / (aw + 0.0001), 0.0, 1.0); }
// paint on a road running along b: a = across (from centerline), b = along
vec3 paint(float a, float qa, float b, float qb, float aw){
  float center = ln(a, 0.035, aw) * step(0.5, fract(b / 1.4));
  float edges = ln(abs(a - ${(RW - 0.1).toFixed(2)}), 0.02, aw);
  float cross = step(${(RW + 0.12).toFixed(2)}, qb) * step(qb, ${(RW + 0.62).toFixed(2)}) * step(a, ${(RW - 0.14).toFixed(2)}) * step(0.5, fract(qa / 0.3)) * clamp(0.3 / (aw + 0.0001), 0.0, 1.0);
  return vec3(1.0, 0.18, 0.58) * center * 0.55 + vec3(0.9, 0.9, 1.0) * (edges * 0.07 + cross * 0.1);
}
void main(){
  vec2 p = vWorld.xz;
  float aw = fwidth(p.x) + fwidth(p.y);
  float city = 1.0 - smoothstep(${(BZ * P + 2).toFixed(1)}, ${(BZ * P + 20).toFixed(1)}, max(abs(p.x) * ${(BZ / BX).toFixed(3)}, abs(p.y)));
  vec2 q = mod(p, ${P.toFixed(1)}) - ${(P / 2).toFixed(1)};
  vec2 d = abs(q);
  float dr = min(d.x, d.y);
  float road = (1.0 - smoothstep(${RW.toFixed(2)} - aw, ${RW.toFixed(2)} + aw, dr)) * city;
  float walk = (1.0 - smoothstep(${(RW + SWK).toFixed(2)} - aw, ${(RW + SWK).toFixed(2)} + aw, dr)) * (1.0 - road) * city;
  vec4 nz = texture2D(uNoise, p * 0.021);
  float grain = texture2D(uNoise, p * 0.9).b;
  float puddle = smoothstep(0.42, 0.7, nz.r * 0.65 + nz.g * 0.35);
  float wet = road * mix(0.5 + 0.5 * puddle, 1.0, uRain) + (1.0 - road) * city * (0.18 * puddle + 0.3 * uRain);
  vec3 asphalt = vec3(0.017, 0.017, 0.021) * (0.65 + 0.7 * grain) * mix(1.0, 0.45, wet);
  vec3 slab = vec3(0.02, 0.019, 0.026) * (0.8 + 0.4 * texture2D(uNoise, p * 0.31).g);
  vec3 side = vec3(0.038, 0.037, 0.044) * (0.85 + 0.3 * grain);
  side *= 1.0 - 0.35 * max(ln(abs(fract(p.x / 0.45) - 0.5), 0.02, aw), ln(abs(fract(p.y / 0.45) - 0.5), 0.02, aw));
  vec3 col = mix(vec3(0.008, 0.008, 0.012), slab, city);
  col = mix(col, side, walk);
  col = mix(col, asphalt, road);
  vec3 emis = vec3(0.0);
  // the faint pink plot grid inside each block: the Grid's signature
  float plot = max(ln(abs(mod(p.x, 1.75) - 0.875), 0.012, aw), ln(abs(mod(p.y, 1.75) - 0.875), 0.012, aw));
  emis += vec3(1.0, 0.18, 0.58) * plot * 0.035 * (1.0 - road) * (1.0 - walk) * city;
  float inter = step(d.x, ${RW.toFixed(2)}) * step(d.y, ${RW.toFixed(2)});
  if (d.x < ${RW.toFixed(2)} && inter < 0.5) emis += paint(d.x, q.x, p.y, d.y, aw) * city;
  if (d.y < ${RW.toFixed(2)} && inter < 0.5) emis += paint(d.y, q.y, p.x, d.x, aw) * city;
  // street lamps: warm pools on both sides of every road
  float la = ${(RW + 0.22).toFixed(2)};
  vec2 l1 = vec2(d.x - la, mod(p.y, 3.5) - 1.75);
  vec2 l2 = vec2(d.y - la, mod(p.x, 3.5) - 1.75);
  float pool = (exp(-dot(l1, l1) * 0.9) + exp(-dot(l2, l2) * 0.9)) * city;
  col += (col * 3.2 + 0.004) * vec3(1.0, 0.66, 0.36) * pool;
  // plaza rings under the landmark towers; the selected one turns and pulses
  for (int i = 0; i < ND; i++) {
    vec2 dv = p - uDist[i].xy;
    float dd = length(dv);
    if (dd > 9.0) continue;
    float hot = uDist[i].w;
    float ring = exp(-pow((dd - uDist[i].z) * 6.0, 2.0));
    float dash = step(0.5, fract(atan(dv.y, dv.x) * 3.8197 + uTime * 0.12));
    float outer = exp(-pow((dd - uDist[i].z - 0.55) * 9.0, 2.0)) * dash * hot;
    emis += uDistCol[i] * (ring * (0.45 + 1.5 * hot) + outer * 1.4 + exp(-dd * 0.6) * (0.07 + 0.2 * hot));
  }
  col += emis;
  float fres = pow(1.0 - clamp(normalize(cameraPosition - vWorld).y, 0.0, 1.0), 3.0);
  float alpha = 1.0 - clamp(wet * (0.34 + 0.6 * fres) * (0.55 + 0.9 * grain), 0.0, 0.86);
  float fog = 1.0 - exp(-pow(vDepth * uFogDensity, 2.0));
  gl_FragColor = vec4(mix(col, uFogColor, fog), mix(alpha, 1.0, fog));
}`;

// the sky: haze at the horizon, stars, and the eclipse the city sits under.
// Mirrored below the horizon so wet streets pick it up for free.
const SKY_VS = `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FS = `
uniform vec3 uFogColor; uniform vec3 uEcl; uniform float uTime;
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  float above = step(0.0, d.y);
  d.y = abs(d.y);
  vec3 col = mix(uFogColor, vec3(0.004, 0.004, 0.011), pow(smoothstep(0.0, 0.5, d.y), 0.55));
  col += vec3(1.0, 0.2, 0.55) * 0.02 * exp(-d.y * 8.0);
  vec3 sp = d * 150.0, ip = floor(sp), fp = fract(sp) - 0.5;
  float h = fract(sin(dot(ip, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  float st = above * step(0.9962, h) * smoothstep(0.1, 0.36, d.y) * exp(-dot(fp, fp) * 16.0);
  col += vec3(0.8, 0.86, 1.0) * st * (0.65 + 0.35 * sin(uTime * 1.4 + h * 90.0)) * 1.3;
  float ang = acos(clamp(dot(d, uEcl), -1.0, 1.0));
  float r0 = 0.062;
  float disc = smoothstep(r0 - 0.004, r0, ang);
  float streak = 0.75 + 0.25 * sin(atan(d.x - uEcl.x, d.y - uEcl.y) * 14.0);
  float corona = exp(-max(ang - r0, 0.0) * 17.0) * streak;
  float rim = exp(-pow((ang - r0) * 210.0, 2.0));
  col = col * disc + vec3(1.0, 0.5, 0.78) * corona * 0.55 * disc + vec3(1.9, 1.5, 1.75) * rim;
  gl_FragColor = vec4(col, 1.0);
}`;

// every small light in the city: lamps, aircraft warning lights, headlights,
// tail lights, the packets on the skyways
const LIGHT_VS = `
attribute float size; attribute float phase;
uniform float uTime; uniform float uScale; uniform float uFogDensity;
varying vec3 vC; varying float vA;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float px = size * uScale / max(0.1, -mv.z);
  float blink = phase > 0.0 ? step(0.72, fract(uTime * 0.45 + phase)) : 1.0;
  vA = blink * min(1.0, px * px) * exp(-pow(-mv.z * uFogDensity, 2.0));
  vC = color;
  gl_PointSize = clamp(px, 1.0, 72.0);
  gl_Position = projectionMatrix * mv;
}`;
const LIGHT_FS = `
uniform float uGain; varying vec3 vC; varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d2 = dot(c, c);
  float a = (exp(-d2 * 26.0) + 0.22 * exp(-d2 * 7.0)) * (1.0 - smoothstep(0.12, 0.25, d2));
  if (a < 0.012) discard;
  gl_FragColor = vec4(vC * a * vA * uGain, 1.0);
}`;

const BEAM_VS = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const BEAM_FS = `uniform vec3 uColor; uniform float uGain; varying vec2 vUv; void main(){ gl_FragColor = vec4(uColor * pow(1.0 - vUv.y, 2.4) * uGain, 1.0); }`;

const RAIN_VS = `
attribute float aEnd;
uniform float uTime; uniform vec3 uCenter;
varying float vA;
void main(){
  vec3 p = position;
  float sp = 17.0 + fract(p.x * 7.31 + p.z * 3.7) * 9.0;
  p.y = mod(p.y - uTime * sp, 30.0) + aEnd * 0.75;
  p.x += (30.0 - p.y) * 0.05 + uCenter.x;
  p.z += uCenter.z;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vA = clamp(1.0 - (-mv.z) / 46.0, 0.0, 1.0);
  gl_Position = projectionMatrix * mv;
}`;
const RAIN_FS = `varying float vA; void main(){ gl_FragColor = vec4(vec3(0.55, 0.65, 0.9) * 0.95 * vA, 1.0); }`;

// the lens: a touch of aberration at the edges, vignette, fine grain
const GradeShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
float rnd(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec2 d = vUv - 0.5; float r2 = dot(d, d);
  float ca = 0.007 * r2;
  vec3 col;
  col.r = texture2D(tDiffuse, vUv + d * ca).r;
  col.g = texture2D(tDiffuse, vUv).g;
  col.b = texture2D(tDiffuse, vUv - d * ca).b;
  col *= 1.0 - r2 * 0.8;
  col += (rnd(vUv * uRes + fract(uTime)) - 0.5) * 0.022;
  gl_FragColor = vec4(col, 1.0);
}`,
};

type Quality = "auto" | "high" | "eco";
function loadQuality(): Quality {
  try {
    const q = localStorage.getItem("bx-quality");
    return q === "high" || q === "eco" ? q : "auto";
  } catch {
    return "auto";
  }
}
function loadRain() {
  try {
    return localStorage.getItem("c3d-rain") === "1";
  } catch {
    return false;
  }
}

type View = "overview" | "street" | "top";

export const City3D: React.FC<{
  data: CityData;
  onSelect?: (key: string | null) => void;
  selected?: string | null;
}> = ({ data, onSelect, selected }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [orbit, setOrbit] = useState(true);
  const [rain, setRain] = useState(loadRain);
  const api = useRef<{ view: (v: View) => void; orbit: (on: boolean) => void; rain: (on: boolean) => void; select: (k: string | null) => void }>({
    view: () => {},
    orbit: () => {},
    rain: () => {},
    select: () => {},
  });

  // the dossier panel closing (or opening from elsewhere) moves the camera too
  useEffect(() => {
    if (selected !== undefined) api.current.select(selected);
  }, [selected]);

  useEffect(() => {
    const host = hostRef.current;
    const tags = tagsRef.current;
    if (!host || !tags) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const W = () => host.clientWidth || 800;
    const H = () => host.clientHeight || 520;
    const DPR = window.devicePixelRatio || 1;
    const quality = loadQuality();
    let pr = quality === "high" ? Math.min(DPR, 1.5) : quality === "eco" ? 0.75 : Math.min(DPR, 1.25);
    // AUTO steps down this ladder while frames run long and back up while
    // they run clean: render scale first, then the street reflections, then
    // the glow. It never climbs back onto a rung that was already too slow.
    const LADDER = [
      { s: pr, mirror: true, bloom: true },
      { s: Math.min(pr, 0.85), mirror: true, bloom: true },
      { s: Math.min(pr, 0.85), mirror: false, bloom: true },
      { s: 0.7, mirror: false, bloom: true },
      { s: 0.7, mirror: false, bloom: false },
      { s: 0.58, mirror: false, bloom: false },
    ];
    let rung = 0, floorRung = 0;

    const disposables: { dispose: () => void }[] = [];
    const keep = <T extends { dispose: () => void }>(x: T) => {
      disposables.push(x);
      return x;
    };

    const FOG = new THREE.Color(0.02, 0.008, 0.03);
    // the eclipse hangs at the far end of the main avenue; the key light on
    // the facades comes from the front left so the towers read as solids
    const ECL = new THREE.Vector3(0.03, 0.19, -1).normalize();
    const shared = {
      uTime: { value: 0 },
      uFogColor: { value: FOG },
      uFogDensity: { value: 0.0105 },
      uMoonDir: { value: new THREE.Vector3(-0.55, 0.4, 0.62).normalize() },
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, W() / H(), 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(pr);
    renderer.setSize(W(), H());
    renderer.setClearColor(FOG, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cursor = "grab";

    const rt = new THREE.WebGLRenderTarget(W() * pr, H() * pr, { type: THREE.HalfFloatType });
    const composer = new EffectComposer(renderer, rt);
    composer.setPixelRatio(pr);
    composer.setSize(W(), H());
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W(), H()), 0.42, 0.5, 0.9);
    bloom.enabled = quality !== "eco";
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const fxaa = new ShaderPass(FXAAShader);
    composer.addPass(fxaa);
    const grade = new ShaderPass(GradeShader);
    composer.addPass(grade);

    // sky
    const skyMat = keep(
      new THREE.ShaderMaterial({
        uniforms: { uFogColor: shared.uFogColor, uEcl: { value: ECL }, uTime: shared.uTime },
        vertexShader: SKY_VS,
        fragmentShader: SKY_FS,
        side: THREE.BackSide,
        depthWrite: false,
      })
    );
    const sky = new THREE.Mesh(keep(new THREE.SphereGeometry(240, 40, 20)), skyMat);
    sky.renderOrder = 5;
    scene.add(sky);

    // everything that should show in the wet street is added twice: once to
    // the city, once to this group, which is the city flipped below the road
    const mirror = new THREE.Group();
    mirror.scale.y = -1;
    mirror.visible = quality !== "eco";
    scene.add(mirror);

    type Bag = Record<string, { value: unknown }>;
    const facade = (u: Bag, mirrored = false) =>
      keep(new THREE.ShaderMaterial({ uniforms: u, vertexShader: FACADE_VS, fragmentShader: FACADE_FS, defines: mirrored ? { MIRROR: "" } : {} }));
    const facadeBag = (accent: number, trim: number, seed: number): Bag => ({
      ...shared,
      uAccent: { value: new THREE.Color(accent) },
      uTrim: { value: trim },
      uPower: { value: 1 },
      uHover: { value: 0 },
      uPulse: { value: 0 },
      uAlert: { value: 0 },
      uMirror: { value: 0 },
      uSeed: { value: seed },
    });
    const box = keep(new THREE.BoxGeometry(1, 1, 1));

    const rng = (() => {
      let s = 20260911;
      return () => ((s = (s * 16807) % 2147483647) / 2147483647);
    })();

    // the skyline: every block that is not a landmark gets up to four lots
    const dpos = (d: District) => new THREE.Vector3(d.gx * P, 0, d.gz * P);
    const taken = new Set(DISTRICTS.map((d) => `${d.gx},${d.gz}`));
    const inst: { x: number; z: number; w: number; d: number; h: number; y: number; seed: number }[] = [];
    const warn: number[] = []; // aircraft warning lights: x, y, z, phase
    for (let gx = -BX; gx <= BX; gx++) {
      for (let gz = -BZ; gz <= BZ; gz++) {
        if (taken.has(`${gx},${gz}`)) continue;
        const cx = gx * P, cz = gz * P;
        const far = Math.hypot(cx * 0.8, cz);
        const base = THREE.MathUtils.lerp(6.0, 1.3, THREE.MathUtils.smoothstep(far, 6, 36));
        const push = (x: number, z: number, w: number, d: number, h: number) => {
          const seed = Math.floor(rng() * 900);
          inst.push({ x, z, w, d, h, y: 0, seed });
          // a narrower top tier on the taller ones
          if (h > 3.2 && rng() < 0.5) {
            const th = h * (0.18 + rng() * 0.22);
            inst.push({ x, z, w: w * 0.66, d: d * 0.66, h: th, y: h, seed });
            h += th;
          }
          if (h > 4.6) warn.push(x + (rng() - 0.5) * w * 0.4, h + 0.12, z + (rng() - 0.5) * d * 0.4, 0.05 + rng() * 0.9);
        };
        if (rng() < 0.16) {
          push(cx, cz, 3.3 + rng() * 0.7, 3.3 + rng() * 0.7, base * (0.45 + rng() * 0.5));
        } else {
          for (const ox of [-1.03, 1.03]) {
            for (const oz of [-1.03, 1.03]) {
              if (rng() < 0.13) continue;
              const tall = rng() < 0.08 ? 1.3 : 1;
              push(cx + ox, cz + oz, 1.4 + rng() * 0.5, 1.4 + rng() * 0.5, Math.min(6.4, base * (0.35 + rng() * 0.65) * tall));
            }
          }
        }
      }
    }
    // depth first: the skyline is laid down with a do-nothing fragment shader,
    // then shaded, so each pixel pays for the window shader exactly once
    const depthOnly = keep(new THREE.ShaderMaterial({ uniforms: { uSeed: { value: 0 } }, vertexShader: FACADE_VS, fragmentShader: "void main(){ gl_FragColor = vec4(0.0); }", colorWrite: false }));
    const skylineBag = facadeBag(0, 0, 0);
    const skyline = new THREE.InstancedMesh(box, facade(skylineBag), inst.length);
    const seeds = new Float32Array(inst.length);
    const m4 = new THREE.Matrix4();
    inst.forEach((b, i) => {
      m4.makeScale(b.w, b.h, b.d);
      m4.setPosition(b.x, b.y + b.h / 2, b.z);
      skyline.setMatrixAt(i, m4);
      seeds[i] = b.seed;
    });
    const skyGeo = keep(box.clone());
    skyGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 1));
    skyline.geometry = skyGeo;
    skyline.frustumCulled = false;
    scene.add(skyline);
    const skylineMirror = new THREE.InstancedMesh(skyGeo, facade({ ...skylineBag, uMirror: { value: 1 } }, true), inst.length);
    skylineMirror.instanceMatrix = skyline.instanceMatrix;
    skylineMirror.frustumCulled = false;
    mirror.add(skylineMirror);
    for (const [parent, src] of [[scene, skyline], [mirror, skylineMirror]] as [THREE.Object3D, THREE.InstancedMesh][]) {
      const pre = new THREE.InstancedMesh(skyGeo, depthOnly, inst.length);
      pre.instanceMatrix = src.instanceMatrix;
      pre.frustumCulled = false;
      pre.renderOrder = -5;
      parent.add(pre);
    }

    // small lights
    const lightMats: THREE.ShaderMaterial[] = [];
    const lightMat = (gain: number) => {
      const m = keep(
        new THREE.ShaderMaterial({
          uniforms: { uTime: shared.uTime, uScale: { value: 1 }, uFogDensity: shared.uFogDensity, uGain: { value: gain } },
          vertexShader: LIGHT_VS,
          fragmentShader: LIGHT_FS,
          vertexColors: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      );
      lightMats.push(m);
      return m;
    };
    const pointsGeo = (pos: number[] | Float32Array, col: number[] | Float32Array, size: number[] | Float32Array, phase?: number[] | Float32Array) => {
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      g.setAttribute("size", new THREE.Float32BufferAttribute(size, 1));
      g.setAttribute("phase", new THREE.Float32BufferAttribute(phase || new Float32Array(size.length), 1));
      return g;
    };

    // street lamps along both sides of every road, plus rooftop warning lights
    {
      const lp: number[] = [], lc: number[] = [], ls: number[] = [], lph: number[] = [];
      const LX = BX * P + P / 2, LZ = BZ * P + P / 2, off = RW + 0.22;
      for (let i = -BX - 1; i <= BX; i++) {
        const xr = (i + 0.5) * P;
        for (let z = -LZ + 1.75; z < LZ; z += 3.5) {
          for (const s of [-1, 1]) {
            lp.push(xr + s * off, 0.62, z);
            lc.push(1.0, 0.66, 0.36);
            ls.push(0.3);
            lph.push(0);
          }
        }
      }
      for (let j = -BZ - 1; j <= BZ; j++) {
        const zr = (j + 0.5) * P;
        for (let x = -LX + 1.75; x < LX; x += 3.5) {
          for (const s of [-1, 1]) {
            lp.push(x, 0.62, zr + s * off);
            lc.push(1.0, 0.66, 0.36);
            ls.push(0.3);
            lph.push(0);
          }
        }
      }
      for (let i = 0; i < warn.length; i += 4) {
        lp.push(warn[i], warn[i + 1], warn[i + 2]);
        lc.push(2.4, 0.16, 0.12);
        ls.push(0.42);
        lph.push(warn[i + 3]);
      }
      const g = pointsGeo(lp, lc, ls, lph);
      const lamps = new THREE.Points(g, lightMat(1));
      lamps.frustumCulled = false;
      scene.add(lamps);
      const lampsMirror = new THREE.Points(g, lightMat(0.5));
      lampsMirror.frustumCulled = false;
      mirror.add(lampsMirror);
    }

    // traffic: a head light and a tail light per car, keeping right
    const CARS = 260;
    const cars = Array.from({ length: CARS }, () => {
      const alongZ = rng() < 0.5;
      const dir = rng() < 0.5 ? 1 : -1;
      const lanes = alongZ ? 2 * BX + 2 : 2 * BZ + 2;
      const road = (Math.floor(rng() * lanes) - lanes / 2 + 0.5) * P;
      const span = (alongZ ? BZ : BX) * P + P / 2;
      return { alongZ, dir, road, span, s: (rng() * 2 - 1) * span, v: 2.4 + rng() * 2.6 };
    });
    const carPos = new Float32Array(CARS * 2 * 3);
    const carCol = new Float32Array(CARS * 2 * 3);
    const carSize = new Float32Array(CARS * 2);
    for (let i = 0; i < CARS; i++) {
      carCol.set([2.3, 2.1, 1.8], i * 6);
      carCol.set([2.2, 0.14, 0.1], i * 6 + 3);
      carSize[i * 2] = 0.27;
      carSize[i * 2 + 1] = 0.24;
    }
    const carGeo = pointsGeo(carPos, carCol, carSize);
    const carPts = new THREE.Points(carGeo, lightMat(1));
    carPts.frustumCulled = false;
    scene.add(carPts);
    const carMirror = new THREE.Points(carGeo, lightMat(0.55));
    carMirror.frustumCulled = false;
    mirror.add(carMirror);

    // the ground
    // tiling noise for the asphalt: R and G are soft fields (puddles, slab
    // tone), B is fine grain
    const noiseTex = keep(
      (() => {
        const S = 128, data = new Uint8Array(S * S * 4);
        const hh = (x: number, y: number, sd: number) => {
          const q = Math.sin(x * 127.1 + y * 311.7 + sd * 74.7) * 43758.5453;
          return q - Math.floor(q);
        };
        const vn = (x: number, y: number, per: number, sd: number) => {
          const ix = Math.floor(x), iy = Math.floor(y);
          let fx = x - ix, fy = y - iy;
          fx = fx * fx * (3 - 2 * fx);
          fy = fy * fy * (3 - 2 * fy);
          const x0 = ((ix % per) + per) % per, x1 = (x0 + 1) % per, y0 = ((iy % per) + per) % per, y1 = (y0 + 1) % per;
          const a = hh(x0, y0, sd), b = hh(x1, y0, sd), c = hh(x0, y1, sd), d = hh(x1, y1, sd);
          return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
        };
        for (let y = 0; y < S; y++) {
          for (let x = 0; x < S; x++) {
            const u = x / S, w = y / S, i = (y * S + x) * 4;
            data[i] = Math.round((vn(u * 4, w * 4, 4, 1) * 0.65 + vn(u * 8, w * 8, 8, 2) * 0.35) * 255);
            data[i + 1] = Math.round((vn(u * 6, w * 6, 6, 3) * 0.6 + vn(u * 16, w * 16, 16, 4) * 0.4) * 255);
            data[i + 2] = Math.round(hh(x, y, 5) * 255);
            data[i + 3] = 255;
          }
        }
        const tx = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
        tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        tx.magFilter = THREE.LinearFilter;
        tx.minFilter = THREE.LinearMipmapLinearFilter;
        tx.generateMipmaps = true;
        tx.needsUpdate = true;
        return tx;
      })()
    );
    const hot = DISTRICTS.map(() => 0);
    const groundU = {
      uNoise: { value: noiseTex },
      uTime: shared.uTime,
      uRain: { value: 0 },
      uFogColor: shared.uFogColor,
      uFogDensity: shared.uFogDensity,
      uDist: { value: DISTRICTS.map((d) => new THREE.Vector4(d.gx * P, d.gz * P, d.big ? 2.75 : 2.45, 0)) },
      uDistCol: { value: DISTRICTS.map((d) => new THREE.Color(ACCENT[d.key])) },
    };
    const ground = new THREE.Mesh(
      keep(new THREE.PlaneGeometry(700, 700)),
      keep(new THREE.ShaderMaterial({ uniforms: groundU, vertexShader: GROUND_VS, fragmentShader: GROUND_FS, transparent: true, depthWrite: false }))
    );
    ground.rotation.x = -Math.PI / 2;
    ground.renderOrder = -1;
    scene.add(ground);

    // soft glow sprite for the beacons
    const glowTex = keep(
      (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d")!;
        const gr = g.createRadialGradient(32, 32, 2, 32, 32, 30);
        gr.addColorStop(0, "rgba(255,255,255,0.9)");
        gr.addColorStop(0.35, "rgba(255,255,255,0.3)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      })()
    );

    // landmark towers
    type Tower = {
      d: District;
      i: number;
      bag: Bag;
      top: number;
      core: THREE.Mesh;
      coreMat: THREE.MeshBasicMaterial;
      halo: THREE.SpriteMaterial;
      beam: THREE.ShaderMaterial;
      ring: THREE.Mesh;
      el: HTMLButtonElement;
      sub: HTMLElement;
      anchor: THREE.Vector3;
      hover: number;
      tf: string;
      shown: boolean;
      sx: number;
      sy: number;
      wpx: number;
      lift: number;
      liftCss: number;
    };
    const towers: Tower[] = [];
    const byKey: Record<string, Tower> = {};
    const clickable: THREE.Object3D[] = [];
    const orbGeo = keep(new THREE.IcosahedronGeometry(0.36, 2));
    const ringGeo = keep(new THREE.TorusGeometry(0.66, 0.022, 6, 48));
    const beamGeo = keep(new THREE.CylinderGeometry(0.04, 0.11, 17, 12, 1, true));
    const tiersFor = (d: District, w: number): { w: number; d: number; h: number }[] => {
      if (d.shape === "stepped")
        return [
          { w, d: w, h: d.h * 0.48 },
          { w: w * 0.78, d: w * 0.78, h: d.h * 0.28 },
          { w: w * 0.56, d: w * 0.56, h: d.h * 0.16 },
          { w: w * 0.34, d: w * 0.34, h: d.h * 0.08 },
        ];
      if (d.shape === "slab")
        return [
          { w: w * 1.3, d: w * 0.72, h: d.h * 0.82 },
          { w: w * 0.82, d: w * 0.46, h: d.h * 0.18 },
        ];
      if (d.shape === "terminal")
        return [
          { w: w * 1.55, d: w * 1.05, h: d.h * 0.62 },
          { w: w * 0.9, d: w * 0.62, h: d.h * 0.38 },
        ];
      return [
        { w, d: w, h: d.h * 0.74 },
        { w: w * 0.66, d: w * 0.66, h: d.h * 0.2 },
        { w: w * 0.36, d: w * 0.36, h: d.h * 0.06 },
      ];
    };
    DISTRICTS.forEach((d, i) => {
      const accent = ACCENT[d.key] ?? COLORS.pink;
      const bag = facadeBag(accent, 1, 911 + i * 7);
      const mat = facade(bag);
      const matMirror = facade({ ...bag, uMirror: { value: 1 } }, true);
      const x = d.gx * P, z = d.gz * P;
      const w = d.big ? 2.9 : 2.3;
      const add = (tw: number, td: number, th: number, y: number) => {
        const mesh = new THREE.Mesh(box, mat);
        mesh.scale.set(tw, th, td);
        mesh.position.set(x, y + th / 2, z);
        mesh.userData.key = d.key;
        mesh.renderOrder = -3;
        clickable.push(mesh);
        scene.add(mesh);
        const mm = new THREE.Mesh(box, matMirror);
        mm.scale.copy(mesh.scale);
        mm.position.copy(mesh.position);
        mirror.add(mm);
      };
      // podium, then the tiers
      add(d.big ? 4.0 : 3.6, d.big ? 4.0 : 3.6, 0.32, 0);
      let y = 0.32;
      for (const t of tiersFor(d, w)) {
        add(t.w, t.d, t.h, y);
        y += t.h;
      }
      let top = y;
      if (d.big) {
        const spire = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.03, 0.1, 2.2, 6)), keep(new THREE.MeshBasicMaterial({ color: 0x15151c })));
        spire.position.set(x, top + 1.1, z);
        scene.add(spire);
        top += 2.2;
      }
      const coreMat = keep(new THREE.MeshBasicMaterial());
      const core = new THREE.Mesh(orbGeo, coreMat);
      core.position.set(x, top + 0.75, z);
      core.userData.key = d.key;
      clickable.push(core);
      scene.add(core);
      const ringMat = keep(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }));
      ringMat.color.set(accent).multiplyScalar(1.6);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(core.position);
      scene.add(ring);
      const halo = keep(new THREE.SpriteMaterial({ map: glowTex, color: accent, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
      const haloS = new THREE.Sprite(halo);
      haloS.scale.setScalar(d.big ? 2.6 : 2.0);
      haloS.position.copy(core.position);
      scene.add(haloS);
      const beam = keep(
        new THREE.ShaderMaterial({
          uniforms: { uColor: { value: new THREE.Color(accent) }, uGain: { value: 0.5 } },
          vertexShader: BEAM_VS,
          fragmentShader: BEAM_FS,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        })
      );
      const beamM = new THREE.Mesh(beamGeo, beam);
      beamM.position.set(x, top + 0.75 + 8.5, z);
      scene.add(beamM);

      const el = document.createElement("button");
      el.type = "button";
      el.className = "c3d-label" + (d.big ? " c3d-big" : "");
      el.style.setProperty("--c", "#" + new THREE.Color(accent).getHexString());
      el.innerHTML = `<span class="c3d-tag"><i></i><span class="c3d-name">${d.label}</span><span class="c3d-sub"></span></span><span class="c3d-stem"></span>`;
      tags.appendChild(el);
      const t: Tower = {
        d,
        i,
        bag,
        top,
        core,
        coreMat,
        halo,
        beam,
        ring,
        el,
        sub: el.querySelector(".c3d-sub") as HTMLElement,
        anchor: new THREE.Vector3(x, top + 1.5, z),
        hover: 0,
        tf: "",
        shown: true,
        sx: 0,
        sy: 0,
        wpx: 120,
        lift: 0,
        liftCss: 0,
      };
      el.addEventListener("click", () => choose(d.key, true));
      el.addEventListener("pointerenter", () => (tagHover = d.key));
      el.addEventListener("pointerleave", () => {
        if (tagHover === d.key) tagHover = null;
      });
      towers.push(t);
      byKey[d.key] = t;
    });

    // skyways: the routes between towers, with comet packets running them
    const TRAIL = 7;
    type Route = { curve: THREE.CatmullRomCurve3; key: string; tone: THREE.Color; speed: number; n: number };
    const routes: Route[] = [];
    const routeMat = keep(new THREE.LineBasicMaterial({ transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true }));
    const routeSeg: number[] = [], routeCol: number[] = [];
    const addRoute = (from: string, to: string, tone: number, key: string, n = 1, speed = 0.1) => {
      const a = byKey[from].core.position.clone();
      const b = byKey[to].core.position.clone();
      const mid = a.clone().lerp(b, 0.5);
      mid.y += a.distanceTo(b) * 0.2 + 2;
      const curve = new THREE.CatmullRomCurve3([a, mid, b]);
      const pts = curve.getPoints(36);
      const c = new THREE.Color(tone);
      for (let i = 0; i < pts.length - 1; i++) {
        routeSeg.push(pts[i].x, pts[i].y, pts[i].z, pts[i + 1].x, pts[i + 1].y, pts[i + 1].z);
        routeCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
      }
      routes.push({ curve, key, tone: c, speed, n });
    };
    addRoute("world", "site", COLORS.cyan, "traffic", 3, 0.12);
    addRoute("site", "korvus", COLORS.pink, "clicks", 1, 0.09);
    addRoute("site", "crown", COLORS.pink, "clicks", 1, 0.08);
    addRoute("site", "eclipse", COLORS.pink, "clicks", 1, 0.085);
    addRoute("stripe", "you", COLORS.gold, "gold", 1, 0.07);
    addRoute("corvid", "regent", COLORS.pink, "agents", 1, 0.14);
    addRoute("regent", "you", COLORS.pink, "agents", 1, 0.16);
    addRoute("corvid", "site", COLORS.cyan, "agents", 1, 0.06);
    addRoute("herald", "regent", COLORS.pink, "agents", 1, 0.11);
    addRoute("stripe", "herald", COLORS.gold, "agents", 1, 0.07);
    addRoute("steward", "regent", COLORS.pink, "agents", 1, 0.12);
    addRoute("steward", "corvid", COLORS.cyan, "agents", 1, 0.09);
    addRoute("steward", "eclipse", COLORS.pink, "agents", 1, 0.05);
    addRoute("bard", "regent", 0xb15bff, "agents", 1, 0.1);
    addRoute("herald", "bard", COLORS.cyan, "agents", 1, 0.07);
    {
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.Float32BufferAttribute(routeSeg, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(routeCol, 3));
      scene.add(new THREE.LineSegments(g, routeMat));
    }
    type Packet = { r: Route; t: number; idx: number; on: boolean };
    const packets: Packet[] = [];
    routes.forEach((r) => {
      for (let k = 0; k < r.n; k++) packets.push({ r, t: k / r.n, idx: k, on: true });
    });
    const SPARKS = 14;
    type Spark = { curve: THREE.QuadraticBezierCurve3; t: number; to: string; tone: THREE.Color };
    const sparks: (Spark | null)[] = Array.from({ length: SPARKS }, () => null);
    const FXN = (packets.length + SPARKS) * TRAIL;
    const fxPos = new Float32Array(FXN * 3).fill(-999);
    const fxCol = new Float32Array(FXN * 3);
    const fxSize = new Float32Array(FXN);
    const setSlot = (slot: number, tone: THREE.Color, big: number) => {
      for (let k = 0; k < TRAIL; k++) {
        const f = 1 - k / TRAIL;
        fxCol.set([tone.r * 2.4 * f, tone.g * 2.4 * f, tone.b * 2.4 * f], (slot * TRAIL + k) * 3);
        fxSize[slot * TRAIL + k] = big * (0.25 + 0.75 * f);
      }
    };
    packets.forEach((p, s) => setSlot(s, p.r.tone, 0.62));
    const fxGeo = pointsGeo(fxPos, fxCol, fxSize);
    const fx = new THREE.Points(fxGeo, lightMat(1));
    fx.frustumCulled = false;
    scene.add(fx);
    const tmp = new THREE.Vector3();
    const writeTrail = (slot: number, at: (u: number) => THREE.Vector3, t: number, gap: number) => {
      for (let k = 0; k < TRAIL; k++) {
        const u = Math.max(0, t - k * gap);
        tmp.copy(at(u));
        fxPos.set([tmp.x, tmp.y, tmp.z], (slot * TRAIL + k) * 3);
      }
    };
    const hideSlot = (slot: number) => {
      for (let k = 0; k < TRAIL; k++) fxPos[(slot * TRAIL + k) * 3 + 1] = -999;
    };

    // the wire: a spark arcs between desks when agents hand work across, and
    // the receiving tower lights up as it lands
    const ripples: { mesh: THREE.Mesh; age: number }[] = [];
    const rippleGeo = keep(new THREE.RingGeometry(0.42, 0.5, 48));
    let wireSeen = Date.now();
    const spawnWire = () => {
      const w = dataRef.current.wire || [];
      let newest = wireSeen;
      for (const ev of w) {
        if (ev.t <= wireSeen) continue;
        if (ev.t > newest) newest = ev.t;
        const a = byKey[ev.from], b = byKey[ev.to];
        const free = sparks.findIndex((s) => !s);
        if (!a || !b || a === b || free < 0) continue;
        const pa = a.core.position.clone(), pb = b.core.position.clone();
        const mid = pa.clone().lerp(pb, 0.5);
        mid.y += pa.distanceTo(pb) * 0.3 + 3;
        const tone = new THREE.Color(ACCENT[ev.from] ?? COLORS.pink);
        sparks[free] = { curve: new THREE.QuadraticBezierCurve3(pa, mid, pb), t: 0, to: ev.to, tone };
        setSlot(packets.length + free, tone, 1.15);
        fxGeo.attributes.color.needsUpdate = true;
        fxGeo.attributes.size.needsUpdate = true;
        a.bag.uPulse.value = Math.max(a.bag.uPulse.value as number, 0.5);
      }
      wireSeen = newest;
    };

    // rain
    const RAIN = 1500;
    const rainPos = new Float32Array(RAIN * 6), rainEnd = new Float32Array(RAIN * 2);
    for (let i = 0; i < RAIN; i++) {
      const x = (Math.random() - 0.5) * 80, y = Math.random() * 30, z = (Math.random() - 0.5) * 80;
      rainPos.set([x, y, z, x, y, z], i * 6);
      rainEnd[i * 2 + 1] = 1;
    }
    const rainGeo = keep(new THREE.BufferGeometry());
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    rainGeo.setAttribute("aEnd", new THREE.BufferAttribute(rainEnd, 1));
    const rainMat = keep(
      new THREE.ShaderMaterial({
        uniforms: { uTime: shared.uTime, uCenter: { value: new THREE.Vector3() } },
        vertexShader: RAIN_VS,
        fragmentShader: RAIN_FS,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    const rainLines = new THREE.LineSegments(rainGeo, rainMat);
    rainLines.frustumCulled = false;
    rainLines.visible = loadRain();
    scene.add(rainLines);
    let rainOn = rainLines.visible;

    // camera
    const HOME = new THREE.Vector3(-3, 3.2, -4);
    const HOME_DIST = 54;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(HOME);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.minDistance = 4;
    controls.maxDistance = 110;
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.35;
    const startDir = new THREE.Vector3(-0.34, 0.31, 0.89).normalize();
    camera.position.copy(HOME).addScaledVector(startDir, reduced ? HOME_DIST : 96);

    // flights: the camera glides to a target at a distance, optionally to a
    // set viewing direction. A hand on the controls cancels it.
    const flight = { active: !reduced, target: HOME.clone(), dist: HOME_DIST, dir: null as THREE.Vector3 | null };
    controls.addEventListener("start", () => {
      flight.active = false;
      if (controls.autoRotate) {
        controls.autoRotate = false;
        setOrbit(false);
      }
    });
    let selKey: string | null = null;
    const flyTo = (key: string | null) => {
      const t = key ? byKey[key] : null;
      if (t) {
        flight.target.set(t.d.gx * P, t.top * 0.5, t.d.gz * P);
        flight.dist = 13 + t.top * 0.75;
      } else {
        flight.target.copy(HOME);
        flight.dist = HOME_DIST;
      }
      flight.dir = null;
      flight.active = true;
      if (controls.autoRotate) {
        controls.autoRotate = false;
        setOrbit(false);
      }
    };
    const setSel = (key: string | null) => {
      selKey = key;
      for (const t of towers) t.el.classList.toggle("sel", t.d.key === key);
      tags.classList.toggle("has-sel", Boolean(key));
    };
    function choose(key: string | null, tell: boolean) {
      if (key === selKey && (!tell || !key)) return;
      setSel(key);
      flyTo(key);
      if (tell) onSelectRef.current?.(key);
    }
    api.current = {
      select: (k) => {
        if (k !== selKey) choose(k && byKey[k] ? k : null, false);
      },
      view: (v) => {
        setSel(null);
        onSelectRef.current?.(null);
        if (v === "street") {
          flight.target.set(3.5, 3.4, 2);
          flight.dist = 23;
          flight.dir = new THREE.Vector3(0, -0.128, 0.992).normalize();
        } else if (v === "top") {
          flight.target.set(-3, 0, -3);
          flight.dist = 82;
          flight.dir = new THREE.Vector3(0, 1, 0.012).normalize();
        } else {
          flight.target.copy(HOME);
          flight.dist = HOME_DIST;
          flight.dir = startDir.clone();
        }
        flight.active = true;
        if (controls.autoRotate) {
          controls.autoRotate = false;
          setOrbit(false);
        }
      },
      orbit: (on) => {
        controls.autoRotate = on;
        if (on) flight.active = false;
      },
      rain: (on) => {
        rainOn = on;
        rainLines.visible = on;
      },
    };

    // pointer: hover highlights a tower, a click (not a drag) enters it
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let pointerIn = false, pointerDirty = false, meshHover: string | null = null, tagHover: string | null = null;
    let downAt: { x: number; y: number } | null = null;
    const setNdc = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const pick = () => {
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(clickable, false)[0];
      return hit ? (hit.object.userData.key as string) : null;
    };
    const onMove = (e: PointerEvent) => {
      setNdc(e);
      pointerIn = true;
      pointerDirty = true;
    };
    const onLeave = () => {
      pointerIn = false;
      meshHover = null;
      renderer.domElement.style.cursor = "grab";
    };
    const onDown = (e: PointerEvent) => {
      downAt = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (!downAt) return;
      const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
      downAt = null;
      if (moved > 6) return;
      setNdc(e);
      choose(pick(), true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selKey) choose(null, true);
    };
    const cv = renderer.domElement;
    cv.addEventListener("pointermove", onMove);
    cv.addEventListener("pointerleave", onLeave);
    cv.addEventListener("pointerdown", onDown);
    cv.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);

    const resize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(pr);
      renderer.setSize(W(), H());
      composer.setPixelRatio(pr);
      composer.setSize(W(), H());
      fxaa.uniforms.resolution.value.set(1 / (W() * pr), 1 / (H() * pr));
      grade.uniforms.uRes.value.set(W() * pr, H() * pr);
      const sc = (H() * pr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
      for (const m of lightMats) m.uniforms.uScale.value = sc;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    let onScreen = true;
    const io = new IntersectionObserver((ents) => {
      onScreen = ents[0]?.isIntersecting ?? true;
    });
    io.observe(host);

    const statusHex = (s: boolean | null | undefined, fallback: number) => (s === true ? COLORS.up : s === false ? COLORS.down : fallback);
    const cA = new THREE.Color();
    const applyData = () => {
      const d = dataRef.current;
      const live: Record<string, boolean | null> = { site: d.status.site, korvus: d.status.korvus, crown: d.status.crown };
      const subs: Record<string, string> = {
        world: d.worldSub,
        stripe: d.stripeSub,
        regent: d.regentSub,
        herald: d.heraldSub || "",
        steward: d.stewardSub || "",
        bard: d.bardSub || "",
        ...(d.subs || {}),
      };
      for (const t of towers) {
        const k = t.d.key;
        const sub = subs[k] || "";
        if (t.sub.textContent !== sub) t.sub.textContent = sub;
        const hex = k in live ? statusHex(live[k], ACCENT[k]) : ACCENT[k];
        const power = d.power?.[k] ?? 1;
        cA.set(hex);
        t.halo.color.copy(cA);
        t.coreMat.color.copy(cA).multiplyScalar(0.7 + 1.5 * power);
        (t.beam.uniforms.uColor.value as THREE.Color).copy(cA);
        t.el.classList.toggle("off", power < 0.5);
        t.el.classList.toggle("down", live[k] === false);
      }
    };

    let raf = 0, last = performance.now(), t = 0, ema = 16, warm = 0, slowFor = 0, fastFor = 0, measureIn = 0.3, statIn = 1;
    const v = new THREE.Vector3();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      if (!onScreen || document.hidden) {
        last = now;
        return;
      }
      const raw = (now - last) / 1000;
      const dt = Math.min(0.05, raw);
      last = now;
      const adt = reduced ? 0 : dt;
      t += adt;
      shared.uTime.value = t;
      grade.uniforms.uTime.value = t;

      if (flight.active) {
        const k = 1 - Math.exp(-dt * 3.6);
        controls.target.lerp(flight.target, k);
        v.copy(camera.position).sub(controls.target);
        const dist = v.length();
        const next = THREE.MathUtils.lerp(dist, flight.dist, k);
        v.normalize();
        if (flight.dir) v.lerp(flight.dir, k).normalize();
        camera.position.copy(controls.target).addScaledVector(v, next);
        const turned = !flight.dir || v.distanceTo(flight.dir) < 0.01;
        if (turned && Math.abs(next - flight.dist) < 0.08 && controls.target.distanceTo(flight.target) < 0.08) flight.active = false;
      }
      // the camera may dip below its target for street views, never below the road
      controls.maxPolarAngle = Math.min(1.75, Math.acos(THREE.MathUtils.clamp((0.4 - controls.target.y) / Math.max(1, camera.position.distanceTo(controls.target)), -1, 1)));
      controls.update();
      if (camera.position.y < 0.36) camera.position.y = 0.36;
      sky.position.copy(camera.position);

      // hover
      if (pointerDirty && pointerIn) {
        pointerDirty = false;
        meshHover = pick();
        cv.style.cursor = meshHover ? "pointer" : "grab";
      }
      const hoverKey = tagHover || meshHover;
      const d = dataRef.current;
      const dists = groundU.uDist.value;
      for (const tw of towers) {
        const k = tw.d.key;
        const isHover = hoverKey === k, isSel = selKey === k;
        tw.hover += ((isHover ? 1 : 0) - tw.hover) * Math.min(1, dt * 10);
        const power = d.power?.[k] ?? 1;
        const bag = tw.bag;
        bag.uHover.value = tw.hover * 0.8 + (isSel ? 0.35 : 0);
        bag.uPower.value = (bag.uPower.value as number) + (power - (bag.uPower.value as number)) * Math.min(1, dt * 2);
        bag.uPulse.value = Math.max(0, (bag.uPulse.value as number) - dt * 0.45);
        const down = (k === "site" && d.status.site === false) || (k === "korvus" && d.status.korvus === false) || (k === "crown" && d.status.crown === false);
        bag.uAlert.value = down ? 1 : 0;
        hot[tw.i] += ((isSel ? 0.75 + 0.25 * Math.sin(t * 3) : isHover ? 0.5 : 0) - hot[tw.i]) * Math.min(1, dt * 8);
        dists[tw.i].w = hot[tw.i] + (bag.uPulse.value as number) * 0.8;
        const glow = (0.35 + 0.65 * power) * (1 + tw.hover * 0.6);
        tw.halo.opacity = 0.5 * glow;
        tw.beam.uniforms.uGain.value = 0.22 * glow + (bag.uPulse.value as number) * 0.6;
        tw.ring.rotation.set(Math.PI / 2 + Math.sin(t * 0.6 + tw.i) * 0.35, t * (0.5 + power * 0.9) + tw.i, 0);
        tw.ring.scale.setScalar(1 + tw.hover * 0.25);
        tw.el.classList.toggle("hot", isHover);
      }

      // traffic
      const active = Math.min(CARS, 110 + Math.max(0, d.trafficPackets) * 50);
      for (let i = 0; i < active; i++) {
        const c = cars[i];
        c.s += c.v * c.dir * adt;
        if (c.s > c.span) c.s -= 2 * c.span;
        else if (c.s < -c.span) c.s += 2 * c.span;
        const lane = c.road + (c.alongZ ? -c.dir : c.dir) * 0.42;
        const hx = c.alongZ ? lane : c.s + c.dir * 0.24, hz = c.alongZ ? c.s + c.dir * 0.24 : lane;
        const tx = c.alongZ ? lane : c.s - c.dir * 0.24, tz = c.alongZ ? c.s - c.dir * 0.24 : lane;
        carPos.set([hx, 0.13, hz, tx, 0.13, tz], i * 6);
      }
      carGeo.setDrawRange(0, active * 2);
      carGeo.attributes.position.needsUpdate = true;

      // skyway packets
      packets.forEach((p, s) => {
        const on = p.r.key === "traffic" ? p.idx < d.trafficPackets : p.r.key === "gold" ? d.goldActive : true;
        if (!on) {
          if (p.on) hideSlot(s);
          p.on = false;
          return;
        }
        p.on = true;
        p.t = (p.t + adt * p.r.speed * (d.clicksActive || p.r.key !== "clicks" ? 1 : 0.35)) % 1;
        writeTrail(s, (u) => p.r.curve.getPointAt(u), p.t, 0.011);
      });
      spawnWire();
      sparks.forEach((s, i) => {
        if (!s) return;
        const slot = packets.length + i;
        s.t += dt * 0.5;
        if (s.t >= 1) {
          const to = byKey[s.to];
          to.bag.uPulse.value = 1;
          const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
          mat.color.copy(s.tone).multiplyScalar(1.8);
          const ring = new THREE.Mesh(rippleGeo, mat);
          ring.rotation.x = -Math.PI / 2;
          ring.position.set(to.d.gx * P, 0.05, to.d.gz * P);
          scene.add(ring);
          ripples.push({ mesh: ring, age: 0 });
          hideSlot(slot);
          sparks[i] = null;
          return;
        }
        writeTrail(slot, (u) => s.curve.getPoint(u), s.t, 0.018);
      });
      fxGeo.attributes.position.needsUpdate = true;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r0 = ripples[i];
        r0.age += dt;
        const k = r0.age / 1.4;
        r0.mesh.scale.setScalar(1 + k * 14);
        (r0.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 * (1 - k));
        if (k >= 1) {
          scene.remove(r0.mesh);
          (r0.mesh.material as THREE.Material).dispose();
          ripples.splice(i, 1);
        }
      }

      groundU.uRain.value += ((rainOn ? 1 : 0) - groundU.uRain.value) * Math.min(1, dt * 0.8);
      (rainMat.uniforms.uCenter.value as THREE.Vector3).copy(controls.target);
      applyData();

      // tags: pinned above each tower; where two would collide the farther
      // one rides higher on a longer stem
      const w = W(), h = H();
      const seen: Tower[] = [];
      for (const tw of towers) {
        v.copy(tw.anchor).project(camera);
        const vis = v.z < 1 && Math.abs(v.x) < 1.15 && Math.abs(v.y) < 1.2;
        if (vis !== tw.shown) {
          tw.shown = vis;
          tw.el.style.display = vis ? "" : "none";
        }
        if (!vis) continue;
        tw.sx = Math.round(((v.x + 1) / 2) * w);
        tw.sy = Math.round(((1 - v.y) / 2) * h);
        seen.push(tw);
      }
      measureIn -= dt;
      if (measureIn <= 0) {
        measureIn = 1.5;
        for (const tw of seen) tw.wpx = tw.el.offsetWidth || tw.wpx;
      }
      seen.sort((a, b) => b.sy - a.sy);
      for (let i = 0; i < seen.length; i++) {
        const tw = seen[i];
        let want = 0;
        for (let pass = 0; pass < 4; pass++) {
          let moved = false;
          for (let j = 0; j < i; j++) {
            const q = seen[j];
            if (Math.abs(tw.sx - q.sx) < (tw.wpx + q.wpx) / 2 + 6 && Math.abs(tw.sy - want - (q.sy - q.lift)) < 40) {
              want = tw.sy - (q.sy - q.lift) + 40;
              moved = true;
            }
          }
          if (!moved) break;
        }
        tw.lift += (Math.min(170, Math.max(0, want)) - tw.lift) * Math.min(1, dt * 9);
        const lc = Math.round(tw.lift / 2) * 2;
        if (lc !== tw.liftCss) tw.el.style.setProperty("--lift", (tw.liftCss = lc) + "px");
        const tf = `translate(${tw.sx}px,${tw.sy}px) translate(-50%,-100%)`;
        if (tf !== tw.tf) tw.el.style.transform = tw.tf = tf;
      }

      composer.render();

      // trim render scale while frames run long, hand it back while they run
      // clean, never returning to a scale that was already too slow
      ema = ema * 0.94 + Math.min(250, raw * 1000) * 0.06;
      warm += dt;
      statIn -= dt;
      if (statIn <= 0) {
        statIn = 1;
        const fpsNow = Math.round(1000 / ema);
        host.dataset.fps = String(fpsNow);
        host.dataset.res = pr.toFixed(2);
        if (statRef.current) statRef.current.textContent = `${fpsNow} fps \u00b7 ${pr.toFixed(2)}x${mirror.visible ? "" : " \u00b7 no reflections"}${bloom.enabled ? "" : " \u00b7 no glow"}`;
      }
      if (quality === "auto" && warm > 2.5) {
        const step = Math.min(0.25, raw);
        slowFor = ema > 24 ? slowFor + step : 0;
        fastFor = ema < 18.5 ? fastFor + step : 0;
        let to = rung;
        if (slowFor > 1.5 && rung < LADDER.length - 1) {
          floorRung = rung + 1;
          to = rung + 1;
        } else if (fastFor > 6 && rung > floorRung) {
          to = rung - 1;
        }
        if (to !== rung) {
          slowFor = fastFor = 0;
          rung = to;
          mirror.visible = LADDER[rung].mirror;
          bloom.enabled = LADDER[rung].bloom;
          if (LADDER[rung].s !== pr) {
            pr = LADDER[rung].s;
            resize();
          }
        }
      }
    };
    applyData();
    frame();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      api.current = { view: () => {}, orbit: () => {}, rain: () => {}, select: () => {} };
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      cv.removeEventListener("pointerdown", onDown);
      cv.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      controls.dispose();
      for (const r0 of ripples) (r0.mesh.material as THREE.Material).dispose();
      for (const x of disposables) x.dispose();
      skyline.dispose();
      skylineMirror.dispose();
      rt.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      tags.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOrbit = () => {
    const on = !orbit;
    setOrbit(on);
    api.current.orbit(on);
  };
  const toggleRain = () => {
    const on = !rain;
    setRain(on);
    try {
      localStorage.setItem("c3d-rain", on ? "1" : "0");
    } catch {}
    api.current.rain(on);
  };

  return (
    <div className="city3d">
      <div className="c3d-host" ref={hostRef} />
      <div className="c3d-tags" ref={tagsRef} />
      <div className="c3d-ctl">
        <div className="c3d-ctl-row" role="group" aria-label="Camera">
          <button onClick={() => api.current.view("overview")}>Overview</button>
          <button onClick={() => api.current.view("street")}>Street</button>
          <button onClick={() => api.current.view("top")}>Plan</button>
        </div>
        <div className="c3d-ctl-row" role="group" aria-label="Scene">
          <button className={orbit ? "on" : ""} onClick={toggleOrbit} aria-pressed={orbit}>
            Orbit
          </button>
          <button className={rain ? "on" : ""} onClick={toggleRain} aria-pressed={rain}>
            Rain
          </button>
        </div>
        <div className="c3d-hint">Drag to look around, scroll to zoom, click a tower to step inside</div>
        <div className="c3d-stat" ref={statRef} />
      </div>
    </div>
  );
};
