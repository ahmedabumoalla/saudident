import type { BranchSlug, GalleryImage } from "@/types";

export type BranchImageSet = {
  aerial: string;
  aerialFallback: string;
  exterior: string[];
  gallery: GalleryImage[];
  reception: string[];
  treatmentRooms: string[];
  waitingAreas: string[];
  laboratories: string[];
  kidsAreas: string[];
};

const image = (src: string, alt: string, category: GalleryImage["category"]): GalleryImage => ({ src, alt, category });

export const branchImages: Record<BranchSlug, BranchImageSet> = {
  abha: {
    aerial: "/images/branches/abha/aerial.webp",
    aerialFallback: "/images/branches/abha/gallery/waiting-area-main.webp",
    exterior: [],
    gallery: [
      image("/images/branches/abha/gallery/treatment-room.webp", "غرفة علاج حديثة في فرع أبها", "treatment"),
      image("/images/branches/abha/gallery/waiting-area-main.webp", "صالة الانتظار الرئيسية في فرع أبها", "waiting"),
      image("/images/branches/abha/gallery/waiting-area-entrance.webp", "مدخل منطقة الانتظار في فرع أبها", "waiting"),
      image("/images/branches/abha/gallery/clinics-corridor.webp", "ممر العيادات في فرع أبها", "interior"),
      image("/images/branches/abha/gallery/lobby-screen.webp", "بهو فرع أبها وشاشة الاستقبال", "interior"),
      image("/images/branches/abha/gallery/reception.webp", "منطقة الاستقبال في فرع أبها", "reception"),
      image("/images/branches/abha/gallery/doctor-room-sign.webp", "لوحة غرفة الطبيب في فرع أبها", "interior"),
    ],
    reception: ["/images/branches/abha/gallery/reception.webp"],
    treatmentRooms: ["/images/branches/abha/gallery/treatment-room.webp"],
    waitingAreas: ["/images/branches/abha/gallery/waiting-area-main.webp", "/images/branches/abha/gallery/waiting-area-entrance.webp"],
    laboratories: [],
    kidsAreas: [],
  },
  "khamis-mushait": {
    aerial: "/images/branches/khamis-mushait/aerial.webp",
    aerialFallback: "/images/branches/khamis-mushait/exterior-main.webp",
    exterior: ["/images/branches/khamis-mushait/exterior-main.webp", "/images/branches/khamis-mushait/exterior-close.webp"],
    gallery: [
      image("/images/branches/khamis-mushait/gallery/reception.webp", "استقبال فرع خميس مشيط", "reception"),
      image("/images/branches/khamis-mushait/gallery/lobby.webp", "بهو سعودي دنت في خميس مشيط", "interior"),
      image("/images/branches/khamis-mushait/gallery/kids-area.webp", "منطقة الأطفال في فرع خميس مشيط", "kids"),
      image("/images/branches/khamis-mushait/gallery/treatment-room.webp", "غرفة علاج في فرع خميس مشيط", "treatment"),
      image("/images/branches/khamis-mushait/gallery/lab.webp", "مختبر فرع خميس مشيط", "laboratory"),
      image("/images/branches/khamis-mushait/gallery/glass-lab.webp", "المختبر الزجاجي في فرع خميس مشيط", "laboratory"),
      image("/images/branches/khamis-mushait/gallery/waiting-area.webp", "صالة الانتظار في فرع خميس مشيط", "waiting"),
    ],
    reception: ["/images/branches/khamis-mushait/gallery/reception.webp"],
    treatmentRooms: ["/images/branches/khamis-mushait/gallery/treatment-room.webp"],
    waitingAreas: ["/images/branches/khamis-mushait/gallery/waiting-area.webp"],
    laboratories: ["/images/branches/khamis-mushait/gallery/lab.webp", "/images/branches/khamis-mushait/gallery/glass-lab.webp"],
    kidsAreas: ["/images/branches/khamis-mushait/gallery/kids-area.webp"],
  },
};

export function resolvedBranchImage(slug: BranchSlug) {
  return branchImages[slug].aerialFallback;
}
