import React, { useEffect, useMemo, useState } from "react";
import {
  getStats,
  getUptime,
  type StatsData,
  type StatBuckets,
  type UptimeSite,
} from "../api";

const sum = (o?: Record<string, number>) =>
  Object.values(o || {}).reduce((a, b) => a + b, 0);

const PAGE_LABELS: Record<string, string> = {
  home: "Home",
  brand: "Home",
  korvus: "Korvus",
  intelligence: "Intelligence",
  "eclipse-x": "Eclipse-X",
  collective: "Collective",
  lodestone: "LodeStone",
  proof: "Proof",
  support: "Support",
};

const SRC_LABELS: Record<string, string> = {
  direct: "Direct / typed in",
  google: "Google",
  bing: "Bing",
  duckduckgo: "DuckDuckGo",
  discord: "Discord",
  x: "X / Twitter",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  reddit: "Reddit",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  other: "Other sites",
};

const Chart30: React.FC<{
  data: { day: string; visits: number; clicks: number }[];
}> = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.visits));
  return (
    <div className="spark spark-30">
      {data.map((d) => (
        <div
          className="spark-col"
          key={d.day}
          title={`${d.day}: ${d.visits} visits, ${d.clicks} clicks`}
        >
          <div
            className="spark-bar"
            style={{ height: `${Math.max(3, (d.visits / max) * 100)}%` }}
          />
        </div>
      ))}
    </div>
  );
};

const BarList: React.FC<{
  items: [string, number][];
  labels?: Record<string, string>;
  empty: string;
}> = ({ items, labels, empty }) => {
  const max = Math.max(1, ...items.map(([, n]) => n));
  if (!items.length) return <div className="bl-empty">{empty}</div>;
  return (
    <div className="bl">
      {items.map(([k, n]) => (
        <div className="bl-row" key={k}>
          <span className="bl-k">{(labels && labels[k]) || k}</span>
          <span className="bl-track">
            <i style={{ width: `${(n / max) * 100}%` }} />
          </span>
          <span className="bl-n">{n}</span>
        </div>
      ))}
    </div>
  );
};

const Hours: React.FC<{ hr?: Record<string, number> }> = ({ hr }) => {
  const vals = Array.from({ length: 24 }, (_, i) => {
    const k = String(i).padStart(2, "0");
    return hr?.[k] ?? hr?.[String(i)] ?? 0;
  });
  const max = Math.max(1, ...vals);
  const any = vals.some((v) => v > 0);
  if (!any) return <div className="bl-empty">No visits logged yet.</div>;
  return (
    <>
      <div className="hours">
        {vals.map((v, i) => (
          <div
            className="hour-cell"
            key={i}
            title={`${i}:00 ET, ${v} visits`}
            style={{ opacity: v ? 0.25 + (v / max) * 0.75 : 0.08 }}
          />
        ))}
      </div>
      <div className="hours-lab">
        <span>12am</span>
        <span>6am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>11pm</span>
      </div>
    </>
  );
};

const UptimePanel: React.FC = () => {
  const [sites, setSites] = useState<UptimeSite[]>([]);
  const [busy, setBusy] = useState(false);

  const load = (fresh = false) => {
    setBusy(true);
    getUptime(fresh).then((s) => {
      setSites(s);
      setBusy(false);
    });
  };
  useEffect(() => load(), []);

  return (
    <div className="sgroup">
      <div className="sgroup-h">
        Product uptime
        <button className="mini-btn" onClick={() => load(true)} disabled={busy}>
          {busy ? "Checking..." : "Check now"}
        </button>
      </div>
      {!sites.length ? (
        <div className="bl-empty">No checks yet. The service pings every 5 minutes.</div>
      ) : (
        <div className="up-grid">
          {sites.map((s) => (
            <div className="up-card" key={s.key}>
              <span className={`dot ${s.up === null ? "unknown" : s.up ? "ok" : "down"}`} />
              <div>
                <div className="up-label">{s.label}</div>
                <div className="up-meta">
                  {s.up === null
                    ? "not checked yet"
                    : s.up
                    ? `up · ${s.ms} ms`
                    : `DOWN · last status ${s.status || "none"}`}
                  {s.pct24h !== null ? ` · ${s.pct24h}% last 24h` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Stats: React.FC = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [range, setRange] = useState<"w7" | "w30">("w7");

  useEffect(() => {
    getStats().then((d) => {
      setData(d);
      setLoaded(true);
    });
  }, []);

  const w: StatBuckets | undefined = data?.[range];

  const totals = useMemo(() => {
    const visits = sum(w?.visit);
    const korvus = w?.click?.korvus ?? 0;
    const intelligence = w?.click?.intelligence ?? 0;
    const eclipse = (w?.click?.collective ?? 0) + (w?.click?.["eclipse-x"] ?? 0);
    const ctr = (n: number) => (visits ? `${Math.round((n / visits) * 1000) / 10}% of visits` : "");
    return { visits, korvus, intelligence, eclipse, ctr };
  }, [w]);

  const pages = useMemo(
    () => Object.entries(w?.visit ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 10),
    [w]
  );
  const sources = useMemo(
    () => Object.entries(w?.src ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 10),
    [w]
  );
  const devices = useMemo(
    () => Object.entries(w?.dev ?? {}).sort((a, b) => b[1] - a[1]),
    [w]
  );

  const series30 = data?.series30 ?? data?.series?.map((d) => ({ ...d, clicks: 0 })) ?? [];
  const hasAny = Boolean(
    data && (totals.visits || totals.korvus || totals.intelligence || totals.eclipse || series30.some((d) => d.visits))
  );
  const todayDelta = useMemo(() => {
    const t = data?.today?.visits ?? 0;
    const avg = data?.prev7avg ?? 0;
    if (!avg) return "";
    const diff = Math.round(((t - avg) / avg) * 100);
    return `${diff >= 0 ? "+" : ""}${diff}% vs 7d avg`;
  }, [data]);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Statistics</span>
        <h1>Traffic and clicks</h1>
        <p>
          Visits, sources, devices and click-throughs to each product. Counted
          first-party on your own server, no cookies.
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
          <div className="range-row">
            <button
              className={`range-btn${range === "w7" ? " active" : ""}`}
              onClick={() => setRange("w7")}
            >
              Last 7 days
            </button>
            <button
              className={`range-btn${range === "w30" ? " active" : ""}`}
              onClick={() => setRange("w30")}
            >
              Last 30 days
            </button>
          </div>

          <div className="cards">
            <div className="card">
              <div className="k">Site visits</div>
              <div className="v">{totals.visits}</div>
            </div>
            <div className="card">
              <div className="k">Today</div>
              <div className="v">{data.today?.visits ?? 0}</div>
              {todayDelta ? <div className="sub">{todayDelta}</div> : null}
            </div>
            <div className="card">
              <div className="k">Korvus clicks</div>
              <div className="v">{totals.korvus}</div>
              {totals.korvus ? <div className="sub">{totals.ctr(totals.korvus)}</div> : null}
            </div>
            <div className="card">
              <div className="k">Intelligence clicks</div>
              <div className="v">{totals.intelligence}</div>
              {totals.intelligence ? (
                <div className="sub">{totals.ctr(totals.intelligence)}</div>
              ) : null}
            </div>
            <div className="card">
              <div className="k">Eclipse-X joins</div>
              <div className="v">{totals.eclipse}</div>
              {totals.eclipse ? <div className="sub">{totals.ctr(totals.eclipse)}</div> : null}
            </div>
          </div>

          <div className="sgroup" style={{ marginTop: 18 }}>
            <div className="sgroup-h">Daily visits, last 30 days</div>
            <Chart30 data={series30} />
          </div>

          <div className="stat-grid">
            <div className="sgroup">
              <div className="sgroup-h">Visits by page</div>
              <BarList items={pages} labels={PAGE_LABELS} empty="No page visits yet." />
            </div>
            <div className="sgroup">
              <div className="sgroup-h">Traffic sources</div>
              <BarList items={sources} labels={SRC_LABELS} empty="No sources logged yet." />
            </div>
            <div className="sgroup">
              <div className="sgroup-h">Devices</div>
              <BarList
                items={devices}
                labels={{ mobile: "Phone", desktop: "Desktop" }}
                empty="No device data yet."
              />
            </div>
            <div className="sgroup">
              <div className="sgroup-h">Best hours (Eastern)</div>
              <Hours hr={w?.hr} />
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <UptimePanel />
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
