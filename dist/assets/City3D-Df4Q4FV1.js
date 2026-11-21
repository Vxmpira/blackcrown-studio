import{r as U,C as Q,V as j,S as Ko,P as Xo,W as Zo,A as Yo,a as Qo,H as Jo,E as ea,R as ta,U as oa,b as yt,O as aa,c as wo,F as sa,d as ae,B as na,M as K,e as ra,G as ia,f as la,I as wt,g as ca,h as ua,i as Me,D as da,j as fa,k as pa,L as va,l as ma,m as ha,n as ga,o as wa,p as xa,q as ya,T as ba,s as xo,t as He,u as se,v as Sa,w as Ma,x as yo,y as Ca,z as xt,J as ue,K as bo,N as ka,Q as So,X as Fa,Y as E,Z as Da,_ as Ve,$ as za,a0 as Ra}from"./index-BwtP0W1r.js";const b=7,A=1,Mo=.45,J=6,B=5,de=[{key:"world",label:"THE WORLD",gx:-4,gz:1,h:4.4,shape:"terminal"},{key:"site",label:"BLACKCROWNVXJ.COM",gx:0,gz:0,h:10.6,big:!0,shape:"stepped"},{key:"korvus",label:"KORVUS",gx:3,gz:-2,h:7.6,shape:"classic"},{key:"crown",label:"CROWN",gx:3,gz:0,h:7.9,shape:"stepped"},{key:"eclipse",label:"ECLIPSE-X",gx:3,gz:2,h:6.2,shape:"slab"},{key:"stripe",label:"STRIPE",gx:-2,gz:3,h:5.6,shape:"classic"},{key:"corvid",label:"CORVID",gx:-2,gz:-1,h:7.1,shape:"stepped"},{key:"herald",label:"HERALD",gx:-4,gz:-1,h:6.6,shape:"classic"},{key:"steward",label:"STEWARD",gx:-2,gz:-3,h:7.3,shape:"slab"},{key:"bard",label:"BARD",gx:-4,gz:-3,h:6.8,shape:"stepped"},{key:"regent",label:"REGENT",gx:0,gz:-3,h:8.4,shape:"classic"},{key:"you",label:"YOU",gx:2,gz:-4,h:10.9,big:!0,shape:"stepped"}],h={pink:16723349,cyan:4646655,gold:15911244,up:3530895,down:16734810},Ce={world:h.cyan,site:h.pink,korvus:h.pink,crown:h.pink,eclipse:h.pink,stripe:h.gold,corvid:h.pink,herald:h.cyan,steward:h.up,bard:11623423,regent:h.gold,you:16777215},Fo=`
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
`,Co=`
#ifdef USE_INSTANCING
attribute float aSeed;
#endif
uniform float uSeed;
varying vec3 vLocal; varying vec3 vN; varying vec3 vScale; varying float vSeed; varying float vDepth; varying vec3 vWorld; varying vec4 vStyle;
${Fo}
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
}`,Pa=`
uniform float uTime; uniform vec3 uAccent; uniform float uTrim; uniform float uPower; uniform float uHover;
uniform float uPulse; uniform float uAlert; uniform float uMirror; uniform vec3 uFogColor; uniform float uFogDensity; uniform vec3 uMoonDir;
varying vec3 vLocal; varying vec3 vN; varying vec3 vScale; varying float vSeed; varying float vDepth; varying vec3 vWorld; varying vec4 vStyle;
${Fo}
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
}`,Aa=`
varying vec3 vWorld; varying float vDepth;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vec4 mv = viewMatrix * wp;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,Ea=`
#define ND ${de.length}
uniform float uTime; uniform float uRain; uniform vec3 uFogColor; uniform float uFogDensity;
uniform vec4 uDist[ND]; uniform vec3 uDistCol[ND]; uniform sampler2D uNoise;
varying vec3 vWorld; varying float vDepth;
float ln(float dist, float hw, float aw){ return (1.0 - smoothstep(hw, hw + aw, dist)) * clamp(hw * 2.5 / (aw + 0.0001), 0.0, 1.0); }
// paint on a road running along b: a = across (from centerline), b = along
vec3 paint(float a, float qa, float b, float qb, float aw){
  float center = ln(a, 0.035, aw) * step(0.5, fract(b / 1.4));
  float edges = ln(abs(a - ${(A-.1).toFixed(2)}), 0.02, aw);
  float cross = step(${(A+.12).toFixed(2)}, qb) * step(qb, ${(A+.62).toFixed(2)}) * step(a, ${(A-.14).toFixed(2)}) * step(0.5, fract(qa / 0.3)) * clamp(0.3 / (aw + 0.0001), 0.0, 1.0);
  return vec3(1.0, 0.18, 0.58) * center * 0.55 + vec3(0.9, 0.9, 1.0) * (edges * 0.07 + cross * 0.1);
}
void main(){
  vec2 p = vWorld.xz;
  float aw = fwidth(p.x) + fwidth(p.y);
  float city = 1.0 - smoothstep(${(B*b+2).toFixed(1)}, ${(B*b+20).toFixed(1)}, max(abs(p.x) * ${(B/J).toFixed(3)}, abs(p.y)));
  vec2 q = mod(p, ${b.toFixed(1)}) - ${(b/2).toFixed(1)};
  vec2 d = abs(q);
  float dr = min(d.x, d.y);
  float road = (1.0 - smoothstep(${A.toFixed(2)} - aw, ${A.toFixed(2)} + aw, dr)) * city;
  float walk = (1.0 - smoothstep(${(A+Mo).toFixed(2)} - aw, ${(A+Mo).toFixed(2)} + aw, dr)) * (1.0 - road) * city;
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
  float inter = step(d.x, ${A.toFixed(2)}) * step(d.y, ${A.toFixed(2)});
  if (d.x < ${A.toFixed(2)} && inter < 0.5) emis += paint(d.x, q.x, p.y, d.y, aw) * city;
  if (d.y < ${A.toFixed(2)} && inter < 0.5) emis += paint(d.y, q.y, p.x, d.x, aw) * city;
  // street lamps: warm pools on both sides of every road
  float la = ${(A+.22).toFixed(2)};
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
}`,Ta="varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",La=`
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
}`,Ga=`
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
}`,Na=`
uniform float uGain; varying vec3 vC; varying float vA;
void main(){
  vec2 c = gl_PointCoord - 0.5; float d2 = dot(c, c);
  float a = (exp(-d2 * 26.0) + 0.22 * exp(-d2 * 7.0)) * (1.0 - smoothstep(0.12, 0.25, d2));
  if (a < 0.012) discard;
  gl_FragColor = vec4(vC * a * vA * uGain, 1.0);
}`,Ia="varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",_a="uniform vec3 uColor; uniform float uGain; varying vec2 vUv; void main(){ gl_FragColor = vec4(uColor * pow(1.0 - vUv.y, 2.4) * uGain, 1.0); }",Wa=`
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
}`,$a="varying float vA; void main(){ gl_FragColor = vec4(vec3(0.55, 0.65, 0.9) * 0.95 * vA, 1.0); }",Oa={uniforms:{tDiffuse:{value:null},uTime:{value:0},uRes:{value:new yt(1,1)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
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
}`};function Ua(){try{const ne=localStorage.getItem("bx-quality");return ne==="high"||ne==="eco"?ne:"auto"}catch{return"auto"}}function ko(){try{return localStorage.getItem("c3d-rain")==="1"}catch{return!1}}const Ba=({data:ne,onSelect:bt,selected:qe})=>{const St=U.useRef(null),Mt=U.useRef(null),Ke=U.useRef(null),ke=U.useRef(ne);ke.current=ne;const ee=U.useRef(bt);ee.current=bt;const[Xe,Fe]=U.useState(!0),[Ze,Do]=U.useState(ko),X=U.useRef({view:()=>{},orbit:()=>{},rain:()=>{},select:()=>{}});U.useEffect(()=>{qe!==void 0&&X.current.select(qe)},[qe]),U.useEffect(()=>{const z=St.current,De=Mt.current;if(!z||!De)return;const ze=window.matchMedia("(prefers-reduced-motion: reduce)").matches,_=()=>z.clientWidth||800,T=()=>z.clientHeight||520,Ct=window.devicePixelRatio||1,fe=Ua();let k=fe==="high"?Math.min(Ct,1.5):fe==="eco"?.75:Math.min(Ct,1.25);const pe=[{s:k,mirror:!0,bloom:!0},{s:Math.min(k,.85),mirror:!0,bloom:!0},{s:Math.min(k,.85),mirror:!1,bloom:!0},{s:.7,mirror:!1,bloom:!0},{s:.7,mirror:!1,bloom:!1},{s:.58,mirror:!1,bloom:!1}];let L=0,kt=0;const Ft=[],w=e=>(Ft.push(e),e),Dt=new Q(.02,.008,.03),Po=new j(.03,.19,-1).normalize(),$={uTime:{value:0},uFogColor:{value:Dt},uFogDensity:{value:.0105},uMoonDir:{value:new j(-.55,.4,.62).normalize()}},M=new Ko,P=new Xo(44,_()/T(),.1,500),D=new Zo({antialias:!1,powerPreference:"high-performance"});D.setPixelRatio(k),D.setSize(_(),T()),D.setClearColor(Dt,1),D.toneMapping=Yo,D.toneMappingExposure=1,z.appendChild(D.domElement),D.domElement.style.cursor="grab";const zt=new Qo(_()*k,T()*k,{type:Jo}),W=new ea(D,zt);W.setPixelRatio(k),W.setSize(_(),T()),W.addPass(new ta(M,P));const Re=new oa(new yt(_(),T()),.42,.5,.9);Re.enabled=fe!=="eco",W.addPass(Re),W.addPass(new aa);const Rt=new wo(sa);W.addPass(Rt);const Ye=new wo(Oa);W.addPass(Ye);const Ao=w(new ae({uniforms:{uFogColor:$.uFogColor,uEcl:{value:Po},uTime:$.uTime},vertexShader:Ta,fragmentShader:La,side:na,depthWrite:!1})),Qe=new K(w(new ra(240,40,20)),Ao);Qe.renderOrder=5,M.add(Qe);const O=new ia;O.scale.y=-1,O.visible=fe!=="eco",M.add(O);const Pe=(e,t=!1)=>w(new ae({uniforms:e,vertexShader:Co,fragmentShader:Pa,defines:t?{MIRROR:""}:{}})),Pt=(e,t,s)=>({...$,uAccent:{value:new Q(e)},uTrim:{value:t},uPower:{value:1},uHover:{value:0},uPulse:{value:0},uAlert:{value:0},uMirror:{value:0},uSeed:{value:s}}),Ae=w(new la(1,1,1)),S=(()=>{let e=20260911;return()=>(e=e*16807%2147483647)/2147483647})(),Eo=new Set(de.map(e=>`${e.gx},${e.gz}`)),te=[],re=[];for(let e=-J;e<=J;e++)for(let t=-B;t<=B;t++){if(Eo.has(`${e},${t}`))continue;const s=e*b,n=t*b,r=Math.hypot(s*.8,n),i=Ve.lerp(6,1.3,Ve.smoothstep(r,6,36)),d=(l,f,g,c,u)=>{const o=Math.floor(S()*900);if(te.push({x:l,z:f,w:g,d:c,h:u,y:0,seed:o}),u>3.2&&S()<.5){const a=u*(.18+S()*.22);te.push({x:l,z:f,w:g*.66,d:c*.66,h:a,y:u,seed:o}),u+=a}u>4.6&&re.push(l+(S()-.5)*g*.4,u+.12,f+(S()-.5)*c*.4,.05+S()*.9)};if(S()<.16)d(s,n,3.3+S()*.7,3.3+S()*.7,i*(.45+S()*.5));else for(const l of[-1.03,1.03])for(const f of[-1.03,1.03]){if(S()<.13)continue;const g=S()<.08?1.3:1;d(s+l,n+f,1.4+S()*.5,1.4+S()*.5,Math.min(6.4,i*(.35+S()*.65)*g))}}const To=w(new ae({uniforms:{uSeed:{value:0}},vertexShader:Co,fragmentShader:"void main(){ gl_FragColor = vec4(0.0); }",colorWrite:!1})),At=Pt(0,0,0),oe=new wt(Ae,Pe(At),te.length),Et=new Float32Array(te.length),Je=new ca;te.forEach((e,t)=>{Je.makeScale(e.w,e.h,e.d),Je.setPosition(e.x,e.y+e.h/2,e.z),oe.setMatrixAt(t,Je),Et[t]=e.seed});const Ee=w(Ae.clone());Ee.setAttribute("aSeed",new ua(Et,1)),oe.geometry=Ee,oe.frustumCulled=!1,M.add(oe);const ve=new wt(Ee,Pe({...At,uMirror:{value:1}},!0),te.length);ve.instanceMatrix=oe.instanceMatrix,ve.frustumCulled=!1,O.add(ve);for(const[e,t]of[[M,oe],[O,ve]]){const s=new wt(Ee,To,te.length);s.instanceMatrix=t.instanceMatrix,s.frustumCulled=!1,s.renderOrder=-5,e.add(s)}const Tt=[],me=e=>{const t=w(new ae({uniforms:{uTime:$.uTime,uScale:{value:1},uFogDensity:$.uFogDensity,uGain:{value:e}},vertexShader:Ga,fragmentShader:Na,vertexColors:!0,transparent:!0,depthWrite:!1,blending:se}));return Tt.push(t),t},et=(e,t,s,n)=>{const r=w(new xt);return r.setAttribute("position",new ue(e,3)),r.setAttribute("color",new ue(t,3)),r.setAttribute("size",new ue(s,1)),r.setAttribute("phase",new ue(n||new Float32Array(s.length),1)),r};{const e=[],t=[],s=[],n=[],r=J*b+b/2,i=B*b+b/2,d=A+.22;for(let c=-J-1;c<=J;c++){const u=(c+.5)*b;for(let o=-i+1.75;o<i;o+=3.5)for(const a of[-1,1])e.push(u+a*d,.62,o),t.push(1,.66,.36),s.push(.3),n.push(0)}for(let c=-B-1;c<=B;c++){const u=(c+.5)*b;for(let o=-r+1.75;o<r;o+=3.5)for(const a of[-1,1])e.push(o,.62,u+a*d),t.push(1,.66,.36),s.push(.3),n.push(0)}for(let c=0;c<re.length;c+=4)e.push(re[c],re[c+1],re[c+2]),t.push(2.4,.16,.12),s.push(.42),n.push(re[c+3]);const l=et(e,t,s,n),f=new Me(l,me(1));f.frustumCulled=!1,M.add(f);const g=new Me(l,me(.5));g.frustumCulled=!1,O.add(g)}const ie=260,Lo=Array.from({length:ie},()=>{const e=S()<.5,t=S()<.5?1:-1,s=e?2*J+2:2*B+2,n=(Math.floor(S()*s)-s/2+.5)*b,r=(e?B:J)*b+b/2;return{alongZ:e,dir:t,road:n,span:r,s:(S()*2-1)*r,v:2.4+S()*2.6}}),Lt=new Float32Array(ie*2*3),tt=new Float32Array(ie*2*3),ot=new Float32Array(ie*2);for(let e=0;e<ie;e++)tt.set([2.3,2.1,1.8],e*6),tt.set([2.2,.14,.1],e*6+3),ot[e*2]=.27,ot[e*2+1]=.24;const Te=et(Lt,tt,ot),Gt=new Me(Te,me(1));Gt.frustumCulled=!1,M.add(Gt);const Nt=new Me(Te,me(.55));Nt.frustumCulled=!1,O.add(Nt);const Go=w((()=>{const t=new Uint8Array(65536),s=(i,d,l)=>{const f=Math.sin(i*127.1+d*311.7+l*74.7)*43758.5453;return f-Math.floor(f)},n=(i,d,l,f)=>{const g=Math.floor(i),c=Math.floor(d);let u=i-g,o=d-c;u=u*u*(3-2*u),o=o*o*(3-2*o);const a=(g%l+l)%l,p=(a+1)%l,y=(c%l+l)%l,F=(y+1)%l,m=s(a,y,f),N=s(p,y,f),I=s(a,F,f),C=s(p,F,f);return m+(N-m)*u+(I-m)*o+(m-N-I+C)*u*o};for(let i=0;i<128;i++)for(let d=0;d<128;d++){const l=d/128,f=i/128,g=(i*128+d)*4;t[g]=Math.round((n(l*4,f*4,4,1)*.65+n(l*8,f*8,8,2)*.35)*255),t[g+1]=Math.round((n(l*6,f*6,6,3)*.6+n(l*16,f*16,16,4)*.4)*255),t[g+2]=Math.round(s(d,i,5)*255),t[g+3]=255}const r=new da(t,128,128,fa);return r.wrapS=r.wrapT=pa,r.magFilter=va,r.minFilter=ma,r.generateMipmaps=!0,r.needsUpdate=!0,r})()),at=de.map(()=>0),Le={uNoise:{value:Go},uTime:$.uTime,uRain:{value:0},uFogColor:$.uFogColor,uFogDensity:$.uFogDensity,uDist:{value:de.map(e=>new ha(e.gx*b,e.gz*b,e.big?2.75:2.45,0))},uDistCol:{value:de.map(e=>new Q(Ce[e.key]))}},st=new K(w(new ga(700,700)),w(new ae({uniforms:Le,vertexShader:Aa,fragmentShader:Ea,transparent:!0,depthWrite:!1})));st.rotation.x=-Math.PI/2,st.renderOrder=-1,M.add(st);const No=w((()=>{const e=document.createElement("canvas");e.width=e.height=64;const t=e.getContext("2d"),s=t.createRadialGradient(32,32,2,32,32,30);s.addColorStop(0,"rgba(255,255,255,0.9)"),s.addColorStop(.35,"rgba(255,255,255,0.3)"),s.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=s,t.fillRect(0,0,64,64);const n=new wa(e);return n.colorSpace=xa,n})()),he=[],Z={},nt=[],Io=w(new ya(.36,2)),_o=w(new ba(.66,.022,6,48)),Wo=w(new xo(.04,.11,17,12,1,!0)),$o=(e,t)=>e.shape==="stepped"?[{w:t,d:t,h:e.h*.48},{w:t*.78,d:t*.78,h:e.h*.28},{w:t*.56,d:t*.56,h:e.h*.16},{w:t*.34,d:t*.34,h:e.h*.08}]:e.shape==="slab"?[{w:t*1.3,d:t*.72,h:e.h*.82},{w:t*.82,d:t*.46,h:e.h*.18}]:e.shape==="terminal"?[{w:t*1.55,d:t*1.05,h:e.h*.62},{w:t*.9,d:t*.62,h:e.h*.38}]:[{w:t,d:t,h:e.h*.74},{w:t*.66,d:t*.66,h:e.h*.2},{w:t*.36,d:t*.36,h:e.h*.06}];de.forEach((e,t)=>{const s=Ce[e.key]??h.pink,n=Pt(s,1,911+t*7),r=Pe(n),i=Pe({...n,uMirror:{value:1}},!0),d=e.gx*b,l=e.gz*b,f=e.big?2.9:2.3,g=(q,Vo,go,qo)=>{const Y=new K(Ae,r);Y.scale.set(q,go,Vo),Y.position.set(d,qo+go/2,l),Y.userData.key=e.key,Y.renderOrder=-3,nt.push(Y),M.add(Y);const gt=new K(Ae,i);gt.scale.copy(Y.scale),gt.position.copy(Y.position),O.add(gt)};g(e.big?4:3.6,e.big?4:3.6,.32,0);let c=.32;for(const q of $o(e,f))g(q.w,q.d,q.h,c),c+=q.h;let u=c;if(e.big){const q=new K(w(new xo(.03,.1,2.2,6)),w(new He({color:1381660})));q.position.set(d,u+1.1,l),M.add(q),u+=2.2}const o=w(new He),a=new K(Io,o);a.position.set(d,u+.75,l),a.userData.key=e.key,nt.push(a),M.add(a);const p=w(new He({transparent:!0,opacity:.9,blending:se,depthWrite:!1}));p.color.set(s).multiplyScalar(1.6);const y=new K(_o,p);y.position.copy(a.position),M.add(y);const F=w(new Sa({map:No,color:s,transparent:!0,opacity:.7,depthWrite:!1,blending:se})),m=new Ma(F);m.scale.setScalar(e.big?2.6:2),m.position.copy(a.position),M.add(m);const N=w(new ae({uniforms:{uColor:{value:new Q(s)},uGain:{value:.5}},vertexShader:Ia,fragmentShader:_a,transparent:!0,depthWrite:!1,blending:se,side:yo})),I=new K(Wo,N);I.position.set(d,u+.75+8.5,l),M.add(I);const C=document.createElement("button");C.type="button",C.className="c3d-label"+(e.big?" c3d-big":""),C.style.setProperty("--c","#"+new Q(s).getHexString()),C.innerHTML=`<span class="c3d-tag"><i></i><span class="c3d-name">${e.label}</span><span class="c3d-sub"></span></span><span class="c3d-stem"></span>`,De.appendChild(C);const ho={d:e,i:t,bag:n,top:u,core:a,coreMat:o,halo:F,beam:N,ring:y,el:C,sub:C.querySelector(".c3d-sub"),anchor:new j(d,u+1.5,l),hover:0,tf:"",shown:!0,sx:0,sy:0,wpx:120,lift:0,liftCss:0};C.addEventListener("click",()=>We(e.key,!0)),C.addEventListener("pointerenter",()=>Oe=e.key),C.addEventListener("pointerleave",()=>{Oe===e.key&&(Oe=null)}),he.push(ho),Z[e.key]=ho});const H=7,It=[],Oo=w(new Ca({transparent:!0,opacity:.16,blending:se,depthWrite:!1,vertexColors:!0})),_t=[],Wt=[],R=(e,t,s,n,r=1,i=.1)=>{const d=Z[e].core.position.clone(),l=Z[t].core.position.clone(),f=d.clone().lerp(l,.5);f.y+=d.distanceTo(l)*.2+2;const g=new Da([d,f,l]),c=g.getPoints(36),u=new Q(s);for(let o=0;o<c.length-1;o++)_t.push(c[o].x,c[o].y,c[o].z,c[o+1].x,c[o+1].y,c[o+1].z),Wt.push(u.r,u.g,u.b,u.r,u.g,u.b);It.push({curve:g,key:n,tone:u,speed:i,n:r})};R("world","site",h.cyan,"traffic",3,.12),R("site","korvus",h.pink,"clicks",1,.09),R("site","crown",h.pink,"clicks",1,.08),R("site","eclipse",h.pink,"clicks",1,.085),R("stripe","you",h.gold,"gold",1,.07),R("corvid","regent",h.pink,"agents",1,.14),R("regent","you",h.pink,"agents",1,.16),R("corvid","site",h.cyan,"agents",1,.06),R("herald","regent",h.pink,"agents",1,.11),R("stripe","herald",h.gold,"agents",1,.07),R("steward","regent",h.pink,"agents",1,.12),R("steward","corvid",h.cyan,"agents",1,.09),R("steward","eclipse",h.pink,"agents",1,.05),R("bard","regent",11623423,"agents",1,.1),R("herald","bard",h.cyan,"agents",1,.07);{const e=w(new xt);e.setAttribute("position",new ue(_t,3)),e.setAttribute("color",new ue(Wt,3)),M.add(new bo(e,Oo))}const le=[];It.forEach(e=>{for(let t=0;t<e.n;t++)le.push({r:e,t:t/e.n,idx:t,on:!0})});const $t=14,Ge=Array.from({length:$t},()=>null),rt=(le.length+$t)*H,it=new Float32Array(rt*3).fill(-999),Ot=new Float32Array(rt*3),Ut=new Float32Array(rt),jt=(e,t,s)=>{for(let n=0;n<H;n++){const r=1-n/H;Ot.set([t.r*2.4*r,t.g*2.4*r,t.b*2.4*r],(e*H+n)*3),Ut[e*H+n]=s*(.25+.75*r)}};le.forEach((e,t)=>jt(t,e.r.tone,.62));const Ne=et(it,Ot,Ut),Bt=new Me(Ne,me(1));Bt.frustumCulled=!1,M.add(Bt);const Ie=new j,Ht=(e,t,s,n)=>{for(let r=0;r<H;r++){const i=Math.max(0,s-r*n);Ie.copy(t(i)),it.set([Ie.x,Ie.y,Ie.z],(e*H+r)*3)}},Vt=e=>{for(let t=0;t<H;t++)it[(e*H+t)*3+1]=-999},ge=[],Uo=w(new ka(.42,.5,48));let lt=Date.now();const jo=()=>{const e=ke.current.wire||[];let t=lt;for(const s of e){if(s.t<=lt)continue;s.t>t&&(t=s.t);const n=Z[s.from],r=Z[s.to],i=Ge.findIndex(c=>!c);if(!n||!r||n===r||i<0)continue;const d=n.core.position.clone(),l=r.core.position.clone(),f=d.clone().lerp(l,.5);f.y+=d.distanceTo(l)*.3+3;const g=new Q(Ce[s.from]??h.pink);Ge[i]={curve:new Ra(d,f,l),t:0,to:s.to,tone:g},jt(le.length+i,g,1.15),Ne.attributes.color.needsUpdate=!0,Ne.attributes.size.needsUpdate=!0,n.bag.uPulse.value=Math.max(n.bag.uPulse.value,.5)}lt=t},ct=1500,qt=new Float32Array(ct*6),Kt=new Float32Array(ct*2);for(let e=0;e<ct;e++){const t=(Math.random()-.5)*80,s=Math.random()*30,n=(Math.random()-.5)*80;qt.set([t,s,n,t,s,n],e*6),Kt[e*2+1]=1}const ut=w(new xt);ut.setAttribute("position",new So(qt,3)),ut.setAttribute("aEnd",new So(Kt,1));const Xt=w(new ae({uniforms:{uTime:$.uTime,uCenter:{value:new j}},vertexShader:Wa,fragmentShader:$a,transparent:!0,depthWrite:!1,blending:se})),we=new bo(ut,Xt);we.frustumCulled=!1,we.visible=ko(),M.add(we);let Zt=we.visible;const xe=new j(-3,3.2,-4),_e=54,x=new Fa(P,D.domElement);x.target.copy(xe),x.enableDamping=!0,x.dampingFactor=.07,x.minDistance=4,x.maxDistance=110,x.autoRotate=!ze,x.autoRotateSpeed=.35;const Yt=new j(-.34,.31,.89).normalize();P.position.copy(xe).addScaledVector(Yt,ze?_e:96);const v={active:!ze,target:xe.clone(),dist:_e,dir:null};x.addEventListener("start",()=>{v.active=!1,x.autoRotate&&(x.autoRotate=!1,Fe(!1))});let ye=null;const Bo=e=>{const t=e?Z[e]:null;t?(v.target.set(t.d.gx*b,t.top*.5,t.d.gz*b),v.dist=13+t.top*.75):(v.target.copy(xe),v.dist=_e),v.dir=null,v.active=!0,x.autoRotate&&(x.autoRotate=!1,Fe(!1))},Qt=e=>{ye=e;for(const t of he)t.el.classList.toggle("sel",t.d.key===e);De.classList.toggle("has-sel",!!e)};function We(e,t){var s;e===ye&&(!t||!e)||(Qt(e),Bo(e),t&&((s=ee.current)==null||s.call(ee,e)))}X.current={select:e=>{e!==ye&&We(e&&Z[e]?e:null,!1)},view:e=>{var t;Qt(null),(t=ee.current)==null||t.call(ee,null),e==="street"?(v.target.set(3.5,3.4,2),v.dist=23,v.dir=new j(0,-.128,.992).normalize()):e==="top"?(v.target.set(-3,0,-3),v.dist=82,v.dir=new j(0,1,.012).normalize()):(v.target.copy(xe),v.dist=_e,v.dir=Yt.clone()),v.active=!0,x.autoRotate&&(x.autoRotate=!1,Fe(!1))},orbit:e=>{x.autoRotate=e,e&&(v.active=!1)},rain:e=>{Zt=e,we.visible=e}};const Jt=new za,eo=new yt;let dt=!1,ft=!1,$e=null,Oe=null,be=null;const to=e=>{const t=D.domElement.getBoundingClientRect();eo.set((e.clientX-t.left)/t.width*2-1,-((e.clientY-t.top)/t.height)*2+1)},oo=()=>{Jt.setFromCamera(eo,P);const e=Jt.intersectObjects(nt,!1)[0];return e?e.object.userData.key:null},ao=e=>{to(e),dt=!0,ft=!0},so=()=>{dt=!1,$e=null,D.domElement.style.cursor="grab"},no=e=>{be={x:e.clientX,y:e.clientY}},ro=e=>{if(!be)return;const t=Math.hypot(e.clientX-be.x,e.clientY-be.y);be=null,!(t>6)&&(to(e),We(oo(),!0))},io=e=>{e.key==="Escape"&&ye&&We(null,!0)},V=D.domElement;V.addEventListener("pointermove",ao),V.addEventListener("pointerleave",so),V.addEventListener("pointerdown",no),V.addEventListener("pointerup",ro),window.addEventListener("keydown",io);const pt=()=>{P.aspect=_()/T(),P.updateProjectionMatrix(),D.setPixelRatio(k),D.setSize(_(),T()),W.setPixelRatio(k),W.setSize(_(),T()),Rt.uniforms.resolution.value.set(1/(_()*k),1/(T()*k)),Ye.uniforms.uRes.value.set(_()*k,T()*k);const e=T()*k/(2*Math.tan(P.fov*Math.PI/360));for(const t of Tt)t.uniforms.uScale.value=e},lo=new ResizeObserver(pt);lo.observe(z),pt();let co=!0;const uo=new IntersectionObserver(e=>{var t;co=((t=e[0])==null?void 0:t.isIntersecting)??!0});uo.observe(z);const Ho=(e,t)=>e===!0?h.up:e===!1?h.down:t,Ue=new Q,fo=()=>{var n;const e=ke.current,t={site:e.status.site,korvus:e.status.korvus,crown:e.status.crown},s={world:e.worldSub,stripe:e.stripeSub,regent:e.regentSub,herald:e.heraldSub||"",steward:e.stewardSub||"",bard:e.bardSub||"",...e.subs||{}};for(const r of he){const i=r.d.key,d=s[i]||"";r.sub.textContent!==d&&(r.sub.textContent=d);const l=i in t?Ho(t[i],Ce[i]):Ce[i],f=((n=e.power)==null?void 0:n[i])??1;Ue.set(l),r.halo.color.copy(Ue),r.coreMat.color.copy(Ue).multiplyScalar(.7+1.5*f),r.beam.uniforms.uColor.value.copy(Ue),r.el.classList.toggle("off",f<.5),r.el.classList.toggle("down",t[i]===!1)}};let po=0,vt=performance.now(),ce=0,Se=16,vo=0,je=0,Be=0,mt=.3,ht=1;const G=new j,mo=()=>{var u;po=requestAnimationFrame(mo);const e=performance.now();if(!co||document.hidden){vt=e;return}const t=(e-vt)/1e3,s=Math.min(.05,t);vt=e;const n=ze?0:s;if(ce+=n,$.uTime.value=ce,Ye.uniforms.uTime.value=ce,v.active){const o=1-Math.exp(-s*3.6);x.target.lerp(v.target,o),G.copy(P.position).sub(x.target);const a=G.length(),p=Ve.lerp(a,v.dist,o);G.normalize(),v.dir&&G.lerp(v.dir,o).normalize(),P.position.copy(x.target).addScaledVector(G,p),(!v.dir||G.distanceTo(v.dir)<.01)&&Math.abs(p-v.dist)<.08&&x.target.distanceTo(v.target)<.08&&(v.active=!1)}x.maxPolarAngle=Math.min(1.75,Math.acos(Ve.clamp((.4-x.target.y)/Math.max(1,P.position.distanceTo(x.target)),-1,1))),x.update(),P.position.y<.36&&(P.position.y=.36),Qe.position.copy(P.position),ft&&dt&&(ft=!1,$e=oo(),V.style.cursor=$e?"pointer":"grab");const r=Oe||$e,i=ke.current,d=Le.uDist.value;for(const o of he){const a=o.d.key,p=r===a,y=ye===a;o.hover+=((p?1:0)-o.hover)*Math.min(1,s*10);const F=((u=i.power)==null?void 0:u[a])??1,m=o.bag;m.uHover.value=o.hover*.8+(y?.35:0),m.uPower.value=m.uPower.value+(F-m.uPower.value)*Math.min(1,s*2),m.uPulse.value=Math.max(0,m.uPulse.value-s*.45);const N=a==="site"&&i.status.site===!1||a==="korvus"&&i.status.korvus===!1||a==="crown"&&i.status.crown===!1;m.uAlert.value=N?1:0,at[o.i]+=((y?.75+.25*Math.sin(ce*3):p?.5:0)-at[o.i])*Math.min(1,s*8),d[o.i].w=at[o.i]+m.uPulse.value*.8;const I=(.35+.65*F)*(1+o.hover*.6);o.halo.opacity=.5*I,o.beam.uniforms.uGain.value=.22*I+m.uPulse.value*.6,o.ring.rotation.set(Math.PI/2+Math.sin(ce*.6+o.i)*.35,ce*(.5+F*.9)+o.i,0),o.ring.scale.setScalar(1+o.hover*.25),o.el.classList.toggle("hot",p)}const l=Math.min(ie,110+Math.max(0,i.trafficPackets)*50);for(let o=0;o<l;o++){const a=Lo[o];a.s+=a.v*a.dir*n,a.s>a.span?a.s-=2*a.span:a.s<-a.span&&(a.s+=2*a.span);const p=a.road+(a.alongZ?-a.dir:a.dir)*.42,y=a.alongZ?p:a.s+a.dir*.24,F=a.alongZ?a.s+a.dir*.24:p,m=a.alongZ?p:a.s-a.dir*.24,N=a.alongZ?a.s-a.dir*.24:p;Lt.set([y,.13,F,m,.13,N],o*6)}Te.setDrawRange(0,l*2),Te.attributes.position.needsUpdate=!0,le.forEach((o,a)=>{if(!(o.r.key==="traffic"?o.idx<i.trafficPackets:o.r.key==="gold"?i.goldActive:!0)){o.on&&Vt(a),o.on=!1;return}o.on=!0,o.t=(o.t+n*o.r.speed*(i.clicksActive||o.r.key!=="clicks"?1:.35))%1,Ht(a,y=>o.r.curve.getPointAt(y),o.t,.011)}),jo(),Ge.forEach((o,a)=>{if(!o)return;const p=le.length+a;if(o.t+=s*.5,o.t>=1){const y=Z[o.to];y.bag.uPulse.value=1;const F=new He({transparent:!0,opacity:.9,side:yo,blending:se,depthWrite:!1});F.color.copy(o.tone).multiplyScalar(1.8);const m=new K(Uo,F);m.rotation.x=-Math.PI/2,m.position.set(y.d.gx*b,.05,y.d.gz*b),M.add(m),ge.push({mesh:m,age:0}),Vt(p),Ge[a]=null;return}Ht(p,y=>o.curve.getPoint(y),o.t,.018)}),Ne.attributes.position.needsUpdate=!0;for(let o=ge.length-1;o>=0;o--){const a=ge[o];a.age+=s;const p=a.age/1.4;a.mesh.scale.setScalar(1+p*14),a.mesh.material.opacity=Math.max(0,.9*(1-p)),p>=1&&(M.remove(a.mesh),a.mesh.material.dispose(),ge.splice(o,1))}Le.uRain.value+=((Zt?1:0)-Le.uRain.value)*Math.min(1,s*.8),Xt.uniforms.uCenter.value.copy(x.target),fo();const f=_(),g=T(),c=[];for(const o of he){G.copy(o.anchor).project(P);const a=G.z<1&&Math.abs(G.x)<1.15&&Math.abs(G.y)<1.2;a!==o.shown&&(o.shown=a,o.el.style.display=a?"":"none"),a&&(o.sx=Math.round((G.x+1)/2*f),o.sy=Math.round((1-G.y)/2*g),c.push(o))}if(mt-=s,mt<=0){mt=1.5;for(const o of c)o.wpx=o.el.offsetWidth||o.wpx}c.sort((o,a)=>a.sy-o.sy);for(let o=0;o<c.length;o++){const a=c[o];let p=0;for(let m=0;m<4;m++){let N=!1;for(let I=0;I<o;I++){const C=c[I];Math.abs(a.sx-C.sx)<(a.wpx+C.wpx)/2+6&&Math.abs(a.sy-p-(C.sy-C.lift))<40&&(p=a.sy-(C.sy-C.lift)+40,N=!0)}if(!N)break}a.lift+=(Math.min(170,Math.max(0,p))-a.lift)*Math.min(1,s*9);const y=Math.round(a.lift/2)*2;y!==a.liftCss&&a.el.style.setProperty("--lift",(a.liftCss=y)+"px");const F=`translate(${a.sx}px,${a.sy}px) translate(-50%,-100%)`;F!==a.tf&&(a.el.style.transform=a.tf=F)}if(W.render(),Se=Se*.94+Math.min(250,t*1e3)*.06,vo+=s,ht-=s,ht<=0){ht=1;const o=Math.round(1e3/Se);z.dataset.fps=String(o),z.dataset.res=k.toFixed(2),Ke.current&&(Ke.current.textContent=`${o} fps · ${k.toFixed(2)}x${O.visible?"":" · no reflections"}${Re.enabled?"":" · no glow"}`)}if(fe==="auto"&&vo>2.5){const o=Math.min(.25,t);je=Se>24?je+o:0,Be=Se<18.5?Be+o:0;let a=L;je>1.5&&L<pe.length-1?(kt=L+1,a=L+1):Be>6&&L>kt&&(a=L-1),a!==L&&(je=Be=0,L=a,O.visible=pe[L].mirror,Re.enabled=pe[L].bloom,pe[L].s!==k&&(k=pe[L].s,pt()))}};return fo(),mo(),()=>{cancelAnimationFrame(po),uo.disconnect(),lo.disconnect(),X.current={view:()=>{},orbit:()=>{},rain:()=>{},select:()=>{}},V.removeEventListener("pointermove",ao),V.removeEventListener("pointerleave",so),V.removeEventListener("pointerdown",no),V.removeEventListener("pointerup",ro),window.removeEventListener("keydown",io),x.dispose();for(const e of ge)e.mesh.material.dispose();for(const e of Ft)e.dispose();oe.dispose(),ve.dispose(),zt.dispose(),W.dispose(),D.dispose(),D.domElement.remove(),De.innerHTML=""}},[]);const zo=()=>{const z=!Xe;Fe(z),X.current.orbit(z)},Ro=()=>{const z=!Ze;Do(z);try{localStorage.setItem("c3d-rain",z?"1":"0")}catch{}X.current.rain(z)};return E.jsxs("div",{className:"city3d",children:[E.jsx("div",{className:"c3d-host",ref:St}),E.jsx("div",{className:"c3d-tags",ref:Mt}),E.jsxs("div",{className:"c3d-ctl",children:[E.jsxs("div",{className:"c3d-ctl-row",role:"group","aria-label":"Camera",children:[E.jsx("button",{onClick:()=>X.current.view("overview"),children:"Overview"}),E.jsx("button",{onClick:()=>X.current.view("street"),children:"Street"}),E.jsx("button",{onClick:()=>X.current.view("top"),children:"Plan"})]}),E.jsxs("div",{className:"c3d-ctl-row",role:"group","aria-label":"Scene",children:[E.jsx("button",{className:Xe?"on":"",onClick:zo,"aria-pressed":Xe,children:"Orbit"}),E.jsx("button",{className:Ze?"on":"",onClick:Ro,"aria-pressed":Ze,children:"Rain"})]}),E.jsx("div",{className:"c3d-hint",children:"Drag to look around, scroll to zoom, click a tower to step inside"}),E.jsx("div",{className:"c3d-stat",ref:Ke})]})]})};export{Ba as City3D};
