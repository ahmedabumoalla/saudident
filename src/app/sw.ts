import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";
declare global { interface WorkerGlobalScope extends SerwistGlobalConfig { __SW_MANIFEST: (PrecacheEntry | string)[] | undefined; } }
type KioskWindowClient = {
  url: string;
  navigate?: (url: string) => Promise<unknown>;
};
type KioskActivationEvent = Event & {
  waitUntil: (promise: Promise<unknown>) => void;
};
declare const self: WorkerGlobalScope & typeof globalThis & {
  clients: {
    claim: () => Promise<void>;
    matchAll: (options: { type: "window"; includeUncontrolled: boolean }) => Promise<KioskWindowClient[]>;
  };
};

// A kiosk can remain open for days. When a new worker takes control, reload every
// open display so the newly deployed application appears without on-site access.
self.addEventListener("activate", (event) => {
  (event as KioskActivationEvent).waitUntil((async () => {
    await self.clients.claim();
    const openDisplays = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    await Promise.all(openDisplays.map(async (client) => {
      if (!client.navigate) return;
      try {
        await client.navigate(client.url);
      } catch {
        // A closing or cross-origin window may no longer be navigable.
      }
    }));
  })());
});

const serwist = new Serwist({ precacheEntries: self.__SW_MANIFEST, skipWaiting: true, clientsClaim: true, navigationPreload: true, runtimeCaching: defaultCache, fallbacks: { entries: [{ url: "/", matcher: ({request}) => request.destination === "document" }] } });
serwist.addEventListeners();
