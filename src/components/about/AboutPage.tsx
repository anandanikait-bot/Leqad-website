import React from 'react';
import { PageRoute } from '../../types';
import { SectionHeading } from '../shared/SectionHeading';
import { ProductPreview } from '../home/ProductPreview';
import { HowItWorks } from '../home/HowItWorks';
import { CurrentProductAndVision } from '../home/CurrentProductAndVision';
import { Button } from '../shared/Button';
import { ArrowRight, Sparkles, Layers, ShieldCheck, CheckCircle2, Building2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenContact: (topic?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <div className="py-10 sm:py-16 space-y-16 animate-fadeIn">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
              About Leqad · Product & Vision
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0E2943] leading-tight">
            Learn CAD by building, <br className="hidden sm:inline" />
            not just watching.
          </h1>

          <p className="text-base sm:text-lg text-[#55616B] leading-relaxed">
            Leqad is an independent CAD learning platform that integrates interactive, step-by-step guidance directly into modern browser-based CAD workflows. Our goal is to replace passive video tutorials with hands-on practice, spatial awareness, and verified engineering rationale.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              variant="rust"
              size="md"
              onClick={() => onNavigate('demo')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Interactive Demo
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('partners')}
            >
              For Partners & Educators
            </Button>
          </div>
        </div>
      </div>

      {/* Visual Product Centerpiece: Live CAD Workspace + Teaching Panel */}
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Interactive Workspace"
            title="The CAD canvas with in-context guidance."
            description="Leqad embeds instruction, tool recognition, and engineering rationale right next to your design space."
          />
        </div>
        <ProductPreview onNavigate={onNavigate} />
      </div>

      {/* How It Works: 3 Core Pillars */}
      <HowItWorks />

      {/* Current Prototype vs Future Vision: Transparent Architecture */}
      <CurrentProductAndVision />

      {/* Partnership & Educational Integration Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0E2943] rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden">
          {/* Subtle decorative grid lines */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-[#B74B21] bg-white/10 px-2.5 py-1 rounded border border-white/10 font-semibold">
              Collaboration & Deployment
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Partnering with CAD platforms and engineering educators.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              We are actively exploring pilots with university engineering labs, robotics teams, and CAD platform ecosystems. We prioritize verified geometry rules over ungrounded generative AI, ensuring students learn real mechanical constraints.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="rust"
                size="md"
                onClick={() => onNavigate('partners')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View Partnership Overview
              </Button>
              <button
                type="button"
                onClick={() => onOpenContact('Educational Collaboration')}
                className="text-sm font-medium text-white/80 hover:text-white underline underline-offset-4 cursor-pointer"
              >
                Get in touch with the team →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 pb-4">
        <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white rounded-2xl border border-[#D9DDD9] w-full text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#0E2943]">
              Experience the 8-step guided lesson.
            </h3>
            <p className="text-sm text-[#55616B]">
              Try the interactive Onshape simulation right in your browser with zero setup.
            </p>
          </div>
          <Button
            variant="rust"
            size="lg"
            onClick={() => onNavigate('demo')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Launch Interactive Demo
          </Button>
        </div>
      </div>
    </div>
  );
};
