import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '../components/Analytics';
import { SITE_URL } from '../lib/site';
import { businessContact, isoCertification, locations } from '../lib/business';

// Centralised metadata. `metadataBase` makes every relative URL Next.js
// generates (canonical, OpenGraph, sitemap, etc.) resolve to the canonical
// production host. Without it, Next.js falls back to the request host, which
// is unsafe behind proxies or on preview deployments.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'J Bells Smart Phone Service Center | Smartphone Repair in Trivandrum',
    template: '%s | J Bells Smart Phone Service Center',
  },
  description:
    'Smartphone repair service in Trivandrum. Display, battery, charging port and camera repairs, plus diagnosis and software help at J Bells Smart Phone Service Center.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'J Bells Smart Phone Service Center',
    title: 'J Bells Smart Phone Service Center | Smartphone Repair in Trivandrum',
    description:
      'Smartphone repair service in Trivandrum. Display, battery, charging port and camera repairs, plus diagnosis and software help at J Bells Smart Phone Service Center.',
    url: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}#organization`,
    name: 'J Bells Smart Phone Service Center',
    alternateName: 'J Bells',
    description:
      'J Bells Smart Phone Service Center in Trivandrum handles smartphone repairs: display, battery, charging port, camera, speaker and software issues.',
    url: SITE_URL,
    telephone: businessContact.primaryPhone.display,
    email: businessContact.email.address,
    image: `${SITE_URL}/android-chrome-192x192.png`,
    logo: `${SITE_URL}/android-chrome-192x192.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: isoCertification.location.split(',')[0]?.trim(),
      addressLocality: 'Thiruvananthapuram',
      addressRegion: 'Kerala',
      postalCode: '695302',
      addressCountry: 'IN',
    },
    areaServed: 'Trivandrum',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Smartphone Service Center',
      itemListElement: [
        'Display Replacement',
        'Battery Replacement',
        'Charging Port Repair',
        'Camera & Lens Repair',
        'Speaker & Microphone',
        'Software & Hardware',
      ].map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service },
      })),
    },
    location: locations.map((location) => ({
      '@type': 'Place',
      name: location.name,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location.latitude,
        longitude: location.longitude,
      },
      url: location.mapUrl,
    })),
    sameAs: [
      businessContact.instagram.href,
      businessContact.youtube.href,
    ],
    certifications: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: `${isoCertification.standard} — ${isoCertification.managementSystem}`,
        credentialCategory: 'certification',
        identifier: isoCertification.certificateNumber,
        issuedBy: {
          '@type': 'Organization',
          name: isoCertification.certifyingBody,
        },
        validFrom: '2026-07-21',
        validUntil: '2029-07-20',
        about: isoCertification.scope,
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          // The JSON-LD is built from internal constants only — no user input —
          // so it is safe to inject inline.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
