import type { ViewOrientation } from '../types';

export interface PlateDimensions { width: number; height: number; depth: number }
export interface Point3 { x: number; y: number; z: number }
export interface Point2 { x: number; y: number }

export function plateVertices({ width: w, height: h, depth: d }: PlateDimensions): Point3[] {
  return [
    { x: 0, y: 0, z: 0 }, { x: w, y: 0, z: 0 }, { x: w, y: h, z: 0 }, { x: 0, y: h, z: 0 },
    { x: 0, y: 0, z: d }, { x: w, y: 0, z: d }, { x: w, y: h, z: d }, { x: 0, y: h, z: d },
  ];
}

// Same Euler rotation + perspective approach as the hero, in millimeters.
// One set of shared vertices joins the faces; Top uses exactly 3 SVG units/mm.
export function projectPlate(dimensions: PlateDimensions, view: ViewOrientation, progress = 1): Point2[] {
  const { width, height, depth } = dimensions;
  const t = Math.max(0, Math.min(1, progress));
  return plateVertices({ ...dimensions, depth: depth * (view === 'iso' ? t : 1) }).map(point => {
    if (view === 'top' || (view === 'iso' && t === 0)) return { x: point.x * 3, y: -point.y * 3 };
    if (view === 'front') return { x: point.x * 3, y: -point.z * 3 };
    if (view === 'right') return { x: point.y * 3, y: -point.z * 3 };
    const yaw = -.62 * t;
    const pitch = Math.PI / 2 + (.48 - Math.PI / 2) * t;
    const x = point.x - width / 2;
    const z = -(point.y - height / 2);
    const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
    const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);
    const y2 = point.z * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = point.z * Math.sin(pitch) + z1 * Math.cos(pitch);
    const perspective = 380 / (380 + z2 * t);
    return { x: width * 1.5 + x1 * 3 * perspective, y: -height * 1.5 - y2 * 3 * perspective };
  });
}
