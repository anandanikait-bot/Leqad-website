import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Button } from '../shared/Button';
import { ArrowRight, ShieldCheck, School, Cpu, TrendingUp } from 'lucide-react';
import { LEGAL_DISCLAIMER } from '../../lib/constants';

interface PartnershipOverviewProps {
  onOpenContact: (defaultTopic?: string) => void;
}

export const PartnershipOverview: React.FC<PartnershipOverviewProps> = ({ onOpenContact }) => {
  return (
    <div className="min-h-screen py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14 animate-fadeIn">
      {/* 1. Header & Overview */}
      <div className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
            For CAD Platform Teams & Educators
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0E2943] leading-[1.16]">
          Building a better learning experience for CAD.
        </h1>

        <p className="text-base sm:text-lg text-[#55616B] leading-relaxed">
          Leqad is exploring in-workflow guidance to help beginners learn browser-based CAD through practice, rather than switching between the model and a tutorial.
        </p>

        <div className="pt-2 flex items-center gap-4">
          <Button
            variant="rust"
            size="lg"
            onClick={() => onOpenContact('General Inquiry')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Draft an Inquiry Note
          </Button>
        </div>
      </div>

      {/* 2. The Core Problem & What Leqad Addresses */}
      <div className="bg-white rounded-2xl p-7 sm:p-10 border border-[#D9DDD9] space-y-8 shadow-xs">
        <SectionHeading
          eyebrow="The Problem"
          title="The gap between watching tutorials and designing original parts."
          description="Learning CAD often means switching repeatedly between video guides and an open document. When instructions stop matching what the student is building, frustration stalls progress."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <h3 className="text-base font-semibold text-[#0E2943]">High Onboarding Friction</h3>
            <p className="text-sm text-[#55616B] leading-relaxed">
              New users get overwhelmed by complex tool ribbons and silent constraint conflicts during their first hours in professional CAD.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <h3 className="text-base font-semibold text-[#0E2943]">Heavy Instructor Workload</h3>
            <p className="text-sm text-[#55616B] leading-relaxed">
              Educators and robotics mentors spend hours triaging basic misclicks rather than coaching higher-level mechanical design thinking.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <h3 className="text-base font-semibold text-[#0E2943]">Passive vs. Active Learning</h3>
            <p className="text-sm text-[#55616B] leading-relaxed">
              Following a tutorial is different from designing independently. Learners benefit from guided practice that explains choices and constraints.
            </p>
          </div>
        </div>
      </div>

      {/* 3. How the Current Prototype Works */}
      <div className="bg-[#FAF8F4] rounded-2xl p-7 sm:p-10 border border-[#D9DDD9] space-y-8">
        <SectionHeading
          eyebrow="Current Prototype"
          title="How the early extension operates."
          description="Early browser-extension prototype with guided CAD concepts and local cues for supported controls; the separate website demo illustrates an eight-step sketch-to-solid lesson."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-[#B74B21]">01 · Ribbon Recognition</span>
            <h3 className="text-sm font-semibold text-[#0E2943]">Control Highlighting</h3>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Supported interface controls can receive local visual cues when learners request guidance; this does not inspect model geometry.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-[#B74B21]">02 · Scaffolding</span>
            <h3 className="text-sm font-semibold text-[#0E2943]">Tiered Hints</h3>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Hints escalate on demand from spatial intuition to exact keyboard shortcuts, avoiding cognitive overload.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-[#B74B21]">03 · Pedagogy</span>
            <h3 className="text-sm font-semibold text-[#0E2943]">Engineering 'Why'</h3>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Every step teaches the design rationale behind datums, parametric dimensions, and constraint degrees of freedom.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-[#B74B21]">04 · Truthfulness</span>
            <h3 className="text-sm font-semibold text-[#0E2943]">Conservative Verification</h3>
            <p className="text-xs text-[#55616B] leading-relaxed">
              The current prototype offers local interface cues, not verified geometric or engineering checks.
            </p>
          </div>
        </div>

        {/* Boundary clarification note */}
        <div className="p-4 rounded-xl bg-white border border-[#D9DDD9] text-xs text-[#0E2943] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#B74B21] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Architecture Boundary:</strong> The prototype is an independent client-side extension. Geometry-aware feedback would require future technical development and authorized platform access.
          </div>
        </div>
      </div>

      {/* 4. Partnership Possibilities */}
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Collaboration Framework"
          title="Three areas for exploration."
          description="We are open to phased collaboration grounded in technical compatibility and measurable educational outcomes."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-semibold text-[#0E2943]">1. Technical Alignment</h3>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Explore supported extension surfaces, relevant platform APIs, and security requirements before proposing any deeper integration.
            </p>
            <button
              onClick={() => onOpenContact('Technical Alignment')}
              className="inline-flex min-h-11 items-center rounded-md text-sm font-medium text-[#B74B21] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] cursor-pointer"
            >
              Discuss technical alignment →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <School className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-semibold text-[#0E2943]">2. Educational Evaluation</h3>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Consider small educational evaluations measuring time-to-first-part, common errors, and student confidence if partners are interested.
            </p>
            <button
              onClick={() => onOpenContact('Educational Pilot')}
              className="inline-flex min-h-11 items-center rounded-md text-sm font-medium text-[#B74B21] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] cursor-pointer"
            >
              Discuss classroom pilots →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <h3 className="text-base font-semibold text-[#0E2943]">3. Commercial Exploration</h3>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Explore licensing, distribution, or onboarding models only if technical fit and educational value are established.
            </p>
            <button
              onClick={() => onOpenContact('Commercial Exploration')}
              className="inline-flex min-h-11 items-center rounded-md text-sm font-medium text-[#B74B21] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943] cursor-pointer"
            >
              Discuss distribution paths →
            </button>
          </div>
        </div>
      </div>

      {/* 5. Clear Status & Independent Project Notice */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D9DDD9] space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B74B21]" />
          <h3 className="text-base font-semibold text-[#0E2943]">Current Project Status</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Software Form</div>
            <div className="text-[#0E2943] font-semibold mt-1">Browser Extension Prototype</div>
          </div>
          <div className="p-3.5 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Curriculum</div>
            <div className="text-[#0E2943] font-semibold mt-1">Website: 8-Step Demo</div>
          </div>
          <div className="p-3.5 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Testing Stage</div>
            <div className="text-[#0E2943] font-semibold mt-1">Controlled Automated Testing</div>
          </div>
          <div className="p-3.5 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Platform Standing</div>
            <div className="text-[#0E2943] font-semibold mt-1">Independent Research</div>
          </div>
        </div>

        <p className="text-xs text-[#55616B] pt-2 border-t border-[#D9DDD9] leading-relaxed">
          {LEGAL_DISCLAIMER}
        </p>
      </div>

      {/* 6. Professional Call to Action */}
      <div data-parallax-anchor className="relative isolate overflow-hidden text-center py-10 px-6 bg-[#0E2943] text-white rounded-2xl space-y-5">
        {/* Independent background layers move at different rates, never the CTA. */}
        <div aria-hidden="true" data-parallax-travel="20" data-parallax-mobile-travel="12" className="pointer-events-none absolute -inset-6 -z-10 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div aria-hidden="true" data-parallax-travel="8" data-parallax-mobile-travel="4" data-parallax-direction="-1" className="pointer-events-none absolute -inset-6 -z-10 opacity-[0.035] bg-[radial-gradient(circle,#ffffff_1px,transparent_1.5px)] bg-[size:56px_56px]" />
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F5EFE7]">
          Let's explore what's possible.
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
          Whether you lead platform partnerships, teach mechanical engineering, or mentor robotics students, we welcome an initial exploratory conversation.
        </p>
        <div>
          <Button
            variant="rust"
            size="lg"
            onClick={() => onOpenContact('General Inquiry')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Draft a Collaboration Note
          </Button>
        </div>
      </div>
    </div>
  );
};
