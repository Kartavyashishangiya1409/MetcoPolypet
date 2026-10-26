import { site } from './site';

export const departments = [
  { t: 'Sales', d: 'Quotes, samples and order status for customers in India.', e: site.email.sales },
  { t: 'Exports', d: 'Enquiries from outside India.', e: site.email.exports },
  { t: 'Careers', d: 'Production, quality and sales roles.', e: site.email.careers },
];

export const formFields = [
  { name: 'name', label: 'Name', type: 'text', ac: 'name', ph: 'Your full name' },
  { name: 'company', label: 'Company', type: 'text', ac: 'organization', ph: 'Company name' },
  { name: 'email', label: 'Work email', type: 'email', ac: 'email', ph: 'you@company.com' },
  { name: 'phone', label: 'Phone', type: 'tel', ac: 'tel', ph: '+91' },
] as const;
