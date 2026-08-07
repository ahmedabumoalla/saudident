"use client";

import { create } from "zustand";
import type { BranchId, SceneId } from "@/types/experience";
import { demoConfig } from "@/data/demo-config";

type NavEntry = { scene: SceneId; selectedId?: string; branchId: BranchId };
type NavigationOptions = { replace?: boolean; silent?: boolean; preserveDemo?: boolean };
export type TransitionPreset = "map-to-branch" | "branch-to-category" | "collection-to-detail" | "detail-to-detail" | "category-to-category" | "branch-to-map";
type TransitionOptions = { preset: TransitionPreset; signal?: AbortSignal; replace?: boolean };

type ExperienceState = {
  scene: SceneId;
  previousScene: SceneId | null;
  selectedId?: string;
  activeBranchId: BranchId;
  mapFocusedBranchId?: BranchId;
  mapCameraMode: "overview" | "focused";
  history: NavEntry[];
  isDemoPlaying: boolean;
  demoRunId: number;
  demoStepId?: string;
  demoBranchId?: BranchId;
  demoStatus: "idle" | "running" | "complete";
  mapStatus: "loading" | "ready" | "error";
  mapRetryKey: number;
  lastInteraction: number;
  goTo: (scene: SceneId, selectedId?: string, options?: NavigationOptions) => void;
  transitionTo: (scene: SceneId, selectedId: string | undefined, options: TransitionOptions) => Promise<void>;
  goBack: () => void;
  reset: () => void;
  hydrate: (scene: SceneId | "attract", selectedId?: string, branchId?: BranchId) => void;
  startDemo: () => void;
  stopDemo: () => void;
  completeDemo: () => void;
  setDemoStep: (stepId: string, branchId?: BranchId) => void;
  setMapStatus: (status: "loading" | "ready" | "error") => void;
  retryMap: () => void;
  focusRegionalBranch: (branchId: BranchId) => void;
  clearRegionalMapFocus: () => void;
  touch: () => void;
};

const initialState = {
  scene: "campus" as SceneId,
  previousScene: null as SceneId | null,
  selectedId: undefined as string | undefined,
  activeBranchId: "khamis-mushait" as BranchId,
  mapFocusedBranchId: undefined as BranchId | undefined,
  mapCameraMode: "overview" as const,
  history: [] as NavEntry[],
  isDemoPlaying: false,
  demoRunId: 0,
  demoStepId: undefined as string | undefined,
  demoBranchId: undefined as BranchId | undefined,
  demoStatus: "idle" as const,
  mapStatus: "loading" as const,
  mapRetryKey: 0,
  lastInteraction: Date.now(),
};

function transitionWait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException("Demo stopped", "AbortError")); return; }
    const finish = () => { signal?.removeEventListener("abort", abort); resolve(); };
    const timer = setTimeout(finish, ms);
    const abort = () => { clearTimeout(timer); signal?.removeEventListener("abort", abort); reject(new DOMException("Demo stopped", "AbortError")); };
    signal?.addEventListener("abort", abort, { once: true });
  });
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  ...initialState,
  goTo: (scene, selectedId, options) => set((state) => {
    if (state.scene === scene && state.selectedId === selectedId) return state;
    const branch = scene === "hospital" && (selectedId === "abha" || selectedId === "khamis-mushait") ? selectedId : state.activeBranchId;
    const history = options?.replace ? state.history : [...state.history, { scene: state.scene, selectedId: state.selectedId, branchId: state.activeBranchId }].slice(-18);
    return {
      previousScene: state.scene,
      scene,
      selectedId,
      activeBranchId: branch as BranchId,
      mapFocusedBranchId: scene === "hospital" ? branch as BranchId : state.mapFocusedBranchId,
      mapCameraMode: scene === "hospital" ? "focused" : state.mapCameraMode,
      history,
      isDemoPlaying: options?.preserveDemo ? state.isDemoPlaying : false,
      demoStatus: options?.preserveDemo ? state.demoStatus : "idle",
    };
  }),
  transitionTo: async (scene, selectedId, options) => {
    try {
      const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      await transitionWait(reducedMotion ? 80 : demoConfig.transitionOutMs, options.signal);
      get().goTo(scene, selectedId, { replace: options.replace, silent: true, preserveDemo: true });
      await transitionWait(reducedMotion ? 100 : demoConfig.transitionInMs, options.signal);
    } catch (error) {
      throw error;
    }
  },
  goBack: () => {
    const history = [...get().history];
    const last = history.pop();
    if (!last) { get().reset(); return; }
    set((state) => {
      return { previousScene: state.scene, scene: last.scene, selectedId: last.selectedId, activeBranchId: last.branchId, history, isDemoPlaying: false, demoStatus: "idle", mapFocusedBranchId: last.scene === "campus" ? undefined : state.mapFocusedBranchId, mapCameraMode: last.scene === "campus" ? "overview" : state.mapCameraMode };
    });
  },
  reset: () => set((state) => ({ ...initialState, scene: "campus", previousScene: state.scene, demoRunId: state.demoRunId + 1, lastInteraction: Date.now(), mapStatus: state.mapStatus, mapRetryKey: state.mapRetryKey })),
  hydrate: (scene, selectedId, branchId) => {
    const hydratedScene = scene === "attract" ? "campus" : scene;
    set({ scene: hydratedScene, selectedId: hydratedScene === "campus" ? undefined : selectedId, activeBranchId: branchId ?? "khamis-mushait", mapFocusedBranchId: undefined, mapCameraMode: "overview", previousScene: null, history: [] });
  },
  startDemo: () => set((state) => ({
    scene: "campus", previousScene: state.scene, selectedId: undefined, activeBranchId: "khamis-mushait", history: [],
    isDemoPlaying: true, demoRunId: state.demoRunId + 1, demoStepId: "map:overview", demoBranchId: "khamis-mushait", demoStatus: "running",
  })),
  stopDemo: () => set((state) => ({ isDemoPlaying: false, demoRunId: state.demoRunId + 1, demoStepId: undefined, demoBranchId: undefined, demoStatus: "idle", mapFocusedBranchId: undefined, mapCameraMode: "overview" })),
  completeDemo: () => set((state) => ({ scene: "campus", selectedId: undefined, history: [], isDemoPlaying: false, demoRunId: state.demoRunId + 1, demoStepId: undefined, demoBranchId: undefined, demoStatus: "complete", mapFocusedBranchId: undefined, mapCameraMode: "overview" })),
  setDemoStep: (demoStepId, demoBranchId) => set({ demoStepId, demoBranchId }),
  setMapStatus: (mapStatus) => set({ mapStatus }),
  retryMap: () => set((state) => ({ mapStatus: "loading", mapRetryKey: state.mapRetryKey + 1 })),
  focusRegionalBranch: (mapFocusedBranchId) => set({ mapFocusedBranchId, mapCameraMode: "focused" }),
  clearRegionalMapFocus: () => set({ mapFocusedBranchId: undefined, mapCameraMode: "overview" }),
  touch: () => set({ lastInteraction: Date.now() }),
}));
