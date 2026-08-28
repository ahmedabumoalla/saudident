"use client";

import { useEffect } from "react";

const UPDATE_CHECK_INTERVAL_MS = 30_000;

export function RemoteUpdateReloader() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let disposed = false;
    let refreshing = false;
    const hadControllerAtMount = Boolean(navigator.serviceWorker.controller);

    const reloadForNewController = () => {
      if (disposed || refreshing || !hadControllerAtMount) return;
      refreshing = true;
      window.location.reload();
    };

    const checkForUpdate = async () => {
      if (disposed || !navigator.onLine) return;
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.update();
      } catch {
        // Keep the current kiosk session running when the network is unavailable.
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", reloadForNewController);
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", checkForUpdate);
    const interval = window.setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS);
    void checkForUpdate();

    return () => {
      disposed = true;
      window.clearInterval(interval);
      navigator.serviceWorker.removeEventListener("controllerchange", reloadForNewController);
      window.removeEventListener("online", checkForUpdate);
      document.removeEventListener("visibilitychange", checkForUpdate);
    };
  }, []);

  return null;
}
