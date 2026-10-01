'use client';

import Image from 'next/image';
import { useId, useRef, useState } from 'react';
import type { SiteSettings } from '@/lib/content/types';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Header({ site }: { site: SiteSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const dropdownButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  return <header className="site-header" onKeyDown={(event) => {
    if (event.key !== 'Escape') return;
    if (dropdown !== null) { dropdownButtons.current[dropdown]?.focus(); setDropdown(null); }
    else if (mobileOpen) { setMobileOpen(false); mobileButton.current?.focus(); }
  }}>
    <Container className="header-inner">
      <a className="brand" href="/" aria-label={`${site.name} home`}>
        {site.logo ? <Image src={site.logo.url} alt={site.logo.alt} width={site.logo.width} height={site.logo.height} className="brand-logo" unoptimized={site.logo.url.startsWith('/react-assets/') && site.logo.url.endsWith('.svg')} /> : <><span className="brand-mark" aria-hidden="true">t</span><span>{site.name}</span></>}
      </a>
      <button ref={mobileButton} className="nav-toggle" aria-expanded={mobileOpen} aria-controls={`${id}-navigation`} onClick={() => { setMobileOpen(!mobileOpen); setDropdown(null); }}>{mobileOpen ? 'Close menu' : 'Menu'}<span aria-hidden="true"> {mobileOpen ? '×' : '☰'}</span></button>
      <nav id={`${id}-navigation`} aria-label="Main navigation" className={`main-nav ${mobileOpen ? 'is-open' : ''}`}>
        <ul className="nav-list">
          {site.navigation.map((item, index) => <li key={`${item.href}-${index}`} className="nav-item" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setDropdown((value) => value === index ? null : value); }}>
            <div className="nav-item-heading"><a href={item.href}>{item.label}</a>
              {!!item.children?.length && <button ref={(element) => { dropdownButtons.current[index] = element; }} className="dropdown-toggle" aria-label={`Toggle ${item.label} links`} aria-expanded={dropdown === index} aria-controls={`${id}-dropdown-${index}`} onClick={() => setDropdown(dropdown === index ? null : index)}><span aria-hidden="true">⌄</span></button>}
            </div>
            {!!item.children?.length && <ul id={`${id}-dropdown-${index}`} className="dropdown" hidden={dropdown !== index}>{item.children.map((child, childIndex) => <li key={`${child.href}-${childIndex}`}><a href={child.href}>{child.label}</a></li>)}</ul>}
          </li>)}
        </ul>
        <Button {...site.headerCta} />
      </nav>
    </Container>
  </header>;
}
