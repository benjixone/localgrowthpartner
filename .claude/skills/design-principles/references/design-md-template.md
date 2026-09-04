# DESIGN.md template

One file per brand at `<brand>/DESIGN.md`. Merge of the VoltAgent canonical
structure (11 sections) with Google Stitch's writing rules. Write for an
agent that will build from it and a human who will edit it.

Writing rules
- Every color has a descriptive name, a hex, and a job: "Azur (#4FA8DC),
  the one accent, used for links, focus, and the primary button".
- Translate technical values into physical descriptions and keep the number
  in parentheses: "quietly rounded corners (4px)".
- Explain why each element exists, not only what it is.
- Encode bans as rigorously as rules.
- Same terminology throughout. Sentence case. No emojis.

Template

```
# Design system: <Brand>

Mode: brand | direct-response
Owner: Ben Lev. Updated: YYYY-MM-DD. Source of truth for <site or asset>.

## 1. Overview and atmosphere
Three to five sentences on who this is for, what it should feel like, and
the one memorable move. Density, variance, and motion on a 1 to 10 scale.

## 2. Colors
### Brand and accent
### Surfaces
### Text
### Semantic (success, warning, error, focus)
Each line: Name (#hex), role, where it appears, its on-color pair.
Contrast table for every text and ground pair.

## 3. Typography
Families with fallbacks and why. Hierarchy table: role, size mobile and
desktop, line height, weight, tracking, case, use. Principles (two or
three). Substitutes if the web font fails.

## 4. Layout
Spacing tokens. Container widths. Reading column. Section rhythm.
Breakpoints and what collapses at each. Whitespace philosophy in one line.

## 5. Elevation and depth
Surface tiers. Shadow tier(s). What never gets a shadow.

## 6. Shapes and imagery
Radius scale with use per step. Photography and illustration rules.
Logo tiles. Icon set and stroke.

## 7. Components
Top nav, buttons (primary, ghost), cards or list rows, inputs, labels and
eyebrows, tags, tables, CTA block, footer. For each: ground, text, type
role, radius, padding, height, states (hover, active, focus, disabled).
Direct-response mode adds: disclosure block, testimonial, proof strip.

## 8. Motion
Durations, easing, what animates, the one page-load moment if any, reduced
motion behavior.

## 9. Do and don't
Paired affirmations and negations. Include the brand's deliberate
exceptions to the house anti-patterns and why.

## 10. Responsive behavior
Breakpoints, touch targets, collapse strategy, what is hidden on mobile.

## 11. Iteration guide and known gaps
How to change a token safely. What is undefined today.
```
