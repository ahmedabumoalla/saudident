"use client";

import Image from "next/image";
import { Layers3 } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";
import { ItemCard } from "@/components/ui/item-card";
import { SectionTitle } from "@/components/ui/section-title";
import { useExperienceStore } from "@/store/use-experience-store";
import type { ExperienceItem, SceneId, ThemeId } from "@/types/experience";
import type { Branch } from "@/data/branches";
import { BranchLocationButton } from "@/components/ui/branch-location-button";

export function CollectionScene({
  eyebrow,
  title,
  description,
  hero,
  items,
  theme,
  nextScene,
  branch,
}: {
  eyebrow: string;
  title: string;
  description: string;
  hero: string;
  items: ExperienceItem[];
  theme: ThemeId;
  nextScene?: SceneId;
  branch?: Branch;
}) {
  const goTo = useExperienceStore((state) => state.goTo);
  const back = useExperienceStore((state) => state.goBack);

  return (
    <section className={`collection-scene theme-${theme}`}>
      <div className="collection-hero">
        <Image src={hero} alt="" fill priority sizes="42vw" />
        <div className="collection-gradient" />
        <div className="collection-gridlines" aria-hidden />
        <BackButton className="back-button" onClick={back} />
        {branch && <BranchLocationButton branch={branch} className="collection-location-button" />}
        <SectionTitle eyebrow={eyebrow} title={title} description={description} count={items.length} />
        <div className="hero-gallery-strip" aria-hidden>
          {items.slice(0, 3).map((item) => (
            <span key={item.id}><Image src={item.coverImage} alt="" fill sizes="120px" /></span>
          ))}
        </div>
      </div>

      <div className="collection-content">
        <header className="collection-content-header">
          <span><Layers3 /> اختر وجهتك</span>
          <small>المس أي بطاقة لفتح التفاصيل والصور</small>
        </header>
        <div className={`collection-grid collection-grid-${items.length}`}>
          {items.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              index={index + 1}
              onClick={() => goTo(nextScene ?? item.targetScene, item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
