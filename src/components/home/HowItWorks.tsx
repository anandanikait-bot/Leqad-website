import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { MonitorPlay, HelpCircle, Compass } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Follow guided steps',
      description:
        'Practice structured CAD exercises that introduce modeling actions one step at a time.',
      icon: <MonitorPlay className="w-5 h-5 text-[#B74B21]" />,
      number: '01',
    },
    {
      title: 'Get hints when stuck',
      description:
        'Use hints and local highlights for supported interface controls and concepts; they do not inspect geometry.',
      icon: <HelpCircle className="w-5 h-5 text-[#B74B21]" />,
      number: '02',
    },
    {
      title: 'Understand the reasoning',
      description:
        'Learn why reference planes, dimensions, constraints, and modeling choices matter.',
      icon: <Compass className="w-5 h-5 text-[#B74B21]" />,
      number: '03',
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-16 py-16 sm:py-20 bg-white border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="How It Works"
          title="Practice, hints, and the reasoning behind each step."
          description="The extension prototype explores contextual help for supported controls. The separate demo lets you try the lesson in a simulated workspace."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((item) => (
            <div
              key={item.number}
              className="bg-[#FAF8F4] rounded-xl p-6 sm:p-7 border border-[#D9DDD9] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#0E2943]/15 flex items-center justify-center text-[#0E2943] shadow-xs">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#55616B] bg-white px-2 py-0.5 rounded border border-[#D9DDD9]">
                    {item.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[#0E2943] tracking-tight">
                  {item.title}
                </h3>

                <p className="text-sm text-[#55616B] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
