import { renderOg, ogSize, ogContentType } from '@/lib/og';

export const alt = 'About Metco Polypet, PET preform manufacturer in India';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: 'About', title: 'We make the part every bottle starts from.' });
}
