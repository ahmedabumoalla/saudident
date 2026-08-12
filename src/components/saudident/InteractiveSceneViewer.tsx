"use client";

import Image from "next/image";
import type { BranchInteractiveScene, BranchSceneHotspot } from "@/data/branch-interactive-scenes";
import { SceneDetailCard } from "@/components/saudident/SceneDetailCard";

type InteractiveSceneViewerProps = {
  scene: BranchInteractiveScene;
  selectedHotspot: BranchSceneHotspot | null;
  galleryIndex: number;
  onSelectHotspot: (hotspot: BranchSceneHotspot) => void;
  onGalleryIndex: (index: number) => void;
  onCloseDetail: () => void;
};

export function InteractiveSceneViewer({
  scene,
  selectedHotspot,
  galleryIndex,
  onSelectHotspot,
  onGalleryIndex,
  onCloseDetail,
}: InteractiveSceneViewerProps) {
  return (
    <div className={`sd-scene-viewer${selectedHotspot ? " has-detail" : ""}`}>
      <div className="sd-scene-viewer__image" key={scene.id}>
        <Image
          src={scene.image}
          alt={scene.imageAlt}
          fill
          priority
          sizes="(max-width: 767px) 100vw, 78vw"
          style={{ objectPosition: scene.imagePosition ?? "center" }}
        />
        <div className="sd-scene-viewer__shade" aria-hidden="true" />

        <div className="sd-scene-viewer__intro">
          <span>{scene.eyebrow}</span>
          <h2>{scene.title}</h2>
          <p>{scene.description}</p>
        </div>

        <div className="sd-scene-viewer__hotspots" aria-label={`نقاط ${scene.label}`}>
          {scene.hotspots.map((hotspot, index) => (
            <button
              type="button"
              key={hotspot.id}
              className={`sd-scene-hotspot${selectedHotspot?.id === hotspot.id ? " is-active" : ""}`}
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onClick={() => onSelectHotspot(hotspot)}
              aria-label={`عرض تفاصيل ${hotspot.label}`}
              aria-pressed={selectedHotspot?.id === hotspot.id}
            >
              <span className="sd-scene-hotspot__pulse" aria-hidden="true" />
              <span className="sd-scene-hotspot__dot" aria-hidden="true">{index + 1}</span>
              <strong>{hotspot.label}</strong>
            </button>
          ))}
        </div>
      </div>

      {selectedHotspot && (
        <SceneDetailCard
          key={selectedHotspot.id}
          hotspot={selectedHotspot}
          galleryIndex={galleryIndex}
          onGalleryIndex={onGalleryIndex}
          onClose={onCloseDetail}
        />
      )}
    </div>
  );
}
