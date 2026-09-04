# Foundations: the number tables

Source of each table is noted. House defaults are in the last section and win
unless a brand DESIGN.md overrides them.

## Contents
1. Type scales (Apple, Material, house)
2. Spacing and layout
3. Touch and focus
4. Color roles and contrast
5. Shape
6. Depth and elevation
7. Motion
8. Speed budget
9. House defaults

## 1. Type scales

Apple HIG text styles (iOS, pt). Hierarchy comes from weight, not size alone.

| Style | Size | Weight |
|---|---|---|
| Large Title | 34 | bold |
| Title 1 | 28 | regular or bold |
| Title 2 | 22 | regular or bold |
| Title 3 | 20 | regular or semibold |
| Headline | 17 | semibold |
| Body | 17 | regular |
| Subhead | 15 | regular |
| Footnote | 13 | regular |
| Caption 1 | 12 | regular |
| Caption 2 | 11 | regular |

Material 3 type scale (sp, line height, weight, tracking).

| Role | Size | Line | Weight | Tracking |
|---|---|---|---|---|
| Display L | 57 | 64 | 400 | -0.25 |
| Display M | 45 | 52 | 400 | 0 |
| Display S | 36 | 44 | 400 | 0 |
| Headline L | 32 | 40 | 400 | 0 |
| Headline M | 28 | 36 | 400 | 0 |
| Headline S | 24 | 32 | 400 | 0 |
| Title L | 22 | 28 | 400 | 0 |
| Title M | 16 | 24 | 500 | 0.15 |
| Title S | 14 | 20 | 500 | 0.1 |
| Body L | 16 | 24 | 400 | 0.5 |
| Body M | 14 | 20 | 400 | 0.25 |
| Body S | 12 | 16 | 400 | 0.4 |
| Label L | 14 | 20 | 500 | 0.1 |
| Label M | 12 | 16 | 500 | 0.5 |
| Label S | 11 | 16 | 500 | 0.5 |

House web scale (px, use `clamp()` for display and headline on marketing
pages). Tracking negative on display sizes, zero on body.

| Role | Mobile | Desktop | Line | Weight |
|---|---|---|---|---|
| display | 40 | 64 to 96 | 0.95 to 1.05 | 600 to 700 |
| headline | 28 | 34 to 40 | 1.1 to 1.2 | 600 |
| title | 20 | 22 to 24 | 1.3 | 600 |
| body-lg | 18 | 19 to 21 | 1.5 | 400 |
| body | 16 | 17 | 1.55 to 1.65 | 400 |
| label | 12 to 13 | 12 to 13 | 1.4 | 500 |
| caption | 12 | 12 | 1.4 | 400 |

Rules: max two families. Serif body gets slightly more leading than sans.
Line length 65 to 75 characters, never above 80. Body never below 16px on
mobile. Display face above 20px, text face below (Apple). Headline tracking
tight, body relaxed (Stitch).

## 2. Spacing and layout

Grid: 8px base with a 4px half step (Apple 8pt, Material 4dp baseline with
8dp component spacing). Tokens: 4 8 12 16 24 32 48 64 96 128.

Material window classes and margins (dp):

| Class | Width | Columns | Margin | Gutter |
|---|---|---|---|---|
| compact | under 600 | 4 | 16 | 8 |
| medium | 600 to 839 | 8 | 24 | 16 |
| expanded | 840 to 1199 | 12 | 24 | 16 |
| large | 1200 to 1599 | 12 | 24 | 24 |
| extra-large | 1600 plus | 12 | 24 | 24 |

House breakpoints for marketing pages: 640, 860, 1024, 1280. Mobile-first.
All multi-column layouts collapse to one column under 768. No horizontal
scroll on mobile, ever.

Containers: outer 1200 to 1400px centered. Reading column 640 to 720px.
Material says never stretch reading content past about 1040.

Section rhythm: 64 to 96px vertical padding on desktop, 48 on mobile.
Related items closer than unrelated items (tight equals related, Apple).

Safe areas: `env(safe-area-inset-*)` on any full-bleed or fixed element.

## 3. Touch and focus

| Source | Minimum target |
|---|---|
| Apple HIG | 44 x 44 pt |
| Material 3 | 48 x 48 dp, 8dp apart |
| NN/g | about 1 x 1 cm physical |
| House | 48px on ad landers and anything for Boomers, 44px floor elsewhere, 8px apart |

Focus: visible ring on every interactive element via `:focus-visible`, 2px
solid accent with 2 to 3px offset is a safe default. Never `outline: none`
without a replacement. Sticky headers must not cover the focused element.

Touch: `touch-action: manipulation` on buttons and links,
`overscroll-behavior: contain` inside sheets and drawers, gestures always
have a tap and keyboard alternative.

## 4. Color roles and contrast

Material role pairing (mandatory pairs, never split):

| Fill | Content | Use |
|---|---|---|
| primary | on-primary | high-emphasis actions, the one CTA |
| secondary | on-secondary | lower-emphasis accents, chips, tonal buttons |
| tertiary | on-tertiary | contrasting accent, badges, highlights |
| error | on-error | errors only |
| surface, surface-container (5 tiers) | on-surface, on-surface-variant | page and nested containers |
| outline | interactive borders needing 3:1 |
| outline-variant | decorative dividers |

Apple label opacities on a background: primary 100, secondary 60, tertiary
30, quaternary 18 percent. Apple grouped surfaces: secondary background
outside, tertiary inside.

Stitch discipline: one accent, saturation under 80 percent, neutral base
(zinc or slate family, or a warm bone), no pure #000000 page ground, no
mixed warm and cool grays, no AI purple or neon blue.

Anthropic: 4 to 6 named hex values total. Spend boldness in one place.

Contrast (WCAG AA): 4.5:1 body text, 3:1 large text (24px regular or 19px
bold and above) and UI borders. Verify with the relative luminance formula.
Meaning never carried by color alone: pair with text, icon, or pattern.

Dark mode: `color-scheme` on `html`, `theme-color` meta matched to the page
ground, native selects given explicit background and color.

## 5. Shape

| Source | Scale |
|---|---|
| Apple | 8 12 16 20 24 capsule; inner radius plus padding equals outer radius |
| Material | 4 8 12 16 20 28 32 48 full; buttons full, cards 12, dialogs 28 |
| House | pick one scale per brand, at most four steps plus pill, document it in DESIGN.md |

Never a magic radius. If cards are 12, nested images inside them at 8 with
4px padding, and so on.

## 6. Depth and elevation

Material: tonal surface color carries depth, shadows only against busy
backgrounds. Levels 0, 1, 3, 6, 8, 12 dp.

House: two surface tiers (page, raised) plus one soft shadow for floating
elements only (menus, sheets, hover on cards). Shadow example:
`0 8px 24px rgba(0,0,0,.12)`. No glows, no colored shadows, no neon.

## 7. Motion

| Tier | Duration | Use |
|---|---|---|
| instant | 100ms | color and border changes on hover |
| fast | 150 to 200ms | buttons, toggles, small reveals |
| normal | 250 to 300ms | panels, sheets, page-load moment |
| slow | 400 to 500ms | large layout transitions only |

Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` default (Apple), ease-out for
entrances, ease-in for exits. Transform and opacity only. List properties
explicitly, never `transition: all`. One orchestrated page-load moment per
page at most, no fade-and-slide on every section, no hover transitions on
every card. `prefers-reduced-motion`: replace with crossfade or nothing.
Anything autoplaying past 5 seconds needs a pause control.

## 8. Speed budget

Core Web Vitals at the 75th percentile of real users:

| Metric | Good | Needs work | Poor |
|---|---|---|---|
| LCP | under 2.5s | to 4s | over 4s |
| INP | under 200ms | to 500ms | over 500ms |
| CLS | under 0.1 | to 0.25 | over 0.25 |

Why: 53 percent of mobile visitors leave past 3 seconds. Bounce probability
rises 113 percent from 1s to 7s. Retail loses up to 20 percent conversion
per second of delay.

Checklist: explicit width and height on every image, hero image
`fetchpriority="high"`, below-fold images `loading="lazy"`, one critical
font preloaded with `font-display: swap`, preconnect to font and CDN hosts,
video loop instead of GIF, no render-blocking scripts in the head, total
page under 1MB on landers.

## 9. House defaults (when no DESIGN.md exists)

- Grid 8px, tokens 4 8 12 16 24 32 48 64 96.
- Container 1280, reading column 680.
- Body 17px at 1.6, label 12px at 500 weight.
- Two families max. Default sans stack for landers:
  `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Neutral base plus one accent, 4 to 6 named tokens.
- Radius scale 4 8 12 pill.
- Targets 48px on landers.
- Motion one moment, 200ms, reduced-motion honored.
