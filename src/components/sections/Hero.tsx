import Image from 'next/image';
import type { MarketingPage } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Hero({ content }: { content: MarketingPage['hero'] }) {
  return <section className="hero" aria-labelledby="hero-heading"><Container className={`hero-grid ${!content.image ? 'hero-text-only' : ''}`}><div>
    <p className="eyebrow"><span className="status-dot" aria-hidden="true" />{content.eyebrow}</p>
    <h1 id="hero-heading">{content.heading}</h1><p className="hero-description">{content.description}</p>
    <div className="button-row"><Button {...content.primaryCta} />{content.secondaryCta && <Button {...content.secondaryCta} variant="secondary" />}</div>
  </div>{content.image && <div className="hero-art"><Image src={content.image.url} alt={content.image.alt} width={content.image.width} height={content.image.height} sizes="(max-width: 800px) 100vw, 50vw" preload unoptimized={content.image.url.startsWith('/react-assets/') && content.image.url.endsWith('.svg')} /></div>}</Container></section>;
}
