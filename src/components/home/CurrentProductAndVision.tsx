import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';

export const CurrentProductAndVision: React.FC = () => (
  <section id="product-status" className="scroll-mt-20 border-t border-[#D9DDD9] bg-[#FAF8F4] py-14 sm:py-16">
    <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Product status"
        title="An early prototype, with a focused next step."
      />

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        <article className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0E2943]">What exists today</h3>
          <p className="text-base leading-relaxed text-[#55616B]">
            An early browser-extension learning-assistant prototype targets Onshape.
            The website demo is a separate eight-step simulation of sketching and extrusion,
            including the preview shown above.
          </p>
          <p className="text-base leading-relaxed text-[#55616B]">
            The simulation offers guided first-sketch practice, contextual hints, tool
            highlighting, and explanations for key modeling decisions.
          </p>
        </article>

        <article className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0E2943]">What remains unverified</h3>
          <p className="text-base leading-relaxed text-[#55616B]">
            Live Onshape compatibility remains unverified. The extension does not verify CAD
            geometry, and the website demo is not connected to a live CAD document.
          </p>
          <p className="text-base leading-relaxed text-[#55616B]">
            Generalized design understanding and learning improvements from real user
            studies have not been demonstrated.
          </p>
        </article>

        <article className="space-y-4">
          <h3 className="text-xl font-semibold text-[#0E2943]">What is planned</h3>
          <p className="text-base leading-relaxed text-[#55616B]">
            Expanded exercises, improved feedback and contextual learning, and educator
            evaluations are planned. Delivery depends on technical validation and feedback.
          </p>
          <p className="text-base leading-relaxed text-[#55616B]">
            Broader technical capabilities, including help with troubleshooting and reasoning
            about designs, are a longer-term goal.
          </p>
        </article>
      </div>
    </div>
  </section>
);
