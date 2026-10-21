import React from 'react';
import { DemoWorkbench } from './DemoWorkbench';
import { PageRoute } from '../../types';
import { ArrowLeft } from 'lucide-react';

interface DemoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => (
  <div className="min-h-screen bg-[#FAF8F4]">
    <div className="border-b border-[#D9DDD9] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-[#55616B] transition-colors hover:bg-[#FAF8F4] hover:text-[#0E2943] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>
        <span className="text-xs font-medium text-[#55616B]">Interactive CAD walkthrough · 8 steps</span>
      </div>
    </div>

    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-[#0E2943] sm:text-3xl">Make your first CAD sketch</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#55616B]">
          Start with the teaching panel. Follow one action at a time and watch the sketch change.
        </p>
      </div>
      <div className="rounded-2xl border border-[#D9DDD9] bg-white p-2.5 shadow-sm sm:p-4">
        <DemoWorkbench
          initialStepIndex={0}
          isHeroPreview={false}
          enableKeyboardShortcuts={true}
        />
      </div>
    </div>
  </div>
);
