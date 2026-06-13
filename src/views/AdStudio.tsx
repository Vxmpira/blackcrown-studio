import React, { useEffect, useMemo, useRef, useState } from "react";
import { Player } from "@remotion/player";
import { ads as staticAds, adDuration, type Ad } from "../remotion/data";
import { BlackCrownAd } from "../remotion/BlackCrownAd";
import { FPS, W, H } from "../remotion/brand";
import { startRender, getProgress, listGeneratedAds, generateAd } from "../api";
import { GenerateBar } from "../components/GenerateBar";

type Phase = "idle" | "rendering" | "done" | "error";

export const AdStudio: React.FC = () => {
  const [genAds, setGenAds] = useState<Ad[]>([]);
  const allAds = useMemo(() => [...staticAds, ...genAds], [genAds]);

  const [selectedId, setSelectedId] = useState(staticAds[0].id);
  const ad = useMemo(
    () => allAds.find((a) => a.id === selectedId) ?? allAds[0],
    [allAds, selectedId]
  );

  const [genBusy, setGenBusy] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    listGeneratedAds().then(setGenAds);
  }, []);

  const reset = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setProgress(0);
    setOutput(null);
    setError(null);
  };

  const onGenerate = async (topic: string) => {
    setGenBusy(true);
    setGenError(null);
    try {
      const fresh = await generateAd(topic);
      setGenAds((prev) => [...prev, fresh]);
      setSelectedId(fresh.id);
      reset();
      setPhase("idle");
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Could not generate an ad.");
    } finally {
      setGenBusy(false);
    }
  };

  const onExport = async () => {
    reset();
    setPhase("rendering");
    try {
      // Always render through the generic "ad" composition, passing this ad's
      // data. That is why generated ads export without any redeploy.
      const { renderId, bucketName } = await startRender("ad", { ad });
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
          : "Render service not reachable. Start it with npm run server."
      );
      setPhase("error");
    }
  };

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Ad Studio</span>
        <h1>Generate, preview, export</h1>
        <p>
          Tap a topic to have Claude write a fresh on-brand ad, preview it live,
          then export to render it on your AWS and get a download link.
        </p>
      </div>

      <GenerateBar busy={genBusy} error={genError} onGenerate={onGenerate} />

      <div className="studio">
        <div className="ad-list">
          {allAds.map((a) => (
            <button
              key={a.id}
              className={`ad-pill${a.id === selectedId ? " active" : ""}`}
              onClick={() => {
                setSelectedId(a.id);
                reset();
                setPhase("idle");
              }}
            >
              <div className="id">
                {a.id}
                {a.generated ? <span className="ai-badge">AI</span> : null}
              </div>
              <div className="meta">
                {(adDuration(a) / FPS).toFixed(1)}s · {a.scenes.length} scenes
              </div>
            </button>
          ))}
        </div>

        <div className="stage">
          <div className="player-frame">
            <Player
              key={ad.id}
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

            <button className="btn" onClick={onExport} disabled={phase === "rendering"}>
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
                  <div className="status">Rendering on AWS · {Math.round(progress * 100)}%</div>
                ) : null}
                {phase === "done" && output ? (
                  <a className="dl" href={output} target="_blank" rel="noopener">
                    Download MP4
                  </a>
                ) : null}
                {phase === "error" ? <div className="status err">{error}</div> : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
