import React, { useMemo, useRef, useState } from "react";
import { Player } from "@remotion/player";
import { ads, adDuration } from "../remotion/data";
import { BlackCrownAd } from "../remotion/BlackCrownAd";
import { FPS, W, H } from "../remotion/brand";
import { startRender, getProgress } from "../api";

type Phase = "idle" | "rendering" | "done" | "error";

export const AdStudio: React.FC = () => {
  const [selectedId, setSelectedId] = useState(ads[0].id);
  const ad = useMemo(
    () => ads.find((a) => a.id === selectedId) ?? ads[0],
    [selectedId]
  );

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setProgress(0);
    setOutput(null);
    setError(null);
  };

  const onExport = async () => {
    reset();
    setPhase("rendering");
    try {
      const { renderId, bucketName } = await startRender(ad.id, { ad });
      const poll = async () => {
        try {
          const p = await getProgress(renderId, bucketName);
          setProgress(p.overallProgress ?? 0);
          if (p.error) {
            setError(p.error);
            setPhase("error");
            return;
          }
          if (p.done) {
            setOutput(p.outputFile);
            setPhase("done");
            return;
          }
          timer.current = window.setTimeout(poll, 1500);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Lost contact with the render service.");
          setPhase("error");
        }
      };
      poll();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Render service not reachable. Start it with npm run server and finish the AWS setup in RUNBOOK.md."
      );
      setPhase("error");
    }
  };

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Ad Studio</span>
        <h1>Preview and export</h1>
        <p>
          Pick an ad to preview it live, then export to render it on your AWS and
          get a download link. Edit the copy and scenes in src/remotion/data.ts.
        </p>
      </div>

      <div className="studio">
        <div className="ad-list">
          {ads.map((a) => (
            <button
              key={a.id}
              className={`ad-pill${a.id === selectedId ? " active" : ""}`}
              onClick={() => {
                setSelectedId(a.id);
                reset();
                setPhase("idle");
              }}
            >
              <div className="id">{a.id}</div>
              <div className="meta">
                {(adDuration(a) / FPS).toFixed(1)}s · {a.scenes.length} scenes
              </div>
            </button>
          ))}
        </div>

        <div className="stage">
          <div className="player-frame">
            <Player
              component={BlackCrownAd}
              inputProps={{ ad }}
              durationInFrames={adDuration(ad)}
              fps={FPS}
              compositionWidth={W}
              compositionHeight={H}
              style={{ width: 300, height: (300 * H) / W }}
              controls
              loop
            />
          </div>

          <div className="controls">
            <h3>{ad.id}</h3>
            <div className="cap">{ad.caption}</div>
            <div className="tags">{ad.hashtags.join("  ")}</div>

            <button
              className="btn"
              onClick={onExport}
              disabled={phase === "rendering"}
            >
              {phase === "rendering" ? "Rendering..." : "Render & export"}
            </button>

            {phase !== "idle" ? (
              <div className="progress-wrap">
                {phase === "rendering" || phase === "done" ? (
                  <div className="bar">
                    <i style={{ width: `${Math.round(progress * 100)}%` }} />
                  </div>
                ) : null}
                {phase === "rendering" ? (
                  <div className="status">
                    Rendering on AWS · {Math.round(progress * 100)}%
                  </div>
                ) : null}
                {phase === "done" && output ? (
                  <a className="dl" href={output} target="_blank" rel="noopener">
                    Download MP4
                  </a>
                ) : null}
                {phase === "error" ? (
                  <div className="status err">{error}</div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
