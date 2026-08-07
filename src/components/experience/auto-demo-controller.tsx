"use client";

import { useEffect } from "react";
import { runCompleteDemo } from "@/lib/demo-runner";
import { useExperienceStore } from "@/store/use-experience-store";

export function AutoDemoController() {
  const playing = useExperienceStore((state) => state.isDemoPlaying);
  const runId = useExperienceStore((state) => state.demoRunId);

  useEffect(() => {
    const interaction = (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[data-demo-control="true"]')) return;
      const store = useExperienceStore.getState();
      store.touch();
      if (store.isDemoPlaying) {
        store.stopDemo();
      }
    };
    const events: Array<keyof WindowEventMap> = ["pointerdown", "touchstart", "keydown"];
    events.forEach((event) => window.addEventListener(event, interaction, { passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, interaction));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const controller = new AbortController();
    void runCompleteDemo(controller.signal);
    return () => controller.abort();
  }, [playing, runId]);

  return null;
}
