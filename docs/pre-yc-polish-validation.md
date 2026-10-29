# Pre-YC CAD readability polish

Base `9f6b73e`, branch `polish/pre-yc-cad-labels`. Only two product components changed. No merge or deployment.

## Changes

- Homepage dimensions use ivory `#F5EFE7` with a tight flat navy `#0E2943` backing, sized to actual glyph bounds with 2px padding. Existing font, positions, geometry, dimensions, rotation, drag, 2D/3D switching and frame scheduling are preserved. No shadows or glows were added.
- Mobile CAD tools show Sketch, Extrude, Rectangle and Dimension in compact icon/text targets. At 320px the target widths are approximately 53/56/65/68px, with heights 44–48px. Separators hide on mobile to preserve one compact row. Desktop appearance remains unchanged. All handlers, prerequisites, evidence, keyboard logic and lesson state are preserved.

## Validation

Baseline npm ci, TypeScript, lint, 33 unit tests, production build/prerender and 163 browser tests passed. Final TypeScript, lint, 33 unit tests, production build/prerender and all 169 browser tests passed. Formatting was checked with git diff --check; no separate formatter is configured.

The six new browser cases cover sampled canvas contrast at 320/375/1440 after dragging and both state switches, plus visible names, 44px targets, no toolbar/page overflow, keyboard focus, G/Escape/D, prerequisites, invalid dimensions and complete lesson progression. Baseline regression checks failed for low contrast and absent mobile names before the fixes. Independent read-only code review found no actionable product issue.

Direct navigation and refresh on all four routes passed at 320/375/1440. Captured routes had no page exceptions or horizontal overflow. Screenshots were manually inspected in 2D/3D and active Rectangle/Dimension states. Desktop toolbar captures were byte-identical in the targeted comparison.

Canvas measurements compare declared foreground against the actual painted background immediately before text rasterization. Sampled baseline minima were approximately 1.10:1,1.42:1 and1.01:1 for 40 mm, 30 mm and extrusion. Ivory alone also fails over some light faces/edges. With the backing the sampled color contrast is approximately 12.97:1. These figures exclude text antialiasing, font rasterization and device differences; they are not an all-angle accessibility certification.

## Existing concerns retained

The initial accessibility capture exited nonzero for aria-prohibited-attr on the existing `<g data-testid="sketch-profile" aria-label="Rectangle 40 by 30 millimeters">`. Repeating the same state before and after reproduced exactly the same finding at each of the three widths. The regression comparison passed; zero accessibility violations is not claimed. Full results remain in the checks.json files. A separate small accessibility fix can give the SVG group an appropriate semantic role.

At an extreme rotation on320px, the extrusion label already extends about 5px beyond the canvas before this change. The polish retains the original label positions and framing. Initial captured labels fit. This remains a known baseline limitation rather than a claim that every possible angle is unclipped.

## Performance investigation only

Frame rates and animation logic were not changed. In one-second local Chromium visible samples, baseline CAD/shader drew 58/58 frames; revised drew 60/60. Both recorded zero frames when synthetically hidden, offscreen or settled under reduced motion. Both balanced canvas saves/restores and released the created shader buffer on navigation. Variations under concurrent browser load are not a performance improvement claim.

A separate performance PR could compare 30fps idle rotation/sheen against current refresh-rate rendering on physical phones, preserving full-rate interaction while dragging/hovering/clicking. Measure long tasks, interaction latency and visual smoothness before choosing a setting. Route-based code loading and WOFF2 versions of the existing fonts may reduce initial loading: the baseline bundle is about 427 KB uncompressed/130KB gzip and the two preloaded TTF files total 301 KB. Neither optimization was implemented here.

[Performance before](screenshots/pre-yc/performance-before.json), [after](screenshots/pre-yc/performance-after.json), [raw local check output](screenshots/pre-yc/test-results.txt).

## Before and after screenshots

### 320px

| State | Before | After |
| --- | --- | --- |
| home | [Before](screenshots/pre-yc/before/home-320.png) | [After](screenshots/pre-yc/after/home-320.png) |
| artwork-3d | [Before](screenshots/pre-yc/before/artwork-3d-320.png) | [After](screenshots/pre-yc/after/artwork-3d-320.png) |
| artwork-2d | [Before](screenshots/pre-yc/before/artwork-2d-320.png) | [After](screenshots/pre-yc/after/artwork-2d-320.png) |
| toolbar-rectangle | [Before](screenshots/pre-yc/before/toolbar-rectangle-320.png) | [After](screenshots/pre-yc/after/toolbar-rectangle-320.png) |
| toolbar-dimension | [Before](screenshots/pre-yc/before/toolbar-dimension-320.png) | [After](screenshots/pre-yc/after/toolbar-dimension-320.png) |
| demo | [Before](screenshots/pre-yc/before/demo-320.png) | [After](screenshots/pre-yc/after/demo-320.png) |

### 375px

| State | Before | After |
| --- | --- | --- |
| home | [Before](screenshots/pre-yc/before/home-375.png) | [After](screenshots/pre-yc/after/home-375.png) |
| artwork-3d | [Before](screenshots/pre-yc/before/artwork-3d-375.png) | [After](screenshots/pre-yc/after/artwork-3d-375.png) |
| artwork-2d | [Before](screenshots/pre-yc/before/artwork-2d-375.png) | [After](screenshots/pre-yc/after/artwork-2d-375.png) |
| toolbar-rectangle | [Before](screenshots/pre-yc/before/toolbar-rectangle-375.png) | [After](screenshots/pre-yc/after/toolbar-rectangle-375.png) |
| toolbar-dimension | [Before](screenshots/pre-yc/before/toolbar-dimension-375.png) | [After](screenshots/pre-yc/after/toolbar-dimension-375.png) |
| demo | [Before](screenshots/pre-yc/before/demo-375.png) | [After](screenshots/pre-yc/after/demo-375.png) |

### 1440px

| State | Before | After |
| --- | --- | --- |
| home | [Before](screenshots/pre-yc/before/home-1440.png) | [After](screenshots/pre-yc/after/home-1440.png) |
| artwork-3d | [Before](screenshots/pre-yc/before/artwork-3d-1440.png) | [After](screenshots/pre-yc/after/artwork-3d-1440.png) |
| artwork-2d | [Before](screenshots/pre-yc/before/artwork-2d-1440.png) | [After](screenshots/pre-yc/after/artwork-2d-1440.png) |
| toolbar-rectangle | [Before](screenshots/pre-yc/before/toolbar-rectangle-1440.png) | [After](screenshots/pre-yc/after/toolbar-rectangle-1440.png) |
| toolbar-dimension | [Before](screenshots/pre-yc/before/toolbar-dimension-1440.png) | [After](screenshots/pre-yc/after/toolbar-dimension-1440.png) |
| demo | [Before](screenshots/pre-yc/before/demo-1440.png) | [After](screenshots/pre-yc/after/demo-1440.png) |

## Owner-only acceptance

Live leqad.com routes, physical-phone behavior, real Formspree delivery and notification inbox acceptance remain owner checks after approval and deployment. No real inquiry was sent. Remote exact-commit CI status is not established by these local results. No merge or deployment occurred.
