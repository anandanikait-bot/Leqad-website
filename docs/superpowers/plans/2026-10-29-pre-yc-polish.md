# Focused pre-YC CAD polish

User-approved brief: technical label readability and mobile CAD tool discoverability. Base `9f6b73e`, branch `polish/pre-yc-cad-labels`. No merge or deployment.

1. Record baseline install, typecheck, lint, unit, build and browser results. Serve frozen build on4340 and capture 320/375/1440 views before edits.
2. Change only artwork label rendering in CadArtwork3D.tsx. Measure representative existing backgrounds, use ivory and a minimal navy backing if required by moving faces. Preserve fonts, geometry and animation. Add actual-render regression coverage.
3. Change only mobile tool presentation in SimulatedCADCanvas.tsx. Short names for Sketch, Extrude, Rectangle and Dimension, retaining44px targets, prerequisites and desktop presentation. Add responsive and action-gating regression coverage.
4. Build integrated site on4341. Run typecheck/lint/unit/build/fullbrowser, focused accessibility and route/refresh checks. Capture matching screenshots in2D/3D and lesson states. Inspect artifacts and diff.
5. Record animation measurements only, plus route-splitting/WOFF2 future recommendations. No animation, bundling or font changes.
6. Commit/push focused branch and attemptPR. Disclose remoteAPI/CI or livehost blocks. No merge/deploy.
