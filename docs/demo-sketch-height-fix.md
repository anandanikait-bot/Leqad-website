# CAD demo sketch-mode height fix

## Symptom
Starting Sketch 1 caused the embedded CAD workbench to become very tall, leaving users with an awkward, stretched drawing area. The previous SVG intrinsic aspect ratio changed between isometric and sketch views and its flex minimum height pushed the CSS grid row, while `h-full` on both columns/teaching panel coupled their dimensions.

## Fix
- The **actual CAD workbench** now has one bounded, viewport-aware height that is independent of sketch stage: 420–520 px on the narrowest screens; 460–560 px for tablets; 480–600 px on desktops and ultrawide monitors.
- The SVG uses `flex-1 min-h-0 w-full` to use the remaining available drawing area without forcing its flex parent to expand. Its unchanged viewBox, geometry, coordinate transformation, pointer interactions and scrolling behavior are preserved.
- The workbench grid's two columns are sized independently instead of stretching each other. The teaching panel grows naturally for instructions rather than elongating the CAD drawing.
- No artwork, logo/favicon paths, colors, or lesson content changed.

## Regression tests
- Compare CAD workbench pixel height **before vs after starting a sketch**, after drawing and after dimensioning, across 320, 375, 768, 1024, 1440, 1920 and 3840-pixel viewport widths.
- Verify the sketch origin remains in view, has workable drawing area, and that completing the extruded plate does not reintroduce the stretch.
- Existing precise two-point drawing, feature-tree, keyboard navigation, scrolling and responsiveness tests remain part of the full browser suite.
- Test the active demo alongside separate PR #42, which concerns logo visibility and touches different files.

Do not merge without CI and responsive screenshot review. A GitHub merge does not deploy the build to Cloud Run.
