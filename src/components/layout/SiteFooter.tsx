import React from 'react';
import { PageRoute } from '../../types';
import { LEGAL_DISCLAIMER } from '../../lib/constants';
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer';

interface SiteFooterProps {
  onNavigate: (page: PageRoute) => void;
  onOpenContact: () => void;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  onNavigate,
  onOpenContact,
}) => {
  return (
    <footer className="w-full bg-[#0E2943] text-[#F5EFE7]">
      {/* Top Pre-Footer Band: Mandatory Legal Disclaimer & Quick Route */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-5 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#F5EFE7]/70 font-mono">
        <p className="max-w-3xl leading-relaxed text-[11px] sm:text-xs">
          {LEGAL_DISCLAIMER}
        </p>
        <button
          onClick={onOpenContact}
          className="text-[#B74B21] hover:text-[#e9762b] font-semibold transition-colors cursor-pointer whitespace-nowrap text-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#B74B21]"
        >
          Prepare an Inquiry →
        </button>
      </div>

      {/* Interactive Halftone Wordmark Canvas (single semantic footer landmark) */}
      <HalftoneWordmarkFooter
        as="div"
        wordmark="leqad"
        label="Leqad CAD"
        meta="©2026 · In-Workflow CAD Education"
        palette={{
          background: "#0E2943",
          ink: "#F5EFE7",
          warm: "#B74B21",
        }}
        columns={[
          {
            title: "Explore",
            links: [
              { label: "Home", href: "#/" },
              { label: "Interactive Demo", href: "#/demo" },
              { label: "About Leqad", href: "#/about" },
            ],
          },
          {
            title: "Learn",
            links: [
              { label: "Your First Sketch", href: "#/demo" },
              { label: "How It Works", href: "#/about" },
              { label: "Product Roadmap", href: "#/about" },
            ],
          },
          {
            title: "Connect",
            links: [
              { label: "For Partners", href: "#/partners" },
              { label: "Collaboration Opportunities", href: "#/partners" },
              { label: "GitHub Project", href: "https://github.com/anandanikait-bot/Leqad-website" },
            ],
          },
        ]}
        grain={0.25}
        dotGap={7}
        height="clamp(220px, 24vw, 310px)"
        crop={0}
        backToTop={true}
      />
    </footer>
  );
};
