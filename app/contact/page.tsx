import { ContactHero, QuoteSection, Departments } from '@/components/contact/ContactSections';
import { JsonLd } from '@/components/ui/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbs, webPage } from '@/lib/schema';

const title = 'Contact Metco Polypet | PET Preform Quotes';
const description =
  'Request a quote for PET preforms. Send the neck finish, gram weight and monthly volume; our sales team replies within one working day.';

export const metadata = buildMetadata({ title, description, path: '/contact' });

export default function ContactPage() {
  return (
    <article data-page="contact">
      <JsonLd
        data={[
          webPage('ContactPage', { name: title, description, path: '/contact' }),
          breadcrumbs([{ name: 'Contact Us', path: '/contact' }]),
        ]}
      />
      <ContactHero />
      <QuoteSection />
      <Departments />
    </article>
  );
}
