"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import savedConferenceLayout from "@/data/conference-layout.json";

type ControlPlacement = {
  x: number;
  y: number;
  scale: number;
  angle?: number;
  tilt?: number;
  depth?: number;
};

type ConferenceLayout = Record<string, ControlPlacement>;

type ResolvedControlPlacement = Required<ControlPlacement>;

type SelectedControl = ResolvedControlPlacement & {
  key: string;
  label: string;
  isArrow: boolean;
};

type DragState = {
  pointerId: number;
  element: HTMLElement;
  key: string;
  label: string;
  offsetX: number;
  offsetY: number;
  placement: ResolvedControlPlacement;
  isArrow: boolean;
};

type SaveStatus = "saved" | "saving" | "error";

const CONTROL_SELECTOR = [
  ".sd-conference-image-coordinates > button",
  ".sd-conference-image-coordinates > .sd-conference-floor-arrow",
].join(", ");

const GENERIC_CLASSES = new Set([
  "sd-conference-floor-arrow",
  "sd-main-scene-hotspot",
  "sd-corridor-hotspot",
]);

function isEditorRequested() {
  return process.env.NODE_ENV === "development"
    && typeof window !== "undefined"
    && new URLSearchParams(window.location.search).get("calibrate") === "1";
}

function subscribeToEditorRequest() {
  return () => undefined;
}

function getControlKey(scene: string, element: HTMLElement, index: number) {
  const identity = Array.from(element.classList)
    .filter((className) => className.startsWith("sd-") && !GENERIC_CLASSES.has(className))
    .join(".");
  return `${scene}:${identity || `control-${index}`}`;
}

function round(value: number) {
  return Number(value.toFixed(2));
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function readCssNumber(styles: CSSStyleDeclaration, property: string, fallback: number) {
  const value = Number.parseFloat(styles.getPropertyValue(property));
  return Number.isFinite(value) ? value : fallback;
}

function resolvePlacement(
  placement: ControlPlacement | undefined,
  fallback: ResolvedControlPlacement,
): ResolvedControlPlacement {
  return {
    x: placement?.x ?? fallback.x,
    y: placement?.y ?? fallback.y,
    scale: placement?.scale ?? fallback.scale,
    angle: placement?.angle ?? fallback.angle,
    tilt: placement?.tilt ?? fallback.tilt,
    depth: placement?.depth ?? fallback.depth,
  };
}

export function ConferenceLayoutEditor({
  rootRef,
  activeScene,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  activeScene: string;
}) {
  const editorAvailable = useSyncExternalStore(subscribeToEditorRequest, isEditorRequested, () => false);
  const [editingActive, setEditingActive] = useState(true);
  const [layout, setLayout] = useState<ConferenceLayout>(() => ({ ...savedConferenceLayout }));
  const [selected, setSelected] = useState<SelectedControl | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const layoutRef = useRef(layout);
  const dragRef = useRef<DragState | null>(null);
  const defaultsRef = useRef<ConferenceLayout>({});

  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const updatePlacement = useCallback((
    key: string,
    label: string,
    placement: ResolvedControlPlacement,
    isArrow: boolean,
    scheduleSave = true,
  ) => {
    const normalized = {
      x: round(clamp(placement.x, 0, 100)),
      y: round(clamp(placement.y, 0, 100)),
      scale: round(clamp(placement.scale, 0.25, 3)),
      angle: round(clamp(placement.angle, -180, 180)),
      tilt: round(clamp(placement.tilt, 0, 85)),
      depth: round(clamp(placement.depth, 0.25, 1.5)),
    };
    setLayout((current) => ({ ...current, [key]: normalized }));
    setSelected({ key, label, isArrow, ...normalized });
    if (scheduleSave) setSaveStatus("saving");
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const controls = Array.from(root.querySelectorAll<HTMLElement>(CONTROL_SELECTOR));
    controls.forEach((element, index) => {
      const key = getControlKey(activeScene, element, index);
      element.dataset.layoutControl = key;

      const parent = element.parentElement;
      if (!parent) return;
      if (!defaultsRef.current[key]) {
        const styles = window.getComputedStyle(element);
        defaultsRef.current[key] = {
          x: round((element.offsetLeft / parent.clientWidth) * 100),
          y: round((element.offsetTop / parent.clientHeight) * 100),
          scale: 1,
          angle: readCssNumber(styles, "--arrow-angle", 0),
          tilt: readCssNumber(styles, "--arrow-tilt", 70),
          depth: readCssNumber(styles, "--arrow-depth", 0.78),
        };
      }

      const placement = layout[key];
      if (placement) {
        const resolved = resolvePlacement(placement, defaultsRef.current[key] as ResolvedControlPlacement);
        element.style.left = `${placement.x}%`;
        element.style.top = `${placement.y}%`;
        element.style.setProperty("--sd-layout-scale", String(placement.scale));
        element.style.setProperty("--sd-layout-angle", `${resolved.angle}deg`);
        element.style.setProperty("--sd-layout-tilt", `${resolved.tilt}deg`);
        element.style.setProperty("--sd-layout-depth", String(resolved.depth));
      } else {
        element.style.removeProperty("left");
        element.style.removeProperty("top");
        element.style.removeProperty("--sd-layout-scale");
        element.style.removeProperty("--sd-layout-angle");
        element.style.removeProperty("--sd-layout-tilt");
        element.style.removeProperty("--sd-layout-depth");
      }

      element.classList.toggle("is-layout-editable", editorAvailable && editingActive);
      element.classList.toggle("is-layout-selected", editorAvailable && editingActive && selected?.key === key);
    });
  }, [activeScene, editingActive, editorAvailable, layout, rootRef, selected?.key]);

  useEffect(() => {
    if (!editorAvailable || saveStatus !== "saving") return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/conference-layout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(layout),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Layout save failed");
        setSaveStatus("saved");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setSaveStatus("error");
      }
    }, 450);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [editorAvailable, layout, saveStatus]);

  useEffect(() => {
    if (!editorAvailable || !editingActive) return;
    const root = rootRef.current;
    if (!root) return;

    const findControl = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return null;
      const control = target.closest<HTMLElement>(CONTROL_SELECTOR);
      return control && root.contains(control) ? control : null;
    };

    const onPointerDown = (event: PointerEvent) => {
      const element = findControl(event);
      if (!element || event.button !== 0) return;
      const parent = element.parentElement;
      if (!parent) return;

      event.preventDefault();
      event.stopPropagation();
      const key = element.dataset.layoutControl;
      if (!key) return;

      const bounds = parent.getBoundingClientRect();
      const fallback = defaultsRef.current[key] as ResolvedControlPlacement | undefined
        ?? { x: 50, y: 50, scale: 1, angle: 0, tilt: 70, depth: 0.78 };
      const placement = resolvePlacement(layoutRef.current[key], fallback);
      const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
      const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;
      const label = element.getAttribute("aria-label") || element.textContent?.trim() || "عنصر تفاعلي";
      const isArrow = Boolean(element.querySelector(".sd-conference-floor-arrow__projection"));

      dragRef.current = {
        pointerId: event.pointerId,
        element,
        key,
        label,
        offsetX: pointerX - placement.x,
        offsetY: pointerY - placement.y,
        placement,
        isArrow,
      };
      element.setPointerCapture(event.pointerId);
      updatePlacement(key, label, placement, isArrow, false);
    };

    const onPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const parent = drag.element.parentElement;
      if (!parent) return;

      event.preventDefault();
      event.stopPropagation();
      const bounds = parent.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100 - drag.offsetX;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100 - drag.offsetY;
      updatePlacement(drag.key, drag.label, { ...drag.placement, x, y }, drag.isArrow, false);
    };

    const finishDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      event.preventDefault();
      event.stopPropagation();
      dragRef.current = null;
      setSaveStatus("saving");
      if (drag.element.hasPointerCapture(event.pointerId)) {
        drag.element.releasePointerCapture(event.pointerId);
      }
    };

    const preventControlClick = (event: MouseEvent) => {
      if (!findControl(event)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    root.addEventListener("pointerdown", onPointerDown, true);
    root.addEventListener("pointermove", onPointerMove, true);
    root.addEventListener("pointerup", finishDrag, true);
    root.addEventListener("pointercancel", finishDrag, true);
    root.addEventListener("click", preventControlClick, true);
    return () => {
      root.removeEventListener("pointerdown", onPointerDown, true);
      root.removeEventListener("pointermove", onPointerMove, true);
      root.removeEventListener("pointerup", finishDrag, true);
      root.removeEventListener("pointercancel", finishDrag, true);
      root.removeEventListener("click", preventControlClick, true);
    };
  }, [editingActive, editorAvailable, rootRef, updatePlacement]);

  if (!editorAvailable) return null;

  const changeSelectedScale = (scale: number) => {
    if (!selected) return;
    updatePlacement(selected.key, selected.label, { ...selected, scale }, selected.isArrow);
  };

  const nudgeSelected = (xDelta: number, yDelta: number) => {
    if (!selected) return;
    updatePlacement(selected.key, selected.label, {
      ...selected,
      x: selected.x + xDelta,
      y: selected.y + yDelta,
    }, selected.isArrow);
  };

  const changeSelectedArrow = (property: "angle" | "tilt" | "depth", value: number) => {
    if (!selected || !selected.isArrow) return;
    updatePlacement(selected.key, selected.label, { ...selected, [property]: value }, true);
  };

  const resetSelected = () => {
    if (!selected) return;
    const original = defaultsRef.current[selected.key] as ResolvedControlPlacement | undefined;
    if (original) updatePlacement(selected.key, selected.label, original, selected.isArrow);
  };

  return (
    <aside className="sd-layout-editor" dir="rtl" aria-label="محرر مواقع الأسهم والأيقونات">
      <header>
        <div>
          <strong>محرر العناصر</strong>
          <span className={`is-${saveStatus}`}>
            {saveStatus === "saving" ? "جارٍ الحفظ…" : saveStatus === "error" ? "تعذر الحفظ" : "محفوظ في ملف المشروع"}
          </span>
        </div>
        <button
          type="button"
          className={editingActive ? "is-active" : undefined}
          onClick={() => {
            setEditingActive((current) => !current);
            setSelected(null);
          }}
        >
          {editingActive ? "التحرير مفعّل" : "وضع التصفح"}
        </button>
      </header>

      {editingActive ? (
        selected ? (
          <div className="sd-layout-editor__selection">
            <span className="sd-layout-editor__name">{selected.label}</span>
            <output dir="ltr">X {selected.x.toFixed(2)}% · Y {selected.y.toFixed(2)}% · {selected.scale.toFixed(2)}×</output>

            <div className="sd-layout-editor__scale">
              <button type="button" onClick={() => changeSelectedScale(selected.scale - 0.1)} aria-label="تصغير">−</button>
              <input
                type="range"
                min="0.25"
                max="3"
                step="0.05"
                value={selected.scale}
                onChange={(event) => changeSelectedScale(Number(event.target.value))}
                aria-label="حجم العنصر"
              />
              <button type="button" onClick={() => changeSelectedScale(selected.scale + 0.1)} aria-label="تكبير">+</button>
            </div>

            {selected.isArrow && (
              <div className="sd-layout-editor__arrow-controls">
                <label>
                  <span>اتجاه السهم</span>
                  <output dir="ltr">{selected.angle.toFixed(0)}°</output>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={selected.angle}
                    onChange={(event) => changeSelectedArrow("angle", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>التصاقه بالأرض</span>
                  <output dir="ltr">{selected.tilt.toFixed(0)}°</output>
                  <input
                    type="range"
                    min="0"
                    max="85"
                    step="1"
                    value={selected.tilt}
                    onChange={(event) => changeSelectedArrow("tilt", Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>امتداد الطباعة</span>
                  <output dir="ltr">{selected.depth.toFixed(2)}×</output>
                  <input
                    type="range"
                    min="0.25"
                    max="1.5"
                    step="0.02"
                    value={selected.depth}
                    onChange={(event) => changeSelectedArrow("depth", Number(event.target.value))}
                  />
                </label>
              </div>
            )}

            <div className="sd-layout-editor__nudges" aria-label="تحريك دقيق">
              <button type="button" onClick={() => nudgeSelected(0, -0.25)}>↑</button>
              <button type="button" onClick={() => nudgeSelected(0.25, 0)}>→</button>
              <button type="button" onClick={() => nudgeSelected(0, 0.25)}>↓</button>
              <button type="button" onClick={() => nudgeSelected(-0.25, 0)}>←</button>
              <button type="button" onClick={resetSelected}>إعادة</button>
            </div>
          </div>
        ) : (
          <p>اضغط على أي سهم أو أيقونة ثم اسحبه. انتقل إلى «وضع التصفح» للتنقل بين الصور.</p>
        )
      ) : (
        <p>التنقل يعمل الآن بصورة طبيعية. اضغط «وضع التصفح» للعودة إلى التحرير.</p>
      )}
    </aside>
  );
}
