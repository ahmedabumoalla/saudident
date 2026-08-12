"use client";

import Image from "next/image";
import { MapPin, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";
import { KhamisFloorExperience } from "@/components/saudident/KhamisFloorExperience";
import { branches } from "@/data/saudident";
import {
  DEMO_CONTENT_MS,
  khamisFloorHotspots,
  type DemoDetailFrame,
  type FloorHotspot,
} from "@/data/khamis-floor-map";

type BranchId = "khamis" | "abha";
type MapFirstScene = "map" | "focusing" | "floor" | "abha";

const branchCoordinates: Record<BranchId, [number, number]> = {
  khamis: [42.6963958, 18.3042106],
  abha: [42.5187524, 18.2085432],
};

const overviewBounds: [[number, number], [number, number]] = [
  branchCoordinates.abha,
  branchCoordinates.khamis,
];

type PendingWait = { timer: number; resolve: (active: boolean) => void };
type PendingMove = { cancel: () => void };
const DEMO_CAMERA_SETTLE_MS = 1600;
const DEMO_FRAME_TRANSITION_MS = 440;

export function MapFirstExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);
  const actionSessionRef = useRef(0);
  const demoSessionRef = useRef(0);
  const demoActiveRef = useRef(false);
  const demoMapMotionRef = useRef(false);
  const pendingWaitRef = useRef<PendingWait | null>(null);
  const pendingMoveRef = useRef<PendingMove | null>(null);
  const [scene, setScene] = useState<MapFirstScene>("map");
  const [selectedHotspot, setSelectedHotspot] = useState<FloorHotspot | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [demoFrame, setDemoFrame] = useState<DemoDetailFrame | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const cancelPending = useCallback(() => {
    const pendingWait = pendingWaitRef.current;
    if (pendingWait) {
      window.clearTimeout(pendingWait.timer);
      pendingWaitRef.current = null;
      pendingWait.resolve(false);
    }
    pendingMoveRef.current?.cancel();
    pendingMoveRef.current = null;
  }, []);

  const stopDemo = useCallback(() => {
    demoActiveRef.current = false;
    demoSessionRef.current += 1;
    demoMapMotionRef.current = false;
    setDemoActive(false);
    cancelPending();
    mapRef.current?.stop();
  }, [cancelPending]);

  const fitOverview = useCallback((duration = 1200) => {
    const map = mapRef.current;
    if (!map) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    map.resize();
    map.fitBounds(overviewBounds, {
      padding: mobile ? 52 : 105,
      duration,
      pitch: 0,
      bearing: 0,
      essential: true,
    });
  }, []);

  const showOverview = useCallback((manual = true) => {
    if (manual) stopDemo();
    actionSessionRef.current += 1;
    setSelectedHotspot(null);
    setGalleryIndex(0);
    setDemoFrame(null);
    setScene("map");
    window.requestAnimationFrame(() => fitOverview(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 220 : 1200,
    ));
  }, [fitOverview, stopDemo]);

  const focusBranch = useCallback(async (id: BranchId, manual = true) => {
    if (manual) stopDemo();
    const action = ++actionSessionRef.current;
    setSelectedHotspot(null);
    setGalleryIndex(0);
    setDemoFrame(null);
    setScene("focusing");
    const map = mapRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (map) {
      await new Promise<void>((resolve) => {
        let settled = false;
        const finish = () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(fallback);
          map.off("moveend", finish);
          resolve();
        };
        const fallback = window.setTimeout(finish, reducedMotion ? 450 : 2900);
        map.once("moveend", finish);
        map.flyTo({
          center: branchCoordinates[id],
          zoom: id === "khamis" ? 16.7 : 15.8,
          pitch: id === "khamis" ? 49 : 42,
          bearing: id === "khamis" ? -5 : 4,
          duration: reducedMotion ? 240 : id === "khamis" ? 2200 : 1600,
          essential: true,
        });
      });
    } else {
      await new Promise((resolve) => window.setTimeout(resolve, 320));
    }

    if (actionSessionRef.current !== action) return;
    setScene(id === "khamis" ? "floor" : "abha");
  }, [stopDemo]);

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) return;
    let cancelled = false;
    void import("mapbox-gl").then(({ default: mapboxgl }) => {
      if (cancelled || !mapContainerRef.current) return;
      if (!mapboxgl.supported()) { setMapError(true); return; }
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const map = new mapboxgl.Map({
        accessToken: token,
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        bounds: overviewBounds,
        fitBoundsOptions: { padding: mobile ? 52 : 105 },
        attributionControl: true,
      });
      mapRef.current = map;
      if (!mobile) map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-left");
      map.on("load", () => { setMapReady(true); map.resize(); });
      map.on("error", (event) => {
        console.error("Mapbox initialization failed", event.error);
      });
      map.on("dragstart", () => { if (!demoMapMotionRef.current) stopDemo(); });
      map.on("zoomstart", () => { if (!demoMapMotionRef.current) stopDemo(); });

      const resizeObserver = new ResizeObserver(() => map.resize());
      resizeObserver.observe(mapContainerRef.current);
      branches.forEach((branch) => {
        const branchId = branch.id as BranchId;
        const markerElement = document.createElement("button");
        markerElement.type = "button";
        markerElement.className = "sd-map-first__marker";
        markerElement.setAttribute("aria-label", `فتح فرع ${branch.name}`);
        markerElement.innerHTML = `<strong>${branch.name}</strong><span aria-hidden="true"></span>`;
        markerElement.addEventListener("click", () => { void focusBranch(branchId); });
        markersRef.current.push(new mapboxgl.Marker({ element: markerElement, anchor: "bottom" })
          .setLngLat(branchCoordinates[branchId]).addTo(map));
      });

      map.on("remove", () => resizeObserver.disconnect());
    }).catch((error: unknown) => {
      console.error("Mapbox initialization failed", error);
      setMapError(true);
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [focusBranch, stopDemo, token]);

  useEffect(() => {
    const resize = () => window.requestAnimationFrame(() => mapRef.current?.resize());
    window.addEventListener("orientationchange", resize);
    document.addEventListener("fullscreenchange", resize);
    return () => {
      window.removeEventListener("orientationchange", resize);
      document.removeEventListener("fullscreenchange", resize);
    };
  }, []);

  useEffect(() => {
    if (scene !== "abha") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") showOverview();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scene, showOverview]);

  const isDemoActive = useCallback((session: number) => (
    demoActiveRef.current && demoSessionRef.current === session
  ), []);

  const waitForDemo = useCallback((session: number, duration = DEMO_CONTENT_MS) => new Promise<boolean>((resolve) => {
    if (!isDemoActive(session)) { resolve(false); return; }
    const timer = window.setTimeout(() => {
      pendingWaitRef.current = null;
      resolve(isDemoActive(session));
    }, duration);
    pendingWaitRef.current = { timer, resolve };
  }), [isDemoActive]);

  const moveMapForDemo = useCallback((session: number, move: (map: MapboxMap) => void) => new Promise<boolean>((resolve) => {
    if (!isDemoActive(session)) { resolve(false); return; }
    const map = mapRef.current;
    if (!map) {
      const timer = window.setTimeout(() => {
        pendingWaitRef.current = null;
        resolve(isDemoActive(session));
      }, 350);
      pendingWaitRef.current = { timer, resolve };
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallback);
      map.off("moveend", finish);
      demoMapMotionRef.current = false;
      pendingMoveRef.current = null;
      resolve(isDemoActive(session));
    };
    const cancel = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallback);
      map.off("moveend", finish);
      demoMapMotionRef.current = false;
      resolve(false);
    };
    const fallback = window.setTimeout(finish, 4200);
    pendingMoveRef.current = { cancel };
    demoMapMotionRef.current = true;
    map.once("moveend", finish);
    move(map);
  }), [isDemoActive]);

  const runDemo = useCallback(async (session: number) => {
    const orderedHotspots = [...khamisFloorHotspots].sort((a, b) => a.demoOrder - b.demoOrder);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    while (isDemoActive(session)) {
      setSelectedHotspot(null);
      setGalleryIndex(0);
      setDemoFrame(null);
      setScene("map");
      if (!await moveMapForDemo(session, (map) => {
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        map.resize();
        map.fitBounds(overviewBounds, { padding: mobile ? 52 : 105, duration: reducedMotion ? 220 : 1200, pitch: 0, bearing: 0 });
      })) return;
      if (!await waitForDemo(session)) return;

      setScene("focusing");
      if (!await moveMapForDemo(session, (map) => map.flyTo({
        center: branchCoordinates.khamis,
        zoom: 16.7,
        pitch: 49,
        bearing: -5,
        duration: reducedMotion ? 240 : 2200,
        essential: true,
      }))) return;
      setScene("floor");
      if (!await waitForDemo(session)) return;

      for (const hotspot of orderedHotspots) {
        setSelectedHotspot(hotspot);
        setGalleryIndex(0);
        setDemoFrame(null);
        if (!await waitForDemo(session, DEMO_CAMERA_SETTLE_MS)) return;
        const frames: DemoDetailFrame[] = hotspot.kind === "clinic"
          ? ["doctor", "services", "offers", "equipment"]
          : hotspot.kind === "reception"
            ? ["photo", "booking", "offers"]
            : hotspot.kind === "radiology" || hotspot.kind === "sterilization"
              ? ["equipment"]
              : hotspot.gallery?.length
                ? ["photo"]
                : ["info"];
        for (const frame of frames) {
          setDemoFrame(frame);
          if (!await waitForDemo(session, DEMO_CONTENT_MS + DEMO_FRAME_TRANSITION_MS)) return;
        }
      }

      setSelectedHotspot(null);
      setGalleryIndex(0);
      setDemoFrame(null);
      if (!await waitForDemo(session)) return;
    }
  }, [isDemoActive, moveMapForDemo, waitForDemo]);

  const startDemo = useCallback(() => {
    stopDemo();
    const session = ++demoSessionRef.current;
    demoActiveRef.current = true;
    setDemoActive(true);
    void rootRef.current?.requestFullscreen?.().catch(() => undefined);
    void runDemo(session);
  }, [runDemo, stopDemo]);

  useEffect(() => () => stopDemo(), [stopDemo]);

  const handleHotspotSelect = (hotspot: FloorHotspot) => {
    setSelectedHotspot(hotspot);
    setGalleryIndex(0);
    setDemoFrame(null);
  };

  const handleFloorBack = () => {
    stopDemo();
    setSelectedHotspot(null);
    setGalleryIndex(0);
    setDemoFrame(null);
  };

  return (
    <div ref={rootRef} className={`sd-map-first is-${scene}${demoActive ? " is-demo" : ""}`} dir="rtl">
      <div className="sd-map-first__chrome">
        <Image
          src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
          alt="سعودي دنت"
          width={4096}
          height={1139}
          priority
          unoptimized
        />
        <button type="button" onClick={demoActive ? stopDemo : startDemo}>
          {demoActive ? <Pause aria-hidden /> : <Play aria-hidden fill="currentColor" />}
          {demoActive ? "إيقاف الديمو" : "تشغيل الديمو"}
        </button>
      </div>

      <main className="sd-map-first__stage" id="main-content">
        <div className="sd-map-first__map-layer">
          {token && !mapError ? (
            <div ref={mapContainerRef} className={`sd-map-first__map${mapReady ? " is-ready" : ""}`} />
          ) : (
            <div className="sd-map-first__error" role="status"><MapPin aria-hidden /><p>خريطة الفروع غير متاحة حاليًا</p></div>
          )}
        </div>

        {scene === "map" && <p className="sd-map-first__hint">اختر فرعًا من الخريطة</p>}

        {scene === "floor" && (
          <KhamisFloorExperience
            selectedHotspot={selectedHotspot}
            galleryIndex={galleryIndex}
            demoActive={demoActive}
            demoFrame={demoFrame}
            onSelectHotspot={handleHotspotSelect}
            onGalleryIndex={setGalleryIndex}
            onBackToOverview={handleFloorBack}
            onReturnToBranches={() => showOverview()}
            onUserInteraction={stopDemo}
          />
        )}

        {scene === "abha" && (
          <section className="sd-abha-soon" aria-labelledby="sd-abha-soon-title">
            <span>سعودي دنت</span>
            <h1 id="sd-abha-soon-title">فرع أبها</h1>
            <p>قريبًا</p>
            <button type="button" className="sd-floor-control" onClick={() => showOverview()}>
              <RotateCcw aria-hidden />
              رجوع للخريطة
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
