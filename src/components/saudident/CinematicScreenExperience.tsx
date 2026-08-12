"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  MapFirstExperience,
  type PresentationPhase,
} from "@/components/saudident/MapFirstExperience";
import { doctors, type SaudiDentDoctor } from "@/data/saudident";
import { gsap, useGSAP } from "@/lib/gsap";

const JOURNEY: { phase: PresentationPhase; label: string; caption: string }[] = [
  { phase: "branches", label: "اختر الفرع", caption: "ابدأ باختيار الفرع الذي ترغب باستكشافه." },
  { phase: "branch", label: "ادخل الفرع", caption: "انتقال سينمائي إلى تجربة الفرع." },
  { phase: "scene", label: "استكشف الأقسام", caption: "تنقّل بين المشاهد الحقيقية لأقسام الفرع." },
  { phase: "hotspot", label: "اختر النقطة", caption: "المس أي نقطة حيّة داخل المشهد لمعرفة المزيد." },
  { phase: "detail", label: "شاهد التفاصيل", caption: "تعرّف على الخدمات والتجهيزات والصور المتاحة." },
];

const NAVIGATION_KEYS = new Set(["ArrowDown", "PageDown", " "]);

function hasPortrait(doctor: SaudiDentDoctor): doctor is SaudiDentDoctor & { image: string } {
  return Boolean(doctor.image);
}

const openingDoctors = doctors.filter(hasPortrait).slice(0, 3);

export function CinematicScreenExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const completedRef = useRef(false);
  const [openingComplete, setOpeningComplete] = useState(false);
  const [phase, setPhase] = useState<PresentationPhase>("branches");

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    const root = rootRef.current;
    if (root) {
      gsap.set(root.querySelector(".sd-screen-presentation__device-stage"), { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(root.querySelector(".sd-screen-presentation__journey"), { autoAlpha: 1, y: 0 });
      gsap.set(root.querySelector(".sd-screen-opening"), { autoAlpha: 0, visibility: "hidden" });
    }
    setOpeningComplete(true);
    window.dispatchEvent(new Event("resize"));
    window.requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
  }, []);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;
    const opening = root.querySelector<HTMLElement>(".sd-screen-opening");
    const firstCopy = root.querySelector<HTMLElement>(".sd-screen-opening__line--first");
    const secondCopy = root.querySelector<HTMLElement>(".sd-screen-opening__line--second");
    const portraits = Array.from(root.querySelectorAll<HTMLElement>(".sd-screen-opening__doctor"));
    const doctorInfo = Array.from(root.querySelectorAll<HTMLElement>(".sd-screen-opening__doctor-info"));
    const finalCopy = root.querySelector<HTMLElement>(".sd-screen-opening__final");
    const device = root.querySelector<HTMLElement>(".sd-screen-presentation__device-stage");
    const journey = root.querySelector<HTMLElement>(".sd-screen-presentation__journey");
    const revealOrder = [portraits[1], portraits[0], portraits[2]].filter(
      (item): item is HTMLElement => Boolean(item),
    );

    const applyFinalState = () => {
      gsap.set([firstCopy, secondCopy, finalCopy, portraits, doctorInfo], { autoAlpha: 0 });
      gsap.set(opening, { autoAlpha: 0, visibility: "hidden" });
      gsap.set(device, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(journey, { autoAlpha: 1, y: 0 });
    };

    const finish = () => {
      if (completedRef.current) return;
      applyFinalState();
      completeIntro();
    };

    const skip = () => {
      if (completedRef.current) return;
      timelineRef.current?.kill();
      finish();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (NAVIGATION_KEYS.has(event.key)) skip();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const reducedTimeline = gsap.timeline({ onComplete: finish });
      timelineRef.current = reducedTimeline;
      reducedTimeline.call(applyFinalState).to({}, { duration: 0.28 });
      return () => reducedTimeline.kill();
    }

    window.addEventListener("wheel", skip, { passive: true, once: true });
    window.addEventListener("touchstart", skip, { passive: true, once: true });
    window.addEventListener("touchmove", skip, { passive: true, once: true });
    window.addEventListener("pointerdown", skip, { passive: true, once: true });
    window.addEventListener("keydown", onKeyDown);

    gsap.set(device, { autoAlpha: 0, y: 34, scale: 0.91 });
    gsap.set(journey, { autoAlpha: 0, y: 12 });
    gsap.set([firstCopy, secondCopy, finalCopy, portraits, doctorInfo], { autoAlpha: 0 });

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: finish });
    timelineRef.current = timeline;
    timeline
      .fromTo(firstCopy,
        { autoAlpha: 0, y: 20, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.45 },
        0.35,
      )
      .to(firstCopy, { autoAlpha: 0, y: -12, duration: 0.65, ease: "power2.inOut" }, 1.8)
      .fromTo(secondCopy,
        { autoAlpha: 0, y: 20, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 },
        2.3,
      )
      .to(secondCopy, { autoAlpha: 0, y: -14, duration: 0.8, ease: "power2.inOut" }, 3.75)
      .fromTo(revealOrder,
        { autoAlpha: 0, y: 32, scale: 0.975 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.45, stagger: 0.16 },
        4.15,
      )
      .fromTo(doctorInfo,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.12 },
        4.78,
      )
      .fromTo(finalCopy,
        { autoAlpha: 0, y: 22, clipPath: "inset(100% 0% 0% 0%)" },
        { autoAlpha: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.35 },
        5.25,
      )
      .to(portraits[0], { x: -34, y: 8, scale: 0.96, autoAlpha: 0, duration: 1.15 }, 7.55)
      .to(portraits[1], { y: 8, scale: 0.96, autoAlpha: 0, duration: 1.15 }, 7.55)
      .to(portraits[2], { x: 34, y: 8, scale: 0.96, autoAlpha: 0, duration: 1.15 }, 7.55)
      .to(doctorInfo, { autoAlpha: 0, y: 8, duration: 0.72 }, 7.55)
      .to(finalCopy, { autoAlpha: 0, y: -12, duration: 0.78 }, 7.55)
      .to(device, { autoAlpha: 1, y: 0, scale: 1, duration: 1.45, ease: "power3.inOut" }, 7.55)
      .to(journey, { autoAlpha: 1, y: 0, duration: 0.6 }, 9.05)
      .to({}, { duration: 0.15 }, 9.65);

    if (window.matchMedia("(max-width: 767px)").matches) timeline.timeScale(1.38);

    return () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", onKeyDown);
      timeline.kill();
    };
  }, { scope: rootRef, dependencies: [completeIntro] });

  const activeIndex = JOURNEY.findIndex((item) => item.phase === phase);
  const currentCaption = useMemo(
    () => JOURNEY.find((item) => item.phase === phase)?.caption ?? JOURNEY[0].caption,
    [phase],
  );

  return (
    <div
      ref={rootRef}
      className={`sd-screen-presentation${openingComplete ? " is-opening-complete" : " is-opening-active"}`}
      dir="rtl"
    >
      <div className="sd-screen-presentation__ambient" aria-hidden="true" />

      <header className="sd-screen-presentation__brand">
        <span className="sd-screen-presentation__brand-logo">
          <Image
            src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
            alt="سعودي دنت"
            width={4096}
            height={1139}
            priority
            unoptimized
          />
        </span>
        <p>تجربة سعودي دنت التفاعلية</p>
      </header>

      <div className="sd-screen-presentation__device-stage">
        <div className="sd-screen-presentation__device">
          <div className="sd-screen-presentation__screen">
            <MapFirstExperience
              presentationMode
              onPresentationPhaseChange={setPhase}
            />
          </div>
        </div>
        <div className="sd-screen-presentation__reflection" aria-hidden="true" />
      </div>

      <section className="sd-screen-presentation__journey" aria-label="مراحل التجربة">
        <ol>
          {JOURNEY.map((item, index) => (
            <li
              key={item.phase}
              className={`${index === activeIndex ? "is-active" : ""}${index < activeIndex ? " is-complete" : ""}`}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              <span>{index + 1}</span>
              <strong>{item.label}</strong>
            </li>
          ))}
        </ol>
        <p aria-live="polite">{currentCaption}</p>
      </section>

      {!openingComplete && (
        <section className="sd-screen-opening" aria-label="افتتاحية سعودي دنت">
          <div className="sd-screen-opening__copy">
            <p className="sd-screen-opening__line sd-screen-opening__line--first">
              الابتسامة لا تبدأ من الأسنان.
            </p>
            <p className="sd-screen-opening__line sd-screen-opening__line--second">
              تبدأ من <span>الثقة</span> بمن يعالجها.
            </p>
          </div>

          <div className="sd-screen-opening__doctors" role="list" aria-label="نخبة من أطباء سعودي دنت">
            {openingDoctors.map((doctor, index) => (
              <article className={`sd-screen-opening__doctor${index === 1 ? " is-featured" : ""}`} key={doctor.id} role="listitem">
                <div className="sd-screen-opening__portrait">
                  <Image
                    src={doctor.image}
                    alt={`صورة ${doctor.name}`}
                    fill
                    sizes="(max-width: 767px) 34vw, 240px"
                    priority
                  />
                </div>
                <div className="sd-screen-opening__doctor-info">
                  <h2>{doctor.name}</h2>
                  <p>{doctor.specialty}</p>
                </div>
              </article>
            ))}
          </div>

          <h1 className="sd-screen-opening__final">
            <span>ابتسامتك تبدأ</span>
            <span>مع الصفوة</span>
          </h1>
        </section>
      )}
    </div>
  );
}
