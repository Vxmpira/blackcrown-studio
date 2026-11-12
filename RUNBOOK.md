# RUNBOOK: turn on cloud export

Do this once. After it's done, the Export button in the admin renders on your
AWS and hands back a download link. The preview works with none of this; only
the actual MP4 export needs AWS.

I can't do the AWS account steps for you. Creating the user and keys happens in
your own AWS console, and the keys go only into your local `.env`, never shared.

## 1. Install

```
npm install
```

## 2. AWS account setup (you, in your AWS console)

Follow the official click-by-click here, it's short and stays current:
https://www.remotion.dev/docs/lambda/setup

The shape of it:
1. Run `npx remotion lambda policies role`, copy the JSON, and in IAM create a
   policy named exactly `remotion-lambda-policy`.
2. In IAM create a role (use case: Lambda) named exactly `remotion-lambda-role`
   and attach that policy.
3. Run `npx remotion lambda policies user`, create an IAM user named
   `remotion-user` (no console access), and attach that user policy. Create an
   access key for the user and copy the Access Key ID and Secret.
4. Copy `.env.example` to `.env` and paste in the Access Key ID, the Secret, and
   your region.

```
cp .env.example .env
```

## 3. Deploy the renderer and your ads to AWS

```
npm run deploy:fn
```
Copy the function name it prints into `REMOTION_LAMBDA_FUNCTION_NAME` in `.env`.

```
npm run deploy:site
```
Copy the Serve URL it prints into `REMOTION_SERVE_URL` in `.env`.

## 4. Run the studio

Two terminals:

```
npm run server     # render service on http://localhost:3001
```
```
npm run dev        # admin on http://localhost:5173
```

Open http://localhost:5173, go to Ad Studio, pick an ad, and click
Render & export. When it finishes you get a Download MP4 link.

## Keeping it updated

- Edit ads in `src/remotion/data.ts`. The preview updates instantly.
- After editing, run `npm run deploy:site` again so the cloud renderer has the
  new version. Same site name, so it just overwrites.

## Notes

- Each render costs a few cents and lands in your S3 bucket. The download link
  is public, which is how the browser can fetch it.
- Free-tier memory error on deploy? Lower it:
  `npm run deploy:fn -- --memory=2048`.
- Put the admin behind a login on a public URL later if you want it off your
  machine. Until then, local is the simplest and safest.


## Model spend: how the agents use tokens

Every agent reaches the model through `llm.mjs`. Nothing else calls the API
for agent work.

**Tiers.** Three models, each with a job:

| Tier | Default | Used for |
| :-- | :-- | :-- |
| head | `claude-fable-5-2` | Corvid's strategy cycles and replies to the owner; everything Regent does (reviews, repairs, replies) |
| hands | `claude-sonnet-5-5` | Corvid's task steps and the scheduled report jobs |
| minion | `claude-haiku-5-5` | Bard, Herald, Steward, every minion, the librarians, JSON repair |

Regent reviews every proposal on the head model before the owner sees it, so
work done on the hands model never ships unchecked.

**Caching.** The request is ordered most stable first: the company
constitution (Institution.md, identical for every agent, so they share one
cached copy), then the role prompt, then the live data. Both stable layers use
the 1 hour cache, and each read renews the hour. The old default 5 minute
cache expired between task steps, so it was paid for and never read.

**Budget.** `AGENT_DAILY_BUDGET_USD` (default 5). At 70 percent the task
engine runs at half pace. At 100 percent background work (task steps,
scheduled cycles, Regent's initiative) pauses until midnight ET. The owner's
messages, proposal reviews and approved executions always run. Set it to 0 to
turn the guard off.

**.env knobs.**

```
MODEL_HEAD=claude-fable-5-2        # head tier for every agent
MODEL_HANDS=claude-sonnet-5-5      # hands tier
MINION_MODEL=claude-haiku-5-5      # minion tier
AGENT_MODEL=                       # Corvid's head model only; leave unset to follow MODEL_HEAD
AGENT_WORK_MODEL=                  # Corvid's task steps; set to the head model to undo the split
CEO_MODEL=                         # Regent only
STAFF_MODEL=                       # Bard, Herald, Steward
AGENT_DAILY_BUDGET_USD=5
```

If `.env` still pins `AGENT_MODEL` or `CEO_MODEL` to `claude-fable-5`, remove
those lines: that older model costs more per token and its cache reads cost
five times as much.

**Where to look.** The dashboard's "Model spend today" panel, or
`GET /api/usage`: dollars per desk, calls, and the share of input read from
cache. A desk that works all day should read most of its input from cache.
