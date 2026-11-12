import React, { useEffect, useState } from "react";
import { getUsage, UsageData } from "../api";

// What the agents spent on the model today: dollars against the daily budget,
// and for each desk how much of its input came from the cache. A healthy desk
// that works all day reads most of its prompt from cache.
const NAMES: Record<string, string> = {
  corvid: "Corvid", regent: "Regent", bard: "Bard", herald: "Herald", steward: "Steward", staff: "Staff",
  minions: "Corvid minions", librarian: "Librarian", jobs: "Scheduled reports",
  "bard-minions": "Bard minions", "herald-minions": "Herald minions", "steward-minions": "Steward minions",
};
const k = (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1000 ? Math.round(n / 1000) + "k" : String(n));
const short = (m: string) => m.replace(/^claude-/, "");

export const Wallet: React.FC = () => {
  const [u, setU] = useState<UsageData | null>(null);
  useEffect(() => {
    const load = () => getUsage().then(setU);
    load();
    const t = window.setInterval(load, 60000);
    return () => window.clearInterval(t);
  }, []);
  if (!u) return null;
  const today = u.days[u.days.length - 1];
  const agents = (today?.agents || []).slice().sort((a, b) => b.usd - a.usd);
  const week = u.days.slice(-7);
  const peak = Math.max(0.01, ...week.map((d) => d.usd), u.budget.cap || 0);
  const pct = u.budget.cap ? Math.min(100, (u.budget.spent / u.budget.cap) * 100) : 0;
  const state =
    u.budget.level === "out" ? "Budget reached. Background work is paused until midnight ET; your messages and approvals still run."
    : u.budget.level === "tight" ? "Past 70 percent. Task steps are running at half pace."
    : u.budget.level === "off" ? "No daily budget set."
    : "Inside budget.";
  return (
    <div className="card wallet">
      <div className="wallet-top">
        <div>
          <div className="k">Model spend today</div>
          <div className="v">
            ${u.budget.spent.toFixed(2)}
            {u.budget.cap ? <span className="wallet-cap"> of ${u.budget.cap.toFixed(2)}</span> : null}
          </div>
        </div>
        <div className="wallet-week" aria-label="Spend, last 7 days">
          {week.map((d) => (
            <span key={d.day} title={`${d.day}: $${d.usd.toFixed(2)}`}>
              <i style={{ height: `${Math.max(4, (d.usd / peak) * 100)}%` }} />
            </span>
          ))}
        </div>
      </div>
      {u.budget.cap ? (
        <div className={`bar wallet-bar ${u.budget.level}`}>
          <i style={{ width: `${pct}%` }} />
        </div>
      ) : null}
      <div className="wallet-state">{state}</div>
      {agents.length ? (
        <div className="wallet-rows">
          <div className="wallet-row wallet-head">
            <span>Desk</span><span>Model</span><span>Calls</span><span>Input</span><span>From cache</span><span>Output</span><span>Cost</span>
          </div>
          {agents.map((a) => (
            <div className="wallet-row" key={a.who}>
              <span className="wallet-who">{NAMES[a.who] || a.who}</span>
              <span className="wallet-model">{short(a.model)}</span>
              <span>{a.calls}</span>
              <span>{k(a.input)}</span>
              <span className={a.cacheHitPct >= 50 ? "good" : ""}>{a.cacheHitPct}%</span>
              <span>{k(a.output)}</span>
              <span className="wallet-usd">${a.usd.toFixed(2)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="wallet-state">No model calls yet today.</div>
      )}
    </div>
  );
};
