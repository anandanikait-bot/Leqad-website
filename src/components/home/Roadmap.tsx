import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { CheckCircle2, Clock, Sparkles, Milestone } from 'lucide-react';

export const Roadmap: React.FC = () => {
  return (
    <section id="roadmap" className="py-16 sm:py-20 bg-[#FAF8F4] border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="Product Evolution"
          title="From guided lessons to independent design."
          description="A transparent look at what exists today and how Leqad plans to evolve into an intelligent, adaptive CAD learning system."
        />

        {/* Timeline Grid (3 stages) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {/* Stage 1: NOW */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-[#0E2943] shadow-sm space-y-5 flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#0E2943] px-2.5 py-1 rounded-sm">
                  NOW · Implemented
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Prototype
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0E2943] tracking-tight">
                  Guided foundations
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  A focused beginner lesson prototype inside Onshape featuring interface recognition, progressive hints, and careful, conservative progress handling.
                </p>
              </div>

              <ul className="text-xs space-y-2 font-mono text-[#0E2943] pt-2 border-t border-[#D9DDD9]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943]" />
                  <span>8-step "Your First Sketch" curriculum</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943]" />
                  <span>3-tier progressive hint engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943]" />
                  <span>CAD ribbon control highlighting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943]" />
                  <span>Local preference & progress persistence</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#D9DDD9] text-[11px] font-mono text-[#55616B]">
              Verified in automated and live browser testing.
            </div>
          </div>

          {/* Stage 2: NEXT */}
          <div className="bg-white/90 rounded-2xl p-6 sm:p-7 border border-[#D9DDD9] shadow-2xs space-y-5 flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-2.5 py-1 rounded-sm border border-[#B74B21]/20">
                  NEXT · Proposed
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#55616B] bg-[#F5EFE7] px-2 py-0.5 rounded border border-[#D9DDD9]">
                  <Clock className="w-3.5 h-3.5" />
                  In Design
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0E2943] tracking-tight">
                  Contextual AI teaching
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  A proposed contextual explanation layer that answers why, adapts guidance dynamically, and handles geometric uncertainty gracefully.
                </p>
              </div>

              <ul className="text-xs space-y-2 font-mono text-[#55616B] pt-2 border-t border-[#D9DDD9]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21]" />
                  <span>In-situ "Why?" mechanical rationale</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21]" />
                  <span>Learner-adapted pacing algorithms</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21]" />
                  <span>Error recovery for over-constrained sketches</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#D9DDD9] text-[11px] font-mono text-[#55616B]">
              Planned expansion; requires API alignment.
            </div>
          </div>

          {/* Stage 3: LATER */}
          <div className="bg-white/70 rounded-2xl p-6 sm:p-7 border border-dashed border-[#D9DDD9] space-y-5 flex flex-col justify-between relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#55616B] bg-[#F5EFE7] px-2.5 py-1 rounded-sm border border-[#D9DDD9]">
                  LATER · Planned
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-[#55616B]">
                  <Milestone className="w-3.5 h-3.5" />
                  Long-term Vision
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0E2943] tracking-tight">
                  Original projects & verification
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  Planned support for open design briefs, learner-created parts, authorized model evidence, and constructive automated design review.
                </p>
              </div>

              <ul className="text-xs space-y-2 font-mono text-[#55616B]/80 pt-2 border-t border-[#D9DDD9]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55616B]" />
                  <span>Custom Part Studio briefs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55616B]" />
                  <span>Cross-CAD platform compatibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#55616B]" />
                  <span>Educator analytics & cohort dashboards</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#D9DDD9] text-[11px] font-mono text-[#55616B]">
              Subject to demonstrated value and validation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
