import React, { useEffect, useMemo, useState } from "react";
import {
  addMoney,
  deleteMoney,
  getMoney,
  getRevenue,
  getStats,
  getSystem,
  getUptime,
  type MoneyData,
  type RevenueData,
  type SystemData,
  type UptimeSite,
} from "../api";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const Meter: React.FC<{ label: string; pct: number; detail: string }> = ({
  label,
  pct,
  detail,
}) => (
  <div className="meter">
    <div className="meter-top">
      <span className="meter-k">{label}</span>
      <span className={`meter-pct${pct >= 85 ? " hot" : ""}`}>{pct}%</span>
    </div>
    <div className="bar">
      <i style={{ width: `${Math.min(100, Math.max(2, pct))}%` }} className={pct >= 85 ? "hot" : ""} />
    </div>
    <div className="meter-detail">{detail}</div>
  </div>
);

const Pulse: React.FC<{ sites: UptimeSite[]; today: { visits: number; clicks: number } | null }> = ({
  sites,
  today,
}) => (
  <div className="pulse">
    <div className="pulse-item">
      <span className="pulse-k">Visits today</span>
      <span className="pulse-v">{today ? today.visits : "..."}</span>
    </div>
    <div className="pulse-item">
      <span className="pulse-k">Clicks today</span>
      <span className="pulse-v">{today ? today.clicks : "..."}</span>
    </div>
    {sites.map((s) => (
      <div className="pulse-item" key={s.key}>
        <span className="pulse-k">{s.label.replace(".com", "").replace(".industries", "")}</span>
        <span className="pulse-v">
          <span className={`dot ${s.up === null ? "unknown" : s.up ? "ok" : "down"}`} />
          {s.up === null ? "..." : s.up ? "up" : "down"}
        </span>
      </div>
    ))}
  </div>
);

const RUNBOOK: { title: string; note: string; cmd: string }[] = [
  {
    title: "Deploy brand site",
    note: "After a push to BlackCrownVxJ.LLC",
    cmd: "cd /var/www/blackcrown && git pull",
  },
  {
    title: "Deploy admin (full)",
    note: "After a push that touched the frontend",
    cmd: "cd ~/blackcrown-studio && git stash && git pull && npm run build && sudo systemctl restart blackcrown-render",
  },
  {
    title: "Deploy admin (server only)",
    note: "When only server.mjs changed",
    cmd: "cd ~/blackcrown-studio && git pull && sudo systemctl restart blackcrown-render",
  },
  {
    title: "Restart services",
    note: "Render service, support relay, nginx",
    cmd: "sudo systemctl restart blackcrown-render && sudo systemctl restart blackcrown-support && sudo systemctl reload nginx",
  },
  {
    title: "Tail admin logs",
    note: "Last 50 lines of the render service",
    cmd: "sudo journalctl -u blackcrown-render -n 50 --no-pager",
  },
  {
    title: "Check cert renewal",
    note: "Certbot renews on its own; this is the dry run",
    cmd: "sudo certbot renew --dry-run",
  },
  {
    title: "Refresh cloud ad renderer",
    note: "After editing Remotion compositions",
    cmd: "cd ~/blackcrown-studio && npm run deploy:site",
  },
];

const Runbook: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(cmd);
      window.setTimeout(() => setCopied(null), 1300);
    } catch {
      setCopied(null);
    }
  };
  return (
    <div className="rb">
      {RUNBOOK.map((r) => (
        <div className="rb-row" key={r.title}>
          <div className="rb-head">
            <span className="rb-title">{r.title}</span>
            <span className="rb-note">{r.note}</span>
            <button className="mini-btn" onClick={() => copy(r.cmd)}>
              {copied === r.cmd ? "Copied" : "Copy"}
            </button>
          </div>
          <code className="rb-cmd">{r.cmd}</code>
        </div>
      ))}
    </div>
  );
};

const Revenue: React.FC<{ expenseThisMonth: number }> = ({ expenseThisMonth }) => {
  const [rev, setRev] = useState<RevenueData | null>(null);
  const [busy, setBusy] = useState(false);

  const load = (fresh = false) => {
    setBusy(true);
    getRevenue(fresh).then((r) => {
      setRev(r);
      setBusy(false);
    });
  };
  useEffect(() => load(), []);

  if (!rev) return <div className="bl-empty">Reading Stripe...</div>;
  if (!rev.configured) {
    return (
      <div className="notice">
        <div className="notice-h">Connect Stripe for live revenue</div>
        <p>
          In Stripe: Developers, API keys, Create restricted key, give it Read
          on everything. Then on the server add{" "}
          <span className="mono">STRIPE_SECRET_KEY=rk_live_...</span> to .env
          and restart blackcrown-render. MRR, subscribers and payments will
          appear here on their own.
        </p>
      </div>
    );
  }
  if (rev.error) {
    return <div className="status err">Stripe: {rev.error}</div>;
  }
  const net = Math.round(((rev.monthGross || 0) - expenseThisMonth) * 100) / 100;
  const prods = Object.entries(rev.products || {}).sort((a, b) => b[1] - a[1]);
  const maxP = Math.max(1, ...prods.map(([, v]) => v));
  return (
    <>
      <div className="cards" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="k">MRR</div>
          <div className="v money-in">{usd(rev.mrr || 0)}</div>
        </div>
        <div className="card">
          <div className="k">Subscribers</div>
          <div className="v">{rev.subscribers || 0}</div>
        </div>
        <div className="card">
          <div className="k">Collected this month</div>
          <div className="v money-in">{usd(rev.monthGross || 0)}</div>
          <div className="sub">{rev.monthPayments || 0} payments</div>
        </div>
        <div className="card">
          <div className="k">Expenses this month</div>
          <div className="v money-out">{usd(expenseThisMonth)}</div>
        </div>
        <div className="card">
          <div className="k">Net this month</div>
          <div className={`v ${net >= 0 ? "money-in" : "money-out"}`}>{usd(net)}</div>
        </div>
      </div>
      <div className="stat-grid">
        {prods.length ? (
          <div>
            <div className="sgroup-h" style={{ fontSize: 13 }}>MRR by product</div>
            <div className="bl">
              {prods.map(([name, v]) => (
                <div className="bl-row" key={name}>
                  <span className="bl-k">{name}</span>
                  <span className="bl-track">
                    <i style={{ width: `${(v / maxP) * 100}%` }} />
                  </span>
                  <span className="bl-n">{usd(v)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {rev.recent && rev.recent.length ? (
          <div>
            <div className="sgroup-h" style={{ fontSize: 13 }}>Latest payments</div>
            <div className="money-list" style={{ marginTop: 0 }}>
              {rev.recent.slice(0, 6).map((p, i) => (
                <div className="money-row" key={i}>
                  <span className="m-date">{new Date(p.t).toISOString().slice(0, 10)}</span>
                  <span className="m-label">{p.customer || p.desc}</span>
                  <span className="m-amt money-in">+{usd(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bl-empty">No payments yet this month.</div>
        )}
      </div>
      <div className="seo-bar" style={{ marginTop: 10 }}>
        <button className="mini-btn" style={{ marginLeft: 0 }} onClick={() => load(true)} disabled={busy}>
          {busy ? "Refreshing..." : "Refresh from Stripe"}
        </button>
        {rev.fetchedAt ? (
          <span className="seo-rev-at">as of {new Date(rev.fetchedAt).toLocaleTimeString()}</span>
        ) : null}
      </div>
    </>
  );
};

const Money: React.FC = () => {
  const [data, setData] = useState<MoneyData | null>(null);
  const [type, setType] = useState("expense");
  const [product, setProduct] = useState("korvus");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => getMoney().then(setData);
  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await addMoney({ date, type, product, label, amount: Number(amount) });
      setLabel("");
      setAmount("");
      await load();
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await deleteMoney(id);
    await load();
  };

  const thisMonth = useMemo(() => {
    const m = data?.months[data.months.length - 1];
    return m || { month: "", income: 0, expense: 0, net: 0 };
  }, [data]);

  const maxAbs = useMemo(
    () => Math.max(1, ...(data?.months || []).map((m) => Math.abs(m.net))),
    [data]
  );

  return (
    <>
      <Revenue expenseThisMonth={thisMonth.expense} />

      <div className="sgroup-h" style={{ fontSize: 13, marginTop: 20 }}>
        Manual ledger, expenses and anything outside Stripe
      </div>

      {data && data.months.filter((m) => m.income || m.expense).length > 1 ? (
        <div className="net-chart" title="Monthly net, last 12 months">
          {data.months.map((m) => (
            <div className="net-col" key={m.month} title={`${m.month}: net ${usd(m.net)}`}>
              <div className="net-half top">
                {m.net > 0 ? (
                  <i className="pos" style={{ height: `${(m.net / maxAbs) * 100}%` }} />
                ) : null}
              </div>
              <div className="net-half">
                {m.net < 0 ? (
                  <i className="neg" style={{ height: `${(-m.net / maxAbs) * 100}%` }} />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <form className="money-form" onSubmit={submit}>
        <input
          type="date"
          className="mf"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select className="mf" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="mf" value={product} onChange={(e) => setProduct(e.target.value)}>
          <option value="korvus">Korvus</option>
          <option value="crown">Crown</option>
          <option value="brand">BlackCrown</option>
        </select>
        <input
          className="mf grow"
          placeholder="What was it (sub payment, AWS bill...)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="mf amt"
          placeholder="0.00"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn" disabled={busy || !label || !Number(amount)}>
          Add
        </button>
      </form>
      {err ? <div className="status err">{err}</div> : null}

      {data && data.entries.length ? (
        <div className="money-list">
          {data.entries.slice(0, 12).map((e) => (
            <div className="money-row" key={e.id}>
              <span className="m-date">{e.date}</span>
              <span className="m-prod">{e.product}</span>
              <span className="m-label">{e.label}</span>
              <span className={`m-amt ${e.type === "income" ? "money-in" : "money-out"}`}>
                {e.type === "income" ? "+" : "-"}
                {usd(e.amount)}
              </span>
              <button className="m-del" onClick={() => remove(e.id)} title="Delete entry">
                x
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bl-empty" style={{ marginTop: 12 }}>
          No entries yet. Log subs as income and the AWS bill as an expense, the
          profitability line builds itself.
        </div>
      )}
    </>
  );
};

export const Command: React.FC = () => {
  const [sys, setSys] = useState<SystemData | null>(null);
  const [sites, setSites] = useState<UptimeSite[]>([]);
  const [today, setToday] = useState<{ visits: number; clicks: number } | null>(null);

  useEffect(() => {
    getSystem().then(setSys);
    getUptime().then(setSites);
    getStats().then((d) => setToday(d?.today ?? { visits: 0, clicks: 0 }));
  }, []);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Command</span>
        <h1>The whole house, one glance.</h1>
        <p>Traffic pulse, server vitals, services, certificates, money and your runbook.</p>
      </div>

      <Pulse sites={sites} today={today} />

      <div className="stat-grid" style={{ marginTop: 18 }}>
        <div className="sgroup">
          <div className="sgroup-h">Server vitals</div>
          {!sys ? (
            <div className="bl-empty">Loading...</div>
          ) : (
            <div className="meters">
              {sys.vitals.disk ? (
                <Meter
                  label="Disk"
                  pct={sys.vitals.disk.usedPct}
                  detail={`${sys.vitals.disk.freeGb} GB free of ${sys.vitals.disk.totalGb} GB`}
                />
              ) : null}
              <Meter
                label="Memory"
                pct={sys.vitals.mem.usedPct}
                detail={`${sys.vitals.mem.totalGb} GB total`}
              />
              <Meter
                label="CPU"
                pct={sys.vitals.cpuPct}
                detail={`load ${sys.vitals.load1} on ${sys.vitals.cores} core${
                  sys.vitals.cores === 1 ? "" : "s"
                } · up ${sys.vitals.bootDays} days`}
              />
            </div>
          )}
        </div>

        <div className="sgroup">
          <div className="sgroup-h">Services and certificates</div>
          {!sys ? (
            <div className="bl-empty">Loading...</div>
          ) : (
            <>
              <div className="svc-list">
                {sys.services.map((s) => (
                  <div className="svc-row" key={s.name}>
                    <span className={`dot ${s.active ? "ok" : "down"}`} />
                    <span className="svc-name">{s.name}</span>
                    <span className="svc-state">{s.state}</span>
                  </div>
                ))}
              </div>
              <div className="cert-list">
                {sys.certs.map((c) => (
                  <div className="svc-row" key={c.host}>
                    <span
                      className={`dot ${
                        c.daysLeft === null ? "unknown" : c.daysLeft < 14 ? "down" : "ok"
                      }`}
                    />
                    <span className="svc-name">{c.host}</span>
                    <span className="svc-state">
                      {c.daysLeft === null ? "no cert read" : `SSL ${c.daysLeft}d left`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="sgroup" style={{ marginTop: 18 }}>
        <div className="sgroup-h">Money</div>
        <Money />
      </div>

      <div className="sgroup" style={{ marginTop: 18 }}>
        <div className="sgroup-h">Runbook</div>
        <Runbook />
      </div>
    </>
  );
};
