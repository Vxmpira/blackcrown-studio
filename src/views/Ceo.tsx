import React, { useEffect, useState } from "react";
import {
  agentDecide,
  ceoBrainDownloadUrl,
  ceoBrainSaveFile,
  ceoEnabled,
  getCeo,
  getCeoBrainFile,
  getCeoBrainList,
  type BrainFileMeta,
  type CeoState,
} from "../api";
import { Switch } from "../components/Switch";

const readLive = () => {
  try {
    return localStorage.getItem("bc_live") !== "0";
  } catch {
    return true;
  }
};

const ago = (t: number | null | undefined) => {
  if (!t) return "never";
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 48 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
};

const CeoBrain: React.FC = () => {
  const [files, setFiles] = useState<BrainFileMeta[]>([]);
  const [sel, setSel] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCeoBrainList().then(setFiles);
  }, []);
  const openFile = async (name: string) => {
    setSel(name);
    setEditing(false);
    setBody(await getCeoBrainFile(name));
  };
  const save = async () => {
    setSaving(true);
    try {
      await ceoBrainSaveFile(sel, body);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="brain">
      <div className="brain-side">
        {files.map((f) => (
          <button key={f.name} className={`brain-file${sel === f.name ? " active" : ""}`} onClick={() => openFile(f.name)}>
            {f.name}
          </button>
        ))}
        <a className="mini-btn brain-dl" href={ceoBrainDownloadUrl}>
          Download vault
        </a>
      </div>
      <div className="brain-view">
        {sel ? (
          <>
            <div className="seo-bar" style={{ marginBottom: 8 }}>
              {!editing ? (
                <button className="mini-btn" style={{ marginLeft: 0 }} onClick={() => setEditing(true)}>
                  Edit
                </button>
              ) : (
                <>
                  <button className="mini-btn" style={{ marginLeft: 0 }} onClick={save} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button className="mini-btn" style={{ marginLeft: 0 }} onClick={() => openFile(sel)} disabled={saving}>
                    Cancel
                  </button>
                </>
              )}
            </div>
            {editing ? (
              <textarea className="brain-edit" value={body} onChange={(e) => setBody(e.target.value)} />
            ) : (
              <pre className="brain-pre">{body || "(empty)"}</pre>
            )}
          </>
        ) : (
          <div className="bl-empty">The Charter is how you shape Regent's judgment. Edit it any time.</div>
        )}
      </div>
    </div>
  );
};

export const Ceo: React.FC = () => {
  const [ceo, setCeo] = useState<CeoState | null>(null);
  const [busy, setBusy] = useState("");
  const [live, setLive] = useState(readLive);
  const [syncAt, setSyncAt] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const c = await getCeo();
    if (c) setCeo(c);
    setSyncAt(Date.now());
  };
  useEffect(() => {
    load();
    if (!live) return;
    const t = window.setInterval(load, 5000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live]);
  const toggleLive = (v: boolean) => {
    setLive(v);
    try {
      localStorage.setItem("bc_live", v ? "1" : "0");
    } catch {
      // per-browser convenience only
    }
  };

  const decide = async (id: string, action: "approve" | "reject") => {
    setBusy(id);
    try {
      await agentDecide(id, action);
      load();
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">CEO</span>
        <h1>{ceo?.name || "Regent"}, by your authority.</h1>
        <p>
          Reviews every agent filing, vetoes the weak ones, brings you the rest,
          and executes the moment you say approve. Your word, its hands.
        </p>
      </div>

      <div className="pulse">
        <div className="pulse-item">
          <span className="pulse-k">State</span>
          <span className="pulse-v">
            <span className={`dot ${!ceo ? "unknown" : ceo.enabled ? "ok" : "unknown"}`} />
            {ceo ? ceo.status : "..."}
          </span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Channel</span>
          <span className="pulse-v" style={{ fontSize: 16 }}>
            <span className={`dot ${ceo?.channel === "none" ? "down" : "ok"}`} />
            {ceo?.channel === "own" ? "its own" : ceo?.channel === "shared" ? "shared with Corvid" : "not linked"}
          </span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Waiting on you</span>
          <span className="pulse-v">{ceo ? ceo.asks.length : "..."}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Executed</span>
          <span className="pulse-v">{ceo ? ceo.executed.length : "..."}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Model</span>
          <span className="pulse-v" style={{ fontSize: 14 }}>{ceo?.model || "..."}</span>
        </div>
      </div>

      <div className="seo-bar" style={{ marginTop: 14, flexWrap: "wrap", alignItems: "center", gap: 14 }}>
        <Switch
          on={ceo?.enabled !== false}
          disabled={!ceo}
          label={ceo?.enabled === false ? "Auto-run off" : "Auto-run 24/7"}
          onChange={async (v) => {
            await ceoEnabled(v);
            load();
          }}
        />
        <Switch on={live} label={live ? "Live feed" : "Live feed off"} onChange={toggleLive} />
        <button
          className="mini-btn"
          style={{ marginLeft: 0 }}
          disabled={refreshing}
          onClick={async () => {
            setRefreshing(true);
            try {
              await load();
            } finally {
              setRefreshing(false);
            }
          }}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
        <span className="sync-stamp">
          <span className={`dot ${live ? "ok" : "unknown"}`} />
          {syncAt ? `synced ${new Date(syncAt).toLocaleTimeString()}` : "..."}
        </span>
      </div>

      <div className="stat-grid" style={{ marginTop: 18 }}>
        <div className="sgroup">
          <div className="sgroup-h">Asks waiting on your word ({ceo?.asks.length || 0})</div>
          {ceo && ceo.asks.length ? (
            ceo.asks.map((p) => (
              <div className="prop pending" key={p.id}>
                <div className="prop-head">
                  <span className="prop-num">#{p.number}</span>
                  <span className="prop-sum">{p.page} · {p.summary}</span>
                </div>
                <div className="prop-body" style={{ paddingTop: 10 }}>
                  <pre className="prop-detail">{p.detail}</pre>
                  <div className="seo-actions">
                    <button className="btn" disabled={busy === p.id} onClick={() => decide(p.id, "approve")}>
                      Approve, Regent executes
                    </button>
                    <button className="mini-btn" style={{ marginLeft: 0 }} disabled={busy === p.id} onClick={() => decide(p.id, "reject")}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bl-empty">Nothing waiting. New asks land here and in Discord.</div>
          )}
        </div>

        <div className="sgroup">
          <div className="sgroup-h">Executed by Regent</div>
          {ceo && ceo.executed.length ? (
            <div className="bl">
              {ceo.executed.map((e, i) => (
                <div className="agent-task" key={i}>
                  <span className={`t-chip ${e.ok ? "t-done" : ""}`} style={e.ok ? {} : { color: "#ff7a7a" }}>
                    {e.ok ? "done" : "failed"}
                  </span>
                  <span>
                    #{e.number} {e.summary}
                    <span style={{ color: "var(--mute)", fontSize: 12 }}> · {e.result} · {ago(e.at)}</span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bl-empty">No executions yet.</div>
          )}
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: 18 }}>
        <div className="sgroup">
          <div className="sgroup-h">Live log</div>
          <div className="agent-log">
            {(ceo?.log || []).map((l, i) => (
              <div className="log-row" key={i}>
                <span className="log-t">{new Date(l.t).toLocaleTimeString()}</span>
                <span className={`log-k k-${l.kind}`}>{l.kind}</span>
                <span className="log-x">{l.text}</span>
              </div>
            ))}
            {!(ceo?.log || []).length ? <div className="bl-empty">Quiet so far.</div> : null}
          </div>
        </div>
        <div className="sgroup">
          <div className="sgroup-h">The Charter (Regent's brain)</div>
          <CeoBrain />
        </div>
      </div>
    </>
  );
};
