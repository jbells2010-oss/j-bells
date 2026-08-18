export type AnalyticsParams = Record<string, string | number>;
export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params);
}
declare global { interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] } }
