import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import "./arcade.css";

// THE ECLIPSE-X ARCADE. Runs inside Discord as an Activity, or in any browser
// at /activity/ as a guest (guests play, but only Discord players hit the board).

type Bar = [number, number, number, number];
type User = { id: string; name: string; avatar: string | null };

const IN_DISCORD = new URLSearchParams(location.search).has("frame_id");
const API = IN_DISCORD ? "/.proxy/api" : "/api";
let TOKEN = "";
const GUEST = (() => {
  try {
    const k = localStorage.getItem("ex-guest") || Math.random().toString(36).slice(2);
    localStorage.setItem("ex-guest", k);
    return k;
  } catch {
    return Math.random().toString(36).slice(2);
  }
})();

async function api<T = any>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "content-type": "application/json", "x-activity-token": TOKEN, "x-guest": GUEST },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `request failed (${r.status})`);
  return j as T;
}

async function signIn(): Promise<User | null> {
  if (!IN_DISCORD) return null;
  const cfg = await api<{ clientId: string; ready: boolean }>("/activity/config");
  if (!cfg.clientId) throw new Error("arcade is not configured yet");
  const sdk = new DiscordSDK(cfg.clientId);
  await sdk.ready();
  const { code } = await sdk.commands.authorize({ client_id: cfg.clientId, response_type: "code", state: "", prompt: "none", scope: ["identify"] });
  const { access_token } = await api<{ access_token: string }>("/activity/token", { code });
  const auth = await sdk.commands.authenticate({ access_token });
  TOKEN = access_token;
  const u = auth.user;
  return {
    id: u.id,
    name: (u as any).global_name || u.username,
    avatar: u.avatar ? `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=64` : null,
  };
}

// ---------------------------------------------------------------- candles
const Candles: React.FC<{ bars: Bar[]; split?: number; height?: number; marks?: number[] }> = ({ bars, split, height = 260, marks }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = cv.clientWidth, H = height;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const g = cv.getContext("2d")!;
    g.scale(dpr, dpr);
    g.clearRect(0, 0, W, H);
    if (!bars.length) return;
    const total = Math.max(bars.length, split ? split + 18 : bars.length);
    const hi = Math.max(...bars.map((b) => b[1])), lo = Math.min(...bars.map((b) => b[2]));
    const pad = (hi - lo) * 0.08 || 1;
    const y = (v: number) => 10 + (1 - (v - (lo - pad)) / (hi - lo + pad * 2)) * (H - 20);
    const cw = W / total;
    g.strokeStyle = "rgba(255,255,255,.05)";
    for (let i = 1; i < 5; i++) { g.beginPath(); g.moveTo(0, (H / 5) * i); g.lineTo(W, (H / 5) * i); g.stroke(); }
    if (split) {
      g.fillStyle = "rgba(255,45,149,.06)";
      g.fillRect(split * cw, 0, W - split * cw, H);
      g.strokeStyle = "rgba(255,45,149,.45)";
      g.setLineDash([4, 4]);
      g.beginPath(); g.moveTo(split * cw, 0); g.lineTo(split * cw, H); g.stroke();
      g.setLineDash([]);
    }
    bars.forEach((b, i) => {
      const x = i * cw + cw / 2;
      const up = b[3] >= b[0];
      const col = up ? "#35e08f" : "#ff4d6d";
      g.strokeStyle = col;
      g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, y(b[1])); g.lineTo(x, y(b[2])); g.stroke();
      g.fillStyle = col;
      const top = y(Math.max(b[0], b[3])), bot = y(Math.min(b[0], b[3]));
      g.fillRect(x - Math.max(1, cw * 0.32), top, Math.max(2, cw * 0.64), Math.max(1, bot - top));
    });
    (marks || []).forEach((i) => {
      if (i < 0 || i >= bars.length) return;
      g.fillStyle = "#ffd36b";
      g.beginPath(); g.arc(i * cw + cw / 2, 8, 3, 0, Math.PI * 2); g.fill();
    });
  }, [bars, split, height, marks]);
  return <canvas ref={ref} className="candles" style={{ height }} />;
};

// ---------------------------------------------------------------- read the tape
const Tape: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [r, setR] = useState<any>(null);
  const [bars, setBars] = useState<Bar[]>([]);
  const [last, setLast] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const start = useCallback(async () => {
    setErr(""); setLast(null);
    try { const j = await api("/activity/tape"); setR(j); setBars(j.bars); } catch (e: any) { setErr(e.message); }
  }, []);
  useEffect(() => { start(); }, [start]);
  const call = async (c: string) => {
    if (!r || busy) return;
    setBusy(true);
    try {
      const j = await api("/activity/tape/call", { id: r.id, call: c });
      setBars((b) => [...b, ...j.bars]);
      setLast({ ...j, call: c });
    } catch (e: any) { setErr(e.message); }
    setBusy(false);
  };
  const step = r ? (bars.length - 30) / 3 : 0;
  return (
    <Game title="Read the Tape" sub="Thirty bars of a real session. Call the next fifteen minutes." onBack={onBack}>
      {err ? <div className="err">{err}</div> : null}
      {r ? (
        <>
          <div className="meta"><b>{r.symbol}</b> 5 minute bars{r.simulated ? " (simulated session)" : ", real history, date hidden"}<span>Call {Math.min(6, step + (last?.done ? 0 : 1))} of 6 &middot; Score {last?.score ?? 0}</span></div>
          <Candles bars={bars} split={30} />
          {last ? (
            <div className={`verdict ${last.correct ? "good" : "bad"}`}>
              <span>{last.correct ? "Read it right." : "The tape disagreed."} You called <b>{last.call}</b>, it went <b>{last.truth}</b> ({last.move > 0 ? "+" : ""}{last.move} pts).</span>
            </div>
          ) : null}
          {last?.done ? (
            <div className="done">
              <div className="big">{last.score} / 6</div>
              <div>{last.weekTotal !== null && last.weekTotal !== undefined ? `${last.weekTotal} correct calls this week.` : "Play inside Discord to land on the weekly board."}</div>
              <button className="primary" onClick={start}>New tape</button>
            </div>
          ) : (
            <div className="calls">
              <button className="up" disabled={busy} onClick={() => call("up")}>Up</button>
              <button className="chop" disabled={busy} onClick={() => call("chop")}>Chop</button>
              <button className="down" disabled={busy} onClick={() => call("down")}>Down</button>
            </div>
          )}
        </>
      ) : !err ? <div className="loading">Pulling a tape...</div> : null}
    </Game>
  );
};

// ---------------------------------------------------------------- headline or hoax
const Hoax: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [r, setR] = useState<any>(null);
  const [res, setRes] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [err, setErr] = useState("");
  const next = useCallback(async () => {
    setErr(""); setRes(null);
    try { setR(await api("/activity/hoax")); } catch (e: any) { setErr(e.message); }
  }, []);
  useEffect(() => { next(); }, [next]);
  const pick = async (p: string) => {
    if (!r || res) return;
    try {
      const j = await api("/activity/hoax/answer", { id: r.id, pick: p });
      setRes({ ...j, pick: p });
      setStreak((s) => (j.correct ? s + 1 : 0));
    } catch (e: any) { setErr(e.message); }
  };
  return (
    <Game title="Headline or Hoax" sub="One of these ran on the wire. The other had its facts flipped." onBack={onBack}>
      {err ? <div className="err">{err}</div> : null}
      <div className="meta"><span>Streak {streak}</span>{res?.weekTotal ? <span>{res.weekTotal} this week</span> : null}</div>
      {r ? (
        <div className="cards">
          {(["a", "b"] as const).map((k) => {
            const cls = !res ? "" : r && res.real === k ? "real" : "fake";
            return (
              <button key={k} className={`headline ${cls} ${res?.pick === k ? "picked" : ""}`} onClick={() => pick(k)}>
                <span className="tag">{!res ? "WIRE" : res.real === k ? "REAL" : "HOAX"}</span>
                {r[k]}
              </button>
            );
          })}
        </div>
      ) : !err ? <div className="loading">Reading the wire...</div> : null}
      {res ? (
        <div className={`verdict ${res.correct ? "good" : "bad"}`}>
          <span>{res.correct ? "Sharp. You read the real one." : "Hooked. The hoax got you."}</span>
          <button className="primary" onClick={next}>Next pair</button>
        </div>
      ) : null}
    </Game>
  );
};

// ---------------------------------------------------------------- the open
const Open: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [r, setR] = useState<any>(null);
  const [shown, setShown] = useState(0);
  const [pos, setPos] = useState(0);
  const [positions, setPositions] = useState<number[]>([]);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState("");
  const posRef = useRef(0);
  posRef.current = pos;
  const load = useCallback(async () => {
    setErr(""); setResult(null); setRunning(false); setPos(0);
    try { const j = await api("/activity/open"); setR(j); setShown(j.openIndex + 1); setPositions(Array(j.openIndex).fill(0)); } catch (e: any) { setErr(e.message); }
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!running || !r) return;
    const t = setInterval(() => {
      setShown((s) => {
        if (s >= r.bars.length) return s;
        setPositions((p) => [...p, posRef.current]);
        return s + 1;
      });
    }, 1500);
    return () => clearInterval(t);
  }, [running, r]);
  useEffect(() => {
    if (r && running && shown >= r.bars.length) {
      setRunning(false);
      const final = [...positions];
      api("/activity/open/finish", { id: r.id, positions: final }).then(setResult).catch((e) => setErr(e.message));
    }
  }, [shown, r, running, positions]);
  let pnl = 0;
  if (r) for (let i = 0; i < shown - 1 && i < positions.length; i++) pnl += positions[i] * (r.bars[i + 1][3] - r.bars[i][3]);
  const live = pnl;
  return (
    <Game title="The Open" sub="A real 9:30 bell, replayed. One paper contract. Survive the first hour." onBack={onBack}>
      {err ? <div className="err">{err}</div> : null}
      {r ? (
        <>
          <div className="meta"><b>{r.symbol}</b>{r.simulated ? " simulated session" : " real open, date hidden"}<span>P&amp;L {live >= 0 ? "+" : ""}{live.toFixed(2)} pts ({live >= 0 ? "+" : "-"}${Math.abs(live * r.pointValue).toFixed(0)})</span></div>
          <Candles bars={r.bars.slice(0, shown)} split={r.openIndex} height={240} />
          {result ? (
            <div className="done">
              <div className="big">{result.score >= 0 ? "+" : ""}{result.score}</div>
              <div>P&amp;L {result.pnl} pts, worst drawdown {result.drawdown} pts, {result.trades} position changes. Score is P&amp;L minus half the drawdown.</div>
              <div>{result.weekBest !== null ? `Your best this week: ${result.weekBest}` : "Play inside Discord to land on the weekly board."}</div>
              <button className="primary" onClick={load}>Another open</button>
            </div>
          ) : !running ? (
            <div className="done">
              <div>The shaded line is the 9:30 bell. Bars play every 1.5 seconds. Switch long, flat, or short any time; positions change at the next bar.</div>
              <button className="primary" onClick={() => setRunning(true)}>Ring the bell</button>
            </div>
          ) : (
            <div className="calls">
              <button className={`up ${pos === 1 ? "on" : ""}`} onClick={() => setPos(1)}>Long</button>
              <button className={`chop ${pos === 0 ? "on" : ""}`} onClick={() => setPos(0)}>Flat</button>
              <button className={`down ${pos === -1 ? "on" : ""}`} onClick={() => setPos(-1)}>Short</button>
            </div>
          )}
        </>
      ) : !err ? <div className="loading">Finding an open...</div> : null}
      <div className="fine">Education only, paper positions, no real money.</div>
    </Game>
  );
};

// ---------------------------------------------------------------- daily cipher
const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const Cipher: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [st, setSt] = useState<any>(null);
  const [cur, setCur] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => { api("/activity/cipher").then(setSt).catch((e) => setErr(e.message)); }, []);
  const submit = useCallback(async () => {
    if (!st || st.over || cur.length !== 5) return;
    setErr("");
    try {
      const j = await api("/activity/cipher/guess", { guess: cur });
      setSt((s: any) => ({ ...s, guesses: [...s.guesses, { word: cur.toUpperCase(), marks: j.marks }], solved: j.solved, over: j.over, answer: j.answer, streak: j.streak }));
      setCur("");
    } catch (e: any) { setErr(e.message); }
  }, [st, cur]);
  const press = useCallback((k: string) => {
    if (!st || st.over) return;
    if (k === "ENTER") return void submit();
    if (k === "DEL") return setCur((c) => c.slice(0, -1));
    if (/^[A-Z]$/.test(k)) setCur((c) => (c.length < 5 ? c + k : c));
  }, [st, submit]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Enter") press("ENTER");
      else if (e.key === "Backspace") press("DEL");
      else if (/^[a-z]$/i.test(e.key)) press(e.key.toUpperCase());
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [press]);
  const keyState: Record<string, string> = {};
  const rank: Record<string, number> = { miss: 1, near: 2, hit: 3 };
  for (const g of st?.guesses || []) g.word.split("").forEach((ch: string, i: number) => {
    const m = g.marks[i];
    if (!keyState[ch] || rank[m] > rank[keyState[ch]]) keyState[ch] = m;
  });
  const rows = Array.from({ length: 6 }, (_, i) => st?.guesses[i] || (i === (st?.guesses.length ?? 0) && !st?.over ? { word: cur.padEnd(5, " "), marks: [] } : { word: "     ", marks: [] }));
  return (
    <Game title="Daily Cipher" sub="One market word a day. Six tries. Keep the streak alive." onBack={onBack}>
      {err ? <div className="err">{err}</div> : null}
      <div className="meta"><span>{st?.day || ""}</span><span>Streak {st?.streak ?? 0}</span></div>
      <div className="grid">
        {rows.map((r: any, i: number) => (
          <div className="row" key={i}>
            {r.word.split("").map((ch: string, j: number) => <div key={j} className={`cell ${r.marks[j] || ""} ${ch.trim() ? "filled" : ""}`}>{ch}</div>)}
          </div>
        ))}
      </div>
      {st?.over ? (
        <div className={`verdict ${st.solved ? "good" : "bad"}`}><span>{st.solved ? `Cracked. Streak ${st.streak}.` : `Today's word was ${st.answer}.`} New cipher at midnight ET.</span></div>
      ) : (
        <div className="keys">
          {KEYS.map((row, i) => (
            <div className="krow" key={i}>
              {i === 2 ? <button className="key wide" onClick={() => press("ENTER")}>Enter</button> : null}
              {row.split("").map((k) => <button key={k} className={`key ${keyState[k] || ""}`} onClick={() => press(k)}>{k}</button>)}
              {i === 2 ? <button className="key wide" onClick={() => press("DEL")}>Del</button> : null}
            </div>
          ))}
        </div>
      )}
    </Game>
  );
};

// ---------------------------------------------------------------- shell
const Game: React.FC<{ title: string; sub: string; onBack: () => void; children: React.ReactNode }> = ({ title, sub, onBack, children }) => (
  <div className="game">
    <button className="back" onClick={onBack}>&larr; Arcade</button>
    <h2>{title}</h2>
    <p className="sub">{sub}</p>
    {children}
  </div>
);

const GAMES = [
  { k: "tape", name: "Read the Tape", line: "Call where real ES and NQ sessions went next.", icon: "M3 17l5-6 4 3 6-8 3 3" },
  { k: "hoax", name: "Headline or Hoax", line: "Real wire headline or flipped facts? Pick fast.", icon: "M4 5h16v14H4zM7 9h10M7 13h6" },
  { k: "open", name: "The Open", line: "Trade a replayed 9:30 bell on paper. Survive the hour.", icon: "M12 3v4M5 12H3M21 12h-2M12 21a8 8 0 100-16 8 8 0 000 16zM12 9v3l2 2" },
  { k: "cipher", name: "Daily Cipher", line: "One market word a day. Six guesses. Streaks.", icon: "M5 5h4v4H5zM10 5h4v4h-4zM15 5h4v4h-4zM5 10h4v4H5zM10 10h4v4h-4z" },
];

const Board: React.FC = () => {
  const [b, setB] = useState<any>(null);
  useEffect(() => { api("/activity/board").then(setB).catch(() => {}); }, []);
  if (!b) return null;
  const cols = [
    { k: "tape", t: "Tape readers", u: "calls" },
    { k: "hoax", t: "Hoax hunters", u: "right" },
    { k: "open", t: "Best open", u: "pts" },
    { k: "streak", t: "Cipher streaks", u: "days" },
  ];
  return (
    <div className="board">
      <div className="board-h">This week's board <span>top players each week earn an Operator trial on Korvus</span></div>
      <div className="board-cols">
        {cols.map((c) => (
          <div key={c.k} className="board-col">
            <div className="board-t">{c.t}</div>
            {(b[c.k] || []).length ? (b[c.k] as any[]).map((p, i) => (
              <div key={i} className="board-row">
                <span className="rank">{i + 1}</span>
                {p.avatar ? <img src={p.avatar} alt="" /> : <i />}
                <span className="nm">{p.name}</span>
                <span className="v">{p.v} {c.u}</span>
              </div>
            )) : <div className="board-empty">Unclaimed. Be first.</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authErr, setAuthErr] = useState("");
  const [ready, setReady] = useState(!IN_DISCORD);
  const [view, setView] = useState("hub");
  useEffect(() => {
    if (!IN_DISCORD) return;
    signIn().then((u) => { setUser(u); setReady(true); }).catch((e) => { setAuthErr(String(e.message || e)); setReady(true); });
  }, []);
  const back = () => setView("hub");
  if (!ready) return <div className="splash"><Crown /> Entering the arcade...</div>;
  return (
    <div className="arcade">
      <header className="top">
        <div className="brand"><Crown /><b>ECLIPSE-X</b><span>ARCADE</span></div>
        <div className="who">{user ? <>{user.avatar ? <img src={user.avatar} alt="" /> : null}{user.name}</> : <span className="guest">{authErr ? "Guest mode" : "Guest, scores not ranked"}</span>}</div>
      </header>
      {view === "hub" ? (
        <>
          <div className="hero">
            <h1>Play the market. Risk nothing.</h1>
            <p>Four games built on real futures sessions and real headlines. Education only.</p>
          </div>
          <div className="tiles">
            {GAMES.map((g) => (
              <button key={g.k} className="tile" onClick={() => setView(g.k)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={g.icon} /></svg>
                <b>{g.name}</b>
                <span>{g.line}</span>
              </button>
            ))}
          </div>
          <Board />
          <div className="fine">Built by BlackCrownVxJ LLC. Korvus watches index futures while you sleep: korvus.industries</div>
        </>
      ) : view === "tape" ? <Tape onBack={back} /> : view === "hoax" ? <Hoax onBack={back} /> : view === "open" ? <Open onBack={back} /> : <Cipher onBack={back} />}
    </div>
  );
};

const Crown: React.FC = () => (
  <svg className="crown" viewBox="0 0 36 33" fill="none" stroke="#ff2d95" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
    <path d="M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z" /><path d="M8 28 L28 28" />
  </svg>
);

createRoot(document.getElementById("root")!).render(<App />);
