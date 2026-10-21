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
  Layers, 
  FileCheck2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { LEGAL_DISCLAIMER } from '../../lib/constants';

interface PartnershipOverviewProps {
  onOpenContact: (defaultTopic?: string) => void;
}

export const PartnershipOverview: React.FC<PartnershipOverviewProps> = ({ onOpenContact }) => {
  return (
    <div className="min-h-screen py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <div className="max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
            For CAD Platforms, Educators & Mentors
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0E2943] leading-[1.15]">
          Building a better learning experience for CAD.
        </h1>

        <p className="text-lg sm:text-xl text-[#55616B] leading-relaxed">
          Leqad is developing an interactive learning layer that helps people build confidence directly inside their design workflow. We are exploring technical, educational, and future commercial collaborations.
        </p>

        <div className="pt-2 flex items-center gap-4">
          <Button
            variant="rust"
            size="lg"
            onClick={() => onOpenContact('Partnership Inquiry')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start a conversation
          </Button>
        </div>
      </div>

      {/* Section: What we are building (Teacher - Learner - Verifier loop) */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#D9DDD9] space-y-8">
        <SectionHeading
          eyebrow="Architecture & Vision"
          title="The Teacher — Learner — Verifier loop"
          description="A closed feedback loop designed to build lasting parametric competence rather than generating geometry for the user."
        />

        {/* 4-Stage Progression Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <span className="font-mono text-xs font-bold text-[#0E2943] bg-white px-2 py-0.5 rounded border border-[#D9DDD9]">
              01
            </span>
            <h4 className="text-sm font-semibold text-[#0E2943]">Learner takes action</h4>
            <p className="text-xs text-[#55616B] leading-relaxed">
              The user initiates CAD operations directly within the real design environment.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <span className="font-mono text-xs font-bold text-[#B74B21] bg-[#B74B21]/10 px-2 py-0.5 rounded border border-[#B74B21]/20">
              02
            </span>
            <h4 className="text-sm font-semibold text-[#0E2943]">Contextual guidance</h4>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Leqad supplies progressive hints, control highlights, and mechanical explanations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <span className="font-mono text-xs font-bold text-[#0E2943] bg-white px-2 py-0.5 rounded border border-[#D9DDD9]">
              03
            </span>
            <h4 className="text-sm font-semibold text-[#0E2943]">Evidence informs feedback</h4>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Observed actions provide grounded, conservative feedback without fake validation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#D9DDD9] space-y-2">
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              04
            </span>
            <h4 className="text-sm font-semibold text-[#0E2943]">Learner improves</h4>
            <p className="text-xs text-[#55616B] leading-relaxed">
              The learner develops independent spatial reasoning and parametric fluency.
            </p>
          </div>
        </div>

        {/* Boundary clarification note */}
        <div className="p-4 rounded-xl bg-[#F5EFE7] border border-[#D9DDD9] text-xs text-[#0E2943] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#B74B21] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong>Explicit boundary:</strong> The current prototype implements progressive hints, control highlights, and conservative status reporting. Full automatic CAD model inspection and verification is planned for future phases under authorized platform APIs.
          </div>
        </div>
      </div>

      {/* Section: Why it may be valuable */}
      <div className="space-y-8">
        <SectionHeading
          eyebrow="Value Proposition"
          title="Why in-workflow guidance matters"
          description="Addressing the steepest drop-off points in engineering software adoption."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-[#0E2943]">CAD platform onboarding</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Accelerates time-to-first-part for new users by bridging the gap between passive video tutorials and active UI exploration.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <Workflow className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-[#0E2943]">Beginner skill development</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Instills robust parametric habits—such as origin anchoring, fully constrained profiles, and intentional dimensional references.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <School className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-[#0E2943]">Educator workflows</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Relieves teachers and robotics coaches from triaging basic UI misclicks so they can focus on mechanical design theory.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-base font-semibold text-[#0E2943]">Movement to real projects</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Provides the scaffolding needed for students to progress from fixed tutorials into designing their own original parts.
            </p>
          </div>
        </div>
      </div>

      {/* Section: Partnership possibilities (3 Logical Stages) */}
      <div className="bg-[#FAF8F4] rounded-2xl p-6 sm:p-10 border border-[#D9DDD9] space-y-8">
        <SectionHeading
          eyebrow="Collaboration Framework"
          title="Partnership possibilities"
          description="A phased progression grounded in technical compatibility and measured educational efficacy."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-4">
            <span className="font-mono text-xs font-semibold uppercase text-[#0E2943] bg-[#F5EFE7] px-2.5 py-1 rounded">
              Phase 1
            </span>
            <h4 className="text-lg font-semibold text-[#0E2943]">1. Technical alignment</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Discuss compliant platform integration, document event hooks, and user experience fit within web-first CAD environments.
            </p>
            <button
              onClick={() => onOpenContact('Technical Alignment')}
              className="text-xs font-mono text-[#B74B21] hover:underline cursor-pointer"
            >
              Discuss technical alignment →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-4">
            <span className="font-mono text-xs font-semibold uppercase text-[#0E2943] bg-[#F5EFE7] px-2.5 py-1 rounded">
              Phase 2
            </span>
            <h4 className="text-lg font-semibold text-[#0E2943]">2. Educational evaluation</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Explore small pilots measuring learning outcomes, error reduction, and learner autonomy in high school classrooms and maker spaces.
            </p>
            <button
              onClick={() => onOpenContact('Educational Pilot')}
              className="text-xs font-mono text-[#B74B21] hover:underline cursor-pointer"
            >
              Discuss educational pilot →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] space-y-4">
            <span className="font-mono text-xs font-semibold uppercase text-[#0E2943] bg-[#F5EFE7] px-2.5 py-1 rounded">
              Phase 3
            </span>
            <h4 className="text-lg font-semibold text-[#0E2943]">3. Commercial exploration</h4>
            <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
              Discuss sustainable distribution, institutional licensing, or platform add-on models if mutual interest and evidence justify it.
            </p>
            <button
              onClick={() => onOpenContact('Commercial Exploration')}
              className="text-xs font-mono text-[#B74B21] hover:underline cursor-pointer"
            >
              Discuss commercial pathways →
            </button>
          </div>
        </div>
      </div>

      {/* Section: Current Status */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D9DDD9] space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h3 className="text-base font-semibold text-[#0E2943]">Current Status</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Working Extension</div>
            <div className="text-[#0E2943] font-semibold mt-1">Chrome / Edge Browser Extension</div>
          </div>
          <div className="p-3 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Active Curriculum</div>
            <div className="text-[#0E2943] font-semibold mt-1">8-Step "Your First Sketch"</div>
          </div>
          <div className="p-3 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Validation Stage</div>
            <div className="text-[#0E2943] font-semibold mt-1">Controlled Automated Testing</div>
          </div>
          <div className="p-3 rounded bg-[#FAF8F4] border border-[#D9DDD9]">
            <div className="text-[#55616B]">Collaboration Mode</div>
            <div className="text-[#0E2943] font-semibold mt-1">Open to Feedback & Pilots</div>
          </div>
        </div>
      </div>

      {/* Final CTA Banner */}
      <div className="text-center py-12 px-6 bg-[#0E2943] text-white rounded-3xl space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F5EFE7]">
          Let's explore what's possible.
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed">
          Whether you're developing CAD software, teaching engineering, or mentoring high school robotics students, we welcome an initial conversation.
        </p>
        <div>
          <Button
            variant="rust"
            size="lg"
            onClick={() => onOpenContact('General Partnership')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Start a conversation
          </Button>
        </div>
      </div>
    </div>
  );
};
