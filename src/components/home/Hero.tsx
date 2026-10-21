import React from 'react';
import { Button } from '../shared/Button';
import { ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { PageRoute } from '../../types';

interface HeroProps {
  onNavigate: (page: PageRoute) => void;
  onScrollToRoadmap: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onScrollToRoadmap }) => {
  return (
    <section className="pt-12 sm:pt-16 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
      <div className="max-w-3xl space-y-5">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
            INTERACTIVE CAD LEARNING · EARLY PROTOTYPE
          </span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#0E2943] leading-[1.12]">
          Learn CAD by building, <br className="hidden sm:inline" />
          <span className="text-[#0E2943]">not just watching.</span>
        </h1>

        {/* Supporting text */}
        <p className="text-lg sm:text-xl text-[#55616B] leading-relaxed max-w-2xl">
          Leqad brings guided lessons and contextual help into your CAD workflow, helping beginners learn the tools and understand the decisions behind their designs. Starting with Onshape.
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
          <Button
            variant="rust"
            size="lg"
            onClick={() => onNavigate('demo')}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore the guided lesson
          </Button>

          <button
            onClick={onScrollToRoadmap}
            className="text-sm font-medium text-[#55616B] hover:text-[#0E2943] py-2 px-3 rounded transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Explore the vision</span>
            <span className="text-xs font-mono">↓</span>
          </button>
        </div>

        {/* CAD Verification Disclaimer / Sub-indicator */}
        <div className="pt-4 flex items-center gap-2 text-xs text-[#55616B] font-mono">
          <ShieldCheck className="w-4 h-4 text-[#B74B21]" />
          <span>In-workflow extension prototype · Pure parametric fundamentals</span>
        </div>
      </div>
    </section>
  );
};
