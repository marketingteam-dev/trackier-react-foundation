import type { LinkItem } from '@/lib/content/types';
export function Button({
  label,
  href,
  variant = 'primary',
  className = '',
  showArrow = true,
}: LinkItem & { variant?: 'primary' | 'secondary'; className?: string; showArrow?: boolean }) {
  // Ordinary anchors work across both WordPress and Next.js ownership boundaries.
  return (
    <a className={`button button-${variant} ${className}`} href={href}>
      {label}
      {showArrow && <span aria-hidden="true"> ↗</span>}
    </a>
  );
}
