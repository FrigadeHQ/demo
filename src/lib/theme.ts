// Northwind's design system. The host app styles itself from these tokens, and
// Frigade is pointed at the same ones (see frigadeTheme), so its surfaces inherit
// the product's look instead of being restyled component by component.
export const FONT = 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
export const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

export const C = {
  bg: '#f5f6f8', card: '#fff', ink: '#1a233c', ink2: '#2f3649', muted: '#6b7180',
  faint: '#9aa0b0', line: '#e6e8ee', hair: '#1b1b1d0d', brand: '#015efb', brandWeak: '#e7f0ff', dark: '#1b2230',
  ghost: '#e4e7ec', hover: '#f5f6f8', wash: '#eef3ff', washLine: '#e2e9f7', frame: '#eef0f3', frameBorder: '#e1e4e9',
  cardSh: '0 1px 2px rgba(18,24,40,.06), 0 0 0 1px rgba(18,24,40,.05)',
};

// Dark theme: the host app + Frigade surfaces re-skin; brand stays #015efb for fidelity.
export const DARK: typeof C = {
  bg: '#0e1422', card: '#171f2e', ink: '#eef1f7', ink2: '#c2cad8', muted: '#8790a1',
  faint: '#5b647a', line: '#28303f', hair: 'rgba(255,255,255,.06)', brand: '#015efb', brandWeak: '#16243f', dark: '#2b3346',
  ghost: '#283142', hover: '#1e2738', wash: '#131c2e', washLine: '#222c40', frame: '#212a39', frameBorder: '#2b3446',
  cardSh: '0 1px 2px rgba(0,0,0,.35), 0 0 0 1px #2c3547',
};

export const palette = (d: boolean) => (d ? DARK : C);

// Northwind's in-app brand button: a flat fill, a tight drop, a 1px ring. Kept
// deliberately plainer than the marketing site's CTA (CTA_BRAND in index.tsx), which
// stacks inset highlights and a blue glow. A product button that shows up dressed
// like a landing-page CTA reads as someone else's component, which is the opposite
// of the point. Frigade's surfaces are given this one, same as the app's own.
export const BTN_BRAND = '0 1px 2px rgba(1,94,251,.35), 0 0 0 1px rgba(1,94,251,.25)';

// Expose the active palette as CSS vars on the app root, so the shared helper
// components + injected popover CSS theme along with NorthwindApp's inline styles.
export function cssVars(p: typeof C): Record<string, string> {
  return {
    '--nw-card': p.card, '--nw-ghost': p.ghost, '--nw-line': p.line, '--nw-muted': p.muted,
    '--nw-ink': p.ink, '--nw-ink2': p.ink2, '--nw-faint': p.faint, '--nw-brand': p.brand,
    '--nw-bw': p.brandWeak, '--nw-hover': p.hover, '--nw-bg': p.bg, '--nw-csh': p.cardSh,
  };
}

// The class the app root carries, so Frigade can scope its CSS variables into the
// same element that defines --nw-*. Without this the theme below would resolve
// against :root, where --nw-* aren't declared.
export const APP_SCOPE = 'nw-app';

/**
 * Northwind's palette expressed as Frigade design tokens.
 *
 * Every value is a `var(--nw-*)` reference rather than a literal, which is what
 * makes the dark toggle work: the app root swaps those variables and every Frigade
 * surface re-skins with the rest of the product, with no second theme to maintain.
 * Frigade's colour scales run 100 (darkest) to 900 (lightest); only the steps the
 * components actually reach for are overridden, and the rest of the defaults stand.
 */
export const frigadeTheme = {
  colors: {
    // `gray` is what Frigade's `neutral-*` scale aliases, so overriding it re-skins
    // every neutral surface. `black`/`white` are separate: the semantic foreground
    // and background tokens (neutral-foreground, and its active/focus/hover
    // variants) derive from those two, not from the scale. Leaving black alone is
    // what pins body text to #000 and makes it unreadable in dark.
    black: 'var(--nw-ink)',
    white: 'var(--nw-card)',
    blue: { 500: 'var(--nw-brand)', 800: 'var(--nw-bw)', 900: 'var(--nw-bw)' },
    gray: {
      100: 'var(--nw-ink)',
      400: 'var(--nw-muted)',
      700: 'var(--nw-line)',
      800: 'var(--nw-hover)',
      900: 'var(--nw-card)',
    },
  },
  // 11px is Northwind's default corner (its buttons, banner and popovers all use it).
  radii: { md: '11px', lg: '14px' },
  shadows: { md: 'var(--nw-csh)' },
};
