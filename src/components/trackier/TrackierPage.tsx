'use client';

import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import ExpertiseSection from './ExpertiseSection';
import { PlatformSections } from './PlatformSections';
import { ClosingSections } from './ClosingSections';
import { useHeroParallax } from './useHeroParallax';
import { usePointerGlow } from './usePointerGlow';
import styles from './TrackierPage.module.css';

const asset = (name: string) => `/react-assets/figma/${name}`;
const demoUrl = 'https://trackier.com/request-demo/';

function Navigation() {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setLanguageOpen(false);
      }
    };
    const outside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setLanguageOpen(false);
      }
    };
    document.addEventListener('keydown', dismiss);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', dismiss);
      document.removeEventListener('pointerdown', outside);
    };
  }, []);
  return (
    <header className={styles.header} ref={navRef}>
      <Container className={styles.headerInner}>
        <a href="#" aria-label="Trackier home" className={styles.logo}>
          <img
            src={asset('ab407700-4889-4461-a7a6-7eb78d97e9df.svg')}
            alt="Trackier"
            width="165"
            height="19.1581"
          />
        </a>
        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={open}
          aria-controls="trackier-navigation"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav
          id="trackier-navigation"
          aria-label="Main navigation"
          className={`${styles.navigation} ${open ? styles.navigationOpen : ''}`}
        >
          <div className={styles.navLinks}>
            <a href="#platform" onClick={() => setOpen(false)}>
              Platform
            </a>
            <a href="#client-stories" onClick={() => setOpen(false)}>
              Resources
            </a>
            <a href="https://trackier.com/pricing/">Pricing</a>
            <a href="#expertise" onClick={() => setOpen(false)}>
              Why Trackier
            </a>
          </div>
          <div className={styles.language}>
            <button
              type="button"
              aria-label="Language: English"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen(!languageOpen)}
            >
              <img
                src={asset('010d2420-4d5e-425d-a2a6-f3ae997bde3b.svg')}
                alt=""
                width="24.002"
                height="24.0061"
              />
            </button>
            {languageOpen && (
              <div className={styles.languagePopover}>
                <span>Site language</span>
                <button type="button" onClick={() => setLanguageOpen(false)}>
                  English <span aria-hidden="true">✓</span>
                </button>
              </div>
            )}
          </div>
          <div className={styles.navActions}>
            <a href={demoUrl}>Request Demo</a>
            <Button
              label="Free Trial"
              href="https://trackier.com/free-trial/"
              className={styles.trial}
              showArrow={false}
            />
          </div>
        </nav>
      </Container>
    </header>
  );
}

function Hero() {
  const heroRef = useHeroParallax();

  return (
    <div className={styles.heroBackground} ref={heroRef}>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroCopy}>
          <h1 id="hero-heading">
            One Platform
            <br />
            Multiple Solutions for Brands
          </h1>
          <p>
            Trackier’s partner marketing platform streamlines your marketing efforts,
            <br className={styles.desktopBreak} /> offering detailed reports that provide a complete
            view.
          </p>
          <Button
            label="Request Your Demo Now"
            href={demoUrl}
            showArrow={false}
            className={styles.demoButton}
          />
        </div>
        <div
          className={styles.heroScene}
          role="img"
          aria-label="Trackier’s campaign analytics dashboard among green hills, with the Trackier fox mascot"
        >
          <img
            className={styles.landscapeBack}
            src={asset('5a398553-d1ad-4bc8-a09c-20a7631f1967.png')}
            alt=""
            fetchPriority="high"
          />
          <div className={styles.dashboard}>
            <div className={styles.dashboardNav}>
              <img src={asset('7fe648f6-5cc9-43b1-8071-15665d655f5a.png')} alt="" />
            </div>
            <div className={styles.dashboardScreen}>
              <img
                src={asset('e27d6518-9e2d-42d2-a1c6-cb778c87364c.png')}
                alt=""
                fetchPriority="high"
              />
            </div>
          </div>
          <img
            className={styles.fox}
            src={asset('a11f7918-9dc9-4779-b515-8be82e7a1c8b.png')}
            alt=""
            fetchPriority="high"
          />
          <img
            className={styles.landscapeFront}
            src={asset('c04277c8-cb4e-464e-866a-6e52e35a6329.png')}
            alt=""
            fetchPriority="high"
          />
          <img
            className={styles.landscapeFade}
            src={asset('ac362083-a703-44ee-9199-e358d01f0ca9.png')}
            alt=""
          />
        </div>
      </section>
    </div>
  );
}

type BrandProps = { name: string; primary?: string; secondary?: string; kind?: string };
function Brand({ name, primary, secondary, kind = '' }: BrandProps) {
  return (
    <div className={`${styles.brand} ${kind ? styles[kind] : ''}`}>
      {primary && (
        <span className={styles.brandIcon}>
          <img src={asset(primary)} alt="" />
          {secondary && <img className={styles.brandInset} src={asset(secondary)} alt="" />}
        </span>
      )}
      <span>
        {name}
        {name === 'IPDC' && <small>FINANCE</small>}
      </span>
    </div>
  );
}

const brandRows: BrandProps[][] = [
  [
    {
      name: 'oter',
      kind: 'oter',
      primary: '1bfe3b98-1f8f-484e-817a-c2af32bb2f4b.svg',
      secondary: 'af2f4ee6-809c-4b4d-a128-76549bb64841.svg',
    },
    {
      name: 'Sift',
      kind: 'sift',
      primary: '5cca8fb4-b75d-46d6-885f-db208d6822ac.svg',
      secondary: 'fbc230b2-d1be-4a32-8b08-f73e70ccf634.svg',
    },
    {
      name: 'SKILLOPHY',
      kind: 'skillophy',
      primary: '42d404f2-98f1-4140-a28f-fed816319183.svg',
      secondary: 'd6678b52-0935-4436-971b-d6f7df1ffc3c.svg',
    },
    {
      name: 'TEMPO',
      kind: 'tempo',
      primary: '9a15397a-3b11-41d8-a95d-2f629a6ea8bc.svg',
      secondary: '055ed195-e126-4a30-b364-dc76838d3c1f.svg',
    },
    { name: 'triply', kind: 'triply' },
    { name: 'WAYS & VILLAS', kind: 'ways', primary: '9f8beaf2-4a4f-4ac5-88d8-e6832d225ced.svg' },
  ],
  [
    {
      name: 'Gainsty',
      kind: 'gainsty',
      primary: 'de20186d-9a87-4209-88b7-e470bd35fe4e.svg',
      secondary: '4e9c080a-c13c-473a-a1ed-32ad138ae462.svg',
    },
    { name: 'GrowAffiliate.', kind: 'grow' },
    { name: 'heyLuna.ai', primary: '0aaa742f-d3f2-4e06-bcf7-3bd451768db5.svg' },
    { name: 'IPDC', kind: 'ipdc' },
    { name: 'Khan IT', kind: 'khan' },
    { name: 'klasio', kind: 'klasio', primary: 'ff1ced51-9f29-4c3c-82f3-be00b7b228c3.svg' },
    { name: 'AI', kind: 'ai', primary: '7c898945-b8dc-40de-9f5d-fa6bd23b6857.svg' },
  ],
];

function BrandCarousel() {
  const [paused, setPaused] = useState(false);

  return (
    <Container className={`${styles.brandContainer} ${paused ? styles.brandsPaused : ''}`}>
      {brandRows.map((brands, row) => (
        <div className={styles.brandRow} key={row} data-reveal>
          <div className={`${styles.brandTrack} ${row === 1 ? styles.brandTrackReverse : ''}`}>
            {[false, true].map((duplicate) => (
              <div
                className={styles.brandGroup}
                key={String(duplicate)}
                aria-hidden={duplicate || undefined}
              >
                {brands.map((brand) => (
                  <Brand key={brand.name} {...brand} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        className={styles.brandPause}
        onClick={() => setPaused(!paused)}
        aria-label={`${paused ? 'Resume' : 'Pause'} client logo carousel`}
        title={`${paused ? 'Resume' : 'Pause'} client logo carousel`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M3 1.5 10 6l-7 4.5Z" /> : <path d="M2 1h3v10H2zm5 0h3v10H7z" />}
        </svg>
      </button>
    </Container>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className={styles.badge}>{children}</span>;
}

function Opportunities() {
  const glowRef = usePointerGlow({ selector: '[data-opportunity-glow]' });

  return (
    <div className={styles.opportunitiesBackground} ref={glowRef}>
      <section className={styles.brands} aria-labelledby="brands-heading">
        <div data-reveal>
          <Badge>Brand Trust</Badge>
          <h2 id="brands-heading">
            <strong>Trusted By</strong> Leading Brands
          </h2>
        </div>
        <BrandCarousel />
      </section>
      <section
        className={styles.opportunities}
        id="solutions"
        aria-labelledby="opportunities-heading"
      >
        <div className={styles.opportunitiesHeading} data-reveal>
          <Badge>Opportunities</Badge>
          <h2 id="opportunities-heading">
            Endless Opportunities to Scale, Manage &amp; Optimize{' '}
            <strong>Your Performance Marketing</strong>
          </h2>
        </div>
        <Container className={styles.opportunityGrid}>
          {Array.from({ length: 6 }, (_, index) => (
            <article
              className={styles.opportunityCard}
              key={index}
              data-reveal
              data-opportunity-glow
            >
              <div className={styles.cardIcon}>
                <img
                  src={asset('67988b5b-c5f9-41e9-8ae4-324a3fc9f195.svg')}
                  alt=""
                  width="50"
                  height="50"
                />
              </div>
              <h3>E-Commerce</h3>
              <p>
                Scale your marketing efforts with
                <br className={styles.desktopBreak} /> ease - onboard and recruit affiliates using
                700+ seamless integrations.
              </p>
              <a href="#platform">
                Learn More{' '}
                <img
                  src={asset('8507ba7a-4b92-435c-a706-f768114c724a.svg')}
                  alt=""
                  width="20"
                  height="14.6515"
                />
              </a>
            </article>
          ))}
        </Container>
      </section>
    </div>
  );
}

export function TrackierPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const page = pageRef.current;
    if (!page || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = page.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' },
    );
    elements.forEach((element) => {
      element.classList.add('will-reveal');
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div className={`trackier-page ${styles.page}`} ref={pageRef}>
      <Navigation />
      <main id="main-content">
        <Hero />
        <Opportunities />
        <ExpertiseSection />
        <PlatformSections />
      </main>
      <ClosingSections />
    </div>
  );
}
