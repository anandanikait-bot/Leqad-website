import React from 'react';
import { PageRoute } from '../../types';
import { BrandLogo } from '../shared/BrandLogo';
import { LEGAL_DISCLAIMER } from '../../lib/constants';

interface SiteFooterProps {
  onNavigate: (page: PageRoute) => void;
  onOpenContact: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigate,
  onOpenContact,
}) => {
  return (
    <footer className="bg-white border-t border-[#D9DDD9] pt-12 pb-16 text-sm text-[#55616B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Mission Column */}
          <div className="md:col-span-6 space-y-4">
            <BrandLogo size="md" />
            <p className="max-w-md text-sm text-[#55616B] leading-relaxed">
              Leqad brings guided lessons and contextual help into your CAD workflow, helping beginners learn the tools and understand the decisions behind their designs. Starting with Onshape.
            </p>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#0E2943] bg-[#F5EFE7] px-2.5 py-1 rounded border border-[#D9DDD9]">
              <span className="w-2 h-2 rounded-full bg-[#B74B21]" />
              <span>Independent CAD Education System</span>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase text-[#0E2943] tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#0E2943] transition-colors cursor-pointer"
                >
                  Product Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('demo');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#B74B21] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Interactive Demo</span>
                  <span className="font-mono text-[9px] bg-[#B74B21]/10 text-[#B74B21] px-1 rounded">
                    8-step
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('partners');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#0E2943] transition-colors cursor-pointer"
                >
                  For Partners & Educators
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Inquiries Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase text-[#0E2943] tracking-wider">
              Collaboration
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#0E2943] text-[#B74B21] font-medium transition-colors cursor-pointer"
                >
                  Start a conversation →
                </button>
              </li>
              <li className="text-xs text-[#55616B]">
                Exploring educational pilots, platform alignment, and robotics team test programs.
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-[#D9DDD9] space-y-3">
          <p className="text-xs text-[#55616B] leading-relaxed max-w-4xl">
            {LEGAL_DISCLAIMER}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#55616B]/80 font-mono">
            <span>© {new Date().getFullYear()} Leqad. All rights reserved.</span>
            <span>Production prototype · Built for high responsiveness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
