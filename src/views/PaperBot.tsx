import React, { useEffect, useMemo, useRef, useState } from "react";
import { FuturesBook, labState } from "../components/FuturesLab";
import { StockBook } from "../components/StockBook";
import { Empty, Seg, Spark, ageS, ago, et, mins, n0, pct, rmult, tone, usd } from "../components/botui";
import {
  getIntel,
  getIntelLive,
  getLab,
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
export const PaperBot: React.FC = () => {
  const [data, setData] = useState<IntelData | null>(null);
  const [live, setLive] = useState<IntelLive | null>(null);
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
    loadData();
    loadLive();
    loadLab();
    const a = setInterval(loadData, 60_000);
    const b = setInterval(loadLive, 5_000);
    const c = setInterval(() => setNow(Date.now()), 1_000);
    const d = setInterval(loadLab, 30_000);
    return () => { clearInterval(a); clearInterval(b); clearInterval(c); clearInterval(d); };
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
          : "market closed, resting") + ` · ${n0(b.entries_today)} in today`,
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
  const gates = useMemo(() => {
    const s = sb;
    const n = s?.closed_trades ?? 0;
    const aw = s?.avg_win_pct ?? 0, al = Math.abs(s?.avg_loss_pct ?? 0);
    const be = aw + al > 0 ? (al / (aw + al)) * 100 : null;
    // performance gates cannot pass on a handful of trades: they only count from 30
    const enough = n >= 30;
    const g = (label: string, val: string, ok: boolean, prog: number, note: string, perf = false) => ({
      label, val, ok: perf ? ok && enough : ok,
      prog: Math.max(0, Math.min(1, perf && !enough ? Math.min(prog, n / 30) : prog)),
      note: perf && !enough ? `${note} (counts from 30 trades)` : note,
    });
    return [
      g("Closed trades", `${n} / 100`, n >= 100, n / 100, "enough trades that luck washes out"),
      g("Trading days", `${s?.trading_days ?? 0} / 40`, (s?.trading_days ?? 0) >= 40, (s?.trading_days ?? 0) / 40, "about two months of different market moods"),
      g("Expectancy per trade", pct(s?.expectancy_pct), (s?.expectancy_pct ?? -1) >= 0.1, ((s?.expectancy_pct ?? 0) + 0.1) / 0.2, "at least +0.10% after modeled slippage", true),
      g("Recent form (last 30)", pct(s?.last30_expectancy_pct), (s?.last30_expectancy_pct ?? -1) > 0 && n >= 30, n >= 30 ? 1 : n / 30, "still working lately, not just early luck", true),
      g("Profit factor", s?.profit_factor ? String(s.profit_factor) : "n/a", (s?.profit_factor ?? 0) >= 1.3, (s?.profit_factor ?? 0) / 1.3, "gross wins at least 1.3x gross losses", true),
      g("Max drawdown", s?.max_drawdown_pct !== undefined && s?.max_drawdown_pct !== null ? `${s.max_drawdown_pct}%` : "n/a", n > 0 && (s?.max_drawdown_pct ?? 100) <= 5, n > 0 ? 1 - (s?.max_drawdown_pct ?? 0) / 10 : 0, `no worse than 5% of $${n0(s?.capital_at_work ?? 50000)} at work`, true),
      g("Win rate vs break-even", s?.win_rate_pct !== null && s?.win_rate_pct !== undefined && be !== null ? `${s.win_rate_pct}% vs ${be.toFixed(0)}%` : "n/a", be !== null && (s?.win_rate_pct ?? 0) > be + 5, be !== null ? (s?.win_rate_pct ?? 0) / (be + 5) : 0, "comfortably above what the win/loss sizes need", true),
    ];
  }, [sb]);
  const gatesPassed = gates.filter((x) => x.ok).length;
  const allPass = gatesPassed === gates.length;

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
            Two paper books, one standard. Company stock is traded on the filings the crawler reads: a scalp when the
            filing is minutes old, a swing inside the day otherwise. Index futures are swing trades inside the day, never scalps.
            No broker, no real money, until it earns it.
          </p>
        </div>
        <div className="pb-head-right">
          <span className={`pb-live ${running ? "on" : live?.configured ? "off" : "unset"}`}>
            <i />
            {running ? "CRAWLER LIVE" : live?.configured ? "CRAWLER OFFLINE" : "LIVE LINK NOT SET"}
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
                    <span className="bk-book-k">Company stock</span>
                    <span className="pb-tag bk-pb">{sb?.strategy || rules?.strategy || "no rules yet"}</span>
                  </div>
                  <h3>Catalyst bot</h3>
                  <p>Scalps a filing the crawler just read. Swings the rest inside the day. Flat by the close.</p>
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
                    <span className="bk-book-k">Index futures</span>
                    <span className="pb-tag bk-pb">{lab?.rules || "first-generation rules"}</span>
                  </div>
                  <h3>Strategy lab</h3>
                  <p>MNQ and MES. The lab invents rule sets, keeps the ones that pay and retires the rest. Intraday swings only.</p>
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
                  <span>Path to real money · company stock book</span>
                  <span className={allPass ? "pb-pass" : "pb-dim"}>{gatesPassed}/{gates.length} gates passed</span>
                </div>
                <div className="pb-steps">
                  {[
                    ["Paper", "Simulated fills on live data. Rules frozen while the sample builds.", true],
                    ["Broker paper", "Same rules routed to a broker's paper account for about 4 weeks, to compare real order handling against our fills.", false],
                    ["Live pilot", "Real money, tiny size: one small position at a time, a hard daily loss stop, a kill switch, and your approval on each order.", false],
                    ["Scale", "Size goes up in steps only while live results keep matching paper.", false],
                  ].map(([t, d, cur], i) => (
                    <div className={`pb-step${cur ? " cur" : ""}`} key={String(t)}>
                      <span className="pb-step-n">{i + 1}</span>
                      <div><b>{t}</b>{cur ? <em>you are here</em> : null}<p>{d}</p></div>
                    </div>
                  ))}
                </div>
                <div className="pb-gates">
                  {gates.map((g) => (
                    <div className={`pb-gate${g.ok ? " ok" : ""}`} key={g.label}>
                      <div className="pb-gate-top"><span>{g.ok ? "✓" : "○"} {g.label}</span><b>{g.val}</b></div>
                      <span className="pb-bar"><i style={{ width: `${g.prog * 100}%` }} /></span>
                      <em>{g.note}</em>
                    </div>
                  ))}
                </div>
                <p className="pb-fine">
                  Stage 2 unlocks when every gate passes on the same rule version. Changing a rule starts a fresh
                  scoreboard. The futures lab earns its own path the same way: a champion has to hold up after it is crowned.
                  Passing the gates is evidence, not a guarantee. Markets change, and paper fills are kinder than real
                  ones. Paper results are simulated and are not a promise of returns.
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
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
