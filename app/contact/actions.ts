'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { readEnquiry, validateEnquiry, type EnquiryState } from '@/lib/enquiry-schema';
import { rateLimit } from '@/lib/rate-limit';
import { site } from '@/content/site';

const TOO_MANY = 'Too many enquiries from this connection. Please try again in a few minutes.';
const FAILED = `We couldn't send your enquiry. Please email ${site.email.sales} or call ${site.phone.display}.`;

export async function submitEnquiry(_prev: EnquiryState, fd: FormData): Promise<EnquiryState> {
  // Honeypot: real users never see or fill this field. Pretend success to bots.
  if (String(fd.get('website') ?? '') !== '') return { status: 'sent' };

  const values = readEnquiry(fd);
  const { data, errors } = validateEnquiry(values);
  if (!data) return { status: 'error', errors, values };

  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'local';
  if (!rateLimit(ip)) return { status: 'error', errors: { form: TOO_MANY }, values };

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.ENQUIRY_TO || site.email.sales).split(',').map((s) => s.trim());
  const from = process.env.ENQUIRY_FROM || `${site.name} <enquiries@metcopolypet.com>`;

  const lines = [
    `Name:      ${data.name}`,
    `Company:   ${data.company}`,
    `Email:     ${data.email}`,
    `Phone:     ${data.phone}`,
    `Preform:   ${data.product || '—'}`,
    `Monthly:   ${data.qty || '—'}`,
    '',
    data.message || '(no message)',
  ].join('\n');

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[enquiry] RESEND_API_KEY is not set');
      return { status: 'error', errors: { form: FAILED }, values };
    }
    console.info('[enquiry] RESEND_API_KEY not set — enquiry not emailed (dev):\n' + lines);
    return { status: 'sent' };
  }

  try {
    const resend = new Resend(apiKey);
    // Plain-text emails only: user input is never interpolated into HTML.
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `Enquiry: ${data.company}${data.product ? ` — ${data.product}` : ''}`,
      text: lines,
    });
    if (error) throw new Error(error.message);
    // Confirmation to the customer ("A copy has been sent to your email."). It goes to an
    // address anyone can type, so it deliberately does not echo the submitted text — otherwise
    // the form could be used to relay arbitrary content to third parties.
    await resend.emails.send({
      from,
      to: data.email,
      replyTo: to[0],
      subject: `We received your enquiry — ${site.name}`,
      text: `Thank you for your enquiry. Our sales team replies within one working day.\nTo attach drawings, reply to this email.\n\n${site.name}\n${site.phone.display} · ${site.email.sales}`,
    });
    return { status: 'sent' };
  } catch (e) {
    console.error('[enquiry] send failed', e);
    return { status: 'error', errors: { form: FAILED }, values };
  }
}
