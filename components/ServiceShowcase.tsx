'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { LineIcon, type IconName } from './LineIcon';
import { Reveal } from './Reveal';

export type ServiceShowcaseItem = { number: string; name: string; eyebrow: string; title: string; description: string; image: string; imageAlt: string; icon: IconName };

function ServiceVisual({ service }: { service: ServiceShowcaseItem }) {
  const visualRef = useRef<HTMLDivElement>(null);
  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = Math.max(-8, Math.min(8, ((event.clientX - rect.left) / rect.width - .5) * -16));
    const y = Math.max(-8, Math.min(8, ((event.clientY - rect.top) / rect.height - .5) * -16));
    visualRef.current.style.setProperty('--visual-x', `${x}px`);
    visualRef.current.style.setProperty('--visual-y', `${y}px`);
  };
  const resetMove = () => { visualRef.current?.style.setProperty('--visual-x', '0px'); visualRef.current?.style.setProperty('--visual-y', '0px'); };
  return <div ref={visualRef} onPointerMove={handleMove} onPointerLeave={resetMove} className={`service-visual service-visual-${service.number}`}>
    <Image className="service-photo" src={service.image} alt={service.imageAlt} fill sizes="(max-width: 700px) 88vw, 52vw" priority={service.number === '01'} />
    <div className="service-photo-shade" aria-hidden="true" />
  </div>;
}
export function ServiceShowcase({ services }: { services: ServiceShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const navigationTarget = useRef<number | null>(null);
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-service-index]'));
    const observer = new IntersectionObserver((entries) => {
      const targetIndex = navigationTarget.current;
      if (targetIndex !== null) {
        const target = entries.find((entry) => entry.isIntersecting && Number((entry.target as HTMLElement).dataset.serviceIndex) === targetIndex);
        if (target) {
          setActive(targetIndex);
          navigationTarget.current = null;
        }
        return;
      }
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.serviceIndex));
    }, { rootMargin: '-35% 0px -45% 0px' });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const serviceLabel = (service: ServiceShowcaseItem) => service.number === '10' ? 'Ask About Accessories' : service.number === '08' ? 'Ask About Data Recovery' : service.number === '09' ? 'Get Software Support' : `Get ${service.name.split(' ')[0]} ${service.number === '05' ? 'Damage Help' : service.number === '06' ? 'Help' : 'Service'}`;
  return <div className="showcase-wrap">
    <nav className="service-navigator" aria-label="Jump to a service" style={{ '--navigator-index': active } as React.CSSProperties}>{services.map((service, index) => <button aria-current={active === index ? 'step' : undefined} className={active === index ? 'is-active' : ''} key={service.number} onClick={() => { navigationTarget.current = index; setActive(index); window.setTimeout(() => { if (navigationTarget.current === index) navigationTarget.current = null; }, 1400); document.querySelector(`[data-service-index="${index}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}><span>{service.number}</span><em>{service.name.split(' ')[0]}</em></button>)}</nav>
    <div className="service-showcase">{services.map((service, index) => <article className={`showcase-item ${index % 2 ? 'showcase-item-reverse' : ''}`} data-service-index={index} key={service.name}>
      <Reveal className="showcase-visual-reveal"><ServiceVisual service={service} /></Reveal>
      <Reveal delay={120} className="showcase-copy"><p className="showcase-meta">{service.number} / {String(services.length).padStart(2, '0')} <span>{service.eyebrow}</span></p><h2>{service.title}</h2><p className="body-copy">{service.description}</p><a className="button" href={`/contact?service=${encodeURIComponent(service.name)}`}>{serviceLabel(service)} <LineIcon name="arrowUpRight" /></a></Reveal>
    </article>)}</div>
  </div>;
}