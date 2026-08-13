"use client";

import { ShieldCheck, Stethoscope } from "lucide-react";
import type { CSSProperties } from "react";
import type { BranchSceneHotspot } from "@/data/branch-interactive-scenes";

type SceneHotspotProps = {
  hotspot: BranchSceneHotspot;
  active: boolean;
  indexLabel?: number;
  onActivate: (hotspot: BranchSceneHotspot) => void;
};

export function SceneHotspot({ hotspot, active, indexLabel, onActivate }: SceneHotspotProps) {
  const Icon = hotspot.icon === "clinic" ? Stethoscope : hotspot.icon === "sterilization" ? ShieldCheck : null;

  return (
    <button
      type="button"
      className={`sd-scene-hotspot is-${hotspot.tone ?? "blue"}${Icon ? " has-icon" : ""}${active ? " is-active" : ""}`}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        "--sd-hotspot-size": `${hotspot.size ?? 42}px`,
      } as CSSProperties}
      onClick={() => onActivate(hotspot)}
      aria-label={hotspot.detailEnabled === false ? hotspot.label : `عرض تفاصيل ${hotspot.label}`}
      aria-pressed={active}
    >
      <span className="sd-scene-hotspot__pulse" aria-hidden="true" />
      <span className="sd-scene-hotspot__dot" aria-hidden="true">{Icon ? <Icon /> : indexLabel}</span>
      <strong role="tooltip">{hotspot.label}</strong>
    </button>
  );
}
