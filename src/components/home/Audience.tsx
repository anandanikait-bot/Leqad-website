import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { GraduationCap, Wrench, BookOpen } from 'lucide-react';

export const Audience: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="Target Audience"
          title="For people learning to build real things."
          description="Parametric modeling is how the modern physical world is engineered. Leqad focuses directly on the early learning curve where guidance matters most."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Panel 1: Students & Beginners */}
          <div className="bg-[#FAF8F4] rounded-2xl p-6 sm:p-7 border border-[#D9DDD9] shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#0E2943]/15 flex items-center justify-center text-[#0E2943] shadow-xs">
                <GraduationCap className="w-6 h-6 text-[#B74B21]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
                  Students and beginners
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  Learn essential CAD skills through guided practice. Transition from passive video tutorials to creating accurate, fully dimensioned parametric sketches directly inside the modeling environment.
                </p>
              </div>
            </div>

            {/* Technical CAD Diagram Preview */}
            <div className="p-3 bg-white rounded-lg border border-[#D9DDD9] space-y-2">
              <div className="font-mono text-[10px] uppercase text-[#55616B] font-semibold">
                Foundational Skillset
              </div>
              <ul className="text-xs space-y-1 font-mono text-[#0E2943]">
                <li>• Reference plane orientation</li>
                <li>• Parametric dimensions (mm/in)</li>
                <li>• Resolving under-constrained geometry</li>
              </ul>
            </div>
          </div>

          {/* Panel 2: Robotics Teams & Makers */}
          <div className="bg-[#FAF8F4] rounded-2xl p-6 sm:p-7 border border-[#D9DDD9] shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#0E2943]/15 flex items-center justify-center text-[#0E2943] shadow-xs">
                <Wrench className="w-6 h-6 text-[#B74B21]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
                  Robotics teams and makers
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  Develop the modeling skills to create brackets, mounts, and useful components for 3D printing and CNC fabrication, ensuring parts fit assembly tolerances on the first physical iteration.
                </p>
              </div>
            </div>

            {/* Technical CAD Diagram Preview */}
            <div className="p-3 bg-white rounded-lg border border-[#D9DDD9] space-y-2">
              <div className="font-mono text-[10px] uppercase text-[#55616B] font-semibold">
                Fabrication Readiness
              </div>
              <ul className="text-xs space-y-1 font-mono text-[#0E2943]">
                <li>• Motor mount fastener patterns</li>
                <li>• Symmetrical center-line offsets</li>
                <li>• Watertight profiles for slicers</li>
              </ul>
            </div>
          </div>

          {/* Panel 3: Educators */}
          <div className="bg-[#FAF8F4] rounded-2xl p-6 sm:p-7 border border-[#D9DDD9] shadow-2xs space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#0E2943]/15 flex items-center justify-center text-[#0E2943] shadow-xs">
                <BookOpen className="w-6 h-6 text-[#B74B21]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
                  Educators
                </h3>
                <p className="text-sm text-[#55616B] leading-relaxed">
                  Explore how in-workflow assistance might complement existing CAD instruction, freeing instructors from repetitive basic tool triage to focus on higher-level mechanical engineering and design intent.
                </p>
              </div>
            </div>

            {/* Technical CAD Diagram Preview */}
            <div className="p-3 bg-white rounded-lg border border-[#D9DDD9] space-y-2">
              <div className="font-mono text-[10px] uppercase text-[#55616B] font-semibold">
                Classroom Alignment
              </div>
              <ul className="text-xs space-y-1 font-mono text-[#0E2943]">
                <li>• Self-paced beginner onboarding</li>
                <li>• Consistent terminology reinforcement</li>
                <li>• Reduced student frustration cycles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
