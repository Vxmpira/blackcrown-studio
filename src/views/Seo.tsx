import React, { useEffect, useMemo, useState } from "react";
import {
  agentAddTask,
  agentRetry,
  brainSaveFile,
  agentCycle,
  agentDecide,
  agentEnabled,
  agentTest,
  brainDownloadUrl,
  getAgent,
  getBrainFile,
  getBrainList,
  getSeo,
  runSeoAudit,
  runSeoReview,
  type AgentProposal,
  type AgentState,
  type BrainFileMeta,
  type SeoData,
  type SeoPage,
} from "../api";

const ago = (t: number | null | undefined) => {
  if (!t) return "never";
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

const scoreClass = (n: number) => (n >= 85 ? "good" : n >= 60 ? "mid" : "bad");

// ---------- proposals -------------------------------------------------------
const ProposalCard: React.FC<{
  p: AgentProposal;
  onDecide: (id: string, action: "approve" | "reject") => Promise<void>;
}> = ({ p, onDecide }) => {
  const [open, setOpen] = useState(p.status === "pending");
  const [busy, setBusy] = useState(false);
  const act = async (action: "approve" | "reject") => {
    setBusy(true);
    try {
      await onDecide(p.id, action);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={`prop ${p.status}`}>
      <div className="prop-head" onClick={() => setOpen(!open)}>
        <span className="prop-num">#{p.number}</span>
        <span className="prop-sum">{p.summary}</span>
        <span className={`prop-status s-${p.status}`}>{p.status}</span>
      </div>
      {open ? (
        <div className="prop-body">
          <div className="prop-meta">
            {p.page} · {p.kind} · {ago(p.createdAt)}
            {p.note ? ` · note: ${p.note}` : ""}
          </div>
          <pre className="prop-detail">{p.detail}</pre>
          {p.kind === "creative" ? (
            <div className="prop-meta" style={{ color: "#f2c94c" }}>
              Green light renders {p.slides?.length || 0} slides via Bloom (spends credits) and posts the package to Discord.
            </div>
          ) : null}
          {p.status === "pending" ? (
            <div className="seo-actions">
              <button className="btn" disabled={busy} onClick={() => act("approve")}>
                Approve
              </button>
              <button className="mini-btn" style={{ marginLeft: 0 }} disabled={busy} onClick={() => act("reject")}>
                Reject
              </button>
            </div>
          ) : null}
          {p.status === "approved" && p.kind === "creative" ? (
            <div className="seo-actions">
              <button
                className="mini-btn"
                style={{ marginLeft: 0 }}
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await agentRetry(p.id);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Re-render via Bloom
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

// ---------- brain -----------------------------------------------------------
const Brain: React.FC = () => {
  const [files, setFiles] = useState<BrainFileMeta[]>([]);
  const [sel, setSel] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBrainList().then(setFiles);
  }, []);
  const openFile = async (name: string) => {
    setSel(name);
    setEditing(false);
    setBody(await getBrainFile(name));
  };
  const save = async () => {
    setSaving(true);
    try {
      await brainSaveFile(sel, body);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="brain">
      <div className="brain-side">
        {files.map((f) => (
          <button
            key={f.name}
            className={`brain-file${sel === f.name ? " active" : ""}`}
            onClick={() => openFile(f.name)}
          >
            {f.name}
          </button>
        ))}
        <a className="mini-btn brain-dl" href={brainDownloadUrl}>
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
          <div className="bl-empty">
            The brain is an Obsidian vault of markdown. Pick a file, or download
            the vault and open the folder in Obsidian.
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- audit (the agent's dataset) ------------------------------------
const AuditPageCard: React.FC<{
  page: SeoPage;
  review?: { at: number; text: string };
  onReview: (file: string) => Promise<void>;
}> = ({ page, review, onReview }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ask = async () => {
    setBusy(true);
    try {
      await onReview(page.file);
      setOpen(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="seo-card">
      <div className="seo-head" onClick={() => setOpen(!open)}>
        <span className={`seo-score ${scoreClass(page.score)}`}>{page.score}</span>
        <div className="seo-id">
          <div className="seo-file">{page.file}</div>
          <div className="seo-title">{page.title || "No title tag"}</div>
        </div>
        <span className="seo-issue-count">
          {page.issues.length ? `${page.issues.length} issue${page.issues.length === 1 ? "" : "s"}` : "clean"}
        </span>
        <span className="seo-caret">{open ? "v" : ">"}</span>
      </div>
      {open ? (
        <div className="seo-body">
          {page.issues.length ? (
            <ul className="seo-issues">
              {page.issues.map((i, n) => (
                <li key={n} className={`sev-${i.sev}`}>
                  <span className="sev-tag">{i.sev}</span>
                  {i.msg}
                </li>
              ))}
            </ul>
          ) : (
            <div className="bl-empty">No mechanical issues found.</div>
          )}
          <div className="seo-actions">
            <button className="btn" onClick={ask} disabled={busy}>
              {busy ? "Thinking..." : review ? "Re-run page review" : "Run page review"}
            </button>
          </div>
          {review ? <pre className="seo-review">{review.text}</pre> : null}
        </div>
      ) : null}
    </div>
  );
};

// ---------- the HQ ----------------------------------------------------------
export const Seo: React.FC = () => {
  const [agent, setAgent] = useState<AgentState | null>(null);
  const [seo, setSeo] = useState<SeoData | null>(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [newTask, setNewTask] = useState("");
  const [showAudit, setShowAudit] = useState(false);

  const load = () => {
    getAgent().then(setAgent);
    getSeo().then(setSeo);
  };
  useEffect(() => {
    load();
    const t = window.setInterval(() => getAgent().then((a) => a && setAgent(a)), 30000);
    return () => window.clearInterval(t);
  }, []);

  const run = async (name: string, fn: () => Promise<unknown>) => {
    setErr("");
    setBusy(name);
    try {
      await fn();
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something failed.");
    } finally {
      setBusy("");
    }
  };

  const decide = async (id: string, action: "approve" | "reject") => {
    await agentDecide(id, action);
    load();
  };
  const review = async (file: string) => {
    await runSeoReview(file);
    const d = await getSeo();
    setSeo(d);
  };

  const pending = useMemo(
    () => (agent?.proposals || []).filter((p) => p.status === "pending"),
    [agent]
  );
  const decided = useMemo(
    () => (agent?.proposals || []).filter((p) => p.status !== "pending").slice(0, 8),
    [agent]
  );

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">SEO Agent</span>
        <h1>{agent?.name || "Corvid"}, on the clock.</h1>
        <p>
          Your autonomous SEO operator. It studies the numbers daily, keeps its
          own brain, reports to your Discord channel, and waits on your word.
        </p>
      </div>

      <div className="pulse">
        <div className="pulse-item">
          <span className="pulse-k">State</span>
          <span className="pulse-v">
            <span
              className={`dot ${
                !agent ? "unknown" : agent.status === "error" ? "down" : agent.enabled ? "ok" : "unknown"
              }`}
            />
            {agent ? agent.status : "..."}
          </span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Last cycle</span>
          <span className="pulse-v" style={{ fontSize: 16 }}>{ago(agent?.lastCycleAt)}</span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Cadence</span>
          <span className="pulse-v" style={{ fontSize: 16 }}>
            {agent
              ? agent.cycleEveryH
                ? `every ${agent.cycleEveryH}h`
                : `daily ${agent.cycleHourEt}:00 ET`
              : "..."}
          </span>
        </div>
        <div className="pulse-item">
          <span className="pulse-k">Discord</span>
          <span className="pulse-v" style={{ fontSize: 16 }}>
            <span className={`dot ${agent?.discordMode === "none" ? "down" : "ok"}`} />
            {agent?.discordMode === "bot"
              ? "two-way"
              : agent?.discordMode === "webhook"
              ? "send only"
              : "not linked"}
          </span>
        </div>
      </div>

      <div className="seo-bar" style={{ marginTop: 14, flexWrap: "wrap" }}>
        <button className="btn" onClick={() => run("cycle", agentCycle)} disabled={Boolean(busy)}>
          {busy === "cycle" ? "Thinking..." : "Run cycle now"}
        </button>
        <button
          className="mini-btn"
          style={{ marginLeft: 0 }}
          onClick={() => run("pause", () => agentEnabled(!(agent?.enabled ?? true)))}
          disabled={Boolean(busy)}
        >
          {agent?.enabled === false ? "Resume agent" : "Pause agent"}
        </button>
        <button
          className="mini-btn"
          style={{ marginLeft: 0 }}
          onClick={() => run("test", agentTest)}
          disabled={Boolean(busy)}
        >
          {busy === "test" ? "Sending..." : "Test Discord"}
        </button>
        <button className="mini-btn" style={{ marginLeft: 0 }} onClick={load}>
          Refresh
        </button>
      </div>
      {err ? <div className="status err">{err}</div> : null}

      <div className="sgroup" style={{ marginTop: 18 }}>
        <div className="sgroup-h">Thinking</div>
        <div className="agent-focus">{agent?.currentFocus || "..."}</div>
        {agent?.lastThought ? <p className="agent-thought">{agent.lastThought}</p> : null}
      </div>

      <div className="stat-grid" style={{ marginTop: 18 }}>
        <div className="sgroup">
          <div className="sgroup-h">Proposals waiting on you ({pending.length})</div>
          {pending.length ? (
            pending.map((p) => <ProposalCard key={p.id} p={p} onDecide={decide} />)
          ) : (
            <div className="bl-empty">
              Nothing pending. New proposals land here and in Discord after each cycle.
            </div>
          )}
          {decided.length ? (
            <>
              <div className="sgroup-h" style={{ fontSize: 12, marginTop: 14 }}>Decided</div>
              {decided.map((p) => (
                <ProposalCard key={p.id} p={p} onDecide={decide} />
              ))}
            </>
          ) : null}
        </div>

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
            <div className="bl-empty">No tasks yet.</div>
          )}
          <form
            className="gen-custom"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newTask.trim()) return;
              await agentAddTask(newTask.trim());
              setNewTask("");
              load();
            }}
          >
            <input
              placeholder="Hand the agent a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button className="btn gen-go" type="submit" disabled={!newTask.trim()}>
              Add
            </button>
          </form>
        </div>
      </div>

      <div className="stat-grid" style={{ marginTop: 18 }}>
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
            {!(agent?.log || []).length ? (
              <div className="bl-empty">Quiet so far.</div>
            ) : null}
          </div>
        </div>

        <div className="sgroup">
          <div className="sgroup-h">The brain (Obsidian vault)</div>
          <Brain />
        </div>
      </div>

      <div className="sgroup" style={{ marginTop: 18 }}>
        <div className="sgroup-h">
          Site audit, the agent's dataset
          <button className="mini-btn" onClick={() => setShowAudit(!showAudit)}>
            {showAudit ? "Hide" : "Show"}
          </button>
          <button
            className="mini-btn"
            onClick={() => run("audit", async () => setSeo(await runSeoAudit()))}
            disabled={Boolean(busy)}
          >
            {busy === "audit" ? "Auditing..." : "Re-run audit"}
          </button>
        </div>
        {showAudit ? (
          seo && seo.pages.length ? (
            <div className="seo-list">
              {[...seo.pages]
                .sort((a, b) => a.score - b.score)
                .map((p) => (
                  <AuditPageCard key={p.file} page={p} review={seo.reviews[p.file]} onReview={review} />
                ))}
            </div>
          ) : (
            <div className="bl-empty">No audit stored yet. The agent runs one every cycle.</div>
          )
        ) : (
          <div className="bl-empty">
            {seo?.auditedAt
              ? `Last audited ${ago(seo.auditedAt)} · ${seo.pages.length} pages`
              : "No audit yet, the agent runs one every cycle."}
          </div>
        )}
      </div>
    </>
  );
};
