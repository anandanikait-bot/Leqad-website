import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { MonitorPlay, HelpCircle, Compass } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Learn in Context',
      description:
        'Guidance appears directly beside your 3D canvas so you never have to switch back and forth between a tutorial video and your own model.',
      icon: <MonitorPlay className="w-5 h-5 text-[#B74B21]" />,
      number: '01',
    },
    {
      title: 'Get Guided Help',
      description:
        'Tiered hints and recognized tool highlights point you toward the next action when you get stuck, without doing the work for you.',
      icon: <HelpCircle className="w-5 h-5 text-[#B74B21]" />,
      number: '02',
    },
    {
      title: 'Build Independently',
      description:
        'Understand coordinate datums, parametric dimensions, and constraint logic so you can confidently model your own original parts.',
      icon: <Compass className="w-5 h-5 text-[#B74B21]" />,
      number: '03',
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-16 py-16 sm:py-20 bg-white border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          eyebrow="How It Works"
          title="Guidance that works alongside you."
          description="Designed to teach parametric CAD principles through direct practice inside the modeling environment."
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
