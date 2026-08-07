"use client";

import { Expand, Home, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { useExperienceStore } from "@/store/use-experience-store";

export function KioskControls() {
  const reset = useExperienceStore((state) => state.reset);
  const scene = useExperienceStore((state) => state.scene);
  const playing = useExperienceStore((state) => state.isDemoPlaying);
  const startDemo = useExperienceStore((state) => state.startDemo);
  const stopDemo = useExperienceStore((state) => state.stopDemo);
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const sync = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  };

  return <div className="kiosk-controls" aria-label="أدوات العرض">
    {(scene === "campus" || playing) && <button className="demo-control-button" type="button" data-demo-control="true" onClick={playing ? stopDemo : startDemo} aria-label={playing ? "إيقاف الجولة" : "تشغيل الجولة التلقائية"}>{playing ? <Pause /> : <Play />}<span>{playing ? "إيقاف الجولة" : "تشغيل الجولة التلقائية"}</span></button>}
    {scene !== "campus" && !playing && <button type="button" onClick={reset} aria-label="العودة إلى الخريطة الرئيسية"><Home /></button>}
    <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "إغلاق ملء الشاشة" : "ملء الشاشة"}><Expand /></button>
    <button type="button" onClick={() => setMuted((value) => !value)} aria-label={muted ? "تشغيل المؤثرات الصوتية" : "كتم المؤثرات الصوتية"} aria-pressed={!muted}>{muted ? <VolumeX /> : <Volume2 />}</button>
  </div>;
}
