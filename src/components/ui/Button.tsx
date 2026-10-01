import type { LinkItem } from '@/lib/content/types';
export function Button({ label, href, variant = 'primary' }: LinkItem & { variant?: 'primary' | 'secondary' }) {
  // Ordinary anchors work across both WordPress and Next.js ownership boundaries.
  return <a className={`button button-${variant}`} href={href}>{label}<span aria-hidden="true"> ↗</span></a>;
}
