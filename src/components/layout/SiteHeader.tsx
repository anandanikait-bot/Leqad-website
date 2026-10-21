import React, { useState } from 'react';
import { PageRoute } from '../../types';
import { BrandLogo } from '../shared/BrandLogo';
import { Button } from '../shared/Button';
import { Menu, X, ArrowRight, ExternalLink } from 'lucide-react';

interface SiteHeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#D9DDD9] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] rounded-md transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="Leqad Home"
        >
          <BrandLogo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors cursor-pointer rounded-md px-1 py-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] ${
              currentPage === 'home'
                ? 'text-[#0E2943] font-semibold'
                : 'text-[#55616B] hover:text-[#0E2943]'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('demo')}
            className={`transition-colors cursor-pointer rounded-md px-1 py-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] flex items-center gap-1.5 ${
              currentPage === 'demo'
                ? 'text-[#B74B21] font-semibold'
                : 'text-[#55616B] hover:text-[#0E2943]'
            }`}
          >
            <span>Interactive Demo</span>
            <span className="font-mono text-[10px] bg-[#B74B21]/10 text-[#B74B21] px-1.5 py-0.5 rounded-sm">
              8 Steps
            </span>
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`transition-colors cursor-pointer rounded-md px-1 py-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] ${
              currentPage === 'about'
                ? 'text-[#0E2943] font-semibold'
                : 'text-[#55616B] hover:text-[#0E2943]'
            }`}
          >
            About
          </button>

          <button
            onClick={() => handleNavClick('partners')}
            className={`transition-colors cursor-pointer rounded-md px-1 py-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] ${
              currentPage === 'partners'
                ? 'text-[#0E2943] font-semibold'
                : 'text-[#55616B] hover:text-[#0E2943]'
            }`}
          >
            For Partners
          </button>
        </nav>

        {/* Desktop Primary Action */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="rust"
            size="sm"
            onClick={() => handleNavClick('demo')}
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore demo
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#0E2943] hover:bg-[#F5EFE7] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#D9DDD9] px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'home'
                  ? 'bg-[#F5EFE7] text-[#0E2943] font-semibold'
                  : 'text-[#55616B]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('demo')}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium flex items-center justify-between ${
                currentPage === 'demo'
                  ? 'bg-[#F5EFE7] text-[#B74B21] font-semibold'
                  : 'text-[#55616B]'
              }`}
            >
              <span>Interactive Demo</span>
              <span className="font-mono text-[9px] bg-[#B74B21]/15 text-[#B74B21] px-1.5 py-0.5 rounded">
                8 Steps
              </span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'about'
                  ? 'bg-[#F5EFE7] text-[#0E2943] font-semibold'
                  : 'text-[#55616B]'
              }`}
            >
              About Leqad
            </button>
            <button
              onClick={() => handleNavClick('partners')}
              className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                currentPage === 'partners'
                  ? 'bg-[#F5EFE7] text-[#0E2943] font-semibold'
                  : 'text-[#55616B]'
              }`}
            >
              For Partners & Educators
            </button>
          </div>

          <div className="pt-2 border-t border-[#D9DDD9]">
            <Button
              variant="rust"
              size="md"
              className="w-full justify-center"
              onClick={() => handleNavClick('demo')}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore demo →
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
