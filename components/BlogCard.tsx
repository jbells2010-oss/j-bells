import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '../lib/blog';
import { LineIcon } from './LineIcon';

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      {post.image ? (
        <div className="blog-card-image-wrap">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="blog-card-image"
          />
        </div>
      ) : (
        <div className="blog-card-image-wrap blog-card-image-placeholder">
          <LineIcon name="smartphone" />
        </div>
      )}
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-card-category">{post.category}</span>
          {post.readingTime && <span className="blog-card-read-time">{post.readingTime}</span>}
        </div>
        <h3 className="blog-card-title">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <div className="blog-card-footer">
          <span className="blog-card-date">{post.publishedAt}</span>
          <Link className="blog-card-link" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
            Read Article <LineIcon name="arrowRight" />
          </Link>
        </div>
      </div>
    </article>
  );
}
