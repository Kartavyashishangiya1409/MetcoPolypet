import { renderOg, ogSize, ogContentType } from '@/lib/og';

export const alt = 'Metco Polypet PET preform catalogue';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: 'Products', title: 'PET preforms, every size. 28 mm · 9.5–18 g' });
}
