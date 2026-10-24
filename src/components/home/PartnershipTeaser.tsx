import React from 'react';
import { Button } from '../shared/Button';
import { PageRoute } from '../../types';
import { ArrowRight, School, Cpu, TrendingUp } from 'lucide-react';

interface PartnershipTeaserProps {
  onNavigate: (page: PageRoute) => void;
  onOpenContact: () => void;
}

export const PartnershipTeaser: React.FC<PartnershipTeaserProps> = ({
  onNavigate,
  onOpenContact,
}) => {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F4] rounded-2xl p-8 sm:p-12 border border-[#D9DDD9] space-y-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#793327] bg-[#793327]/10 px-2.5 py-1 rounded-sm border border-[#793327]/20">
                Collaboration & Research
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0E2943]">
              Exploring better ways to teach CAD.
            </h2>

            <p className="text-base sm:text-lg text-[#55616B] leading-relaxed">
              Leqad is exploring opportunities to collaborate with CAD platform teams, STEM educators, and robotics mentors to improve how beginners build real parametric modeling confidence.
            </p>
          </div>

          {/* 3 Quick Pillar Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2">
              <div className="w-8 h-8 rounded-md bg-[#F5EFE7] flex items-center justify-center text-[#793327]">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-[#0E2943]">Platform Integration</h4>
              <p className="text-xs text-[#55616B] leading-relaxed">
                Exploring compliant in-workflow extension integration and document event listeners.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2">
              <div className="w-8 h-8 rounded-md bg-[#F5EFE7] flex items-center justify-center text-[#793327]">
                <School className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-[#0E2943]">Classroom Pilots</h4>
              <p className="text-xs text-[#55616B] leading-relaxed">
                Small-scale trials evaluating error reduction and learner autonomy in high school and college labs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2">
              <div className="w-8 h-8 rounded-md bg-[#F5EFE7] flex items-center justify-center text-[#793327]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-[#0E2943]">Commercial Potential</h4>
              <p className="text-xs text-[#55616B] leading-relaxed">
                Exploring future distribution models subject to verified learning outcomes.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              variant="rust"
              size="md"
              onClick={() => onNavigate('partners')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Partnerships
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={onOpenContact}
            >
              Start a Conversation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
