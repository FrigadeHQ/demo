# Marketing-site style parity

## October 16, 2026 refresh

Reference: the deployed `frigade.com` site and marketing commit `c680502`. Demo baseline: `12a8615`. Review branch: `fix/marketing-parity-oct16`.

| Before | After | Why |
| --- | --- | --- |
| 36px text-only announcement inside the sticky header | 56px banner with New badge, Learn more button, and the current three-state pixel animation; banner scrolls above the sticky navigation | Match the current shared banner geometry and scroll behavior |
| Inter across marketing and product UI | Atkinson Hyperlegible Next for marketing, IBM Plex Mono for menu headings, Inter retained inside Northwind | Use the same typefaces as the main site without changing the embedded product |
| Older Features and Resources promos and link lists | Hotplate in Features; demo promo and Valley footer in Resources; current Reviews, Security, and link descriptions | Keep both desktop and mobile navigation current |
| Two login destinations | Assistant, Assist API, and Engage, using the existing dashboard destinations | Match the main site's product chooser |
| Older drifting dots on promos and CTAs | Same tightly spaced pixels as the new banner, with clear space around promo arrows | Keep texture, animation, and contrast consistent |
| SOC badge alone in the footer | Current G2, SOC, and GDPR row, plus Reviews and Security links | Match the live footer's assets, scale, and spacing |

The banner and dot drawing use the marketing site's existing design and algorithm. The canvas pauses offscreen, in background tabs, and under reduced motion. The bundled Atkinson font is the same Latin variable font served by the main site; its OFL license is included. No dependencies were added.

Verification: production build, TypeScript, `scripts/check-animated-dots.cjs`, and diff checks pass. Both local product URLs respond successfully; new local assets, banner ordering, and font scopes were checked in served HTML. Source checks confirm Northwind, the product selector, providers, flow definitions, signup attribution, and Cal booking targets are unchanged. Existing native-image and hook-dependency build advisories remain.

Fresh desktop/mobile visual and interaction review is pending: the browser connection is unavailable. HTTP checks do not verify hydrated product switching or menu interaction. No forms or bookings were submitted.

Local review: [Assistant](http://127.0.0.1:3292/) and [Engage](http://127.0.0.1:3292/?product=engage). This refresh is not deployed. The September notes below describe the earlier parity pass.

## September 17, 2026 baseline

Reference: the Frigade marketing navigation/footer released in `a7c1bb7` on September 17, 2026. This pass is on `design/marketing-parity`, based on demo-v2 `855a720`.

## Visual changes

| Before | After | Why |
| --- | --- | --- |
| Products, Features, Why Frigade, How it works, Pricing | Products, Features, Resources, Pricing; How it works in the Products footer and Resources | Keep navigation continuous across frigade.com and demo.frigade.com. |
| Older product descriptions and a “working app” demo claim | Approved product descriptions and “See Frigade in action” | Match the product positioning and describe the demo accurately. |
| Footer actions confined to the promo column; staggered menu rows | Full-width footer actions, uniform neutral hover surfaces, quick reveal and immediate menu swaps | Consistent click targets and less visual movement while navigating. |
| Mobile menu omitted feature links; login went to one dashboard | Grouped Features and Resources accordions; chooser for both dashboards | Retain the main site's navigation on a phone without one long link list. |
| Raised, recessed demo switcher | Flat surface, quiet selection border, restrained product-color icons | Match the new marketing chooser while keeping both demo choices visible. |
| Footer divided into two uneven tiers | Compact brand row, four directory columns, wrapping comparison row | Clearer grouping and space for more comparison pages. |
| Heavy badge shadow, blue legal text, static status claim | Shadows scaled for 20px icons, readable neutral legal text, “System status” | Match the header icons and avoid asserting unverified service availability. |
| Footer art had a fixed mobile height | Responsive clearance between the compass and F-mark | Prevent artwork overlap near the tablet breakpoint. |
| Floating rounded marketing cards and video frames | Square, ruled benefit cells and CTA frame; lighter square video frames | Extend the approved grid styling around the actual product demonstrations. |

The Northwind application, Frigade flow definitions, product query context, provider, video playback controls, signup attribution, and existing Cal booking targets are unchanged. Marketing links continue to cross to frigade.com. Contact/custom-demo links use its existing hash entry points; the footer's existing native Cal booking remains intact. Unlisted and draft products stay absent from navigation.

## Verification

- `tsc --noEmit` passed.
- `next build` passed and prerendered all four pages. Existing hook-dependency and native-image advisories remain; no new hook-dependency warnings in the navigation implementation.
- `git diff --check` passed.
- Compared the Northwind implementation and provider/flow/query files against the base commit: unchanged, apart from the added marketing icon import.
- Reviewed fresh browser output from development and the production build. Both Assistant and Engage load; the flat chooser changes `?product=` and active state correctly.
- Desktop menus, full-width actions, Resources links and product destinations checked. No broken images or console errors in the final production preview.
- At 390px, Features expands to its 11 feature links plus the footer action. Login offers both dashboards. Escape closes Login first, then navigation, and restores focus to Open menu. The drawer locks background scrolling.
- No horizontal page overflow at 390px, 767px or 1440px. Footer compass/F-mark clearance measured approximately 122px, 30px and 39px respectively.
- Engage pricing, signup and legal destinations retain Engage routing. Assistant restores its own signup and legal destinations. Signup links retain `ref=demo`.
- Active and inactive Assistant videos remain muted. No lead forms or bookings were submitted during this review.

## Review

Local production preview: `http://localhost:3217/` and `http://localhost:3217/?product=engage`.

This demo-site pass is ready for visual review and has not been deployed. The separate Assist API illustration correction remains a follow-up: the ping flies to its destination, lands, and then emits its pulse; the previous Assist implementation should be used as the motion reference.

## CTA and frame refinements

| Before | After | Why |
| --- | --- | --- |
| Inset near-white closing card | Rail-to-rail product CTA: bright Assistant blue or Engage slate blue, dot texture, drifting icons, white primary button | Match each corresponding product page and retain its visual hierarchy. |
| Benefit grid capped at 1016px, with mobile gutters | Grid fills its rail wrapper and reaches both edges on mobile | Keep the square cells attached to the page grid. |
| Translucent borders over dark video backgrounds | All four video surfaces share a square, white-backed frame with zero border | Remove the dark strokes and prevent the frames from drifting apart. |
| Static Explore arrow | Drawn underline and 3px arrow movement on hover, with immediate keyboard focus treatment and reduced-motion support | Match the main site's small action links. |

Fresh rendered checks confirmed desktop CTA and grid widths of 1040px, matching their rail wrappers exactly. On mobile they both start at x=0 and fill the content viewport without horizontal overflow. All video frames report 0px borders and 0px radii. Assistant and Engage retain their respective signup attribution and Cal booking destinations. Mobile CTA type is adjusted to avoid isolating “knows” on its own line.
