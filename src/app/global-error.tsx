'use client';

export default function GlobalError() {
  return <html lang="en"><body style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '12vh auto', padding: 24 }}><main role="alert"><h1>The website is temporarily unavailable.</h1><p>We could not load the shared navigation or page content. Please try again shortly.</p><a href="/react-demo/">Try again</a></main></body></html>;
}
