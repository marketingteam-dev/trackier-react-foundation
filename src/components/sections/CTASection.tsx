import type { MarketingPage } from '@/lib/content/types';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
export function CTASection({ content }: { content: MarketingPage['cta'] }) {
  return <Section labelledBy="cta-heading"><div className="cta-panel"><div><p className="eyebrow">Keep building</p><h2 id="cta-heading">{content.heading}</h2><p>{content.description}</p></div><Button {...content.link} /></div></Section>;
}
