import { demoConfig } from "@/data/demo-config";
import { getClinics } from "@/data/clinics";
import { getBranchSections } from "@/data/branch-sections";
import { getDoctors } from "@/data/doctors";
import { getFacilities } from "@/data/facilities";
import { getServices } from "@/data/services";
import { useExperienceStore, type TransitionPreset } from "@/store/use-experience-store";
import type { BranchId, ExperienceItem, SceneId } from "@/types/experience";
import { waitForDemoGallery } from "@/lib/demo-gallery-events";

export function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(new DOMException("Demo stopped", "AbortError")); return; }
    const finish = () => { signal.removeEventListener("abort", abort); resolve(); };
    const timer = setTimeout(finish, ms);
    const abort = () => { clearTimeout(timer); signal.removeEventListener("abort", abort); reject(new DOMException("Demo stopped", "AbortError")); };
    signal.addEventListener("abort", abort, { once: true });
  });
}

async function navigateAndWait(scene: SceneId, selectedId: string | undefined, preset: TransitionPreset, signal: AbortSignal, holdMs: number) {
  await useExperienceStore.getState().transitionTo(scene, selectedId, { preset, signal, replace: true });
  await wait(holdMs, signal);
}

async function showDetails(items: ExperienceItem[], scene: SceneId, branchId: BranchId, signal: AbortSignal) {
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const stepId = `${branchId}:${scene}:${item.id}:${index}`;
    await useExperienceStore.getState().transitionTo(scene, item.id, {
      preset: index === 0 ? "collection-to-detail" : "detail-to-detail",
      signal,
      replace: true,
    });
    useExperienceStore.getState().setDemoStep(stepId, branchId);
    await wait(demoConfig.detailIntroMs, signal);
    const galleryMs = Math.max(1, item.gallery.length) * demoConfig.imageHoldMs + demoConfig.finalImageHoldMs + 4000;
    await waitForDemoGallery(stepId, signal, galleryMs);
    await wait(demoConfig.detailTransitionMs, signal);
  }
}

async function showCategory(branchId: BranchId, collection: SceneId, detail: SceneId, items: ExperienceItem[], signal: AbortSignal) {
  useExperienceStore.getState().setDemoStep(`${branchId}:${collection}`, branchId);
  await navigateAndWait(collection, undefined, "category-to-category", signal, demoConfig.collectionOverviewMs);
  await showDetails(items, detail, branchId, signal);
  await wait(demoConfig.categoryTransitionMs, signal);
}

async function runBranchTour(branchId: BranchId, signal: AbortSignal) {
  const store = useExperienceStore.getState();
  store.setDemoStep(`map:${branchId}`, branchId);
  store.goTo("campus", branchId, { replace: true, silent: true, preserveDemo: true });
  await wait(demoConfig.mapBranchFocusMs, signal);
  await navigateAndWait("hospital", branchId, "map-to-branch", signal, demoConfig.branchLandingMs);
  const sections = getBranchSections(branchId);
  for (const section of sections) {
    if (section.id === "clinics") await showCategory(branchId, "clinics", "clinic-detail", getClinics(branchId), signal);
    else if (section.id === "doctors") await showCategory(branchId, "restaurants", "restaurant-detail", getDoctors(branchId), signal);
    else if (section.id === "services") await showCategory(branchId, "sports", "sport-detail", getServices(branchId), signal);
    else if (section.id === "tour") await showCategory(branchId, "gallery", "hospital-facility", getFacilities(branchId), signal);
  }
  await navigateAndWait("hospital", branchId, "category-to-category", signal, demoConfig.branchClosingMs);
  await navigateAndWait("campus", undefined, "branch-to-map", signal, demoConfig.mapReturnMs);
}

export async function runCompleteDemo(signal: AbortSignal) {
  try {
    await wait(demoConfig.mapOverviewMs, signal);
    await runBranchTour("khamis-mushait", signal);
    await runBranchTour("abha", signal);
    useExperienceStore.getState().completeDemo();
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) throw error;
  }
}
