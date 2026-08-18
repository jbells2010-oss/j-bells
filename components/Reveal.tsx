'use client';
import { useEffect, useRef } from 'react';
export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect(); } }, { threshold: .14 }); observer.observe(node); return () => observer.disconnect(); }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}>{children}</div>;
}
