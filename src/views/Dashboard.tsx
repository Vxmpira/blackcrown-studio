import React from "react";
import { ads } from "../remotion/data";

export const Dashboard: React.FC = () => {
  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Dashboard</span>
        <h1>Overview</h1>
        <p>Your control room for BlackCrown. More modules land here over time.</p>
      </div>
      <div className="cards">
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
          <div className="k">The Collective</div>
          <a className="v" href="https://discord.gg/xmuSA5mMTN" target="_blank" rel="noopener">
            Discord
          </a>
        </div>
      </div>
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
