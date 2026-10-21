import React from 'react';
import { PageRoute } from '../../types';
import { SectionHeading } from '../shared/SectionHeading';
import { ProductPreview } from '../home/ProductPreview';
import { HowItWorks } from '../home/HowItWorks';
import { CurrentProductAndVision } from '../home/CurrentProductAndVision';
import { Button } from '../shared/Button';
import { ArrowRight, Compass, Sparkles, Layers, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
  onOpenContact: (topic?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <div className="py-10 sm:py-16 space-y-16 animate-fadeIn">
      {/* 1. What is Leqad? Clear explanation in plain English */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
              About Leqad
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0E2943] leading-tight">
            Learn CAD by building, <br className="hidden sm:inline" />
            not just watching.
          </h1>

          <div className="space-y-4 text-base sm:text-lg text-[#55616B] leading-relaxed">
            <p>
              Computer-Aided Design (CAD) is essential for engineering, product development, and physical making. But learning it from video tutorials is frustrating: you constantly pause videos, switch back and forth between tabs, and get stuck on confusing menus and constraint errors.
            </p>
            <p>
              <strong>Leqad brings lessons and guidance directly into your CAD workflow.</strong> Instead of watching someone else model, you practice directly on the canvas with interactive step-by-step instructions, spatial tool hints, and clear explanations of why each decision matters.
            </p>
          </div>

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
      </section>

      {/* 2. Product Preview: CAD workspace & teaching panel */}
      <section className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Product Preview"
            title="A teaching panel inside your workspace."
            description="Leqad sits directly beside your 3D canvas, highlighting recognized tools and providing context as you work."
          />
        </div>
        <ProductPreview onNavigate={onNavigate} />
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
