#!/usr/bin/env node
// Renders every static preform image in content/preform-images.ts with the design's
// preform-img.js logic (headless Chromium + Three.js) at 2x, trims 'pad'-fit renders to the
// object, derives 1x, encodes AVIF + WebP, and writes content/preform-manifest.json
// (pixel sizes + fill fraction used by <PreformImage />).
//
//   npm run render:preforms                 render missing images
//   npm run render:preforms -- --force      re-render everything
//   npm run render:preforms -- --only card-n48-85,manufacturing
//
// Also writes the hero poster (assets/hero-preform.png) as AVIF/WebP to public/images/hero/.
//
// Requires Playwright's Chromium: `npx playwright install chromium`.

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { preformImages, renderSizes, OG_SOURCE, HERO_POSTER } from '../content/preform-images.ts';

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

const manifestPath = join(root, 'content/preform-manifest.json');
const manifest = (await exists(manifestPath))
  ? JSON.parse(await readFile(manifestPath, 'utf8'))
  : {};

/** Build the job list: one 2x render per image (and per portrait variant) */
const jobs = [];
for (const [id, spec] of Object.entries(preformImages)) {
  if (only && !only.includes(id)) continue;
  jobs.push({ name: id, spec, w: spec.w, h: spec.h });
  if (spec.mobile) jobs.push({ name: `${id}-m`, spec, w: spec.mobile.w, h: spec.mobile.h });
}

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(origin + '/');
await page.waitForFunction(() => window.rendererReady === true, null, { timeout: 60_000 });

const render = async (spec, w, h) => {
  const { layout, items, bg, count, pad, ox, oy } = spec;
  const dataUrl = await page.evaluate(
    ([sp, ww, hh]) => window.renderPreform(sp, ww, hh),
    [{ layout, items, bg, count, pad, ox, oy }, w, h],
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
};

const encode = async (input, base) => {
  await sharp(input).avif({ quality: 58, effort: 6 }).toFile(`${base}.avif`);
  await sharp(input).webp({ quality: 80, effort: 6 }).toFile(`${base}.webp`);
};

let done = 0;
let skipped = 0;
for (const job of jobs) {
  const prev = manifest[job.name];
  const out = (px) => join(outDir, `${job.name}-${px}`);
  if (
    !force &&
    prev &&
    (await exists(`${out(prev.w)}.avif`)) &&
    (await exists(`${out(prev.w2)}.webp`))
  ) {
    skipped++;
    continue;
  }
  const [, x2] = renderSizes(job.w, job.h);
  const scale = x2.w / job.w;
  let png = await render(job.spec, x2.w, x2.h);
  let entry;
  if (job.spec.fit === 'pad') {
    // Trim to the object's pixels; f = share of the limiting dimension the object filled.
    const { data, info } = await sharp(png)
      .trim({ background: job.spec.bg, threshold: 6 })
      .toBuffer({ resolveWithObject: true });
    const f = Math.max(info.width / x2.w, info.height / x2.h);
    png = data;
    entry = {
      w: Math.round(info.width / scale),
      h: Math.round(info.height / scale),
      w2: info.width,
      h2: info.height,
      f: +f.toFixed(4),
    };
  } else {
    entry = { w: job.w, h: job.h, w2: x2.w, h2: x2.h, f: 1 };
  }
  await encode(png, out(entry.w2));
  await encode(await sharp(png).resize(entry.w, entry.h).toBuffer(), out(entry.w));
  manifest[job.name] = entry;
  done++;
  console.log(`✓ ${job.name} ${entry.w}×${entry.h} (f=${entry.f})`);
}

// OG image source (PNG; Satori can't read AVIF/WebP)
if (!only || only.includes(OG_SOURCE.id)) {
  const target = join(outDir, `${OG_SOURCE.id}.png`);
  if (force || !(await exists(target))) {
    const { w, h } = OG_SOURCE.spec;
    await sharp(await render(OG_SOURCE.spec, w, h))
      .png({ compressionLevel: 9 })
      .toFile(target);
    console.log(`✓ ${OG_SOURCE.id}`);
  }
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile(manifestPath, JSON.stringify(sorted, null, 2) + '\n');

await browser.close();
server.close();

// Hero poster (LCP image): transparent PNG → AVIF/WebP at three widths.
const posterDir = join(root, 'public/images/hero');
await mkdir(posterDir, { recursive: true });
for (const w of HERO_POSTER.widths) {
  for (const f of ['avif', 'webp']) {
    const target = join(posterDir, `hero-preform-${w}.${f}`);
    if (!force && (await exists(target))) continue;
    const img = sharp(join(root, 'assets/hero-preform.png')).resize({ width: w });
    if (f === 'avif') await img.avif({ quality: 60, effort: 6 }).toFile(target);
    else await img.webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(target);
    console.log(`✓ hero-preform ${w}w ${f}`);
  }
}
console.log(
  `\nRendered ${done}, skipped ${skipped} (already present). Output: public/images/preforms/`,
);
