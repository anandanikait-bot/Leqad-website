import type Lenis from 'lenis';

// Layered scroll depth without a second Lenis instance or GSAP.
// Only decorative elements opt in. Distances are pixel travel, never percentages,
// so text remains anchored and the page cannot turn into a scroll-jacked scene.
const MAX_TRAVEL = 24;
const clampTravel = (input: string | undefined) => {
  const value = Number(input);
  return Number.isFinite(value) ? Math.max(0, Math.min(MAX_TRAVEL, value)) : 0;
};

export function attachParallax(lenis: Lenis): () => void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-travel]'))
    .filter(element => !element.closest('[data-lenis-prevent]'))
    .map(element => ({
      element,
      // Shared stable parent for multiple independently moving decorative layers.
      anchor: element.closest<HTMLElement>('[data-parallax-anchor]') ?? element.parentElement!,
      desktopTravel: clampTravel(element.dataset.parallaxTravel),
      mobileTravel: clampTravel(element.dataset.parallaxMobileTravel ?? element.dataset.parallaxTravel),
      direction: element.dataset.parallaxDirection === '-1' ? -1 : 1,
      top: 0,
      height: 0,
      originalTransform: element.style.transform,
    }));
  if (!targets.length) return () => {};

  let active = true;
  let viewportHeight = window.innerHeight;
  let mobile = window.innerWidth < 640;

  const update = () => {
    if (!active) return;
    const scroll = window.scrollY;
    for (const target of targets) {
      // Map this section's entry-to-exit progress to a bounded centered offset.
      const progress = Math.max(0, Math.min(1,
        (scroll + viewportHeight - target.top) / (viewportHeight + target.height)));
      const travel = mobile ? target.mobileTravel : target.desktopTravel;
      const offset = (progress - 0.5) * travel * target.direction;
      const transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      if (target.element.style.transform !== transform) target.element.style.transform = transform;
    }
  };

  const measure = () => {
    if (!active) return;
    viewportHeight = window.innerHeight;
    mobile = window.innerWidth < 640;
    for (const target of targets) {
      const box = target.anchor.getBoundingClientRect();
      target.top = box.top + window.scrollY;
      target.height = box.height;
    }
    update();
  };

  // Lenis already owns scroll animation and its timing. No extra ticker/RAF.
  const unsubscribe = lenis.on('scroll', update);
  const observer = new ResizeObserver(measure);
  for (const anchor of new Set(targets.map(target => target.anchor))) observer.observe(anchor);
  window.addEventListener('resize', measure, { passive: true });
  void document.fonts.ready.then(measure);
  measure();

  return () => {
    active = false;
    unsubscribe();
    observer.disconnect();
    window.removeEventListener('resize', measure);
    for (const target of targets) target.element.style.transform = target.originalTransform;
  };
}
