import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';

export const ProductPreview: React.FC = () => (
  <section id="product-preview" className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
    <div data-parallax-anchor className="rounded-2xl border border-[#D9DDD9] bg-white p-3 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-2 text-xs font-medium text-[#55616B]">
          <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Static screenshot — select to try the interactive demo
        </p>
      </div>
      <Link
        to="/demo"
        aria-label="Open the interactive CAD demo from this static screenshot"
        className="group relative block overflow-hidden rounded-lg border border-[#D9DDD9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
      >
        <img
          data-parallax-travel="12" data-parallax-mobile-travel="6"
          src="/assets/cad-lesson-preview-russet.svg"
          alt="Static screenshot of the guided CAD sketch lesson and teaching panel. The pictured controls are not interactive."
          width={1182}
          height={534}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-[#0E2943] px-3 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#163859] group-focus-visible:bg-[#163859] sm:bottom-4 sm:right-4">
          <span className="inline-flex items-center gap-2">
            Open interactive demo
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </Link>
      <p className="mt-3 text-sm text-[#55616B]">First-sketch exercise · 8 guided steps</p>
    </div>
  </section>
);
