"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { advertisements } from "@/data/advertisements";
import { useExperienceStore } from "@/store/use-experience-store";

const ROTATION_MS = 2000;
const TRANSITION_MS = 520;

export function CampusAdvertisementStrip() {
  const mapFocusedBranchId = useExperienceStore((state) => state.mapFocusedBranchId);
  const demoBranchFocus = useExperienceStore((state) => state.isDemoPlaying && Boolean(state.selectedId));
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const paused = useRef(false);
  const transitionTimer = useRef<number | undefined>(undefined);

  const advance = useCallback(() => {
    if (paused.current || leaving) return;
    setLeaving(true);
    transitionTimer.current = window.setTimeout(() => {
      setIndex((current) => (current + 1) % advertisements.length);
      setLeaving(false);
    }, TRANSITION_MS);
  }, [leaving]);

  useEffect(() => {
    const timer = window.setInterval(advance, ROTATION_MS);
    return () => { window.clearInterval(timer); if (transitionTimer.current) window.clearTimeout(transitionTimer.current); };
  }, [advance]);

  const pause = () => { paused.current = true; };
  const resume = () => { paused.current = false; };
  const advertisement = advertisements[index];
  const hidden = Boolean(mapFocusedBranchId || demoBranchFocus);

  return <aside className={`campus-ad-strip${hidden ? " is-hidden" : ""}`} aria-label="عروض سعودي دنت" onPointerEnter={pause} onPointerLeave={resume} onPointerDown={pause} onPointerUp={resume}>
    <div key={advertisement.id} className={`campus-ad-content${leaving ? " is-leaving" : ""}`}>
      <div className="campus-ad-copy">
        {advertisement.badge && <span>{advertisement.badge}</span>}
        <strong>{advertisement.title}</strong>
        {advertisement.subtitle && <small>{advertisement.subtitle}</small>}
      </div>
      {advertisement.href && <a href={advertisement.href} target="_blank" rel="noopener noreferrer" onClick={pause}>عرض التفاصيل</a>}
    </div>
    <div className="campus-ad-dots" aria-hidden>{advertisements.map((item, dot) => <i key={item.id} className={dot === index ? "is-active" : ""} />)}</div>
  </aside>;
}
