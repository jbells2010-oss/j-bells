import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '../components/Analytics';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030712',
};

export const metadata: Metadata = {
  title: 'J Bells Service Center | Professional Smartphone Repair & Servicing',
  description: 'J Bells Service Center is an ISO Certified smartphone service center providing professional smartphone repair, servicing, diagnosis, and hardware solutions.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
