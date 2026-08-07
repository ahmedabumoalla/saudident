const completions = new Map<string, () => void>();

export function completeDemoGallery(stepId: string) {
  completions.get(stepId)?.();
}

export function waitForDemoGallery(stepId: string, signal: AbortSignal, fallbackMs: number) {
  return new Promise<void>((resolve, reject) => {
    const state: { timer?: ReturnType<typeof setTimeout> } = {};
    const finish = () => { cleanup(); resolve(); };
    const abort = () => { cleanup(); reject(new DOMException("Demo stopped", "AbortError")); };
    const cleanup = () => {
      if (state.timer) clearTimeout(state.timer);
      completions.delete(stepId);
      signal.removeEventListener("abort", abort);
    };
    completions.set(stepId, finish);
    signal.addEventListener("abort", abort, { once: true });
    state.timer = setTimeout(finish, fallbackMs);
  });
}
