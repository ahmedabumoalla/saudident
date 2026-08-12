"use client";

import { ArrowRight, MapPinned } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { InteractiveSceneViewer } from "@/components/saudident/InteractiveSceneViewer";
import {
  branchInteractiveExperiences,
  type BranchInteractiveScene,
  type BranchSceneHotspot,
  type BranchSceneId,
} from "@/data/branch-interactive-scenes";
import type { PresentationPhase } from "@/components/saudident/MapFirstExperience";

type BranchInteractiveScenesProps = {
  branchId: BranchSceneId;
  demoActive: boolean;
  onReturnToBranches: () => void;
  onUserInteraction: () => void;
  onPresentationPhaseChange?: (phase: PresentationPhase) => void;
};

const DEMO_SCENE_MS = 3200;
const DEMO_DETAIL_MS = 3600;

export function BranchInteractiveScenes({
  branchId,
  demoActive,
  onReturnToBranches,
  onUserInteraction,
  onPresentationPhaseChange,
}: BranchInteractiveScenesProps) {
  const experience = branchInteractiveExperiences[branchId];
  const [activeSceneId, setActiveSceneId] = useState(experience.scenes[0].id);
  const [selectedHotspot, setSelectedHotspot] = useState<BranchSceneHotspot | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const activeSceneIndex = Math.max(0, experience.scenes.findIndex((scene) => scene.id === activeSceneId));
  const activeScene = experience.scenes[activeSceneIndex] ?? experience.scenes[0];

  const activateScene = useCallback((scene: BranchInteractiveScene, manual = true) => {
    if (manual) onUserInteraction();
    setActiveSceneId(scene.id);
    setSelectedHotspot(null);
    setGalleryIndex(0);
  }, [onUserInteraction]);

  const closeDetail = useCallback((manual = true) => {
    if (manual) onUserInteraction();
    setSelectedHotspot(null);
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
    setSelectedHotspot(hotspot);
    setGalleryIndex(0);
  };

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
    const items = experience.scenes.flatMap((scene) => [
      { scene, hotspot: null as BranchSceneHotspot | null, duration: DEMO_SCENE_MS },
      ...scene.hotspots.map((hotspot) => ({ scene, hotspot, duration: DEMO_DETAIL_MS })),
    ]);

    const showNext = () => {
      if (cancelled || !items.length) return;
      const item = items[cursor % items.length];
      setActiveSceneId(item.scene.id);
      setSelectedHotspot(item.hotspot);
      setGalleryIndex(0);
      cursor += 1;
      timers.push(window.setTimeout(showNext, item.duration));
    };
    showNext();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [demoActive, experience.scenes]);

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
    () => `${activeSceneIndex + 1} / ${experience.scenes.length}`,
    [activeSceneIndex, experience.scenes.length],
  );

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
            {experience.scenes.map((scene, index) => (
              <button
                type="button"
                key={scene.id}
                className={scene.id === activeScene.id ? "is-active" : ""}
                onClick={() => activateScene(scene)}
                aria-current={scene.id === activeScene.id ? "page" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{scene.label}</strong>
              </button>
            ))}
          </div>
        </nav>

        <InteractiveSceneViewer
          scene={activeScene}
          selectedHotspot={selectedHotspot}
          galleryIndex={galleryIndex}
          onSelectHotspot={handleHotspotSelect}
          onGalleryIndex={setGalleryIndex}
          onCloseDetail={() => closeDetail()}
        />
      </div>
    </section>
  );
}
