"use client";

import { MapViewport } from "@/components/experience/map-viewport";

export function CampusScene() {
  return (
    <section className="campus-scene" aria-label="الخريطة التفاعلية لفرعي سعودي دنت">
      <MapViewport />
    </section>
  );
}
