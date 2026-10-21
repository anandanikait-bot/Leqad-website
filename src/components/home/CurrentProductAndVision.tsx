import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Layers, Sparkles, CheckCircle2, Milestone } from 'lucide-react';

export const CurrentProductAndVision: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F4] border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="Product Status & Roadmap"
          title="Where we are and where we're going."
          description="We believe in transparency: here is what is working in our extension prototype today versus our planned product capabilities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Column 1: Current Prototype */}
          <div className="bg-white rounded-2xl p-7 sm:p-8 border-2 border-[#0E2943] shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white bg-[#0E2943] px-3 py-1 rounded-sm">
                  Now · Working Prototype
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Tested in Extension
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0E2943] tracking-tight">
                  Guided Foundations Extension
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  A functional browser extension teaching foundational CAD inside Onshape documents through structured instruction.
                </p>
              </div>

              <ul className="text-xs sm:text-sm space-y-2.5 font-mono text-[#0E2943] pt-3 border-t border-[#D9DDD9]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>8-step "Your First Sketch" curriculum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>Recognized CAD toolbar highlighting ("Show me")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>Tiered hints from conceptual tips to exact actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>"Why?" mechanical engineering rationale cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>Local preference & progress persistence</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#D9DDD9] text-xs font-mono text-[#55616B]">
              Conservative feedback: does not fabricate unverified model geometry.
            </div>
          </div>

          {/* Column 2: Planned Vision */}
          <div className="bg-white/80 rounded-2xl p-7 sm:p-8 border border-[#D9DDD9] shadow-2xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
                  Next · Product Vision
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-[#55616B] bg-[#F5EFE7] px-2.5 py-0.5 rounded border border-[#D9DDD9]">
                  <Milestone className="w-3.5 h-3.5" />
                  In Design
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#0E2943] tracking-tight">
                  Adaptive Teaching & Verification
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  Extending guided practice into an intelligent pedagogical layer that adapts to learner errors and evaluates original parts.
                </p>
              </div>

              <ul className="text-xs sm:text-sm space-y-2.5 font-mono text-[#55616B] pt-3 border-t border-[#D9DDD9]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Contextual AI explanation for unexpected modeling errors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Geometry-aware model verification via authorized CAD APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Custom Part Studio briefs for original physical parts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Educator analytics & student progress dashboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Cross-CAD platform compatibility</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#D9DDD9] text-xs font-mono text-[#55616B]">
              Subject to platform collaboration, developer APIs, and educational trials.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
