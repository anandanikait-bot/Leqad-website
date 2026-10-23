import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { MonitorPlay, HelpCircle, Compass } from 'lucide-react';

/** Simple numbered walkthrough inspired by clear technical documentation. */
export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Follow guided steps',
      description: 'Practice a guided first-sketch exercise, one modeling action at a time.',
      icon: MonitorPlay,
    },
    {
      number: '02',
      title: 'Get hints when stuck',
      description: 'Reveal a hint or highlight a supported tool when you need a pointer.',
      icon: HelpCircle,
    },
    {
      number: '03',
      title: 'Understand the reasoning',
      description: 'Learn why reference planes, dimensions, constraints, and modeling choices matter.',
      icon: Compass,
    },
  ];
  return (
    <section id="how-it-works" className="scroll-mt-16 border-y border-[#D9DDD9] bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="How it works" title="Practice, hints, and the reasoning behind each step." />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#55616B]">
            A first-sketch walkthrough makes the modeling decisions visible, one step at a time.
          </p>
        </div>
        <ol className="divide-y divide-[#D9DDD9] border-y border-[#D9DDD9] lg:col-span-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li key={step.number} className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6 sm:py-8">
                <span className="pt-1 font-mono text-sm font-semibold tracking-wide text-[#B74B21]" aria-hidden="true">{step.number}</span>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0 text-[#B74B21]" aria-hidden="true" />
                    <h3 className="text-xl font-semibold tracking-tight text-[#0E2943] sm:text-2xl">{step.title}</h3>
                  </div>
                  <p className="max-w-xl text-sm leading-relaxed text-[#55616B] sm:text-base">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
