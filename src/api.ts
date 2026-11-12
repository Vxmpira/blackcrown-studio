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
    const r = await fetch(`${BASE}/api/stats`, { cache: "no-store" });
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
    const r = await fetch(`${BASE}/api/uptime${fresh ? "?now=1" : ""}`, { cache: "no-store" });
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
    const r = await fetch(`${BASE}/api/system`, { cache: "no-store" });
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
    const r = await fetch(`${BASE}/api/revenue${fresh ? "?fresh=1" : ""}`, { cache: "no-store" });
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
    const r = await fetch(`${BASE}/api/seo`, { cache: "no-store" });
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
  slides?: string[];
  caption?: string;
  brand?: string;
  rendered?: string[];
};
export type AgentLogItem = { t: number; kind: string; text: string };
export type AgentState = {
  name: string;
  enabled: boolean;
  status: string;
  discordMode: "bot" | "webhook" | "none";
  cycleHourEt: number;
  cycleEveryH?: number;
  cycleEveryMin?: number;
  minionReports?: { t: number; minion: string; task: string }[];
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
    const r = await fetch(`${BASE}/api/agent`, { cache: "no-store" });
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
export async function agentRetry(id: string): Promise<void> {
  await fetch(`${BASE}/api/agent/proposal/${encodeURIComponent(id)}/retry`, { method: "POST" });
}
export async function brainSaveFile(name: string, body: string): Promise<void> {
  const r = await fetch(`${BASE}/api/agent/brain/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, body }),
  });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Save failed (${r.status})`);
  }
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

// ----- regent (ceo) ---------------------------------------------------------
export type CeoExec = { number: number; summary: string; at: number; ok: boolean; result: string };
export type CeoState = {
  name: string;
  enabled: boolean;
  status: string;
  model: string;
  channel: "own" | "shared" | "none";
  asks: { id: string; number: number; page: string; kind: string; summary: string; detail: string; status: string }[];
  executed: CeoExec[];
  lastInitiativeAt?: number | null;
  log: AgentLogItem[];
};
// ----- scheduled jobs (the in-house automation engine) ----------------------
export type ServerJob = {
  id: string;
  name: string;
  kind: "daily" | "weekly";
  day: string | null;
  hour: number;
  minute: number;
  channel: string;
  spec: string;
  enabled: boolean;
  lastRunAt: number | null;
  createdAt: number;
};
export async function getJobs(): Promise<ServerJob[]> {
  try {
    const r = await fetch(`${BASE}/api/jobs`, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return j.jobs || [];
  } catch {
    return [];
  }
}
export async function runJobNow(id: string): Promise<void> {
  await fetch(`${BASE}/api/jobs/${encodeURIComponent(id)}/run`, { method: "POST" });
}
export async function toggleJob(id: string): Promise<void> {
  await fetch(`${BASE}/api/jobs/${encodeURIComponent(id)}/toggle`, { method: "POST" });
}
export async function deleteJob(id: string): Promise<void> {
  await fetch(`${BASE}/api/jobs/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function uploadExpressions(): Promise<{ emojis: string[]; stickers: string[] }> {
  const r = await fetch(`${BASE}/api/discord/expressions`, { method: "POST" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Upload failed (${r.status})`);
  return j;
}

// ----- staff agents (Herald, Steward) ---------------------------------------
export type StaffAgent = {
  key: string;
  name: string;
  title: string;
  enabled: boolean;
  status: string;
  lastCycleAt: number | null;
  cycleEveryH: number;
  focus: string;
  thought: string;
  tasks: { id: string; title: string; status: string }[];
  log: { t: number; kind: string; text: string }[];
  channel: "own" | "shared" | "none";
  community?: boolean;
  minionReports?: { t: number; minion: string; task: string }[];
};
export type WireEvent = { t: number; from: string; to: string; text: string };
export async function getWire(): Promise<WireEvent[]> {
  try {
    const r = await fetch(`${BASE}/api/wire`, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return j.wire || [];
  } catch {
    return [];
  }
}

export async function getStaff(): Promise<StaffAgent[]> {
  try {
    const r = await fetch(`${BASE}/api/staff`, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return j.agents || [];
  } catch {
    return [];
  }
}
export async function staffCycle(key: string): Promise<void> {
  const r = await fetch(`${BASE}/api/staff/${encodeURIComponent(key)}/cycle`, { method: "POST" });
  if (!r.ok) {
    const j = await r.json().catch(() => ({}));
    throw new Error(j.error || `Cycle failed (${r.status})`);
  }
}
export async function staffEnabled(key: string, on: boolean): Promise<void> {
  await fetch(`${BASE}/api/staff/${encodeURIComponent(key)}/enabled`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ on }),
  });
}
export async function staffAddTask(key: string, title: string): Promise<void> {
  await fetch(`${BASE}/api/staff/${encodeURIComponent(key)}/task`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
}

export async function getCeo(): Promise<CeoState | null> {
  try {
    const r = await fetch(`${BASE}/api/ceo`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}
export async function ceoEnabled(on: boolean): Promise<void> {
  await fetch(`${BASE}/api/ceo/enabled`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ on }),
  });
}
export async function getCeoBrainList(): Promise<BrainFileMeta[]> {
  try {
    const r = await fetch(`${BASE}/api/ceo/brain`);
    if (!r.ok) return [];
    return (await r.json()).files || [];
  } catch {
    return [];
  }
}
export async function getCeoBrainFile(name: string): Promise<string> {
  const r = await fetch(`${BASE}/api/ceo/brain/file?name=${encodeURIComponent(name)}`);
  if (!r.ok) return "";
  return (await r.json()).body || "";
}
export async function ceoBrainSaveFile(name: string, body: string): Promise<void> {
  const r = await fetch(`${BASE}/api/ceo/brain/file`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, body }),
  });
  if (!r.ok) throw new Error("Save failed");
}
export const ceoBrainDownloadUrl = `${BASE}/api/ceo/brain.tgz`;

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

// ---- brain galaxy ----
export type BrainNode = { id: string; t: string; d: string; s: string; m: number; g: number };
export type BrainPick = { id: string; title: string; desk: string; mtime: number; deg: number };
export type BrainGraph = {
  builtAt: number;
  nodes: BrainNode[];
  edges: [number, number][];
  stats: {
    notes: number;
    links: number;
    perDesk: Record<string, number>;
    updatedToday: number;
    days: number[];
    lessons: number;
    core: string | null;
    connected: BrainPick[];
    recent: BrainPick[];
  };
};
export type BrainNote = { id: string; title: string; mtime: number; text: string; truncated: boolean };
export async function getBrainGraph(): Promise<BrainGraph | null> {
  try {
    const r = await fetch(`${BASE}/api/brain-graph`, { cache: "no-store", credentials: "include" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
export async function getBrainNote(id: string): Promise<BrainNote | null> {
  try {
    const r = await fetch(`${BASE}/api/brain-note?id=${encodeURIComponent(id)}`, { cache: "no-store", credentials: "include" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// ----- Korvus Intel paper bot (read-only, from intel/ in the brain repo) ----
export type IntelTrade = {
  id: number;
  strategy: string;
  symbol: string;
  side?: "long" | "short";
  qty: number;
  entry_utc: string;
  entry_px: number;
  target_px: number | null;
  stop_px: number | null;
  exit_utc: string | null;
  exit_px: number | null;
  exit_reason: string | null;
  pnl: number | null;
  pnl_pct: number | null;
  status: "open" | "closed";
};
export type IntelFiling = {
  symbol: string;
  headline: string;
  seen_utc: string;
  url: string;
  impact: "high" | "med" | "low";
  direction: "bull" | "bear" | "neut";
  confidence: number;
  catalyst: string;
  summary: string;
};
export type IntelBoard = {
  data_asof_utc: string;
  min_sample: number;
  universe_count: number;
  universe_asof: string;
  scoreboard: {
    strategy: string;
    closed_trades: number;
    open_trades: number;
    wins: number;
    losses: number;
    win_rate_pct: number | null;
    sample_ok: boolean;
    avg_win_pct: number | null;
    avg_loss_pct: number | null;
    expectancy_pct: number | null;
    profit_factor: number | null;
    paper_pnl: number;
    exits: Record<string, number>;
    by_catalyst: Record<string, { trades: number; wins: number }>;
    by_side?: Record<string, { trades: number; wins: number; pnl: number }>;
    capital_at_work?: number;
    max_drawdown_usd?: number;
    max_drawdown_pct?: number | null;
    first_trade_utc?: string | null;
    last_trade_utc?: string | null;
    trading_days?: number;
    last30_expectancy_pct?: number | null;
  };
  rules: {
    strategy: string;
    notional: number;
    max_open: number;
    target_pct: number;
    stop_pct: number;
    min_confidence: number;
    max_day_up_pct: number;
    max_day_down_pct?: number;
    allow_short?: boolean;
    lookback_hours: number;
    slippage_pct: number;
    tick_seconds: number;
    price_band: [number, number];
    mcap_max: number;
    session?: string;
    window?: string;
    flat_at?: string;
  };
};
// closed trades taken under an earlier rule version: on the record, not on the scoreboard
export type IntelRetired = { strategy: string; trades: number; wins: number; losses: number; pnl: number; last_utc: string | null };
export type IntelData = {
  configured: boolean;
  dir?: string;
  dataMtime?: string | null;
  equity?: { t: string; v: number; sym: string }[];
  board?: IntelBoard | null;
  retired?: IntelRetired[];
  open?: IntelTrade[];
  recent?: IntelTrade[];
  filingsToday?: number;
  filings?: IntelFiling[];
};

export async function getIntel(): Promise<IntelData | null> {
  try {
    const r = await fetch(`${BASE}/api/intel`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export type IntelEvent = { t: string; stage: string; msg: string; level: "info" | "error"; symbol?: string };
export type IntelStage = Record<string, any>;
export type IntelLive = {
  configured: boolean;
  reachable?: boolean;
  error?: string;
  running?: boolean;
  heartbeat_age_s?: number;
  started_utc?: string;
  updated_utc?: string;
  server_utc?: string;
  stages?: Record<string, IntelStage>;
  events?: IntelEvent[];
  counts?: { universe: number; filings_total: number; open_trades: number; closed_trades: number };
};

export async function getIntelLive(): Promise<IntelLive | null> {
  try {
    const r = await fetch(`${BASE}/api/intel/live`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

// ----- model spend ------------------------------------------------------------
export type UsageAgent = { who: string; model: string; calls: number; input: number; cached: number; written: number; output: number; usd: number; cacheHitPct: number };
export type UsageData = {
  budget: { cap: number; spent: number; left: number | null; level: "off" | "ok" | "tight" | "out" };
  models: { head: string; hands: string; minion: string };
  days: { day: string; usd: number; agents: UsageAgent[] }[];
};
export async function getUsage(): Promise<UsageData | null> {
  try {
    const r = await fetch(`${BASE}/api/usage`, { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    return j && j.budget ? j : null;
  } catch {
    return null;
  }
}

// ----- futures strategy lab ----------------------------------------------------
export type LabStats = { trades: number; wins: number; win_rate: number | null; pnl: number; expectancy: number | null; profit_factor: number | null };
export type LabStrategy = LabStats & {
  id: string; gen: number; parent: string | null; family: string; status: "champion" | "active" | "retired";
  created_utc: string; retired_utc: string | null; why: string; retired_why: string | null; rules: string;
  open: { side: string; entry_px: number; target_px: number; stop_px: number; entry_utc: string; note: string } | null;
  promoted_utc?: string; since_crowned?: LabStats;
};
export type LabMarket = { sym: string; name: string; price: number | null; price_utc: string | null; champion: string | null; created: number; running: number; retired: number; all: LabStats; strategies: LabStrategy[] };
export type LabData = {
  configured: boolean; reachable?: boolean; error?: string; enabled?: boolean; started?: boolean;
  last_tick?: { t?: string; phase?: string; feed_ok?: boolean | null; feed?: string };
  min_eval?: number; min_champion?: number; population?: number; costs?: { commission_rt: number; slippage_ticks: number };
  markets?: LabMarket[]; log?: { t: string; sym: string; kind: string; text: string }[];
  trades?: { strat: string; sym: string; side: string; entry_utc: string; entry_px: number; exit_utc: string | null; exit_px: number | null; reason: string | null; pnl: number | null; status: string; note: string }[];
};
export async function getLab(): Promise<LabData | null> {
  try {
    const r = await fetch(`${BASE}/api/intel/lab`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}
