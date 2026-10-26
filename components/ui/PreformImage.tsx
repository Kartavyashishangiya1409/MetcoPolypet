import { getImageProps } from 'next/image';
import { preformImages, renderSizes, imagePath } from '@/content/preform-images';
import s from './PreformImage.module.scss';

type Props = {
  id: string;
  alt: string;
  /** `sizes` attribute for the 1x/2x srcset */
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Pre-rendered 3D preform image (see scripts/render-preforms.mjs). AVIF with WebP fallback,
 * 1x/2x, explicit dimensions, optional portrait art direction for narrow screens.
 * Fills its (positioned) parent, like the design's <preform-img>.
 */
export function PreformImage({ id, alt, sizes = '100vw', priority, className }: Props) {
  const spec = preformImages[id];
  if (!spec) throw new Error(`Unknown preform image: ${id}`);

  const srcSet = (name: string, w: number, h: number, ext: 'avif' | 'webp') =>
    renderSizes(w, h)
      .map((r) => `${imagePath(name, r.w, ext)} ${r.w}w`)
      .join(', ');

  const [, x2] = renderSizes(spec.w, spec.h);
  const { props: img } = getImageProps({
    src: imagePath(id, x2.w, 'webp'),
    width: spec.w,
    height: spec.h,
    alt,
    sizes,
    priority,
    loading: priority ? undefined : 'lazy',
  });
  const m = spec.mobile;

  return (
    <picture className={[s.picture, className].filter(Boolean).join(' ')}>
      {m && (
        <>
          <source
            media={`(max-width: ${m.maxWidth}px)`}
            type="image/avif"
            srcSet={srcSet(`${id}-m`, m.w, m.h, 'avif')}
            sizes={sizes}
            width={m.w}
            height={m.h}
          />
          <source
            media={`(max-width: ${m.maxWidth}px)`}
            type="image/webp"
            srcSet={srcSet(`${id}-m`, m.w, m.h, 'webp')}
            sizes={sizes}
            width={m.w}
            height={m.h}
          />
        </>
      )}
      <source type="image/avif" srcSet={srcSet(id, spec.w, spec.h, 'avif')} sizes={sizes} />
      <img
        {...img}
        srcSet={srcSet(id, spec.w, spec.h, 'webp')}
        className={spec.fit === 'cover' ? s.cover : s.contain}
        decoding="async"
      />
    </picture>
  );
}
