"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BranchMapSection } from "@/components/saudident/BranchMapSection";
import { CinematicOpening } from "@/components/saudident/CinematicOpening";
import { doctors, type SaudiDentDoctor } from "@/data/saudident";
import { gsap, useGSAP } from "@/lib/gsap";

const LANDING_EXPERIENCE_VARIANT: "baseline" | "mapbox-cinematic" = "mapbox-cinematic";
const CINEMATIC_OPENING_ENABLED = true;
const ROTATION_INTERVAL = 3000;
const SHOWCASE_SIZE = 3;

function hasPortrait(doctor: SaudiDentDoctor | undefined): doctor is SaudiDentDoctor & { image: string } {
  return Boolean(doctor?.image);
}

const showcaseDoctors = doctors.filter(hasPortrait);

export function RebuildHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [rotationStart, setRotationStart] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [openingComplete, setOpeningComplete] = useState(!CINEMATIC_OPENING_ENABLED);
  const [rotationActive, setRotationActive] = useState(false);

  const completeOpening = useCallback(() => setOpeningComplete(true), []);

  const visibleDoctors = useMemo(
    () => Array.from(
      { length: Math.min(SHOWCASE_SIZE, showcaseDoctors.length) },
      (_, index) => showcaseDoctors[(rotationStart + index) % showcaseDoctors.length],
    ),
    [rotationStart],
  );

  useEffect(() => {
    if (isPaused || !openingComplete || showcaseDoctors.length <= SHOWCASE_SIZE) return;

    const interval = window.setInterval(() => {
      setRotationActive(true);
      setRotationStart((current) => (current + SHOWCASE_SIZE) % showcaseDoctors.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isPaused, openingComplete]);

  useGSAP(() => {
    if (LANDING_EXPERIENCE_VARIANT === "baseline" || !openingComplete || !heroRef.current) return;
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom 42%",
        scrub: 0.65,
      },
    });
    timeline
      .to(".sd-rebuild-hero__doctors", { y: 48, autoAlpha: 0.18, ease: "none" }, 0)
      .to(".sd-rebuild-hero__copy", { y: 24, autoAlpha: 0.42, ease: "none" }, 0);
  }, { scope: heroRef, dependencies: [openingComplete], revertOnUpdate: true });

  const heroClassName = [
    "sd-rebuild-hero",
    CINEMATIC_OPENING_ENABLED ? "sd-rebuild-hero--cinematic" : "sd-rebuild-hero--baseline",
    openingComplete ? "is-opening-complete" : "is-opening-active",
    rotationActive ? "is-rotation-active" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <main ref={heroRef} className={heroClassName} id="main-content" aria-labelledby="sd-rebuild-hero-title">
        <div className="sd-rebuild-hero__copy">
          <h1 id="sd-rebuild-hero-title">
            <span>ابتسامتك</span>
            <span>تبدأ مع الصفوة</span>
          </h1>
        </div>

        <div
          className="sd-rebuild-hero__doctors"
          role="list"
          aria-label="نخبة من أطباء سعودي دنت"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {visibleDoctors.map((doctor, index) => (
            <article
              className={`sd-rebuild-hero__doctor${index === 1 ? " is-featured" : ""}`}
              key={doctor.id}
              role="listitem"
            >
              <div className="sd-rebuild-hero__portrait">
                <div className="sd-rebuild-hero__portrait-image">
                  <Image
                    src={doctor.image}
                    alt={`صورة ${doctor.name}`}
                    fill
                    sizes="(max-width: 560px) 44vw, (max-width: 900px) 30vw, 18vw"
                    priority
                  />
                </div>
              </div>
              <div className="sd-rebuild-hero__doctor-info">
                <h2>{doctor.name}</h2>
                <p>{doctor.specialty}</p>
              </div>
            </article>
          ))}
        </div>

        {CINEMATIC_OPENING_ENABLED && !openingComplete && (
          <CinematicOpening onComplete={completeOpening} />
        )}
      </main>

      {LANDING_EXPERIENCE_VARIANT === "mapbox-cinematic" && (
        <BranchMapSection />
      )}
    </>
  );
}
