<h3 align="center"><strong>Frigade Demo</strong></h3>
<div align="center">A full, end-to-end demo of Frigade, staged inside a fictional SaaS app.</div>
<br />
<div align="center">
<a href="https://frigade.com">Website</a>
<span> · </span>
<a href="https://demo.frigade.com">Demo</a>
<span> · </span>
<a href="https://github.com/FrigadeHQ">GitHub</a>
</div>

<br />

![Frigade Demo](https://cdn.frigade.com/0534ad31-8dc3-4061-9e53-53aae2ff3cf8.png)

This repo is the source code for [demo.frigade.com](https://demo.frigade.com), a live demo of
[Frigade](https://frigade.com) inside a fictional SaaS app. Its onboarding flows were built in an hour
or two by prompting [Frigade's Claude Code skill](https://github.com/FrigadeHQ/frigade-engage-skill).
That is how fast onboarding comes together with Frigade Engage and a coding agent.

## What's inside

**Frigade Assistant** ([frigade.com](https://frigade.com)) resolves your users' questions right inside
your product. Most tools just read your help docs; Frigade learns your product by using it, so it can
answer in context, walk someone through a workflow on the live screen, or just do the task for them.
This demo shows it in action.

**Frigade Engage** ([frigade.com/engage](https://frigade.com/engage)) is the onboarding and
feature-adoption layer you'd never want to build yourself. It owns the complicated parts of onboarding:
flow state and completion, user and account targeting, copy and logic, per-flow analytics, and more.
It's fully controllable from code, with no-code editing from a dashboard. Render it with pre-built
drop-in React components, or headless with your own UI, like this demo does.

The demo runs a full onboarding journey through the app:

- a welcome announcement
- an onboarding form
- a getting-started checklist
- a product tour
- a contextual banner
- a survey
- a product-updates changelog

## Getting started

This repo works best as a reference. Point your coding agent at it, then use
[Frigade's Claude Code skill](https://github.com/FrigadeHQ/frigade-engage-skill) to build and wire your
own flows in your Frigade workspace with your own API key, the same way this demo was built.

To run this demo yourself, you first need to create its seven flows in your own Frigade workspace. The
full YAML for each one lives in [`scripts/provision-flows.mjs`](scripts/provision-flows.mjs); add your
Frigade keys to `.env.local`, then run it to create them (or point your agent at those definitions):

```bash
set -a; . ./.env.local; set +a; node scripts/provision-flows.mjs
```

Then install and start the app:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000); add `?product=engage` to jump to the Engage flows.

## More examples

For focused, copy-pasteable Frigade Engage examples, see
[**frigade-engage-examples**](https://github.com/FrigadeHQ/frigade-engage-examples),
including [org-level and user-level checklist completion](https://github.com/FrigadeHQ/frigade-engage-examples/tree/main/checklists/org-and-user-level-completion)
([live demo](https://frigade-engage-checklist-examples.vercel.app/)).

---

<div align="center">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="public/images/frigade-logo-dark.svg">
<img src="public/images/frigade-logo.svg" alt="Frigade" width="120" />
</picture>
</div>

<div align="center">
<strong>Frigade</strong> helps you onboard and support users inside your own product. <strong>Frigade Engage</strong> builds in-product onboarding (checklists, product tours, and more) with the <code>@frigade/react</code> SDK. <strong>Frigade Assistant</strong> is an in-app AI assistant that answers your users' questions in context and guides them to their next step.
</div>

<br />

<div align="center">
<a href="https://frigade.com">Website</a>
<span> · </span>
<a href="https://demo.frigade.com">Demo</a>
<span> · </span>
<a href="https://github.com/FrigadeHQ">GitHub</a>
</div>
