import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  getIntel,
  getIntelLive,
  type IntelData,
  type IntelLive,
  type IntelTrade,
  type IntelEvent,
} from "../api";

/* ------------------------------------------------------------------ helpers */
const ageS = (iso?: string | null, now = Date.now()) =>
  iso ? Math.max(0, (now - new Date(iso).getTime()) / 1000) : Infinity;
const ago = (iso?: string | null, now = Date.now()) => {
  const s = ageS(iso, now);
  if (!isFinite(s)) return "never";
  if (s < 60) return `${Math.round(s)}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};
const et = (iso?: string | null, withDate = true) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      ...(withDate ? { month: "short", day: "numeric" } : {}),
      hour: "numeric",
      minute: "2-digit",
      ...(withDate ? {} : { second: "2-digit" }),
    });
  } catch {
    return iso;
  }
};
const pct = (v: number | null | undefined, signed = true) =>
  v === null || v === undefined ? "n/a" : `${signed && v > 0 ? "+" : ""}${v.toFixed(2)}%`;
const usd = (v: number | null | undefined) =>
  v === null || v === undefined
    ? "n/a"
    : `${v < 0 ? "-" : v > 0 ? "+" : ""}$${Math.abs(v).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
const tone = (v: number | null | undefined) =>
  v === null || v === undefined || v === 0 ? "" : v > 0 ? "pos" : "neg";
const n0 = (v: any) => (typeof v === "number" ? v.toLocaleString("en-US") : "0");

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

/* ------------------------------------------------------------------ equity */
const Equity: React.FC<{ pts: { t: string; v: number; sym: string }[] }> = ({ pts }) => {
  if (pts.length < 2)
    return <div className="bl-empty">The curve draws itself after the first two closed trades.</div>;
  const W = 640, H = 150, P = 8;
  const vals = [0, ...pts.map((p) => p.v)];
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || 1;
  const x = (i: number) => P + (i / (vals.length - 1)) * (W - 2 * P);
  const y = (v: number) => H - P - ((v - lo) / span) * (H - 2 * P);
  const line = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = vals[vals.length - 1];
  return (
    <svg className="pb-equity" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="pbEq" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={last >= 0 ? "#35e08f" : "#ff5c7a"} stopOpacity="0.35" />
          <stop offset="1" stopColor={last >= 0 ? "#35e08f" : "#ff5c7a"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={P} x2={W - P} y1={y(0)} y2={y(0)} className="pb-eq-zero" />
      <path d={`${line} L${x(vals.length - 1)},${H - P} L${x(0)},${H - P} Z`} fill="url(#pbEq)" />
      <path d={line} className={`pb-eq-line ${last >= 0 ? "pos" : "neg"}`} />
      <circle cx={x(vals.length - 1)} cy={y(last)} r="3.5" className={`pb-eq-dot ${last >= 0 ? "pos" : "neg"}`} />
    </svg>
  );
};

/* ------------------------------------------------------------------ rows */
const TradeRow: React.FC<{ t: IntelTrade }> = ({ t }) => (
  <div className="pb-row">
    <span className="pb-row-t">{et(t.entry_utc)}</span>
    <span className="pb-sym">{t.symbol}</span>
    <span className="pb-row-m">
      {t.qty} @ ${t.entry_px.toFixed(2)}
      {t.status === "closed" ? (
        <>
          {" "}
          &rarr; ${t.exit_px?.toFixed(2)} <span className={`pb-tag ${t.exit_reason}`}>{t.exit_reason}</span>
        </>
      ) : (
        <span className="pb-dim">
          {" "}
          · target ${t.target_px?.toFixed(2)} · stop ${t.stop_px?.toFixed(2)}
        </span>
      )}
    </span>
    <span className={`pb-row-v ${tone(t.pnl)}`}>
      {t.status === "closed" ? `${usd(t.pnl)} (${pct(t.pnl_pct)})` : <span className="pb-tag open">open</span>}
    </span>
  </div>
);

const STAGE_LABEL: Record<string, string> = {
  universe: "SCREEN",
  edgar: "EDGAR",
  scoring: "READ",
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
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(Date.now());
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
    loadData();
    loadLive();
    const a = setInterval(loadData, 60_000);
    const b = setInterval(loadLive, 5_000);
    const c = setInterval(() => setNow(Date.now()), 1_000);
    return () => { clearInterval(a); clearInterval(b); clearInterval(c); };
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
        key: "scoring", stage: "scoring", title: "Haiku read",
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
    const e = st.edgar || {}, q = st.quotes || {};
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
  const cats = Object.entries(sb?.by_catalyst ?? {}).sort((a, b) => b[1].trades - a[1].trades);

  /* --------------------------- render */
  return (
    <div className="pb">
      <div className="page-head pb-head">
        <div>
          <span className="eyebrow">Paper Bot</span>
          <h1>Korvus Intel</h1>
          <p>
            The crawler reads SEC filings from stocks near $100 the moment they land, scores each one,
            and the bot trades the catalysts on paper. No broker, no real money, until it earns it.
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
          {/* ---------------- pipeline ---------------- */}
          <section className="pb-panel pb-hero">
            <div className="pb-panel-h">
              <span>The crawler, live</span>
              <span className="pb-dim">
                {running ? `heartbeat ${Math.round(live?.heartbeat_age_s || 0)}s ago` : "status updates every 5s"}
              </span>
            </div>
            <Pipeline nodes={nodes} hits={hits.current} now={now} live={running} />
          </section>

          <div className="pb-grid-2">
            {/* ---------------- activity ---------------- */}
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
                      <span className="pb-ev-m">{e.msg}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bl-empty">
                  {live?.configured ? "No activity reported yet." : "Connect the live link to watch the crawler work in real time."}
                </div>
              )}
            </section>

            {/* ---------------- health ---------------- */}
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

          {!data?.configured ? (
            <div className="notice" style={{ marginTop: 18 }}>
              <div className="notice-h">Waiting for intel/ to arrive on this box</div>
              <p>
                Looking in <code>{data?.dir}</code>. It appears after the next brain sync. If the brain lives
                elsewhere, set INTEL_DIR in .env.
              </p>
            </div>
          ) : (
            <>
              {/* ---------------- scoreboard ---------------- */}
              <section className="pb-panel" style={{ marginTop: 18 }}>
                <div className="pb-panel-h">
                  <span>Scoreboard · {sb?.strategy || rules?.strategy}</span>
                  <span className="pb-dim">data as of {et(data.board?.data_asof_utc) || "n/a"} ET</span>
                </div>
                {sb && !sb.sample_ok ? (
                  <div className="pb-sample">
                    <b>{sb.closed_trades} of {minSample}</b> trades before the win rate means anything.
                    <span className="pb-bar"><i style={{ width: `${Math.min(100, (sb.closed_trades / minSample) * 100)}%` }} /></span>
                  </div>
                ) : null}
                <div className="pb-stats">
                  <div><span>Win rate</span><b>{sb?.win_rate_pct ?? "n/a"}{sb?.win_rate_pct != null ? "%" : ""}</b><em>{sb ? `${sb.wins}W · ${sb.losses}L` : ""}</em></div>
                  <div><span>Paper P&amp;L</span><b className={tone(sb?.paper_pnl)}>{usd(sb?.paper_pnl ?? 0)}</b><em>simulated</em></div>
                  <div><span>Expectancy</span><b className={tone(sb?.expectancy_pct)}>{pct(sb?.expectancy_pct)}</b><em>per trade</em></div>
                  <div><span>Profit factor</span><b>{sb?.profit_factor ?? "n/a"}</b><em>wins ÷ losses</em></div>
                  <div><span>Max drawdown</span><b>{sb?.max_drawdown_usd != null ? usd(-sb.max_drawdown_usd) : "n/a"}</b><em>{sb?.max_drawdown_pct != null ? `${sb.max_drawdown_pct}% of capital` : ""}</em></div>
                  <div><span>Avg win / loss</span><b>{pct(sb?.avg_win_pct)}</b><em>{pct(sb?.avg_loss_pct)}</em></div>
                </div>
                <Equity pts={data.equity || []} />
              </section>

              <div className="pb-grid-2">
                <section className="pb-panel">
                  <div className="pb-panel-h"><span>Open positions</span><span className="pb-dim">max {rules?.max_open ?? 5}</span></div>
                  {data.open?.length ? data.open.map((t) => <TradeRow key={t.id} t={t} />) : <div className="bl-empty">No open paper positions.</div>}
                </section>
                <section className="pb-panel">
                  <div className="pb-panel-h"><span>Win rate by catalyst</span></div>
                  {cats.length ? (
                    <div className="bl">
                      {cats.map(([c, v]) => (
                        <div className="bl-row" key={c}>
                          <span className="bl-k">{c.replace(/_/g, " ")}</span>
                          <span className="bl-track"><i style={{ width: `${v.trades ? (v.wins / v.trades) * 100 : 0}%` }} /></span>
                          <span className="bl-n">{v.wins}/{v.trades}</span>
                        </div>
                      ))}
                    </div>
                  ) : <div className="bl-empty">No closed trades yet.</div>}
                </section>
              </div>

              <div className="pb-grid-2">
                <section className="pb-panel">
                  <div className="pb-panel-h"><span>Recent paper trades</span></div>
                  {data.recent?.length ? data.recent.map((t) => <TradeRow key={t.id} t={t} />)
                    : <div className="bl-empty">No closed trades yet. Entries run 9:45 AM to 3:30 PM ET.</div>}
                </section>
                <section className="pb-panel">
                  <div className="pb-panel-h"><span>Latest scored filings</span></div>
                  {data.filings?.length ? data.filings.map((f) => (
                    <div className="pb-row" key={f.url + f.seen_utc}>
                      <span className="pb-row-t">{et(f.seen_utc)}</span>
                      <span className="pb-sym">{f.symbol}</span>
                      <span className="pb-row-m">
                        <span className={`pb-tag imp-${f.impact}`}>{f.impact}</span>{" "}
                        <span className={`pb-tag dir-${f.direction}`}>{f.direction} {f.confidence}%</span>{" "}
                        <a href={f.url} target="_blank" rel="noopener noreferrer">{f.headline}</a>
                      </span>
                    </div>
                  )) : <div className="bl-empty">No scored filings yet.</div>}
                </section>
              </div>
            </>
          )}

          {/* ---------------- path to live ---------------- */}
          <section className="pb-panel pb-path" style={{ marginTop: 18 }}>
            <div className="pb-panel-h">
              <span>Path to real money</span>
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
              scoreboard. Passing the gates is evidence, not a guarantee. Markets change, and paper fills are
              kinder than real ones. Paper results are simulated and are not a promise of returns.
            </p>
          </section>
        </>
      )}
    </div>
  );
};
