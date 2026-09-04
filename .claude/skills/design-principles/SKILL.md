---
name: design-principles
description: Golden Partners house design system. Apple HIG, Material 3, Google Stitch, Anthropic and Vercel rules distilled into one method, plus conversion research and Meta/ClickBank disclosure constraints. Use EVERY time Ben asks to design, build, restyle, or audit a page, lander, VSL page, bridge page, site, business book page, deck, or any UI, or writes or edits a DESIGN.md. Triggers on "design this", "build the lander", "make it look premium", "does this look like AI", "design audit", "score this page", "generate DESIGN.md", "which fonts/colors", "hero section", "CTA", "form". Two modes, brand and direct-response, chosen from the brief. Pairs with the compliance skill on every lander.
---

# Design principles (Golden Partners house system)

Evidence base: `tooling/design-best-practices-research.md`. Numbers live in
`references/`. Read the reference you need, not all of them.

## 0. Pick the mode first

| Mode | When | What changes |
|---|---|---|
| **brand** | Agency site, business book, personal site, Johnny brand, anything that compounds | Full anti-slop rules, asymmetric hero, restraint, one memorable move, no urgency devices |
| **direct-response** | ClickBank landers, bridge pages, VSL pages, lead-gen pages fed by paid traffic | Centered headline over the player allowed, proof stacks, CTA repeated, short paragraphs, disclosure block mandatory, compliance skill runs before ship |

State the mode in one line at the top of your plan. If the brief mixes both
(a brand site with a lead form), run brand mode and borrow only the form and
CTA rules from direct-response.

## 1. Process (do not skip steps)

1. **Read the DESIGN.md** for the brand if one exists (`<brand>/DESIGN.md`).
   It wins over every default below. If none exists and the work is more than
   a one-off, generate one with `references/design-md-template.md` first.
2. **Write the plan before code.** Five lines: mode, audience and device,
   palette (4 to 6 named hex), typefaces (max two), the one memorable move.
   Check the plan against the brief for uniqueness. If it could be any
   company's page, revise.
3. **Build** from the foundations (section 2) and the page pattern that
   matches (`references/page-patterns.md`).
4. **Self-audit** with `references/audit-rubric.md`. Output the score.
5. **Remove one accessory.** Then ship, or hand to the compliance skill
   first if paid traffic touches it.

## 2. Foundations (the defaults, overridden only by a DESIGN.md)

Full tables with Apple and Material values: `references/foundations.md`.

- **Grid**: 8px base, 4px half step. Spacing tokens 4 8 12 16 24 32 48 64 96.
  Section padding 64 to 96 desktop, 48 mobile. Container 1200 to 1400px,
  reading columns 640 to 720px (65 to 75 characters).
- **Type**: at most two families, clearly different if two. Body 16 to 18px,
  line height 1.5 to 1.65. Headline hierarchy by weight and tracking, not
  size alone. Use a named role scale (display, headline, title, body, label)
  and never an ad hoc size. `text-wrap: balance` on headings. Real
  ellipsis and curly quotes. Tabular numerals in any number column.
- **Color**: neutral base (never pure black or pure white as the page
  ground), one accent under 80 percent saturation, every fill has an
  on-color pair. Contrast 4.5:1 body, 3:1 large text and UI borders. Never
  color alone for meaning. Dark and light both defined if the surface
  supports both.
- **Shape**: one radius scale per brand (for example 4 8 12 16 pill). Inner
  radius plus padding equals outer radius when nesting. Buttons share one
  radius across the whole product.
- **Depth**: tonal surfaces first (one or two lighter or darker tiers), then
  one soft shadow tier. No glows, no neon outlines.
- **Targets**: 48px on anything a Boomer taps on a lander, 44px floor
  everywhere else, 8px between targets. Focus ring visible on every
  interactive element, `:focus-visible`, never `outline: none` without a
  replacement.
- **Motion**: one orchestrated page-load moment at most. Everything else
  responds to the user. 150 to 300ms, transform and opacity only, never
  `transition: all`, `prefers-reduced-motion` honored.
- **Speed budget**: LCP under 2.5s, CLS under 0.1, INP under 200ms at p75.
  Explicit width and height on every image, hero image
  `fetchpriority="high"`, everything below the fold `loading="lazy"`,
  critical font preloaded with `font-display: swap`, video loop instead of
  GIF, preconnect to font and asset hosts.

## 3. Page rules that apply in both modes

- First screen on a 375px phone must show: outcome, a hint of the mechanism,
  one CTA, one true credibility signal. Readable in under 10 seconds.
- One primary CTA style per page. Repeat it top, middle, bottom with the
  same label and look. Label says the outcome ("Watch the free video", "Get
  my 3 questions"), never "Submit" or "Continue".
- Forms: 3 fields or fewer on lead-gen, label above the field, semantic
  `type` and `inputmode`, `autocomplete` set, masked phone input, required
  and optional marked, errors inline next to the field, focus the first
  error, submit button stays enabled until the request starts then shows a
  spinner, never block paste.
- Copy in UI: sentence case, active voice, second person, numerals for
  counts, specific button labels, errors say what to do next.
- Images: real photos or composed SVG. Never broken placeholder links, never
  fake dashboards, never fabricated metrics or placeholder names.

## 4. Direct-response additions

Detail: `references/page-patterns.md` sections 2 to 4.

- Headline above the player or above the fold: specific outcome plus
  mechanism tease, no reveal. Message match: same vocabulary and mechanism
  name as the ad that sent the click.
- Credibility in the first 3 seconds, and every credibility item has
  paperwork (signed testimonial, real credential, real media mention).
- **Disclosure block** is a first-class component: adjacent to the claim it
  qualifies, in view without scrolling, 12pt or larger, same contrast as
  body, never link-only, never contradicted by anything else on the page.
  Testimonials with atypical results carry a typical-results line in the
  same view. Material connections disclosed.
- No timers, no fake scarcity, no implied doctor or celebrity endorsement,
  no photoreal organs, no "you/your plus health attribute" hooks. These are
  compliance rules and they are also design rules: do not draw the slot.
- Paragraphs 2 to 3 sentences. Grade 6 readability. Large high-contrast
  benefit-labeled button. Persistent CTA for warm traffic and lower prices,
  delayed CTA only for cold high-ticket VSLs.

## 5. Brand additions

Detail: `references/anti-patterns.md` and `references/page-patterns.md`
section 5.

- Open with the most characteristic thing in the subject's world, not a
  generic hero. Asymmetric or split hero preferred. Centered hero only
  when the content is a single statement.
- Spend boldness in exactly one place per page: a type moment, a color
  moment, or a structural moment. Not all three.
- Typography: prefer distinctive faces. Avoid Inter, Times, Georgia,
  Garamond, Palatino as brand faces. Good sans: Geist, Outfit, Cabinet
  Grotesk, Satoshi, Archivo. Good serif: Fraunces, Instrument Serif,
  Newsreader. Body may fall back to a system stack on affiliate landers.
- No equal three-card grids. Use a two-column zig-zag, an asymmetric grid,
  or a list with rules.
- No urgency devices, no countdowns, no stacked badges. Proof is quiet and
  specific.

## 6. Audit mode

Trigger phrases: "design audit", "score this page", "does this look like
AI", "review the UI". Steps:

1. Read the file(s). Fetch the live Vercel rules with the
   `web-design-guidelines` skill and run them for the engineering layer.
2. Score the ten categories in `references/audit-rubric.md`, 0 to 10 each,
   report the average times 10 as a score out of 100, list auto-fails
   first, then findings as `file:line` with the fix.
3. Compute contrast for every text and background pair in the tokens (a
   short Python snippet is fine). Report the pairs under 4.5:1 body or
   3:1 large.
4. End with: the score, the three highest-leverage fixes, and whether the
   page needs the compliance skill before it ships.

## 7. DESIGN.md generation

Trigger: "generate DESIGN.md", "write the design system for X", or step 1
of the process when no file exists. Use `references/design-md-template.md`.
Infer from real CSS and content when a site exists, then do a hand pass.
Never merge two DESIGN.md files by prompt; rename the old one and reconcile
by hand. Store at `<brand>/DESIGN.md` so Claude Design finds it when the
repo is connected.

## 8. Hand-offs

- Copy: `direct-response-copy`, `landing-page-copy`, `ad-copy`, then
  `copychief` for review. Design does not write the sales copy, it shapes
  the container the copy lives in.
- Aesthetic direction on a blank brief: `frontend-design` (Anthropic) can
  run first to pick a direction, then this skill sets the system.
- Engineering audit: `web-design-guidelines` (Vercel).
- Ship gate for paid traffic: `compliance`. Always.
