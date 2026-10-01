import type { MarketingPage as MarketingPageData } from '@/lib/content/types';
import { Hero } from './Hero';
import { FeatureGrid } from './FeatureGrid';
import { FAQ } from './FAQ';
import { CTASection } from './CTASection';
import { Section } from '@/components/ui/Section';

export function MarketingPage({ page }: { page: MarketingPageData }) {
  return <><Hero content={page.hero} /><FeatureGrid content={page.features} />
    {page.testimonials.length > 0 && <Section labelledBy="testimonials-heading"><h2 id="testimonials-heading">What people say</h2><div className="feature-grid">{page.testimonials.map((item, index) => <figure className="feature-card" key={index}><blockquote><p>{item.quote}</p></blockquote><figcaption>{item.name} · {item.role}</figcaption></figure>)}</div></Section>}
    <FAQ content={page.faq} /><CTASection content={page.cta} /></>;
}
