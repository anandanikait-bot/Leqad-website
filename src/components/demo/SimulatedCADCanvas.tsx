import React, { useState, useRef, useEffect } from 'react';
import { LessonStep, ViewOrientation, SketchDemoStatus } from '../../types';
import { PlateModel } from './PlateModel';
import { DimensionInput } from './DimensionInput';
import { 
  Square, 
  Check, 
  X, 
  Box, 
  Layers, 
  Ruler, 
  Info,
} from 'lucide-react';

interface SimulatedCADCanvasProps {
  step: LessonStep;
  currentStepIndex: number;
  sketchStatus: SketchDemoStatus;
  widthMm: number;
  heightMm: number;
  extrudeDepthMm: number;
  onDepthChange: (depth: number) => void;
  onDepthValidityChange: (valid: boolean) => void;
  onDrawRectangle: (width: number, height: number) => void;
  actionAllowed: boolean;
  highlightedTargetId: string | null;
  isDemoComplete?: boolean;
  onTriggerAction: (actionId: string) => void;
  onResetSketch?: () => void;
  onCancelExtrude?: () => void;
}

export const SimulatedCADCanvas: React.FC<SimulatedCADCanvasProps> = ({
  step,
  currentStepIndex,
  sketchStatus,
  widthMm,
  heightMm,
  extrudeDepthMm,
  onDepthChange,
  onDepthValidityChange,
  onDrawRectangle,
  actionAllowed,
  highlightedTargetId,
  isDemoComplete = false,
  onTriggerAction,
  onResetSketch,
  onCancelExtrude,
}) => {
  const [viewOrientation, setViewOrientation] = useState<ViewOrientation>('iso');
  const [rectangleArmed, setRectangleArmed] = useState(false);
  const [originSet, setOriginSet] = useState(false);
  const [rectanglePreview, setRectanglePreview] = useState({ width: 20, height: 15 });
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0.0, y: 0.0 });
  const [svgCursor, setSvgCursor] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Keep the sketch planar; return to an isometric view only once there is
  // a genuine extrusion preview. This prevents step navigation faking a solid.
  useEffect(() => {
    setViewOrientation(
      sketchStatus === 'extrude-preview' || sketchStatus === 'solid-created'
        ? 'iso' : currentStepIndex <= 1 ? 'iso' : 'top'
    );
  }, [currentStepIndex, sketchStatus]);

  useEffect(() => {
    if (currentStepIndex !== 3 || sketchStatus !== 'sketch-active') {
      setRectangleArmed(false); setOriginSet(false);
    }
  }, [currentStepIndex, sketchStatus]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || (event.target as HTMLElement)?.closest('input,textarea,select,[contenteditable="true"]')) return;
      if (event.key.toLowerCase() === 'd' && currentStepIndex === 4 && sketchStatus === 'rectangle-drawn' && actionAllowed) onTriggerAction('apply-dimensions');
      if (currentStepIndex !== 3 || sketchStatus !== 'sketch-active') return;
      if (event.key.toLowerCase() === 'g') { setRectangleArmed(true); setOriginSet(false); }
      if (event.key === 'Escape') { setRectangleArmed(false); setOriginSet(false); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [currentStepIndex, sketchStatus, actionAllowed, onTriggerAction]);

  const pointerPoint = (event: React.PointerEvent<SVGSVGElement>) => {
    const svg = canvasRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const p = svg.createSVGPoint(); p.x = event.clientX; p.y = event.clientY;
    return p.matrixTransform(matrix.inverse());
  };
  const pointerDimensions = (point: { x: number; y: number }) => ({
    width: Math.max(20, Math.min(50, Math.round(point.x / 3))),
    height: Math.max(15, Math.min(40, Math.round(-point.y / 3))),
  });
  const handleDrawingClick = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0 || !rectangleArmed || currentStepIndex !== 3 || sketchStatus !== 'sketch-active') return;
    const p = pointerPoint(event);
    if (!p) return;
    if (!originSet) {
      if (Math.hypot(p.x, p.y) <= 18) setOriginSet(true);
    } else if (p.x >= 60 && p.y <= -45) {
      const dimensions = pointerDimensions(p);
      onDrawRectangle(dimensions.width, dimensions.height);
    }
  };

  // Precise mathematical conversion from SVG viewBox to 40x30 mm CAD coordinate space
  // Scale: 1 mm in CAD = 3 SVG units (120 SVG units = 40 mm, 90 SVG units = 30 mm)
  // Origin (0,0) in SVG is CAD (0.0, 0.0) mm
  // Standard CAD +Y is upwards (-SVG Y)
  const handleMouseMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (sketchStatus === 'extrude-preview' || sketchStatus === 'solid-created') return;
    if (!canvasRef.current) return;
    const svg = canvasRef.current;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(ctm.inverse());

    const cadX = Number((svgPoint.x / 3).toFixed(1));
    const cadY = Number((-svgPoint.y / 3).toFixed(1));

    setCursorPos({ x: cadX, y: cadY });
    setSvgCursor({ x: svgPoint.x, y: svgPoint.y });
    if (rectangleArmed && originSet && currentStepIndex === 3) setRectanglePreview(pointerDimensions(svgPoint));
  };

  const handleMouseLeave = () => {
    setSvgCursor(null);
  };

  // State-aware flags based on actual simulation state (Fix #2, Fix #3)
  const isPlaneSelected = sketchStatus !== 'not-started';
  const isExtrudePreview = sketchStatus === 'extrude-preview';
  const isSolidCreated = sketchStatus === 'solid-created';
  const isExtruding = isExtrudePreview || isSolidCreated;
  const isSketchActive = sketchStatus !== 'not-started' && sketchStatus !== 'plane-selected';
  const isRectangleDrawn = ['rectangle-drawn', 'dimensioned', 'accepted-in-demo', 'extrude-preview', 'solid-created'].includes(sketchStatus);
  const isDimensioned = ['dimensioned', 'accepted-in-demo', 'extrude-preview', 'solid-created'].includes(sketchStatus);
  const isSketchAccepted = ['accepted-in-demo', 'extrude-preview', 'solid-created'].includes(sketchStatus);
  const widthUnits = widthMm * 3;
  const heightUnits = heightMm * 3;
  const canStartSketch = currentStepIndex === 2 && sketchStatus === 'plane-selected';
  const canDraw = currentStepIndex === 3 && sketchStatus === 'sketch-active';
  const canDimension = currentStepIndex === 4 && sketchStatus === 'rectangle-drawn' && actionAllowed;
  const canExtrude = currentStepIndex === 6 && sketchStatus === 'accepted-in-demo';

  // Highlight check
  const isTargetHighlighted = (targetId: string) => highlightedTargetId === targetId;

  // Fix a sketch-mode height regression: keep the complete workbench a predictable
  // viewport-aware size. The drawing SVG flexes inside it and must not force
  // the surrounding grid to grow when the sketch toolbar or viewBox changes.
  // The CAD workspace is not independently scrollable: keep wheel/trackpad
  // events available to Lenis while pointer events still drive sketching.
  // Reserve data-lenis-prevent for scrollable overlays such as dialogs.
  return (
    <div className="relative flex h-[clamp(420px,62svh,520px)] w-full min-w-0 flex-col overflow-hidden rounded-xl border border-[#D9DDD9] bg-[#EDF1F3] shadow-sm select-none sm:h-[clamp(460px,63svh,560px)] lg:h-[clamp(480px,64svh,600px)]">
      {/* CAD Application Ribbon Toolbar */}
      <div role="toolbar" aria-label="CAD tools" className="[&_button:disabled]:opacity-35 [&_button:disabled]:cursor-not-allowed z-20 flex min-h-11 min-w-0 flex-wrap items-center justify-between gap-2 border-b border-[#D9DDD9] bg-white px-2 py-1.5 text-xs text-[#0E2943] sm:px-3">
        {/* Left CAD Toolbar */}
        <div className="flex min-w-0 max-w-full items-center gap-1 overflow-x-auto py-1">
          {/* Sketch tool (Step 3: Start Sketch) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerAction('start-sketch');
            }}
            className={`flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded px-2.5 py-1.5 font-medium transition-all cursor-pointer ${
              currentStepIndex === 2 && !isSketchActive
                ? 'bg-[#0E2943] text-white shadow-xs'
                : isSketchActive
                ? 'bg-[#F5EFE7] text-[#0E2943] border border-[#D9DDD9]'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isTargetHighlighted('tool-sketch')
                ? 'ring-2 ring-[#793327] ring-offset-1 ring-offset-white'
                : ''
            }`}
            title="Sketch tool: Click to enter sketch mode on Top Plane"
            aria-label="Sketch tool" disabled={!canStartSketch}
          >
            <Layers className="w-3.5 h-3.5 text-[#793327]" />
            <span className="hidden sm:inline">Sketch</span>
          </button>

          <div className="w-[1px] h-5 bg-[#D9DDD9] mx-1" />

          {/* Extrude starts a distinct simulated feature preview, not a silent advance. */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerAction('start-extrude');
            }}
            className={`flex min-h-11 min-w-11 items-center justify-center gap-1 rounded px-2 py-1.5 transition-all cursor-pointer ${
              currentStepIndex === 6
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#55616B]'
            } ${
              isTargetHighlighted('tool-extrude')
                ? 'ring-2 ring-[#793327] ring-offset-1 ring-offset-white'
                : ''
            }`}
            title="Extrude: Start a Solid / New / Blind preview"
            aria-label="Extrude 3D tool" disabled={!canExtrude}
          >
            <Box className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Extrude</span>
          </button>

          <div className="w-[1px] h-5 bg-[#D9DDD9] mx-1" />

          {/* Corner Rectangle Tool (G) (Step 4: Draw Rectangle) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (canDraw) { setRectangleArmed(true); setOriginSet(false); }
            }}
            className={`relative flex min-h-11 min-w-11 items-center justify-center rounded p-1.5 transition-all cursor-pointer ${
              currentStepIndex === 3 && !isRectangleDrawn
                ? 'bg-[#0E2943] text-white'
                : isRectangleDrawn
                ? 'bg-[#F5EFE7] text-[#0E2943] border border-[#D9DDD9]'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isTargetHighlighted('tool-rectangle')
                ? 'ring-2 ring-[#793327] ring-offset-1 ring-offset-white'
                : ''
            }`}
            title="Corner Rectangle (G): select the origin, then the opposite corner"
            aria-label="Corner Rectangle tool" disabled={!canDraw} aria-pressed={rectangleArmed}
          >
            <Square className="w-4 h-4" />
          </button>

          {/* Dimension Tool (D) (Step 5: Apply Dimensions) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerAction('apply-dimensions');
            }}
            className={`relative flex min-h-11 min-w-11 items-center justify-center rounded p-1.5 transition-all cursor-pointer ${
              currentStepIndex === 4 && !isDimensioned
                ? 'bg-[#0E2943] text-white'
                : isDimensioned
                ? 'bg-[#F5EFE7] text-[#0E2943] border border-[#D9DDD9]'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isTargetHighlighted('tool-dimension')
                ? 'ring-2 ring-[#793327] ring-offset-1 ring-offset-white'
                : ''
            }`}
            title="Apply the current sketch dimensions"
            aria-label="Dimension tool" disabled={!canDimension}
          >
            <Ruler className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-[#D9DDD9] mx-1" />


        </div>

        {/* Right Info: Coordinate Readout */}
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2 sm:gap-3">
          <div className="font-mono whitespace-nowrap text-[11px] text-[#55616B] flex items-center gap-1.5 sm:gap-2 bg-[#F5EFE7] px-2 sm:px-2.5 py-1 rounded border border-[#D9DDD9] shadow-2xs">
            <span>
              X: <strong className="text-[#0E2943]">{cursorPos.x >= 0 ? `+${cursorPos.x.toFixed(1)}` : cursorPos.x.toFixed(1)}</strong>
            </span>
            <span className="text-[#D9DDD9]">|</span>
            <span>
              Y: <strong className="text-[#0E2943]">{cursorPos.y >= 0 ? `+${cursorPos.y.toFixed(1)}` : cursorPos.y.toFixed(1)}</strong> mm
            </span>
          </div>

          <div className="font-mono text-[11px] font-medium px-2 py-1 bg-white border border-[#D9DDD9] rounded text-[#0E2943]">
            {{ top: 'Top (XY)', iso: 'Isometric', front: 'Front (XZ)', right: 'Right (YZ)' }[viewOrientation]}
          </div>
        </div>
      </div>

      {isExtruding && <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9DDD9] bg-white px-3 py-2">
        <span className="text-xs text-[#55616B]">{isExtruding ? 'Extrude 1' : isSketchActive ? 'Sketch 1' : 'Reference planes'}</span>
        <div role="group" aria-label="Model view" className="flex gap-1 text-[11px] font-mono">
          {(['top', 'iso', 'front', 'right'] as const).map(view => (
            <button type="button" key={view} aria-label={`View ${view === 'iso' ? 'Iso (Isometric)' : view[0].toUpperCase() + view.slice(1)}`}
              aria-pressed={viewOrientation === view} onClick={() => setViewOrientation(view)}
              className={`min-h-10 rounded px-2 py-1 focus-visible:outline-2 focus-visible:outline-[#793327] ${viewOrientation === view ? 'bg-[#0E2943] text-white' : 'text-[#55616B] hover:bg-[#FAF8F4]'}`}>
              {view === 'iso' ? 'Iso' : view[0].toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>}
        {/* Inline sketch controls keep the viewport clear. */}
        {isSketchActive && !isSketchAccepted && (
          <div className="border-b border-[#D9DDD9] bg-white px-3 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#793327]" />
              <strong className="text-[#0E2943]">Sketch 1</strong>
              <span className="text-[#55616B] text-[11px]">(Top Plane)</span>
            </div>

            <div className="flex items-center gap-1 border-l border-[#D9DDD9] pl-2">
              {/* Accept Sketch button (Step 6: Finish Sketch) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerAction('finish-sketch');
                }}
                className={`disabled:opacity-35 disabled:cursor-not-allowed flex h-10 w-10 items-center justify-center rounded transition-all cursor-pointer ${
                  currentStepIndex === 5
                    ? 'bg-[#793327] text-white ring-2 ring-[#793327] ring-offset-1'
                    : 'bg-[#F5EFE7] text-[#793327] hover:bg-[#EDE1DB]'
                } ${
                  isTargetHighlighted('tool-accept-sketch')
                    ? 'ring-2 ring-[#793327] ring-offset-1'
                    : ''
                }`}
                title="Accept Sketch (Green Checkmark) — Commit Sketch 1"
                aria-label="Accept Sketch (Green Checkmark)" disabled={currentStepIndex !== 5 || sketchStatus !== 'dimensioned'}
              >
                <Check className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResetSketch?.();
                }}
                className="flex h-10 w-10 items-center justify-center rounded bg-[#F7EEEC] text-[#793327] transition-colors hover:bg-[#F1E1DD] cursor-pointer"
                title="Cancel Sketch mode"
                aria-label="Cancel Sketch"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      {isExtrudePreview && <div role="group" aria-label="Extrude 1 settings" className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-b border-[#D9DDD9] bg-white px-3 py-3">
        <div className="max-w-48"><DimensionInput label="Depth (mm)" value={extrudeDepthMm} min={1} max={50} onChange={onDepthChange} onValidityChange={onDepthValidityChange} /></div>
        <button type="button" onClick={onCancelExtrude} aria-label="Cancel Extrude" className="mb-1 rounded px-2 py-2 text-xs text-[#55616B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#793327]">Cancel</button>
      </div>}
      {/* Main CAD Canvas Area */}
      <div className={`relative flex min-h-0 min-w-0 flex-1 overflow-hidden transition-colors duration-200 ${isExtruding ? 'bg-[#0E2943]' : 'bg-[#EDF1F3]'}`}>
        {/* Left Feature Tree Panel */}
        <div className="hidden sm:flex flex-col w-44 bg-white/95 backdrop-blur-xs border-r border-[#D9DDD9] text-xs z-10 flex-shrink-0">
          <div className="p-2 border-b border-[#D9DDD9] font-mono text-[10px] uppercase font-semibold text-[#55616B] flex items-center justify-between">
            <span>Features</span>
            <Box className="w-3 h-3 text-[#55616B]" />
          </div>
          
          <div className="p-1 space-y-0.5 font-mono text-[11px]">
            <div className="px-2 py-1 rounded text-[#55616B] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943]/40" />
              <span>Origin (0,0,0)</span>
            </div>

            {/* Top Plane Feature Item - Interactive for Step 2 (Fix #4, Fix #6) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTriggerAction('select-top-plane');
              }}
              className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition-colors cursor-pointer ${
                currentStepIndex === 1 && !isPlaneSelected
                  ? 'bg-[#793327]/15 text-[#793327] font-semibold border border-[#793327]/30'
                  : isPlaneSelected
                  ? 'text-[#0E2943] font-medium bg-[#F5EFE7]'
                  : 'text-[#55616B] hover:bg-[#FAF8F4]'
              } ${
                isTargetHighlighted('tool-top-plane')
                  ? 'ring-2 ring-[#793327] ring-offset-1'
                  : ''
              }`}
              title="Top Plane (XY Datum) — Click to select datum"
              aria-label="Top Plane feature item" disabled={currentStepIndex !== 1 || sketchStatus !== 'not-started'}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isPlaneSelected ? 'bg-[#0E2943]' : 'bg-[#793327]'}`} />
                <span>Top Plane (XY)</span>
              </div>
              {currentStepIndex === 1 && !isPlaneSelected && (
                <span className="text-[9px] uppercase px-1 bg-[#793327] text-white rounded">Select</span>
              )}
            </button>

            <div className="px-2 py-1 rounded text-[#55616B] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9DDD9]" />
              <span>Front Plane (XZ)</span>
            </div>
            <div className="px-2 py-1 rounded text-[#55616B] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9DDD9]" />
              <span>Right Plane (YZ)</span>
            </div>

            {/* Sketch 1 Feature Item in Tree */}
            {isSketchActive && (
              <div className={`mt-2 pt-2 border-t border-[#D9DDD9] px-2 py-1 rounded flex items-center justify-between ${
                isSketchAccepted
                  ? 'bg-[#F5EFE7] text-[#0E2943] font-medium border border-[#D9DDD9]'
                  : 'bg-[#F5EFE7] text-[#0E2943] font-semibold'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#793327]" />
                  <span>Sketch 1</span>
                </div>
                {isSketchAccepted ? (
                  <Check className="w-3 h-3 text-[#793327]" />
                ) : (
                  <span className="text-[9px] text-[#793327] uppercase">Editing</span>
                )}
              </div>
            )}
            {isExtruding && (
              <div className={`mt-1 px-2 py-1 rounded flex items-center justify-between font-semibold ${isSolidCreated ? 'bg-[#F5EFE7] text-[#0E2943]' : 'bg-[#F5EFE7] text-[#0E2943]'}`}>
                <span className="inline-flex items-center gap-1.5"><Box className="w-3 h-3 text-[#793327]" />Extrude 1</span>
                {isSolidCreated ? <Check className="h-3 w-3 text-[#793327]" /> : <span className="text-[9px] text-[#793327]">PREVIEW</span>}
              </div>
            )}
            {isSolidCreated && (
              <div className="px-2 py-1 text-[#0E2943] font-medium">Part 1 · {widthMm} × {heightMm} × {extrudeDepthMm} mm</div>
            )}
          </div>
        </div>

        {/*
          SVG CAD Canvas:
          Sketch mode frames the origin near the vertical center with the upper-right
          quadrant visible for a full-size 50 × 40 mm rectangle and dimensions.
          Grid lines extend beyond all viewBoxes to prevent blank bands on tall screens.
          Clicking empty space or grid lines does NOT advance.
          Only clicking actual interactive entities triggers simulated actions.
        */}
        <svg
          ref={canvasRef}
          onPointerMove={handleMouseMove}
          onPointerDown={handleDrawingClick}
          role="group" aria-label="CAD drawing viewport"
          onPointerLeave={handleMouseLeave}
          className="relative block min-h-0 min-w-0 w-full flex-1 cursor-crosshair touch-pan-y"
          viewBox={isExtruding ? '-85 -285 350 380' : isSketchActive ? '-85 -175 350 310' : '-100 -140 350 280'}
        >
          {/* Grid lines (Non-interactive) */}
          <g stroke={isExtruding ? '#F5EFE7' : '#0E2943'} strokeOpacity="0.08" strokeWidth="1" pointerEvents="none">
            {[-200, -150, -100, -50, 0, 50, 100, 150, 200, 250, 300].map((pos) => (
              <line key={`gx-${pos}`} x1={pos} y1="-250" x2={pos} y2="250" />
            ))}
            {[-200, -150, -100, -50, 0, 50, 100, 150, 200].map((pos) => (
              <line key={`gy-${pos}`} x1="-300" y1={pos} x2="350" y2={pos} />
            ))}
          </g>

          {/* Coordinate Reference Axes & Origin Datum */}
          {!isExtruding && <g>
            {/* Origin Datum (Clickable in Step 4 to draw rectangle) */}
            <circle
              cx="0"
              cy="0"
              r="4.5"
              fill="#793327"
              className="cursor-pointer"
            />
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="none"
              stroke="#793327"
              strokeWidth="1.25"
              strokeDasharray="3 2"
              className="cursor-pointer"
            />
            <text x="8" y="-7" fill="#793327" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
              (0,0) Origin
            </text>

            {/* X-Axis (Red) */}
            <line x1="0" y1="0" x2="60" y2="0" stroke="#E11D48" strokeWidth="1.75" />
            <polygon points="62,0 55,-3 55,3" fill="#E11D48" />
            <text x="66" y="4" fill="#E11D48" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">
              +X
            </text>

            {/* Y-Axis (Green) */}
            <line x1="0" y1="0" x2="0" y2="-60" stroke="#10B981" strokeWidth="1.75" />
            <polygon points="0,-62 -3,-55 3,-55" fill="#10B981" />
            <text x="-4" y="-66" fill="#10B981" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="700">
              +Y
            </text>
          </g>}

          {/* Isometric Top Plane Visual (shown when in ISO view or Step 2) */}
          {!isSketchActive && !isExtruding && (
            <g>
              <polygon
                points="-60,0 80,45 160,-35 20,-80"
                role="button" aria-disabled={currentStepIndex !== 1} tabIndex={currentStepIndex === 1 ? 0 : -1} aria-label="Select Top Plane in viewport"
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onTriggerAction('select-top-plane'); } }}
                fill={isPlaneSelected ? 'rgba(121, 51, 39, 0.14)' : 'rgba(14, 41, 67, 0.05)'}
                stroke={isPlaneSelected ? '#793327' : '#0E2943'}
                strokeWidth={isPlaneSelected ? '2.5' : '1'}
                strokeDasharray={isPlaneSelected ? 'none' : '4 3'}
                className="cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerAction('select-top-plane');
                }}
              />
              <text x="50" y="-95" textAnchor="middle" pointerEvents="none" fill="#0E2943" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">
                Top Plane (XY)
              </text>
            </g>
          )}

          {canDraw && rectangleArmed && originSet && <rect role="img" aria-label="Rectangle drawing preview" x="0" y={-rectanglePreview.height * 3} width={rectanglePreview.width * 3} height={rectanglePreview.height * 3} fill="rgba(121, 51, 39,.06)" stroke="#793327" strokeWidth="1.5" strokeDasharray="4 3" pointerEvents="none" />}
          {/* Drawing is driven by editable sketch dimensions. */}
          {isRectangleDrawn && !isExtruding && (
            <g data-testid="sketch-profile" aria-label={`Rectangle ${widthMm} by ${heightMm} millimeters`}>
              {isSketchAccepted && (
                <rect x="0" y={-heightUnits} width={widthUnits} height={heightUnits}
                  fill="rgba(14, 41, 67, 0.15)" stroke="none" />
              )}
              <rect x="0" y={-heightUnits} width={widthUnits} height={heightUnits}
                fill={isSketchAccepted ? 'transparent' : 'rgba(121, 51, 39,0.04)'}
                stroke={isDimensioned ? '#0E2943' : '#793327'}
                strokeWidth={isDimensioned ? 2.5 : 2} className="transition-colors duration-200 cursor-pointer"
                onClick={event => { event.stopPropagation(); if (currentStepIndex === 4 && !isDimensioned) onTriggerAction('apply-dimensions'); }} />
              <circle cx="0" cy="0" r="3.5" fill="#793327" />
              <circle cx={widthUnits} cy={-heightUnits} r="3.5" fill={isDimensioned ? '#0E2943' : '#793327'} />
              <circle cx={widthUnits} cy="0" r="3" fill={isDimensioned ? '#0E2943' : '#793327'} />
              <circle cx="0" cy={-heightUnits} r="3" fill={isDimensioned ? '#0E2943' : '#793327'} />

            </g>
          )}
          {isRectangleDrawn && !isExtruding && (
            <g pointerEvents="none" fontFamily="IBM Plex Mono" fontSize="16" fill="#0E2943">
              <path d={`M 0 ${-heightUnits - 5} V ${-heightUnits - 20} H ${widthUnits} V ${-heightUnits - 5}`} fill="none" stroke="#55616B" strokeWidth="1" />
              <text x={widthUnits / 2} y={-heightUnits - 28} textAnchor="middle">{widthMm} mm</text>
              <path d={`M ${widthUnits + 5} 0 H ${widthUnits + 20} V ${-heightUnits} H ${widthUnits + 5}`} fill="none" stroke="#55616B" strokeWidth="1" />
              <text x={widthUnits + 30} y={-heightUnits / 2 + 5}>{heightMm} mm</text>
            </g>
          )}



          {isExtruding && <PlateModel dimensions={{ width: widthMm, height: heightMm, depth: extrudeDepthMm }} view={viewOrientation} confirmed={isSolidCreated} />}
          {/* Real-time CAD Precision Cursor & Tracking Crosshair */}
          {svgCursor && !isExtruding && (
            <g pointerEvents="none" className="transition-opacity">
              <line
                x1="-250"
                y1={svgCursor.y}
                x2="250"
                y2={svgCursor.y}
                stroke="#0E2943"
                strokeOpacity="0.18"
                strokeWidth="0.75"
                strokeDasharray="3 3"
              />
              <line
                x1={svgCursor.x}
                y1="-180"
                x2={svgCursor.x}
                y2="180"
                stroke="#0E2943"
                strokeOpacity="0.18"
                strokeWidth="0.75"
                strokeDasharray="3 3"
              />
              <circle cx={svgCursor.x} cy={svgCursor.y} r="2.5" fill="#793327" />
              <circle cx={svgCursor.x} cy={svgCursor.y} r="5.5" fill="none" stroke="#793327" strokeWidth="1" strokeDasharray="2 2" />

            </g>
          )}
        </svg>

      </div>
      <p role="status" className="min-h-10 border-t border-[#D9DDD9] bg-white px-3 py-2.5 text-xs leading-relaxed text-[#55616B]">
        {isSolidCreated ? `Part 1 created · ${widthMm} × ${heightMm} × ${extrudeDepthMm} mm` : isExtrudePreview ? `Extrude preview · ${widthMm} × ${heightMm} × ${extrudeDepthMm} mm` : isSketchAccepted ? 'Sketch accepted · Choose Extrude' : canDraw && rectangleArmed ? (originSet ? 'Choose the opposite corner above and to the right. Escape cancels drawing.' : 'Select the origin (0,0) to place the first corner.') : 'Illustrated CAD workspace'}
      </p>
    </div>
  );
};
