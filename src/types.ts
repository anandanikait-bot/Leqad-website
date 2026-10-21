export type PageRoute = 'home' | 'demo' | 'partners';

export interface LessonStep {
  id: number;
  stepNumber: number;
  totalSteps: number;
  category: string;
  title: string;
  instruction: string;
  activeToolId?: string;
  recommendedAction: string;
  hints: string[];
  whyExplanation: string;
  recognizedControlId: string;
  recognizedControlLabel: string;
  isComplete: boolean;
  geometryState: 'empty' | 'plane_selected' | 'oriented_normal' | 'rectangle_drawn' | 'rectangle_dimensioned' | 'circle_added' | 'hole_dimensioned' | 'fully_constrained' | 'sketch_accepted';
}

export type ViewOrientation = 'iso' | 'top' | 'front' | 'right';
