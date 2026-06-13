import React, { useEffect, useState } from "react";
import { getConfig, type StudioConfig } from "../api";

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

  useEffect(() => {
    getConfig().then((c) => {
      setCfg(c);
      setLoaded(true);
    });
  }, []);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Settings</span>
        <h1>Configuration</h1>
        <p>
          Read-only status of your render and generation setup. Keys live in the
          .env file on your server and are never shown here.
        </p>
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
