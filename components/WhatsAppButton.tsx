'use client';
import { LineIcon } from './LineIcon';
import { trackEvent } from '../lib/analytics';
import { businessContact } from '../lib/business';
export function WhatsAppButton() { return <a className="whatsapp-float" href={businessContact.whatsapp.href} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" onClick={() => trackEvent('contact_clicked',{contact_method:'whatsapp',location:'floating_button'})}><span className="whatsapp-icon"><LineIcon name="whatsapp"/></span><span className="whatsapp-label">Chat on WhatsApp</span></a>; }
