import type { ReactNode } from 'react';
import { Container } from './Container';
export function Section({ children, id, className = '', labelledBy }: { children: ReactNode; id?: string; className?: string; labelledBy?: string }) {
  return <section id={id} className={`section ${className}`} aria-labelledby={labelledBy}><Container>{children}</Container></section>;
}
