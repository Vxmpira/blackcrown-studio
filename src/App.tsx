import React, { useEffect, useState } from "react";
import { Sidebar, type TabId } from "./components/Sidebar";
import { AdStudio } from "./views/AdStudio";
import { Content } from "./views/Content";
import { Stats } from "./views/Stats";
import { Settings } from "./views/Settings";
import { Dashboard } from "./views/Dashboard";
import { Login } from "./views/Login";
import { getMe, logout, type Me } from "./api";

export const App: React.FC = () => {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [me, setMe] = useState<Me | null>(null);
  const [checked, setChecked] = useState(false);

  const refresh = () =>
    getMe().then((m) => {
      setMe(m);
      setChecked(true);
    });

  useEffect(() => {
    refresh();
  }, []);

  if (!checked) {
    return <div className="boot">BlackCrown Admin...</div>;
  }

  if (!me?.authed) {
    return <Login me={me} onSuccess={refresh} />;
  }

  const signOut = async () => {
    await logout();
    refresh();
  };

  return (
    <div className="layout">
      <Sidebar active={tab} onChange={setTab} onLogout={signOut} />
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
