"use client";

import Image from "next/image";
import { Map } from "lucide-react";
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { FloorHotspotDetail } from "@/components/saudident/FloorHotspotDetail";
import {
  FLOOR_MAP_ASPECT_RATIO,
  FLOOR_MAP_DEBUG,
  khamisFloorHotspots,
  type DemoDetailFrame,
  type FloorHotspot,
} from "@/data/khamis-floor-map";
import { gsap, useGSAP } from "@/lib/gsap";

type PanelState = "desktop" | "tablet" | "mobile";

type FloorViewportMetrics = {
  width: number;
  height: number;
  planeLeft: number;
  planeTop: number;
  planeWidth: number;
  planeHeight: number;
};

export function getFloorCameraTarget(
  hotspot: FloorHotspot,
  viewport: FloorViewportMetrics,
  panelState: PanelState,
  scaleOverride?: number,
) {
  const scale = scaleOverride ?? (panelState === "mobile" ? 2.35 : panelState === "tablet" ? 1.85 : 1.68);
  const focusX = viewport.width * (panelState === "desktop" ? 0.38 : 0.5);
  const focusY = viewport.height * (panelState === "mobile" ? 0.23 : panelState === "tablet" ? 0.27 : 0.5);
  const hotspotX = viewport.planeWidth * hotspot.x / 100;
  const hotspotY = viewport.planeHeight * hotspot.y / 100;

  return {
    x: focusX - viewport.planeLeft - hotspotX * scale,
    y: focusY - viewport.planeTop - hotspotY * scale,
    scale,
  };
}

type KhamisFloorExperienceProps = {
  selectedHotspot: FloorHotspot | null;
  galleryIndex: number;
  demoActive: boolean;
  demoFrame: DemoDetailFrame | null;
  onSelectHotspot: (hotspot: FloorHotspot) => void;
  onGalleryIndex: (index: number) => void;
  onBackToOverview: () => void;
  onReturnToBranches: () => void;
  onUserInteraction: () => void;
};

export function KhamisFloorExperience({
  selectedHotspot,
  galleryIndex,
  demoActive,
  demoFrame,
  onSelectHotspot,
  onGalleryIndex,
  onBackToOverview,
  onReturnToBranches,
  onUserInteraction,
}: KhamisFloorExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(selectedHotspot);
  const previousHotspotRef = useRef<FloorHotspot | null>(null);
  const detailSelectionRef = useRef<FloorHotspot | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [debugPositions, setDebugPositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    selectedRef.current = selectedHotspot;
  }, [selectedHotspot]);

  useEffect(() => {
    const hadDetail = Boolean(detailSelectionRef.current);
    detailSelectionRef.current = selectedHotspot;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = selectedHotspot && !hadDetail ? (reducedMotion ? 80 : 580) : 0;
    const timer = window.setTimeout(() => setDetailVisible(Boolean(selectedHotspot)), delay);
    return () => window.clearTimeout(timer);
  }, [selectedHotspot]);

  const readCameraMetrics = useCallback(() => {
    const viewport = viewportRef.current;
    const camera = cameraRef.current;
    if (!viewport || !camera) return null;
    const width = viewport.clientWidth;
    const panelState: PanelState = width <= 767 ? "mobile" : width < 1100 ? "tablet" : "desktop";
    return {
      panelState,
      viewport: {
        width,
        height: viewport.clientHeight,
        planeLeft: camera.offsetLeft,
        planeTop: camera.offsetTop,
        planeWidth: camera.offsetWidth,
        planeHeight: camera.offsetHeight,
      },
    };
  }, []);

  const setHotspotInverse = useCallback((scale: number) => {
    rootRef.current?.style.setProperty("--sd-hotspot-inverse", String(1 / scale));
  }, []);

  const positionCameraImmediately = useCallback((hotspot: FloorHotspot | null) => {
    const camera = cameraRef.current;
    if (!camera) return;
    if (!hotspot) {
      setHotspotInverse(1);
      gsap.set(camera, { x: 0, y: 0, scale: 1, transformOrigin: "0 0" });
      return;
    }
    const metrics = readCameraMetrics();
    if (!metrics) return;
    const target = getFloorCameraTarget(hotspot, metrics.viewport, metrics.panelState);
    setHotspotInverse(target.scale);
    gsap.set(camera, { ...target, transformOrigin: "0 0" });
  }, [readCameraMetrics, setHotspotInverse]);

  useGSAP(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previous = previousHotspotRef.current;

    if (!selectedHotspot) {
      setHotspotInverse(1);
      gsap.to(camera, {
        x: 0,
        y: 0,
        scale: 1,
        transformOrigin: "0 0",
        duration: reducedMotion ? 0.18 : 0.8,
        ease: "power3.inOut",
        overwrite: true,
      });
      previousHotspotRef.current = null;
      return;
    }

    const metrics = readCameraMetrics();
    if (!metrics) return;
    const target = getFloorCameraTarget(selectedHotspot, metrics.viewport, metrics.panelState);
    const distance = previous
      ? Math.hypot(selectedHotspot.x - previous.x, selectedHotspot.y - previous.y)
      : 0;
    setHotspotInverse(target.scale);

    const timeline = gsap.timeline({ defaults: { overwrite: true } });
    if (!previous || reducedMotion || distance <= 14) {
      timeline.to(camera, {
        ...target,
        transformOrigin: "0 0",
        duration: reducedMotion ? 0.2 : previous ? 0.72 : 0.98,
        ease: "power3.inOut",
      });
    } else {
      const travelScale = 1.18;
      const fromWide = getFloorCameraTarget(previous, metrics.viewport, metrics.panelState, travelScale);
      const toWide = getFloorCameraTarget(selectedHotspot, metrics.viewport, metrics.panelState, travelScale);
      timeline
        .to(camera, { ...fromWide, duration: 0.38, ease: "power2.inOut" })
        .to(camera, { x: toWide.x, y: toWide.y, duration: 0.68, ease: "power2.inOut" }, "-=0.04")
        .to(camera, { ...target, duration: 0.52, ease: "power3.out" }, "-=0.1");
    }
    previousHotspotRef.current = selectedHotspot;
  }, { scope: rootRef, dependencies: [selectedHotspot?.id, readCameraMetrics, setHotspotInverse] });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const refresh = () => window.requestAnimationFrame(() => positionCameraImmediately(selectedRef.current));
    const observer = new ResizeObserver(refresh);
    observer.observe(viewport);
    window.addEventListener("orientationchange", refresh);
    document.addEventListener("fullscreenchange", refresh);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", refresh);
      document.removeEventListener("fullscreenchange", refresh);
    };
  }, [positionCameraImmediately]);

  useEffect(() => {
    if (!selectedHotspot) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onUserInteraction();
      onBackToOverview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBackToOverview, onUserInteraction, selectedHotspot]);

  const selectHotspot = (hotspot: FloorHotspot) => {
    onUserInteraction();
    onGalleryIndex(0);
    onSelectHotspot(hotspot);
  };

  const beginDebugDrag = (event: ReactPointerEvent<HTMLButtonElement>, hotspot: FloorHotspot) => {
    if (!FLOOR_MAP_DEBUG) return;
    event.preventDefault();
    event.stopPropagation();
    const coordinatePlane = event.currentTarget.parentElement?.parentElement;
    if (!coordinatePlane) return;
    const pointerId = event.pointerId;
    event.currentTarget.setPointerCapture(pointerId);
    const move = (pointerEvent: PointerEvent) => {
      const rect = coordinatePlane.getBoundingClientRect();
      const x = Math.min(100, Math.max(0, ((pointerEvent.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((pointerEvent.clientY - rect.top) / rect.height) * 100));
      setDebugPositions((current) => ({ ...current, [hotspot.id]: { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) } }));
    };
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end, { once: true });
  };

  const returnToMap = () => {
    onUserInteraction();
    onReturnToBranches();
  };

  return (
    <section
      ref={rootRef}
      className={`sd-floor${selectedHotspot ? " has-detail" : ""}${detailVisible ? " is-detail-visible" : ""}${FLOOR_MAP_DEBUG ? " is-debug" : ""}`}
      aria-label="المخطط التفاعلي لفرع خميس مشيط"
    >
      <div className="sd-floor__background" aria-hidden="true" />
      <header className="sd-floor__topline">
        <div><span>سعودي دنت</span><h1>فرع خميس مشيط</h1></div>
        {!selectedHotspot && (
          <button type="button" className="sd-floor-control" onClick={returnToMap}>
            <Map aria-hidden />
            خريطة الفروع
          </button>
        )}
      </header>

      <div ref={viewportRef} className="sd-floor__viewport">
        <div
          ref={cameraRef}
          className="sd-floor__camera sd-floor__plane"
          style={{ aspectRatio: FLOOR_MAP_ASPECT_RATIO }}
        >
          <Image
            src="/assets/branches/khamis-mushait/interactive-floor-map.png"
            alt="المخطط الكامل لفرع سعودي دنت في خميس مشيط"
            fill
            priority
            unoptimized
            sizes="(max-width: 767px) 100vw, 1448px"
            className="sd-floor__image"
          />
          {FLOOR_MAP_DEBUG && <div className="sd-floor__debug-grid" aria-hidden="true" />}
          <div className="sd-floor__hotspots" role="group" aria-label="مرافق وعيادات الفرع">
            {khamisFloorHotspots.map((hotspot) => {
              const position = debugPositions[hotspot.id] ?? hotspot;
              const positionedHotspot = { ...hotspot, x: position.x, y: position.y };
              return (
                <button
                  type="button"
                  key={hotspot.id}
                  className={`sd-floor-hotspot${selectedHotspot?.id === hotspot.id ? " is-selected" : ""}`}
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                  aria-label={`فتح تفاصيل ${hotspot.title}`}
                  aria-pressed={selectedHotspot?.id === hotspot.id}
                  onPointerDown={(event) => beginDebugDrag(event, hotspot)}
                  onClick={() => selectHotspot(positionedHotspot)}
                >
                  <span className="sd-floor-hotspot__pulse" aria-hidden="true" />
                  <span className="sd-floor-hotspot__dot" aria-hidden="true" />
                  <span className="sd-floor-hotspot__tooltip">{hotspot.title}</span>
                  {FLOOR_MAP_DEBUG && <small>{position.x}, {position.y}</small>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedHotspot && (
        <FloorHotspotDetail
          hotspot={selectedHotspot}
          galleryIndex={galleryIndex}
          demoActive={demoActive}
          demoFrame={demoFrame}
          onGalleryIndex={onGalleryIndex}
          onBack={onBackToOverview}
          onUserInteraction={onUserInteraction}
        />
      )}
    </section>
  );
}
