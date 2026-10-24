import React from 'react';
import { Link } from 'react-router-dom';
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';
import { LEGAL_DISCLAIMER } from '../../lib/constants';

export const SiteFooter: React.FC = () => (
  <footer className="w-full overflow-x-hidden bg-[#0E2943] text-[#F5EFE7]">
    <div className="mx-auto grid w-full max-w-[1600px] min-w-0 gap-9 px-4 pt-10 pb-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12 sm:px-5 sm:pt-12 lg:px-6 2xl:px-8">
      <div className="max-w-md space-y-3">
        {/* Source asset retained for assistive technology; visible artwork is drawn below. */}
        <img
          src="/assets/brand/leqad-official-symbol-dark-v1.svg"
          alt="Leqad CAD education mark"
          className="sr-only"
          width="476"
          height="470"
          loading="lazy"
          decoding="async"
        />
        <p className="max-w-sm text-sm leading-relaxed text-[#F5EFE7]/75">
          An early learning-assistant prototype for guided CAD practice.
        </p>
      </div>
      <nav aria-label="Footer navigation" className="sm:justify-self-end">
        <ul className="flex flex-col gap-3 text-sm sm:gap-3.5">
          <li><Link to="/demo" className="text-[#F5EFE7]/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Interactive Demo</Link></li>
          <li><Link to="/about" className="text-[#F5EFE7]/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">About Leqad</Link></li>
          <li><Link to="/partners" className="text-[#F5EFE7]/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">For Partners</Link></li>
        </ul>
      </nav>
    </div>

    {/* Sample the complete official SVG; never rebuild its wordmark using website fonts. */}
    <div className="mt-1">
      <HalftoneWordmarkFooter
        as="div"
        wordmark=""
        lockupSrc="/assets/brand/leqad-official-horizontal-dark-v1.svg"
        label=""
        meta=""
        columns={[]}
        backToTop={false}
        palette={{ background: '#0E2943', ink: '#F5EFE7', warm: '#793327' }}
        grain={0.25}
        dotGap={5}
        height="clamp(148px, 24vw, 346px)"
        crop={0}
      />
    </div>

    <div className="px-5 pt-2 pb-4 sm:px-8 sm:pb-5">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-[#F5EFE7]/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:text-[11px]">
        <span className="shrink-0 text-[#F5EFE7]/85">© 2026 Leqad</span>
        <span className="max-w-md sm:text-right">{LEGAL_DISCLAIMER}</span>
      </div>
    </div>
  </footer>
);
