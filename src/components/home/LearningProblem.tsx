import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { MonitorPlay, Lightbulb, Compass } from 'lucide-react';

export const LearningProblem: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F4] border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="Pedagogical Philosophy"
          title="Watching a tutorial isn't the same as knowing how to design."
          description="Learning CAD often means switching between a tutorial and your own model. When the steps stop matching what you're trying to build, it can be difficult to know what to do next."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#D9DDD9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5EFE7] text-[#0E2943] flex items-center justify-center border border-[#0E2943]/15">
              <MonitorPlay className="w-5 h-5 text-[#B74B21]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
              Learn in context
            </h3>
            <p className="text-sm text-[#55616B] leading-relaxed">
              Guidance appears beside the work rather than in a disconnected lesson. The student stays in the CAD viewport where geometric modeling actually happens.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#D9DDD9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5EFE7] text-[#0E2943] flex items-center justify-center border border-[#0E2943]/15">
              <Lightbulb className="w-5 h-5 text-[#B74B21]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
              Understand the reason
            </h3>
            <p className="text-sm text-[#55616B] leading-relaxed">
              Teach the concepts behind modeling decisions instead of only showing commands. Learners grasp degrees of freedom, parametric relations, and design intent.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-xl p-6 sm:p-7 border border-[#D9DDD9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F5EFE7] text-[#0E2943] flex items-center justify-center border border-[#0E2943]/15">
              <Compass className="w-5 h-5 text-[#B74B21]" />
            </div>
            <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
              Build independence
            </h3>
            <p className="text-sm text-[#55616B] leading-relaxed">
              Provide help when needed, then give learners room to solve problems themselves. Scaffolding fades as learners develop spatial competence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
