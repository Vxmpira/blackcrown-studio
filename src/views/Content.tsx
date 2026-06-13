import React, { useEffect, useMemo, useState } from "react";
import { ads as staticAds, adDuration, type Ad } from "../remotion/data";
import { FPS } from "../remotion/brand";
import { listGeneratedAds, generateAd, deleteAd } from "../api";
import { GenerateBar } from "../components/GenerateBar";

export const Content: React.FC = () => {
  const [genAds, setGenAds] = useState<Ad[]>([]);
  const allAds = useMemo(() => [...staticAds, ...genAds], [genAds]);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    listGeneratedAds().then(setGenAds);
  }, []);

  const onGenerate = async (topic: string) => {
    setBusy(true);
    setError(null);
    try {
      const fresh = await generateAd(topic);
      setGenAds((prev) => [...prev, fresh]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate an ad.");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (id: string) => {
    await deleteAd(id);
    setGenAds((prev) => prev.filter((a) => a.id !== id));
  };

  const copyCaption = async (a: Ad) => {
    const text = `${a.caption}\n\n${a.hashtags.join(" ")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(a.id);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
    }
  };

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Content</span>
        <h1>Ad library</h1>
        <p>
          Every ad in one place. Generate new ones, copy the caption and tags
          straight to your post, and remove the AI drafts you do not want.
        </p>
      </div>

      <GenerateBar busy={busy} error={error} onGenerate={onGenerate} />

      <div className="lib">
        {allAds.map((a) => (
          <div className="lib-card" key={a.id}>
            <div className="lib-top">
              <div className="lib-id">
                {a.id}
                {a.generated ? <span className="ai-badge">AI</span> : (
                  <span className="ai-badge core">CORE</span>
                )}
              </div>
              <div className="lib-meta">
                {(adDuration(a) / FPS).toFixed(1)}s · {a.scenes.length} scenes
              </div>
            </div>
            <div className="lib-cap">{a.caption}</div>
            <div className="lib-tags">{a.hashtags.join("  ")}</div>
            <div className="lib-actions">
              <button className="mini" onClick={() => copyCaption(a)}>
                {copied === a.id ? "Copied" : "Copy caption + tags"}
              </button>
              {a.generated ? (
                <button className="mini danger" onClick={() => onDelete(a.id)}>
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
