import React, { useEffect, useMemo, useState } from "react";
import {
  getSeo,
  runSeoAudit,
  runSeoReview,
  type SeoData,
  type SeoPage,
} from "../api";

const scoreClass = (n: number) => (n >= 85 ? "good" : n >= 60 ? "mid" : "bad");

const PageCard: React.FC<{
  page: SeoPage;
  review?: { at: number; text: string };
  onReview: (file: string) => Promise<void>;
}> = ({ page, review, onReview }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const ask = async () => {
    setErr("");
    setBusy(true);
    try {
      await onReview(page.file);
      setOpen(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Review failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="seo-card">
      <div className="seo-head" onClick={() => setOpen(!open)}>
        <span className={`seo-score ${scoreClass(page.score)}`}>{page.score}</span>
        <div className="seo-id">
          <div className="seo-file">{page.file}</div>
          <div className="seo-title">{page.title || "No title tag"}</div>
        </div>
        <span className="seo-issue-count">
          {page.issues.length ? `${page.issues.length} issue${page.issues.length === 1 ? "" : "s"}` : "clean"}
        </span>
        <span className="seo-caret">{open ? "v" : ">"}</span>
      </div>
      {open ? (
        <div className="seo-body">
          <div className="seo-meta-row">
            <span className="seo-k">Meta description</span>
            <span className="seo-v">{page.metaDesc || "none"}</span>
          </div>
          <div className="seo-meta-row">
            <span className="seo-k">Visible words</span>
            <span className="seo-v">{page.words}</span>
          </div>
          {page.issues.length ? (
            <ul className="seo-issues">
              {page.issues.map((i, n) => (
                <li key={n} className={`sev-${i.sev}`}>
                  <span className="sev-tag">{i.sev}</span>
                  {i.msg}
                </li>
              ))}
            </ul>
          ) : (
            <div className="bl-empty">No mechanical issues found.</div>
          )}
          <div className="seo-actions">
            <button className="btn" onClick={ask} disabled={busy}>
              {busy ? "Agent thinking..." : review ? "Re-run agent review" : "Run agent review"}
            </button>
            {review ? (
              <span className="seo-rev-at">
                reviewed {new Date(review.at).toLocaleDateString()}
              </span>
            ) : null}
          </div>
          {err ? <div className="status err">{err}</div> : null}
          {review ? <pre className="seo-review">{review.text}</pre> : null}
        </div>
      ) : null}
    </div>
  );
};

export const Seo: React.FC = () => {
  const [data, setData] = useState<SeoData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    getSeo().then((d) => {
      setData(d);
      setLoaded(true);
    });
  }, []);

  const audit = async () => {
    setErr("");
    setBusy(true);
    try {
      const d = await runSeoAudit();
      setData(d);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Audit failed.");
    } finally {
      setBusy(false);
    }
  };

  const review = async (file: string) => {
    const r = await runSeoReview(file);
    setData((prev) =>
      prev ? { ...prev, reviews: { ...prev.reviews, [file]: r } } : prev
    );
  };

  const avg = useMemo(() => {
    const pages = data?.pages || [];
    if (!pages.length) return 0;
    return Math.round(pages.reduce((a, p) => a + p.score, 0) / pages.length);
  }, [data]);

  const issueTotals = useMemo(() => {
    const t = { high: 0, med: 0, low: 0 };
    for (const p of data?.pages || [])
      for (const i of p.issues) t[i.sev] = (t[i.sev] || 0) + 1;
    return t;
  }, [data]);

  return (
    <>
      <div className="page-head">
        <span className="eyebrow">SEO Agent</span>
        <h1>Rank, or be invisible.</h1>
        <p>
          The agent reads every live page of blackcrownvxj.com, scores it,
          flags what holds it back, and writes the titles and fixes for you.
        </p>
      </div>

      <div className="seo-bar">
        <button className="btn" onClick={audit} disabled={busy}>
          {busy ? "Auditing..." : data?.pages?.length ? "Re-run audit" : "Run first audit"}
        </button>
        {data?.auditedAt ? (
          <span className="seo-rev-at">
            last audit {new Date(data.auditedAt).toLocaleString()}
          </span>
        ) : null}
      </div>
      {err ? <div className="status err">{err}</div> : null}

      {!loaded ? (
        <div className="soon-panel">Loading...</div>
      ) : !data || !data.pages.length ? (
        <div className="notice" style={{ marginTop: 18 }}>
          <div className="notice-h">No audit yet</div>
          <p>
            Hit Run first audit. The agent scans the HTML files the server is
            actually serving, so what it scores is exactly what Google sees.
          </p>
        </div>
      ) : (
        <>
          <div className="cards" style={{ marginTop: 18 }}>
            <div className="card">
              <div className="k">Site score</div>
              <div className={`v seo-score-big ${scoreClass(avg)}`}>{avg}</div>
            </div>
            <div className="card">
              <div className="k">Pages scanned</div>
              <div className="v">{data.pages.length}</div>
            </div>
            <div className="card">
              <div className="k">High priority</div>
              <div className="v money-out">{issueTotals.high}</div>
            </div>
            <div className="card">
              <div className="k">Medium / low</div>
              <div className="v">{issueTotals.med + issueTotals.low}</div>
            </div>
          </div>

          <div className="seo-list">
            {[...data.pages]
              .sort((a, b) => a.score - b.score)
              .map((p) => (
                <PageCard
                  key={p.file}
                  page={p}
                  review={data.reviews[p.file]}
                  onReview={review}
                />
              ))}
          </div>
        </>
      )}
    </>
  );
};
