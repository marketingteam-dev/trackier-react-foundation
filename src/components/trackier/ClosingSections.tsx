'use client';

import { useId, useState, type CSSProperties } from 'react';
import { useFaqGlow } from './useFaqGlow';
import { VimeoBackground } from './VimeoBackground';
import styles from './ClosingSections.module.css';

const asset = (name: string) => `/react-assets/figma/${name}`;
const trackier = (path: string) => `https://trackier.com/${path}/`;

type Question = { question: string; answer: string; link?: { label: string; href: string } };

const faqCategories: { label: string; questions: Question[] }[] = [
  {
    label: 'General',
    questions: [
      {
        question: 'What is Trackier?',
        answer:
          'Trackier is a partner marketing platform for managing campaigns, tracking performance, and bringing your marketing reports together.',
      },
      {
        question: 'How long does it take to set up?',
        answer:
          'Your setup depends on your campaigns and integrations. Share your requirements with the team to plan your onboarding.',
        link: { label: 'Talk to the team', href: trackier('request-demo') },
      },
      {
        question: 'Do I need technical knowledge?',
        answer:
          'Explore the platform with the team, or visit the knowledge base for guidance on campaign setup, tracking, and integrations.',
        link: { label: 'Explore the knowledge base', href: 'https://help.trackier.com/en/' },
      },
      // These two question labels are preserved exactly from the supplied Figma.
      {
        question: 'Is Fora really free right now?',
        answer:
          'For Trackier’s current plans and trial options, please check the pricing page or contact the team.',
        link: { label: 'View pricing', href: trackier('pricing') },
      },
      {
        question: 'What happens when the beta ends?',
        answer:
          'For questions about your account, product availability, or plan, the Trackier team can help you understand the available options.',
        link: { label: 'Contact us', href: trackier('contact-us') },
      },
    ],
  },
  {
    label: 'Community & Features',
    questions: [
      {
        question: 'What can I manage with Trackier?',
        answer:
          'Manage campaigns, review marketing analytics, automate invoicing, and access fraud prevention tools in one platform.',
        link: { label: 'Explore the platform', href: trackier('performance-marketing-software') },
      },
      {
        question: 'Where can I learn more about the platform?',
        answer: 'Browse product guides and setup information in the Trackier knowledge base.',
        link: { label: 'Visit the knowledge base', href: 'https://help.trackier.com/en/' },
      },
      {
        question: 'How can I explore the partner ecosystem?',
        answer: 'Visit the partner ecosystem to discover Trackier’s partner network.',
        link: { label: 'Explore partners', href: trackier('partner-ecosystem') },
      },
    ],
  },
  {
    label: 'Privacy & Access',
    questions: [
      {
        question: 'Where can I find Trackier’s privacy policy?',
        answer: 'The privacy policy explains how Trackier handles personal information.',
        link: { label: 'Read the privacy policy', href: trackier('privacy-policy') },
      },
      {
        question: 'Where can I learn about security?',
        answer:
          'Explore Trackier’s security and compliance information for details about platform protection.',
        link: {
          label: 'Security and compliance',
          href: trackier('trackier-security-compliance-protection-you-trust'),
        },
      },
      {
        question: 'Who can help me with account access?',
        answer: 'Contact the Trackier team for assistance with your account.',
        link: { label: 'Contact support', href: trackier('contact-us') },
      },
    ],
  },
];

const footerColumns = [
  {
    title: 'Platform',
    links: [
      ['Automated Invoicing', trackier('automated-invoicing')],
      ['Marketing Automation', trackier('marketing-automation')],
      ['Fraud Prevention', trackier('fraud-prevention')],
      ['Marketing Analysis', trackier('marketing-analytics')],
      ['Campaign Management', trackier('campaign-management')],
    ],
  },
  {
    title: 'Solutions',
    links: [
      ['Saas', trackier('saas-affiliate-management-software')],
      ['Travel', trackier('travel-affiliate-management-software')],
      ['Banking', trackier('bank-affiliate-marketing-software')],
      ['E-Commerce', trackier('ecommerce-affiliate-marketing-software')],
      ['Fintech', trackier('fintech-affiliate-marketing-software')],
      ['Media and Networks', trackier('media-and-networks')],
    ],
  },
  {
    title: 'Why Trackier',
    links: [
      ['Who We Are', trackier('about-us')],
      ['Careers', trackier('career')],
      ['Newsroom', trackier('newsroom')],
      ['Contact Us', trackier('contact-us')],
      ['Compare Us', trackier('compare-us')],
      ['Awards and Recognition', trackier('awards-and-recognition')],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Blog', trackier('blog')],
      ['Glossary', trackier('glossary')],
      ['Webinars', 'https://www.youtube.com/@wearetrackier'],
      ['Case Studies', trackier('case-studies')],
      ['Knowledge Base', 'https://help.trackier.com/en/'],
      [
        'Publisher API DOC',
        'https://api-docs.trackier.io/docs/perf-pub-api-docs/7d7214a70a6ba-trackier-publisher-api-docs',
      ],
      [
        'Network API Doc',
        'https://api-docs.trackier.io/docs/perf-admin-api-docs/943fa3601232f-trackier-admin-api-docs',
      ],
      ['Industry Reports', trackier('industry-reports')],
    ],
  },
  {
    title: 'Quick Links',
    links: [
      ['Referral Program', trackier('referral-partner')],
      ['Affiliate Link Checker', trackier('affiliate-link-checker')],
      ['Affiliate Tracking Software', trackier('affiliate-tracking-software')],
      ['Performance Marketing software', trackier('performance-marketing-software')],
      ['Trackier Academy', 'https://academyv2.trackier.com/'],
      ['Partner Ecosystem', trackier('partner-ecosystem')],
    ],
  },
];

const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/trackier/',
    image: 'af0524d2-0051-4d71-92c4-327de7744870.svg',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/trackier',
    image: '0817fd8c-8f9f-4bac-b7dc-9ace551446e4.svg',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/trackierhq/',
    image: '6388f128-6f1a-4a2b-be0c-b218893644bd.svg',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@wearetrackier',
    image: '1806dbc3-fad8-4230-86c5-0de129613624.svg',
  },
  {
    name: 'X',
    href: 'https://twitter.com/trackierhq',
    image: 'd35e8fdb-8e8d-4c78-8c67-1b6cc674c6cf.svg',
  },
];

function DemoSection() {
  return (
    <section className={styles.demo} id="request-demo" aria-labelledby="demo-heading">
      <img
        className={styles.earth}
        src={asset('fa0e2658-5d07-4d73-89a7-09681ed55a22.png')}
        alt=""
        width={1512}
        height={751}
        loading="lazy"
      />
      <VimeoBackground videoId={1232025498} />
      <div className={styles.demoShade} />
      <div className={styles.demoContent} data-reveal>
        <h2 id="demo-heading">
          Curious to See
          <br />
          <strong>How Trackier Performs?</strong>
        </h2>
        <a className={styles.demoButton} href={trackier('request-demo')}>
          Request Your Demo Now
          <span className={styles.demoArrow} aria-hidden="true">
            <img src={asset('4e0ddcaf-b555-4f36-ac08-1184b48bf0e9.svg')} alt="" />
          </span>
        </a>
      </div>
    </section>
  );
}

function FAQItem({ item, index }: { item: Question; index: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <article
      className={`${styles.question} ${styles.glowSurface}`}
      data-open={open}
      data-faq-glow
      style={{ '--faq-item-index': index } as CSSProperties}
    >
      <h3 className={styles.questionHeading}>
        <button
          className={styles.questionToggle}
          type="button"
          id={`${id}-question`}
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={() => setOpen(!open)}
        >
          <span>{item.question}</span>
          <span className={styles.disclosureIcon} aria-hidden="true">
            <svg
              className={styles.disclosureChevron}
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="m3.5 6 4.5 4.5L12.5 6"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </h3>
      <div
        className={styles.answerPanel}
        id={`${id}-answer`}
        role="region"
        aria-labelledby={`${id}-question`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.answerClip}>
          <div className={styles.answer}>
            <p>{item.answer}</p>
            {item.link && (
              <a href={item.link.href}>
                {item.link.label}
                <span aria-hidden="true"> →</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function FAQSection() {
  const [category, setCategory] = useState(0);
  const id = useId();
  const glowRef = useFaqGlow();

  return (
    <section className={styles.faq} id="faq" aria-labelledby="faq-heading">
      <div className={styles.container}>
        <div className={styles.faqHeading} data-reveal>
          <div>
            <span className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              FAQ
            </span>
            <h2 id="faq-heading">
              Answers to the questions
              <br />
              that come up most.
            </h2>
          </div>
          <p className={styles.faqIntro}>
            Learn how Trackier works, explore platform features, and find answers about setup,
            privacy, and account access.
          </p>
        </div>
        <div className={styles.faqGrid} ref={glowRef}>
          <div className={styles.sidebar}>
            <div
              className={`${styles.categories} ${styles.glowSurface}`}
              aria-label="FAQ categories"
              data-faq-glow
              data-reveal
              style={{ '--faq-category': category } as CSSProperties}
            >
              <span className={styles.categoryIndicator} aria-hidden="true" />
              {faqCategories.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={category === index}
                  aria-controls={`${id}-questions`}
                  onClick={() => setCategory(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              className={`${styles.contactFrame} ${styles.glowSurface}`}
              data-faq-glow
              data-reveal
            >
              <div className={styles.contactCard}>
                <h3>Got Questions?</h3>
                <p>
                  Can&apos;t find what you&apos;re looking for?
                  <br />
                  Reach out - we&apos;re fast.
                </p>
                <a href={trackier('contact-us')}>
                  Contact us <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
          <div
            id={`${id}-questions`}
            className={styles.questions}
            aria-label={`${faqCategories[category].label} questions`}
            data-reveal
          >
            {faqCategories[category].questions.map((item, index) => (
              <FAQItem item={item} index={index} key={`${category}-${item.question}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrackierFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerColumns} data-reveal>
          {footerColumns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href}>
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className={styles.footerBottom}>
          <nav className={styles.socialLinks} aria-label="Social media">
            {socialLinks.map((social) => (
              <a key={social.name} href={social.href} aria-label={social.name}>
                <img src={asset(social.image)} alt="" />
              </a>
            ))}
          </nav>
          <div className={styles.legal}>
            <p>©2026 CloudStuff Technology Pvt Ltd</p>
            <a href={trackier('billing-policy')}>Billing Policy</a>
            <a href={trackier('terms-of-service')}>Terms of Services</a>
            <a href={trackier('privacy-policy')}>Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className={styles.brandArtwork}>
        <img
          src={asset('b880de1a-7bea-4eae-8004-25978f6ede8b.png')}
          alt="Trackier"
          width={4096}
          height={1503}
          loading="lazy"
        />
      </div>
    </footer>
  );
}

export function ClosingSections() {
  return (
    <div className={styles.closing}>
      <DemoSection />
      <div className={styles.darkSurface}>
        <FAQSection />
        <TrackierFooter />
      </div>
    </div>
  );
}
