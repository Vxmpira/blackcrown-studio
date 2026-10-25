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

// ----- the agent ------------------------------------------------------------
export type AgentTask = { id: string; title: string; status: "open" | "doing" | "done" };
export type AgentProposal = {
  id: string;
  number: number;
  page: string;
  kind: string;
  summary: string;
  detail: string;
  status: "pending" | "approved" | "rejected" | "changes";
  createdAt: number;
  decidedAt?: number;
  note?: string;
};
export type AgentLogItem = { t: number; kind: string; text: string };
export type AgentState = {
  name: string;
  enabled: boolean;
  status: string;
  discordMode: "bot" | "webhook" | "none";
  cycleHourEt: number;
  lastCycleAt: number | null;
  currentFocus: string;
  lastThought: string;
  tasks: AgentTask[];
  proposals: AgentProposal[];
  log: AgentLogItem[];
  discord: { lastOutboundAt: number | null; lastInboundAt: number | null };
};

export async function getAgent(): Promise<AgentState | null> {
  try {
    const r = await fetch(`${BASE}/api/agent`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}
export async function agentCycle(): Promise<AgentState> {
  const r = await fetch(`${BASE}/api/agent/cycle`, { method: "POST" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Cycle failed (${r.status})`);
  return j.state as AgentState;
}
export async function agentEnabled(on: boolean): Promise<AgentState | null> {
  const r = await fetch(`${BASE}/api/agent/enabled`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ on }),
  });
  const j = await r.json().catch(() => ({}));
  return (j.state as AgentState) || null;
}
export async function agentAddTask(title: string): Promise<void> {
  await fetch(`${BASE}/api/agent/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}
export async function agentTest(): Promise<void> {
  const r = await fetch(`${BASE}/api/agent/test`, { method: "POST" });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Test failed (${r.status})`);
  }
}
export async function agentDecide(
  id: string,
  action: "approve" | "reject" | "change",
  note = ""
): Promise<AgentProposal> {
  const r = await fetch(`${BASE}/api/agent/proposal/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, note }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Decision failed (${r.status})`);
  return j.proposal as AgentProposal;
}
export type BrainFileMeta = { name: string; size: number; mtime: number };
export async function getBrainList(): Promise<BrainFileMeta[]> {
  try {
    const r = await fetch(`${BASE}/api/agent/brain`);
    if (!r.ok) return [];
    const j = await r.json();
    return j.files || [];
  } catch {
    return [];
  }
}
export async function getBrainFile(name: string): Promise<string> {
  const r = await fetch(`${BASE}/api/agent/brain/file?name=${encodeURIComponent(name)}`);
  if (!r.ok) return "";
  const j = await r.json();
  return j.body || "";
}
export const brainDownloadUrl = `${BASE}/api/agent/brain.tgz`;

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
