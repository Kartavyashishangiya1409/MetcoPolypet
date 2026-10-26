import { z } from 'zod';
import { products } from '@/content/products';

// Same rules and messages as the design's submit(). Shared by the client (instant inline
// errors) and the server action (authoritative).
export const productOptions = [...products.map((p) => p.name), 'Custom'];

export const enquirySchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name').max(120),
  company: z.string().trim().min(1, 'Company name is required').max(160),
  email: z
    .string()
    .trim()
    .max(200)
    .regex(/^\S+@\S+\.\S+$/, 'Enter a valid work email'),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, '').length >= 8, 'Enter a valid phone number'),
  product: z
    .string()
    .trim()
    .refine((v) => v === '' || productOptions.includes(v), 'Select a preform from the list'),
  qty: z.string().trim().max(80),
  message: z.string().trim().max(3000),
});

export type Enquiry = z.infer<typeof enquirySchema>;
export type EnquiryField = keyof Enquiry;
export type EnquiryErrors = Partial<Record<EnquiryField | 'form', string>>;

export type EnquiryState = {
  status: 'idle' | 'error' | 'sent';
  errors?: EnquiryErrors;
  values?: Partial<Enquiry>;
};

export const FIELDS: EnquiryField[] = [
  'name',
  'company',
  'email',
  'phone',
  'product',
  'qty',
  'message',
];

export function readEnquiry(fd: FormData) {
  return Object.fromEntries(FIELDS.map((k) => [k, String(fd.get(k) ?? '')])) as Enquiry;
}

/** First error message per field */
export function validateEnquiry(values: Enquiry) {
  const r = enquirySchema.safeParse(values);
  if (r.success) return { data: r.data, errors: null };
  const errors: EnquiryErrors = {};
  for (const issue of r.error.issues) {
    const k = issue.path[0] as EnquiryField;
    errors[k] ??= issue.message;
  }
  return { data: null, errors };
}
