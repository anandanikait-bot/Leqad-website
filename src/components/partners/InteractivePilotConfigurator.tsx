import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../shared/Button';

type AudienceId = 'university' | 'robotics' | 'platform';
type GroupId = 'small' | 'medium' | 'large';
type QuestionId = 'firstPart' | 'helpRequests' | 'independence';

interface InteractivePilotConfiguratorProps {
  onOpenContact: (topic?: string, draftMessage?: string) => void;
}

const audiences: Record<AudienceId, { label: string; description: string; topic: string }> = {
  university: {
    label: 'Engineering courses',
    description: 'A university or college course introducing parametric CAD.',
    topic: 'Educational Pilot',
  },
  robotics: {
    label: 'Robotics teams',
    description: 'A robotics club or build team onboarding new CAD learners.',
    topic: 'Robotics Team',
  },
  platform: {
    label: 'CAD platform teams',
    description: 'A CAD software team exploring supported onboarding experiences.',
    topic: 'Technical Alignment',
  },
};

const groupSizes: Record<GroupId, { label: string; description: string }> = {
  small: { label: 'Small group', description: '4–15 participants' },
  medium: { label: 'Medium group', description: '16–40 participants' },
  large: { label: 'Larger group', description: '41+ participants; capacity to be confirmed' },
};

const questions: Record<QuestionId, {
  label: string;
  question: string;
  baseline: string;
  observation: string;
}> = {
  firstPart: {
    label: 'Time to first part',
    question: 'How long does it take a learner to complete a defined first-part task?',
    baseline: 'Record the task, starting knowledge, and completion time without Leqad guidance.',
    observation: 'Use a comparable task with guided practice and compare observed completion times.',
  },
  helpRequests: {
    label: 'Help requests',
    question: 'Which CAD steps lead learners to request instructor help?',
    baseline: 'Count support requests during a defined introductory CAD exercise.',
    observation: 'Track the same type of requests during guided practice; compare only with appropriate context.',
  },
  independence: {
    label: 'Independent practice',
    question: 'Can learners apply the concepts to a different, comparable part without step-by-step prompts?',
    baseline: 'Document what learners can model independently before guided practice.',
    observation: 'Review a comparable follow-up task with an agreed rubric, not a predicted pass rate.',
  },
};

/**
 * This is a conversation planner, not a pilot feasibility, ROI, learning-gains,
 * privacy-certification or cost-savings calculator. No outcomes are implied.
 */
export const InteractivePilotConfigurator: React.FC<InteractivePilotConfiguratorProps> = ({ onOpenContact }) => {
  const [audience, setAudience] = useState<AudienceId>('university');
  const [group, setGroup] = useState<GroupId>('small');
  const [focus, setFocus] = useState<QuestionId>('firstPart');

  const selectedAudience = audiences[audience];
  const selectedGroup = groupSizes[group];
  const selectedQuestion = questions[focus];

  const draft = [
    'I would like to discuss a possible Leqad evaluation. This is only an exploratory outline.',
    'Audience: ' + selectedAudience.label,
    'Indicative group: ' + selectedGroup.description,
    'Evaluation focus: ' + selectedQuestion.label,
    'Evaluation question: ' + selectedQuestion.question,
    'Possible baseline: ' + selectedQuestion.baseline,
    'Possible comparison: ' + selectedQuestion.observation,
    'We would need to agree on task design, permissions, consent where appropriate, and measurement methods before any evaluation.',
  ].join('\n');

  const choiceClass = (selected: boolean) =>
    'min-h-11 w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors cursor-pointer ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] ' +
    (selected
      ? 'border-[#B74B21] bg-[#F5EFE7] text-[#0E2943] ring-1 ring-[#B74B21]/30'
      : 'border-[#D9DDD9] bg-white text-[#55616B] hover:border-[#B74B21]/60 hover:bg-[#FAF8F4]');

  return (
    <section
      data-pilot-planner
      aria-labelledby="pilot-planner-heading"
      className="space-y-7"
    >
      <div className="max-w-3xl space-y-3">
        <h2 id="pilot-planner-heading" className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0E2943]">
          Outline a potential CAD learning evaluation
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[#55616B]">
          Choose a setting, group size, and question worth investigating. This creates a
          discussion outline for a possible evaluation.
        </p>
      </div>

      <div className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[#0E2943]">1. Who might evaluate it?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(audiences) as AudienceId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={audience === id}
                onClick={() => setAudience(id)}
                className={choiceClass(audience === id)}
              >
                {audiences[id].label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[#0E2943]">2. What size group?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(groupSizes) as GroupId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={group === id}
                onClick={() => setGroup(id)}
                className={choiceClass(group === id)}
              >
                <span className="block font-medium">{groupSizes[id].label}</span>
                <span className="mt-1 block text-xs">{groupSizes[id].description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-[#0E2943]">3. What should be measured?</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(questions) as QuestionId[]).map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={focus === id}
                onClick={() => setFocus(id)}
                className={choiceClass(focus === id)}
              >
                {questions[id].label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="rounded-xl border border-[#D9DDD9] bg-[#FAF8F4] p-5 sm:p-6 space-y-5">
        <div className="space-y-2">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#B74B21]">
            Exploratory outline
          </span>
          <h3 className="text-base sm:text-lg font-semibold text-[#0E2943]" data-pilot-summary>
            {selectedAudience.label} · {selectedGroup.label}
          </h3>
          <p className="text-sm text-[#55616B]">{selectedAudience.description}</p>
          <p className="text-sm font-medium text-[#0E2943]" data-pilot-question aria-live="polite">
            {selectedQuestion.question}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-[#D9DDD9] bg-white p-4 space-y-2">
            <h4 className="text-sm font-semibold text-[#0E2943]">Possible baseline</h4>
            <p className="text-sm leading-relaxed text-[#55616B]" data-pilot-baseline>
              {selectedQuestion.baseline}
            </p>
          </div>
          <div className="rounded-lg border border-[#D9DDD9] bg-white p-4 space-y-2">
            <h4 className="text-sm font-semibold text-[#0E2943]">Possible comparison</h4>
            <p className="text-sm leading-relaxed text-[#55616B]" data-pilot-comparison>
              {selectedQuestion.observation}
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[#55616B]">
          This is a planning aid. An evaluation would need agreed tasks, participant consent,
          and measurement methods.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D9DDD9] pt-5">
        <p className="max-w-lg text-xs sm:text-sm text-[#55616B]">
          Keep this outline in a draft note. Nothing is sent.
        </p>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => onOpenContact(selectedAudience.topic, draft)}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Draft an Inquiry Note
        </Button>
      </div>
    </section>
  );
};
