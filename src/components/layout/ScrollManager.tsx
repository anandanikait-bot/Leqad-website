import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { attachParallax } from '../../lib/parallax';

export function ScrollManager() {
  const { pathname } = useLocation();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const configure = () => {
      lenis.current?.destroy();
      lenis.current = media.matches ? null : new Lenis({
        autoRaf: true,
        duration: 0.85,
        smoothWheel: true,
        syncTouch: false,
        prevent: node => Boolean(node.closest('[data-lenis-prevent]')),
      });
    };
    configure();
    media.addEventListener('change', configure);
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => {
      media.removeEventListener('change', configure);
      lenis.current?.destroy();
      lenis.current = null;
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    if (pathname !== '/about' && pathname !== '/partners') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};
    const configure = () => {
      cleanup();
      cleanup = !media.matches && lenis.current ? attachParallax(lenis.current) : () => {};
    };
    // The Lenis media listener above runs first, so this always binds to its
    // current instance when motion preferences change at runtime.
    configure();
    media.addEventListener('change', configure);
    return () => {
      media.removeEventListener('change', configure);
      cleanup();
    };
  }, [pathname]);

  return null;
}
