"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type MediaGalleryProps = {
  images: string[];
  positions?: string[];
  title: string;
  demoMode?: boolean;
  demoStepId?: string;
  onDemoComplete?: () => void;
  demoImageDuration?: number;
};

const AUTOPLAY_DELAY = 4500;
const AUTOPLAY_RESUME_DELAY = 7000;

export function MediaGallery({ images, positions, title, demoMode = false, demoStepId, onDemoComplete, demoImageDuration = 1800 }: MediaGalleryProps) {
  const [emblaRef, api] = useEmblaCarousel({ direction: "rtl", loop: !demoMode && images.length > 1, duration: 30 });
  const [index, setIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const dragging = useRef(false);
  const scheduleAutoplay = useRef<(delay: number) => void>(() => undefined);
  const stopAutoplay = useRef<() => void>(() => undefined);
  const completionRef = useRef(onDemoComplete);
  useEffect(() => { completionRef.current = onDemoComplete; }, [onDemoComplete]);

  const select = useCallback((nextIndex: number) => { setIndex(nextIndex); api?.scrollTo(nextIndex); scheduleAutoplay.current(AUTOPLAY_RESUME_DELAY); }, [api]);
  const previous = useCallback(() => { api?.scrollPrev(); scheduleAutoplay.current(AUTOPLAY_RESUME_DELAY); }, [api]);
  const next = useCallback(() => { api?.scrollNext(); scheduleAutoplay.current(AUTOPLAY_RESUME_DELAY); }, [api]);

  useEffect(() => {
    if (!api) return;
    const sync = () => setIndex(api.selectedScrollSnap());
    sync(); api.on("select", sync);
    return () => { api.off("select", sync); };
  }, [api]);

  useEffect(() => {
    if (!api || demoMode || reducedMotion || images.length < 2) return;
    let timer: number | undefined;
    const stop = () => { if (timer !== undefined) window.clearTimeout(timer); timer = undefined; };
    const schedule = (delay: number) => { stop(); if (dragging.current || document.hidden) return; timer = window.setTimeout(() => { if (!dragging.current && !document.hidden) { api.scrollNext(); schedule(AUTOPLAY_DELAY); } }, delay); };
    scheduleAutoplay.current = schedule; stopAutoplay.current = stop; schedule(AUTOPLAY_DELAY);
    const visibility = () => document.hidden ? stop() : schedule(AUTOPLAY_RESUME_DELAY);
    document.addEventListener("visibilitychange", visibility);
    return () => { stop(); scheduleAutoplay.current = () => undefined; stopAutoplay.current = () => undefined; document.removeEventListener("visibilitychange", visibility); };
  }, [api, demoMode, images.length, reducedMotion]);

  useEffect(() => {
    if (!api || !demoMode || !demoStepId) return;
    let cancelled = false;
    let timer: number | undefined;
    api.scrollTo(0, true);
    const advance = (current: number) => { timer = window.setTimeout(() => { if (cancelled) return; if (current >= images.length - 1) { completionRef.current?.(); return; } const nextIndex = current + 1; api.scrollTo(nextIndex); setIndex(nextIndex); advance(nextIndex); }, Math.max(250, demoImageDuration)); };
    advance(0);
    return () => { cancelled = true; if (timer !== undefined) window.clearTimeout(timer); };
  }, [api, demoImageDuration, demoMode, demoStepId, images.length]);

  useEffect(() => {
    const nextImage = images[(index + 1) % images.length];
    if (nextImage) { const preload = new window.Image(); preload.src = nextImage; }
  }, [images, index]);

  return <div className={`media-gallery${demoMode ? " is-demo-gallery" : ""}`} onPointerDownCapture={() => { if (!demoMode) { dragging.current = true; stopAutoplay.current(); } }} onPointerUpCapture={() => { if (!demoMode) { dragging.current = false; scheduleAutoplay.current(AUTOPLAY_RESUME_DELAY); } }}>
    <div className="gallery-viewport" ref={emblaRef}><div className="gallery-track">{images.map((src, imageIndex) => <figure className={`gallery-slide${imageIndex === index ? " is-active" : ""}`} key={`${src}-${imageIndex}`}><Image src={src} alt={`${title} — صورة ${imageIndex + 1}`} fill sizes="58vw" priority={imageIndex === 0} style={{ objectPosition: positions?.[imageIndex] ?? "center" }} /></figure>)}</div></div>
    {!demoMode && <div className="gallery-overlay-controls"><div className="gallery-stepper"><button type="button" onClick={previous} aria-label="الصورة السابقة"><ChevronRight /></button><button type="button" onClick={next} aria-label="الصورة التالية"><ChevronLeft /></button></div></div>}
    <div className="gallery-thumbnails" aria-label="الصور المصغرة">{images.map((src, imageIndex) => <button type="button" disabled={demoMode} key={`${src}-thumb`} className={imageIndex === index ? "is-active" : ""} onClick={() => select(imageIndex)} aria-label={`الانتقال إلى الصورة ${imageIndex + 1}`} aria-current={imageIndex === index ? "true" : undefined}><Image src={src} alt="" fill sizes="88px" style={{ objectPosition: positions?.[imageIndex] ?? "center" }} /></button>)}</div>
  </div>;
}
