import { contactConfig, inquiryActionLabel } from '../../lib/contact';
import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Button } from '../shared/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { InteractivePilotConfigurator } from './InteractivePilotConfigurator';

interface PartnershipOverviewProps {
  onOpenContact: (defaultTopic?: string, draftMessage?: string) => void;
}

export const PartnershipOverview: React.FC<PartnershipOverviewProps> = ({ onOpenContact }) => (
  <div className="mx-auto min-h-screen max-w-7xl space-y-14 px-4 py-12 animate-fadeIn sm:space-y-20 sm:px-6 sm:py-16 lg:px-8">
    <section className="grid gap-8 border-b border-[#D9DDD9] pb-12 lg:grid-cols-12 lg:gap-16 lg:pb-16">
      <div className="space-y-6 lg:col-span-8">
        <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#62281F]">
          <span className="h-px w-7 bg-[#793327]" aria-hidden="true" />
          For educators and CAD platform teams
        </div>
        <h1 className="max-w-4xl text-[clamp(2.35rem,4.6vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-[#0E2943]">
          Help us explore better ways to teach CAD.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[#55616B] sm:text-lg">
          We're looking to work with educators, robotics teams, and CAD platform teams on better ways to learn CAD. We're starting with Onshape.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#collaboration-areas" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#0E2943] underline decoration-[#793327]/50 underline-offset-4 hover:decoration-[#793327] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]">
            Explore collaboration areas <ArrowRight className="h-4 w-4 text-[#793327]" aria-hidden="true" />
          </a>
          <Link to="/about" className="inline-flex min-h-11 items-center text-sm font-medium text-[#62281F] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]">
            About the prototype
          </Link>
        </div>
      </div>
      <aside className="flex flex-col justify-end gap-3 border-l-2 border-[#793327]/60 pl-5 lg:col-span-4 lg:mb-1 lg:self-end">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.13em] text-[#62281F]">An exploratory first step</span>
        <p className="max-w-xs text-base font-semibold leading-snug text-[#0E2943]">
          Start with a simple CAD task.
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-[#55616B]">
          Choose a beginner exercise, discuss what Leqad could support, and decide what to measure.
        </p>
      </aside>
    </section>

    <section id="collaboration-areas" className="scroll-mt-24 space-y-8">
      <SectionHeading
        title="What we can test together."
      />
      <div className="grid gap-0 border-b border-[#D9DDD9] md:grid-cols-2 md:divide-x md:divide-[#D9DDD9]">
        <article className="space-y-4 py-7 md:pr-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-semibold text-[#62281F]">01</span>
          </div>
          <h3 className="text-base font-semibold text-[#0E2943]">Can it work with CAD tools?</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Explore how guided steps could work in Onshape. Live compatibility still needs testing.
          </p>
        </article>
        <article className="space-y-4 border-t border-[#D9DDD9] py-7 md:border-t-0 md:pl-8">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm font-semibold text-[#62281F]">02</span>
          </div>
          <h3 className="text-base font-semibold text-[#0E2943]">Can it help learners?</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Compare beginner CAD practice with and without guidance. Look at completed tasks, help requests, and what learners understand.
          </p>
        </article>
      </div>
    </section>

    <section className="space-y-7" aria-label="Possible collaboration sequence">
      <SectionHeading title="Start small. See what works." />
      <ol className="grid gap-6 border-b border-[#D9DDD9] py-7 sm:grid-cols-3 sm:gap-8">
        <li className="space-y-2">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#62281F]">01 / DISCUSS</span>
          <h3 className="text-lg font-semibold text-[#0E2943]">Pick a CAD task</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">Choose one beginner CAD exercise to try.</p>
        </li>
        <li className="space-y-2">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#62281F]">02 / CHECK</span>
          <h3 className="text-lg font-semibold text-[#0E2943]">Check what works</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">Decide what to test and what still needs work.</p>
        </li>
        <li className="space-y-2">
          <span className="font-mono text-xs font-semibold tracking-[0.14em] text-[#62281F]">03 / LEARN</span>
          <h3 className="text-lg font-semibold text-[#0E2943]">Review what we learn</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">Compare what happened and decide what to improve.</p>
        </li>
      </ol>
    </section>

    <details data-evaluation-disclosure className="group rounded-xl border border-[#D9DDD9] bg-white">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] [&::-webkit-details-marker]:hidden">
        <span className="space-y-1">
          <span className="block text-base font-semibold text-[#0E2943]">Plan a simple test</span>
          <span className="block text-sm text-[#55616B]">Optional: choose a group and what to test.</span>
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
        <h2 className="text-2xl font-semibold tracking-tight text-[#F5EFE7] sm:text-3xl">
          {contactConfig.email ? 'Contact Leqad' : 'Prepare an inquiry'}
        </h2>
        <p className="text-sm leading-relaxed text-white/80">
          {contactConfig.email ? 'Send your inquiry directly to Leqad support.' : 'A public contact email is not available yet. You can prepare a note to keep for later; nothing is sent.'}
        </p>
        <Button
          variant="rust" size="lg"
          onClick={() => onOpenContact('General Inquiry')}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          {inquiryActionLabel}
        </Button>
      </div>
    </section>
  </div>
);
