'use client';
import { useEffect, useRef, useCallback } from 'react';
import { SmartphoneScrollAnimation } from './SmartphoneScrollAnimation';
import { HeroTextTimeline, type HeroTextTimelineHandle } from './HeroTextTimeline';

export function HeroExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const timelineRef = useRef<HeroTextTimelineHandle>(null);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      raf.current = 0;
      const section = sectionRef.current;
      if (!section) return;
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const max = Math.max(1, section.offsetHeight - viewportHeight);
      const next = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / max));
      progressRef.current = next;
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  const handlePhoneProgress = useCallback((phoneProgress: number) => {
    timelineRef.current?.updateProgress(phoneProgress);
  }, []);

  return (
    <section id="home" className="hero" ref={sectionRef}>
      <HeroTextTimeline ref={timelineRef} />
      <SmartphoneScrollAnimation progressRef={progressRef} onProgress={handlePhoneProgress} />
      <div className="scroll-note">SCROLL TO EXPLORE <span>↓</span></div>
    </section>
  );
}
