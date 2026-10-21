/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { Hero } from './components/home/Hero';
import { ProductPreview } from './components/home/ProductPreview';
import { LearningProblem } from './components/home/LearningProblem';
import { Workflow } from './components/home/Workflow';
import { CurrentPrototype } from './components/home/CurrentPrototype';
import { Audience } from './components/home/Audience';
import { Roadmap } from './components/home/Roadmap';
import { PartnershipCTA } from './components/home/PartnershipCTA';
import { DemoPage } from './components/demo/DemoPage';
import { PartnershipOverview } from './components/partners/PartnershipOverview';
import { ContactModal } from './components/shared/ContactModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [contactTopic, setContactTopic] = useState<string>('Technical Alignment');

  // Sync hash routing so users can refresh or bookmark #demo or #partners with zero lag
  useEffect(() => {
    const syncRouteFromHash = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'demo') {
        setCurrentPage('demo');
      } else if (hash === 'partners') {
        setCurrentPage('partners');
      } else {
        setCurrentPage('home');
      }
    };

    syncRouteFromHash();
    window.addEventListener('hashchange', syncRouteFromHash);
    return () => window.removeEventListener('hashchange', syncRouteFromHash);
  }, []);

  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToRoadmap = () => {
    if (currentPage !== 'home') {
      handleNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('roadmap');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      const el = document.getElementById('roadmap');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenContact = (topic?: string) => {
    if (topic) setContactTopic(topic);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#0E2943] selection:bg-[#B74B21]/15 selection:text-[#0E2943]">
      {/* Top Sticky Navigation */}
      <SiteHeader currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="space-y-0">
            {/* 1. Hero with primary CTA & vision scroll */}
            <Hero
              onNavigate={handleNavigate}
              onScrollToRoadmap={handleScrollToRoadmap}
            />

            {/* 2. Hero Interactive Visualization (The CAD workspace preview at Step 3) */}
            <ProductPreview onNavigate={handleNavigate} />

            {/* 3. The Learning Problem (3 pillars: Learn in context, Understand reason, Build independence) */}
            <LearningProblem />

            {/* 4. Product Workflow (5 selectable stages with dynamic workspace illustration) */}
            <Workflow />

            {/* 5. The Current Prototype (verified features & direct link to demo) */}
            <CurrentPrototype onNavigate={handleNavigate} />

            {/* 6. Who Leqad is for (Students, Robotics Makers, Educators) */}
            <Audience />

            {/* 7. Product Roadmap (NOW, NEXT, LATER with visual distinction) */}
            <Roadmap />

            {/* 8. Partnership Opportunity */}
            <PartnershipCTA
              onNavigate={handleNavigate}
              onOpenContact={() => handleOpenContact('Partnership Inquiry')}
            />
          </div>
        )}

        {currentPage === 'demo' && (
          /* The Main Attraction: 8-Step Interactive Walkthrough */
          <DemoPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'partners' && (
          /* For Partners & Educators */
          <PartnershipOverview onOpenContact={handleOpenContact} />
        )}
      </main>

      {/* Site Footer */}
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
