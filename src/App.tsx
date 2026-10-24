import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { Hero } from './components/home/Hero';
import { AboutPage } from './components/about/AboutPage';
import { DemoPage } from './components/demo/DemoPage';
import { PartnershipOverview } from './components/partners/PartnershipOverview';
import { ContactModal } from './components/shared/ContactModal';
import { ScrollManager } from './components/layout/ScrollManager';
import { legacyDestination } from './lib/routes';
import { renderHead } from './lib/seo';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactTopic, setContactTopic] = useState('Technical Alignment');
  const [contactDraft, setContactDraft] = useState('');

  useEffect(() => {
    const destination = legacyDestination(location.hash);
    if (destination) navigate(destination + location.search, { replace: true });
  }, [location.hash, location.search, navigate]);

  useEffect(() => {
    const template = document.createElement('template');
    template.innerHTML = renderHead(location.pathname);
    document.head.querySelectorAll('[data-route-head]').forEach(element => element.remove());
    document.head.append(template.content);
    setIsContactOpen(false);
  }, [location.pathname]);

  const handleOpenContact = (topic?: string, draftMessage?: string) => {
    setContactTopic(topic || 'General Inquiry');
    setContactDraft(draftMessage || '');
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-[#FAF8F4] text-[#0E2943] selection:bg-[#793327]/15 selection:text-[#0E2943]">
      <ScrollManager />
      {!isHomePage && <SiteHeader />}
      <main id="main-content" className={isHomePage ? 'flex flex-1 flex-col' : 'flex-1'}>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/about" element={<AboutPage onOpenContact={handleOpenContact} />} />
          <Route path="/partners" element={<PartnershipOverview onOpenContact={handleOpenContact} />} />
          <Route path="*" element={<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h1 className="text-3xl font-bold">Page not found</h1><Link to="/" className="mt-4 inline-block underline">Return to Leqad home</Link></section>} />
        </Routes>
      </main>
      {!isHomePage && <SiteFooter />}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} defaultTopic={contactTopic} defaultMessage={contactDraft} />
    </div>
  );
}
