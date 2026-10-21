import React from 'react';
import { DemoWorkbench } from './DemoWorkbench';
import { PageRoute } from '../../types';
import { 
  ArrowLeft, 
  HelpCircle, 
  Eye, 
  Keyboard, 
  Info,
  ShieldAlert
} from 'lucide-react';

interface DemoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col animate-fadeIn">
      {/* Dedicated App-like Top Workspace Bar */}
      <div className="bg-white border-b border-[#D9DDD9] sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Home + Workspace title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E2943] hover:text-[#B74B21] px-2.5 py-1.5 rounded-md hover:bg-[#FAF8F4] border border-[#D9DDD9] transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943]"
              title="Return to Leqad home"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B74B21]" />
              <span>Back to Home</span>
            </button>

            <div className="h-4 w-[1px] bg-[#D9DDD9] hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-[#0E2943]">
                CAD Learning Workspace
              </span>
              <span className="hidden md:inline font-mono text-[11px] text-[#55616B]">
                · Lesson 01: Your First Sketch
              </span>
            </div>
          </div>

          {/* Right: Platform-Neutral Simulated Illustration Indicator */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#55616B] bg-[#FAF8F4] px-2.5 py-1 rounded border border-[#D9DDD9]">
              <Info className="w-3.5 h-3.5 text-[#B74B21] flex-shrink-0" />
              <span>Simulated illustration · Not connected to a live CAD environment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Workspace (Primary Focus) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 w-full space-y-4">
        {/* Core Interactive Workbench (Simulated CAD Canvas on left + Leqad Teaching Panel on right) */}
        <div className="bg-white rounded-2xl border border-[#D9DDD9] shadow-sm p-3 sm:p-4 lg:p-5">
          <DemoWorkbench
            initialStepIndex={0}
            isHeroPreview={false}
            enableKeyboardShortcuts={true}
          />
        </div>

        {/* Compact Software Status & Keyboard Controls Strip */}
        <div className="bg-white px-4 py-3 rounded-xl border border-[#D9DDD9] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-[#55616B] font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-[#0E2943] font-semibold">
              <Keyboard className="w-3.5 h-3.5 text-[#B74B21]" />
              <span>Shortcuts:</span>
            </span>
            <span><strong className="text-[#0E2943]">→ / N</strong> Next Step</span>
            <span><strong className="text-[#0E2943]">← / P</strong> Previous Step</span>
            <span><strong className="text-[#0E2943]">R</strong> Reset Demo</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#55616B]">
            <span className="flex items-center gap-1 text-[#0E2943]">
              <Eye className="w-3 h-3 text-[#B74B21]" />
              <span>"Show me" highlights tools in ribbon</span>
            </span>
            <span className="hidden sm:inline text-[#D9DDD9]">|</span>
            <span className="hidden sm:inline">Tiered hints reveal progressively</span>
          </div>
        </div>

        {/* Contextual Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#55616B] py-2 gap-2">
          <p>
            Interested in deploying Leqad in coursework or learning labs?{' '}
            <button
              onClick={() => onNavigate('partners')}
              className="text-[#B74B21] font-medium hover:underline inline-flex items-center gap-1 cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-[#B74B21]"
            >
              <span>Explore Partnership Program</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </p>

          <button
            onClick={() => onNavigate('about')}
            className="text-[#55616B] hover:text-[#0E2943] hover:underline cursor-pointer"
          >
            Read about Leqad's architecture & vision →
          </button>
        </div>
      </div>
    </div>
  );
};
