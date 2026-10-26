import { Hero } from '@/components/home/Hero';
import { Story } from '@/components/home/Story';
import { RangeRail } from '@/components/home/RangeRail';
import { Industries } from '@/components/home/Industries';
import { Manufacturing } from '@/components/home/Manufacturing';
import { Process } from '@/components/home/Process';
import { InBrief, Clients, Cta } from '@/components/home/HomeSections';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'PET Preform Manufacturer | Metco Polypet',
  description:
    'Metco Polypet manufactures PET preforms from 20 mm to 63 mm neck finishes and 6 g to 85 g for water, CSD, juice, edible oil, pharma and personal care.',
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
      <Clients />
      <Cta />
    </article>
  );
}
