"use client";

import { useState } from "react";
import { ExperienceIcon } from "@/lib/icon-registry";
import type { ExperienceItem, NormalizedPoint } from "@/types/experience";

export function Hotspot({
  item,
  displayPoint,
  active,
  onSelect,
  calibrating,
  onMove,
  mapboxMarker = false,
}: {
  item: ExperienceItem;
  displayPoint?: NormalizedPoint;
  active?: boolean;
  onSelect: () => void;
  calibrating?: boolean;
  onMove?: (x: number, y: number) => void;
  mapboxMarker?: boolean;
}) {
  const point = displayPoint ?? item.point!;
  const [dragging, setDragging] = useState(false);

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!calibrating || !dragging || !onMove) return;
    const parent = event.currentTarget.parentElement!.getBoundingClientRect();
    onMove(
      Math.max(0, Math.min(1, (event.clientX - parent.left) / parent.width)),
      Math.max(0, Math.min(1, (event.clientY - parent.top) / parent.height)),
    );
  };

  return (
    <button
      type="button"
      className={`map-hotspot hotspot-${item.id} hotspot-align-${item.hotspotAlign ?? "end"}${active ? " is-active" : ""}${calibrating ? " is-calibrating" : ""}`}
      style={mapboxMarker ? undefined : { left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
      onClick={() => !calibrating && onSelect()}
      onPointerMove={move}
      onPointerDown={(event) => {
        if (!calibrating) return;
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      aria-label={`استكشف ${item.title}`}
      aria-pressed={active}
    >
      <span className="hotspot-pulse" aria-hidden />
      <span className="hotspot-icon" aria-hidden><ExperienceIcon name={item.icon} /></span>
      <span className="hotspot-label"><strong>{item.title}</strong></span>
    </button>
  );
}
