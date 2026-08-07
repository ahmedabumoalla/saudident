import type { BranchId } from "@/types/experience";

export type Advertisement = {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  image?: string;
  branchId?: BranchId | "all";
  href?: string;
};

// Editable placeholder marketing data for development; replace with approved campaigns before publication.
export const advertisements: Advertisement[] = [
  { id: "orthodontics-offer", badge: "عرض خاص", title: "خصم على خدمات تقويم الأسنان", subtitle: "اكتشف عروض سعودي دنت الحالية", branchId: "all" },
  { id: "new-doctor", badge: "انضم حديثًا", title: "طبيب جديد ضمن فريق سعودي دنت", subtitle: "تعرّف على نخبة أطباء الأسنان", branchId: "all" },
  { id: "smile-care", badge: "حملة سعودي دنت", title: "ابتسامتك تستحق العناية", subtitle: "عروض وخدمات مختارة لفترة محدودة", branchId: "all" },
];
