"use client";

import { ArrowRight, MapPinned } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InteractiveSceneViewer } from "@/components/saudident/InteractiveSceneViewer";
import {
  branchInteractiveExperiences,
  type BranchInteractiveScene,
  type BranchSceneHotspot,
  type BranchSceneId,
} from "@/data/branch-interactive-scenes";
import type { PresentationPhase } from "@/components/saudident/MapFirstExperience";
import { gsap } from "@/lib/gsap";
import { motion } from "@/lib/motion";

type BranchInteractiveScenesProps = {
  branchId: BranchSceneId;
  demoActive: boolean;
  onReturnToBranches: () => void;
  onUserInteraction: () => void;
  onPresentationPhaseChange?: (phase: PresentationPhase) => void;
  onHotspotActivate?: (hotspot: BranchSceneHotspot) => void;
};

const DEMO_SCENE_MS = 3200;
const DEMO_DETAIL_MS = 3600;

export function BranchInteractiveScenes({
  branchId,
  demoActive,
  onReturnToBranches,
  onUserInteraction,
  onPresentationPhaseChange,
  onHotspotActivate,
}: BranchInteractiveScenesProps) {
  const experience = branchInteractiveExperiences[branchId];
  const viewerRef = useRef<HTMLDivElement>(null);
  const transitionLockedRef = useRef(false);
  const [activeSceneId, setActiveSceneId] = useState(experience.scenes[0].id);
  const [selectedHotspot, setSelectedHotspot] = useState<BranchSceneHotspot | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const activeSceneIndex = Math.max(0, experience.scenes.findIndex((scene) => scene.id === activeSceneId));
  const activeScene = experience.scenes[activeSceneIndex] ?? experience.scenes[0];
  const navigableScenes = useMemo(() => experience.scenes.filter((scene) => !scene.hiddenFromNavigation), [experience.scenes]);

  const activateScene = useCallback((scene: BranchInteractiveScene, manual = true) => {
    if (manual) onUserInteraction();
    setActiveSceneId(scene.id);
    setSelectedHotspot(null);
    setActiveHotspotId(null);
    setGalleryIndex(0);
  }, [onUserInteraction]);

  const closeDetail = useCallback((manual = true) => {
    if (manual) onUserInteraction();
    setSelectedHotspot(null);
    setActiveHotspotId(null);
    setGalleryIndex(0);
  }, [onUserInteraction]);

  const handleBack = () => {
    if (selectedHotspot) {
      closeDetail();
      return;
    }
    const previousScene = experience.scenes[Math.max(0, activeSceneIndex - 1)];
    if (previousScene.id !== activeScene.id) {
      activateScene(previousScene);
      return;
    }
    onReturnToBranches();
  };

  const handleHotspotSelect = (hotspot: BranchSceneHotspot) => {
    onUserInteraction();
    setActiveHotspotId(hotspot.id);
    onHotspotActivate?.(hotspot);
    if (hotspot.detailEnabled === false) return;
    setSelectedHotspot(hotspot);
    setGalleryIndex(0);
  };

  const nextScene = experience.scenes[activeSceneIndex + 1];
  const previousScene = experience.scenes[activeSceneIndex - 1];

  const transitionToScene = useCallback((targetScene: BranchInteractiveScene, panX: number) => {
    if (transitionLockedRef.current) return;
    transitionLockedRef.current = true;
    setTransitioning(true);
    onUserInteraction();

    const viewer = viewerRef.current;
    const currentImage = viewer?.querySelector(".sd-scene-viewer__image");
    const veil = viewer?.querySelector(".sd-scene-transition-veil");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const enteringCorridor = targetScene.id === "corridor-right-right" || targetScene.id === "sterilization-corridor" || targetScene.id === "transition-third";

    const swapScene = () => {
      setActiveSceneId(targetScene.id);
      setSelectedHotspot(null);
      setActiveHotspotId(null);
      setGalleryIndex(0);

      window.requestAnimationFrame(() => {
        const incomingImage = viewerRef.current?.querySelector(".sd-scene-viewer__image");
        const incomingVeil = viewerRef.current?.querySelector(".sd-scene-transition-veil");
        const incomingHotspots = viewerRef.current?.querySelectorAll(".sd-scene-hotspot");
        if (!incomingImage || reducedMotion) {
          if (incomingVeil) gsap.set(incomingVeil, { opacity: 0 });
          transitionLockedRef.current = false;
          setTransitioning(false);
          return;
        }

        gsap.fromTo(
          incomingImage,
          { opacity: enteringCorridor ? 0 : 0.12, scale: enteringCorridor ? 1.025 : 1.02, filter: enteringCorridor ? "blur(0px)" : "blur(3px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: enteringCorridor ? 0.68 : 0.28,
            ease: enteringCorridor ? "power3.out" : motion.cinematicEase,
            clearProps: "filter,transform,opacity",
            onComplete: () => {
              transitionLockedRef.current = false;
              setTransitioning(false);
            },
          },
        );
        if (enteringCorridor && incomingHotspots?.length) {
          gsap.fromTo(incomingHotspots, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, stagger: 0.08, delay: 0.2, ease: "power2.out" });
        }
        if (incomingVeil) {
          gsap.to(incomingVeil, {
            opacity: 0,
            duration: 0.28,
            ease: motion.ease,
          });
        }
      });
    };

    if (!currentImage || reducedMotion) {
      swapScene();
      return;
    }

    const timeline = gsap.timeline({ onComplete: swapScene })
      .to(currentImage, {
        scale: 1.055,
        xPercent: panX,
        duration: 0.48,
        ease: motion.cinematicEase,
      })
      .to(currentImage, {
        opacity: 0.12,
        filter: "blur(3px)",
        duration: 0.3,
        ease: "power2.inOut",
      });
    if (veil) {
      timeline.to(veil, { opacity: 0.86, duration: 0.28, ease: motion.ease }, "<0.04");
    }
  }, [onUserInteraction]);

  const handleNextScene = useCallback(() => {
    if (nextScene) transitionToScene(nextScene, -1.2);
  }, [nextScene, transitionToScene]);

  const handlePreviousScene = useCallback(() => {
    if (previousScene) transitionToScene(previousScene, 1.2);
  }, [previousScene, transitionToScene]);

  useEffect(() => {
    if (!onPresentationPhaseChange) return;
    if (!selectedHotspot) {
      onPresentationPhaseChange("scene");
      return;
    }
    onPresentationPhaseChange("hotspot");
    const timer = window.setTimeout(() => onPresentationPhaseChange("detail"), 460);
    return () => window.clearTimeout(timer);
  }, [activeSceneId, onPresentationPhaseChange, selectedHotspot]);

  useEffect(() => {
    if (!demoActive) return;
    let cancelled = false;
    const timers: number[] = [];
    let cursor = 0;
    const items = navigableScenes.flatMap((scene) => [
      { scene, hotspot: null as BranchSceneHotspot | null, duration: DEMO_SCENE_MS },
      ...scene.hotspots.map((hotspot) => ({ scene, hotspot, duration: DEMO_DETAIL_MS })),
    ]);

    const showNext = () => {
      if (cancelled || !items.length) return;
      const item = items[cursor % items.length];
      setActiveSceneId(item.scene.id);
      setSelectedHotspot(item.hotspot?.detailEnabled === false ? null : item.hotspot);
      setActiveHotspotId(item.hotspot?.id ?? null);
      setGalleryIndex(0);
      cursor += 1;
      timers.push(window.setTimeout(showNext, item.duration));
    };
    showNext();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [demoActive, navigableScenes]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (selectedHotspot) closeDetail();
      else onReturnToBranches();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDetail, onReturnToBranches, selectedHotspot]);

  const sceneStatus = useMemo(
    () => {
      const visibleIndex = navigableScenes.findIndex((scene) => scene.id === activeScene.id);
      return `${Math.max(0, visibleIndex) + 1} / ${navigableScenes.length}`;
    },
    [activeScene.id, navigableScenes],
  );
  const sidebarActiveSceneId = activeScene.hiddenFromNavigation ? "reception" : activeScene.id;

  return (
    <section className="sd-branch-scenes" aria-labelledby={`sd-branch-scenes-${branchId}`}>
      <header className="sd-branch-scenes__header">
        <div className="sd-branch-scenes__heading">
          <span>فرع {experience.branchName}</span>
          <h1 id={`sd-branch-scenes-${branchId}`}>{experience.title}</h1>
          <p>{experience.description}</p>
        </div>
        <div className="sd-branch-scenes__controls">
          <button type="button" onClick={handleBack}>
            <ArrowRight aria-hidden />
            رجوع
          </button>
          <button type="button" onClick={onReturnToBranches}>
            <MapPinned aria-hidden />
            العودة للخريطة
          </button>
        </div>
      </header>

      <div className="sd-branch-scenes__layout">
        <nav className="sd-scene-sidebar" aria-label={`أقسام فرع ${experience.branchName}`}>
          <div className="sd-scene-sidebar__topline">
            <span>الأقسام</span>
            <small>{sceneStatus}</small>
          </div>
          <div className="sd-scene-sidebar__list">
            {navigableScenes.map((scene, index) => (
              <button
                type="button"
                key={scene.id}
                className={scene.id === sidebarActiveSceneId ? "is-active" : ""}
                onClick={() => activateScene(scene)}
                aria-current={scene.id === sidebarActiveSceneId ? "page" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{scene.label}</strong>
              </button>
            ))}
          </div>
        </nav>

        <InteractiveSceneViewer
          ref={viewerRef}
          scene={activeScene}
          selectedHotspot={selectedHotspot}
          activeHotspotId={activeHotspotId}
          galleryIndex={galleryIndex}
          onSelectHotspot={handleHotspotSelect}
          onGalleryIndex={setGalleryIndex}
          onCloseDetail={() => closeDetail()}
          nextSceneLabel={nextScene?.label}
          onNextScene={activeScene.navigationPending ? undefined : handleNextScene}
          onPreviousScene={activeScene.showSceneBack ? handlePreviousScene : undefined}
          transitioning={transitioning}
        />
      </div>
    </section>
  );
}
