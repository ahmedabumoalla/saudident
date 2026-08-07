"use client";

import { Check } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { useRef } from "react";
import { MediaGallery } from "@/components/media/media-gallery";
import { ExperienceIcon } from "@/lib/icon-registry";
import { gsap, useGSAP } from "@/lib/gsap";
import { useExperienceStore } from "@/store/use-experience-store";
import type { ExperienceItem } from "@/types/experience";
import { demoConfig } from "@/data/demo-config";
import { completeDemoGallery } from "@/lib/demo-gallery-events";

export function DetailScene({ item }: { item: ExperienceItem }) {
  const back = useExperienceStore((state) => state.goBack);
  const demoMode = useExperienceStore((state) => state.isDemoPlaying);
  const demoStepId = useExperienceStore((state) => state.demoStepId);
  const root = useRef<HTMLElement>(null);
  const showDraftBadge = item.status === "draft" && process.env.NEXT_PUBLIC_SHOW_DRAFT_BADGES === "1";

  useGSAP(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline
      .fromTo(".detail-copy > *", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.48, stagger: 0.05 }, 0.04)
      .fromTo(".detail-feature", { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.035 }, 0.18);
  }, { scope: root, dependencies: [item.id], revertOnUpdate: true });

  return (
    <section ref={root} className={`detail-scene theme-${item.theme}`}>
      <div className="detail-visual">
        <MediaGallery images={item.gallery} positions={item.galleryPositions} title={item.title} demoMode={demoMode} demoStepId={demoStepId} demoImageDuration={demoConfig.imageHoldMs} onDemoComplete={demoStepId ? () => completeDemoGallery(demoStepId) : undefined} />
      </div>

      <aside className="detail-info-panel">
        <div className="detail-nav">
          <BackButton className="detail-back-button" onClick={back} />
        </div>

        <div className="detail-copy">
          <div className="detail-category"><span className="detail-icon" aria-hidden><ExperienceIcon name={item.icon} /></span><span>{item.subtitle}</span></div>
          <h1>{item.title}</h1>
          <p className="detail-description">{item.description}</p>
          {showDraftBadge && <small className="draft-badge">قيد مراجعة المحتوى</small>}

          <div className="detail-section">
            <h2>ملامح التجربة</h2>
            <div className="detail-feature-list">
              {item.features.map((feature) => <span className="detail-feature" key={feature}><i><Check /></i>{feature}</span>)}
            </div>
          </div>

          <div className="detail-section detail-services">
            <h2>ما الذي ستجده؟</h2>
            <div className="detail-service-list">
              {item.services.map((service) => <span className="detail-feature" key={service}>{service}</span>)}
            </div>
          </div>
        </div>

        <div className="detail-signature"><span>سعودي دنت</span><small>تجربة الفروع التفاعلية</small></div>
      </aside>
    </section>
  );
}
