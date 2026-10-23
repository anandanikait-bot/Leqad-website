import React, { useState } from 'react';
import { Monitor, Compass, AlertTriangle, CheckCircle, Clock, Zap, ArrowRight } from 'lucide-react';

interface MetricItem {
  id: string;
  category: string;
  title: string;
  traditional: {
    label: string;
    description: string;
    metric: string;
    impact: 'negative' | 'neutral';
  };
  leqad: {
    label: string;
    description: string;
    metric: string;
    impact: 'positive';
  };
}

const COMPARISON_DATA: MetricItem[] = [
  {
    id: 'context',
    category: 'Spatial Focus',
    title: 'Context Switching & Screen Real Estate',
    traditional: {
      label: 'Desynchronized Dual-Window Workflow',
      description: 'Switching constantly between YouTube or LMS tutorials and CAD. Students lose coordinate bearings every time they change focus.',
      metric: '40% time spent switching windows',
      impact: 'negative',
    },
    leqad: {
      label: 'Integrated In-Workflow Scaffolding',
      description: 'Step-by-step guidance docks right alongside the model canvas. The learner keeps hands on the mouse and eyes on geometry.',
      metric: 'Zero window-switch latency',
      impact: 'positive',
    },
  },
  {
    id: 'constraints',
    category: 'Constraint Logic',
    title: 'Silent Failures & Red Solver Errors',
    traditional: {
      label: 'Cryptic Over-Constraint Crashes',
      description: 'A misplaced dimension or conflicting coincidence turns the sketch red with no clear explanation of which relation caused the lock.',
      metric: 'Top driver of beginner abandonment',
      impact: 'negative',
    },
    leqad: {
      label: 'Contextual Mechanical Rationale',
      description: 'Tiered hints explain degrees of freedom and geometric dependencies before learners commit irreversible constraint conflicts.',
      metric: 'Proactive constraint comprehension',
      impact: 'positive',
    },
  },
  {
    id: 'retention',
    category: 'Knowledge Retention',
    title: 'Passive Mimicry vs. Parametric Intent',
    traditional: {
      label: 'Rote Coordinate Copying',
      description: 'Learners copy exact coordinate values without understanding why datums, bilateral symmetry, or design intent matter.',
      metric: 'Low transfer to original parts',
      impact: 'negative',
    },
    leqad: {
      label: 'First-Principles Understanding',
      description: 'Every step highlights the engineering "Why?" behind datum planes, wall thickness, and draft angles for physical manufacturing.',
      metric: 'Lasting mechanical design intuition',
      impact: 'positive',
    },
  },
  {
    id: 'velocity',
    category: 'Onboarding Velocity',
    title: 'Time to First Verified Physical Part',
    traditional: {
      label: 'Lengthy Video Pausing & Rewinding',
      description: 'New modelers pause video every 15 seconds to locate obscured toolbar icons, stretching simple 5-minute sketches into an hour.',
      metric: '~45 minutes average first part',
      impact: 'negative',
    },
    leqad: {
      label: 'Active Guided Execution',
      description: 'Targeted control highlighting points toward the required tool instantly, keeping cognitive load focused on geometry creation.',
      metric: '< 5 minutes to first extruded solid',
      impact: 'positive',
    },
  },
];

export const InteractivePedagogyMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('context');

  const activeItem = COMPARISON_DATA.find((item) => item.id === activeTab) || COMPARISON_DATA[0];

  return (
    <section className="bg-white rounded-2xl border border-[#D9DDD9] p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="max-w-3xl space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#B74B21] font-medium">
          Pedagogy Comparison
        </span>
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0E2943]">
          Why video tutorials fail CAD beginners
        </h3>
        <p className="text-sm text-[#55616B] leading-relaxed">
          Parametric modeling requires active mechanical reasoning. Compare traditional tutorial videos against guided in-workflow practice.
        </p>
      </div>

      {/* Segmented Interactive Control */}
      <div className="flex flex-wrap gap-2 border-b border-[#D9DDD9] pb-3">
        {COMPARISON_DATA.map((item) => {
          const isSelected = item.id === activeTab;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#0E2943] text-white shadow-xs'
                  : 'bg-[#FAF8F4] text-[#55616B] hover:text-[#0E2943] hover:bg-[#F5EFE7] border border-[#D9DDD9]'
              }`}
            >
              <span>{item.category}</span>
            </button>
          );
        })}
      </div>

      {/* Active Comparison Card Side-by-Side */}
      <div className="space-y-3">
        <h4 className="text-base font-semibold text-[#0E2943] tracking-tight">
          {activeItem.title}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Traditional Method */}
          <div className="bg-[#FAF8F4] rounded-xl p-5 border border-[#D9DDD9] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#55616B] font-medium">Standard Tutorial Video</span>
                <span className="text-[#994020] flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Friction
                </span>
              </div>
              <h5 className="text-sm font-semibold text-[#0E2943]">
                {activeItem.traditional.label}
              </h5>
              <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
                {activeItem.traditional.description}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#D9DDD9] text-xs text-[#55616B]">
              Outcome: <strong className="text-[#0E2943]">{activeItem.traditional.metric}</strong>
            </div>
          </div>

          {/* Leqad Method */}
          <div className="bg-white rounded-xl p-5 border border-[#B74B21]/40 space-y-3 flex flex-col justify-between shadow-2xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#B74B21] font-semibold">Leqad In-Workflow Guidance</span>
                <span className="text-emerald-700 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" /> Context-Aware
                </span>
              </div>
              <h5 className="text-sm font-semibold text-[#0E2943]">
                {activeItem.leqad.label}
              </h5>
              <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
                {activeItem.leqad.description}
              </p>
            </div>
            <div className="pt-2.5 border-t border-[#D9DDD9] text-xs text-[#55616B]">
              Outcome: <strong className="text-[#B74B21]">{activeItem.leqad.metric}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
