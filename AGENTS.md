# AGENTS.md

Orientation for anyone (human or agent) working on this repo. It's the source of
[demo.frigade.com](https://demo.frigade.com): a single page that shows what you can
build with [Frigade](https://frigade.com). It was itself built with
[Claude Code](https://claude.com/claude-code) and the
[`frigade-engage` skill](https://github.com/FrigadeHQ/frigade-engage-skill) (see
"How this was built" in the README).

## Run it

```bash
cp .env.example .env.local   # add your Frigade public key
pnpm install
pnpm dev                     # http://localhost:3000
```

`?product=engage` loads the Engage view; the default is Assistant.

## The big picture

The entire experience lives in **one file: `src/pages/index.tsx`**. There is no
component library to learn and no routing to trace. The page renders its own
marketing header + footer and switches between two products with a header toggle:

- **Engage**: an immersive demo staged inside a fictional SaaS app ("Northwind").
  Every surface drawn in the brand blue is a real Frigade flow.
- **Assistant**: a product video plus value props and CTAs.

The eight Frigade surfaces split two ways. The **banner**, **onboarding form**,
**survey** and **sidebar card** render through Frigade's own components, themed
with Northwind's tokens so they read as native. The **announcement**,
**checklist**, **tour** and **changelog** are read **headless**: we take the
flow's content with `Frigade.useFlow(slug)` and draw our own UI.

The split isn't arbitrary. Anything modal in Frigade renders through a dialog
that portals to `document.body`, and this demo stages its app inside a browser
frame, so a surface that escapes the frame breaks the illusion. That rules out
`Frigade.Announcement` here, and it's why the survey is rendered `as` a Box
rather than its default dialog. The host app deliberately uses no brand color, so
the blue surfaces are visibly "the Frigade parts."

## File map

| Path | What it is |
|---|---|
| `src/pages/index.tsx` | The whole demo: header, both products, every Frigade surface, the demo console, dark mode, marketing footer. Start here. |
| `src/pages/_app.tsx` | App shell: global CSS, the Inter font, and `<Providers>`. |
| `src/components/providers.tsx` | The product-toggle context + the Frigade SDK provider (`@frigade/react`). |
| `src/components/experience-context.tsx` | `useExperience()`: the current product, synced to the `?product=` query param. |
| `src/lib/demo-flows.ts` | Slugs of the eight Frigade flows the app reads. Auto-generated. |
| `src/lib/utils.ts` | `getUserId()` (stable per-browser id) and `cn()`. |
| `scripts/provision-flows.mjs` | Creates/updates the eight flows in a Frigade workspace and rewrites `demo-flows.ts`. The flow definitions (YAML) live here, one commented block per flow. |
| `src/pages/globals.css` | Just Tailwind's base reset. The demo styles itself inline. |

## How the flows work

1. `scripts/provision-flows.mjs` defines eight flows and creates them in your
   Frigade workspace (idempotent). It writes their slugs to `src/lib/demo-flows.ts`.
2. `index.tsx` renders each flow one of two ways. The component-backed ones pass
   `flowId={DEMO_FLOWS.<key>}` to `Frigade.Banner` / `Form` / `Survey.NPS` / `Card`
   and style them through the `css` prop plus the shared theme. The headless ones
   read `Frigade.useFlow(DEMO_FLOWS.<key>)` and draw custom UI from `flow.steps` /
   `step.props`, completing steps with `step.complete()`.

To point the demo at your own workspace: set your keys in `.env.local`, run the
provision script (needs the private key), and it regenerates `demo-flows.ts`.

## Conventions

- **Styling is inline**, plus one scoped `<style>` block in `index.tsx` for keyframes
  and the few CSS classes (`nw-*`, `ck-*`, `cl-*`). The demo does not use Tailwind
  utility classes; don't add a component framework.
- **Brand blue (`#015EFB`) marks Frigade-driven surfaces.** Keep the host app neutral.
- **Dark mode** is the demo's own `dark` state (palette swap + CSS variables), not
  `next-themes`. The toggle lives in the in-app top bar.
- **Comments are for the reader.** This repo is open source, so keep notes
  reader-facing, with no team-only context.
- Deep-link any surface for testing: `?dc=open` (demo console), `?ck=open`, `?cl=bell`,
  `?an=open`, `?fm=open`, `?tour=open`, `?bn=open`, `?sv=open`.

## Verify before you ship

```bash
npx tsc --noEmit     # type-check
pnpm build           # production build (or: ./node_modules/.bin/next build)
```
