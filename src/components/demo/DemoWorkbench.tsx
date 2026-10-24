import React, { useState, useEffect, useCallback } from 'react';
import { LESSON_STEPS } from '../../lib/lesson-data';
import { SimulatedCADCanvas } from './SimulatedCADCanvas';
import { LessonPanel } from './LessonPanel';
import { CheckCircle2, Check } from 'lucide-react';
import { SketchDemoStatus } from '../../types';

interface DemoWorkbenchProps {
  initialStepIndex?: number;
  isHeroPreview?: boolean;
  enableKeyboardShortcuts?: boolean;
}

export const DemoWorkbench: React.FC<DemoWorkbenchProps> = ({
  initialStepIndex = 0,
  isHeroPreview = false,
  enableKeyboardShortcuts = false,
}) => {
  // Centralized Demo State Model (Fix #2, Fix #8)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStepIndex);
  const [visitedStepIds, setVisitedStepIds] = useState<number[]>([initialStepIndex + 1]);
  const [completedDemoActionIds, setCompletedDemoActionIds] = useState<string[]>([]);
  const [highlightedTargetId, setHighlightedTargetId] = useState<string | null>(null);
  const [isWalkthroughComplete, setIsWalkthroughComplete] = useState<boolean>(false);
  const [sketchStatus, setSketchStatus] = useState<SketchDemoStatus>(
    initialStepIndex >= 2 ? 'plane-selected' : 'not-started'
  );
  const [resetKey, setResetKey] = useState<number>(0);
  const [showAllSteps, setShowAllSteps] = useState(false);
  const [widthMm, setWidthMm] = useState(40);
  const [heightMm, setHeightMm] = useState(30);
  const [depthMm, setDepthMm] = useState(10);
  const [dimensionValidity, setDimensionValidity] = useState({ width: true, height: true });
  const [depthValid, setDepthValid] = useState(true);

  const totalSteps = LESSON_STEPS.length;
  const currentStep = LESSON_STEPS[currentStepIndex];

  // Each instruction is a real transition in this local demonstration.
  // Navigating to a later step never creates geometry on its own.
  const actionPrerequisites: Record<string, SketchDemoStatus> = {
    'select-top-plane': 'not-started',
    'start-sketch': 'plane-selected',
    'draw-rectangle': 'sketch-active',
    'apply-dimensions': 'rectangle-drawn',
    'finish-sketch': 'dimensioned',
    'start-extrude': 'accepted-in-demo',
    'confirm-extrude': 'extrude-preview',
  };
  const isStepActionCompleted = Boolean(currentStep.semanticActionId && completedDemoActionIds.includes(currentStep.semanticActionId));
  const canPerformCurrentAction = (!currentStep.semanticActionId || isStepActionCompleted ||
    sketchStatus === actionPrerequisites[currentStep.semanticActionId]) &&
    (currentStepIndex !== 4 || (dimensionValidity.width && dimensionValidity.height)) &&
    (currentStepIndex !== 7 || depthValid);

  // Helper to mark a step visited
  const markStepVisited = useCallback((stepId: number) => {
    setVisitedStepIds((prev) => (prev.includes(stepId) ? prev : [...prev, stepId]));
  }, []);

  const handleNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      markStepVisited(LESSON_STEPS[nextIndex].id);
      setHighlightedTargetId(null);
      setIsWalkthroughComplete(false);
    } else {
      setIsWalkthroughComplete(true);
      setHighlightedTargetId(null);
    }
  }, [currentStepIndex, totalSteps, markStepVisited]);

  const handlePrev = useCallback(() => {
    if (isWalkthroughComplete) {
      setIsWalkthroughComplete(false);
      setHighlightedTargetId(null);
      return;
    }
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      markStepVisited(LESSON_STEPS[prevIndex].id);
      setHighlightedTargetId(null);
    }
  }, [currentStepIndex, isWalkthroughComplete, markStepVisited]);

  const handleFinishDemo = useCallback(() => {
    // A visit or keyboard shortcut alone is not evidence of a completed model.
    if (sketchStatus !== 'solid-created') return;
    setIsWalkthroughComplete(true);
    setHighlightedTargetId(null);
  }, [sketchStatus]);

  // Complete Reset: Restores fresh initial state everywhere (Fix #8)
  const handleRestart = useCallback(() => {
    setCurrentStepIndex(0);
    setVisitedStepIds([1]);
    setCompletedDemoActionIds([]);
    setHighlightedTargetId(null);
    setIsWalkthroughComplete(false);
    setSketchStatus('not-started');
    setResetKey((prev) => prev + 1);
    setShowAllSteps(false);
    setWidthMm(40);
    setHeightMm(30);
    setDepthMm(10);
    setDepthValid(true);
    setDimensionValidity({ width: true, height: true });
  }, []);

  // Jumping between steps (Fix #2: Exploring steps does NOT falsely complete them!)
  const handleJumpToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
      markStepVisited(LESSON_STEPS[index].id);
      setHighlightedTargetId(null);
      setIsWalkthroughComplete(false);
    }
  }, [totalSteps, markStepVisited]);

  // Apply exactly one modeled action to the currently selected lesson.
  // The prerequisite check prevents deep-linked steps or skipped UI from
  // manufacturing sketch geometry or a part.
  const handleTriggerAction = useCallback((actionId: string) => {
    if (currentStep.semanticActionId !== actionId) return;
    if (actionId === 'apply-dimensions' && (!dimensionValidity.width || !dimensionValidity.height)) return;
    if (actionId === 'confirm-extrude' && !depthValid) return;
    if (completedDemoActionIds.includes(actionId)) {
      if (currentStepIndex < totalSteps - 1) handleNext();
      return;
    }
    const expectedStatus = actionPrerequisites[actionId];
    if (!expectedStatus || sketchStatus !== expectedStatus) return;

    const nextStatus: Record<string, SketchDemoStatus> = {
      'select-top-plane': 'plane-selected',
      'start-sketch': 'sketch-active',
      'draw-rectangle': 'rectangle-drawn',
      'apply-dimensions': 'dimensioned',
      'finish-sketch': 'accepted-in-demo',
      'start-extrude': 'extrude-preview',
      'confirm-extrude': 'solid-created',
    };
    setSketchStatus(nextStatus[actionId]);
    setCompletedDemoActionIds(prev => [...prev, actionId]);
    setHighlightedTargetId(null);
    if (actionId === 'confirm-extrude') {
      setIsWalkthroughComplete(true);
    } else if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      markStepVisited(LESSON_STEPS[nextIndex].id);
    }
  }, [currentStepIndex, currentStep.semanticActionId, completedDemoActionIds,
      sketchStatus, handleNext, markStepVisited, totalSteps, dimensionValidity, depthValid]);

  const handleResetSketch = useCallback(() => {
    setSketchStatus('plane-selected');
    setCompletedDemoActionIds(['select-top-plane']);
    setHighlightedTargetId(null);
    setIsWalkthroughComplete(false);
    setCurrentStepIndex(2);
    markStepVisited(3);
    setWidthMm(40); setHeightMm(30); setDepthMm(10);
    setDepthValid(true); setDimensionValidity({ width: true, height: true });
  }, [markStepVisited]);

  const handleCancelExtrude = useCallback(() => {
    setSketchStatus('accepted-in-demo');
    setCompletedDemoActionIds(prev => prev.filter(id => id !== 'start-extrude' && id !== 'confirm-extrude'));
    setHighlightedTargetId(null);
    setIsWalkthroughComplete(false);
    setCurrentStepIndex(6);
    setDepthMm(10);
    setDepthValid(true);
  }, []);

  // Tool Highlighting toggle (Fix #9)
  const handleToggleHighlight = useCallback(() => {
    const targetTool = currentStep.activeToolId;
    if (!targetTool) return;

    const targetMap: Record<string, string> = {
      'select-top-plane': 'tool-top-plane',
      'sketch': 'tool-sketch',
      'rectangle': 'tool-rectangle',
      'dimension': 'tool-dimension',
      'accept-sketch': 'tool-accept-sketch',
      'extrude': 'tool-extrude',
      'accept-extrude': 'tool-accept-extrude',
    };

    const targetId = targetMap[targetTool] || targetTool;

    setHighlightedTargetId((prev) => (prev === targetId ? null : targetId));
  }, [currentStep.activeToolId]);

  // Keyboard navigation strictly scoped (Fix #10: Disabled on homepage preview!)
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger when modifier keys are held (Cmd, Ctrl, Alt)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Do not intercept if user is typing in form controls
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        if (e.key === 'ArrowRight') e.preventDefault();
        if (isWalkthroughComplete) return;

        // Keyboard navigation can review completed steps, but must not
        // skip over a required CAD operation.
        if (currentStepIndex === 0 || isStepActionCompleted) {
          if (currentStepIndex === totalSteps - 1) handleFinishDemo();
          else handleNext();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        if (e.key === 'ArrowLeft') e.preventDefault();
        handlePrev();
      } else if (e.key === 'r' || e.key === 'R') {
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardShortcuts, currentStepIndex, totalSteps, isWalkthroughComplete, handleNext, handlePrev, handleFinishDemo, handleRestart, isStepActionCompleted]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {showAllSteps && (
        <nav id="leqad-all-steps" aria-label="Walkthrough steps" className="flex flex-wrap gap-2 rounded-lg border border-[#D9DDD9] bg-white p-3">
          {LESSON_STEPS.map((step, index) => {
            const completed = Boolean(step.semanticActionId && completedDemoActionIds.includes(step.semanticActionId));
            const active = currentStepIndex === index && !isWalkthroughComplete;
            return (
              <button
                type="button"
                key={step.id}
                onClick={() => handleJumpToStep(index)}
                aria-current={active ? 'step' : undefined}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-[#0E2943] bg-[#0E2943] text-white'
                    : completed
                      ? 'border-[#D9DDD9] bg-[#F5EFE7] text-[#0E2943]'
                      : 'border-[#D9DDD9] bg-white text-[#55616B] hover:bg-[#FAF8F4]'
                }`}
              >
                {completed ? <Check className="h-3 w-3" /> : <span>{index + 1}</span>}
                <span>{step.title}</span>
              </button>
            );
          })}
          {isWalkthroughComplete && <span className="inline-flex items-center gap-1.5 text-xs text-[#793327]"><CheckCircle2 className="h-4 w-4" /> Walkthrough complete</span>}
        </nav>
      )}

      {/* Main CAD + Teaching Panel Layout */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(320px,35%)] 2xl:grid-cols-[minmax(0,1fr)_minmax(360px,430px)]">
        {/* Left/Main CAD Workspace Canvas (col-span-8 on desktop) */}
        <div className="order-2 h-full min-w-0 lg:order-1">
          <SimulatedCADCanvas
            key={resetKey}
            step={currentStep}
            currentStepIndex={currentStepIndex}
            sketchStatus={sketchStatus}
            widthMm={widthMm}
            heightMm={heightMm}
            extrudeDepthMm={depthMm}
            onDepthChange={setDepthMm}
            onDepthValidityChange={setDepthValid}
            onDrawRectangle={(width, height) => {
              if (currentStepIndex !== 3 || sketchStatus !== 'sketch-active') return;
              setWidthMm(width); setHeightMm(height);
              handleTriggerAction('draw-rectangle');
            }}
            actionAllowed={canPerformCurrentAction}
            highlightedTargetId={highlightedTargetId}
            isDemoComplete={isWalkthroughComplete}
            onTriggerAction={handleTriggerAction}
            onResetSketch={handleResetSketch}
            onCancelExtrude={handleCancelExtrude}
          />
        </div>

        {/* Right Leqad Teaching Panel (col-span-4 on desktop) */}
        <div className="order-1 min-w-0 lg:order-2 lg:h-full">
          <LessonPanel
            step={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            widthMm={widthMm}
            heightMm={heightMm}
            canEditDimensions={sketchStatus === 'rectangle-drawn'}
            onDimensionValidityChange={(axis, valid) => setDimensionValidity(previous => ({ ...previous, [axis]: valid }))}
            onDimensionsChange={(width, height) => {
              if (sketchStatus !== 'rectangle-drawn') return;
              setWidthMm(width);
              setHeightMm(height);
            }}
            isDemoComplete={isWalkthroughComplete}
            onNext={handleNext}
            onPrev={handlePrev}
            onRestart={handleRestart}
            onFinishDemo={handleFinishDemo}
            onSimulateAction={handleTriggerAction}
            isHighlightingControl={highlightedTargetId !== null}
            onToggleHighlight={handleToggleHighlight}
            isCompact={isHeroPreview}
            resetKey={resetKey}
            showAllSteps={showAllSteps}
            onToggleSteps={() => setShowAllSteps(value => !value)}
            isStepActionCompleted={isStepActionCompleted}
            canPerformCurrentAction={canPerformCurrentAction}
          />
        </div>
      </div>

    </div>
  );
};
