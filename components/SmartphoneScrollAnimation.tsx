'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { trackEvent } from '../lib/analytics';

const TOTAL_FRAMES = 137;
const MAX_FRAME_INDEX = TOTAL_FRAMES - 1;
const SMOOTHING_RATE = 12;
const MAX_ANIMATION_SPEED = 72; // maximum visual frame progression per second
const SCROLL_IDLE_THRESHOLD = 45;
const DECELERATION_RATE = 8.5;
const frameUrl = (i: number) => `/phone-sequence/frame_${String(i + 1).padStart(3, '0')}.webp`;

type Props = {
  progressRef: RefObject<number>;
  onProgress?: (progress: number) => void;
};

export function SmartphoneScrollAnimation({ progressRef, onProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<Array<HTMLImageElement | undefined>>(new Array(TOTAL_FRAMES));
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const stateRef = useRef({
    targetFrame: 0,
    currentFrame: 0,
    loadedCount: 0,
    dpr: 1,
    cssWidth: 0,
    cssHeight: 0,
    drawX: 0,
    drawY: 0,
    drawW: 0,
    drawH: 0,
    lastDrawnIndex: -1,
    lastTime: 0,
    sourceReady: false,
    lastScrollInput: 0,
    hasScrollInput: false,
    previousScrollY: 0,
    inputDirection: 0,
    directionChanged: false,
    animationVelocity: 0,
    canceled: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !section || !ctx) return;
    const state = stateRef.current;
    state.canceled = false;
    state.lastScrollInput = performance.now();
    state.previousScrollY = window.scrollY;

    // Preload frames with first-frame priority for instant mobile hero display.
    const frames = framesRef.current;
    const loadFrame = (i: number, isHighPriority = false) => {
      const img = new Image();
      img.decoding = 'async';
      if (isHighPriority && 'fetchPriority' in img) {
        (img as HTMLImageElement & { fetchPriority: string }).fetchPriority = 'high';
      }
      img.src = frameUrl(i);
      img.onload = () => {
        if (state.canceled) return;
        frames[i] = img;
        state.loadedCount++;
        if (!state.sourceReady && img.naturalWidth) {
          state.sourceReady = true;
          calculateCanvasDimensions();
          draw();
        }
      };
      img.onerror = () => {
        if (state.canceled) return;
        frames[i] = undefined;
        state.loadedCount++;
      };
    };

    // Load initial frames first to render immediately, then stream remaining frames
    loadFrame(0, true);
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      loadFrame(i);
    }

    // Cache drawing geometry. Canvas backing-store size is set once here and
    // again only on true layout/orientation changes — avoiding mobile URL-bar scroll jank.
    const calculateCanvasDimensions = (forceBufferResize = false) => {
      const isMobile = window.innerWidth <= 768;
      // On mobile screens, 1.75x DPR is crisp on retina while saving ~30% GPU fill rate.
      const dpr = isMobile
        ? Math.min(window.devicePixelRatio || 1, 1.75)
        : Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return false;

      const targetW = Math.max(1, Math.round(width * dpr));
      const targetH = Math.max(1, Math.round(height * dpr));

      state.dpr = dpr;
      state.cssWidth = width;
      state.cssHeight = height;

      // Only reallocate the GPU canvas backing buffer if dimensions changed significantly
      if (forceBufferResize || canvas.width !== targetW || Math.abs(canvas.height - targetH) > 40) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // Use the first loaded frame's natural dimensions for aspect-fit scaling;
      // fall back to zero if not yet loaded (sizing will retry once frames land).
      const probe = frames.find((f) => f?.naturalWidth);
      if (!probe) return false;
      const nW = probe.naturalWidth;
      const nH = probe.naturalHeight;
      const scale = Math.min(width / nW, height / nH);
      // Keep the source aspect ratio; destination dimensions are derived from one scale.
      state.drawW = nW * scale;
      state.drawH = nH * scale;
      state.drawX = (width - state.drawW) / 2;
      state.drawY = (height - state.drawH) / 2;
      state.lastDrawnIndex = -1;
      return true;
    };

    const draw = () => {
      const idx = Math.max(0, Math.min(MAX_FRAME_INDEX, Math.round(state.currentFrame)));
      if (!state.sourceReady || state.cssWidth === 0 || state.cssHeight === 0) return;
      if (idx === state.lastDrawnIndex) return;
      const image = frames[idx];
      if (!image?.naturalWidth) return;
      // Redraw at the cached aspect-fit geometry; if the first frame loaded
      // since the last geometry pass, recompute.
      if (state.drawW === 0) calculateCanvasDimensions();
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      ctx.clearRect(0, 0, state.cssWidth, state.cssHeight);
      ctx.drawImage(image, state.drawX, state.drawY, state.drawW, state.drawH);
      state.lastDrawnIndex = idx;
    };

    calculateCanvasDimensions(true);
    draw();
    onProgressRef.current?.(state.currentFrame / MAX_FRAME_INDEX);

    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 0;
    // On touch devices, a slightly higher smoothing rate gives direct finger tracking without lag.
    const activeSmoothingRate = isTouch ? 16 : SMOOTHING_RATE;

    // RAF loop reads progressRef, interpolates, draws.
    let raf = 0;
    const loop = () => {
      if (state.canceled) return;
      const progress = progressRef.current ?? 0;
      const now = performance.now();
      const elapsed = Math.min(100, state.lastTime ? now - state.lastTime : 16.67);
      state.lastTime = now;
      state.targetFrame = Math.max(0, Math.min(MAX_FRAME_INDEX, progress * MAX_FRAME_INDEX));
      const smoothing = 1 - Math.exp((-activeSmoothingRate * elapsed) / 1000);
      const desiredStep = (state.targetFrame - state.currentFrame) * smoothing;
      const maxStep = (MAX_ANIMATION_SPEED * elapsed) / 1000;
      const activeScroll = !state.hasScrollInput || now - state.lastScrollInput <= SCROLL_IDLE_THRESHOLD;
      const atHeroStart = progress <= 0.001 && state.currentFrame > 0.001;

      if (activeScroll || atHeroStart) {
        // New input cancels any residual inertia before applying its direction.
        if (state.directionChanged) {
          state.animationVelocity = 0;
          state.directionChanged = false;
        }
        // Preserve the existing capped scroll response while input is active.
        const step = Math.max(-maxStep, Math.min(maxStep, desiredStep));
        state.animationVelocity = elapsed > 0 ? (step * 1000) / elapsed : 0;
        state.currentFrame += step;
        if (Math.abs(state.targetFrame - state.currentFrame) < 0.001) {
          state.currentFrame = state.targetFrame;
          state.animationVelocity = 0;
        }
      } else {
        // Let the last active velocity decay over roughly 5–10 frames.
        state.animationVelocity *= Math.exp((-DECELERATION_RATE * elapsed) / 1000);
        const step = (state.animationVelocity * elapsed) / 1000;
        state.currentFrame += step;
        if (Math.abs(state.animationVelocity) < 0.05) state.animationVelocity = 0;
      }
      state.currentFrame = Math.max(0, Math.min(MAX_FRAME_INDEX, state.currentFrame));
      draw();
      onProgressRef.current?.(state.currentFrame / MAX_FRAME_INDEX);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const resizeObserver = new ResizeObserver(() => {
      if (state.canceled) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w !== state.cssWidth || Math.abs(h - state.cssHeight) > 4) {
        calculateCanvasDimensions();
        draw();
      }
    });
    resizeObserver.observe(canvas);

    const onResize = () => {
      if (state.canceled) return;
      calculateCanvasDimensions(true);
      draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      state.canceled = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [progressRef]);

  useEffect(() => {
    const onScroll = () => {
      const state = stateRef.current;
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - state.previousScrollY;
      state.previousScrollY = scrollY;
      if (scrollDelta !== 0) {
        const direction = Math.sign(scrollDelta);
        if (state.animationVelocity !== 0 && Math.sign(state.animationVelocity) !== direction) {
          state.animationVelocity = 0;
        }
        state.inputDirection = direction;
        state.directionChanged = true;
      }
      state.lastScrollInput = performance.now();
      state.hasScrollInput = true;
      if ((progressRef.current ?? 0) >= 1) trackEvent('phone_animation_completed');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [progressRef]);

  return (
    <div className="phone-scroll" ref={sectionRef}>
      <div className="phone-logo-layer" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="phone-background-logo" src="/jbells_background_logo.webp" alt="" />
      </div>
      <div className="phone-sticky">
        <canvas
          ref={canvasRef}
          aria-label="Scroll-controlled smartphone disassembly animation"
          role="img"
        />
        <p className="phone-fallback">Scroll to explore the phone&apos;s internal precision.</p>
      </div>
    </div>
  );
}
