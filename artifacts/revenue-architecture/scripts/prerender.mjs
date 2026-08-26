/**
 * Prerender script for Nasiba.
 *
 * After the normal Vite client build, this script:
 * 1. Compiles src/prerender-entry.tsx with Vite in SSR mode (Node target)
 * 2. Imports the compiled entry to get renderPage() and routes[]
 * 3. For each route, renders the page to HTML and writes it to dist/
 *
 * Usage:  node scripts/prerender.mjs  (run after `vite build`)
 */

import { build } from 'vite';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

async function main() {
  console.log('[prerender] Starting SSR build…');

  // ── 1. Build the SSR entry ──────────────────────────────────────────
  await build({
    root,
    base: '/',
    logLevel: 'warn',
    resolve: {
      alias: {
        '@': join(root, 'src'),
        '@assets': join(root, '..', '..', 'attached_assets'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      ssr: join(root, 'src/prerender-entry.tsx'),
      outDir: join(root, 'dist/ssr'),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          format: 'es',
        },
      },
    },
    plugins: [
      // We only need React for JSX transform; skip Tailwind for SSR
      (await import('@vitejs/plugin-react')).default(),
    ],
  });

  console.log('[prerender] SSR bundle built. Generating HTML…');

  // ── 2. Import the compiled entry ────────────────────────────────────
  const ssrEntryPath = join(distDir, 'ssr', 'prerender-entry.js');
  const ssrEntryUrl = pathToFileURL(ssrEntryPath).href;
  const { renderPage, routes } = await import(ssrEntryUrl);

  // ── 3. Read the client-built HTML template ──────────────────────────
  const template = readFileSync(join(distDir, 'index.html'), 'utf-8');

  // ── 4. Render each route and write HTML files ───────────────────────
  let written = 0;
  for (const route of routes) {
    const html = renderPage(route, template);
    const filePath =
      route.path === '/'
        ? join(distDir, 'index.html')
        : join(distDir, route.path, 'index.html');

    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, html, 'utf-8');
    written++;
    console.log(`  ✓ ${route.path}`);
  }

  console.log(`[prerender] Done — wrote ${written} HTML files.`);

  // ── 5. QA: Check for visible literal Unicode escapes in HTML ────
  const { readdirSync, statSync } = await import('fs');
  const unicodePattern = /\\u[0-9a-fA-F]{4}/g;
  let qaFailed = false;

  function checkDir(dir) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        checkDir(full);
      } else if (entry.endsWith('.html')) {
        const content = readFileSync(full, 'utf-8');
        const matches = content.match(unicodePattern);
        if (matches) {
          console.error(`[qa] FAIL: ${full} contains literal Unicode escapes: ${matches.join(', ')}`);
          qaFailed = true;
        }
      }
    }
  }

  checkDir(distDir);
  if (qaFailed) {
    console.error('[qa] Unicode QA check FAILED — visible \\uXXXX sequences found in HTML.');
    process.exit(1);
  } else {
    console.log('[qa] Unicode QA check passed — no visible \\uXXXX sequences in HTML.');
  }
}

main().catch((err) => {
  console.error('[prerender] FAILED:', err);
  process.exit(1);
});
