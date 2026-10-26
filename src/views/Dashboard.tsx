import React, { Suspense, useEffect, useState } from "react";
import {
  getAgent,
  getCeo,
  getRevenue,
  getSeo,
  getStaff,
  getStats,
  getUptime,
  type AgentState,
  type CeoState,
  type RevenueData,
  type SeoData,
  type StaffAgent,
  type UptimeSite,
} from "../api";


const City3D = React.lazy(() =>
  import("../components/City3D").then((m) => ({ default: m.City3D }))
);

export const Dashboard: React.FC = () => {
  const [sites, setSites] = useState<UptimeSite[]>([]);
  const [rev, setRev] = useState<RevenueData | null>(null);
  const [today, setToday] = useState<{ visits: number; clicks: number } | null>(null);
  const [ceo, setCeo] = useState<CeoState | null>(null);
  const [agent, setAgent] = useState<AgentState | null>(null);
  const [seo, setSeo] = useState<SeoData | null>(null);
  const [stats, setStats] = useState<{ sources?: Record<string, number> } | null>(null);
  const [staff, setStaff] = useState<StaffAgent[]>([]);
  const [sel, setSel] = useState<string | null>(null);

  const load = () => {
    getUptime().then(setSites);
    getRevenue().then(setRev);
    getStats().then((d) => {
      setToday(d?.today ?? { visits: 0, clicks: 0 });
      setStats({ sources: d?.w7?.src });
    });
    getCeo().then(setCeo);
    getAgent().then(setAgent);
    getSeo().then(setSeo);
    getStaff().then(setStaff);
  };
  useEffect(() => {
    load();
    const t = window.setInterval(load, 60000);
    return () => window.clearInterval(t);
  }, []);
  // inside a building, the dossier breathes: refresh fast while one is open
  useEffect(() => {
    if (!sel) return;
    const t = window.setInterval(load, 8000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  const usd = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const up = (key: string) => sites.find((s) => s.key === key) ?? null;
  const asks = ceo ? ceo.asks.length : null;
  const visits = today?.visits ?? 0;
  const clicks = today?.clicks ?? 0;
  const score = (file: string) => seo?.pages.find((p) => p.file === file)?.score;
  const topSource = stats?.sources
    ? Object.entries(stats.sources).sort((a, b) => b[1] - a[1])[0]?.[0]
    : undefined;
  const site = (k: string) => up(k);
  const fmtUp = (s: UptimeSite | null) =>
    !s || s.up === null ? "not checked yet" : s.up ? `up, ${s.ms} ms, ${s.pct24h ?? "?"}% 24h` : "DOWN";
  const member = (k: string) => staff.find((s) => s.key === k) || null;
  const staffLines = (k: string) => {
    const a = member(k);
    if (!a) return ["hiring in progress, refresh in a minute"];
    return [
      `${a.status}, last cycle ${a.lastCycleAt ? Math.round((Date.now() - a.lastCycleAt) / 60000) + "m ago" : "never"}`,
      a.focus || "",
      `${a.tasks.filter((t) => t.status !== "done").length} open tasks · every ${a.cycleEveryH}h`,
    ];
  };

  const details: Record<string, { title: string; lines: string[] }> = {
    world: {
      title: "The World",
      lines: [
        `${visits} visits today, ${clicks} product clicks`,
        `Top source this week: ${topSource || "none yet"}`,
      ],
    },
    site: {
      title: "blackcrownvxj.com",
      lines: [
        fmtUp(site("brand")),
        `Home SEO score: ${score("index.html") ?? "no audit"}`,
        `${seo?.pages.filter((p) => !p.file.includes(".com")).length ?? 0} pages in the audit`,
      ],
    },
    korvus: {
      title: "Korvus",
      lines: [fmtUp(site("korvus")), `Homepage SEO score: ${score("korvus.industries") ?? "no audit yet"}`],
    },
    crown: {
      title: "Crown",
      lines: [fmtUp(site("intelligence")), `Homepage SEO score: ${score("blackcrown-intelligence.com") ?? "no audit yet"}`],
    },
    eclipse: { title: "Eclipse-X", lines: ["Free community, top of the funnel", "Joins count as collective clicks in Statistics"] },
    stripe: {
      title: "Stripe",
      lines: rev?.configured
        ? [`MRR ${usd(rev.mrr || 0)}, ${rev.subscribers || 0} subscribers`, `${usd(rev.monthGross || 0)} collected this month`]
        : ["Not linked, add STRIPE_SECRET_KEY in .env"],
    },
    corvid: {
      title: "Corvid, SEO agent",
      lines: [
        agent ? `${agent.status}, last cycle ${agent.lastCycleAt ? Math.round((Date.now() - agent.lastCycleAt) / 60000) + "m ago" : "never"}` : "...",
        agent?.currentFocus || "",
        `${agent?.tasks.filter((t) => t.status !== "done").length ?? 0} open tasks`,
      ],
    },
    herald: { title: "Herald, sales and advertising", lines: staffLines("herald") },
    steward: { title: "Steward, project manager", lines: staffLines("steward") },
    regent: {
      title: "Regent, CEO agent",
      lines: [
        `${asks ?? 0} ask${asks === 1 ? "" : "s"} waiting on you`,
        `${ceo?.executed.length ?? 0} executions on the ledger`,
        ceo?.lastInitiativeAt ? `agenda set ${Math.round((Date.now() - ceo.lastInitiativeAt) / 3600000)}h ago` : "first agenda pending",
      ],
    },
    you: { title: "You", lines: ["The owner. Everything above answers to you.", "Approvals happen in Discord or the CEO tab."] },
  };

  // the interior: live mind of an agent building
  const MINION_ROLES: Record<string, string> = {
    scout: "research",
    scribe: "copy",
    analyst: "numbers",
    pitch: "campaigns",
    copy: "ad copy",
    prospector: "audiences",
    planner: "project steps",
    crier: "community",
    auditor: "operations",
  };
  const agoShort = (t: number) => {
    const mn = Math.round((Date.now() - t) / 60000);
    return mn < 1 ? "now" : mn < 60 ? `${mn}m` : `${Math.round(mn / 60)}h`;
  };
  type Interior = {
    thought: string;
    minions: { minion: string; task: string; t: number }[];
    tasks: { title: string; status: string }[];
    logs: { t: number; kind: string; text: string }[];
  } | null;
  const interior: Interior = (() => {
    if (sel === "corvid" && agent) {
      return {
        thought: agent.lastThought || "",
        minions: agent.minionReports || [],
        tasks: agent.tasks.filter((t) => t.status !== "done").slice(0, 4),
        logs: (agent.log || []).slice(0, 5),
      };
    }
    if ((sel === "herald" || sel === "steward") && member(sel)) {
      const a = member(sel)!;
      return {
        thought: a.thought || "",
        minions: a.minionReports || [],
        tasks: a.tasks.filter((t) => t.status !== "done").slice(0, 4),
        logs: (a.log || []).slice(0, 5),
      };
    }
    if (sel === "regent" && ceo) {
      return {
        thought: ceo.asks.length ? `Holding ${ceo.asks.length} ask(s) for the owner's word.` : "Watching the filings.",
        minions: [],
        tasks: [],
        logs: (ceo.log || []).slice(0, 6),
      };
    }
    return null;
  })();

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Dashboard</span>
        <h1>The Grid.</h1>
        <p>Your empire as a living city. Every light is real: traffic, money, and the agents at work.</p>
      </div>

      <div className="city-wrap">
        <Suspense fallback={<div className="city3d" />}>
          <City3D
            onSelect={setSel}
            data={{
              trafficPackets: visits > 20 ? 3 : visits > 0 ? 2 : 1,
              clicksActive: clicks > 0,
              goldActive: Boolean(rev?.configured && (rev.monthGross || 0) > 0),
              status: {
                site: site("brand")?.up ?? null,
                korvus: site("korvus")?.up ?? null,
                crown: site("intelligence")?.up ?? null,
              },
              worldSub: `${visits} in today`,
              stripeSub: rev?.configured ? `${usd(rev.mrr || 0)} MRR` : "not linked",
              regentSub: asks ? `${asks} ask${asks === 1 ? "" : "s"} waiting` : "standing by",
              heraldSub: member("herald") ? (member("herald")!.enabled ? "on the desk" : "paused") : "",
              stewardSub: member("steward") ? (member("steward")!.enabled ? "running the board" : "paused") : "",
            }}
          />
        </Suspense>
        {sel && details[sel] ? (
          <div className={`c3d-panel${interior ? " deep" : ""}`}>
            <div className="c3d-panel-head">
              <span>{details[sel].title}</span>
              <button className="m-del" onClick={() => setSel(null)}>x</button>
            </div>
            {details[sel].lines.filter(Boolean).map((l, i) => (
              <div className="c3d-panel-line" key={i}>{l}</div>
            ))}
            {interior ? (
              <>
                {interior.thought ? (
                  <>
                    <div className="c3d-sec">Thinking, live</div>
                    <div className="c3d-think">{interior.thought}</div>
                  </>
                ) : null}
                {interior.minions.length ? (
                  <>
                    <div className="c3d-sec">Minions on the floor</div>
                    {interior.minions.map((mr, i) => (
                      <div className="c3d-min" key={i}>
                        <span className="c3d-min-name">
                          {mr.minion}
                          <em>{MINION_ROLES[mr.minion] ? ` · ${MINION_ROLES[mr.minion]}` : ""}</em>
                        </span>
                        <span className="c3d-min-task">{mr.task}</span>
                        <span className="c3d-min-ago">{agoShort(mr.t)}</span>
                      </div>
                    ))}
                  </>
                ) : null}
                {interior.tasks.length ? (
                  <>
                    <div className="c3d-sec">On the desk</div>
                    {interior.tasks.map((t, i) => (
                      <div className="c3d-panel-line" key={i}>
                        <span className={`t-chip t-${t.status}`} style={{ marginRight: 6 }}>{t.status}</span>
                        {t.title}
                      </div>
                    ))}
                  </>
                ) : null}
                {interior.logs.length ? (
                  <>
                    <div className="c3d-sec">Wire</div>
                    {interior.logs.map((l, i) => (
                      <div className="c3d-log" key={i}>
                        <span className="log-t">{new Date(l.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className={`log-k k-${l.kind}`}>{l.kind}</span>
                        <span>{l.text}</span>
                      </div>
                    ))}
                  </>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}
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
