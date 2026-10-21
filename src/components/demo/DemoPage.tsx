import React from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { DemoWorkbench } from './DemoWorkbench';
import { 
  Keyboard, 
  HelpCircle, 
  Eye, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  ArrowLeft
} from 'lucide-react';
import { PageRoute } from '../../types';

interface DemoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const DemoPage: React.FC<DemoPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-mono text-[#55616B] hover:text-[#0E2943] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Overview</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-[#0E2943] font-medium">
            Interactive Walkthrough Active
          </span>
        </div>
      </div>

      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-2.5 py-0.5 rounded-sm border border-[#B74B21]/20">
            Interactive Walkthrough
          </span>
          <span className="font-mono text-xs text-[#55616B]">· 8 Steps · Pure Parametric CAD</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0E2943]">
          See how guided CAD learning works.
        </h1>

        <p className="text-base sm:text-lg text-[#55616B] max-w-3xl leading-relaxed">
          Explore an illustrative version of Leqad's beginner lesson and the kinds of guidance it provides. Test the progressive hints, tool recognition, and engineering rationale without installing the extension.
        </p>
      </div>

      {/* Main Interactive Workstation */}
      <div className="bg-white rounded-2xl border border-[#D9DDD9] shadow-sm p-3 sm:p-6">
        <DemoWorkbench initialStepIndex={0} isHeroPreview={false} />
      </div>

      {/* Interactive Feature Guides & Shortcuts Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-[#0E2943] font-semibold">
            <Eye className="w-4 h-4 text-[#B74B21]" />
            <span>Show Me Tool Highlighting</span>
          </div>
          <p className="text-xs text-[#55616B] leading-relaxed">
            Clicking "Show me" in the teaching panel highlights the recognized tool in the CAD ribbon with a pulsating halo, guiding spatial discovery.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-[#0E2943] font-semibold">
            <HelpCircle className="w-4 h-4 text-[#B74B21]" />
            <span>Progressive 3-Tier Hints</span>
          </div>
          <p className="text-xs text-[#55616B] leading-relaxed">
            Hints unfold gradually: from high-level spatial hints, to exact mouse actions and keyboard shortcuts, preventing cognitive overload.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#D9DDD9] space-y-2">
          <div className="flex items-center gap-2 font-mono text-xs text-[#0E2943] font-semibold">
            <Keyboard className="w-4 h-4 text-[#B74B21]" />
            <span>Keyboard Shortcuts</span>
          </div>
          <p className="text-xs text-[#55616B] leading-relaxed font-mono">
            <strong>→ / N</strong> Next step &bull; <strong>← / P</strong> Prev &bull; <strong>R</strong> Reset
          </p>
        </div>
      </div>
    </div>
  );
};
