import React, { useState, useEffect } from 'react';
import { LessonStep } from '../../types';
import { 
  HelpCircle, 
  Eye, 
  EyeOff,
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  Info, 
  Sparkles,
  Award
} from 'lucide-react';
import { Button } from '../shared/Button';

interface LessonPanelProps {
  step: LessonStep;
  currentStepIndex: number;
  totalSteps: number;
  isDemoComplete?: boolean;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  onFinishDemo: () => void;
  onSimulateAction: (actionId: string) => void;
  isHighlightingControl: boolean;
  onToggleHighlight: () => void;
  isCompact?: boolean;
  resetKey: number;
  showAllSteps: boolean;
  onToggleSteps: () => void;
  isStepActionCompleted: boolean;
  canPerformCurrentAction: boolean;
  widthMm: number;
  heightMm: number;
  onDimensionsChange: (width: number, height: number) => void;
}

export const LessonPanel: React.FC<LessonPanelProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  isDemoComplete = false,
  onNext,
  onPrev,
  onRestart,
  onFinishDemo,
  onSimulateAction,
  isHighlightingControl,
  onToggleHighlight,
  isCompact = false,
  resetKey,
  showAllSteps,
  onToggleSteps,
  isStepActionCompleted,
  canPerformCurrentAction,
  widthMm,
  heightMm,
  onDimensionsChange,
}) => {
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showWhy, setShowWhy] = useState<boolean>(false);

  // Reset hints whenever step changes, demo completes, or explicit resetKey changes (Fix #8)
  useEffect(() => {
    setHelpOpen(false);
    setRevealedHints(0);
    setShowWhy(false);
  }, [step.id, isDemoComplete, resetKey]);

  const handleRevealNextHint = () => {
    if (revealedHints < step.hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  const primaryActionLabel: Record<number, string> = {
    1: 'Start walkthrough',
    2: 'Select Top Plane',
    3: 'Start sketch',
    4: 'Draw rectangle',
    5: `Set ${widthMm} × ${heightMm} mm dimensions`,
    6: 'Finish sketch',
    7: 'Start Extrude',
    8: 'Create solid',
  };
  const handlePrimaryAction = () => {
    if (isFirstStep) onNext();
    else if (isStepActionCompleted) {
      if (isLastStep) onFinishDemo();
      else onNext();
    }
    else if (step.semanticActionId) onSimulateAction(step.semanticActionId);
    else onNext();
  };

  // Render Completed Walkthrough View (Fix #7)
  if (isDemoComplete) {
    return (
      <div className="bg-white rounded-xl border border-[#D9DDD9] shadow-md flex flex-col overflow-hidden text-[#0E2943] animate-fadeIn">
        {/* Panel Window Header */}
        <div className="bg-[#0E2943] text-white px-4 py-3 flex items-center justify-between border-b border-[#0E2943]/30">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-[11px] font-medium tracking-wider uppercase text-[#F5EFE7]">
              Walkthrough Complete
            </span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-xs border border-emerald-400/30">
            8 / 8 STEPS
          </span>
        </div>

        {/* Completion Body Content */}
        <div className="p-5 sm:p-6 space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#B74B21] font-semibold">
                Interactive Walkthrough
              </span>
              <h2 className="text-xl font-bold text-[#0E2943] tracking-tight leading-snug">
                You've completed the interactive walkthrough.
              </h2>
              <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
                You've built a dimensioned {widthMm} × {heightMm} mm sketch and created a solid plate using Extrude in this guided simulation.
              </p>
            </div>

            {/* Checklist of concepts covered (Fix #7: Honest claims) */}
            <div className="p-3 bg-[#FAF8F4] rounded-lg border border-[#D9DDD9] space-y-1.5 text-xs font-mono">
              <div className="text-[10px] font-bold uppercase text-[#0E2943]">
                Concepts Covered
              </div>
              <ul className="space-y-1 text-[#55616B]">
                <li className="flex items-center gap-1.5 text-[#0E2943]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Top Plane (XY) reference datum selection</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#0E2943]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Entering 2D sketch-editing mode</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#0E2943]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Corner Rectangle anchored to Origin (0,0)</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#0E2943]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Parametric dimensioning ({widthMm} mm × {heightMm} mm)</span>
                </li>
                <li className="flex items-center gap-1.5 text-[#0E2943]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Solid extrusion preview and confirmed 3D plate</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-[#D9DDD9]">
            <Button
              variant="rust"
              size="md"
              className="w-full justify-center"
              onClick={onRestart}
              icon={<RotateCcw className="w-4 h-4" />}
              iconPosition="left"
            >
              Restart walkthrough
            </Button>

            {/* Conservative clarification */}
            <div className="flex items-start gap-1.5 text-[10px] text-[#55616B] bg-[#F5EFE7]/60 p-2.5 rounded-md border border-[#D9DDD9]/60 leading-relaxed font-mono">
              <Info className="w-3.5 h-3.5 text-[#55616B] flex-shrink-0 mt-0.5" />
              <span>
                This interactive illustration is not connected to a live CAD model and does not verify actual design work.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#D9DDD9] shadow-md flex flex-col overflow-hidden text-[#0E2943] transition-all">
      {/* Panel Window Header */}
      <div className="bg-[#0E2943] text-white px-4 py-3 flex items-center justify-between border-b border-[#0E2943]/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B74B21]" />
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

      {/* Panel Body Content */}
      <div className={`p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4 ${isCompact ? 'text-xs' : 'text-sm'}`}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#55616B]">
            <button type="button" onClick={onToggleSteps} aria-expanded={showAllSteps} aria-controls="leqad-all-steps" className="underline underline-offset-4">{showAllSteps ? 'Hide steps' : 'All steps'}</button>
            <button type="button" onClick={onRestart} className="inline-flex items-center gap-1 hover:text-[#0E2943]"><RotateCcw className="h-3 w-3" />Restart</button>
          </div>
          {/* Category Eyebrow */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#55616B]">
              {step.category}
            </span>
            <span className="text-xs text-[#55616B]">{step.stepNumber} / {totalSteps}</span>
          </div>

          {/* Step Title */}
          <h2 className="text-lg font-semibold text-[#0E2943] tracking-tight leading-snug">
            {step.title}
          </h2>

          {/* Main Instruction */}
          <p className="text-[#55616B] leading-relaxed text-[13px] sm:text-sm">
            {step.instruction.replace('40 mm × 30 mm', `${widthMm} mm × ${heightMm} mm`).replace('40 × 30 mm', `${widthMm} × ${heightMm} mm`)}
          </p>

          {/* One clear primary action; extra help stays secondary. */}
          <div className="space-y-3 rounded-xl border border-[#B74B21]/25 bg-[#FAF8F4] p-3.5 sm:p-4">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#B74B21]">Do this next</p>
              <p className="text-sm font-medium leading-relaxed text-[#0E2943]">{step.recommendedAction.replace('40 mm × 30 mm', `${widthMm} mm × ${heightMm} mm`).replace('40 × 30 mm', `${widthMm} × ${heightMm} mm`)}</p>
            </div>
            {step.stepNumber === 5 && canPerformCurrentAction && !isStepActionCompleted && (
              <div className="grid grid-cols-2 gap-3" role="group" aria-label="Sketch dimensions">
                <label className="space-y-1 text-xs font-medium text-[#55616B]">
                  Width (mm)
                  <input type="number" min={20} max={50} step={1} value={widthMm}
                    onChange={event => {
                      const next = Number(event.target.value);
                      if (Number.isFinite(next) && next >= 20 && next <= 50) onDimensionsChange(next, heightMm);
                    }}
                    className="block w-full rounded-md border border-[#D9DDD9] bg-white px-2.5 py-2 font-mono text-[#0E2943] focus-visible:outline-2 focus-visible:outline-[#B74B21]" />
                </label>
                <label className="space-y-1 text-xs font-medium text-[#55616B]">
                  Height (mm)
                  <input type="number" min={15} max={40} step={1} value={heightMm}
                    onChange={event => {
                      const next = Number(event.target.value);
                      if (Number.isFinite(next) && next >= 15 && next <= 40) onDimensionsChange(widthMm, next);
                    }}
                    className="block w-full rounded-md border border-[#D9DDD9] bg-white px-2.5 py-2 font-mono text-[#0E2943] focus-visible:outline-2 focus-visible:outline-[#B74B21]" />
                </label>
                <p className="col-span-2 text-[11px] text-[#55616B]" role="status">
                  The illustrated sketch updates as you change dimensions.
                </p>
              </div>
            )}
            <Button
              variant="rust"
              size="md"
              className="w-full justify-center"
              onClick={handlePrimaryAction}
              disabled={!canPerformCurrentAction}
            >
              {isStepActionCompleted && !isLastStep ? 'Review next step' : primaryActionLabel[step.stepNumber] || 'Continue'}
            </Button>
            {!canPerformCurrentAction && (
              <p className="text-xs text-[#55616B]" role="status">Complete earlier CAD actions first. Use All steps to return.</p>
            )}
            {step.activeToolId && (
              <button
                type="button"
                onClick={onToggleHighlight}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#55616B] underline decoration-[#D9DDD9] underline-offset-4 transition-colors hover:text-[#B74B21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
                aria-pressed={isHighlightingControl}
              >
                {isHighlightingControl ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {isHighlightingControl ? 'Hide tool highlight' : 'Show me where'}
              </button>
            )}
          </div>

          {/* Progressive Hints Section */}
          <details open={helpOpen} onToggle={event => setHelpOpen(event.currentTarget.open)} className="space-y-3 pt-1">
            <summary className="cursor-pointer text-xs font-medium text-[#55616B] focus-visible:outline-2 focus-visible:outline-[#0E2943]">Need help?</summary>
            <div className="space-y-3">
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
                    {hintText.replace('40 mm', `${widthMm} mm`).replace('30 mm', `${heightMm} mm`)}
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
          </details>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#D9DDD9] pt-3">
          {isFirstStep ? <span /> : (
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#55616B] hover:text-[#0E2943] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
          )}
          {!isFirstStep && !isLastStep && isStepActionCompleted && (
            <button
              type="button"
              onClick={onNext}
              className="text-xs text-[#55616B] underline decoration-[#D9DDD9] underline-offset-4 hover:text-[#0E2943] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
            >
              Next step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
