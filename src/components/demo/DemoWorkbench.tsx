import React, { useState, useEffect, useCallback } from 'react';
import { LESSON_STEPS } from '../../lib/lesson-data';
import { SimulatedCADCanvas } from './SimulatedCADCanvas';
import { LessonPanel } from './LessonPanel';
import { RotateCcw, CheckCircle2, Check, List } from 'lucide-react';
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

  const totalSteps = LESSON_STEPS.length;
  const currentStep = LESSON_STEPS[currentStepIndex];

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
    setIsWalkthroughComplete(true);
    setHighlightedTargetId(null);
  }, []);

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

  // Execute explicit simulated actions (Fix #2, Fix #3, Fix #4)
  const handleTriggerAction = useCallback((actionId: string) => {
    // A toolbar press for another step must not silently change sketch state.
    if (currentStep.semanticActionId !== actionId) return;
    setCompletedDemoActionIds((prev) => (prev.includes(actionId) ? prev : [...prev, actionId]));

    if (actionId === 'select-top-plane') {
      setSketchStatus('plane-selected');
      if (currentStepIndex === 1) handleNext();
    } else if (actionId === 'start-sketch') {
      setSketchStatus('sketch-active');
      if (currentStepIndex === 2) handleNext();
    } else if (actionId === 'draw-rectangle') {
      setSketchStatus('rectangle-drawn');
      if (currentStepIndex === 3) handleNext();
    } else if (actionId === 'apply-dimensions') {
      setSketchStatus('dimensioned');
      if (currentStepIndex === 4) handleNext();
    } else if (actionId === 'finish-sketch') {
      setSketchStatus('accepted-in-demo');
      if (currentStepIndex === 5) handleNext();
    } else if (actionId === 'understand-result') {
      if (currentStepIndex === 6) handleNext();
    }
  }, [currentStepIndex, currentStep.semanticActionId, handleNext]);

  // Reset sketch from modal cancel
  const handleResetSketch = useCallback(() => {
    setSketchStatus('plane-selected');
    setCurrentStepIndex(2); // Return to Start Sketch
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

        if (currentStepIndex === totalSteps - 1) {
          handleFinishDemo();
        } else {
          handleNext();
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
  }, [enableKeyboardShortcuts, currentStepIndex, totalSteps, isWalkthroughComplete, handleNext, handlePrev, handleFinishDemo, handleRestart]);

  return (
    <div className="w-full flex flex-col gap-3">
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
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-[#D9DDD9] bg-white text-[#55616B] hover:bg-[#FAF8F4]'
                }`}
              >
                {completed ? <Check className="h-3 w-3" /> : <span>{index + 1}</span>}
                <span>{step.title}</span>
              </button>
            );
          })}
          {isWalkthroughComplete && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Walkthrough complete</span>}
        </nav>
      )}

      {/* Main CAD + Teaching Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left/Main CAD Workspace Canvas (col-span-8 on desktop) */}
        <div className="order-2 h-full min-w-0 lg:order-1 lg:col-span-8">
          <SimulatedCADCanvas
            step={currentStep}
            currentStepIndex={currentStepIndex}
            sketchStatus={sketchStatus}
            highlightedTargetId={highlightedTargetId}
            isDemoComplete={isWalkthroughComplete}
            onTriggerAction={handleTriggerAction}
            onResetSketch={handleResetSketch}
          />
        </div>

        {/* Right Leqad Teaching Panel (col-span-4 on desktop) */}
        <div className="order-1 h-full min-w-0 lg:order-2 lg:col-span-4">
          <LessonPanel
            step={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
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
          />
        </div>
      </div>

    </div>
  );
};
