import { site } from './site';

export const departments = [
  {
    t: 'Info',
    d: 'General enquiries, quotes, samples and order status.',
    e: site.email.sales,
  },
];

export const formFields = [
  { name: 'name', label: 'Name', type: 'text', ac: 'name', ph: 'Your full name' },
  { name: 'company', label: 'Company', type: 'text', ac: 'organization', ph: 'Company name' },
  { name: 'email', label: 'Work email', type: 'email', ac: 'email', ph: 'you@company.com' },
  { name: 'phone', label: 'Phone', type: 'tel', ac: 'tel', ph: '+91' },
] as const;
