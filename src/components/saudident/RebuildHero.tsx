"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { BranchMapSection } from "@/components/saudident/BranchMapSection";
import { doctors, type SaudiDentDoctor } from "@/data/saudident";
import { gsap, useGSAP } from "@/lib/gsap";

const LANDING_EXPERIENCE_VARIANT: "baseline" | "mapbox-cinematic" = "mapbox-cinematic";
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

  const visibleDoctors = useMemo(
    () => Array.from(
      { length: Math.min(SHOWCASE_SIZE, showcaseDoctors.length) },
      (_, index) => showcaseDoctors[(rotationStart + index) % showcaseDoctors.length],
    ),
    [rotationStart],
  );

  useEffect(() => {
    if (isPaused || showcaseDoctors.length <= SHOWCASE_SIZE) return;

    const interval = window.setInterval(() => {
      setRotationStart((current) => (current + SHOWCASE_SIZE) % showcaseDoctors.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  useGSAP(() => {
    if (LANDING_EXPERIENCE_VARIANT === "baseline" || !heroRef.current) return;
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
  }, { scope: heroRef });

  return (
    <>
      <main ref={heroRef} className="sd-rebuild-hero" id="main-content" aria-labelledby="sd-rebuild-hero-title">
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
      </main>

      {LANDING_EXPERIENCE_VARIANT === "mapbox-cinematic" && (
        <BranchMapSection />
      )}
    </>
  );
}
