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
