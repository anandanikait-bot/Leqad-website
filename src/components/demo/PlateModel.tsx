import { useEffect, useState } from 'react';
import { projectPlate, type PlateDimensions } from '../../lib/plate-geometry';
import type { ViewOrientation } from '../../types';

export function PlateModel({ dimensions, view, confirmed, labelSize = 14 }: {
  dimensions: PlateDimensions; view: ViewOrientation; confirmed: boolean; labelSize?: number;
}) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const finish = () => { if (motion.matches) { cancelAnimationFrame(frame); setProgress(1); } };
    if (motion.matches) setProgress(1);
    else {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 260);
        setProgress(1 - Math.pow(1 - t, 3));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }
    motion.addEventListener('change', finish);
    return () => { cancelAnimationFrame(frame); motion.removeEventListener('change', finish); };
  }, []);
  const points = projectPlate(dimensions, view, progress);
  const polygon = (indices: number[]) => indices.map(i => `${points[i].x},${points[i].y}`).join(' ');
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  return (
    <g data-testid={view === 'top' ? 'solid-top-view' : 'extruded-solid'} role="img"
      aria-label={view === 'top' ? 'Top view of rectangular plate' : confirmed ? 'Created 3D rectangular plate' : '3D extrusion preview'}>
      <g stroke="#F5EFE7" strokeWidth="1.1" strokeLinejoin="round">
        {view === 'iso' ? <>
          <polygon points={polygon([0, 1, 5, 4])} fill="#F5EFE7" fillOpacity=".25" vectorEffect="non-scaling-stroke" />
          <polygon points={polygon([0, 3, 7, 4])} fill="#F5EFE7" fillOpacity=".42" vectorEffect="non-scaling-stroke" />
          <polygon points={polygon([4, 5, 6, 7])} fill="#F5EFE7" fillOpacity={confirmed ? '.62' : '.5'} vectorEffect="non-scaling-stroke" />
          {!confirmed && <polygon points={polygon([0, 1, 2, 3])} fill="none" stroke="#B74B21" strokeDasharray="4 4" strokeOpacity=".65" />}
        </> : <polygon points={polygon(view === 'top' ? [4, 5, 6, 7] : view === 'front' ? [0, 1, 5, 4] : [0, 3, 7, 4])} fill="#F5EFE7" fillOpacity=".48" vectorEffect="non-scaling-stroke" />}
      </g>
      <g pointerEvents="none" fontFamily="IBM Plex Mono" fontSize={labelSize} fill="#F5EFE7" stroke="#0E2943" strokeWidth="3" paintOrder="stroke">
        <text x={(minX + maxX) / 2} y={minY - 22} textAnchor="middle">{dimensions.width} × {dimensions.height} mm</text>
        {view !== 'top' && <text x={(minX + maxX) / 2} y={maxY + 32} textAnchor="middle">{dimensions.depth} mm depth</text>}
      </g>
    </g>
  );
}
