import React from "react";

const CrownMark: React.FC = () => (
  <svg
    width="26"
    height="22"
    viewBox="0 0 36 30"
    fill="none"
    stroke="#FF2D95"
    strokeWidth={1.8}
    strokeLinejoin="round"
    strokeLinecap="round"
    style={{ filter: "drop-shadow(0 0 6px rgba(255,45,149,.7))" }}
  >
    <path d="M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z" />
    <line x1="7" y1="28" x2="29" y2="28" />
  </svg>
);

export type TabId = "dashboard" | "seo" | "ceo" | "sales" | "projects" | "studio" | "command" | "stats" | "settings";

const TABS: { id: TabId; label: string; soon?: boolean }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "seo", label: "SEO Agent" },
  { id: "ceo", label: "CEO" },
  { id: "sales", label: "Sales" },
  { id: "projects", label: "Projects" },
  { id: "studio", label: "Studio" },
  { id: "command", label: "Command" },
  { id: "stats", label: "Statistics" },
  { id: "settings", label: "Settings" },
];

export const Sidebar: React.FC<{
  active: TabId;
  onChange: (t: TabId) => void;
  onLogout?: () => void;
}> = ({ active, onChange, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <CrownMark />
        <span className="name">BlackCrown</span>
      </div>
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`nav-item${active === t.id ? " active" : ""}`}
          onClick={() => !t.soon && onChange(t.id)}
          disabled={t.soon}
        >
          {t.label}
          {t.soon ? <span className="soon">Soon</span> : null}
        </button>
      ))}
      <div className="sidebar-foot">
        BlackCrownVxJ LLC
        {onLogout ? (
          <button className="logout" onClick={onLogout}>
            Sign out
          </button>
        ) : null}
      </div>
    </aside>
  );
};
