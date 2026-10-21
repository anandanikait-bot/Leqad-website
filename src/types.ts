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
  geometryState: 'plane_selected' | 'oriented_normal' | 'rectangle_tool_active' | 'rectangle_drawn' | 'width_dimensioned' | 'height_dimensioned' | 'fully_constrained' | 'sketch_accepted';
}

export type ViewOrientation = 'iso' | 'top' | 'front' | 'right';
