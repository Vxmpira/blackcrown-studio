import type { Ad } from "./remotion/data";

const BASE = (import.meta.env.VITE_RENDER_API as string) || "";

export type RenderStart = { renderId: string; bucketName: string };
export type RenderProgress = {
  done: boolean;
  overallProgress: number;
  outputFile: string | null;
  error?: string;
};

export async function startRender(
  compositionId: string,
  inputProps: unknown
): Promise<RenderStart> {
  const r = await fetch(`${BASE}/api/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ compositionId, inputProps }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Render request failed (${r.status})`);
  }
  return r.json();
}

export async function getProgress(
  renderId: string,
  bucketName: string
): Promise<RenderProgress> {
  const r = await fetch(
    `${BASE}/api/progress?renderId=${encodeURIComponent(
      renderId
    )}&bucketName=${encodeURIComponent(bucketName)}`
  );
  if (!r.ok) throw new Error(`Progress check failed (${r.status})`);
  return r.json();
}

export async function listGeneratedAds(): Promise<Ad[]> {
  try {
    const r = await fetch(`${BASE}/api/ads`);
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j.ads) ? j.ads : [];
  } catch {
    return [];
  }
}

export async function generateAd(topic: string): Promise<Ad> {
  const r = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Generation failed (${r.status})`);
  }
  const j = await r.json();
  return j.ad as Ad;
}

export async function deleteAd(id: string): Promise<void> {
  await fetch(`${BASE}/api/ads/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export type StudioConfig = {
  region: string | null;
  functionName: string | null;
  serveUrlSet: boolean;
  awsKeysSet: boolean;
  anthropicKeySet: boolean;
  framesPerLambda: number;
  generatedCount: number;
};

export async function getConfig(): Promise<StudioConfig | null> {
  try {
    const r = await fetch(`${BASE}/api/config`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function getBrief(): Promise<string> {
  const r = await fetch(`${BASE}/api/brief`);
  if (!r.ok) return "";
  const j = await r.json();
  return j.brief ?? "";
}

export async function saveBrief(brief: string): Promise<string> {
  const r = await fetch(`${BASE}/api/brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brief }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Save failed (${r.status})`);
  }
  const j = await r.json();
  return j.brief ?? brief;
}

export async function resetBrief(): Promise<string> {
  const r = await fetch(`${BASE}/api/brief`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reset: true }),
  });
  const j = await r.json();
  return j.brief ?? "";
}
