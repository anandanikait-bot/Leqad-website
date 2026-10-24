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
  <div className="mx-auto min-h-screen max-w-7xl space-y-14 px-4 py-12 animate-fadeIn sm:space-y-20 sm:px-6 sm:py-16 lg:px-8">
    <section className="grid gap-8 border-b border-[#D9DDD9] pb-12 lg:grid-cols-12 lg:gap-16 lg:pb-16">
      <div className="space-y-6 lg:col-span-8">
        <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9C3F1B]">
          <span className="h-px w-7 bg-[#B74B21]" aria-hidden="true" />
          For educators and CAD platform teams
        </div>
        <h1 className="max-w-4xl text-[clamp(2.35rem,4.6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-[#0E2943]">
          Explore CAD learning together.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#55616B] sm:text-lg">
          Leqad is an early learning-assistant prototype, starting with Onshape. We welcome exploratory conversations about technical fit and how guided first-sketch practice might support beginners.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#collaboration-areas" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0E2943] underline decoration-[#B74B21]/50 underline-offset-4 hover:decoration-[#B74B21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]">
            Explore collaboration areas <ArrowRight className="h-4 w-4 text-[#B74B21]" aria-hidden="true" />
          </a>
          <Link to="/about" className="inline-flex min-h-11 items-center text-sm font-medium text-[#9C3F1B] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]">
            About the prototype
          </Link>
        </div>
      </div>
      <aside className="flex flex-col justify-end gap-3 border-l-2 border-[#B74B21]/60 pl-5 lg:col-span-4 lg:mb-1 lg:self-end">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.13em] text-[#9C3F1B]">An exploratory first step</span>
        <p className="max-w-xs text-base font-semibold leading-snug text-[#0E2943]">
          Start with a question worth testing.
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-[#55616B]">
          Discuss a learning task, check technical feasibility, and agree what useful evidence would look like.
        </p>
      </aside>
    </section>

    <section id="collaboration-areas" className="scroll-mt-24 space-y-8">
      <SectionHeading
        eyebrow="Possible collaboration"
        title="Technical fit. Useful learning evidence."
      />
      <div className="grid gap-0 border-y border-[#D9DDD9] md:grid-cols-2 md:divide-x md:divide-[#D9DDD9]">
        <article className="space-y-4 py-7 md:pr-8">
          <div className="flex items-center justify-between">
            <Cpu className="h-5 w-5 text-[#B74B21]" aria-hidden="true" />
            <span className="font-mono text-sm font-semibold text-[#9C3F1B]">01</span>
          </div>
          <h3 className="text-base font-semibold text-[#0E2943]">Technical compatibility</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Evaluate Onshape control recognition, extension-prototype behavior, and the interfaces
            needed for reliable guidance.
          </p>
        </article>
        <article className="space-y-4 border-t border-[#D9DDD9] py-7 md:border-t-0 md:pl-8">
          <div className="flex items-center justify-between">
            <School className="h-5 w-5 text-[#B74B21]" aria-hidden="true" />
            <span className="font-mono text-sm font-semibold text-[#9C3F1B]">02</span>
          </div>
          <h3 className="text-base font-semibold text-[#0E2943]">Educational evaluation</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Compare first-sketch practice with and without guidance. Observe task completion,
            requests for help, and how learners explain their modeling choices.
          </p>
        </article>
      </div>
      <p className="max-w-3xl text-sm leading-relaxed text-[#55616B]">
        Future discussions could include licensing or distribution if technical compatibility and educational value are demonstrated.
      </p>
    </section>

    <section className="space-y-7" aria-label="Possible collaboration sequence">
      <SectionHeading eyebrow="A practical starting point" title="Start with one useful question." />
      <ol className="grid gap-6 border-y border-[#D9DDD9] py-7 sm:grid-cols-3 sm:gap-8">
        <li className="space-y-2">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#9C3F1B]">01 / DISCUSS</span>
          <h3 className="text-lg font-semibold text-[#0E2943]">Define a learning task</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">Agree on a concrete beginner CAD exercise and what support should be evaluated.</p>
        </li>
        <li className="space-y-2">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#9C3F1B]">02 / CHECK</span>
          <h3 className="text-lg font-semibold text-[#0E2943]">Test technical fit</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">Identify the supported workflow, constraints, and validation still needed.</p>
        </li>
        <li className="space-y-2">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#9C3F1B]">03 / LEARN</span>
          <h3 className="text-lg font-semibold text-[#0E2943]">Review observations</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">If an evaluation is agreed, compare observations without assuming improved outcomes.</p>
        </li>
      </ol>
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
