import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';

export const CurrentProductAndVision: React.FC = () => (
  <section id="product-status" className="scroll-mt-20 border-t border-[#D9DDD9] bg-[#FAF8F4] py-14 sm:py-16">
    <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Product status"
        title="Where Leqad stands today."
      />

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <article className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0E2943]">Try the demo</h3>
          <p className="text-base leading-relaxed text-[#55616B]">
            Try an eight-step website demo to draw a rectangle, set its size, and preview a 3D part. Get hints and explanations along the way.
          </p>
        </article>

        <article className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0E2943]">Still in development</h3>
          <p className="text-base leading-relaxed text-[#55616B]">
            Leqad is in development as a browser extension, starting with Onshape. The interactive demo is a simulation, not a live Onshape connection. Live compatibility and learning results have not been verified.
          </p>
        </article>

        <article className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0E2943]">What's next</h3>
          <p className="text-base leading-relaxed text-[#55616B]">
            We plan to test Onshape compatibility, add more exercises, and get feedback from learners and educators.
          </p>
        </article>
      </div>
    </div>
  </section>
);
