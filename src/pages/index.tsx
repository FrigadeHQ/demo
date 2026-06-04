import React, { useState, useEffect, useRef } from 'react';
import * as Frigade from '@frigade/react';
import {
  LayoutGrid, Bot, KeyRound, BarChart3, ScrollText, CreditCard, Settings2,
  Search, Bell, Plus, ChevronsUpDown, HelpCircle, Megaphone, Sun, Moon, Lock, ChevronUp,
  Sparkles, CodeXml, ClipboardList, ListChecks, Route, Flag, MessageSquare, Newspaper, X,
  UserPlus, Database, Zap, Check, CheckCircle2, RotateCcw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getUserId } from '@/lib/utils';
import { DEMO_FLOWS } from '@/lib/demo-flows';
import { getCalApi } from '@calcom/embed-react';
import { useExperience } from '@/components/experience-context';

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

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif';
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
const CTA_ENGAGE = 'inset 0 1px 0.4px rgba(255,255,255,0.18), inset 0 -3px 2px rgba(0,0,0,0.28), 0 1px 1px rgba(0,0,0,0.14), 0 2px 4px rgba(20,30,50,0.18), 1px 4px 10px rgba(64,78,97,0.22), 0 0 0 1px rgb(48,60,76)';
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
function ExpBadge({ icon: Icon, label }: { icon: IconType; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 31, borderRadius: 999, background: '#fff', padding: '0 13px', boxShadow: '0 1px 2px rgba(18,24,40,0.05), 0 0 0 1px rgba(18,24,40,0.07)', fontSize: 12.5, fontWeight: 500, color: C.ink2 }}>
      <Icon size={14} color={C.brand} strokeWidth={2} />{label}
    </span>
  );
}
function Toggle({ icon: Icon, label, active, hex, rgb, onClick }: { icon: IconType; label: string; active?: boolean; hex: string; rgb: string; onClick?: () => void }) {
  return (<button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '5px 11px', fontSize: 12.5, fontWeight: 500, border: 0, cursor: 'pointer', color: active ? C.ink : C.muted, background: active ? '#fff' : 'transparent', boxShadow: active ? `0 0 0 1px rgba(${rgb},0.18), 0 1px 2px rgba(${rgb},0.08)` : 'none' }}><span style={{ width: 16, height: 16, borderRadius: 5, background: hex, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={11} strokeWidth={2.25} /></span>{label}</button>);
}

const AGENTS = [
  { name: 'Support Triage', type: 'Conversation', status: 'Running', run: '2m ago', on: true },
  { name: 'Lead Router', type: 'Workflow', status: 'Running', run: '14m ago', on: true },
  { name: 'Onboarding Bot', type: 'Single Prompt', status: 'Paused', run: '1d ago', on: false },
];
const EXPERIENCES: { label: string; icon: IconType }[] = [
  { label: 'Welcome announcement', icon: Megaphone }, { label: 'Onboarding form', icon: ClipboardList },
  { label: 'Checklist', icon: ListChecks }, { label: 'Product tour', icon: Route },
  { label: 'Banner', icon: Flag }, { label: 'Survey', icon: MessageSquare }, { label: 'Changelog', icon: Newspaper },
];
const CK_ICONS: Record<string, IconType> = { 'take-a-tour': Route, 'create-agent': Bot, 'add-key': KeyRound, 'invite-team': UserPlus, 'view-analytics': BarChart3, 'view-logs': ScrollText };
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
function NorthwindApp({ dark, setDark }: { dark: boolean; setDark: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { flow } = Frigade.useFlow(DEMO_FLOWS.changelog);
  const steps = flow ? Array.from(flow.steps.values()) : [];
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [newIds, setNewIds] = useState<Set<string>>(() => new Set());
  const [bellOpen, setBellOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const { flow: ckFlow } = Frigade.useFlow(DEMO_FLOWS.checklist);
  const ckSteps = ckFlow ? Array.from(ckFlow.steps.values()) : [];
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
  const ckTotal = ckSteps.length;
  const ckDoneCount = ckSteps.filter((s: any) => done.has(s.id)).length;
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
              {ckSteps.map((s: any) => {
                const isDone = done.has(s.id); const Ic = CK_ICONS[s.id] || Bot; const isActive = activeStep === s.id;
                return (
                  <div key={s.id} className={isDone ? undefined : 'ck-item'} onClick={isDone ? undefined : () => { setCkOpen(false); if (s.props && s.props.action === 'tour') startTour(); else setActiveStep(s.id); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 8, fontSize: 12.5, cursor: isDone ? 'default' : 'pointer', color: isDone ? C.muted : C.ink2, background: isActive ? C.brandWeak : 'transparent' }}>
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
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.05em', color: C.brand, background: C.brandWeak, padding: '4px 9px', borderRadius: 6 }}>DEMO</span>
      </div>
      {children}
    </div>
  );
}

// The product switch. Reads/writes the shared experience context, which keeps
// the choice in the URL (?product=assistant|engage) so a link can deep-link to
// either product. Both Frigade products live on this one page.
function HeaderToggle() {
  const { experience, setExperience } = useExperience();
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, borderRadius: 999, border: `1px solid ${C.line}`, background: '#f4f5f7', padding: 4 }}>
      <Toggle icon={Sparkles} label="Assistant" active={experience === 'assistant'} hex="#015efb" rgb="1,94,251" onClick={() => setExperience('assistant')} />
      <Toggle icon={CodeXml} label="Engage" active={experience === 'engage'} hex="#404e61" rgb="64,78,97" onClick={() => setExperience('engage')} />
    </div>
  );
}

const SOCIAL_ICON: Record<string, React.ReactNode> = {
  github: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 .5a11.5 11.5 0 0 0-3.63 22.43c.58.1.79-.25.79-.56v-2.18c-3.21.7-3.89-1.37-3.89-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.75.4-1.27.73-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.35.78 1.03.78 2.08v3.08c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>,
  linkedin: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.56c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.65H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.21 24 24 23.23 24 22.28V1.72C24 .77 23.21 0 22.22 0Z" /></svg>,
  x: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.16 17.52h1.833L7.084 4.126H5.117l11.967 15.644Z" /></svg>,
};
// Footer columns mirror the live Frigade marketing site's published links.
const FOOTER_COLS: { heading: string; links: { t: string; h: string }[] }[] = [
  { heading: 'Features', links: [{ t: 'AI-Generated Tours', h: '/features/ai-generated-tours' }, { t: 'Suggestions', h: '/features/suggestions' }, { t: 'Tool Calls', h: '/features/tool-calls' }, { t: 'Always Accurate', h: '/features/always-accurate' }, { t: 'Integrations', h: '/features/integrations' }, { t: 'Insights', h: '/features/insights' }, { t: 'Feedback', h: '/features/feedback' }, { t: 'Developer', h: '/features/developer' }] },
  { heading: 'Use Cases', links: [{ t: 'Support Deflection', h: '/use-cases/support-deflection' }, { t: 'User Activation', h: '/use-cases/user-activation' }, { t: 'Virtual CSM', h: '/use-cases/virtual-csm' }, { t: 'Feature Adoption', h: '/use-cases/feature-adoption' }, { t: 'Expansion & Upsell', h: '/use-cases/expansion-upsell' }] },
  { heading: 'Resources', links: [{ t: 'Get a demo', h: '/demo' }, { t: 'Contact us', h: '/contact' }, { t: 'Product Onboarding', h: 'https://productonboarding.com' }] },
  { heading: 'Compare', links: [{ t: 'vs. Intercom Fin', h: '/compare/fin' }, { t: 'vs. Pendo', h: '/compare/pendo' }, { t: 'vs. Pylon', h: '/compare/pylon' }, { t: 'vs. Zendesk', h: '/compare/zendesk' }] },
  { heading: 'Case Studies', links: [{ t: 'Valley', h: '/case-studies/valley' }] },
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={head}>Socials</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {([['github', 'https://github.com/FrigadeHQ'], ['linkedin', 'https://www.linkedin.com/company/frigade'], ['x', 'https://x.com/FrigadeHQ']] as [string, string][]).map(([p, h]) => (
                  <a key={p} href={h} aria-label={p} style={{ width: 32, height: 32, borderRadius: 999, border: `1px solid ${C.line}`, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>{SOCIAL_ICON[p]}</a>
                ))}
              </div>
            </div>
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
function BenefitsSection({ eyebrow, title, subtitle, items }: { eyebrow: string; title: string; subtitle: string; items: { icon: IconType; title: string; desc: string }[] }) {
  return (
    <div style={{ maxWidth: 1016, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 34px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: C.brand, marginBottom: 12 }}>{eyebrow}</div>
        <h2 style={{ margin: '0 0 12px', fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.8px', fontWeight: 700, color: C.ink }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: C.muted }}>{subtitle}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
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

// Closing CTA card. Borrows the marketing site's announcement-banner treatment
// (a faint hatch pattern + a brand-blue radial glow) plus the hero compass ring,
// so it reads like a Frigade surface instead of a plain box. The buttons come in
// as children. maxWidth 1040 keeps it inside the rails.
function RichCtaCard({ title, subtext, children }: { title: string; subtext: string; children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1016, margin: '44px auto 0' }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, border: '1px solid rgba(1,94,251,0.16)', background: 'linear-gradient(180deg, #eef4ff 0%, #ffffff 72%)', boxShadow: '0 1px 3px rgba(18,24,40,.05), 0 22px 52px rgba(1,58,170,.11)' }}>
        {/* hatch texture, faded toward the center so the copy stays clean */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/pattern-hatch-dark.svg')", backgroundSize: '74.5px auto', opacity: 0.4, WebkitMaskImage: 'radial-gradient(118% 132% at 50% 50%, transparent 30%, #000 100%)', maskImage: 'radial-gradient(118% 132% at 50% 50%, transparent 30%, #000 100%)', pointerEvents: 'none' }} />
        {/* brand-blue glow from the top edge */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 62% 150% at 50% 0%, rgba(1,94,251,0.18) 0%, rgba(1,94,251,0.06) 42%, transparent 72%)', pointerEvents: 'none' }} />
        {/* compass ring graphic, bleeding in from the right */}
        <img src="/images/hero-compass-base.svg" alt="" aria-hidden style={{ position: 'absolute', top: '50%', right: -120, transform: 'translateY(-50%)', width: 420, opacity: 0.55, pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 40%, transparent 70%)', maskImage: 'radial-gradient(circle at 50% 50%, #000 40%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '54px 32px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 auto 12px', maxWidth: 560, fontSize: 31, lineHeight: 1.12, letterSpacing: '-0.7px', fontWeight: 700, color: C.ink }}>{title}</h2>
          <p style={{ margin: '0 auto 28px', maxWidth: 500, fontSize: 15.5, lineHeight: 1.55, color: C.muted }}>{subtext}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>{children}</div>
        </div>
      </div>
    </div>
  );
}

// The Assistant product's page on the live demo is a product walkthrough video,
// so the Assistant tab shows that video plus its sign-up and book-a-demo CTAs.
// (Engage is the full interactive demo above; Assistant is the guided look.)
function AssistantSection() {
  return (
    <section style={{ position: 'relative', overflow: 'clip visible', paddingTop: 16 }}>
      <img src="/images/hero-compass-base.svg" alt="" aria-hidden style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 'min(1000px, 92%)', zIndex: 0, opacity: 0.5, pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)', maskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)' }} />
      <div className="nw-reveal" style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '46px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 15 }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: C.brand }}>Frigade Assistant · Live demo</div>
        <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.07, letterSpacing: '-1.1px', fontWeight: 700, color: C.ink, fontVariationSettings: '"opsz" 32', maxWidth: 720 }}>See what Assistant can do.</h2>
        <p className="nw-balance" style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5, color: C.muted, maxWidth: 540 }}>AI that learns your product and answers your users in real time.</p>
      </div>
      <div className="nw-revealv" style={{ position: 'relative', zIndex: 1, marginTop: 32, padding: '0 16px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 30px 80px rgba(18,24,40,.16), 0 2px 8px rgba(18,24,40,.07), 0 0 0 1px rgba(18,24,40,.05)' }}>
          <video data-hero-video src="/videos/hero.mp4" autoPlay muted loop playsInline controls preload="auto" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '1566 / 1080' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 30 }}>
          <a href={APP_URL_ASSISTANT} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14.5, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get started</a>
          <button data-cal-link={CAL_LINK_ASSISTANT} data-cal-namespace={CAL_NS_ASSISTANT} data-cal-config={CAL_CONFIG} style={{ padding: '10px 20px', borderRadius: 6, fontSize: 14.5, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, border: 0, cursor: 'pointer' }}>Book a demo</button>
        </div>
      </div>
      {/* Value props + closing CTA below the video, mirroring the Engage page. */}
      <div style={{ position: 'relative', zIndex: 1, padding: '8px 24px 96px' }}>
        <BenefitsSection
          eyebrow="Frigade Assistant"
          title="Support that scales with your product."
          subtitle="Trained on your product and answering in real time. Here's what that unlocks."
          items={ASSISTANT_BENEFITS}
        />
        <RichCtaCard
          title="AI that actually knows your product."
          subtext="Frigade Assistant learns your product and answers your users in real time. Add it to yours in an afternoon."
        >
          <a href={APP_URL_ASSISTANT} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14.5, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get started</a>
          <button data-cal-link={CAL_LINK_ASSISTANT} data-cal-namespace={CAL_NS_ASSISTANT} data-cal-config={CAL_CONFIG} style={{ padding: '10px 20px', borderRadius: 6, fontSize: 14.5, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, border: 0, cursor: 'pointer' }}>Book a demo</button>
        </RichCtaCard>
      </div>
    </section>
  );
}

export default function NorthwindPage() {
  const [dark, setDark] = useState(false);
  // Which product is showing, synced to ?product= in the URL via the context.
  const { experience } = useExperience();
  // Register both Cal.com popup namespaces up front (Engage + Assistant booking).
  useEffect(() => { (async () => { try {
    const calEngage = await getCalApi({ namespace: CAL_NS });
    calEngage('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    const calAssistant = await getCalApi({ namespace: CAL_NS_ASSISTANT });
    calAssistant('ui', { hideEventTypeDetails: false, layout: 'month_view' });
  } catch {} })(); }, []);
  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: C.ink, fontFamily: FONT }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes nwpulse{0%{box-shadow:0 0 0 0 rgba(1,94,251,.5)}70%{box-shadow:0 0 0 6px rgba(1,94,251,0)}100%{box-shadow:0 0 0 0 rgba(1,94,251,0)}}
        @keyframes nwrev{to{opacity:1;transform:none}}
        .nw-rails{display:none}
        @media (min-width:1240px){.nw-rails{display:block}}
        .nw-small{display:none}
        @media (max-width:999px){.nw-demo{display:none}.nw-small{display:block}}
        .nw-reveal>*{opacity:0;transform:translateY(10px);animation:nwrev .6s cubic-bezier(.4,0,.2,1) forwards}
        .nw-reveal>*:nth-child(1){animation-delay:.08s}
        .nw-reveal>*:nth-child(2){animation-delay:.16s}
        .nw-reveal>*:nth-child(3){animation-delay:.24s}
        .nw-reveal>*:nth-child(4){animation-delay:.32s}
        .nw-revealv{opacity:0;transform:translateY(18px);animation:nwrev .7s cubic-bezier(.4,0,.2,1) .42s forwards}
        .nw-balance{text-wrap:balance}
        .nw-pills{opacity:0;transform:translateY(10px);animation:nwrev .6s cubic-bezier(.4,0,.2,1) .34s forwards}
        @property --nw-sweep{syntax:'<angle>';initial-value:0deg;inherits:false}
        @keyframes nwsweep{0%{--nw-sweep:0deg;opacity:0}3%{opacity:1}33%{opacity:1}38%{--nw-sweep:360deg;opacity:0}100%{--nw-sweep:360deg;opacity:0}}
        .ck-sweep{position:absolute;inset:0;border-radius:10px;padding:1.2px;background:conic-gradient(from var(--nw-sweep,0deg),transparent 0deg,#015efb 30deg,transparent 78deg);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;pointer-events:none;opacity:0;animation:nwsweep 5.5s linear 1.2s infinite}
        .ck-pop{position:absolute;bottom:100%;left:-6px;width:256px;margin-bottom:9px;background:var(--nw-card,#fff);border-radius:12px;box-shadow:0 16px 48px rgba(18,24,40,.18),0 0 0 1px var(--nw-line);transform-origin:bottom center;opacity:0;transform:scale(.97) translateY(12px);pointer-events:none;transition:opacity .28s cubic-bezier(.4,0,.2,1),transform .28s cubic-bezier(.4,0,.2,1);z-index:40}
        .ck-pop.open{opacity:1;transform:none;pointer-events:auto}
        .ck-item{transition:background .15s ease}.ck-item:hover{background:var(--nw-hover,#f5f6f8)}
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
        <header style={{ position: 'sticky', top: 0, zIndex: 5, background: 'rgba(255,255,255,0.85)', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: `1px solid rgba(34,34,79,0.07)`, padding: '0 24px', flexShrink: 0 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', height: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src="/images/frigade-logo.svg" alt="Frigade" style={{ height: 25, width: 'auto', display: 'block' }} />
              <HeaderToggle />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <a href={experience === 'engage' ? 'https://frigade.com/engage' : 'https://frigade.com'} target="_blank" rel="noreferrer" style={{ padding: '7px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, textDecoration: 'none' }}>Website</a>
              <a href={experience === 'engage' ? APP_URL : APP_URL_ASSISTANT} target="_blank" rel="noreferrer" style={{ padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: '#fff', background: experience === 'engage' ? 'linear-gradient(rgb(80,96,118) 0%, rgb(64,78,97) 100%)' : 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: experience === 'engage' ? CTA_ENGAGE : CTA_BRAND, textDecoration: 'none' }}>Get started</a>
            </div>
          </div>
        </header>

        {experience === 'engage' ? (
        <>
        <section style={{ position: 'relative', overflow: 'clip visible', paddingTop: 16 }}>
          <img src="/images/hero-compass-base.svg" alt="" aria-hidden style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 'min(1000px, 92%)', zIndex: 0, opacity: 0.5, pointerEvents: 'none', WebkitMaskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)', maskImage: 'radial-gradient(62% 78% at 50% 32%, #000 0%, transparent 76%)' }} />
          <div className="nw-reveal" style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '46px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 15 }}>
            <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.13em', textTransform: 'uppercase', color: C.brand }}>Frigade Engage · Live demo</div>
            <h2 style={{ margin: 0, fontSize: 40, lineHeight: 1.07, letterSpacing: '-1.1px', fontWeight: 700, color: C.ink, fontVariationSettings: '"opsz" 32', maxWidth: 720 }}>See what Engage can do.</h2>
            <p className="nw-balance" style={{ margin: 0, fontSize: 16.5, lineHeight: 1.5, color: C.muted, maxWidth: 540 }}>Everything in <span style={{ color: C.brand, fontWeight: 600 }}>blue</span> is powered by Frigade.</p>
          </div>

          {/* TODO(backlog): make these pills interactive — click opens/replays its experience in the demo. Nuance: one-time flows (announcement/form/survey) may be completed already -> restart() so the viewer always sees it; persistent ones (checklist/changelog/banner) open/scroll into view. Design alongside the Demo Console. */}
          <div className="nw-pills" style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 1080, margin: '20px auto 0', padding: '0 24px' }}>
            {EXPERIENCES.map((e) => <ExpBadge key={e.label} icon={e.icon} label={e.label} />)}
          </div>

          <div className="nw-revealv" style={{ position: 'relative', zIndex: 1, marginTop: 30, padding: '0 16px 56px' }}>
            <div className="nw-demo" style={{ maxWidth: 1280, margin: '0 auto' }}><BrowserFrame dark={dark}><NorthwindApp dark={dark} setDark={setDark} /></BrowserFrame></div>
            <div className="nw-small" style={{ maxWidth: 460, margin: '4px auto 0', textAlign: 'center', background: '#fff', borderRadius: 16, padding: '34px 30px', boxShadow: C.cardSh }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: C.brandWeak, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><LayoutGrid size={22} strokeWidth={2} /></div>
              <h3 style={{ margin: '0 0 7px', fontSize: 18, fontWeight: 700, letterSpacing: '-.01em', color: C.ink }}>Best viewed on a larger screen</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: C.muted }}>This interactive demo needs a little more room. Open it on a desktop browser to explore the full experience.</p>
            </div>
          </div>
        </section>

        {/* Abridged marketing section below the demo — value props bento + CTA (page chrome, always light) */}
        <section style={{ position: 'relative', zIndex: 1, padding: '8px 24px 96px' }}>
          <BenefitsSection
            eyebrow="Built with Frigade"
            title="Everything you just saw, from one SDK."
            subtitle="Native to your product and driven by real events. This is what powers it."
            items={BENEFITS}
          />
          <RichCtaCard
            title="The backend for product onboarding."
            subtext="Build the experiences you want and ship them fast. This whole demo was built with Frigade and an AI agent in less than an afternoon."
          >
            <a href={APP_URL} target="_blank" rel="noreferrer" style={{ padding: '10px 20px', borderRadius: 8, fontSize: 14.5, fontWeight: 500, color: '#fff', background: 'linear-gradient(rgb(0,110,255) 0%, rgb(0,86,248) 100%)', boxShadow: CTA_BRAND, textDecoration: 'none' }}>Get started</a>
            <button data-cal-link={CAL_LINK} data-cal-namespace={CAL_NS} data-cal-config={CAL_CONFIG} style={{ padding: '10px 20px', borderRadius: 6, fontSize: 14.5, fontWeight: 500, color: 'rgb(26,27,47)', background: 'linear-gradient(rgb(255,255,255) 0%, rgba(194,200,209,0.12) 100%)', boxShadow: CTA_SECONDARY, border: 0, cursor: 'pointer' }}>Grab a demo</button>
          </RichCtaCard>
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
