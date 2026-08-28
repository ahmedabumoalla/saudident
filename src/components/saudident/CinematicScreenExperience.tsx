"use client";

import Image from "next/image";
import { Armchair, Building2, CalendarCheck2, ClipboardCheck, Headphones, HeartHandshake, House, Maximize2, Minimize2, MoonStar, Play, Radiation, ShieldCheck, Stethoscope, UsersRound, Wrench, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { AbhaTourExperience } from "@/components/saudident/AbhaTourExperience";
import { ConferenceLayoutEditor } from "@/components/saudident/ConferenceLayoutEditor";
import { AUTOMATIC_TOUR_TIMING, getKhamisFeatureDwellMs, KHAMIS_AUTOMATIC_TOUR, type AutomaticKhamisFeature } from "@/data/automatic-tour";
import { administrativeOfficeFeature, doctors, implantCorridorFeatures, implantUnitLobbyFeatures, khamisLobbySideFeatures, leftReceptionFeature, receptionHallFeatures, receptionRightCorridorFeatures, receptionRightLobbyFeatures, xrayFifthFeatures, xrayFourthFeatures, xrayThirdFeatures, type ImplantCorridorFeatureId, type ImplantUnitLobbyFeatureId, type KhamisLobbySideFeatureId, type ReceptionHallFeatureId, type ReceptionRightCorridorFeatureId, type ReceptionRightLobbyFeatureId, type SaudiDentDoctor, type XrayFifthFeatureId, type XrayFourthFeatureId, type XrayThirdFeatureId } from "@/data/saudident";
import { gsap, useGSAP } from "@/lib/gsap";
import { SAUDIDENT_LOGOS } from "@/lib/brand";
import { playCinematicDialogEntrance, playCinematicDialogExit } from "@/lib/cinematic-dialog-motion";

const NAVIGATION_KEYS = new Set(["ArrowDown", "PageDown", " "]);
const CINEMATIC_IDLE_MS = 4600;

function isCinematicRequested() {
  return typeof window === "undefined"
    || new URLSearchParams(window.location.search).get("cinematic") !== "0";
}

function subscribeToCinematicRequest() {
  return () => undefined;
}

type ConferenceScene = "hall" | "left-lobby" | "left-reception" | "reception-hall" | "implant-corridor" | "implant-unit-lobby" | "reception-right-corridor" | "reception-right-lobby" | "reception" | "main-reception" | "clinic-corridor" | "prayer-corridor" | "xray-corridor" | "xray-corridor-next" | "xray-corridor-third" | "xray-corridor-fourth" | "xray-corridor-fifth" | "khamis-lobby-side";

const KHAMIS_LEFT_SECTION: ConferenceScene[] = [
  "left-lobby",
  "left-reception",
  "reception-hall",
  "implant-corridor",
  "implant-unit-lobby",
  "reception-right-corridor",
  "reception-right-lobby",
];

const KHAMIS_RIGHT_SECTION: ConferenceScene[] = [
  "reception",
  "main-reception",
  "clinic-corridor",
  "prayer-corridor",
  "xray-corridor",
  "xray-corridor-next",
  "xray-corridor-third",
  "xray-corridor-fourth",
  "xray-corridor-fifth",
  "khamis-lobby-side",
];

function getKhamisSceneCounter(scene: ConferenceScene) {
  const leftIndex = KHAMIS_LEFT_SECTION.indexOf(scene);
  if (leftIndex >= 0) return { current: leftIndex + 1, total: KHAMIS_LEFT_SECTION.length };
  const rightIndex = KHAMIS_RIGHT_SECTION.indexOf(scene);
  if (rightIndex >= 0) return { current: rightIndex + 1, total: KHAMIS_RIGHT_SECTION.length };
  return null;
}
type BranchView = "choice" | "khamis" | "abha";
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
  | ImplantCorridorFeatureId
  | ImplantUnitLobbyFeatureId
  | ReceptionRightCorridorFeatureId
  | ReceptionRightLobbyFeatureId
  | KhamisLobbySideFeatureId;

type AutomaticKhamisRoute = ReadonlyArray<{
  readonly scene: ConferenceScene;
  readonly features: readonly AutomaticKhamisFeature[];
}>;

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

function isImplantCorridorFeature(feature: MainSceneFeature | null): feature is ImplantCorridorFeatureId {
  return feature !== null && feature in implantCorridorFeatures;
}

function isImplantUnitLobbyFeature(feature: MainSceneFeature | null): feature is ImplantUnitLobbyFeatureId {
  return feature !== null && feature in implantUnitLobbyFeatures;
}

function isReceptionRightCorridorFeature(feature: MainSceneFeature | null): feature is ReceptionRightCorridorFeatureId {
  return feature !== null && feature in receptionRightCorridorFeatures;
}

function isReceptionRightLobbyFeature(feature: MainSceneFeature | null): feature is ReceptionRightLobbyFeatureId {
  return feature !== null && feature in receptionRightLobbyFeatures;
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

function DentalImplantIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M7.2 4.7c0-1.25 1.02-2.27 2.27-2.27h5.06c1.25 0 2.27 1.02 2.27 2.27v1.65c0 1.4-1.14 2.54-2.54 2.54H9.74A2.54 2.54 0 0 1 7.2 6.35Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 8.9h4.5l-.85 9.18L12 21.55l-1.4-3.47Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 11.2h4.2M10.1 13.45h3.8M10.3 15.7h3.4M10.52 17.95h2.96" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
    </svg>
  );
}

export function CinematicScreenExperience() {
  const cinematicEnabled = useSyncExternalStore(subscribeToCinematicRequest, isCinematicRequested, () => true);
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const branchTimelineRef = useRef<gsap.core.Animation | null>(null);
  const sceneTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const patientDialogRef = useRef<HTMLDivElement>(null);
  const mainFeatureDialogRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const activeSceneRef = useRef<ConferenceScene>("hall");
  const automaticTourSessionRef = useRef(0);
  const automaticTourWaitRef = useRef<number | null>(null);
  const automaticTourActiveRef = useRef(false);
  const [openingComplete, setOpeningComplete] = useState(false);
  const [branchView, setBranchView] = useState<BranchView>("choice");
  const [branchTransitioning, setBranchTransitioning] = useState(false);
  const [activeScene, setActiveScene] = useState<ConferenceScene>("hall");
  const [sceneTransitioning, setSceneTransitioning] = useState(false);
  const [patientRelationsOpen, setPatientRelationsOpen] = useState(false);
  const [mainSceneFeature, setMainSceneFeature] = useState<MainSceneFeature | null>(null);
  const [layoutEditing, setLayoutEditing] = useState(false);
  const [chromeIdle, setChromeIdle] = useState(false);
  const [fullscreenAvailable, setFullscreenAvailable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [automaticTourActive, setAutomaticTourActive] = useState(false);
  const [automaticTourStatus, setAutomaticTourStatus] = useState("جولة فرع خميس مشيط");
  const activeXrayThirdFeature = isXrayThirdFeature(mainSceneFeature) ? xrayThirdFeatures[mainSceneFeature] : null;
  const activeXrayFourthFeature = isXrayFourthFeature(mainSceneFeature) ? xrayFourthFeatures[mainSceneFeature] : null;
  const activeXrayFifthFeature = isXrayFifthFeature(mainSceneFeature) ? xrayFifthFeatures[mainSceneFeature] : null;
  const activeKhamisLobbySideFeature = isKhamisLobbySideFeature(mainSceneFeature) ? khamisLobbySideFeatures[mainSceneFeature] : null;
  const activeReceptionHallFeature = isReceptionHallFeature(mainSceneFeature) ? receptionHallFeatures[mainSceneFeature] : null;
  const activeImplantCorridorFeature = isImplantCorridorFeature(mainSceneFeature) ? implantCorridorFeatures[mainSceneFeature] : null;
  const activeImplantUnitLobbyFeature = isImplantUnitLobbyFeature(mainSceneFeature) ? implantUnitLobbyFeatures[mainSceneFeature] : null;
  const activeReceptionRightCorridorFeature = isReceptionRightCorridorFeature(mainSceneFeature) ? receptionRightCorridorFeatures[mainSceneFeature] : null;
  const activeReceptionRightLobbyFeature = isReceptionRightLobbyFeature(mainSceneFeature) ? receptionRightLobbyFeatures[mainSceneFeature] : null;
  const khamisSceneCounter = getKhamisSceneCounter(activeScene);
  const khamisPaginationScenes = KHAMIS_LEFT_SECTION.includes(activeScene)
    ? KHAMIS_LEFT_SECTION
    : KHAMIS_RIGHT_SECTION.includes(activeScene)
      ? KHAMIS_RIGHT_SECTION
      : null;

  const handleLayoutEditingChange = useCallback((active: boolean) => {
    setLayoutEditing(active);
    setChromeIdle(false);
  }, []);

  const jumpToKhamisScene = useCallback((destination: ConferenceScene) => {
    if (sceneTransitioning || destination === activeSceneRef.current) return;

    const root = rootRef.current;
    const scenes = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-scene"))
      : [];
    const destinationScene = root?.querySelector<HTMLElement>(`.sd-conference-scene--${destination}`);
    const transitionLight = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    if (!destinationScene) return;

    sceneTimelineRef.current?.kill();
    gsap.set(scenes, {
      autoAlpha: 0,
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      filter: "blur(0px)",
    });
    gsap.set(destinationScene, { autoAlpha: 1 });
    if (transitionLight) gsap.set(transitionLight, { autoAlpha: 0 });
    setMainSceneFeature(null);
    activeSceneRef.current = destination;
    setActiveScene(destination);
  }, [sceneTransitioning]);

  useEffect(() => {
    activeSceneRef.current = activeScene;
  }, [activeScene]);

  const isAutomaticTourSession = useCallback((session: number) => (
    automaticTourActiveRef.current && automaticTourSessionRef.current === session
  ), []);

  const waitForAutomaticTour = useCallback((session: number, duration: number) => new Promise<boolean>((resolve) => {
    if (!isAutomaticTourSession(session)) {
      resolve(false);
      return;
    }

    const timer = window.setTimeout(() => {
      automaticTourWaitRef.current = null;
      resolve(isAutomaticTourSession(session));
    }, duration);
    automaticTourWaitRef.current = timer;
  }), [isAutomaticTourSession]);

  const transitionToKhamisSceneForAutomaticTour = useCallback((session: number, destination: ConferenceScene) => new Promise<boolean>((resolve) => {
    if (!isAutomaticTourSession(session)) {
      resolve(false);
      return;
    }

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(`.sd-conference-scene--${activeSceneRef.current}`);
    const nextScene = root?.querySelector<HTMLElement>(`.sd-conference-scene--${destination}`);
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const allScenes = root ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-scene")) : [];
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      activeSceneRef.current = destination;
      setActiveScene(destination);
      setSceneTransitioning(false);
      resolve(isAutomaticTourSession(session));
    };
    const cancel = () => {
      if (settled) return;
      settled = true;
      setSceneTransitioning(false);
      resolve(false);
    };

    setMainSceneFeature(null);
    setPatientRelationsOpen(false);

    if (!nextScene || !currentScene || activeSceneRef.current === destination || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(allScenes, { autoAlpha: 0, xPercent: 0, yPercent: 0, scale: 1, filter: "blur(0px)" });
      if (nextScene) gsap.set(nextScene, { autoAlpha: 1 });
      finish();
      return;
    }

    setSceneTransitioning(true);
    sceneTimelineRef.current?.kill();
    gsap.set(nextScene, {
      autoAlpha: 0,
      xPercent: 3,
      scale: 1.075,
      filter: "blur(10px) brightness(0.8)",
      transformOrigin: "50% 62%",
    });

    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: finish,
      onInterrupt: cancel,
    });
    sceneTimelineRef.current = timeline;
    timeline
      .to(currentScene, { autoAlpha: 0, scale: 1.045, filter: "blur(6px) brightness(0.78)", duration: 0.62, ease: "power2.inOut" }, 0)
      .to(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px) brightness(1)", duration: 0.92, ease: "power3.out" }, 0.28);
    if (lightSweep) {
      timeline
        .fromTo(lightSweep, { autoAlpha: 0, xPercent: 72 }, { autoAlpha: 0.58, xPercent: -72, duration: 0.76, ease: "power2.inOut" }, 0.1)
        .to(lightSweep, { autoAlpha: 0, duration: 0.28, ease: "power2.out" }, 0.66);
    }
  }), [isAutomaticTourSession]);

  useEffect(() => {
    const syncFullscreenState = () => {
      setFullscreenAvailable(Boolean(document.fullscreenEnabled && rootRef.current?.requestFullscreen));
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };

    syncFullscreenState();
    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current;
    if (!root || !document.fullscreenEnabled) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await root.requestFullscreen({ navigationUI: "hide" });
      }
    } catch (error) {
      console.error("تعذر تغيير وضع ملء الشاشة", error);
    }
  }, []);

  useEffect(() => {
    if (!cinematicEnabled || !openingComplete || branchView === "choice" || layoutEditing) return;
    let timer = window.setTimeout(() => setChromeIdle(true), CINEMATIC_IDLE_MS);
    const wakeChrome = () => {
      setChromeIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setChromeIdle(true), CINEMATIC_IDLE_MS);
    };
    window.addEventListener("pointerdown", wakeChrome, { passive: true });
    window.addEventListener("pointermove", wakeChrome, { passive: true });
    window.addEventListener("touchstart", wakeChrome, { passive: true });
    window.addEventListener("keydown", wakeChrome);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", wakeChrome);
      window.removeEventListener("pointermove", wakeChrome);
      window.removeEventListener("touchstart", wakeChrome);
      window.removeEventListener("keydown", wakeChrome);
    };
  }, [branchView, cinematicEnabled, layoutEditing, openingComplete]);

  const showBranchChoice = useCallback(() => {
    if (branchTransitioning) return;
    const root = rootRef.current;
    const currentTour = root?.querySelector<HTMLElement>(
      branchView === "abha" ? ".sd-abha-tour" : ".sd-screen-presentation__blank",
    );
    const finish = () => {
      branchTimelineRef.current = null;
      if (currentTour) gsap.set(currentTour, { autoAlpha: 0, clearProps: "filter,transform,clipPath" });
      setBranchView("choice");
      setBranchTransitioning(false);
    };

    setBranchTransitioning(true);
    if (!currentTour || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    branchTimelineRef.current = gsap.to(currentTour, {
      autoAlpha: 0,
      scale: 1.045,
      filter: "blur(10px) brightness(0.7)",
      clipPath: "inset(3% 3% 3% 3% round 28px)",
      duration: 0.82,
      ease: "power3.inOut",
      overwrite: "auto",
      onComplete: finish,
    });
  }, [branchTransitioning, branchView]);

  const openKhamisBranch = useCallback(() => {
    if (branchTransitioning) return;
    const root = rootRef.current;
    const choice = root?.querySelector<HTMLElement>(".sd-branch-choice");
    const selected = choice?.querySelector<HTMLElement>(".sd-branch-choice__option.is-khamis");
    const tour = root?.querySelector<HTMLElement>(".sd-screen-presentation__blank");
    const finish = () => {
      branchTimelineRef.current = null;
      if (tour) gsap.set(tour, { autoAlpha: 1, clearProps: "filter,transform,clipPath" });
      activeSceneRef.current = "hall";
      setActiveScene("hall");
      setBranchView("khamis");
      setBranchTransitioning(false);
    };

    setBranchTransitioning(true);
    if (!choice || !selected || !tour || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    gsap.set(tour, {
      autoAlpha: 0,
      scale: 1.1,
      filter: "blur(14px) brightness(0.65)",
      clipPath: "inset(8% 8% 8% 8% round 36px)",
    });
    branchTimelineRef.current = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish })
      .to(choice.querySelectorAll(".sd-branch-choice__option:not(.is-khamis)"), {
        autoAlpha: 0,
        y: -18,
        duration: 0.42,
        ease: "power2.in",
      }, 0)
      .to(selected, { scale: 1.035, filter: "brightness(1.08)", duration: 0.62, ease: "power2.inOut" }, 0)
      .to(choice, { autoAlpha: 0, duration: 0.62, ease: "power2.inOut" }, 0.28)
      .to(tour, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px) brightness(1)",
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        duration: 1.18,
        ease: "expo.out",
      }, 0.42);
  }, [branchTransitioning]);

  const openAbhaBranch = useCallback(() => {
    if (branchTransitioning) return;
    const root = rootRef.current;
    const choice = root?.querySelector<HTMLElement>(".sd-branch-choice");
    const selected = choice?.querySelector<HTMLElement>(".sd-branch-choice__option.is-abha");
    const finish = () => {
      branchTimelineRef.current = null;
      setBranchView("abha");
      setBranchTransitioning(false);
    };

    setBranchTransitioning(true);
    if (!choice || !selected || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    branchTimelineRef.current = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish })
      .to(choice.querySelectorAll(".sd-branch-choice__option:not(.is-abha)"), {
        autoAlpha: 0,
        y: -18,
        duration: 0.42,
        ease: "power2.in",
      }, 0)
      .to(selected, { scale: 1.035, filter: "brightness(1.08)", duration: 0.62, ease: "power2.inOut" }, 0)
      .to(choice, { autoAlpha: 0, filter: "blur(12px) brightness(0.62)", duration: 0.72, ease: "power3.inOut" }, 0.28);
  }, [branchTransitioning]);

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    const root = rootRef.current;
    if (root) {
      gsap.set(root.querySelector(".sd-screen-presentation__blank"), { autoAlpha: 0 });
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

  const openReceptionRightCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "reception-hall") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-hall");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-right-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-reception-hall-controls > *"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("reception-right-corridor");
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
    gsap.set(nextScene, { autoAlpha: 0, xPercent: 4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: -4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: 75 }, { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnFromReceptionRightCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "reception-right-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-right-corridor");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-hall");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-reception-right-corridor-controls > *"))
      : [];
    if (!currentScene || !previousScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("reception-hall");
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
    gsap.set(previousScene, { autoAlpha: 0, xPercent: -4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: 4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: -75 }, { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openReceptionRightLobby = useCallback(() => {
    if (sceneTransitioning || activeScene !== "reception-right-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-right-corridor");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-right-lobby");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-reception-right-corridor-controls > *"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("reception-right-lobby");
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
    gsap.set(nextScene, { autoAlpha: 0, xPercent: 4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: -4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: 75 }, { autoAlpha: 0.72, xPercent: -75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(nextScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const returnToReceptionRightCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "reception-right-lobby") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-right-lobby");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-right-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-reception-right-lobby-controls > *"))
      : [];
    if (!currentScene || !previousScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("reception-right-corridor");
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
    gsap.set(previousScene, { autoAlpha: 0, xPercent: -4, scale: 1.1, filter: "blur(12px)", transformOrigin: "50% 68%" });
    const transition = gsap.timeline({ defaults: { overwrite: "auto" }, onComplete: finish });
    sceneTimelineRef.current = transition;

    transition
      .to(controls, { autoAlpha: 0, scale: 1.04, duration: 0.25, ease: "power2.in" }, 0)
      .to(currentScene, { xPercent: 4, scale: 1.14, filter: "blur(7px)", transformOrigin: "50% 68%", duration: 1.05, ease: "power3.in" }, 0)
      .fromTo(lightSweep, { autoAlpha: 0, xPercent: -75 }, { autoAlpha: 0.72, xPercent: 75, duration: 0.92, ease: "power2.inOut" }, 0.28)
      .to(previousScene, { autoAlpha: 1, xPercent: 0, scale: 1, filter: "blur(0px)", duration: 1.28, ease: "power3.out" }, 0.5)
      .to(currentScene, { autoAlpha: 0, duration: 0.68, ease: "power2.inOut" }, 0.5)
      .to(lightSweep, { autoAlpha: 0, duration: 0.48, ease: "power2.out" }, 0.88);
  }, [activeScene, sceneTransitioning]);

  const openImplantCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "reception-hall") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-hall");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--implant-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-reception-hall-controls > *"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("implant-corridor");
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

  const returnToReceptionHall = useCallback(() => {
    if (sceneTransitioning || activeScene !== "implant-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--implant-corridor");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--reception-hall");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-implant-corridor-controls > *"))
      : [];
    if (!currentScene || !previousScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("reception-hall");
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

  const openImplantUnitLobby = useCallback(() => {
    if (sceneTransitioning || activeScene !== "implant-corridor") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--implant-corridor");
    const nextScene = root?.querySelector<HTMLElement>(".sd-conference-scene--implant-unit-lobby");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-implant-corridor-controls > *"))
      : [];
    if (!currentScene || !nextScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("implant-unit-lobby");
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

  const returnToImplantCorridor = useCallback(() => {
    if (sceneTransitioning || activeScene !== "implant-unit-lobby") return;

    const root = rootRef.current;
    const currentScene = root?.querySelector<HTMLElement>(".sd-conference-scene--implant-unit-lobby");
    const previousScene = root?.querySelector<HTMLElement>(".sd-conference-scene--implant-corridor");
    const lightSweep = root?.querySelector<HTMLElement>(".sd-conference-scene-transition");
    const controls = root
      ? Array.from(root.querySelectorAll<HTMLElement>(".sd-conference-back, .sd-implant-unit-lobby-controls > *"))
      : [];
    if (!currentScene || !previousScene || !lightSweep) return;

    const finish = () => {
      setActiveScene("implant-corridor");
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
    if (!overlay || !panel) {
      setPatientRelationsOpen(false);
      return;
    }
    playCinematicDialogExit(overlay, panel, () => setPatientRelationsOpen(false));
  }, []);

  const closeMainSceneFeature = useCallback(() => {
    const overlay = mainFeatureDialogRef.current;
    const panel = overlay?.querySelector<HTMLElement>(".sd-main-feature__panel");
    if (!overlay || !panel) {
      setMainSceneFeature(null);
      return;
    }
    playCinematicDialogExit(overlay, panel, () => setMainSceneFeature(null));
  }, []);

  const playAutomaticKhamisRoute = useCallback(async (
    session: number,
    route: AutomaticKhamisRoute,
    status: string,
  ) => {
    setAutomaticTourStatus(status);

    for (const step of route) {
      if (!await transitionToKhamisSceneForAutomaticTour(session, step.scene)) return false;
      if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.sceneArrivalMs)) return false;

      for (const feature of step.features) {
        if (!isAutomaticTourSession(session)) return false;
        if (feature === "patient-relations") {
          setPatientRelationsOpen(true);
        } else {
          setMainSceneFeature(feature);
        }

        if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.dialogEnterMs)) return false;
        if (!await waitForAutomaticTour(session, getKhamisFeatureDwellMs(feature))) return false;

        if (feature === "patient-relations") {
          closePatientRelations();
        } else {
          closeMainSceneFeature();
        }

        if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.dialogExitMs)) return false;
        if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.betweenFeaturesMs)) return false;
      }
    }

    return true;
  }, [closeMainSceneFeature, closePatientRelations, isAutomaticTourSession, transitionToKhamisSceneForAutomaticTour, waitForAutomaticTour]);

  const runAutomaticTour = useCallback(async (session: number) => {
    setAutomaticTourStatus("جولة فرع خميس مشيط — المسار الأيمن");
    openKhamisBranch();
    if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.branchTransitionMs)) return;

    if (!await playAutomaticKhamisRoute(
      session,
      KHAMIS_AUTOMATIC_TOUR.right,
      "جولة فرع خميس مشيط — المسار الأيمن",
    )) return;

    if (!await transitionToKhamisSceneForAutomaticTour(session, "hall")) return;
    if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.routeResetMs)) return;

    if (!await playAutomaticKhamisRoute(
      session,
      KHAMIS_AUTOMATIC_TOUR.left,
      "جولة فرع خميس مشيط — المسار الأيسر",
    )) return;

    if (!await transitionToKhamisSceneForAutomaticTour(session, "hall")) return;
    if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.sceneArrivalMs)) return;

    setAutomaticTourStatus("الانتقال إلى فرع أبها");
    showBranchChoice();
    if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.branchTransitionMs)) return;
    openAbhaBranch();
    if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.branchTransitionMs)) return;
    setAutomaticTourStatus("جولة فرع أبها");
  }, [openAbhaBranch, openKhamisBranch, playAutomaticKhamisRoute, showBranchChoice, transitionToKhamisSceneForAutomaticTour, waitForAutomaticTour]);

  const startAutomaticTour = useCallback(() => {
    if (automaticTourActiveRef.current || branchView !== "choice" || branchTransitioning || !openingComplete) return;

    if (automaticTourWaitRef.current !== null) {
      window.clearTimeout(automaticTourWaitRef.current);
      automaticTourWaitRef.current = null;
    }
    const session = ++automaticTourSessionRef.current;
    automaticTourActiveRef.current = true;
    setAutomaticTourActive(true);
    setMainSceneFeature(null);
    setPatientRelationsOpen(false);
    setAutomaticTourStatus("جولة فرع خميس مشيط — المسار الأيمن");
    void runAutomaticTour(session);
  }, [branchTransitioning, branchView, openingComplete, runAutomaticTour]);

  const finishAutomaticTour = useCallback(() => {
    if (!automaticTourActiveRef.current) return;
    const session = automaticTourSessionRef.current;
    setAutomaticTourStatus("اكتملت الجولة — العودة لاختيار الفرع");
    showBranchChoice();

    void (async () => {
      if (!await waitForAutomaticTour(session, AUTOMATIC_TOUR_TIMING.branchTransitionMs)) return;
      automaticTourActiveRef.current = false;
      setAutomaticTourActive(false);
      setAutomaticTourStatus("جولة فرع خميس مشيط");
    })();
  }, [showBranchChoice, waitForAutomaticTour]);

  const stopAutomaticTour = useCallback(() => {
    if (!automaticTourActiveRef.current) return;

    automaticTourActiveRef.current = false;
    automaticTourSessionRef.current += 1;
    if (automaticTourWaitRef.current !== null) {
      window.clearTimeout(automaticTourWaitRef.current);
      automaticTourWaitRef.current = null;
    }

    branchTimelineRef.current?.kill();
    branchTimelineRef.current = null;
    sceneTimelineRef.current?.kill();
    sceneTimelineRef.current = null;

    const root = rootRef.current;
    const branchChoice = root?.querySelector<HTMLElement>(".sd-branch-choice");
    const branchOptions = branchChoice
      ? Array.from(branchChoice.querySelectorAll<HTMLElement>(".sd-branch-choice__option"))
      : [];
    const khamisTour = root?.querySelector<HTMLElement>(".sd-screen-presentation__blank");

    if (branchChoice) {
      gsap.set(branchChoice, { autoAlpha: 1, clearProps: "filter,transform,clipPath" });
      gsap.set(branchOptions, { autoAlpha: 1, clearProps: "filter,transform" });
    }
    if (khamisTour) {
      gsap.set(khamisTour, { autoAlpha: 0, clearProps: "filter,transform,clipPath" });
    }

    activeSceneRef.current = "hall";
    setActiveScene("hall");
    setMainSceneFeature(null);
    setPatientRelationsOpen(false);
    setSceneTransitioning(false);
    setBranchTransitioning(false);
    setBranchView("choice");
    setChromeIdle(false);
    setAutomaticTourActive(false);
    setAutomaticTourStatus("جولة فرع خميس مشيط");
  }, []);

  useEffect(() => {
    if (!automaticTourActive) return;

    const stopOnInteraction = () => stopAutomaticTour();
    const passiveCaptureOptions: AddEventListenerOptions = { passive: true, capture: true };

    window.addEventListener("pointerdown", stopOnInteraction, passiveCaptureOptions);
    window.addEventListener("touchstart", stopOnInteraction, passiveCaptureOptions);

    return () => {
      window.removeEventListener("pointerdown", stopOnInteraction, true);
      window.removeEventListener("touchstart", stopOnInteraction, true);
    };
  }, [automaticTourActive, stopAutomaticTour]);

  useEffect(() => {
    if (!openingComplete || branchView !== "choice" || branchTransitioning || automaticTourActive) return;

    let idleTimer = window.setTimeout(startAutomaticTour, AUTOMATIC_TOUR_TIMING.idleBeforeStartMs);
    const restartIdleTimer = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(startAutomaticTour, AUTOMATIC_TOUR_TIMING.idleBeforeStartMs);
    };
    const passiveOptions: AddEventListenerOptions = { passive: true };

    window.addEventListener("pointerdown", restartIdleTimer, passiveOptions);
    window.addEventListener("pointermove", restartIdleTimer, passiveOptions);
    window.addEventListener("touchstart", restartIdleTimer, passiveOptions);
    window.addEventListener("wheel", restartIdleTimer, passiveOptions);
    window.addEventListener("keydown", restartIdleTimer);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("pointerdown", restartIdleTimer);
      window.removeEventListener("pointermove", restartIdleTimer);
      window.removeEventListener("touchstart", restartIdleTimer);
      window.removeEventListener("wheel", restartIdleTimer);
      window.removeEventListener("keydown", restartIdleTimer);
    };
  }, [automaticTourActive, branchTransitioning, branchView, openingComplete, startAutomaticTour]);

  useEffect(() => () => {
    automaticTourActiveRef.current = false;
    automaticTourSessionRef.current += 1;
    if (automaticTourWaitRef.current !== null) {
      window.clearTimeout(automaticTourWaitRef.current);
      automaticTourWaitRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    if (!patientRelationsOpen) return;
    const overlay = patientDialogRef.current;
    const panel = overlay?.querySelector<HTMLElement>(".sd-patient-relations__panel");
    if (!overlay || !panel) return;
    const motion = playCinematicDialogEntrance(overlay, panel);
    return () => {
      motion?.kill();
    };
  }, [patientRelationsOpen]);

  useLayoutEffect(() => {
    if (!mainSceneFeature) return;
    const overlay = mainFeatureDialogRef.current;
    const panel = overlay?.querySelector<HTMLElement>(".sd-main-feature__panel");
    if (!overlay || !panel) return;
    const motion = playCinematicDialogEntrance(overlay, panel);
    return () => {
      motion?.kill();
    };
  }, [mainSceneFeature]);

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
    const openingGlow = root.querySelector<HTMLElement>(".sd-screen-opening__glow");
    if (!opening || !blank || !firstCopy || !secondCopy || !finalCopy || !openingGlow) return;

    const openingTargets = [firstCopy, secondCopy, finalCopy, ...portraits, ...doctorInfo];
    const revealOrder = [portraits[1], portraits[0], portraits[2]].filter(
      (item): item is HTMLElement => Boolean(item),
    );

    const applyFinalState = () => {
      gsap.set(openingTargets, { autoAlpha: 0 });
      gsap.set(opening, { autoAlpha: 0, visibility: "hidden" });
      gsap.set(blank, { autoAlpha: 0 });
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
    gsap.set(openingTargets, { autoAlpha: 0 });
    gsap.set(openingGlow, { autoAlpha: 0, xPercent: 75 });

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
      .fromTo(openingGlow,
        { autoAlpha: 0, xPercent: 75 },
        { autoAlpha: 0.76, xPercent: -75, duration: 1.55, ease: "power2.inOut" },
        3.82,
      )
      .to(openingGlow, { autoAlpha: 0, duration: 0.72, ease: "power2.out" }, 4.78)
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
      .to(root.querySelector(".sd-screen-opening"), {
        filter: "blur(10px) brightness(1.08)",
        scale: 1.025,
        duration: 0.92,
        ease: "power3.in",
      }, 7.55)
      .to({}, { duration: 1.25 }, 7.55);

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
      className={`sd-screen-presentation${openingComplete ? " is-opening-complete" : " is-opening-active"}${cinematicEnabled ? " is-cinematic" : " is-cinematic-disabled"}${layoutEditing ? " is-calibrating" : ""}${branchTransitioning ? " is-branch-transitioning" : ""}${chromeIdle && !layoutEditing ? " is-chrome-idle" : ""}${automaticTourActive ? " is-automatic-tour" : ""}`}
      dir="rtl"
    >
      <div className="sd-screen-presentation__ambient" aria-hidden="true" />
      <div className="sd-cinematic-texture" aria-hidden="true" />

      {automaticTourActive && (
        <aside className="sd-automatic-tour-control" aria-live="polite">
          <span className="sd-automatic-tour-control__status">
            <i aria-hidden="true" />
            <span>{automaticTourStatus}</span>
          </span>
          <button
            type="button"
            onClick={stopAutomaticTour}
            aria-label="إيقاف الجولة التلقائية والعودة إلى اختيار الفرع"
          >
            <X aria-hidden="true" />
            <span>إيقاف الجولة</span>
          </button>
        </aside>
      )}

      {!automaticTourActive && fullscreenAvailable && (
        <button
          type="button"
          className="sd-fullscreen-control"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => void toggleFullscreen()}
          aria-label={isFullscreen ? "إنهاء عرض ملء الشاشة" : "عرض المنصة بملء الشاشة"}
          aria-pressed={isFullscreen}
          title={isFullscreen ? "إنهاء ملء الشاشة" : "عرض بملء الشاشة"}
        >
          {isFullscreen ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
          <span>{isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}</span>
        </button>
      )}

      <header className="sd-screen-presentation__brand">
        <span className="sd-screen-presentation__brand-logo">
          <Image
            {...SAUDIDENT_LOGOS.navy}
            alt="سعودي دنت"
            priority
            unoptimized
          />
        </span>
        <p>تجربة سعودي دنت التفاعلية</p>
      </header>

      <main
        className={`sd-screen-presentation__blank is-${activeScene}${sceneTransitioning ? " is-scene-transitioning" : ""}`}
        aria-label="جولة داخل سعودي دنت"
        aria-hidden={branchView !== "khamis"}
        inert={branchView !== "khamis" || automaticTourActive}
      >
        <div className="sd-conference-scene sd-conference-scene--hall" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--left-lobby" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--left-reception" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--reception-hall" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--implant-corridor" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--implant-unit-lobby" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--reception-right-corridor" aria-hidden="true" />
        <div className="sd-conference-scene sd-conference-scene--reception-right-lobby" aria-hidden="true" />
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

        {branchView === "khamis" && activeScene !== "hall" && (
          <button
            type="button"
            className="sd-khamis-tour__home"
            onClick={() => jumpToKhamisScene("hall")}
            disabled={sceneTransitioning}
            aria-label="العودة إلى الصورة الأولى في فرع خميس مشيط"
          >
            <House aria-hidden="true" />
            <span>الرئيسية</span>
          </button>
        )}

        {branchView === "khamis" && khamisSceneCounter && khamisPaginationScenes && (
          <nav
            className="sd-tour-pagination sd-khamis-tour-pagination"
            aria-label={`صور الجولة، الصورة الحالية ${khamisSceneCounter.current} من ${khamisSceneCounter.total}`}
          >
            {khamisPaginationScenes.map((scene, index) => (
              <button
                key={scene}
                type="button"
                className={scene === activeScene ? "is-active" : undefined}
                onClick={() => jumpToKhamisScene(scene)}
                disabled={sceneTransitioning}
                aria-label={`الانتقال إلى الصورة ${index + 1}`}
                aria-current={scene === activeScene ? "true" : undefined}
              />
            ))}
          </nav>
        )}

        {branchView === "khamis" && activeScene === "hall" && (
          <button
            type="button"
            className="sd-branch-choice-return"
            onClick={showBranchChoice}
            disabled={sceneTransitioning}
            aria-label="الرجوع لاختيار الفرع"
          >
            <Building2 aria-hidden="true" />
            <span>الرجوع لاختيار الفرع</span>
          </button>
        )}

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

        {(activeScene === "left-lobby" || activeScene === "left-reception" || activeScene === "reception-hall" || activeScene === "implant-corridor" || activeScene === "implant-unit-lobby" || activeScene === "reception-right-corridor" || activeScene === "reception-right-lobby" || activeScene === "reception" || activeScene === "main-reception" || activeScene === "clinic-corridor" || activeScene === "prayer-corridor" || activeScene === "xray-corridor" || activeScene === "xray-corridor-next" || activeScene === "xray-corridor-third" || activeScene === "xray-corridor-fourth" || activeScene === "xray-corridor-fifth" || activeScene === "khamis-lobby-side") && (
          <button
            key={`conference-back-${activeScene}`}
            type="button"
            className="sd-conference-back"
            onClick={
              activeScene === "reception-right-lobby"
                ? returnToReceptionRightCorridor
                : activeScene === "reception-right-corridor"
                  ? returnFromReceptionRightCorridor
                : activeScene === "implant-unit-lobby"
                  ? returnToImplantCorridor
                : activeScene === "implant-corridor"
                  ? returnToReceptionHall
                : activeScene === "reception-hall"
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
          <div className="sd-left-lobby-controls sd-conference-image-coordinates" aria-label="اتجاه الردهة وقسم الموارد البشرية">
            <button
              type="button"
              className="sd-conference-floor-arrow sd-left-lobby-forward"
              onClick={openLeftReception}
              disabled={sceneTransitioning}
              aria-label="الانتقال إلى الاستقبال"
            >
              <FloorRouteGuide />
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-left-lobby-hotspot--administration"
              onClick={() => setMainSceneFeature("administrative-office")}
              aria-label={administrativeOfficeFeature.ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><UsersRound aria-hidden="true" /></span>
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
            <button
              type="button"
              className="sd-conference-floor-arrow sd-reception-hall-arrow--left"
              onClick={openImplantCorridor}
              disabled={sceneTransitioning}
              aria-label="الانتقال إلى ممر وحدة زراعة الأسنان"
            >
              <FloorRouteGuide />
            </button>

            <button
              type="button"
              className="sd-conference-floor-arrow sd-reception-hall-arrow--right"
              onClick={openReceptionRightCorridor}
              disabled={sceneTransitioning}
              aria-label="الانتقال إلى الممر الأيمن"
            >
              <FloorRouteGuide />
            </button>

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

        {activeScene === "implant-corridor" && (
          <div className="sd-implant-corridor-controls sd-conference-image-coordinates" aria-label="مرافق ممر وحدة زراعة الأسنان">
            {(Object.entries(implantCorridorFeatures) as [ImplantCorridorFeatureId, (typeof implantCorridorFeatures)[ImplantCorridorFeatureId]][]).map(([featureId, feature]) => (
              <button
                key={featureId}
                type="button"
                className={`sd-corridor-hotspot sd-implant-corridor-hotspot--${featureId === "implant-corridor-clinic-right" ? "clinic-right" : feature.icon}`}
                onClick={feature.icon === "implant" ? openImplantUnitLobby : () => setMainSceneFeature(featureId)}
                disabled={sceneTransitioning}
                aria-label={feature.icon === "implant" ? "الانتقال إلى وحدة زراعة الأسنان" : feature.ariaLabel}
              >
                <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
                <span className="sd-corridor-hotspot__icon">
                  {feature.icon === "clinic" && <Stethoscope aria-hidden="true" />}
                  {feature.icon === "implant" && <DentalImplantIcon />}
                </span>
                <strong>{feature.shortLabel}</strong>
              </button>
            ))}
          </div>
        )}

        {activeScene === "implant-unit-lobby" && (
          <div className="sd-implant-unit-lobby-controls sd-conference-image-coordinates" aria-label="مرافق وحدة زراعة الأسنان">
            {(Object.entries(implantUnitLobbyFeatures) as [ImplantUnitLobbyFeatureId, (typeof implantUnitLobbyFeatures)[ImplantUnitLobbyFeatureId]][]).map(([featureId, feature]) => (
              <button
                key={featureId}
                type="button"
                className={`sd-corridor-hotspot sd-implant-unit-lobby-hotspot--${featureId.replace("implant-unit-", "")}`}
                onClick={() => setMainSceneFeature(featureId)}
                aria-label={feature.ariaLabel}
              >
                <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
                <span className="sd-corridor-hotspot__icon">
                  {feature.icon === "clinic" && <Stethoscope aria-hidden="true" />}
                  {feature.icon === "reception" && <CalendarCheck2 aria-hidden="true" />}
                  {feature.icon === "lounge" && <Armchair aria-hidden="true" />}
                </span>
                <strong>{feature.shortLabel}</strong>
              </button>
            ))}

            <button
              type="button"
              className="sd-implant-unit-lobby-return-to-hall"
              onClick={() => jumpToKhamisScene("reception-hall")}
              disabled={sceneTransitioning}
              aria-label="الرجوع إلى صالة الاستقبال وعلاقات المرضى"
            >
              <FloorRouteGuide />
            </button>
          </div>
        )}

        {activeScene === "reception-right-corridor" && (
          <div className="sd-reception-right-corridor-controls sd-conference-image-coordinates" aria-label="اتجاه وعيادات الممر الأيمن">
            <button
              type="button"
              className="sd-conference-floor-arrow sd-reception-right-corridor-forward"
              onClick={openReceptionRightLobby}
              disabled={sceneTransitioning}
              aria-label="الانتقال إلى صالة الممر"
            >
              <FloorRouteGuide />
            </button>

            {(Object.entries(receptionRightCorridorFeatures) as [ReceptionRightCorridorFeatureId, (typeof receptionRightCorridorFeatures)[ReceptionRightCorridorFeatureId]][]).map(([featureId, feature]) => (
              <button
                key={featureId}
                type="button"
                className={`sd-corridor-hotspot sd-reception-right-corridor-hotspot--${featureId.replace("reception-right-", "")}`}
                onClick={() => setMainSceneFeature(featureId)}
                aria-label={feature.ariaLabel}
              >
                <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
                <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
                <strong>{feature.shortLabel}</strong>
              </button>
            ))}
          </div>
        )}

        {activeScene === "reception-right-lobby" && (
          <div className="sd-reception-right-lobby-controls sd-conference-image-coordinates" aria-label="مرافق صالة الممر">
            {(Object.entries(receptionRightLobbyFeatures) as [ReceptionRightLobbyFeatureId, (typeof receptionRightLobbyFeatures)[ReceptionRightLobbyFeatureId]][]).map(([featureId, feature]) => (
              <button
                key={featureId}
                type="button"
                className={`sd-corridor-hotspot sd-reception-right-lobby-hotspot--${featureId.replace("reception-right-lobby-", "")}`}
                onClick={() => setMainSceneFeature(featureId)}
                aria-label={feature.ariaLabel}
              >
                <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
                <span className="sd-corridor-hotspot__icon">
                  {feature.icon === "clinic" && <Stethoscope aria-hidden="true" />}
                  {feature.icon === "lounge" && <Armchair aria-hidden="true" />}
                  {feature.icon === "reception" && <CalendarCheck2 aria-hidden="true" />}
                </span>
                <strong>{feature.shortLabel}</strong>
              </button>
            ))}

            <button
              type="button"
              className="sd-reception-right-lobby-return-to-hall"
              onClick={() => jumpToKhamisScene("reception-hall")}
              disabled={sceneTransitioning}
              aria-label="الرجوع إلى صالة الاستقبال وعلاقات المرضى"
            >
              <FloorRouteGuide />
            </button>
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
              <strong>المدير الطبي</strong>
            </button>

            <button
              type="button"
              className="sd-conference-forward"
              onClick={openMainReception}
              disabled={sceneTransitioning}
              aria-label="التقدم إلى المشهد التالي"
            >
              <FloorRouteGuide />
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
              <strong>قسم تقنية المعلومات</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-corridor-hotspot--sterilization"
              onClick={() => setMainSceneFeature("sterilization")}
              aria-label="فتح نافذة قسم التعقيم"
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><ShieldCheck aria-hidden="true" /></span>
              <strong>التعقيم المركزي</strong>
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
          <div className="sd-xray-fifth-controls sd-conference-image-coordinates" aria-label="نقاط العيادات والفحص الأولي">
            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fifth-hotspot--orthodontics-left"
              onClick={() => setMainSceneFeature("fifth-orthodontics-left")}
              aria-label={xrayFifthFeatures["fifth-orthodontics-left"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>{xrayFifthFeatures["fifth-orthodontics-left"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fifth-hotspot--orthodontics-center"
              onClick={() => setMainSceneFeature("fifth-orthodontics-center")}
              aria-label={xrayFifthFeatures["fifth-orthodontics-center"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
              <strong>{xrayFifthFeatures["fifth-orthodontics-center"].shortLabel}</strong>
            </button>

            <button
              type="button"
              className="sd-corridor-hotspot sd-xray-fifth-hotspot--orthodontics-right"
              onClick={() => setMainSceneFeature("fifth-orthodontics-right")}
              aria-label={xrayFifthFeatures["fifth-orthodontics-right"].ariaLabel}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><Stethoscope aria-hidden="true" /></span>
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

            <button
              type="button"
              className="sd-xray-fifth-return"
              onClick={returnToFourthXrayCorridor}
              disabled={sceneTransitioning}
              aria-label="الرجوع إلى الصورة السابقة"
            >
              <FloorRouteGuide />
              <span className="sd-floor-route__label" aria-hidden="true">رجوع</span>
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

        {branchView === "khamis" && !automaticTourActive && (
          <ConferenceLayoutEditor
            rootRef={rootRef}
            activeScene={activeScene}
            onEditingChange={handleLayoutEditingChange}
          />
        )}

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
                {...SAUDIDENT_LOGOS.navy}
                alt="سعودي دنت"
                unoptimized
              />

              {mainSceneFeature === "reception-right-lobby-reception" && (
                <div className="sd-main-feature__reception-image">
                  <Image
                    src={receptionRightLobbyFeatures["reception-right-lobby-reception"].image}
                    alt={receptionRightLobbyFeatures["reception-right-lobby-reception"].imageAlt}
                    fill
                    sizes="(max-width: 800px) 88vw, 700px"
                    unoptimized
                  />
                </div>
              )}

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
                {mainSceneFeature === "administrative-office" && <UsersRound />}
                {mainSceneFeature === "left-reception-desk" && <CalendarCheck2 />}
                {(mainSceneFeature === "next-clinic-left" ||
                  mainSceneFeature === "next-clinic-center" ||
                  mainSceneFeature === "next-clinic-right") && <Stethoscope />}
                {activeXrayThirdFeature?.icon === "lounge" && <Armchair />}
                {activeXrayThirdFeature?.icon === "clinic" && <Stethoscope />}
                {activeXrayFourthFeature && <Headphones />}
                {activeXrayFifthFeature?.icon === "orthodontics" && <Stethoscope />}
                {activeXrayFifthFeature?.icon === "exam" && <ClipboardCheck />}
                {activeKhamisLobbySideFeature?.icon === "lounge" && <Armchair />}
                {activeReceptionHallFeature?.icon === "reception" && <CalendarCheck2 />}
                {activeReceptionHallFeature?.icon === "patient-relations" && <HeartHandshake />}
                {activeReceptionHallFeature?.icon === "lounge" && <Armchair />}
                {activeReceptionHallFeature?.icon === "clinic" && <Stethoscope />}
                {activeImplantCorridorFeature?.icon === "clinic" && <Stethoscope />}
                {activeImplantCorridorFeature?.icon === "implant" && <DentalImplantIcon />}
                {activeImplantUnitLobbyFeature?.icon === "clinic" && <Stethoscope />}
                {activeImplantUnitLobbyFeature?.icon === "reception" && <CalendarCheck2 />}
                {activeImplantUnitLobbyFeature?.icon === "lounge" && <Armchair />}
                {activeReceptionRightCorridorFeature?.icon === "clinic" && <Stethoscope />}
                {activeReceptionRightLobbyFeature?.icon === "clinic" && <Stethoscope />}
                {activeReceptionRightLobbyFeature?.icon === "lounge" && <Armchair />}
                {activeReceptionRightLobbyFeature?.icon === "reception" && <CalendarCheck2 />}
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

              {activeImplantCorridorFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeImplantCorridorFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeImplantCorridorFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeImplantCorridorFeature.message}</p>
                </>
              )}

              {activeImplantUnitLobbyFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeImplantUnitLobbyFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeImplantUnitLobbyFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeImplantUnitLobbyFeature.message}</p>
                </>
              )}

              {activeReceptionRightCorridorFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeReceptionRightCorridorFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeReceptionRightCorridorFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeReceptionRightCorridorFeature.message}</p>
                </>
              )}

              {activeReceptionRightLobbyFeature && (
                <>
                  <p className="sd-main-feature__eyebrow">{activeReceptionRightLobbyFeature.eyebrow}</p>
                  <h2 id="sd-main-feature-title">{activeReceptionRightLobbyFeature.title}</h2>
                  <p className="sd-main-feature__message">{activeReceptionRightLobbyFeature.message}</p>
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
                {...SAUDIDENT_LOGOS.navy}
                alt="سعودي دنت"
                unoptimized
              />

              <div className="sd-patient-relations__symbol" aria-hidden="true">
                <Stethoscope />
              </div>

              <p className="sd-patient-relations__eyebrow">قيادة طبية بمعايير سعودي دنت</p>
              <h2 id="sd-patient-relations-title">خبرة تقود الرعاية وثقة تصنع الابتسامة</h2>
              <p className="sd-patient-relations__message">
                يقود المدير الطبي في سعودي دنت منظومة علاجية تضع سلامتك وجودة رعايتك في المقام الأول
                ويشرف على أدق التفاصيل ويوحّد معايير الجودة لنقدّم لك رعاية تليق بثقتك
              </p>
              <span className="sd-patient-relations__signature">المدير الطبي — جودة نلتزم بها وابتسامة نفخر بها</span>
            </article>
          </div>
        )}
      </main>

      {openingComplete && branchView === "choice" && (
        <section className="sd-branch-choice" aria-labelledby="sd-branch-choice-title">
          <div className="sd-branch-choice__panel">
            <Image
              className="sd-branch-choice__logo"
              {...SAUDIDENT_LOGOS.navy}
              alt="سعودي دنت"
              priority
              unoptimized
            />
            <p>الجولة التفاعلية</p>
            <h1 id="sd-branch-choice-title">اختر الفرع</h1>

            <div className="sd-branch-choice__options">
              <button
                type="button"
                className="sd-branch-choice__option is-khamis"
                onClick={openKhamisBranch}
                disabled={branchTransitioning}
              >
                <Image
                  className="sd-branch-choice__photo"
                  src="/assets/branches/khamis-mushait/exterior-wide.webp"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  aria-hidden="true"
                />
                <span className="sd-branch-choice__icon"><Building2 aria-hidden="true" /></span>
                <strong>فرع خميس مشيط</strong>
                <small>ابدأ الجولة</small>
              </button>

              <button
                type="button"
                className="sd-branch-choice__option is-abha"
                onClick={openAbhaBranch}
                disabled={branchTransitioning}
              >
                <Image
                  className="sd-branch-choice__photo"
                  src="/assets/branches/abha/exterior-sultan-al-sadami.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  aria-hidden="true"
                />
                <span className="sd-branch-choice__icon"><Building2 aria-hidden="true" /></span>
                <strong>فرع أبها</strong>
                <small>ابدأ الجولة</small>
              </button>
            </div>
          </div>

          {!automaticTourActive && (
            <button
              type="button"
              className="sd-automatic-tour-launch"
              onClick={startAutomaticTour}
              disabled={branchTransitioning}
              aria-label="بدء العرض التلقائي الكامل لفرعي خميس مشيط وأبها"
            >
              <span className="sd-automatic-tour-launch__icon"><Play aria-hidden="true" fill="currentColor" /></span>
              <span className="sd-automatic-tour-launch__copy">
                <strong>عرض تلقائي</strong>
                <small>يبدأ بعد 5 دقائق من عدم التفاعل</small>
              </span>
            </button>
          )}
        </section>
      )}

      {openingComplete && branchView === "abha" && (
        <AbhaTourExperience
          onReturnToBranches={showBranchChoice}
          cinematicEnabled={cinematicEnabled}
          onCalibrationChange={handleLayoutEditingChange}
          automaticTourActive={automaticTourActive}
          onAutomaticTourComplete={finishAutomaticTour}
        />
      )}

      {!openingComplete && (
        <section className="sd-screen-opening" aria-label="افتتاحية سعودي دنت">
          <div className="sd-screen-opening__glow" aria-hidden="true" />
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
