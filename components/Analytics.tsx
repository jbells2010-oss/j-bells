'use client';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();
  useEffect(() => { if (id && typeof window.gtag === 'function') window.gtag('config', id, { page_path: pathname }); }, [id, pathname]);
  if (!id) return null;
  return <><Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" /><Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${id}',{send_page_view:false});`}</Script></>;
}
