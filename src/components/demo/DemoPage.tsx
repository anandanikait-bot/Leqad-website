import React from 'react';
import { DemoWorkbench } from './DemoWorkbench';
import { BrandLogo } from '../shared/BrandLogo';
import { PageRoute } from '../../types';
import { 
  ArrowLeft, 
  HelpCircle, 
  Eye, 
  Keyboard, 
  Info,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface DemoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col animate-fadeIn">
      {/* Dedicated App-like Top Workspace Bar */}
      <div className="bg-white border-b border-[#D9DDD9] sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back to Home + Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E2943] hover:text-[#B74B21] px-2.5 py-1.5 rounded-md hover:bg-[#FAF8F4] border border-[#D9DDD9] transition-colors cursor-pointer"
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
                · Lesson 01: Your First Sketch (8 Steps)
              </span>
            </div>
          </div>

          {/* Right: Simulated Illustration Indicator */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#55616B] bg-[#FAF8F4] px-2.5 py-1 rounded border border-[#D9DDD9]">
              <Info className="w-3.5 h-3.5 text-[#B74B21]" />
              <span>Simulated Illustration · Not connected to live Onshape</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Core Interactive Workbench (Simulated CAD Canvas on left + Leqad Teaching Panel on right) */}
        <div className="bg-white rounded-2xl border border-[#D9DDD9] shadow-sm p-3 sm:p-5">
          <DemoWorkbench
            initialStepIndex={0}
            isHeroPreview={false}
            enableKeyboardShortcuts={true}
          />
        </div>

        {/* Technical Guidance & Keyboard Control Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white p-4 rounded-xl border border-[#D9DDD9] space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-xs text-[#0E2943] font-semibold">
              <Eye className="w-4 h-4 text-[#B74B21]" />
              <span>Spatial "Show Me" Highlighting</span>
            </div>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Clicking "Show me" highlights the recognized tool in the CAD ribbon with a gentle pulse to guide your visual attention.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D9DDD9] space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-xs text-[#0E2943] font-semibold">
              <HelpCircle className="w-4 h-4 text-[#B74B21]" />
              <span>Progressive 3-Tier Hints</span>
            </div>
            <p className="text-xs text-[#55616B] leading-relaxed">
              Hints unfold sequentially: conceptual positioning, exact CAD clicks, and keyboard shortcuts, preserving self-directed learning.
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D9DDD9] space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-xs text-[#0E2943] font-semibold">
              <Keyboard className="w-4 h-4 text-[#B74B21]" />
              <span>Keyboard Navigation</span>
            </div>
            <p className="text-xs text-[#55616B] leading-relaxed font-mono">
              <span className="font-semibold text-[#0E2943]">→ / N</span> Next &bull; <span className="font-semibold text-[#0E2943]">← / P</span> Prev &bull; <span className="font-semibold text-[#0E2943]">R</span> Reset
            </p>
          </div>
        </div>

        {/* Contextual Footer Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#55616B] py-4 border-t border-[#D9DDD9] gap-3">
          <p>
            Questions on institutional deployment or curriculum integration?{' '}
            <button
              onClick={() => onNavigate('partners')}
              className="text-[#B74B21] font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Partner Program</span>
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </button>
          </p>

          <button
            onClick={() => onNavigate('about')}
            className="text-[#55616B] hover:text-[#0E2943] hover:underline cursor-pointer"
          >
            Read about Leqad's vision & roadmap →
          </button>
        </div>
      </div>
    </div>
  );
};
