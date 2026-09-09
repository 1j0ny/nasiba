/**
 * Generates /version.json into the dist directory during production build.
 * Reads the current git commit hash dynamically — no hardcoded values.
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

let commit = 'unknown';
try {
  commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
} catch {
  // fallback if git is not available
}

const version = {
  site: 'nasiba.co',
  commit,
  builtAt: new Date().toISOString(),
  version: 'production-motion-hardening-v2',
};

const outPath = resolve(distDir, 'version.json');
writeFileSync(outPath, JSON.stringify(version, null, 2) + '\n');
console.log(`[version] wrote ${outPath} — commit ${commit.slice(0, 8)}`);
