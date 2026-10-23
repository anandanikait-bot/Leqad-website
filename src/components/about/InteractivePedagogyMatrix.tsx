import React, { useState } from 'react';

type Comparison = {
  id: string;
  label: string;
  question: string;
  tutorial: string;
  approach: string;
};

const comparisons: Comparison[] = [
  {
    id: 'context',
    label: 'Learning context',
    question: 'Where does the learner find the next step?',
    tutorial: 'Video and written tutorials commonly explain steps in a separate page or window.',
    approach: 'Leqad explores contextual hints for supported controls. Its separate website demo illustrates this idea.',
  },
  {
    id: 'tools',
    label: 'Finding tools',
    question: 'What happens when the learner cannot find a command?',
    tutorial: 'Learners can replay a lesson or search documentation for the command.',
    approach: 'The extension prototype provides local highlights for supported interface controls; it does not recognize every CAD interface.',
  },
  {
    id: 'reasoning',
    label: 'Design reasoning',
    question: 'How does a learner understand a modeling choice?',
    tutorial: 'Tutorials can explain why a plane, constraint, or dimension was selected.',
    approach: 'Guided hints connect individual steps to basic CAD concepts and encourage users to think through their decisions.',
  },
  {
    id: 'evaluation',
    label: 'Learning evidence',
    question: 'What evidence would show the guidance is useful?',
    tutorial: 'A comparison could measure how learners complete defined tasks with a conventional tutorial.',
    approach: 'A future evaluation could compare matched tasks, support requests, and independent practice; no learning gains have been established.',
  },
];

export const InteractivePedagogyMatrix: React.FC = () => {
  const [activeId, setActiveId] = useState(comparisons[0].id);
  const active = comparisons.find(item => item.id === activeId) ?? comparisons[0];

  return (
    <section className="space-y-5 rounded-2xl border border-[#D9DDD9] bg-white p-6 sm:p-8" aria-labelledby="learning-approaches-heading">
      <div className="max-w-3xl space-y-2">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#B74B21]">
          Learning approaches
        </span>
        <h2 id="learning-approaches-heading" className="text-xl font-semibold tracking-tight text-[#0E2943] sm:text-2xl">
          Different ways to practice CAD
        </h2>
        <p className="text-sm leading-relaxed text-[#55616B]">
          Tutorials and guided practice can complement one another. Explore the intended difference,
          not a claim of measured superiority.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Compare learning topics">
        {comparisons.map(item => (
          <button
            type="button"
            key={item.id}
            aria-pressed={activeId === item.id}
            onClick={() => setActiveId(item.id)}
            className={`min-h-11 cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] ${
              activeId === item.id
                ? 'border-[#0E2943] bg-[#0E2943] text-white'
                : 'border-[#D9DDD9] bg-[#FAF8F4] text-[#55616B] hover:bg-[#F5EFE7]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-semibold text-[#0E2943]" data-comparison-question>
          {active.question}
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-[#D9DDD9] bg-[#FAF8F4] p-5">
            <h4 className="text-sm font-semibold text-[#0E2943]">Traditional tutorial</h4>
            <p className="text-sm leading-relaxed text-[#55616B]" data-comparison-tutorial>
              {active.tutorial}
            </p>
          </div>
          <div className="space-y-2 rounded-xl border border-[#B74B21]/30 bg-white p-5">
            <h4 className="text-sm font-semibold text-[#0E2943]">Leqad's prototype direction</h4>
            <p className="text-sm leading-relaxed text-[#55616B]" data-comparison-leqad>
              {active.approach}
            </p>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-[#55616B]">
        Illustrative comparison only. No verified improvements in completion time, retention, or
        instructor workload are claimed.
      </p>
    </section>
  );
};
