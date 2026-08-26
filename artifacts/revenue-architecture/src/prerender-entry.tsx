import { renderToString } from 'react-dom/server';
import { Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Router as AppRouter } from './App';

const queryClient = new QueryClient();

export interface RouteConfig {
  path: string;
  title: string;
  description: string;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    title: 'Nasiba \u2014 Revenue Architecture for SaaS',
    description: 'Nasiba diagnoses the commercial gaps between SaaS product interest and revenue \u2014 positioning, economic value, offers, buying events and upgrade logic.',
  },
  {
    path: '/about',
    title: 'About \u2014 Nasiba',
    description: 'Nasiba is a specialist Revenue Architecture agency for SaaS, working on the commercial path between product interest and revenue.',
  },
  {
    path: '/cases',
    title: 'Client Work \u2014 Nasiba',
    description: 'Selected commercial diagnosis, positioning and messaging work across SaaS products: ConfluenceMeter, Convert.FAST, CreativeLens.',
  },
  {
    path: '/cases/confluencemeter',
    title: 'ConfluenceMeter \u2014 Nasiba',
    description: 'How Nasiba repositioned ConfluenceMeter around faster identification of high-confluence setups for traders.',
  },
  {
    path: '/cases/convert-fast',
    title: 'Convert.FAST \u2014 Nasiba',
    description: 'How Nasiba aligned the Convert.FAST hero with its bulk file conversion capability.',
  },
  {
    path: '/cases/creativelens',
    title: 'CreativeLens \u2014 Nasiba',
    description: 'How Nasiba shifted CreativeLens messaging toward commercial decisions behind paid acquisition.',
  },
  {
    path: '/diagnosis',
    title: 'Revenue Leak Diagnosis \u2014 Nasiba',
    description: 'A focused async commercial diagnosis of where the path from interest to payment is breaking. Diagnostic lenses, deliverables, and engagement details.',
  },
  {
    path: '/privacy',
    title: 'Privacy \u2014 Nasiba',
    description: 'Nasiba privacy policy for nasiba.co.',
  },
  {
    path: '/terms',
    title: 'Terms \u2014 Nasiba',
    description: 'Terms of service for Nasiba engagements.',
  },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderPage(route: RouteConfig, template: string): string {
  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base="" ssrPath={route.path}>
          <AppRouter />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>,
  );

  let html = template;

  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/s,
    `<title>${escapeHtml(route.title)}</title>`,
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content=".*?"/,
    `<meta name="description" content="${escapeHtml(route.description)}"`,
  );

  // Add canonical URL before </head>
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      '</head>',
      `    <link rel="canonical" href="https://www.nasiba.co${route.path}" />\n  </head>`,
    );
  }

  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content=".*?"/,
    `<meta property="og:title" content="${escapeHtml(route.title)}"`,
  );

  // Replace OG description
  html = html.replace(
    /<meta property="og:description" content=".*?"/,
    `<meta property="og:description" content="${escapeHtml(route.description)}"`,
  );

  // Add OG URL
  if (!html.includes('og:url')) {
    html = html.replace(
      /<meta property="og:type" content=".*?"/,
      `<meta property="og:type" content="website" />\n    <meta property="og:url" content="https://www.nasiba.co${route.path}"`,
    );
  }

  // Replace Twitter title
  html = html.replace(
    /<meta name="twitter:title" content=".*?"/,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}"`,
  );

  // Replace Twitter description
  html = html.replace(
    /<meta name="twitter:description" content=".*?"/,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}"`,
  );

  // Inject rendered HTML into root div
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  return html;
}
