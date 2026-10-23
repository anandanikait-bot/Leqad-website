import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';

export const CurrentProductAndVision: React.FC = () => (
  <section className="border-t border-[#D9DDD9] bg-[#FAF8F4] py-14 sm:py-16">
    <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Product status"
        title="What exists today—and what is still an idea."
        description="Leqad is an independent early-stage prototype. The extension and the website demonstration serve different purposes."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-[#0E2943] bg-white p-6 sm:p-8 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0E2943]">
            Today · Prototype and illustration
          </span>
          <h3 className="text-xl font-semibold text-[#0E2943]">Guided practice and local hints</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            The browser-extension prototype explores instruction and local cues for supported
            interface controls. The separate website demo offers an eight-step simulated
            sketch-to-extrude lesson with editable dimensions.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#0E2943]">
            <li>Guided steps with optional hints and explanations</li>
            <li>Local tool highlighting for supported controls in the extension prototype</li>
            <li>Website lesson tested with automated navigation, interaction, and dimension checks</li>
          </ul>
          <p className="border-t border-[#D9DDD9] pt-4 text-xs leading-relaxed text-[#55616B]">
            These checks test software behavior, not student learning. Neither the extension
            nor the website illustration currently verifies real CAD geometry.
          </p>
        </article>

        <article className="rounded-2xl border border-[#D9DDD9] bg-white/80 p-6 sm:p-8 space-y-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21]">
            Future · Areas to investigate
          </span>
          <h3 className="text-xl font-semibold text-[#0E2943]">More useful feedback, if feasible</h3>
          <p className="text-sm leading-relaxed text-[#55616B]">
            Future work may explore stronger contextual feedback, new guided exercises, and
            ways for educators to assess usefulness. None of these are shipping capabilities.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#55616B]">
            <li>Research whether authorized CAD APIs can support reliable model feedback</li>
            <li>Evaluate guided exercises with interested educators</li>
            <li>Explore broader platform compatibility only where technically permitted</li>
          </ul>
          <p className="border-t border-[#D9DDD9] pt-4 text-xs leading-relaxed text-[#55616B]">
            Development depends on technical feasibility, platform permissions, and actual evaluation results.
          </p>
        </article>
      </div>
    </div>
  </section>
);
