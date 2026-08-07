"use client";

import { useEffect, useState } from "react";

export function MapLoadingScreen({ status, onRetry }: { status: "loading" | "ready" | "error"; onRetry: () => void }) {
  const [mounted, setMounted] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (status !== "ready") return;
    const revealTimer = window.setTimeout(() => setHiding(true), 100);
    const unmountTimer = window.setTimeout(() => setMounted(false), 620);
    return () => { window.clearTimeout(revealTimer); window.clearTimeout(unmountTimer); };
  }, [status]);

  if (!mounted) return null;
  return <div className={`map-loading-screen${hiding ? " is-ready" : ""}`} role={status === "error" ? "alert" : "status"} aria-live="polite">
    <div className="map-loading-ambient" aria-hidden />
    {status === "error" ? <div className="map-loading-error"><p>تعذر تحميل الخريطة</p><button type="button" onClick={onRetry}>إعادة المحاولة</button></div> : <div className="map-loading-center"><span className="map-loading-spinner" aria-hidden /><small>جاري تحميل الخريطة</small></div>}
  </div>;
}
