import type { CSSProperties } from 'react';
import { getImageProps } from 'next/image';
import { preformImages, imagePath } from '@/content/preform-images';
import manifest from '@/content/preform-manifest.json';
import s from './PreformImage.module.scss';

type Entry = { w: number; h: number; w2: number; h2: number; f: number };
const files = manifest as Record<string, Entry>;

type Props = {
  id: string;
  alt: string;
  /** `sizes` attribute for the 1x/2x srcset */
  sizes?: string;
  priority?: boolean;
  className?: string;
};

const srcSet = (name: string, e: Entry, ext: 'avif' | 'webp') =>
  `${imagePath(name, e.w, ext)} ${e.w}w, ${imagePath(name, e.w2, ext)} ${e.w2}w`;

/**
 * Pre-rendered 3D preform image (see scripts/render-preforms.mjs). AVIF with WebP fallback,
 * 1x/2x, explicit dimensions, optional portrait art direction. Fills its positioned parent and
 * reproduces the design's <preform-img> framing at any slot size (see content/preform-images.ts).
 */
export function PreformImage({ id, alt, sizes = '100vw', priority, className }: Props) {
  const spec = preformImages[id];
  const e = files[id];
  if (!spec || !e) throw new Error(`Unknown or unrendered preform image: ${id}`);
  const m = spec.mobile ? files[`${id}-m`] : undefined;

  const { props: img } = getImageProps({
    src: imagePath(id, e.w2, 'webp'),
    width: e.w,
    height: e.h,
    alt,
    sizes,
    priority,
    loading: priority ? undefined : 'lazy',
  });

  const pad = spec.fit === 'pad';
  // The object fills fraction f of the slot's limiting dimension, exactly as in the design.
  const style = pad ? ({ '--f': e.f } as CSSProperties) : undefined;

  return (
    <picture className={[s.picture, className].filter(Boolean).join(' ')} style={style}>
      {m && spec.mobile && (
        <>
          <source
            media={`(max-width: ${spec.mobile.maxWidth}px)`}
            type="image/avif"
            srcSet={srcSet(`${id}-m`, m, 'avif')}
            sizes={sizes}
            width={m.w}
            height={m.h}
          />
          <source
            media={`(max-width: ${spec.mobile.maxWidth}px)`}
            type="image/webp"
            srcSet={srcSet(`${id}-m`, m, 'webp')}
            sizes={sizes}
            width={m.w}
            height={m.h}
          />
        </>
      )}
      <source type="image/avif" srcSet={srcSet(id, e, 'avif')} sizes={sizes} />
      <img
        {...img}
        alt={alt}
        srcSet={srcSet(id, e, 'webp')}
        className={pad ? s.pad : s.cover}
        decoding="async"
      />
    </picture>
  );
}
