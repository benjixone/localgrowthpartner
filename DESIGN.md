# Design system: Local Growth Partner

Mode: brand with direct-response elements. Owner: Ben Lev. Updated:
2026-09-08 (pass 4 approved on the home page, then ported to every page).
Source of truth for `css/lgp.css`, which every page links: `index.html`,
the lander `scan/`, `proof/`, `onboard.html`, and `thanks/`. Tokens and
components live in the stylesheet once; pages carry only markup and their
own scripts.

## 0. Lineage: which installed skill decided what

| Decision | Source | What it said |
|---|---|---|
| One sans family at display weights with tight negative tracking, headline weight 800, body 17px at 1.47, lead 21 to 24px | `design-references/companies/apple/DESIGN.md` (SF Pro Display, "Apple tight" tracking, body at 17 not 16) | Apple runs one family and gets hierarchy from size, weight, and tracking |
| Manrope, self-hosted, variable | Apple substitution rule (system-ui first, a geometric humanist for other platforms), `stitch-taste-design` (no Inter as a brand face, Outfit or similar), `ui-ux-pro-max` (fonts load once, no render-blocking stylesheet) | Google Sans is not licensable; Manrope is the closest open geometric with Google-like roundness and Apple-like neutrality |
| Page as a stack of full-bleed tiles: white, gray #F5F5F7, near-black, the color change is the divider, 128px section padding, no borders on cards, no gradients, exactly one shadow (the product) | Apple DESIGN.md (tile alternation, elevation table, "exactly one drop-shadow in the entire system") | |
| Hero: centered stack, giant headline, one-line lead, pill CTA plus a chevron text link, product on a gray surface below | Apple DESIGN.md (product tile anatomy, `button-primary` pill and `text-link`), `ui-ux-pro-max` landing pattern (hero image is the product) | |
| Tonal containers: pale orange surface for feature illustrations and the guarantee tile, 28 to 36px radii, pill buttons | `material-3` (tonal surfaces carry depth, not shadows; shape scale up to 28dp and M3 Expressive larger), `design-references/styles/material` | Google's marketing chassis |
| Feature rows alternating text and framed illustration | Google product pages via `design-references/styles/material` and `ui-ux-pro-max` "Hero + Features + CTA" | |
| Big-number proof tile on near-black | Apple product pages (stat callouts), `material-3` Expressive research (bolder, larger emphasis is found faster by older users) | |
| Sticky bottom bar on phones with the guarantee line and the CTA | Apple DESIGN.md `floating-sticky-bar` (parchment 80 percent, backdrop blur, running total left, CTA right) repurposed as the conversion bar | |
| One accent at 80 percent saturation, white text on it for the primary button (3.4:1, large-text threshold met at 17px semibold on a 48px button is not enough, so the button text is 17px 600 which is under the 18.66px bold rule; see gap 3) | `stitch-taste-design` color discipline, `web-design-guidelines` contrast | |
| Real founder photograph, first-person guarantee copy | `frontend-design` ("open with the most characteristic thing"), conversion research in `design-principles` | The two stock "founder" photos in img/ are not Ben and are never used. Testimonials keep initials discs: no AI face is ever attached to a real person's quote (FTC endorsement guides, ClickBank testimonial rule). Client names on the wall stay as type until each business supplies its logo and permission. |
| The typed ChatGPT conversation as the single page-load moment, reduced-motion shows the final state | `frontend-design` ("one orchestrated moment") | |
| Forms and CTA rules, 48px targets, focus rings, no placeholder-only labels | `web-design-guidelines`, `apple-hig`, `material-3` | Applied on the lander when it is ported |

## 1. Overview and atmosphere

A product company's page for a local-growth service. White canvas, giant
sans headlines, the product mock as the hero image, proof as big numbers
on near-black, Google-style tonal feature rows, a real face behind the
guarantee, one orange. Dials: variance 3, motion 2, density 2.

## 2. Colors

### Surfaces
- Canvas (#FFFFFF), the page.
- Surface (#F5F5F7), Apple's gray. The promo strip, the product stage, the
  trust pill, the pricing tile, the toggle track, the footer.
- Surface 2 (#E8E8ED), image wells inside cards.
- Tonal (#FBEDE4), the orange-tinted container. Feature illustration
  frames, the guarantee tile, check discs. Tonal 2 (#F6DDCB) for the
  portrait well.
- Tile (#0B1524), the near-black tile for proof and the closing CTA.
  Tile 2 (#132038), cards on it.
- Hairline (black at 8 percent), the nav rule, FAQ rules, feature-row
  dividers. No card has a border.

### Text
- Ink (#1D1D1F), all text on light. Ink 2 (#6E6E73), leads and body on
  light, 5.0:1 on white. Ink 3 (#86868B), fine print, 3.5:1, 12px legal
  only.
- On dark (#F5F5F7), On dark 2 (#B8BEC9, 8.6:1 on Tile 2), On dark 3
  (#8A93A3, 5.0:1 on Tile 2).

### Accent
- Accent (#E8632B). The primary button fill, the highlighted word in
  headlines on light, the "You" marker. White text on it in buttons.
- Accent press (#D4561F). Accent ink (#B03E0A), the accent as text on
  light: eyebrows, text links, the plus in FAQ rows, check marks. 5.5:1 on
  white. Accent on dark (#FFA36B), the highlighted word and links on the
  dark tile, 8.3:1 on Tile 2.
- Good (#1E9E5A), the single status dot.

## 3. Typography

Manrope, variable 200 to 800, self-hosted at `fonts/Manrope[wght].ttf`,
preloaded, `font-display: swap`. Fallback system-ui so Safari gets SF Pro.

| Role | Size | Line | Weight | Tracking | Use |
|---|---|---|---|---|---|
| hero-display | clamp(46px, 7vw, 92px) | 0.98 | 800 | -0.04em | One per page |
| display | clamp(34px, 4.6vw, 60px) | 1.02 | 800 | -0.035em | Tile headlines |
| display-sm | clamp(28px, 3.4vw, 44px) | 1.05 | 800 | -0.03em | Feature-row headlines |
| lead | clamp(19px, 2.1vw, 24px) | 1.35 | 500 | -0.015em | Under headlines, Ink 2 |
| title | 21px | 1.24 | 700 | -0.02em | Card titles |
| body | 17px (19px in feature rows) | 1.47 | 400 | -0.01em | Default |
| caption | 14px | 1.43 | 400 | 0 | Notes, disclaimers |
| fine | 12px | 1.5 | 400 | 0 | Legal |
| eyebrow | 15px | 1.4 | 700 | -0.01em, sentence case | "Step 1", "The guarantee", in Accent ink |
| stat | clamp(56px, 7vw, 96px) | 0.95 | 800 | -0.05em | Proof numbers, tabular |
| price | 64px | 1 | 800 | -0.05em | Tabular |

Principles: one family, hierarchy from size, weight, and tracking. Tracking
tightens as size grows and is never applied below 14px. Headlines carry
one accent word, never italic. Sentence case everywhere; no uppercase
labels anywhere on the page.

## 4. Layout

- Tokens: 4 8 12 16 24 32 48 64 96 128.
- Container 1200px with 32px side padding (16px under 600). Hero copy
  900px, tile heads 760px, FAQ 1040px.
- Tile padding 128px desktop, 96px under 1040, 64px under 600.
- Grids: stats and cases 3-up, quotes 2-up, feature rows 1:1, guarantee
  0.8:1.2, pricing 1fr:480px, FAQ 2 columns. Everything single column
  under 1040.
- Breakpoints: 1040 and 600. Under 600 the brand text hides, the nav
  keeps Proof and Pricing with a short CTA, buttons go full width, the
  Maps mock hides and the sticky bar appears.

## 5. Elevation and depth

Flat. Cards sit on a different surface value instead of carrying a border
or a shadow. The one shadow in the system,
`0 30px 80px rgba(29,29,31,0.18), 0 2px 8px rgba(29,29,31,0.06)`, belongs
to the two product mocks on the hero stage. The nav and the sticky bar
float with white at 78 to 86 percent and `backdrop-filter: saturate(180%)
blur(20px)`.

## 6. Shapes

12px small (focus outline, mock chips), 20px medium (proof cards, quotes,
pricing toggle track is a pill), 28px large (stat cards, feature frames,
trade cards, pricing card), 36px extra large (the product stage's top
corners, the portrait). Pills for every button, the trust pill, and the
toggle. Mocks use 20px on their top corners only because they rest on the
stage edge.

## 7. Components

Promo strip: Surface, 14px, centered, bold lead-in.

Nav: sticky, white at 78 percent with blur, hairline, 56px. Brand 28px
mark plus 16px bold name. Three 15px links in Ink 2. One primary pill,
small variant 40px.

Buttons: pill, 48px minimum, 17px semibold, 12px by 24px padding, no
border. Primary: Accent with white text, press Accent press. Dark: Ink
with white text (the guarantee tile). Light: white with Ink text (dark
tiles, secondary). Active scale 0.97 in 100ms, hover color in 200ms.
Text link: Accent ink, 17px semibold, trailing chevron, 48px hit height.

Hero: trust pill on Surface with the green dot, hero-display with the
accent word, lead capped at 640px, primary pill plus chevron link, a
14px note line. Below, the stage: a Surface block with 36px top corners
holding the ChatGPT mock at 1.2fr and the Maps mock at 1fr, both with
the product shadow, both cut off at the stage's bottom edge like a
product resting on a table. The conversation plays once on load: the
question types over 800ms, the answer lines land 400ms apart, the client
name highlights at 2.6s. Reduced motion shows the finished state. Under
the stage, a Surface band with the illustration disclaimer and the engine
row (ChatGPT, Google Search, Google Maps, Apple Maps, Claude, Perplexity,
Gemini, Yelp) with the three real marks we have.

Proof tile (near-black): centered headline and lead, then three stat
cards on Tile 2 at 28px: "#1" at up to 96px with "was #n" in Accent on
dark beside it, a rank ladder (an SVG track from #12 to #1 that marks
only the two documented points, the starting rank and #1, with no
invented intermediate weeks), the time line, the business and city, one
documented note. Then the three engine mock cards (header row, chat body), then two
quote cards with real curly quotes and initials discs, then the client
wall and a "More results" link on one row, then the disclaimer caption.

Feature rows (white tile): 1:1 grid, text and a Tonal frame at 28px with
the step illustration, alternating sides. Eyebrow "Step n" in Accent ink,
display-sm headline with a period, 19px body capped at 460px, the third
row ends with a text link.

Trade cards (gray tile): three white cards at 28px, 4:3 image well, title,
one line. The wells load generated editorial photographs
(`img/trade-medspa.webp`, `trade-roofing.webp`, `trade-moving.webp`, 960 by
717, made in Higgsfield with marketing_studio_image on 2026-09-08, faces
turned away, no logos, no signage) and fall back to the older illustration
if a file is missing. These are scene photographs, not people we claim to
have worked with, and are never captioned as clients.

Guarantee tile (Tonal): the portrait at 4:5 in a 36px frame at 0.8fr,
then eyebrow, display, lead in Ink at 500, body, name and role, and a
dark pill.

Pricing tile (gray): left, eyebrow, display, lead, and four included
lines with Tonal check discs. Right, a white card at 28px with the
billing toggle (Surface track, selected tab Ink), label, 64px price with
tabular figures, billing line, three check lines, full-width primary
pill, and a "Pay by card" text link.

FAQ (white): two hairline columns, 19px semibold summaries, plus that
turns into a minus in Accent ink, 16px answers capped at 520px.

Closing tile (near-black): display with the accent word, lead, primary
pill, a caption. Footer on Surface with 14px links at 44px height and the
12px legal block.

Sticky bar (phones only, after 60 percent of the hero has scrolled):
white at 86 percent with blur, hairline top, the guarantee line in 14px
bold with "One business per city" under it, and the small primary pill.
Body gets 72px bottom padding so nothing hides behind it.

### Page recipes

Home (`index.html`): brand mode. Promo strip, nav with three links, hero
with the typed ChatGPT moment and the Maps mock, dark proof tile, feature
rows, trade cards, tonal guarantee, gray pricing, FAQ, dark close.

Lander (`scan/`): direct-response mode. Nav carries the brand and one
pill to `#form-card`, no other links. Hero is the question headline, then
a gray stage holding the video frame (16:9, the product shadow) beside the
two-step form card. Fields are 48px, 17px text, hairline border, Ink focus
ring, progress as two short bars. Below: the dark proof tile (three ladder
cards, two quotes), three step cards, guarantee, pricing, FAQ, close.
Every CTA and the sticky bar point at the form.

Proof (`proof/`): brand mode. Hero, dark ladder tile with two named
quotes, white outcomes tile with three gray cards (big number in Accent
ink, label, extra line, owner-reported fine print), dark close with the
booking link for people who already have a scan.

Onboarding (`onboard.html`, noindex): brand only nav, headline, one white
form card at 720px on gray with labeled fields in two groups, a tonal
callout for the manager-access step, two checks, one full-width pill.

Thanks (`thanks/`, noindex): brand only nav, trust pill that reads the
city, headline that reads the first name, lead, pill that scrolls to the
Cal.com embed inside a white frame on a gray stage, three-step row.

## 8. Motion

Hero copy rises 12px over 500ms, the stage follows at 120ms, the
conversation plays once. Sticky bar slides up in 300ms. Hover changes
color only. Active scales to 0.97. Reduced motion turns everything off.

## 9. Do and don't

- Do let the product mock be the hero image. Don't add a photo of people
  who are not clients or Ben.
- Do keep one accent word per headline in Accent. Don't use italics for
  emphasis.
- Do separate sections with a surface change. Don't add borders,
  gradients, or shadows to cards.
- Do keep headlines at weight 800 with tight tracking. Don't go lighter
  than 500 on anything above 20px.
- Do use "Get my free scan" as the only primary label. Don't invent a
  second verb.
- Don't animate on scroll, loop, float, or cycle words.

## 10. Known gaps and next

1. The primary button is white on Accent at 3.4:1. Under WCAG that passes
   only for large text (18.66px bold or 24px). The label is 17px 600, so
   it fails strictly. Options: Ink text on Accent (5.2:1, passes, less
   Apple), or raise the label to 19px 700. Decide before shipping.
2. Convert the Manrope TTF to woff2 (about 60 percent smaller) when a
   converter is available.
3. "Most chosen" is off the lander (the pricing card defaults to
   quarterly instead) until Ben confirms the share.
4. The guarantee portrait is the benjix.com headshot. Swap in the newer
   photo Ben supplied once it is in the repo as `img/ben-lev.jpg`.
