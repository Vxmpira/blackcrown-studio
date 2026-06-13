import React, { useEffect, useMemo, useState } from "react";
import { getStats, type StatsData } from "../api";

const sum = (o: Record<string, number>) =>
  Object.values(o || {}).reduce((a, b) => a + b, 0);

const Spark: React.FC<{ data: { day: string; visits: number }[] }> = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.visits));
  return (
    <div className="spark">
      {data.map((d) => (
        <div className="spark-col" key={d.day} title={`${d.day}: ${d.visits}`}>
          <div
            className="spark-bar"
            style={{ height: `${Math.max(3, (d.visits / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
};

export const Stats: React.FC = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getStats().then((d) => {
      setData(d);
      setLoaded(true);
    });
  }, []);

  const totals = useMemo(() => {
    const w = data?.w7;
    return {
      visits: sum(w?.visit ?? {}),
      korvus: w?.click?.korvus ?? 0,
      intelligence: w?.click?.intelligence ?? 0,
      collective: w?.click?.collective ?? 0,
    };
  }, [data]);

  const hasAny =
    data &&
    (totals.visits ||
      totals.korvus ||
      totals.intelligence ||
      totals.collective ||
      data.series.some((d) => d.visits));

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Statistics</span>
        <h1>Traffic and clicks</h1>
        <p>
          Visits to your site and click-throughs to each product over the last 7
          days. Counted first-party on your own server, no cookies.
        </p>
      </div>

      {!loaded ? (
        <div className="soon-panel">Loading your numbers...</div>
      ) : !data ? (
        <div className="soon-panel">
          Could not reach the service. Make sure it is running.
        </div>
      ) : (
        <>
          <div className="cards">
            <div className="card">
              <div className="k">Site visits (7d)</div>
              <div className="v">{totals.visits}</div>
            </div>
            <div className="card">
              <div className="k">Korvus clicks</div>
              <div className="v">{totals.korvus}</div>
            </div>
            <div className="card">
              <div className="k">Intelligence clicks</div>
              <div className="v">{totals.intelligence}</div>
            </div>
            <div className="card">
              <div className="k">Collective joins</div>
              <div className="v">{totals.collective}</div>
            </div>
          </div>

          <div className="sgroup" style={{ marginTop: 18 }}>
            <div className="sgroup-h">Daily visits, last 14 days</div>
            <Spark data={data.series} />
          </div>

          {!hasAny ? (
            <div className="notice" style={{ marginTop: 18 }}>
              <div className="notice-h">Waiting for the first hits</div>
              <p>
                Numbers are at zero because the beacon has not recorded anything
                yet. Once the snippet is live on blackcrownvxj.com, visits and
                product clicks will start showing here within seconds. Open your
                site in a new tab to log the first visit.
              </p>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};
