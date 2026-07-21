<H3 align="center"><strong>Frigade Demo</strong></H3>
<div align="center">
<a href="https://frigade.com">Website</a> 
<span> · </span>
<a href="https://demo.frigade.com">Demo</a> 
<span> · </span>
<a href="https://docs.frigade.com">Docs</a>
</div>


<br />

![Frigade image](https://cdn.frigade.com/0534ad31-8dc3-4061-9e53-53aae2ff3cf8.png)

[Frigade](https://frigade.com) is the backend for product onboarding. It makes it easy to build
better customer journeys in your product through a flexible API and SDK, pre-built UI components,
and an easy-to-use web dashboard, all purpose-built for teams that care about design and
customization.

This repo is the source code for [demo.frigade.com](https://demo.frigade.com). It's a single page
that hosts two products behind a header toggle:

- **Engage**: an immersive walkthrough staged inside a fictional SaaS app ("Northwind"). Every
  surface that carries the brand blue is a real Frigade flow read **headless** with
  `Frigade.useFlow(...)` and rendered with the app's own UI: a welcome announcement, an onboarding
  form, a getting-started checklist, a product tour, a contextual banner, a survey, and a
  product-updates changelog.
- **Assistant**: a short product video.

The whole page lives in [`src/pages/index.tsx`](src/pages/index.tsx).

## How this was built

This demo was built with [Claude Code](https://claude.com/claude-code) and the
[`frigade-engage` skill](https://github.com/FrigadeHQ/frigade-engage-skill). It talks to the Frigade
API to create and configure flows, and wires the
[`@frigade/react`](https://docs.frigade.com) SDK into the codebase for you, so the flows you see
here were designed in a conversation with an agent, not clicked together by hand.

You can build something like it the same way:

1. Grab a free API key at [frigade.com](https://frigade.com).
2. Work with an agent (using the `frigade-engage` skill) to design and ship your own flows.

## Getting started

First, copy the sample environment file and add your Frigade keys:

```bash
cp .env.example .env.local
```

Then install dependencies and run the dev server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the demo. Add `?product=engage` to land
on the Engage view; the default is Assistant.

## Using your own API key and flows

Set `NEXT_PUBLIC_FRIGADE_API_KEY` (your public key) in `.env.local`. The seven flows this demo reads
are referenced by slug in [`src/lib/demo-flows.ts`](src/lib/demo-flows.ts).

To recreate the flows in your own Frigade workspace, the full definitions (YAML for each flow) live
in [`scripts/provision-flows.mjs`](scripts/provision-flows.mjs). Add your **private** key
(`FRIGADE_API_KEY_SECRET`) to `.env.local` and run it:

```bash
set -a; . ./.env.local; set +a; node scripts/provision-flows.mjs
```

The script is idempotent: it finds each flow by name and updates it in place, or creates it if it's
missing, then writes the resulting slugs back to `src/lib/demo-flows.ts`. It only ever touches the
flows it defines.

## More examples

For focused, copy-pasteable checklist patterns, see
[**frigade-engage-checklist-examples**](https://github.com/FrigadeHQ/frigade-engage-checklist-examples) —
including [org-level & user-level checklist completion](https://github.com/FrigadeHQ/frigade-engage-checklist-examples/tree/main/org-and-user-level-completion)
([live demo](https://frigade-engage-checklist-examples.vercel.app/)).
