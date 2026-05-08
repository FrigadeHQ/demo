# Themes refresh: Linear, Spotify, Vaporwave

Date: 2026-05-08
Status: Approved (in flight)

## Goals

Light / Dark / Windows are good. Linear, Spotify, and Vaporwave look dated.
This pass:

- **Linear → faithful** to the actual Linear app (deep cool gray, violet, hairlines, 6px radii).
- **Spotify → inspired riff.** Recognizable, but cleaner than real Spotify (drop the uppercase / letter-spacing button treatment, soften shadows, modern green).
- **Vaporwave → tasteful polish only.** Keep the synthwave palette and angular look. Kill the doubled chromatic-aberration shadows; readable body type.

QA: every theme × every page screenshotted via Puppeteer to catch overflow / visibility regressions like the recent `.fr-carousel-wrapper { overflow: visible }` bug.

## §1 Linear (faithful)

Tokens scoped to `.demo-window, [data-radix-popper-content-wrapper]` inside `.linear`:

- `--background` `220 6% 8%` · `--card` `220 6% 11%` · `--popover` `220 6% 13%`
- `--border` `220 6% 18%` (hairline, NOT a bevel)
- `--foreground` `220 6% 96%` · `--muted-foreground` `220 5% 60%`
- `--primary` `234 60% 62%` (#5e6ad2, Linear violet) · `--primary-foreground` `0 0% 100%`
- `--ring` matches `--primary`
- `--secondary` `220 6% 14%` · `--accent` matches primary

Type: Inter. Body 13–14px / 500. Headings 600. (Fix the existing `BlinkSpotifySystemFont` typo in the linear font stack.)

Component overrides:

- `.fr-card` — `#1a1b1f`, 1px hairline, 6px radius, no shadow.
- `.fr-button-primary` — violet, 6px radius, 13px / 500, 32px height, 8/12 padding. Hover: lighten primary.
- `.fr-button-secondary` — transparent, 1px hairline border, hover bg `#222326`. 6px.
- `.fr-button-plain` — text-only.
- `.fr-field-text/textarea/select/check/radio` — `#16171a`, 1px `#2a2c30`, 6px, focus ring violet.
- `.fr-progress-bar` — 4px tall, gray rail, violet fill.
- `.fr-progress-dot/-selected` — 6px dots.
- `.fr-dropdown` — `#1f2024`, hairline, soft shadow.
- `.fr-carousel-prev/next-wrapper` — small black-to-transparent gradient, hairline-bordered icon button.

## §2 Spotify (riff)

Tokens:

- `--background` `0 0% 4%` · `--card` `0 0% 9%` · `--popover` `0 0% 11%`
- `--border` `0 0% 14%` · `--foreground` `0 0% 98%` · `--muted-foreground` `0 0% 63%`
- `--primary` `141 73% 48%` (#1ed760) · `--primary-foreground` `0 0% 100%`

Type: Inter as Circular stand-in. **Drop the uppercase + 1px letter-spacing on buttons** — that's the single biggest dated thing.

Component overrides:

- `.fr-card` — `#181818`, no border, soft shadow `0 4px 16px rgba(0,0,0,0.4)`, 8px radius, 20px padding.
- `.fr-button-primary` — `#1ed760` pill (500px), 14px / 600, normal-case, 32px height. Hover: `scale(1.04)` + brighten `#1fdf64`.
- `.fr-button-secondary` — transparent fill, 1px `rgba(255,255,255,0.2)`, pill, normal-case, hover white border.
- `.fr-button-plain` — text-only, no transform.
- Fields — `#242424`, no border, 8px radius, focus ring green.
- Progress bar — 4px, `#404040` rail, `#1ed760` fill.
- Carousel arrows — black-circle icon buttons.

## §3 Vaporwave (polish only)

Keep: angular 0-radius surfaces, hot-pink `#ff71ce` / cyan `#00ffff` palette, VT323 for display.
Kill: doubled chromatic shadows on every element, inset 20px ring shadows, dual `border + shadow` chrome.

Tokens:

- Body bg desaturated for legibility: `--background` `280 50% 95%` (was `300 100% 95%`).
- Other tokens unchanged.

Component overrides:

- `.fr-card` — light purple, 1px `#ff71ce` border, 0 radius, **single** `4px 4px 0 #00ffff` shadow (one offset, not three).
- `.fr-button-primary` — solid `#ff71ce`, 1px border, single 3px cyan offset shadow.
- `.fr-button-secondary` — solid `#00ffff`, single pink offset.
- `.fr-button-plain` — VT323, no shadow.
- VT323 for headings + button labels only. Body in Inter so paragraphs are readable.
- Drop `text-shadow` on buttons (chromatic doubling looks bad on retina).

## Out of scope

- Light, Dark, Windows themes.
- Page layouts, component structure.
- Frigade SDK or React component changes — CSS only, in `src/pages/globals.css`.

## QA plan

`scripts/theme-screenshots.mjs` walks every theme through every demo page (and each modal trigger). Run before and after each theme is implemented; review every screenshot for overflow / readability / contrast regressions before commit.
