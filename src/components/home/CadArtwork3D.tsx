import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Layers, Rotate3d, Compass } from 'lucide-react';

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

  // Toggle extruded state
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
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Observe visibility to pause rendering when offscreen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

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
    };

    resize();
    window.addEventListener('resize', resize);

    // 3D Geometry definition (40 mm x 30 mm base, 22 mm extruded height)
    // Scale factor: 1 mm = ~4.5 canvas units
    const scale = 4.4;
    const baseW = 40; // X axis mm (-20 to +20)
    const baseD = 30; // Z axis mm (-15 to +15)
    const maxH = 22;  // Y axis mm (0 to 22)

    // Render loop
    let lastTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth progress animation (lerp)
      const diff = targetProgressRef.current - animProgressRef.current;
      animProgressRef.current += diff * Math.min(dt * 8, 0.25);

      // Inertia & slow idle rotation
      if (!isPointerDownRef.current) {
        // Slow constant idle spin if not reduced motion
        if (!prefersReducedMotion) {
          rotYRef.current += 0.22 * dt;
        }
        // Apply velocity decay
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
        // CAD coordinates: X (right), Y (up), Z (towards viewer)
        // Rotate around Y
        const cosY = Math.cos(rotYRef.current);
        const sinY = Math.sin(rotYRef.current);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X
        const cosX = Math.cos(rotXRef.current);
        const sinX = Math.sin(rotXRef.current);
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective
        const pz = camDist + z2;
        const factor = pz > 1 ? camDist / pz : 1;
        return {
          px: cx + x1 * factor,
          py: cy - y1 * factor,
          pz: z2,
          visible: factor > 0,
        };
      };

      // Draw subtle CAD XY grid on ground (Y = 0)
      ctx.save();
      const gridSpacing = 10 * scale;
      const gridExtent = 45 * scale;
      ctx.strokeStyle = 'rgba(245, 239, 231, 0.07)';
      ctx.lineWidth = 1;

      for (let g = -gridExtent; g <= gridExtent; g += gridSpacing) {
        const pA = project(g, 0, -gridExtent);
        const pB = project(g, 0, gridExtent);
        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();

        const pC = project(-gridExtent, 0, g);
        const pD = project(gridExtent, 0, g);
        ctx.beginPath();
        ctx.moveTo(pC.px, pC.py);
        ctx.lineTo(pD.px, pD.py);
        ctx.stroke();
      }

      // Draw coordinate origin datum tripod (X=Rust, Y=Emerald, Z=Cyan)
      const originPt = project(0, 0, 0);
      const axisLen = 14 * scale;
      const xEnd = project(axisLen, 0, 0);
      const yEnd = project(0, axisLen, 0);
      const zEnd = project(0, 0, axisLen);

      // X Axis (Rust #B74B21)
      ctx.strokeStyle = '#B74B21';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originPt.px, originPt.py);
      ctx.lineTo(xEnd.px, xEnd.py);
      ctx.stroke();

      // Y Axis (Ivory #F5EFE7)
      ctx.strokeStyle = '#F5EFE7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originPt.px, originPt.py);
      ctx.lineTo(yEnd.px, yEnd.py);
      ctx.stroke();

      // Z Axis (Steel Blue)
      ctx.strokeStyle = 'rgba(168, 202, 230, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(originPt.px, originPt.py);
      ctx.lineTo(zEnd.px, zEnd.py);
      ctx.stroke();

      // Origin dot
      ctx.fillStyle = '#B74B21';
      ctx.beginPath();
      ctx.arc(originPt.px, originPt.py, 3, 0, Math.PI * 2);
      ctx.fill();

      // Current animated extrusion height
      const currH = animProgressRef.current * maxH * scale;
      const hw = (baseW * 0.5) * scale;
      const hd = (baseD * 0.5) * scale;

      // Vertices of engineered stepped bracket:
      // Base: [-hw, -hd] to [hw, hd]
      // Top plate: extends up to currH
      // Flange/step: inner cut on top face when extruded > 0.3
      const v = [
        // Bottom vertices 0-3 (Y = 0)
        { x: -hw, y: 0, z: -hd },
        { x:  hw, y: 0, z: -hd },
        { x:  hw, y: 0, z:  hd },
        { x: -hw, y: 0, z:  hd },
        // Top vertices 4-7 (Y = currH)
        { x: -hw, y: currH, z: -hd },
        { x:  hw, y: currH, z: -hd },
        { x:  hw, y: currH, z:  hd },
        { x: -hw, y: currH, z:  hd },
        // Stepped rib vertices 8-11 (Y = currH * 1.5 for engineered bracket appearance)
        { x: -hw * 0.4, y: currH * 1.45, z: -hd * 0.6 },
        { x:  hw * 0.4, y: currH * 1.45, z: -hd * 0.6 },
        { x:  hw * 0.4, y: currH * 1.45, z:  hd * 0.6 },
        { x: -hw * 0.4, y: currH * 1.45, z:  hd * 0.6 },
      ];

      const projectedV = v.map((pt) => project(pt.x, pt.y, pt.z));

      // Define 3D solid faces
      interface Face {
        indices: number[];
        normal: { x: number; y: number; z: number };
        isAccent?: boolean;
        avgZ: number;
      }

      const faces: Face[] = [];

      if (currH > 1) {
        // Side faces
        // Front (Z = +hd): 3, 2, 6, 7
        faces.push({
          indices: [3, 2, 6, 7],
          normal: { x: 0, y: 0, z: 1 },
          avgZ: (projectedV[3].pz + projectedV[2].pz + projectedV[6].pz + projectedV[7].pz) / 4,
        });
        // Back (Z = -hd): 1, 0, 4, 5
        faces.push({
          indices: [1, 0, 4, 5],
          normal: { x: 0, y: 0, z: -1 },
          avgZ: (projectedV[1].pz + projectedV[0].pz + projectedV[4].pz + projectedV[5].pz) / 4,
        });
        // Left (X = -hw): 0, 3, 7, 4
        faces.push({
          indices: [0, 3, 7, 4],
          normal: { x: -1, y: 0, z: 0 },
          avgZ: (projectedV[0].pz + projectedV[3].pz + projectedV[7].pz + projectedV[4].pz) / 4,
        });
        // Right (X = +hw): 2, 1, 5, 6
        faces.push({
          indices: [2, 1, 5, 6],
          normal: { x: 1, y: 0, z: 0 },
          avgZ: (projectedV[2].pz + projectedV[1].pz + projectedV[5].pz + projectedV[6].pz) / 4,
        });
        // Top cap: 4, 5, 6, 7
        faces.push({
          indices: [4, 5, 6, 7],
          normal: { x: 0, y: 1, z: 0 },
          avgZ: (projectedV[4].pz + projectedV[5].pz + projectedV[6].pz + projectedV[7].pz) / 4,
        });
      }

      // Sort faces back-to-front (painter's algorithm)
      faces.sort((a, b) => b.avgZ - a.avgZ);

      // Light direction in world space (upper right front)
      const lightDir = { x: 0.45, y: 0.75, z: 0.48 };
      const lightLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
      lightDir.x /= lightLen;
      lightDir.y /= lightLen;
      lightDir.z /= lightLen;

      // Draw solid faces with ivory shading
      for (const face of faces) {
        const dot = Math.max(0.12, face.normal.x * lightDir.x + face.normal.y * lightDir.y + face.normal.z * lightDir.z);
        const alpha = 0.18 + dot * 0.28;

        ctx.fillStyle = `rgba(245, 239, 231, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        face.indices.forEach((idx, i) => {
          const pt = projectedV[idx];
          if (i === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        });
        ctx.closePath();
        ctx.fill();
      }

      // Draw wireframe edges (crisp ivory #F5EFE7 and rust #B74B21 highlights)
      ctx.lineWidth = 1.75;
      ctx.strokeStyle = '#F5EFE7';

      // Base rectangle (always drawn, ivory in 2D sketch, subtle in 3D)
      ctx.beginPath();
      ctx.moveTo(projectedV[0].px, projectedV[0].py);
      ctx.lineTo(projectedV[1].px, projectedV[1].py);
      ctx.lineTo(projectedV[2].px, projectedV[2].py);
      ctx.lineTo(projectedV[3].px, projectedV[3].py);
      ctx.closePath();
      if (currH < 1) {
        ctx.fillStyle = 'rgba(245, 239, 231, 0.12)';
        ctx.fill();
        ctx.strokeStyle = '#F5EFE7';
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = 'rgba(245, 239, 231, 0.4)';
        ctx.lineWidth = 1;
      }
      ctx.stroke();

      // In 3D mode: draw top edges and vertical extruded corners
      if (currH > 1) {
        // Vertical extruded corner pillars
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#F5EFE7';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(projectedV[i].px, projectedV[i].py);
          ctx.lineTo(projectedV[i + 4].px, projectedV[i + 4].py);
          ctx.stroke();
        }

        // Top face boundary
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#F5EFE7';
        ctx.beginPath();
        ctx.moveTo(projectedV[4].px, projectedV[4].py);
        ctx.lineTo(projectedV[5].px, projectedV[5].py);
        ctx.lineTo(projectedV[6].px, projectedV[6].py);
        ctx.lineTo(projectedV[7].px, projectedV[7].py);
        ctx.closePath();
        ctx.stroke();

        // Accent chamfer / feature line (Rust #B74B21)
        ctx.strokeStyle = '#B74B21';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(projectedV[4].px, projectedV[4].py);
        ctx.lineTo(projectedV[6].px, projectedV[6].py);
        ctx.stroke();
      }

      // Dimensional Annotations (40 mm × 30 mm)
      // Width leader on front edge (0 to 1)
      const p0 = projectedV[0];
      const p1 = projectedV[1];
      const p2 = projectedV[2];

      // Subtle 40 mm label offset from bottom front edge
      const dimOffsetX = 0;
      const dimOffsetY = 16;
      const midX1 = (p0.px + p1.px) * 0.5 + dimOffsetX;
      const midY1 = (p0.py + p1.py) * 0.5 + dimOffsetY;

      ctx.fillStyle = '#F5EFE7';
      ctx.font = '600 10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('40 mm', midX1, midY1);

      // Subtle 30 mm label on side edge
      const midX2 = (p1.px + p2.px) * 0.5 + 24;
      const midY2 = (p1.py + p2.py) * 0.5;
      ctx.fillText('30 mm', midX2, midY2);

      // Height dimension label when extruded
      if (currH > 8) {
        const midX3 = (p1.px + projectedV[5].px) * 0.5 + 26;
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
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // Pointer event handlers for drag-to-rotate & click-to-extrude
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    setIsDragging(true);
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    pointerDownTimeRef.current = performance.now();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current || !lastPointerPosRef.current) return;
    const dx = e.clientX - lastPointerPosRef.current.x;
    const dy = e.clientY - lastPointerPosRef.current.y;

    const rotSpeed = 0.0065;
    rotYRef.current += dx * rotSpeed;
    rotXRef.current += dy * rotSpeed;
    rotXRef.current = Math.max(0.12, Math.min(1.35, rotXRef.current));

    velYRef.current = dx * rotSpeed * 0.4;
    velXRef.current = dy * rotSpeed * 0.4;

    lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    setIsDragging(false);
    const duration = performance.now() - pointerDownTimeRef.current;
    const moveDist = Math.hypot(
      e.clientX - pointerDownPosRef.current.x,
      e.clientY - pointerDownPosRef.current.y
    );

    // If tap/click with minimal movement, toggle extrusion
    if (duration < 280 && moveDist < 6) {
      toggleExtrusion();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[360px] sm:h-[420px] lg:h-[460px] bg-[#0E2943] rounded-2xl border border-[#0E2943]/40 shadow-xl overflow-hidden select-none touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      title="Click to toggle Extrude · Drag to rotate geometry"
      role="region"
      aria-label="Interactive 3D CAD Geometry Visualization"
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Top Header Overlay Bar */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B74B21] animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#F5EFE7] uppercase">
            FORM STUDY / 001
          </span>
          <span className="hidden sm:inline font-mono text-[10px] text-[#F5EFE7]/50">
            · 40 × 30 mm
          </span>
        </div>

        {/* State Toggle Button (Pointer Events Enabled) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleExtrusion();
          }}
          className="pointer-events-auto bg-[#0E2943]/80 hover:bg-[#15385B] text-[#F5EFE7] border border-[#F5EFE7]/20 hover:border-[#F5EFE7]/40 px-2.5 py-1 rounded-md font-mono text-[10px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
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
      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] font-mono text-[#F5EFE7]/70">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-[#B74B21]" />
          <span className="text-[10px] uppercase tracking-wider">
            Top Plane (XY)
          </span>
        </div>

        <div className="bg-[#0E2943]/80 border border-[#F5EFE7]/20 px-2.5 py-1 rounded-md text-[10px] tracking-wide text-[#F5EFE7] flex items-center gap-1.5 shadow-xs">
          <Rotate3d className="w-3 h-3 text-[#B74B21]" />
          <span>DRAG TO EXPLORE · CLICK TO EXTRUDE</span>
        </div>
      </div>
    </div>
  );
};
