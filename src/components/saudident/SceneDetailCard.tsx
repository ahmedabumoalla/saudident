"use client";

import Image from "next/image";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { BranchSceneHotspot } from "@/data/branch-interactive-scenes";
import { saudident } from "@/data/saudident";
import { PremiumSceneDetail } from "@/components/saudident/PremiumSceneDetail";

type SceneDetailCardProps = {
  hotspot: BranchSceneHotspot;
  galleryIndex: number;
  onGalleryIndex: (index: number) => void;
  onClose: () => void;
};

export function SceneDetailCard({
  hotspot,
  galleryIndex,
  onGalleryIndex,
  onClose,
}: SceneDetailCardProps) {
  if (hotspot.contentKind) {
    return <PremiumSceneDetail hotspot={hotspot} onClose={onClose} />;
  }

  const gallery = hotspot.gallery ?? [];
  const activeImage = gallery[galleryIndex];

  const moveGallery = (direction: number) => {
    if (gallery.length < 2) return;
    onGalleryIndex((galleryIndex + direction + gallery.length) % gallery.length);
  };

  return (
    <article className="sd-scene-detail" aria-labelledby="sd-scene-detail-title">
      <header className="sd-scene-detail__header">
        <div>
          <span>{hotspot.eyebrow}</span>
          <h2 id="sd-scene-detail-title">{hotspot.title}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="إغلاق التفاصيل">
          <X aria-hidden />
        </button>
      </header>

      <div className="sd-scene-detail__body">
        {activeImage && (
          <figure className="sd-scene-detail__gallery">
            <Image
              key={activeImage.src}
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="(max-width: 767px) 92vw, 360px"
            />
            {gallery.length > 1 && (
              <div className="sd-scene-detail__gallery-controls">
                <button type="button" onClick={() => moveGallery(-1)} aria-label="الصورة السابقة">
                  <ChevronRight aria-hidden />
                </button>
                <span>{galleryIndex + 1} / {gallery.length}</span>
                <button type="button" onClick={() => moveGallery(1)} aria-label="الصورة التالية">
                  <ChevronLeft aria-hidden />
                </button>
              </div>
            )}
          </figure>
        )}

        <p className="sd-scene-detail__summary">{hotspot.description}</p>

        <section className="sd-scene-detail__section">
          <h3>الخدمات</h3>
          <ul>
            {hotspot.services.map((service) => <li key={service}>{service}</li>)}
          </ul>
        </section>

        {hotspot.equipment?.length ? (
          <section className="sd-scene-detail__section">
            <h3>التجهيزات الظاهرة</h3>
            <ul>
              {hotspot.equipment.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        ) : null}

        <a className="sd-scene-detail__cta" href={saudident.appointment.url} target="_blank" rel="noreferrer">
          <CalendarDays aria-hidden />
          {hotspot.ctaLabel ?? "احجز موعدك"}
        </a>
      </div>
    </article>
  );
}
