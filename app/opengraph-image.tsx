import { renderOg, ogSize, ogContentType } from '@/lib/og';

export const alt = 'Metco Polypet — PET preforms from 20 mm to 63 mm neck finishes';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ eyebrow: 'PET preform manufacturer · India', title: 'Precision in every preform.' });
}
