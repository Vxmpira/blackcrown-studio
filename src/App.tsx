import React, { useState } from "react";
import { Sidebar, type TabId } from "./components/Sidebar";
import { AdStudio } from "./views/AdStudio";
import { Dashboard, SoonPanel } from "./views/Dashboard";

export const App: React.FC = () => {
  const [tab, setTab] = useState<TabId>("ad-studio");

  return (
    <div className="layout">
      <Sidebar active={tab} onChange={setTab} />
      <main className="main">
        {tab === "dashboard" ? <Dashboard /> : null}
        {tab === "ad-studio" ? <AdStudio /> : null}
        {tab === "content" ? <SoonPanel label="Content" /> : null}
        {tab === "settings" ? <SoonPanel label="Settings" /> : null}
      </main>
    </div>
  );
};
