import type { MarketingPage, SiteSettings } from './types';

// SAMPLE CONTENT ONLY. No real company claims, testimonials, or API responses.
export const mockSite: SiteSettings = {
  name: 'Trackier · demo',
  navigation: [
    { label: 'Explore the starter', href: '/react-demo/', children: [
      { label: 'Marketing template', href: '/react-demo/' },
      { label: 'Another page', href: '/react-demo/reuse/' },
    ] },
    { label: 'Common questions', href: '/react-demo/#faq' },
    { label: 'WordPress blog ↗', href: 'https://trackier.com/blog/' },
  ],
  headerCta: { label: 'See page reuse', href: '/react-demo/reuse/' },
  footer: {
    description: 'A local demonstration of a shared website foundation. Replace this copy with approved content before launch.',
    columns: [
      { title: 'Sample pages', links: [{ label: 'Marketing template', href: '/react-demo/' }, { label: 'Reused template', href: '/react-demo/reuse/' }] },
      { title: 'Explore', links: [{ label: 'Questions', href: '/react-demo/#faq' }, { label: 'Live WordPress blog ↗', href: 'https://trackier.com/blog/' }] },
    ],
    socialLinks: [],
    copyright: 'Demonstration content — not the live Trackier website.',
  },
};

const demo: MarketingPage = {
  slug: 'react-demo', title: 'Marketing template · sample', modified: '2026-09-30T00:00:00Z',
  seo: { title: 'Marketing page starter | Local demonstration', description: 'Sample content showing a reusable marketing page powered by structured WordPress content.', noIndex: true },
  hero: {
    eyebrow: 'A foundation for what comes next',
    heading: 'One website.\nRoom to grow.',
    description: 'Keep publishing in WordPress. Build selected experiences with reusable React components. This demonstration shows how the pieces fit together.',
    primaryCta: { label: 'Explore a second page', href: '/react-demo/reuse/' },
    secondaryCta: { label: 'How this works', href: '#features' },
    image: { url: '/react-assets/foundation.svg', alt: 'WordPress content feeds reusable page sections inside a shared website layout.', width: 680, height: 500 },
  },
  features: { heading: 'A few building blocks. Many possibilities.', items: [
    { title: 'Content in one place', description: 'Headings, links, images, and page sections are supplied by WordPress or the explicit local sample data.' },
    { title: 'A familiar experience', description: 'Every React page uses the same header, footer, spacing, colors, and accessible components.' },
    { title: 'Grow one page at a time', description: 'Only deliberately assigned URLs use this frontend. Existing WordPress pages keep their own routes.' },
  ] },
  testimonials: [],
  faq: { heading: 'A clear starting point.', items: [
    { question: 'Is this the live Trackier website?', answer: 'No. This is sample content in a local starter. It does not change the live site or make claims about the company.' },
    { question: 'Where will the page content come from?', answer: 'In WordPress mode, the server requests published structured fields from the accompanying WordPress integration plugin.' },
    { question: 'Can the existing website stay online?', answer: 'Yes. Your web server can send only an explicit list of selected paths to this application, leaving other paths with WordPress.' },
  ] },
  cta: { heading: 'The next page starts here.', description: 'See the same layout and sections with different sample content.', link: { label: 'View the second example', href: '/react-demo/reuse/' } },
};

export const mockPages: Record<string, MarketingPage> = {
  'react-demo': demo,
  'reuse-demo': {
    ...demo, slug: 'reuse-demo', title: 'Reusable sections · sample',
    seo: { title: 'A second page | Local demonstration', description: 'A second sample page built with the same React layout and reusable sections.', noIndex: true },
    hero: { ...demo.hero, eyebrow: 'Same foundation. A new page.', heading: 'Create once.\nBuild on it.', description: 'This page reuses the marketing template, shared navigation, and footer. Only the content changes.', primaryCta: { label: 'Back to the first example', href: '/react-demo/' } },
    features: { heading: 'Reuse the parts that already work.', items: [
      { title: 'A shared layout', description: 'Header and footer changes are made once in React and appear on both pages.' },
      { title: 'Typed content', description: 'A clear data contract tells WordPress and React which fields each page needs.' },
      { title: 'Small interactive features', description: 'Add a calculator or form in its own feature folder when the page needs one.' },
    ] },
    cta: { heading: 'Make the foundation your own.', description: 'Replace the sample copy, connect staging WordPress, and verify the shared design before launch.', link: { label: 'Return to the starter', href: '/react-demo/' } },
  },
};
