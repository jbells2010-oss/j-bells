import { Resend } from 'resend';
import { serviceOptions } from '../../../lib/business';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const serviceNames = new Set<string>(serviceOptions);

const trimToString = (value: unknown, max: number): string => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
};

const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;

const isValidPhone = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 20;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const stripCtl = (value: string): string => value.replace(/[\r\n\t]+/g, ' ');

type Payload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  service?: unknown;
  message?: unknown;
};

export async function POST(request: Request): Promise<Response> {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = trimToString(body.name, 120);
  const phone = trimToString(body.phone, 30);
  const email = trimToString(body.email, 254);
  const service = trimToString(body.service, 80);
  const message = trimToString(body.message, 2000);

  if (name.length < 2) {
    return Response.json({ error: 'validation', field: 'name' }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return Response.json({ error: 'validation', field: 'phone' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return Response.json({ error: 'validation', field: 'email' }, { status: 400 });
  }
  if (!service || !serviceNames.has(service)) {
    return Response.json({ error: 'validation', field: 'service' }, { status: 400 });
  }
  if (message.length < 5) {
    return Response.json({ error: 'validation', field: 'message' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toAddress = process.env.CONTACT_EMAIL;
  const fromAddress = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toAddress || !fromAddress) {
    return Response.json({ error: 'misconfigured' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const safeName = stripCtl(escapeHtml(name));
  const safePhone = stripCtl(escapeHtml(phone));
  const safeEmail = stripCtl(escapeHtml(email));
  const safeService = stripCtl(escapeHtml(service));
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

  const subjectService = stripCtl(service).slice(0, 60);
  const subjectName = stripCtl(name).slice(0, 60);
  const subject = `New enquiry: ${subjectService} — ${subjectName}`.slice(0, 180);

  const textBody = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Service: ${service}`,
    '',
    'Message:',
    message,
  ].join('\n');

  const htmlBody = `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, system-ui, sans-serif; color: #111;">
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Name</td><td>${safeName}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Phone</td><td>${safePhone}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Email</td><td>${safeEmail}</td></tr>
      <tr><td style="padding:6px 12px 6px 0;font-weight:600;">Service</td><td>${safeService}</td></tr>
      <tr><td style="padding:12px 0 6px 0;font-weight:600;vertical-align:top;">Message</td><td>${safeMessage}</td></tr>
    </table>
  `;

  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject,
      html: htmlBody,
      text: textBody,
    });
    if (error) {
      console.error('[contact] resend returned error', error);
      return Response.json({ error: 'send_failed' }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[contact] resend threw', err);
    return Response.json({ error: 'send_failed' }, { status: 502 });
  }
}

export function GET(): Response {
  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
}
