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
          className="text-[#B74B21] hover:text-[#e9762b] font-semibold transition-colors cursor-pointer whitespace-nowrap text-xs"
        >
          Partnership Inquiries →
        </button>
      </div>

      {/* Interactive Halftone Wordmark Canvas Footer */}
      <HalftoneWordmarkFooter
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
            title: "Product",
            links: [
              { label: "Overview", href: "#/" },
              { label: "Your First Sketch", href: "#/demo" },
              { label: "In-Workflow Guide", href: "#/demo" },
            ],
          },
          {
            title: "Curriculum",
            links: [
              { label: "Parametric Intent", href: "#/demo" },
              { label: "Constraint Logic", href: "#/demo" },
              { label: "Watertight Profiles", href: "#/demo" },
            ],
          },
          {
            title: "Collaboration",
            links: [
              { label: "Platform Alignment", href: "#/partners" },
              { label: "Educational Pilots", href: "#/partners" },
              { label: "Start Conversation", href: "#/partners" },
            ],
          },
        ]}
        height="520px"
        backToTop={true}
      />
    </footer>
  );
};
