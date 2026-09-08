# Anti-patterns (the AI tells), merged from Anthropic frontend-design and Google Stitch taste-design

Brand mode enforces all of these. Direct-response mode exempts the three
marked DR.

## Color
- Cream #F4F1EA ground with terracotta accents (the default AI warm look).
- Near-black ground with acid green or vermilion accents.
- Pure #000000 page ground.
- AI purple, neon blue, any accent over 80 percent saturation.
- Warm and cool grays mixed on one page.
- Neon outer glows, colored drop shadows.

## Type
- Tracked-out ALL-CAPS eyebrow labels as a default device. Allowed only when
  a DESIGN.md names it as the brand's label style and it is used sparingly.
- Inter, Times New Roman, Georgia, Garamond, Palatino as brand faces.
- Monospace for small data labels by default.
- Single-word italic, bold, or color accents inside sentences.
- "LABEL // YEAR" style decorations.
- Three or more families on one page.

## Layout
- Equal three-card grid with uniform radius and soft grey shadows (the SaaS
  kit). DR exemption: a three-item proof strip is fine.
- Centered hero for everything. DR exemption: centered headline over a VSL
  player.
- Hairline broadsheet rules with zero radius as a default look.
- Overlapping elements, custom cursors.
- "Scroll to explore", bouncing chevrons, scroll arrows.
- Arrows appended to every link and button. One outbound link arrow style
  per site is acceptable when the DESIGN.md names it.

## Content
- Emojis in UI.
- Placeholder names (Acme, John Doe, Nexus).
- Fabricated metrics ("99.98 percent uptime", "124ms response").
- Fake dashboard cards, fake app screenshots.
- Broken Unsplash links.
- Cliché verbs: elevate, seamless, unleash, next-gen, delve, leverage,
  comprehensive, empower, revolutionize.
- Template chrome that appears regardless of subject.

## Motion
- Fade-and-slide-up on every section.
- Hover transitions on every card.
- Circular spinners for content loading (skeletons instead). A small spinner
  inside a submitting button is fine.
- Any animation without a reduced-motion fallback.

## Direct-response specific bans (compliance rules that are also design rules)
- Countdown timers, stock counters, fake scarcity. DR: still banned.
- Implied doctor, expert, or celebrity endorsement without credentials and
  actual product testing on file.
- Photoreal organs, before and after body images.
- "You" or "your" plus a health or age attribute in a hook.
- Disclosure behind a link, below the fold, or under 12pt.
