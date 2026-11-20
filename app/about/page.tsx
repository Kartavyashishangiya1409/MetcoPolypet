import {
  AboutHero,
  WhoWeAre,
  VisionMission,
  Figures,
  Milestones,
  Infrastructure,
  Quality,
  Leadership,
} from '@/components/about/AboutSections';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, webPage } from '@/lib/schema';

const title = 'About Metco Polypet | PET Preform Manufacturer, India';
const description =
  'Metco Polypet makes PET preforms and the moulds behind them in India: our plant, machines, QC laboratory, certifications and leadership.';

export const metadata = buildMetadata({ title, description, path: '/about' });

export default function AboutPage() {
  return (
    <article data-page="about">
      <JsonLd
        data={[
          webPage('AboutPage', { name: title, description, path: '/about' }),
          breadcrumbs([{ name: 'About Us', path: '/about' }]),
        ]}
      />
      <AboutHero />
      <WhoWeAre />
      <VisionMission />
      <Figures />
      <Milestones />
      <Infrastructure />
      <Quality />
      <Leadership />
    </article>
  );
}
