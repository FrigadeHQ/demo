# demo-v2 Brand Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring demo.frigade.com visually in line with the new Frigade marketing brand (matching tokens, font, button styling, chooser styling, logo) and ship three new behaviors (sticky footer, `?product=` deep linking, double-play video bug fix).

**Architecture:** Token repoint is the leverage point — demo's existing shadcn HSL tokens (`--primary`, `--foreground`, …) get repointed to the brand's hex values, so every existing shadcn primitive picks up the brand without per-component edits. A new `CtaButton` lives alongside the existing `Button` for marketing-facing surfaces (header CTA, homepage hero). The chooser keeps its 2-pill toggle UX and gets reskinned with per-product icons + colors sourced from a new `lib/products.ts` (mirrors marketing, scoped to `assistant` + `engage`).

**Tech Stack:** Next.js 14 (Pages Router), React 18, Tailwind v3, shadcn-style UI, pnpm. Brand reference lives in `/Users/ericbrownrout/Library/Code/marketing-ai-experiment/new-website` (Next.js 16, Tailwind v4) — used as a *source of values and patterns only*; demo does not migrate to Next 16 / Tailwind v4 in this work.

**Design doc:** `docs/plans/2026-04-25-brand-refresh-design.md` (commit `986f10d`). The design doc is the source of intent; this doc is the source of *exactly how to ship it*.

**Repo:** `/Users/ericbrownrout/Library/Code/demo-v2`. Single-agent — no parallel writers.

---

## Conventions

- **One task = one commit.** Subject in conventional-commit form (`feat(scope): …`, `chore(scope): …`, `fix(scope): …`).
- **Verification before commit.** Each task ends with `pnpm dev` (or a build) and a visual screenshot or behavior check. Don't commit if the build is broken or the screenshot doesn't match the intent.
- **Brand values come from the marketing repo at refresh time.** The marketing brand evolves; canonical hex values live in `/Users/ericbrownrout/Library/Code/marketing-ai-experiment/new-website/app/globals.css` (search for `--color-brand`, `--color-engage`, etc.). Always read those first, then convert to HSL for demo's tokens. Values pasted in this plan reflect what was current at planning time and may have drifted — re-check before committing.
- **Don't expand scope.** The design doc deliberately excludes a 4-product chooser, path-based routing, Tailwind v4, and full restyling of in-flow Buttons. If a task tempts you to broaden, stop and ask.

---

## Phase 0 — Setup + baseline

### Task 0.1: Verify dev server and capture baselines

**Files:** none (read-only).

**Step 1: Install deps and start dev server**

```bash
cd /Users/ericbrownrout/Library/Code/demo-v2
pnpm install
pnpm dev
```

Expected: dev server boots on `http://localhost:3000` (or next free port). Open `http://localhost:3000/` in a browser.

**Step 2: Capture baseline screenshots**

For each route below, capture full-page screenshots at 1440×900 (desktop) and 390×844 (mobile). Save to `/tmp/demo-baseline/<route>-<width>.png`:

- `/` (assistant experience)
- `/?product=engage` won't work yet — instead toggle the chooser to Engage, then capture `/`
- `/forms`
- `/tours`
- `/checklists`

```bash
mkdir -p /tmp/demo-baseline
# For each route, use Chrome headless:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 \
  --screenshot=/tmp/demo-baseline/home-assistant-1440.png \
  http://localhost:3000/
```

Expected: screenshots saved. These are the "before" reference for visual diffs after each task.

**Step 3: No commit — baselines aren't checked in.**

---

## Phase 1 — Foundations

These five tasks land before any brand-surface work. After Phase 1, the demo will visually shift even if you make no further changes (because the token repoint cascades through every shadcn primitive).

### Task 1.1: Repoint color tokens to the brand

**Files:**
- Modify: `src/pages/globals.css` (the `:root { … }` block at the top of `@layer base`)

**Step 1: Read the canonical brand values from marketing**

```bash
grep -A 1 "color-brand:\|color-engage:\|color-ink-50\|color-ink-100\|color-ink-200\|color-ink-500\|color-ink-700\|color-ink-900\|color-hairline" \
  /Users/ericbrownrout/Library/Code/marketing-ai-experiment/new-website/app/globals.css
```

Record the hex values. As of planning time these were:
- `--color-brand: #015EFB`
- `--color-engage: #404E61`
- `--color-ink-50: #fafafa`
- `--color-ink-100: #f4f5f7`
- `--color-ink-200: #e6e8ee`
- `--color-ink-500: #6b7180`
- `--color-ink-700: #2f3649`
- `--color-ink-900: #1a233c`
- `--color-hairline: #1b1b1d0d`

Convert each hex to HSL (use any color tool, or in JS: `chroma(hex).hsl()`). Sanity-check the conversions:
- `#015EFB` → `217 99% 49%`
- `#1a233c` → `225 41% 17%`
- `#6b7180` → `223 8% 46%`
- `#f4f5f7` → `220 13% 96%`
- `#e6e8ee` → `224 17% 92%`

**Step 2: Edit `src/pages/globals.css`**

In the top `:root { … }` block (currently inside `@layer base`), replace the values for these tokens. **Token names stay the same** — only the values change.

```css
:root {
  --background: 0 0% 100%;          /* unchanged */
  --foreground: 225 41% 17%;        /* ink-900 */
  --card: 0 0% 100%;                /* unchanged */
  --card-foreground: 225 41% 17%;   /* ink-900 */
  --popover: 0 0% 100%;             /* unchanged */
  --popover-foreground: 225 41% 17%;
  --primary: 217 99% 49%;           /* brand */
  --primary-foreground: 0 0% 100%;
  --secondary: 220 13% 96%;         /* ink-100 */
  --secondary-foreground: 225 41% 17%;
  --muted: 220 13% 96%;             /* ink-100 */
  --muted-foreground: 223 8% 46%;   /* ink-500 */
  --accent: 220 13% 96%;            /* ink-100 */
  --accent-foreground: 225 41% 17%;
  --destructive: 0 84.2% 60.2%;     /* unchanged */
  --destructive-foreground: 0 0% 98%;
  --border: 224 17% 92%;            /* ink-200 */
  --input: 224 17% 92%;             /* ink-200 */
  --ring: 217 99% 49%;              /* brand */
  --radius: 0.5rem;
  /* chart-* tokens left as-is — only used inside themed variants */
  /* …existing chart-1..5 here, unchanged… */
}
```

**Important:** Do NOT touch tokens inside themed scopes lower in the file (`.dark { … }`, `.theme-* { … }`). Those theme overrides MUST keep working — they're scoped overrides on top of `:root`.

**Step 3: Verify**

Run `pnpm dev` (if not already). Visit `/`. Expected: the existing shadcn buttons / inputs / borders should now read in brand-blue + ink palette, not the previous near-black + grey. Compare against `/tmp/demo-baseline/home-assistant-1440.png`.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 \
  --screenshot=/tmp/demo-after-1.1.png \
  http://localhost:3000/
```

Eyeball the diff. The "Get started" header button is still the hardcoded `bg-blue-600` — that's fine, gets fixed in Task 2.2.

**Step 4: Commit**

```bash
git add src/pages/globals.css
git commit -m "$(cat <<'EOF'
chore(theme): repoint base color tokens to the new Frigade brand

Replaces the values (not names) of the top-level :root tokens in
globals.css to match marketing's ink + brand-blue palette. Every
shadcn primitive in the demo picks up the brand automatically because
their utility classes (bg-primary, text-foreground, border-border, …)
keep resolving through the same token names.

Themed variants (.dark, .theme-*) keep their local overrides and
continue to work.

Source values: marketing-ai-experiment/new-website/app/globals.css
(--color-brand, --color-ink-*).
EOF
)"
```

---

### Task 1.2: Adopt Inter Variable as the body font

**Files:**
- Modify: `src/pages/_app.tsx`
- Modify: `src/pages/globals.css` (one rule, see step 2)

**Step 1: Wire `next/font/google` Inter in `_app.tsx`**

At the top of `src/pages/_app.tsx`:

```tsx
import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
```

Wrap the existing `<main>` element so the `--font-sans` variable is available on the document. Add the variable className to `<main>`:

```tsx
<main className={`${inter.variable} flex bg-[#F6F8F7] min-h-screen flex-col items-center justify-between p-0 gap-8`}>
```

(We will replace the hardcoded `bg-[#F6F8F7]` in Task 3.1; keep it for now.)

**Step 2: Apply the variable as the default body font in `globals.css`**

Add inside the existing `@layer base` block, after the `:root { … }` rule:

```css
@layer base {
  body {
    font-family: var(--font-sans), system-ui, -apple-system, "Segoe UI", sans-serif;
  }
}
```

**Important:** themed VT323 overrides in the same file must continue to win. They use `font-family: 'VT323', …` inside `.theme-* { … }` scopes — confirm by re-reading the file that those scoped rules remain *below* and unchanged.

**Step 3: Verify**

Reload `/`. Body text should render in Inter (look for the distinctive Inter "g" with the curly tail). Theme-switch into a VT323 themed variant (the theme dropdown on Engage routes) — VT323 should still apply inside those theme scopes.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 \
  --screenshot=/tmp/demo-after-1.2.png \
  http://localhost:3000/
```

**Step 4: Commit**

```bash
git add src/pages/_app.tsx src/pages/globals.css
git commit -m "feat(theme): adopt Inter Variable as the default body font"
```

---

### Task 1.3: Copy the marketing logo file

**Files:**
- Create: `public/images/frigade-logo.svg` (copied from marketing)

**Step 1: Copy the file**

```bash
cp /Users/ericbrownrout/Library/Code/marketing-ai-experiment/new-website/public/images/frigade-logo.svg \
   /Users/ericbrownrout/Library/Code/demo-v2/public/images/frigade-logo.svg
```

**Step 2: Verify the file**

```bash
ls -la public/images/frigade-logo.svg
file public/images/frigade-logo.svg
```

Expected: SVG file present, ~few KB.

Also keep the existing `public/images/frigade.svg` for now — Task 2.2 swaps the header import to the new file. We don't delete the old one in this task because nothing references the new file yet.

**Step 3: Commit**

```bash
git add public/images/frigade-logo.svg
git commit -m "chore(assets): import frigade-logo.svg from the marketing brand"
```

---

### Task 1.4: Create `src/lib/products.ts` (2-product version)

**Files:**
- Create: `src/lib/products.ts`

**Step 1: Write the file**

```ts
import { CodeXml, Sparkles, type LucideIcon } from "lucide-react";

export type ProductSlug = "assistant" | "engage";
export type ProductColor = "brand" | "engage";

export type Product = {
  slug: ProductSlug;
  name: string;
  href: string;
  icon: LucideIcon;
  color: ProductColor;
};

export const products: Product[] = [
  { slug: "assistant", name: "Assistant", href: "/", icon: Sparkles, color: "brand" },
  { slug: "engage", name: "Engage", href: "/forms", icon: CodeXml, color: "engage" },
];

export function getProduct(slug: ProductSlug): Product {
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Unknown product slug: ${slug}`);
  return product;
}

// Per-product accent colors as hex (matches marketing's --color-brand /
// --color-engage). Used by the chooser to color each product's icon and
// active-pill glow.
export const productAccent: Record<ProductColor, { hex: string; rgb: string }> = {
  brand: { hex: "#015EFB", rgb: "1, 94, 251" },
  engage: { hex: "#404E61", rgb: "64, 78, 97" },
};
```

**Notes:**
- Scoped intentionally to 2 products (per design). Knowledge / demo are not added.
- `engage.href` points at `/forms` (the first Engage flow) — toggling to Engage from Assistant lands on a working flow, not a 404.
- `productAccent` is the single source of truth for per-product color. Component code references `productAccent[product.color].hex` instead of hard-coding values.

**Step 2: TypeScript check**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors related to the new file.

**Step 3: Commit**

```bash
git add src/lib/products.ts
git commit -m "feat(lib): add 2-product products.ts (Assistant + Engage)"
```

---

### Task 1.5: Port `CtaButton` from marketing

**Files:**
- Create: `src/components/ui/cta-button.tsx`

**Step 1: Read the marketing source**

```bash
cat /Users/ericbrownrout/Library/Code/marketing-ai-experiment/new-website/components/marketing/cta-button.tsx
```

Note: the marketing version has multiple variants (`primary`, `secondary`, `engage`, `knowledge`, `demo`). For the demo we only need `primary` + `secondary` per the design doc.

**Step 2: Write the demo version**

Trim to 2 variants and adapt imports. `Link` import is already correct for Pages Router (`next/link`). `cn` lives at `@/lib/utils` (verify path matches demo's tsconfig).

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CtaVariant = "primary" | "secondary";

// Extracted from the live frigade.com scrape — exact gradient + multi-layer
// shadow lifted verbatim.
export const ctaVariantStyles: Record<CtaVariant, string> = {
  primary:
    "rounded-lg text-white bg-[linear-gradient(rgb(0,110,255)_0%,rgb(0,86,248)_100%)] shadow-[inset_0_1px_0.4px_0_rgba(255,255,255,0.28),inset_0_-3px_2px_0_rgba(0,0,0,0.24),0_1px_1px_0_rgba(0,0,0,0.14),0_2px_4px_0_rgba(0,30,90,0.16),1px_4px_10px_0_rgba(0,86,248,0.18),0_0_0_1px_rgb(13,97,255)]",
  secondary:
    "rounded-md text-[rgb(26,27,47)] bg-[linear-gradient(rgb(255,255,255)_0%,rgba(194,200,209,0.12)_100%)] shadow-[inset_0_1px_0.4px_0_rgba(255,255,255,0.9),inset_0_-2px_2px_0_rgba(20,30,60,0.08),0_1px_1px_0_rgba(0,0,0,0.06),0_2px_4px_0_rgba(20,30,60,0.08),0_0_0_1px_rgba(18,55,105,0.1)]",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  className?: string;
}) {
  const base =
    "relative inline-flex flex-col items-center justify-center gap-[10px] w-min cursor-pointer overflow-hidden no-underline px-4 py-1.5 text-sm font-medium leading-[1.6] whitespace-nowrap transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(base, ctaVariantStyles[variant], className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, ctaVariantStyles[variant], className)}>
      {children}
    </Link>
  );
}
```

**Adaptations vs marketing source:**
- Trimmed `CtaVariant` to just `primary | secondary`.
- `focus-visible:ring-brand` (Tailwind v4 utility from marketing's @theme) → `focus-visible:ring-ring` (uses demo's `--ring` token, which Task 1.1 set to brand).

**Step 3: Verify**

```bash
pnpm exec tsc --noEmit
```

Expected: no errors. The component isn't rendered anywhere yet — no visual check needed in this task.

**Step 4: Commit**

```bash
git add src/components/ui/cta-button.tsx
git commit -m "feat(ui): port marketing CtaButton (primary + secondary)"
```

---

## Phase 2 — Brand surfaces

These three tasks consume the foundations from Phase 1. After Phase 2, the demo's chrome (header + footer cards) will read as the new brand.

### Task 2.1: Restyle the product chooser pills in the header

**Files:**
- Modify: `src/components/header.tsx` (the chooser segment between the logo and the right-side CTAs)

**Step 1: Read the current chooser**

```bash
sed -n '30,55p' src/components/header.tsx
```

Identify the `<div className="grid grid-cols-2 …">` wrapping the two `<button type="button">` chooser pills.

**Step 2: Replace the chooser implementation**

Change the chooser to render from `products` and show per-product icon + color. The toggle UX (both options visible, one click to swap) is preserved.

Add this import at the top of `src/components/header.tsx`:

```tsx
import { products, productAccent, type ProductSlug } from "@/lib/products";
```

Replace the existing chooser `<div>` (the one with `grid grid-cols-2`) with:

```tsx
<div className="inline-flex items-center rounded-full border border-border bg-muted p-1">
  {products.map((product) => {
    const isActive = product.slug === experience;
    const accent = productAccent[product.color];
    const Icon = product.icon;
    return (
      <button
        key={product.slug}
        type="button"
        onClick={() => switchExperience(product.slug)}
        aria-pressed={isActive}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
          isActive
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        style={
          isActive
            ? { boxShadow: `0 0 0 1px rgba(${accent.rgb}, 0.18), 0 1px 2px rgba(${accent.rgb}, 0.08)` }
            : undefined
        }
      >
        <span
          className="flex h-4 w-4 items-center justify-center rounded-[5px] text-white"
          style={{ background: accent.hex }}
        >
          <Icon className="h-3 w-3" strokeWidth={2.25} />
        </span>
        {product.name}
      </button>
    );
  })}
</div>
```

Key details:
- `switchExperience` already exists in the file — it accepts `'assistant' | 'engage'`, which matches `ProductSlug`. No type change required.
- Active pill: white background (`bg-background`), per-product color glow ring via inline `boxShadow` (Tailwind can't express dynamic-color shadows cleanly).
- Inactive pill: muted text, hovers to foreground.
- The square icon next to the name uses the per-product hex from `productAccent`.

**Step 3: Verify**

Reload `/`. The chooser should show:
- Two pills with icons (a Sparkle on the left for Assistant in brand-blue, a `</>` on the right for Engage in slate).
- Active pill has a soft per-product color glow.
- Click switches experience as before.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 \
  --screenshot=/tmp/demo-after-2.1.png \
  http://localhost:3000/
```

Compare against `/tmp/demo-baseline/home-assistant-1440.png` — the chooser should be the most visibly changed element.

**Step 4: Commit**

```bash
git add src/components/header.tsx
git commit -m "feat(header): restyle product chooser with brand icons + colors"
```

---

### Task 2.2: Restyle the header (logo swap, link colors, CTA swap)

**Files:**
- Modify: `src/components/header.tsx` (logo `<Image src>`, right-side text links, "Get started" button)

**Step 1: Swap the logo file**

Find the `<Image src="/images/frigade.svg" …>` element near the top of the header and change its `src` to `/images/frigade-logo.svg`. Leave width/height unchanged.

**Step 2: Restyle the right-side text links**

Find the `HeaderLink` component definition at the bottom of the file (or its inline className if it's not a sub-component). Update the className:

```tsx
className="text-[14px] font-medium text-ink-700 hover:text-brand transition-colors"
```

Wait — Tailwind v3 doesn't know `text-ink-700` or `hover:text-brand` as utility names. Demo's tokens are HSL-based and named (`text-foreground`, `text-primary`). Use those instead:

```tsx
className="text-[14px] font-medium text-foreground/70 hover:text-primary transition-colors"
```

`text-foreground/70` gets us a softer ink-700-ish color (foreground is ink-900, 70% opacity reads similar to ink-700 against white). `hover:text-primary` resolves to brand.

**Step 3: Replace the "Get started" Button with CtaButton**

Find the existing `<Button size="sm" className="bg-blue-600 hover:bg-blue-700 …">` near the bottom of the header (the right-side primary CTA). Replace it with:

```tsx
import { CtaButton } from "@/components/ui/cta-button";
// …
<CtaButton href={/* same href as before */} variant="primary">
  Get started
</CtaButton>
```

Remove the surrounding `<Button asChild>` + `<Link>` wrapper if present — `CtaButton` handles the link itself based on `href`.

**Step 4: Verify**

Reload `/`. Header should show:
- New `frigade-logo.svg` (subtle differences from the old wordmark — may be wider or use different letter spacing).
- Right-side links in soft ink color, hover to brand-blue.
- Primary CTA now has the gradient + multi-layer shadow look from marketing.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,900 \
  --screenshot=/tmp/demo-after-2.2.png \
  http://localhost:3000/
```

**Step 5: Commit**

```bash
git add src/components/header.tsx
git commit -m "feat(header): swap logo, restyle links, replace CTA with CtaButton"
```

---

### Task 2.3: Restyle the footer flow-grid cards

**Files:**
- Modify: `src/components/footer.tsx` (the `LinkButton` sub-component)

**Step 1: Read current `LinkButton`**

```bash
sed -n '50,80p' src/components/footer.tsx
```

**Step 2: Update the className on `<Link>` and the inner `<h2>` / `<p>`**

```tsx
<Link
  href={href}
  className="group rounded-lg border border-border bg-background px-5 py-4 transition-colors hover:border-foreground/20 hover:bg-secondary"
>
  <h2 className="mb-1 text-base font-semibold text-foreground">
    {title}{" "}
    <ArrowRight
      size={16}
      className="inline-block text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary motion-reduce:transform-none mb-[2px]"
      stroke="currentColor"
    />
  </h2>
  <p className="m-0 max-w-[30ch] text-xs text-muted-foreground">
    {description}
  </p>
</Link>
```

Key changes:
- `border-gray-200` → `border-border` (token-driven)
- `hover:border-gray-300 hover:bg-gray-100` → `hover:border-foreground/20 hover:bg-secondary` (token-driven)
- `text-black` → `text-foreground`
- `opacity-50 text-gray-600` → `text-muted-foreground` (single-purpose, no opacity stacking)
- ArrowRight gains `text-muted-foreground` resting state and `group-hover:text-primary` for brand accent on hover

**Step 3: Verify**

Switch the chooser to Engage so the footer renders. Reload `/forms` (or any Engage route).

```bash
# Toggle to Engage first (manual click), then capture
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,1200 \
  --screenshot=/tmp/demo-after-2.3.png \
  http://localhost:3000/forms
```

Cards should render with brand-aligned borders + ink text colors. Hover (you'll need to test in a real browser, not headless) should turn the arrow brand-blue.

**Step 4: Commit**

```bash
git add src/components/footer.tsx
git commit -m "feat(footer): restyle flow-grid cards with brand tokens"
```

---

## Phase 3 — New behaviors

These three tasks are independent and can be done in any order. Listed in suggested order: structural change first (sticky footer), then logical wiring (deep linking), then investigation (video bug).

### Task 3.1: Sticky footer page layout

**Files:**
- Modify: `src/pages/_app.tsx` (the outer `<main>` wrapper)
- Possibly modify: `src/components/main.tsx` (if Main's children fragment causes flex spacing issues)

**Step 1: Diagnose current behavior**

Switch to Engage experience. Visit a route with short content (`/forms` early state) and a route with long content (`/checklists` after expanding). Note where the footer sits.

Current `<main>` in `_app.tsx`:
```tsx
<main className="flex bg-[#F6F8F7] min-h-screen flex-col items-center justify-between p-0 gap-8">
  <Header />
  <Main>{children}</Main>
  <Footer />
</main>
```

`justify-between` distributes children — this *can* push the footer to the bottom only if there are exactly the right number of flex children. Because `<Main>` is a Fragment that renders multiple `<div>`s, the actual flex children of `<main>` exceed 3, and `justify-between` distributes them across the height instead of pinning the footer.

**Step 2: Restructure the wrapper**

Replace `<main>` so Main's content is wrapped in a single `flex-1` div:

```tsx
<main className={`${inter.variable} flex bg-[#F6F8F7] min-h-screen flex-col items-center p-0 gap-8`}>
  <Header />
  <div className="flex w-full flex-1 flex-col items-center">
    <Main>{children}</Main>
  </div>
  <Footer />
</main>
```

Key changes:
- Removed `justify-between`. Replaced with `flex-1` on a single Main wrapper.
- The wrapping div is `w-full` so Main's existing horizontal sizing doesn't break.
- `flex-col items-center` preserves Main's centered alignment.
- Footer is now naturally pushed to the bottom because the wrapper takes all remaining space.

**Step 3: Replace the hardcoded background with a token**

In the same `<main>` element, change `bg-[#F6F8F7]` → `bg-secondary` (which now resolves to ink-100 via Task 1.1's repoint). Verify the page still has the soft off-white background feel — `#f4f5f7` (ink-100) is very close to `#F6F8F7`.

**Step 4: Verify**

Reload `/forms`. Resize browser window to be very tall — the footer should remain at the bottom of the viewport even when Main's content is short. Resize to be very short — the footer should push past the fold. Toggle to Assistant — the footer renders `null` from inside the component, but the layout still leaves space (the wrapper is just empty above where the footer would be — that's fine).

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1440,1400 \
  --screenshot=/tmp/demo-after-3.1.png \
  http://localhost:3000/forms
```

The footer should be visible at the bottom of the screenshot (not floating in the middle).

**Step 5: Commit**

```bash
git add src/pages/_app.tsx
git commit -m "fix(layout): make footer sticky to viewport bottom on desktop"
```

---

### Task 3.2: Deep linking via `?product=` query param

**Files:**
- Modify: `src/components/experience-context.tsx`

**Step 1: Read current `ExperienceProvider`**

```bash
cat src/components/experience-context.tsx
```

Note the current initialization: it infers experience from `router.pathname` against `ENGAGE_ROUTES`.

**Step 2: Update `ExperienceProvider` to read `?product=` first**

```tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

export type ExperienceType = 'assistant' | 'engage';

interface ExperienceContextType {
  experience: ExperienceType;
  setExperience: (experience: ExperienceType) => void;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

const ENGAGE_ROUTES = ['/forms', '/tours', '/hints', '/checklists', '/modals', '/cards'];

function isExperience(value: unknown): value is ExperienceType {
  return value === 'assistant' || value === 'engage';
}

function inferFromPath(pathname: string): ExperienceType {
  return ENGAGE_ROUTES.some((route) => pathname.startsWith(route)) ? 'engage' : 'assistant';
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  // 1. Query param wins. 2. Path inference falls back.
  const queryProduct = router.query.product;
  const initial: ExperienceType = isExperience(queryProduct)
    ? queryProduct
    : inferFromPath(router.pathname);

  const [experience, setExperienceState] = useState<ExperienceType>(initial);

  // If the URL changes (or the query param appears after first render via
  // hydration), sync state to it.
  useEffect(() => {
    if (isExperience(queryProduct) && queryProduct !== experience) {
      setExperienceState(queryProduct);
    }
  }, [queryProduct, experience]);

  const setExperience = (next: ExperienceType) => {
    setExperienceState(next);
    // Reflect the choice in the URL without navigating.
    router.replace(
      { pathname: router.pathname, query: { ...router.query, product: next } },
      undefined,
      { shallow: true }
    );
  };

  return (
    <ExperienceContext.Provider value={{ experience, setExperience }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}
```

Key changes:
- Read `router.query.product` first; fall back to path inference.
- `setExperience` writes the new value to the URL via `router.replace` with `shallow: true` so no page navigation occurs.
- Add `useEffect` to keep state in sync if the URL changes (e.g. user uses browser back/forward).

**Step 3: Update `header.tsx`'s `switchExperience` to use the context's setter**

The existing `switchExperience` in `header.tsx` calls `setExperience(...)` then `router.push('/')`. After this task, the context's `setExperience` itself updates the URL — so `router.push('/')` is redundant *and* would override the query update.

Find this in `header.tsx`:

```tsx
const switchExperience = (nextExperience: 'assistant' | 'engage') => {
  if (nextExperience === experience) return;
  setExperience(nextExperience);
  router.push('/');
};
```

Replace with:

```tsx
const switchExperience = (nextExperience: 'assistant' | 'engage') => {
  if (nextExperience === experience) return;
  setExperience(nextExperience);
  // setExperience updates ?product= in place — only navigate to / if we
  // were on a flow route that doesn't match the new experience.
  const onEngageRoute = ENGAGE_ROUTES.some((r) => router.pathname.startsWith(r));
  if (nextExperience === 'assistant' && onEngageRoute) {
    router.push({ pathname: '/', query: { product: 'assistant' } });
  }
};
```

You'll need to import `ENGAGE_ROUTES` — easiest: re-export it from `experience-context.tsx`:

```tsx
// In experience-context.tsx, add:
export { ENGAGE_ROUTES };
```

Then in `header.tsx`:

```tsx
import { useExperience, ENGAGE_ROUTES } from '@/components/experience-context';
```

**Step 4: Verify**

Test these scenarios:
1. Visit `http://localhost:3000/?product=engage` directly — chooser should land on Engage.
2. Visit `http://localhost:3000/?product=assistant` — chooser should land on Assistant.
3. Visit `http://localhost:3000/forms` — chooser should land on Engage (path inference).
4. On `/`, click the Engage pill — URL should become `/?product=engage` without a navigation.
5. On `/forms`, click the Assistant pill — should navigate to `/?product=assistant`.
6. Browser back/forward: state should follow the URL.

```bash
node -e "(async () => {
  const { spawn } = await import('node:child_process');
  const ports = [9555];
  // Use the click-shot.mjs pattern from previous sessions, or test manually.
})();"
```

(Test manually in a browser for these — CDP scripting is overkill for navigation testing.)

**Step 5: Commit**

```bash
git add src/components/experience-context.tsx src/components/header.tsx
git commit -m "feat(routing): deep-link the product chooser via ?product=

Initial state honors ?product=assistant or ?product=engage from the URL,
falling back to path inference (ENGAGE_ROUTES). Manual chooser clicks
shallow-update the URL so the choice is shareable. No navigation when
switching within a route the new experience can render."
```

---

### Task 3.3: Reproduce + fix the homepage video double-play bug

**Files (likely):**
- Modify: `src/pages/index.tsx` (the conditional YouTube iframe)

This task starts with reproduction — the fix can't be designed until the mechanism is confirmed.

**Step 1: Reproduce**

Visit `http://localhost:3000/` in a browser with audio on. Steps:
1. Page loads, Assistant experience selected, YouTube iframe should autoplay.
2. Click chooser pill to Engage. Iframe disappears (conditionally unmounted).
3. Click back to Assistant. Iframe remounts and autoplay fires.
4. Repeat 5–10 times in rapid succession.
5. Listen for: overlapping audio streams, ghost playback continuing after switch-away, double-volume audio.

Document what you actually hear/see in a `/tmp/demo-video-bug.md` scratch file:

```bash
cat > /tmp/demo-video-bug.md <<'EOF'
# Video bug reproduction

Steps performed: …
Observed: …
Network tab: …
Console: …
EOF
```

**Step 2: Identify the mechanism**

Check the suspected root cause from the design doc:
- `index.tsx` conditionally mounts an `<iframe src="https://www.youtube.com/embed/…?autoplay=1…">`
- React unmounts the iframe when `experience !== 'assistant'`
- YouTube's player inside the iframe doesn't get a clean teardown signal — depending on browser caching of the iframe + autoplay policies, audio may persist briefly OR a stale player may double-fire on remount

If reproduction confirms this (most likely): proceed with Step 3a. If you observe a different mechanism (e.g. visibilitychange double-fires, two iframes mounting simultaneously, etc.): write up the actual mechanism and ask for guidance before fixing.

**Step 3a: Fix — keep the iframe always mounted, toggle visibility**

Update `src/pages/index.tsx`. Replace the conditional iframe block with:

```tsx
// Always mount the iframe so toggling the chooser doesn't remount the YouTube
// player. Hide via CSS when not active. Use the YouTube IFrame API
// (`enablejsapi=1`) to programmatically pause/play on chooser change.
<div
  className={`w-full max-w-[800px] mt-6 rounded-xl overflow-hidden shadow-lg border border-gray-100 ${
    experience === 'assistant' ? 'block' : 'hidden'
  }`}
>
  <iframe
    ref={iframeRef}
    src="https://www.youtube.com/embed/FhHSj8YpR2U?autoplay=1&controls=1&loop=1&playlist=FhHSj8YpR2U&enablejsapi=1"
    frameBorder="0"
    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }}
    title="Frigade AI"
  />
</div>
```

Add the imperative pause/play via the YouTube IFrame API:

```tsx
import { useEffect, useRef } from 'react';
// …
const iframeRef = useRef<HTMLIFrameElement>(null);

useEffect(() => {
  const iframe = iframeRef.current;
  if (!iframe || !iframe.contentWindow) return;
  const command = experience === 'assistant' ? 'playVideo' : 'pauseVideo';
  iframe.contentWindow.postMessage(
    JSON.stringify({ event: 'command', func: command, args: [] }),
    '*'
  );
}, [experience]);
```

Notes:
- `enablejsapi=1` enables postMessage-based control of the embedded player (YouTube IFrame API).
- The `useEffect` runs on every `experience` change, sending a `playVideo` or `pauseVideo` command into the iframe.
- The iframe is now `hidden` (display: none) when not active — but it's still in the DOM, so the player instance persists across toggles.

**Step 3b: Alternate fix — clean unmount via `key` prop**

If Step 3a doesn't resolve the issue (e.g. `display: none` causes the YouTube player to throttle weirdly), try forcing a clean teardown each toggle by giving the iframe a `key` derived from a remount counter:

```tsx
{experience === 'assistant' && (
  <iframe
    key={mountKey}
    src="https://www.youtube.com/embed/…"
    …
  />
)}
```

…where `mountKey` increments via a `useEffect` on `experience` change. This ensures React fully tears down the iframe before remounting.

**Step 4: Verify**

Repeat the reproduction steps from Step 1. Confirm:
- No overlapping audio.
- No double playback when switching back to Assistant.
- Video continues playing where it left off when toggling away and back (with Step 3a fix).

Update `/tmp/demo-video-bug.md` with the fix taken and the verification result.

**Step 5: Commit**

```bash
git add src/pages/index.tsx
git commit -m "$(cat <<'EOF'
fix(homepage): stop YouTube iframe double-play on chooser toggle

The hero iframe was conditionally mounted on `experience === 'assistant'`,
so toggling the chooser unmounted/remounted the YouTube player. The
remount fired autoplay while the previous player's audio tail was still
in flight, producing brief overlap.

Keeps the iframe always mounted (CSS-hidden when Engage is active) and
uses the YouTube IFrame API (enablejsapi=1) to postMessage pauseVideo /
playVideo on toggle, so the same player instance persists across
switches.
EOF
)"
```

---

## Final verification

### Task F.1: End-to-end visual review

**Step 1: Capture all final screenshots**

```bash
for route in / /forms /tours /hints /checklists /modals /cards; do
  safe=$(echo "$route" | tr '/' '-' | sed 's/^-//; s/^$/home/')
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1440,1400 --virtual-time-budget=4000 \
    --screenshot=/tmp/demo-final-${safe:-home}.png \
    "http://localhost:3000${route}?product=$([ "$route" = "/" ] && echo assistant || echo engage)"
done
```

**Step 2: Diff against baselines**

Open both `/tmp/demo-baseline/*.png` and `/tmp/demo-final-*.png` in an image viewer side-by-side. The expected differences:
- Brand-blue replaces near-black on primary buttons + focus rings.
- Inter font replaces system font.
- Header chooser pills have product icons + colors.
- Header CTA has gradient + shadow.
- Logo file is the marketing wordmark.
- Footer cards have brand-aligned borders / hover states.
- Sticky footer always sits at viewport bottom on tall windows.

**Step 3: Behavior smoke tests** (manual, in real browser)

- `/?product=assistant` → Assistant.
- `/?product=engage` → Engage.
- `/forms` → Engage (path inference).
- Chooser click on `/` updates URL.
- Chooser click on `/forms` (toggle to Assistant) navigates to `/?product=assistant`.
- Toggle chooser on `/` 10 times — no double-play, no audio overlap.

**Step 4: Production build sanity**

```bash
pnpm build
```

Expected: build succeeds, no TypeScript errors, all routes prerender.

**Step 5: No commit** (final task is verification only).

---

## Out-of-scope follow-ups (for the next iteration)

These are explicitly NOT in this plan. Track them separately:

- Path-based product routing (`/assistant`, `/engage`) and per-product demo home pages.
- Tailwind v4 migration + adopting marketing's `@theme` block directly.
- A 4-product chooser if/when Knowledge and pre-sales gain demo flows.
- Replacing the in-flow shadcn `Button` with the marketing CtaButton voice across all functional buttons.
- Adopting marketing's full footer (address, socials, status diamond) — demo's footer serves a different purpose (in-demo navigation).

---

## Rollback

If any phase causes a regression:

- **Phase 1 only**: `git revert <task-1.x-commit>` per task. Token repoint and font are independent.
- **Phase 2**: depends on Phase 1 token names existing (e.g. `bg-secondary`, `text-foreground`). Revert Phase 2 commits before Phase 1.
- **Phase 3**: independent of each other. Revert any single one.

Each task is its own commit by design — revert is always granular.
