import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Button } from '../shared/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, School, Cpu } from 'lucide-react';
import { InteractivePilotConfigurator } from './InteractivePilotConfigurator';

interface PartnershipOverviewProps {
  onOpenContact: (defaultTopic?: string, draftMessage?: string) => void;
}

export const PartnershipOverview: React.FC<PartnershipOverviewProps> = ({ onOpenContact }) => (
  <div className="mx-auto min-h-screen max-w-7xl space-y-12 px-4 py-10 animate-fadeIn sm:space-y-14 sm:px-6 sm:py-14 lg:px-8">
    <section className="max-w-3xl space-y-5">
      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21]">
        For educators and CAD platform teams
      </span>
      <h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#0E2943] sm:text-4xl">
        Explore CAD learning together.
      </h1>
      <p className="text-base leading-relaxed text-[#55616B] sm:text-lg">
        Leqad is an early learning-assistant prototype, starting with Onshape.
        We welcome collaborators to assess technical compatibility and evaluate
        how guided first-sketch practice supports beginners.
      </p>
      <Link to="/about" className="inline-flex min-h-11 items-center text-sm font-medium text-[#B74B21] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]">
        About the prototype
      </Link>
    </section>

    <section className="space-y-6">
      <SectionHeading
        eyebrow="Possible collaboration"
        title="Technical fit. Useful learning evidence."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <article className="space-y-3 rounded-xl border border-[#D9DDD9] bg-white p-5 sm:p-6">
          <Cpu className="h-5 w-5 text-[#B74B21]" aria-hidden="true" />
          <h3 className="text-base font-semibold text-[#0E2943]">Technical compatibility</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Evaluate Onshape control recognition, extension-prototype behavior, and the interfaces
            needed for reliable guidance.
          </p>
        </article>
        <article className="space-y-3 rounded-xl border border-[#D9DDD9] bg-white p-5 sm:p-6">
          <School className="h-5 w-5 text-[#B74B21]" aria-hidden="true" />
          <h3 className="text-base font-semibold text-[#0E2943]">Educational evaluation</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Compare first-sketch practice with and without guidance. Observe task completion,
            requests for help, and how learners explain their modeling choices.
          </p>
        </article>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-[#55616B]">
        Licensing or distribution can follow once technical fit and educational value are established.
      </p>
    </section>

    <details data-evaluation-disclosure className="group rounded-xl border border-[#D9DDD9] bg-white">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] [&::-webkit-details-marker]:hidden">
        <span className="space-y-1">
          <span className="block text-base font-semibold text-[#0E2943]">Outline a possible evaluation</span>
          <span className="block text-sm text-[#55616B]">Optional planner for a setting, group, and research question.</span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-[#55616B] transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-[#D9DDD9] p-3 sm:p-4">
        <InteractivePilotConfigurator onOpenContact={onOpenContact} />
      </div>
    </details>

    <section data-parallax-anchor className="relative isolate overflow-hidden rounded-2xl bg-[#0E2943] px-6 py-10 text-center text-white">
      <div aria-hidden="true" data-parallax-travel="20" data-parallax-mobile-travel="12"
        className="pointer-events-none absolute -inset-6 -z-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.06]" />
      <div aria-hidden="true" data-parallax-travel="8" data-parallax-mobile-travel="4"
        data-parallax-direction="-1"
        className="pointer-events-none absolute -inset-6 -z-10 bg-[radial-gradient(circle,#ffffff_1px,transparent_1.5px)] bg-[size:56px_56px] opacity-[0.035]" />
      <div className="relative z-10 mx-auto max-w-xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-[#F5EFE7] sm:text-2xl">
          Prepare an inquiry
        </h2>
        <p className="text-sm leading-relaxed text-white/80">
          A public contact email is not available yet. You can prepare a note to keep for later; nothing is sent.
        </p>
        <Button
          variant="rust" size="lg"
          onClick={() => onOpenContact('General Inquiry')}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Draft an Inquiry Note
        </Button>
      </div>
    </section>
  </div>
);
