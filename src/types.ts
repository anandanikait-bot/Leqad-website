export type PageRoute = 'home' | 'demo' | 'about' | 'partners';

export type DemoActionId =
  | 'select-top-plane'
  | 'start-sketch'
  | 'draw-rectangle'
  | 'apply-dimensions'
  | 'finish-sketch'
  | 'start-extrude'
  | 'confirm-extrude';

export type SketchDemoStatus =
  | 'not-started'
  | 'plane-selected'
  | 'sketch-active'
  | 'rectangle-drawn'
  | 'dimensioned'
  | 'accepted-in-demo'
  | 'extrude-preview'
  | 'solid-created';

export interface LessonStep {
  id: number;
  stepNumber: number;
  totalSteps: number;
  category: string;
  title: string;
  instruction: string;
  semanticActionId?: DemoActionId;
  activeToolId?: string;
  recommendedAction: string;
  hints: string[];
  whyExplanation: string;
  recognizedControlId: string;
  recognizedControlLabel: string;
  geometryState: 'overview' | 'plane_selected' | 'sketch_active' | 'rectangle_drawn' | 'dimensioned' | 'sketch_accepted' | 'extrude_preview' | 'solid_created';
}

export type ViewOrientation = 'iso' | 'top' | 'front' | 'right';

export interface DemoState {
  currentStepIndex: number;
  visitedStepIds: number[];
  completedDemoActionIds: string[];
  revealedHintsByStep: Record<number, number>;
  showWhyByStep: Record<number, boolean>;
  highlightedTargetId: string | null;
  isWalkthroughComplete: boolean;
  sketchStatus: SketchDemoStatus;
}
