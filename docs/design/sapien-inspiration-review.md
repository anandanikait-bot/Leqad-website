# Design exploration: Sapien-inspired editorial Leqad

**Branch ancestry:** This proposal is stacked on `feat/approved-typography-branding` (Typography A + Branding A), not the earlier `main` styling. This is a standalone review; do **not** merge this branch ahead of the typography PR.

## Reference and independent adaptation

Reference: https://www.sapien.io/ (reviewed October 23, 2026). Useful *general design principles* include restrained editorial typography, clear short propositions, whitespace, understated separators, numbered workflow explanations, and concrete product visuals.

**Original Leqad implementation, not a copy:**
- Homepage retains the single-screen CAD hero and user-controlled 3D illustration. Shift the story to a left-aligned editorial hierarchy while retaining animated phrase and existing CTA.
- About has a more direct hero and a three-step learning narrative as numbered open rows rather than generic feature cards.
- Partners has clear exploration language, two sober evaluation pillars, and a conditional three-step discussion process without invented results or institutional endorsements.
- Shared section headings become understated ruled labels instead of pill badges.
- Official logo, font files, custom metallic CTA, palette, halftone footer, routes, CAD demo, contact dialog, privacy/consent behavior and product maturity constraints remain intact.

## Quality / acceptance

Compare against approved typography screenshots at 320, 375, 768, 1024 and 1440 widths. Check hero one-screen height/CTA visibility, first heading wrapping, CAD visual visibility, About numbered steps, Partners sequence, expansion of the optional planner, footer visual identity, all navigational actions, keyboard focus, reduced-motion preferences, no horizontal overflow. CI should run unit, typecheck, build/prerender, and browser suite. Avoid copying Sapien imagery, marketing text, logos, claims, animations, or visual identity.

## Explicit product honesty

Leqad is an exploratory extension prototype; live Onshape compatibility and model verification are *not* established. The website demo is an illustrated simulation, and inquiry notes do not send messages. Partner evaluations and monetization are possible future discussions, never completed outcomes.
