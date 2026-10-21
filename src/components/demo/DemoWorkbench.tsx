import React, { useState, useEffect, useCallback } from 'react';
import { LESSON_STEPS } from '../../lib/lesson-data';
import { SimulatedCADCanvas } from './SimulatedCADCanvas';
import { LessonPanel } from './LessonPanel';
import { DEMO_VERIFICATION_DISCLAIMER } from '../../lib/constants';
import { RotateCcw, CheckCircle2, Check, Eye } from 'lucide-react';
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
  }, [currentStepIndex, handleNext]);

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
      {/* Step Selector Pills Bar (Fix #2: Accurately distinguishing visited vs completed) */}
      <div className="bg-white rounded-lg border border-[#D9DDD9] p-2 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="font-mono text-[11px] text-[#55616B] font-medium mr-1 uppercase hidden md:inline">
            Steps:
          </span>
          {LESSON_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIndex && !isWalkthroughComplete;
            const isActionDone = s.semanticActionId
              ? completedDemoActionIds.includes(s.semanticActionId)
              : false;
            const isVisited = visitedStepIds.includes(s.id);

            return (
              <button
                key={s.id}
                onClick={() => handleJumpToStep(idx)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0E2943] text-white font-semibold shadow-xs'
                    : isActionDone
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-medium'
                    : isVisited
                    ? 'bg-[#FAF8F4] text-[#0E2943] font-normal border border-[#D9DDD9]'
                    : 'bg-white text-[#55616B] hover:text-[#0E2943] hover:bg-[#FAF8F4] border border-[#D9DDD9]/50'
                }`}
                title={`Step ${s.stepNumber}: ${s.title}${isActionDone ? ' · Demo Action Done' : isVisited ? ' · Viewed' : ''}`}
                aria-label={`Jump to Step ${s.stepNumber}: ${s.title}`}
              >
                {isActionDone ? (
                  <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                ) : (
                  <span>{String(s.stepNumber).padStart(2, '0')}</span>
                )}
                <span className="hidden xl:inline font-sans text-xs">{s.title}</span>
                {isVisited && !isActionDone && !isActive && (
                  <span className="hidden 2xl:inline text-[9px] text-[#55616B] uppercase font-mono">(Viewed)</span>
                )}
              </button>
            );
          })}

          {isWalkthroughComplete && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Walkthrough Complete</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleRestart}
            className="text-[11px] font-mono text-[#55616B] hover:text-[#0E2943] flex items-center gap-1 px-2 py-1 rounded hover:bg-[#FAF8F4] border border-[#D9DDD9] transition-colors cursor-pointer"
            title="Reset walkthrough back to Step 1"
            aria-label="Restart walkthrough"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main CAD + Teaching Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left/Main CAD Workspace Canvas (col-span-8 on desktop) */}
        <div className="lg:col-span-8 h-full">
          <SimulatedCADCanvas
            step={currentStep}
            currentStepIndex={currentStepIndex}
            sketchStatus={sketchStatus}
            highlightedTargetId={highlightedTargetId}
            isDemoComplete={isWalkthroughComplete}
            onAdvanceStep={handleNext}
            onTriggerAction={handleTriggerAction}
            onResetSketch={handleResetSketch}
          />
        </div>

        {/* Right Leqad Teaching Panel (col-span-4 on desktop) */}
        <div className="lg:col-span-4 h-full">
          <LessonPanel
            step={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            completedDemoActionIds={completedDemoActionIds}
            visitedStepIds={visitedStepIds}
            isDemoComplete={isWalkthroughComplete}
            onNext={handleNext}
            onPrev={handlePrev}
            onRestart={handleRestart}
            onJumpToStep={handleJumpToStep}
            onFinishDemo={handleFinishDemo}
            isHighlightingControl={highlightedTargetId !== null}
            onToggleHighlight={handleToggleHighlight}
            isCompact={isHeroPreview}
            resetKey={resetKey}
          />
        </div>
      </div>

      {/* Bottom Mandatory Disclaimer Notice */}
      <div className="flex items-center justify-between text-[11px] text-[#55616B] font-mono px-1">
        <span>{DEMO_VERIFICATION_DISCLAIMER}</span>
        {enableKeyboardShortcuts && (
          <span className="hidden sm:inline text-[#55616B]/80">Use ← / → or N / P keys to navigate</span>
        )}
      </div>
    </div>
  );
};
