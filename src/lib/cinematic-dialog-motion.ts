import { gsap } from "@/lib/gsap";

function dialogParts(panel: HTMLElement) {
  return Array.from(panel.children).filter((element): element is HTMLElement => element instanceof HTMLElement);
}

function reducedMotionRequested() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function playCinematicDialogEntrance(overlay: HTMLElement, panel: HTMLElement) {
  const parts = dialogParts(panel);
  gsap.killTweensOf([overlay, panel, ...parts]);

  if (reducedMotionRequested()) {
    gsap.set([overlay, panel, ...parts], { autoAlpha: 1, clearProps: "transform,filter" });
    return null;
  }

  gsap.set(overlay, { autoAlpha: 0 });
  gsap.set(panel, {
    autoAlpha: 0,
    y: 30,
    scale: 0.965,
    filter: "blur(8px) brightness(0.92)",
    clipPath: "inset(3% 2% 5% 2% round 42px)",
    transformOrigin: "50% 58%",
  });
  gsap.set(parts, { autoAlpha: 0, y: 13 });

  return gsap.timeline({ defaults: { overwrite: "auto" } })
    .to(overlay, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0)
    .to(panel, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px) brightness(1)",
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      duration: 0.68,
      ease: "expo.out",
    }, 0.06)
    .to(parts, {
      autoAlpha: 1,
      y: 0,
      duration: 0.42,
      stagger: 0.045,
      ease: "power3.out",
    }, 0.2);
}

export function playCinematicDialogExit(
  overlay: HTMLElement,
  panel: HTMLElement,
  onComplete: () => void,
) {
  const parts = dialogParts(panel);
  gsap.killTweensOf([overlay, panel, ...parts]);

  if (reducedMotionRequested()) {
    onComplete();
    return null;
  }

  return gsap.timeline({ defaults: { overwrite: "auto" }, onComplete })
    .to(parts, {
      autoAlpha: 0,
      y: -7,
      duration: 0.2,
      stagger: { each: 0.018, from: "end" },
      ease: "power2.in",
    }, 0)
    .to(panel, {
      autoAlpha: 0,
      y: -18,
      scale: 0.976,
      filter: "blur(6px) brightness(0.94)",
      clipPath: "inset(3% 2% 5% 2% round 42px)",
      duration: 0.42,
      ease: "power3.in",
    }, 0.08)
    .to(overlay, { autoAlpha: 0, duration: 0.36, ease: "power2.inOut" }, 0.14);
}
