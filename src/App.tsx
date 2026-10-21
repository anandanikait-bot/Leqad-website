/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageRoute } from './types';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { Hero } from './components/home/Hero';
import { AboutPage } from './components/about/AboutPage';
import { DemoPage } from './components/demo/DemoPage';
import { PartnershipOverview } from './components/partners/PartnershipOverview';
import { ContactModal } from './components/shared/ContactModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [contactTopic, setContactTopic] = useState<string>('Technical Alignment');

  const transitionTimeoutRef = useRef<number | null>(null);

  const triggerPageTransition = useCallback(() => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    setIsTransitioning(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionTimeoutRef.current = null;
    }, 200);
  }, []);

  // Synchronize hash routing so users can refresh, bookmark, or use browser Back/Forward
  useEffect(() => {
    const syncRouteFromHash = () => {
      const rawHash = window.location.hash.replace(/^#\/?/, '');
      let target: PageRoute = 'home';
      if (rawHash === 'demo') {
        target = 'demo';
      } else if (rawHash === 'about') {
        target = 'about';
      } else if (rawHash === 'partners') {
        target = 'partners';
      }

      setCurrentPage((prev) => {
        if (prev !== target) {
          triggerPageTransition();
        }
        return target;
      });
    };

    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromHash);
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [triggerPageTransition]);

  const handleNavigate = (page: PageRoute) => {
    if (page === currentPage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      return;
    }

    triggerPageTransition();
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '/' : `/${page}`;
  };

  const handleOpenContact = (topic?: string) => {
    if (topic) setContactTopic(topic);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#0E2943] selection:bg-[#B74B21]/15 selection:text-[#0E2943]">
      {/* Top Sticky Navigation */}
      <SiteHeader currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Content with smooth ~200ms page transitions */}
      <main
        className={`flex-1 transition-opacity duration-200 ease-out ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* 1. Landing Page (#/): The focused InkOrbit Hero visual centerpiece */}
        {currentPage === 'home' && (
          <div className="flex flex-col justify-center">
            <Hero onNavigate={handleNavigate} />
          </div>
        )}

        {/* 2. Interactive Demo (#/demo): Dedicated CAD learning workspace */}
        {currentPage === 'demo' && (
          <DemoPage onNavigate={handleNavigate} />
        )}

        {/* 3. About (#/about): Product details, How It Works, and transparent vision */}
        {currentPage === 'about' && (
          <AboutPage
            onNavigate={handleNavigate}
            onOpenContact={handleOpenContact}
          />
        )}

        {/* 4. For Partners (#/partners): High-credibility institutional & platform alignment */}
        {currentPage === 'partners' && (
          <PartnershipOverview onOpenContact={handleOpenContact} />
        )}
      </main>

      {/* Site Footer with Halftone Wordmark */}
      <SiteFooter
        onNavigate={handleNavigate}
        onOpenContact={() => handleOpenContact('General Inquiry')}
      />

      {/* Contact & Partnership Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultTopic={contactTopic}
      />
    </div>
  );
}
