import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Button } from '../shared/Button';
import { ArrowRight, ChevronDown, School, Cpu, TrendingUp } from 'lucide-react';
import { LEGAL_DISCLAIMER } from '../../lib/constants';
import { InteractivePilotConfigurator } from './InteractivePilotConfigurator';

interface PartnershipOverviewProps {
  onOpenContact: (defaultTopic?: string, draftMessage?: string) => void;
}

const inquiryLinkClass =
  'inline-flex min-h-11 items-center rounded-md text-sm font-medium text-[#B74B21] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] cursor-pointer';

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
        Leqad is an independent early-stage project exploring guided lessons and contextual
        hints alongside browser-based CAD. We welcome conversations about technical fit,
        educational evaluation, and possible future distribution.
      </p>
      <Button
        variant="rust"
        size="lg"
        onClick={() => onOpenContact('General Inquiry')}
        icon={<ArrowRight className="h-4 w-4" />}
      >
        Draft an Inquiry Note
      </Button>
    </section>

    <section className="space-y-5">
      <SectionHeading
        eyebrow="The learning challenge"
        title="From following tutorials to modeling independently."
        description="Beginners may know which button a tutorial uses but still struggle to choose tools, set dimensions, or explain their decisions on a new part."
      />
      <p className="max-w-3xl text-sm leading-relaxed text-[#55616B]">
        Leqad explores guided practice for those early steps. Whether it improves
        learning or reduces instructor workload remains a question for future evaluation.
      </p>
    </section>

    <section className="space-y-6">
      <SectionHeading
        eyebrow="Current prototype"
        title="What the early version can illustrate."
        description="The extension prototype provides guidance around supported interface controls. The independent website demo illustrates an eight-step sketch-to-solid lesson."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 border-l-2 border-[#D9DDD9] py-1 pl-4">
          <h3 className="font-semibold text-[#0E2943]">Highlight supported tools</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Local visual cues can point to supported controls; this is not universal tool recognition.
          </p>
        </div>
        <div className="space-y-2 border-l-2 border-[#D9DDD9] py-1 pl-4">
          <h3 className="font-semibold text-[#0E2943]">Offer hints and explanations</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Guided steps explain actions and concepts such as reference planes, dimensions, and constraints.
          </p>
        </div>
        <div className="space-y-2 border-l-2 border-[#D9DDD9] py-1 pl-4">
          <h3 className="font-semibold text-[#0E2943]">Practice with a separate demo</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            The interactive website lesson simulates sketching and extrusion without reading or changing a live CAD model.
          </p>
        </div>
      </div>
    </section>

    <section className="space-y-6">
      <SectionHeading
        eyebrow="Possible collaboration"
        title="Three conversations worth having."
        description="These are ideas for discussion, not partnerships or integrations already agreed upon."
      />
      <div className="grid gap-5 md:grid-cols-3">
        <article className="space-y-3 rounded-xl border border-[#D9DDD9] bg-white p-5 sm:p-6">
          <Cpu className="h-5 w-5 text-[#B74B21]" aria-hidden="true" />
          <h3 className="text-base font-semibold text-[#0E2943]">Technical compatibility</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Discuss approved extension capabilities, developer interfaces, and any integration constraints.
          </p>
          <button type="button" onClick={() => onOpenContact('Technical Alignment')} className={inquiryLinkClass}>
            Discuss technical fit →
          </button>
        </article>
        <article className="space-y-3 rounded-xl border border-[#D9DDD9] bg-white p-5 sm:p-6">
          <School className="h-5 w-5 text-[#B74B21]" aria-hidden="true" />
          <h3 className="text-base font-semibold text-[#0E2943]">Educational evaluation</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Explore a small, consent-aware study of learning tasks and useful forms of guidance.
          </p>
          <button type="button" onClick={() => onOpenContact('Educational Pilot')} className={inquiryLinkClass}>
            Discuss evaluation →
          </button>
        </article>
        <article className="space-y-3 rounded-xl border border-[#D9DDD9] bg-white p-5 sm:p-6">
          <TrendingUp className="h-5 w-5 text-[#B74B21]" aria-hidden="true" />
          <h3 className="text-base font-semibold text-[#0E2943]">Future commercial models</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Consider licensing or distribution possibilities only after technical and educational value is established.
          </p>
          <button type="button" onClick={() => onOpenContact('Commercial Exploration')} className={inquiryLinkClass}>
            Discuss commercial options →
          </button>
        </article>
      </div>
    </section>

    <details data-evaluation-disclosure className="group rounded-xl border border-[#D9DDD9] bg-white">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] [&::-webkit-details-marker]:hidden">
        <span className="space-y-1">
          <span className="block text-base font-semibold text-[#0E2943]">Outline a possible evaluation</span>
          <span className="block text-sm text-[#55616B]">Optional planner for educators, robotics teams, and CAD platforms.</span>
        </span>
        <ChevronDown className="h-5 w-5 shrink-0 text-[#55616B] transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="border-t border-[#D9DDD9] p-3 sm:p-4">
        <InteractivePilotConfigurator onOpenContact={onOpenContact} />
      </div>
    </details>

    <section className="space-y-3 border-t border-[#D9DDD9] pt-7">
      <h2 className="text-lg font-semibold text-[#0E2943]">Current project status</h2>
      <p className="max-w-4xl text-sm leading-relaxed text-[#55616B]">
        Leqad currently has an experimental browser-extension prototype and a separate, interactive
        eight-step website demonstration. Automated tests check website behavior and interactions;
        they do not establish student outcomes, deployment readiness, or successful platform integration.
      </p>
      <p className="max-w-4xl text-xs leading-relaxed text-[#55616B]">{LEGAL_DISCLAIMER}</p>
    </section>

    <section data-parallax-anchor className="relative isolate overflow-hidden rounded-2xl bg-[#0E2943] px-6 py-10 text-center text-white">
      <div aria-hidden="true" data-parallax-travel="20" data-parallax-mobile-travel="12"
        className="pointer-events-none absolute -inset-6 -z-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.06]" />
      <div aria-hidden="true" data-parallax-travel="8" data-parallax-mobile-travel="4"
        data-parallax-direction="-1"
        className="pointer-events-none absolute -inset-6 -z-10 bg-[radial-gradient(circle,#ffffff_1px,transparent_1.5px)] bg-[size:56px_56px] opacity-[0.035]" />
      <div className="relative z-10 mx-auto max-w-xl space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-[#F5EFE7] sm:text-2xl">
          Start an exploratory conversation.
        </h2>
        <p className="text-sm leading-relaxed text-white/80">
          Tell us about your CAD teaching or platform context. The inquiry helper prepares a note for you to send.
        </p>
        <Button
          variant="rust" size="lg"
          onClick={() => onOpenContact('General Inquiry')}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          Draft a Collaboration Note
        </Button>
      </div>
    </section>
  </div>
);
