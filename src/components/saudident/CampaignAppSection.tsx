"use client";

import Image from "next/image";
import { Apple, Play } from "lucide-react";
import { useRef } from "react";
import { saudident } from "@/data/saudident";
import { gsap, useGSAP } from "@/lib/gsap";

const campaign = {
  eyebrow: "تطبيق سعودي دنت",
  title: "القرار قرارك",
  body: "اختر طبيبك. احجز موعدك. وتابع حجوزاتك من مكان واحد",
  artwork: undefined as string | undefined,
  icon: "/media/app/app-icon.png",
  ctas: [
    { label: "App Store", href: saudident.app.appStore, icon: Apple },
    { label: "Google Play", href: saudident.app.googlePlay, icon: Play },
  ],
  screens: [
    {
      src: "/media/app/app-screen-1.webp",
      width: 289,
      height: 592,
      alt: "الشاشة الرئيسية في تطبيق سعودي دنت",
    },
    {
      src: "/media/app/app-screen-2.webp",
      width: 297,
      height: 592,
      alt: "قائمة الأطباء في تطبيق سعودي دنت",
    },
    {
      src: "/media/app/app-screen-3.webp",
      width: 307,
      height: 592,
      alt: "تفاصيل حجز موعد في تطبيق سعودي دنت",
    },
  ],
} as const;

export function CampaignAppSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      entrance
        .fromTo(
          "[data-campaign-visual]",
          { autoAlpha: 0, scale: 0.985 },
          { autoAlpha: 1, scale: 1, duration: 0.85, ease: "power3.out" },
        )
        .fromTo(
          "[data-campaign-phone='main']",
          { autoAlpha: 0, y: 30, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" },
          0.06,
        )
        .fromTo(
          "[data-campaign-phone='left']",
          { autoAlpha: 0, x: -30, "--phone-angle": "-11deg" },
          { autoAlpha: 1, x: 0, "--phone-angle": "-7deg", duration: 0.82, ease: "power3.out" },
          0.14,
        )
        .fromTo(
          "[data-campaign-phone='right']",
          { autoAlpha: 0, x: 30, "--phone-angle": "11deg" },
          { autoAlpha: 1, x: 0, "--phone-angle": "7deg", duration: 0.82, ease: "power3.out" },
          0.22,
        )
        .fromTo(
          "[data-campaign-copy]",
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.09, ease: "power3.out" },
          0.3,
        );

      gsap.to("[data-campaign-depth='main']", {
        y: 6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to("[data-campaign-depth='side']", {
        y: (index) => index === 0 ? -10 : 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-campaign-copy], [data-campaign-visual]", {
        autoAlpha: 1,
        clearProps: "transform",
      });
      gsap.set("[data-campaign-screen]", { autoAlpha: 1 });
    });

    return () => media.revert();
  }, { scope: sectionRef });

  return (
    <section id="app-campaign" ref={sectionRef} className="sd-campaign" aria-labelledby="sd-campaign-title" dir="rtl">
      <div className="sd-campaign__layout">
        <div className="sd-campaign__copy">
          <div className="sd-campaign__eyebrow" data-campaign-copy>
            <Image src={campaign.icon} width={36} height={36} alt="" aria-hidden="true" />
            <p>{campaign.eyebrow}</p>
          </div>

          <h2 id="sd-campaign-title" aria-label={campaign.title} data-campaign-copy>
            <span aria-hidden="true">القرار</span>
            <span aria-hidden="true">قرارك</span>
          </h2>

          <p className="sd-campaign__body" data-campaign-copy>{campaign.body}</p>

          <div className="sd-campaign__actions" data-campaign-copy aria-label="روابط تحميل تطبيق سعودي دنت">
            {campaign.ctas.map((cta) => {
              const StoreIcon = cta.icon;
              return (
                <a
                  key={cta.label}
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`تحميل تطبيق سعودي دنت من ${cta.label} — يفتح في نافذة جديدة`}
                >
                  <StoreIcon aria-hidden="true" />
                  <span><small>حمّل من</small>{cta.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="sd-campaign__visual" data-campaign-visual aria-label="لقطات من تطبيق سعودي دنت">
          <div className="sd-campaign__glow" aria-hidden="true" />
          {campaign.artwork ? (
            <Image
              className="sd-campaign__artwork"
              src={campaign.artwork}
              alt="الحملة الحالية لتطبيق سعودي دنت"
              fill
              sizes="(max-width: 1024px) 92vw, 56vw"
            />
          ) : campaign.screens.map((screen, index) => (
            <figure
              key={screen.src}
              className={`sd-campaign__screen sd-campaign__screen--${index + 1}`}
              data-campaign-screen={index === 0 ? "main" : "side"}
              data-campaign-phone={index === 0 ? "main" : index === 1 ? "left" : "right"}
            >
              <div className="sd-campaign__screen-depth" data-campaign-depth={index === 0 ? "main" : "side"}>
                <Image
                  src={screen.src}
                  width={screen.width}
                  height={screen.height}
                  alt={screen.alt}
                  sizes="(max-width: 767px) 48vw, (max-width: 1024px) 32vw, 21vw"
                />
              </div>
            </figure>
          ))}
          <div className="sd-campaign__floor" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
