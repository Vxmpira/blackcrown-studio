import React, { useEffect, useMemo, useRef, useState } from "react";
import { FuturesBook, labState } from "../components/FuturesLab";
import { StockBook } from "../components/StockBook";
import { Empty, Seg, Spark, ageS, ago, et, mins, n0, pct, rmult, tone, usd } from "../components/botui";
import {
  getIntel,
  getIntelLive,
  getCompassLive,
  getLab,
  type CompassLive,
  type IntelData,
  type IntelLive,
  type IntelEvent,
  type LabData,
} from "../api";

type Health = "ok" | "warn" | "bad" | "idle";

/* ------------------------------------------------------------------ pipeline */
type Node = {
  key: string;
  stage: string;
  title: string;
  metric: string;
  detail: string;
  health: Health;
  ring?: number; // 0..1 countdown progress
};

const Pipeline: React.FC<{ nodes: Node[]; hits: Record<string, number>; now: number; live: boolean }> = ({
  nodes,
  hits,
  now,
  live,
}) => (
  <div className={`pb-pipe${live ? "" : " offline"}`}>
    {nodes.map((n, i) => {
      const hot = now - (hits[n.stage] || 0) < 7000;
      return (
        <React.Fragment key={n.key}>
          <div className={`pb-node ${n.health}${hot ? " hot" : ""}`}>
            <div className="pb-node-top">
              <span className={`pb-dot ${n.health}`} />
              <span className="pb-node-step">0{i + 1}</span>
              {n.ring !== undefined ? (
                <span
                  className="pb-ring"
                  style={{ ["--p" as any]: `${Math.round(n.ring * 360)}deg` }}
                  title="time to next EDGAR poll"
                />
              ) : null}
            </div>
            <div className="pb-node-title">{n.title}</div>
            <div className="pb-node-metric">{n.metric}</div>
            <div className="pb-node-detail">{n.detail}</div>
          </div>
          {i < nodes.length - 1 ? (
            <div className={`pb-link${live ? " flowing" : ""}${hot ? " fast" : ""}`}>
              <i />
              <i />
              <i />
            </div>
          ) : null}
        </React.Fragment>
      );
    })}
  </div>
);

const STAGE_LABEL: Record<string, string> = {
  universe: "SCREEN",
  edgar: "EDGAR",
  scoring: "READ",
  crown: "CROWN",
  quotes: "QUOTE",
  bot: "BOT",
  vault: "VAULT",
  system: "SYS",
  filings: "EDGAR",
  paperbot: "BOT",
};

/* ------------------------------------------------------------------ main */
const PHASE: Record<string, string> = {
  premarket: "pre-market", afterhours: "after-hours", overnight: "overnight session", regular: "regular session",
};

// ---- the second crawler: Korvus Compass (long-term board) + analyst agent ----
const CompassPanel: React.FC<{ c: CompassLive | null; now: number }> = ({ c, now }) => {
  const k = c?.counts;
  const st = c?.status || {};
  const up = !!c?.running;
  const dot = (job: string, staleMin: number) => {
    const j = st[job];
    if (!j?.at) return "idle";
    if (j.error) return "bad";
    return (now - new Date(j.at).getTime()) / 60000 > staleMin ? "warn" : "ok";
  };
  const ai = k ? Object.entries(k.briefs_by || {}).filter(([w]) => w !== "rules").reduce((a, [, n]) => a + n, 0) : 0;
  const jobs: { key: string; label: string; stale: number; note: string }[] = [
    { key: "feed", label: "Live filing feed", stale: 12, note: k ? `${k.filings_24h} filing(s) caught in 24h` : "" },
    { key: "prices", label: "Daily prices", stale: 60 * 30, note: c?.price_asof ? `closes through ${c.price_asof}` : "" },
    { key: "filings", label: "SEC financials", stale: 60 * 8, note: k ? `${k.with_financials} of ${k.stocks} companies read` : "" },
    { key: "analysts", label: "Analyst consensus", stale: 60 * 24 * 8, note: k ? `${k.with_analysts} of ${k.stocks} covered` : "" },
    { key: "score", label: "Compass scores", stale: 30, note: k ? `${k.scored} of ${k.stocks} scored` : "" },
    { key: "agent", label: "Analyst agent", stale: 60 * 26, note: k ? `${k.briefs} briefs: ${ai} by AI, ${k.briefs - ai} by rules` : "" },
    { key: "live", label: "Live prices", stale: 10, note: c?.live_prices ? "on: refreshed every minute in market hours" : "off (COMPASS_LIVE=0)" },
  ];
  return (
    <section className="pb-panel" style={{ marginTop: 18 }}>
      <div className="pb-panel-h">
        <span>Second crawler: Korvus Compass</span>
        <span className={`pb-live ${up ? "on" : c?.configured ? "off" : "unset"}`}>
          <i />
          {up ? `LIVE · heartbeat ${Math.round(c?.heartbeat_age_s || 0)}s ago` : c?.configured ? (c?.error ? `OFFLINE · ${c.error}` : "OFFLINE") : "LIVE LINK NOT SET"}
        </span>
      </div>
      <p className="pb-cmp-lede">
        Follows every S&amp;P 500 and Nasdaq-100 company{k?.international ? `, plus ${k.international} foreign companies from ${Math.max(0, (k.countries || 1) - 1)} other countries,` : ""} for the long-term board on Korvus: prices, SEC financials,
        analyst consensus and a 0 to 100 score. Its analyst agent writes the brief on every stock page. It shares
        the SEC request budget ({c?.sec_rps ?? 4}/s here) and the vault with the Intel crawler above.
      </p>
      <div className="pb-stats">
        <div><span>Stocks</span><b>{k?.stocks ?? "n/a"}</b><em>{k ? `+ ${k.funds} index funds` : ""}</em></div>
        <div><span>Scored</span><b>{k?.scored ?? "n/a"}</b><em>{k ? `${k.top_rated} top rated` : ""}</em></div>
        <div><span>Bullish reads</span><b className="pos">{k?.bullish ?? "n/a"}</b><em>strong score, trend holding</em></div>
        <div><span>Bearish reads</span><b className="neg">{k?.bearish ?? "n/a"}</b><em>weak score or downtrend</em></div>
        <div><span>Pages written</span><b>{k?.briefs ?? "n/a"}</b><em>{k ? `${ai} by the AI analyst` : ""}</em></div>
        <div><span>Updates, 24h</span><b>{k?.updates_24h ?? "n/a"}</b><em>filings, trend turns, tier moves</em></div>
      </div>
      <div className="pb-grid-2">
        <div>
          <div className="pb-panel-h"><span>Crawler jobs</span></div>
          <div className="pb-checks">
            {jobs.map((j) => (
              <div className="pb-check" key={j.key}>
                <i className={`pb-dot ${j.key === "live" && !c?.live_prices ? "idle" : dot(j.key, j.stale)}`} />
                <span className="pb-check-l">{j.label}</span>
                <span className="pb-check-n">
                  {st[j.key]?.error
                    ? String(st[j.key].error)
                    : j.key === "live" && !c?.live_prices
                      ? j.note
                      : [st[j.key]?.at ? ago(st[j.key].at, now) : "not run yet", j.note].filter(Boolean).join(" · ")}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="pb-panel-h"><span>Latest Compass updates</span><span className="pb-dim">{c?.events?.length ? `${c.events.length} latest` : ""}</span></div>
          {c?.events?.length ? (
            <div className="pb-feed">
              {c.events.map((e, i) => (
                <div className={`pb-ev ${e.tone === "bear" ? "error" : ""}`} key={e.ts_utc + e.symbol + i}>
                  <span className="pb-ev-t">{et(e.ts_utc, false)}</span>
                  <span className={`pb-ev-s s-${e.kind === "filing" ? "edgar" : e.kind === "tier" ? "scoring" : "bot"}`}>{e.kind.toUpperCase().slice(0, 7)}</span>
                  <span className="pb-ev-m" title={e.detail || ""}>{e.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="pb-dim" style={{ padding: "10px 0" }}>
              {up ? "Nothing has changed yet. New filings, trend turns and tier moves land here." : "Waiting for the Compass crawler."}
            </div>
          )}
          {c?.top?.length ? (
            <>
              <div className="pb-panel-h" style={{ marginTop: 14 }}><span>Top of the board</span></div>
              {c.top.slice(0, 5).map((t) => (
                <div className="pb-row" key={t.symbol}>
                  <span className="pb-row-t">{t.tier}</span>
                  <span className="pb-sym">{t.symbol}</span>
                  <span className="pb-row-m">{t.name} <span className="pb-dim">· {t.trend}</span></span>
                  <span className="pb-row-v">{Math.round(t.score)}</span>
                </div>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export const PaperBot: React.FC = () => {
  const [data, setData] = useState<IntelData | null>(null);
  const [live, setLive] = useState<IntelLive | null>(null);
  const [compass, setCompass] = useState<CompassLive | null>(null);
  const [lab, setLab] = useState<LabData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [view, setViewRaw] = useState<string>(() => {
    try { return window.localStorage.getItem("pb.view") || "overview"; } catch { return "overview"; }
  });
  const setView = (v: string) => {
    setViewRaw(v);
    try { window.localStorage.setItem("pb.view", v); } catch {}
  };
  const hits = useRef<Record<string, number>>({});
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadData = () => getIntel().then((d) => { setData(d); setLoaded(true); });
    const loadLive = () =>
      getIntelLive().then((l) => {
        setLive(l);
        // flash a pipeline node when a NEW event lands for its stage
        const first = seen.current.size === 0;
        for (const e of l?.events || []) {
          const id = e.t + e.msg;
          if (!seen.current.has(id)) {
            seen.current.add(id);
            if (!first) hits.current[e.stage === "quotes" ? "bot" : e.stage] = Date.now();
          }
        }
      });
    const loadLab = () => getLab().then(setLab);
    const loadCompass = () => getCompassLive().then(setCompass);
    loadData();
    loadLive();
    loadLab();
    loadCompass();
    const a = setInterval(loadData, 60_000);
    const b = setInterval(loadLive, 5_000);
    const c = setInterval(() => setNow(Date.now()), 1_000);
    const d = setInterval(loadLab, 30_000);
    const e = setInterval(loadCompass, 15_000);
    return () => { clearInterval(a); clearInterval(b); clearInterval(c); clearInterval(d); clearInterval(e); };
  }, []);

  const st = live?.stages || {};
  const sb = data?.board?.scoreboard;
  const rules = data?.board?.rules;
  const minSample = data?.board?.min_sample ?? 30;
  const running = Boolean(live?.configured && live?.reachable && live?.running);

  /* --------------------------- pipeline nodes */
  const nodes: Node[] = useMemo(() => {
    const u = st.universe || {}, e = st.edgar || {}, s = st.scoring || {}, b = st.bot || {}, v = st.vault || {};
    const uAge = ageS(u.last_ok_utc, now);
    const eAge = ageS(e.last_poll_utc, now);
    const eInt = Number(e.interval_s) || 20;
    let ring: number | undefined;
    if (e.next_poll_utc) {
      const left = (new Date(e.next_poll_utc).getTime() - now) / 1000;
      ring = Math.min(1, Math.max(0, 1 - left / eInt));
    }
    const recentErr = (x: any) => x.last_error_utc && ageS(x.last_error_utc, now) < 3600 &&
      (!x.last_ok_utc || new Date(x.last_error_utc) > new Date(x.last_ok_utc));
    return [
      {
        key: "universe", stage: "universe", title: "Screener",
        metric: `${n0(u.count ?? data?.board?.universe_count)} stocks`,
        detail: `$${u.band?.[0] ?? rules?.price_band?.[0] ?? 80}-$${u.band?.[1] ?? rules?.price_band?.[1] ?? 120} · ${ago(u.last_ok_utc, now)}`,
        health: !live?.running ? "idle" : uAge < 26 * 3600 ? "ok" : uAge < 50 * 3600 ? "warn" : "bad",
      },
      {
        key: "edgar", stage: "edgar", title: "EDGAR watch",
        metric: `${n0(e.scanned_today)} scanned`,
        detail: e.open
          ? `every ${eInt}s · polled ${ago(e.last_poll_utc, now)}`
          : `EDGAR closed · polled ${ago(e.last_poll_utc, now)}`,
        health: !live?.running ? "idle" : eAge < eInt * 3 + 10 ? (e.feeds_ok < e.feeds ? "warn" : "ok") : "bad",
        ring: live?.running ? ring : undefined,
      },
      {
        key: "scoring", stage: "scoring",
        title: s.mode === "crown" ? "Crown read" : s.mode === "shadow" ? "Haiku + Crown" : "Haiku read",
        metric: `${n0(s.scored_today)} scored today`,
        detail: s.last_symbol ? `${s.last_symbol}: ${s.last_result}` : "waiting for a filing",
        health: !live?.running ? "idle" : recentErr(s) ? "bad" : s.last_ok_utc ? "ok" : "idle",
      },
      {
        key: "bot", stage: "bot", title: "Paper bot",
        metric: `${n0(b.open_positions ?? sb?.open_trades)} open`,
        detail: (b.session_open
          ? b.in_window ? `hunting · ${n0(b.candidates)} candidate(s)` : "managing exits only"
          : b.phase === "maintenance" ? "maintenance hour (5 to 6 PM ET), resting"
          : b.phase === "weekend" ? "weekend, resting until Sunday 6 PM ET"
          : "market closed, resting")
          + (b.session_open && b.phase && b.phase !== "regular" ? ` · ${PHASE[b.phase] || b.phase}` : "")
          + ` · ${n0(b.entries_today)} in today`,
        health: !live?.running ? "idle" : b.session_open
          ? ageS(b.last_tick_utc, now) < 180 ? "ok" : "bad"
          : "idle",
      },
      {
        key: "vault", stage: "vault", title: "Obsidian vault",
        metric: `${n0(v.pushes_today)} push(es) today`,
        detail: `synced ${ago(v.last_sync_utc, now)}`,
        health: !live?.running ? "idle" : recentErr(v) ? "bad"
          : ageS(v.last_sync_utc, now) < 25 * 60 ? "ok" : ageS(v.last_sync_utc, now) < 3600 ? "warn" : "bad",
      },
    ];
  }, [st, now, live, data, sb, rules]);

  /* --------------------------- health checks */
  const checks: { label: string; h: Health; note: string }[] = useMemo(() => {
    const e = st.edgar || {}, q = st.quotes || {}, cr = st.crown || {}, sc = st.scoring || {};
    const list: { label: string; h: Health; note: string }[] = [];
    if (!live || !live.configured) {
      list.push({ label: "Live link to Korvus", h: "warn", note: "add KORVUS_INTEL_KEY to this admin's .env" });
    } else if (!live.reachable) {
      list.push({ label: "Live link to Korvus", h: "bad", note: live.error || "unreachable" });
    } else {
      list.push({
        label: "Crawler process",
        h: live.running ? "ok" : "bad",
        note: live.running ? `heartbeat ${Math.round(live.heartbeat_age_s || 0)}s ago · up since ${et(live.started_utc)}` : `no heartbeat for ${Math.round(live.heartbeat_age_s || 0)}s`,
      });
      list.push({
        label: "EDGAR feeds answering",
        h: e.feeds ? (e.feeds_ok === e.feeds ? "ok" : "warn") : "idle",
        note: e.feeds ? `${e.feeds_ok}/${e.feeds} feeds · last poll ${e.last_duration_ms ?? "?"}ms` : "no poll yet",
      });
      list.push({
        label: "Filings matched today",
        h: "idle",
        note: `${n0(e.new_today)} new from the universe · ${n0(e.polls_today)} polls`,
      });
      if (sc.mode && sc.mode !== "haiku") {
        const crErr = cr.last_error_utc && ageS(cr.last_error_utc, now) < 3600 &&
          (!cr.last_ok_utc || new Date(cr.last_error_utc) > new Date(cr.last_ok_utc));
        list.push({
          label: `Crown link (${sc.mode})`,
          h: !sc.crown_configured ? "bad" : crErr ? "bad" : cr.last_ok_utc ? "ok" : "idle",
          note: !sc.crown_configured
            ? "set OPENROUTER_API_KEY and CROWN_MODEL on the Korvus box"
            : crErr ? String(cr.last_error)
            : cr.last_ok_utc ? `${sc.crown_model || cr.model || "model"} · ${n0(cr.reads_today)} reads today · last ${Math.round((cr.last_ms || 0) / 1000)}s ${ago(cr.last_ok_utc, now)}`
            : "linked, waiting for a filing",
        });
        if (sc.mode === "shadow") {
          list.push({
            label: "Crown vs Haiku",
            h: "idle",
            note: cr.compared_today
              ? `agreed on ${cr.agree_today} of ${cr.compared_today} today (impact + direction)`
              : "no side-by-side reads yet today",
          });
        }
      }
      list.push({
        label: "Price quotes",
        h: q.last_error_utc && ageS(q.last_error_utc, now) < 3600 ? "warn" : q.last_ok_utc ? "ok" : "idle",
        note: q.last_ok_utc ? `${n0(q.calls_today)} today · last ${q.last_symbol} ${ago(q.last_ok_utc, now)}` : "none needed yet",
      });
    }
    list.push({
      label: "Vault copy on this box",
      h: data?.configured ? "ok" : "warn",
      note: data?.configured ? `intel/ present · files changed ${ago(data.dataMtime, now)}` : "intel/ not pulled yet",
    });
    return list;
  }, [st, live, data, now]);

  /* --------------------------- path to live */
  // Real money is earned by the INDEX FUTURES book only, one market at a time,
  // and only on what that market's champion did AFTER it was crowned. The
  // company stock book never goes live: it is the paper record that checks the
  // crawler's reads.
  const paths = useMemo(() => {
    const risk = lab?.style?.risk_usd || 150;
    const need = lab?.min_champion || 20;
    const crownT = lab?.style?.crown_t || 2;
    return ["MNQ", "MES"].map((sym) => {
      const m = (lab?.markets || []).find((x) => x.sym === sym);
      const champ = (m?.strategies || []).find((x) => x.status === "champion");
      const a = champ?.since_crowned;
      const n = a?.trades ?? 0;
      const since = champ?.promoted_utc || "";
      const mine = (lab?.trades || [])
        .filter((t) => champ && t.strat === champ.id && t.status !== "open" && t.exit_utc && t.exit_utc > since)
        .sort((x, y) => String(x.exit_utc).localeCompare(String(y.exit_utc)));
      const days = new Set(mine.map((t) => String(t.exit_utc).slice(0, 10))).size;
      const last = mine.slice(-20);
      const lastR = last.length ? last.reduce((sum, t) => sum + (t.r ?? 0), 0) / last.length : null;
      const ddR = a?.max_drawdown != null ? a.max_drawdown / risk : null;
      // performance gates cannot pass on a handful of trades: they count from the lab's own sample size
      const enough = n >= need;
      const g = (label: string, val: string, ok: boolean, prog: number, note: string, perf = false) => ({
        label, val, ok: perf ? ok && enough : ok,
        prog: Math.max(0, Math.min(1, perf && !enough ? Math.min(prog, n / need) : prog)),
        note: perf && !enough ? `${note} (counts from ${need} trades)` : note,
      });
      const list = [
        g("Champion crowned", champ ? champ.id : "none yet", Boolean(champ), champ ? 1 : 0, "one rule set has to win the crown before anything counts"),
        g("Trades since the crown", `${n} / 60`, n >= 60, n / 60, "enough trades after the crown that luck washes out"),
        g("Trading days since the crown", `${days} / 30`, days >= 30, days / 30, "about six weeks of different market moods"),
        g("Edge per trade", a?.exp_r != null ? rmult(a.exp_r) : "n/a", (a?.exp_r ?? -1) >= 0.1, ((a?.exp_r ?? 0) + 0.1) / 0.2, "at least +0.10R after commission and slippage", true),
        g("Proof it is not luck", a?.t_stat != null ? `t ${a.t_stat}` : "n/a", (a?.t_stat ?? 0) >= crownT, (a?.t_stat ?? 0) / crownT, `a t-score of ${crownT} or better on the trades since the crown`, true),
        g("Profit factor", a?.profit_factor ? String(a.profit_factor) : "n/a", (a?.profit_factor ?? 0) >= 1.3, (a?.profit_factor ?? 0) / 1.3, "gross wins at least 1.3x gross losses", true),
        g("Max drawdown", ddR != null && n ? `${ddR.toFixed(1)}R` : "n/a", n > 0 && (ddR ?? 99) <= 8, n > 0 ? 1 - (ddR ?? 0) / 16 : 0, `no worse than 8 losing trades deep ($${n0(risk * 8)} at $${n0(risk)} a trade)`, true),
        g("Recent form (last 20)", lastR != null ? rmult(lastR) : "n/a", (lastR ?? -1) > 0 && last.length >= 20, last.length / 20, "still working lately, not just early luck", true),
      ];
      return { sym, name: m?.name || sym, champ: champ?.id || null, gates: list, passed: list.filter((x) => x.ok).length, all: list.every((x) => x.ok) };
    });
  }, [lab]);
  const anyLiveReady = paths.some((x) => x.all);

  const events: IntelEvent[] = (live?.events || []).slice().reverse().slice(0, 40);

  /* --------------------------- the two books, in one line each */
  const bot = st.bot || {};
  const watchN = Array.isArray(bot.watch) ? bot.watch.filter((w: any) => w.state === "confirming" || w.state === "waiting").length : 0;
  const markets = lab?.markets || [];
  const fut = useMemo(() => {
    const trades = markets.reduce((a, m) => a + (m.all?.trades || 0), 0);
    const wins = markets.reduce((a, m) => a + (m.all?.wins || 0), 0);
    const pnl = markets.reduce((a, m) => a + (m.all?.pnl || 0), 0);
    const holds = markets.filter((m) => m.all?.avg_hold_min != null && m.all.trades);
    const hold = holds.length ? holds.reduce((a, m) => a + (m.all.avg_hold_min as number) * m.all.trades, 0) / holds.reduce((a, m) => a + m.all.trades, 0) : null;
    const steps = markets.flatMap((m) => (m.equity || []).map((p, i, arr) => ({ t: p.t, d: p.v - (i ? arr[i - 1].v : 0) }))).sort((a, b) => a.t.localeCompare(b.t));
    let cum = 0;
    return { trades, wins, pnl, hold, open: markets.reduce((a, m) => a + (m.open || []).length, 0), curve: steps.map((x) => (cum += x.d)) };
  }, [markets]);
  const ls = labState(lab);
  const stockPhase = !running ? "crawler offline" : bot.session_open ? (bot.in_window ? "in an entry window" : "managing exits only") : "market closed";

  const VIEWS = [
    { id: "overview", label: "Overview" },
    { id: "stocks", label: "Company stock", note: sb ? `${sb.closed_trades} trades` : undefined },
    { id: "futures", label: "Index futures", note: markets.length ? `${fut.trades} trades` : undefined },
    { id: "crawler", label: "Crawler", note: running ? "live" : "offline" },
  ];

  /* --------------------------- render */
  return (
    <div className="pb">
      <div className="page-head pb-head">
        <div>
          <span className="eyebrow">Paper Bot</span>
          <h1>Korvus Intel</h1>
          <p>
            Two paper books with two jobs. Index futures (MNQ and MES) are swing trades inside the day, never scalps,
            and are the only book that can ever trade real money, once a champion proves itself. Company stock is traded
            on the filings the crawler reads and stays on paper for good, as the check on how accurate those reads are.
            No broker, no real money, until it earns it.
          </p>
        </div>
        <div className="pb-head-right">
          <span className={`pb-live ${running ? "on" : live?.configured ? "off" : "unset"}`}>
            <i />
            {running ? "CRAWLER LIVE" : live?.configured ? "CRAWLER OFFLINE" : "LIVE LINK NOT SET"}
          </span>
          <span className={`pb-live ${compass?.running ? "on" : compass?.configured ? "off" : "unset"}`}>
            <i />
            {compass?.running ? "COMPASS LIVE" : compass?.configured ? "COMPASS OFFLINE" : "COMPASS NOT SET"}
          </span>
          <span className="pb-paper">PAPER ONLY</span>
        </div>
      </div>

      {!loaded ? (
        <div className="soon-panel">Loading the scoreboard...</div>
      ) : (
        <>
          <Seg value={view} onChange={setView} options={VIEWS} />

          {view === "overview" ? (
            <div className="bk">
              <div className="bk-books">
                <button className="bk-book" onClick={() => setView("stocks")}>
                  <div className="bk-book-top">
                    <span className="bk-book-k">Company stock · paper for good</span>
                    <span className="pb-tag bk-pb">{sb?.strategy || rules?.strategy || "no rules yet"}</span>
                  </div>
                  <h3>Catalyst bot</h3>
                  <p>Scalps a filing the crawler just read. Swings the rest inside the day. Flat by the close. Never real money: this book checks the crawler's reads and builds the accuracy record.</p>
                  <div className="bk-book-main">
                    <div>
                      <strong className={tone(sb?.paper_pnl)}>{usd(sb?.paper_pnl ?? 0)}</strong>
                      <span>paper P&amp;L under these rules</span>
                    </div>
                    <Spark pts={(data?.equity || []).map((p) => p.v)} />
                  </div>
                  <div className="bk-book-stats">
                    <div><b>{sb?.closed_trades ?? 0}</b><span>closed trades</span></div>
                    <div><b>{sb?.win_rate_pct != null ? `${sb.win_rate_pct}%` : "n/a"}</b><span>winners</span></div>
                    <div><b className={tone(sb?.expectancy_r ?? sb?.expectancy_pct)}>{sb?.expectancy_r != null ? rmult(sb.expectancy_r) : pct(sb?.expectancy_pct)}</b><span>per trade</span></div>
                    <div><b>{mins(sb?.avg_hold_min)}</b><span>average hold</span></div>
                  </div>
                  <div className="bk-book-foot">
                    <i className={`pb-dot ${running ? "ok" : "bad"}`} />
                    {stockPhase} · {n0(bot.open_positions ?? sb?.open_trades ?? 0)} open · {watchN} on the radar
                    {data?.retired?.length ? ` · ${data.retired.reduce((a, r) => a + r.trades, 0)} earlier trades under retired rules` : ""}
                  </div>
                </button>

                <button className="bk-book" onClick={() => setView("futures")}>
                  <div className="bk-book-top">
                    <span className="bk-book-k">Index futures · the real money path</span>
                    <span className="pb-tag bk-pb">{lab?.rules || "first-generation rules"}</span>
                  </div>
                  <h3>Strategy lab</h3>
                  <p>MNQ and MES, run as a quant desk would. Rule sets are replayed on stored tape before they trade, every trade is sized by risk, and each one is kept or retired on its statistics. Intraday swings only.</p>
                  <div className="bk-book-main">
                    <div>
                      <strong className={tone(fut.pnl)}>{usd(fut.pnl)}</strong>
                      <span>paper P&amp;L, every strategy, after costs</span>
                    </div>
                    <Spark pts={fut.curve} />
                  </div>
                  <div className="bk-book-stats">
                    <div><b>{fut.trades}</b><span>closed trades</span></div>
                    <div><b>{fut.trades ? `${Math.round((fut.wins / fut.trades) * 100)}%` : "n/a"}</b><span>winners</span></div>
                    <div><b className={tone(fut.pnl)}>{fut.trades ? usd(fut.pnl / fut.trades) : "n/a"}</b><span>per trade</span></div>
                    <div><b>{mins(fut.hold)}</b><span>average hold</span></div>
                  </div>
                  <div className="bk-book-foot">
                    <i className={`pb-dot ${ls.ok ? "ok" : "warn"}`} />
                    {markets.length
                      ? markets.map((m) => `${m.sym} ${m.champion ? `champion ${m.champion}` : "no champion yet"}`).join(" · ") + ` · ${fut.open} open`
                      : ls.text}
                  </div>
                </button>
              </div>

              <section className="pb-panel">
                <div className="pb-panel-h"><span>How each book trades</span><span className="pb-dim">the house style</span></div>
                <div className="bk-style">
                  <div>
                    <em>Company stock · scalp</em>
                    <p>{rules?.lines?.find((l) => /scalp/i.test(l.k))?.v || "Allowed only on company stock, on a high-impact filing the crawler read minutes ago. In and out inside 45 minutes."}</p>
                  </div>
                  <div>
                    <em>Company stock · day swing</em>
                    <p>{rules?.lines?.find((l) => /swing/i.test(l.k))?.v || "The main book. Enters after the opening range has formed, sizes the stop to the stock's own range, and is flat before the close."}</p>
                  </div>
                  <div>
                    <em>Index futures · swing only</em>
                    <p>
                      {lab?.style
                        ? `No scalping. Targets and stops are measured in ${lab.style.unit}, holds run from ${mins(lab.style.min_hold_cap_min)} up to six hours, each strategy takes at most ${lab.style.max_trades_day} trades a day, nothing new after ${lab.style.last_entry_et} ET and always flat by ${lab.style.flat_et} ET.`
                        : "No scalping. Every strategy is built to hold for an hour or more and is always flat before the 5 PM ET maintenance hour."}
                    </p>
                  </div>
                </div>
              </section>

              {/* ---------------- path to live ---------------- */}
              <section className="pb-panel pb-path">
                <div className="pb-panel-h">
                  <span>Path to real money · index futures only (MNQ, MES)</span>
                  <span className={anyLiveReady ? "pb-pass" : "pb-dim"}>{paths.map((x) => `${x.sym} ${x.passed}/${x.gates.length}`).join(" · ")} gates passed</span>
                </div>
                <div className="pb-steps">
                  {[
                    ["Paper", "The strategy lab trades MNQ and MES on live CME data with simulated fills. A market's champion has to prove itself again after it is crowned.", true],
                    ["Broker paper", "The proven champion's orders routed to a broker's paper account for about 4 weeks, to compare real order handling against our fills.", false],
                    ["Live pilot", "Real money, one micro contract at a time in that market only, a hard daily loss stop, a kill switch, and your approval on each order.", false],
                    ["Scale", "Size goes up in steps only while live results keep matching paper.", false],
                  ].map(([t, d, cur], i) => (
                    <div className={`pb-step${cur ? " cur" : ""}`} key={String(t)}>
                      <span className="pb-step-n">{i + 1}</span>
                      <div><b>{t}</b>{cur ? <em>you are here</em> : null}<p>{d}</p></div>
                    </div>
                  ))}
                </div>
                {paths.map((x) => (
                  <div key={x.sym}>
                    <div className="pb-panel-h" style={{ marginTop: 14 }}>
                      <span>{x.sym} · {x.champ ? `champion ${x.champ}, judged only on trades since its crown` : "no champion yet, so nothing counts toward real money"}</span>
                      <span className={x.all ? "pb-pass" : "pb-dim"}>{x.passed}/{x.gates.length}</span>
                    </div>
                    <div className="pb-gates">
                      {x.gates.map((g) => (
                        <div className={`pb-gate${g.ok ? " ok" : ""}`} key={g.label}>
                          <div className="pb-gate-top"><span>{g.ok ? "✓" : "○"} {g.label}</span><b>{g.val}</b></div>
                          <span className="pb-bar"><i style={{ width: `${g.prog * 100}%` }} /></span>
                          <em>{g.note}</em>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="pb-fine">
                  Only MNQ and MES can ever trade real money, and each earns it separately: stage 2 unlocks for a market
                  when every one of its gates passes on the same champion. A champion that loses its crown starts that
                  market over. The lab's total P&L above counts every rule set it has tried, including retired ones, so
                  it is not the number that unlocks anything. The company stock book stays on paper for good: its job is
                  to check the crawler's reads against what price did and to build the record that can later be posted to
                  Discord as proof of how accurate the news calls are. Passing the gates is evidence, not a guarantee.
                  Markets change, and paper fills are kinder than real ones. Paper results are simulated and are not a
                  promise of returns.
                </p>
              </section>
            </div>
          ) : null}

          {view === "stocks" ? (
            !data?.configured ? (
              <div className="notice" style={{ marginTop: 18 }}>
                <div className="notice-h">Waiting for intel/ to arrive on this box</div>
                <p>
                  Looking in <code>{data?.dir}</code>. It appears after the next brain sync. If the brain lives
                  elsewhere, set INTEL_DIR in .env.
                </p>
              </div>
            ) : <StockBook data={data} live={live} />
          ) : null}

          {view === "futures" ? <FuturesBook d={lab} /> : null}

          {view === "crawler" ? (
            <div className="bk">
              <section className="pb-panel pb-hero">
                <div className="pb-panel-h">
                  <span>The crawler, live</span>
                  <span className="pb-dim">
                    {running ? `heartbeat ${Math.round(live?.heartbeat_age_s || 0)}s ago` : "status updates every 5s"}
                  </span>
                </div>
                <Pipeline nodes={nodes} hits={hits.current} now={now} live={running} />
              </section>

              <div className="bk-grid">
                <section className="pb-panel">
                  <div className="pb-panel-h">
                    <span>Activity</span>
                    <span className="pb-dim">{events.length ? `${events.length} latest` : ""}</span>
                  </div>
                  {events.length ? (
                    <div className="pb-feed">
                      {events.map((e) => (
                        <div className={`pb-ev ${e.level}`} key={e.t + e.msg}>
                          <span className="pb-ev-t">{et(e.t, false)}</span>
                          <span className={`pb-ev-s s-${e.stage}`}>{STAGE_LABEL[e.stage] || e.stage.toUpperCase()}</span>
                          <span className="pb-ev-m" title={e.msg}>{e.msg}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty>{live?.configured ? "No activity reported yet." : "Connect the live link to watch the crawler work in real time."}</Empty>
                  )}
                </section>

                <section className="pb-panel">
                  <div className="pb-panel-h">
                    <span>Health checks</span>
                    <span className="pb-dim">
                      {[...nodes.map((x) => x.health), ...checks.map((c) => c.h)].filter((h) => h === "ok").length}/
                      {[...nodes.map((x) => x.health), ...checks.map((c) => c.h)].filter((h) => h !== "idle").length} passing
                    </span>
                  </div>
                  <div className="pb-checks">
                    {nodes.map((n) => (
                      <div className="pb-check" key={"n" + n.key}>
                        <span className={`pb-dot ${n.health}`} />
                        <span className="pb-check-l">{n.title}</span>
                        <span className="pb-check-n">{n.detail}</span>
                      </div>
                    ))}
                    {checks.map((c) => (
                      <div className="pb-check" key={c.label}>
                        <span className={`pb-dot ${c.h}`} />
                        <span className="pb-check-l">{c.label}</span>
                        <span className="pb-check-n">{c.note}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <section className="pb-panel">
                <div className="pb-panel-h"><span>Latest scored filings</span><span className="pb-dim">{data?.filingsToday ?? 0} seen today</span></div>
                {data?.filings?.length ? data.filings.map((f) => (
                  <div className="bk-filing" key={f.url + f.seen_utc}>
                    <div className="bk-filing-top">
                      <span className="pb-row-t">{et(f.seen_utc)}</span>
                      <span className="bk-sym">{f.symbol}</span>
                      <span className={`pb-tag imp-${f.impact}`}>{f.impact}</span>
                      <span className={`pb-tag dir-${f.direction}`}>{f.direction} {f.confidence}%</span>
                      <span className="pb-tag">{String(f.catalyst || "other").replace(/_/g, " ")}</span>
                      <a href={f.url} target="_blank" rel="noopener noreferrer">{f.headline}</a>
                    </div>
                    <p>{f.summary}</p>
                  </div>
                )) : <Empty>No scored filings yet.</Empty>}
              </section>

              {/* ---------------- second crawler ---------------- */}
              <CompassPanel c={compass} now={now} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
