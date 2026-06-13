import React from "react";

export const Stats: React.FC = () => {
  return (
    <>
      <div className="page-head">
        <span className="eyebrow">Statistics</span>
        <h1>Traffic and clicks</h1>
        <p>
          Visits to your sites and click-throughs to Korvus, Intelligence, and
          the Collective will show here once an analytics source is connected.
        </p>
      </div>

      <div className="cards">
        <div className="card dim">
          <div className="k">Site visits (7d)</div>
          <div className="v">--</div>
        </div>
        <div className="card dim">
          <div className="k">Korvus clicks</div>
          <div className="v">--</div>
        </div>
        <div className="card dim">
          <div className="k">Intelligence clicks</div>
          <div className="v">--</div>
        </div>
        <div className="card dim">
          <div className="k">Collective joins</div>
          <div className="v">--</div>
        </div>
      </div>

      <div className="notice">
        <div className="notice-h">Not connected yet</div>
        <p>
          This tab reads numbers, it does not invent them, so it needs a feed.
          The clean fit is Cloudflare Web Analytics: free, privacy-friendly, no
          cookie banner. The path is:
        </p>
        <ol>
          <li>Add the Cloudflare beacon snippet to blackcrownvxj.com (and Korvus and Intelligence).</li>
          <li>Tag the outbound buttons so clicks to each product are counted.</li>
          <li>Drop your Cloudflare API token into the studio so this tab can read it back.</li>
        </ol>
        <p>Say the word and I will wire it up as the next step.</p>
      </div>
    </>
  );
};
