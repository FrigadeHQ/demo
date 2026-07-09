import React, { useState, useEffect, useRef } from 'react';
import * as Frigade from '@frigade/react';
import {
  LayoutGrid, Bot, KeyRound, BarChart3, ScrollText, CreditCard, Settings2,
  Search, Bell, Plus, ChevronsUpDown, HelpCircle, Megaphone, Sun, Moon, Lock, ChevronUp, ChevronDown, Menu,
  Sparkles, CodeXml, ClipboardList, ListChecks, Route, Flag, MessageSquare, Newspaper, X,
  UserPlus, Database, Zap, Check, CheckCircle2, RotateCcw, Rocket, ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getUserId } from '@/lib/utils';
import { DEMO_FLOWS } from '@/lib/demo-flows';
import { getCalApi } from '@calcom/embed-react';
import { useExperience } from '@/components/experience-context';
import { VIDEO_BASE, SkillsChooser, SKILL_VIDEOS } from '@/components/skills-chooser';

// Cal.com popup config for the booking flows (reused from the existing demo site).
// Each product has its own Cal event type; the toggle decides which CTA fires.
const CAL_LINK = 'team/frigade/frigade-engage-demo';
const CAL_NS = 'frigade-engage-demo';
const CAL_LINK_ASSISTANT = 'team/frigade/frigade-demo-call';
const CAL_NS_ASSISTANT = 'frigade-demo-call';
const CAL_CONFIG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}';
// Each product points at its own app + marketing page. Engage lives on
// frigade.com/engage and app.frigade.com; Assistant on frigade.com and frigade.ai.
const APP_URL = 'https://app.frigade.com';
const APP_URL_ASSISTANT = 'https://app.frigade.ai/sign-up?ref=demo';

/**
 * Frigade product demo — one page that shows what you can build with Frigade.
 *
 * The page hosts two products behind the header toggle: Engage (this immersive
 * walkthrough) and Assistant (a product video). Engage is staged inside a
 * fictional SaaS app called "Northwind." Every surface that carries the brand
 * blue (#015EFB) is a real Frigade flow read headless with Frigade.useFlow(...)
 * and rendered with this app's own UI — a welcome announcement, an onboarding
 * form, a getting-started checklist, a product tour, a contextual banner, a
 * survey, and a product-updates changelog. The host app stays deliberately
 * neutral, so you can always tell which pixels Frigade is driving from the
 * pixels that are just the product.
 *
 * This demo was built with Claude Code and the frigade-engage skill
 * (https://github.com/FrigadeHQ/frigade-engage-skill), which drives the Frigade
 * API and wires the @frigade/react SDK for you. You can build something like it
 * the same way: grab a free API key at https://frigade.com, then work with an
 * agent to design and ship your own flows.
 */

const FONT = 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';
const CARD_SH = '0 1px 2px rgba(18,24,40,.06), 0 0 0 1px rgba(18,24,40,.05)';
const STAGE_SH = '0 1px 3px rgba(18,24,40,.05), 0 8px 26px rgba(18,24,40,.05)';
const C = {
  bg: '#f5f6f8', card: '#fff', ink: '#1a233c', ink2: '#2f3649', muted: '#6b7180',
  faint: '#9aa0b0', line: '#e6e8ee', hair: '#1b1b1d0d', brand: '#015efb', brandWeak: '#e7f0ff', dark: '#1b2230',
  ghost: '#e4e7ec', hover: '#f5f6f8', wash: '#eef3ff', washLine: '#e2e9f7', frame: '#eef0f3', frameBorder: '#e1e4e9', cardSh: '0 1px 2px rgba(18,24,40,.06), 0 0 0 1px rgba(18,24,40,.05)',
};
// Dark theme: the host app + Frigade surfaces re-skin; brand stays #015efb for fidelity.
const DARK: typeof C = {
  bg: '#0e1422', card: '#171f2e', ink: '#eef1f7', ink2: '#c2cad8', muted: '#8790a1',
  faint: '#5b647a', line: '#28303f', hair: 'rgba(255,255,255,.06)', brand: '#015efb', brandWeak: '#16243f', dark: '#2b3346',
  ghost: '#283142', hover: '#1e2738', wash: '#131c2e', washLine: '#222c40', frame: '#212a39', frameBorder: '#2b3446', cardSh: '0 1px 2px rgba(0,0,0,.35), 0 0 0 1px #2c3547',
};
const palette = (d: boolean) => (d ? DARK : C);
// Expose the active palette as CSS vars on the app root, so the shared helper
// components + injected popover CSS theme along with NorthwindApp's inline styles.
function cssVars(p: typeof C): Record<string, string> {
  return { '--nw-card': p.card, '--nw-ghost': p.ghost, '--nw-line': p.line, '--nw-muted': p.muted, '--nw-ink': p.ink, '--nw-ink2': p.ink2, '--nw-faint': p.faint, '--nw-brand': p.brand, '--nw-bw': p.brandWeak, '--nw-hover': p.hover, '--nw-bg': p.bg, '--nw-csh': p.cardSh };
}
const CTA_SECONDARY = 'inset 0 1px 0.4px rgba(255,255,255,0.9), inset 0 -2px 2px rgba(20,30,60,0.08), 0 1px 1px rgba(0,0,0,0.06), 0 2px 4px rgba(20,30,60,0.08), 0 0 0 1px rgba(18,55,105,0.1)';
const CTA_BRAND = 'inset 0 1px 0.4px rgba(255,255,255,0.28), inset 0 -3px 2px rgba(0,0,0,0.24), 0 1px 1px rgba(0,0,0,0.14), 0 2px 4px rgba(0,30,90,0.16), 1px 4px 10px rgba(0,86,248,0.18), 0 0 0 1px rgb(13,97,255)';

type IconType = LucideIcon;

function loadSet(k: string): Set<string> { if (typeof window === 'undefined') return new Set(); try { return new Set(JSON.parse(localStorage.getItem(k) || '[]')); } catch { return new Set(); } }
function saveSet(k: string, s: Set<string>) { try { localStorage.setItem(k, JSON.stringify([...s])); } catch {} }

function Ring({ pct = 40, size = 20 }: { pct?: number; size?: number }) {
  const sw = 2.6, r = (size - sw) / 2, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" style={{ stroke: 'var(--nw-line, #e6e8ee)' }} strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.brand} strokeWidth={sw} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}
function DotGrid({ color = C.brand, size = 15 }: { color?: string; size?: number }) {
  const pts = [6, 12, 18];
  return (<svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>{pts.map((y) => pts.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />))}</svg>);
}
function NavItem({ icon: Icon, label, active = false }: { icon: IconType; label: string; active?: boolean }) {
  return (<div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 9, fontSize: 13, fontWeight: active ? 600 : 500, color: active ? C.ink : C.ink2, background: active ? C.card : 'transparent', boxShadow: active ? CARD_SH : 'none' }}><Icon size={16} color={active ? C.ink2 : C.muted} strokeWidth={1.9} />{label}</div>);
}
function SecLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.07em', color: C.faint, padding: '14px 10px 5px' }}>{children}</div>;
}
// Skeleton/ghost placeholder for non-real host chrome (static, no shimmer).
function Ghost({ w, h = 8, r = 5, style }: { w: number | string; h?: number; r?: number; style?: React.CSSProperties }) {
  return <span style={{ display: 'inline-block', width: w, height: h, borderRadius: r, background: 'var(--nw-ghost, #e4e7ec)', flexShrink: 0, ...style }} />;
}
function NavGhost({ w, active = false }: { w: number; active?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 9, background: active ? 'var(--nw-card)' : 'transparent', boxShadow: active ? 'var(--nw-csh)' : 'none' }}>
      <Ghost w={15} h={15} r={5} /><Ghost w={w} h={8} />
    </div>
  );
}
// Frigade coachmark: an anchored hint bubble that points at the lit-up target.
function HintBubble({ text, side, onDismiss }: { text: string; side: 'right' | 'bottom'; onDismiss: () => void }) {
  const RING = 'rgba(1,94,251,.32)';
  const pos: React.CSSProperties = side === 'right'
    ? { left: 'calc(100% + 13px)', top: '50%', transform: 'translateY(-50%)' }
    : { top: 'calc(100% + 13px)', right: 0 };
  const caret: React.CSSProperties = side === 'right'
    ? { left: -6, top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderLeft: `1px solid ${RING}`, borderBottom: `1px solid ${RING}` }
    : { top: -6, right: 24, transform: 'rotate(45deg)', borderTop: `1px solid ${RING}`, borderLeft: `1px solid ${RING}` };
  return (
    <div className="nw-hint" role="status" style={{ position: 'absolute', zIndex: 60, width: 212, background: 'var(--nw-card)', borderRadius: 12, boxShadow: `0 14px 36px rgba(1,94,251,.20), 0 0 0 1px ${RING}`, padding: '12px 13px', ...pos }}>
      <span aria-hidden style={{ position: 'absolute', width: 11, height: 11, background: 'var(--nw-card)', boxSizing: 'border-box', ...caret }} />
      <button onClick={onDismiss} aria-label="Dismiss" style={{ position: 'absolute', top: 8, right: 9, border: 0, background: 'none', color: 'var(--nw-faint)', padding: 2, borderRadius: 5, cursor: 'pointer', display: 'flex' }}><X size={13} /></button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
        <DotGrid color={C.brand} size={13} />
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.brand }}>Do this next</span>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--nw-ink2)', paddingRight: 8 }}>{text}</div>
    </div>
  );
}
// A nav row that stays ghosted until its checklist step is active, then lights up
// (real icon + label, brand ring, pulse) and shows its hint. Clicking it = the action.
function NavTarget({ target, icon: Icon, label, w, lit, hint, onFire, onDismiss }: { target: string; icon: IconType; label: string; w: number; lit: boolean; hint: string; onFire: () => void; onDismiss: () => void }) {
  return (
    <div style={{ position: 'relative' }} data-target={target}>
      {lit && <span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 9, animation: 'nwpulse 1.9s infinite', pointerEvents: 'none' }} />}
      <div onClick={lit ? onFire : undefined} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 9, cursor: lit ? 'pointer' : 'default', background: lit ? 'var(--nw-bw)' : 'transparent', boxShadow: lit ? `inset 0 0 0 1px ${C.brand}` : 'none', transition: 'background .2s ease' }}>
        {lit ? <Icon size={16} color={C.brand} strokeWidth={2} /> : <Ghost w={15} h={15} r={5} />}
        {lit ? <span style={{ fontSize: 13, fontWeight: 600, color: C.brand }}>{label}</span> : <Ghost w={w} h={8} />}
      </div>
      {lit && <HintBubble text={hint} side="right" onDismiss={onDismiss} />}
    </div>
  );
}
function ExpBadge({ icon: Icon, label, onClick }: { icon: IconType; label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="nw-exp-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 31, borderRadius: 999, background: '#fff', padding: '0 13px', boxShadow: '0 1px 2px rgba(18,24,40,0.05), 0 0 0 1px rgba(18,24,40,0.07)', fontSize: 12.5, fontWeight: 500, color: C.ink2, border: 0, cursor: 'pointer' }}>
      <Icon size={14} color={C.brand} strokeWidth={2} />{label}
    </button>
  );
}

const AGENTS = [
  { name: 'Support Triage', type: 'Conversation', status: 'Running', run: '2m ago', on: true },
  { name: 'Lead Router', type: 'Workflow', status: 'Running', run: '14m ago', on: true },
  { name: 'Onboarding Bot', type: 'Single Prompt', status: 'Paused', run: '1d ago', on: false },
];
const EXPERIENCES: { label: string; icon: IconType; action: string }[] = [
  { label: 'Onboarding form', icon: ClipboardList, action: 'form' }, { label: 'Welcome announcement', icon: Megaphone, action: 'welcome' },
  { label: 'Checklist', icon: ListChecks, action: 'checklist' }, { label: 'Product tour', icon: Route, action: 'tour' },
  { label: 'Banner', icon: Flag, action: 'banner' }, { label: 'Survey', icon: MessageSquare, action: 'survey' }, { label: 'Changelog', icon: Newspaper, action: 'changelog' },
];
const CK_ICONS: Record<string, IconType> = { 'take-a-tour': Route, 'create-agent': Bot, 'add-key': KeyRound, 'invite-team': UserPlus, 'view-analytics': BarChart3, 'view-logs': ScrollText, 'connect-sso': ShieldCheck, 'go-live': Rocket };
// Abridged marketing value props for the section below the demo (Engage-framed, marketing voice).
const BENEFITS: { icon: IconType; title: string; desc: string }[] = [
  { icon: LayoutGrid, title: 'Native to your product', desc: 'Frigade surfaces inherit your design system. Type, color, and spacing, all of it. They read as part of your app, not a third-party widget.' },
  { icon: Database, title: 'Skip the infrastructure', desc: 'No state machines, no targeting logic, no event plumbing to maintain. Frigade handles it and you call the API.' },
  { icon: Zap, title: 'Fires on real events', desc: 'Target by event, trait, or progress. The right flow shows up at the right moment, with no hardcoding.' },
  { icon: CodeXml, title: 'Headless or styled', desc: 'Use the components, or bring your own UI and let Frigade run the logic underneath.' },
  { icon: Route, title: 'Every onboarding surface', desc: 'Announcements, tours, checklists, surveys, banners, and changelog. Build them all from one SDK.' },
  { icon: RotateCcw, title: 'Ship without deploys', desc: 'Edit copy, steps, and targeting from the dashboard. Flows update without a release.' },
];
// Assistant value props for the section below the Assistant video (marketing voice).
const ASSISTANT_BENEFITS: { icon: IconType; title: string; desc: string }[] = [
  { icon: Bot, title: 'Trained on your product', desc: 'Assistant learns your docs, UI, and data, so answers are grounded in how your product actually works.' },
  { icon: MessageSquare, title: 'Answers in real time', desc: 'Users get help in-app, in the moment, instead of leaving for a help center or a support queue.' },
  { icon: Route, title: 'Guides, not just chats', desc: 'It can call tools and walk users through real actions, not just reply with a wall of text.' },
  { icon: CheckCircle2, title: 'Always accurate', desc: 'Responses cite real sources and stay current as your product changes.' },
  { icon: Sparkles, title: 'Deflects support', desc: 'Resolve the common questions automatically and take repetitive load off your team.' },
  { icon: CodeXml, title: 'Drop-in SDK', desc: 'Add it with a few lines and style it to match your product. No new stack to learn.' },
];
const TOUR_ANCHORS: Record<string, string> = { workspace: '[data-tour="workspace"]', 'create-agent': '[data-target="create-agent"]', theme: '[data-target="theme"]', 'cl-bell': '[data-cl-bell]', ck: '[data-ck]' };
const GATE_LABELS: Record<string, string> = { 'create-agent': 'Click Create Agent', theme: 'Switch the theme', 'ck-open': 'Open your checklist' };
const FORM_FIELDS: { id: string; type: string; title: string; help: string; placeholder?: string; required?: boolean; options?: string[]; short: string; ph: string }[] = [
  { id: 'name', type: 'text', title: 'What should we call you?', help: 'We will use this to personalize your demo.', placeholder: 'Ada Lovelace', required: true, short: 'Your name', ph: 'Your full name' },
  { id: 'role', type: 'select', title: 'What best describes you?', help: 'Frigade forms take any field type and can hand off to any flow.', required: true, options: ['Engineer', 'Product', 'Founder or exec', 'Something else'], short: 'Your role', ph: 'Pick one' },
  { id: 'usecase', type: 'select', title: 'What interests you most?', help: 'A simple example, but Frigade forms can branch and apply logic on any answer.', required: false, options: ['Onboarding & checklists', 'Product tours', 'Announcements & changelog', 'Surveys & NPS'], short: 'Interests', ph: 'Optional' },
];

// Changelog entry list (shared by the bell dropdown + slide-in panel)
function renderEntries(steps: any[], newIds: Set<string>) {
  return steps.map((s) => {
    const date = s.props && s.props.date;
    const isNew = newIds.has(s.id);
    const cta = s.primaryButton || {};
    return (
      <article key={s.id} style={{ padding: '16px 20px', borderBottom: '1px solid var(--nw-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
          {date && <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--nw-muted)' }}>{date}</span>}
          {isNew && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: C.brand, background: 'var(--nw-bw)', padding: '2px 8px', borderRadius: 20 }}>New</span>}
        </div>
        <h4 style={{ margin: '0 0 6px', fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-.01em', color: 'var(--nw-ink)' }}>{s.title}</h4>
        {s.subtitle && <p style={{ margin: '0 0 11px', fontSize: 13, lineHeight: 1.55, color: 'var(--nw-ink2)' }}>{s.subtitle}</p>}
        {cta.title && cta.uri && <a href={cta.uri} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 600, color: C.brand, textDecoration: 'none' }}>{cta.title} →</a>}
      </article>
    );
  });
}
function PanelHead({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '17px 20px 13px', borderBottom: '1px solid var(--nw-line)' }}>
      <div><div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-.01em', color: 'var(--nw-ink)' }}>Product updates</div><div style={{ fontSize: 12.5, color: 'var(--nw-muted)', marginTop: 2 }}>What&rsquo;s new in Northwind</div></div>
      <button onClick={onClose} aria-label="Close" style={{ border: 0, background: 'none', color: 'var(--nw-faint)', padding: 3, borderRadius: 7, cursor: 'pointer', display: 'flex' }}><X size={18} /></button>
    </div>
  );
}

/* ---------- Northwind app (inside the browser frame) ---------- */
// Each surface in this app is a separate Frigade flow, read headless: we take
// the flow's steps/content via useFlow and render our own UI instead of
// Frigade's default components. The flow IDs live in src/lib/demo-flows.ts and
// were created by scripts/provision-flows.mjs. The flows, by what they drive:
//   changelog    -> "Product updates" bell dropdown + slide-in panel
//   checklist    -> getting-started checklist (steps complete from real actions)
//   announcement -> welcome modal that kicks off the onboarding journey
//   form         -> onboarding form that personalizes the app
//   banner       -> contextual banner, fires once two checklist steps are done
//   survey       -> NPS-style survey, fires when the checklist is complete
//   tour         -> product tour with a spotlight + coachmarks
function NorthwindApp({ dark, setDark, actionsRef }: { dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>>; actionsRef?: React.MutableRefObject<((key: string) => void) | null> }) {
  const { flow } = Frigade.useFlow(DEMO_FLOWS.changelog);
  const steps = flow ? Array.from(flow.steps.values()) : [];
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [newIds, setNewIds] = useState<Set<string>>(() => new Set());
  const [bellOpen, setBellOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { flow: ckFlow } = Frigade.useFlow(DEMO_FLOWS.checklist);
  const ckSteps = ckFlow ? Array.from(ckFlow.steps.values()) : [];
  // Design preview (?preview=gates): stages two proposed checklist steps
  // client-side (a visibility-gated SSO item + a criteria-locked capstone) so
  // the treatments can be reviewed without touching the live flow. Add
  // &plan=enterprise to see the hidden step the way an enterprise user would,
  // and &unlocked=1 to preview the capstone unlocked. Goes away once the real
  // YAML ships with these steps.
  const [gatePreview, setGatePreview] = useState({ on: false, enterprise: false, unlocked: false });
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setGatePreview({ on: q.get('preview') === 'gates', enterprise: q.get('plan') === 'enterprise', unlocked: q.get('unlocked') === '1' });
  }, []);
  const ckAllSteps: any[] = gatePreview.on ? [
    ...ckSteps,
    { id: 'connect-sso', title: 'Connect SAML SSO', isHidden: !gatePreview.enterprise, __mock: true },
    { id: 'go-live', title: 'Take your agent live', isBlocked: !gatePreview.unlocked, __mock: true },
  ] : ckSteps;
  // Steps whose visibilityCriteria is unmet (isHidden) never render or count.
  const ckVisible = ckAllSteps.filter((s: any) => !s.isHidden);
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const [ckOpen, setCkOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null); // checklist step whose hint is firing
  const { flow: anFlow } = Frigade.useFlow(DEMO_FLOWS.announcement);
  const anStep: any = anFlow ? Array.from(anFlow.steps.values())[0] : null;
  const anPrimary = anStep ? ((anStep.primaryButton && anStep.primaryButton.title) || anStep.primaryButtonTitle) : null;
  const anSecondary = anStep ? ((anStep.secondaryButton && anStep.secondaryButton.title) || anStep.secondaryButtonTitle) : null;
  const [anOpen, setAnOpen] = useState(false);
  const { flow: fmFlow } = Frigade.useFlow(DEMO_FLOWS.form);
  const fmStep: any = fmFlow ? Array.from(fmFlow.steps.values())[0] : null;
  const [fmOpen, setFmOpen] = useState(false);
  const [fmValues, setFmValues] = useState<Record<string, string>>({});
  const [fmStepIdx, setFmStepIdx] = useState(0);
  const [journey, setJourney] = useState(false); // true while the opening journey auto-plays (gates form -> welcome chain)
  const [consoleOpen, setConsoleOpen] = useState(false);
  const { flow: bnFlow } = Frigade.useFlow(DEMO_FLOWS.banner);
  const bnStep: any = bnFlow ? Array.from(bnFlow.steps.values())[0] : null;
  const [bannerOpen, setBannerOpen] = useState(false);
  const { flow: svFlow } = Frigade.useFlow(DEMO_FLOWS.survey);
  const svStep: any = svFlow ? Array.from(svFlow.steps.values())[0] : null;
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyRating, setSurveyRating] = useState<number | null>(null);
  const { flow: tourFlow } = Frigade.useFlow(DEMO_FLOWS.tour);
  const tourSteps = tourFlow ? Array.from(tourFlow.steps.values()) : [];
  const [tourActive, setTourActive] = useState(false);
  const [tourIdx, setTourIdx] = useState(0);
  const [tb, setTb] = useState<{ sTop: number; sLeft: number; sW: number; sH: number; cTop: number; cLeft: number; place: string } | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const autoPlayedRef = useRef(false); // the opening journey auto-plays at most once per mount
  const tourStep: any = tourActive ? tourSteps[tourIdx] : null;
  const C = palette(dark); // local themed palette shadows the module light palette for this app

  const seenKey = 'nw-changelog-seen:' + (typeof window !== 'undefined' ? getUserId() : 'x');
  const ckDoneKey = 'nw-checklist-done:' + (typeof window !== 'undefined' ? getUserId() : 'x');
  const bannerKey = 'nw-banner-seen:' + (typeof window !== 'undefined' ? getUserId() : 'x');
  const surveyKey = 'nw-survey-seen:' + (typeof window !== 'undefined' ? getUserId() : 'x');
  useEffect(() => { setSeen(loadSet(seenKey)); /* eslint-disable-next-line */ }, []);
  useEffect(() => { setDone(loadSet(ckDoneKey)); /* starts at 0%; steps complete from real actions */ /* eslint-disable-next-line */ }, []);
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') { setBellOpen(false); setPanelOpen(false); setCkOpen(false); setAnOpen(false); setFmOpen(false); setConsoleOpen(false); setActiveStep(null); } }
    document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey);
  }, []);
  // Deep-link an experience open (handy for screenshots + the Demo Console): ?cl=bell|panel
  useEffect(() => {
    if (!flow) return;
    const cl = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('cl') : null;
    if (cl === 'bell' || cl === 'panel') { markSeen(); setBellOpen(true); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow]);
  useEffect(() => {
    if (!ckFlow) return;
    const ck = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('ck') : null;
    if (ck === 'open') setCkOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ckFlow]);
  useEffect(() => {
    if (!ckFlow) return;
    const h = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('hint') : null;
    if (h && ckFlow.steps.get(h)) { setActiveStep(h); setCkOpen(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ckFlow]);
  useEffect(() => {
    if (!anFlow) return;
    const an = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('an') : null;
    if (an === 'open') setAnOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anFlow]);
  useEffect(() => {
    if (!fmFlow) return;
    const fm = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('fm') : null;
    if (fm === 'open') setFmOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fmFlow]);
  useEffect(() => {
    const dc = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('dc') : null;
    if (dc === 'open') setConsoleOpen(true);
  }, []);
  useEffect(() => {
    const bn = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('bn') : null;
    if (bn === 'open') setBannerOpen(true);
  }, []);
  useEffect(() => {
    const sv = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('sv') : null;
    if (sv === 'open') setSurveyOpen(true);
  }, []);
  // Auto-play the opening journey (form -> welcome -> tour). It pops on every fresh
  // load until the user has finished or skipped the onboarding form, so a returning
  // visitor who never did it still gets it (instead of landing on the bare app). The
  // ref keeps it from re-opening on re-renders within a single visit.
  useEffect(() => {
    if (!fmFlow || !anFlow || !tourFlow || typeof window === 'undefined') return;
    if (autoPlayedRef.current) return;
    if (/[?&](cl|ck|an|fm|dc|tour|hint|bn|sv)=/.test(window.location.search)) return;
    if (localStorage.getItem('nw-onboarding-done:' + getUserId())) return;
    autoPlayedRef.current = true;
    setJourney(true); setFmStepIdx(0); setFmOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fmFlow, anFlow, tourFlow]);

  const unseen = steps.filter((s: any) => !seen.has(s.id));
  const unseenCount = unseen.length;
  function markSeen() {
    setNewIds(new Set(unseen.map((s: any) => s.id)));
    if (!unseen.length) return;
    const next = new Set(seen); unseen.forEach((s: any) => { next.add(s.id); try { s.complete(); } catch {} });
    setSeen(next); saveSet(seenKey, next);
  }
  function toggleBell() { if (bellOpen) { setBellOpen(false); return; } setPanelOpen(false); setCkOpen(false); markSeen(); setBellOpen(true); }
  const ckTotal = ckVisible.length;
  const ckDoneCount = ckVisible.filter((s: any) => done.has(s.id)).length;
  const ckPct = ckTotal ? Math.round((ckDoneCount / ckTotal) * 100) : 0;
  // Contextual banner: slides into the dashboard once 2 checklist steps are done (until dismissed).
  useEffect(() => { if (ckDoneCount >= 2 && typeof window !== 'undefined' && !localStorage.getItem(bannerKey)) setBannerOpen(true); /* eslint-disable-next-line */ }, [ckDoneCount]);
  // Survey fires once the whole checklist is complete (until dismissed); also console-triggerable.
  useEffect(() => { if (ckTotal > 0 && ckDoneCount === ckTotal && typeof window !== 'undefined' && !localStorage.getItem(surveyKey)) { setSurveyRating(null); setSurveyOpen(true); } /* eslint-disable-next-line */ }, [ckDoneCount, ckTotal]);
  // In this demo the Create Agent button advances the next checklist step. In a
  // real app you'd complete each step from its own product event (a key created,
  // a teammate invited) or when a linked flow finishes (the form or the tour).
  // That cross-flow, event-driven completion is what Frigade is built for.
  function completeStep(id: string | null) {
    if (!id || done.has(id)) return;
    const next = new Set(done); next.add(id); setDone(next); saveSet(ckDoneKey, next);
    try { const st = ckFlow && ckFlow.steps.get(id); if (st) st.complete(); } catch {}
  }
  const activeStepObj: any = activeStep && ckFlow ? ckFlow.steps.get(activeStep) : null;
  const activeTarget: string | null = (activeStepObj && activeStepObj.props && activeStepObj.props.target) || null;
  const activeHintText: string = (activeStepObj && activeStepObj.props && activeStepObj.props.hint) || '';
  function fireStep() { if (!activeStep) return; completeStep(activeStep); setActiveStep(null); setCkOpen(true); }
  function startTour() { setTourIdx(0); setTourActive(true); }
  function endTour() { setTourActive(false); try { if (tourFlow && tourFlow.complete) tourFlow.complete(); } catch {} completeStep('take-a-tour'); }
  function skipTour() { setTourActive(false); try { if (tourFlow && tourFlow.skip) tourFlow.skip(); } catch {} }
  function advanceTour() { try { if (tourStep && tourStep.complete) tourStep.complete(); } catch {} if (tourIdx >= tourSteps.length - 1) endTour(); else setTourIdx((i) => i + 1); }
  function measureTour() {
    if (!tourStep) { setTb(null); return; }
    const app = appRef.current; const sel = TOUR_ANCHORS[tourStep.props && tourStep.props.anchor];
    // Scope to this app instance: the page is duplicated by the responsive layout (one copy is display:none), so a document-wide query can hit the hidden phantom.
    const el = app && sel ? (app.querySelector(sel) as HTMLElement | null) : null;
    if (!el || !app) { setTb(null); return; }
    const r = el.getBoundingClientRect(); const a = app.getBoundingClientRect();
    const pad = 6, cw = 290; const tTop = r.top - a.top, tLeft = r.left - a.left;
    const place = (tourStep.props && tourStep.props.place) || 'bottom';
    setTb({ sTop: tTop - pad, sLeft: tLeft - pad, sW: r.width + pad * 2, sH: r.height + pad * 2, cTop: place === 'bottom' ? tTop + r.height + 14 : tTop - 14, cLeft: Math.max(12, Math.min(tLeft, a.width - cw - 12)), place });
  }
  useEffect(() => { measureTour(); const on = () => measureTour(); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, [tourActive, tourIdx, tourFlow]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!tourFlow) return; const t = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tour') : null; if (t === 'open') startTour(); else if (t && /^[0-9]+$/.test(t)) { setTourIdx(Number(t)); setTourActive(true); } }, [tourFlow]); // eslint-disable-line react-hooks/exhaustive-deps
  function closeAnnouncement(complete: boolean) { setAnOpen(false); try { if (complete) anFlow?.complete?.(); else anFlow?.skip?.(); } catch {} }
  function closeBanner() { setBannerOpen(false); try { localStorage.setItem(bannerKey, '1'); } catch {} try { bnFlow?.complete?.(); } catch {} }
  function dismissSurvey() { setSurveyOpen(false); try { localStorage.setItem(surveyKey, '1'); } catch {} }
  function pickRating(n: number) { setSurveyRating(n); try { svStep?.complete?.({ rating: n }); } catch {} try { localStorage.setItem(surveyKey, '1'); } catch {} }
  function advanceForm(isLast: boolean) { if (isLast) submitForm(); else setFmStepIdx((i) => i + 1); }
  // Finishing or skipping the form means the user has been through onboarding, so the
  // journey won't auto-pop on future loads (an Escape-close doesn't set it, so an
  // accidental dismissal still gets another chance).
  function markOnboarded() { try { localStorage.setItem('nw-onboarding-done:' + getUserId(), '1'); } catch {} }
  function submitForm() { try { fmStep?.complete?.(fmValues); } catch {} markOnboarded(); setFmOpen(false); setFmStepIdx(0); if (journey) { setJourney(false); setAnOpen(true); } }
  function skipForm() { try { fmFlow?.skip?.(); } catch {} markOnboarded(); setFmOpen(false); setFmStepIdx(0); if (journey) { setJourney(false); setAnOpen(true); } }
  // Close every Frigade surface at once. The hero pills use this to enter a "manual
  // mode": one pill shows exactly one component instead of stacking on top of whatever
  // the guided demo already had open.
  function closeAllFlows() {
    setJourney(false);
    setAnOpen(false); setFmOpen(false); setBellOpen(false); setPanelOpen(false);
    setCkOpen(false); setBannerOpen(false); setSurveyOpen(false); setTourActive(false);
  }
  // Publish the demo actions so the Engage hero pills can replay any single flow. Each
  // click resets the others first (manual mode), so nothing overlaps. One-time flows
  // (welcome/form/survey) also clear their "seen" flag so they always show again.
  function runExperience(key: string) {
    closeAllFlows();
    switch (key) {
      case 'welcome': setAnOpen(true); break;
      case 'form': setFmStepIdx(0); setFmOpen(true); break;
      case 'tour': startTour(); break;
      case 'checklist': setCkOpen(true); break;
      case 'banner': try { localStorage.removeItem(bannerKey); } catch {} setBannerOpen(true); break;
      case 'survey': try { localStorage.removeItem(surveyKey); } catch {} setSurveyRating(null); setSurveyOpen(true); break;
      case 'changelog': markSeen(); setBellOpen(true); break;
    }
  }
  useEffect(() => { if (actionsRef) actionsRef.current = runExperience; });
  function resetDemo() {
    try {
      localStorage.setItem('frigadeUserId', 'demo-' + Math.random().toString(36).slice(2, 10));
      Object.keys(localStorage).forEach((k) => { if (k.indexOf('nw-') === 0) localStorage.removeItem(k); });
    } catch {}
    // Reset is triggered from the Engage console, so reload back into Engage (the
    // page now defaults to Assistant) with a clean slate so the journey replays.
    window.location.href = window.location.pathname + '?product=engage';
  }
  const fmFirstName = (fmValues.name || '').trim().split(/\s+/)[0] || '';
  const welcomeTitle = fmFirstName ? `Welcome, ${fmFirstName}` : ((anStep && anStep.title) || 'Welcome to the demo');
  const bnTitle = fmFirstName ? `Nice work, ${fmFirstName}` : ((bnStep && bnStep.title) || 'Nice work');

  return (
    <div ref={appRef} style={{ ...cssVars(C), position: 'relative', display: 'flex', height: 600, background: C.bg, overflow: 'hidden' }}>
      <aside style={{ width: 210, flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '13px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px 11px' }}>
          <div style={{ width: 23, height: 23, borderRadius: 7, background: C.dark, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12.5, fontWeight: 700 }}>N</div>
          <span style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-.015em', color: C.ink }}>Northwind</span>
        </div>
        <div data-tour="workspace" style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '8px 10px', borderRadius: 10, background: C.card, boxShadow: C.cardSh }}>
          <Ghost w={18} h={18} r={6} /><Ghost w={86} h={9} /><span style={{ flex: 1 }} /><ChevronsUpDown size={14} color={C.faint} />
        </div>
        <nav style={{ flex: 1, marginTop: 3 }}>
          <div style={{ padding: '14px 10px 6px' }}><Ghost w={44} h={6} r={3} /></div>
          <NavGhost w={56} active /><NavGhost w={40} />
          <NavTarget target="nav-api-keys" icon={KeyRound} label="API Keys" w={52} lit={activeTarget === 'nav-api-keys'} hint={activeHintText} onFire={fireStep} onDismiss={() => setActiveStep(null)} />
          <div style={{ padding: '14px 10px 6px' }}><Ghost w={48} h={6} r={3} /></div>
          <NavTarget target="nav-analytics" icon={BarChart3} label="Analytics" w={54} lit={activeTarget === 'nav-analytics'} hint={activeHintText} onFire={fireStep} onDismiss={() => setActiveStep(null)} />
          <NavTarget target="nav-logs" icon={ScrollText} label="Logs" w={30} lit={activeTarget === 'nav-logs'} hint={activeHintText} onFire={fireStep} onDismiss={() => setActiveStep(null)} />
          <div style={{ padding: '14px 10px 6px' }}><Ghost w={42} h={6} r={3} /></div>
          <NavGhost w={36} />
          <NavTarget target="nav-settings" icon={Settings2} label="Settings" w={48} lit={activeTarget === 'nav-settings'} hint={activeHintText} onFire={fireStep} onDismiss={() => setActiveStep(null)} />
        </nav>
        <div style={{ position: 'relative' }}>
          <button data-ck onClick={() => { setBellOpen(false); setPanelOpen(false); setCkOpen((o) => !o); if (tourActive && tourStep && tourStep.props && tourStep.props.gate === 'ck-open') advanceTour(); }} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 11px', border: 0, borderRadius: 10, background: C.card, boxShadow: C.cardSh, cursor: 'pointer', overflow: 'hidden' }}>
            <span className="ck-sweep" aria-hidden />
            <Ring pct={ckPct} /><span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 500, color: C.ink }}>Get set up</span><span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{ckPct}%</span>
          </button>
          <div className={'ck-pop' + (ckOpen ? ' open' : '')} role="dialog" aria-label="Get set up">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '12px 13px 4px' }}>
              <div><div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Get set up</div><div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{ckPct}% complete</div></div>
              <button onClick={() => setCkOpen(false)} aria-label="Close" style={{ border: 0, background: 'none', color: C.faint, padding: 3, borderRadius: 6, cursor: 'pointer', display: 'flex' }}><X size={15} /></button>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: C.bg, margin: '4px 13px 8px', overflow: 'hidden' }}><div style={{ width: ckPct + '%', height: '100%', background: C.brand, transition: 'width .4s cubic-bezier(.4,0,.2,1)' }} /></div>
            <div style={{ fontSize: 11.5, color: C.faint, padding: '0 13px 7px' }}>Pick a step and we&rsquo;ll point you to it.</div>
            <div style={{ padding: '2px 6px 4px', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {ckVisible.map((s: any) => {
                const isDone = done.has(s.id); const Ic = CK_ICONS[s.id] || Bot; const isActive = activeStep === s.id;
                // A step whose startCriteria isn't met yet renders locked: muted and
                // not clickable, with the lock in the right status slot (ring = todo,
                // check = done, lock = locked) and a tooltip on hover or keyboard
                // focus saying how to open it.
                if (!isDone && s.isBlocked) return (
                  <div key={s.id} className="ck-locked" tabIndex={0} aria-disabled="true" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 8, fontSize: 12.5, cursor: 'default', color: C.faint }}>
                    <Ic size={16} color={C.faint} />
                    <span style={{ flex: 1 }}>{s.title}</span>
                    <Lock size={15} color={C.faint} aria-label="Locked" />
                    <span className="ck-tip" role="tooltip">Finish the steps above to unlock</span>
                  </div>
                );
                return (
                  <div key={s.id} className={((isDone ? '' : 'ck-item') + (!isDone && s.id === 'go-live' ? ' ck-unlocked' : '')) || undefined} onClick={isDone || s.__mock ? undefined : () => { setCkOpen(false); if (s.props && s.props.action === 'tour') startTour(); else setActiveStep(s.id); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 8, fontSize: 12.5, cursor: isDone || s.__mock ? 'default' : 'pointer', color: isDone ? C.muted : C.ink2, background: isActive ? C.brandWeak : 'transparent' }}>
                    <Ic size={16} color={isDone ? C.muted : C.brand} />
                    <span style={{ flex: 1, textDecoration: isDone ? 'line-through' : 'none' }}>{s.title}</span>
                    {isDone ? <CheckCircle2 size={19} color={C.brand} /> : <span style={{ width: 18, height: 18, borderRadius: '50%', border: `1.6px solid ${isActive ? C.brand : C.line}` }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px 2px' }}>
          <Ghost w={18} h={18} r={6} /><Ghost w={64} h={8} /><span style={{ flex: 1 }} /><Ghost w={14} h={14} r={5} />
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, margin: '14px 16px 16px 6px', background: C.card, borderRadius: 14, boxShadow: STAGE_SH, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 18px 11px' }}>
          <Ghost w={72} h={13} r={5} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, width: 148, height: 32, padding: '0 10px', borderRadius: 9, background: C.bg }}><Search size={14} color={C.faint} /><Ghost w={56} h={8} /></div>
            <button data-target="theme" onClick={() => { setDark((d) => !d); if (tourActive && tourStep && tourStep.props && tourStep.props.gate === 'theme') advanceTour(); }} aria-label="Toggle theme" style={{ width: 32, height: 32, borderRadius: 9, background: C.card, boxShadow: C.cardSh, border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, cursor: 'pointer' }}>{dark ? <Moon size={16} /> : <Sun size={16} />}</button>
            <div style={{ padding: '0 14px', height: 32, display: 'flex', alignItems: 'center', borderRadius: 9, background: C.card, boxShadow: C.cardSh }}><Ghost w={36} h={8} /></div>
            <div style={{ position: 'relative' }} data-target="create-agent">
              <button onClick={() => { const lit = activeTarget === 'create-agent'; completeStep('create-agent'); setActiveStep(null); if (lit) setCkOpen(true); if (tourActive && tourStep && tourStep.props && tourStep.props.gate === 'create-agent') advanceTour(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 9, fontSize: 12.5, fontWeight: 600, background: C.dark, color: '#fff', border: 0, cursor: 'pointer', boxShadow: activeTarget === 'create-agent' ? `0 0 0 2px ${C.brand}, 0 0 0 5px ${C.brandWeak}` : 'none', transition: 'box-shadow .2s ease' }}><Plus size={15} /> Create Agent</button>
              {activeTarget === 'create-agent' && <HintBubble text={activeHintText} side="bottom" onDismiss={() => setActiveStep(null)} />}
            </div>
            <button data-cl-bell onClick={toggleBell} aria-label="Product updates" style={{ position: 'relative', width: 32, height: 32, borderRadius: 9, background: C.card, boxShadow: C.cardSh, border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: bellOpen ? C.brand : C.ink2, cursor: 'pointer' }}>
              <Bell size={17} />{unseenCount > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: C.brand, boxShadow: `0 0 0 2px ${C.card}`, animation: 'nwpulse 1.9s infinite' }} />}
            </button>
          </div>
        </div>
        {bannerOpen && bnStep && (
          <div className="nw-banner" style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '0 16px 2px', padding: '12px 14px', borderRadius: 11, background: C.brandWeak, boxShadow: `inset 0 0 0 1px ${C.brand}33` }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: C.brand, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={17} strokeWidth={2.2} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{bnTitle}</div>
              <div style={{ fontSize: 12, lineHeight: 1.45, color: C.ink2, marginTop: 1 }}>{bnStep.subtitle}</div>
            </div>
            <button onClick={closeBanner} aria-label="Dismiss" style={{ border: 0, background: 'none', color: C.brand, padding: 4, borderRadius: 6, cursor: 'pointer', display: 'flex', flexShrink: 0 }}><X size={16} /></button>
          </div>
        )}
        <div style={{ padding: '4px 10px 0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{[38, 30, 40, 44, 0].map((w, i) => (<th key={i} style={{ textAlign: 'left', padding: '11px 12px', borderBottom: `1px solid ${C.line}` }}>{w ? <Ghost w={w} h={7} r={3} /> : null}</th>))}</tr></thead>
            <tbody>
              {[0, 1, 2].map((i) => (
                <tr key={i}>
                  <td style={{ padding: '13px 12px', borderBottom: `1px solid ${C.line}` }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Ghost w={27} h={27} r={8} /><Ghost w={[116, 92, 122][i]} h={9} /></div></td>
                  <td style={{ padding: '13px 12px', borderBottom: `1px solid ${C.line}` }}><Ghost w={[78, 64, 86][i]} h={18} r={6} /></td>
                  <td style={{ padding: '13px 12px', borderBottom: `1px solid ${C.line}` }}><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Ghost w={7} h={7} r={4} /><Ghost w={46} h={8} /></div></td>
                  <td style={{ padding: '13px 12px', borderBottom: `1px solid ${C.line}` }}><Ghost w={44} h={8} /></td>
                  <td style={{ padding: '13px 12px', borderBottom: `1px solid ${C.line}`, color: '#cdd2db', fontWeight: 700, letterSpacing: 1 }}>&#8942;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <div style={{ position: 'absolute', right: 16, bottom: 14, zIndex: 20 }}>
        <div className={'dc-pop' + (consoleOpen ? ' open' : '')} role="dialog" aria-label="Demo controls">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px 6px' }}><DotGrid color={C.brand} size={14} /><span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Demo controls</span></div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', color: C.faint, textTransform: 'uppercase', padding: '4px 14px 7px' }}>Replay an experience</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 12px 11px' }}>
            {([['Welcome', Megaphone, () => setAnOpen(true)], ['Form', ClipboardList, () => { setFmStepIdx(0); setFmOpen(true); }], ['Tour', Route, () => startTour()], ['Checklist', ListChecks, () => { setBellOpen(false); setPanelOpen(false); setCkOpen(true); }], ['Banner', Flag, () => { try { localStorage.removeItem(bannerKey); } catch {} setBannerOpen(true); }], ['Survey', MessageSquare, () => { try { localStorage.removeItem(surveyKey); } catch {} setSurveyRating(null); setSurveyOpen(true); }], ['Changelog', Newspaper, () => { setCkOpen(false); markSeen(); setBellOpen(true); }]] as [string, IconType, () => void][]).map(([label, Ic, fn]) => (
              <button key={label} onClick={() => { setConsoleOpen(false); fn(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: C.ink2, background: C.card, border: `1px solid ${C.line}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}><Ic size={13} color={C.brand} strokeWidth={2} />{label}</button>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.line}`, padding: '10px 12px 12px' }}>
            <button onClick={resetDemo} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: C.brand, background: C.brandWeak, border: 0, borderRadius: 9, padding: '9px', cursor: 'pointer' }}><RotateCcw size={14} /> Reset demo</button>
          </div>
        </div>
        <button onClick={() => setConsoleOpen((o) => !o)} data-dc style={{ display: 'flex', alignItems: 'center', gap: 9, background: C.card, color: C.ink, padding: '8px 13px', borderRadius: 999, boxShadow: `0 8px 24px rgba(18,24,40,.16), 0 0 0 1px ${C.line}`, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: 0 }}>
          <DotGrid color={C.brand} /> Frigade Demo Console <ChevronUp size={15} color={C.faint} style={{ transform: consoleOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
      </div>

      {/* ---- Changelog surfaces (live, headless useFlow) ---- */}
      <div className={'cl-scrim' + (bellOpen || panelOpen ? ' open' : '')} onClick={() => { setBellOpen(false); setPanelOpen(false); }} />
      <aside className={'cl-bell' + (bellOpen ? ' open' : '')} role="dialog" aria-label="Product updates">
        <PanelHead onClose={() => setBellOpen(false)} />
        <div className="cl-list">{!flow && <div style={{ padding: 20, color: C.faint, fontSize: 13 }}>Loading&hellip;</div>}{renderEntries(steps, newIds)}</div>
      </aside>

      {/* Welcome announcement — split modal with a "what's inside" asset panel (headless useFlow) */}
      {anOpen && anStep && (
        <>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,21,26,.34)', zIndex: 50 }} />
          <div className="nw-hint" role="dialog" aria-label="Welcome" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', width: 600, maxWidth: '94%', background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 80px rgba(18,24,40,.34), 0 0 0 1px rgba(18,24,40,.05)', zIndex: 51 }}>
            <div style={{ flex: 1, minWidth: 0, padding: '30px 30px 28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}><Route size={23} strokeWidth={2} /></div>
              <h3 style={{ margin: '0 0 9px', fontSize: 23, fontWeight: 700, letterSpacing: '-.02em', color: C.ink, lineHeight: 1.15 }}>{welcomeTitle}</h3>
              {anStep.subtitle && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: C.muted }}>{anStep.subtitle}</p>}
              <div style={{ flex: 1, minHeight: 22 }} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {anPrimary && <button onClick={() => { closeAnnouncement(true); startTour(); }} style={{ background: C.brand, color: '#fff', fontSize: 13.5, fontWeight: 600, padding: '11px 20px', borderRadius: 11, border: 0, cursor: 'pointer', boxShadow: '0 1px 2px rgba(1,94,251,.35), 0 0 0 1px rgba(1,94,251,.25)' }}>{anPrimary}</button>}
                {anSecondary && <button onClick={() => closeAnnouncement(false)} style={{ border: 0, background: 'none', color: C.muted, fontSize: 13, fontWeight: 600, padding: '10px 8px', borderRadius: 9, cursor: 'pointer' }}>{anSecondary}</button>}
              </div>
            </div>
            <div style={{ width: 236, flexShrink: 0, background: C.wash, borderLeft: `1px solid ${C.washLine}`, padding: '26px 22px', position: 'relative' }}>
              <button onClick={() => closeAnnouncement(false)} aria-label="Close" style={{ position: 'absolute', top: 12, right: 12, border: 0, background: 'none', color: C.faint, padding: 4, borderRadius: 7, cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.faint, marginBottom: 13 }}>What&rsquo;s inside</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {([[Route, 'Product tour', 'A guided, 3-step walkthrough'], [ListChecks, 'Setup checklist', 'Hints that light up the UI'], [Newspaper, 'Changelog', '5 new updates to read']] as [IconType, string, string][]).map(([Ic, t, s]) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 11, background: C.card, borderRadius: 11, padding: '11px 12px', boxShadow: `0 0 0 1px ${C.line}` }}>
                    <span style={{ width: 30, height: 30, borderRadius: 9, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic size={16} strokeWidth={2} /></span>
                    <div style={{ minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{t}</div><div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</div></div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 4px 0', fontSize: 11.5, fontWeight: 500, color: C.muted }}><Plus size={13} /> Banners, surveys, and more</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Onboarding form — wide, floating split modal with a live asset panel (headless useFlow) */}
      {fmOpen && (() => {
        const f = FORM_FIELDS[fmStepIdx];
        const last = fmStepIdx >= FORM_FIELDS.length - 1;
        const canNext = !f.required || !!((fmValues[f.id] || '').trim());
        return (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,21,26,.34)', zIndex: 50 }} />
            <div className="nw-hint" role="dialog" aria-label="Set up your workspace" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', width: 760, maxWidth: '94%', background: C.card, borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 80px rgba(18,24,40,.34), 0 0 0 1px rgba(18,24,40,.05)', zIndex: 51 }}>
              <div style={{ flex: 1, minWidth: 0, padding: '26px 30px 28px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ display: 'flex', gap: 4 }}>{FORM_FIELDS.map((_, i) => (<span key={i} style={{ height: 4, width: 20, borderRadius: 99, background: i <= fmStepIdx ? C.brand : C.line, transition: 'background .25s ease' }} />))}</div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: C.faint }}>Step {fmStepIdx + 1} of {FORM_FIELDS.length}</span>
                  </div>
                  <button onClick={skipForm} style={{ border: 0, background: 'none', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: '4px 6px' }}>Skip</button>
                </div>
                <h3 style={{ margin: '0 0 7px', fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', color: C.ink, lineHeight: 1.2 }}>{f.title}</h3>
                <p style={{ margin: '0 0 20px', fontSize: 13.5, lineHeight: 1.5, color: C.muted }}>{f.help}</p>
                <div style={{ flex: 1 }}>
                  {f.type === 'text' ? (
                    <input autoFocus className="nw-input" value={fmValues[f.id] || ''} onChange={(e) => setFmValues((v) => ({ ...v, [f.id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter' && canNext) advanceForm(last); }} placeholder={f.placeholder} style={{ width: '100%', padding: '12px 14px', borderRadius: 11, border: `1px solid ${C.line}`, background: C.bg, fontSize: 14.5, color: C.ink, outline: 'none', boxSizing: 'border-box' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(f.options || []).map((opt) => {
                        const sel = fmValues[f.id] === opt;
                        return (
                          <button key={opt} onClick={() => setFmValues((v) => ({ ...v, [f.id]: opt }))} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', borderRadius: 11, cursor: 'pointer', textAlign: 'left', border: `1px solid ${sel ? C.brand : C.line}`, background: sel ? C.brandWeak : C.card, boxShadow: sel ? `0 0 0 1px ${C.brand}` : 'none', transition: 'all .14s ease' }}>
                            <span style={{ fontSize: 13.5, fontWeight: 500, color: sel ? C.brand : C.ink }}>{opt}</span>
                            <span style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: sel ? 'none' : `1.5px solid ${C.line}`, background: sel ? C.brand : C.card }}>{sel && <Check size={12} color="#fff" strokeWidth={3} />}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 24 }}>
                  <button onClick={() => setFmStepIdx((i) => Math.max(0, i - 1))} style={{ border: 0, background: 'none', color: fmStepIdx === 0 ? 'transparent' : C.muted, fontSize: 13, fontWeight: 600, cursor: fmStepIdx === 0 ? 'default' : 'pointer', padding: '8px 4px' }}>Back</button>
                  <button onClick={() => advanceForm(last)} disabled={!canNext} style={{ background: canNext ? C.brand : '#aebbd6', color: '#fff', fontSize: 13.5, fontWeight: 600, padding: '11px 24px', borderRadius: 11, border: 0, cursor: canNext ? 'pointer' : 'default', boxShadow: canNext ? '0 1px 2px rgba(1,94,251,.35), 0 0 0 1px rgba(1,94,251,.25)' : 'none' }}>{last ? 'Finish setup' : 'Continue'}</button>
                </div>
              </div>
              <div style={{ width: 312, flexShrink: 0, background: C.wash, borderLeft: `1px solid ${C.washLine}`, padding: '26px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {FORM_FIELDS.map((ff, i) => {
                  const fdone = i < fmStepIdx; const fcur = i === fmStepIdx; const val = fmValues[ff.id];
                  return (
                    <div key={ff.id} style={{ display: 'flex', gap: 11 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: (fdone || fcur) ? C.brand : C.card, border: (fdone || fcur) ? 'none' : `1.5px solid ${C.line}`, color: (fdone || fcur) ? '#fff' : C.muted, fontSize: 11.5, fontWeight: 700 }}>{fdone ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
                        {i < FORM_FIELDS.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 16, background: fdone ? C.brand : C.line }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0, marginBottom: i < FORM_FIELDS.length - 1 ? 8 : 0, background: C.card, borderRadius: 10, padding: '8px 11px', boxShadow: fcur ? `0 0 0 1px ${C.brand}, 0 6px 16px rgba(1,94,251,.12)` : `0 0 0 1px ${C.line}`, transition: 'box-shadow .2s ease' }}>
                        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: fcur ? C.brand : C.faint }}>{ff.short}</div>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: val ? C.ink : C.faint, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val || ff.ph}</div>
                      </div>
                    </div>
                  );
                })}
                <div style={{ fontSize: 11.5, lineHeight: 1.5, color: C.muted, marginTop: 14, display: 'flex', alignItems: 'center', gap: 7 }}><DotGrid color={C.brand} size={13} />Routes on every answer, in real time.</div>
              </div>
            </div>
          </>
        );
      })()}

      {/* Product tour — custom spotlight + coachmark, action-gated, headless useFlow */}
      {tourActive && tourStep && tb && (
        <>
          <div aria-hidden style={{ position: 'absolute', top: tb.sTop, left: tb.sLeft, width: tb.sW, height: tb.sH, borderRadius: 11, boxShadow: '0 0 0 9999px rgba(20,21,26,.5)', zIndex: 55, pointerEvents: 'none', transition: 'all .32s cubic-bezier(.4,0,.2,1)' }} />
          <div className="nw-hint" role="dialog" aria-label="Product tour" style={{ position: 'absolute', top: tb.cTop, left: tb.cLeft, transform: tb.place === 'top' ? 'translateY(-100%)' : 'none', width: 290, background: C.card, borderRadius: 14, boxShadow: `0 18px 50px rgba(18,24,40,.28), 0 0 0 1px ${C.line}`, zIndex: 56, padding: '16px 17px', transition: 'top .3s cubic-bezier(.4,0,.2,1), left .3s cubic-bezier(.4,0,.2,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
              <DotGrid color={C.brand} size={14} />
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.brand }}>Step {tourIdx + 1} of {tourSteps.length}</span>
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: 15.5, fontWeight: 700, letterSpacing: '-.01em', color: C.ink }}>{tourStep.title}</h4>
            {tourStep.subtitle && <p style={{ margin: '0 0 14px', fontSize: 13, lineHeight: 1.5, color: C.ink2 }}>{tourStep.subtitle}</p>}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <button onClick={skipTour} style={{ border: 0, background: 'none', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', padding: '6px 2px' }}>Skip tour</button>
              {tourStep.props && tourStep.props.gate
                ? <span style={{ fontSize: 12.5, fontWeight: 600, color: C.brand, display: 'flex', alignItems: 'center', gap: 7 }}><span className="nw-gate-dot" aria-hidden />{GATE_LABELS[tourStep.props.gate] || 'Take the action'}</span>
                : <button onClick={advanceTour} style={{ background: C.brand, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 9, border: 0, cursor: 'pointer', boxShadow: '0 1px 2px rgba(1,94,251,.35), 0 0 0 1px rgba(1,94,251,.25)' }}>{tourIdx >= tourSteps.length - 1 ? 'Finish' : 'Next'}</button>}
            </div>
          </div>
        </>
      )}

      {/* Survey — floats up from the bottom, non-blocking NPS style; self-aware copy + lead-gen CTA */}
      {surveyOpen && svStep && (
        <div className="nw-rise" role="dialog" aria-label="Survey" style={{ position: 'absolute', left: '50%', bottom: 18, transform: 'translateX(-50%)', width: 372, maxWidth: 'calc(100% - 32px)', background: C.card, borderRadius: 14, boxShadow: `0 18px 48px rgba(18,24,40,.28), 0 0 0 1px ${C.line}`, zIndex: 46, padding: '17px 18px 16px' }}>
          <button onClick={dismissSurvey} aria-label="Dismiss" style={{ position: 'absolute', top: 12, right: 12, border: 0, background: 'none', color: C.faint, padding: 3, borderRadius: 6, cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: surveyRating === null ? 13 : 9, paddingRight: 18 }}>
            <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={16} strokeWidth={2} /></span>
            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, letterSpacing: '-.01em', color: C.ink }}>{surveyRating === null ? svStep.title : 'Thanks for the feedback'}</h3>
          </div>
          {surveyRating === null ? (
            <>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} className="nw-rate" onClick={() => pickRating(n)} style={{ flex: 1, height: 38, borderRadius: 9, border: `1px solid ${C.line}`, background: C.card, color: C.ink2, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>{n}</button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: C.faint }}><span>Not for me</span><span>Love it</span></div>
            </>
          ) : (
            <>
              {svStep.subtitle && <p style={{ margin: '0 0 14px', fontSize: 12.5, lineHeight: 1.5, color: C.muted }}>{svStep.subtitle}</p>}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button data-cal-link={CAL_LINK} data-cal-namespace={CAL_NS} data-cal-config={CAL_CONFIG} style={{ background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '9px 16px', borderRadius: 9, border: 0, cursor: 'pointer', boxShadow: CTA_BRAND }}>{(svStep.primaryButton && svStep.primaryButton.title) || 'Grab a time with us'}</button>
                <a href={APP_URL} target="_blank" rel="noreferrer" style={{ color: C.ink2, fontSize: 13, fontWeight: 600, padding: '8px 13px', borderRadius: 8, border: `1px solid ${C.line}`, textDecoration: 'none' }}>{(svStep.secondaryButton && svStep.secondaryButton.title) || 'Get started'}</a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function BrowserFrame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const C = palette(dark);
  return (
    <div style={{ width: '100%', borderRadius: 13, overflow: 'hidden', background: C.card, boxShadow: '0 30px 80px rgba(18,24,40,.16), 0 2px 8px rgba(18,24,40,.07), 0 0 0 1px rgba(18,24,40,.05)' }}>
      <div style={{ height: 46, display: 'flex', alignItems: 'center', gap: 14, padding: '0 15px', background: C.frame, borderBottom: `1px solid ${C.frameBorder}` }}>
        <div style={{ display: 'flex', gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} /><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} /><span style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} /></div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 'min(440px, 60%)', padding: '6px 13px', borderRadius: 8, background: C.card, color: C.muted, fontSize: 12.5, boxShadow: `inset 0 0 0 1px ${C.line}` }}>
            <Lock size={12} color="#16a34a" /><span style={{ color: C.ink2 }}>app.northwind.ai</span><span>/agents</span>
          </div>
        </div>
        {/* A real link in the fake chrome: "view source" on this window opens the actual
            repo, because everything you're poking at here is public code. */}
        <a className="nw-src" href="https://github.com/FrigadeHQ/demo" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={GH_PATH} /></svg>
          View source
        </a>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', color: C.brand, background: C.brandWeak, padding: '4px 9px', borderRadius: 6 }}>DEMO</span>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Marketing header mirror. A faithful copy of frigade.com's header (grid, links,
// dropdowns, buttons, mobile menu), with every destination pointing at the real
// marketing site in the same tab, so this domain reads as the same website.
// The one deliberate divergence: the product picker is not in the header. It sits
// above the hero as ProductPill, the same pill frigade.com shows there, except
// ours swaps the demo variant in place instead of navigating between pages.
// ---------------------------------------------------------------------------
// Nav links mirror frigade.com's header for the CURRENT product, matching how the
// marketing site itself changes on /engage: How It Works is dropped there, Pricing
// scopes to /engage/pricing, and Get Started points at the Engage app instead of
// the Assistant sign-up. Updates, Blog, and About are shared across both.
const MKT_NAV: Record<ProductKey, { t: string; h: string }[]> = {
  assistant: [
    { t: 'How It Works', h: '/how-it-works' }, { t: 'Pricing', h: '/pricing' },
    { t: 'Updates', h: '/updates' }, { t: 'Blog', h: '/blog' }, { t: 'About', h: '/about' },
  ],
  engage: [
    { t: 'Pricing', h: '/engage/pricing' },
    { t: 'Updates', h: '/updates' }, { t: 'Blog', h: '/blog' }, { t: 'About', h: '/about' },
  ],
};
// Copy, colors, and destinations lifted verbatim from the live frigade.com header.
const PRODUCT_META = {
  assistant: { label: 'Assistant', tile: '#015efb', icon: Sparkles, desc: 'AI that learns your product and guides users in real time.', mkt: 'https://frigade.com/', signIn: 'https://app.frigade.ai/sign-in', signInDesc: 'Manage your AI assistant' },
  engage: { label: 'Engage', tile: '#2d4976', icon: CodeXml, desc: 'Drop-in React components for onboarding and product tours.', mkt: 'https://frigade.com/engage', signIn: 'https://app.frigade.com/sign-in', signInDesc: 'Build onboarding flows' },
} as const;
type ProductKey = keyof typeof PRODUCT_META;

function ProductTile({ k, size, radius, iconSize }: { k: ProductKey; size: number; radius: number; iconSize: number }) {
  const Icon = PRODUCT_META[k].icon;
  return (
    <span style={{ flexShrink: 0, width: size, height: size, borderRadius: radius, background: PRODUCT_META[k].tile, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)' }}>
      <Icon size={iconSize} strokeWidth={2.4} />
    </span>
  );
}

// One row inside the Products / Login dropdowns: icon tile + title + description.
function MktPanelItem({ k, i, login }: { k: ProductKey; i: number; login?: boolean }) {
  const m = PRODUCT_META[k];
  return (
    <a href={login ? m.signIn : m.mkt} className="mh-item" style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: login ? '8px 10px' : '10px', borderRadius: 12, textDecoration: 'none', animation: `mhItemIn .22s cubic-bezier(.4,0,.2,1) ${i * 0.04}s both` }}>
      <ProductTile k={k} size={28} radius={9} iconSize={15} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left', paddingTop: login ? 0 : 1 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.ink, lineHeight: 1.3 }}>{m.label}</span>
        <span style={{ fontSize: 12.5, lineHeight: 1.35, color: C.muted }}>{login ? m.signInDesc : m.desc}</span>
      </span>
    </a>
  );
}

const MKT_PANEL_CHROME: React.CSSProperties = { position: 'absolute', top: 'calc(100% + 15px)', padding: 6, borderRadius: 16, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(230,232,238,0.8)', boxShadow: '0 18px 44px rgba(18,24,40,.14), 0 4px 12px rgba(18,24,40,.06)', zIndex: 60 };

function MarketingHeader() {
  const { experience } = useExperience();
  const product: ProductKey = experience === 'engage' ? 'engage' : 'assistant';
  const nav = MKT_NAV[product];
  // Same CTA targets the marketing header uses on each product's page.
  const getStartedHref = product === 'engage' ? APP_URL : APP_URL_ASSISTANT;
  const [open, setOpen] = useState<'products' | 'login' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  // The two products share most nav links but not all (Engage drops How It Works and
  // scopes Pricing), so swapping them in place makes the centered cluster snap
  // sideways. The marketing site never shows that snap (its product switch is a full
  // page load), so when the pill swaps products here, remount the nav and drop the
  // links in with the same staggered motion the header dropdowns use. The first paint
  // stays static: only actual product changes animate.
  const prevProduct = useRef(product);
  const [navSwaps, setNavSwaps] = useState(0);
  useEffect(() => {
    if (prevProduct.current === product) return;
    prevProduct.current = product;
    setNavSwaps((n) => n + 1);
  }, [product]);
  const navAnim = (i: number): React.CSSProperties =>
    navSwaps === 0 ? {} : { animation: `mhItemIn .22s cubic-bezier(.4,0,.2,1) ${i * 0.04}s both` };
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (barRef.current && !barRef.current.contains(e.target as Node)) setOpen(null); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  // The mobile overlay owns the viewport while open, so park page scroll.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileOpen]);
  const chev = (on: boolean) => <ChevronDown size={14} strokeWidth={2.2} style={{ transform: on ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease', opacity: 0.55 }} />;
  const logo = <a href="https://frigade.com" aria-label="Frigade" style={{ display: 'inline-flex' }}><img src="/images/frigade-logo.svg" alt="Frigade" width={95} height={32} style={{ display: 'block' }} /></a>;
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid rgba(34,34,79,0.06)', flexShrink: 0 }}>
      <div ref={barRef} className="mh-bar" style={{ maxWidth: 1288, margin: '0 auto', height: 79, padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'center' }}>
        <div style={{ gridColumn: 1, justifySelf: 'start', display: 'inline-flex' }}>{logo}</div>
        <nav key={navSwaps} className="mh-nav" aria-label="Frigade" style={{ gridColumn: 2, justifySelf: 'center', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative', display: 'inline-flex', ...navAnim(0) }}>
            <button type="button" className="mh-link" aria-haspopup="menu" aria-expanded={open === 'products'} onClick={() => setOpen(open === 'products' ? null : 'products')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 0, padding: 0, cursor: 'pointer', fontSize: 14, fontWeight: 500, fontFamily: 'inherit', color: open === 'products' ? C.brand : C.ink }}>
              Products {chev(open === 'products')}
            </button>
            {open === 'products' && <span aria-hidden style={{ position: 'absolute', left: '50%', top: 'calc(100% + 6px)', width: 6, height: 6, background: C.brand, borderRadius: 1, transform: 'translateX(-50%) rotate(45deg)' }} />}
            {open === 'products' && (
              <div className="mh-panel" style={{ ...MKT_PANEL_CHROME, left: '50%', marginLeft: -180, width: 360 }}>
                <MktPanelItem k="assistant" i={0} /><MktPanelItem k="engage" i={1} />
              </div>
            )}
          </div>
          {nav.map((l, i) => <a key={l.t} className="mh-link" href={'https://frigade.com' + l.h} style={{ fontSize: 14, fontWeight: 500, color: C.ink, textDecoration: 'none', ...navAnim(i + 1) }}>{l.t}</a>)}
        </nav>
        <div style={{ gridColumn: 3, justifySelf: 'end', display: 'flex', alignItems: 'center' }}>
          <div className="mh-right" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <button type="button" aria-haspopup="menu" aria-expanded={open === 'login'} onClick={() => setOpen(open === 'login' ? null : 'login')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, fontFamily: 'inherit', color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, border: 0, cursor: 'pointer' }}>
                Login {chev(open === 'login')}
              </button>
              {open === 'login' && (
                <div className="mh-panel" style={{ ...MKT_PANEL_CHROME, right: 0, width: 340 }}>
                  <MktPanelItem k="assistant" i={0} login /><MktPanelItem k="engage" i={1} login />
                </div>
              )}
            </div>
            <a href={getStartedHref} style={{ display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get Started</a>
          </div>
          <button type="button" className="mh-burger" aria-label="Open menu" onClick={() => setMobileOpen(true)} style={{ display: 'none', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, background: 'none', border: 0, color: C.ink, cursor: 'pointer' }}><Menu size={22} strokeWidth={2} /></button>
        </div>
      </div>
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: 79, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid rgba(34,34,79,0.06)' }}>
            {logo}
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, background: 'none', border: 0, color: C.ink, cursor: 'pointer' }}><X size={22} strokeWidth={2} /></button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 16px' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: '#8b93a5' }}>Products</p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(Object.keys(PRODUCT_META) as ProductKey[]).map((k) => (
                <a key={k} className="mh-item" href={PRODUCT_META[k].mkt} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', margin: '0 -8px', borderRadius: 12, textDecoration: 'none' }}>
                  <ProductTile k={k} size={32} radius={9} iconSize={17} />
                  <span style={{ fontSize: 16, fontWeight: 500, color: C.ink }}>{PRODUCT_META[k].label}</span>
                </a>
              ))}
            </div>
            <p style={{ margin: '32px 0 0', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: '#8b93a5' }}>Company</p>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column' }}>
              {nav.map((l) => <a key={l.t} href={'https://frigade.com' + l.h} style={{ padding: '10px 0', fontSize: 16, fontWeight: 500, color: C.ink, textDecoration: 'none' }}>{l.t}</a>)}
            </div>
          </div>
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '20px 24px', borderTop: '1px solid rgba(34,34,79,0.06)' }}>
            <a href={PRODUCT_META[product].signIn} style={{ display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, textDecoration: 'none' }}>Login</a>
            <a href={getStartedHref} style={{ display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get Started</a>
          </div>
        </div>
      )}
    </header>
  );
}

// The frigade.com hero pill, reused as the demo's product switcher: identical
// look, but picking a product swaps the demo variant in place (?product=)
// instead of navigating to another page.
function ProductPill() {
  const { experience, setExperience } = useExperience();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open]);
  const cur: ProductKey = experience === 'engage' ? 'engage' : 'assistant';
  return (
    // The hero's entrance animations (fill: forwards on opacity/transform) leave every
    // sibling a stacking context, so without an explicit z-index the open menu paints
    // underneath the headline. Raise the whole pill above its hero siblings.
    <div ref={wrapRef} style={{ position: 'relative', zIndex: 30, display: 'inline-flex', justifyContent: 'center' }}>
      <button type="button" className="mh-pill" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 8, background: '#fff', border: `1px solid ${C.line}`, cursor: 'pointer', fontFamily: 'inherit' }}>
        <ProductTile k={cur} size={20} radius={7} iconSize={12} />
        <span style={{ fontSize: 14, fontWeight: 500, color: 'rgb(26,27,47)' }}>{PRODUCT_META[cur].label}</span>
        <ChevronDown size={14} strokeWidth={2.2} color="#8b93a5" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease' }} />
      </button>
      {open && (
        // Sized like frigade.com's pill menu (min 152px, grows to fit): a fixed width
        // makes the longer Assistant row overflow into its own padding and shove the
        // active marker off the edge.
        <div className="mh-panel" role="menu" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', width: 'max-content', minWidth: 152, padding: 5, borderRadius: 12, background: '#fff', border: '1px solid rgba(230,232,238,0.8)', boxShadow: '0 14px 36px rgba(18,24,40,.16), 0 3px 9px rgba(18,24,40,.07)', zIndex: 20 }}>
          {(Object.keys(PRODUCT_META) as ProductKey[]).map((k, i) => (
            <button key={k} type="button" role="menuitem" className="mh-item" onClick={() => { setExperience(k); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '6px 8px', borderRadius: 8, background: 'none', border: 0, cursor: 'pointer', fontFamily: 'inherit', animation: `mhItemIn .22s cubic-bezier(.4,0,.2,1) ${i * 0.04}s both` }}>
              <ProductTile k={k} size={20} radius={7} iconSize={12} />
              <span style={{ fontSize: 14, fontWeight: 500, color: 'rgb(26,27,47)' }}>{PRODUCT_META[k].label}</span>
              <span style={{ flex: 1, minWidth: 12 }} />
              {/* Active marker, mirrored from frigade.com's pill menu: a 6px gradient
                  diamond with a second copy behind it that pings outward, so the
                  current product reads as live. */}
              {cur === k && (
                <span aria-hidden style={{ position: 'relative', width: 6, height: 6, flexShrink: 0 }}>
                  <span className="mh-live" style={{ position: 'absolute', inset: 0, borderRadius: 1.5, background: 'linear-gradient(rgb(1,94,251) 0%, rgba(1,94,251,.92) 100%)' }} />
                  <span style={{ position: 'absolute', inset: 0, borderRadius: 1.5, transform: 'rotate(45deg)', background: 'linear-gradient(rgb(1,94,251) 0%, rgba(1,94,251,.92) 100%)' }} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// GitHub mark path, shared by the footer icon, the skill CTA, and the demo frame's
// view-source link (each at its own size).
const GH_PATH = 'M12 .5a11.5 11.5 0 0 0-3.63 22.43c.58.1.79-.25.79-.56v-2.18c-3.21.7-3.89-1.37-3.89-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.35.78 1.03.78 2.08v3.08c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z';
const SOCIAL_ICON: Record<string, React.ReactNode> = {
  github: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d={GH_PATH} /></svg>,
  linkedin: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.56c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.65H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0Z" /></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.16 17.52h1.833L7.084 4.126H5.117l11.967 15.644Z" /></svg>,
};
// Footer columns mirror the live Frigade marketing site's published links.
const FOOTER_COLS: { heading: string; links: { t: string; h: string }[] }[] = [
  { heading: 'Features', links: [{ t: 'Skills', h: '/features/skills' }, { t: 'AI-Generated Tours', h: '/features/ai-generated-tours' }, { t: 'Suggestions', h: '/features/suggestions' }, { t: 'Tool Calls', h: '/features/tool-calls' }, { t: 'Always Accurate', h: '/features/always-accurate' }, { t: 'Integrations', h: '/features/integrations' }, { t: 'Insights', h: '/features/insights' }, { t: 'Feedback', h: '/features/feedback' }, { t: 'Developer', h: '/features/developer' }] },
  { heading: 'Use Cases', links: [{ t: 'Support Deflection', h: '/use-cases/support-deflection' }, { t: 'User Activation', h: '/use-cases/user-activation' }, { t: 'Virtual CSM', h: '/use-cases/virtual-csm' }, { t: 'Feature Adoption', h: '/use-cases/feature-adoption' }, { t: 'Expansion & Upsell', h: '/use-cases/expansion-upsell' }] },
  { heading: 'Resources', links: [{ t: 'How It Works', h: '/how-it-works' }, { t: 'Blog', h: '/blog' }, { t: 'Updates', h: '/updates' }, { t: 'Product Onboarding', h: 'https://productonboarding.com' }] },
  { heading: 'Compare', links: [{ t: 'vs. Intercom Fin', h: '/compare/fin' }, { t: 'vs. Pendo', h: '/compare/pendo' }, { t: 'vs. Pylon', h: '/compare/pylon' }, { t: 'vs. Zendesk', h: '/compare/zendesk' }, { t: 'vs. WalkMe', h: '/compare/walkme' }] },
  { heading: 'Case Studies', links: [{ t: 'Valley', h: '/case-studies/valley' }, { t: 'Hotplate', h: '/case-studies/hotplate' }] },
  { heading: 'Company', links: [{ t: 'About', h: '/about' }, { t: 'Pricing', h: '/pricing' }, { t: 'Contact us', h: '/contact' }, { t: 'Get a demo', h: '/demo' }] },
];
const FOOTER_PRODUCTS: { name: string; h: string; beta?: boolean }[] = [
  { name: 'Assistant', h: '/' }, { name: 'Engage', h: '/engage' },
];
// Faithful port of the marketing site footer (marketing-ai-experiment): light
// link-column section + dark band with the compass, watermark, status pill, legal.
function MarketingFooter() {
  const ext = (h: string) => (h.startsWith('http') ? h : 'https://frigade.com' + h);
  const head: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: C.ink, margin: 0 };
  const link: React.CSSProperties = { fontSize: 13, color: C.ink, textDecoration: 'none' };
  const legal: React.CSSProperties = { fontSize: 12, color: '#0355f8', textDecoration: 'none' };
  return (
    <footer style={{ position: 'relative', fontFamily: FONT }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px', borderTop: `1px solid ${C.hair}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 210px) 1fr', gap: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
            <img src="/images/frigade-logo.svg" alt="Frigade" style={{ height: 25, width: 'auto', display: 'block' }} />
            <div style={{ fontSize: 13, lineHeight: 1.55, color: C.muted }}>945 Market St.<br />San Francisco, CA 94103</div>
            <img src="/images/aicpa-soc-badge.avif" alt="AICPA SOC for Service Organizations" width={72} height={72} style={{ width: 72, height: 72, marginTop: 6 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              {([['github', 'https://github.com/FrigadeHQ'], ['linkedin', 'https://www.linkedin.com/company/frigade'], ['x', 'https://x.com/FrigadeHQ']] as [string, string][]).map(([p, h]) => (
                <a key={p} href={h} aria-label={p} style={{ width: 32, height: 32, borderRadius: 999, border: `1px solid ${C.line}`, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>{SOCIAL_ICON[p]}</a>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '36px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={head}>Product</p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {FOOTER_PRODUCTS.map((p) => (
                  <li key={p.name}><a href={ext(p.h)} style={{ ...link, display: 'inline-flex', alignItems: 'center', gap: 7 }}>{p.name}{p.beta && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: C.muted, background: '#f4f5f7', padding: '1px 6px', borderRadius: 99 }}>Beta</span>}</a></li>
                ))}
              </ul>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.heading} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={head}>{col.heading}</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {col.links.map((l) => (<li key={l.t}><a href={ext(l.h)} style={link}>{l.t}</a></li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: '#222127' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '30px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>Built in San Francisco © Frigade Inc.</p>
          <a href="https://status.frigade.ai/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#0355f8', textDecoration: 'none' }}>
            <span aria-hidden style={{ width: 8, height: 8, background: 'linear-gradient(#006eff, #0056f8)', borderRadius: 2, transform: 'rotate(45deg)', display: 'inline-block' }} />All services are operational
          </a>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="https://frigade.com/legal/assistant/privacy-policy" style={legal}>Privacy Policy</a>
            <a href="https://frigade.com/legal/assistant/terms-of-service" style={legal}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Framing page = native Frigade marketing hero ---------- */

// A labeled value-prop grid (eyebrow + heading + bento). Shown under both the
// Engage demo and the Assistant video. maxWidth 1040 keeps it inside the rails.
function BenefitsSection({ title, subtitle, items }: { title: string; subtitle: string; items: { icon: IconType; title: string; desc: string }[] }) {
  return (
    <div style={{ maxWidth: 1016, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
        <h2 className="nw-h2" style={{ margin: '0 0 14px', fontWeight: 700, color: C.ink }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: C.muted }}>{subtitle}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {items.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} style={{ background: '#f7f7f9', borderRadius: 14, padding: '20px 20px 22px' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}><Icon size={18} strokeWidth={2} /></span>
              <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, letterSpacing: '-.01em', color: C.ink }}>{b.title}</h3>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: C.muted }}>{b.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Closing CTA card, following the marketing site's house pattern: a clean rounded
// card on a near-white surface with a hairline border and a soft, brand-tinted
// lift. Centered headline + subtitle + button pair.
function RichCtaCard({ title, subtext, children, flush }: { title: string; subtext: string; children: React.ReactNode; flush?: boolean }) {
  return (
    <div style={{ maxWidth: 1016, margin: flush ? '0 auto' : '76px auto 0' }}>
      <div style={{ borderRadius: 20, border: '1px solid #1b1b1d0d', background: '#fbfcfe', boxShadow: '0 1px 2px rgba(15,23,42,.04), 0 22px 48px -28px rgba(1,94,251,.18)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <h2 className="nw-h2" style={{ margin: 0, maxWidth: 560, fontWeight: 700, color: C.ink }}>{title}</h2>
          <p className="nw-balance" style={{ margin: 0, maxWidth: 480, fontSize: 15, lineHeight: 1.6, color: C.muted }}>{subtext}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// "Built with a Claude skill" section for the Engage page. This whole demo was
// generated with the frigade-engage skill for Claude Code, so we say so here and
// link it. The framing stays agent-agnostic (any AI coding agent) while the
// specifics name Claude, which is what ships today. Mirrors the treatment on
// frigade.com/engage. Light page chrome; the terminal card is the one dark element.
function BuiltWithSkill() {
  const codeStyle: React.CSSProperties = { fontFamily: MONO, fontSize: '0.9em', background: C.brandWeak, color: C.brand, padding: '1px 6px', borderRadius: 5 };
  const points = [
    { t: 'Typed and documented', d: 'Engage ships as typed TypeScript with full SDK docs, so your agent already knows how to use it.' },
    { t: 'Claude today, more soon', d: 'The Claude skill is live now. Cursor, Codex, and other agents are available on request.' },
    { t: 'Reviewable output', d: 'Your agent ships real Engage code through your normal pipeline. Nothing is guessed at runtime.' },
  ];
  const dim = '#8a93a8', tint = '#5b9bff', hair = 'rgba(255,255,255,0.07)';
  return (
    <div style={{ maxWidth: 1016, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto 38px' }}>
        <h2 className="nw-h2" style={{ margin: '0 0 14px', fontWeight: 700, color: C.ink }}>Engage is code. Your AI agent already knows what to do with it.</h2>
        {/* nbsp keeps "way" glued to "that" so the paragraph never ends on a one-word line. */}
        <p className="nw-pretty" style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: C.muted }}>Frigade ships the <code style={codeStyle}>frigade-engage</code> skill for Claude Code. Describe the onboarding, tour, or survey you want; Claude writes it against Engage components, wires the <code style={codeStyle}>@frigade/react</code> SDK, and opens the PR. Every flow in this demo was built exactly that&nbsp;way.</p>
      </div>

      {/* Terminal snippet. Accents use a lighter blue than the brand token, which
          reads too dark on the terminal background. */}
      <div style={{ maxWidth: 760, margin: '0 auto', borderRadius: 14, overflow: 'hidden', background: '#0d1424', border: `1px solid ${hair}`, boxShadow: '0 1px 3px rgba(18,24,40,.08), 0 20px 46px rgba(1,58,170,.14)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 14px', borderBottom: `1px solid ${hair}` }}>
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#ff5f57' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#febc2e' }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: '#28c840' }} />
          <span style={{ marginLeft: 8, fontFamily: MONO, fontSize: 11.5, color: 'rgba(255,255,255,0.38)' }}>app · claude</span>
        </div>
        <div style={{ padding: '15px 18px 17px', fontFamily: MONO, fontSize: 13, lineHeight: 1.9, color: '#c7d0e0', overflowX: 'auto' }}>
          <div><span style={{ color: dim }}>$</span> claude</div>
          <div style={{ color: '#eaf0fb' }}><span style={{ color: tint }}>›</span> Build a getting-started checklist and a product tour for new users with Frigade Engage.</div>
          <div style={{ color: dim }}>Loading skill: <span style={{ color: tint }}>frigade-engage</span> …</div>
          <div style={{ color: dim }}>Reading types from <span style={{ color: tint }}>@frigade/react</span> …</div>
          <div style={{ color: dim }}>Generating flows, wiring <span style={{ color: tint }}>@frigade/react</span>, opening PR …</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18, maxWidth: 760, margin: '34px auto 0' }}>
        {points.map((p) => (
          <div key={p.t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 999, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}><Check size={13} strokeWidth={3} /></span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 2 }}>{p.t}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5, color: C.muted }}>{p.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dark "get the skill" button pairs with the terminal + github mark; the docs
          link stays plain, so neither competes with the blue CTA card below. */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 38 }}>
        <a href="https://github.com/FrigadeHQ/frigade-engage-skill" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, fontSize: 14.5, fontWeight: 600, color: '#fff', background: C.dark, textDecoration: 'none', boxShadow: '0 1px 2px rgba(0,0,0,.16), 0 8px 18px rgba(18,24,40,.16)' }}>{SOCIAL_ICON.github} Get the skill →</a>
        <a href="https://engage-docs.frigade.com" target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: C.brand, textDecoration: 'none' }}>Read the developer docs →</a>
      </div>
    </div>
  );
}

// SKILL_VIDEOS, the brand logos, and the SkillsChooser now live in
// components/skills-chooser.tsx (shared with the standalone /hn embed). VIDEO_BASE is
// re-exported from there and imported above.

// Reusable rail band: content framed in the 1240 rails with a hairline separator and
// vertical rhythm, matching the Engage sections. Page chrome, always light.
function RailBand({ children, top = 80, bottom = 80, id }: { children: React.ReactNode; top?: number; bottom?: number; id?: string }) {
  return (
    <section id={id} style={{ position: 'relative', zIndex: 1, scrollMarginTop: 72 }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div className="nw-rail-inset nw-sr" style={{ borderTop: '1px solid #1b1b1d0d', paddingTop: top, paddingBottom: bottom }}>
          {children}
        </div>
      </div>
    </section>
  );
}

// A blue "Learn more about X" link under a section subtitle, mirroring the marketing
// site's feature links: the arrow slides right on hover, plus underline-on-hover.
function LearnMoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="nw-learn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: C.brand }}>
      {label}
      <svg className="nw-learn-arw" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7" /></svg>
    </a>
  );
}

// Skills feature demo. The section leads with the full narrated walkthrough of skills
// right under the header, with the same treatment as the Suggestions video: muted
// autoplay loop with browser controls exposed, so it plays as you arrive and one click
// brings the narration in (it used to be a fourth tab in the chooser). Then, under its
// own small sub-heading, the assistant driving Hacker News, Spotify, and Jira with no
// code. Company logos are the chooser; the three short clips
// are stacked and crossfade on switch, looping muted with no controls. Deep-linkable
// via #skills and ?skill=<app>, which also scrolls the section into view on load
// (?skill=full-demo deep links from the old tab land here too).
function SkillsSection() {
  useEffect(() => {
    if (window.location.hash) return;
    if (new URLSearchParams(window.location.search).get('skill') !== 'full-demo') return;
    // Layout can settle late while media loads, which strands an early scrollIntoView
    // at the top of the page; retry until a scroll takes. scrollY > 0 means either a
    // prior attempt landed or the user took over, and both mean stop.
    const timers = [400, 1200, 2400].map((ms) => window.setTimeout(() => {
      if (window.scrollY > 4) return;
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);
  return (
    <RailBand id="skills">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', marginBottom: 30 }}>
        <h2 className="nw-h2" style={{ margin: 0, fontWeight: 700, color: C.ink }}>Real actions, no code required.</h2>
        <p className="nw-balance" style={{ margin: 0, maxWidth: 620, fontSize: 15, lineHeight: '24px', color: C.muted }}>Frigade learns your product by using it, then runs real actions for your users. To show how fast it picks things up, we pointed it at Hacker News, Spotify, and Jira. It learned each one and drove it end to end, with no code and nothing mapped by hand.</p>
        <LearnMoreLink href="https://frigade.com/features/skills" label="Learn more about Skills" />
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16, overflow: 'hidden', background: '#0d1424', boxShadow: '0 30px 80px rgba(18,24,40,.16), 0 2px 8px rgba(18,24,40,.07), 0 0 0 1px rgba(18,24,40,.05)' }}>
        <video src={VIDEO_BASE + '/videos/skills/full-demo.mp4'} poster={VIDEO_BASE + '/videos/skills/full-demo.jpg'} autoPlay muted loop playsInline controls preload="auto" aria-label="Full skills walkthrough" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '16 / 9' }} />
      </div>
      <div style={{ marginTop: 56 }}>
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 650, color: C.ink }}>Watch skills in action</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: C.muted, marginTop: 4 }}>Each one was trained in a single sitting, without a line of code.</div>
        </div>
        <SkillsChooser defaultSkill="jira" scrollTargetId="skills" skills={SKILL_VIDEOS.filter((s) => s.key !== 'full-demo')} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 900, margin: '36px auto 0' }}>
        {[
          { icon: Sparkles, t: 'Learns any product', d: 'Frigade uses your product like a user, so no actions need mapping.' },
          { icon: Zap, t: 'Real actions, not answers', d: 'It completes the task with the user’s own permissions.' },
          { icon: Lock, t: 'No code, you stay in control', d: 'Review each skill and switch on only what you want.' },
        ].map((u) => {
          const Icon = u.icon;
          return (
            <div key={u.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={17} strokeWidth={2} /></span>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{u.t}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: C.muted }}>{u.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </RailBand>
  );
}

// The Assistant view is a stack of feature-demo sections: Suggestions (the video up
// top) and Skills (the app chooser), then the shared value props + closing CTA.
function AssistantSection() {
  const { setExperience } = useExperience();
  return (
    <>
      {/* Page hero. */}
      <section style={{ position: 'relative', overflow: 'clip visible', paddingTop: 16 }}>
        <img src="/images/hero-compass-base.svg" alt="" aria-hidden style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 'min(1000px, 92%)', zIndex: 0, opacity: 0.5, pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)', maskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)' }} />
        <div className="nw-reveal" style={{ position: 'relative', zIndex: 1, maxWidth: 1080, margin: '0 auto', padding: '56px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <ProductPill />
          <h2 className="nw-h1" style={{ margin: 0, fontWeight: 700, color: C.ink, fontVariationSettings: '"opsz" 32' }}>See the assistant in action.</h2>
          <p className="nw-balance" style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5, color: C.muted, maxWidth: 560 }}>AI that learns your product and stays up to date on its own.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <a href={APP_URL_ASSISTANT} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get started</a>
            <button data-cal-link={CAL_LINK_ASSISTANT} data-cal-namespace={CAL_NS_ASSISTANT} data-cal-config={CAL_CONFIG} style={{ padding: '9px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, border: 0, cursor: 'pointer' }}>Book a call</button>
          </div>
        </div>
      </section>

      {/* General intro: the assistant learns your product like a power user, so it has real context. */}
      <RailBand>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', marginBottom: 30 }}>
          <h2 className="nw-h2 nw-nowrap-lg" style={{ margin: 0, fontWeight: 700, color: C.ink }}>It knows your product like a power user.</h2>
          <p className="nw-balance" style={{ margin: 0, maxWidth: 620, fontSize: 15, lineHeight: '24px', color: C.muted }}>Frigade learns your product by using it, the way a power user would. That context is what lets it actually help your users, guiding them through real workflows instead of pointing at a help article.</p>
          <LearnMoreLink href="https://frigade.com/features/ai-generated-tours" label="Learn more about product tours" />
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16, overflow: 'hidden', aspectRatio: '16 / 9', background: '#0d1424', boxShadow: '0 30px 80px rgba(18,24,40,.16), 0 2px 8px rgba(18,24,40,.07), 0 0 0 1px rgba(18,24,40,.05)' }}>
          <video src={VIDEO_BASE + '/videos/airbnb.mp4'} poster={VIDEO_BASE + '/videos/airbnb.jpg'} autoPlay muted loop playsInline preload="auto" aria-label="Airbnb assistant demo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 900, margin: '36px auto 0' }}>
          {[
            { icon: Sparkles, t: 'No setup, no scripting', d: 'Frigade learns by using your product, so nothing needs to be mapped or configured.' },
            { icon: Route, t: 'Guided tours, generated', d: 'It walks users through real workflows it learned itself, not a static tour you built by hand.' },
            { icon: RotateCcw, t: 'Always up to date', d: 'Ship a change and it relearns on its own. Nothing to update by hand.' },
          ].map((u) => {
            const Icon = u.icon;
            return (
              <div key={u.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={17} strokeWidth={2} /></span>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{u.t}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: C.muted }}>{u.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </RailBand>

      {/* Skills: the full walkthrough, then the assistant driving real apps, no code. */}
      <SkillsSection />

      {/* Suggestions demo: proactive engagement. Header + video + use-case value row. */}
      <RailBand id="suggestions">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center', marginBottom: 30 }}>
          <h2 className="nw-h2" style={{ margin: 0, fontWeight: 700, color: C.ink }}>A virtual AE for every user.</h2>
          <p className="nw-balance" style={{ margin: 0, maxWidth: 620, fontSize: 15, lineHeight: '24px', color: C.muted }}>Suggestions proactively onboard new users, drive feature adoption, and nudge the next step at the moment that matters. The impact of an account exec on every account, with almost none of the effort.</p>
          <LearnMoreLink href="https://frigade.com/features/suggestions" label="Learn more about Suggestions" />
        </div>
        <div style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 30px 80px rgba(18,24,40,.16), 0 2px 8px rgba(18,24,40,.07), 0 0 0 1px rgba(18,24,40,.05)' }}>
          <video data-hero-video src="/videos/hero.mp4" autoPlay muted loop playsInline controls preload="auto" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '1566 / 1080' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 900, margin: '36px auto 0' }}>
          {[
            { icon: UserPlus, t: 'Onboard new users', d: 'AI-generated onboarding walks each signup to their first win.' },
            { icon: Sparkles, t: 'Drive feature adoption', d: 'Surface the feature they are missing, right when it counts.' },
            { icon: Megaphone, t: 'Reach every account', d: 'Proactive nudges at scale, with almost no effort from you.' },
          ].map((u) => {
            const Icon = u.icon;
            return (
              <div key={u.t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 9, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={17} strokeWidth={2} /></span>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: C.ink, marginBottom: 3 }}>{u.t}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.5, color: C.muted }}>{u.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </RailBand>

      {/* Shared value props. */}
      <RailBand>
        <BenefitsSection
          title="Support that scales with your product."
          subtitle="Trained on your product and always up to date. Here's what that unlocks."
          items={ASSISTANT_BENEFITS}
        />
      </RailBand>

      {/* Closing CTA. */}
      <RailBand top={64} bottom={96}>
        <RichCtaCard
          flush
          title="AI that actually knows your product."
          subtext="Frigade Assistant learns your product and stays up to date automatically. Add it to yours in an afternoon."
        >
          <a href={APP_URL_ASSISTANT} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get started</a>
          <button data-cal-link={CAL_LINK_ASSISTANT} data-cal-namespace={CAL_NS_ASSISTANT} data-cal-config={CAL_CONFIG} style={{ padding: '9px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, border: 0, cursor: 'pointer' }}>Book a call</button>
        </RichCtaCard>
        <p style={{ textAlign: 'center', margin: '34px 0 0', fontSize: 14.5, lineHeight: 1.5, color: C.muted }}>
          Looking for Engage, our SDK to build onboarding in code?{' '}
          <button onClick={() => { setExperience('engage'); if (typeof window !== 'undefined') window.scrollTo({ top: 0 }); }} style={{ background: 'none', border: 0, padding: 0, font: 'inherit', color: C.brand, fontWeight: 600, cursor: 'pointer' }}>See Engage &rarr;</button>
        </p>
      </RailBand>
    </>
  );
}

export default function NorthwindPage() {
  const [dark, setDark] = useState(false);
  // Which product is showing, synced to ?product= in the URL via the context.
  const { experience, setExperience } = useExperience();
  // NorthwindApp publishes its action dispatcher here so the Engage hero pills can
  // replay any flow in the live demo and scroll it into view.
  const demoActionsRef = useRef<((key: string) => void) | null>(null);
  const triggerDemo = (action: string) => {
    if (typeof document !== 'undefined') document.querySelector('.nw-demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    demoActionsRef.current?.(action);
  };
  // Register both Cal.com popup namespaces up front (Engage + Assistant booking).
  useEffect(() => { (async () => { try {
    const calEngage = await getCalApi({ namespace: CAL_NS });
    calEngage('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    const calAssistant = await getCalApi({ namespace: CAL_NS_ASSISTANT });
    calAssistant('ui', { hideEventTypeDetails: false, layout: 'month_view' });
  } catch {} })(); }, []);
  // Reveal each section band as it scrolls into view, so everything below the hero
  // animates in (not just the hero). Re-runs per view since Engage/Assistant differ.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const els = Array.from(document.querySelectorAll('.nw-sr'));
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('nw-sr-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('nw-sr-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [experience]);
  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: C.ink, fontFamily: FONT }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nwpulse{0%{box-shadow:0 0 0 0 rgba(1,94,251,.5)}70%{box-shadow:0 0 0 6px rgba(1,94,251,0)}100%{box-shadow:0 0 0 0 rgba(1,94,251,0)}}
        @keyframes nwrev{to{opacity:1;transform:none}}
        .nw-rails{display:none}
        @media (min-width:1240px){.nw-rails{display:block}}
        .nw-small{display:none}
        @media (max-width:999px){.nw-demo{display:none}.nw-small{display:block}}
        /* Marketing-header mirror: nav hover, dropdown fade + item drop-in (same
           animation frigade.com uses), pill press feedback, and the 768px collapse
           to hamburger, all matching the live site. */
        .mh-link{transition:color .15s ease;white-space:nowrap}
        .mh-link:hover{color:#015efb!important}
        .mh-item{transition:background .15s ease}
        .mh-item:hover{background:#f2f4f8}
        .mh-panel{animation:mhPanelIn .16s ease both}
        @keyframes mhPanelIn{from{opacity:0}to{opacity:1}}
        @keyframes mhItemIn{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:none}}
        /* The echo diamond behind the pill menu's active marker: expands and fades on
           repeat. Stilled (echo hidden, solid core stays) under reduced motion. */
        @keyframes mhPing{0%{transform:rotate(45deg) scale(1);opacity:.5}70%,100%{transform:rotate(45deg) scale(2.2);opacity:0}}
        .mh-live{animation:mhPing 1.8s cubic-bezier(0,0,.2,1) infinite}
        @media (prefers-reduced-motion:reduce){.mh-live{animation:none;opacity:0}}
        .mh-pill{transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}
        .mh-pill:hover{border-color:#d9dde6;box-shadow:0 2px 8px rgba(18,24,40,.06)}
        .mh-pill:active{transform:scale(.97)}
        @media (max-width:767px){.mh-nav{display:none!important}.mh-right{display:none!important}.mh-burger{display:inline-flex!important}}
        .nw-reveal>*{opacity:0;transform:translateY(10px);animation:nwrev .6s cubic-bezier(.4,0,.2,1) forwards}
        .nw-reveal>*:nth-child(1){animation-delay:.08s}
        .nw-reveal>*:nth-child(2){animation-delay:.16s}
        .nw-reveal>*:nth-child(3){animation-delay:.24s}
        .nw-reveal>*:nth-child(4){animation-delay:.32s}
        .nw-revealv{opacity:0;transform:translateY(18px);animation:nwrev .7s cubic-bezier(.4,0,.2,1) .42s forwards}
        .nw-balance{text-wrap:balance}
        /* For body paragraphs: avoid a lone word stranded on the last line (no-op where unsupported). */
        .nw-pretty{text-wrap:pretty}
        /* Sections below the hero reveal as they scroll into view, so the whole page animates in, not just the hero. */
        .nw-sr{opacity:0;transform:translateY(20px);transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1)}
        .nw-sr.nw-sr-in{opacity:1;transform:none}
        @media (prefers-reduced-motion: reduce){.nw-sr{opacity:1;transform:none;transition:none}}
        /* Responsive heading scale, mirroring the marketing site (frigade.com): h1 32/44/60, h2 28/36/48. */
        .nw-h1{font-size:32px;line-height:1.1;letter-spacing:-.6px;text-wrap:balance}
        @media(min-width:768px){.nw-h1{font-size:46px;line-height:1.04;letter-spacing:-1.2px}}
        @media(min-width:1024px){.nw-h1{font-size:66px;letter-spacing:-1.9px}}
        .nw-h2{font-size:28px;line-height:1.1;letter-spacing:-.02em;text-wrap:balance}
        @media(min-width:768px){.nw-h2{font-size:36px}}
        @media(min-width:1024px){.nw-h2{font-size:48px}}
        /* The intro (AI product tours) headline reads best on one line; let it hold on a single line once there's room for it. */
        @media(min-width:1180px){.nw-nowrap-lg{white-space:nowrap;text-wrap:nowrap}}
        /* Rail insets: align section content to the 1240 rails (100px) on desktop, 32px tablet, edge padding on mobile. Mirrors marketing's rail-outer-mx. */
        .nw-rail-inset{margin-left:0;margin-right:0;padding-left:20px;padding-right:20px}
        @media(min-width:640px){.nw-rail-inset{margin-left:32px;margin-right:32px;padding-left:0;padding-right:0}}
        @media(min-width:1240px){.nw-rail-inset{margin-left:100px;margin-right:100px}}
        .nw-pills{opacity:0;transform:translateY(10px);animation:nwrev .6s cubic-bezier(.4,0,.2,1) .34s forwards}
        .nw-exp-pill{transition:box-shadow .15s ease,transform .12s ease}
        .nw-exp-pill:hover{box-shadow:0 3px 10px rgba(18,24,40,.12),0 0 0 1px rgba(1,94,251,.4)!important}
        .nw-exp-pill:active{transform:scale(.96)}
        /* Underline-on-hover for the learn-more + view-source links. text-decoration
           lives here, not inline, because an inline 'none' would outrank the :hover rule. */
        .nw-learn,.nw-src{text-decoration:none}
        .nw-learn:hover,.nw-src:hover{text-decoration:underline}
        .nw-learn-arw{transition:transform .2s cubic-bezier(.32,.72,0,1)}
        .nw-learn:hover .nw-learn-arw{transform:translateX(2px)}
        @property --nw-sweep{syntax:'<angle>';initial-value:0deg;inherits:false}
        @keyframes nwsweep{0%{--nw-sweep:0deg;opacity:0}3%{opacity:1}33%{opacity:1}38%{--nw-sweep:360deg;opacity:0}100%{--nw-sweep:360deg;opacity:0}}
        .ck-sweep{position:absolute;inset:0;border-radius:10px;padding:1.2px;background:conic-gradient(from var(--nw-sweep,0deg),transparent 0deg,#015efb 30deg,transparent 78deg);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;pointer-events:none;opacity:0;animation:nwsweep 5.5s linear 1.2s infinite}
        .ck-pop{position:absolute;bottom:100%;left:-6px;width:256px;margin-bottom:9px;background:var(--nw-card,#fff);border-radius:12px;box-shadow:0 16px 48px rgba(18,24,40,.18),0 0 0 1px var(--nw-line);transform-origin:bottom center;opacity:0;transform:scale(.97) translateY(12px);pointer-events:none;transition:opacity .28s cubic-bezier(.4,0,.2,1),transform .28s cubic-bezier(.4,0,.2,1);z-index:40}
        .ck-pop.open{opacity:1;transform:none;pointer-events:auto}
        .ck-item{transition:background .15s ease}.ck-item:hover{background:var(--nw-hover,#f5f6f8)}
        /* Locked checklist step: tooltip appears on hover/focus; the row itself is inert. */
        .ck-locked{outline:none}
        .ck-tip{position:absolute;left:50%;bottom:calc(100% + 5px);transform:translateX(-50%) translateY(2px);background:#111c33;color:#fff;font-size:11px;font-weight:500;padding:6px 9px;border-radius:7px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .14s ease,transform .14s ease;box-shadow:0 0 0 1px rgba(255,255,255,.14),0 8px 20px rgba(0,0,0,.28);z-index:46}
        .ck-locked:hover .ck-tip,.ck-locked:focus-visible .ck-tip{opacity:1;transform:translateX(-50%) translateY(0)}
        /* One soft flash when the capstone unlocks, so the state change is felt. */
        .ck-unlocked{animation:ckunlockp 1.1s ease .1s}
        @keyframes ckunlockp{0%{background:var(--nw-bw,#e8f0fe)}100%{background:transparent}}
        .nw-hint{animation:nwhintin .24s cubic-bezier(.4,0,.2,1) both}
        @keyframes nwhintin{from{opacity:0}to{opacity:1}}
        .nw-gate-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#015efb;animation:nwpulse 1.6s infinite}
        .nw-banner{animation:nwslide .4s cubic-bezier(.4,0,.2,1) both}
        @keyframes nwslide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
        .nw-rise{animation:nwrise .34s cubic-bezier(.4,0,.2,1) both}
        @keyframes nwrise{from{opacity:0;transform:translateX(-50%) translateY(16px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .nw-rate{transition:border-color .14s ease,color .14s ease,background .14s ease}
        .nw-rate:hover{border-color:var(--nw-brand)!important;color:var(--nw-brand)!important;background:var(--nw-bw)!important}
        .dc-pop{position:absolute;bottom:100%;right:0;margin-bottom:10px;width:236px;background:var(--nw-card,#fff);border-radius:13px;box-shadow:0 16px 48px rgba(18,24,40,.2),0 0 0 1px var(--nw-line);transform-origin:bottom right;opacity:0;transform:scale(.97) translateY(10px);pointer-events:none;transition:opacity .2s ease,transform .2s ease;z-index:41}
        .dc-pop.open{opacity:1;transform:none;pointer-events:auto}
        .cl-scrim{position:absolute;inset:0;background:rgba(20,21,26,.22);opacity:0;pointer-events:none;transition:opacity .26s ease;z-index:30}
        .cl-scrim.open{opacity:1;pointer-events:auto}
        .cl-bell{position:absolute;top:54px;right:16px;width:360px;max-width:78%;max-height:440px;background:var(--nw-card,#fff);border-radius:14px;box-shadow:0 16px 48px rgba(18,24,40,.18),0 0 0 1px var(--nw-line);z-index:31;display:flex;flex-direction:column;overflow:hidden;transform-origin:top right;opacity:0;transform:scale(.97) translateY(-6px);pointer-events:none;transition:opacity .18s ease,transform .18s ease}
        .cl-bell.open{opacity:1;transform:none;pointer-events:auto}
        .cl-list{overflow-y:auto;flex:1;scrollbar-width:thin;scrollbar-color:var(--nw-line,#e6e8ee) transparent}
        .cl-list::-webkit-scrollbar{width:11px}
        .cl-list::-webkit-scrollbar-thumb{background:var(--nw-line,#e6e8ee);border-radius:8px;border:3px solid transparent;background-clip:padding-box}
        .cl-list::-webkit-scrollbar-track{background:transparent}
        .nw-input::placeholder{color:var(--nw-faint)}
      ` }} />

      <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* PageRails — hatched outer columns on the 1240 canvas (≥1240px), full content height */}
      <div aria-hidden className="nw-rails" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 1240 }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 100, borderLeft: `1px solid ${C.hair}`, borderRight: `1px solid ${C.hair}`, backgroundImage: "url('/images/pattern-hatch-dark.svg')", backgroundSize: '74.5px auto', backgroundRepeat: 'repeat', backgroundPosition: 'right bottom' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 100, borderLeft: `1px solid ${C.hair}`, borderRight: `1px solid ${C.hair}`, backgroundImage: "url('/images/pattern-hatch-dark.svg')", backgroundSize: '74.5px auto', backgroundRepeat: 'repeat', backgroundPosition: 'left bottom' }} />
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <MarketingHeader />

        {experience === 'engage' ? (
        <>
        <section style={{ position: 'relative', overflow: 'clip visible', paddingTop: 16 }}>
          <img src="/images/hero-compass-base.svg" alt="" aria-hidden style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 'min(1000px, 92%)', zIndex: 0, opacity: 0.5, pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)', maskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)' }} />
          <div className="nw-reveal" style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '46px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 15 }}>
            <ProductPill />
            <h2 className="nw-h1" style={{ margin: 0, fontWeight: 700, color: C.ink, fontVariationSettings: '"opsz" 32', maxWidth: 760 }}>See what Engage can do.</h2>
            <p className="nw-balance" style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5, color: C.muted, maxWidth: 560 }}>Real onboarding, tours, and checklists, all built with Frigade Engage.</p>
          </div>

          {/* Each pill replays its Frigade surface in the live demo below (same actions as the Demo Console), scrolling it into view. */}
          <div className="nw-pills" style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 1080, margin: '30px auto 0', padding: '0 24px' }}>
            {EXPERIENCES.map((e) => <ExpBadge key={e.label} icon={e.icon} label={e.label} onClick={() => triggerDemo(e.action)} />)}
          </div>

          <div className="nw-revealv" style={{ position: 'relative', zIndex: 1, marginTop: 30, padding: '0 16px 56px' }}>
            <div className="nw-demo" style={{ maxWidth: 1280, margin: '0 auto' }}>
              <BrowserFrame dark={dark}><NorthwindApp dark={dark} setDark={setDark} actionsRef={demoActionsRef} /></BrowserFrame>
              {/* Caption under the window: the demo is its own receipt. Same dark github
                  button treatment as the "Get the skill" CTA in the skill section. */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px 16px', marginTop: 22 }}>
                <span style={{ fontSize: 14, color: C.muted }}>This whole demo is open source.</span>
                <a href="https://github.com/FrigadeHQ/demo" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', background: C.dark, textDecoration: 'none', boxShadow: '0 1px 2px rgba(0,0,0,.16), 0 8px 18px rgba(18,24,40,.16)' }}>{SOCIAL_ICON.github} See how it&rsquo;s built →</a>
              </div>
            </div>
            <div className="nw-small" style={{ maxWidth: 460, margin: '4px auto 0', textAlign: 'center', background: '#fff', borderRadius: 16, padding: '34px 30px', boxShadow: C.cardSh }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><LayoutGrid size={22} strokeWidth={2} /></div>
              <h3 style={{ margin: '0 0 7px', fontSize: 18, fontWeight: 700, letterSpacing: '-.01em', color: C.ink }}>Best viewed on a larger screen</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: C.muted }}>This interactive demo needs a little more room. Open it on a desktop browser to explore the full experience.</p>
            </div>
          </div>
        </section>

        {/* Marketing sections below the demo. Each is framed in the 1240 rails with a
            hairline separator and an 80px vertical rhythm, mirroring frigade.com/engage. */}
        <section style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div className="nw-rail-inset nw-sr" style={{ borderTop: '1px solid #1b1b1d0d', paddingTop: 80, paddingBottom: 80 }}>
              <BenefitsSection
                title="Everything you just saw, from one SDK."
                subtitle="Native to your product and driven by real events. This is what powers it."
                items={BENEFITS}
              />
            </div>
          </div>
        </section>

        <section style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div className="nw-rail-inset nw-sr" style={{ borderTop: '1px solid #1b1b1d0d', paddingTop: 80, paddingBottom: 80 }}>
              <BuiltWithSkill />
            </div>
          </div>
        </section>

        <section style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div className="nw-rail-inset nw-sr" style={{ borderTop: '1px solid #1b1b1d0d', paddingTop: 64, paddingBottom: 96 }}>
              <RichCtaCard
                flush
                title="The backend for product onboarding."
                subtext="Build the experiences you want and ship them fast. This whole demo was built with Frigade and an AI agent, using the frigade-engage skill, in less than an afternoon."
              >
                <a href={APP_URL} target="_blank" rel="noreferrer" style={{ padding: '9px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get started</a>
                <button data-cal-link={CAL_LINK} data-cal-namespace={CAL_NS} data-cal-config={CAL_CONFIG} style={{ padding: '9px 16px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, border: 0, cursor: 'pointer' }}>Book a call</button>
              </RichCtaCard>
              <p style={{ textAlign: 'center', margin: '34px 0 0', fontSize: 14.5, lineHeight: 1.5, color: C.muted }}>
                Looking for the AI assistant that learns your product on its own?{' '}
                <button onClick={() => { setExperience('assistant'); if (typeof window !== 'undefined') window.scrollTo({ top: 0 }); }} style={{ background: 'none', border: 0, padding: 0, font: 'inherit', color: C.brand, fontWeight: 600, cursor: 'pointer' }}>See Assistant &rarr;</button>
              </p>
            </div>
          </div>
        </section>
        </>
        ) : (
          <AssistantSection />
        )}

        <MarketingFooter />
      </div>
      </div>
    </div>
  );
}
