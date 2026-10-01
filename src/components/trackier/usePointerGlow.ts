'use client';

import { useEffect, useRef } from 'react';

type PointerGlowOptions = {
  selector?: string;
  xProperty?: string;
  yProperty?: string;
  opacityProperty?: string;
};

/** Shares one pointer update across nearby surfaces without React rerenders. */
export function usePointerGlow({
  selector = '[data-pointer-glow]',
  xProperty = '--pointer-x',
  yProperty = '--pointer-y',
  opacityProperty = '--pointer-opacity',
}: PointerGlowOptions = {}) {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = glowRef.current;
    if (!root) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame: number | null = null;
    let listening = false;
    let pointerX = 0;
    let pointerY = 0;

    const targets = () => root.querySelectorAll<HTMLElement>(selector);

    const clearGlow = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      targets().forEach((target) => target.style.setProperty(opacityProperty, '0'));
    };

    const updateGlow = () => {
      frame = null;
      // Read all geometry before writing styles; content changes may replace surfaces.
      const surfaces = Array.from(targets(), (target) => ({
        target,
        bounds: target.getBoundingClientRect(),
      }));

      surfaces.forEach(({ target, bounds }) => {
        const distanceX = Math.max(bounds.left - pointerX, pointerX - bounds.right, 0);
        const distanceY = Math.max(bounds.top - pointerY, pointerY - bounds.bottom, 0);
        const proximity = Math.max(0, 1 - Math.hypot(distanceX, distanceY) / 400);
        const opacity = proximity * proximity * (3 - 2 * proximity);

        target.style.setProperty(xProperty, `${(pointerX - bounds.left).toFixed(2)}px`);
        target.style.setProperty(yProperty, `${(pointerY - bounds.top).toFixed(2)}px`);
        target.style.setProperty(opacityProperty, opacity.toFixed(3));
      });
    };

    const movePointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame === null) frame = window.requestAnimationFrame(updateGlow);
    };

    const syncPreferences = () => {
      const enabled = finePointer.matches && !reducedMotion.matches;
      if (enabled === listening) return;

      listening = enabled;
      if (enabled) {
        root.addEventListener('pointermove', movePointer, { passive: true });
        root.addEventListener('pointerleave', clearGlow, { passive: true });
      } else {
        root.removeEventListener('pointermove', movePointer);
        root.removeEventListener('pointerleave', clearGlow);
        clearGlow();
      }
    };

    syncPreferences();
    finePointer.addEventListener('change', syncPreferences);
    reducedMotion.addEventListener('change', syncPreferences);

    return () => {
      root.removeEventListener('pointermove', movePointer);
      root.removeEventListener('pointerleave', clearGlow);
      finePointer.removeEventListener('change', syncPreferences);
      reducedMotion.removeEventListener('change', syncPreferences);
      if (frame !== null) window.cancelAnimationFrame(frame);
      targets().forEach((target) => {
        target.style.removeProperty(xProperty);
        target.style.removeProperty(yProperty);
        target.style.removeProperty(opacityProperty);
      });
    };
  }, [selector, xProperty, yProperty, opacityProperty]);

  return glowRef;
}
