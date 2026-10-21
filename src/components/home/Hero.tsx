import React, { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import { ArrowRight } from 'lucide-react';
import { PageRoute } from '../../types';
import { CadArtwork3D } from './CadArtwork3D';
import { SonarHeroGrid } from './SonarHeroGrid';

interface HeroProps {
  onNavigate: (page: PageRoute) => void;
  onScrollToProductPreview?: () => void;
}

const CYCLING_PHRASES = [
  'building, not just watching.',
  'designing with guidance.',
  'understanding every step.',
];

export const Hero: React.FC<HeroProps> = ({ onNavigate, onScrollToProductPreview }) => {
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Cycle phrases every 4 seconds with smooth blur transition
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      // Step 1: Blur out
      setIsTransitioning(true);

      // Step 2: Swap phrase & blur in
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % CYCLING_PHRASES.length);
        setIsTransitioning(false);
      }, 400);
    }, 4000);

    return () => clearInterval(interval);
  }, []);


  return (
    <section className="relative pt-12 sm:pt-16 pb-14 sm:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background subtle technical grid */}
      <SonarHeroGrid />

      {/* Two-Column Split Layout (50% / 50% on desktop) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side — Content (50% width / col-span-6 on lg screens) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Small Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B74B21] bg-[#B74B21]/10 px-3 py-1 rounded-sm border border-[#B74B21]/20">
              INTERACTIVE CAD LEARNING · EARLY PROTOTYPE
            </span>
          </div>

          {/* Main Headline with Cycling Serif Phrase */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#0E2943] leading-[1.14]">
              Learn CAD by
            </h1>
            {/* Reserved vertical height container to ensure no layout jumping */}
            <div className="h-[2.5em] sm:h-[2.6em] flex items-center overflow-hidden">
              <span
                className={`font-serif italic text-3xl sm:text-4xl lg:text-[44px] text-[#0E2943] leading-snug tracking-tight transition-all duration-400 ease-out inline-block ${
                  isTransitioning
                    ? 'opacity-0 blur-md translate-y-2'
                    : 'opacity-100 blur-none translate-y-0'
                }`}
              >
                {CYCLING_PHRASES[phraseIndex]}
              </span>
            </div>
          </div>

          {/* Supporting Paragraph */}
          <p className="text-base sm:text-lg text-[#55616B] leading-relaxed max-w-xl">
            Leqad brings step-by-step lessons and contextual guidance into your CAD workflow, helping you understand what to do, how to do it, and why it matters. Starting with Onshape.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button
              variant="rust"
              size="lg"
              onClick={() => onNavigate('demo')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Interactive Demo
            </Button>

            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="text-sm font-medium text-[#55616B] hover:text-[#0E2943] py-2.5 px-4 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#D9DDD9] bg-white hover:bg-[#F5EFE7]/50 shadow-2xs"
            >
              <span>Learn About Leqad</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#55616B]" />
            </button>
          </div>

          {/* Independent Status Line */}
          <div className="pt-1">
            <p className="font-mono text-xs text-[#55616B]/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#55616B]/60" />
              <span>Early-stage extension prototype · Independent project</span>
            </p>
          </div>
        </div>

        {/* Right Side — Interactive 3D Artwork (50% width / col-span-6 on lg screens) */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[560px]">
            <CadArtwork3D />
          </div>
        </div>
      </div>
    </section>
  );
};
