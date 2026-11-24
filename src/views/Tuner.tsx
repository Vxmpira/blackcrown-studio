import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  getTuning,
  closeTicket,
  saveTuning,
  getPremarket,
  runPremarketNow,
  getExpressionShelf,
  uploadExpressions,
  type TunerData,
  type DeskCard,
  type BriefRun,
  type CoachState,
  getCoach,
  runCoachNow,
  type BriefTrack,
  uploadBriefTrack,
  removeBriefTrack,
  type ExpressionShelf,
} from "../api";
import { Switch } from "../components/Switch";

// The owner's control room: every desk's scorecard next to the dials that
// steer it. Dials save to the server and apply on the next tick.

type Patch = Record<string, number | boolean | string | null>;

const money = (n: number | null | undefined) => (n == null ? "n/a" : `$${n.toFixed(2)}`);

const DESK_DIALS: Record<string, string[]> = {
  corvid: ["shares.corvid", "corvid.model", "corvid.workModel", "corvid.cycleEveryMin", "corvid.workGapMin", "corvid.dailySteps"],
  herald: ["shares.herald"],
  steward: ["shares.steward"],
  bard: ["shares.bard"],
};

const Stat: React.FC<{ k: string; v: React.ReactNode; hint?: string }> = ({ k, v, hint }) => (
  <div className="tn-stat" title={hint}>
    <span className="tn-stat-v">{v}</span>
    <span className="tn-stat-k">{k}</span>
  </div>
);

export const Tuner: React.FC = () => {
  const [data, setData] = useState<TunerData | null>(null);
  const [draft, setDraft] = useState<Patch>({});
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);
  const [coach, setCoach] = useState<CoachState | null>(null);
  const [coaching, setCoaching] = useState(false);
  const [brief, setBrief] = useState<{ running: boolean; runs: BriefRun[]; tracks?: BriefTrack[] } | null>(null);
  const [shelf, setShelf] = useState<ExpressionShelf | null>(null);
  const [stocking, setStocking] = useState<string | null>(null);

  const load = useCallback(() => {
    getTuning().then((d) => setData(d));
    getPremarket().then((b) => setBrief(b));
    getCoach().then((c) => setCoach(c));
    getExpressionShelf().then((x) => setShelf(x));
  }, []);
  useEffect(() => {
    load();
    const id = window.setInterval(load, 20000);
    return () => window.clearInterval(id);
  }, [load]);

  const val = (k: string) => (k in draft ? draft[k] : data?.values[k]?.value);
  const set = (k: string, v: number | boolean | string | null) => setDraft((d) => ({ ...d, [k]: v }));
  const dirty = Object.keys(draft).length > 0;

  const onSave = async () => {
    setState("saving");
    setMsg(null);
    try {
      const d = await saveTuning(draft);
      setData((old) => (old ? { ...old, values: d.values, stats: d.stats } : old));
      setDraft({});
      setState("saved");
      window.setTimeout(() => setState("idle"), 1600);
    } catch (e) {
      setState("error");
      setMsg(e instanceof Error ? e.message : "Could not save.");
    }
  };

  const onCloseTicket = async (id: string) => {
    try {
      const stats = await closeTicket(id);
      if (stats) setData((old) => (old ? { ...old, stats } : old));
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not close the ticket.");
    }
  };

  const onTracks = async (files: FileList | null) => {
    for (const f of Array.from(files || [])) {
      const r = await uploadBriefTrack(f);
      if (!r.ok) setMsg(`${f.name}: ${r.error || "upload failed"}`);
      else setBrief((b) => (b ? { ...b, tracks: r.tracks } : b));
    }
  };
  const onDropTrack = async (name: string) => {
    const r = await removeBriefTrack(name);
    if (r.tracks) setBrief((b) => (b ? { ...b, tracks: r.tracks } : b));
  };

  const onRunBrief = async () => {
    const r = await runPremarketNow();
    if (!r.ok) setMsg(r.error || "Could not start the brief.");
    setBrief((b) => (b ? { ...b, running: true } : b));
    window.setTimeout(load, 4000);
  };

  const onStock = async () => {
    setStocking("Uploading...");
    try {
      const r = await uploadExpressions();
      const added = [...r.emojis, ...r.stickers].filter((x) => x.endsWith(": added")).length;
      setStocking(`${added} added.`);
      getExpressionShelf().then((x) => setShelf(x));
    } catch (e) {
      setStocking(e instanceof Error ? e.message : "Upload failed.");
    }
  };

  const field = (k: string) => {
    if (!data) return null;
    const s = data.schema[k];
    if (!s) return null;
    const v = val(k);
    const over = data.values[k]?.overridden || k in draft;
    const reset = over ? (
      <button className="mini-btn" onClick={() => set(k, null)} title="Back to the .env default">
        default
      </button>
    ) : null;
    if (s.type === "bool") {
      return (
        <div className="tn-field" key={k}>
          <Switch on={Boolean(v)} label={s.label} onChange={(x) => set(k, x)} />
        </div>
      );
    }
    if (s.type === "model") {
      return (
        <div className="tn-field" key={k}>
          <span className="tn-label">{s.label}</span>
          <span className="tn-input">
            <select value={String(v ?? "")} onChange={(e) => set(k, e.target.value)}>
              {data.models.map((m) => (
                <option key={m} value={m}>
                  {m || "tier default"}
                </option>
              ))}
            </select>
            {reset}
          </span>
        </div>
      );
    }
    if (s.type === "time") {
      return (
        <div className="tn-field" key={k}>
          <span className="tn-label">{s.label}</span>
          <span className="tn-input">
            <input type="time" value={String(v ?? "05:30")} min="03:00" max="08:59" onChange={(e) => set(k, e.target.value)} />
            {reset}
          </span>
        </div>
      );
    }
    return (
      <div className="tn-field" key={k}>
        <span className="tn-label">{s.label}</span>
        <span className="tn-input">
          <input
            type="number"
            value={v === null || v === undefined ? "" : Number(v)}
            min={s.min}
            max={s.max}
            step={s.step}
            onChange={(e) => set(k, e.target.value === "" ? null : Number(e.target.value))}
          />
          <span className="tn-unit">{s.unit}</span>
          {reset}
        </span>
      </div>
    );
  };

  const desks = useMemo(() => (data ? Object.entries(data.stats.desks) : []), [data]);

  if (!data) return <div className="soon-panel">Loading the tuner...</div>;
  const b = data.stats.budget;
  const tickets = data.stats.tickets || [];

  const card = (key: string, d: DeskCard) => (
    <div className="tn-card" key={key}>
      <div className="tn-card-h">
        <span className="tn-name">{d.name}</span>
        <span className={`tn-pill ${d.enabled === false ? "off" : ""}`}>{d.enabled === false ? "paused" : d.status || "on"}</span>
      </div>
      <div className="tn-stats">
        <Stat k="today" v={money(d.today.usd)} hint={`${d.today.calls} calls, ${d.today.cachePct}% from cache`} />
        <Stat k="7 days" v={money(d.week.usd)} hint={`${d.week.calls} calls, ${d.week.cachePct}% from cache`} />
        <Stat k="cache" v={`${d.week.cachePct}%`} hint="share of input read from cache this week; higher is cheaper" />
        {d.steps !== null ? <Stat k="steps today" v={d.steps} /> : null}
        {d.steps !== null ? <Stat k="open tasks" v={d.openTasks} /> : null}
        {d.steps !== null ? <Stat k="done today" v={d.doneToday} /> : null}
        {d.asks ? <Stat k="asks 7d" v={`${d.asks.approved}/${d.asks.filed}`} hint={`${d.asks.approved} approved, ${d.asks.rejected} rejected, ${d.asks.pending} pending`} /> : null}
        {d.asks ? <Stat k="approved" v={d.asks.approvalPct === null ? "n/a" : `${d.asks.approvalPct}%`} /> : null}
        {d.asks ? <Stat k="$ per yes" v={money(d.costPerApproved)} hint="7 day spend divided by approved asks" /> : null}
      </div>
      {DESK_DIALS[key] ? <div className="tn-fields">{DESK_DIALS[key].map(field)}</div> : null}
    </div>
  );

  return (
    <div className="tuner">
      <div className="tn-top">
        <div>
          <div className="sgroup-h">Agent tuner</div>
          <p className="shint">
            Every desk's cost against what it ships, and the dials that steer it. Saved values beat the .env and apply on the next tick, no restart.
          </p>
        </div>
        <div className="tn-actions">
          {state === "error" && msg ? <span className="gen-error">{msg}</span> : null}
          <button className="btn" onClick={onSave} disabled={!dirty || state === "saving"}>
            {state === "saving" ? "Saving..." : state === "saved" ? "Saved" : dirty ? `Save ${Object.keys(draft).length} change${Object.keys(draft).length > 1 ? "s" : ""}` : "No changes"}
          </button>
          {dirty ? (
            <button className="mini" onClick={() => setDraft({})}>
              Discard
            </button>
          ) : null}
        </div>
      </div>

      <div className="tn-budget">
        <div className="tn-meter">
          <div className="tn-meter-fill" style={{ width: `${b.cap ? Math.min(100, (b.spent / b.cap) * 100) : 0}%` }} />
        </div>
        <span className="mono">
          {money(b.spent)} of {money(b.cap)} today · {b.level === "ok" ? "inside budget" : b.level === "tight" ? "tight, background work slowed" : b.level === "out" ? "spent, background work paused" : "no cap"}
          {data.stats.gaps ? ` · ${data.stats.gaps} tool gap${data.stats.gaps > 1 ? "s" : ""} open` : ""}
        </span>
        <div className="tn-fields tn-inline">
          {field("budget.dailyUsd")}
          {field("budget.nightThrottle")}
          {field("budget.cacheKeeper")}
        </div>
      </div>

      <div className="tn-grid">{desks.map(([k, d]) => card(k, d))}</div>

      <div className="settings tn-lower">
        {tickets.length ? (
          <div className="sgroup">
            <div className="sgroup-h">Owner tickets: what the desks found and cannot fix</div>
            {tickets.map((t) => (
              <div className="srow tn-ticket" key={t.id}>
                <span className="sk">
                  {t.what}
                  {t.evidence ? <em> {t.evidence}</em> : null}
                  <small> raised by {t.desks.join(", ")}{t.count > 1 ? `, seen ${t.count} times` : ""}</small>
                </span>
                <span className="sv">
                  <button className="btn" onClick={() => onCloseTicket(t.id)}>Fixed, close it</button>
                </span>
              </div>
            ))}
          </div>
        ) : null}
        <div className="sgroup">
          <div className="sgroup-h">Herald, Steward and Bard</div>
          {["staff.model", "staff.cycleEveryH", "staff.workGapMin", "staff.dailySteps"].map(field)}
        </div>
        <div className="sgroup">
          <div className="sgroup-h">Crew rules</div>
          {["crew.queueCap", "crew.staleHours", "crew.wakeGapMin"].map(field)}
          {field("videos.tiktokDrop")}
        </div>
        <div className="sgroup">
          <div className="sgroup-h">The Coach</div>
          {["coach.enabled", "coach.time", "coach.post"].map(field)}
          <div className="brief-actions">
            <button
              className="btn"
              disabled={coaching}
              onClick={async () => {
                setCoaching(true);
                const r = await runCoachNow();
                if (!r.ok) setMsg(r.msg || "the coach could not run");
                setCoach(await getCoach());
                setCoaching(false);
              }}
            >
              {coaching ? "Reviewing the desks..." : "Run the review now"}
            </button>
          </div>
          {coach?.today ? (
            <>
              <div className="srow">
                <span className="sk">Bottleneck, {coach.today.day}</span>
                <span className="sv">{coach.today.bottleneck}</span>
              </div>
              {Object.entries(coach.today.desks).map(([k, d]) => (
                <div className="srow" key={k}>
                  <span className="sk">
                    {k} · {d.grade || "?"}
                    {d.followed ? ` · followed: ${d.followed}` : ""}
                  </span>
                  <span className="sv">
                    {d.do.map((x) => `Do: ${x}`).concat(d.stop.map((x) => `Stop: ${x}`)).join(" ") || "on course, no notes"}
                  </span>
                </div>
              ))}
              {coach.today.owner.length ? (
                <div className="srow">
                  <span className="sk">Only you can</span>
                  <span className="sv">{coach.today.owner.join(" ")}</span>
                </div>
              ) : null}
            </>
          ) : (
            <div className="srow">
              <span className="sk">Notes</span>
              <span className="sv">none yet; the first review runs at the set time</span>
            </div>
          )}
        </div>
        <div className="sgroup">
          <div className="sgroup-h">Pre-market Brief</div>
          {["brief.enabled", "brief.time", "brief.sound", "brief.musicLevel", "brief.tiktokDrop", "brief.fileX", "brief.fileYouTube", "brief.communityPost"].map(field)}
          <div className="brief-actions">
            <button className="btn" onClick={onRunBrief} disabled={Boolean(brief?.running)}>
              {brief?.running ? "Rendering..." : "Make today's brief now"}
            </button>
          </div>
          <div className="srow">
            <span className="sk">Music library</span>
            <span className="sv">
              {(brief?.tracks || []).length
                ? `${(brief?.tracks || []).length} tracks, one per day in rotation`
                : "empty, so the built-in score plays"}
            </span>
          </div>
          {(brief?.tracks || []).map((t) => (
            <div className="srow" key={t.name}>
              <span className="sk">{t.credit || t.name}</span>
              <span className="sv">
                {t.license && t.source ? (
                  <a href={t.source} target="_blank" rel="noreferrer">{t.license}, stocked by {t.by}</a>
                ) : (
                  "your upload"
                )}{" "}
                {t.mb} MB{" "}
                <button className="btn" onClick={() => onDropTrack(t.name)}>Remove</button>
              </span>
            </div>
          ))}
          <div className="brief-actions">
            <label className="btn">
              Add tracks you have the rights to use
              <input type="file" accept="audio/*" multiple style={{ display: "none" }} onChange={(e) => { onTracks(e.target.files); e.target.value = ""; }} />
            </label>
          </div>
          {(brief?.runs || []).slice(0, 4).map((r) => (
            <div className="srow" key={r.at}>
              <span className="sk">
                {new Date(r.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
              <span className={`sv${r.ok ? " good" : " bad"}`}>
                {r.ok && r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.seconds}s video{r.music ? `, ${r.music}` : ""}{r.asks?.length ? `, asks #${r.asks.join(", #")}` : ""}
                  </a>
                ) : (
                  (r.error || "failed").slice(0, 80)
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="sgroup">
          <div className="sgroup-h">Eclipse-X emojis and stickers</div>
          {shelf && !shelf.error ? (
            <>
              <div className="srow">
                <span className="sk">Boost tier</span>
                <span className="sv">{shelf.tier}{shelf.boosts !== null ? ` (${shelf.boosts} boosts)` : ""}</span>
              </div>
              <div className="srow">
                <span className="sk">Static emojis</span>
                <span className="sv">{shelf.staticUsed} of {shelf.emojiLimit}</span>
              </div>
              <div className="srow">
                <span className="sk">Animated emojis</span>
                <span className="sv">{shelf.animatedUsed} of {shelf.emojiLimit}</span>
              </div>
              <div className="srow">
                <span className="sk">Stickers</span>
                <span className="sv">{shelf.stickersUsed} of {shelf.stickerLimit}</span>
              </div>
              <div className="srow">
                <span className="sk">In the pack, not on the server yet</span>
                <span className="sv">{shelf.waiting.emojis} emojis, {shelf.waiting.stickers} stickers</span>
              </div>
              {shelf.import && (shelf.import.left || shelf.import.added || shelf.import.skipped || shelf.import.failed) ? (
                <div className="srow">
                  <span className="sk">emoji.gg import</span>
                  <span className="sv">
                    {shelf.import.left
                      ? `${shelf.import.left} to go (${shelf.import.leftEmojis} emojis, ${shelf.import.leftStickers} stickers)`
                      : "done"}
                    {` · ${shelf.import.added} added`}
                    {shelf.import.skipped ? ` · ${shelf.import.skipped} skipped` : ""}
                    {shelf.import.failed ? ` · ${shelf.import.failed} failed` : ""}
                    {shelf.import.waitingUntil
                      ? ` · Discord rate limit, next upload ${new Date(shelf.import.waitingUntil).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                      : ""}
                  </span>
                </div>
              ) : null}
              <div className="brief-actions">
                <button className="btn" onClick={onStock} disabled={!shelf.waiting.emojis && !shelf.waiting.stickers}>
                  Stock the shelves
                </button>
                {stocking ? <span className="shint">{stocking}</span> : null}
              </div>
            </>
          ) : (
            <p className="shint">{shelf?.error || "Reading the server's shelves..."}</p>
          )}
        </div>
      </div>
    </div>
  );
};
