import React from 'react';
import { ButtonLink } from '../shared/Button';
import { ArrowRight } from 'lucide-react';

export const ProductPreview: React.FC = () => (
  <section id="product-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
    <div className="rounded-2xl border border-[#D9DDD9] bg-white p-3 shadow-sm sm:p-5">
      <img
        src="/assets/cad-lesson-preview.png"
        alt="Static Leqad product preview: a CAD reference plane beside the teaching panel, with the instruction to start a sketch."
        width={1182}
        height={520}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-lg border border-[#D9DDD9]"
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#55616B]">A preview of the illustrated lesson. Try the walkthrough on the demo page.</p>
        <ButtonLink to="/demo" variant="rust" size="sm" icon={<ArrowRight className="h-4 w-4" />}>Explore Full Demo</ButtonLink>
      </div>
    </div>
  </section>
);
