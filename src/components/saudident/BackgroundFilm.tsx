"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type NetworkNavigator = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

type BackgroundFilmProps = {
  mode?: "image" | "video";
};

function VideoBackground() {
  const [playFilm, setPlayFilm] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as NetworkNavigator).connection;
    const constrainedNetwork = connection?.saveData || connection?.effectiveType === "2g";
    const update = () => setPlayFilm(!reducedMotion.matches && !constrainedNetwork);
    update();
    reducedMotion.addEventListener("change", update);
    return () => reducedMotion.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playFilm || !videoRef.current) return;
    const tween = gsap.fromTo(videoRef.current, { scale: 1.035 }, { scale: 1, duration: 2.4, ease: "power2.out" });
    return () => { tween.kill(); };
  }, [playFilm]);

  return (
    <div className="sd-film" aria-hidden="true">
      <div className="sd-film__fallback" />
      {playFilm ? (
        <video
          ref={videoRef}
          className="sd-film__video"
          src="/media/saudident-cinematic-background.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      ) : null}
      <div className="sd-film__wash" />
      <div className="sd-film__vignette" />
      <div className="sd-film__grain" />
    </div>
  );
}

export function BackgroundFilm({ mode = "video" }: BackgroundFilmProps) {
  if (mode === "image") {
    return (
      <div className="sd-film sd-film--image" aria-hidden="true">
        <Image
          className="sd-film__image"
          src="/media/saudident-light-background.png"
          alt=""
          fill
          sizes="100vw"
          priority
          unoptimized
        />
      </div>
    );
  }

  return <VideoBackground />;
}
