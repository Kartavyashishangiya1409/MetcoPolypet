#!/usr/bin/env node
// Renders every static preform image in content/preform-images.ts with the design's
// preform-img.js logic (headless Chromium + Three.js), then encodes AVIF + WebP at 1x/2x.
//
//   npm run render:preforms                 render missing images
//   npm run render:preforms -- --force      re-render everything
//   npm run render:preforms -- --only card-n48-85,manufacturing
//
// Requires Playwright's Chromium: `npx playwright install chromium`.

import { createServer } from 'node:http';
import { readFile, mkdir, access } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import {
  preformImages,
  renderSizes,
  OG_SOURCE,
} from '../content/preform-images.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/preforms');
const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyArg = args.find((a) => a.startsWith('--only'));
const only = onlyArg
  ? (onlyArg.includes('=') ? onlyArg.split('=')[1] : args[args.indexOf(onlyArg) + 1]).split(',')
  : null;

const MIME = { '.js': 'text/javascript', '.html': 'text/html' };
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const file = url.startsWith('/three/')
    ? join(root, 'node_modules', url)
    : join(root, 'scripts/render', url === '/' ? 'preform-render.html' : url);
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/** Build the job list: [{ name, spec, w, h, formats }] */
const jobs = [];
for (const [id, spec] of Object.entries(preformImages)) {
  if (only && !only.includes(id)) continue;
  for (const s of renderSizes(spec.w, spec.h)) jobs.push({ name: id, spec, ...s, formats: ['avif', 'webp'] });
  if (spec.mobile) {
    for (const s of renderSizes(spec.mobile.w, spec.mobile.h))
      jobs.push({ name: `${id}-m`, spec, ...s, formats: ['avif', 'webp'] });
  }
}
if (!only || only.includes(OG_SOURCE.id)) {
  const { w, h } = OG_SOURCE.spec;
  jobs.push({ name: OG_SOURCE.id, spec: OG_SOURCE.spec, w, h, formats: ['png'] });
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(origin + '/');
await page.waitForFunction(() => window.rendererReady === true, null, { timeout: 60_000 });

let done = 0;
let skipped = 0;
for (const job of jobs) {
  const targets = job.formats.map((f) => join(outDir, `${job.name}-${job.w}.${f}`));
  if (!force && (await Promise.all(targets.map(exists))).every(Boolean)) {
    skipped++;
    continue;
  }
  const { layout, items, bg, count, pad, ox, oy } = job.spec;
  const dataUrl = await page.evaluate(
    ([spec, w, h]) => window.renderPreform(spec, w, h),
    [{ layout, items, bg, count, pad, ox, oy }, job.w, job.h],
  );
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  for (const [i, f] of job.formats.entries()) {
    const img = sharp(png);
    if (f === 'avif') await img.avif({ quality: 58, effort: 6 }).toFile(targets[i]);
    else if (f === 'webp') await img.webp({ quality: 80, effort: 6 }).toFile(targets[i]);
    else await img.png({ compressionLevel: 9 }).toFile(targets[i]);
  }
  done++;
  console.log(`✓ ${job.name} ${job.w}×${job.h}`);
}

await browser.close();
server.close();
console.log(`\nRendered ${done}, skipped ${skipped} (already present). Output: public/images/preforms/`);
