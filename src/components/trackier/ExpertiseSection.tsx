import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './ExpertiseSection.module.css';

const asset = (name: string) => `/react-assets/figma/${name}`;

function Artwork({
  file,
  x = 0,
  y = 0,
  className = '',
  style,
}: {
  file: string;
  x?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={asset(file)}
      alt=""
      aria-hidden="true"
      className={`${styles.artwork} ${className}`}
      style={{ left: x, top: y, ...style }}
      loading="lazy"
    />
  );
}

function Portrait({
  file,
  x,
  y,
  width,
  height,
  crop,
  className = '',
}: {
  file: string;
  x: number;
  y: number;
  width: number;
  height: number;
  crop: CSSProperties;
  className?: string;
}) {
  return (
    <span className={`${styles.portrait} ${className}`} style={{ left: x, top: y, width, height }}>
      <img src={asset(file)} alt="" style={crop} loading="lazy" />
    </span>
  );
}

function TeamCard() {
  return (
    <article className={`${styles.card} ${styles.team}`} data-reveal>
      <div className={styles.avatarPill} aria-hidden="true">
        <Artwork file="20afdf76-de4e-4c50-b410-33ea9f95e6f5.svg" x={154.415} y={9.624} />
        {[-98.68, -169.3, -241.23, -317.54].map((left, index) => (
          <Portrait
            key={left}
            file="76e32738-0732-4136-8195-8dd7bae0f8ed.png"
            x={[10.28, 46.15, 82.02, 119.64][index]}
            y={9.624}
            width={49.868}
            height={50.305}
            crop={{ width: '515.79%', height: '441.74%', left: `${left}%`, top: '-170.43%' }}
          />
        ))}
        <Artwork file="6023199c-d75c-492e-b58b-323b77140a55.svg" x={171.913} y={29.746} />
      </div>
      <h3>100+ Saas Minds</h3>
      <p>
        United minds turn ideas into <br />
        stories.
      </p>
    </article>
  );
}

function DesignCard() {
  return (
    <article
      className={`${styles.card} ${styles.design}`}
      data-reveal
      aria-label="Design tokens, design systems, and components"
    >
      <div className={styles.designDiagram}>
        <span className={`${styles.designToken} ${styles.tokenOne}`}>
          <Artwork file="7148e2f3-1470-4106-80e1-93cf75f85f72.svg" x={-0.35} y={-0.35} />
          <span>Design Token</span>
        </span>
        <Artwork file="71a19699-4c18-438e-8474-7d2cde668b86.svg" x={117.52} y={-0.35} />
        <Artwork file="71a19699-4c18-438e-8474-7d2cde668b86.svg" x={37.65} y={54.65} />
        <span className={`${styles.designToken} ${styles.tokenTwo}`}>
          <Artwork file="3201c961-a69c-45e4-9bde-5971d0100f32.svg" x={-0.35} y={-0.35} />
          <span>Design System</span>
        </span>
        <span className={`${styles.designToken} ${styles.tokenThree}`}>
          <Artwork file="75b2480b-8419-44c0-b0ce-930c604f28a8.svg" x={-0.35} y={-0.35} />
          <span>Component</span>
        </span>
        <Artwork file="71a19699-4c18-438e-8474-7d2cde668b86.svg" x={117.65} y={101.65} />
      </div>
    </article>
  );
}

function TestimonialCard() {
  return (
    <article className={`${styles.card} ${styles.testimonial}`} data-reveal>
      <div className={styles.testimonialCopy}>
        <p className={styles.guardian}>GUARDIAN</p>
        <Artwork file="eae6f8ae-dffd-4277-b6a6-31df68ee349d.svg" y={34} />
        <p className={styles.company}>Saas Company</p>
        <blockquote>
          Trackier were great,
          <br />
          flexible and communicative. Excellent designs and quick turnaround!
        </blockquote>
      </div>
      <div className={styles.testimonialPhoto}>
        <img
          src={asset('7512b3b7-a30c-4f27-89df-8dedf5c78a8b.png')}
          className={styles.jenna}
          alt="Jenna Carvalho"
          loading="lazy"
        />
        <Artwork file="ea2d0853-8967-4a80-98c3-600733f4e3a7.svg" x={1} />
      </div>
      <div className={styles.testimonialName}>
        <h3>Jenna Carvalho</h3>
        <p>Principal @ Guardian Estate Company</p>
      </div>
    </article>
  );
}

function RatingCard() {
  return (
    <article className={`${styles.card} ${styles.rating}`} data-reveal>
      <Artwork
        file="8c118054-c4f9-408e-b83f-c3da4850362a.svg"
        className={styles.ratingStar}
        x={20}
        y={28.13}
      />
      <strong>4.9/5</strong>
      <p>
        We ensure excellence for
        <br />
        customer satisfaction.
      </p>
    </article>
  );
}

const locations = [
  {
    name: 'Dubai',
    x: 88.91,
    y: 99.55,
    width: 44.91,
    file: '0474fefb-2970-470a-b295-2f2250f5effd.svg',
  },
  {
    name: 'Singapore',
    x: 183.11,
    y: 99.55,
    width: 63.86,
    file: 'feeeb229-3dfa-42f5-9cd6-16c03121dc0a.svg',
  },
  {
    name: 'Italy',
    x: 13,
    y: 134.39,
    width: 47.01,
    file: '8406508e-f614-41f2-b75d-21512324d8e2.svg',
  },
  {
    name: 'USA',
    x: 118.26,
    y: 134.39,
    width: 47.01,
    file: '8406508e-f614-41f2-b75d-21512324d8e2.svg',
  },
  {
    name: 'Cyprus',
    x: 58.35,
    y: 170.22,
    width: 53.33,
    file: 'ac32aaea-7969-4baa-a8e6-914a16158df7.svg',
  },
  {
    name: 'South Africa',
    x: 140.31,
    y: 170.22,
    width: 83.5,
    file: '154c494b-2ab3-4c5b-ac4e-96c0259f4903.svg',
  },
];

function GlobalCard() {
  return (
    <article className={`${styles.card} ${styles.global}`} data-reveal>
      <h3>Global Presence</h3>
      <p>Offices That Span the Map.</p>
      <div className={styles.mapDrawing}>
        <Artwork file="ec3fc41d-2cd3-4730-9e70-478849329ec5.svg" x={7.63} y={75.65} />
        {locations.map((location) => (
          <span
            key={location.name}
            className={styles.location}
            style={{ left: location.x, top: location.y, width: location.width }}
          >
            <Artwork file={location.file} x={-0.35} y={-0.35} />
            <span>{location.name}</span>
          </span>
        ))}
      </div>
    </article>
  );
}

function HighPerformerBadge() {
  return (
    <span className={styles.highPerformer}>
      <Artwork file="70ced748-fb50-43de-b4c5-42482f9af687.svg" x={3.8413} y={1.1609} />
      <Artwork file="eb1795f0-e035-42d9-afc9-d760995e69ee.svg" x={4.0562} y={5.9274} />
      <Artwork file="2d50385d-c7d2-4ae3-a3ac-9de09a4d08a8.svg" x={2.897} y={0.0016} />
      <span className={styles.badgeBannerMask}>
        <Artwork file="7dc03956-9caa-41a5-a932-421cd893995b.svg" />
      </span>
      <span className={styles.badgeLogoMask}>
        <Artwork file="8bb3e2f7-b708-4f73-ae78-06e1c0e02a3c.svg" />
      </span>
      <Artwork file="b6c398dc-9909-4bd8-aa53-6c3204c13ceb.svg" x={7.4673} y={24.0957} />
      <Artwork file="f48ea780-083f-4202-ab4c-b0d32acc324a.svg" x={18.8105} y={15.151} />
      <Artwork file="44e6369d-505a-4668-a9c3-193f325710a3.svg" x={12.3345} y={35.3808} />
      <Artwork file="296a223e-9395-4175-b7d9-452fd3a30a9e.svg" x={16.939} y={43.682} />
      <Artwork file="be084567-46d2-4528-a64b-10ba55580999.svg" x={20.7163} y={49.0811} />
    </span>
  );
}

function ClientsCard() {
  return (
    <article className={`${styles.card} ${styles.clients}`} data-reveal>
      <div
        className={styles.clientBadges}
        aria-label="G2 awards: Best Estimated ROI, Easiest Setup, Fastest Implementation, and High Performer, Winter 2024"
      >
        <Artwork file="38049f75-0022-4113-a630-2117f0ad77f7.svg" />
        <Artwork file="218dfda3-6c54-4245-a29e-065d49413e3f.svg" x={69.849} />
        <Artwork file="6a77181f-dd29-4154-bd28-fd33b9aec98c.svg" x={139.697} />
        <HighPerformerBadge />
      </div>
      <div className={styles.clientOrbit} aria-hidden="true">
        <Artwork file="3579e378-e30b-4e49-a018-054c0855b403.svg" x={269} y={2.009} />
        <Artwork file="b2ce9200-359d-40e4-ace1-a97e9b6ce9a2.svg" x={436} y={140.636} />
        <Artwork file="9ed37fb8-7e3c-4648-9330-1a2d614ef8f5.svg" x={439.652} y={144.305} />
        <Portrait
          file="a94870d1-f901-4cb6-ba89-02d00275fd5d.png"
          x={440.614}
          y={143.816}
          width={46.773}
          height={48.332}
          crop={{ width: '163.22%', height: '106.45%', left: '-41.88%', top: '9.68%' }}
        />
        <Artwork file="f55b25a4-b61b-4ad5-b487-e393ea7ea971.svg" x={402} y={78.354} />
        <Artwork file="99381061-6c84-4dfd-853f-66c7d9ea6f93.svg" x={405} y={81.368} />
        <Portrait
          file="ef596dd2-5f9e-41f5-93f3-80e6d3ade200.png"
          x={407.946}
          y={85.442}
          width={48.039}
          height={49.183}
          crop={{ width: '424.87%', height: '151.16%', left: '-157.67%', top: '-16.28%' }}
        />
        <Artwork file="f55b25a4-b61b-4ad5-b487-e393ea7ea971.svg" x={345} y={144.655} />
        <Artwork file="4141e65f-9498-4773-9a7e-2c21233bf076.svg" x={347.727} y={147.394} />
        <Portrait
          file="63f428f2-00df-4abd-b176-ccc66d9074d3.png"
          x={349.943}
          y={148.732}
          width={50.03}
          height={52.205}
          crop={{ width: '254.32%', height: '162.5%', left: '-83.68%', top: '-10.42%' }}
        />
        <Artwork file="86ae4915-5024-483c-8a4f-b3de796f9ce2.svg" x={305} y={73.332} />
        <Portrait
          file="1cfc93d4-5185-4bc7-855d-d21ae006fdbc.png"
          x={309.941}
          y={78.414}
          width={52.118}
          height={52.118}
          crop={{ width: '190.16%', height: '126.79%', left: '-46.86%', top: '1.79%' }}
        />
        <Artwork file="51040fcf-2ff9-40f8-b9b7-0dc1523dfc5a.svg" x={412} y={6.53} />
        <Portrait
          file="b4b2de89-9294-4ad2-a411-ed3933271de3.png"
          x={415.952}
          y={10.093}
          width={42.095}
          height={42.095}
          crop={{ width: '433.81%', height: '155.26%', left: '-160.47%', top: '-10.53%' }}
        />
      </div>
      <div className={styles.clientsCopy}>
        <h3>150+ Global Clients</h3>
        <p>Worldwide Trust. Proven Results.</p>
      </div>
    </article>
  );
}

function FounderRow() {
  return (
    <div className={styles.founderRow}>
      <article className={styles.founderCopy} data-reveal>
        <span className={styles.workPill}>Work With the Best</span>
        <h2>Elevating your brand from a service to an experience</h2>
        <p>
          Great design is a conversation between a brand and its future. My role is to bridge that
          gap. We combine disruptive creativity with a deep understanding of user behavior to build
          digital products that don&apos;t just exist, they excel. We aren&apos;t just designing for
          today; we are building the iconic brands of the next decade
        </p>
        <Button
          className={styles.bookCall}
          href="https://trackier.com/contact-us/"
          label="Book a call"
          showArrow={false}
        />
      </article>
      <figure className={styles.founderPhoto} data-reveal>
        <img
          src={asset('833bf315-af91-4957-9adc-e93201b47789.png')}
          alt="Mukul Kaushik, CRO of Trackier"
          loading="lazy"
        />
        <figcaption>
          <strong>Mukul Kaushik</strong>
          <span>CRO Trackier</span>
        </figcaption>
      </figure>
    </div>
  );
}

function AssistantBanner() {
  return (
    <section className={styles.assistant} aria-labelledby="assistant-heading">
      <img
        className={styles.aiGlow}
        src={asset('26ec4278-d0f5-4aca-82a5-8e3e75a75288.svg')}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className={styles.assistantContent} data-reveal>
        <img
          className={styles.aiIcon}
          src={asset('f437bfc0-1d12-44d7-af8e-af4df85b67fa.svg')}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
        <h2 id="assistant-heading">
          Now Inside Your <strong>AI Assistant</strong>
        </h2>
        <p>
          Connect Claude, ChatGPT or Gemini to your panel and get campaign insights the moment you
          need them. Just type a question about clicks, conversions, payouts or anything else, and
          receive an answer from your live data in seconds.
        </p>
        <a className={styles.discover} href="#platform">
          Discover Trackier MCP
          <img src={asset('93bb8027-3f98-4ba7-a4b3-7e3ced033d3d.svg')} alt="" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default function ExpertiseSection() {
  return (
    <section className={styles.section} id="expertise" aria-labelledby="expertise-heading">
      <div className={styles.inner}>
        <header className={styles.heading} data-reveal>
          <span className={styles.ideaPill}>Idea Transformation</span>
          <h2 id="expertise-heading">
            Your Ideas, Our Expertise,
            <br />
            Impactful Results
          </h2>
        </header>
        <div className={styles.bento}>
          <TeamCard />
          <DesignCard />
          <TestimonialCard />
          <RatingCard />
          <GlobalCard />
          <ClientsCard />
        </div>
        <FounderRow />
      </div>
      <AssistantBanner />
    </section>
  );
}
