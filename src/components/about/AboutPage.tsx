import { inquiryActionLabel } from '../../lib/contact';
import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { ProductPreview } from '../home/ProductPreview';
import { HowItWorks } from '../home/HowItWorks';
import { CurrentProductAndVision } from '../home/CurrentProductAndVision';
import { ButtonLink } from '../shared/Button';
import { ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onOpenContact: (topic?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenContact }) => {
  return (
    <div className="space-y-14 py-12 sm:space-y-20 sm:py-16 animate-fadeIn">
      {/* Editorial introduction, using Leqad's own lesson artwork and scope. */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-[#D9DDD9] pb-12 lg:grid-cols-12 lg:gap-16 lg:pb-16">
          <div className="space-y-6 lg:col-span-8">
            <div className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#62281F]">
              <span className="h-px w-7 bg-[#793327]" aria-hidden="true" />
              About / Leqad
            </div>
            <h1 className="max-w-4xl text-[clamp(2.3rem,4.5vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.055em] text-[#0E2943]">
              CAD guidance, right where you design.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#55616B] sm:text-lg">
              Leqad is an independent browser-extension prototype exploring contextual CAD lessons, starting with Onshape. The goal is to help learners understand their modeling decisions as they practice.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ButtonLink variant="rust" size="md" to="/demo" icon={<ArrowRight className="h-4 w-4" />}>
                Explore Interactive Demo
              </ButtonLink>
              <ButtonLink variant="outline" size="md" to="/partners">
                For Partners & Educators
              </ButtonLink>
            </div>
          </div>
          <aside className="flex flex-col justify-end gap-3 border-l-2 border-[#793327]/60 pl-5 lg:col-span-4 lg:mb-1 lg:self-end">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.13em] text-[#62281F]">Learning by doing</span>
            <p className="max-w-xs text-base font-semibold leading-snug text-[#0E2943]">Start with one sketch. Learn why each decision matters.</p>
            <p className="max-w-xs text-sm leading-relaxed text-[#55616B]">AI is making it easier than ever to create. Leqad aims to make it easier to understand what you create.</p>
          </aside>
        </div>
      </section>

      {/* The preview is a screenshot of this website's demonstration. */}
      <section className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Interactive Demo Preview"
            title="See the first sketch take shape."
          />
        </div>
        <ProductPreview />
      </section>

      {/* 3. How It Works: Guided lessons, contextual hints, learning by doing */}
      <HowItWorks />

      {/* Current prototype and future direction */}
      <CurrentProductAndVision />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="founder-origin">
        <div className="max-w-3xl space-y-5">
          <h2 id="founder-origin" className="text-[clamp(1.7rem,3vw,2.7rem)] font-semibold leading-[1.13] tracking-[-0.04em] text-[#0E2943]">
            Where Leqad started
          </h2>
          <p className="text-base leading-relaxed text-[#55616B] sm:text-lg">
            Leqad grew from challenges encountered while learning and teaching CAD.
            Its founder has experience in high-school robotics and leads and helps train newer robotics students.
          </p>
          <p className="text-base leading-relaxed text-[#55616B] sm:text-lg">
            The mission is to make technical learning more approachable and effective,
            so students understand what they build and become more independent with engineering tools.
          </p>
        </div>
      </section>

      {/* Partnership & Educational Collaboration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-parallax-anchor className="bg-[#0E2943] rounded-2xl p-7 sm:p-10 text-white relative overflow-hidden">
          {/* Slow technical grid and counter-moving pinpoints share one stable anchor. */}
          <div aria-hidden="true" data-parallax-travel="12" data-parallax-mobile-travel="6" className="absolute -inset-6 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div aria-hidden="true" data-parallax-travel="4" data-parallax-mobile-travel="2" data-parallax-direction="-1" className="absolute -inset-6 opacity-[0.02] bg-[radial-gradient(circle,#ffffff_1px,transparent_1.5px)] bg-[size:56px_56px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#F5EFE7]/75 font-medium">
              Collaboration
            </span>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Interested in evaluating guided CAD learning?
            </h2>

            <p className="text-sm sm:text-base text-[#F5EFE7]/80 leading-relaxed">
              We welcome exploratory conversations with educators and CAD platform teams about technical fit and useful learning evaluations.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <ButtonLink
                variant="rust"
                size="md"
                to="/partners"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Partnerships
              </ButtonLink>
              <button
                type="button"
                onClick={() => onOpenContact('Educational Pilot')}
                className="inline-flex min-h-11 items-center rounded-md text-sm font-medium text-white/80 hover:text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
              >
                {inquiryActionLabel}
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
