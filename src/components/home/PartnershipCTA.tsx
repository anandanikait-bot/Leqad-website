import React from 'react';
import { Button } from '../shared/Button';
import { PageRoute } from '../../types';
import { ArrowRight, Cpu, School, TrendingUp } from 'lucide-react';

interface PartnershipCTAProps {
  onNavigate: (page: PageRoute) => void;
  onOpenContact: () => void;
}

export const PartnershipCTA: React.FC<PartnershipCTAProps> = ({
  onNavigate,
  onOpenContact,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-[#D9DDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F4] rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#D9DDD9] space-y-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
                Collaboration & Research
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0E2943] leading-tight">
              Exploring better ways to teach CAD.
            </h2>

            <p className="text-base sm:text-lg text-[#55616B] leading-relaxed">
              Leqad is exploring opportunities to work with CAD platforms, educators, and other organizations interested in improving how beginners learn engineering design.
            </p>
          </div>

          {/* 3 Collaboration Directions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[#0E2943]">
                Product and technical integration
              </h4>
              <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
                Platform API alignment, secure in-workflow extension hooks, and compliant document event listening.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
                <School className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[#0E2943]">
                Educational pilots and feedback
              </h4>
              <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
                Small-scale classroom trials measuring student time-to-first-part, confidence, and instructor workload reduction.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#D9DDD9] shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-[#F5EFE7] flex items-center justify-center text-[#B74B21]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-[#0E2943]">
                Future distribution opportunities
              </h4>
              <p className="text-xs sm:text-sm text-[#55616B] leading-relaxed">
                Exploring sustainable distribution, licensing, or premium learning models if mutual interest and evidence justify it.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <Button
              variant="rust"
              size="lg"
              onClick={() => onNavigate('partners')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore partnerships
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenContact}
            >
              Start a conversation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
