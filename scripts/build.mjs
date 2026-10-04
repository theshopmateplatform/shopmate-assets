// Validates assets and generates dist/ (static files + manifest.json).
// Usage: node scripts/build.mjs [--check]
import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const CATEGORIES = ['fonts'];
const ALLOWED = { fonts: ['.woff2', '.woff', '.ttf', '.otf'] };
const MAX_BYTES = 2 * 1024 * 1024;
const NAME_RE = /^[a-z0-9][a-z0-9._-]*$/;
const checkOnly = process.argv.includes('--check');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (e.name !== '.gitkeep') files.push(full);
  }
  return files;
}

const errors = [];
const manifest = { generatedAt: new Date().toISOString(), assets: [] };

for (const category of CATEGORIES) {
  const dir = path.join(ROOT, category);
  for (const file of await walk(dir)) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const { size } = await stat(file);
    const ext = path.extname(file).toLowerCase();
    if (!ALLOWED[category].includes(ext)) errors.push(`${rel}: extension ${ext} not allowed`);
    if (size > MAX_BYTES) errors.push(`${rel}: ${size} bytes exceeds ${MAX_BYTES}`);
    if (!rel.split('/').slice(1).every((p) => NAME_RE.test(p))) {
      errors.push(`${rel}: names must be lowercase [a-z0-9._-]`);
    }
    const sha256 = createHash('sha256').update(await readFile(file)).digest('hex');
    manifest.assets.push({ path: rel, category, size, sha256 });
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

if (!checkOnly) {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });
  for (const category of CATEGORIES) {
    await cp(path.join(ROOT, category), path.join(DIST, category), { recursive: true });
  }
  await writeFile(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2));
}
console.log(`OK: ${manifest.assets.length} asset(s)${checkOnly ? ' validated' : ' built to dist/'}`);
