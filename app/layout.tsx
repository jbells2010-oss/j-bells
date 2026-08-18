import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '../components/Analytics';
import { SITE_URL } from '../lib/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030712',
};

// Centralised metadata. `metadataBase` makes every relative URL Next.js
// generates (canonical, OpenGraph, sitemap, etc.) resolve to the canonical
// production host. Without it, Next.js falls back to the request host, which
// is unsafe behind proxies or on preview deployments.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'J Bells Service Center | Professional Smartphone Repair & Servicing',
    template: '%s | J Bells Service Center',
  },
  description:
    'J Bells Service Center is an ISO Certified smartphone service center providing professional smartphone repair, servicing, diagnosis, and hardware solutions.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'J Bells Service Center',
    title: 'J Bells Service Center | Professional Smartphone Repair & Servicing',
    description:
      'J Bells Service Center is an ISO Certified smartphone service center providing professional smartphone repair, servicing, diagnosis, and hardware solutions.',
    url: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
