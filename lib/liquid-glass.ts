// Displacement map for the "liquid glass" capsule: an image the SVG <feDisplacementMap> reads
// to bend the page behind the glass. Red/green encode the x/y offset (128 = none). Only a band
// along the rim bends; there the backdrop is sampled from further inside, along the edge
// normal, so content behind the rim looks magnified and curved like the edge of a thick lens.

/** Width of the bending band along the rim, in CSS px */
const BAND = 16;

/** True where backdrop-filter: url(#svg-filter) actually renders (Chromium only). */
export function supportsLiquidGlass(): boolean {
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } })
    .userAgentData?.brands;
  return !!brands?.some((b) => b.brand === 'Chromium');
}

/** PNG data URL of the map for a w × h capsule (fully rounded ends). */
export function liquidGlassMap(w: number, h: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(w, h);
  const r = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Nearest point on the capsule's centre line; the edge is r away from it.
      const cx = Math.min(Math.max(x + 0.5, r), w - r);
      const vx = x + 0.5 - cx;
      const vy = y + 0.5 - r;
      const dist = Math.hypot(vx, vy) || 1;
      const depth = r - dist; // distance in from the rim
      let dx = 0;
      let dy = 0;
      if (depth < BAND && depth > -1) {
        const t = 1 - Math.max(depth, 0) / BAND; // 1 at the rim → 0 at the band's inner edge
        const m = 1 - Math.sqrt(1 - t * t); // circular (lens-like) falloff
        dx = (-vx / dist) * m;
        dy = (-vy / dist) * m;
      }
      const i = (y * w + x) * 4;
      img.data[i] = 128 + dx * 127;
      img.data[i + 1] = 128 + dy * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}
