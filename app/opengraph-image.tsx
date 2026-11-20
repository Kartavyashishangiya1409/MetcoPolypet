import { renderOg, ogSize, ogContentType } from '@/lib/og';

export const alt = 'Metco Polypet — 28 mm PCO 1881 PET preforms';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: 'PET preform manufacturer · India',
    title: 'Precision in every preform.',
  });
}
