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

export type StatBuckets = {
  visit: Record<string, number>;
  click: Record<string, number>;
  src?: Record<string, number>;
  dev?: Record<string, number>;
  hr?: Record<string, number>;
};
export type StatsData = {
  w7: StatBuckets;
  w30: StatBuckets;
  series: { day: string; visits: number }[];
  series30?: { day: string; visits: number; clicks: number }[];
  today?: { visits: number; clicks: number };
  prev7avg?: number;
};

export async function getStats(): Promise<StatsData | null> {
  try {
    const r = await fetch(`${BASE}/api/stats`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

// ----- uptime ---------------------------------------------------------------
export type UptimeSite = {
  key: string;
  label: string;
  url: string;
  up: boolean | null;
  status: number | null;
  ms: number | null;
  checkedAt: number | null;
  pct24h: number | null;
};

export async function getUptime(fresh = false): Promise<UptimeSite[]> {
  try {
    const r = await fetch(`${BASE}/api/uptime${fresh ? "?now=1" : ""}`);
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j.sites) ? j.sites : [];
  } catch {
    return [];
  }
}

// ----- command tab ----------------------------------------------------------
export type SystemData = {
  vitals: {
    disk: { totalGb: number; freeGb: number; usedPct: number } | null;
    mem: { totalGb: number; usedPct: number };
    load1: number;
    cores: number;
    cpuPct: number;
    bootDays: number;
  };
  services: { name: string; active: boolean; state: string }[];
  certs: { host: string; daysLeft: number | null; validTo: string | null }[];
};

export async function getSystem(): Promise<SystemData | null> {
  try {
    const r = await fetch(`${BASE}/api/system`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export type MoneyEntry = {
  id: string;
  date: string;
  type: "income" | "expense";
  product: "korvus" | "crown" | "brand";
  label: string;
  amount: number;
};
export type MoneyMonth = { month: string; income: number; expense: number; net: number };
export type MoneyData = { entries: MoneyEntry[]; months: MoneyMonth[] };

export async function getMoney(): Promise<MoneyData | null> {
  try {
    const r = await fetch(`${BASE}/api/money`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function addMoney(e: {
  date: string;
  type: string;
  product: string;
  label: string;
  amount: number;
}): Promise<void> {
  const r = await fetch(`${BASE}/api/money`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(e),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Save failed (${r.status})`);
  }
}

export async function deleteMoney(id: string): Promise<void> {
  await fetch(`${BASE}/api/money/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// ----- stripe revenue -------------------------------------------------------
export type RevenueData = {
  configured: boolean;
  error?: string;
  mrr?: number;
  subscribers?: number;
  monthGross?: number;
  monthPayments?: number;
  products?: Record<string, number>;
  recent?: { t: number; amount: number; desc: string; customer: string }[];
  fetchedAt?: number;
};

export async function getRevenue(fresh = false): Promise<RevenueData | null> {
  try {
    const r = await fetch(`${BASE}/api/revenue${fresh ? "?fresh=1" : ""}`);
    const j = await r.json().catch(() => null);
    if (!r.ok) return j && j.configured ? j : null;
    return j;
  } catch {
    return null;
  }
}

// ----- seo agent ------------------------------------------------------------
export type SeoIssue = { sev: "high" | "med" | "low"; msg: string };
export type SeoPage = {
  file: string;
  title: string;
  metaDesc: string;
  words: number;
  score: number;
  issues: SeoIssue[];
};
export type SeoReview = { at: number; text: string };
export type SeoData = {
  auditedAt: number | null;
  pages: SeoPage[];
  reviews: Record<string, SeoReview>;
};

export async function getSeo(): Promise<SeoData | null> {
  try {
    const r = await fetch(`${BASE}/api/seo`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function runSeoAudit(): Promise<SeoData> {
  const r = await fetch(`${BASE}/api/seo/audit`, { method: "POST" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Audit failed (${r.status})`);
  return j as SeoData;
}

export async function runSeoReview(file: string): Promise<SeoReview> {
  const r = await fetch(`${BASE}/api/seo/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Review failed (${r.status})`);
  return j.review as SeoReview;
}

// ----- auth -----------------------------------------------------------------
export type Me = { authed: boolean; user: string | null; setup: boolean };

export async function getMe(): Promise<Me | null> {
  try {
    const r = await fetch(`${BASE}/api/me`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function login(user: string, pass: string): Promise<void> {
  const r = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Login failed (${r.status})`);
  }
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/api/logout`, { method: "POST" });
}
