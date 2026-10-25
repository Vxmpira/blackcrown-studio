import React, { useState } from "react";
import { login, type Me } from "../api";

const CrownBig: React.FC = () => (
  <svg
    width="52"
    height="44"
    viewBox="0 0 36 30"
    fill="none"
    stroke="#FF2D95"
    strokeWidth={1.8}
    strokeLinejoin="round"
    strokeLinecap="round"
    style={{ filter: "drop-shadow(0 0 10px rgba(255,45,149,.75))" }}
  >
    <path d="M4 24 L4 9 L12 16 L18 5 L24 16 L32 9 L32 24 Z" />
    <line x1="7" y1="28" x2="29" y2="28" />
  </svg>
);

export const Login: React.FC<{ me: Me | null; onSuccess: () => void }> = ({
  me,
  onSuccess,
}) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const setup = Boolean(me?.setup);
  const offline = me === null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setErr("");
    setBusy(true);
    try {
      await login(user.trim(), pass);
      onSuccess();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-aura" />
      <form className="login-card" onSubmit={submit}>
        <div className="login-crown">
          <CrownBig />
        </div>
        <div className="login-title">BlackCrown</div>
        <div className="login-sub">Admin access</div>

        {offline ? (
          <div className="login-note err">
            Could not reach the service. Make sure blackcrown-render is running
            on the server.
          </div>
        ) : setup ? (
          <div className="login-note">
            First-time setup: add <span className="mono">ADMIN_USER</span> and{" "}
            <span className="mono">ADMIN_PASSWORD</span> to the{" "}
            <span className="mono">.env</span> file on the server, restart the
            service, then sign in here.
          </div>
        ) : null}

        <label className="login-label" htmlFor="bc-user">
          Name
        </label>
        <input
          id="bc-user"
          className="login-input"
          autoComplete="username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          disabled={busy}
        />
        <label className="login-label" htmlFor="bc-pass">
          Password
        </label>
        <input
          id="bc-pass"
          className="login-input"
          type="password"
          autoComplete="current-password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          disabled={busy}
        />

        {err ? <div className="login-note err">{err}</div> : null}

        <button className="btn login-btn" type="submit" disabled={busy || !user || !pass}>
          {busy ? "Checking..." : "Enter the crown"}
        </button>

        <div className="login-foot">BlackCrownVxJ LLC · private system</div>
      </form>
    </div>
  );
};
