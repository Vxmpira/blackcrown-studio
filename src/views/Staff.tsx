import React, { useEffect, useState } from "react";
import { getStaff, staffAddTask, staffCycle, staffEnabled, type StaffAgent } from "../api";
import { Switch } from "../components/Switch";

const ago = (t: number | null | undefined) => {
  if (!t) return "never";
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

const readLive = () => {
  try {
    return localStorage.getItem("bc_live") !== "0";
  } catch {
    return true;
  }
};

export const Staff: React.FC<{ k: string; eyebrow: string; blurb: string }> = ({ k, eyebrow, blurb }) => {
  const [agent, setAgent] = useState<StaffAgent | null>(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [newTask, setNewTask] = useState("");
  const [live, setLive] = useState(readLive);
  const [syncAt, setSyncAt] = useState(0);

  const load = async () => {
    const list = await getStaff();
    const a = list.find((x) => x.key === k);
    if (a) setAgent(a);
    setSyncAt(Date.now());
  };
  useEffect(() => {
    setAgent(null);
    load();
    if (!live) return;
    const t = window.setInterval(load, 5000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, k]);
  const toggleLive = (v: boolean) => {
    setLive(v);
    try {
      localStorage.setItem("bc_live", v ? "1" : "0");
    } catch {
      // per-browser convenience only
    }
  };
  const run = async (name: string, fn: () => Promise<unknown>) => {
    setErr("");
    setBusy(name);
    try {
      await fn();
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something failed.");
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{agent?.name || "..."}, {agent ? agent.title.toLowerCase() : "reporting in"}.</h1>
        <p>{blurb}</p>
      </div>

      <div className="pulse">
        <div className="pulse-item">
          <span className="pulse-k">State</span>
          <span className="pulse-v">
            <span className={`dot ${!agent ? "unknown" : agent.enabled ? "ok" : "unknown"}`} />
            {agent ? agent.status : "..."}
          </span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Last cycle</span>
          <span className="pulse-v" style={{ fontSize: 16 }}>{ago(agent?.lastCycleAt)}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Cadence</span>
          <span className="pulse-v" style={{ fontSize: 16 }}>{agent ? `every ${agent.cycleEveryH}h` : "..."}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Discord</span>
          <span className="pulse-v" style={{ fontSize: 16 }}>
            <span className={`dot ${agent?.channel === "none" ? "down" : "ok"}`} />
            {agent?.channel === "own" ? "two-way" : agent?.channel === "shared" ? "send only" : "not linked"}
          </span>
        </div>
        {agent?.community !== undefined ? (
          <div className="pulse-item">
            <span className="pulse-k">Eclipse-X</span>
            <span className="pulse-v" style={{ fontSize: 16 }}>
              <span className={`dot ${agent.community ? "ok" : "unknown"}`} />
              {agent.community ? "posting armed" : "not wired"}
            </span>
          </div>
        ) : null}
      </div>

      <div className="seo-bar" style={{ marginTop: 14, flexWrap: "wrap", alignItems: "center", gap: 14 }}>
        <Switch
          on={agent?.enabled !== false}
          disabled={!agent || Boolean(busy)}
          label={agent?.enabled === false ? "Auto-run off" : "Auto-run 24/7"}
          onChange={(v) => run("auto", () => staffEnabled(k, v))}
        />
        <Switch on={live} label={live ? "Live feed" : "Live feed off"} onChange={toggleLive} />
        <button className="btn" onClick={() => run("cycle", () => staffCycle(k))} disabled={Boolean(busy)}>
          {busy === "cycle" ? "Thinking..." : "Run cycle now"}
        </button>
        <button
          className="mini-btn"
          style={{ marginLeft: 0 }}
          onClick={() => run("refresh", load)}
          disabled={Boolean(busy)}
        >
          {busy === "refresh" ? "Refreshing..." : "Refresh"}
        </button>
        <span className="sync-stamp">
          <span className={`dot ${live ? "ok" : "unknown"}`} />
          {syncAt ? `synced ${new Date(syncAt).toLocaleTimeString()}` : "..."}
        </span>
      </div>
      {err ? <div className="status err">{err}</div> : null}

      <div className="sgroup" style={{ marginTop: 18 }}>
        <div className="sgroup-h">Thinking</div>
        <div className="agent-focus">{agent?.focus || "..."}</div>
        {agent?.thought ? <p className="agent-thought">{agent.thought}</p> : null}
      </div>

      <div className="stat-grid" style={{ marginTop: 18 }}>
        <div className="sgroup">
          <div className="sgroup-h">Task queue</div>
          {(agent?.tasks || []).length ? (
            <div className="bl">
              {(agent?.tasks || []).map((t) => (
                <div className="agent-task" key={t.id}>
                  <span className={`t-chip t-${t.status}`}>{t.status}</span>
                  <span>{t.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bl-empty">No tasks yet. Proposals it files land in the CEO tab and Discord.</div>
          )}
          <form
            className="gen-custom"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newTask.trim()) return;
              await staffAddTask(k, newTask.trim());
              setNewTask("");
              load();
            }}
          >
            <input
              placeholder={`Hand ${agent?.name || "the agent"} a task...`}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button className="btn gen-go" type="submit" disabled={!newTask.trim()}>
              Add
            </button>
          </form>
        </div>

        <div className="sgroup">
          <div className="sgroup-h">Live log</div>
          <div className="agent-log">
            {(agent?.log || []).map((l, i) => (
              <div className="log-row" key={i}>
                <span className="log-t">{new Date(l.t).toLocaleTimeString()}</span>
                <span className={`log-k k-${l.kind}`}>{l.kind}</span>
                <span className="log-x">{l.text}</span>
              </div>
            ))}
            {!(agent?.log || []).length ? <div className="bl-empty">Quiet so far.</div> : null}
          </div>
        </div>
      </div>
    </>
  );
};
