'use client';

import { useEffect, useRef } from 'react';

/** Keeps the hero's depth layers tied to native scroll, without rendering React each frame. */
export function useHeroParallax() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | null = null;
    let start = 0;
    let height = 0;
    let previousOffset = -1;

    const update = () => {
      frame = null;
      const offset = reducedMotion.matches
        ? 0
        : Math.min(Math.max(window.scrollY - start, 0), height);

      // Stop touching styles once the hero has left the viewport.
      if (offset === previousOffset) return;
      hero.style.setProperty('--hero-scroll', `${offset.toFixed(2)}px`);
      previousOffset = offset;
    };

    const schedule = () => {
      if (!reducedMotion.matches && frame === null) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const measure = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      start = hero.getBoundingClientRect().top + window.scrollY;
      height = hero.offsetHeight;
      update();
    };

    // Initialize from the restored scroll position and remeasure at responsive breakpoints.
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(hero);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('pageshow', measure);
    reducedMotion.addEventListener('change', measure);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pageshow', measure);
      reducedMotion.removeEventListener('change', measure);
      hero.style.removeProperty('--hero-scroll');
    };
  }, []);

  return heroRef;
}
