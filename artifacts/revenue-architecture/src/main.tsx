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
