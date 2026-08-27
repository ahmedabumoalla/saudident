"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Armchair,
  Building2,
  CalendarCheck2,
  ClipboardCheck,
  House,
  MoonStar,
  Radiation,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import {
  ConferenceLayoutEditor,
  type LayoutEditorAddition,
} from "@/components/saudident/ConferenceLayoutEditor";
import savedAbhaTourLayout from "@/data/abha-tour-layout.json";
import savedConferenceLayout from "@/data/conference-layout.json";
import {
  abhaTourItemLabels,
  abhaTourScenes,
  getAbhaTourItemContent,
  type AbhaTourItemKind,
  type AbhaTourOverlay,
} from "@/data/abha-tour";
import { gsap } from "@/lib/gsap";

type AbhaTourExperienceProps = {
  onReturnToBranches: () => void;
  cinematicEnabled?: boolean;
  onCalibrationChange?: (active: boolean) => void;
};

const INITIAL_CONTROLS_REVEAL_MS = 820;
const SCENE_CONTROLS_REVEAL_MS = 180;

const ITEM_KINDS: AbhaTourItemKind[] = [
  "arrow",
  "clinic",
  "sterilization",
  "reception",
  "lounge",
  "prayer",
  "radiology",
  "examination",
  "administration",
];

type SavedPlacement = {
  x: number;
  y: number;
  scale: number;
  angle?: number;
  tilt?: number;
  depth?: number;
};

const savedPositions = savedConferenceLayout as Record<string, SavedPlacement>;

function waitForTourImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image();
    let settled = false;
    const timeout = window.setTimeout(() => finish(), 4000);
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve();
    };
    const decodeAndFinish = () => {
      if (typeof image.decode !== "function") {
        finish();
        return;
      }
      void image.decode().catch(() => undefined).finally(finish);
    };

    image.decoding = "async";
    image.onload = decodeAndFinish;
    image.onerror = finish;
    image.src = src;
    if (image.complete) decodeAndFinish();
  });
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

function ItemIcon({ kind }: { kind: AbhaTourItemKind }) {
  if (kind === "clinic") return <Stethoscope aria-hidden="true" />;
  if (kind === "reception") return <CalendarCheck2 aria-hidden="true" />;
  if (kind === "lounge") return <Armchair aria-hidden="true" />;
  if (kind === "prayer") return <MoonStar aria-hidden="true" />;
  if (kind === "radiology") return <Radiation aria-hidden="true" />;
  if (kind === "examination") return <ClipboardCheck aria-hidden="true" />;
  if (kind === "administration") return <Building2 aria-hidden="true" />;
  if (kind === "sterilization") return <ShieldCheck aria-hidden="true" />;
  return <ArrowLeft aria-hidden="true" />;
}

const EDITOR_ADDITIONS: LayoutEditorAddition[] = ITEM_KINDS.map((kind) => ({
  id: kind,
  label: abhaTourItemLabels[kind],
  icon: <ItemIcon kind={kind} />,
}));

export function AbhaTourExperience({
  onReturnToBranches,
  cinematicEnabled = true,
  onCalibrationChange,
}: AbhaTourExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const transitionLockedRef = useRef(false);
  const hasScheduledInitialRevealRef = useRef(false);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [incomingSceneIndex, setIncomingSceneIndex] = useState<number | null>(null);
  const [items, setItems] = useState<AbhaTourOverlay[]>(() => savedAbhaTourLayout as AbhaTourOverlay[]);
  const [announcement, setAnnouncement] = useState("");
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [controlsReady, setControlsReady] = useState(false);
  const [coordinatesReady, setCoordinatesReady] = useState(false);
  const [calibrationActive, setCalibrationActive] = useState(process.env.NODE_ENV === "development");
  const scene = abhaTourScenes[sceneIndex];
  const activeItem = activeItemId ? items.find((item) => item.id === activeItemId) ?? null : null;
  const activeItemContent = activeItem ? getAbhaTourItemContent(activeItem) : null;

  useLayoutEffect(() => {
    const player = rootRef.current;
    if (!player) return;

    const applyPlayerScale = (width: number, height: number) => {
      player.style.setProperty("--sd-conference-scale-x", (width / 1500).toFixed(6));
      player.style.setProperty("--sd-conference-scale-y", (height / 1000).toFixed(6));
    };

    applyPlayerScale(player.clientWidth, player.clientHeight);
    setCoordinatesReady(true);

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      applyPlayerScale(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(player);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (transitioning) return;

    const delay = !cinematicEnabled || calibrationActive || reducedMotion
      ? 0
      : hasScheduledInitialRevealRef.current
        ? SCENE_CONTROLS_REVEAL_MS
        : INITIAL_CONTROLS_REVEAL_MS;
    hasScheduledInitialRevealRef.current = true;
    const timer = window.setTimeout(() => setControlsReady(true), delay);
    return () => window.clearTimeout(timer);
  }, [calibrationActive, cinematicEnabled, sceneIndex, transitioning]);

  const goToScene = useCallback(async (index: number) => {
    if (transitionLockedRef.current) return;
    const targetIndex = (index + abhaTourScenes.length) % abhaTourScenes.length;
    if (targetIndex === sceneIndex) return;
    const direction = targetIndex === 0 && sceneIndex === abhaTourScenes.length - 1
      ? 1
      : targetIndex > sceneIndex ? 1 : -1;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setAnnouncement("");
    setActiveItemId(null);
    transitionLockedRef.current = true;
    setControlsReady(false);
    setTransitioning(true);
    transitionRef.current?.kill();

    await waitForTourImage(abhaTourScenes[targetIndex].image);

    if (!cinematicEnabled || calibrationActive || reducedMotion) {
      setSceneIndex(targetIndex);
      setIncomingSceneIndex(null);
      transitionLockedRef.current = false;
      setTransitioning(false);
      return;
    }

    setIncomingSceneIndex(targetIndex);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const root = rootRef.current;
        const currentMedia = root?.querySelector<HTMLElement>(".sd-abha-tour__media--current");
        const incomingMedia = root?.querySelector<HTMLElement>(".sd-abha-tour__media--incoming");
        const incomingPhoto = incomingMedia?.querySelector<HTMLElement>(".sd-abha-tour__photo");
        const light = root?.querySelector<HTMLElement>(".sd-abha-tour__transition-light");

        if (!currentMedia || !incomingMedia) {
          setSceneIndex(targetIndex);
          setIncomingSceneIndex(null);
          transitionLockedRef.current = false;
          setTransitioning(false);
          return;
        }

        const finishTransition = () => {
          setSceneIndex(targetIndex);
          setIncomingSceneIndex(null);
          transitionLockedRef.current = false;
          setTransitioning(false);
        };
        const timeline = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: finishTransition,
        });
        transitionRef.current = timeline;
        timeline.fromTo(
          incomingMedia,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.72, ease: "power2.inOut" },
          0,
        );
        if (incomingPhoto) {
          timeline.fromTo(
            incomingPhoto,
            { scale: 1.018, filter: "brightness(1.035)" },
            { scale: 1, filter: "brightness(1)", duration: 0.86, ease: "power3.out" },
            0,
          );
        }
        timeline.to(
          currentMedia,
          { scale: 1.006, filter: "brightness(0.96)", duration: 0.72, ease: "power2.inOut" },
          0,
        );
        if (light) {
          timeline.fromTo(
            light,
            { autoAlpha: 0, xPercent: 74 * direction },
            { autoAlpha: 0.34, xPercent: -74 * direction, duration: 0.62, ease: "power2.inOut" },
            0.04,
          );
          timeline.to(light, { autoAlpha: 0, duration: 0.2, ease: "power2.out" }, 0.5);
        }
      });
    });
  }, [calibrationActive, cinematicEnabled, sceneIndex]);

  useEffect(() => {
    const nextIndex = (sceneIndex + 1) % abhaTourScenes.length;
    const previousIndex = (sceneIndex - 1 + abhaTourScenes.length) % abhaTourScenes.length;
    const nextImage = new window.Image();
    const previousImage = new window.Image();
    nextImage.decoding = "async";
    previousImage.decoding = "async";
    nextImage.src = abhaTourScenes[nextIndex].image;
    previousImage.src = abhaTourScenes[previousIndex].image;
    void nextImage.decode?.().catch(() => undefined);
    void previousImage.decode?.().catch(() => undefined);
  }, [sceneIndex]);

  useEffect(() => () => {
    transitionRef.current?.kill();
  }, []);

  useEffect(() => {
    if (!activeItemId) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveItemId(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [activeItemId]);

  const handleEditingChange = useCallback((active: boolean) => {
    setCalibrationActive(active);
    onCalibrationChange?.(active);
    if (!active) return;
    setActiveItemId(null);
    transitionRef.current?.kill();
    transitionLockedRef.current = false;
    setIncomingSceneIndex(null);
    setTransitioning(false);
    const media = rootRef.current?.querySelector<HTMLElement>(".sd-abha-tour__media--current");
    if (media) gsap.set(media, { clearProps: "transform,filter,opacity,visibility" });
  }, [onCalibrationChange]);

  const saveItems = useCallback(async (nextItems: AbhaTourOverlay[]) => {
    try {
      await fetch("/api/abha-tour-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextItems),
      });
    } catch {
      // The shared editor reports position-save errors in its own status.
    }
  }, []);

  const addItem = useCallback((rawKind: string) => {
    const kind = rawKind as AbhaTourItemKind;
    if (!ITEM_KINDS.includes(kind)) return;
    const sameKindCount = items.filter((item) => item.sceneId === scene.id && item.kind === kind).length;
    let suffix = sameKindCount + 1;
    while (items.some((item) => item.id === `${scene.id}-${kind}-${suffix}`)) suffix += 1;
    const item: AbhaTourOverlay = {
      id: `${scene.id}-${kind}-${suffix}`,
      sceneId: scene.id,
      kind,
      x: 50 + ((sameKindCount % 3) - 1) * 8,
      y: 60 + Math.floor(sameKindCount / 3) * 7,
      scale: 1,
      angle: 0,
      tilt: 70,
      depth: 0.78,
    };
    const nextItems = [...items, item];
    setItems(nextItems);
    void saveItems(nextItems);
  }, [items, saveItems, scene.id]);

  const removeItem = useCallback((id: string) => {
    const nextItems = items.filter((item) => item.id !== id || item.required);
    if (nextItems.length === items.length) return;
    setItems(nextItems);
    void saveItems(nextItems);
  }, [items, saveItems]);

  const itemPosition = (item: AbhaTourOverlay) => ({
    left: `${savedPositions[`${item.sceneId}:${item.id}`]?.x ?? item.x}%`,
    top: `${savedPositions[`${item.sceneId}:${item.id}`]?.y ?? item.y}%`,
    "--sd-layout-scale": savedPositions[`${item.sceneId}:${item.id}`]?.scale ?? item.scale,
    "--sd-layout-angle": `${savedPositions[`${item.sceneId}:${item.id}`]?.angle ?? item.angle}deg`,
    "--sd-layout-tilt": `${savedPositions[`${item.sceneId}:${item.id}`]?.tilt ?? item.tilt}deg`,
    "--sd-layout-depth": savedPositions[`${item.sceneId}:${item.id}`]?.depth ?? item.depth,
  }) as CSSProperties;

  const renderSceneMedia = (layerSceneIndex: number, layer: "current" | "incoming") => {
    const layerScene = abhaTourScenes[layerSceneIndex];
    const layerItems = items.filter((item) => item.sceneId === layerScene.id);
    const isIncoming = layer === "incoming";

    return (
      <div
        className={`sd-abha-tour__media sd-abha-tour__media--${layer}`}
        key={`${layer}-${layerScene.id}`}
        aria-hidden={isIncoming || undefined}
      >
        <Image
          className="sd-abha-tour__photo"
          src={layerScene.image}
          alt={isIncoming ? "" : layerScene.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
        />

        <div className="sd-abha-tour__controls sd-conference-image-coordinates" aria-label={`عناصر الصورة رقم ${layerScene.number}`}>
          {layerItems.map((item) => item.kind === "arrow" ? (
            <button
              type="button"
              key={item.id}
              data-layout-id={item.id}
              data-layout-control={`${item.sceneId}:${item.id}`}
              data-layout-removable={item.required ? undefined : "true"}
              className="sd-conference-floor-arrow sd-abha-tour-control sd-abha-tour-arrow"
              style={itemPosition(item)}
              onClick={() => void goToScene(item.targetSceneNumber ? item.targetSceneNumber - 1 : layerSceneIndex + 1)}
              disabled={transitioning || isIncoming}
              tabIndex={isIncoming ? -1 : undefined}
              aria-label={`الانتقال إلى الصورة ${layerScene.number === 11 ? 1 : layerScene.number + 1}`}
            >
              <FloorRouteGuide />
            </button>
          ) : (
            <button
              type="button"
              key={item.id}
              data-layout-id={item.id}
              data-layout-control={`${item.sceneId}:${item.id}`}
              data-layout-removable={item.required ? undefined : "true"}
              className="sd-corridor-hotspot sd-abha-tour-control"
              style={itemPosition(item)}
              onClick={() => {
                setActiveItemId(item.id);
                setAnnouncement(`تم فتح نافذة ${abhaTourItemLabels[item.kind]}`);
              }}
              disabled={transitioning || isIncoming}
              tabIndex={isIncoming ? -1 : undefined}
              aria-label={`فتح نافذة ${abhaTourItemLabels[item.kind]}`}
            >
              <span className="sd-corridor-hotspot__pulse" aria-hidden="true" />
              <span className="sd-corridor-hotspot__icon"><ItemIcon kind={item.kind} /></span>
              <strong>{abhaTourItemLabels[item.kind]}</strong>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={rootRef}
      className={`sd-abha-tour${cinematicEnabled ? " is-cinematic" : ""}${coordinatesReady ? " is-coordinate-ready" : ""}${calibrationActive ? " is-calibrating" : ""}${transitioning ? " is-transitioning" : ""}${controlsReady ? " are-controls-ready" : ""}`}
      role="region"
      aria-label="الجولة التفاعلية في فرع أبها"
    >
      {renderSceneMedia(sceneIndex, "current")}
      {incomingSceneIndex !== null && renderSceneMedia(incomingSceneIndex, "incoming")}

      <nav className="sd-tour-pagination sd-abha-tour__pagination" aria-label="صور جولة فرع أبها">
        {abhaTourScenes.map((tourScene, index) => (
          <button
            type="button"
            key={tourScene.id}
            className={index === sceneIndex ? "is-active" : undefined}
            onClick={() => void goToScene(index)}
            disabled={transitioning || calibrationActive}
            aria-label={`الصورة ${index + 1} من ${abhaTourScenes.length}`}
            aria-current={index === sceneIndex ? "step" : undefined}
          />
        ))}
      </nav>

      <div className="sd-abha-tour__transition-light" aria-hidden="true" />

      {sceneIndex === 0 && (
        <button
          type="button"
          className="sd-branch-choice-return sd-abha-tour__branch-return"
          onClick={onReturnToBranches}
          disabled={transitioning}
          aria-label="الرجوع لاختيار الفرع"
        >
          <Building2 aria-hidden="true" />
          <span>الرجوع لاختيار الفرع</span>
        </button>
      )}

      {sceneIndex > 0 && (
        <button
          type="button"
          className="sd-conference-back sd-abha-tour__back"
          onClick={() => goToScene(sceneIndex - 1)}
          disabled={transitioning}
          aria-label="العودة إلى الصورة السابقة"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M14 6l6 6-6 6" />
          </svg>
          <span>رجوع</span>
        </button>
      )}

      {sceneIndex > 0 && (
        <button
          type="button"
          className="sd-abha-tour__home"
          onClick={() => goToScene(0)}
          disabled={transitioning || calibrationActive}
          aria-label="العودة إلى الصورة الأولى في فرع أبها"
        >
          <House aria-hidden="true" />
          <span>الرئيسية</span>
        </button>
      )}

      <p className="sd-abha-tour__announcement" aria-live="polite">{announcement}</p>

      {activeItem && activeItemContent && (
        <div
          className={`sd-main-feature sd-abha-tour__feature is-${activeItem.kind}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sd-abha-feature-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveItemId(null);
          }}
        >
          <article className="sd-main-feature__panel">
            <button
              type="button"
              className="sd-main-feature__close"
              onClick={() => setActiveItemId(null)}
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

            <div className="sd-main-feature__symbol" aria-hidden="true">
              <ItemIcon kind={activeItem.kind} />
            </div>
            <p className="sd-main-feature__eyebrow">{activeItemContent.eyebrow}</p>
            <h2 id="sd-abha-feature-title">{activeItemContent.title}</h2>
            <p className="sd-main-feature__message">{activeItemContent.message}</p>
          </article>
        </div>
      )}

      <ConferenceLayoutEditor
        key={scene.id}
        rootRef={rootRef}
        activeScene={scene.id}
        additions={EDITOR_ADDITIONS}
        onAddControl={addItem}
        onRemoveControl={removeItem}
        onEditingChange={handleEditingChange}
        refreshKey={`${scene.id}-${items.filter((item) => item.sceneId === scene.id).length}`}
      />

    </div>
  );
}
