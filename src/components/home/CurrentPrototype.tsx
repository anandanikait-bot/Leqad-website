import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Button } from '../shared/Button';
import { PageRoute } from '../../types';
import { 
  Layers, 
  HelpCircle, 
  Eye, 
  ShieldCheck, 
  Save, 
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

interface CurrentPrototypeProps {
  onNavigate: (page: PageRoute) => void;
}

export const CurrentPrototype: React.FC<CurrentPrototypeProps> = ({ onNavigate }) => {
  const features = [
    {
      title: 'Your First Sketch',
      description: 'An eight-step beginner learning flow teaching reference plane selection, sketch tools, dimensions, hole placement, and constraint verification.',
      icon: <Layers className="w-5 h-5 text-[#B74B21]" />,
      tag: '8 Interactive Steps',
    },
    {
      title: 'Progressive assistance',
      description: 'Hints can become more detailed as the learner requests help, starting with spatial intuition and advancing to exact keyboard shortcuts.',
      icon: <HelpCircle className="w-5 h-5 text-[#B74B21]" />,
      tag: 'Tiered Hints',
    },
    {
      title: 'Contextual visual guidance',
      description: 'Recognized interface controls can be highlighted in supported states with high-visibility target rings on the CAD toolbar.',
      icon: <Eye className="w-5 h-5 text-[#B74B21]" />,
      tag: 'Control Highlight',
    },
    {
      title: 'Evidence-aware progress',
      description: 'The system distinguishes observed interface behavior from geometry it cannot verify, communicating truthfully with the learner.',
      icon: <ShieldCheck className="w-5 h-5 text-[#B74B21]" />,
      tag: 'Conservative Verification',
    },
    {
      title: 'Resume learning',
      description: 'Lesson progress and selected preferences persist locally in browser storage, allowing learners to pick up their modeling session anytime.',
      icon: <Save className="w-5 h-5 text-[#B74B21]" />,
      tag: 'Local Persistence',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F4] border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Implemented Prototype"
            title="Starting with the foundations."
            description="Built as a React-powered browser extension inside Onshape. The public website offers a faithful, deterministic replica of the current experience."
          />

          <Button
            variant="rust"
            size="md"
            onClick={() => onNavigate('demo')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Launch interactive demo
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-[#D9DDD9] shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#F5EFE7] flex items-center justify-center border border-[#0E2943]/10">
                    {item.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase font-semibold text-[#55616B] bg-[#FAF8F4] px-2 py-0.5 rounded border border-[#D9DDD9]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#0E2943] tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#D9DDD9]/60 flex items-center gap-1.5 text-xs text-[#0E2943] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified in prototype</span>
              </div>
            </div>
          ))}

          {/* Prototype Callout Card */}
          <div className="bg-[#0E2943] text-white rounded-xl p-6 border border-[#0E2943] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#B74B21] bg-white/10 px-2 py-0.5 rounded">
                Development Stage
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-[#F5EFE7]">
                Live in Browser Extension
              </h3>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Tested against Onshape document workflows with automated test suites and progressive user feedback routines.
              </p>
            </div>

            <button
              onClick={() => onNavigate('demo')}
              className="w-full text-left font-mono text-xs text-[#B74B21] hover:text-white font-medium flex items-center justify-between pt-2 border-t border-white/20 transition-colors cursor-pointer"
            >
              <span>Test the 8-step walkthrough now</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
