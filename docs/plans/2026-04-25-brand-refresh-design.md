# demo-v2 Brand Refresh — Design

**Date:** 2026-04-25
**Source brand:** `marketing-ai-experiment/new-website` (the new Frigade marketing brand)
**Target:** `demo-v2` (this repo — Next.js 14 Pages Router, Tailwind v3, shadcn-style HSL tokens)

## Goal

Bring the demo site visually in line with the new marketing brand so a visitor coming from frigade.com lands on demo.frigade.com without a visual seam. Plus three behavior fixes the demo needs in flight: sticky footer, deep-linkable product chooser, and a video double-play bug on the homepage.

## Scope (in)

- Color tokens, font, button styling, chooser styling, header restyle, footer card restyle, logo file
- Sticky-footer page layout
- `?product=...` query-param deep linking for the chooser
- Investigate + fix the homepage YouTube iframe double-play on chooser toggle

## Scope (out / explicitly deferred)

- A 4-product chooser. Demo keeps Assistant + Engage only; Knowledge / Pre-sales are not added.
- Path-based product routing (`/assistant`, `/engage`). Query-param only for now; path restructure is a later iteration.
- Replacing the demo's flow-grid footer with marketing's address/socials/status footer. Demo's footer serves a different purpose (in-demo navigation) and stays structurally.
- Tailwind v3 → v4 migration. Out of scope; revisit when there's a separate reason.
- Restyling the in-flow shadcn `Button`. The new `CtaButton` lives alongside it; in-flow buttons keep their current treatment.
- Adding marketing's rails / hatched-column page chrome. Demo pages are functional, not marketing surfaces.

## Decisions

### 1. Color tokens

Repoint demo's existing HSL CSS variables (in `src/pages/globals.css`) to the brand's values. **Token names stay the same** — every shadcn primitive in the demo continues to reference `--primary`, `--foreground`, etc., and inherits the brand automatically.

```
--background:           0 0% 100%      (white, unchanged)
--foreground:           225 41% 18%    (ink-900)
--primary:              217 99% 50%    (brand blue #016afe)
--primary-foreground:   0 0% 100%
--secondary:            220 15% 96%    (ink-100)
--secondary-foreground: 225 41% 18%    (ink-900)
--muted:                220 15% 96%    (ink-100)
--muted-foreground:     220 7% 46%     (ink-500)
--accent:               220 15% 96%    (ink-100)
--accent-foreground:    225 41% 18%    (ink-900)
--border:               222 16% 92%    (ink-200)
--input:                222 16% 92%    (ink-200)
--ring:                 217 99% 50%    (brand)
```

Themed variants (e.g. VT323 retro skin) keep their local overrides — they re-set `--primary` etc. inside their own `.theme-*` scope.

### 2. Font

Adopt Inter Variable via `next/font/google`. Wire as `--font-sans` and apply on `<body>` in `_app.tsx`. System-font fallback unchanged. Themed variants that override `font-family` (VT323) continue to work.

### 3. CTA component

New file `src/components/ui/cta-button.tsx` — a verbatim port of marketing's `CtaButton` (primary gradient + multi-layer shadow, secondary white with layered shadow). Used at marketing-facing surfaces in the demo:

- Header right-side "Get started" button
- Homepage hero primary + secondary buttons

In-flow shadcn `Button` (form submits, modal actions, hint dismiss, etc.) is untouched.

### 4. Product chooser

Restyle the existing 2-pill side-by-side toggle in `src/components/header.tsx`. Source icon + color from a new `src/lib/products.ts` (mirrors marketing's structure, scoped to `assistant` + `engage` only):

- Assistant: Sparkle icon, brand-blue color
- Engage: CodeXml icon, emerald color

Active pill: white background, soft per-product color glow ring, ink-900 text. Inactive: transparent, ink-500 text, hover ink-900. Toggle UX (both options always visible, single click to swap) is preserved — restyle only.

### 5. Header

Same structure as today (logo + chooser left, links + CTA right). Restyle:

- Logo `<Image src>` → `/images/frigade-logo.svg` (copied from marketing's `public/images/`)
- Right-side text links → `text-ink-700 hover:text-brand`
- "Get started" button → `<CtaButton variant="primary">` from §3

### 6. Footer cards

In `src/components/footer.tsx`, restyle the `LinkButton` cards (the flow grid). Structure unchanged:

- Card border → `border-ink-200`, hover `border-ink-300 bg-ink-50`
- Title → ink-900
- Description → ink-500
- Hover arrow accent → brand

### 7. Logo file

Copy `frigade-logo.svg` from `marketing-ai-experiment/new-website/public/images/` into `demo-v2/public/images/`. Update header's `Image src` to point at it.

### 8. Sticky footer (page-level layout)

In `src/pages/_app.tsx`, wrap the page tree:

- Outer wrapper: `min-h-screen flex flex-col`
- `<Main>` slot (or its container): `flex-1`
- `<Footer />` sits at the bottom of the column

When content is short the footer hugs the viewport bottom; when content overflows, footer pushes naturally below the fold. The Assistant experience continues to render `null` from inside the Footer component (no flow links to surface there) — the sticky layout still reserves the bottom edge correctly because the wrapper does the work.

### 9. Deep linking via `?product=`

In `src/components/experience-context.tsx`:

- On initial mount, read `router.query.product`. If `'assistant'` or `'engage'`, that wins.
- Fall back to existing route-based inference (`ENGAGE_ROUTES.some(...)` for `/forms`-style paths).
- When the chooser is clicked, `router.replace({ query: { ...router.query, product: next } }, undefined, { shallow: true })`.

Result:
- `?product=assistant` and `?product=engage` are stable deep-link targets.
- `/forms` (and the rest of `ENGAGE_ROUTES`) continue to default to Engage.
- Manual chooser clicks reflect in the URL without triggering navigation.

### 10. Double-play video bug

Reproduce first by toggling the chooser back and forth on the homepage. Most likely cause: the YouTube iframe in `src/pages/index.tsx` is *conditionally mounted* (`experience === 'assistant' && <iframe …>`), so toggling unmounts and remounts it; the YouTube player inside the iframe doesn't always tear down cleanly, and the next mount's `autoplay=1` overlaps with the previous instance's tail audio.

Likely fix path:

- Keep the iframe always mounted; toggle visibility via CSS (`hidden` class or `display: none`).
- Initialize the YouTube IFrame API once and call `pauseVideo` / `playVideo` via `postMessage` on chooser toggle.

If reproduction reveals a different mechanism (e.g. tab `visibilitychange` interactions), adjust during implementation rather than guessing now.

## Architecture notes

- `src/lib/products.ts` is the single source of truth for product slug, name, icon, and color. Both the chooser and any future product-aware UI read from it.
- The `CtaButton` is a sibling of the existing shadcn `Button`, not a replacement. Two button "personalities" coexist by intent: marketing-facing (CtaButton) vs in-flow (Button).
- Token repoint is the leverage point for the visual refresh — every existing shadcn primitive picks up the brand without per-component edits.

## Out-of-scope follow-ups (informational)

- Path-based product routes (`/assistant`, `/engage`) and per-product demo home pages.
- Tailwind v4 migration + adopting marketing's `@theme` block directly.
- A 4-product chooser if/when Knowledge and Pre-sales gain demo flows.
- Replacing the in-flow `Button` with the marketing CtaButton voice.

## Validation

- Visual: load each route in both Assistant and Engage modes; brand color, font, header, footer, chooser pills should match marketing on first impression.
- Deep linking: `?product=assistant` and `?product=engage` set the chooser correctly on first load. Manual toggles update the URL without navigating.
- Sticky footer: a short-content route (e.g. homepage with content removed) keeps footer at the viewport bottom on desktop; tall-content routes (e.g. `/checklists`) let footer push down.
- Video bug: toggle chooser 5+ times rapidly on homepage; only one audio stream at a time, no overlapping playback.
- Themed variants (VT323) still work — local overrides take precedence over the new tokens.
