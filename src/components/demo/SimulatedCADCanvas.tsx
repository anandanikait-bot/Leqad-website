import React, { useState, useRef } from 'react';
import { LessonStep, ViewOrientation } from '../../types';
import { 
  Square, 
  Minus, 
  Check, 
  X, 
  Box, 
  Layers, 
  Ruler, 
  Eye, 
  ShieldCheck,
  MousePointer,
  CheckCircle2
} from 'lucide-react';

interface SimulatedCADCanvasProps {
  step: LessonStep;
  currentStepIndex: number;
  isHighlightingControl: boolean;
  isDemoComplete?: boolean;
  onAdvanceStep: () => void;
  onTriggerTool: (toolId: string) => void;
}

export const SimulatedCADCanvas: React.FC<SimulatedCADCanvasProps> = ({
  step,
  currentStepIndex,
  isHighlightingControl,
  isDemoComplete = false,
  onAdvanceStep,
  onTriggerTool,
}) => {
  const [viewOrientation, setViewOrientation] = useState<ViewOrientation>(
    currentStepIndex === 0 ? 'iso' : 'top'
  );
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0.0, y: 0.0 });
  const [svgCursor, setSvgCursor] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Sync orientation with step 1 -> step 2
  React.useEffect(() => {
    if (currentStepIndex === 0) {
      setViewOrientation('iso');
    } else {
      setViewOrientation('top');
    }
  }, [currentStepIndex]);

  // Precise mathematical conversion from SVG viewBox to 40x30 mm CAD coordinate space
  // Scale: 1 mm in CAD = 3 SVG units (120 SVG units = 40 mm, 90 SVG units = 30 mm)
  // Origin (0,0) in SVG is CAD (0.0, 0.0) mm
  // Standard CAD +Y is upwards (-SVG Y)
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
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
  };

  const handleMouseLeave = () => {
    setSvgCursor(null);
  };

  const isStepAtLeast = (targetStep: number) => currentStepIndex >= targetStep - 1;

  // Active tool mapping for the current step
  const activeTool = step.activeToolId;

  // Tool highlight helper: ONLY highlight when isHighlightingControl is true AND tool matches
  const isToolHighlighted = (toolId: string) => {
    return isHighlightingControl && activeTool === toolId;
  };

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] bg-[#EDF1F3] rounded-xl border border-[#D9DDD9] flex flex-col overflow-hidden select-none shadow-sm">
      {/* CAD Application Top Ribbon */}
      <div className="h-11 bg-white border-b border-[#D9DDD9] px-3 flex items-center justify-between text-xs text-[#0E2943] z-20">
        {/* Left CAD Toolbar */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {/* Sketch tool */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerTool('sketch');
            }}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
              activeTool === 'sketch'
                ? 'bg-[#0E2943] text-white shadow-xs'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isToolHighlighted('sketch')
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Sketch tool"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sketch</span>
          </button>

          <div className="w-[1px] h-5 bg-[#D9DDD9] mx-1" />

          {/* Corner Rectangle Tool (G) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerTool('rectangle');
            }}
            className={`p-1.5 rounded transition-all cursor-pointer relative ${
              activeTool === 'rectangle' || activeTool === 'draw-rectangle'
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isToolHighlighted('rectangle') || isToolHighlighted('draw-rectangle')
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Corner Rectangle (G)"
          >
            <Square className="w-4 h-4" />
          </button>

          {/* Line tool (inactive in this lesson) */}
          <button
            className="p-1.5 rounded text-[#55616B] hover:text-[#0E2943] hover:bg-[#FAF8F4] transition-all cursor-pointer"
            title="Line tool (L)"
          >
            <Minus className="w-4 h-4 rotate-45" />
          </button>

          {/* Dimension Tool (D) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerTool('dimension');
            }}
            className={`p-1.5 rounded transition-all cursor-pointer relative ${
              activeTool === 'dimension'
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isToolHighlighted('dimension')
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Dimension Tool (D)"
          >
            <Ruler className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-[#D9DDD9] mx-1" />

          {/* Constraints Inspector */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTriggerTool('constraints');
            }}
            className={`px-2 py-1 rounded flex items-center gap-1 font-mono text-[11px] transition-all cursor-pointer ${
              activeTool === 'constraints'
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#0E2943]'
            } ${
              isToolHighlighted('constraints')
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Geometric Constraints"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B74B21]" />
            <span className="hidden sm:inline">Constraints</span>
          </button>

          {/* Normal to view tool (N) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewOrientation(viewOrientation === 'top' ? 'iso' : 'top');
              onTriggerTool('view-normal');
            }}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeTool === 'view-normal' || viewOrientation === 'top'
                ? 'bg-[#F5EFE7] text-[#0E2943] border border-[#D9DDD9]'
                : 'hover:bg-[#FAF8F4] text-[#55616B]'
            } ${
              isToolHighlighted('view-normal')
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="View Normal to Sketch Plane (N)"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Right Info: Live Coordinate Readout (Always accurate mm values) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="font-mono text-[11px] text-[#55616B] flex items-center gap-1.5 sm:gap-2 bg-[#F5EFE7] px-2 sm:px-2.5 py-1 rounded border border-[#D9DDD9] shadow-2xs">
            <span>
              X: <strong className="text-[#0E2943]">{cursorPos.x >= 0 ? `+${cursorPos.x.toFixed(1)}` : cursorPos.x.toFixed(1)}</strong>
            </span>
            <span className="text-[#D9DDD9]">|</span>
            <span>
              Y: <strong className="text-[#0E2943]">{cursorPos.y >= 0 ? `+${cursorPos.y.toFixed(1)}` : cursorPos.y.toFixed(1)}</strong> mm
            </span>
          </div>

          <div className="font-mono text-[11px] font-medium px-2 py-1 bg-white border border-[#D9DDD9] rounded text-[#0E2943]">
            {viewOrientation === 'top' ? 'Top (Normal)' : 'Isometric'}
          </div>
        </div>
      </div>

      {/* Main CAD Canvas Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* Left Feature Tree Panel */}
        <div className="hidden sm:flex flex-col w-44 bg-white/95 backdrop-blur-xs border-r border-[#D9DDD9] text-xs z-10">
          <div className="p-2 border-b border-[#D9DDD9] font-mono text-[10px] uppercase font-semibold text-[#55616B] flex items-center justify-between">
            <span>Features</span>
            <Box className="w-3 h-3 text-[#55616B]" />
          </div>
          
          <div className="p-1 space-y-0.5 font-mono text-[11px]">
            <div className="px-2 py-1 rounded text-[#55616B] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943]/40" />
              <span>Origin (0,0,0)</span>
            </div>

            {/* Top Plane Feature Tree Item - Interactive for Step 1 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentStepIndex === 0) onTriggerTool('sketch');
              }}
              className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition-colors cursor-pointer ${
                currentStepIndex === 0
                  ? 'bg-[#B74B21]/15 text-[#B74B21] font-semibold border border-[#B74B21]/30'
                  : isStepAtLeast(1)
                  ? 'text-[#0E2943] font-medium bg-[#F5EFE7]'
                  : 'text-[#55616B] hover:bg-[#FAF8F4]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStepIndex === 0 ? 'bg-[#B74B21]' : 'bg-[#0E2943]'}`} />
                <span>Top Plane</span>
              </div>
              {currentStepIndex === 0 && (
                <span className="text-[9px] uppercase px-1 bg-[#B74B21] text-white rounded">Select</span>
              )}
            </button>

            <div className="px-2 py-1 rounded text-[#55616B]/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9DDD9]" />
              <span>Front Plane</span>
            </div>
            <div className="px-2 py-1 rounded text-[#55616B]/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D9DDD9]" />
              <span>Right Plane</span>
            </div>

            {/* Sketch 1 Feature Item */}
            {isStepAtLeast(1) && (
              <div className={`mt-2 pt-2 border-t border-[#D9DDD9] px-2 py-1 rounded flex items-center justify-between ${
                isStepAtLeast(8) || isDemoComplete
                  ? 'bg-emerald-50 text-emerald-900 font-medium border border-emerald-200'
                  : 'bg-[#F5EFE7] text-[#0E2943] font-semibold'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#B74B21]" />
                  <span>Sketch 1</span>
                </div>
                {isStepAtLeast(8) || isDemoComplete ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <span className="text-[9px] text-[#B74B21] uppercase">Editing</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Sketch Dialog Box */}
        {isStepAtLeast(1) && (
          <div className="absolute top-3 left-3 sm:left-48 bg-white/95 backdrop-blur-xs border border-[#D9DDD9] shadow-sm rounded-md px-3 py-1.5 flex items-center gap-3 z-20 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B74B21]" />
              <strong className="text-[#0E2943]">Sketch 1</strong>
              <span className="text-[#55616B] text-[11px]">(Top Plane)</span>
            </div>

            <div className="flex items-center gap-1 border-l border-[#D9DDD9] pl-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerTool('accept-sketch');
                }}
                className={`w-6 h-6 rounded flex items-center justify-center transition-all cursor-pointer ${
                  currentStepIndex === 7 && !isDemoComplete
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-1 animate-bounce'
                    : isStepAtLeast(8) || isDemoComplete
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                } ${
                  isToolHighlighted('accept-sketch')
                    ? 'ring-2 ring-[#B74B21] ring-offset-1 animate-pulse'
                    : ''
                }`}
                title="Accept Sketch (Green Checkmark)"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                className="w-6 h-6 rounded flex items-center justify-center bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                title="Cancel Sketch"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Viewport View Cube (Top Right) */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1">
          <div className="w-16 h-16 bg-white border border-[#D9DDD9] rounded-lg shadow-sm p-1.5 flex flex-col justify-between text-[9px] font-mono font-semibold text-[#0E2943] select-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewOrientation('top');
                if (currentStepIndex === 1) onTriggerTool('view-normal');
              }}
              className={`text-center py-0.5 rounded transition-colors cursor-pointer ${
                viewOrientation === 'top' ? 'bg-[#0E2943] text-white' : 'hover:bg-[#FAF8F4]'
              }`}
            >
              TOP
            </button>
            <div className="flex justify-between items-center px-0.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewOrientation('front');
                }}
                className="hover:text-[#B74B21] transition-colors cursor-pointer"
              >
                F
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewOrientation('iso');
                }}
                className={`px-1 py-0.5 rounded transition-colors cursor-pointer ${
                  viewOrientation === 'iso' ? 'bg-[#B74B21] text-white' : 'hover:bg-[#FAF8F4]'
                }`}
              >
                ISO
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewOrientation('right');
                }}
                className="hover:text-[#B74B21] transition-colors cursor-pointer"
              >
                R
              </button>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#55616B] bg-white/70 px-1.5 py-0.5 rounded border border-[#D9DDD9]">
            CAD Orbit: Ready
          </span>
        </div>

        {/*
          SVG CAD Canvas:
          Fix #1: General SVG onClick is completely REMOVED.
          Clicking empty space, grid lines, or background does NOT advance the lesson.
        */}
        <svg
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair bg-cad-grid relative transition-all"
          viewBox="-250 -180 500 360"
        >
          {/* Grid lines (Non-interactive) */}
          <g stroke="#0E2943" strokeOpacity="0.08" strokeWidth="1" pointerEvents="none">
            {[-200, -150, -100, -50, 0, 50, 100, 150, 200].map((pos) => (
              <line key={`gx-${pos}`} x1={pos} y1="-180" x2={pos} y2="180" />
            ))}
            {[-150, -100, -50, 0, 50, 100, 150].map((pos) => (
              <line key={`gy-${pos}`} x1="-250" y1={pos} x2="250" y2={pos} />
            ))}
          </g>

          {/* Coordinate Reference Axes & Origin Datum */}
          <g>
            {/* Origin Datum */}
            <circle
              cx="0"
              cy="0"
              r="4.5"
              fill="#B74B21"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (currentStepIndex === 3) onTriggerTool('draw-rectangle');
              }}
            />
            <circle
              cx="0"
              cy="0"
              r="9"
              fill="none"
              stroke="#B74B21"
              strokeWidth="1.25"
              strokeDasharray="3 2"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (currentStepIndex === 3) onTriggerTool('draw-rectangle');
              }}
            />
            <text x="8" y="-7" fill="#B74B21" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
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
          </g>

          {/* Step 1: Isometric Top Plane Preview (only when in ISO view or Step 0) */}
          {viewOrientation === 'iso' && (
            <g>
              <polygon
                points="-140,50 60,110 160,-20 -40,-80"
                fill={currentStepIndex === 0 ? 'rgba(183, 75, 33, 0.14)' : 'rgba(14, 41, 67, 0.05)'}
                stroke={currentStepIndex === 0 ? '#B74B21' : '#0E2943'}
                strokeWidth={currentStepIndex === 0 ? '2.5' : '1'}
                strokeDasharray={currentStepIndex === 0 ? 'none' : '4 3'}
                className="cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentStepIndex === 0) onTriggerTool('sketch');
                }}
              />
              <text x="-120" y="45" fill="#0E2943" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">
                Top Plane [Click to Select]
              </text>
            </g>
          )}

          {/* Step 3: Interactive drawing prompter at Origin */}
          {currentStepIndex === 2 && viewOrientation === 'top' && (
            <g transform="translate(10, 25)" pointerEvents="none" className="animate-fadeIn">
              <rect x="0" y="0" width="190" height="22" rx="3" fill="#0E2943" fillOpacity="0.88" />
              <text x="8" y="15" fill="#F5EFE7" fontSize="10" fontFamily="IBM Plex Mono">
                Rectangle tool ready: Anchor at (0,0)
              </text>
            </g>
          )}

          {/*
            Steps 4+: 40 × 30 mm Base Rectangle Geometry
            Scale: 1 mm = 3 SVG units
            Width: 40 mm = 120 SVG units (x: 0 to 120)
            Height: 30 mm = 90 SVG units (y: 0 to -90)
            Under-constrained in Steps 4-6 (Electric Blue #2D7FF9)
            Fully Constrained in Steps 7-8 (Crisp Black #0E2943)
          */}
          {isStepAtLeast(4) && (
            <g>
              {/* Shaded Profile Face when accepted (Step 8 or Demo Complete) */}
              {(isStepAtLeast(8) || isDemoComplete) && (
                <rect
                  x="0"
                  y="-90"
                  width="120"
                  height="90"
                  fill="rgba(14, 41, 67, 0.14)"
                  stroke="none"
                />
              )}

              {/* Rectangle Boundary */}
              <rect
                x="0"
                y="-90"
                width="120"
                height="90"
                fill={(isStepAtLeast(8) || isDemoComplete) ? 'transparent' : 'rgba(45, 127, 249, 0.04)'}
                stroke={(isStepAtLeast(7) || isDemoComplete) ? '#0E2943' : '#2D7FF9'}
                strokeWidth={(isStepAtLeast(7) || isDemoComplete) ? '2.5' : '2'}
                className="transition-colors duration-200"
              />

              {/* Corner Vertices */}
              <circle cx="0" cy="0" r="3.5" fill="#B74B21" />
              <circle cx="120" cy="-90" r="3.5" fill={(isStepAtLeast(7) || isDemoComplete) ? '#0E2943' : '#2D7FF9'} />
              <circle cx="120" cy="0" r="3" fill={(isStepAtLeast(7) || isDemoComplete) ? '#0E2943' : '#2D7FF9'} />
              <circle cx="0" cy="-90" r="3" fill={(isStepAtLeast(7) || isDemoComplete) ? '#0E2943' : '#2D7FF9'} />

              {/* Under-constrained tag before Step 7 */}
              {!isStepAtLeast(7) && !isDemoComplete && (
                <text x="125" y="-85" fill="#2D7FF9" fontSize="9" fontFamily="IBM Plex Mono">
                  [Under-constrained (Blue)]
                </text>
              )}
            </g>
          )}

          {/*
            Step 5+: Parametric Horizontal Width Dimension (40 mm)
            Leader above top edge (y = -115)
          */}
          {isStepAtLeast(5) && (
            <g
              className="animate-fadeIn cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (currentStepIndex === 4) onTriggerTool('dimension');
              }}
            >
              {/* Witness lines */}
              <line x1="0" y1="-90" x2="0" y2="-120" stroke="#55616B" strokeDasharray="2 2" strokeWidth="1" />
              <line x1="120" y1="-90" x2="120" y2="-120" stroke="#55616B" strokeDasharray="2 2" strokeWidth="1" />
              {/* Dimension line & arrows */}
              <line x1="4" y1="-115" x2="116" y2="-115" stroke="#0E2943" strokeWidth="1.25" />
              <polygon points="4,-115 10,-117 10,-113" fill="#0E2943" />
              <polygon points="116,-115 110,-117 110,-113" fill="#0E2943" />
              {/* 40 mm Value Badge */}
              <rect x="42" y="-127" width="36" height="16" rx="2" fill="#FFFFFF" stroke="#0E2943" strokeWidth="1" />
              <text x="60" y="-115" textAnchor="middle" fill="#0E2943" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                40 mm
              </text>
            </g>
          )}

          {/*
            Step 6+: Parametric Vertical Height Dimension (30 mm)
            Leader to the right of vertical edge (x = 145)
          */}
          {isStepAtLeast(6) && (
            <g
              className="animate-fadeIn cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (currentStepIndex === 5) onTriggerTool('dimension');
              }}
            >
              {/* Witness lines */}
              <line x1="120" y1="0" x2="150" y2="0" stroke="#55616B" strokeDasharray="2 2" strokeWidth="1" />
              <line x1="120" y1="-90" x2="150" y2="-90" stroke="#55616B" strokeDasharray="2 2" strokeWidth="1" />
              {/* Dimension line & arrows */}
              <line x1="145" y1="-4" x2="145" y2="-86" stroke="#0E2943" strokeWidth="1.25" />
              <polygon points="145,-4 143,-10 147,-10" fill="#0E2943" />
              <polygon points="145,-86 143,-80 147,-80" fill="#0E2943" />
              {/* 30 mm Value Badge */}
              <rect x="128" y="-53" width="34" height="16" rx="2" fill="#FFFFFF" stroke="#0E2943" strokeWidth="1" />
              <text x="145" y="-41" textAnchor="middle" fill="#0E2943" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                30 mm
              </text>
            </g>
          )}

          {/*
            Step 7+: Geometric Constraints Badges
            Coincident (Origin), Horizontal (Top Edge), Vertical (Right Edge)
          */}
          {(isStepAtLeast(7) || isDemoComplete) && (
            <g
              className="animate-fadeIn cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (currentStepIndex === 6) onTriggerTool('constraints');
              }}
            >
              {/* Coincident constraint glyph at Origin */}
              <g transform="translate(-16, 12)">
                <rect x="0" y="0" width="16" height="14" rx="2" fill="#0E2943" />
                <circle cx="8" cy="7" r="3" fill="#FFFFFF" />
              </g>
              <text x="3" y="22" fill="#0E2943" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                Coincident (Origin)
              </text>

              {/* Horizontal constraint glyph on top edge */}
              <g transform="translate(52, -97)">
                <rect x="0" y="0" width="16" height="12" rx="2" fill="#0E2943" />
                <line x1="3" y1="6" x2="13" y2="6" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* Vertical constraint glyph on right edge */}
              <g transform="translate(122, -51)">
                <rect x="0" y="0" width="12" height="16" rx="2" fill="#0E2943" />
                <line x1="6" y1="3" x2="6" y2="13" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* Fully Constrained Status Tag */}
              <g transform="translate(-180, -140)">
                <rect x="0" y="0" width="160" height="24" rx="4" fill="#0E2943" />
                <text x="12" y="16" fill="#FFFFFF" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                  ✓ FULLY CONSTRAINED (0 DOF)
                </text>
              </g>
            </g>
          )}

          {/* Step 8 / Demo Complete: Watertight Profile Ready for Extrude */}
          {(isStepAtLeast(8) || isDemoComplete) && (
            <g transform="translate(-180, 110)" className="animate-fadeIn">
              <rect x="0" y="0" width="220" height="28" rx="4" fill="#0E2943" />
              <text x="10" y="18" fill="#F5EFE7" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">
                ★ WATERTIGHT PROFILE (READY FOR EXTRUDE)
              </text>
            </g>
          )}

          {/* Real-time CAD Precision Cursor & Tracking Crosshair */}
          {svgCursor && (
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
              <circle cx={svgCursor.x} cy={svgCursor.y} r="2.5" fill="#B74B21" />
              <circle cx={svgCursor.x} cy={svgCursor.y} r="5.5" fill="none" stroke="#B74B21" strokeWidth="1" strokeDasharray="2 2" />
              {/* Floating Coordinate HUD near cursor */}
              <g transform={`translate(${Math.min(135, Math.max(-235, svgCursor.x + 10))}, ${Math.min(155, Math.max(-165, svgCursor.y - 12))})`}>
                <rect x="0" y="0" width="104" height="18" rx="3" fill="#0E2943" fillOpacity="0.9" />
                <text x="6" y="12" fill="#FFFFFF" fontSize="9" fontFamily="IBM Plex Mono">
                  X:{cursorPos.x >= 0 ? `+${cursorPos.x.toFixed(1)}` : cursorPos.x.toFixed(1)} Y:{cursorPos.y >= 0 ? `+${cursorPos.y.toFixed(1)}` : cursorPos.y.toFixed(1)}
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Floating Interactive Canvas Action Prompter */}
        <div className="absolute bottom-3 left-3 sm:left-48 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xs border border-[#D9DDD9] rounded-md px-3 py-1.5 shadow-xs flex items-center gap-2 pointer-events-auto">
            <MousePointer className="w-3.5 h-3.5 text-[#B74B21]" />
            <span className="text-xs text-[#0E2943]">
              <strong className="font-semibold text-[#0E2943]">Action:</strong> {step.recommendedAction}
            </span>
          </div>

          {/* Explicit interactive button for the active step */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (activeTool) {
                onTriggerTool(activeTool);
              } else {
                onAdvanceStep();
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0E2943] text-white hover:bg-[#163859] px-3 py-1.5 rounded-md text-xs font-medium shadow-xs pointer-events-auto transition-colors cursor-pointer"
          >
            <span>Execute step action</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded">↵</span>
          </button>
        </div>
      </div>
    </div>
  );
};
