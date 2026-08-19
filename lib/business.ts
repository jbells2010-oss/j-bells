export const locations = [
  { name: 'J.BELLS', latitude: '8.6140764', longitude: '76.8363469', mapUrl: 'https://maps.app.goo.gl/ezLs9QCEB5pfHchK6' },
  { name: 'J.Bells Smart Phone Service Center', latitude: '8.6212158', longitude: '76.8355459', mapUrl: 'https://maps.app.goo.gl/iwPGkCkKoWbjHjP38' },
] as const;

export const serviceOptions = ['Display Replacement', 'Camera Repair', 'Battery Replacement', 'Speaker Repair', 'Water Damage Repair', 'Unlock & Password Reset', 'Charging Port Repair', 'Data Recovery', 'Software Solutions', 'Mobile Accessories', 'Other'] as const;

// Central contact configuration. Display and link values are kept separate so
// we can render human-readable numbers (e.g. "+91 97450 38513") while tel:/
// wa.me links use the normalized digit-only form.
export const businessContact = {
  businessName: 'J.BELLS Smart Phone Service Centre',
  phones: [
    { display: '+91 97450 38513', tel: 'tel:+919745038513' },
    { display: '+91 73563 65686', tel: 'tel:+917356365686' },
  ],
  primaryPhone: { display: '+91 97450 38513', tel: 'tel:+919745038513' },
  whatsapp: {
    display: '+91 73563 65686',
    href: 'https://wa.me/917356365686',
  },
  email: {
    address: 'vidyadirajan007@gmail.com',
    href: 'mailto:vidyadirajan007@gmail.com',
  },
  instagram: {
    handle: '@j_bells__',
    href: 'https://www.instagram.com/j_bells__',
  },
  youtube: {
    handle: '@JBells-0666',
    href: 'https://www.youtube.com/@JBells-0666',
  },
} as const;

// Pre-built WhatsApp deep link with a default message. Service-specific CTAs
// can layer their own message on top.
export const whatsappLink = (message?: string) =>
  message
    ? `https://wa.me/917356365686?text=${encodeURIComponent(message)}`
    : 'https://wa.me/917356365686';

// ISO 9001:2015 certification — single source of truth so the About page,
// metadata and any future copy pull from the same place.
export const isoCertification = {
  standard: 'ISO 9001:2015',
  managementSystem: 'Quality Management System',
  scope: 'Provision of Smart Phone Service Center',
  certifyingBody: 'QRO (Quality Research Organization)',
  certificateNumber: '305026072145Q',
  certifiedOn: '21 July 2026',
  firstSurveillanceDue: '20 July 2027',
  secondSurveillanceDue: '20 July 2028',
  validUntil: '20 July 2029',
  location: 'MurukumPuzha, Thiruvananthapuram, PIN-695302, India',
} as const;
