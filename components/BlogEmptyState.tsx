'use client';
import Link from 'next/link';
import { Reveal } from './Reveal';
import { LineIcon } from './LineIcon';

const upcomingTopics = [
  {
    title: 'Battery Longevity',
    desc: 'Proper charging cycles and battery health habits.',
    icon: 'battery' as const,
  },
  {
    title: 'Display & Glass Care',
    desc: 'Preventing micro-scratches, cracks, and digitizer damage.',
    icon: 'smartphone' as const,
  },
  {
    title: 'Common Phone Problems',
    desc: 'What we see at the counter most weeks.',
    icon: 'scan' as const,
  },
  {
    title: 'Phone Care Basics',
    desc: 'Simple habits that keep a phone working longer.',
    icon: 'shield' as const,
  },
];

export function BlogEmptyState() {
  return (
    <div className="blog-empty-container">
      <div className="blog-empty-main">
        <Reveal>
          <div className="blog-empty-status">
            <span className="blog-pulse-dot" aria-hidden="true" />
            <span>JOURNAL IN PREPARATION</span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="blog-empty-title">
            Coming Soon
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className="blog-empty-desc">
            We are preparing useful guides, repair insights, and practical device-care advice written by our servicing technicians. Check back soon for our first publications.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="blog-empty-actions">
            <Link className="button" href="/services">
              Explore Services <LineIcon name="arrowRight" />
            </Link>
            <Link className="text-link blog-contact-link" href="/contact">
              Contact J.Bells <LineIcon name="arrowUpRight" />
            </Link>
          </div>
        </Reveal>
      </div>

      <div className="blog-topics-preview">
        <Reveal delay={240}>
          <p className="eyebrow blog-topics-eyebrow">WHAT TO EXPECT</p>
        </Reveal>
        <div className="blog-topics-grid">
          {upcomingTopics.map((topic, i) => (
            <Reveal key={topic.title} delay={280 + i * 60} className="blog-topic-card">
              <div className="blog-topic-header">
                <LineIcon name={topic.icon} />
                <h3>{topic.title}</h3>
              </div>
              <p>{topic.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
