import React, { Suspense, useEffect, useState } from "react";
import {
  getCeo,
  getRevenue,
  getStats,
  getUptime,
  type RevenueData,
  type UptimeSite,
} from "../api";


const City3D = React.lazy(() =>
  import("../components/City3D").then((m) => ({ default: m.City3D }))
);

export const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<UptimeSite[]>([]);
  const [rev, setRev] = useState<RevenueData | null>(null);
  const [today, setToday] = useState<{ visits: number; clicks: number } | null>(null);
  const [asks, setAsks] = useState<number | null>(null);

  const load = () => {
    getUptime().then(setSites);
    getRevenue().then(setRev);
    getStats().then((d) => setToday(d?.today ?? { visits: 0, clicks: 0 }));
    getCeo().then((c) => setAsks(c ? c.asks.length : 0));
  };
  useEffect(() => {
    load();
    const t = window.setInterval(load, 60000);
    return () => window.clearInterval(t);
  }, []);

  const up = (key: string) => sites.find((s) => s.key === key)?.up ?? null;
  const visits = today?.visits ?? 0;
  const clicks = today?.clicks ?? 0;
  const usd = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Dashboard</span>
        <h1>The Grid.</h1>
        <p>Your empire as a living city. Every light is real: traffic, money, and the agents at work.</p>
      </div>

      <Suspense fallback={<div className="city3d" />}>
      <City3D
        data={{
          trafficPackets: visits > 20 ? 3 : visits > 0 ? 2 : 1,
          clicksActive: clicks > 0,
          goldActive: Boolean(rev?.configured && (rev.monthGross || 0) > 0),
          status: { site: up("brand"), korvus: up("korvus"), crown: up("intelligence") },
          worldSub: `${visits} in today`,
          stripeSub: rev?.configured ? `${usd(rev.mrr || 0)} MRR` : "not linked",
          regentSub: asks ? `${asks} ask${asks === 1 ? "" : "s"} waiting` : "standing by",
        }}
      />
      </Suspense>

      <div className="pulse" style={{ marginTop: 18 }}>
        <div className="pulse-item">
          <span className="pulse-k">Visits today</span>
          <span className="pulse-v">{today ? visits : "..."}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Product clicks</span>
          <span className="pulse-v">{today ? clicks : "..."}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">MRR</span>
          <span className="pulse-v">{rev?.configured ? usd(rev.mrr || 0) : "..."}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Subscribers</span>
          <span className="pulse-v">{rev?.configured ? rev.subscribers || 0 : "..."}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Asks waiting</span>
          <span className="pulse-v">{asks === null ? "..." : asks}</span>
        </div>
      </div>
    </>
  );
};
