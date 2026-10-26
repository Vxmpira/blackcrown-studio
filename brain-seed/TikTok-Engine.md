# TikTok-Engine

The Make automation "BlackCrown | TikTok Content Engine" (scenario 5822164). Daily at 11:00 ET. The owner posts the output to TikTok manually from the review channel.

## Pipeline
1. Dedupe check (one drop per day).
2. Random product roll: KORVUS, CROWN, ECLIPSE-X, or BLACKCROWN, each with its own destination, CTA, Bloom brand session, and embed color.
3. Random slide count, 3 to 6.
4. Claude (sonnet) writes the carousel from a per-product brief: slide 1 scroll stopper with a capital letter headline, one beat per middle slide, CTA card last. Keyword led for TikTok search. One image prompt per slide (single line, under 480 chars) then CAPTIONBLOCK: keyword first line, 2 to 3 short lines, Link in bio plus destination, exactly 4 hashtags (one broad, rest niche). Blocks separated by ###.
5. Bloom renders every slide: 9:16, 2K, model pro, brand session per product. Visual world: dark premium near black, royal accents, one focal point, text centered, right edge and bottom 15 percent empty, destination as small text above the bottom fifth.
6. Package posts to the #tiktok-automation channel as a review queue embed with caption, why, CTA, destination, and all slides.

## Product briefs (live copies land in [[TikTok-Engine-Live]] when the Make read key is set)
- KORVUS: whole picture on one screen for beginner futures traders; explains why price moves; free account at korvus.industries; never predicts or promises.
- CROWN: private AI that holds your context and is never trained on your data; free chat, no card; Crowned 49.99 with 5M tokens a month.
- ECLIPSE-X: building alone got slow; a room of people a step ahead; free, no upsell.
- BLACKCROWN: house awareness, one house three edges; do not detail the AI workspace.

## How Corvid uses this
- Propose edits to the writer prompt, briefs, keywords, or hook rotation as kind "automation", with CURRENT and NEW text exact enough to paste into Make.
- Propose extra carousels as kind "creative" with ready slide prompts and a caption; on approval Corvid renders them through Bloom and delivers the package.
- Watch the analytics for tiktok as a source; that is this engine's scoreboard.
