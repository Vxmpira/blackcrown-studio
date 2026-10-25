import React, { useEffect, useState } from "react";
import { ads } from "../remotion/data";
import { getStats, getUptime, type UptimeSite } from "../api";

export const Dashboard: React.FC = () => {
  const [today, setToday] = useState<number | null>(null);
  const [sites, setSites] = useState<UptimeSite[]>([]);

  useEffect(() => {
    getStats().then((d) => setToday(d?.today?.visits ?? 0));
    getUptime().then(setSites);
  }, []);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Dashboard</span>
        <h1>Overview</h1>
        <p>Your control room for BlackCrown. More modules land here over time.</p>
      </div>
      <div className="cards">
        <div className="card">
          <div className="k">Visits today</div>
          <div className="v">{today === null ? "..." : today}</div>
        </div>
        <div className="card">
          <div className="k">Ads ready</div>
          <div className="v">{ads.length}</div>
        </div>
        <div className="card">
          <div className="k">Live site</div>
          <a className="v" href="https://blackcrownvxj.com" target="_blank" rel="noopener">
            blackcrownvxj.com
          </a>
        </div>
        <div className="card">
          <div className="k">Eclipse-X</div>
          <a className="v" href="https://discord.gg/xmuSA5mMTN" target="_blank" rel="noopener">
            Discord
          </a>
        </div>
      </div>
      {sites.length ? (
        <div className="sgroup" style={{ marginTop: 18 }}>
          <div className="sgroup-h">Status</div>
          <div className="up-grid">
            {sites.map((s) => (
              <div className="up-card" key={s.key}>
                <span
                  className={`dot ${s.up === null ? "unknown" : s.up ? "ok" : "down"}`}
                />
                <div>
                  <div className="up-label">{s.label}</div>
                  <div className="up-meta">
                    {s.up === null ? "not checked yet" : s.up ? `up · ${s.ms} ms` : "DOWN"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export const SoonPanel: React.FC<{ label: string }> = ({ label }) => (
  <>
    <div className="page-head">
      <span className="eyebrow">{label}</span>
      <h1>{label}</h1>
    </div>
    <div className="soon-panel">This module is coming next.</div>
  </>
);
