import React, { useEffect, useMemo, useState } from "react";
import { getIntel, type IntelData, type IntelTrade } from "../api";

const et = (iso?: string | null, withDate = true) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      ...(withDate ? { month: "short", day: "numeric" } : {}),
      hour: "numeric",
      minute: "2-digit",
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
    : `${v < 0 ? "-" : v > 0 ? "+" : ""}$${Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const tone = (v: number | null | undefined) =>
  v === null || v === undefined || v === 0 ? "" : v > 0 ? "money-in" : "money-out";

const TradeRow: React.FC<{ t: IntelTrade }> = ({ t }) => (
  <div className="money-row">
    <span className="m-date">{et(t.entry_utc)}</span>
    <span className="m-label">
      <b>{t.symbol}</b> &middot; {t.qty} @ ${t.entry_px.toFixed(2)}
      {t.status === "closed" ? (
        <> &rarr; ${t.exit_px?.toFixed(2)} &middot; {t.exit_reason}</>
      ) : (
        <> &middot; target ${t.target_px?.toFixed(2)} / stop ${t.stop_px?.toFixed(2)}</>
      )}
    </span>
    <span className={`m-amt ${tone(t.pnl)}`}>
      {t.status === "closed" ? `${usd(t.pnl)} (${pct(t.pnl_pct)})` : "open"}
    </span>
  </div>
);

export const PaperBot: React.FC = () => {
  const [data, setData] = useState<IntelData | null>(null);
  const [loaded, setLoaded] = useState(false);

  const load = () =>
    getIntel().then((d) => {
      setData(d);
      setLoaded(true);
    });
  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  const sb = data?.board?.scoreboard;
  const rules = data?.board?.rules;
  const minSample = data?.board?.min_sample ?? 30;
  const cats = useMemo(
    () => Object.entries(sb?.by_catalyst ?? {}).sort((a, b) => b[1].trades - a[1].trades),
    [sb]
  );

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Paper Bot</span>
        <h1>Korvus Intel scoreboard</h1>
        <p>
          The small-stock paper bot fed by the Korvus web crawler. It reads the
          SEC filings of US stocks near $100 the moment they land and trades the
          catalysts on paper only. No broker, no real money.
        </p>
      </div>

      {!loaded ? (
        <div className="soon-panel">Loading the scoreboard...</div>
      ) : !data ? (
        <div className="soon-panel">Could not reach the service. Make sure it is running.</div>
      ) : !data.configured ? (
        <div className="notice">
          <div className="notice-h">Waiting for intel/ to arrive</div>
          <p>
            The admin reads the Korvus Intel folder from the brain repo at{" "}
            <code>{data.dir}</code>. It appears after the next brain sync pulls
            it (every 5 minutes, needs BRAIN_SYNC=1). If the brain lives
            elsewhere, set INTEL_DIR in .env.
          </p>
        </div>
      ) : (
        <>
          {sb && !sb.sample_ok ? (
            <div className="notice" style={{ marginBottom: 18 }}>
              <div className="notice-h">
                Sample too small: {sb.closed_trades} of {minSample} trades
              </div>
              <p>
                The win rate below is not meaningful yet. Judge the strategy
                after {minSample} closed trades, not before.
              </p>
            </div>
          ) : null}

          <div className="cards">
            <div className="card">
              <div className="k">Win rate</div>
              <div className="v">{sb?.win_rate_pct ?? "n/a"}{sb?.win_rate_pct !== null && sb?.win_rate_pct !== undefined ? "%" : ""}</div>
              <div className="sub">{sb ? `${sb.wins} W / ${sb.losses} L` : "no trades yet"}</div>
            </div>
            <div className="card">
              <div className="k">Paper P&amp;L</div>
              <div className={`v ${tone(sb?.paper_pnl)}`}>{usd(sb?.paper_pnl ?? 0)}</div>
              <div className="sub">simulated, not real returns</div>
            </div>
            <div className="card">
              <div className="k">Expectancy / trade</div>
              <div className="v">{pct(sb?.expectancy_pct)}</div>
              <div className="sub">
                avg win {pct(sb?.avg_win_pct)} &middot; avg loss {pct(sb?.avg_loss_pct)}
              </div>
            </div>
            <div className="card">
              <div className="k">Profit factor</div>
              <div className="v">{sb?.profit_factor ?? "n/a"}</div>
            </div>
            <div className="card">
              <div className="k">Open / closed</div>
              <div className="v">
                {sb?.open_trades ?? 0} / {sb?.closed_trades ?? 0}
              </div>
              <div className="sub">max {rules?.max_open ?? 5} open</div>
            </div>
            <div className="card">
              <div className="k">Watching</div>
              <div className="v">{data.board?.universe_count ?? 0}</div>
              <div className="sub">
                stocks ${rules?.price_band?.[0] ?? 80} to ${rules?.price_band?.[1] ?? 120} &middot;{" "}
                {data.filingsToday ?? 0} filings today
              </div>
            </div>
          </div>

          <div className="stat-grid" style={{ marginTop: 18 }}>
            <div className="sgroup">
              <div className="sgroup-h">Open positions</div>
              {data.open?.length ? (
                <div className="money-list">
                  {data.open.map((t) => <TradeRow key={t.id} t={t} />)}
                </div>
              ) : (
                <div className="bl-empty">No open paper positions.</div>
              )}
            </div>
            <div className="sgroup">
              <div className="sgroup-h">By catalyst</div>
              {cats.length ? (
                <div className="bl">
                  {cats.map(([c, v]) => (
                    <div className="bl-row" key={c}>
                      <span className="bl-k">{c.replace(/_/g, " ")}</span>
                      <span className="bl-track">
                        <i style={{ width: `${v.trades ? (v.wins / v.trades) * 100 : 0}%` }} />
                      </span>
                      <span className="bl-n">
                        {v.wins}/{v.trades}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bl-empty">No closed trades yet.</div>
              )}
            </div>
          </div>

          <div className="sgroup" style={{ marginTop: 18 }}>
            <div className="sgroup-h">Recent paper trades</div>
            {data.recent?.length ? (
              <div className="money-list">
                {data.recent.map((t) => <TradeRow key={t.id} t={t} />)}
              </div>
            ) : (
              <div className="bl-empty">No closed trades yet. Entries run 9:45 AM to 3:30 PM ET.</div>
            )}
          </div>

          <div className="sgroup" style={{ marginTop: 18 }}>
            <div className="sgroup-h">Latest scored filings</div>
            {data.filings?.length ? (
              <div className="money-list">
                {data.filings.map((f) => (
                  <div className="money-row" key={f.url + f.seen_utc}>
                    <span className="m-date">{et(f.seen_utc)}</span>
                    <span className="m-label">
                      <b>{f.symbol}</b> &middot; {f.impact.toUpperCase()} {f.direction} {f.confidence}% &middot;{" "}
                      {f.catalyst.replace(/_/g, " ")} &middot;{" "}
                      <a href={f.url} target="_blank" rel="noopener noreferrer">
                        {f.headline}
                      </a>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bl-empty">No scored filings yet. The crawler checks EDGAR every 20 seconds.</div>
            )}
          </div>

          {rules ? (
            <div className="sgroup" style={{ marginTop: 18 }}>
              <div className="sgroup-h">Rules &middot; {rules.strategy}</div>
              <p className="pb-rules">
                Long on a bullish med/high filing at {rules.min_confidence}%+ confidence, seen in the last{" "}
                {rules.lookback_hours}h, holding above its pre-filing price and up less than{" "}
                {rules.max_day_up_pct}% on the day. ${rules.notional.toLocaleString()} paper per trade. Exit at +
                {rules.target_pct}%, -{rules.stop_pct}%, or flat at 3:55 PM ET. Fills assume{" "}
                {rules.slippage_pct}% slippage on {rules.tick_seconds}s quotes, so real fills would be worse.
              </p>
              <div className="sub" style={{ marginTop: 6 }}>
                Data as of {et(data.board?.data_asof_utc) || "n/a"} ET
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};
