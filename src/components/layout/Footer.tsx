import type { SiteSettings } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';

export function Footer({ site }: { site: SiteSettings }) {
  return <footer className="site-footer"><Container>
    <div className="footer-grid"><div><a className="brand" href="/">{site.name}</a><p className="footer-description">{site.footer.description}</p></div>
      {site.footer.columns.map((column, index) => <nav aria-label={column.title} key={`${column.title}-${index}`}><h2 className="footer-title">{column.title}</h2><ul>{column.links.map((link, linkIndex) => <li key={`${link.href}-${linkIndex}`}><a href={link.href}>{link.label}</a></li>)}</ul></nav>)}
    </div>
    <div className="footer-bottom"><p>{site.footer.copyright}</p>{site.footer.socialLinks.length > 0 && <nav aria-label="Social links"><ul className="social-links">{site.footer.socialLinks.map((link) => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}</ul></nav>}</div>
  </Container></footer>;
}
