import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageShell } from '../../../components/SiteChrome';
import { LineIcon } from '../../../components/LineIcon';
import { Reveal } from '../../../components/Reveal';
import { blogPosts, type BlogPost } from '../../../lib/blog';

type BlogPostPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

function findPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = findPost(params.slug);
  if (!post) {
    return {
      title: 'Article Not Found | J Bells Smart Phone Service Center',
      description: 'The article you are looking for could not be found.',
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/blog/${post.slug}`,
    },
  };
}

// Convert the lightweight Markdown-style content used in lib/blog.ts into
// React nodes. Supports: H2 (`## `), H3 (`### `), blockquotes, bold (`**x**`),
// inline links (`[label](href)`), inline placeholders (`[Anchor]` mapped to /contact),
// ordered/unordered lists, paragraphs.
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let counter = 0;

  const placeholderMap: Record<string, { href: string; label: string }> = {
    'Smartphone Service Center in Trivandrum': {
      href: '/services',
      label: 'Smartphone Service Center in Trivandrum',
    },
    'Our Smartphone Repair Services': {
      href: '/services',
      label: 'Our Smartphone Repair Services',
    },
    'Contact J Bells': {
      href: '/contact',
      label: 'Contact J Bells',
    },
    'Screen Replacement in Trivandrum': {
      href: '/services',
      label: 'Screen Replacement in Trivandrum',
    },
    'Battery Replacement': {
      href: '/services',
      label: 'Battery Replacement',
    },
    'Charging Port Repair': {
      href: '/services',
      label: 'Charging Port Repair',
    },
    'Mobile Phone Repair in Trivandrum': {
      href: '/blog/mobile-phone-repair-in-trivandrum',
      label: 'Mobile Phone Repair in Trivandrum',
    },
  };

  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/;
  const boldPattern = /\*\*([^*]+)\*\*/;
  const placeholderPattern = /\[(Smartphone Service Center in Trivandrum|Our Smartphone Repair Services|Contact J Bells|Screen Replacement in Trivandrum|Battery Replacement|Charging Port Repair|Mobile Phone Repair in Trivandrum)\]/;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(linkPattern);
    const boldMatch = remaining.match(boldPattern);
    const placeholderMatch = remaining.match(placeholderPattern);

    // Order by earliest index.
    const candidates = [
      { kind: 'link' as const, match: linkMatch },
      { kind: 'bold' as const, match: boldMatch },
      { kind: 'placeholder' as const, match: placeholderMatch },
    ].filter((c) => c.match && c.match.index !== undefined) as Array<{
      kind: 'link' | 'bold' | 'placeholder';
      match: RegExpMatchArray;
    }>;

    if (candidates.length === 0) {
      nodes.push(remaining);
      break;
    }

    candidates.sort((a, b) => (a.match.index! - b.match.index!));
    const next = candidates[0];
    const startIdx = next.match.index!;

    if (startIdx > 0) {
      nodes.push(remaining.slice(0, startIdx));
    }

    if (next.kind === 'link') {
      const [, label, href] = next.match;
      const isInternal = href.startsWith('/');
      nodes.push(
        isInternal ? (
          <Link key={`${keyPrefix}-link-${counter}`} href={href}>
            {label}
          </Link>
        ) : (
          <a key={`${keyPrefix}-link-${counter}`} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        )
      );
      remaining = remaining.slice(startIdx + next.match[0].length);
    } else if (next.kind === 'bold') {
      const [, label] = next.match;
      nodes.push(<strong key={`${keyPrefix}-bold-${counter}`}>{label}</strong>);
      remaining = remaining.slice(startIdx + next.match[0].length);
    } else {
      const [, label] = next.match;
      const mapped = placeholderMap[label];
      nodes.push(
        <Link key={`${keyPrefix}-placeholder-${counter}`} href={mapped.href}>
          {mapped.label}
        </Link>
      );
      remaining = remaining.slice(startIdx + next.match[0].length);
    }
    counter += 1;
  }

  return nodes;
}

function splitTableRow(row: string): string[] {
  // Trim leading/trailing pipes and split on internal pipes.
  const trimmed = row.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  // Matches e.g. "--- | --- | :---:" — columns of dashes/colons with optional colons.
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function renderContent(content: string) {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    const text = paragraphBuffer.join(' ').trim();
    if (text.length > 0) {
      blocks.push(
        <p key={`p-${blocks.length}`}>{renderInline(text, `p-${blocks.length}`)}</p>
      );
    }
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (!listBuffer || listBuffer.items.length === 0) {
      listBuffer = null;
      return;
    }
    const type = listBuffer.type;
    const items = listBuffer.items.map((item, i) => (
      <li key={`li-${blocks.length}-${i}`}>{renderInline(item, `li-${blocks.length}-${i}`)}</li>
    ));
    if (type === 'ul') {
      blocks.push(<ul key={`ul-${blocks.length}`}>{items}</ul>);
    } else {
      blocks.push(<ol key={`ol-${blocks.length}`}>{items}</ol>);
    }
    listBuffer = null;
  };

  const flushTable = (header: string, bodyRows: string[]) => {
    if (!header || bodyRows.length === 0) return;
    const headers = splitTableRow(header);
    const rows = bodyRows.map(splitTableRow);
    const blockKey = `tbl-${blocks.length}`;
    blocks.push(
      <div key={`${blockKey}-wrap`} className="blog-table-wrap">
        <table key={blockKey} className="blog-table">
          <thead>
            <tr>
              {headers.map((cell, i) => (
                <th key={`${blockKey}-h-${i}`}>{renderInline(cell, `${blockKey}-h-${i}`)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, r) => (
              <tr key={`${blockKey}-r-${r}`}>
                {cells.map((cell, c) => (
                  <td key={`${blockKey}-r-${r}-c-${c}`}>{renderInline(cell, `${blockKey}-r-${r}-c-${c}`)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // Table detection: a row of pipes followed by a separator row.
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushParagraph();
      flushList();
      const header = line;
      const bodyRows: string[] = [];
      let j = i + 2;
      while (j < lines.length && lines[j].includes('|') && lines[j].trim() !== '') {
        bodyRows.push(lines[j]);
        j += 1;
      }
      flushTable(header, bodyRows);
      i = j;
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push(<h2 key={`h2-${blocks.length}`}>{line.slice(3)}</h2>);
      i += 1;
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push(<h3 key={`h3-${blocks.length}`}>{line.slice(4)}</h3>);
      i += 1;
      continue;
    }
    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      blocks.push(
        <blockquote key={`bq-${blocks.length}`}>
          {renderInline(line.slice(2), `bq-${blocks.length}`)}
        </blockquote>
      );
      i += 1;
      continue;
    }
    if (line.startsWith('---')) {
      flushParagraph();
      flushList();
      blocks.push(<hr key={`hr-${blocks.length}`} />);
      i += 1;
      continue;
    }
    const orderedMatch = line.match(/^(\d+)\.\s+(.*)/);
    const unorderedMatch = line.match(/^[-*]\s+(.*)/);
    if (orderedMatch) {
      flushParagraph();
      if (!listBuffer || listBuffer.type !== 'ol') {
        flushList();
        listBuffer = { type: 'ol', items: [] };
      }
      listBuffer.items.push(orderedMatch[2]);
      i += 1;
      continue;
    }
    if (unorderedMatch) {
      flushParagraph();
      if (!listBuffer || listBuffer.type !== 'ul') {
        flushList();
        listBuffer = { type: 'ul', items: [] };
      }
      listBuffer.items.push(unorderedMatch[1]);
      i += 1;
      continue;
    }
    if (line.trim() === '') {
      flushParagraph();
      flushList();
      i += 1;
      continue;
    }
    flushList();
    paragraphBuffer.push(line.trim());
    i += 1;
  }

  flushParagraph();
  flushList();

  return blocks;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = findPost(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <PageShell active="blog">
      <article className="blog-post">
        <header className="page-hero blog-hero">
          <Reveal>
            <p className="eyebrow">J.BELLS JOURNAL · {post.category.toUpperCase()}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="blog-post-title">{post.title}</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">{post.excerpt}</p>
          </Reveal>
          <Reveal delay={220}>
            <p className="blog-post-meta">
              {post.author?.name ? (
                <span>By {post.author.name}{post.author.role ? ` · ${post.author.role}` : ''}</span>
              ) : null}
              <span> · {post.publishedAt}{post.readingTime ? ` · ${post.readingTime}` : ''}</span>
            </p>
          </Reveal>
        </header>

        <section className="inner-section blog-post-body">
          {post.content ? renderContent(post.content) : <p>This article is being prepared.</p>}

          <div className="blog-post-cta">
            <Link className="button" href="/contact">
              Talk to Us <LineIcon name="arrowUpRight" />
            </Link>
            <Link className="text-link" href="/services">
              View All Services <LineIcon name="arrowRight" />
            </Link>
          </div>
        </section>

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
              Our team in Trivandrum handles diagnosis, display replacement, battery servicing and hardware repair.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="actions">
              <Link className="button" href="/contact">
                Book a Repair <LineIcon name="arrowUpRight" />
              </Link>
              <Link className="text-link" href="/blog">
                Back to Journal <LineIcon name="arrowRight" />
              </Link>
            </div>
          </Reveal>
        </section>
      </article>
    </PageShell>
  );
}
