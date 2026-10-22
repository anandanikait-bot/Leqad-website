import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { ProductPreview } from '../home/ProductPreview';
import { HowItWorks } from '../home/HowItWorks';
import { CurrentProductAndVision } from '../home/CurrentProductAndVision';
import { ButtonLink } from '../shared/Button';
import { ArrowRight, Compass, Sparkles, Layers, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

interface AboutPageProps {
  onOpenContact: (topic?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenContact }) => {
  return (
    <div className="py-10 sm:py-16 space-y-16 animate-fadeIn">
      {/* 1. What is Leqad? Clear explanation in plain English */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0E2943] leading-tight">
            Learn CAD by building, <br className="hidden sm:inline" />
            not just watching.
          </h1>

          <div className="space-y-4 text-base sm:text-lg text-[#55616B] leading-relaxed">
            <p>
              Computer-Aided Design (CAD) is essential for engineering, product development, and physical making. But learning it from video tutorials is frustrating: you constantly pause videos, switch back and forth between tabs, and get stuck on confusing menus and constraint errors.
            </p>
            <p>
              <strong>Leqad is prototyping lessons and guidance alongside browser-based CAD workflows.</strong> The interactive website demo illustrates step-by-step sketching and extrusion, while the extension explores local tool cues and contextual explanations.
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

      {/* 4 & 5. What Exists Today & Future Vision */}
      <CurrentProductAndVision />

      {/* Partnership & Educational Collaboration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0E2943] rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[#B74B21] bg-white/10 px-2.5 py-1 rounded border border-white/10 font-semibold">
              Collaboration & Testing
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Exploring collaboration with CAD teams and educators.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              We welcome conversations with CAD platform teams, robotics mentors, and engineering educators about evaluating guided practice. Geometry-aware model verification is a future direction, not a current capability.
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
                onClick={() => onOpenContact('Educational Collaboration')}
                className="text-sm font-medium text-white/80 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Prepare an educational inquiry →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-2 pb-4">
        <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-[#D9DDD9] w-full text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0E2943]">
              Experience the 8-step guided lesson.
            </h3>
            <p className="text-sm text-[#55616B]">
              Try the interactive CAD learning demonstration right in your browser with zero setup.
            </p>
          </div>
          <ButtonLink
            variant="rust"
            size="lg"
            to="/demo"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Launch Interactive Demo
          </ButtonLink>
        </div>
      </div>
    </div>
  );
};
