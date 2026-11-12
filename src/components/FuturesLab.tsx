import React, { useEffect, useState } from "react";
import { getLab, LabData, LabMarket, LabStrategy } from "../api";

// The futures strategy lab: for each market, every strategy the bot has
// created, the rules in plain English, why it exists, and how it is doing.
const FAMILY: Record<string, string> = { news_follow: "Go with the news", news_fade: "Fade the news", breakout: "Breakout", pullback: "Snap back" };
const money = (n: number | null | undefined) => (n == null ? "n/a" : `${n < 0 ? "-" : n > 0 ? "+" : ""}$${Math.abs(n).toFixed(2)}`);
const when = (s?: string | null) => (s ? new Date(s).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "");
const tone = (n: number | null | undefined) => (n == null || n === 0 ? "" : n > 0 ? " up" : " down");

const Row: React.FC<{ s: LabStrategy; minEval: number }> = ({ s, minEval }) => {
  const [open, setOpen] = useState(s.status === "champion");
  const thin = s.trades < minEval;
  return (
    <div className={`lab-strat ${s.status}`}>
      <button className="lab-strat-top" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="lab-id">{s.id}</span>
        <span className={`pb-tag lab-${s.status}`}>{s.status === "champion" ? "champion" : s.status === "retired" ? "retired" : s.open ? `in a ${s.open.side}` : "running"}</span>
        <span className="lab-family">{FAMILY[s.family] || s.family}<em>gen {s.gen}{s.parent ? `, from ${s.parent}` : ""}</em></span>
        <span className="lab-num">{s.trades}<em>trades</em></span>
        <span className="lab-num">{s.win_rate == null ? "n/a" : `${s.win_rate}%`}<em>winners</em></span>
        <span className={`lab-num${thin ? " thin" : tone(s.expectancy)}`}>{money(s.expectancy)}<em>a trade</em></span>
        <span className={`lab-num${tone(s.pnl)}`}>{money(s.pnl)}<em>total</em></span>
      </button>
      {open ? (
        <div className="lab-strat-body">
          <p><b>The rules.</b> {s.rules}</p>
          <p><b>Why it exists.</b> {s.why} <span className="pb-dim">Created {when(s.created_utc)}.</span></p>
          {s.retired_why ? <p><b>Why it ended.</b> {s.retired_why} <span className="pb-dim">{when(s.retired_utc)}.</span></p> : null}
          {s.since_crowned ? (
            <p><b>Since it was crowned</b> ({when(s.promoted_utc)}): {s.since_crowned.trades} trades, {money(s.since_crowned.expectancy)} a trade, {money(s.since_crowned.pnl)} total. This is the number that counts; the record above includes the trades that got it picked.</p>
          ) : null}
          {s.open ? <p><b>Open now.</b> {s.open.side} from {s.open.entry_px.toFixed(2)}, target {s.open.target_px.toFixed(2)}, stop {s.open.stop_px.toFixed(2)}. Trigger: {s.open.note}.</p> : null}
          {thin && s.status !== "retired" ? <p className="pb-dim">Under {minEval} closed trades, so its average means little yet.</p> : null}
        </div>
      ) : null}
    </div>
  );
};

const Market: React.FC<{ m: LabMarket; minEval: number; minChampion: number }> = ({ m, minEval, minChampion }) => {
  const [showRetired, setShowRetired] = useState(false);
  const running = m.strategies.filter((s) => s.status !== "retired");
  const retired = m.strategies.filter((s) => s.status === "retired");
  return (
    <section className="pb-panel lab-market">
      <div className="pb-panel-h">
        <span>{m.sym} · {m.name}</span>
        <span className="pb-dim">{m.price != null ? `last ${m.price.toFixed(2)}` : "no price yet"}</span>
      </div>
      <div className="lab-sum">
        <div><b>{m.champion || "None yet"}</b><em>champion</em></div>
        <div><b>{m.created}</b><em>strategies created</em></div>
        <div><b>{m.running}</b><em>running now</em></div>
        <div><b>{m.retired}</b><em>retired</em></div>
        <div><b>{m.all.trades}</b><em>paper trades</em></div>
        <div><b className={tone(m.all.pnl).trim()}>{money(m.all.pnl)}</b><em>all strategies, after costs</em></div>
      </div>
      {!m.champion ? <p className="lab-note">No champion yet. A strategy needs {minChampion} closed trades, a positive average and winners outweighing losers before it earns the crown.</p> : null}
      <div className="lab-list">{running.map((s) => <Row key={s.id} s={s} minEval={minEval} />)}</div>
      {retired.length ? (
        <>
          <button className="lab-more" onClick={() => setShowRetired(!showRetired)}>{showRetired ? "Hide" : "Show"} the {retired.length} retired</button>
          {showRetired ? <div className="lab-list">{retired.map((s) => <Row key={s.id} s={s} minEval={minEval} />)}</div> : null}
        </>
      ) : null}
    </section>
  );
};

export const FuturesLab: React.FC = () => {
  const [d, setD] = useState<LabData | null>(null);
  useEffect(() => {
    const load = () => getLab().then(setD);
    load();
    const t = window.setInterval(load, 30000);
    return () => window.clearInterval(t);
  }, []);
  if (!d || !d.configured) return null;
  const lt = d.last_tick || {};
  const state = !d.reachable ? `Cannot reach the lab: ${d.error || "no answer"}.`
    : !d.enabled ? "The lab is switched off (LAB_ENABLED=0 on the Korvus box)."
    : !d.started ? "The lab has not run its first pass yet."
    : lt.phase === "weekend" ? "Futures are closed for the weekend. The lab resumes Sunday at 6 PM ET."
    : lt.phase === "maintenance" ? "Daily maintenance hour. This is when the lab reviews its strategies."
    : lt.feed_ok === false ? `Idle: the price feed is "${lt.feed || "unknown"}", not the real CME feed. The lab only trades on real futures prices.`
    : "Running. Every strategy below is trading on paper, around the clock.";
  const log = (d.log || []).filter((l) => l.kind !== "entry" && l.kind !== "exit").slice(0, 14);
  return (
    <div className="lab">
      <section className="pb-panel" style={{ marginTop: 18 }}>
        <div className="pb-panel-h">
          <span>Futures lab · the bot finds its own strategy</span>
          <span className={d.reachable && d.started && lt.feed_ok !== false ? "pb-pass" : "pb-dim"}>{lt.t ? `last pass ${when(lt.t)}` : "paper only"}</span>
        </div>
        <p className="lab-lead">{state}</p>
        <p className="lab-note">
          For each market the lab runs {d.population ?? 12} different rule sets side by side, one micro contract each, with ${(d.costs?.commission_rt ?? 1.4).toFixed(2)} commission and {d.costs?.slippage_ticks ?? 1} tick of slippage a side charged on every trade.
          Once a day it retires the losers, breeds new ones from the winners, and writes down why. With this many running, the best one looks good partly by luck, so a champion is judged on what it does after it is crowned.
        </p>
      </section>
      {d.reachable && d.started ? (
        <>
          <div className="pb-grid-2 lab-markets">
            {(d.markets || []).map((m) => <Market key={m.sym} m={m} minEval={d.min_eval ?? 12} minChampion={d.min_champion ?? 20} />)}
          </div>
          <div className="pb-grid-2">
            <section className="pb-panel">
              <div className="pb-panel-h"><span>What the lab learned</span><span className="pb-dim">created, retired, crowned</span></div>
              {log.length ? log.map((l, i) => (
                <div className="lab-log" key={i}><span className="pb-row-t">{when(l.t)}</span><span className={`pb-tag lab-k-${l.kind}`}>{l.kind}</span><span>{l.text}</span></div>
              )) : <p className="pb-dim">Nothing yet. The first review runs in the next 5 PM ET maintenance hour.</p>}
            </section>
            <section className="pb-panel">
              <div className="pb-panel-h"><span>Latest lab trades</span><span className="pb-dim">paper</span></div>
              {(d.trades || []).length ? (d.trades || []).slice(0, 14).map((t, i) => (
                <div className="lab-log" key={i}>
                  <span className="pb-row-t">{when(t.exit_utc || t.entry_utc)}</span>
                  <span className={`pb-tag ${t.side === "long" ? "lab-long" : "lab-short"}`}>{t.side}</span>
                  <span>{t.strat} at {t.entry_px.toFixed(2)}{t.status === "closed" ? `, out ${t.exit_px?.toFixed(2)} on ${t.reason}` : ", open"}. {t.note}</span>
                  <span className={`lab-pnl${tone(t.pnl)}`}>{t.status === "closed" ? money(t.pnl) : ""}</span>
                </div>
              )) : <p className="pb-dim">No trades yet.</p>}
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
};
