"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { campusDestinations } from "@/data/campus";
import { useExperienceStore } from "@/store/use-experience-store";
import { MapboxRegionMap, type MapboxRegionMapHandle } from "@/components/experience/mapbox-region-map";
import type { Branch } from "@/data/branches";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function MapViewport() {
  const goTo = useExperienceStore((state) => state.goTo);
  const stopDemo = useExperienceStore((state) => state.stopDemo);
  const demoFocus = useExperienceStore((state) => state.scene === "campus" && state.isDemoPlaying ? state.selectedId : undefined);
  const scene = useExperienceStore((state) => state.scene);
  const mapFocusedBranchId = useExperienceStore((state) => state.mapFocusedBranchId);
  const focusRegionalBranch = useExperienceStore((state) => state.focusRegionalBranch);
  const frame = useRef<HTMLDivElement>(null);
  const activeTimeline = useRef<gsap.core.Timeline | null>(null);
  const mapHandle = useRef<MapboxRegionMapHandle | null>(null);
  const items = campusDestinations;
  const activeId = mapFocusedBranchId ?? demoFocus;
  const reducedMotion = usePrefersReducedMotion();
  const previousScene = useRef(scene);
  const previousDemoFocus = useRef(demoFocus);

  useEffect(() => {
    const returnedToMap = scene === "campus" && previousScene.current !== "campus";
    previousScene.current = scene;
    if (!returnedToMap) return;
    mapHandle.current?.resetRegionalMap();
  }, [scene]);

  useEffect(() => {
    const demoJustStopped = previousDemoFocus.current && !demoFocus;
    previousDemoFocus.current = demoFocus;
    if (demoJustStopped && scene === "campus" && !mapFocusedBranchId) {
      mapHandle.current?.resetRegionalMap();
    }
  }, [demoFocus, mapFocusedBranchId, scene]);

  useEffect(() => {
    return () => {
      activeTimeline.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!demoFocus || mapFocusedBranchId || !frame.current) {
      return;
    }
    const item = items.find((candidate) => candidate.id === demoFocus);
    if (!item) return;
    const activeMapHandle = mapHandle.current;
    const marker = frame.current.querySelector<HTMLElement>(`.hotspot-${item.id} .hotspot-icon`);
    const otherHotspots = Array.from(frame.current.querySelectorAll<HTMLElement>(`.map-hotspot:not(.hotspot-${item.id})`));
    activeTimeline.current?.kill();
    activeTimeline.current = gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to(otherHotspots, { opacity: 0.46, duration: 0.35 }, 0)
      .to(marker, { filter: "brightness(1.12)", duration: 0.35, repeat: 1, yoyo: true }, 0.04)
      .fromTo(`.hotspot-${item.id} .hotspot-label`, { filter: "brightness(1)" }, { filter: "brightness(1.1)", duration: 0.35, repeat: 1, yoyo: true }, 0.06);
    activeMapHandle?.flyToBranch(item, () => undefined);
    return () => { activeTimeline.current?.kill(); activeMapHandle?.stop(); };
  }, [demoFocus, mapFocusedBranchId, items, reducedMotion]);

  const select = useCallback((item: Branch) => {
    stopDemo();
    focusRegionalBranch(item.id);
    const root = frame.current;
    if (!root) return;
    const otherHotspots = Array.from(root.querySelectorAll<HTMLElement>(`.map-hotspot:not(.hotspot-${item.id})`));
    const selected = root.querySelector<HTMLElement>(`.hotspot-${item.id}`);
    activeTimeline.current?.kill();
    const navigate = () => goTo(item.targetScene, item.id);
    activeTimeline.current = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    if (selected) activeTimeline.current.to(selected, { filter: "brightness(1.08)", duration: 0.18 }, 0);
    activeTimeline.current.to(otherHotspots, { opacity: 0.2, duration: 0.34, stagger: 0.025 }, 0.04);
    mapHandle.current?.flyToBranch(item, navigate);
  }, [focusRegionalBranch, goTo, stopDemo]);

  return (
    <div ref={frame} className={`map-frame map-stage${activeId ? " has-focus" : ""}`}>
      <div className="campus-camera map-content-plane">
        <MapboxRegionMap
          items={items}
          activeId={activeId}
          onSelect={select}
          mapHandleRef={mapHandle}
        />
        <div className="map-relief-light" aria-hidden />
      </div>
      <div className="map-ambient-field" aria-hidden>
        <i className="ambient-orb ambient-orb-one" /><i className="ambient-orb ambient-orb-two" /><i className="ambient-orb ambient-orb-three" />
      </div>
      <div className="map-shade" />
      <div className="map-grain" aria-hidden />
      <div className="map-vignette" aria-hidden />

    </div>
  );
}
