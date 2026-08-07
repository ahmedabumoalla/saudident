import type { BranchId, ExperienceItem, ExperienceIconName } from "@/types/experience";
import { getBranch } from "./branches";

const definitions: Array<[string,string,ExperienceIconName,string,string[]]> = [
  ["implants", "زراعة الأسنان", "implant", "حلول تعويض الأسنان المفقودة بخطط علاجية متخصصة.", ["تقييم الحالة", "خطة علاج متكاملة"]],
  ["orthodontics", "تقويم الأسنان", "orthodontics", "تشخيص وتصحيح اصطفاف الأسنان وعلاقة الفكين.", ["تقويم ثابت ومتحرك", "متابعة دورية"]],
  ["root-canal", "علاج الجذور والعصب", "root-canal", "علاج لب الأسنان والمحافظة على السن الطبيعي قدر الإمكان.", ["تشخيص الألم", "علاج القنوات الجذرية"]],
  ["prosthodontics", "تركيبات الأسنان", "tooth", "تركيبات ثابتة ومتحركة لاستعادة الوظيفة والمظهر.", ["تيجان وجسور", "تركيبات متحركة"]],
  ["cosmetic", "إصلاح وتجميل الأسنان", "sparkles", "حلول تجميلية لتحسين لون وشكل وتناسق الابتسامة.", ["حشوات تجميلية", "تصميم الابتسامة"]],
  ["periodontics", "اللثة وجراحة الأسنان", "treatment", "تشخيص وعلاج أمراض اللثة والإجراءات الجراحية المرتبطة بها.", ["صحة اللثة", "إجراءات جراحية"]],
  ["pediatric", "طب أسنان الأطفال", "baby", "بيئة علاج مناسبة للأطفال مع خيارات الرعاية المتخصصة.", ["وقاية مبكرة", "علاج أسنان الأطفال"]],
  ["oral-medicine", "أمراض الفم والمفصل", "microscope", "تقييم أمراض الفم واضطرابات المفصل الصدغي الفكي.", ["تشخيص أمراض الفم", "تقييم المفصل"]],
  ["general", "طب الأسنان العام", "dentistry", "الفحص الدوري والعلاجات الأساسية والمحافظة على صحة الفم.", ["فحص شامل", "خطة وقائية"]],
];

export function getClinics(branchId: BranchId): ExperienceItem[] {
  const branch=getBranch(branchId); const imgs=branch.galleryImages;
  return definitions.map(([id,title,icon,description,features], index) => ({
    id, slug:id, title, subtitle:"تخصص أسنان", description,
    shortDescription:"تعرّف على التخصص ومسار الخدمة",
    coverImage: imgs[index % imgs.length] ?? branch.heroImage,
    gallery: [imgs[index % imgs.length], imgs[(index+2)%imgs.length], imgs[(index+4)%imgs.length]].filter(Boolean),
    features, services:["معلومات تعريفية عن التخصص", "استعراض بيئة الفرع"], status:"approved",
    theme:"hospital", targetScene:"clinic-detail", icon,
  }));
}
