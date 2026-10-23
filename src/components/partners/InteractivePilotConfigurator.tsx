import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../shared/Button';

interface InteractivePilotConfiguratorProps {
  onOpenContact: (topic?: string) => void;
}

/**
 * A planning aid, not an efficacy or cost calculator. All displayed
 * quantities are arithmetic based solely on visitor-selected inputs.
 */
export const InteractivePilotConfigurator: React.FC<InteractivePilotConfiguratorProps> = ({
  onOpenContact,
}) => {
  const [participants, setParticipants] = useState(12);
  const [sessions, setSessions] = useState(4);
  const [minutesPerSession, setMinutesPerSession] = useState(60);

  const contactHours = (sessions * minutesPerSession) / 60;
  const participantHours = participants * contactHours;
  const format = (value: number) => new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
  }).format(value);

  return (
    <section
      aria-labelledby="pilot-planner-heading"
      className="rounded-2xl border border-[#D9DDD9] bg-white p-6 sm:p-8 space-y-6"
      data-pilot-planner
    >
      <div className="max-w-2xl space-y-3">
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#B74B21]">
          Optional planning aid
        </span>
        <h2 id="pilot-planner-heading" className="text-xl sm:text-2xl font-semibold tracking-tight text-[#0E2943]">
          Sketch an educational pilot
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-[#55616B]">
          Adjust a hypothetical classroom trial to understand its instructional scope.
          These are planning quantities, not predicted learning gains, costs, or a committed pilot.
        </p>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="pilot-participants" className="text-sm font-medium text-[#0E2943]">
                Learners
              </label>
              <output htmlFor="pilot-participants" className="font-mono text-sm text-[#0E2943]" data-pilot-participants>
                {participants}
              </output>
            </div>
            <input
              id="pilot-participants"
              type="range"
              min={4}
              max={40}
              step={1}
              value={participants}
              onChange={(event) => setParticipants(Number(event.target.value))}
              className="w-full accent-[#B74B21] cursor-pointer"
            />
            <p className="text-xs text-[#55616B]">Between 4 and 40 learners.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="pilot-sessions" className="text-sm font-medium text-[#0E2943]">
                Sessions
              </label>
              <output htmlFor="pilot-sessions" className="font-mono text-sm text-[#0E2943]" data-pilot-sessions>
                {sessions}
              </output>
            </div>
            <input
              id="pilot-sessions"
              type="range"
              min={1}
              max={8}
              step={1}
              value={sessions}
              onChange={(event) => setSessions(Number(event.target.value))}
              className="w-full accent-[#B74B21] cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="pilot-duration" className="text-sm font-medium text-[#0E2943]">
                Minutes per session
              </label>
              <output htmlFor="pilot-duration" className="font-mono text-sm text-[#0E2943]" data-pilot-duration>
                {minutesPerSession}
              </output>
            </div>
            <input
              id="pilot-duration"
              type="range"
              min={30}
              max={120}
              step={15}
              value={minutesPerSession}
              onChange={(event) => setMinutesPerSession(Number(event.target.value))}
              className="w-full accent-[#B74B21] cursor-pointer"
            />
          </div>
        </div>

        <div className="rounded-xl border border-[#D9DDD9] bg-[#FAF8F4] p-5 space-y-5">
          <h3 className="text-base font-semibold text-[#0E2943]">Illustrative scope</h3>
          <dl className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div>
              <dt className="text-xs text-[#55616B]">Scheduled instruction</dt>
              <dd className="font-mono text-2xl font-semibold text-[#0E2943]" data-pilot-contact-hours>
                {format(contactHours)} hours
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#55616B]">Combined learner attendance</dt>
              <dd className="font-mono text-2xl font-semibold text-[#0E2943]" data-pilot-participant-hours>
                {format(participantHours)} learner-hours
              </dd>
            </div>
          </dl>
          <p className="text-xs leading-relaxed text-[#55616B]">
            Learner-hours = learners × sessions × session duration. This excludes preparation,
            recruitment, assessment, and any actual learning outcome.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D9DDD9] pt-5">
        <p className="max-w-lg text-xs sm:text-sm text-[#55616B]">
          A pilot would require partner agreement and a separate evaluation plan.
        </p>
        <Button
          type="button"
          variant="rust"
          size="md"
          onClick={() => onOpenContact('Educational Pilot')}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Draft a Pilot Inquiry
        </Button>
      </div>
    </section>
  );
};
