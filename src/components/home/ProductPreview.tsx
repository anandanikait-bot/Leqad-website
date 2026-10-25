import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// This is an editorial explanation, not a screenshot or a second CAD interface.
export const ProductPreview: React.FC = () => (
  <section id="product-preview" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
    <div data-parallax-anchor className="rounded-2xl border border-[#D9DDD9] bg-[#FAF8F4] p-4 sm:p-6 lg:p-8">
      <div className="grid min-w-0 items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)] lg:gap-10">
        <figure className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-[#D9DDD9] bg-[#EDF1F3]">
            <img
              data-parallax-travel="12"
              data-parallax-mobile-travel="6"
              src="/assets/cad-lesson-illustration.svg"
              alt="Simplified 2D CAD diagram: a 40 by 30 millimeter rectangle with X and Y axes and a marked origin."
              width={780}
              height={440}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="mt-2 text-xs text-[#55616B]">Illustration · 40 × 30 mm sketch</figcaption>
        </figure>

        <div className="min-w-0 space-y-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#793327]">
            Guided CAD practice
          </p>
          <h3 className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-[#0E2943] sm:text-3xl">
            Start with a rectangle.
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-[#55616B] sm:text-base">
            Choose a plane, draw a rectangle, set its size, and preview a 3D shape.
          </p>
          <Link
            to="/demo"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0E2943] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#163859] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
          >
            Try the interactive demo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);
