# Marketing-site style parity

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
