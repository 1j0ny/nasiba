/**
 * Centralized motion engineering for Nasiba.
 *
 * Design rules (motion-hardening pass):
 * - Visible by default: nothing renders `opacity: 0` into prerendered HTML.
 *   Enhancement happens after hydration, never as a prerequisite for
 *   reading the page.
 * - One shared IntersectionObserver for simple editorial reveals. Signature
 *   choreography (hero, revenue path, sample leak map) stays independent.
 * - Reduced motion is resolved once, centrally — for CSS via the media
 *   query in index.css, for JS-driven reveals via `useReducedMotion`.
 * - Every browser-API touch is guarded for the prerender (SSR) environment.
 * - No animation library. CSS + React + IntersectionObserver only.
 */

import { useEffect, useRef, useState } from 'react';

/* ─── Environment guard ─────────────────────────────────────────────── */

/** True only in a real browser (never during prerender/SSR). */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/* ─── Reduced motion (resolved once per document) ───────────────────── */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

let reducedMotionRuntime: boolean | null = null;
let mediaListenerAttached = false;
const reducedMotionListeners = new Set<(reduced: boolean) => void>();

function readReducedMotion(): boolean {
  try {
    return isBrowser() && window.matchMedia(REDUCED_MOTION_QUERY).matches;
  } catch {
    return false;
  }
}

function onReducedMotionChange(event: MediaQueryListEvent): void {
  reducedMotionRuntime = event.matches;
  for (const listener of reducedMotionListeners) listener(event.matches);
}

/**
 * Attach the single shared `matchMedia` listener while at least one hook
 * consumer exists; detach when the last one unsubscribes. Module-level
 * state persists, so re-subscribing never re-reads media state incorrectly.
 */
function ensureReducedMotionTracking(): void {
  if (!isBrowser() || mediaListenerAttached) return;
  try {
    reducedMotionRuntime = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    window
      .matchMedia(REDUCED_MOTION_QUERY)
      .addEventListener('change', onReducedMotionChange);
    mediaListenerAttached = true;
  } catch {
    /* matchMedia unavailable: treat as no preference (static content) */
  }
}

function maybeReleaseReducedMotionTracking(): void {
  if (!mediaListenerAttached || reducedMotionListeners.size > 0) return;
  try {
    window
      .matchMedia(REDUCED_MOTION_QUERY)
      .removeEventListener('change', onReducedMotionChange);
  } catch {
    /* ignore */
  }
  mediaListenerAttached = false;
}

/** Non-hook read used by imperative utilities (e.g. smooth scrolling). */
export function prefersReducedMotion(): boolean {
  if (reducedMotionRuntime !== null) return reducedMotionRuntime;
  return readReducedMotion();
}

/**
 * Whether the user prefers reduced motion. One MediaQueryList listener is
 * shared by every consumer instead of one per component. SSR/prerender-safe:
 * returns false when no `window` exists, keeping prerendered markup
 * identical to no-JS markup.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    ensureReducedMotionTracking();
    return reducedMotionRuntime ?? false;
  });

  useEffect(() => {
    if (!isBrowser()) return;
    ensureReducedMotionTracking();
    setReduced(reducedMotionRuntime ?? false);
    const listener = (value: boolean) => setReduced(value);
    reducedMotionListeners.add(listener);
    return () => {
      reducedMotionListeners.delete(listener);
      maybeReleaseReducedMotionTracking();
    };
  }, []);

  return reduced;
}

/* ─── Shared IntersectionObserver for editorial reveals ─────────────── */

/**
 * All editorial-reveal elements share one IntersectionObserver instance per
 * distinct viewport-option set. Every element is unobserved as soon as it
 * has revealed (one-time reveal — no re-animation on re-entry), and the
 * observer itself is disconnected when its last element is removed.
 */
const revealCallbacks = new Map<Element, () => void>();
const sharedObservers = new Map<string, IntersectionObserver>();

function handleIntersectingEntry(
  entry: IntersectionObserverEntry,
  observer: IntersectionObserver,
): void {
  const callback = revealCallbacks.get(entry.target);
  if (!callback) return;
  revealCallbacks.delete(entry.target);
  observer.unobserve(entry.target);
  callback();
}

function getSharedObserver(threshold: number, rootMargin: string): IntersectionObserver | null {
  if (!isBrowser() || typeof IntersectionObserver === 'undefined') return null;
  const key = `${threshold}|${rootMargin}`;
  let observer = sharedObservers.get(key);
  if (!observer) {
    observer = new IntersectionObserver(
      (entries, self) => {
        for (const entry of entries) {
          if (entry.isIntersecting) handleIntersectingEntry(entry, self);
        }
      },
      { threshold, rootMargin },
    );
    sharedObservers.set(key, observer);
  }
  return observer;
}

function releaseSharedObserver(threshold: number, rootMargin: string): void {
  const key = `${threshold}|${rootMargin}`;
  const observer = sharedObservers.get(key);
  // Keep the observer alive while it still has observed targets; React
  // cleanup runs before siblings' setup during route swaps, so a count of
  // zero here is the signal that no reveal on the page uses it anymore.
  if (observer && revealCallbacks.size === 0) {
    observer.disconnect();
    sharedObservers.delete(key);
  }
}

/* ─── useReveal — visible-by-default one-time reveal ────────────────── */

export interface RevealOptions {
  /** Fraction of the element that must be visible (0–1). Default 0.15. */
  threshold?: number;
  /** Observer rootMargin. Default '0px 0px -10% 0px'. */
  rootMargin?: string;
  /**
   * Skip the observer entirely and keep the element visible (used for
   * prefers-reduced-motion and any caller that wants a static element).
   */
  skip?: boolean;
}

/**
 * One-time editorial reveal that is visible by default.
 *
 * SSR/prerender returns `revealed: true`, so prerendered HTML never
 * contains hidden content. After hydration, if the element is already
 * inside the viewport it simply stays visible (no transition, no flash);
 * if it is below the fold it starts hidden and reveals exactly once when
 * scrolled into view.
 *
 * Under prefers-reduced-motion the observer is never attached and the
 * element stays visible — reduced motion looks intentionally static,
 * not like a failed animation.
 */
export function useReveal(options: RevealOptions = {}): {
  ref: React.RefObject<HTMLDivElement | null>;
  revealed: boolean;
} {
  const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', skip = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(true); // visible by default (SSR + reduced motion)

  useEffect(() => {
    const element = ref.current;
    if (!element || skip) return;

    // Already inside the viewport when hydrated: keep it visible, no
    // transition, no observer work.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    const observer = getSharedObserver(threshold, rootMargin);
    if (!observer) return; // no IntersectionObserver: content stays visible

    setRevealed(false); // hide only now, only if below the fold
    const callback = () => setRevealed(true);
    revealCallbacks.set(element, callback);
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      revealCallbacks.delete(element);
      releaseSharedObserver(threshold, rootMargin);
    };
  }, [threshold, rootMargin, skip]);

  return { ref, revealed };
}

/* ─── Reduced-motion-aware smooth scrolling ─────────────────────────── */

/**
 * Smooth scroll for in-page anchors; instant under reduced motion or when
 * the browser doesn't support smooth behavior.
 */
export function scrollToSection(id: string, onDone?: () => void): void {
  if (!isBrowser()) return;
  const target = document.getElementById(id);
  if (!target) return;
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  target.scrollIntoView({ behavior, block: 'start' });
  onDone?.();
}
