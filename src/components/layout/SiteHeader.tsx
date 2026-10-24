import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BrandLogo } from '../shared/BrandLogo';
import { Menu, X } from 'lucide-react';

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/demo', label: 'Interactive Demo' },
  { to: '/about', label: 'About' },
  { to: '/partners', label: 'For Partners' },
];

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname, key: routeKey } = useLocation();
  const menuToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setMobileMenuOpen(false); }, [routeKey]);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setMobileMenuOpen(false);
      menuToggle.current?.focus();
    };
    window.addEventListener('keydown', dismiss);
    return () => window.removeEventListener('keydown', dismiss);
  }, [mobileMenuOpen]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#D9DDD9]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-3">Skip to content</a>
      <div className="mx-auto flex h-16 w-full max-w-[1600px] min-w-0 items-center justify-between gap-4 px-4 sm:px-5 lg:px-6 2xl:px-8">
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] rounded-md transition-opacity hover:opacity-90" aria-label="Leqad Home">
          <BrandLogo size="md" className="h-[49.28px] md:h-[53.76px]" />
        </Link>
        {/* Underline grows from the center on hover or keyboard focus, and stays visible for the active page. */}
        <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm font-medium lg:flex xl:gap-8">
          {navigation.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `relative inline-flex h-11 items-center justify-center px-0.5 text-sm font-medium
                before:pointer-events-none before:absolute before:inset-x-0 before:bottom-1
                before:h-[2px] before:origin-center before:bg-[#793327]
                motion-safe:before:transition-transform motion-safe:before:duration-200 motion-safe:before:ease-out
                hover:before:scale-x-100 focus-visible:before:scale-x-100
                hover:text-[#0E2943] focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-[#0E2943] ${isActive
                  ? 'text-[#0E2943] font-semibold before:scale-x-100'
                  : 'text-[#55616B] before:scale-x-0'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button ref={menuToggle} type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden flex h-11 w-11 items-center justify-center rounded-lg text-[#0E2943] hover:bg-[#F5EFE7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="lg:hidden bg-white border-b border-[#D9DDD9] px-4 pt-3 pb-5 shadow-lg flex flex-col gap-2">
          {navigation.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              aria-current={pathname === to ? 'page' : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex min-h-11 items-center border-l-2 px-3 text-sm font-medium
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E2943]
                ${pathname === to
                  ? 'border-[#793327] bg-[#F5EFE7] text-[#0E2943]'
                  : 'border-transparent text-[#55616B] hover:bg-[#F5EFE7] hover:text-[#0E2943]'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};
