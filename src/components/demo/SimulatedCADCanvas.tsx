import React, { useState, useRef } from 'react';
import { LessonStep, ViewOrientation } from '../../types';
import { 
  Square, 
  Circle, 
  Minus, 
  Maximize2, 
  Check, 
  X, 
  Compass, 
  Box, 
  Layers, 
  Ruler, 
  Eye, 
  ShieldCheck,
  MousePointer,
  HelpCircle
} from 'lucide-react';

interface SimulatedCADCanvasProps {
  step: LessonStep;
  currentStepIndex: number;
  isHighlightingControl: boolean;
  onAdvanceStep: () => void;
  onTriggerTool: (toolId: string) => void;
}

export const SimulatedCADCanvas: React.FC<SimulatedCADCanvasProps> = ({
  step,
  currentStepIndex,
  isHighlightingControl,
  onAdvanceStep,
  onTriggerTool,
}) => {
  const [viewOrientation, setViewOrientation] = useState<ViewOrientation>(
    currentStepIndex === 0 ? 'iso' : 'top'
  );
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0.0, y: 0.0 });
  const [svgCursor, setSvgCursor] = useState<{ x: number; y: number } | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Sync orientation with step 1 -> step 2
  React.useEffect(() => {
    if (currentStepIndex === 0) {
      setViewOrientation('iso');
    } else {
      setViewOrientation('top');
    }
  }, [currentStepIndex]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!canvasRef.current) return;
    const svg = canvasRef.current;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    // Transform client coordinate directly into SVG coordinate space
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgPoint = pt.matrixTransform(ctm.inverse());

    // In our parametric CAD sketch:
    // Origin is anchored at SVG (0,0) -> CAD (0.0, 0.0) mm
    // Scale: 1 mm in CAD = 2 SVG units (160 SVG width = 80 mm, 100 SVG height = 50 mm)
    // Standard Cartesian CAD +Y is upwards (-Y in SVG space)
    const cadX = Number((svgPoint.x * 0.5).toFixed(1));
    const cadY = Number((-svgPoint.y * 0.5).toFixed(1));

    setCursorPos({ x: cadX, y: cadY });
    setSvgCursor({ x: svgPoint.x, y: svgPoint.y });
  };

  const handleMouseLeave = () => {
    setSvgCursor(null);
  };

  const isStepAtLeast = (targetStep: number) => currentStepIndex >= targetStep - 1;

  // Active tool mapping
  const activeTool = step.activeToolId;

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] bg-[#EDF1F3] rounded-xl border border-[#D9DDD9] flex flex-col overflow-hidden select-none shadow-sm">
      {/* CAD Application Top Ribbon */}
      <div className="h-11 bg-white border-b border-[#D9DDD9] px-3 flex items-center justify-between text-xs text-[#0E2943] z-20">
        {/* Left CAD Toolbar */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {/* Sketch tool */}
          <button
            onClick={() => onTriggerTool('sketch')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
              activeTool === 'sketch'
                ? 'bg-[#0E2943] text-white shadow-xs'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isHighlightingControl && activeTool === 'sketch'
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Sketch on plane"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sketch</span>
          </button>

          <div className="w-[1px] h-5 bg-[#D9DDD9] mx-1" />

          {/* Corner Rectangle */}
          <button
            onClick={() => onTriggerTool('rectangle')}
            className={`p-1.5 rounded transition-all cursor-pointer relative ${
              activeTool === 'rectangle'
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isHighlightingControl && activeTool === 'rectangle'
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Corner Rectangle (G)"
          >
            <Square className="w-4 h-4" />
            {isHighlightingControl && activeTool === 'rectangle' && (
              <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#B74B21]" />
            )}
          </button>

          {/* Center Point Circle */}
          <button
            onClick={() => onTriggerTool('circle')}
            className={`p-1.5 rounded transition-all cursor-pointer relative ${
              activeTool === 'circle'
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isHighlightingControl && activeTool === 'circle'
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Center Point Circle (C)"
          >
            <Circle className="w-4 h-4" />
            {isHighlightingControl && activeTool === 'circle' && (
              <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#B74B21]" />
            )}
          </button>

          {/* Line tool */}
          <button
            className="p-1.5 rounded text-[#55616B] hover:text-[#0E2943] hover:bg-[#FAF8F4] transition-all cursor-pointer"
            title="Line (L)"
          >
            <Minus className="w-4 h-4 rotate-45" />
          </button>

          {/* Dimension tool */}
          <button
            onClick={() => onTriggerTool('dimension')}
            className={`p-1.5 rounded transition-all cursor-pointer relative ${
              activeTool === 'dimension'
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#0E2943] border border-transparent hover:border-[#D9DDD9]'
            } ${
              isHighlightingControl && activeTool === 'dimension'
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Dimension (D)"
          >
            <Ruler className="w-4 h-4" />
            {isHighlightingControl && activeTool === 'dimension' && (
              <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#B74B21]" />
            )}
          </button>

          <div className="w-[1px] h-5 bg-[#D9DDD9] mx-1" />

          {/* Constraints inspector */}
          <button
            onClick={() => onTriggerTool('constraints')}
            className={`px-2 py-1 rounded flex items-center gap-1 font-mono text-[11px] transition-all cursor-pointer ${
              activeTool === 'constraints'
                ? 'bg-[#0E2943] text-white'
                : 'hover:bg-[#FAF8F4] text-[#0E2943]'
            } ${
              isHighlightingControl && activeTool === 'constraints'
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="Geometric Constraints"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B74B21]" />
            <span className="hidden sm:inline">Constraints</span>
          </button>

          {/* Normal to view tool */}
          <button
            onClick={() => {
              setViewOrientation(viewOrientation === 'top' ? 'iso' : 'top');
              onTriggerTool('view-normal');
            }}
            className={`p-1.5 rounded transition-all cursor-pointer ${
              activeTool === 'view-normal' || viewOrientation === 'top'
                ? 'bg-[#F5EFE7] text-[#0E2943] border border-[#D9DDD9]'
                : 'hover:bg-[#FAF8F4] text-[#55616B]'
            } ${
              isHighlightingControl && activeTool === 'view-normal'
                ? 'ring-2 ring-[#B74B21] ring-offset-1 ring-offset-white animate-pulse'
                : ''
            }`}
            title="View Normal to Sketch Plane (N)"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Right Info: Live Coordinate Readout */}
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
        {/* Left Onshape-style Feature Tree Panel */}
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

            <button
              onClick={() => {
                if (currentStepIndex === 0) onAdvanceStep();
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
                isStepAtLeast(8)
                  ? 'bg-emerald-50 text-emerald-900 font-medium border border-emerald-200'
                  : 'bg-[#F5EFE7] text-[#0E2943] font-semibold'
              }`}>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-[#B74B21]" />
                  <span>Sketch 1</span>
                </div>
                {isStepAtLeast(8) ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <span className="text-[9px] text-[#B74B21] uppercase">Editing</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Floating Sketch Dialog Box (as in Onshape) */}
        {isStepAtLeast(1) && (
          <div className="absolute top-3 left-3 sm:left-48 bg-white/95 backdrop-blur-xs border border-[#D9DDD9] shadow-sm rounded-md px-3 py-1.5 flex items-center gap-3 z-20 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B74B21]" />
              <strong className="text-[#0E2943]">Sketch 1</strong>
              <span className="text-[#55616B] text-[11px]">(Top Plane)</span>
            </div>

            <div className="flex items-center gap-1 border-l border-[#D9DDD9] pl-2">
              <button
                onClick={() => {
                  if (currentStepIndex === 7) onAdvanceStep();
                }}
                className={`w-6 h-6 rounded flex items-center justify-center transition-all cursor-pointer ${
                  currentStepIndex === 7
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-500 ring-offset-1 animate-bounce'
                    : isStepAtLeast(8)
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
                title="Accept Sketch"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
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
              onClick={() => setViewOrientation('top')}
              className={`text-center py-0.5 rounded transition-colors cursor-pointer ${
                viewOrientation === 'top' ? 'bg-[#0E2943] text-white' : 'hover:bg-[#FAF8F4]'
              }`}
            >
              TOP
            </button>
            <div className="flex justify-between items-center px-0.5">
              <button
                onClick={() => setViewOrientation('front')}
                className="hover:text-[#B74B21] transition-colors cursor-pointer"
              >
                F
              </button>
              <button
                onClick={() => setViewOrientation('iso')}
                className={`px-1 py-0.5 rounded transition-colors cursor-pointer ${
                  viewOrientation === 'iso' ? 'bg-[#B74B21] text-white' : 'hover:bg-[#FAF8F4]'
                }`}
              >
                ISO
              </button>
              <button
                onClick={() => setViewOrientation('right')}
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

        {/* Interactive SVG CAD Canvas */}
        <svg
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            // Clicking the canvas advances the step naturally if the visitor interacts!
            onAdvanceStep();
          }}
          className="w-full h-full cursor-crosshair bg-cad-grid relative transition-all"
          viewBox="-250 -180 500 360"
        >
          {/* Subtle Grid Markings */}
          <g stroke="#0E2943" strokeOpacity="0.08" strokeWidth="1">
            {[-200, -150, -100, -50, 0, 50, 100, 150, 200].map((pos) => (
              <line key={`gx-${pos}`} x1={pos} y1="-180" x2={pos} y2="180" />
            ))}
            {[-150, -100, -50, 0, 50, 100, 150].map((pos) => (
              <line key={`gy-${pos}`} x1="-250" y1={pos} x2="250" y2={pos} />
            ))}
          </g>

          {/* Coordinate Reference Axes */}
          <g>
            {/* Origin Datum */}
            <circle cx="0" cy="0" r="4" fill="#B74B21" />
            <circle cx="0" cy="0" r="8" fill="none" stroke="#B74B21" strokeWidth="1.25" strokeDasharray="3 2" />
            <text x="7" y="-6" fill="#B74B21" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
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

          {/* Step 1: Isometric Top Plane Preview (when in ISO view or Step 0) */}
          {viewOrientation === 'iso' && (
            <g>
              <polygon
                points="-140,50 60,110 160,-20 -40,-80"
                fill={currentStepIndex === 0 ? 'rgba(183, 75, 33, 0.12)' : 'rgba(14, 41, 67, 0.05)'}
                stroke={currentStepIndex === 0 ? '#B74B21' : '#0E2943'}
                strokeWidth={currentStepIndex === 0 ? '2' : '1'}
                strokeDasharray={currentStepIndex === 0 ? 'none' : '4 3'}
                className="cursor-pointer transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdvanceStep();
                }}
              />
              <text x="-120" y="45" fill="#0E2943" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="600">
                Top Plane [Click to Select]
              </text>
            </g>
          )}

          {/* Step 3+: Base Rectangle */}
          {/* Rectangle dimensions: 160px width (represents 80mm), 100px height (represents 50mm) */}
          {/* In SVG coordinate system: (0,0) is origin, width goes +160, height goes -100 */}
          {isStepAtLeast(3) && (
            <g>
              {/* Shaded Profile Face (when accepted at step 8) */}
              {isStepAtLeast(8) && (
                <path
                  d="M0,0 L160,0 L160,-100 L0,-100 Z M80,-50 m -24,0 a 24,24 0 1,0 48,0 a 24,24 0 1,0 -48,0"
                  fill="rgba(14, 41, 67, 0.14)"
                  stroke="none"
                />
              )}

              {/* Rectangle Perimeter (Electric Blue when under-constrained at step 3-6, Black when fully constrained at step 7-8) */}
              <rect
                x="0"
                y="-100"
                width="160"
                height="100"
                fill={isStepAtLeast(8) ? 'transparent' : 'rgba(45, 127, 249, 0.04)'}
                stroke={isStepAtLeast(7) ? '#0E2943' : '#2D7FF9'}
                strokeWidth={isStepAtLeast(7) ? '2.5' : '2'}
                className="transition-colors duration-200"
              />

              {/* Step 3: Corner Handle Nodes */}
              <circle cx="0" cy="0" r="3.5" fill="#B74B21" />
              <circle cx="160" cy="-100" r="3.5" fill={isStepAtLeast(7) ? '#0E2943' : '#2D7FF9'} />
              <circle cx="160" cy="0" r="3" fill={isStepAtLeast(7) ? '#0E2943' : '#2D7FF9'} />
              <circle cx="0" cy="-100" r="3" fill={isStepAtLeast(7) ? '#0E2943' : '#2D7FF9'} />

              {/* Under-constrained indicator tag */}
              {!isStepAtLeast(7) && (
                <text x="165" y="-95" fill="#2D7FF9" fontSize="9" fontFamily="IBM Plex Mono">
                  [Under-constrained (Blue)]
                </text>
              )}
            </g>
          )}

          {/* Step 4+: Parametric Dimensions for Rectangle (80 mm x 50 mm) */}
          {isStepAtLeast(4) && (
            <g className="animate-fadeIn">
              {/* Horizontal Top Dimension (80 mm) */}
              <g stroke="#0E2943" strokeWidth="1">
                {/* Witness lines */}
                <line x1="0" y1="-100" x2="0" y2="-125" stroke="#55616B" strokeDasharray="2 2" />
                <line x1="160" y1="-100" x2="160" y2="-125" stroke="#55616B" strokeDasharray="2 2" />
                {/* Dimension line & arrows */}
                <line x1="4" y1="-120" x2="156" y2="-120" />
                <polygon points="4,-120 10,-122 10,-118" fill="#0E2943" />
                <polygon points="156,-120 150,-122 150,-118" fill="#0E2943" />
              </g>
              {/* Dimension Value Badge */}
              <rect x="62" y="-132" width="36" height="16" rx="2" fill="#FFFFFF" stroke="#0E2943" strokeWidth="1" />
              <text x="80" y="-120" textAnchor="middle" fill="#0E2943" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                80 mm
              </text>

              {/* Vertical Right Dimension (50 mm) */}
              <g stroke="#0E2943" strokeWidth="1">
                {/* Witness lines */}
                <line x1="160" y1="0" x2="185" y2="0" stroke="#55616B" strokeDasharray="2 2" />
                <line x1="160" y1="-100" x2="185" y2="-100" stroke="#55616B" strokeDasharray="2 2" />
                {/* Dimension line & arrows */}
                <line x1="180" y1="-4" x2="180" y2="-96" />
                <polygon points="180,-4 178,-10 182,-10" fill="#0E2943" />
                <polygon points="180,-96 178,-90 182,-90" fill="#0E2943" />
              </g>
              {/* Dimension Value Badge */}
              <rect x="164" y="-58" width="34" height="16" rx="2" fill="#FFFFFF" stroke="#0E2943" strokeWidth="1" />
              <text x="181" y="-46" textAnchor="middle" fill="#0E2943" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                50 mm
              </text>
            </g>
          )}

          {/* Step 5+: Center Point Mounting Hole Circle */}
          {/* Position: center at (80, -50), radius 24 (diameter 20mm scale) */}
          {isStepAtLeast(5) && (
            <g className="animate-fadeIn">
              {/* Center point mark */}
              <line x1="75" y1="-50" x2="85" y2="-50" stroke="#B74B21" strokeWidth="1.25" />
              <line x1="80" y1="-55" x2="80" y2="-45" stroke="#B74B21" strokeWidth="1.25" />
              <circle cx="80" cy="-50" r="2" fill="#B74B21" />

              {/* Circle entity */}
              <circle
                cx="80"
                cy="-50"
                r="24"
                fill="none"
                stroke={isStepAtLeast(7) ? '#0E2943' : '#2D7FF9'}
                strokeWidth={isStepAtLeast(7) ? '2.5' : '2'}
                className="transition-colors duration-200"
              />
            </g>
          )}

          {/* Step 6+: Circle Diameter and Offset Dimensions */}
          {isStepAtLeast(6) && (
            <g className="animate-fadeIn">
              {/* Circle Diameter Dimension (⌀ 20 mm) with leader arrow */}
              <g stroke="#0E2943" strokeWidth="1">
                <line x1="97" y1="-67" x2="125" y2="-85" />
                <line x1="125" y1="-85" x2="155" y2="-85" />
                <polygon points="97,-67 101,-72 104,-68" fill="#0E2943" />
              </g>
              <rect x="127" y="-95" width="48" height="16" rx="2" fill="#FFFFFF" stroke="#0E2943" strokeWidth="1" />
              <text x="151" y="-83" textAnchor="middle" fill="#0E2943" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="600">
                ⌀ 20 mm
              </text>

              {/* X Offset to Center: 40 mm */}
              <g stroke="#55616B" strokeWidth="1" strokeDasharray="2 2">
                <line x1="0" y1="-20" x2="80" y2="-20" />
                <line x1="80" y1="-50" x2="80" y2="-20" />
              </g>
              <rect x="30" y="-28" width="34" height="14" rx="2" fill="#FFFFFF" stroke="#55616B" strokeWidth="0.8" />
              <text x="47" y="-18" textAnchor="middle" fill="#55616B" fontSize="9" fontFamily="IBM Plex Mono">
                40 mm
              </text>

              {/* Y Offset to Center: 25 mm */}
              <g stroke="#55616B" strokeWidth="1" strokeDasharray="2 2">
                <line x1="40" y1="0" x2="40" y2="-50" />
                <line x1="40" y1="-50" x2="80" y2="-50" />
              </g>
              <rect x="23" y="-35" width="34" height="14" rx="2" fill="#FFFFFF" stroke="#55616B" strokeWidth="0.8" />
              <text x="40" y="-25" textAnchor="middle" fill="#55616B" fontSize="9" fontFamily="IBM Plex Mono">
                25 mm
              </text>
            </g>
          )}

          {/* Step 7+: Geometric Constraints Badges */}
          {isStepAtLeast(7) && (
            <g className="animate-fadeIn">
              {/* Coincident constraint glyph at Origin */}
              <g transform="translate(-16, 12)">
                <rect x="0" y="0" width="16" height="14" rx="2" fill="#0E2943" />
                <circle cx="8" cy="7" r="3" fill="#FFFFFF" />
              </g>
              <text x="3" y="22" fill="#0E2943" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">
                Coincident (Origin)
              </text>

              {/* Horizontal constraint glyph on top edge */}
              <g transform="translate(72, -107)">
                <rect x="0" y="0" width="16" height="12" rx="2" fill="#0E2943" />
                <line x1="3" y1="6" x2="13" y2="6" stroke="#FFFFFF" strokeWidth="1.5" />
              </g>

              {/* Vertical constraint glyph on right edge */}
              <g transform="translate(162, -56)">
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

          {/* Step 8: Extrude Readiness Preview */}
          {isStepAtLeast(8) && (
            <g transform="translate(-180, 110)">
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

        {/* Floating Interactive Canvas Click Prompter */}
        <div className="absolute bottom-3 left-3 sm:left-48 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xs border border-[#D9DDD9] rounded-md px-3 py-1.5 shadow-xs flex items-center gap-2 pointer-events-auto">
            <MousePointer className="w-3.5 h-3.5 text-[#B74B21]" />
            <span className="text-xs text-[#0E2943]">
              <strong className="font-semibold text-[#0E2943]">Action:</strong> {step.recommendedAction}
            </span>
          </div>

          <button
            onClick={onAdvanceStep}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0E2943] text-white hover:bg-[#163859] px-3 py-1.5 rounded-md text-xs font-medium shadow-xs pointer-events-auto transition-colors cursor-pointer"
          >
            <span>Execute step</span>
            <span className="font-mono text-[10px] bg-white/20 px-1 rounded">↵</span>
          </button>
        </div>
      </div>
    </div>
  );
};
