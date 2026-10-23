import React from 'react';
import { ButtonLink } from '../shared/Button';
import { ArrowRight } from 'lucide-react';

export const ProductPreview: React.FC = () => (
  <section id="product-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
    <div data-parallax-anchor className="rounded-2xl border border-[#D9DDD9] bg-white p-3 shadow-sm sm:p-5">
      <img
        data-parallax-travel="12" data-parallax-mobile-travel="6"
        src="/assets/cad-lesson-preview.png"
        alt="Leqad interactive demo preview: an illustrated CAD reference plane beside the first-sketch teaching panel."
        width={1182}
        height={534}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-lg border border-[#D9DDD9]"
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#55616B]">First-sketch exercise · 8 guided steps</p>
        <ButtonLink to="/demo" variant="rust" size="sm" icon={<ArrowRight className="h-4 w-4" />}>Explore Interactive Demo</ButtonLink>
      </div>
    </div>
  </section>
);
