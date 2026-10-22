import type Lenis from 'lenis';

// One subscription to the existing scroll controller. Transforms never affect
// the measured parent boxes, and scrolling only reads cached layout geometry.
export function attachParallax(lenis: Lenis): () => void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-travel]'))
    .filter(element => !element.closest('[data-lenis-prevent]'))
    .map(element => ({
      element,
      anchor: element.parentElement!,
      travel: Math.min(16, Math.max(0, Number(element.dataset.parallaxTravel) || 0)),
      top: 0,
      height: 0,
      originalTransform: element.style.transform,
    }));
  if (!targets.length) return () => {};
  let active = true;
  let viewportHeight = window.innerHeight;
  const update = () => {
    const scroll = window.scrollY;
    for (const target of targets) {
      const progress = Math.max(0, Math.min(1, (scroll + viewportHeight - target.top) / (viewportHeight + target.height)));
      const transform = `translate3d(0, ${((progress - .5) * target.travel).toFixed(2)}px, 0)`;
      if (target.element.style.transform !== transform) target.element.style.transform = transform;
    }
  };
  const measure = () => {
    if (!active) return;
    viewportHeight = window.innerHeight;
    for (const target of targets) {
      const box = target.anchor.getBoundingClientRect();
      target.top = box.top + window.scrollY;
      target.height = box.height;
    }
    update();
  };
  const unsubscribe = lenis.on('scroll', update);
  const observer = new ResizeObserver(measure);
  observer.observe(document.body);
  for (const target of targets) observer.observe(target.anchor);
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
