import { hydrateRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { isBrowser } from '@/lib/motion';

import './index.css';

/**
 * Motion gate (visible-by-default contract, see src/lib/motion.ts):
 * prerendered and no-JS markup never carries `html.js-anim`, so raw HTML
 * is fully visible. Only once the client bundle actually executes — i.e.
 * hydration is genuinely happening — is the document marked motion-capable
 * and below-fold reveals armed (then revealed once, via the shared
 * IntersectionObserver).
 */
if (isBrowser()) {
  document.documentElement.classList.add('js-anim');
}

/**
 * Signature map choreography gate (`.leakmap` / `.fbpath` + `.is-drawn`).
 *
 * The markup ships fully drawn and visible by default; nothing in raw
 * HTML depends on hydration. After hydration, a map whose top edge is
 * entirely below the viewport arms `.is-drawn` (before the browser paints
 * the armed state), so when the user scrolls to it, CSS plays the staged
 * sequence exactly once. A map already intersecting the viewport at
 * hydration simply stays fully drawn — no re-animation, no flash.
 *
 * Reduced motion needs no JS branch: the CSS reduced-motion block
 * neutralises every animation/transition, so an armed map also renders
 * fully drawn there.
 */
function armSignatureChoreographies(): void {
  if (
    !isBrowser() ||
    typeof IntersectionObserver === 'undefined' ||
    typeof MutationObserver === 'undefined' ||
    typeof requestAnimationFrame !== 'function'
  ) {
    return;
  }

  const handledNodes = new WeakSet<Element>();
  let shapeObserver: IntersectionObserver | null = null;

  const ensureShapeObserver = (): IntersectionObserver | null => {
    if (shapeObserver || !isBrowser()) return shapeObserver;
    try {
      shapeObserver = new IntersectionObserver(
        (entries, self) => {
          for (const entry of entries) {
            self.unobserve(entry.target);
            if (entry.boundingClientRect.top > window.innerHeight) {
              const element = entry.target as HTMLElement;
              if (!handledNodes.has(element)) {
                handledNodes.add(element);
                requestAnimationFrame(() => element.classList.add('is-drawn')); // before paint
              }
            }
          }
        },
        { threshold: 0 },
      );
    } catch {
      return null;
    }
    return shapeObserver;
  };

  const sweepForMaps = () => {
    const io = ensureShapeObserver();
    if (!io) return;
    document.querySelectorAll<HTMLElement>('.leakmap, .fbpath').forEach((element) => {
      if (handledNodes.has(element)) return;
      handledNodes.add(element); // mark as handled whether armed or left static
      // Only arm when the map is fully below the initial fold; otherwise
      // keep the already-visible, fully drawn version untouched.
      io.observe(element);
    });
  };

  // The initial sweep covers the prerendered page; a bounded MutationObserver
  // re-sweeps on DOM swaps (SPA route changes) so no map is missed. The
  // MutationObserver stays attached for the document lifetime — no map
  // amounts to leaving the fully drawn static version.
  sweepForMaps();
  const sweepObserver = new MutationObserver(() => {
    sweepForMaps();
  });
  sweepObserver.observe(document.body, { childList: true, subtree: true });
}

armSignatureChoreographies();

hydrateRoot(document.getElementById('root')!,
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  {
    // Keeps caught errors off reportError(), which would raise the dev overlay.
    onCaughtError: (error, errorInfo) => {
      console.error(error, errorInfo.componentStack);
    },
  },
);
