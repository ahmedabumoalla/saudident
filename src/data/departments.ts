import type { Department } from "@/types";

export const departments: Department[] = [
  { slug: "orthodontics", name: "تقويم الأسنان", description: "خطط تقويم دقيقة لابتسامة متوازنة ووظيفة أفضل.", icon: "sparkles", services: ["التقويم الشفاف", "التقويم المعدني", "متابعة النمو"] },
  { slug: "implants", name: "زراعة الأسنان", description: "حلول تعويضية ثابتة بتخطيط رقمي وعناية متكاملة.", icon: "shield", services: ["زراعة سن واحد", "التركيبات فوق الزرعات", "تقييم العظم"] },
  { slug: "cosmetic", name: "تجميل الأسنان", description: "تصميم ابتسامة طبيعي يحترم ملامح الوجه.", icon: "smile", services: ["القشور الخزفية", "تبييض الأسنان", "ترميمات تجميلية"] },
  { slug: "endodontics", name: "علاج العصب", description: "علاج محافظ بتقنيات تكبير وتشخيص متقدمة.", icon: "activity", services: ["علاج الجذور", "إعادة علاج العصب", "ترميم السن"] },
  { slug: "pediatric", name: "أسنان الأطفال", description: "رعاية لطيفة ومساحة تمنح الطفل شعوراً بالأمان.", icon: "baby", services: ["العلاج الوقائي", "حشوات الأطفال", "متابعة التسنين"] },
  { slug: "prosthodontics", name: "التركيبات", description: "تركيبات ثابتة ومتحركة تجمع الدقة والجمال.", icon: "layers", services: ["التيجان والجسور", "أطقم الأسنان", "تركيبات الزيركون"] },
  { slug: "periodontics", name: "علاج اللثة", description: "عناية متخصصة بصحة اللثة والأنسجة الداعمة للأسنان.", icon: "heart", services: ["تنظيف عميق", "علاج انحسار اللثة", "العناية الوقائية"] },
  { slug: "oral-surgery", name: "جراحة الفم", description: "إجراءات جراحية دقيقة ضمن بيئة آمنة ومطمئنة.", icon: "cross", services: ["خلع ضرس العقل", "الجراحة البسيطة", "متابعة التعافي"] },
  { slug: "radiology", name: "الأشعة والتشخيص", description: "تصوير وتشخيص رقمي يدعمان قراراً علاجياً أكثر دقة.", icon: "scan", services: ["أشعة رقمية", "تصوير بانورامي", "تقارير تشخيصية"] },
  { slug: "sterilization", name: "التعقيم", description: "منظومة تعقيم ومكافحة عدوى ترافق كل تفاصيل الزيارة.", icon: "shield", services: ["تعقيم الأدوات", "تتبع الدورات", "سلامة غرف العلاج"] },
];
