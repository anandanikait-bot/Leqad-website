import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Layers, Sparkles, CheckCircle2, Milestone } from 'lucide-react';

export const CurrentProductAndVision: React.FC = () => {
  return (
    <section className="py-12 sm:py-14 bg-[#FAF8F4] border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeading
          eyebrow="Product Status & Roadmap"
          title="Where we are and where we're going."
          description="We believe in transparency: here is what is working in our extension prototype today versus our planned product capabilities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Column 1: Current Prototype */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#0E2943]/20 shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-medium text-[#0E2943]">
                  Now · Working Prototype
                </span>
                <span className="text-emerald-700 flex items-center gap-1 font-medium text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tested
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
                  Guided Foundations Extension
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  An early browser-extension prototype exploring step-by-step CAD instruction and local cues near supported interface controls.
                </p>
              </div>

              <ul className="text-sm space-y-2 text-[#0E2943] pt-3 border-t border-[#D9DDD9]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>8-step "Your First Sketch" curriculum</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>Local highlights for supported toolbar controls</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>Tiered hints from conceptual tips to exact actions</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>Mechanical engineering rationale cards for each step</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E2943] mt-2 flex-shrink-0" />
                  <span>Local assistance preferences and dismissible suggestions</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#D9DDD9] text-xs text-[#55616B]">
              The prototype does not inspect or validate model geometry. The website demo illustrates sketching and extrusion separately.
            </div>
          </div>

          {/* Column 2: Planned Vision */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D9DDD9] shadow-xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-medium text-[#B74B21]">
                  Next · Product Vision
                </span>
                <span className="text-[#55616B] flex items-center gap-1 font-medium text-xs">
                  <Milestone className="w-3.5 h-3.5 text-[#B74B21]" /> In Design
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
                  Adaptive Guidance & Verification
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  Future research could expand guided practice into adaptive assistance and authorized model feedback.
                </p>
              </div>

              <ul className="text-sm space-y-2 text-[#55616B] pt-3 border-t border-[#D9DDD9]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Contextual explanation for unexpected modeling errors</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Potential geometry-aware feedback through authorized CAD APIs</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Custom part studio briefs for original physical parts</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Educator analytics & student progress summaries</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B74B21] mt-2 flex-shrink-0" />
                  <span>Cross-CAD platform compatibility</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-[#D9DDD9] text-xs text-[#55616B]">
              Subject to platform collaboration, developer APIs, and educational trials.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
