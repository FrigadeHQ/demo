import YAML from 'yaml';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Creates the Frigade flows this demo reads, from the definitions below.
 *
 * Idempotent: each flow is matched by name and updated in place, or created if
 * it's missing, so it's safe to run repeatedly. The resulting flow slugs are
 * written to src/lib/demo-flows.ts, which the app imports.
 *
 * These definitions are the source of truth for the live flows — keep them in
 * sync with what the app expects (the form's steps, the tour's selectors, the
 * checklist's completionCriteria, the survey's scale, etc.). Running this against
 * a workspace overwrites the matching flows, so stale definitions here would
 * revert the live flows.
 *
 * Needs your private and public Frigade keys (FRIGADE_API_KEY_SECRET and
 * NEXT_PUBLIC_FRIGADE_API_KEY) in .env.local.
 *
 * Run:  set -a; . ./.env.local; set +a; node scripts/provision-flows.mjs
 */

const API = 'https://api3.frigade.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const SECRET = process.env.FRIGADE_API_KEY_SECRET || '';
const PUB = process.env.NEXT_PUBLIC_FRIGADE_API_KEY || '';

const redact = (s) => (s || '').replace(/api_(public|private)_[A-Za-z0-9]+/g, '<REDACTED>');

async function req(method, path, key, body) {
  const res = await fetch(API + path, {
    method,
    headers: { Authorization: 'Bearer ' + key, 'User-Agent': UA, Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, text: await res.text() };
}

// ---- Flow definitions: one entry per Frigade flow. Each has a name, a type,
// and a YAML `data` payload (its steps + content) that the app reads with
// Frigade.useFlow(...) and renders — banner and form via Frigade's own
// components, the rest with the app's UI. Exported so the definitions can be
// checked against the live flows without running the provisioner. ----
export const FLOWS = [
  // "Product updates" feed — rendered as the bell dropdown + slide-in panel.
  {
    key: 'changelog',
    name: 'Northwind Product Updates',
    type: 'CUSTOM',
    data: YAML.stringify({
      steps: [
        { id: 'nw-2026-05-20', title: 'Bulk actions for agents', subtitle: 'Select multiple agents and pause, deploy, or retag them in one move. Saved views and filters keep large fleets manageable.', primaryButton: { title: 'Read more', uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', target: '_blank', action: false }, props: { date: 'May 20, 2026' } },
        { id: 'nw-2026-04-28', title: 'Northwind Reason 2 is here', subtitle: 'Our new reasoning model ships with roughly 2x throughput and noticeably lower latency. Switch any agent over from the model picker.', primaryButton: { title: 'Read more', uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', target: '_blank', action: false }, props: { date: 'April 28, 2026' } },
        { id: 'nw-2026-04-09', title: 'Usage alerts', subtitle: 'Set thresholds and get notified by email or webhook before you reach your plan limits, so there are no surprise overages.', primaryButton: { title: 'Read more', uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', target: '_blank', action: false }, props: { date: 'April 9, 2026' } },
        { id: 'nw-2026-03-18', title: 'Audit logs', subtitle: 'Every change to an agent, API key, or workspace is now tracked, searchable, and exportable for compliance.', primaryButton: { title: 'Read more', uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', target: '_blank', action: false }, props: { date: 'March 18, 2026' } },
        { id: 'nw-2026-02-25', title: 'Team roles and SSO', subtitle: 'Invite teammates as Admin, Developer, or Viewer, and connect SAML single sign-on from Settings.', primaryButton: { title: 'Read more', uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', target: '_blank', action: false }, props: { date: 'February 25, 2026' } },
      ],
    }),
  },
  // Getting-started checklist — each step auto-completes on a real user property
  // the app sets when you do the matching action (completionCriteria).
  {
    key: 'checklist',
    name: 'Northwind Getting Started',
    type: 'CHECKLIST',
    data: YAML.stringify({
      title: 'Get set up',
      subtitle: 'Finish these to get the most out of Northwind.',
      steps: [
        { id: 'take-a-tour', title: 'Take a quick tour', completionCriteria: "user.property('tookTour') == true", props: { action: 'tour' } },
        { id: 'create-agent', title: 'Create your first agent', completionCriteria: "user.property('createdAgent') == true", props: { hint: 'Spin up your first agent here.', target: 'create-agent' } },
        { id: 'add-key', title: 'Add an API key', completionCriteria: "user.property('addedApiKey') == true", props: { hint: 'Generate a key from API Keys.', target: 'nav-api-keys' } },
        { id: 'invite-team', title: 'Invite your team', completionCriteria: "user.property('invitedTeam') == true", props: { hint: 'Add teammates from Settings.', target: 'nav-settings' } },
        { id: 'view-analytics', title: 'Check your analytics', completionCriteria: "user.property('viewedAnalytics') == true", props: { hint: 'See usage and spend in Analytics.', target: 'nav-analytics' } },
      ],
    }),
  },
  // Welcome modal — kicks off the onboarding journey (form, then tour).
  {
    key: 'announcement',
    name: 'Northwind Welcome',
    type: 'ANNOUNCEMENT',
    data: YAML.stringify({
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to the demo',
          subtitle: 'Take the tour for a quick look at a few Frigade components in action, so you can see what you can build inside a real product.',
          primaryButton: { title: 'Show me around', action: 'flow.complete' },
          secondaryButton: { title: 'Skip tour', action: 'flow.skip' },
        },
      ],
    }),
  },
  // Onboarding form — a three-step wizard rendered by <Frigade.Form>. One field
  // per step; steps 2 and 3 carry a Back button (flow.back).
  {
    key: 'form',
    name: 'Northwind Onboarding',
    type: 'FORM',
    data: YAML.stringify({
      steps: [
        {
          id: 'name',
          title: 'What should we call you?',
          subtitle: "We'll use this to personalize your demo.",
          primaryButton: { title: 'Continue' },
          fields: [{ id: 'name', type: 'text', placeholder: 'Your full name', required: true }],
        },
        {
          id: 'role',
          title: 'What best describes you?',
          subtitle: 'Frigade forms take any field type and can hand off to any flow.',
          primaryButton: { title: 'Continue' },
          secondaryButton: { title: 'Back', action: 'flow.back' },
          fields: [{ id: 'role', type: 'select', required: true, options: [{ label: 'Engineer', value: 'engineer' }, { label: 'Product', value: 'product' }, { label: 'Founder or exec', value: 'founder' }, { label: 'Something else', value: 'other' }] }],
        },
        {
          id: 'usecase',
          title: 'What interests you most?',
          subtitle: 'A simple example, but Frigade forms can branch and apply logic on any answer.',
          primaryButton: { title: 'Finish setup' },
          secondaryButton: { title: 'Back', action: 'flow.back' },
          fields: [{ id: 'usecase', type: 'select', options: [{ label: 'Onboarding & checklists', value: 'onboarding' }, { label: 'Product tours', value: 'tours' }, { label: 'Announcements & changelog', value: 'announcements' }, { label: 'Surveys & NPS', value: 'surveys' }] }],
        },
      ],
    }),
  },
  // Product tour — spotlight + coachmarks. Each step's DOM anchor is the native
  // `selector` field; the last step is gated on a real action (props.gate).
  {
    key: 'tour',
    name: 'Northwind Product Tour',
    type: 'TOUR',
    data: YAML.stringify({
      steps: [
        { id: 'orient', title: 'Frigade can spotlight anything', subtitle: 'Highlight any element in your real product to point users exactly where to go, with no screenshots to keep up to date.', selector: '[data-tour="workspace"]', props: { place: 'bottom' } },
        { id: 'theme', title: 'Yours, in any theme', subtitle: 'Frigade surfaces inherit your product styling. Switch to dark and watch everything follow along.', selector: '[data-target="theme"]', props: { place: 'bottom', gate: 'theme' } },
        { id: 'gated', title: 'Gated on real actions', subtitle: 'A step can wait until you take a real action. Open your checklist to get credit for finishing this tour.', selector: '[data-ck]', props: { place: 'top', gate: 'ck-open' } },
      ],
    }),
  },
  // Contextual banner — a <Frigade.Banner>, shown once two checklist steps are
  // done. ${firstName} is interpolated from the name the form collected.
  {
    key: 'banner',
    name: 'Northwind Progress',
    type: 'BANNER',
    data: YAML.stringify({
      steps: [
        { id: 'progress', title: 'Nice work${firstName}', subtitle: 'You just completed two checklist steps! Frigade flows fire on real events like that, so the right message lands at the right moment.', primaryButton: { title: 'Got it', action: 'flow.complete' } },
      ],
    }),
  },
  // NPS-style survey — shown when the whole checklist is complete. The scale and
  // its end labels come from props (options / negativeLabel / positiveLabel).
  {
    key: 'survey',
    name: 'Northwind Demo Survey',
    type: 'SURVEY',
    data: YAML.stringify({
      steps: [
        { id: 'enjoy', title: 'How are you enjoying the demo?', subtitle: 'If you liked it, you can build surveys just like this one with Frigade.', props: { options: ['1', '2', '3', '4', '5'], negativeLabel: 'Not for me', positiveLabel: 'Love it' }, primaryButton: { title: 'Grab a time with us', uri: 'https://frigade.com/demo', target: '_blank', action: false }, secondaryButton: { title: 'Get started', uri: 'https://frigade.com', target: '_blank', action: false } },
      ],
    }),
  },
];

// Provision every flow into the workspace behind the keys, then write the slug
// config the app imports. Only runs when this file is executed directly, so the
// FLOWS export can be imported (e.g. for tests) without any API calls.
async function provision() {
  if (!SECRET.startsWith('api_private_')) { console.error('ABORT: FRIGADE_API_KEY_SECRET missing/not private. Run: set -a; . ./.env.local; set +a; node scripts/provision-flows.mjs'); process.exit(3); }

  const result = {};
  for (const f of FLOWS) {
    // 1) find existing by name (idempotent, no dupes; only ever matches OUR flow names)
    let fid = null, slug = null;
    const list = await req('GET', '/v1/flows', SECRET);
    if (list.status === 200) {
      let flows = [];
      try { flows = JSON.parse(list.text).data || []; } catch {}
      const matches = flows.filter((x) => x.name === f.name);
      const pick = matches.find((x) => x.status === 'ACTIVE') || matches[0];
      if (pick) { fid = pick.id; slug = pick.slug; }
    } else {
      console.log(`[${f.key}] list flows -> ${list.status} ${redact(list.text).slice(0, 160)}`);
    }

    // 2) create or update
    if (!fid) {
      const c = await req('POST', '/v1/flows', SECRET, { name: f.name, type: f.type, data: f.data, active: true });
      if ([200, 201].includes(c.status)) { const j = JSON.parse(c.text); fid = j.id; slug = j.slug; console.log(`[${f.key}] CREATED id=${fid} slug=${slug}`); }
      else { console.log(`[${f.key}] CREATE FAILED ${c.status} ${redact(c.text).slice(0, 400)}`); continue; }
    } else {
      const u = await req('PUT', `/v1/flows/${fid}`, SECRET, { data: f.data, active: true });
      console.log(`[${f.key}] UPDATED id=${fid} slug=${slug} -> ${u.status}`);
    }

    // 3) verify SDK visibility
    let visible = false;
    const fs = await req('GET', `/v1/public/flowStates?userId=demo-provision-check`, PUB);
    if (fs.status === 200) {
      try {
        const slugs = (JSON.parse(fs.text).eligibleFlows || []).map((x) => x.slug || x.flowSlug || (x.flow || {}).slug);
        visible = slugs.includes(slug);
      } catch {}
    }
    result[f.key] = slug;
    console.log(`[${f.key}] SDK-visible=${visible}`);
  }

  // 4) write slug config the app imports
  const out = `// AUTO-GENERATED by scripts/provision-flows.mjs. Frigade demo flow slugs.\nexport const DEMO_FLOWS = ${JSON.stringify(result, null, 2)} as const;\n`;
  writeFileSync(new URL('../src/lib/demo-flows.ts', import.meta.url), out);
  console.log('\nwrote src/lib/demo-flows.ts =>', JSON.stringify(result));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) provision();
