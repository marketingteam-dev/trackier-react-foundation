'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { clientStories, getClientStoryVideoUrl, type ClientStory } from './clientStories.data';
import styles from './ClientStories.module.css';

type ActiveVideo = { story: ClientStory; url: string };

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="m9 5 11 7-11 7Z" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: 'previous' | 'next' }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d={direction === 'next' ? 'm9 5 7 7-7 7' : 'm15 5-7 7 7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StoryCard({
  story,
  duplicate,
  onPlay,
  buttonRef,
}: {
  story: ClientStory;
  duplicate: boolean;
  onPlay: (story: ClientStory, trigger: HTMLButtonElement) => void;
  buttonRef?: (element: HTMLButtonElement | null) => void;
}) {
  const playable = Boolean(getClientStoryVideoUrl(story.video));
  function preventDuplicateFocus(event: PointerEvent<HTMLButtonElement>) {
    if (duplicate) event.preventDefault();
  }

  return (
    <article className={styles.card}>
      <h3>What {story.company} had to say</h3>
      <blockquote>{story.quote}</blockquote>
      <p className={styles.attribution}>
        {story.speaker}, {story.role}, {story.company}
      </p>
      <div className={styles.portrait}>
        <img src={story.portrait} alt="Client portrait" loading="lazy" draggable={false} />
        {playable ? (
          <button
            ref={buttonRef}
            type="button"
            className={styles.playVideo}
            tabIndex={duplicate ? -1 : 0}
            aria-label={`Play ${story.company} client story video`}
            onPointerDown={preventDuplicateFocus}
            onClick={(event) => onPlay(story, event.currentTarget)}
          >
            <span className={styles.playCircle}>
              <PlayIcon />
            </span>
            <span>Watch story</span>
          </button>
        ) : (
          <span className={styles.videoPending}>Video coming soon</span>
        )}
      </div>
    </article>
  );
}

export function ClientStories() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const groupWidthRef = useRef(0);
  const pointerGestureRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const originalButtons = useRef<Record<string, HTMLButtonElement | null>>({});
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pointerInteracting, setPointerInteracting] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);
  const automatic = !userPaused && !reducedMotion;
  const moving =
    automatic &&
    !hovering &&
    !focused &&
    !pointerInteracting &&
    inViewport &&
    pageVisible &&
    !activeVideo;

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const updateWidth = () => {
      groupWidthRef.current = group.getBoundingClientRect().width;
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(group);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting), {
      threshold: 0.1,
    });
    observer.observe(viewport);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible');
    updateMotion();
    updateVisibility();
    motion.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!moving || !viewport || !group) return;
    let frame = 0;
    let previousTime: number | null = null;
    let position = viewport.scrollLeft;
    function step(time: number) {
      if (!viewport || !group) return;
      const groupWidth = groupWidthRef.current;
      if (previousTime !== null && groupWidth > 0) {
        position += Math.min(time - previousTime, 64) * 0.027;
        if (position >= groupWidth) position %= groupWidth;
        viewport.scrollLeft = position;
      }
      previousTime = time;
      frame = window.requestAnimationFrame(step);
    }
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [moving]);

  useEffect(() => {
    if (!activeVideo) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      // Native focus scrolling keeps the original card visible when its repeated
      // copy was clicked, without making duplicate controls keyboard-focusable.
      returnFocusRef.current?.focus();
    };
  }, [activeVideo]);

  function playStory(story: ClientStory, trigger: HTMLButtonElement) {
    const url = getClientStoryVideoUrl(story.video);
    if (!url) return;
    returnFocusRef.current = originalButtons.current[story.id] || trigger;
    setActiveVideo({ story, url });
  }

  function navigate(direction: -1 | 1) {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;
    setUserPaused(true);
    const groupWidth = groupWidthRef.current;
    if (groupWidth <= 0) return;
    const cardStep = groupWidth / clientStories.length;
    const current = viewport.scrollLeft % groupWidth;
    const target = Math.round(current / cardStep) * cardStep + direction * cardStep;
    const wrapped = (target + groupWidth) % groupWidth;
    viewport.scrollTo({
      left: wrapped,
      behavior: reducedMotion || target < 0 || target >= groupWidth ? 'auto' : 'smooth',
    });
  }

  function beginPointerGesture(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
    pointerGestureRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    setPointerInteracting(true);
  }

  function updatePointerGesture(event: PointerEvent<HTMLDivElement>) {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const horizontal = Math.abs(event.clientX - gesture.x);
    const vertical = Math.abs(event.clientY - gesture.y);
    if (horizontal > 8 && horizontal > vertical) {
      setUserPaused(true);
      pointerGestureRef.current = null;
      setPointerInteracting(false);
    }
  }

  function endPointerGesture() {
    pointerGestureRef.current = null;
    setPointerInteracting(false);
  }

  return (
    <section id="client-stories" className={styles.stories} aria-labelledby="stories-heading">
      <div className={styles.container}>
        <div className={styles.heading} data-reveal>
          <span className={styles.sectionLabel}>Client Stories</span>
          <h2 id="stories-heading">Success Stories That Inspire Us</h2>
        </div>
        <div
          ref={viewportRef}
          id="client-stories-carousel"
          className={styles.viewport}
          role="region"
          aria-roledescription="carousel"
          aria-label="Client video stories"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
          onPointerDown={beginPointerGesture}
          onPointerMove={updatePointerGesture}
          onPointerUp={endPointerGesture}
          onPointerCancel={endPointerGesture}
          onWheel={(event) => {
            if (
              Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
              (event.shiftKey && event.deltaY !== 0)
            )
              setUserPaused(true);
          }}
        >
          <div className={styles.track}>
            {[false, true].map((duplicate) => (
              <div
                ref={duplicate ? undefined : groupRef}
                className={styles.group}
                key={String(duplicate)}
                aria-hidden={duplicate ? true : undefined}
              >
                {clientStories.map((story) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    duplicate={duplicate}
                    onPlay={playStory}
                    buttonRef={
                      duplicate
                        ? undefined
                        : (element) => {
                            originalButtons.current[story.id] = element;
                          }
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.controls} aria-label="Client story carousel controls">
          <button
            type="button"
            className={styles.arrowButton}
            aria-label="Previous client story"
            aria-controls="client-stories-carousel"
            onClick={() => navigate(-1)}
          >
            <ArrowIcon direction="previous" />
          </button>
          <button
            type="button"
            className={styles.motionButton}
            aria-controls="client-stories-carousel"
            aria-label={
              reducedMotion
                ? 'Automatic scrolling paused for reduced motion'
                : automatic
                  ? 'Pause automatic scrolling'
                  : 'Resume automatic scrolling'
            }
            disabled={reducedMotion}
            onClick={() => setUserPaused((paused) => !paused)}
          >
            {automatic ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M4 2v10M10 2v10" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            ) : (
              <PlayIcon />
            )}
            <span>{reducedMotion ? 'Motion paused' : automatic ? 'Pause' : 'Play'}</span>
          </button>
          <button
            type="button"
            className={styles.arrowButton}
            aria-label="Next client story"
            aria-controls="client-stories-carousel"
            onClick={() => navigate(1)}
          >
            <ArrowIcon direction="next" />
          </button>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className={styles.videoDialog}
        aria-labelledby="client-video-title"
        onCancel={(event) => {
          event.preventDefault();
          setActiveVideo(null);
        }}
        onClose={() => setActiveVideo(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            setActiveVideo(null);
        }}
      >
        {activeVideo && (
          <>
            <div className={styles.dialogHeader}>
              <h2 id="client-video-title">{activeVideo.story.video?.title}</h2>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close client story video"
                onClick={() => setActiveVideo(null)}
                autoFocus
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path
                    d="m6 6 12 12M18 6 6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.videoFrame}>
              {activeVideo.story.video?.kind === 'file' ? (
                <video
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={activeVideo.story.video.title}
                >
                  <source src={activeVideo.url} type={activeVideo.story.video.mimeType} />
                  Your browser does not support this video.
                </video>
              ) : (
                <iframe
                  src={activeVideo.url}
                  title={activeVideo.story.video?.title || 'Client story video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              )}
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
