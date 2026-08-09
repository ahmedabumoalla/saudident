"use client";

import { useRef, useState } from "react";
import { AppShowcase } from "@/components/saudident/AppShowcase";
import { BackgroundFilm } from "@/components/saudident/BackgroundFilm";
import { BranchesSection } from "@/components/saudident/BranchesSection";
import { CinematicHeader } from "@/components/saudident/CinematicHeader";
import { ConsultationSheet } from "@/components/saudident/ConsultationSheet";
import DoctorsExperience from "@/components/saudident/DoctorsExperience";
import { Finale } from "@/components/saudident/Finale";
import { HeroSection } from "@/components/saudident/HeroSection";
import { ProofSection } from "@/components/saudident/ProofSection";
import { RebuildHero } from "@/components/saudident/RebuildHero";
import { ServicesSection } from "@/components/saudident/ServicesSection";
import { StorySection } from "@/components/saudident/StorySection";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

const REBUILD_MODE = true;

export function CinematicExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);

  useGSAP(() => {
    if (REBUILD_MODE || !rootRef.current) return;
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-hero-reveal], [data-hero-line], [data-reveal], [data-proof-stat], [data-story-moment]", {
        autoAlpha: 1,
        clearProps: "transform,filter,clipPath",
      });
      gsap.set("[data-draw-path], [data-nerve-path]", { strokeDashoffset: 0 });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = gsap.timeline({ defaults: { ease: motion.ease } });
      hero
        .from("[data-hero-line]", {
          y: 36,
          autoAlpha: 0,
          clipPath: "inset(100% 0 0 0)",
          duration: 0.9,
          stagger: 0.1,
          ease: "expo.out",
        }, 0.15)
        .from("[data-hero-reveal]", { autoAlpha: 0, y: 24, duration: 0.82, stagger: 0.1 }, 0.35);

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(element,
          { autoAlpha: 0, y: 28, scale: 0.99 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: motion.duration.medium,
            ease: motion.ease,
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      gsap.fromTo("[data-proof-stat]",
        { autoAlpha: 0, y: 24, scale: 0.92 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          stagger: 0.18,
          duration: 1.05,
          ease: "expo.out",
          scrollTrigger: { trigger: ".sd-proof__installation", start: "top 68%", once: true },
        },
      );

      gsap.fromTo("[data-draw-path]", { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: ".sd-proof__installation", start: "top 82%", end: "bottom 52%", scrub: 1 },
      });

      gsap.fromTo("[data-nerve-path]", { strokeDashoffset: 1 }, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: ".sd-story__journey", start: "top 74%", end: "bottom 72%", scrub: 0.8 },
      });

      gsap.utils.toArray<HTMLElement>("[data-story-moment]").forEach((element) => {
        gsap.fromTo(element,
          { autoAlpha: 0.35, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: motion.ease,
            scrollTrigger: { trigger: element, start: "top 82%", once: true },
          },
        );
      });

      if (window.matchMedia("(pointer: fine) and (min-width: 980px)").matches) {
        const cleanups: Array<() => void> = [];
        gsap.utils.toArray<HTMLElement>(".sd-button--primary").forEach((button) => {
          const xTo = gsap.quickTo(button, "x", { duration: 0.35, ease: "power3.out" });
          const yTo = gsap.quickTo(button, "y", { duration: 0.35, ease: "power3.out" });
          const move = (event: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            xTo((event.clientX - rect.left - rect.width / 2) * 0.05);
            yTo((event.clientY - rect.top - rect.height / 2) * 0.05);
          };
          const leave = () => { xTo(0); yTo(0); };
          button.addEventListener("mousemove", move);
          button.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            button.removeEventListener("mousemove", move);
            button.removeEventListener("mouseleave", leave);
          });
        });
        return () => cleanups.forEach((cleanup) => cleanup());
      }
    });

    ScrollTrigger.refresh();
    return () => media.revert();
  }, { scope: rootRef });

  if (REBUILD_MODE) {
    return (
      <div ref={rootRef} className="sd-experience sd-experience--rebuild">
        <BackgroundFilm mode="image" />
        <CinematicHeader />
        <RebuildHero />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="sd-experience">
      <a className="sd-skip-link" href="#main-content">تجاوز إلى المحتوى</a>
      <BackgroundFilm mode="video" />
      <CinematicHeader />
      <main id="main-content">
        <HeroSection onConsultation={() => setConsultationOpen(true)} />
        <ProofSection />
        <StorySection />
        <ServicesSection />
        <DoctorsExperience />
        <AppShowcase />
        <BranchesSection />
        <Finale onConsultation={() => setConsultationOpen(true)} />
      </main>
      <ConsultationSheet open={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </div>
  );
}
