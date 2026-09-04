# Design system: Local Growth Partner (localgrowthpartner.com)

Mode: brand for the home page and proof pages, direct-response for /scan,
/thanks, and any page paid traffic lands on.
Owner: Ben Lev. Updated: 2026-09-04. Source of truth for every page in this
repo and for the Meta ad creatives in `img/ads/`. Inferred from the live CSS
in `index.html` and `scan/index.html`, then edited by hand. Read by Claude
Design (connect this repo) and by Claude Code through `.claude/skills/`.
Change tokens here first, then in each page's `:root`.

Back-end brand: Golden Partners (footer, agreements). Front-end: Local
Growth Partner. Positioning and offer live in the golden-partners repo,
`maps-agency/`.

## 1. Overview and atmosphere

A local business owner, often on a phone, often burned by an agency before,
lands here from an ad or a text. The page has to feel like a serious firm
that says no a lot, not a growth-hack template. Dark navy ground with a
warm cream proof section, one orange accent, a serif display with one
italic accent word per headline, and product mocks (ChatGPT answer, Maps
result, phone notifications) that show the outcome. The one memorable move
is the italic orange word inside the serif headline. Everything else is
quiet.

Today the page carries more than that one move: glow blobs, floating mock
cards, a cycling headline word, a marquee, gradient seals, lifted cards.
Section 8 lists what comes out.

Dials: density 5, variance 5, motion 2 (currently about 7).

## 2. Colors

### Grounds
- Void (#070D16), the page ground and footer. Blue-black, not pure black.
- Navy (#0B1524), the second dark tier: marquee band, demand section,
  cards on dark, scan page cards.
- Lift (#111E31), the third dark tier for hover on dark buttons.
- Cream (#FAF7F1), the light proof and pricing ground.
- Sand (#F1EBDF), light tier inside cream: step visuals, proof card feet.
- White (#FFFFFF), product mocks and pricing cards only.

### Accent
- Accent (#FF6B1A), the single accent. Italic display words on dark, eyebrow
  rule, checkmarks, seal, selected states. On-color: Ink, never white
  (white on Accent is 2.9:1).
- Accent deep (#E85A0C), hover state on Accent fills.
- Accent soft (#FFA45C), small labels on Navy only.
- Accent on cream for display words must use Accent deep or darker
  (#C2410C recommended, 4.8:1); Accent itself on Cream is 2.7:1.

### Text
- White (#FFFFFF), primary text on Void and Navy, 19.5:1.
- Mist (#8A99AC), secondary text on dark, 6.7:1 on Void, 6.3:1 on Navy.
- Ink (#101B2B), primary text on Cream and White, 16.2:1 on Cream.
- Steel (#64748B), secondary text on light. 4.5:1 on Cream is the floor,
  4.0:1 on Sand fails. Use #5B6B82 on Cream (5.1:1) and #5F6E85 on Sand
  when the CSS is next touched.
- Footer fine print (#5D6B7D) is 3.6:1 on Void and fails. Use #6F7E91
  (4.7:1).

### Lines
- Line dark (white at 9 percent), rules and card borders on dark.
- Line light (#E7E0D3), rules and card borders on light.

### Google brand colors (product mocks only)
- Red #EA4335, star #FBBC04, blue #1A73E8, green #188038. Never used
  outside the Maps and Search mocks.

### Contrast table (as shipped)
| Pair | Ratio | Verdict |
|---|---|---|
| White on Void | 19.5:1 | pass |
| Mist on Void | 6.7:1 | pass |
| Mist on Navy | 6.3:1 | pass |
| Ink on Cream | 16.2:1 | pass |
| Steel on Cream | 4.45:1 | fail by a hair, fix to #5B6B82 |
| Steel on Sand | 4.0:1 | fail, fix to #5F6E85 |
| Accent on Void (display italic) | 6.8:1 | pass |
| Accent on Cream (display italic) | 2.7:1 | fail, large text needs 3:1, use #C2410C |
| White on Accent (every primary button) | 2.9:1 | fail, auto-fail, use Ink text |
| Ink on Accent (proposed button) | 6.1:1 | pass |
| #5D6B7D footer on Void | 3.6:1 | fail, use #6F7E91 |
| #6B7A8D labels on Navy | 4.2:1 | fail for body-size text, use Mist |
| Nav #B7C2D0 on Void | 10.8:1 | pass |

## 3. Typography

Families
- Display: Cormorant 400 and 500, italic 400 and 500. Fallback Georgia.
  Elegant, and it reads as "firm" rather than "app". Keep.
- Body and UI: Inter 400 to 800. Fallback system-ui. Inter is on the house
  banned list for brand faces because it is the default of every template.
  Swap to Geist or Satoshi at the next redesign; do not touch before the
  contrast fixes ship.
- Product mocks: system stack and Roboto on purpose, so the ChatGPT and
  Google mocks look like the real products.

Hierarchy
| Role | Size | Line | Weight | Case | Use |
|---|---|---|---|---|---|
| display | clamp(46px, 6.4vw, 86px) | 1.04 | 400 Cormorant, -0.5px | sentence | h1, one italic Accent word |
| display 2 | clamp(38px, 4.8vw, 62px) | 1.08 | 400 Cormorant | sentence | section h2 |
| statement | clamp(38px, 5.2vw, 68px) | 1.1 | 400 Cormorant | sentence | the one-line claim on cream |
| h3 | 25 to 29px | 1.2 | 600 Cormorant | sentence | card titles |
| lede | 17.5 to 18px | 1.6 | 400 Inter | sentence | under every headline, 540px max |
| body | 15px | 1.55 | 400 Inter | sentence | card copy, FAQ answers |
| small | 13 to 13.5px | 1.5 | 400 to 500 Inter | sentence | captions, notes, nav |
| eyebrow | 11.5px | 1 | 600 Inter, 3.4px tracking | upper | section labels, with a 22px Accent rule |
| stat | 58px | 1 | 500 Cormorant | as is | proof numbers |
| button | 15px | 1 | 600 Inter | sentence | all buttons |
| fine | 11.3 to 12.5px | 1.8 | 400 Inter | sentence | disclaimers, footer |

Principles
- One italic Accent word per headline, never two.
- Sizes snap to 11.5, 13, 15, 17.5, 25, 29 and the clamps above. Today the
  CSS uses 11.3, 12.5, 12.8, 13.5, 13.8, 14.5, 15.5, 17.5, 18.5 as well; fold
  them in at the next pass.
- Uppercase only on eyebrows and the two-word step labels.

## 4. Layout

- Container 1180px, 30px side padding (20px under 560). Scan page 860px.
- Section rhythm 112px desktop, 76px under 980. Scan sections 56px.
- Heads capped at 640px, ledes at 540px, FAQ at 800px.
- Grids: hero stage 1.05fr 0.95fr; who-we-help 3 cards; cases 3 cards;
  steps 3 cards; numbers 3 columns; testimonials 2; demand 2; scan section
  0.9fr 1.1fr. Four equal three-card grids on one page is the kit look;
  section 8 lists the replacement.
- Breakpoints: 980 (everything to one column, nav links hidden, the CTA
  stays), 700 on scan (steps and plans stack), 560 (type steps down,
  short button labels).
- Whitespace: dark sections breathe, cream sections are tighter and
  denser with proof.

## 5. Elevation and depth

- Three dark tiers (Void, Navy, Lift) and two light tiers (Cream, Sand).
  That is enough depth. The house rule is no glows.
- As shipped: button glow `0 8px 30px` in Accent at 30 percent, hover glow
  at 42 percent, mock shadows `0 50px 100px` black at 60 percent, card
  hover lift 7px with a 60px shadow, a blurred 1150px Accent blob behind
  the hero, radial gradient seals, gradient guarantee band. Section 8.
- Target: one shadow tier for floating product mocks only,
  `0 24px 60px rgba(0,0,0,0.35)`. Buttons flat. No blur filters.

## 6. Shapes and imagery

- Radius as shipped: 10 (inputs), 12 (step visuals), 14 (scan cards),
  15 (notifications), 16 (cards, VSL), 18 (mocks, pricing), 34 (phone),
  100 (pills). Target scale: 8, 12, 16, pill. Inputs 8, cards 12, mocks 16,
  buttons pill.
- Photography: three trade photos (spa, hvac, dental) with a dark gradient
  foot. Real trades, no stock people.
- Product mocks are illustrations and say so in a caption ("Illustrations
  of the outcome we work toward. Not client records."). Keep that caption
  adjacent, always.
- Logos: the ChatGPT, Claude, and Google marks appear inside product mocks
  only, never as endorsement badges.
- Ad creatives in `img/ads/` follow the same palette. See section 9.

## 7. Components

Primary button: Accent ground, Ink text (fix from white), 600 Inter 15px,
16px by 32px padding, pill, no shadow, hover Accent deep, active 1px down,
focus ring 2px white with 3px offset on dark, 2px Ink on light. 48px tall
minimum, full width under 560. Label is always the outcome: "Get my free
scan", "Check if my city is open", "Show me who is winning my city". Drop
the arrow icon.

Ghost button: 1px Line dark border, white text, hover white at 6 percent.
Light button (on Cream): white ground, Ink text; hover Accent ground with
Ink text.

Eyebrow: 11.5px 600 Inter, 3.4px tracking, uppercase, Mist, with a 22px
Accent rule before it.

Trust pill (hero): 1px Line dark, white at 4.5 percent, 12.8px, a static
green dot. Keep, remove the dot's glow ring.

Product mocks (ChatGPT answer, Maps result, phone): white, 16px radius, one
shadow tier, system font, caption underneath. No float animation.

Proof card: white, 16px radius, chat or search mock on top, Sand foot with
the rank change in Cormorant 34px, "was" in Steel, time in Accent deep
uppercase. The documented-accounts disclaimer sits within the same section,
above the fold of the section on mobile, not only in the footer.

Testimonial: Line dark border, 16px radius, white at 3 percent, quote in
Cormorant 23px, name and role in 14 and 12.5px, avatar or initials.
Anonymous quotes carry "on record" and nothing more.

Numbers: three columns with 1px rules, Cormorant 58px, label 13.5px Steel.

Pricing card: white, 2px Accent border on the highlighted plan, amount in
Cormorant 47px, checklist with Accent checkmarks, one primary button, a
"pay by card" text link under it. Toggle: white pill group, Navy on the
selected state.

Guarantee band: Navy, a 164px seal with a 1px Accent soft ring, "90 Days"
in Cormorant 46px. Remove the gradient and the blob.

FAQ: details and summary, Cormorant 23px question, plus sign in Accent,
answer 15px Steel, 640px max.

Lead form (scan page, direct-response): two steps with a 4px progress dot
row. Step 1: business, city, trade. Step 2: name, phone, email, Maps link
with an "I don't have a listing" checkbox, TCPA consent line. Inputs 14px
by 16px, 8px radius, 1.5px Line light border, focus border Accent plus a
2px ring. Every input gets a visible label above it (today placeholders do
that job). `autocomplete`, `inputmode`, and `type` set per field. Inline
error under the field, first error focused. Submit stays enabled, shows
"Sending…" while the request runs. The email typo fixer stays.

Announce bar: Accent at 14 percent to 10 percent gradient today. Flat Navy
with a 1px Line dark bottom and Accent soft for the bold words.

Footer: Void, links in Mist, fine print at #6F7E91 11.3px at 1.8.

## 8. Motion

Reduced motion is handled globally (`animation: none`, `transition: none`)
and that stays. What runs for everyone else today: a cycling headline word
with blur, two floating mocks on a 7-second loop, a blinking cursor, a
32-second marquee, scroll-reveal on most blocks at 800ms, card hover lifts,
image zoom on hover, button lift with glow.

Target: one page-load moment (the hero headline and lede fade in once,
200ms), 150ms color transitions on buttons and links, nothing infinite,
nothing on scroll. The cycling word becomes a fixed word chosen per
campaign (it is also what the ad promised, so it should not cycle away
from the message match). The marquee becomes a static two-row list.

## 9. Ad creatives (img/ads)

Same tokens: Void or Navy ground, white headline in Cormorant with one
italic Accent word, Inter for the body line, one product mock as the
visual, Local Growth Partner mark bottom left. Square and 4:5. No glow, no
gradient, no fake screenshots presented as client records. Every creative
goes through the compliance skill in the golden-partners repo before it
runs.

## 10. Do and don't

- Do put Ink text on Accent buttons. Don't put white on Accent anywhere.
- Do use one italic Accent word per headline. Don't color whole lines.
- Do keep the "illustration, not client records" caption next to every
  mock. Don't let a mock stand alone.
- Do keep the documented-accounts disclaimer inside the proof section.
  Don't push it to the footer only.
- Do repeat "Get my free scan" as the one primary label. Don't invent
  variants per section.
- Do keep one shadow tier for mocks. Don't add glows, blobs, or gradients.
- Do state the one-per-city rule as policy. Don't dress it as a countdown.
- Do give every input a visible label. Don't use placeholders as labels.

## 11. Responsive behavior

Under 980: single column everywhere, nav links hidden (the button stays;
add a two-link inline menu: Proof, Pricing). Under 560: container padding
20, display 42px, short button labels via `.sm-t`. Primary button full
width under 560. All targets 48px on this site because paid traffic lands
here.

## 12. Iteration guide and known gaps

Change a token here, then in `:root` of `index.html`, `scan/index.html`,
`thanks/index.html`, `proof/index.html`, `onboard.html` (five copies of the
same tokens today; a shared `site.css` would end that). Re-run "design
audit" on the changed page.

Known gaps, in order
1. White on Accent on every primary button (auto-fail). Ink text or a
   darker orange (#C2410C keeps white at 5.2:1).
2. Accent on Cream display words, Steel on Sand, footer fine print, and
   #6B7A8D labels all under threshold.
3. Motion inventory in section 8.
4. Labels, autocomplete, inline errors on the scan form.
5. Seven images without width and height on the home page; font stylesheet
   loads 11 weights with no preload.
6. Four equal three-card grids on the home page.
7. Inter as the body face.
8. Tokens duplicated across five HTML files.
