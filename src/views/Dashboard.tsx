import React, { useEffect, useState } from "react";
import {
  getCeo,
  getRevenue,
  getStats,
  getUptime,
  type RevenueData,
  type UptimeSite,
} from "../api";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type NodeProps = {
  x: number;
  y: number;
  label: string;
  sub?: string;
  up?: boolean | null;
  big?: boolean;
};
const GNode: React.FC<NodeProps> = ({ x, y, label, sub, up, big }) => (
  <g transform={`translate(${x} ${y})`} className="gnode">
    <circle
      r={big ? 26 : 20}
      className={`gnode-ring ${up === undefined ? "" : up === null ? "g-unknown" : up ? "g-up" : "g-down"}`}
    />
    <circle r={big ? 5 : 4} className="gnode-core" />
    <text y={big ? 46 : 38} className="gnode-label">
      {label}
    </text>
    {sub ? (
      <text y={big ? 62 : 53} className="gnode-sub">
        {sub}
      </text>
    ) : null}
  </g>
);

const Packet: React.FC<{ route: string; dur: number; begin?: string; tone: "cyan" | "pink" | "gold" }> = ({
  route,
  dur,
  begin,
  tone,
}) => (
  <circle r="3.4" className={`gpk gpk-${tone}`}>
    <animateMotion dur={`${dur}s`} begin={begin || "0s"} repeatCount="indefinite">
      <mpath href={`#${route}`} />
    </animateMotion>
  </circle>
);

export const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<UptimeSite[]>([]);
  const [rev, setRev] = useState<RevenueData | null>(null);
  const [today, setToday] = useState<{ visits: number; clicks: number } | null>(null);
  const [asks, setAsks] = useState<number | null>(null);

  useEffect(() => {
    getUptime().then(setSites);
    getRevenue().then(setRev);
    getStats().then((d) => setToday(d?.today ?? { visits: 0, clicks: 0 }));
    getCeo().then((c) => setAsks(c ? c.asks.length : 0));
  }, []);

  const up = (key: string) => sites.find((s) => s.key === key)?.up;
  const visits = today?.visits ?? 0;
  const clicks = today?.clicks ?? 0;
  const trafficPackets = visits > 20 ? 3 : visits > 0 ? 2 : 1;

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Dashboard</span>
        <h1>The Grid.</h1>
        <p>Your empire as a living map. Every light is real: traffic, money, and the agents at work.</p>
      </div>

      <div className="grid-map">
        <svg viewBox="0 0 900 540">
          {/* routes */}
          <defs>
            <path id="r-world-site" d="M90 270 C 200 270, 280 270, 370 270" />
            <path id="r-site-korvus" d="M430 250 C 540 200, 640 160, 740 140" />
            <path id="r-site-crown" d="M435 270 C 560 270, 650 268, 742 266" />
            <path id="r-site-ex" d="M430 290 C 540 340, 640 380, 740 396" />
            <path id="r-stripe-you" d="M140 470 C 320 470, 420 420, 470 120" />
            <path id="r-corvid-regent" d="M250 95 C 310 80, 360 75, 410 80" />
            <path id="r-regent-you" d="M452 85 C 465 85, 470 88, 476 92" />
            <path id="r-corvid-site" d="M230 118 C 280 170, 330 220, 385 252" />
          </defs>
          <g className="grid-routes">
            <use href="#r-world-site" />
            <use href="#r-site-korvus" />
            <use href="#r-site-crown" />
            <use href="#r-site-ex" />
            <use href="#r-stripe-you" />
            <use href="#r-corvid-regent" />
            <use href="#r-regent-you" />
            <use href="#r-corvid-site" />
          </g>

          {/* packets, driven by live numbers */}
          <g className="grid-packets">
            {Array.from({ length: trafficPackets }).map((_, i) => (
              <Packet key={`t${i}`} route="r-world-site" dur={4 + i * 1.3} begin={`-${i * 1.7}s`} tone="cyan" />
            ))}
            {clicks > 0 ? (
              <>
                <Packet route="r-site-korvus" dur={5} tone="pink" />
                <Packet route="r-site-crown" dur={6} begin="-2s" tone="pink" />
                <Packet route="r-site-ex" dur={5.5} begin="-3s" tone="pink" />
              </>
            ) : (
              <Packet route="r-site-korvus" dur={9} tone="pink" />
            )}
            {rev?.configured && (rev.monthGross || 0) > 0 ? (
              <Packet route="r-stripe-you" dur={7} tone="gold" />
            ) : null}
            <Packet route="r-corvid-regent" dur={4.5} tone="pink" />
            <Packet route="r-regent-you" dur={3} begin="-1s" tone="pink" />
            <Packet route="r-corvid-site" dur={8} begin="-4s" tone="cyan" />
          </g>

          {/* districts */}
          <GNode x={90} y={270} label="THE WORLD" sub={`${visits} in today`} />
          <GNode x={400} y={270} label="BLACKCROWNVXJ.COM" up={up("brand")} big />
          <GNode x={770} y={135} label="KORVUS" up={up("korvus")} />
          <GNode x={772} y={266} label="CROWN" up={up("intelligence")} />
          <GNode x={770} y={400} label="ECLIPSE-X" />
          <GNode x={140} y={470} label="STRIPE" sub={rev?.configured ? `${usd(rev.mrr || 0)} MRR` : "not linked"} />
          <GNode x={220} y={95} label="CORVID" />
          <GNode x={432} y={85} label="REGENT" sub={asks ? `${asks} ask${asks === 1 ? "" : "s"} waiting` : "standing by"} />
          <GNode x={492} y={95} label="YOU" big />
        </svg>
      </div>

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
