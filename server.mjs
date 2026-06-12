// Small render service. The admin page calls this; this calls your AWS.
// AWS keys are read from .env and never leave your machine.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { renderMediaOnLambda, getRenderProgress } from "@remotion/lambda/client";

dotenv.config();

const region = process.env.REMOTION_AWS_REGION;
const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME;
const serveUrl = process.env.REMOTION_SERVE_URL;

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

function assertConfigured() {
  const missing = [];
  if (!region) missing.push("REMOTION_AWS_REGION");
  if (!functionName) missing.push("REMOTION_LAMBDA_FUNCTION_NAME");
  if (!serveUrl) missing.push("REMOTION_SERVE_URL");
  if (!process.env.REMOTION_AWS_ACCESS_KEY_ID) missing.push("REMOTION_AWS_ACCESS_KEY_ID");
  if (!process.env.REMOTION_AWS_SECRET_ACCESS_KEY) missing.push("REMOTION_AWS_SECRET_ACCESS_KEY");
  if (missing.length) {
    throw new Error(
      `Missing ${missing.join(", ")} in .env. Finish the AWS setup in RUNBOOK.md.`
    );
  }
}

app.post("/api/render", async (req, res) => {
  try {
    assertConfigured();
    const { compositionId, inputProps } = req.body ?? {};
    if (!compositionId) throw new Error("compositionId is required");
    const { renderId, bucketName } = await renderMediaOnLambda({
      region,
      functionName,
      serveUrl,
      composition: compositionId,
      inputProps: inputProps ?? {},
      codec: "h264",
      privacy: "public",
    });
    res.json({ renderId, bucketName });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "render error" });
  }
});

app.get("/api/progress", async (req, res) => {
  try {
    assertConfigured();
    const { renderId, bucketName } = req.query;
    const p = await getRenderProgress({
      renderId: String(renderId),
      bucketName: String(bucketName),
      functionName,
      region,
    });
    res.json({
      done: p.done,
      overallProgress: p.overallProgress,
      outputFile: p.outputFile ?? null,
      error: p.fatalErrorEncountered
        ? p.errors?.[0]?.message ?? "Render failed on AWS."
        : undefined,
    });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "progress error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`BlackCrown render service on http://localhost:${PORT}`);
});
