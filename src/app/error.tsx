'use client';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="status-page" role="alert"><h1>This page is temporarily unavailable.</h1><p>We could not load its content. Please try again shortly.</p><button className="button button-primary" onClick={reset}>Try again</button></section>;
}
