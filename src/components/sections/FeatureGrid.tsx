import type { MarketingPage } from '@/lib/content/types';
import { Section } from '@/components/ui/Section';
export function FeatureGrid({ content }: { content: MarketingPage['features'] }) {
  if (!content.items.length) return null;
  return <Section id="features" labelledBy="features-heading"><p className="eyebrow">The building blocks</p><h2 id="features-heading" className="section-heading">{content.heading}</h2><div className="feature-grid">{content.items.map((item, index) => <article className="feature-card" key={`${item.title}-${index}`}><span className="feature-number" aria-hidden="true">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></Section>;
}
