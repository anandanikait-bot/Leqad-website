import React from 'react';
import { Link } from 'react-router-dom';
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';

export const SiteFooter: React.FC = () => (
  <footer className="w-full bg-[#0E2943] text-[#F5EFE7] overflow-x-hidden">
    {/* Dedicated branding area with generous breathing room inspired by Rift */}
    <div className="mx-auto w-full max-w-7xl px-5 pt-12 pb-10 sm:px-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-16">
        {/* Brand identity */}
        <div className="space-y-4 max-w-sm">
          {/* Approved logo asset referenced for accessibility and preloading */}
          <img
            src="/assets/brand/leqad-approved.png"
            alt="Leqad CAD education mark"
            className="sr-only"
            width="1254"
            height="1254"
          />
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#B74B21]">
            <span className="font-semibold">LEQAD /</span>
            <span className="text-[#F5EFE7]/50 tracking-[0.14em]">CAD LEARNING</span>
          </div>
        </div>

        {/* Quiet link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 font-mono text-xs shrink-0 pt-2 lg:pt-0">
          <div className="space-y-2.5">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-[#F5EFE7]/45">EXPLORE /</div>
            <ul className="space-y-1.5 font-sans text-xs sm:text-sm">
              <li>
                <Link to="/demo" className="text-[#F5EFE7]/80 hover:text-white transition-colors">
                  Interactive Demo
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#F5EFE7]/80 hover:text-white transition-colors">
                  About Project
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-[#F5EFE7]/80 hover:text-white transition-colors">
                  For Partners
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-[#F5EFE7]/45">CURRICULUM /</div>
            <ul className="space-y-1.5 font-sans text-xs sm:text-sm text-[#F5EFE7]/70">
              <li>Reference Planes</li>
              <li>2D Sketching</li>
              <li>Dimensions</li>
              <li>Extrude Features</li>
            </ul>
          </div>

          <div className="space-y-2.5 col-span-2 sm:col-span-1">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-[#F5EFE7]/45">NOTICE /</div>
            <p className="text-xs font-sans text-[#F5EFE7]/55 leading-relaxed">
              Independent CAD education prototype. Illustrative browser simulation; not an official extension of any specific CAD vendor.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Halftone circular symbol + wordmark canvas artwork */}
    <div className="mt-2 sm:mt-4">
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

    {/* Quiet footer signature, beneath (never over) the faded halftone artwork. */}
    <div className="border-t border-[#F5EFE7]/10 px-5 py-4 sm:px-8 sm:py-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-[#F5EFE7]/60 sm:text-[11px]">
        <span className="font-semibold text-[#F5EFE7]/85">Leqad CAD</span>
        <span>© 2026 · In-workflow CAD education</span>
      </div>
    </div>
  </footer>
);
