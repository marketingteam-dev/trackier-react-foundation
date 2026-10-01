'use client';

import { usePointerGlow } from './usePointerGlow';

export function useFaqGlow() {
  return usePointerGlow({
    selector: '[data-faq-glow]',
    xProperty: '--faq-pointer-x',
    yProperty: '--faq-pointer-y',
    opacityProperty: '--faq-glow-opacity',
  });
}
