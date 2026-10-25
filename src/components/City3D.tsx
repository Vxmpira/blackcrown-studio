import React, { useEffect, useRef } from "react";
import * as THREE from "three";

// The Grid in three dimensions: a wireframe city on a dark plain, the
// districts of the empire as lit towers, and data packets flying the
// skyways between them. Built light: instanced towers, capped pixel
// ratio, paused when the tab is hidden, static under reduced motion.

export type CityData = {
  trafficPackets: number;
  clicksActive: boolean;
  goldActive: boolean;
  status: { site: boolean | null; korvus: boolean | null; crown: boolean | null };
  worldSub: string;
  stripeSub: string;
  regentSub: string;
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

function pos(key: string) {
  const d = DISTRICTS.find((x) => x.key === key)!;
  return new THREE.Vector3(d.x, 0, d.z);
}

export const City3D: React.FC<{ data: CityData }> = ({ data }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x030305, 30, 78);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    // ground
    const grid = new THREE.GridHelper(120, 60, 0xff2d95, 0xff2d95);
    (grid.material as THREE.Material & { opacity: number; transparent: boolean }).opacity = 0.1;
    (grid.material as THREE.Material & { transparent: boolean }).transparent = true;
    scene.add(grid);

    // background towers, instanced, two layers: dark fill + wire glow
    const COUNT = 150;
    const box = new THREE.BoxGeometry(1, 1, 1);
    const fillMat = new THREE.MeshBasicMaterial({ color: 0x0a0a10 });
    const wireMat = new THREE.MeshBasicMaterial({ color: COLORS.pink, wireframe: true, transparent: true, opacity: 0.16 });
    const fills = new THREE.InstancedMesh(box, fillMat, COUNT);
    const wires = new THREE.InstancedMesh(box, wireMat, COUNT);
    const m = new THREE.Matrix4();
    const rng = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
    let placed = 0;
    while (placed < COUNT) {
      const x = (rng() - 0.5) * 70;
      const z = (rng() - 0.5) * 55;
      if (DISTRICTS.some((d) => Math.hypot(d.x - x, d.z - z) < 4)) continue;
      const h = 0.8 + rng() * 5.2;
      m.makeScale(0.9 + rng() * 1.4, h, 0.9 + rng() * 1.4);
      m.setPosition(x, h / 2, z);
      fills.setMatrixAt(placed, m);
      wires.setMatrixAt(placed, m);
      placed++;
    }
    scene.add(fills);
    scene.add(wires);

    // district towers + status cores + labels
    const labels: { el: HTMLDivElement; v: THREE.Vector3 }[] = [];
    const cores: Record<string, THREE.Mesh> = {};
    for (const d of DISTRICTS) {
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(d.big ? 2.4 : 1.8, d.h, d.big ? 2.4 : 1.8),
        new THREE.MeshBasicMaterial({ color: 0x0c0c14 })
      );
      tower.position.set(d.x, d.h / 2, d.z);
      scene.add(tower);
      const wire = new THREE.Mesh(
        tower.geometry,
        new THREE.MeshBasicMaterial({ color: COLORS.pink, wireframe: true, transparent: true, opacity: 0.85 })
      );
      wire.position.copy(tower.position);
      scene.add(wire);
      cores[d.key + "-wire"] = wire;
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(d.big ? 0.5 : 0.38, 12, 12),
        new THREE.MeshBasicMaterial({ color: COLORS.pink })
      );
      core.position.set(d.x, d.h + 0.8, d.z);
      scene.add(core);
      cores[d.key] = core;

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
        new THREE.LineBasicMaterial({ color: COLORS.pink, transparent: true, opacity: 0.14 })
      );
      scene.add(line);
      for (let i = 0; i < n; i++) {
        const mesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.28, 8, 8),
          new THREE.MeshBasicMaterial({ color: tone })
        );
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

    const tmp = new THREE.Vector3();
    let raf = 0;
    let angle = -0.35;
    const clock = new THREE.Clock();

    const applyData = () => {
      const d = dataRef.current;
      const statusColor = (s: boolean | null | undefined) =>
        s === true ? COLORS.up : s === false ? COLORS.down : COLORS.pink;
      (cores["site"].material as THREE.MeshBasicMaterial).color.setHex(statusColor(d.status.site));
      (cores["korvus"].material as THREE.MeshBasicMaterial).color.setHex(statusColor(d.status.korvus));
      (cores["crown"].material as THREE.MeshBasicMaterial).color.setHex(statusColor(d.status.crown));
      const subs: Record<string, string> = { world: d.worldSub, stripe: d.stripeSub, regent: d.regentSub };
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
      if (!reduced) angle += dt * 0.045;
      camera.position.set(Math.sin(angle) * 30, 17, Math.cos(angle) * 30);
      camera.lookAt(0, 2, -1);
      for (const p of packets) {
        if (!p.mesh.visible) continue;
        p.t = (p.t + dt * p.speed * (dataRef.current.clicksActive || p.key !== "clicks" ? 1 : 0.35)) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      }
      applyData();
      // project labels
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
    if (reduced) {
      // render a handful of settled frames, then stop
      frame();
      renderer.render(scene, camera);
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      renderer.dispose();
      host.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="city3d" ref={hostRef} />;
};
