import { renderOg, ogSize, ogContentType } from '@/lib/og';

export const alt = 'Request a PET preform quote from Metco Polypet';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: 'Contact',
    title: 'Tell us the neck finish and gram weight. We’ll send a quote.',
  });
}
