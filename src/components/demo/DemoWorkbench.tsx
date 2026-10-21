import React, { useState, useEffect, useCallback } from 'react';
import { LESSON_STEPS } from '../../lib/lesson-data';
import { SimulatedCADCanvas } from './SimulatedCADCanvas';
import { LessonPanel } from './LessonPanel';
import { DEMO_VERIFICATION_DISCLAIMER } from '../../lib/constants';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

interface DemoWorkbenchProps {
  initialStepIndex?: number;
  isHeroPreview?: boolean;
}

export const DemoWorkbench: React.FC<DemoWorkbenchProps> = ({
  initialStepIndex = 2, // Step 3 (Rectangle) by default in hero preview as per spec
  isHeroPreview = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialStepIndex);
  // Requirement: initialize highlighting to false
  const [isHighlightingControl, setIsHighlightingControl] = useState<boolean>(false);
  // Requirement: explicit isDemoComplete state
  const [isDemoComplete, setIsDemoComplete] = useState<boolean>(false);

  const totalSteps = LESSON_STEPS.length;
  const currentStep = LESSON_STEPS[currentStepIndex];

  const handleNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setIsHighlightingControl(false);
      setIsDemoComplete(false);
    } else {
      setIsDemoComplete(true);
      setIsHighlightingControl(false);
    }
  }, [currentStepIndex, totalSteps]);

  const handlePrev = useCallback(() => {
    if (isDemoComplete) {
      setIsDemoComplete(false);
      setIsHighlightingControl(false);
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setIsHighlightingControl(false);
    }
  }, [currentStepIndex, isDemoComplete]);

  const handleFinishDemo = useCallback(() => {
    setIsDemoComplete(true);
    setIsHighlightingControl(false);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStepIndex(0);
    setIsHighlightingControl(false);
    setIsDemoComplete(false);
  }, []);

  const handleJumpToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
      setIsHighlightingControl(false);
      setIsDemoComplete(false);
    }
  }, [totalSteps]);

  const handleTriggerTool = useCallback((toolId: string) => {
    // Only advance when the user clicks the correct interactive control for the current step
    if (toolId === currentStep.activeToolId) {
      handleNext();
    }
  }, [currentStep.activeToolId, handleNext]);

  // Robust keyboard navigation meeting all safety requirements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger when modifier keys are held (Cmd, Ctrl, Alt)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Do not intercept if user is typing in text inputs, textareas, selects, or editable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        // Prevent unintended page scrolling when using arrow keys
        if (e.key === 'ArrowRight') e.preventDefault();
        if (isDemoComplete) return;

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
  }, [currentStepIndex, totalSteps, isDemoComplete, handleNext, handlePrev, handleFinishDemo, handleRestart]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Step Selector Pills Bar (Fast jumping between steps with zero lag) */}
      <div className="bg-white rounded-lg border border-[#D9DDD9] p-2 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="font-mono text-[11px] text-[#55616B] font-medium mr-1 uppercase hidden md:inline">
            Steps:
          </span>
          {LESSON_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIndex && !isDemoComplete;
            const isCompleted = idx < currentStepIndex || isDemoComplete;
            return (
              <button
                key={s.id}
                onClick={() => handleJumpToStep(idx)}
                className={`px-2.5 py-1 rounded-md font-mono text-[11px] transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#0E2943] text-white font-semibold shadow-xs'
                    : isCompleted
                    ? 'bg-[#FAF8F4] text-[#0E2943] font-medium hover:bg-[#F5EFE7] border border-[#D9DDD9]'
                    : 'bg-white text-[#55616B] hover:text-[#0E2943] hover:bg-[#FAF8F4] border border-[#D9DDD9]/60'
                }`}
              >
                <span>{String(s.stepNumber).padStart(2, '0')}</span>
                <span className="hidden xl:inline font-sans text-xs">{s.title}</span>
              </button>
            );
          })}

          {isDemoComplete && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Complete</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleRestart}
            className="text-[11px] font-mono text-[#55616B] hover:text-[#0E2943] flex items-center gap-1 px-2 py-1 rounded hover:bg-[#FAF8F4] border border-[#D9DDD9] transition-colors cursor-pointer"
            title="Reset walkthrough back to Step 1"
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
            isHighlightingControl={isHighlightingControl}
            isDemoComplete={isDemoComplete}
            onAdvanceStep={handleNext}
            onTriggerTool={handleTriggerTool}
          />
        </div>

        {/* Right Leqad Teaching Panel (col-span-4 on desktop) */}
        <div className="lg:col-span-4 h-full">
          <LessonPanel
            step={currentStep}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
            isDemoComplete={isDemoComplete}
            onNext={handleNext}
            onPrev={handlePrev}
            onRestart={handleRestart}
            onJumpToStep={handleJumpToStep}
            onFinishDemo={handleFinishDemo}
            isHighlightingControl={isHighlightingControl}
            onToggleHighlight={() => setIsHighlightingControl(!isHighlightingControl)}
            isCompact={isHeroPreview}
          />
        </div>
      </div>

      {/* Bottom Mandatory Disclaimer Notice */}
      <div className="flex items-center justify-between text-[11px] text-[#55616B] font-mono px-1">
        <span>{DEMO_VERIFICATION_DISCLAIMER}</span>
        <span className="hidden sm:inline text-[#55616B]/80">Use ← / → or N / P keys to navigate</span>
      </div>
    </div>
  );
};
