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
  description: 'Smartphone repair guides, device-care tips and notes from the J.Bells service bench in Trivandrum.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'J.BELLS Journal | Smartphone Repair & Care',
    description: 'Smartphone repair guides, device-care tips and notes from the J.Bells service bench in Trivandrum.',
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
            Notes from<br />
            <span>the repair bench.</span><br />
            Useful Things to Know.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="lede">
            Repair guides, device-care tips and the occasional honest answer, written from our Trivandrum service counter.
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
            Our team in Trivandrum handles diagnosis, display, battery and hardware repairs — drop in or message us first.
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
