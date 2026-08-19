'use client';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export type HeroTextTimelineHandle = {
  updateProgress: (progress: number) => void;
};

type Scene = {
  title: React.ReactNode;
  detail?: string;
  start: number;
  inEnd: number;
  outStart: number;
  end: number;
  brand?: boolean;
};

const scenes: Scene[] = [
  { title: <>Your Phone.<br/><em>Our Repair Bench.</em></>, detail: 'Smartphone servicing in Trivandrum.', start: 0, inEnd: .03, outStart: .22, end: .30 },
  { title: <>Cracked Screen?<br/><em>We Open It Up.</em></>, start: .30, inEnd: .38, outStart: .45, end: .52 },
  { title: <>Charging Port.<br/><em>Battery. Camera.</em></>, start: .52, inEnd: .60, outStart: .70, end: .77 },
  { title: <>Walk In.<br/><em>Ask About the Repair.</em></>, detail: 'ISO 9001:2015 CERTIFIED', start: .77, inEnd: .85, outStart: .92, end: .97 },
  { title: <>J BELLS SMART PHONE SERVICE CENTER</>, start: .96, inEnd: 1, outStart: 1.1, end: 1.1, brand: true },
];

const smooth = (value: number) => value * value * (3 - 2 * value);

const sceneOpacity = (progress: number, scene: Scene) => {
  const entering = smooth(Math.max(0, Math.min(1, (progress - scene.start) / Math.max(.001, scene.inEnd - scene.start))));
  const leaving = scene.outStart > 1 ? 1 : 1 - smooth(Math.max(0, Math.min(1, (progress - scene.outStart) / Math.max(.001, scene.end - scene.outStart))));
  return entering * leaving;
};

export const HeroTextTimeline = forwardRef<HeroTextTimelineHandle, { progress?: number }>(
  function HeroTextTimeline({ progress = 0 }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      updateProgress: (currentProgress: number) => {
        if (rootRef.current) {
          rootRef.current.style.setProperty('--timeline-progress', String(currentProgress));
        }
        for (let i = 0; i < scenes.length; i++) {
          const el = sceneRefs.current[i];
          if (!el) continue;
          const opacity = sceneOpacity(currentProgress, scenes[i]);
          el.style.opacity = String(opacity);
          el.style.transform = `translate3d(0, ${(1 - opacity) * 20}px, 0)`;
          el.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
        }
      },
    }), []);

    return (
      <div className="hero-timeline" ref={rootRef} aria-live="polite">
        {scenes.map((scene, index) => {
          const opacity = sceneOpacity(progress, scene);
          return (
            <div
              ref={(el) => { sceneRefs.current[index] = el; }}
              className={`timeline-scene scene-${index}${scene.brand ? ' timeline-brand' : ''}`}
              key={index}
              style={{
                opacity,
                transform: `translate3d(0, ${(1 - opacity) * 20}px, 0)`,
                pointerEvents: opacity > 0.05 ? 'auto' : 'none',
              }}
            >
              <h2>{scene.title}</h2>
              {scene.detail && <p>{scene.detail}</p>}
              {index === 0 && <p className="timeline-credibility">ISO 9001:2015 CERTIFIED</p>}
            </div>
          );
        })}
      </div>
    );
  }
);
