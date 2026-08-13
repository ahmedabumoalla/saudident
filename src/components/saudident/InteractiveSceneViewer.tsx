"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { forwardRef, useRef } from "react";
import type { BranchInteractiveScene, BranchSceneHotspot } from "@/data/branch-interactive-scenes";
import { SceneDetailCard } from "@/components/saudident/SceneDetailCard";
import { SceneHotspot } from "@/components/saudident/SceneHotspot";
import { gsap, useGSAP } from "@/lib/gsap";

type InteractiveSceneViewerProps = {
  scene: BranchInteractiveScene;
  selectedHotspot: BranchSceneHotspot | null;
  galleryIndex: number;
  onSelectHotspot: (hotspot: BranchSceneHotspot) => void;
  onGalleryIndex: (index: number) => void;
  onCloseDetail: () => void;
  activeHotspotId?: string | null;
  nextSceneLabel?: string;
  onNextScene?: () => void;
  onPreviousScene?: () => void;
  transitioning?: boolean;
};

export const InteractiveSceneViewer = forwardRef<HTMLDivElement, InteractiveSceneViewerProps>(function InteractiveSceneViewer({
  scene,
  selectedHotspot,
  galleryIndex,
  onSelectHotspot,
  onGalleryIndex,
  onCloseDetail,
  activeHotspotId,
  nextSceneLabel,
  onNextScene,
  onPreviousScene,
  transitioning = false,
}, ref) {
  const isEntryScene = scene.presentation === "entry";
  const guidanceArrowRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const chevrons = guidanceArrowRef.current?.querySelectorAll<SVGPathElement>(".sd-floor-guidance__chevron");
    if (!chevrons?.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(chevrons, { opacity: 0.82, y: 0 });
      return;
    }

    const movesLeft = scene.navigationDirection === "left";
    const movesRight = scene.navigationDirection === "right";
    gsap.set(chevrons, { opacity: 0.24, x: movesLeft ? 2 : -2, y: movesLeft || movesRight ? 0 : 2 });
    const flow = gsap.timeline({ repeat: -1, repeatDelay: 0.08 });
    chevrons.forEach((chevron, index) => {
      const start = index * 0.18;
      flow
        .to(chevron, { opacity: 0.94, x: movesLeft ? -4 : 4, y: movesLeft || movesRight ? 0 : -3, duration: 0.28, ease: "sine.out" }, start)
        .to(chevron, { opacity: 0.24, x: 0, y: 0, duration: 0.42, ease: "sine.inOut" }, start + 0.3);
    });

    return () => flow.kill();
  }, { scope: guidanceArrowRef, dependencies: [scene.id, scene.showNextTrigger, scene.navigationDirection] });

  const renderHotspots = () => (
    <div className="sd-scene-viewer__hotspots" aria-label={`نقاط ${scene.label}`}>
      {scene.hotspots.map((hotspot, index) => (
        <SceneHotspot
          key={hotspot.id}
          hotspot={hotspot}
          active={(activeHotspotId ?? selectedHotspot?.id) === hotspot.id}
          indexLabel={isEntryScene ? undefined : index + 1}
          onActivate={onSelectHotspot}
        />
      ))}
    </div>
  );

  const renderGuidanceArrow = () => {
    if (!scene.showNextTrigger) return null;
    const movesLeft = scene.navigationDirection === "left";
    return (
      <button
        ref={guidanceArrowRef}
        type="button"
        className={`sd-scene-next${movesLeft ? " is-left" : ""}${scene.id === "transition-third" ? " is-third" : ""}`}
        onClick={() => onNextScene?.()}
        disabled={transitioning}
        aria-label={movesLeft ? "الانتقال إلى المشهد التالي" : scene.navigationPending ? "مسار الانتقال التالي" : "الانتقال إلى الممر"}
        aria-disabled={scene.navigationPending || undefined}
      >
        <span className="sd-floor-guidance__projection" aria-hidden="true">
          <svg viewBox="0 0 72 136" focusable="false">
            <path className="sd-floor-guidance__chevron" d="M10 112 L36 90 L62 112" />
            <path className="sd-floor-guidance__chevron" d="M10 82 L36 60 L62 82" />
            <path className="sd-floor-guidance__chevron" d="M10 52 L36 30 L62 52" />
            <path className="sd-floor-guidance__chevron" d="M10 22 L36 2 L62 22" />
          </svg>
        </span>
      </button>
    );
  };

  return (
    <div
      ref={ref}
      className={`sd-scene-viewer${selectedHotspot ? " has-detail" : ""}${isEntryScene ? " is-entry-scene" : ""}${transitioning ? " is-transitioning" : ""}`}
    >
      <div className="sd-scene-viewer__image" key={scene.id}>
        {scene.imageFit === "contain" ? (
          <>
            <Image
              className="sd-scene-viewer__ambient"
              src={scene.image}
              alt=""
              fill
              priority
              aria-hidden="true"
              sizes="(max-width: 767px) 100vw, 78vw"
            />
            <div className="sd-scene-viewer__contained-media">
              <div
                className="sd-scene-viewer__contained-frame"
                style={{ "--sd-scene-aspect": scene.imageAspectRatio ?? 1.5 } as React.CSSProperties}
              >
                <Image
                  className="sd-scene-viewer__photo"
                  src={scene.image}
                  alt={scene.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 767px) 100vw, 78vw"
                />
                {renderHotspots()}
                {renderGuidanceArrow()}
                {scene.showSceneBack && onPreviousScene && (
                  <button type="button" className="sd-scene-inline-back" onClick={onPreviousScene} disabled={transitioning}>
                    <ArrowRight aria-hidden /> رجوع
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Image
              className="sd-scene-viewer__photo"
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
            {renderHotspots()}
            {renderGuidanceArrow()}
          </>
        )}

        <div className="sd-scene-transition-veil" aria-hidden="true" />
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
});
