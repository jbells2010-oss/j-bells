import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';
import { blogPosts } from '../lib/blog';

// Top-level static routes. `changeFrequency` and `priority` follow Google's
// general guidance: the homepage gets the highest priority, deep content
// pages sit a step below, and utility pages (contact) a step lower again.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Blog posts are sourced from the same `blogPosts` array the blog index
  // uses, so adding a post there automatically surfaces it here. Dates are
  // parsed from the human-readable `publishedAt` string ("August 17, 2026")
  // and fall back to the build time if parsing ever fails.
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => {
    const parsed = new Date(post.publishedAt);
    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: Number.isNaN(parsed.getTime()) ? now : parsed,
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...blogRoutes];
}
