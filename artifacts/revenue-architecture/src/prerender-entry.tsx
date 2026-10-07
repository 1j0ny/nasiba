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
  canonical?: string;
  /** Indexing override for thin/transactional pages (e.g. /start). */
  robots?: string;
  /** Optional Open Graph description override when intent differs from the meta description. */
  ogDescription?: string;
  /** Optional JSON-LD block (accepted as-is; prerendered into raw HTML head). */
  structuredData?: Record<string, unknown>;
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
    path: '/first-buyer-diagnosis',
    title: 'First Buyer Diagnosis for SaaS \u2014 Nasiba',
    description: 'Find who your first real SaaS buyer should be, why they haven\u2019t said yes, and which buyer hypothesis your next acquisition cycle should test.',
    ogDescription: 'Find the buyer, mismatch and buying trigger your next SaaS acquisition cycle should actually test.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'First Buyer Diagnosis',
      serviceType: 'SaaS commercial diagnosis / positioning diagnosis',
      description: 'Find who your first real SaaS buyer should be, why they haven\u2019t said yes yet, and which buyer hypothesis the next acquisition cycle should test. $1,000, delivered in 5\u20137 days, asynchronous.',
      provider: {
        '@type': 'Organization',
        name: 'Nasiba',
        url: 'https://www.nasiba.co',
      },
      areaServed: 'Worldwide',
      offers: {
        '@type': 'Offer',
        price: '1000',
        priceCurrency: 'USD',
        url: 'https://www.nasiba.co/first-buyer-diagnosis',
      },
    },
  },
  {
    path: '/sample-diagnosis',
    title: 'Sample Revenue Leak Diagnosis — Nasiba',
    description: 'See an illustrative Revenue Leak Diagnosis showing how Nasiba identifies the commercial break, root cause, buying event, offer logic and priority map for a SaaS product.',
  },
  {
    path: '/start',
    title: 'Start a Diagnosis \u2014 Nasiba',
    description: 'Start a $1,000 asynchronous SaaS diagnosis. Choose the commercial state you are in — finding the first real buyer, or converting existing demand into revenue.',
    // Transactional, thin intake page: keep out of the index, keep
    // internal links (and their equity) intact.
    robots: 'noindex, follow',
  },
  {
    path: '/revenue-architecture',
    title: 'Revenue Architecture \u2014 Nasiba',
    description: 'A focused two-week engagement to rebuild SaaS positioning, economic framing, offers, buying events, pricing and upgrade logic around the path to revenue.',
    canonical: 'https://www.nasiba.co/revenue-architecture',
  },
  {
    path: '/architecture',
    title: 'Revenue Architecture \u2014 Nasiba',
    description: 'A focused two-week engagement to rebuild SaaS positioning, economic framing, offers, buying events, pricing and upgrade logic around the path to revenue.',
    canonical: 'https://www.nasiba.co/revenue-architecture',
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

  // Indexing override (e.g. noindex, follow on the thin /start page)
  if (route.robots) {
    if (/<meta name="robots"/.test(html)) {
      html = html.replace(
        /<meta name="robots" content=".*?"/,
        `<meta name="robots" content="${escapeHtml(route.robots)}"`,
      );
    } else {
      html = html.replace(
        '</head>',
        `    <meta name="robots" content="${escapeHtml(route.robots)}" />\n  </head>`,
      );
    }
  }

  // Add canonical URL before </head>
  const canonicalUrl = route.canonical || `https://www.nasiba.co${route.path}`;
  if (!html.includes('rel="canonical"')) {
    html = html.replace(
      '</head>',
      `    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />\n  </head>`,
    );
  } else {
    html = html.replace(
      /<link rel="canonical" href=".*?"/,
      `<link rel="canonical" href="${escapeHtml(canonicalUrl)}"`,
    );
  }

  // Replace OG title
  html = html.replace(
    /<meta property="og:title" content=".*?"/,
    `<meta property="og:title" content="${escapeHtml(route.title)}"`,
  );

  // Replace OG description
  const ogDescription = route.ogDescription ?? route.description;
  html = html.replace(
    /<meta property="og:description" content=".*?"/,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}"`,
  );

  // Add OG URL
  const ogUrl = route.canonical || `https://www.nasiba.co${route.path}`;
  if (!html.includes('og:url')) {
    html = html.replace(
      /<meta property="og:type" content=".*?"/,
      `<meta property="og:type" content="website" />\n    <meta property="og:url" content="${escapeHtml(ogUrl)}"`,
    );
  } else {
    html = html.replace(
      /<meta property="og:url" content=".*?"/,
      `<meta property="og:url" content="${escapeHtml(ogUrl)}"`,
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

  // JSON-LD structured data — Service schema written by the prerenderer,
  // so it lands in raw HTML without adding a client bundle or dependency.
  if (route.structuredData) {
    const jsonLd = JSON.stringify(route.structuredData)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');
    html = html.replace(
      '</head>',
      `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`,
    );
  }

  return html;
}
