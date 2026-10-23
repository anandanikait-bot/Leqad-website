import React from 'react';
import { Link } from 'react-router-dom';
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';

export const SiteFooter: React.FC = () => (
  <footer className="w-full overflow-x-hidden bg-[#0E2943] text-[#F5EFE7]">
    <div className="mx-auto grid w-full max-w-7xl gap-9 px-5 pt-12 pb-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-12 sm:px-8 sm:pt-14 lg:pt-16">
      <div className="max-w-md space-y-3">
        {/* Source asset retained for assistive technology; visible artwork is drawn below. */}
        <img
          src="/assets/brand/leqad-approved.png"
          alt="Leqad CAD education mark"
          className="sr-only"
          width="1254"
          height="1254"
          loading="lazy"
          decoding="async"
        />
        <div className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F5EFE7]">
          LEQAD <span className="text-[#B74B21]">/</span> <span className="text-[#F5EFE7]/65">CAD LEARNING</span>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-[#F5EFE7]/75">
          Learn CAD by building. Exploring guided lessons and contextual help for beginner CAD practice.
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

    {/* The approved logo and lowercase wordmark share one halftone composition. */}
    <div className="mt-1">
      <HalftoneWordmarkFooter
        as="div"
        wordmark="leqad"
        logoSrc="/assets/brand/leqad-approved.png"
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
    </div>

    <div className="border-t border-[#F5EFE7]/10 px-5 py-4 sm:px-8 sm:py-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 font-mono text-[10px] leading-relaxed tracking-[0.06em] text-[#F5EFE7]/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:text-[11px]">
        <span className="text-[#F5EFE7]/85">© 2026 Leqad · In-workflow CAD education</span>
        <span className="max-w-md">Independent prototype. Browser demo illustrates CAD concepts; it does not inspect or verify live CAD geometry.</span>
      </div>
    </div>
  </footer>
);
