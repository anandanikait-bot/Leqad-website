import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Layers, Rotate3d, Compass, Info } from 'lucide-react';

interface CadArtwork3DProps {
  className?: string;
}

export const CadArtwork3D: React.FC<CadArtwork3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mode state: 2D sketch vs 3D extruded form
  const [isExtruded, setIsExtruded] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Extrude animation progress (0 = 2D sketch, 1 = 3D solid form)
  const animProgressRef = useRef<number>(1);
  const targetProgressRef = useRef<number>(1);

  // Rotation angles (Euler angles in radians)
  const rotXRef = useRef<number>(0.48); // tilt forward to view top plane
  const rotYRef = useRef<number>(-0.62); // slight isometric slant
  const velXRef = useRef<number>(0);
  const velYRef = useRef<number>(0);
  const lastPointerPosRef = useRef<{ x: number; y: number } | null>(null);
  const pointerDownTimeRef = useRef<number>(0);
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPointerDownRef = useRef<boolean>(false);
  const totalDragDistanceRef = useRef<number>(0);

  // Toggle extruded state cleanly
  const toggleExtrusion = useCallback(() => {
    setIsExtruded((prev) => {
      const next = !prev;
      targetProgressRef.current = next ? 1 : 0;
      return next;
    });
  }, []);

  useEffect(() => {
    targetProgressRef.current = isExtruded ? 1 : 0;
  }, [isExtruded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isRunning = false;
    let inViewport = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = media.matches;
    const isVisible = () => inViewport && !document.hidden;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      startAnimation();
    };

    // 3D Geometry definition (40 mm x 30 mm base, 22 mm extruded height)
    const scale = 4.4;
    const baseW = 40; // X axis mm (-20 to +20)
    const baseD = 30; // Z axis mm (-15 to +15)
    const maxH = 22;  // Y axis mm (0 to 22)

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisible()) {
        isRunning = false;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth progress animation (lerp)
      const diff = targetProgressRef.current - animProgressRef.current;
      if (prefersReducedMotion) animProgressRef.current = targetProgressRef.current;
      else animProgressRef.current += diff * Math.min(dt * 8, 0.25);

      // Inertia & slow idle rotation
      if (!isPointerDownRef.current) {
        if (!prefersReducedMotion) {
          rotYRef.current += 0.20 * dt;
        }
        // Apply velocity decay only when motion is allowed.
        if (prefersReducedMotion) { velXRef.current = 0; velYRef.current = 0; }
        rotXRef.current += velXRef.current;
        rotYRef.current += velYRef.current;
        velXRef.current *= 0.92;
        velYRef.current *= 0.92;

        // Clamp vertical pitch to prevent flipping
        rotXRef.current = Math.max(0.15, Math.min(1.25, rotXRef.current));
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Background navy gradient (#0E2943)
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.48,
        20,
        width * 0.5,
        height * 0.5,
        Math.hypot(width, height) * 0.65
      );
      bgGrad.addColorStop(0, '#15385B');
      bgGrad.addColorStop(1, '#0A1E32');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.52;
      const camDist = 380;

      // 3D projection function
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotYRef.current);
        const sinY = Math.sin(rotYRef.current);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(rotXRef.current);
        const sinX = Math.sin(rotXRef.current);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective factor
        const pz = camDist / (camDist + z2);
        return {
          px: cx + x1 * scale * pz,
          py: cy - y2 * scale * pz,
          depth: z2,
        };
      };

      // 1. Draw Ground Plane CAD Grid (Ivory tone, faint)
      ctx.save();
      ctx.strokeStyle = 'rgba(245, 239, 231, 0.07)';
      ctx.lineWidth = 1;
      const gridSize = 70;
      const gridStep = 10;
      for (let g = -gridSize; g <= gridSize; g += gridStep) {
        const pA = project(g, 0, -gridSize);
        const pB = project(g, 0, gridSize);
        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();

        const pC = project(-gridSize, 0, g);
        const pD = project(gridSize, 0, g);
        ctx.beginPath();
        ctx.moveTo(pC.px, pC.py);
        ctx.lineTo(pD.px, pD.py);
        ctx.stroke();
      }

      // 2. Coordinate Origin & Axes (XY Datum)
      const o = project(0, 0, 0);
      const axisLen = 16;
      const axisX = project(axisLen, 0, 0);
      const axisY = project(0, axisLen, 0);
      const axisZ = project(0, 0, axisLen);

      // X Axis (Red/Rust)
      ctx.strokeStyle = 'rgba(183, 75, 33, 0.7)';
      ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.moveTo(o.px, o.py);
      ctx.lineTo(axisX.px, axisX.py);
      ctx.stroke();

      // Y Axis (Greenish/Ivory)
      ctx.strokeStyle = 'rgba(100, 180, 120, 0.6)';
      ctx.beginPath();
      ctx.moveTo(o.px, o.py);
      ctx.lineTo(axisY.px, axisY.py);
      ctx.stroke();

      // Z Axis (Blue/Ivory)
      ctx.strokeStyle = 'rgba(120, 160, 210, 0.6)';
      ctx.beginPath();
      ctx.moveTo(o.px, o.py);
      ctx.lineTo(axisZ.px, axisZ.py);
      ctx.stroke();

      ctx.fillStyle = '#F5EFE7';
      ctx.font = '9px monospace';
      ctx.fillText('X', axisX.px + 4, axisX.py + 3);
      ctx.fillText('Y', axisY.px + 4, axisY.py - 3);
      ctx.fillText('Z', axisZ.px + 4, axisZ.py + 3);

      // 3. Define 3D Mesh Vertices (Cuboid)
      const halfW = baseW / 2;
      const halfD = baseD / 2;
      const currH = maxH * animProgressRef.current;

      const vertices = [
        // Base vertices (Y = 0)
        [-halfW, 0, -halfD], // 0: back-left
        [halfW, 0, -halfD],  // 1: back-right
        [halfW, 0, halfD],   // 2: front-right
        [-halfW, 0, halfD],  // 3: front-left
        // Top vertices (Y = currH)
        [-halfW, currH, -halfD], // 4: top back-left
        [halfW, currH, -halfD],  // 5: top back-right
        [halfW, currH, halfD],   // 6: top front-right
        [-halfW, currH, halfD],  // 7: top front-left
      ];

      const projectedV = vertices.map((v) => project(v[0], v[1], v[2]));

      // 4. Face Definitions with Normals
      const faces = [
        { indices: [0, 1, 2, 3], normal: [0, -1, 0], name: 'bottom' },
        { indices: [4, 7, 6, 5], normal: [0, 1, 0], name: 'top' },
        { indices: [3, 2, 6, 7], normal: [0, 0, 1], name: 'front' },
        { indices: [1, 0, 4, 5], normal: [0, 0, -1], name: 'back' },
        { indices: [0, 3, 7, 4], normal: [-1, 0, 0], name: 'left' },
        { indices: [2, 1, 5, 6], normal: [1, 0, 0], name: 'right' },
      ];

      // Sort faces back-to-front
      const sortedFaces = faces.map((f) => {
        const avgZ = f.indices.reduce((sum, idx) => sum + projectedV[idx].depth, 0) / f.indices.length;
        return { ...f, avgZ };
      }).sort((a, b) => b.avgZ - a.avgZ);

      // 5. Render Faces (Shaded with Ivory and Rust tones)
      const lightDir = [-0.4, 0.8, 0.45];
      const lightMag = Math.hypot(...lightDir);
      const lNorm = lightDir.map((v) => v / lightMag);

      sortedFaces.forEach((f) => {
        // Rotate normal to world space
        const [nx, ny, nz] = f.normal;
        const cosY = Math.cos(rotYRef.current);
        const sinY = Math.sin(rotYRef.current);
        const nx1 = nx * cosY - nz * sinY;
        const nz1 = nx * sinY + nz * cosY;

        const cosX = Math.cos(rotXRef.current);
        const sinX = Math.sin(rotXRef.current);
        const ny2 = ny * cosX - nz1 * sinX;
        const nz2 = ny * sinX + nz1 * cosX;

        // Diffuse shading
        const dot = Math.max(0.12, nx1 * lNorm[0] + ny2 * lNorm[1] + nz2 * lNorm[2]);

        ctx.beginPath();
        const first = projectedV[f.indices[0]];
        ctx.moveTo(first.px, first.py);
        for (let i = 1; i < f.indices.length; i++) {
          const pt = projectedV[f.indices[i]];
          ctx.lineTo(pt.px, pt.py);
        }
        ctx.closePath();

        // Shading palette
        const alpha = 0.15 + 0.70 * animProgressRef.current;
        if (f.name === 'top') {
          // Top face: Highlighted with warm ivory / copper reflection
          const lum = Math.floor(215 + dot * 38);
          ctx.fillStyle = `rgba(${lum}, ${Math.floor(lum * 0.94)}, ${Math.floor(lum * 0.88)}, ${alpha.toFixed(3)})`;
        } else {
          // Side faces: Precision gunmetal / navy with subtle rust ambient
          const lum = Math.floor(135 + dot * 85);
          ctx.fillStyle = `rgba(${Math.floor(lum * 0.85)}, ${Math.floor(lum * 0.88)}, ${lum}, ${(alpha * 0.92).toFixed(3)})`;
        }
        ctx.fill();
      });

      // 6. Draw Wireframe Edges
      ctx.strokeStyle = '#F5EFE7';
      ctx.lineWidth = 1.25;

      const edges = [
        // Base rectangle
        [0, 1], [1, 2], [2, 3], [3, 0],
        // Top rectangle
        [4, 5], [5, 6], [6, 7], [7, 4],
        // Vertical pillars
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      edges.forEach(([iA, iB]) => {
        const pA = projectedV[iA];
        const pB = projectedV[iB];
        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();
      });

      // 7. Technical Dimension Annotations (40 mm x 30 mm)
      ctx.save();
      ctx.font = '10px monospace';
      ctx.fillStyle = '#B74B21';

      // Width dimension (40 mm along X edge between vertex 3 and 2)
      const p3 = projectedV[3];
      const p2 = projectedV[2];
      const midX1 = (p3.px + p2.px) * 0.5;
      const midY1 = (p3.py + p2.py) * 0.5 + 16;
      ctx.fillText('40 mm', midX1 - 15, midY1);

      // Depth dimension (30 mm along Z edge between vertex 2 and 1)
      const p1 = projectedV[1];
      const midX2 = (p2.px + p1.px) * 0.5 + 10;
      const midY2 = (p2.py + p1.py) * 0.5 + 4;
      ctx.fillText('30 mm', midX2, midY2);

      // Height dimension label when extruded
      if (currH > 8) {
        const midX3 = (p1.px + projectedV[5].px) * 0.5 + 24;
        const midY3 = (p1.py + projectedV[5].py) * 0.5;
        ctx.fillStyle = '#B74B21';
        ctx.fillText('22 mm [EXT]', midX3, midY3);
      }

      // Corner datum dots
      [projectedV[0], projectedV[1], projectedV[2], projectedV[3]].forEach((pt) => {
        ctx.fillStyle = '#B74B21';
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // Reduced-motion artwork draws on changes, then sleeps.
      if (!prefersReducedMotion) animId = requestAnimationFrame(render);
      else isRunning = false;
    };

    const startAnimation = () => {
      if (!isRunning && isVisible()) {
        isRunning = true;
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };

    const stopAnimation = () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };

    // Observe visibility to save CPU when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (isVisible()) {
        startAnimation();
      } else {
        stopAnimation();
      }
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibilityChange = () => {
      if (isVisible()) {
        startAnimation();
      } else {
        stopAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const onMotionChange = () => {
      prefersReducedMotion = media.matches;
      stopAnimation();
      startAnimation();
    };
    media.addEventListener('change', onMotionChange);
    const container = containerRef.current;
    const redrawEvents = ['pointermove', 'pointerup', 'click'];
    redrawEvents.forEach(event => container?.addEventListener(event, startAnimation));
    window.addEventListener('resize', resize);
    resize();
    startAnimation();

    return () => {
      stopAnimation();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      media.removeEventListener('change', onMotionChange);
      redrawEvents.forEach(event => container?.removeEventListener(event, startAnimation));
      observer.disconnect();
    };
  }, []);

  // Pointer event handlers with proper capture and pan-y mobile support
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If click was on a button inside, let the button handle it
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    isPointerDownRef.current = true;
    setIsDragging(true);
    totalDragDistanceRef.current = 0;
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    pointerDownTimeRef.current = performance.now();

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture isn't supported or active
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !lastPointerPosRef.current) return;
    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;
    totalDragDistanceRef.current += Math.hypot(dx, dy);

    const rotSpeed = 0.0065;
    rotYRef.current += dx * rotSpeed;
    rotXRef.current += dy * rotSpeed;
    rotXRef.current = Math.max(0.12, Math.min(1.35, rotXRef.current));

    velYRef.current = dx * rotSpeed * 0.4;
    velXRef.current = dy * rotSpeed * 0.4;

    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const cleanupPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    lastPointerPosRef.current = null;
    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      cleanupPointer(e);
      return;
    }

    const duration = performance.now() - pointerDownTimeRef.current;
    const moveDist = totalDragDistanceRef.current;

    // If tap/click with minimal movement, toggle view between sketch and extrude
    if (duration < 300 && moveDist < 6) {
      toggleExtrusion();
    }

    cleanupPointer(e);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    cleanupPointer(e);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[360px] sm:h-[420px] lg:h-[460px] bg-[#0E2943] rounded-2xl border border-[#0E2943]/40 shadow-xl overflow-hidden select-none touch-pan-y ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      title="Drag to rotate · Tap to switch view"
      role="region"
      aria-label="Interactive 3D CAD Geometry Visualization"
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block pointer-events-none" />

      {/* Top Header Overlay Bar */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none text-xs gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#B74B21] animate-pulse flex-shrink-0" />
          <span className="font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider text-[#F5EFE7] uppercase truncate">
            FORM STUDY / 001
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#F5EFE7]/50">
            · 40 × 30 mm
          </span>
        </div>

        {/* State Toggle Button (Pointer Events Isolated) */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            toggleExtrusion();
          }}
          className="pointer-events-auto bg-[#0E2943]/85 hover:bg-[#15385B] text-[#F5EFE7] border border-[#F5EFE7]/20 hover:border-[#F5EFE7]/40 px-2.5 py-1 rounded-md font-mono text-[10px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#F5EFE7]"
          title="Switch between 2D sketch and 3D extruded prism"
          aria-label={isExtruded ? "3D Extrude: switch to 2D Sketch" : "2D Sketch: switch to 3D Extrusion"}
        >
          {isExtruded ? (
            <>
              <Box className="w-3 h-3 text-[#B74B21]" />
              <span>3D EXTRUDE</span>
            </>
          ) : (
            <>
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>2D SKETCH</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Footer Overlay Bar */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between pointer-events-none text-[10px] sm:text-[11px] font-mono text-[#F5EFE7]/70 gap-2">
        {/* Subtle Disclaimer */}
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#F5EFE7]/60">
          <Info className="w-3 h-3 text-[#B74B21] flex-shrink-0" />
          <span>Concept visualization · Not live CAD</span>
        </div>

        {/* Interaction Label */}
        <div className="bg-[#0E2943]/85 border border-[#F5EFE7]/20 px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] tracking-wide text-[#F5EFE7] flex items-center gap-1.5 shadow-xs ml-auto">
          <Rotate3d className="w-3 h-3 text-[#B74B21] flex-shrink-0" />
          <span>DRAG TO ROTATE · TAP TO SWITCH VIEW</span>
        </div>
      </div>
    </div>
  );
};
