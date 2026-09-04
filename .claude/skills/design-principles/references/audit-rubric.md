# Design audit rubric (0 to 100)

Adapted for the web from the Material 3 compliance audit, with Apple,
Anthropic, Vercel, and conversion rules folded in. Ten categories, each 0 to
10. Score equals the average times 10. Pass at 70 and above, warn 40 to 69,
fail under 40. Auto-fails are listed first and cap the score at 39 until
fixed.

## Auto-fails

- Any body text pair under 4.5:1 or large text and border under 3:1.
- Any tap target under 40px on a page for paid traffic.
- Reading content wider than 1040px with no max-width.
- A results, health, or income claim with no adjacent disclosure block.
- A timer, fake stock counter, or fabricated metric anywhere.
- Horizontal scroll on a 375px viewport.
- Raw hex sprinkled through components with no token layer at all.

## Categories

| # | Category | 9 to 10 looks like | 4 to 6 looks like | 0 to 3 looks like |
|---|---|---|---|---|
| 1 | Color tokens | Named tokens, paired on-colors, one accent, dark and light both defined where relevant | Tokens exist but components hardcode some values | Raw hex everywhere, no pairs |
| 2 | Typography | Named role scale, two families max, weight-driven hierarchy, line length 65 to 75, balanced headings | Scale exists, a few ad hoc sizes, some long lines | Random sizes, three plus families, unreadable lengths |
| 3 | Shape and depth | One radius scale, concentric nesting, tonal tiers, one shadow tier | Mostly consistent with a few magic radii or extra shadows | Mixed radii, glows, stacked shadows |
| 4 | Layout and spacing | 8px grid, consistent section rhythm, containers constrained, collapses cleanly at 768 and 375 | Mostly on grid, some odd gaps, one breakpoint rough | Off grid, overflow, stretched content |
| 5 | Components | CTA, form, disclosure, testimonial, proof strip match the house specs | Most match, one or two deviate | Generic kit, no specs followed |
| 6 | Accessibility | Focus visible everywhere, semantic HTML, labels on controls, alt text, reduced motion, keyboard reachable | Minor gaps (one missing label, weak focus ring) | Outline none, div buttons, no alt |
| 7 | Motion | One page-load moment or none, transform and opacity only, reduced motion honored | Some scattered effects, one transition all | Animation on every section, no reduced motion |
| 8 | Performance | Image dimensions set, priority and lazy set, font preloaded, no blocking scripts, page under 1MB | A few missing dimensions or unoptimized images | Layout shift visible, multi-MB page |
| 9 | Conversion structure | First screen rule met, CTA repeated identically, form 3 fields or fewer, message match, disclosure adjacent | Most present, CTA labels vary, form 4 to 5 fields | No clear CTA, generic labels, claims without disclosure |
| 10 | Distinctiveness | One memorable move, no anti-patterns from the list, could only be this brand | Competent but could be any company's page | Template chrome, AI tells present |

## Output format

```
Design audit: <file> (<mode>)
Score: NN/100 (pass | warn | fail)
Auto-fails: none | list
Contrast: pairs under threshold, or "all pairs pass"
1 Color tokens        n/10  note
2 Typography          n/10  note
...
10 Distinctiveness    n/10  note
Findings (file:line, fix):
- ...
Top three fixes:
1. ...
Compliance skill needed before ship: yes | no
```
