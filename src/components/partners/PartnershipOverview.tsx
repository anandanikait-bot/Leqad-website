import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Button } from '../shared/Button';
import { 
  ArrowRight, 
  Workflow, 
  ShieldCheck, 
  School, 
  Cpu, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { LEGAL_DISCLAIMER } from '../../lib/constants';

interface PartnershipOverviewProps {
  onOpenContact: (defaultTopic?: string) => void;
}

export const PartnershipOverview: React.FC<PartnershipOverviewProps> = ({ onOpenContact }) => {
  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-fadeIn">
      {/* 1. Header & Overview */}
      <div className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
            For CAD Platform Teams & Educators
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0E2943] leading-[1.14]">
          Building a better learning experience for CAD.
        </h1>

        <p className="text-lg sm:text-xl text-[#55616B] leading-relaxed">
          Leqad is developing an in-workflow learning layer that helps beginners build modeling confidence directly inside browser-based CAD, designed for modern CAD workflows.
        </p>

        <div className="pt-2 flex items-center gap-4">
          <Button
            variant="rust"
            size="lg"
            onClick={() => onOpenContact('Partnership Inquiry')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Prepare an Inquiry
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
            <h4 className="text-base font-semibold text-[#0E2943]">High Onboarding Friction</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              New users get overwhelmed by complex tool ribbons and silent constraint conflicts during their first hours in professional CAD.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <h4 className="text-base font-semibold text-[#0E2943]">Heavy Instructor Workload</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Educators and robotics mentors spend hours triaging basic misclicks rather than coaching higher-level mechanical design thinking.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <h4 className="text-base font-semibold text-[#0E2943]">Passive vs. Active Learning</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Copying video tutorials rarely leads to lasting parametric understanding. Learners need contextual feedback while manipulating geometry.
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
            <h4 className="text-sm font-semibold text-[#0E2943]">Control Highlighting</h4>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Supported interface controls can receive local visual cues when learners request guidance; this does not inspect model geometry.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-[#B74B21]">02 · Scaffolding</span>
            <h4 className="text-sm font-semibold text-[#0E2943]">Tiered Hints</h4>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Hints escalate on demand from spatial intuition to exact keyboard shortcuts, avoiding cognitive overload.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-[#B74B21]">03 · Pedagogy</span>
            <h4 className="text-sm font-semibold text-[#0E2943]">Engineering 'Why'</h4>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Every step teaches the design rationale behind datums, parametric dimensions, and constraint degrees of freedom.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2 shadow-2xs">
            <span className="font-mono text-xs font-semibold text-[#B74B21]">04 · Truthfulness</span>
            <h4 className="text-sm font-semibold text-[#0E2943]">Conservative Verification</h4>
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
            <h4 className="text-base font-semibold text-[#0E2943]">1. Technical Alignment</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Discuss compliant platform integration, document event hooks, and secure extension sandboxing within modern browser CAD.
            </p>
            <button
              onClick={() => onOpenContact('Technical Alignment')}
              className="text-xs font-mono text-[#B74B21] hover:underline cursor-pointer pt-1 block"
            >
              Discuss technical alignment →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <School className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-base font-semibold text-[#0E2943]">2. Educational Evaluation</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Explore small classroom pilots measuring time-to-first-part, error frequency, and student confidence in STEM courses and robotics teams.
            </p>
            <button
              onClick={() => onOpenContact('Educational Pilot')}
              className="text-xs font-mono text-[#B74B21] hover:underline cursor-pointer pt-1 block"
            >
              Discuss classroom pilots →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-base font-semibold text-[#0E2943]">3. Commercial Exploration</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Evaluate sustainable institutional licensing, app store distribution, or native onboarding add-on models if mutual interest and evidence warrant it.
            </p>
            <button
              onClick={() => onOpenContact('Commercial Exploration')}
              className="text-xs font-mono text-[#B74B21] hover:underline cursor-pointer pt-1 block"
            >
              Discuss distribution paths →
            </button>
          </div>
        </div>
      </div>

      {/* 5. Clear Status & Independent Project Notice */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D9DDD9] space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
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
      <div className="relative isolate overflow-hidden text-center py-12 px-6 bg-[#0E2943] text-white rounded-3xl space-y-6">
        <div aria-hidden="true" data-parallax-travel="12" className="pointer-events-none absolute -inset-4 -z-10 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5EFE7]">
          Let's explore what's possible.
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
          Whether you lead platform partnerships, teach mechanical engineering, or mentor robotics students, we welcome an initial exploratory conversation.
        </p>
        <div>
          <Button
            variant="rust"
            size="lg"
            onClick={() => onOpenContact('General Partnership')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Prepare an Inquiry
          </Button>
        </div>
      </div>
    </div>
  );
};
