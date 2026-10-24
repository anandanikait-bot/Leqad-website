import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CadArtwork3D } from './CadArtwork3D';
import { SonarHeroGrid } from './SonarHeroGrid';
import { BrandLogo } from '../shared/BrandLogo';

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
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const stopCycling = () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
    const updateMotion = () => {
      stopCycling();
      setIsTransitioning(false);
      setPhraseIndex(0);
      if (motionPreference.matches) return;

      intervalId = window.setInterval(() => {
        setIsTransitioning(true);
        timeoutId = window.setTimeout(() => {
          setPhraseIndex((prev) => (prev + 1) % CYCLING_PHRASES.length);
          setIsTransitioning(false);
        }, 400);
      }, 4000);
    };

    updateMotion();
    motionPreference.addEventListener('change', updateMotion);
    return () => {
      stopCycling();
      motionPreference.removeEventListener('change', updateMotion);
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
          <BrandLogo size="sm" />
          {/* One stable heading name; the rotating phrase is a visual accent. */}
          <div className="space-y-1">
            <h1 aria-label="Learn CAD by building." className="text-[clamp(2.8rem,5vw,4.7rem)] font-semibold tracking-[-0.055em] text-[#0E2943] leading-[1.02]">
              Learn CAD by
            </h1>
            {/* Reserved fixed vertical height so text transitions never shift CTA buttons */}
            <div className="flex min-h-[6.25rem] items-center justify-start sm:min-h-[7rem] lg:min-h-[8.75rem]">
              <span
                aria-hidden="true"
                className={`font-serif hero-rotating-phrase italic text-2xl sm:text-3xl lg:text-[42px] text-[#0E2943] leading-snug tracking-tight motion-reduce:transition-none transition-all duration-400 ease-out inline-block ${
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
            Leqad is a browser-extension learning assistant in development, starting with Onshape. Try guided first-sketch practice in a separate website simulation.
          </p>

          {/* Buttons: Stack on mobile, inline on sm+ */}
          <div className="flex flex-col items-stretch gap-3.5 pt-2 sm:flex-row sm:items-center sm:justify-start">
            <MetallicButton
              to="/demo"
              label="Explore Interactive Demo"
              shape="rounded"
              className="w-full sm:w-[270px] lg:w-[230px] xl:w-[270px] shrink-0"
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
              className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-[#0E2943] underline decoration-[#B74B21]/35 underline-offset-4 transition-colors hover:decoration-[#B74B21] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]"
            >
              <span>Learn About Leqad</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#B74B21] transition-transform motion-safe:group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Side — Interactive 3D Artwork (col-span-6 on lg screens: 50% width) */}
        <div className="flex w-full justify-center lg:col-span-6 lg:justify-end">
          <div className="w-full max-w-[560px]">
            <CadArtwork3D />
          </div>
        </div>
      </div>
    </section>
  );
};
