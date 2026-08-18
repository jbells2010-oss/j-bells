// Single source of truth for the production site origin.
//
// Used by sitemap.ts, robots.ts, and metadataBase so every SEO surface
// resolves to the same canonical host (https://j-bells.com).
//
// At deploy time, set NEXT_PUBLIC_SITE_URL (e.g. on Vercel) to override the
// fallback. The fallback exists only so the build never crashes when the
// variable is missing; the production value MUST be the canonical domain.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://j-bells.com';
