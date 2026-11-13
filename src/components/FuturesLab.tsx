import React, { useState } from "react";
import type { LabData, LabMarket, LabStrategy, LabTrade } from "../api";
import { Curve, Empty, Spark, Tile, Track, et, mins, tone, usd } from "./botui";

/* The index futures book: for each market, every strategy the lab has
   created, the rules in plain English, why it exists, how it is doing, and
   every trade it took. Intraday swings only. */

const statusText = (s: LabStrategy) => (s.status === "champion" ? "champion" : s.status === "retired" ? "retired" : s.open ? `in a ${s.open.side}` : "running");

const Bench: React.FC<{ rows: LabStrategy[]; minEval: number }> = ({ rows, minEval }) => {
  const [open, setOpen] = useState<string | null>(rows.find((s) => s.status === "champion")?.id || null);
  if (!rows.length) return <Empty>No strategies yet. The lab seeds its first bench on the next pass with a real futures price.</Empty>;
  return (
    <div className="bk-table-wrap">
      <table className="bk-table">
        <thead>
          <tr>
            <th>Strategy</th><th>Status</th><th>Idea</th><th className="r">Trades</th><th className="r">Winners</th>
            <th className="r">Per trade</th><th className="r">Total</th><th className="r">Avg hold</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => {
            const thin = s.trades < minEval;
            const isOpen = open === s.id;
            return (
              <React.Fragment key={s.id}>
                <tr className={`${isOpen ? "open" : ""} ${s.status === "retired" ? "legacy" : ""} ${s.status === "champion" ? "champ" : ""}`} onClick={() => setOpen(isOpen ? null : s.id)}>
                  <td className="mono sym">{s.id}</td>
                  <td><span className={`pb-tag lab-${s.status}${s.open && s.status === "active" ? " live" : ""}`}>{statusText(s)}</span></td>
                  <td>{s.family_label || s.family} <span className="dim">gen {s.gen}{s.parent ? `, from ${s.parent}` : ""}</span></td>
                  <td className="r mono">{s.trades}</td>
                  <td className="r mono">{s.win_rate == null ? "n/a" : `${s.win_rate}%`}</td>
                  <td className={`r mono ${thin ? "dim" : tone(s.expectancy)}`}>{usd(s.expectancy)}</td>
                  <td className={`r mono ${tone(s.pnl)}`}>{usd(s.pnl)}</td>
                  <td className="r mono">{mins(s.avg_hold_min)}</td>
                </tr>
                {isOpen ? (
                  <tr className="bk-detail">
                    <td colSpan={8}>
                      <p><b>The rules.</b> {s.rules}</p>
                      <p><b>Why it exists.</b> {s.why} <span className="bk-dim">Created {et(s.created_utc)} ET.</span></p>
                      {s.retired_why ? <p><b>Why it ended.</b> {s.retired_why} <span className="bk-dim">{et(s.retired_utc)} ET.</span></p> : null}
                      {s.since_crowned ? (
                        <p><b>Since it was crowned</b> ({et(s.promoted_utc)} ET): {s.since_crowned.trades} trades, {usd(s.since_crowned.expectancy)} a trade, {usd(s.since_crowned.pnl)} total. This is the number that counts; the record above includes the trades that got it picked.</p>
                      ) : null}
                      {s.open ? <p><b>Open now.</b> {s.open.side} from {s.open.entry_px.toFixed(2)}, target {s.open.target_px.toFixed(2)}, stop {s.open.stop_px.toFixed(2)}. Trigger: {s.open.note}.</p> : null}
                      {s.trades ? <p className="bk-dim">Average win {usd(s.avg_win)}, average loss {usd(s.avg_loss)}, profit factor {s.profit_factor ?? "n/a"}, worst run {usd(s.max_drawdown != null ? -s.max_drawdown : null)}.</p> : null}
                      {thin && s.status !== "retired" ? <p className="bk-dim">Under {minEval} closed trades, so its average means little yet.</p> : null}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Trades: React.FC<{ rows: LabTrade[] }> = ({ rows }) => {
  const [open, setOpen] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  if (!rows.length) return <Empty>No trades in this market yet.</Empty>;
  const total = rows.length;
  rows = all ? rows : rows.slice(0, 15);
  return (
    <div className="bk-table-wrap">
      <table className="bk-table">
        <thead>
          <tr>
            <th>Entry (ET)</th><th>Strategy</th><th>Idea</th><th>Side</th><th className="r">Entry</th><th className="r">Exit</th><th>Out on</th>
            <th className="r">Held</th><th className="r" title="The furthest the trade ran in our favour and against us, in points">Best / worst</th><th className="r">P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t, i) => {
            const key = t.id ?? i;
            const isOpen = open === key;
            return (
              <React.Fragment key={key}>
                <tr className={`${isOpen ? "open" : ""}${t.era && t.era.startsWith("v1") ? " legacy" : ""}`} onClick={() => setOpen(isOpen ? null : key)}>
                  <td className="mono dim">{et(t.entry_utc)}</td>
                  <td className="mono sym">{t.strat}</td>
                  <td>{t.family || ""}</td>
                  <td><span className={`pb-tag side-${t.side}`}>{t.side}</span></td>
                  <td className="r mono">{t.entry_px.toFixed(2)}</td>
                  <td className="r mono">{t.exit_px != null ? t.exit_px.toFixed(2) : ""}</td>
                  <td>{t.status === "closed" ? <span className={`pb-tag ${String(t.reason || "").replace(/ /g, "-")}`}>{t.reason}</span> : <span className="pb-tag open">open</span>}</td>
                  <td className="r mono">{mins(t.hold_min)}</td>
                  <td className="r mono dim">{t.mfe != null ? `+${t.mfe.toFixed(2)} / ${(t.mae ?? 0).toFixed(2)}` : ""}</td>
                  <td className={`r mono ${tone(t.pnl)}`}>{t.status === "closed" ? usd(t.pnl) : ""}</td>
                </tr>
                {isOpen ? (
                  <tr className="bk-detail">
                    <td colSpan={10}>
                      <p><b>Why it entered.</b> {t.note || "No note recorded."}</p>
                      <p className="bk-dim">
                        Target {t.target_px?.toFixed(2)}, stop {(t.init_stop_px ?? t.stop_px)?.toFixed(2)}
                        {t.init_stop_px != null && t.stop_px != null && Math.abs(t.stop_px - t.init_stop_px) > 1e-6 ? " (later moved to the entry price)" : ""}.
                        {t.exit_utc ? ` Out ${et(t.exit_utc)} ET.` : ""}{t.era && t.era.startsWith("v1") ? " A first-generation scalp, from before the swing ruling." : ""}
                      </p>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {total > 15 ? <button className="lab-more" onClick={() => setAll(!all)}>{all ? "Show the latest 15" : `Show all ${total}`}</button> : null}
    </div>
  );
};

const MarketView: React.FC<{ m: LabMarket; d: LabData }> = ({ m, d }) => {
  const [showRetired, setShowRetired] = useState(false);
  const rules = d.rules || "";
  const cur = m.strategies.filter((s) => !s.era || s.era === rules);
  const running = cur.filter((s) => s.status !== "retired");
  const retired = cur.filter((s) => s.status === "retired");
  const a = m.all;
  const trades = (d.trades || []).filter((t) => t.sym === m.sym).slice(0, 40);
  const fam = Object.entries(m.by_family || {}).sort((x, y) => y[1].trades - x[1].trades);
  const pv = m.point_value || 1;
  return (
    <>
      <div className="bk-tiles">
        <Tile label="Paper P&L" value={usd(a.pnl)} tone={tone(a.pnl)} sub="every strategy, after costs" />
        <Tile label="Today" value={usd(m.today?.pnl ?? 0)} tone={tone(m.today?.pnl)} sub={`${m.today?.trades ?? 0} trade${m.today?.trades === 1 ? "" : "s"} closed`} />
        <Tile label="Trades" value={a.trades} sub={a.win_rate != null ? `${a.win_rate}% winners` : "none closed yet"} />
        <Tile label="Per trade" value={usd(a.expectancy)} tone={tone(a.expectancy)} sub={`profit factor ${a.profit_factor ?? "n/a"}`} />
        <Tile label="Avg win / loss" value={usd(a.avg_win)} sub={usd(a.avg_loss)} />
        <Tile label="Average hold" value={mins(a.avg_hold_min)} sub="swings, not scalps" />
        <Tile label="Max drawdown" value={a.max_drawdown != null ? usd(-a.max_drawdown) : "n/a"} sub="worst run on the curve" />
        <Tile label="Champion" value={m.champion || "none yet"} sub={`${m.running} running, ${m.retired} retired`} />
      </div>

      <div className="bk-grid wide-left">
        <section className="pb-panel">
          <div className="pb-panel-h"><span>Equity curve · {m.sym} · all strategies</span><span className="pb-dim">one micro contract each, after costs</span></div>
          <Curve pts={m.equity || []} empty="No closed swing trades in this market yet." />
        </section>
        <section className="pb-panel">
          <div className="pb-panel-h"><span>Open positions</span><span className="pb-dim">{m.price != null ? `${m.sym} ${m.price.toFixed(2)}` : ""}</span></div>
          {(m.open || []).length ? (
            <div className="bk-scroll">
              {(m.open || []).map((o) => (
                <div className="bk-pos" key={o.strat}>
                  <div className="bk-pos-top">
                    <span className="bk-sym">{o.strat}</span>
                    <span className={`pb-tag side-${o.side}`}>{o.side}</span>
                    <span className="bk-dim">in {et(o.entry_utc)} · held {mins(o.hold_min)}</span>
                    <b className={`bk-pos-pnl ${tone(o.unrealized)}`}>{usd(o.unrealized)}</b>
                  </div>
                  <Track side={o.side} entry={o.entry_px} stop={o.stop_px} target={o.target_px} price={m.price} />
                  <div className="bk-dim">{o.note}</div>
                </div>
              ))}
            </div>
          ) : <Empty>Flat. No strategy has a trade on in {m.sym} right now.</Empty>}
        </section>
      </div>

      <section className="pb-panel">
        <div className="pb-panel-h">
          <span>The bench · {running.length} strategies trading {m.sym}</span>
          <span className="pb-dim">click a row for its rules and why it exists</span>
        </div>
        {!m.champion ? <p className="bk-note">No champion yet. A strategy needs {d.min_champion ?? 20} closed trades, a positive average and winners outweighing losers before it earns the crown.</p> : null}
        <Bench rows={running} minEval={d.min_eval ?? 10} />
        {retired.length ? (
          <>
            <button className="lab-more" onClick={() => setShowRetired(!showRetired)}>{showRetired ? "Hide" : "Show"} the {retired.length} retired</button>
            {showRetired ? <Bench rows={retired} minEval={d.min_eval ?? 10} /> : null}
          </>
        ) : null}
        {m.previous?.strategies ? (
          <p className="bk-note">
            Before the swing ruling ({m.previous.era}): {m.previous.strategies} scalping strategies took {m.previous.trades} trades for {usd(m.previous.pnl)}. They were retired on the record and are not counted above.
          </p>
        ) : null}
      </section>

      <div className="bk-grid">
        <section className="pb-panel">
          <div className="pb-panel-h"><span>Which ideas are working</span><span className="pb-dim">closed trades by family</span></div>
          {fam.length ? (
            <div className="bk-table-wrap"><table className="bk-table compact">
              <thead><tr><th>Idea</th><th className="r">Trades</th><th className="r">Winners</th><th className="r">Per trade</th><th className="r">Avg hold</th><th className="r">P&amp;L</th></tr></thead>
              <tbody>
                {fam.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td><td className="r mono">{v.trades}</td><td className="r mono">{v.win_rate != null ? `${v.win_rate}%` : "n/a"}</td>
                    <td className={`r mono ${tone(v.expectancy)}`}>{usd(v.expectancy)}</td><td className="r mono">{mins(v.avg_hold_min)}</td>
                    <td className={`r mono ${tone(v.pnl)}`}>{usd(v.pnl)}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          ) : <Empty>Fills in as trades close.</Empty>}
          <p className="bk-note">
            Targets and stops are multiples of {m.sym}'s typical one hour move{m.hour_move ? `, ${m.hour_move.toFixed(2)} points right now ($${(m.hour_move * pv).toFixed(0)} a contract)` : ""}, so they widen when the market is fast and tighten when it is quiet.
          </p>
        </section>
        <section className="pb-panel">
          <div className="pb-panel-h"><span>What the lab learned</span><span className="pb-dim">created, retired, crowned</span></div>
          {(() => {
            const log = (d.log || []).filter((l) => l.sym === m.sym && l.kind !== "entry" && l.kind !== "exit" && l.kind !== "manage").slice(0, 12);
            return log.length ? (
              <div className="bk-scroll tall">
                {log.map((l, i) => (
                  <div className="lab-log" key={i}><span className="pb-row-t">{et(l.t)}</span><span className={`pb-tag lab-k-${l.kind}`}>{l.kind}</span><span>{l.text}</span></div>
                ))}
              </div>
            ) : <Empty>Nothing yet. The first review runs in the next 5 PM ET maintenance hour.</Empty>;
          })()}
        </section>
      </div>

      <section className="pb-panel">
        <div className="pb-panel-h"><span>Trade ledger · {m.sym}</span><span className="pb-dim">click a row for why it entered</span></div>
        <Trades rows={trades} />
      </section>
    </>
  );
};

export const labState = (d: LabData | null) => {
  if (!d || !d.configured) return { ok: false, text: "The live link to Korvus is not set, so the lab cannot be read from here." };
  const lt = d.last_tick || {};
  if (!d.reachable) return { ok: false, text: `Cannot reach the lab: ${d.error || "no answer"}.` };
  if (!d.enabled) return { ok: false, text: "The lab is switched off (LAB_ENABLED=0 on the Korvus box)." };
  if (!d.started) return { ok: false, text: "The lab has not run its first pass yet." };
  if (lt.phase === "weekend") return { ok: true, text: "Futures are closed for the weekend. The lab resumes Sunday at 6 PM ET." };
  if (lt.phase === "maintenance") return { ok: true, text: "Daily maintenance hour. This is when the lab reviews its strategies." };
  if (lt.feed_ok === false) return { ok: false, text: `Idle: the price feed is "${lt.feed || "unknown"}", not the real CME feed. The lab only trades on real futures prices.` };
  return { ok: true, text: "Running. Every strategy on the bench is trading on paper." };
};

export const FuturesBook: React.FC<{ d: LabData | null }> = ({ d }) => {
  const [sym, setSym] = useState<string>("MNQ");
  const state = labState(d);
  const markets = d?.markets || [];
  const m = markets.find((x) => x.sym === sym) || markets[0];
  const st = d?.style;
  return (
    <div className="bk">
      <section className="pb-panel">
        <div className="pb-panel-h">
          <span>Futures lab · {st?.label || "the bot finds its own strategy"}</span>
          <span className={state.ok ? "pb-pass" : "pb-dim"}>{d?.last_tick?.t ? `last pass ${et(d.last_tick.t)} ET` : "paper only"}</span>
        </div>
        <p className="lab-lead">{state.text}</p>
        <div className="bk-chips">
          {st ? (
            <>
              <span className="pb-tag bk-pb">no scalping</span>
              <span className="pb-tag">at most {st.max_trades_day} trades a day per strategy</span>
              <span className="pb-tag">shortest hold limit {mins(st.min_hold_cap_min)}</span>
              <span className="pb-tag">no new trade after {st.last_entry_et} ET</span>
              <span className="pb-tag">flat by {st.flat_et} ET</span>
            </>
          ) : <span className="pb-tag retired">the Korvus box is still on the first-generation rules</span>}
          <span className="pb-tag">${(d?.costs?.commission_rt ?? 1.4).toFixed(2)} commission + {d?.costs?.slippage_ticks ?? 1} tick a side</span>
        </div>
        <p className="bk-note">
          For each market the lab runs {d?.population ?? 12} different rule sets side by side, one micro contract each. Once a day it retires the losers, breeds new ones
          from the winners, and writes down why. With this many running, the best one looks good partly by luck, so a champion is judged on what it does after it is crowned.
        </p>
      </section>

      {d?.reachable && d.started && m ? (
        <>
          <div className="bk-markets">
            {markets.map((x) => (
              <button key={x.sym} className={`bk-market${x.sym === m.sym ? " on" : ""}`} onClick={() => setSym(x.sym)} aria-pressed={x.sym === m.sym}>
                <div className="bk-market-top">
                  <b>{x.sym}</b><span>{x.name}</span>
                  <em>{x.price != null ? x.price.toFixed(2) : "no price yet"}</em>
                </div>
                <div className="bk-market-row">
                  <div><strong className={tone(x.all.pnl)}>{usd(x.all.pnl)}</strong><span>{x.all.trades} trades{x.all.win_rate != null ? `, ${x.all.win_rate}% winners` : ""}</span></div>
                  <Spark pts={(x.equity || []).map((p) => p.v)} />
                </div>
                <div className="bk-market-foot">{x.champion ? `champion ${x.champion}` : "no champion yet"} · {x.running} running · {(x.open || []).length} open</div>
              </button>
            ))}
          </div>
          <MarketView key={m.sym} m={m} d={d} />
        </>
      ) : null}
    </div>
  );
};
