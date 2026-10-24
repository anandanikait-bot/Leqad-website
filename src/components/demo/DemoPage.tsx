import React from 'react';
import { DemoWorkbench } from './DemoWorkbench';

export const DemoPage: React.FC = () => (
  <section className="mx-auto w-full min-w-0 max-w-[1600px] px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6 2xl:px-8" aria-labelledby="demo-title">
    <h1 id="demo-title" className="sr-only">Interactive CAD walkthrough</h1>
    <div className="min-w-0 rounded-xl border border-[#D9DDD9] bg-white p-2 shadow-sm sm:rounded-2xl sm:p-3 xl:p-4">
      <DemoWorkbench initialStepIndex={0} isHeroPreview={false} enableKeyboardShortcuts={true} />
    </div>
    <p className="mt-3 text-center text-xs leading-relaxed text-[#55616B]">Simulation · Not connected to live CAD</p>
  </section>
);
