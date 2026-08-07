import type { BranchId, ExperienceItem } from "@/types/experience";
import { getBranch } from "./branches";

export function getBranchSections(branchId: BranchId): ExperienceItem[] {
  const branch = getBranch(branchId);
  const gallery = branch.galleryImages;
  return [
    { id: "clinics", slug: "clinics", title: "العيادات والتخصصات", subtitle: "طب الأسنان تحت سقف واحد", description: "استكشف تخصصات طب الأسنان والخدمات العلاجية المتاحة ضمن تجربة سعودي دنت.", shortDescription: "زراعة وتقويم وعصب وتجميل", coverImage: gallery[2] ?? branch.heroImage, gallery, features: [], services: [], status: "approved", theme: "hospital", targetScene: "clinics", icon: "dentistry" },
    { id: "doctors", slug: "doctors", title: "الأطباء", subtitle: "كن مع الصفوة", description: "تعرّف على نخبة أطباء سعودي دنت وتخصصاتهم الطبية.", shortDescription: "استشاريون وأخصائيون", coverImage: gallery[1] ?? branch.heroImage, gallery, features: [], services: [], status: "approved", theme: "restaurant", targetScene: "restaurants", icon: "doctor" },
    { id: "services", slug: "services", title: "الخدمات", subtitle: "رعاية أسنان متكاملة", description: "دليل واضح لأبرز خدمات سعودي دنت العلاجية والتجميلية.", shortDescription: "الخدمات العلاجية والتجميلية", coverImage: gallery[3] ?? branch.heroImage, gallery, features: [], services: [], status: "approved", theme: "sports", targetScene: "sports", icon: "sparkles" },
    { id: "tour", slug: "tour", title: "جولة داخل الفرع", subtitle: "شاهد المكان كما لو أنك بداخله", description: "انتقل بين الاستقبال وصالات الانتظار وغرف العلاج والمختبر والمرافق الداخلية.", shortDescription: "الاستقبال والعيادات والمرافق", coverImage: gallery[0] ?? branch.heroImage, gallery, features: [], services: [], status: "approved", theme: "hospital", targetScene: "gallery", icon: "camera" },
  ];
}
