"use client";

import "mapbox-gl/dist/mapbox-gl.css";

import { useEffect, useRef, type MutableRefObject } from "react";
import { createRoot, type Root } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import { gsap } from "@/lib/gsap";
import { Hotspot } from "@/components/map/hotspot";
import { useExperienceStore } from "@/store/use-experience-store";
import type { Branch } from "@/data/branches";

const REGIONAL_CAMERA = {
  center: [42.6076, 18.2564] as [number, number],
  zoom: 10.7,
  pitch: 20,
  bearing: -10,
};

type MarkerEntry = { marker: mapboxgl.Marker; root: Root; container: HTMLDivElement };

export type MapboxRegionMapHandle = {
  flyToBranch: (branch: Branch, onComplete: () => void) => void;
  resetRegionalMap: () => void;
  stop: () => void;
};

export function MapboxRegionMap({
  items,
  activeId,
  onSelect,
  mapHandleRef,
}: {
  items: Branch[];
  activeId?: string;
  onSelect: (item: Branch) => void;
  mapHandleRef: MutableRefObject<MapboxRegionMapHandle | null>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, MarkerEntry>>(new Map());
  const onSelectRef = useRef(onSelect);
  const mapStatus = useExperienceStore((state) => state.mapStatus);
  const retryKey = useExperienceStore((state) => state.mapRetryKey);
  const setMapStatus = useExperienceStore((state) => state.setMapStatus);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    let disposed = false;
    let readyTimer: number | undefined;
    const failureTimer = window.setTimeout(() => { if (!disposed) setMapStatus("error"); }, 12_000);
    if (!container || !token) {
      return () => window.clearTimeout(failureTimer);
    }

    let map: mapboxgl.Map;
    try {
      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        ...REGIONAL_CAMERA,
        attributionControl: true,
      });
    } catch {
      console.error("تعذر تهيئة خريطة Mapbox");
      return () => window.clearTimeout(failureTimer);
    }

    mapRef.current = map;
    const markers = markersRef.current;
    map.dragPan.disable();
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.dragRotate.disable();
    map.keyboard.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();

    const markReady = () => {
      if (disposed) return;
      window.clearTimeout(failureTimer);
      if (readyTimer) window.clearTimeout(readyTimer);
      setMapStatus("ready");
    };
    const handleLoad = () => {
      map.once("idle", markReady);
      readyTimer = window.setTimeout(markReady, 4000);
    };
    const handleError = (event: mapboxgl.ErrorEvent) => {
      if (disposed) return;
      console.error("تعذر تحميل خريطة Mapbox:", event.error);
    };
    map.once("load", handleLoad);
    map.on("error", handleError);

    const ensureMarker = (item: Branch) => {
      const existing = markers.get(item.id);
      if (existing) {
        existing.marker.setLngLat([item.coordinates.longitude, item.coordinates.latitude]);
        return existing;
      }
      const containerElement = document.createElement("div");
      containerElement.className = "saudident-mapbox-marker";
      const root = createRoot(containerElement);
      const marker = new mapboxgl.Marker({ element: containerElement, anchor: "bottom" })
        .setLngLat([item.coordinates.longitude, item.coordinates.latitude])
        .addTo(map);
      const entry = { marker, root, container: containerElement };
      markers.set(item.id, entry);
      root.render(<Hotspot item={item} active={false} onSelect={() => onSelectRef.current(item)} mapboxMarker />);
      return entry;
    };

    const restoreAllBranchMarkers = () => {
      for (const item of items) {
        const { container: markerElement } = ensureMarker(item);
        const visualElements = [markerElement, ...Array.from(markerElement.querySelectorAll<HTMLElement>(".map-hotspot, .hotspot-icon, .hotspot-label"))];
        gsap.killTweensOf(visualElements);
        markerElement.classList.remove("is-hidden", "is-dimmed", "is-selected", "is-focused", "is-inactive");
        markerElement.style.opacity = "1";
        markerElement.style.visibility = "visible";
        markerElement.style.display = "";
        markerElement.style.filter = "none";
        markerElement.style.pointerEvents = "auto";
        markerElement.style.zIndex = "";
        for (const element of visualElements.slice(1)) {
          element.classList.remove("is-hidden", "is-dimmed", "is-selected", "is-focused", "is-inactive", "is-active");
          gsap.set(element, { clearProps: "transform,opacity,visibility,display,filter,pointerEvents,zIndex" });
        }
      }
    };

    for (const item of items) ensureMarker(item);

    mapHandleRef.current = {
      flyToBranch: (branch, onComplete) => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        map.once("moveend", onComplete);
        map.flyTo({
          center: [branch.coordinates.longitude, branch.coordinates.latitude],
          zoom: 16.5,
          pitch: 48,
          bearing: branch.id === "abha" ? -18 : 20,
          duration: reducedMotion ? 100 : 2200,
          essential: true,
        });
      },
      resetRegionalMap: () => {
        map.stop();
        useExperienceStore.getState().clearRegionalMapFocus();
        restoreAllBranchMarkers();
        const bounds = new mapboxgl.LngLatBounds();
        for (const item of items) bounds.extend([item.coordinates.longitude, item.coordinates.latitude]);
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        map.once("moveend", () => map.resize());
        map.fitBounds(bounds, { padding: { top: 120, right: 180, bottom: 120, left: 180 }, maxZoom: 11.5, pitch: 20, bearing: -10, duration: reducedMotion ? 100 : 1400, essential: true });
      },
      stop: () => map.stop(),
    };

    return () => {
      disposed = true;
      window.clearTimeout(failureTimer);
      if (readyTimer) window.clearTimeout(readyTimer);
      mapHandleRef.current = null;
      map.off("error", handleError);
      for (const { root, marker } of markers.values()) {
        root.unmount();
        marker.remove();
      }
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [items, mapHandleRef, retryKey, setMapStatus]);

  useEffect(() => {
    for (const item of items) {
      const entry = markersRef.current.get(item.id);
      entry?.root.render(
        <Hotspot
          item={item}
          active={activeId === item.id}
          onSelect={() => onSelectRef.current(item)}
          mapboxMarker
        />,
      );
    }
  }, [activeId, items]);

  return (
    <div className={`mapbox-region-shell${mapStatus === "ready" ? " is-ready" : ""}`}>
      <div ref={containerRef} className="mapbox-region-map" aria-label="خريطة أقمار صناعية لفرعي سعودي دنت في أبها وخميس مشيط" />
    </div>
  );
}
