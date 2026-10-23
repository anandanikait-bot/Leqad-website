import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CadArtwork3D } from './CadArtwork3D';
import { SonarHeroGrid } from './SonarHeroGrid';

// Render the default CTA during SSR as well as on the client.
// WebGL initialization still happens only in MetallicButton's browser effect.
import { MetallicButton } from '../ui/metallic-button';

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
    <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center overflow-hidden px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14">
      {/* Background subtle technical grid */}
      <SonarHeroGrid />

      {/* Two-Column Split Layout (50% / 50% on desktop) */}
      <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Left Side — Content (col-span-6 on lg screens: 50% width) */}
        <div className="space-y-7 text-left lg:col-span-6">
          {/* Editorial hierarchy: a quiet signal above the main message. */}
          <div className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#55616B] sm:text-xs">
            <span className="h-px w-7 bg-[#B74B21]" aria-hidden="true" />
            CAD learning / first sketch
          </div>
          {/* The existing dynamic line remains screen-reader visible and motion-safe. */}
          <div className="space-y-1">
            <h1 className="text-[clamp(2.8rem,5vw,4.7rem)] font-semibold tracking-[-0.055em] text-[#0E2943] leading-[1.02]">
              Learn CAD by
            </h1>
            {/* Reserved fixed vertical height so text transitions never shift CTA buttons */}
            <div className="flex min-h-[6.25rem] items-center justify-start sm:min-h-[7rem] lg:min-h-[8.75rem]">
              <span
                className={`font-serif text-[clamp(1.65rem,3.4vw,3.45rem)] text-[#0E2943] leading-[1.11] tracking-[-0.045em] transition-all duration-400 ease-out inline-block ${
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
          <p className="max-w-[31rem] text-base leading-relaxed text-[#55616B] sm:text-lg">
            Leqad is a browser-extension learning assistant prototype, starting with Onshape. Practice a guided first-sketch exercise with step-by-step hints and explanations in the interactive demo.
          </p>

          {/* Buttons: Stack on mobile, inline on sm+ */}
          <div className="flex flex-col items-stretch gap-3.5 pt-2 sm:flex-row sm:items-center sm:justify-start">
            <MetallicButton
              to="/demo"
              label="Explore Interactive Demo"
              className="w-full sm:w-[270px] shrink-0"
              baseColor="#B74B21"
              sheenColor="#F5EFE799"
              bandCount={3}
              edgeBlur={0.7}
              redFringe={0.12}
              blueFringe={0.08}
              idleSpeed={0.5}
              hoverSpeed={0.8}
              clickSpeed={1.4}
            />

            <Link
              to="/about"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-[#0E2943] underline decoration-[#B74B21]/35 underline-offset-4 transition-colors hover:decoration-[#B74B21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
            >
              <span>Learn About Leqad</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#B74B21] transition-transform motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>


        </div>

        {/* Right Side — Interactive 3D Artwork (col-span-6 on lg screens: 50% width) */}
        <div className="flex w-full justify-center lg:col-span-6 lg:justify-end">
          <div className="w-full max-w-[560px] space-y-3">
            <CadArtwork3D />
            <div className="flex items-center justify-between gap-4 px-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#55616B]">
              <span>01 / Learn through geometry</span>
              <span className="hidden sm:inline">Illustrative model · not live CAD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
