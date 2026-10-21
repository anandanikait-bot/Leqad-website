import React from 'react';
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';

export const SiteFooter: React.FC = () => (
  <footer className="w-full bg-[#0E2943] text-[#F5EFE7]">
    <HalftoneWordmarkFooter
      as="div"
      wordmark="leqad"
      label=""
      meta=""
      columns={[]}
      backToTop={false}
      palette={{ background: '#0E2943', ink: '#F5EFE7', warm: '#B74B21' }}
      grain={0.25}
      dotGap={7}
      height="clamp(220px, 24vw, 310px)"
      crop={0}
    />
    {/* Quiet footer signature, beneath (never over) the faded halftone artwork. */}
    <div className="border-t border-[#F5EFE7]/10 px-5 py-4 sm:px-8 sm:py-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-[#F5EFE7]/60 sm:text-[11px]">
        <span className="font-semibold text-[#F5EFE7]/85">Leqad CAD</span>
        <span>© 2026 · In-workflow CAD education</span>
      </div>
    </div>
  </footer>
);
