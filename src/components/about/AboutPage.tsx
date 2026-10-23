import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { ProductPreview } from '../home/ProductPreview';
import { HowItWorks } from '../home/HowItWorks';
import { CurrentProductAndVision } from '../home/CurrentProductAndVision';
import { InteractivePedagogyMatrix } from './InteractivePedagogyMatrix';
import { ButtonLink } from '../shared/Button';
import { ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onOpenContact: (topic?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenContact }) => {
  return (
    <div className="py-10 sm:py-14 space-y-12 sm:space-y-14 animate-fadeIn">
      {/* 1. What is Leqad? Clear explanation in plain English */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0E2943] leading-tight">
            Learn CAD by building, <br className="hidden sm:inline" />
            not just watching.
          </h1>

          <div className="space-y-4 text-base sm:text-lg text-[#55616B] leading-relaxed">
            <p>
              CAD is easier to learn when you can practice each step yourself. Tutorials explain the tools, but it can be difficult to connect those lessons to what you are building.
            </p>
            <p>
              <strong>Leqad explores guided CAD learning alongside the workspace.</strong> Try the interactive sketch-to-solid demo, or learn how the extension prototype introduces contextual cues.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <ButtonLink
              variant="rust"
              size="md"
              to="/demo"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Interactive Demo
            </ButtonLink>
            <ButtonLink
              variant="outline"
              size="md"
              to="/partners"
            >
              For Partners & Educators
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 2. Product Preview: CAD workspace & teaching panel */}
      <section className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Product Preview"
            title="A teaching panel inside your workspace."
            description="The prototype explores contextual guidance beside a CAD workspace; the website demo illustrates the experience without connecting to a live model."
          />
        </div>
        <ProductPreview />
      </section>

      {/* 3. How It Works: Guided lessons, contextual hints, learning by doing */}
      <HowItWorks />

      {/* 4. Pedagogical Matrix: In-Workflow Learning vs Passive Tutorials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <InteractivePedagogyMatrix />
      </section>


      {/* 6 & 7. What Exists Today & Future Vision */}
      <CurrentProductAndVision />

      {/* Partnership & Educational Collaboration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-parallax-anchor className="bg-[#0E2943] rounded-2xl p-7 sm:p-10 text-white relative overflow-hidden">
          {/* Slow technical grid and counter-moving pinpoints share one stable anchor. */}
          <div aria-hidden="true" data-parallax-travel="12" data-parallax-mobile-travel="6" className="absolute -inset-6 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div aria-hidden="true" data-parallax-travel="4" data-parallax-mobile-travel="2" data-parallax-direction="-1" className="absolute -inset-6 opacity-[0.02] bg-[radial-gradient(circle,#ffffff_1px,transparent_1.5px)] bg-[size:56px_56px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#F5EFE7]/75 font-medium">
              Collaboration & Testing
            </span>

            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Exploring collaboration with CAD teams and educators.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              We welcome conversations about evaluating guided CAD practice with educators and platform teams. Geometry-aware feedback remains a future direction.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <ButtonLink
                variant="rust"
                size="md"
                to="/partners"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View Partnership Overview
              </ButtonLink>
              <button
                type="button"
                onClick={() => onOpenContact('Educational Pilot')}
                className="inline-flex min-h-11 items-center rounded-md text-sm font-medium text-white/80 hover:text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white cursor-pointer"
              >
                Draft an education inquiry note →
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
