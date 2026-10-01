import type { MarketingPage } from '@/lib/content/types';
import { Section } from '@/components/ui/Section';
export function FAQ({ content }: { content: MarketingPage['faq'] }) {
  if (!content.items.length) return null;
  return <Section id="faq" className="faq-section" labelledBy="faq-heading"><div className="faq-grid"><div><p className="eyebrow">Common questions</p><h2 id="faq-heading" className="section-heading">{content.heading}</h2></div><div>{content.items.map((item, index) => <details className="faq-item" key={`${item.question}-${index}`}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></Section>;
}
