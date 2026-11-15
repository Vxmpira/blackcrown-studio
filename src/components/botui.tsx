import React from "react";

/* Shared pieces for the Paper Bot tab: number formatting and the few small
   visuals (tile, curve, spark, stop-to-target track, segmented control) that
   both books use, so stocks and futures read the same way. */

export const usd = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined
    ? "n/a"
    : `${v < 0 ? "-" : v > 0 ? "+" : ""}$${Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
export const pct = (v: number | null | undefined, signed = true, digits = 2) =>
  v === null || v === undefined ? "n/a" : `${signed && v > 0 ? "+" : ""}${v.toFixed(digits)}%`;
export const num = (v: number | null | undefined, digits = 2) => (v === null || v === undefined ? "n/a" : v.toFixed(digits));
export const rmult = (v: number | null | undefined) => (v === null || v === undefined ? "n/a" : `${v > 0 ? "+" : ""}${v.toFixed(2)}R`);
export const tone = (v: number | null | undefined) => (v === null || v === undefined || v === 0 ? "" : v > 0 ? "pos" : "neg");
export const n0 = (v: any) => (typeof v === "number" ? v.toLocaleString("en-US") : "0");
export const mins = (m: number | null | undefined) => {
  if (m === null || m === undefined) return "n/a";
  const r = Math.round(m);
  return r < 60 ? `${r}m` : `${Math.floor(r / 60)}h ${String(r % 60).padStart(2, "0")}m`;
};
export const ageS = (iso?: string | null, now = Date.now()) => (iso ? Math.max(0, (now - new Date(iso).getTime()) / 1000) : Infinity);
export const ago = (iso?: string | null, now = Date.now()) => {
  const s = ageS(iso, now);
  if (!isFinite(s)) return "never";
  if (s < 60) return `${Math.round(s)}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};
export const et = (iso?: string | null, withDate = true) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      ...(withDate ? { month: "short", day: "numeric" } : {}),
      hour: "numeric",
      minute: "2-digit",
      ...(withDate ? {} : { second: "2-digit" }),
    });
  } catch {
    return iso;
  }
};
export const winRate = (b?: { trades: number; wins: number } | null) => (b && b.trades ? `${Math.round((b.wins / b.trades) * 100)}%` : "n/a");

export const Tile: React.FC<{ label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: string; title?: string }> = ({ label, value, sub, tone: t, title }) => (
  <div className="bk-tile" title={title}>
    <span>{label}</span>
    <b className={t || ""}>{value}</b>
    {sub ? <em>{sub}</em> : null}
  </div>
);

export const Seg: React.FC<{ value: string; onChange: (v: string) => void; options: { id: string; label: string; note?: string }[]; small?: boolean }> = ({ value, onChange, options, small }) => (
  <div className={`bk-seg${small ? " small" : ""}`} role="tablist">
    {options.map((o) => (
      <button key={o.id} role="tab" aria-selected={value === o.id} className={value === o.id ? "on" : ""} onClick={() => onChange(o.id)}>
        {o.label}
        {o.note ? <i>{o.note}</i> : null}
      </button>
    ))}
  </div>
);

export const Empty: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="bk-empty">{children}</div>;

/* cumulative P&L after each closed trade */
export const Curve: React.FC<{ pts: { t: string; v: number }[]; height?: number; empty?: string }> = ({ pts, height = 170, empty }) => {
  if (pts.length < 2) return <Empty>{empty || "The curve draws itself after the first two closed trades."}</Empty>;
  const W = 800, H = height, PX = 8, PY = 14;
  const vals = [0, ...pts.map((p) => p.v)];
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || 1;
  const x = (i: number) => PX + (i / (vals.length - 1)) * (W - 2 * PX);
  const y = (v: number) => H - PY - ((v - lo) / span) * (H - 2 * PY);
  const line = vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const last = vals[vals.length - 1];
  const c = last >= 0 ? "#35e08f" : "#ff5c7a";
  const id = `bkc${Math.round(H)}${last >= 0 ? "p" : "n"}`;
  return (
    <div className="bk-curve">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={c} stopOpacity="0.28" />
            <stop offset="1" stopColor={c} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={PX} x2={W - PX} y1={y(0)} y2={y(0)} className="bk-curve-zero" />
        <path d={`${line} L${x(vals.length - 1)},${H - PY} L${x(0)},${H - PY} Z`} fill={`url(#${id})`} />
        <path d={line} className="bk-curve-line" style={{ stroke: c }} />
      </svg>
      <div className="bk-curve-axis">
        <span>high {usd(hi, 0)}</span>
        <span>{pts.length} trades, {et(pts[0].t)} to {et(pts[pts.length - 1].t)}</span>
        <span>low {usd(lo, 0)}</span>
      </div>
    </div>
  );
};

export const Spark: React.FC<{ pts: number[] }> = ({ pts }) => {
  if (pts.length < 2) return <div className="bk-spark empty" />;
  const W = 200, H = 44, P = 3;
  const vals = [0, ...pts];
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const span = hi - lo || 1;
  const d = vals.map((v, i) => `${i ? "L" : "M"}${(P + (i / (vals.length - 1)) * (W - 2 * P)).toFixed(1)},${(H - P - ((v - lo) / span) * (H - 2 * P)).toFixed(1)}`).join(" ");
  return (
    <svg className="bk-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <path d={d} style={{ stroke: vals[vals.length - 1] >= 0 ? "#35e08f" : "#ff5c7a" }} />
    </svg>
  );
};

/* where a position stands between its stop and its target */
export const Track: React.FC<{ side: string; entry: number; stop: number; target: number; price?: number | null; digits?: number }> = ({ side, entry, stop, target, price, digits = 2 }) => {
  const lo = Math.min(stop, target), hi = Math.max(stop, target);
  const pos = (v: number) => `${Math.max(0, Math.min(100, ((v - lo) / (hi - lo || 1)) * 100))}%`;
  const long = side !== "short";
  const good = price != null && (long ? price >= entry : price <= entry);
  return (
    <div className={`bk-track ${long ? "long" : "short"}`}>
      <div className="bk-track-bar">
        <i className="bk-track-risk" style={long ? { left: 0, width: pos(entry) } : { left: pos(entry), right: 0 }} />
        <i className="bk-track-entry" style={{ left: pos(entry) }} />
        {price != null ? <i className={`bk-track-px ${good ? "pos" : "neg"}`} style={{ left: pos(price) }} /> : null}
      </div>
      <div className="bk-track-ends">
        <span>{long ? "stop" : "target"} {lo.toFixed(digits)}</span>
        <span>entry {entry.toFixed(digits)}{price != null ? `, now ${price.toFixed(digits)}` : ""}</span>
        <span>{long ? "target" : "stop"} {hi.toFixed(digits)}</span>
      </div>
    </div>
  );
};
