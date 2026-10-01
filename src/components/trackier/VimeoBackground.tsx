'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './ClosingSections.module.css';

const playerOrigin = 'https://player.vimeo.com';

type VimeoMessage = {
  event?: string;
  method?: string;
  data?: { method?: string; name?: string };
};

function send(iframe: HTMLIFrameElement | null, method: string, value?: string | boolean) {
  iframe?.contentWindow?.postMessage(
    { method, ...(value === undefined ? {} : { value }) },
    playerOrigin,
  );
}

/** A decorative Vimeo embed; the surrounding section supplies its still-image fallback. */
export function VimeoBackground({
  videoId,
  aspectRatio = 16 / 9,
}: {
  videoId: number;
  aspectRatio?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const shouldPlayRef = useRef(false);
  const playRetryRef = useRef<number | null>(null);
  const playAttemptsRef = useRef(0);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [inView, setInView] = useState(false);
  const [hasApproached, setHasApproached] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const mounted = motionAllowed && hasApproached && !failed;
  const shouldPlay = mounted && inView && pageVisible && !paused;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setMotionAllowed(!reducedMotion.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    });
    // Fetch the player before it is visible, without starting offscreen playback.
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasApproached(true);
        preloadObserver.disconnect();
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(root);
    preloadObserver.observe(root);
    reducedMotion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      observer.disconnect();
      preloadObserver.disconnect();
      reducedMotion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    shouldPlayRef.current = shouldPlay;
    playAttemptsRef.current = 0;
    if (ready) send(iframeRef.current, shouldPlay ? 'play' : 'pause');
    return () => {
      if (playRetryRef.current !== null) window.clearTimeout(playRetryRef.current);
      playRetryRef.current = null;
    };
  }, [shouldPlay, ready]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!mounted || !iframe) return;
    setReady(false);
    setPlaying(false);
    setLoaded(false);
    let initialized = false;
    // An unavailable or blocked embed must leave the still image visible.
    const timeout = window.setTimeout(() => setFailed(true), 20000);

    const receive = (event: MessageEvent) => {
      if (event.origin !== playerOrigin || event.source !== iframe.contentWindow) return;
      let message: VimeoMessage;
      try {
        message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (!message || typeof message !== 'object') return;

      if (message.event === 'ready' || message.method === 'ping') {
        if (initialized) return;
        initialized = true;
        window.clearTimeout(timeout);
        ['loaded', 'playing', 'pause', 'error'].forEach((name) =>
          send(iframe, 'addEventListener', name),
        );
        send(iframe, 'setMuted', true);
        setReady(true);
      } else if (message.event === 'loaded') {
        // Readiness can precede media loading; start as soon as both are available.
        if (shouldPlayRef.current) send(iframe, 'play');
      } else if (message.event === 'playing') {
        if (!shouldPlayRef.current) {
          send(iframe, 'pause');
          return;
        }
        if (playRetryRef.current !== null) window.clearTimeout(playRetryRef.current);
        playRetryRef.current = null;
        playAttemptsRef.current = 0;
        setLoaded(true);
        setPlaying(true);
      } else if (message.event === 'pause') {
        setPlaying(false);
      } else if (message.event === 'error') {
        setPlaying(false);
        if (
          message.data?.method === 'play' &&
          message.data.name !== 'PrivacyError' &&
          message.data.name !== 'PasswordError'
        ) {
          // A loading/visibility race is not an intentional user pause. Retry briefly,
          // and allow the next viewport entry to try again if the browser still blocks it.
          const delays = [250, 750, 1500];
          if (
            shouldPlayRef.current &&
            playRetryRef.current === null &&
            playAttemptsRef.current < delays.length
          ) {
            const delay = delays[playAttemptsRef.current++];
            playRetryRef.current = window.setTimeout(() => {
              playRetryRef.current = null;
              if (shouldPlayRef.current) send(iframe, 'play');
            }, delay);
          }
        } else if (message.data?.method !== 'pause') {
          setFailed(true);
        }
      }
    };

    window.addEventListener('message', receive);
    send(iframe, 'ping');
    return () => {
      window.clearTimeout(timeout);
      if (playRetryRef.current !== null) window.clearTimeout(playRetryRef.current);
      playRetryRef.current = null;
      send(iframe, 'pause');
      window.removeEventListener('message', receive);
    };
  }, [mounted, videoId]);

  function togglePlayback() {
    setPaused(playing);
    playAttemptsRef.current = 0;
    // Send directly from the gesture so browsers can permit a manual retry.
    shouldPlayRef.current = !playing;
    send(iframeRef.current, playing ? 'pause' : 'play');
  }

  return (
    <div
      ref={rootRef}
      className={styles.vimeoBackground}
      style={{ '--video-aspect-ratio': aspectRatio } as CSSProperties}
    >
      {mounted && (
        <div className={styles.vimeoViewport} data-loaded={loaded} aria-hidden="true">
          <iframe
            ref={iframeRef}
            className={styles.vimeoPlayer}
            src={`${playerOrigin}/video/${videoId}?background=1&autoplay=0&muted=1&loop=1&controls=0&keyboard=0&playsinline=1&dnt=1`}
            title="Decorative background video"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            onLoad={() => send(iframeRef.current, 'ping')}
            onError={() => setFailed(true)}
          />
        </div>
      )}
      {mounted && ready && (
        <button
          type="button"
          className={styles.videoControl}
          onClick={togglePlayback}
          aria-label={`${playing ? 'Pause' : 'Play'} background video`}
          title={`${playing ? 'Pause' : 'Play'} background video`}
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            {playing ? <path d="M2 1h3v10H2zm5 0h3v10H7z" /> : <path d="M3 1.5 10 6l-7 4.5Z" />}
          </svg>
        </button>
      )}
    </div>
  );
}
