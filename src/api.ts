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
