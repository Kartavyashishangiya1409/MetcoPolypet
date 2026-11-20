import { Hero } from '@/components/home/Hero';
import { Story } from '@/components/home/Story';
import { RangeRail } from '@/components/home/RangeRail';
import { Industries } from '@/components/home/Industries';
import { Manufacturing } from '@/components/home/Manufacturing';
import { Process } from '@/components/home/Process';
import { InBrief, Cta } from '@/components/home/HomeSections';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'PET Preform Manufacturer | Metco Polypet',
  description:
    'Metco Polypet manufactures 28 mm PCO 1881 PET preforms from 9.5 g to 18 g for packaged drinking water, carbonated soft drinks, juices and dairy.',
  path: '/',
});

export default function HomePage() {
  return (
    <article data-page="home">
      <Hero />
      <InBrief />
      <Story />
      <RangeRail />
      <Industries />
      <Manufacturing />
      <Process />
      <Cta />
    </article>
  );
}
