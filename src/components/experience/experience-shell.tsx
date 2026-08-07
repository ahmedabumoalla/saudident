"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { SceneStage } from "./scene-stage";
import { AutoDemoController } from "./auto-demo-controller";
import { KioskControls } from "./kiosk-controls";
import { OrientationGuard } from "./orientation-guard";
import { Breadcrumbs } from "./breadcrumbs";
import { useExperienceStore } from "@/store/use-experience-store";
import { readQueryState, writeQueryState } from "@/lib/query-state";
import { usePreloadAssets } from "@/hooks/use-preload-assets";
import { CampusScene } from "@/components/scenes/campus-scene";
import { MapLoadingScreen } from "@/components/experience/map-loading-screen";
import { CampusAdvertisementStrip } from "@/components/experience/campus-advertisement-strip";

const AmbientCanvas = dynamic(() => import("@/components/ambient/ambient-canvas"), { ssr: false });

export function ExperienceShell() {
  const scene = useExperienceStore((state) => state.scene);
  const selectedId = useExperienceStore((state) => state.selectedId);
  const activeBranchId = useExperienceStore((state) => state.activeBranchId);
  const isDemoPlaying = useExperienceStore((state) => state.isDemoPlaying);
  const hydrate = useExperienceStore((state) => state.hydrate);
  const mapStatus = useExperienceStore((state) => state.mapStatus);
  const mapRetryKey = useExperienceStore((state) => state.mapRetryKey);
  const retryMap = useExperienceStore((state) => state.retryMap);

  const preload = useMemo(() => [
    "/assets/branches/khamis-mushait/branch-hero.webp",
    "/assets/branches/khamis-mushait/reception.webp",
    "/assets/branches/abha/branch-hero.webp",
    "/assets/branches/abha/reception.webp",
  ], []);
  usePreloadAssets(preload);

  useEffect(() => {
    const query = readQueryState();
    if (query.scene) hydrate(query.scene, query.id, query.branch);
  }, [hydrate]);

  useEffect(() => {
    writeQueryState(scene, selectedId, activeBranchId);
  }, [scene, selectedId, activeBranchId]);

  return (
    <main className={`experience-shell scene-${scene}${isDemoPlaying ? " is-demo-playing" : ""}${mapStatus !== "ready" ? " is-map-loading" : ""}`}>
      <AmbientCanvas />
      <div className={`persistent-campus${scene === "campus" ? " is-visible" : ""}`} aria-hidden={scene !== "campus"}><CampusScene /></div>
      {scene === "campus" && mapStatus === "ready" && <CampusAdvertisementStrip />}
      {scene !== "campus" && <SceneStage />}
      <div className="experience-topbar">
        <KioskControls />
        {!isDemoPlaying && <Breadcrumbs />}
      </div>
      <AutoDemoController />
      <OrientationGuard />
      <MapLoadingScreen key={mapRetryKey} status={mapStatus} onRetry={retryMap} />
    </main>
  );
}
