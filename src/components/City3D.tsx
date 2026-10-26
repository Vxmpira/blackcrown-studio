import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// The Grid in three dimensions: a night city on a dark plain. Towers carry
// lit window floors, setback crowns, and spires; each agent's building is
// trimmed in its desk color. Click a building and the camera flies in,
// click away and it pulls back. Built light: instanced background, one
// shared window texture, capped pixel ratio, paused when hidden, static
// under reduced motion.

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
};

type District = { key: string; label: string; x: number; z: number; h: number; big?: boolean };

const DISTRICTS: District[] = [
  { key: "world", label: "THE WORLD", x: -17, z: 3, h: 3.2 },
  { key: "site", label: "BLACKCROWNVXJ.COM", x: 0, z: 1, h: 6.5, big: true },
  { key: "korvus", label: "KORVUS", x: 14, z: -5, h: 5 },
  { key: "crown", label: "CROWN", x: 16, z: 1.5, h: 5 },
  { key: "eclipse", label: "ECLIPSE-X", x: 13.5, z: 8, h: 4.2 },
  { key: "stripe", label: "STRIPE", x: -12, z: 11, h: 3.6 },
  { key: "corvid", label: "CORVID", x: -9, z: -8, h: 4.6 },
  { key: "herald", label: "HERALD", x: -15, z: -4, h: 4.4 },
  { key: "steward", label: "STEWARD", x: -6, z: -14, h: 4.8 },
  { key: "regent", label: "REGENT", x: -1, z: -11, h: 5.4 },
  { key: "you", label: "YOU", x: 4.5, z: -12.5, h: 6.8, big: true },
];

const COLORS = {
  pink: 0xff2d95,
  cyan: 0x46e6ff,
  gold: 0xf2c94c,
  up: 0x35e08f,
  down: 0xff5a5a,
  unknown: 0x85838f,
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
  regent: COLORS.gold,
  you: 0xffffff,
};

function pos(key: string) {
  const d = DISTRICTS.find((x) => x.key === key)!;
  return new THREE.Vector3(d.x, 0, d.z);
}

// a canvas of lit windows: the night-office look, generated once
function windowTexture(seed: number, warmth = 0.22) {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#060609";
  g.fillRect(0, 0, 64, 128);
  let s = seed;
  const rng = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const cols = 5;
  const rows = 14;
  const cw = 64 / cols;
  const rh = 128 / rows;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const roll = rng();
      if (roll < 0.52) {
        g.fillStyle = "#101018";
      } else if (roll < 0.52 + warmth) {
        g.fillStyle = rng() > 0.5 ? "rgba(255,45,149,0.75)" : "rgba(70,230,255,0.7)";
      } else {
        g.fillStyle = "rgba(235,225,255,0.55)";
      }
      g.fillRect(col * cw + 2, r * rh + 2.5, cw - 4, rh - 5);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export const City3D: React.FC<{ data: CityData; onSelect?: (key: string | null) => void }> = ({
  data,
  onSelect,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);
  dataRef.current = data;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x030305, 30, 82);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(120, 60, 0xff2d95, 0xff2d95);
    (grid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.08;
    (grid.material as THREE.Material & { transparent: boolean }).transparent = true;
    scene.add(grid);

    // shared window material set for every tower face
    const winTexA = windowTexture(7);
    const winTexB = windowTexture(1234, 0.3);
    const darkMat = new THREE.MeshBasicMaterial({ color: 0x0a0a10 });
    const sideA = new THREE.MeshBasicMaterial({ map: winTexA });
    const sideB = new THREE.MeshBasicMaterial({ map: winTexB });
    const facesOf = (side: THREE.Material) => [side, side, darkMat, darkMat, side, side];

    // background skyline: instanced windowed blocks, no wires
    const COUNT = 150;
    const box = new THREE.BoxGeometry(1, 1, 1);
    const fills = new THREE.InstancedMesh(box, facesOf(sideA) as unknown as THREE.Material, COUNT);
    const m = new THREE.Matrix4();
    const rng = (() => {
      let s = 7;
      return () => ((s = (s * 16807) % 2147483647) / 2147483647);
    })();
    let placed = 0;
    while (placed < COUNT) {
      const x = (rng() - 0.5) * 70;
      const z = (rng() - 0.5) * 55;
      if (DISTRICTS.some((d) => Math.hypot(d.x - x, d.z - z) < 4.5)) continue;
      const h = 0.8 + rng() * 5.2;
      m.makeScale(0.9 + rng() * 1.4, h, 0.9 + rng() * 1.4);
      m.setPosition(x, h / 2, z);
      fills.setMatrixAt(placed, m);
      placed++;
    }
    scene.add(fills);

    // district towers: windowed shaft, setback crown, colored trim, spire
    const labels: { el: HTMLDivElement; v: THREE.Vector3 }[] = [];
    const cores: Record<string, THREE.Mesh> = {};
    const roofLights: THREE.Mesh[] = [];
    const clickable: THREE.Object3D[] = [];
    for (const d of DISTRICTS) {
      const w = d.big ? 2.6 : 2.0;
      const accent = ACCENT[d.key] ?? COLORS.pink;
      const g = new THREE.Group();
      g.position.set(d.x, 0, d.z);

      const shaftH = d.h * 0.78;
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(w, shaftH, w), facesOf(sideA));
      shaft.position.y = shaftH / 2;
      shaft.userData.key = d.key;
      clickable.push(shaft);
      g.add(shaft);
      const shaftTrim = new THREE.LineSegments(
        new THREE.EdgesGeometry(shaft.geometry),
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.9 })
      );
      shaftTrim.position.copy(shaft.position);
      g.add(shaftTrim);

      const crownH = d.h * 0.22;
      const crown = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, crownH, w * 0.62), facesOf(sideB));
      crown.position.y = shaftH + crownH / 2;
      crown.userData.key = d.key;
      clickable.push(crown);
      g.add(crown);
      const crownTrim = new THREE.LineSegments(
        new THREE.EdgesGeometry(crown.geometry),
        new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.75 })
      );
      crownTrim.position.copy(crown.position);
      g.add(crownTrim);

      if (d.big) {
        const spire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.09, 1.7, 6),
          new THREE.MeshBasicMaterial({ color: accent })
        );
        spire.position.y = d.h + 0.85;
        g.add(spire);
      }
      const roof = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: COLORS.down })
      );
      roof.position.y = d.h + (d.big ? 1.75 : 0.12);
      roofLights.push(roof);
      g.add(roof);

      const core = new THREE.Mesh(
        new THREE.SphereGeometry(d.big ? 0.5 : 0.38, 12, 12),
        new THREE.MeshBasicMaterial({ color: accent })
      );
      core.position.y = d.h + 0.8;
      core.userData.key = d.key;
      clickable.push(core);
      g.add(core);
      cores[d.key] = core;

      scene.add(g);

      const el = document.createElement("div");
      el.className = "c3d-label" + (d.big ? " c3d-big" : "");
      el.innerHTML = `<span class="c3d-name">${d.label}</span><span class="c3d-sub"></span>`;
      host.appendChild(el);
      labels.push({ el, v: new THREE.Vector3(d.x, d.h + 2, d.z) });
    }

    // skyways + packets
    const packets: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; t: number; speed: number; key: string }[] = [];
    const addRoute = (from: string, to: string, tone: number, key: string, n = 1, speed = 0.1) => {
      const a = pos(from).setY(DISTRICTS.find((d) => d.key === from)!.h + 0.8);
      const b = pos(to).setY(DISTRICTS.find((d) => d.key === to)!.h + 0.8);
      const mid = a.clone().lerp(b, 0.5);
      mid.y += a.distanceTo(b) * 0.18 + 1.5;
      const curve = new THREE.CatmullRomCurve3([a, mid, b]);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)),
        new THREE.LineBasicMaterial({ color: tone, transparent: true, opacity: 0.12 })
      );
      scene.add(line);
      for (let i = 0; i < n; i++) {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), new THREE.MeshBasicMaterial({ color: tone }));
        scene.add(mesh);
        packets.push({ mesh, curve, t: i / Math.max(1, n), speed, key });
      }
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

    const setSize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(host);
    setSize();

    camera.position.set(-10, 17, 28);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 2, -1);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 5;
    controls.maxDistance = 70;
    controls.maxPolarAngle = 1.42;
    controls.autoRotate = !reduced;
    controls.autoRotateSpeed = 0.45;

    // fly-in: clicking a building sends the camera to it; clicking away
    // pulls back to the overview. A hand on the controls cancels the flight.
    const flight = { active: false, target: new THREE.Vector3(0, 2, -1), dist: 34 };
    controls.addEventListener("start", () => {
      controls.autoRotate = false;
      flight.active = false;
    });
    const flyTo = (key: string | null) => {
      if (key) {
        const d = DISTRICTS.find((x) => x.key === key)!;
        flight.target.set(d.x, d.h * 0.55, d.z);
        flight.dist = 11;
      } else {
        flight.target.set(0, 2, -1);
        flight.dist = 34;
      }
      flight.active = true;
      controls.autoRotate = false;
    };
    renderer.domElement.style.cursor = "grab";

    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let downAt: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      downAt = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (!downAt) return;
      const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
      downAt = null;
      if (moved > 6) return;
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(clickable, false)[0];
      const key = hit ? (hit.object.userData.key as string) : null;
      flyTo(key);
      onSelectRef.current?.(key);
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    const tmp = new THREE.Vector3();
    let raf = 0;
    const clock = new THREE.Clock();
    let elapsed = 0;

    const applyData = () => {
      const d = dataRef.current;
      const statusColor = (s: boolean | null | undefined, fallback: number) =>
        s === true ? COLORS.up : s === false ? COLORS.down : fallback;
      (cores["site"].material as THREE.MeshBasicMaterial).color.setHex(statusColor(d.status.site, ACCENT.site));
      (cores["korvus"].material as THREE.MeshBasicMaterial).color.setHex(statusColor(d.status.korvus, ACCENT.korvus));
      (cores["crown"].material as THREE.MeshBasicMaterial).color.setHex(statusColor(d.status.crown, ACCENT.crown));
      const subs: Record<string, string> = {
        world: d.worldSub,
        stripe: d.stripeSub,
        regent: d.regentSub,
        herald: d.heraldSub || "",
        steward: d.stewardSub || "",
      };
      labels.forEach((l, i) => {
        const sub = subs[DISTRICTS[i].key];
        const subEl = l.el.querySelector(".c3d-sub") as HTMLElement;
        if (subEl) subEl.textContent = sub || "";
      });
      for (const p of packets) {
        if (p.key === "traffic") p.mesh.visible = packets.filter((x) => x.key === "traffic").indexOf(p) < d.trafficPackets;
        if (p.key === "gold") p.mesh.visible = d.goldActive;
      }
    };
    applyData();

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      elapsed += dt;
      if (flight.active) {
        controls.target.lerp(flight.target, 0.07);
        const dir = camera.position.clone().sub(controls.target);
        const dist = dir.length();
        const next = THREE.MathUtils.lerp(dist, flight.dist, 0.07);
        camera.position.copy(controls.target).add(dir.normalize().multiplyScalar(next));
        if (Math.abs(next - flight.dist) < 0.1 && controls.target.distanceTo(flight.target) < 0.1) {
          flight.active = false;
        }
      }
      controls.update();
      const blink = (Math.sin(elapsed * 2.4) + 1) / 2;
      for (const r of roofLights) {
        (r.material as THREE.MeshBasicMaterial).opacity = 0.25 + blink * 0.75;
        (r.material as THREE.MeshBasicMaterial).transparent = true;
      }
      for (const p of packets) {
        if (!p.mesh.visible) continue;
        p.t = (p.t + dt * p.speed * (dataRef.current.clicksActive || p.key !== "clicks" ? 1 : 0.35)) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      }
      applyData();
      const w = host.clientWidth;
      const h = host.clientHeight;
      for (const l of labels) {
        tmp.copy(l.v).project(camera);
        const behind = tmp.z > 1;
        l.el.style.display = behind ? "none" : "block";
        if (!behind) {
          l.el.style.left = `${((tmp.x + 1) / 2) * w}px`;
          l.el.style.top = `${((1 - tmp.y) / 2) * h}px`;
        }
      }
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(frame);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.dispose();
      ro.disconnect();
      winTexA.dispose();
      winTexB.dispose();
      renderer.dispose();
      host.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="city3d" ref={hostRef} />;
};
