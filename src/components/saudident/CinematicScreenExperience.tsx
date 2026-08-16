"use client";

import Image from "next/image";
import { Armchair, Braces, Building2, CalendarCheck2, ClipboardCheck, Headphones, HeartHandshake, MoonStar, Radiation, ShieldCheck, Stethoscope, UsersRound, Wrench, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConferenceLayoutEditor } from "@/components/saudident/ConferenceLayoutEditor";
import { administrativeOfficeFeature, doctors, khamisLobbySideFeatures, leftReceptionFeature, receptionHallFeatures, xrayFifthFeatures, xrayFourthFeatures, xrayThirdFeatures, type KhamisLobbySideFeatureId, type ReceptionHallFeatureId, type SaudiDentDoctor, type XrayFifthFeatureId, type XrayFourthFeatureId, type XrayThirdFeatureId } from "@/data/saudident";
import { gsap, useGSAP } from "@/lib/gsap";

const NAVIGATION_KEYS = new Set(["ArrowDown", "PageDown", " "]);

type ConferenceScene = "hall" | "left-lobby" | "left-reception" | "reception-hall" | "reception" | "main-reception" | "clinic-corridor" | "prayer-corridor" | "xray-corridor" | "xray-corridor-next" | "xray-corridor-third" | "xray-corridor-fourth" | "xray-corridor-fifth" | "khamis-lobby-side";
type MainSceneFeature =
  | "welcome"
  | "lounge"
  | "clinic"
  | "corridor-clinic-near"
  | "corridor-clinic-mid"
  | "corridor-clinic-far"
  | "equipment"
  | "sterilization"
  | "prayer-room"
  | "meeting-room"
  | "central-radiology"
  | "xray-clinic"
  | "women-lounge"
  | "administrative-office"
  | "left-reception-desk"
  | "next-clinic-left"
  | "next-clinic-center"
  | "next-clinic-right"
  | XrayThirdFeatureId
  | XrayFourthFeatureId
  | XrayFifthFeatureId
  | ReceptionHallFeatureId
  | KhamisLobbySideFeatureId;

function hasPortrait(doctor: SaudiDentDoctor): doctor is SaudiDentDoctor & { image: string } {
  return Boolean(doctor.image);
}

const openingDoctors = doctors.filter(hasPortrait).slice(0, 3);

function isXrayThirdFeature(feature: MainSceneFeature | null): feature is XrayThirdFeatureId {
  return feature !== null && feature in xrayThirdFeatures;
}

function isXrayFourthFeature(feature: MainSceneFeature | null): feature is XrayFourthFeatureId {
  return feature !== null && feature in xrayFourthFeatures;
}

function isXrayFifthFeature(feature: MainSceneFeature | null): feature is XrayFifthFeatureId {
  return feature !== null && feature in xrayFifthFeatures;
}

function isKhamisLobbySideFeature(feature: MainSceneFeature | null): feature is KhamisLobbySideFeatureId {
  return feature !== null && feature in khamisLobbySideFeatures;
}

function isReceptionHallFeature(feature: MainSceneFeature | null): feature is ReceptionHallFeatureId {
  return feature !== null && feature in receptionHallFeatures;
}

function FloorRouteGuide() {
  return (
    <span className="sd-conference-floor-arrow__projection" aria-hidden="true">
      <svg viewBox="0 0 100 180" focusable="false">
        <path className="sd-route-chevron sd-route-chevron--large" d="M8 142 50 100 92 142 72 162 50 140 28 162Z" />
        <path className="sd-route-chevron sd-route-chevron--medium" d="M19 99 50 68 81 99 66 114 50 98 34 114Z" />
        <path className="sd-route-chevron sd-route-chevron--small" d="M30 57 50 37 70 57 60 67 50 57 40 67Z" />
      </svg>
    </span>
  );
}

export function CinematicScreenExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const sceneTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const patientDialogRef = useRef<HTMLDivElement>(null);
  const mainFeatureDialogRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const [openingComplete, setOpeningComplete] = useState(false);
  const [activeScene, setActiveScene] = useState<ConferenceScene>("hall");
  const [sceneTransitioning, setSceneTransitioning] = useState(false);
  const [patientRelationsOpen, setPatientRelationsOpen] = useState(false);
  const [mainSceneFeature, setMainSceneFeature] = useState<MainSceneFeature | null>(null);
  const activeXrayThirdFeature = isXrayThirdFeature(mainSceneFeature) ? xrayThirdFeatures[mainSceneFeature] : null;
  const activeXrayFourthFeature = isXrayFourthFeature(mainSceneFeature) ? xrayFourthFeatures[mainSceneFeature] : null;
  const activeXrayFifthFeature = isXrayFifthFeature(mainSceneFeature) ? xrayFifthFeatures[mainSceneFeature] : null;
  const activeKhamisLobbySideFeature = isKhamisLobbySideFeature(mainSceneFeature) ? khamisLobbySideFeatures[mainSceneFeature] : null;
  const activeReceptionHallFeature = isReceptionHallFeature(mainSceneFeature) ? receptionHallFeatures[mainSceneFeature] : null;

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    const root = rootRef.current;
    if (root) {
      gsap.set(root.querySelector(".sd-screen-presentation__blank"), { autoAlpha: 1 });
      gsap.set(root.querySelector(".sd-screen-opening"), { autoAlpha: 0, visibility: "hidden" });
    }

    setOpeningComplete(true);
  }, []);

  const openHallScene = useCallback((destination: "left-lobby" | "reception", direction: -1 | 1) => {
    if (sceneTransitioning || activeScene !== "hall") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--hall");
    const nextScene = root?.querySelector<HTMLElement>(`.sd-conference-scene--${destination}`);
    const arrows = root?.querySelector<HTMLElement>(".sd-conference-floor-arrows");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    if (!currentScene || !nextScene || !arrows || !lightSweep) return;

    const finish = () => {
      setActiveScene(destination);
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      gsap.set(arrows, { autoAlpha: 0 });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      xPercent: 6 * direction,
      scale: 1.08,
      filter: "blur(12px)",
      transformOrigin: "50% 58%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(arrows, { autoAlpha: 0, scale: 1.08, duration: 0.26, ease: "power2.in" }, 0)
      .to(currentScene, {
        xPercent: -5 * direction,
        scale: 1.12,
        filter: "blur(7px)",
        transformOrigin: "58% 64%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 * direction },
        { autoAlpha: 0.72, xPercent: -75 * direction, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        xPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openRightScene = useCallback(() => {
    openHallScene("reception", 1);
  }, [openHallScene]);

  const openLeftScene = useCallback(() => {
    openHallScene("left-lobby", -1);
  }, [openHallScene]);

  const returnToHall = useCallback(() => {
    if (sceneTransitioning || (activeScene !== "reception" && activeScene !== "left-lobby")) return;

    const root = rootRef.current;
    const direction = activeScene === "reception" ? 1 : -1;
    const currentScene = root?.querySelector<HTMLElement>(`.sd-conference-scene--${activeScene}`);
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--hall");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("hall");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      xPercent: -6 * direction,
      scale: 1.08,
      filter: "blur(12px)",
      transformOrigin: "50% 58%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        xPercent: 5 * direction,
        scale: 1.12,
        filter: "blur(7px)",
        transformOrigin: "42% 64%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 * direction },
        { autoAlpha: 0.72, xPercent: 75 * direction, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        xPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openLeftReception = useCallback(() => {
    if (sceneTransitioning || activeScene !== "left-lobby") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--left-lobby");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--left-reception");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-left-lobby-controls > *"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("left-reception");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, { autoAlpha: 0, xPercent: -4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: 4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: -75 }, { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToLeftLobby = useCallback(() => {
    if (sceneTransitioning || activeScene !== "left-reception") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--left-reception");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--left-lobby");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-left-reception-controls > *"))
      : [];
    if (!currentScene || !previousScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("left-lobby");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, { autoAlpha: 0, xPercent: 4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: -4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: 75 }, { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openReceptionHall = useCallback(() => {
    if (sceneTransitioning || activeScene !== "left-reception") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--left-reception");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-hall");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-left-reception-controls > *"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("reception-hall");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, { autoAlpha: 0, xPercent: -4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: 4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: -75 }, { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToLeftReception = useCallback(() => {
    if (sceneTransitioning || activeScene !== "reception-hall") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-hall");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--left-reception");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-reception-hall-controls > *"))
      : [];
    if (!currentScene || !previousScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("left-reception");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, { autoAlpha: 0, xPercent: 4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: -4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: 75 }, { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openMainReception = useCallback(() => {
    if (sceneTransitioning || activeScene !== "reception") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--main-reception");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-patient-relations-hotspot, .sd-conference-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("main-reception");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      yPercent: 3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 66%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.06, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: -3,
        scale: 1.16,
        filter: "blur(7px)",
        transformOrigin: "50% 68%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToReception = useCallback(() => {
    if (sceneTransitioning || activeScene !== "main-reception") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--main-reception");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("reception");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      yPercent: -3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 66%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: 3,
        scale: 1.14,
        filter: "blur(7px)",
        transformOrigin: "50% 66%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 },
        { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openClinicCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "main-reception") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--main-reception");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--clinic-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-main-scene-hotspot, .sd-main-reception-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("clinic-corridor");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      yPercent: 3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 70%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.06, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: -3,
        scale: 1.16,
        filter: "blur(7px)",
        transformOrigin: "50% 70%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToMainReception = useCallback(() => {
    if (sceneTransitioning || activeScene !== "clinic-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--clinic-corridor");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--main-reception");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("main-reception");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      yPercent: -3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 70%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: 3,
        scale: 1.14,
        filter: "blur(7px)",
        transformOrigin: "50% 70%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 },
        { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openPrayerCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "clinic-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--clinic-corridor");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--prayer-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-corridor-hotspot, .sd-clinic-corridor-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("prayer-corridor");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      yPercent: 3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 70%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.05, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, {
        xPercent: 4,
        scale: 1.16,
        filter: "blur(7px)",
        transformOrigin: "46% 70%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToClinicCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "prayer-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--prayer-corridor");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--clinic-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("clinic-corridor");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      xPercent: 4,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "46% 70%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        xPercent: -4,
        scale: 1.14,
        filter: "blur(7px)",
        transformOrigin: "50% 70%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 },
        { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        xPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "prayer-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--prayer-corridor");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-corridor-hotspot, .sd-prayer-corridor-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("xray-corridor");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      yPercent: 3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 72%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.05, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: -3,
        scale: 1.16,
        filter: "blur(7px)",
        transformOrigin: "50% 72%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToPrayerCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--prayer-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("prayer-corridor");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      yPercent: -3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 72%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: 3,
        scale: 1.14,
        filter: "blur(7px)",
        transformOrigin: "50% 72%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 },
        { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openNextXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-next");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-xray-corridor-controls .sd-corridor-hotspot, .sd-xray-corridor-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("xray-corridor-next");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      yPercent: 3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 72%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.05, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: -3,
        scale: 1.16,
        filter: "blur(7px)",
        transformOrigin: "50% 72%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-next") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-next");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("xray-corridor");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      yPercent: -3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 72%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: 3,
        scale: 1.14,
        filter: "blur(7px)",
        transformOrigin: "50% 72%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 },
        { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openThirdXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-next") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-next");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-third");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-xray-next-controls .sd-corridor-hotspot, .sd-xray-next-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("xray-corridor-third");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      xPercent: -4,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "34% 76%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.05, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, {
        xPercent: 4,
        scale: 1.16,
        filter: "blur(7px)",
        transformOrigin: "34% 76%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        xPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToNextXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-third") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-third");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-next");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("xray-corridor-next");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      xPercent: 4,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "34% 76%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        xPercent: -4,
        scale: 1.14,
        filter: "blur(7px)",
        transformOrigin: "34% 76%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 },
        { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        xPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openFourthXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-third") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-third");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fourth");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-xray-third-controls .sd-corridor-hotspot, .sd-xray-third-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("xray-corridor-fourth");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      yPercent: 3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 68%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.05, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: -3,
        scale: 1.16,
        filter: "blur(7px)",
        transformOrigin: "50% 68%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(nextScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToThirdXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-fourth") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fourth");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-third");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("xray-corridor-third");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, {
      autoAlpha: 0,
      yPercent: -3,
      scale: 1.11,
      filter: "blur(12px)",
      transformOrigin: "50% 68%",
    });

    const transition = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
    });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, {
        yPercent: 3,
        scale: 1.14,
        filter: "blur(7px)",
        transformOrigin: "50% 68%",
        duration: 1.05,
        ease: "power3.in",
      }, 0)
      .fromTo(lightSweep,
        { autoAlpha: 0, xPercent: -75 },
        { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" },
        0.28,
      )
      .to(previousScene, {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.28,
        ease: "power3.out",
      }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openFifthXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-fourth") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fourth");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fifth");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-xray-fourth-controls .sd-corridor-hotspot, .sd-xray-fourth-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("xray-corridor-fifth");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, { autoAlpha: 0, yPercent: 3, scale: 1.11, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.05, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { yPercent: -3, scale: 1.16, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: 75 }, { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(nextScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToFourthXrayCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-fifth") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fifth");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fourth");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("xray-corridor-fourth");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, { autoAlpha: 0, yPercent: -3, scale: 1.11, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, { yPercent: 3, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: -75 }, { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(previousScene, { autoAlpha: 1, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openKhamisLobbySide = useCallback(() => {
    if (sceneTransitioning || activeScene !== "xray-corridor-fourth") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fourth");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--khamis-lobby-side");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-xray-fourth-controls .sd-corridor-hotspot, .sd-xray-fourth-forward, .sd-xray-fourth-side-forward"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("khamis-lobby-side");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, { autoAlpha: 0, xPercent: 4, scale: 1.11, filter: "blur(12px)", transformOrigin: "30% 70%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.05, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: -4, scale: 1.15, filter: "blur(7px)", transformOrigin: "30% 70%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: 75 }, { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToFourthFromKhamisLobby = useCallback(() => {
    if (sceneTransitioning || activeScene !== "khamis-lobby-side") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--khamis-lobby-side");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--xray-corridor-fourth");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const backButton = root?.querySelector<HTMLElement>(".sd-conference-back");
    if (!currentScene || !previousScene || !lightSweep || !backButton) return;

    const finish = () => {
      setActiveScene("xray-corridor-fourth");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(previousScene, { autoAlpha: 0, xPercent: -4, scale: 1.11, filter: "blur(12px)", transformOrigin: "30% 70%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(backButton, { autoAlpha: 0, x: 12, duration: 0.22, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: 4, scale: 1.14, filter: "blur(7px)", transformOrigin: "30% 70%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: -75 }, { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToTourStartFromKhamisLobby = useCallback(() => {
    if (sceneTransitioning || activeScene !== "khamis-lobby-side") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--khamis-lobby-side");
    const firstScene = root?.querySelector<HTMLElement>(".sd-conference-scene--hall");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-khamis-side-controls .sd-corridor-hotspot, .sd-khamis-side-return"))
      : [];
    if (!currentScene || !firstScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("hall");
      setSceneTransitioning(false);
    };

    setSceneTransitioning(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(currentScene, { autoAlpha: 0 });
      gsap.set(firstScene, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, filter: "blur(0px)" });
      finish();
      return;
    }

    sceneTimelineRef.current?.kill();
    gsap.set(firstScene, { autoAlpha: 0, xPercent: -3, yPercent: 0, scale: 1.09, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: 4, scale: 1.14, filter: "blur(7px)", transformOrigin: "70% 64%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: -75 }, { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(firstScene, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const closePatientRelations = useCallback(() => {
    const overlay = patientDialogRef.current;
    const panel = overlay?.querySelector<HTMLElement>(".sd-patient-relations__panel");
    if (!overlay || !panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPatientRelationsOpen(false);
      return;
    }

    gsap.timeline({ onComplete: () => setPatientRelationsOpen(false) })
      .to(panel, { autoAlpha: 0, y: 18, scale: 0.97, duration: 0.24, ease: "power2.in" })
      .to(overlay, { autoAlpha: 0, duration: 0.22, ease: "power2.out" }, 0.08);
  }, []);

  const closeMainSceneFeature = useCallback(() => {
    const overlay = mainFeatureDialogRef.current;
    const panel = overlay?.querySelector<HTMLElement>(".sd-main-feature__panel");
    if (!overlay || !panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMainSceneFeature(null);
      return;
    }

    gsap.timeline({ onComplete: () => setMainSceneFeature(null) })
      .to(panel, { autoAlpha: 0, y: 18, scale: 0.97, duration: 0.24, ease: "power2.in" })
      .to(overlay, { autoAlpha: 0, duration: 0.22, ease: "power2.out" }, 0.08);
  }, []);

  useEffect(() => {
    if (!patientRelationsOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePatientRelations();
    };

    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => patientDialogRef.current?.focus());
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePatientRelations, patientRelationsOpen]);

  useEffect(() => {
    if (!mainSceneFeature) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMainSceneFeature();
    };

    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => mainFeatureDialogRef.current?.focus());
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMainSceneFeature, mainSceneFeature]);

  useEffect(() => {
    const player = rootRef.current?.querySelector<HTMLElement>(".sd-screen-presentation__blank");
    if (!player) return;

    let frame = 0;
    const applyPlayerScale = (width: number, height: number) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        player.style.setProperty("--sd-conference-scale-x", (width / 1500).toFixed(6));
        player.style.setProperty("--sd-conference-scale-y", (height / 1000).toFixed(6));
      });
    };

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      applyPlayerScale(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(player);
    applyPlayerScale(player.clientWidth, player.clientHeight);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      player.style.removeProperty("--sd-conference-scale-x");
      player.style.removeProperty("--sd-conference-scale-y");
    };
  }, []);

  useGSAP(() => {
    const root = rootRef.current;
    if (!root) return;

    const opening = root.querySelector<HTMLElement>(".sd-screen-opening");
    const blank = root.querySelector<HTMLElement>(".sd-screen-presentation__blank");
    const firstCopy = root.querySelector<HTMLElement>(".sd-screen-opening__line--first");
    const secondCopy = root.querySelector<HTMLElement>(".sd-screen-opening__line--second");
    const portraits = Array.from(root.querySelectorAll<HTMLElement>(".sd-screen-opening__doctor"));
    const doctorInfo = Array.from(root.querySelectorAll<HTMLElement>(".sd-screen-opening__doctor-info"));
    const finalCopy = root.querySelector<HTMLElement>(".sd-screen-opening__final");
    const revealOrder = [portraits[1], portraits[0], portraits[2]].filter(
      (item): item is HTMLElement => Boolean(item),
    );

    const applyFinalState = () => {
      gsap.set([firstCopy, secondCopy, finalCopy, portraits, doctorInfo], { autoAlpha: 0 });
      gsap.set(opening, { autoAlpha: 0, visibility: "hidden" });
      gsap.set(blank, { autoAlpha: 1 });
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

    gsap.set(blank, { autoAlpha: 0 });
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
      .to(blank, { autoAlpha: 1, duration: 1.1, ease: "power2.inOut" }, 7.55)
      .to({}, { duration: 0.15 }, 8.65);

    if (window.matchMedia("(max-width: 767px)").matches) timeline.timeScale(1.38);

    return () => {
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", onKeyDown);
      timeline.kill();
      sceneTimelineRef.current?.kill();
    };
  }, { scope: rootRef, dependencies: [completeIntro] });

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

      <main
        className={`sd-screen-presentation__blank is-${activeScene}${sceneTransitioning ? " is-scene-transitioning" : ""}`}
        aria-label="جولة داخل سعودي دنت"
      >
        <div className="sd-conference-scene sd-conference-scene--hall" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--left-lobby" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--left-reception" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--reception-hall" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--reception" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--main-reception" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--clinic-corridor" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--prayer-corridor" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--xray-corridor" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--xray-corridor-next" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--xray-corridor-third" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--xray-corridor-fourth" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--xray-corridor-fifth" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--khamis-lobby-side" aria-hidden="true" />
        <div className="sd-conference-scene-transition" aria-hidden="true" />

        {activeScene === "hall" && (
        <div className="sd-conference-floor-arrows sd-conference-image-coordinates" aria-label="اتجاهات الجولة">
          <button
            type="button"
            className="sd-conference-floor-arrow sd-conference-floor-arrow--far"
            onClick={openRightScene}
            disabled={sceneTransitioning}
            aria-label="الانتقال إلى اليمين"
          >
            <FloorRouteGuide />
            <span className="sd-floor-route__label" aria-hidden="true">تابع المسار</span>
          </button>

          <button
            type="button"
            className="sd-conference-floor-arrow sd-conference-floor-arrow--near"
            onClick={openLeftScene}
            disabled={sceneTransitioning}
            aria-label="الانتقال إلى الردهة اليسرى"
          >
            <FloorRouteGuide />
          </button>
        </div>
        )}

        {(activeScene === "left-lobby" || activeScene === "left-reception" || activeScene === "reception-hall" || activeScene === "reception" || activeScene === "main-reception" || activeScene === "clinic-corridor" || activeScene === "prayer-corridor" || activeScene === "xray-corridor" || activeScene === "xray-corridor-next" || activeScene === "xray-corridor-third" || activeScene === "xray-corridor-fourth" || activeScene === "xray-corridor-fifth" || activeScene === "khamis-lobby-side") && (
          <button
            key={`conference-back-${activeScene}`}
            type="button"
            className="sd-conference-back"
            onClick={
              activeScene === "reception-hall"
                ? returnToLeftReception
                : activeScene === "left-reception"
                  ? returnToLeftLobby
                : activeScene === "left-lobby" || activeScene === "reception"
                  ? returnToHall
                : activeScene === "main-reception"
                  ? returnToReception
                  : activeScene === "clinic-corridor"
                    ? returnToMainReception
                    : activeScene === "prayer-corridor"
                      ? returnToClinicCorridor
                      : activeScene === "xray-corridor"
                        ? returnToPrayerCorridor
                        : activeScene === "xray-corridor-next"
                          ? returnToXrayCorridor
                          : activeScene === "xray-corridor-third"
                            ? returnToNextXrayCorridor
                            : activeScene === "xray-corridor-fourth"
                              ? returnToThirdXrayCorridor
                              : activeScene === "xray-corridor-fifth"
                                ? returnToFourthXrayCorridor
                                : returnToFourthFromKhamisLobby
            }
            disabled={sceneTransitioning}
            aria-label="الرجوع إلى الصورة السابقة"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M14 6l6 6-6 6" />
            </svg>
            <span>رجوع</span>
          </button>
        )}

        {activeScene === "left-lobby" && (
          <div className="sd-left-lobby-controls sd-conference-image-coordinates" aria-label="اتجاه الردهة والمكتب الإداري">
            <button
              type="button"
              className="sd-conference-floor-arrow sd-left-lobby-forward"
              onClick={openLeftReception}
              disabled={sceneTransitioning}
              aria-label="الانتقال إلى الاستقبال"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع المسار</span>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-left-lobby-hotspot--administration"
              onClick={() => setMainSceneFeature("administrative-office")}
              aria-label={administrativeOfficeFeature.ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Building2 aria-hidden="true" /></span>
              <strong>{administrativeOfficeFeature.shortLabel}</strong>
            </button>
          </div>
        )}

        {activeScene === "left-reception" && (
          <div className="sd-left-reception-controls sd-conference-image-coordinates" aria-label="سهم الاتجاه ونقطة الاستقبال">
            <button
              type="button"
              className="sd-conference-floor-arrow sd-left-reception-forward"
              onClick={openReceptionHall}
              disabled={sceneTransitioning}
              aria-label="الانتقال إلى صالة الاستقبال"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع المسار</span>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-left-reception-hotspot--reception"
              onClick={() => setMainSceneFeature("left-reception-desk")}
              aria-label={leftReceptionFeature.ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><CalendarCheck2 aria-hidden="true" /></span>
              <strong>{leftReceptionFeature.shortLabel}</strong>
            </button>
          </div>
        )}

        {activeScene === "reception-hall" && (
          <div className="sd-reception-hall-controls sd-conference-image-coordinates" aria-label="اتجاهات ومرافق صالة الاستقبال">
            <span className="sd-conference-floor-arrow sd-reception-hall-arrow--left" aria-label="سهم الاتجاه الأيسر">
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع المسار</span>
            </span>

            <span className="sd-conference-floor-arrow sd-reception-hall-arrow--right" aria-label="سهم الاتجاه الأيمن">
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع المسار</span>
            </span>

            {(Object.entries(receptionHallFeatures) as [ReceptionHallFeatureId, (typeof receptionHallFeatures)[ReceptionHallFeatureId]][]).map(([featureId, feature]) => (
              <button
                key={featureId}
                type="button"
                className={`sd-corridor-hotspot sd-reception-hall-hotspot--${feature.icon}`}
                onClick={() => setMainSceneFeature(featureId)}
                aria-label={feature.ariaLabel}
              >
                <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
                <span className="sd-corridor-hotspot__icon">
                  {feature.icon === "reception" && <CalendarCheck2 aria-hidden="true" />}
                  {feature.icon === "patient-relations" && <HeartHandshake aria-hidden="true" />}
                  {feature.icon === "lounge" && <Armchair aria-hidden="true" />}
                  {feature.icon === "clinic" && <Stethoscope aria-hidden="true" />}
                </span>
                <strong>{feature.shortLabel}</strong>
              </button>
            ))}
          </div>
        )}

        {activeScene === "reception" && (
          <div className="sd-reception-scene-controls sd-conference-image-coordinates">
            <button
              type="button"
              className="sd-patient-relations-hotspot"
              onClick={() => setPatientRelationsOpen(true)}
              aria-label="فتح معلومات علاقات المرضى"
            >
              <span className="sd-patient-relations-hotspot__pulse" aria-hidden="true" />
              <span className="sd-patient-relations-hotspot__icon">
                <HeartHandshake aria-hidden="true" />
              </span>
              <strong>علاقات المرضى</strong>
            </button>

            <button
              type="button"
              className="sd-conference-forward"
              onClick={openMainReception}
              disabled={sceneTransitioning}
              aria-label="التقدم إلى المشهد التالي"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع المسار</span>
            </button>
          </div>
        )}

        {activeScene === "main-reception" && (
          <div className="sd-main-scene-controls sd-conference-image-coordinates" aria-label="نقاط المشهد التفاعلية">
            <button
              type="button"
              className="sd-main-scene-hotspot sd-main-scene-hotspot--welcome"
              onClick={() => setMainSceneFeature("welcome")}
              aria-label="فتح رسالة الاستقبال"
            >
              <span className="sd-main-scene-hotspot__pulse" aria-hidden="true" />
              <span className="sd-main-scene-hotspot__icon">
                <CalendarCheck2 aria-hidden="true" />
              </span>
              <strong>الاستقبال</strong>
            </button>

            <button
              type="button"
              className="sd-main-scene-hotspot sd-main-scene-hotspot--lounge"
              onClick={() => setMainSceneFeature("lounge")}
              aria-label="فتح نافذة الاستراحة"
            >
              <span className="sd-main-scene-hotspot__pulse" aria-hidden="true" />
              <span className="sd-main-scene-hotspot__icon">
                <Armchair aria-hidden="true" />
              </span>
              <strong>الاستراحة</strong>
            </button>

            <button
              type="button"
              className="sd-main-scene-hotspot sd-main-scene-hotspot--clinic"
              onClick={() => setMainSceneFeature("clinic")}
              aria-label="فتح رسالة العيادة"
            >
              <span className="sd-main-scene-hotspot__pulse" aria-hidden="true" />
              <span className="sd-main-scene-hotspot__icon">
                <Stethoscope aria-hidden="true" />
              </span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-main-reception-forward"
              onClick={openClinicCorridor}
              disabled={sceneTransitioning}
              aria-label="التقدم إلى ممر العيادات"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">استكشف الممر</span>
            </button>
          </div>
        )}

        {activeScene === "clinic-corridor" && (
          <div className="sd-corridor-controls sd-conference-image-coordinates" aria-label="نقاط ممر العيادات التفاعلية">
            <button
              type="button"
              className="sd-corridor-hotspot sd-corridor-hotspot--clinic-near"
              onClick={() => setMainSceneFeature("corridor-clinic-near")}
              aria-label="فتح رسالة العيادة القريبة"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-corridor-hotspot--clinic-mid"
              onClick={() => setMainSceneFeature("corridor-clinic-mid")}
              aria-label="فتح رسالة العيادة الثانية"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-corridor-hotspot--clinic-far"
              onClick={() => setMainSceneFeature("corridor-clinic-far")}
              aria-label="فتح رسالة عيادة نهاية الممر"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-corridor-hotspot--equipment"
              onClick={() => setMainSceneFeature("equipment")}
              aria-label="فتح رسالة إدارة الأجهزة"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Wrench aria-hidden="true" /></span>
              <strong>إدارة الأجهزة</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-corridor-hotspot--sterilization"
              onClick={() => setMainSceneFeature("sterilization")}
              aria-label="فتح نافذة قسم التعقيم"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><ShieldCheck aria-hidden="true" /></span>
              <strong>التعقيم</strong>
            </button>

            <button
              type="button"
              className="sd-clinic-corridor-forward"
              onClick={openPrayerCorridor}
              disabled={sceneTransitioning}
              aria-label="الانتقال إلى الممر الجانبي"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">الممر يسارًا</span>
            </button>
          </div>
        )}

        {activeScene === "prayer-corridor" && (
          <div className="sd-prayer-corridor-controls sd-conference-image-coordinates" aria-label="نقاط الممر التفاعلية">
            <button
              type="button"
              className="sd-corridor-hotspot sd-prayer-corridor-hotspot--prayer"
              onClick={() => setMainSceneFeature("prayer-room")}
              aria-label="فتح نافذة المصلى"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><MoonStar aria-hidden="true" /></span>
              <strong>المصلى</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-prayer-corridor-hotspot--meeting"
              onClick={() => setMainSceneFeature("meeting-room")}
              aria-label="فتح رسالة قاعة الاجتماعات"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><UsersRound aria-hidden="true" /></span>
              <strong>قاعة الاجتماعات</strong>
            </button>

            <button
              type="button"
              className="sd-prayer-corridor-forward"
              onClick={openXrayCorridor}
              disabled={sceneTransitioning}
              aria-label="متابعة الممر إلى قسم الأشعة"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع الممر</span>
            </button>
          </div>
        )}

        {activeScene === "xray-corridor" && (
          <div className="sd-xray-corridor-controls sd-conference-image-coordinates" aria-label="نقاط ممر الأشعة التفاعلية">
            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-corridor-hotspot--radiology"
              onClick={() => setMainSceneFeature("central-radiology")}
              aria-label="فتح رسالة الأشعة المركزية"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Radiation aria-hidden="true" /></span>
              <strong>الأشعة المركزية</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-corridor-hotspot--clinic"
              onClick={() => setMainSceneFeature("xray-clinic")}
              aria-label="فتح رسالة العيادة"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-corridor-hotspot--women-lounge"
              onClick={() => setMainSceneFeature("women-lounge")}
              aria-label="فتح نافذة استراحة النساء"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Armchair aria-hidden="true" /></span>
              <strong>استراحة النساء</strong>
            </button>

            <button
              type="button"
              className="sd-xray-corridor-forward"
              onClick={openNextXrayCorridor}
              disabled={sceneTransitioning}
              aria-label="متابعة الممر إلى الصورة التالية"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع الممر</span>
            </button>
          </div>
        )}

        {activeScene === "xray-corridor-next" && (
          <div className="sd-xray-next-controls sd-conference-image-coordinates" aria-label="نقاط عيادات الممر التفاعلية">
            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-next-hotspot--left"
              onClick={() => setMainSceneFeature("next-clinic-left")}
              aria-label="فتح رسالة العيادة الأولى"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-next-hotspot--center"
              onClick={() => setMainSceneFeature("next-clinic-center")}
              aria-label="فتح رسالة العيادة الثانية"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-next-hotspot--right"
              onClick={() => setMainSceneFeature("next-clinic-right")}
              aria-label="فتح رسالة العيادة الثالثة"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>العيادة</strong>
            </button>

            <button
              type="button"
              className="sd-xray-next-forward"
              onClick={openThirdXrayCorridor}
              disabled={sceneTransitioning}
              aria-label="متابعة الممر إلى اليسار"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع الممر</span>
            </button>
          </div>
        )}

        {activeScene === "xray-corridor-third" && (
          <div className="sd-xray-third-controls sd-conference-image-coordinates" aria-label="نقاط الممر التفاعلية">
            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-third-hotspot--lounge"
              onClick={() => setMainSceneFeature("third-corridor-lounge")}
              aria-label={xrayThirdFeatures["third-corridor-lounge"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Armchair aria-hidden="true" /></span>
              <strong>{xrayThirdFeatures["third-corridor-lounge"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-third-hotspot--center"
              onClick={() => setMainSceneFeature("third-clinic-center")}
              aria-label={xrayThirdFeatures["third-clinic-center"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>{xrayThirdFeatures["third-clinic-center"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-third-hotspot--right"
              onClick={() => setMainSceneFeature("third-clinic-right")}
              aria-label={xrayThirdFeatures["third-clinic-right"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>{xrayThirdFeatures["third-clinic-right"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-xray-third-forward"
              onClick={openFourthXrayCorridor}
              disabled={sceneTransitioning}
              aria-label="متابعة الممر إلى الأمام"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع الممر</span>
            </button>
          </div>
        )}

        {activeScene === "xray-corridor-fourth" && (
          <div className="sd-xray-fourth-controls sd-conference-image-coordinates" aria-label="نقاط المشهد التفاعلية">
            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fourth-hotspot--call-center"
              onClick={() => setMainSceneFeature("fourth-call-center")}
              aria-label={xrayFourthFeatures["fourth-call-center"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Headphones aria-hidden="true" /></span>
              <strong>{xrayFourthFeatures["fourth-call-center"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-xray-fourth-forward"
              onClick={openFifthXrayCorridor}
              disabled={sceneTransitioning}
              aria-label="متابعة الجولة إلى الصورة التالية"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">تابع المسار</span>
            </button>

            <button
              type="button"
              className="sd-xray-fourth-side-forward"
              onClick={openKhamisLobbySide}
              disabled={sceneTransitioning}
              aria-label="الانتقال يسارًا إلى الردهة"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">إلى الردهة</span>
            </button>
          </div>
        )}

        {activeScene === "xray-corridor-fifth" && (
          <div className="sd-xray-fifth-controls sd-conference-image-coordinates" aria-label="نقاط عيادات التقويم والفحص الأولي">
            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fifth-hotspot--orthodontics-left"
              onClick={() => setMainSceneFeature("fifth-orthodontics-left")}
              aria-label={xrayFifthFeatures["fifth-orthodontics-left"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Braces aria-hidden="true" /></span>
              <strong>{xrayFifthFeatures["fifth-orthodontics-left"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fifth-hotspot--orthodontics-center"
              onClick={() => setMainSceneFeature("fifth-orthodontics-center")}
              aria-label={xrayFifthFeatures["fifth-orthodontics-center"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Braces aria-hidden="true" /></span>
              <strong>{xrayFifthFeatures["fifth-orthodontics-center"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fifth-hotspot--orthodontics-right"
              onClick={() => setMainSceneFeature("fifth-orthodontics-right")}
              aria-label={xrayFifthFeatures["fifth-orthodontics-right"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Braces aria-hidden="true" /></span>
              <strong>{xrayFifthFeatures["fifth-orthodontics-right"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fifth-hotspot--preliminary-exam"
              onClick={() => setMainSceneFeature("fifth-preliminary-exam")}
              aria-label={xrayFifthFeatures["fifth-preliminary-exam"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><ClipboardCheck aria-hidden="true" /></span>
              <strong>{xrayFifthFeatures["fifth-preliminary-exam"].shortLabel}</strong>
            </button>
          </div>
        )}

        {activeScene === "khamis-lobby-side" && (
          <div className="sd-khamis-side-controls sd-conference-image-coordinates" aria-label="نقطة الاستراحة والعودة إلى بداية القسم">
            <button
              type="button"
              className="sd-corridor-hotspot sd-khamis-side-hotspot--lounge"
              onClick={() => setMainSceneFeature("khamis-side-lounge")}
              aria-label={khamisLobbySideFeatures["khamis-side-lounge"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Armchair aria-hidden="true" /></span>
              <strong>{khamisLobbySideFeatures["khamis-side-lounge"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-khamis-side-return"
              onClick={returnToTourStartFromKhamisLobby}
              disabled={sceneTransitioning}
              aria-label="العودة إلى الصورة الأولى وبداية القسم"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">بداية القسم</span>
            </button>
          </div>
        )}

        <ConferenceLayoutEditor rootRef={rootRef} activeScene={activeScene} />

        {mainSceneFeature && (
          <div
            ref={mainFeatureDialogRef}
            className={`sd-main-feature is-${mainSceneFeature}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sd-main-feature-title"
            tabIndex={-1}
            onClick={(event) => {
              if (event.target === event.currentTarget) closeMainSceneFeature();
            }}
          >
            <article className="sd-main-feature__panel">
              <button
                type="button"
                className="sd-main-feature__close"
                onClick={closeMainSceneFeature}
                aria-label="إغلاق النافذة"
              >
                <X aria-hidden="true" />
              </button>

              <Image
                className="sd-main-feature__logo"
                src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
                alt="سعودي دنت"
                width={4096}
                height={1139}
                unoptimized
              />

              {mainSceneFeature === "lounge" && (
                <div className="sd-main-feature__lounge-image">
                  <Image
                    src="/assets/branches/khamis-mushait/tour/saudident-lounge.webp"
                    alt="استراحة سعودي دنت"
                    fill
                    sizes="(max-width: 800px) 88vw, 680px"
                    unoptimized
                  />
                </div>
              )}

              {mainSceneFeature === "women-lounge" && (
                <div className="sd-main-feature__women-lounge-image">
                  <Image
                    src="/assets/branches/khamis-mushait/tour/saudident-women-lounge.webp"
                    alt="استراحة النساء في سعودي دنت"
                    fill
                    sizes="(max-width: 800px) 88vw, 700px"
                    unoptimized
                  />
                </div>
              )}

              {mainSceneFeature === "sterilization" && (
                <div className="sd-main-feature__sterilization-gallery" aria-label="صور قسم التعقيم في سعودي دنت">
                  <div>
                    <Image
                      src="/assets/branches/khamis-mushait/tour/saudident-sterilization-wide.webp"
                      alt="قسم التعقيم في سعودي دنت"
                      fill
                      sizes="(max-width: 800px) 84vw, 340px"
                      unoptimized
                    />
                  </div>
                  <div>
                    <Image
                      src="/assets/branches/khamis-mushait/tour/saudident-sterilization-close.webp"
                      alt="تجهيز الأدوات داخل قسم التعقيم"
                      fill
                      sizes="(max-width: 800px) 84vw, 340px"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {mainSceneFeature === "prayer-room" && (
                <div className="sd-main-feature__prayer-image">
                  <Image
                    src="/assets/branches/khamis-mushait/tour/saudident-prayer-room.webp"
                    alt="مصلى سعودي دنت"
                    fill
                    sizes="(max-width: 800px) 88vw, 700px"
                    unoptimized
                  />
                </div>
              )}

              <div className="sd-main-feature__symbol" aria-hidden="true">
                {mainSceneFeature === "welcome" && <CalendarCheck2 />}
                {mainSceneFeature === "lounge" && <Armchair />}
                {mainSceneFeature === "clinic" && <Stethoscope />}
                {(mainSceneFeature === "corridor-clinic-near" ||
                  mainSceneFeature === "corridor-clinic-mid" ||
                  mainSceneFeature === "corridor-clinic-far") && <Stethoscope />}
                {mainSceneFeature === "equipment" && <Wrench />}
                {mainSceneFeature === "sterilization" && <ShieldCheck />}
                {mainSceneFeature === "prayer-room" && <MoonStar />}
                {mainSceneFeature === "meeting-room" && <UsersRound />}
                {mainSceneFeature === "central-radiology" && <Radiation />}
                {mainSceneFeature === "xray-clinic" && <Stethoscope />}
                {mainSceneFeature === "women-lounge" && <Armchair />}
                {mainSceneFeature === "administrative-office" && <Building2 />}
                {mainSceneFeature === "left-reception-desk" && <CalendarCheck2 />}
                {(mainSceneFeature === "next-clinic-left" ||
                  mainSceneFeature === "next-clinic-center" ||
                  mainSceneFeature === "next-clinic-right") && <Stethoscope />}
                {activeXrayThirdFeature?.icon === "lounge" && <Armchair />}
                {activeXrayThirdFeature?.icon === "clinic" && <Stethoscope />}
                {activeXrayFourthFeature && <Headphones />}
                {activeXrayFifthFeature?.icon === "orthodontics" && <Braces />}
                {activeXrayFifthFeature?.icon === "exam" && <ClipboardCheck />}
                {activeKhamisLobbySideFeature?.icon === "lounge" && <Armchair />}
                {activeReceptionHallFeature?.icon === "reception" && <CalendarCheck2 />}
                {activeReceptionHallFeature?.icon === "patient-relations" && <HeartHandshake />}
                {activeReceptionHallFeature?.icon === "lounge" && <Armchair />}
                {activeReceptionHallFeature?.icon === "clinic" && <Stethoscope />}
              </div>

              {mainSceneFeature === "welcome" && (
                <>
                  <p className="sd-main-feature__eyebrow">أهلًا بك في سعودي دنت</p>
                  <h2 id="sd-main-feature-title">رحلتك تبدأ بسهولة</h2>
                  <p className="sd-main-feature__message">
                    من الاستقبال تبدأ تجربة صُممت لراحتك بحجز مرن وخطوات واضحة وفريق يوصلك إلى التخصص الأنسب بين خدمات سعودي دنت المتكاملة لتبدأ ابتسامتك بثقة من اللحظة الأولى
                  </p>
                  <div className="sd-main-feature__benefits" aria-label="مزايا تجربة سعودي دنت">
                    <span>حجز أسهل</span>
                    <span>تخصصات متنوعة</span>
                    <span>اهتمام مستمر</span>
                  </div>
                </>
              )}

              {mainSceneFeature === "administrative-office" && (
                <>
                  <p className="sd-main-feature__eyebrow">{administrativeOfficeFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{administrativeOfficeFeature.title}</h2>
                  <p className="sd-main-feature__message">{administrativeOfficeFeature.message}</p>
                </>
              )}

              {mainSceneFeature === "left-reception-desk" && (
                <>
                  <p className="sd-main-feature__eyebrow">{leftReceptionFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{leftReceptionFeature.title}</h2>
                  <p className="sd-main-feature__message">{leftReceptionFeature.message}</p>
                </>
              )}

              {activeReceptionHallFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeReceptionHallFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeReceptionHallFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeReceptionHallFeature.message}</p>
                </>
              )}

              {mainSceneFeature === "lounge" && (
                <>
                  <p className="sd-main-feature__eyebrow">مساحة صُممت لراحتك</p>
                  <h2 id="sd-main-feature-title">حتى لحظات الانتظار لها عناية</h2>
                  <p className="sd-main-feature__message">
                    في سعودي دنت نؤمن أن راحتك جزء من علاجك لذلك صممنا الاستراحة لتمنحك هدوءًا يسبق ابتسامتك
                  </p>
                </>
              )}

              {mainSceneFeature === "clinic" && (
                <>
                  <p className="sd-main-feature__eyebrow">خلف هذا الباب</p>
                  <h2 id="sd-main-feature-title">تبدأ خطوة تصنع فرقًا</h2>
                  <p className="sd-main-feature__message">
                    كل عيادة في سعودي دنت تجمع خبرة التخصص ودقة التقنية واهتمامًا يراك إنسانًا قبل أن يراك حالة لأن أجمل النتائج تبدأ بثقة وطمأنينة
                  </p>
                </>
              )}

              {mainSceneFeature === "corridor-clinic-near" && (
                <>
                  <p className="sd-main-feature__eyebrow">هنا تبدأ الطمأنينة</p>
                  <h2 id="sd-main-feature-title">عيادة ترى التفاصيل التي تهمك</h2>
                  <p className="sd-main-feature__message">
                    في سعودي دنت نصغي لك أولًا ثم نصنع خطة عناية واضحة تمنحك الثقة في كل خطوة من رحلتك
                  </p>
                </>
              )}

              {mainSceneFeature === "corridor-clinic-mid" && (
                <>
                  <p className="sd-main-feature__eyebrow">لكل ابتسامة قصتها</p>
                  <h2 id="sd-main-feature-title">عناية تناسبك أنت</h2>
                  <p className="sd-main-feature__message">
                    خبرة التخصص ودقة التقنية تجتمعان هنا لتكون تجربتك أكثر راحة ونتيجتك أقرب لما تتطلع إليه
                  </p>
                </>
              )}

              {mainSceneFeature === "corridor-clinic-far" && (
                <>
                  <p className="sd-main-feature__eyebrow">خطوة أقرب إلى ابتسامتك</p>
                  <h2 id="sd-main-feature-title">الثقة تبدأ من قرار مطمئن</h2>
                  <p className="sd-main-feature__message">
                    خلف هذا الباب تبدأ رحلة تهتم براحتك وتحفظ خصوصيتك وتمنح كل تفصيلة من ابتسامتك ما تستحقه
                  </p>
                </>
              )}

              {mainSceneFeature === "equipment" && (
                <>
                  <p className="sd-main-feature__eyebrow">جاهزية تصنع الفرق</p>
                  <h2 id="sd-main-feature-title">العناية تبدأ من التفاصيل</h2>
                  <p className="sd-main-feature__message">
                    في سعودي دنت نعتني بجاهزية كل جهاز ومساحة لتصل إليك التجربة كما تستحقها بثقة وهدوء
                  </p>
                </>
              )}

              {mainSceneFeature === "sterilization" && (
                <>
                  <p className="sd-main-feature__eyebrow">خلف كل ابتسامة آمنة</p>
                  <h2 id="sd-main-feature-title">التعقيم معيار لا يقبل التهاون</h2>
                  <p className="sd-main-feature__message">
                    في سعودي دنت تمر الأدوات عبر عناية دقيقة ومنظمة لأن سلامتك تبدأ قبل دخولك إلى العيادة
                  </p>
                </>
              )}

              {mainSceneFeature === "prayer-room" && (
                <>
                  <p className="sd-main-feature__eyebrow">مساحة للسكينة</p>
                  <h2 id="sd-main-feature-title">لحظة هدوء تكتمل بها عنايتك</h2>
                  <p className="sd-main-feature__message">
                    في سعودي دنت نهتم براحتك في كل تفاصيل يومك لذلك هيأنا مصلى يمنحك الخصوصية والطمأنينة بين خطوات رحلتك
                  </p>
                </>
              )}

              {mainSceneFeature === "meeting-room" && (
                <>
                  <p className="sd-main-feature__eyebrow">حيث تلتقي الخبرات</p>
                  <h2 id="sd-main-feature-title">أفكارنا تبدأ من هدف واحد</h2>
                  <p className="sd-main-feature__message">
                    في سعودي دنت نجتمع لنصنع قرارات أفضل وتجارب أرقى لأن كل تطوير يبدأ بفريق يؤمن أن ابتسامتك تستحق المزيد
                  </p>
                </>
              )}

              {mainSceneFeature === "central-radiology" && (
                <>
                  <p className="sd-main-feature__eyebrow">دقة تكشف التفاصيل</p>
                  <h2 id="sd-main-feature-title">الأشعة المركزية بداية تشخيص أوضح</h2>
                  <p className="sd-main-feature__message">
                    هنا تبدأ الصورة التي تساعد فريقنا على فهم حالتك بدقة أكبر وبناء خطوات علاج واضحة تناسب احتياجك
                  </p>
                </>
              )}

              {mainSceneFeature === "xray-clinic" && (
                <>
                  <p className="sd-main-feature__eyebrow">عناية تلتقي بالخبرة</p>
                  <h2 id="sd-main-feature-title">كل زيارة تبدأ بفهم احتياجك</h2>
                  <p className="sd-main-feature__message">
                    في هذه العيادة نمنحك الوقت والاهتمام لتكون خطتك أوضح وتجربتك أكثر راحة من أول خطوة حتى اكتمال العناية
                  </p>
                </>
              )}

              {mainSceneFeature === "women-lounge" && (
                <>
                  <p className="sd-main-feature__eyebrow">خصوصية وراحة</p>
                  <h2 id="sd-main-feature-title">استراحة النساء مساحة لهدوئك</h2>
                  <p className="sd-main-feature__message">
                    مساحة مستقلة ومريحة تمنحك الخصوصية والهدوء لتكون لحظات انتظارك جزءًا لطيفًا من تجربتك في سعودي دنت
                  </p>
                </>
              )}

              {mainSceneFeature === "next-clinic-left" && (
                <>
                  <p className="sd-main-feature__eyebrow">اهتمام يبدأ بالاستماع</p>
                  <h2 id="sd-main-feature-title">مساحتك الآمنة لطرح كل سؤال</h2>
                  <p className="sd-main-feature__message">
                    نبدأ بفهم ما يشغلك ونشرح لك الخيارات بهدوء لتدخل كل خطوة وأنت تعرف ما ينتظرك وتشعر بالاطمئنان
                  </p>
                </>
              )}

              {mainSceneFeature === "next-clinic-center" && (
                <>
                  <p className="sd-main-feature__eyebrow">قرار علاجي بثقة</p>
                  <h2 id="sd-main-feature-title">نحو نتيجة ترسمها التفاصيل</h2>
                  <p className="sd-main-feature__message">
                    نقرأ تفاصيل حالتك بعناية ونرتب الأولويات لنصنع مسارًا علاجيًا متوازنًا يجمع الوضوح والراحة
                  </p>
                </>
              )}

              {mainSceneFeature === "next-clinic-right" && (
                <>
                  <p className="sd-main-feature__eyebrow">رعاية تستمر معك</p>
                  <h2 id="sd-main-feature-title">المتابعة جزء من جودة النتيجة</h2>
                  <p className="sd-main-feature__message">
                    اهتمامنا لا يتوقف عند الإجراء بل يمتد إلى متابعة تطورك والإجابة عن احتياجك حتى تكتمل رحلتك بثقة
                  </p>
                </>
              )}

              {activeXrayThirdFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeXrayThirdFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeXrayThirdFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeXrayThirdFeature.message}</p>
                </>
              )}

              {activeXrayFourthFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeXrayFourthFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeXrayFourthFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeXrayFourthFeature.message}</p>
                </>
              )}

              {activeXrayFifthFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeXrayFifthFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeXrayFifthFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeXrayFifthFeature.message}</p>
                </>
              )}

              {activeKhamisLobbySideFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeKhamisLobbySideFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeKhamisLobbySideFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeKhamisLobbySideFeature.message}</p>
                </>
              )}
            </article>
          </div>
        )}

        {patientRelationsOpen && (
          <div
            ref={patientDialogRef}
            className="sd-patient-relations"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sd-patient-relations-title"
            tabIndex={-1}
            onClick={(event) => {
              if (event.target === event.currentTarget) closePatientRelations();
            }}
          >
            <article className="sd-patient-relations__panel">
              <button
                type="button"
                className="sd-patient-relations__close"
                onClick={closePatientRelations}
                aria-label="إغلاق نافذة علاقات المرضى"
              >
                <X aria-hidden="true" />
              </button>

              <Image
                className="sd-patient-relations__logo"
                src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
                alt="سعودي دنت"
                width={4096}
                height={1139}
                unoptimized
              />

              <div className="sd-patient-relations__symbol" aria-hidden="true">
                <HeartHandshake />
              </div>

              <p className="sd-patient-relations__eyebrow">هنا يبدأ الاهتمام</p>
              <h2 id="sd-patient-relations-title">صوتك مسموع… ورحلتك تهمّنا</h2>
              <p className="sd-patient-relations__message">
                لأن تجربتك معنا تبدأ قبل العلاج وتستمر بعده، وُجدت علاقات المرضى لتكون صوتك الأقرب؛
                نستمع لك، نتابع تجربتك، ونضمن أن تصل ملاحظتك باهتمام وخصوصية تليق بثقتك
              </p>
              <span className="sd-patient-relations__signature">علاقات المرضى — بالقرب منك دائمًا</span>
            </article>
          </div>
        )}
      </main>

      {!openingComplete && (
        <section className="sd-screen-opening" aria-label="افتتاحية سعودي دنت">
          <div className="sd-screen-opening__copy">
            <p className="sd-screen-opening__line sd-screen-opening__line--first">
              الابتسامة لا تبدأ من الأسنان
            </p>
            <p className="sd-screen-opening__line sd-screen-opening__line--second">
              تبدأ من <span>الثقة</span> بمن يعالجها
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
