import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BrandLogo } from '../shared/BrandLogo';
import { Menu, X } from 'lucide-react';

const navigation = [
  { to: '/demo', label: 'Interactive Demo' },
  { to: '/about', label: 'About' },
  { to: '/partners', label: 'For Partners' },
];

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#D9DDD9]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-3">Skip to content</a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] rounded-md transition-opacity hover:opacity-90" aria-label="Leqad Home">
          <BrandLogo size="md" />
        </Link>
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navigation.map(({ to, label }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `transition-colors rounded-md px-1 py-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] ${isActive ? (to === '/demo' ? 'text-[#B74B21] font-semibold' : 'text-[#0E2943] font-semibold') : 'text-[#55616B] hover:text-[#0E2943]'}`}>{label}</NavLink>
          ))}
        </nav>
        <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-md text-[#0E2943] hover:bg-[#F5EFE7] focus-visible:ring-2 focus-visible:ring-[#0E2943]" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="lg:hidden bg-white border-b border-[#D9DDD9] px-4 pt-3 pb-5 shadow-lg flex flex-col gap-2">
          {navigation.map(({ to, label }) => <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)} className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === to ? 'bg-[#F5EFE7] text-[#0E2943]' : 'text-[#55616B]'}`}>{label}</Link>)}
        </nav>
      )}
    </header>
  );
};
