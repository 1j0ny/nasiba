import { hydrateRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

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
