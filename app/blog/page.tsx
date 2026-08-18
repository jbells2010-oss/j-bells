import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '../../components/SiteChrome';
import { LineIcon } from '../../components/LineIcon';
import { Reveal } from '../../components/Reveal';
import { BlogEmptyState } from '../../components/BlogEmptyState';
import { BlogCard } from '../../components/BlogCard';
import { blogPosts } from '../../lib/blog';

export const metadata: Metadata = {
  title: 'J.BELLS Journal | Smartphone Repair & Care',
  description: 'A future home for smartphone repair guides, device-care tips, and practical mobile advice from J.Bells Smart Phone Service Centre.',
  openGraph: {
    title: 'J.BELLS Journal | Smartphone Repair & Care',
    description: 'A future home for smartphone repair guides, device-care tips, and practical mobile advice from J.Bells Smart Phone Service Centre.',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <PageShell active="blog">
      {/* Blog Editorial Hero */}
      <section className="page-hero blog-hero">
        <Reveal>
          <p className="eyebrow">J.BELLS JOURNAL</p>
        </Reveal>
        <Reveal delay={80}>
          <h1>
            Phone Care.<br />
            <span>Repair Tips.</span><br />
            Useful Things to Know.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="lede">
            Practical information from the world of smartphones, repairs and everyday device care.
          </p>
        </Reveal>
      </section>

      {/* Main Blog Area */}
      <section className="inner-section blog-content-section">
        {blogPosts.length === 0 ? (
          <BlogEmptyState />
        ) : (
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Closing Service / Contact CTA */}
      <section className="page-cta inner-section blog-cta">
        <Reveal>
          <p className="eyebrow">NEED IMMEDIATE ASSISTANCE?</p>
        </Reveal>
        <Reveal delay={100}>
          <h2>
            Have a phone that<br />
            <span>needs repair today?</span>
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="lede">
            Our technicians in Chennai provide thorough diagnosis, display replacement, battery servicing and hardware repair.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="actions">
            <Link className="button" href="/contact">
              Book a Repair <LineIcon name="arrowUpRight" />
            </Link>
            <Link className="text-link" href="/services">
              Browse All Services <LineIcon name="arrowRight" />
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}
