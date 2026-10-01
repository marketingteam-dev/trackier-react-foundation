'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePointerGlow } from './usePointerGlow';
import { ClientStories } from './ClientStories';
import styles from './PlatformSections.module.css';

const asset = (file: string) => `/react-assets/figma/${file}`;
const platformTabs = [
  {
    title: 'Campaign Management',
    description:
      'Campaign management allows users to effortlessly manage, analyze and optimize their campaigns in a centralized platform. Quickly create and launch campaigns with pre-built templates and customizable options. Apply bulk actions, enabling unified status updates across multiple campaigns, and bulk targeting, allowing efficient application of targeting rules via CSV uploads.',
    features: [
      {
        title: 'Cost ETL:',
        description:
          'Identify the touchpoints that drain maximum resources and tweak them for better outcomes.',
      },
      {
        title: 'Cost ETL:',
        description:
          'Identify the touchpoints that drain maximum resources and tweak them for better outcomes.',
      },
    ],
  },
  {
    title: 'Marketing Analytics',
    description:
      'Bring your campaign performance into one clear view. Understand the channels, partners, and touchpoints behind your conversions, and use those insights to make informed marketing decisions.',
    features: [
      {
        title: 'Performance insights:',
        description: 'Compare campaign results and identify the partners driving your growth.',
      },
      {
        title: 'Clear reporting:',
        description: 'Keep your team aligned with a central view of the metrics that matter.',
      },
    ],
  },
  {
    title: 'Automated Payout',
    description:
      'Simplify the way you manage partner payments. Keep campaign conversions, commissions, and payout information together so your team can spend less time on repetitive administration.',
    features: [
      {
        title: 'Partner commissions:',
        description: 'Keep track of the commissions earned across your performance campaigns.',
      },
      {
        title: 'Streamlined workflows:',
        description: 'Organize payment information and keep your partners informed.',
      },
    ],
  },
  {
    title: 'Easy Automation',
    description:
      'Give your team more time to focus on growth. Use campaign rules and bulk actions to simplify recurring tasks, organize your operations, and keep your performance marketing running smoothly.',
    features: [
      {
        title: 'Bulk actions:',
        description: 'Apply campaign updates across multiple campaigns from one place.',
      },
      {
        title: 'Smarter operations:',
        description: 'Reduce repetitive work and create a more consistent campaign workflow.',
      },
    ],
  },
  {
    title: 'Fraud Detection',
    description:
      'Build confidence in your campaign performance. Review traffic quality and conversion activity to identify suspicious patterns and focus your investment on meaningful results.',
    features: [
      {
        title: 'Traffic quality:',
        description: 'Understand the activity behind your campaigns and partner traffic.',
      },
      {
        title: 'Protect your performance:',
        description: 'Spot unusual patterns and make informed campaign decisions.',
      },
    ],
  },
];

function CampaignArtwork() {
  return (
    <div className={styles.campaignArtwork}>
      <img
        className={styles.backLandscape}
        src={asset('cdfaf771-50f7-4a95-aea9-e3afd9facad3.png')}
        alt=""
      />
      <div className={styles.dashboardCrop}>
        <img
          src={asset('e6e2f9c1-3f85-4613-8b28-8575ced3bf90.png')}
          alt="Trackier dashboard showing campaign management, targeting, and campaign status"
        />
      </div>
      <img className={styles.fox} src={asset('9cb987e1-420c-476a-978d-efe2a41c3b81.png')} alt="" />
      <img
        className={styles.frontLandscape}
        src={asset('d1180cc5-bd50-45be-ac43-976f73c0aee1.png')}
        alt=""
      />
      <img
        className={styles.landscapeShade}
        src={asset('43486b7a-8e30-47f4-ad1c-af10501875f2.png')}
        alt=""
      />
    </div>
  );
}

const platformCaptions = [
  'Launch, manage, and optimize your campaigns from one place.',
  'Turn campaign performance into clear, actionable insights.',
  'Keep partner commissions and payments working together.',
  'Less repetitive work. More time to focus on growth.',
  'Understand your traffic. Protect your performance.',
];

function CampaignPlatform() {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabsInView, setTabsInView] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tabFrameRef = useRef<HTMLDivElement>(null);
  const showcaseRef = usePointerGlow();
  const running = motionAllowed && pageVisible && inView && !paused && !hovered && !focused;

  useEffect(() => {
    const root = showcaseRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setMotionAllowed(!reducedMotion.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === root) {
            setInView(entry.isIntersecting && entry.intersectionRatio >= 0.25);
          } else {
            setTabsInView(entry.isIntersecting);
          }
        });
      },
      { threshold: [0, 0.25] },
    );
    observer.observe(root);
    if (tabFrameRef.current) observer.observe(tabFrameRef.current);
    reducedMotion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, [showcaseRef]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setSelected((current) => (current + 1) % platformTabs.length);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [running, selected]);

  useEffect(() => {
    const button = tabRefs.current[selected];
    const list = button?.parentElement;
    if (!button || !list || list.scrollWidth <= list.clientWidth) return;
    const buttonBounds = button.getBoundingClientRect();
    const listBounds = list.getBoundingClientRect();
    list.scrollTo({
      left:
        list.scrollLeft +
        buttonBounds.left -
        listBounds.left -
        (list.clientWidth - buttonBounds.width) / 2,
      behavior: motionAllowed ? 'smooth' : 'instant',
    });
  }, [selected, motionAllowed]);

  function selectTab(index: number) {
    setSelected(index);
    // Keep a manually chosen feature in place while the visitor reads it.
    setPaused(true);
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % platformTabs.length;
    else if (event.key === 'ArrowLeft')
      next = (index + platformTabs.length - 1) % platformTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = platformTabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  }

  return (
    <section id="platform" className={styles.platform} aria-label="Explore the Trackier platform">
      <div className={styles.container}>
        <div
          ref={showcaseRef}
          className={styles.platformShowcase}
          onPointerEnter={(event) => {
            if (event.pointerType === 'mouse') setHovered(true);
          }}
          onPointerLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
        >
          <div
            ref={tabFrameRef}
            className={`${styles.platformTabsFrame} ${styles.platformSurface}`}
            data-border-moving={tabsInView && pageVisible}
            data-pointer-glow
            data-reveal
          >
            <div className={styles.platformTabs} role="tablist" aria-label="Platform features">
              {platformTabs.map((item, index) => (
                <button
                  className={`${styles.platformTab} ${styles.platformSurface}`}
                  key={item.title}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`platform-tab-${index}`}
                  aria-controls={`platform-panel-${index}`}
                  aria-selected={selected === index}
                  tabIndex={selected === index ? 0 : -1}
                  onKeyDown={(event) => navigateTabs(event, index)}
                  onClick={() => selectTab(index)}
                  data-pointer-glow
                >
                  <span className={styles.tabEdge} aria-hidden="true" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div
            className={`${styles.platformFrame} ${styles.platformSurface}`}
            data-pointer-glow
            data-reveal
          >
            <div className={styles.platformPanel}>
              {platformTabs.map((tab, index) => (
                <div
                  id={`platform-panel-${index}`}
                  key={tab.title}
                  role="tabpanel"
                  aria-labelledby={`platform-tab-${index}`}
                  aria-hidden={selected !== index}
                  inert={selected !== index}
                  tabIndex={selected === index ? 0 : -1}
                  className={styles.platformSlide}
                  data-active={selected === index}
                >
                  <div className={styles.campaignCopy}>
                    <p>{tab.description}</p>
                    {tab.features.map((feature, featureIndex) => (
                      <div className={styles.campaignFeature} key={featureIndex}>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </div>
                    ))}
                  </div>
                  <CampaignArtwork />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.platformCaption}>
            <p key={selected}>{platformCaptions[selected]}</p>
            <button
              type="button"
              className={styles.tourControl}
              onClick={() => {
                setPaused((current) => !current);
                // An explicit resume may restart the tour while its control keeps keyboard focus.
                setFocused(false);
              }}
              aria-label={`${paused ? 'Resume' : 'Pause'} automatic feature tour`}
              title={`${paused ? 'Resume' : 'Pause'} automatic feature tour`}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                {paused ? <path d="M3 1.5 10 6l-7 4.5Z" /> : <path d="M2 1h3v10H2zm5 0h3v10H7z" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

type IntegrationCategory = 'all' | 'design' | 'research' | 'collaboration' | 'ai';
type IntegrationLayer = {
  x: number;
  y: number;
  file?: string;
  text?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
};
type Integration = {
  name: string;
  width: number;
  category: IntegrationCategory;
  layers: IntegrationLayer[];
};

// Original Figma vector layers retain their intrinsic dimensions and relative positions.
const integrations: Integration[] = [
  {
    name: 'Webflow',
    width: 129.125,
    category: 'design',
    layers: [
      { x: -0.542, y: -0.54, file: '2d439c47-788e-4e37-b6fc-4f939628e2da.svg' },
      { x: 31.903, y: 14.255, text: 'Webflow', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'WIX',
    width: 83.009,
    category: 'design',
    layers: [
      { x: -0.54, y: -0.54, file: '7b642807-9983-4e84-b8e7-dd1ef40febf8.svg' },
      { x: 12.096, y: 15.093, file: 'ef6441d7-cb1d-4170-849e-c29555327510.svg' },
      { x: 43.243, y: 15.093, text: 'WIX', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Framer',
    width: 119.146,
    category: 'design',
    layers: [
      { x: -0.536, y: -0.54, file: '66c51086-314a-45e8-bf9b-53cf3bac9d42.svg' },
      { x: 32.054, y: 15.093, text: 'Framer', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Principal',
    width: 119.902,
    category: 'design',
    layers: [
      { x: -0.54, y: -0.54, file: 'bcd8a8fe-5baa-4cad-9c55-37d0bec38f83.svg' },
      { x: 12.55, y: 15.093, file: '2ad8290e-bbcb-42eb-b61f-d4e19d86cd4d.svg' },
      { x: 40.37, y: 15.093, text: 'Principal', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Figma',
    width: 102.967,
    category: 'design',
    layers: [
      { x: -0.546, y: -0.54, file: 'f145423e-a9bf-40cb-8f2d-50dee563b9af.svg' },
      { x: 19.354, y: 14.255, file: '59666746-4b45-48f7-bd8d-14392a093ec9.svg' },
      { x: 28.577, y: 14.255, file: '61eeb064-b70c-4ee4-ae3c-c94c70daa0d4.svg' },
      { x: 19.354, y: 23.478, file: '8698f384-433e-428e-a183-c0ced0b9d778.svg' },
      { x: 28.577, y: 23.478, file: '2285ef5f-b015-4987-9bdf-4c2c538d52d9.svg' },
      { x: 19.354, y: 32.702, file: 'c4f6704b-ce5d-4538-965a-765a8ea70115.svg' },
      { x: 46.418, y: 15.093, text: 'Figma', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Storybook',
    width: 131.544,
    category: 'design',
    layers: [
      { x: -0.539, y: -0.54, file: '82c8856d-dafd-43c0-9fb3-a9a6c8e34149.svg' },
      { x: 17.086, y: 13.416, file: 'e0edf53d-46fd-45ea-b70d-7f6d49c7fb15.svg' },
      { x: 21.319, y: 16.77, text: 'S', fontSize: 12.377, color: '#fff', fontWeight: 700 },
      { x: 46.418, y: 15.093, text: 'Storybook', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'zeroheight',
    width: 145.454,
    category: 'design',
    layers: [
      { x: -0.538, y: -0.54, file: 'cbb72fec-e4ed-47f1-bff7-ac6f17687507.svg' },
      { x: 17.086, y: 15.093, file: '368c3f2b-f097-4764-88aa-cb4ec6fefe53.svg' },
      {
        x: 46.418,
        y: 15.093,
        text: 'zeroheight',
        fontSize: 15.472,
        color: '#000',
        fontWeight: 700,
      },
    ],
  },
  {
    name: 'LottieFiles',
    width: 138.953,
    category: 'design',
    layers: [
      { x: -0.542, y: -0.54, file: 'aaaa7d32-8f5d-411e-983a-78e040191d43.svg' },
      { x: 17.086, y: 13.416, file: '98a50e5d-fb29-474e-b27c-2e7ca6b3612c.svg' },
      { x: 21.086, y: 17.696, file: '48ad75d6-028e-4707-bce6-aee24cdfd76f.svg' },
      {
        x: 46.57,
        y: 15.093,
        text: 'LottieFiles',
        fontSize: 15.472,
        color: '#000',
        fontWeight: 700,
      },
    ],
  },
  {
    name: 'Discord',
    width: 129.125,
    category: 'collaboration',
    layers: [
      { x: -0.542, y: -0.54, file: '2d439c47-788e-4e37-b6fc-4f939628e2da.svg' },
      { x: 16.178, y: 14.254, file: 'c3ef38e6-ecec-4c27-b232-8ef6316dd434.svg' },
      { x: 23.134, y: 22.64, file: '504828d9-7e52-49ad-8ef3-1f38d15900e6.svg' },
      { x: 29.333, y: 22.64, file: '504828d9-7e52-49ad-8ef3-1f38d15900e6.svg' },
      { x: 46.418, y: 15.093, text: 'Discord', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'hotjar',
    width: 107.654,
    category: 'research',
    layers: [
      { x: -0.538, y: -0.54, file: '0178a6ff-85cb-4109-9866-455ad66e294a.svg' },
      { x: 17.086, y: 20.124, file: '98bc0beb-43fe-4c10-8047-98615ac195d6.svg' },
      { x: 46.418, y: 15.093, text: 'hotjar', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Typeform',
    width: 133.812,
    category: 'research',
    layers: [
      { x: -0.535, y: -0.54, file: '50e46bdb-3557-4a52-846a-a049d0175055.svg' },
      { x: 16.934, y: 15.932, file: 'ed9f751d-b54c-4f73-8902-59881793f235.svg' },
      { x: 26.309, y: 15.932, file: 'e37359d8-ee34-4f81-a4d0-4bcbcb68ddee.svg' },
      { x: 46.418, y: 15.093, text: 'Typeform', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'maze',
    width: 104.933,
    category: 'research',
    layers: [
      { x: -0.546, y: -0.54, file: '9cfd09b8-213c-447c-90ff-a1f65a44b410.svg' },
      { x: 15.841, y: 16.858, file: '7878c72b-0be5-4123-b634-9f4adb6d5602.svg' },
      { x: 46.721, y: 15.093, text: 'maze', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Google',
    width: 70.006,
    category: 'research',
    layers: [
      { x: -0.539, y: -0.54, file: '960dcb2a-820b-4666-96b1-a390547a932a.svg' },
      { x: 16.783, y: 15.093, text: '\u25ae', fontSize: 12.377, color: '#f5a000', fontWeight: 700 },
      { x: 22.982, y: 18.447, text: 'Google', fontSize: 8.509, color: '#555', fontWeight: 400 },
    ],
  },
  {
    name: 'miro',
    width: 88.906,
    category: 'collaboration',
    layers: [
      { x: -0.542, y: -0.54, file: 'ecc018f0-5a34-4e93-972d-467efd6dbafe.svg' },
      { x: 16.934, y: 13.416, file: '3add3455-fefe-4faf-b0f9-9db1e1c4388a.svg' },
      { x: 21.622, y: 17.609, file: '2be2604a-e1cc-4bfe-96b4-d2a357c86184.svg' },
      { x: 46.418, y: 15.093, text: 'miro', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'ClickUp',
    width: 109.922,
    category: 'collaboration',
    layers: [
      { x: -0.539, y: -0.54, file: 'ead69778-9e73-4806-97df-b3a82fd91130.svg' },
      { x: 18.598, y: 15.932, file: '045dc243-b6a2-4f8f-a396-123849c7e339.svg' },
      { x: 22.616, y: 29.367, file: '1167fa67-5bc9-4ccb-81a0-58fb9a808087.svg' },
      { x: 46.418, y: 15.093, text: 'ClickUp', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'zoom',
    width: 71.971,
    category: 'collaboration',
    layers: [
      { x: -0.54, y: -0.54, file: '4dd5d631-7e94-4601-8b05-c133886cef1a.svg' },
      { x: 17.237, y: 13.416, text: 'zoom', fontSize: 15.472, color: '#2d6cdf', fontWeight: 700 },
    ],
  },
  {
    name: 'slack',
    width: 107.05,
    category: 'collaboration',
    layers: [
      { x: -0.546, y: -0.54, file: 'cf8f6c1c-ee31-4f9a-a15c-13745dc500c1.svg' },
      { x: 19.202, y: 15.932, file: '898e8b36-9a01-42ba-bd2d-78d68cf975d0.svg' },
      { x: 28.426, y: 15.932, file: '5116730b-f10b-4ecc-b12a-cca197186999.svg' },
      { x: 19.202, y: 25.993, file: 'd596cec6-279a-47d3-8aef-62a39c4c1331.svg' },
      { x: 28.426, y: 25.993, file: 'b1c744c4-50e8-4b21-b833-122631ae65ae.svg' },
      { x: 46.267, y: 15.093, text: 'slack', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Notion',
    width: 100.548,
    category: 'collaboration',
    layers: [
      { x: -0.543, y: -0.55, file: '05c7f803-2cd4-4ec2-bb66-51911b0a5ae9.svg' },
      { x: 16.311, y: 12.645, file: '208a6231-6c3f-486d-a709-f497385efdc0.svg' },
      { x: 22.075, y: 15.931, text: 'N', fontSize: 12.377, color: '#000', fontWeight: 700 },
      { x: 46.418, y: 15.093, text: 'Notion', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Trello',
    width: 102.967,
    category: 'collaboration',
    layers: [
      { x: -0.546, y: -0.54, file: '7c6b9ee0-d983-4e4b-ab78-ab8bf296600d.svg' },
      { x: 16.481, y: 12.578, file: 'd3ad6b60-d7f7-4af7-b6bf-fa46326d5734.svg' },
      { x: 20.412, y: 16.77, file: '1f970bb3-25af-4f9b-a7e4-fcd5fe62fb69.svg' },
      { x: 27.367, y: 16.77, file: '23c44854-e20b-4349-bdf8-aa9ce4de68b9.svg' },
      { x: 45.965, y: 14.255, text: 'Trello', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'asana',
    width: 104.933,
    category: 'collaboration',
    layers: [
      { x: -0.546, y: -0.54, file: '06b43aa1-3b08-460e-bb05-1afbd16be467.svg' },
      { x: 22.68, y: 15.093, file: '3e48f902-b068-4eea-b6b4-070020dab592.svg' },
      { x: 17.993, y: 23.478, file: '3e48f902-b068-4eea-b6b4-070020dab592.svg' },
      { x: 27.367, y: 23.478, file: '3e48f902-b068-4eea-b6b4-070020dab592.svg' },
      { x: 46.721, y: 14.255, text: 'asana', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Jira Software',
    width: 160.877,
    category: 'collaboration',
    layers: [
      { x: -0.547, y: -0.54, file: '2e336dda-61a0-4d71-abec-cd1a6ece3c0e.svg' },
      { x: 17.388, y: 12.578, file: 'ee4e9746-c443-41f5-a288-c534cc5d293e.svg' },
      { x: 22.831, y: 17.609, file: '9bb40c3e-d08d-4a68-b3af-f3c431937f97.svg' },
      {
        x: 46.721,
        y: 14.255,
        text: 'Jira Software',
        fontSize: 15.472,
        color: '#000',
        fontWeight: 700,
      },
    ],
  },
  {
    name: 'loom',
    width: 89.057,
    category: 'collaboration',
    layers: [
      { x: -0.543, y: -0.55, file: 'ecc018f0-5a34-4e93-972d-467efd6dbafe.svg' },
      { x: 12.247, y: 14.255, file: 'dcf6e968-6e3b-483e-983b-b2db32a1ecad.svg' },
      { x: 16.934, y: 19.285, file: '3a0c9d6f-a343-48ee-ba69-e9748b661976.svg' },
      { x: 40.824, y: 15.093, text: 'loom', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Lovable',
    width: 120.053,
    category: 'ai',
    layers: [
      { x: -0.54, y: -0.54, file: '50a19bfe-4031-437d-9d0c-fe480e27435c.svg' },
      { x: 17.237, y: 17.609, file: '7bd64e16-7236-4960-8aa0-e0e9bb348417.svg' },
      { x: 46.57, y: 14.255, text: 'Lovable', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
  {
    name: 'Claude',
    width: 117.482,
    category: 'ai',
    layers: [
      { x: -0.54, y: -0.54, file: '50694115-08ae-4a86-a23a-9d3ecd4b5478.svg' },
      { x: 16.934, y: 12.578, file: '91c3f070-a08d-4852-87b1-81c9e86ec0de.svg' },
      { x: 46.418, y: 14.255, text: 'Claude', fontSize: 15.472, color: '#000', fontWeight: 700 },
    ],
  },
];

const integrationFilters: Array<{ key: IntegrationCategory; label: string; background: string }> = [
  { key: 'all', label: 'All', background: 'b3856d31-f5b3-4d75-97bd-bb02c7de666a.svg' },
  {
    key: 'design',
    label: 'Design & Prototyping',
    background: '3ece5af9-12db-4986-acd7-0988881f041a.svg',
  },
  {
    key: 'research',
    label: 'Research & Optimization',
    background: 'ddfbec9d-09b8-4364-bed0-5e2782b9ce4b.svg',
  },
  {
    key: 'collaboration',
    label: 'Collaboration & Management',
    background: 'a408568f-84b6-4682-a9f9-81b7dec45739.svg',
  },
  {
    key: 'ai',
    label: 'Engineering & AI Stack',
    background: '8b4fd249-dfbe-48bd-a35b-980e6c013b46.svg',
  },
];

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <li
      className={styles.integrationCard}
      style={{ width: integration.width }}
      aria-label={integration.name}
    >
      {integration.layers.map((layer, index) =>
        layer.file ? (
          <img
            key={index}
            src={asset(layer.file)}
            alt=""
            aria-hidden="true"
            style={{ left: layer.x, top: layer.y }}
            loading="lazy"
          />
        ) : (
          <span
            key={index}
            aria-hidden="true"
            style={{
              left: layer.x,
              top: layer.y,
              fontSize: layer.fontSize,
              color: layer.color,
              fontWeight: layer.fontWeight,
            }}
          >
            {layer.text}
          </span>
        ),
      )}
    </li>
  );
}

function Integrations() {
  const [category, setCategory] = useState<IntegrationCategory>('all');
  const filtered = integrations.filter(
    (integration) => category === 'all' || integration.category === category,
  );
  const rows =
    category === 'all'
      ? [integrations.slice(0, 8), integrations.slice(8, 17), integrations.slice(17)]
      : [filtered];

  return (
    <section
      id="integrations"
      className={styles.integrations}
      aria-labelledby="integrations-heading"
    >
      <img
        className={styles.integrationBackground}
        src={asset('152669dd-ec93-490e-a2ce-21b523fed428.svg')}
        alt=""
        aria-hidden="true"
      />
      <div className={styles.container} data-reveal>
        <div className={styles.integrationLabel}>
          <img src={asset('9110f9e8-612b-49e0-b395-3f5df25dbd45.svg')} alt="" />
          <span>Stacks</span>
        </div>
        <h2 id="integrations-heading">We Connect the Dots</h2>
        <div className={styles.filters} role="group" aria-label="Filter integrations by category">
          {integrationFilters.map((filter) => (
            <button
              type="button"
              key={filter.key}
              className={styles.filter}
              aria-pressed={category === filter.key}
              data-original={category === 'all' ? 'true' : 'false'}
              onClick={() => setCategory(filter.key)}
            >
              <img src={asset(filter.background)} alt="" aria-hidden="true" />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
        <div className={styles.integrationCards} aria-live="polite" aria-atomic="true">
          <span className={styles.srOnly}>{filtered.length} integrations</span>
          {rows.map((row, index) => (
            <ul className={styles.integrationRow} key={`${category}-${index}`}>
              {row.map((integration) => (
                <IntegrationCard key={integration.name} integration={integration} />
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlatformSections() {
  return (
    <>
      <CampaignPlatform />
      <ClientStories />
      <Integrations />
    </>
  );
}
