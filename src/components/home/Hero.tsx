import React, { useState, useEffect } from 'react';
import { ButtonLink } from '../shared/Button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CadArtwork3D } from './CadArtwork3D';
import { SonarHeroGrid } from './SonarHeroGrid';

const CYCLING_PHRASES = [
  'building, not just watching.',
  'designing with guidance.',
  'understanding every step.',
];

export const Hero: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Cycle phrases every 4 seconds with smooth blur transition & proper timer cleanup
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let timeoutId: number | undefined;

    const intervalId = window.setInterval(() => {
      // Step 1: Blur out
      setIsTransitioning(true);

      // Step 2: Swap phrase & blur back in
      timeoutId = window.setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % CYCLING_PHRASES.length);
        setIsTransitioning(false);
      }, 400);
    }, 4000);

    return () => {
      clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="relative flex w-full flex-1 flex-col justify-center py-10 sm:py-12 lg:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background subtle technical grid */}
      <SonarHeroGrid />

      {/* Two-Column Split Layout (50% / 50% on desktop) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side — Content (col-span-6 on lg screens: 50% width) */}
        <div className="lg:col-span-6 space-y-6 text-center">
          {/* Main Headline with Cycling Serif Phrase */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#0E2943] leading-[1.12]">
              Learn CAD by
            </h1>
            {/* Reserved fixed vertical height so text transitions never shift CTA buttons */}
            <div className="h-[5.5rem] sm:h-[6.5rem] lg:h-[8rem] flex items-center justify-center">
              <span
                className={`font-serif italic text-2xl sm:text-3xl lg:text-[42px] text-[#0E2943] leading-snug tracking-tight transition-all duration-400 ease-out inline-block ${
                  isTransitioning
                    ? 'opacity-0 blur-md translate-y-2'
                    : 'opacity-100 blur-none translate-y-0'
                }`}
              >
                {CYCLING_PHRASES[phraseIndex]}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#55616B] leading-relaxed max-w-xl mx-auto">
            Leqad helps you learn CAD by building. Follow guided lessons, find the right tools, and understand why each design step matters.
          </p>

          {/* Buttons: Stack on mobile, inline on sm+ */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
            <ButtonLink
              variant="rust"
              size="lg"
              to="/demo"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Interactive Demo
            </ButtonLink>

            <Link
              to="/about"
              className="text-sm font-medium text-[#55616B] hover:text-[#0E2943] py-2.5 px-4 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#D9DDD9] bg-white hover:bg-[#F5EFE7]/50 shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943]"
            >
              <span>Learn About Leqad</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#55616B]" />
            </Link>
          </div>


        </div>

        {/* Right Side — Interactive 3D Artwork (col-span-6 on lg screens: 50% width) */}
        <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[560px]">
            <CadArtwork3D />
          </div>
        </div>
      </div>
    </section>
  );
};
