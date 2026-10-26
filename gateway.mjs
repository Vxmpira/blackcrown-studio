// gateway.mjs: a thin Discord gateway client. One job pair: keep the bot
// visibly ONLINE around the clock with a presence, and receive slash
// command interactions. All heavy traffic stays on REST where it already
// lives; this socket just breathes.
import WebSocket from "ws";

const BOT_TOKEN = (process.env.DISCORD_BOT_TOKEN || "").trim();

let deps = { onInteraction: null, log: () => {} };
export function wireGateway(d) {
  deps = { ...deps, ...d };
}

let ws = null;
let hb = null;
let seq = null;
let sessionId = null;
let resumeUrl = null;

function presence() {
  return {
    since: null,
    activities: [{ name: "the Grid", type: 3 }],
    status: "online",
    afk: false,
  };
}

function connect(url) {
  const target = url || "wss://gateway.discord.gg/?v=10&encoding=json";
  try {
    ws = new WebSocket(target);
  } catch {
    setTimeout(() => connect(), 10000);
    return;
  }
  ws.on("message", (raw) => {
    let p;
    try {
      p = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (p.s) seq = p.s;
    if (p.op === 10) {
      clearInterval(hb);
      hb = setInterval(() => {
        if (ws && ws.readyState === 1) ws.send(JSON.stringify({ op: 1, d: seq }));
      }, p.d.heartbeat_interval);
      if (sessionId && url) {
        ws.send(JSON.stringify({ op: 6, d: { token: BOT_TOKEN, session_id: sessionId, seq } }));
      } else {
        ws.send(
          JSON.stringify({
            op: 2,
            d: {
              token: BOT_TOKEN,
              intents: 0,
              properties: { os: "linux", browser: "blackcrown", device: "blackcrown" },
              presence: presence(),
            },
          })
        );
      }
    } else if (p.op === 1) {
      if (ws && ws.readyState === 1) ws.send(JSON.stringify({ op: 1, d: seq }));
    } else if (p.op === 7) {
      try {
        ws.close(4000);
      } catch {
        // reconnect handled on close
      }
    } else if (p.op === 9) {
      sessionId = null;
      resumeUrl = null;
      try {
        ws.close(4000);
      } catch {
        // reconnect handled on close
      }
    } else if (p.t === "READY") {
      sessionId = p.d.session_id;
      resumeUrl = p.d.resume_gateway_url ? `${p.d.resume_gateway_url}/?v=10&encoding=json` : null;
      deps.log("gateway", "bot online, watching the Grid");
    } else if (p.t === "RESUMED") {
      deps.log("gateway", "gateway resumed");
    } else if (p.t === "INTERACTION_CREATE" && deps.onInteraction) {
      Promise.resolve(deps.onInteraction(p.d)).catch((e) =>
        deps.log("error", `interaction failed: ${e.message || e}`)
      );
    }
  });
  ws.on("close", () => {
    clearInterval(hb);
    setTimeout(() => connect(resumeUrl), 5000);
  });
  ws.on("error", () => {
    try {
      ws.close();
    } catch {
      // close triggers reconnect
    }
  });
}

export function startGateway() {
  if (!BOT_TOKEN) return false;
  connect();
  return true;
}
