'use client';
import { useState, type FormEvent } from 'react';
import { serviceOptions } from '../lib/business';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const idleNote = "We'll respond within one business day. By submitting you agree to be contacted about your enquiry.";

const fieldErrorMessage: Record<string, string> = {
  name: 'Please enter your name.',
  phone: 'Please enter a valid phone number.',
  email: 'Please enter a valid email address.',
  service: 'Please choose a service.',
  message: 'Please share a short message about your device.',
};

const generalErrorMessage = 'Sorry — we could not send your enquiry right now. Please try again, or reach us by phone or WhatsApp.';

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>(idleNote);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      phone: String(data.get('phone') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      service: String(data.get('service') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    setStatus('sending');
    setErrorMessage('Sending your enquiry…');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let field: string | undefined;
        try {
          const data = (await response.json()) as { error?: string; field?: string };
          field = data.field;
        } catch {
          field = undefined;
        }
        setErrorMessage((field && fieldErrorMessage[field]) || generalErrorMessage);
        setStatus('error');
        return;
      }
      form.reset();
      setStatus('sent');
      setErrorMessage('Thanks — we received your enquiry and will be in touch shortly.');
    } catch {
      setErrorMessage(generalErrorMessage);
      setStatus('error');
    }
  };

  return <form className="enquiry-form" onSubmit={handleSubmit}>
    <div className="form-row"><label>Name<input name="name" type="text" placeholder="Your name" required /></label><label>Phone<input name="phone" type="tel" placeholder="Your phone number" required /></label></div>
    <label>Email<input name="email" type="email" placeholder="you@example.com" required /></label>
    <label>Service Required<select name="service" defaultValue="" required><option value="" disabled>Select a service</option>{serviceOptions.map((service) => <option key={service}>{service}</option>)}</select></label>
    <label>Message<textarea name="message" rows={5} placeholder="Tell us a little about your device or repair need" required /></label>
    <button className="button" type="submit" disabled={status === 'sending'}>Send Enquiry <span className="line-icon" aria-hidden="true">↗</span></button>
    <p className="form-note" aria-live="polite">{errorMessage}</p>
  </form>;
}
