# Design audit: localgrowthpartner.com

Run 2026-09-04 with the `design-principles` skill rubric against `DESIGN.md`.
Pages: `index.html` (brand mode) and `scan/index.html` (direct-response
mode). Contrast computed from the `:root` tokens and the hardcoded values in
the CSS. Vercel Web Interface Guidelines applied from the rule set fetched
2026-09-03.

## Summary

| Page | Raw score | With auto-fails | Status |
|---|---|---|---|
| index.html | 49/100 | capped at 39 | fail until the button fix ships |
| scan/index.html | 58/100 | capped at 39 | fail until the button fix ships |

Both pages share one auto-fail, and it is a ten-minute fix.

## Auto-fails (both pages)

- Every primary button sets white text on Accent #FF6B1A: 2.9:1. Body-size
  bold text needs 4.5:1. Fix: `.btn { color: var(--ink) }` (6.1:1), or
  darken the fill to #C2410C and keep white (5.2:1). The house pick is Ink
  on Accent, which also matches the Ben Lev family (Ink on Azur).
- index.html, `.display .em` and `.statement .big b` on the Cream sections:
  Accent on Cream is 2.7:1 and large text needs 3:1. Fix: a darker accent
  for light grounds, #C2410C (4.8:1).

Other contrast findings, not auto-fails but under threshold
- Steel #64748B on Cream 4.45:1 (lede, card copy, FAQ answers). Use
  #5B6B82.
- Steel on Sand 4.0:1 (proof card feet). Use #5F6E85.
- Footer fine print #5D6B7D on Void 3.6:1. Use #6F7E91.
- #6B7A8D labels and testimonial roles on Void and Navy, 4.2 to 4.5:1. Use
  Mist.

## index.html (brand mode)

| # | Category | Score | Note |
|---|---|---|---|
| 1 | Color tokens | 5 | Good token names in `:root`, then about twenty hardcoded grays and whites in components (#B7C2D0, #7C8B9E, #6B7A8D, #5D6B7D, #C9D2DE, #EDF1F6, #93A3B8 and more). No on-color pairing, which is how white ended up on orange. |
| 2 | Typography | 6 | Cormorant plus one italic accent word is a real voice. Inter is the banned default body face. Nine ad hoc sizes between 11 and 19px. |
| 3 | Shape and depth | 3 | Eight radius values with no scale. Glow shadows on buttons, 100px black shadows on mocks, a blurred 1150px accent blob, gradient seal, gradient guarantee band, gradient announce bar. |
| 4 | Layout and spacing | 5 | Container, rhythm, and breakpoints are sound. Four equal three-card grids in a row (who we help, cases, steps, numbers). |
| 5 | Components | 5 | One primary label repeated, good. Arrow icons appended to buttons. Scan-section form has no labels, no autocomplete, `outline: none` with only a border color as the replacement. |
| 6 | Accessibility | 4 | Contrast failures above. Nav links vanish under 980 with no menu. Decorative images correctly `alt=""`. No `focus-visible` styles defined; browser defaults are the only ring. Reduced motion handled globally, which is the one strong point. |
| 7 | Motion | 3 | Cycling headline word with blur, two floating mocks on an infinite loop, blinking cursor, 32-second marquee with no pause control, scroll-reveal on most blocks, hover lifts and image zoom on every card. |
| 8 | Performance | 5 | Seven of eight images have no width and height. One font stylesheet loads 11 weights with no preload. Facebook pixel, Clarity, and three more scripts. A `filter: blur(22px)` on a 1150px element is paint-heavy on phones. Cycling word has `min-height`, so no shift there. |
| 9 | Conversion structure | 8 | First screen: trust pill, outcome headline, mechanism lede, one CTA, guarantee line. That is the house first-screen rule met exactly. Proof section carries its own disclaimer, mocks carry their caption, pricing and guarantee are plain. |
| 10 | Distinctiveness | 5 | The serif-italic-orange move is ownable. Everything around it (blobs, floats, marquee, gradient seal, lifted cards) is the 2024 AI lander kit and dilutes it. |

Findings (file:line, fix)
- index.html:469, 759, 780, 821 and `.btn` at CSS line 49: Ink text on
  Accent; drop `box-shadow`; remove the `svg` arrows.
- index.html CSS `.display .em`, `.statement .big b`: on `.on-cream`
  sections use #C2410C.
- index.html:150 `.cyc-line .w` swap animation: replace the cycling word
  with the campaign's fixed word. Message match with the ad requires it.
- index.html:160 `.float`: delete. index.html:182 `.cursor`: delete.
  index.html:222 `.mq`: replace with a static two-row list.
- index.html `.rv` scroll reveal: remove; keep one 200ms hero fade.
- index.html `.card:hover`, `.pcard:hover`, `.btn:hover` transforms and
  shadows: remove lifts, keep color change.
- index.html `.glow`, `.guar::before`, `.guar` gradient, `.announce`
  gradient, `.seal` radial: flat Navy.
- index.html:574 and the other two card photos, plus the four logo marks:
  add `width` and `height`; add `loading="lazy"` below the fold.
- index.html:34 fonts: cut to Cormorant 400, 500, italic 400 and Inter
  400, 600; add `<link rel="preload" as="font">` for Cormorant 400.
- index.html:386 `.form input:focus`: keep the border change and add
  `outline: 2px solid var(--accent); outline-offset: 2px` or a
  `:focus-visible` ring. Add `<label>` elements above the inputs.
- index.html nav under 980: add "Proof" and "Pricing" as inline links
  next to the button.
- index.html cards, cases, steps: replace two of the four three-card grids.
  Steps as a numbered ruled list; who-we-help as three rows with the photo
  on the left.

## scan/index.html (direct-response mode)

| # | Category | Score | Note |
|---|---|---|---|
| 1 | Color tokens | 5 | Same tokens, same hardcoded grays (#A9B6C8, #8A99AC, #5D6B7D, #FF8A45). |
| 2 | Typography | 6 | Cormorant headline with the italic accent, Inter body. Plan amounts in Inter 800 while the home page uses Cormorant for amounts. |
| 3 | Shape and depth | 4 | Glow on the play button and every button, 90px shadows on the VSL and the card, 10 / 12 / 14 / 16 / 18 / 99 / 100 radii. |
| 4 | Layout and spacing | 7 | 860px single column, VSL then form then proof then steps then guarantee then pricing then FAQ. Right order for a scan lander. Plans stack under 700. |
| 5 | Components | 5 | Two-step form with progress dots, good. Placeholders as labels, no `autocomplete` on fields (only on the form), `outline: none` on inputs and selects, seven fields across two steps on paid traffic, submit disabled pattern not used (good), no inline error styling beyond the email fixer. |
| 6 | Accessibility | 4 | Contrast auto-fail on the button. `select:invalid` uses #8896A8 on white at 3.0:1 as the placeholder color. No labels, no `focus-visible`. No reduced-motion block on this page. |
| 7 | Motion | 8 | Almost none, which is right. Only hover color changes. Add the reduced-motion block anyway for parity. |
| 8 | Performance | 6 | YouTube iframe above the form with no `loading="lazy"` and no facade. Same 11-weight font stylesheet. Clarity and Facebook pixel. |
| 9 | Conversion structure | 8 | Headline is a question that names the mechanism. VSL above the form. Proof numbers, two quotes, steps, guarantee, pricing, FAQ, repeated CTA. The results disclaimer sits in the footer only; the proof numbers at the top of the page need it within the same view. |
| 10 | Distinctiveness | 5 | Clean and convincing, but the seal, glows, and pricing "MOST CHOSEN" badge read as template. |

Findings (file:line, fix)
- scan/index.html:72 and 74: replace `outline:none` with a
  `:focus-visible` ring, 2px Accent, 2px offset.
- scan/index.html:156 to 175: add `<label for>` above each input, set
  `autocomplete="organization"`, `"address-level2"`, `"name"`, `"tel"`,
  `"email"`, `"url"`, and `inputmode="tel"` on the phone. Placeholders
  become examples and end with an ellipsis.
- scan/index.html:147 iframe: add `loading="lazy"` and a poster facade
  that loads the player on click. The form is the conversion, not the
  video, so the video must not delay it.
- scan/index.html proof numbers (#8 to #1 and the two below): move the
  "documented accounts, results vary" line from the footer to directly
  under these three figures, 12.5px Mist, same view.
- scan/index.html pricing: make the amount type match the home page
  (Cormorant), remove the "MOST CHOSEN" pill or state the actual share of
  clients who choose it.
- scan/index.html: add the global reduced-motion rule, remove the glow on
  `.vsl .play`, `.btn`, `.plan.hi`, and `.faq .again a`.
- Form field count: move the Maps link to the thanks page or the booking
  confirmation. Five fields on the lander, the link when they already said
  yes.

## Top three fixes

1. Button text to Ink and the darker accent on cream. Clears both
   auto-fails on both pages in one CSS pass. Lifts index to about 49 and
   scan to about 58 immediately.
2. Motion and depth on the home page: delete the blob, floats, cursor,
   marquee, scroll reveals, glows, and gradients. This is the difference
   between "agency that says no" and "template". Half a day.
3. Scan form: labels, autocomplete, focus rings, lazy iframe, disclaimer
   moved next to the proof numbers. One session.

After those three the home page lands around 65 and the scan page around
72. The three-card grids, Inter, and the shared stylesheet are the next
round.

Compliance skill needed before ship: yes. Paid Meta traffic lands on
/scan, and the home page carries a guarantee and ranking claims. The
existing disclaimers and the "illustration, not client records" captions
are the right idea; the compliance skill in the golden-partners repo
confirms placement and wording per Meta's rules for the ad and the lander
together.
