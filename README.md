# BlackCrown Studio

Your private admin for BlackCrown. A left sidebar with tabs, and an Ad Studio
that previews your real branded ads live in the browser and exports them to MP4
by rendering on your own AWS.

## What works right now, no AWS needed

```
npm install
npm run dev
```

Open http://localhost:5173. The Ad Studio previews every ad live (the exact
brand: real fonts, the crown, glow, the animated trace). Pick an ad, scrub it,
watch it play. Edit copy and scenes in `src/remotion/data.ts` and it updates
instantly.

## To export to MP4 (one-time AWS setup)

The Export button renders on AWS Lambda and returns a download link. Follow
`RUNBOOK.md` to switch it on, then run `npm run server` alongside `npm run dev`.

## Structure

```
src/
  main.tsx, App.tsx        admin shell
  components/Sidebar.tsx   left nav
  views/                   Dashboard, AdStudio
  api.ts                   talks to the render service
  remotion/                the ads (same compositions as your renderer)
server.mjs                 render service -> Remotion Lambda
RUNBOOK.md                 AWS setup
```

## Scripts

- `npm run dev` — admin UI (preview works with no AWS)
- `npm run server` — render service the Export button calls
- `npm run deploy:fn` / `npm run deploy:site` — push the renderer and ads to AWS
- `npm run studio` — open Remotion Studio for the compositions directly
- `npm run build` — typecheck and build the admin
