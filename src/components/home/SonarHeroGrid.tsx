import React, { useEffect, useRef } from 'react';

export const SonarHeroGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = 0;
    let height = 0;
    let isAnimating = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const startTime = performance.now();
    const duration = 2800; // Single subtle introductory wave (2.8s)

    const drawGrid = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Origin of subtle sonar wave: upper-right quadrant
      const originX = width * 0.72;
      const originY = height * 0.45;
      const maxRadius = Math.hypot(width, height) * 0.65;
      const currentWaveRadius = prefersReducedMotion ? -1 : progress * maxRadius;

      const spacing = 28;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      // Base navy color components: #0E2943 -> [14, 41, 67]
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;

          let opacity = 0.09; // Baseline resting opacity per spec (0.08–0.12)
          let dotRadius = 1.25;

          if (!prefersReducedMotion && elapsed < duration) {
            const dist = Math.hypot(x - originX, y - originY);
            const distToWave = Math.abs(dist - currentWaveRadius);
            if (distToWave < 60) {
              const pulse = (1 - distToWave / 60) * (1 - progress);
              opacity += pulse * 0.14;
              dotRadius += pulse * 0.6;
            }
          }

          ctx.fillStyle = `rgba(14, 41, 67, ${opacity.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw 2 faint static technical datum circles
      ctx.strokeStyle = 'rgba(14, 41, 67, 0.04)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(originX, originY, 140, 0, Math.PI * 2);
      ctx.arc(originX, originY, 260, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Continue animating only during the single intro wave, then settle to save CPU
      if (!prefersReducedMotion && elapsed < duration) {
        animId = requestAnimationFrame(drawGrid);
      } else {
        isAnimating = false;
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // If animation already settled or reduced motion is active, redraw the static state immediately
      if (!isAnimating || prefersReducedMotion) {
        drawGrid(startTime + duration + 1);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (!prefersReducedMotion) {
      animId = requestAnimationFrame(drawGrid);
    } else {
      isAnimating = false;
      drawGrid(startTime + duration + 1);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
      {/* Soft gradient fade so the grid seamlessly dissolves at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FAF8F4]" />
    </div>
  );
};
