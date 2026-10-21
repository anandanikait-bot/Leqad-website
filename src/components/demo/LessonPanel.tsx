import React, { useState } from 'react';
import { LessonStep } from '../../types';
import { 
  HelpCircle, 
  Eye, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  Info, 
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { Button } from '../shared/Button';

interface LessonPanelProps {
  step: LessonStep;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  onJumpToStep: (index: number) => void;
  isHighlightingControl: boolean;
  onToggleHighlight: () => void;
  isCompact?: boolean;
}

export const LessonPanel: React.FC<LessonPanelProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrev,
  onRestart,
  onJumpToStep,
  isHighlightingControl,
  onToggleHighlight,
  isCompact = false,
}) => {
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [showWhy, setShowWhy] = useState<boolean>(false);

  // Reset local hint state when step changes
  React.useEffect(() => {
    setRevealedHints(0);
    setShowWhy(false);
  }, [step.id]);

  const handleRevealNextHint = () => {
    if (revealedHints < step.hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  return (
    <div className="bg-white rounded-xl border border-[#D9DDD9] shadow-md flex flex-col overflow-hidden text-[#0E2943] transition-all">
      {/* Panel Window Header */}
      <div className="bg-[#0E2943] text-white px-4 py-3 flex items-center justify-between border-b border-[#0E2943]/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B74B21] animate-pulse" />
          <span className="font-mono text-[11px] font-medium tracking-wider uppercase text-[#F5EFE7]">
            Leqad Teaching Panel
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] bg-white/10 text-white/90 px-2 py-0.5 rounded-xs">
            STEP {String(step.stepNumber).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="bg-[#F5EFE7] px-4 py-2 border-b border-[#D9DDD9]/70 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 flex-1">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const isDone = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            return (
              <button
                key={i}
                onClick={() => onJumpToStep(i)}
                className={`h-1.5 rounded-full transition-all flex-1 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#B74B21] ring-2 ring-[#B74B21]/30'
                    : isDone
                    ? 'bg-[#0E2943]'
                    : 'bg-[#D9DDD9]'
                }`}
                title={`Step ${i + 1}`}
                aria-label={`Jump to Step ${i + 1}`}
              />
            );
          })}
        </div>
        <button
          onClick={onRestart}
          className="text-[#55616B] hover:text-[#0E2943] text-xs p-1 ml-2 transition-colors cursor-pointer"
          title="Restart lesson"
          aria-label="Restart lesson"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Panel Body Content */}
      <div className={`p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4 ${isCompact ? 'text-xs' : 'text-sm'}`}>
        <div className="space-y-3">
          {/* Category Eyebrow */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#55616B]">
              {step.category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0E2943] font-medium bg-[#F5EFE7] px-2 py-0.5 rounded-xs">
              <Layers className="w-3 h-3 text-[#B74B21]" />
              In-Workflow Guide
            </span>
          </div>

          {/* Step Title */}
          <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight leading-snug">
            {step.title}
          </h3>

          {/* Main Instruction */}
          <p className="text-[#55616B] leading-relaxed text-[13px] sm:text-sm">
            {step.instruction}
          </p>

          {/* Recognized Control Indicator */}
          <div className="bg-[#F5EFE7]/80 rounded-lg p-2.5 border border-[#D9DDD9] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-[#0E2943] text-white flex items-center justify-center flex-shrink-0 text-xs font-mono">
                ⌘
              </div>
              <div className="truncate">
                <div className="text-[10px] font-mono uppercase text-[#55616B]">Recognized Tool</div>
                <div className="text-xs font-semibold text-[#0E2943] truncate">
                  {step.recognizedControlLabel}
                </div>
              </div>
            </div>

            <button
              onClick={onToggleHighlight}
              className={`text-xs px-2.5 py-1 rounded-md font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                isHighlightingControl
                  ? 'bg-[#B74B21] text-white border-[#B74B21] shadow-xs'
                  : 'bg-white text-[#0E2943] border-[#D9DDD9] hover:border-[#0E2943]/40'
              }`}
              title="Highlight this tool on the CAD toolbar"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isHighlightingControl ? 'Highlighted' : 'Show me'}</span>
            </button>
          </div>

          {/* Progressive Hints Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <button
                onClick={handleRevealNextHint}
                disabled={revealedHints >= step.hints.length}
                className="text-xs font-medium inline-flex items-center gap-1 text-[#0E2943] hover:text-[#B74B21] disabled:text-[#55616B]/60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#B74B21]" />
                <span>
                  {revealedHints === 0
                    ? 'Get a hint'
                    : revealedHints < step.hints.length
                    ? `Next hint (${revealedHints}/${step.hints.length})`
                    : 'All hints revealed'}
                </span>
              </button>

              <button
                onClick={() => setShowWhy(!showWhy)}
                className={`text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer ${
                  showWhy ? 'text-[#B74B21]' : 'text-[#55616B] hover:text-[#0E2943]'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Why?</span>
              </button>
            </div>

            {/* Revealed Hints Box */}
            {revealedHints > 0 && (
              <div className="space-y-1.5 animate-fadeIn">
                {step.hints.slice(0, revealedHints).map((hintText, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8F4] border-l-2 border-[#B74B21] pl-3 pr-2 py-1.5 text-xs text-[#0E2943] leading-relaxed rounded-r-md"
                  >
                    <span className="font-mono text-[10px] text-[#B74B21] font-semibold mr-1.5">
                      HINT {idx + 1}:
                    </span>
                    {hintText}
                  </div>
                ))}
              </div>
            )}

            {/* Why Explanation Box */}
            {showWhy && (
              <div className="bg-[#EDF1F3] border border-[#0E2943]/20 rounded-md p-2.5 text-xs text-[#0E2943] space-y-1 animate-fadeIn">
                <div className="font-mono text-[10px] uppercase text-[#0E2943] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#B74B21]" />
                  Engineering Concept
                </div>
                <p className="text-[#55616B] leading-relaxed">
                  {step.whyExplanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Conservative Feedback */}
        <div className="space-y-3 pt-3 border-t border-[#D9DDD9]">
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={isFirstStep}
              onClick={onPrev}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              Previous
            </Button>

            <Button
              variant={isLastStep ? 'rust' : 'primary'}
              size="sm"
              onClick={onNext}
              icon={isLastStep ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            >
              {isLastStep ? 'Finish demo' : 'Next step'}
            </Button>
          </div>

          {/* Conservative verification notice per specification */}
          <div className="flex items-start gap-1.5 text-[10px] text-[#55616B] bg-[#F5EFE7]/60 p-2 rounded-md border border-[#D9DDD9]/60">
            <Info className="w-3 h-3 text-[#55616B] flex-shrink-0 mt-0.5" />
            <span>
              Demo step completed. This illustration does not inspect a real CAD model.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
