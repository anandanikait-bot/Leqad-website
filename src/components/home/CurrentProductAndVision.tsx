import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';

export const CurrentProductAndVision: React.FC = () => (
  <section id="product-status" className="scroll-mt-20 border-t border-[#D9DDD9] bg-[#FAF8F4] py-14 sm:py-16">
    <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Product status"
        title="An early prototype, with a focused next step."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-[#0E2943] bg-white p-6 sm:p-8 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E2943]">
            Early prototype
          </span>
          <h3 className="text-xl font-semibold text-[#0E2943]">First-sketch guidance</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            The browser extension provides local guidance for starting a sketch in Onshape.
            The website demo is a separate eight-step simulation of sketching and extrusion,
            including the preview shown above.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#0E2943]">
            <li>Guided first-sketch lesson</li>
            <li>Contextual hints and supported tool highlighting</li>
            <li>Engineering explanations for key modeling decisions</li>
          </ul>
          <p className="border-t border-[#D9DDD9] pt-4 text-xs leading-relaxed text-[#55616B]">
            Live Onshape compatibility remains unverified. The extension does not verify CAD
            geometry, and the website demo is not connected to a live CAD document.
          </p>
        </article>

        <article className="rounded-2xl border border-[#D9DDD9] bg-white/80 p-6 sm:p-8 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21]">
            Future direction
          </span>
          <h3 className="text-xl font-semibold text-[#0E2943]">Build on the first lesson</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            These priorities are planned, with delivery dependent on technical validation and educator feedback.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#55616B]">
            <li>Validate the extension in live Onshape workflows</li>
            <li>Add guided exercises and model feedback</li>
            <li>Evaluate the learning experience with educators</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
);
