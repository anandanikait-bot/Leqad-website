import React from 'react';
import { DemoWorkbench } from './DemoWorkbench';

export const DemoPage: React.FC = () => (
  <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8" aria-labelledby="demo-title">
    <h1 id="demo-title" className="sr-only">Interactive CAD walkthrough</h1>
    <div className="rounded-2xl border border-[#D9DDD9] bg-white p-2.5 shadow-sm sm:p-4">
      <DemoWorkbench initialStepIndex={0} isHeroPreview={false} enableKeyboardShortcuts={true} />
    </div>
    <p className="mt-3 text-center text-xs leading-relaxed text-[#55616B]">Simulation · Not connected to live CAD</p>
  </section>
);
