import React, { useEffect, useState } from "react";
import { Sidebar, type TabId } from "./components/Sidebar";
import { Seo } from "./views/Seo";
import { Ceo } from "./views/Ceo";
import { Command } from "./views/Command";
import { Stats } from "./views/Stats";
import { Settings } from "./views/Settings";
import { Dashboard } from "./views/Dashboard";
import { Staff } from "./views/Staff";
import { Login } from "./views/Login";
import { getMe, logout, type Me } from "./api";
import { Metropolis } from "./components/Metropolis";

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
    return (
      <>
        <Metropolis />
        <Login me={me} onSuccess={refresh} />
      </>
    );
  }

  const signOut = async () => {
    await logout();
    refresh();
  };

  return (
    <>
      <Metropolis />
      <div className="layout">
      <Sidebar active={tab} onChange={setTab} onLogout={signOut} />
      <main className="main">
        {tab === "dashboard" ? <Dashboard /> : null}
        {tab === "seo" ? <Seo /> : null}
        {tab === "ceo" ? <Ceo /> : null}
        {tab === "sales" ? (
          <Staff
            k="herald"
            eyebrow="Sales"
            blurb="Your advertising and sales rep. Reads the funnel, builds campaigns, files every move through Regent for your word."
          />
        ) : null}
        {tab === "projects" ? (
          <Staff
            k="steward"
            eyebrow="Projects"
            blurb="Your project manager. Runs the board, hands work to the other agents, and grows Eclipse-X with its own minion crew."
          />
        ) : null}
        {tab === "studio" ? (
          <Staff
            k="bard"
            eyebrow="Studio"
            blurb="Your video studio chief. Directs every clip, bakes exact brand text on with the forge, and pulls captions and angles from the other desks."
          />
        ) : null}
        {tab === "command" ? <Command /> : null}
        {tab === "stats" ? <Stats /> : null}
        {tab === "settings" ? <Settings /> : null}
      </main>
      </div>
    </>
  );
};
