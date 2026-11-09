import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getBrainGraph, getBrainNote, type BrainGraph, type BrainNote } from "../api";

// The vault as a galaxy: Institution is the black hole at the core, each desk
// is a star cluster in its own color, every note a star, wikilinks the faint
// threads between them. Everything renders here in the browser; the server
// only hands over one cached graph.

const DESKS: { key: string; name: string; color: number; css: string }[] = [
  { key: "corvid", name: "Corvid", color: 0xff2d95, css: "#ff2d95" },
  { key: "herald", name: "Herald", color: 0x46e6ff, css: "#46e6ff" },
  { key: "steward", name: "Steward", color: 0x35e08f, css: "#35e08f" },
  { key: "bard", name: "Bard", color: 0xb15bff, css: "#b15bff" },
  { key: "regent", name: "Regent", color: 0xf2c94c, css: "#f2c94c" },
];
const DESK = Object.fromEntries(DESKS.map((d) => [d.key, d]));
const CLUSTER_R = 34;

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

function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, inner);
  gr.addColorStop(0.35, outer);
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}
function diskTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(256, 256, 70, 256, 256, 256);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(0.08, "rgba(255,240,215,1)");
  gr.addColorStop(0.22, "rgba(255,190,110,.9)");
  gr.addColorStop(0.45, "rgba(255,120,60,.45)");
  gr.addColorStop(0.75, "rgba(200,60,40,.12)");
  gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 512, 512);
  // streaks so the disk visibly turns
  g.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 140; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 90 + Math.random() * 150;
    g.strokeStyle = `rgba(0,0,0,${0.05 + Math.random() * 0.25})`;
    g.lineWidth = 1 + Math.random() * 3;
    g.beginPath();
    g.arc(256, 256, r, a, a + 0.3 + Math.random() * 0.9);
    g.stroke();
  }
  return new THREE.CanvasTexture(c);
}

export const Brain: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const [graph, setGraph] = useState<BrainGraph | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<"galaxy" | "dashboard">("galaxy");
  const [note, setNote] = useState<BrainNote | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);
  const [query, setQuery] = useState("");
  const [hover, setHover] = useState<{ x: number; y: number; t: string; d: string } | null>(null);
  const flyTo = useRef<(i: number) => void>(() => {});
  const focusDesk = useRef<(k: string) => void>(() => {});

  useEffect(() => {
    let live = true;
    const load = () => getBrainGraph().then((g) => {
      if (!live) return;
      if (g) setGraph(g);
      else setFailed(true);
    });
    load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => { live = false; clearInterval(t); };
  }, []);

  const byTitle = useMemo(() => {
    const m = new Map<string, number>();
    graph?.nodes.forEach((n, i) => { if (!m.has(n.t.toLowerCase())) m.set(n.t.toLowerCase(), i); });
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

  // galaxy scene; rebuilt only when the graph itself changes
  useEffect(() => {
    if (!graph || view !== "galaxy" || !mount.current) return;
    const el = mount.current;
    const W = () => el.clientWidth || 800;
    const H = () => el.clientHeight || 600;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.0085);
    const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 600);
    camera.position.set(0, 46, 92);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W(), H());
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 8;
    controls.maxDistance = 220;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.18;
    const disposables: { dispose: () => void }[] = [];
    const keep = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

    // backdrop stars
    {
      const n = 2600;
      const pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const r = 180 + Math.random() * 220;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th)], i * 3);
      }
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(g, keep(new THREE.PointsMaterial({ color: 0x8d8aa0, size: 0.9, sizeAttenuation: true, transparent: true, opacity: 0.5, depthWrite: false }))));
    }

    // the black hole: the Institution
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);
    const hole = new THREE.Mesh(keep(new THREE.SphereGeometry(3.2, 48, 48)), keep(new THREE.MeshBasicMaterial({ color: 0x000000 })));
    coreGroup.add(hole);
    const diskTex = keep(diskTexture());
    const disk = new THREE.Mesh(
      keep(new THREE.PlaneGeometry(26, 26)),
      keep(new THREE.MeshBasicMaterial({ map: diskTex, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }))
    );
    disk.rotation.x = -Math.PI / 2 + 0.22;
    coreGroup.add(disk);
    const halo = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: keep(glowTexture("rgba(255,214,160,.9)", "rgba(255,140,70,.25)")), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })));
    halo.scale.set(20, 20, 1);
    coreGroup.add(halo);
    // lensing ring: the bright photon ring standing up behind the hole
    const ring = new THREE.Mesh(keep(new THREE.TorusGeometry(3.7, 0.12, 12, 96)), keep(new THREE.MeshBasicMaterial({ color: 0xffd9a8, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending })));
    coreGroup.add(ring);

    // orbit arcs
    for (const r of [CLUSTER_R - 9, CLUSTER_R, CLUSTER_R + 14, CLUSTER_R + 30]) {
      const pts = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2).getPoints(160).map((p) => new THREE.Vector3(p.x, 0, p.y));
      const g = keep(new THREE.BufferGeometry().setFromPoints(pts));
      scene.add(new THREE.LineLoop(g, keep(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 }))));
    }

    // desk cluster centers on a ring around the core
    const centers: Record<string, THREE.Vector3> = {};
    DESKS.forEach((d, i) => {
      const a = (i / DESKS.length) * Math.PI * 2 + 0.4;
      centers[d.key] = new THREE.Vector3(Math.cos(a) * CLUSTER_R, (hash(d.key) - 0.5) * 6, Math.sin(a) * CLUSTER_R);
    });

    // nebula clouds: each desk glows as its own soft cloud
    const neb = keep(glowTexture("rgba(255,255,255,.55)", "rgba(255,255,255,.12)"));
    DESKS.forEach((d) => {
      const n = graph.stats.perDesk[d.key] || 0;
      const sp = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: neb, color: d.color, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })));
      const sc = 14 + Math.min(26, Math.sqrt(n) * 0.9);
      sp.scale.set(sc, sc, 1);
      sp.position.copy(centers[d.key]);
      scene.add(sp);
    });

    // note stars
    const N = graph.nodes.length;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const size = new Float32Array(N);
    const nowS = Date.now() / 1000;
    const perDeskIndex: Record<string, number> = {};
    const c = new THREE.Color();
    graph.nodes.forEach((n, i) => {
      const center = centers[n.d] || new THREE.Vector3();
      const k = (perDeskIndex[n.d] = (perDeskIndex[n.d] || 0) + 1);
      // subfolders form their own knot inside the cluster
      const subOff = n.s ? new THREE.Vector3((hash(n.s) - 0.5) * 9, (hash(n.s + "y") - 0.5) * 3, (hash(n.s + "z") - 0.5) * 9) : new THREE.Vector3();
      const r = 0.6 + Math.sqrt(k) * 0.42 * (1 + hash(n.id) * 0.35);
      const th = k * 2.39996 + hash(n.id + "a") * 0.6; // golden-angle spiral
      const y = (hash(n.id + "b") - 0.5) * (2 + r * 0.25);
      pos.set([center.x + subOff.x + Math.cos(th) * r, center.y + subOff.y + y, center.z + subOff.z + Math.sin(th) * r], i * 3);
      const ageDays = (nowS - n.m) / 86400;
      const fresh = Math.max(0.35, 1 - ageDays / 30);
      c.setHex(DESK[n.d]?.color ?? 0xffffff).multiplyScalar(fresh);
      col.set([c.r, c.g, c.b], i * 3);
      size[i] = 1.1 + Math.min(4, n.g * 0.35) + (ageDays < 1 ? 1.2 : 0);
    });
    const starGeo = keep(new THREE.BufferGeometry());
    starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(size, 1));
    const dot = keep(glowTexture("rgba(255,255,255,1)", "rgba(255,255,255,.35)"));
    const starMat = keep(new THREE.ShaderMaterial({
      uniforms: { map: { value: dot }, scale: { value: H() / 2 } },
      vertexShader: `attribute float size; varying vec3 vColor; uniform float scale;
        void main(){ vColor = color; vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = size * scale / -mv.z * 0.5; gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform sampler2D map; varying vec3 vColor;
        void main(){ vec4 t = texture2D(map, gl_PointCoord); if (t.a < 0.02) discard; gl_FragColor = vec4(vColor, 1.0) * t; }`,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }));
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // link threads, capped so huge vaults stay smooth
    {
      const E = graph.edges.slice(0, 3500);
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

    // thin tethers from each desk to the core
    DESKS.forEach((d) => {
      const g = keep(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), centers[d.key]]));
      scene.add(new THREE.Line(g, keep(new THREE.LineBasicMaterial({ color: d.color, transparent: true, opacity: 0.08 }))));
    });

    // selection marker
    const marker = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: dot, color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })));
    marker.scale.set(3.2, 3.2, 1);
    scene.add(marker);

    // camera flights
    let flight: { from: THREE.Vector3; to: THREE.Vector3; tFrom: THREE.Vector3; tTo: THREE.Vector3; t: number } | null = null;
    const fly = (target: THREE.Vector3, dist: number) => {
      const dir = camera.position.clone().sub(controls.target).normalize();
      flight = { from: camera.position.clone(), to: target.clone().add(dir.multiplyScalar(dist)), tFrom: controls.target.clone(), tTo: target.clone(), t: 0 };
      controls.autoRotate = false;
    };
    flyTo.current = (i: number) => {
      const p = new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
      marker.position.copy(p);
      (marker.material as THREE.SpriteMaterial).opacity = 1;
      fly(p, 12);
    };
    focusDesk.current = (k: string) => { if (centers[k]) fly(centers[k], 30); };

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
    const onDown = (ev: PointerEvent) => { downAt = { x: ev.clientX, y: ev.clientY }; };
    const onUp = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 5) return;
      const i = pick(ev);
      if (i >= 0) openNoteRef.current(graph.nodes[i].id);
    };
    let lastMove = 0;
    const onMove = (ev: PointerEvent) => {
      const now = performance.now();
      if (now - lastMove < 60) return;
      lastMove = now;
      const i = pick(ev);
      if (i >= 0) {
        const r = renderer.domElement.getBoundingClientRect();
        setHover({ x: ev.clientX - r.left, y: ev.clientY - r.top, t: graph.nodes[i].t, d: graph.nodes[i].d });
        renderer.domElement.style.cursor = "pointer";
      } else {
        setHover(null);
        renderer.domElement.style.cursor = "grab";
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);

    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
      starMat.uniforms.scale.value = H() / 2;
    };
    window.addEventListener("resize", onResize);

    // desk labels as html, projected each frame
    const labelEls: Record<string, HTMLDivElement> = {};
    if (labelsRef.current) {
      labelsRef.current.innerHTML = "";
      DESKS.forEach((d) => {
        const div = document.createElement("div");
        div.className = "bx-label";
        div.innerHTML = `<b style="color:${d.css}">${d.name}</b><span>${graph.stats.perDesk[d.key] || 0} notes</span>`;
        div.onclick = () => focusDesk.current(d.key);
        labelsRef.current!.appendChild(div);
        labelEls[d.key] = div;
      });
      const core = document.createElement("div");
      core.className = "bx-label bx-core";
      core.innerHTML = `<b>Institution</b><span>the doctrine everything orbits</span>`;
      core.onclick = () => { if (graph.stats.core) openNoteRef.current(graph.stats.core); fly(new THREE.Vector3(), 22); };
      labelsRef.current.appendChild(core);
      labelEls.__core = core;
    }

    let raf = 0;
    const clock = new THREE.Clock();
    const v = new THREE.Vector3();
    const tick = () => {
      const dt = clock.getDelta();
      const t = clock.elapsedTime;
      disk.rotation.z += dt * 0.35;
      ring.lookAt(camera.position);
      halo.material.opacity = 0.85 + Math.sin(t * 1.4) * 0.1;
      if (flight) {
        flight.t = Math.min(1, flight.t + dt * 0.9);
        const e = 1 - Math.pow(1 - flight.t, 3);
        camera.position.lerpVectors(flight.from, flight.to, e);
        controls.target.lerpVectors(flight.tFrom, flight.tTo, e);
        if (flight.t >= 1) flight = null;
      }
      const mm = marker.material as THREE.SpriteMaterial;
      if (mm.opacity > 0) marker.scale.setScalar(3 + Math.sin(t * 4) * 0.6);
      controls.update();
      renderer.render(scene, camera);
      const w = W(), h = H();
      for (const k in labelEls) {
        v.copy(k === "__core" ? new THREE.Vector3(0, -5.5, 0) : centers[k].clone().add(new THREE.Vector3(0, 7, 0)));
        v.project(camera);
        const el2 = labelEls[k];
        const vis = v.z < 1;
        el2.style.display = vis ? "block" : "none";
        el2.style.transform = `translate(-50%,-50%) translate(${((v.x + 1) / 2) * w}px,${((1 - v.y) / 2) * h}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      controls.dispose();
      disposables.forEach((d) => d.dispose());
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

  return (
    <div className="bx">
      <div className="bx-top">
        <div>
          <div className="eyebrow">The Brain</div>
          <h1 className="bx-h1">The mind of the company</h1>
        </div>
        <div className="bx-pills">
          <button className={view === "galaxy" ? "on" : ""} onClick={() => setView("galaxy")}>Galaxy</button>
          <button className={view === "dashboard" ? "on" : ""} onClick={() => setView("dashboard")}>Dashboard</button>
        </div>
      </div>

      {!graph ? (
        <div className="bx-empty">{failed ? "The vault could not be read. Check that the brain sync is on." : "Reading the vault..."}</div>
      ) : (
        <div className={`bx-body ${note ? "reading" : ""}`}>
          {view === "galaxy" ? (
            <div className="bx-stage">
              <div ref={mount} className="bx-canvas" />
              <div ref={labelsRef} className="bx-labels" />
              {hover ? (
                <div className="bx-tip" style={{ left: hover.x + 14, top: hover.y + 10 }}>
                  <i style={{ background: DESK[hover.d]?.css }} />
                  {hover.t}
                </div>
              ) : null}
              <div className="bx-hud">
                <span><b>{s!.notes.toLocaleString()}</b> notes</span>
                <span><b>{s!.links.toLocaleString()}</b> links</span>
                <span><b>{s!.updatedToday}</b> touched today</span>
              </div>
              <div className="bx-hint">Drag to orbit. Scroll to zoom. Click a desk to fly there, a star to read it.</div>
            </div>
          ) : (
            <div className="bx-dash">
              <div className="bx-cards">
                {[
                  { k: "Notes", v: s!.notes, sub: "across five desks", c: "#ff2d95" },
                  { k: "Links", v: s!.links, sub: "wikilinks between notes", c: "#46e6ff" },
                  { k: "Touched today", v: s!.updatedToday, sub: "notes written or synced in 24h", c: "#35e08f" },
                  { k: "Healer lessons", v: s!.lessons, sub: "laws the system taught itself", c: "#f2c94c" },
                ].map((c) => (
                  <div className="bx-card" key={c.k}>
                    <div className="bx-card-k">{c.k}</div>
                    <div className="bx-card-v" style={{ color: c.c }}>{c.v.toLocaleString()}</div>
                    <div className="bx-card-s">{c.sub}</div>
                  </div>
                ))}
              </div>
              <div className="bx-grid">
                <div className="bx-panel bx-wide">
                  <div className="bx-panel-h">Vault activity, last 14 days</div>
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
                  <div className="bx-panel-h">Notes by desk</div>
                  {DESKS.map((d) => (
                    <div className="bx-row" key={d.key}>
                      <span className="bx-row-k">{d.name}</span>
                      <span className="bx-row-bar"><i style={{ width: `${((s!.perDesk[d.key] || 0) / maxDesk) * 100}%`, background: d.css }} /></span>
                      <span className="bx-row-v">{(s!.perDesk[d.key] || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="bx-panel">
                  <div className="bx-panel-h">Most connected notes</div>
                  {s!.connected.map((c) => (
                    <button className="bx-row bx-link" key={c.id} onClick={() => openNote(c.id)}>
                      <span className="bx-row-k">{c.title}</span>
                      <span className="bx-row-bar"><i style={{ width: `${(c.deg / maxDeg) * 100}%`, background: DESK[c.desk]?.css }} /></span>
                      <span className="bx-row-v">{c.deg}</span>
                    </button>
                  ))}
                </div>
                <div className="bx-panel bx-wide">
                  <div className="bx-panel-h">Recent activity</div>
                  {s!.recent.map((c) => (
                    <button className="bx-act" key={c.id} onClick={() => openNote(c.id)}>
                      <i style={{ background: DESK[c.desk]?.css }} />
                      <span className="bx-act-t">{c.title}</span>
                      <span className="bx-act-d">{DESK[c.desk]?.name}</span>
                      <span className="bx-act-a">{ago(c.mtime)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <aside className="bx-reader">
            <div className="bx-search">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the vault" />
              {matches.length ? (
                <div className="bx-results">
                  {matches.map((m) => (
                    <button key={m.id} onClick={() => { setQuery(""); openNote(m.id); }}>
                      <i style={{ background: DESK[m.d]?.css }} />
                      {m.t}
                      <span>{DESK[m.d]?.name}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            {note ? (
              <div className="bx-note">
                <div className="bx-note-top">
                  <span className="bx-tag" style={{ borderColor: DESK[note.id.split("/")[0]]?.css, color: DESK[note.id.split("/")[0]]?.css }}>
                    {DESK[note.id.split("/")[0]]?.name || "Vault"}
                  </span>
                  <button className="bx-x" onClick={() => setNote(null)} aria-label="Close">x</button>
                </div>
                <h2>{note.title}</h2>
                <div className="bx-note-meta">{note.id} &middot; updated {ago(note.mtime)}</div>
                <div className="bx-md" onClick={onReaderClick} dangerouslySetInnerHTML={{ __html: renderMd(note.text) }} />
                {note.truncated ? <div className="bx-note-meta">Long note, showing the first 80 KB.</div> : null}
              </div>
            ) : (
              <div className="bx-note-empty">{loadingNote ? "Opening..." : "Pick a star, a desk, or search to read what the agents wrote."}</div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};
