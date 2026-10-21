import React, { useState } from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { 
  Target, 
  MousePointerClick, 
  HelpCircle, 
  Eye, 
  CheckCircle2, 
  Compass, 
  Ruler, 
  Square, 
  ShieldCheck 
} from 'lucide-react';

interface StageInfo {
  number: string;
  title: string;
  description: string;
  detail: string;
  icon: React.ReactNode;
}

const STAGES: StageInfo[] = [
  {
    number: '01',
    title: 'Understand the goal',
    description: 'The teaching panel presents the design objective clearly, grounding the task in real parametric principles.',
    detail: 'Explicit educational scope: what geometry is needed, why that reference plane is used, and what constraints will govern it.',
    icon: <Target className="w-4 h-4 text-[#B74B21]" />,
  },
  {
    number: '02',
    title: 'Find the next action',
    description: 'Recognized interface controls guide the learner directly to the relevant CAD tool in the active modeling context.',
    detail: 'Visual highlighting pinpoints the correct sketch or feature tool without stealing control from the user.',
    icon: <MousePointerClick className="w-4 h-4 text-[#B74B21]" />,
  },
  {
    number: '03',
    title: 'Get a helpful hint',
    description: 'Progressive hints reveal scaffolding in stages, giving the learner just enough guidance to break through confusion.',
    detail: 'Starts with high-level guidance, advancing to explicit keyboard shortcuts and procedural steps on demand.',
    icon: <HelpCircle className="w-4 h-4 text-[#B74B21]" />,
  },
  {
    number: '04',
    title: 'Check what can be observed',
    description: 'The system distinguishes verified interface actions from model geometry it cannot conservatively confirm.',
    detail: 'Clear, evidence-aware status avoids misleading the student into thinking unverified geometry is correct.',
    icon: <Eye className="w-4 h-4 text-[#B74B21]" />,
  },
  {
    number: '05',
    title: 'Continue building independently',
    description: 'Once foundational constraints are locked, learners execute the geometry with lasting confidence.',
    detail: 'By mastering degrees of freedom and parametric intent, learners graduate from following steps to designing original parts.',
    icon: <CheckCircle2 className="w-4 h-4 text-[#B74B21]" />,
  },
];

export const Workflow: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const activeStage = STAGES[activeStageIndex];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="Workflow Experience"
          title="Guidance that works alongside the learner."
          description="Designed to coach without taking over the mouse. Leqad reinforces engineering autonomy at every interaction."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Selectable Stages (col-span-5) */}
          <div className="lg:col-span-5 space-y-2 flex flex-col justify-between" role="tablist" aria-label="Workflow Stages">
            {STAGES.map((stage, idx) => {
              const isSelected = idx === activeStageIndex;
              return (
                <button
                  key={stage.number}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[#FAF8F4] border-[#0E2943] shadow-xs'
                      : 'bg-white border-[#D9DDD9] hover:bg-[#F5EFE7]/50 hover:border-[#55616B]/40'
                  }`}
                >
                  <span
                    className={`font-mono text-xs font-semibold px-2 py-0.5 rounded-sm flex-shrink-0 ${
                      isSelected
                        ? 'bg-[#0E2943] text-white'
                        : 'bg-[#F5EFE7] text-[#55616B]'
                    }`}
                  >
                    {stage.number}
                  </span>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm font-semibold tracking-tight ${
                          isSelected ? 'text-[#0E2943]' : 'text-[#55616B]'
                        }`}
                      >
                        {stage.title}
                      </h4>
                      {isSelected && stage.icon}
                    </div>
                    <p className="text-xs text-[#55616B] leading-relaxed line-clamp-2">
                      {stage.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Workspace Illustration (col-span-7) */}
          <div className="lg:col-span-7 bg-[#EDF1F3] rounded-2xl border border-[#D9DDD9] p-5 sm:p-6 flex flex-col justify-between shadow-2xs relative overflow-hidden min-h-[420px]">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DDD9] text-xs font-mono">
              <span className="text-[#0E2943] font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B74B21]" />
                STAGE {activeStage.number} / 05 · {activeStage.title.toUpperCase()}
              </span>
              <span className="text-[#55616B] bg-white px-2 py-0.5 rounded border border-[#D9DDD9]">
                Live Interactive Mode
              </span>
            </div>

            {/* Stage-dependent Technical Illustration */}
            <div className="flex-1 py-6 flex items-center justify-center">
              {activeStageIndex === 0 && (
                <div className="space-y-4 max-w-md w-full bg-white p-5 rounded-xl border border-[#D9DDD9] shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#B74B21] font-semibold">
                    <Target className="w-4 h-4" />
                    <span>OBJECTIVE DEFINED</span>
                  </div>
                  <h4 className="text-base font-semibold text-[#0E2943]">
                    Create a 2D Parametric Base Plate
                  </h4>
                  <p className="text-xs text-[#55616B] leading-relaxed">
                    Establish a 40mm × 30mm rectangular sketch on the Top Plane anchored to the coordinate origin. Must achieve 0 degrees of freedom before extrusion.
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#D9DDD9] text-[11px] font-mono text-[#55616B]">
                    <span>Reference Plane: <strong>Top (XZ)</strong></span>
                    <span>•</span>
                    <span>Tolerance: <strong>±0.1 mm</strong></span>
                  </div>
                </div>
              )}

              {activeStageIndex === 1 && (
                <div className="w-full max-w-md space-y-4 animate-fadeIn">
                  <div className="bg-white p-4 rounded-xl border border-[#D9DDD9] shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0E2943] text-white flex items-center justify-center ring-4 ring-[#B74B21]/30">
                        <Square className="w-5 h-5 text-[#B74B21]" />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] text-[#B74B21] font-semibold uppercase">Recognized Toolbar Action</div>
                        <div className="text-sm font-semibold text-[#0E2943]">Corner Rectangle Tool</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs bg-[#FAF8F4] px-2 py-1 rounded border border-[#D9DDD9] text-[#0E2943]">
                      Key: G
                    </span>
                  </div>
                  <div className="text-center font-mono text-xs text-[#55616B]">
                    Control highlighted on CAD ribbon with pulsating focus ring.
                  </div>
                </div>
              )}

              {activeStageIndex === 2 && (
                <div className="w-full max-w-md bg-white p-5 rounded-xl border border-[#D9DDD9] shadow-xs space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#B74B21] font-semibold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      PROGRESSIVE HINT TIERS
                    </span>
                    <span className="text-[#55616B]">Tier 2 of 3</span>
                  </div>
                  <div className="bg-[#FAF8F4] p-3 rounded border-l-3 border-[#B74B21] text-xs text-[#0E2943] leading-relaxed">
                    <strong>Placement Hint:</strong> Hover over the orange datum origin point until the Coincident constraint icon appears, then click to anchor corner 1.
                  </div>
                  <p className="text-[11px] text-[#55616B]">
                    Hints escalate from conceptual prompts to direct procedural actions on request.
                  </p>
                </div>
              )}

              {activeStageIndex === 3 && (
                <div className="w-full max-w-md bg-white p-5 rounded-xl border border-[#D9DDD9] shadow-xs space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#0E2943] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#B74B21]" />
                    <span>EVIDENCE OBSERVATION ENGINE</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                      <span>Observed tool click: Rectangle</span>
                      <span className="font-mono text-[10px] uppercase font-bold">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#F5EFE7] text-[#0E2943] border border-[#D9DDD9]">
                      <span>Model internal geometry</span>
                      <span className="font-mono text-[10px] text-[#55616B] uppercase">Uninspected (conservative)</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#55616B] leading-relaxed font-mono">
                    Leqad never fabricates CAD verification claims without authorized document evidence.
                  </p>
                </div>
              )}

              {activeStageIndex === 4 && (
                <div className="w-full max-w-md bg-white p-5 rounded-xl border border-[#D9DDD9] shadow-xs space-y-3 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-[#0E2943] text-white flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-[#B74B21]" />
                  </div>
                  <h4 className="text-base font-semibold text-[#0E2943]">
                    Parametric Understanding Retained
                  </h4>
                  <p className="text-xs text-[#55616B] leading-relaxed">
                    The student has learned not only which tool to click, but why origin datum placement, dimensioning, and degree-of-freedom resolution matter for manufacturing.
                  </p>
                  <div className="inline-block text-[11px] font-mono bg-[#FAF8F4] px-3 py-1 rounded border border-[#D9DDD9] text-[#0E2943]">
                    Ready for 3D extrusion feature
                  </div>
                </div>
              )}
            </div>

            {/* Bottom detailed explanation for the active stage */}
            <div className="pt-3 border-t border-[#D9DDD9] text-xs text-[#55616B] bg-white/70 p-3 rounded-lg">
              <strong className="text-[#0E2943]">Engineering Focus:</strong> {activeStage.detail}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
