"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type CinematicOpeningProps = {
  onComplete: () => void;
};

const NAVIGATION_KEYS = new Set(["ArrowDown", "PageDown", " ", "End"]);

export function CinematicOpening({ onComplete }: CinematicOpeningProps) {
  const openingRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const completedRef = useRef(false);

  useGSAP(() => {
    const opening = openingRef.current;
    const hero = opening?.closest<HTMLElement>(".sd-rebuild-hero");
    if (!hero || !opening) return;

    const veil = opening.querySelector<HTMLElement>(".sd-cinematic-opening__veil");
    const firstCopy = opening.querySelector<HTMLElement>(".sd-cinematic-opening__line--first");
    const secondCopy = opening.querySelector<HTMLElement>(".sd-cinematic-opening__line--second");
    const doctors = Array.from(hero.querySelectorAll<HTMLElement>(".sd-rebuild-hero__doctor"));
    const doctorInfo = Array.from(hero.querySelectorAll<HTMLElement>(".sd-rebuild-hero__doctor-info"));
    const finalCopy = hero.querySelector<HTMLElement>(".sd-rebuild-hero__copy");
    const finalLines = Array.from(hero.querySelectorAll<HTMLElement>(".sd-rebuild-hero__copy h1 span"));
    const background = document.querySelector<HTMLElement>(".sd-experience--rebuild .sd-film__image");
    const revealOrder = [doctors[1], doctors[0], doctors[2]].filter(
      (doctor): doctor is HTMLElement => Boolean(doctor),
    );

    const setFinalState = () => {
      gsap.set(doctors, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(doctorInfo, { autoAlpha: 1, y: 0 });
      gsap.set(finalCopy, { autoAlpha: 1, y: 0 });
      gsap.set(finalLines, { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set([firstCopy, secondCopy], { autoAlpha: 0, y: -12 });
      gsap.set(veil, { autoAlpha: 0, visibility: "hidden" });
      if (background) gsap.set(background, { clearProps: "transform" });
    };

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      setFinalState();
      onComplete();
    };

    const skip = () => {
      if (completedRef.current) return;
      timelineRef.current?.kill();
      finish();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (NAVIGATION_KEYS.has(event.key)) skip();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      const reducedTimeline = gsap.timeline({ onComplete: finish });
      timelineRef.current = reducedTimeline;
      reducedTimeline.set(opening, { autoAlpha: 0 }).call(setFinalState).to({}, { duration: 0.24 });
      return () => reducedTimeline.kill();
    }

    window.addEventListener("wheel", skip, { passive: true, once: true });
    window.addEventListener("touchstart", skip, { passive: true, once: true });
    window.addEventListener("touchmove", skip, { passive: true, once: true });
    window.addEventListener("keydown", onKeyDown);

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finish,
    });
    timelineRef.current = timeline;

    if (background) {
      timeline.fromTo(
        background,
        { scale: 1.035, x: -8, transformOrigin: "50% 50%" },
        { scale: 1, x: 0, duration: 5.8, ease: "power2.out" },
        0,
      );
    }

    timeline
      .fromTo(
        firstCopy,
        { autoAlpha: 0, y: 18, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 },
        0.3,
      )
      .to(firstCopy, { autoAlpha: 0, y: -14, duration: 0.65, ease: "power2.inOut" }, 1.8)
      .fromTo(
        secondCopy,
        { autoAlpha: 0, y: 20, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.35 },
        2.3,
      )
      .to(secondCopy, { autoAlpha: 0, y: -16, duration: 0.9, ease: "power2.inOut" }, 3.75)
      .to(veil, { autoAlpha: 0, duration: 0.95, ease: "power2.inOut" }, 3.75)
      .fromTo(
        revealOrder,
        { autoAlpha: 0, y: 34, scale: 0.975 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.55, stagger: 0.16 },
        4.2,
      )
      .fromTo(
        doctorInfo,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.11 },
        4.85,
      )
      .set(finalCopy, { autoAlpha: 1 }, 5.3)
      .fromTo(
        finalLines,
        { autoAlpha: 0, y: 22, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, stagger: 0.34 },
        5.3,
      )
      .set(veil, { visibility: "hidden" }, 7.15)
      .to({}, { duration: 0.05 }, 7.15);

    if (window.matchMedia("(max-width: 560px)").matches) timeline.timeScale(1.12);

    return () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", onKeyDown);
      timeline.kill();
    };
  }, { scope: openingRef });

  return (
    <div ref={openingRef} className="sd-cinematic-opening" aria-hidden="true">
      <div className="sd-cinematic-opening__veil" />
      <div className="sd-cinematic-opening__copy">
        <p className="sd-cinematic-opening__line sd-cinematic-opening__line--first">
          الابتسامة لا تبدأ من الأسنان
        </p>
        <p className="sd-cinematic-opening__line sd-cinematic-opening__line--second">
          تبدأ من <span>الثقة</span> بمن يعالجها
        </p>
      </div>
    </div>
  );
}
