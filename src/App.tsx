import React, { useState } from "react";
import { Sidebar, type TabId } from "./components/Sidebar";
import { AdStudio } from "./views/AdStudio";
import { Content } from "./views/Content";
import { Stats } from "./views/Stats";
import { Settings } from "./views/Settings";
import { Dashboard } from "./views/Dashboard";

export const App: React.FC = () => {
  const [tab, setTab] = useState<TabId>("ad-studio");

  return (
    <div className="layout">
      <Sidebar active={tab} onChange={setTab} />
      <main className="main">
        {tab === "dashboard" ? <Dashboard /> : null}
        {tab === "ad-studio" ? <AdStudio /> : null}
        {tab === "content" ? <Content /> : null}
        {tab === "stats" ? <Stats /> : null}
        {tab === "settings" ? <Settings /> : null}
      </main>
    </div>
  );
};
