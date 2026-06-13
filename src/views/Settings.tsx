import React, { useEffect, useState } from "react";
import {
  getConfig,
  getBrief,
  saveBrief,
  resetBrief,
  type StudioConfig,
} from "../api";

const Row: React.FC<{ k: string; ok?: boolean; value: React.ReactNode }> = ({
  k,
  ok,
  value,
}) => (
  <div className="srow">
    <span className="sk">{k}</span>
    <span className={`sv${ok === false ? " bad" : ok === true ? " good" : ""}`}>
      {value}
    </span>
  </div>
);

export const Settings: React.FC = () => {
  const [cfg, setCfg] = useState<StudioConfig | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [brief, setBrief] = useState("");
  const [briefLoaded, setBriefLoaded] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    getConfig().then((c) => {
      setCfg(c);
      setLoaded(true);
    });
    getBrief().then((b) => {
      setBrief(b);
      setBriefLoaded(true);
    });
  }, []);

  const onSave = async () => {
    setSaveState("saving");
    setSaveMsg(null);
    try {
      const saved = await saveBrief(brief);
      setBrief(saved);
      setSaveState("saved");
      window.setTimeout(() => setSaveState("idle"), 1600);
    } catch (e) {
      setSaveState("error");
      setSaveMsg(e instanceof Error ? e.message : "Could not save.");
    }
  };

  const onReset = async () => {
    const def = await resetBrief();
    setBrief(def);
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1600);
  };

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Settings</span>
        <h1>Configuration</h1>
        <p>
          Coach your generator and check your setup. Keys live in the .env file
          on your server and are never shown here.
        </p>
      </div>

      <div className="sgroup brief-group">
        <div className="sgroup-h">Marketing brief</div>
        <p className="shint">
          This is the script your AI follows. It is your head of growth in
          writing: voice, audience, and ad strategy. Edit it, save, and every
          new ad reflects the change. The technical output rules are locked
          separately, so editing here can never break exports.
        </p>
        {!briefLoaded ? (
          <div className="soon-panel">Loading brief...</div>
        ) : (
          <>
            <textarea
              className="brief-box"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              spellCheck={false}
            />
            <div className="brief-actions">
              <button className="btn" onClick={onSave} disabled={saveState === "saving"}>
                {saveState === "saving"
                  ? "Saving..."
                  : saveState === "saved"
                  ? "Saved"
                  : "Save brief"}
              </button>
              <button className="mini" onClick={onReset}>
                Restore default
              </button>
              {saveState === "error" && saveMsg ? (
                <span className="gen-error">{saveMsg}</span>
              ) : null}
            </div>
          </>
        )}
      </div>

      {!loaded ? (
        <div className="soon-panel">Checking your setup...</div>
      ) : !cfg ? (
        <div className="soon-panel">
          Could not reach the service. Make sure it is running.
        </div>
      ) : (
        <div className="settings">
          <div className="sgroup">
            <div className="sgroup-h">Rendering</div>
            <Row k="AWS region" value={cfg.region ?? "not set"} ok={Boolean(cfg.region)} />
            <Row
              k="Lambda function"
              value={cfg.functionName ?? "not set"}
              ok={Boolean(cfg.functionName)}
            />
            <Row k="Serve URL" value={cfg.serveUrlSet ? "set" : "not set"} ok={cfg.serveUrlSet} />
            <Row k="AWS keys" value={cfg.awsKeysSet ? "detected" : "missing"} ok={cfg.awsKeysSet} />
            <Row k="Frames per Lambda" value={cfg.framesPerLambda} />
          </div>

          <div className="sgroup">
            <div className="sgroup-h">AI generation</div>
            <Row
              k="Anthropic key"
              value={cfg.anthropicKeySet ? "detected" : "missing"}
              ok={cfg.anthropicKeySet}
            />
            <Row k="Generated ads saved" value={cfg.generatedCount} />
            {!cfg.anthropicKeySet ? (
              <p className="shint">
                Add ANTHROPIC_API_KEY to your .env (from console.anthropic.com),
                then restart the service to enable the generator.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};
