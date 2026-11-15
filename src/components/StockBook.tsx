import React, { useMemo, useState } from "react";
import type { IntelData, IntelLive, IntelTrade, IntelWatch, IntelPosition, IntelBucket } from "../api";
import { Curve, Empty, Seg, Tile, Track, et, mins, n0, pct, rmult, tone, usd, winRate } from "./botui";

/* The company-stock book: the catalyst bot's scoreboard, what it is watching
   right now and why it has or has not acted, every trade with the filing
   behind it, and the rules in plain English. */

const PB_LABEL: Record<string, string> = { scalp: "scalp", swing: "day swing" };
const STATE_LABEL: Record<string, string> = { confirming: "confirming", waiting: "waiting", skipped: "passed", traded: "traded" };

const Watch: React.FC<{ w: IntelWatch }> = ({ w }) => {
  const prog = w.move_pct != null && w.need_pct ? Math.max(0, Math.min(1, w.move_pct / w.need_pct)) : null;
  return (
    <div className={`bk-watch ${w.state}`}>
      <div className="bk-watch-top">
        <span className="bk-sym">{w.symbol}</span>
        <span className={`pb-tag side-${w.side}`}>{w.side}</span>
        {w.playbook ? <span className="pb-tag bk-pb">{PB_LABEL[w.playbook]}</span> : null}
        <span className="bk-dim">{w.impact} {w.confidence}% · {String(w.catalyst || "filing").replace(/_/g, " ")}{w.age_min != null ? ` · seen ${mins(w.age_min)} ago` : ""}</span>
        <span className={`bk-state ${w.state}`}>{STATE_LABEL[w.state] || w.state}</span>
      </div>
      <div className="bk-watch-why">{w.why || w.headline}</div>
      {prog !== null && w.state !== "traded" ? (
        <div className="bk-prog" title="Move since the filing, against the move the playbook needs">
          <span className="pb-bar"><i style={{ width: `${prog * 100}%` }} /></span>
          <em>{pct(w.move_pct)} of +{w.need_pct}% needed{w.need_checks ? ` · ${w.checks ?? 0}/${w.need_checks} checks` : ""}</em>
        </div>
      ) : null}
    </div>
  );
};

const Position: React.FC<{ t: IntelTrade; p?: IntelPosition }> = ({ t, p }) => (
  <div className="bk-pos">
    <div className="bk-pos-top">
      <span className="bk-sym">{t.symbol}</span>
      <span className={`pb-tag side-${t.side || "long"}`}>{t.side || "long"}</span>
      {t.playbook ? <span className="pb-tag bk-pb">{PB_LABEL[t.playbook]}</span> : null}
      <span className="bk-dim">{t.qty} sh · in {et(t.entry_utc)}{t.risk_usd ? ` · risk $${t.risk_usd.toFixed(0)}` : ""}</span>
      <b className={`bk-pos-pnl ${tone(p?.pnl)}`}>{p ? `${usd(p.pnl)} (${pct(p.run_pct)})` : "open"}</b>
    </div>
    {t.stop_px != null && t.target_px != null ? (
      <Track side={t.side || "long"} entry={t.entry_px} stop={t.stop_px} target={t.target_px} price={p?.price} />
    ) : null}
    {t.init_stop_px != null && t.stop_px != null && Math.abs(t.stop_px - t.init_stop_px) > 1e-6 ? (
      <div className="bk-dim">Stop already moved to the entry price: this trade can no longer lose more than slippage.</div>
    ) : null}
  </div>
);

const Ledger: React.FC<{ rows: IntelTrade[]; current?: string }> = ({ rows, current }) => {
  const [open, setOpen] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  if (!rows.length) return <Empty>No closed trades yet under these rules.</Empty>;
  const total = rows.length;
  rows = all ? rows : rows.slice(0, 15);
  return (
    <div className="bk-table-wrap">
      <table className="bk-table">
        <thead>
          <tr>
            <th>Entry (ET)</th><th>Symbol</th><th>Playbook</th><th>Side</th><th className="r">Size</th><th className="r">Entry</th>
            <th className="r">Exit</th><th>Out on</th><th className="r">Held</th><th className="r" title="The furthest the trade ran in our favour and against us while it was open">Best / worst</th>
            <th className="r" title="Result in units of the dollars risked">R</th><th className="r">P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => {
            const legacy = current && t.strategy !== current;
            const isOpen = open === t.id;
            return (
              <React.Fragment key={t.id}>
                <tr className={`${isOpen ? "open" : ""}${legacy ? " legacy" : ""}`} onClick={() => setOpen(isOpen ? null : t.id)}>
                  <td className="mono dim">{et(t.entry_utc)}</td>
                  <td className="mono sym">{t.symbol}</td>
                  <td>{t.playbook ? <span className="pb-tag bk-pb">{PB_LABEL[t.playbook]}</span> : <span className="pb-tag retired">{String(t.strategy).split("-")[0]} rules</span>}</td>
                  <td><span className={`pb-tag side-${t.side || "long"}`}>{t.side || "long"}</span></td>
                  <td className="r mono">{t.qty}</td>
                  <td className="r mono">{t.entry_px.toFixed(2)}</td>
                  <td className="r mono">{t.exit_px != null ? t.exit_px.toFixed(2) : ""}</td>
                  <td><span className={`pb-tag ${String(t.exit_reason || "").replace(/ /g, "-")}`}>{t.exit_reason}</span></td>
                  <td className="r mono">{mins(t.hold_min ?? (t.exit_utc ? (new Date(t.exit_utc).getTime() - new Date(t.entry_utc).getTime()) / 60000 : null))}</td>
                  <td className="r mono dim">{t.mfe_pct != null ? `${pct(t.mfe_pct)} / ${pct(t.mae_pct)}` : ""}</td>
                  <td className={`r mono ${tone(t.r_mult)}`}>{t.r_mult != null ? rmult(t.r_mult) : ""}</td>
                  <td className={`r mono ${tone(t.pnl)}`}>{usd(t.pnl)} <span className="dim">{pct(t.pnl_pct)}</span></td>
                </tr>
                {isOpen ? (
                  <tr className="bk-detail">
                    <td colSpan={12}>
                      {t.filing ? (
                        <>
                          <p>
                            <b>The filing.</b>{" "}
                            <a href={t.filing.url} target="_blank" rel="noopener noreferrer">{t.filing.headline}</a>{" "}
                            <span className="bk-dim">seen {et(t.filing.seen_utc)} ET · scored {t.filing.impact} {t.filing.direction} at {t.filing.confidence}% · {String(t.filing.catalyst).replace(/_/g, " ")}{t.filing.ref_price ? ` · reference price ${t.filing.ref_price.toFixed(2)}` : ""}</span>
                          </p>
                          <p><b>What it said.</b> {t.filing.summary}</p>
                          {t.filing.read ? <p><b>The read.</b> {t.filing.read}</p> : null}
                        </>
                      ) : <p className="bk-dim">The filing behind this trade is older than the export window.</p>}
                      {t.note ? <p><b>Why it entered.</b> {t.note}</p> : null}
                      <p className="bk-dim">
                        Planned stop {t.init_stop_px != null ? t.init_stop_px.toFixed(2) : t.stop_px?.toFixed(2)}, target {t.target_px?.toFixed(2)}
                        {t.risk_usd ? `, $${t.risk_usd.toFixed(0)} at risk` : ""}{t.phase ? `, entered in the ${t.phase} session` : ""}. Out {et(t.exit_utc)} ET.
                        {legacy ? ` Taken under the retired ${t.strategy} rules, so it is not on the scoreboard above.` : ""}
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

const BREAKS = [
  { id: "playbook", label: "Playbook" },
  { id: "phase", label: "Session" },
  { id: "side", label: "Side" },
  { id: "catalyst", label: "Catalyst" },
];

export const StockBook: React.FC<{ data: IntelData; live: IntelLive | null }> = ({ data, live }) => {
  const [brk, setBrk] = useState("playbook");
  const sb = data.board?.scoreboard;
  const rules = data.board?.rules;
  const minSample = data.board?.min_sample ?? 30;
  const bot = live?.stages?.bot || {};
  const watch: IntelWatch[] = Array.isArray(bot.watch) ? bot.watch : [];
  const positions: IntelPosition[] = Array.isArray(bot.positions) ? bot.positions : [];
  const posById = useMemo(() => new Map(positions.map((p) => [p.id, p])), [positions]);
  const order: Record<string, number> = { confirming: 0, waiting: 1, traded: 2, skipped: 3 };
  const radar = watch.slice().sort((a, b) => (order[a.state] ?? 9) - (order[b.state] ?? 9));

  const buckets: [string, IntelBucket][] = Object.entries(
    (brk === "playbook" ? sb?.by_playbook : brk === "phase" ? sb?.by_phase : brk === "side" ? sb?.by_side : sb?.by_catalyst) || {}
  ).map(([k, v]) => [k, v as IntelBucket] as [string, IntelBucket]).sort((a, b) => b[1].trades - a[1].trades);
  const be = sb?.avg_win_pct != null && sb?.avg_loss_pct != null && sb.avg_win_pct + Math.abs(sb.avg_loss_pct) > 0
    ? (Math.abs(sb.avg_loss_pct) / (sb.avg_win_pct + Math.abs(sb.avg_loss_pct))) * 100 : null;

  return (
    <div className="bk">
      {data.retired?.length ? (
        <div className="pb-retired">
          <b>A fresh scoreboard.</b>{" "}
          {data.retired.map((r, i) => (
            <span key={r.strategy}>
              {i ? "; " : ""}the retired <i>{r.strategy}</i> rules closed {r.trades} trade{r.trades === 1 ? "" : "s"} ({r.wins}W, {r.losses}L, <span className={tone(r.pnl)}>{usd(r.pnl)}</span>)
            </span>
          ))}
          . Those trades stay in the ledger below, marked with their rule version, and are not mixed into the numbers for <i>{sb?.strategy}</i>.
        </div>
      ) : null}

      <div className="bk-tiles">
        <Tile label="Paper P&L" value={usd(sb?.paper_pnl ?? 0)} tone={tone(sb?.paper_pnl)} sub={`${sb?.closed_trades ?? 0} closed, ${sb?.open_trades ?? 0} open`} />
        <Tile label="Win rate" value={sb?.win_rate_pct != null ? `${sb.win_rate_pct}%` : "n/a"} sub={sb ? `${sb.wins}W, ${sb.losses}L${be != null ? ` · needs ${be.toFixed(0)}%` : ""}` : ""} title="Break-even win rate is what the average win and loss sizes require" />
        <Tile label="Per trade" value={sb?.expectancy_r != null ? rmult(sb.expectancy_r) : pct(sb?.expectancy_pct)} tone={tone(sb?.expectancy_r ?? sb?.expectancy_pct)} sub={sb?.expectancy_r != null ? `${pct(sb?.expectancy_pct)} · risking $${n0(sb?.risk_per_trade ?? rules?.risk_usd ?? 100)}` : "average result"} title="R is the result in units of the dollars risked" />
        <Tile label="Profit factor" value={sb?.profit_factor ?? "n/a"} sub="gross wins over gross losses" />
        <Tile label="Avg win / loss" value={pct(sb?.avg_win_pct)} sub={pct(sb?.avg_loss_pct)} />
        <Tile label="Average hold" value={mins(sb?.avg_hold_min)} sub={sb?.avg_mfe_pct != null ? `ran ${pct(sb.avg_mfe_pct)} for, ${pct(sb.avg_mae_pct)} against` : "time in a trade"} />
        <Tile label="Max drawdown" value={sb?.max_drawdown_usd != null ? usd(-sb.max_drawdown_usd) : "n/a"} sub={sb?.max_drawdown_pct != null ? `${sb.max_drawdown_pct}% of capital at work` : ""} />
        <Tile label="Stop slippage" value={sb?.stop_slip_pct != null ? pct(sb.stop_slip_pct, false) : "n/a"} sub="how far past the stop it filled" title="Quotes are checked once a minute, so a stop can fill past its level" />
      </div>

      {sb && !sb.sample_ok ? (
        <div className="pb-sample">
          <b>{sb.closed_trades} of {minSample}</b> closed trades before the win rate means anything.
          <span className="pb-bar"><i style={{ width: `${Math.min(100, (sb.closed_trades / minSample) * 100)}%` }} /></span>
        </div>
      ) : null}

      <div className="bk-grid wide-left">
        <section className="pb-panel">
          <div className="pb-panel-h"><span>Equity curve · {sb?.strategy}</span><span className="pb-dim">data as of {et(data.board?.data_asof_utc) || "n/a"} ET</span></div>
          <Curve pts={data.equity || []} empty="No closed trades under these rules yet. The curve starts with the first two." />
        </section>
        <section className="pb-panel">
          <div className="pb-panel-h"><span>On the radar</span><span className="pb-dim">{radar.length ? `${radar.length} filing${radar.length === 1 ? "" : "s"} in play` : "live"}</span></div>
          {radar.length ? <div className="bk-scroll">{radar.map((w) => <Watch key={w.accession + (w.playbook || "")} w={w} />)}</div>
            : <Empty>{live?.running ? "No tradable filing in the last 18 hours. The bot waits for the crawler to score one." : "The radar shows what the bot is weighing once the live link to Korvus is up."}</Empty>}
        </section>
      </div>

      <div className="bk-grid">
        <section className="pb-panel">
          <div className="pb-panel-h"><span>Open positions</span><span className="pb-dim">max {rules?.max_open ?? 5}</span></div>
          {data.open?.length ? data.open.map((t) => <Position key={t.id} t={t} p={posById.get(t.id)} />) : <Empty>Flat. No open paper positions.</Empty>}
        </section>
        <section className="pb-panel">
          <div className="pb-panel-h"><span>Where the results come from</span><Seg small value={brk} onChange={setBrk} options={BREAKS} /></div>
          {buckets.length ? (
            <div className="bk-table-wrap"><table className="bk-table compact">
              <thead><tr><th>{BREAKS.find((b) => b.id === brk)?.label}</th><th className="r">Trades</th><th className="r">Winners</th><th className="r">Avg result</th><th className="r">Avg hold</th><th className="r">P&amp;L</th></tr></thead>
              <tbody>
                {buckets.map(([k, v]) => (
                  <tr key={k}>
                    <td>{PB_LABEL[k] || k.replace(/_/g, " ")}</td>
                    <td className="r mono">{v.trades}</td>
                    <td className="r mono">{winRate(v)}</td>
                    <td className={`r mono ${tone(v.avg_r)}`}>{v.avg_r != null ? rmult(v.avg_r) : ""}</td>
                    <td className="r mono">{v.avg_hold_min != null ? mins(v.avg_hold_min) : ""}</td>
                    <td className={`r mono ${tone(v.pnl)}`}>{v.pnl != null ? usd(v.pnl) : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          ) : <Empty>Fills in as trades close.</Empty>}
          {sb?.exits && Object.keys(sb.exits).length ? (
            <div className="bk-chips">
              {Object.entries(sb.exits).map(([k, v]) => <span key={k} className={`pb-tag ${k.replace(/ /g, "-")}`}>{k} {v}</span>)}
            </div>
          ) : null}
        </section>
      </div>

      <section className="pb-panel">
        <div className="pb-panel-h"><span>Trade ledger</span><span className="pb-dim">click a row for the filing and the reasoning</span></div>
        <Ledger rows={data.recent || []} current={sb?.strategy} />
      </section>

      <div className="bk-grid">
        <section className="pb-panel">
          <div className="pb-panel-h"><span>The rules · {rules?.strategy}</span><span className="pb-dim">paper only</span></div>
          {rules?.lines?.length ? (
            <dl className="bk-rules">
              {rules.lines.map((l) => (<React.Fragment key={l.k}><dt>{l.k}</dt><dd>{l.v}</dd></React.Fragment>))}
            </dl>
          ) : (
            <p className="bk-note">
              {rules ? `Runs ${rules.window || "in the regular session"}, $${n0(rules.notional)} a position, at most ${rules.max_open} open. The full rule list appears here once the Korvus box is on the new rules.` : "Rules load with the first vault sync."}
            </p>
          )}
        </section>
        <section className="pb-panel">
          <div className="pb-panel-h"><span>Why the rules are what they are</span></div>
          {data.board?.changes?.length ? data.board.changes.map((c) => (
            <div className="bk-change" key={c.version}>
              <div className="bk-change-h"><span className="mono">{c.date}</span><b>{c.title}</b></div>
              <div className="bk-change-cols">
                <div><em>What the log showed</em><ul>{c.found.map((x) => <li key={x}>{x}</li>)}</ul></div>
                <div><em>What changed</em><ul>{c.changed.map((x) => <li key={x}>{x}</li>)}</ul></div>
              </div>
            </div>
          )) : <Empty>Rule changes are written down here, with the evidence behind each one.</Empty>}
        </section>
      </div>
    </div>
  );
};
