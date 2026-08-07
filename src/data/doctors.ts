import type { BranchId, ExperienceItem } from "@/types/experience";
import { getBranch } from "./branches";

// Names and specialties are based on the public Saudi Dent team page. Branch assignment must be approved by management.
const team = [
  ["youssef-alqarni","أ. د. يوسف عبدالله القرني","استشاري جذور وأعصاب"],
  ["saad-alqahtani","أ.د. سعد محمد علي القحطاني","استشاري زراعة وأمراض اللثة"],
  ["mohammed-alqarni","أ.د. محمد القرني","بروفيسور واستشاري إصلاح وتجميل الأسنان"],
  ["amani-alqahtani","د. أماني شريف القحطاني","طبيب أسنان عام"],
  ["jamal-baathman","د. جمال عمر باعثمان","نائب تركيبات الأسنان"],
  ["khalil-ibrahim","د. خليل إبراهيم","أخصائي أول إصلاح وتجميل أسنان"],
  ["rawan-sorour","د. روان سرور","أخصائي تقويم الأسنان"],
  ["saeed-alsarhani","د. سعيد السرحاني","استشاري إصلاح وتجميل"],
  ["shabina-shafi","د. شابينا شافي","أخصائي طب أسنان الأطفال"],
  ["tareq-abdulkareem","د. طارق سعيد عبدالكريم","أخصائي طب أسنان الأسرة"],
  ["abdulilah-sindi","د. عبدالإله سمير سندي","استشاري جذور وأعصاب"],
  ["abdulghafour-naji","د. عبدالغفور ناجي","نائب تركيبات"],
  ["abdullah-farah","د. عبدالله أحمد فارع","نائب طب أسنان الأسرة"],
  ["fares-alrabeean","د. فارس الربيعان","طبيب أسنان عام"],
  ["mohammed-althabit","د. محمد آل ثابت","طبيب أسنان عام"],
  ["mohammed-thamer","د. محمد ثامر","استشاري إصلاح وتجميل وزراعة الأسنان"],
  ["mohammed-zarba","د. محمد عبدالله جابر زربه","استشاري تركيبات الأسنان"],
  ["mohammed-alattas","د. محمد علي العطاس","أخصائي تقويم الأسنان"],
  ["maryam-abdulmohsen","د. مريم عبدالمحسن","أخصائي جراحة الوجه والفكين"],
  ["maha-allabdan","د. مها آل لبدان","استشاري إصلاح وتجميل الأسنان"],
  ["haitham-asiri","د. هيثم عسيري","طب الأسنان العام"],
  ["yasser-alharmali","د. ياسر مسفر الحرملي","استشاري إصلاح وتجميل الأسنان"],
  ["ahmed-alshahrani","د. أحمد الشهراني","استشاري علاج الجذور وعصب الأسنان"],
  ["khalid-mujthel","د. خالد مجثل","طبيب أسنان عام"],
  ["razan-alhajari","د. رزان الحجري","طبيب أسنان عام"],
  ["salem-alqahtani","د. سالم القحطاني","طبيب أسنان عام"],
  ["sami-alawwadh","د. سامي آل عواض","أخصائي علاج عصب وجذور الأسنان"],
  ["salman-alqahtani","د. سلمان القحطاني","أخصائي أول إصلاح وتجميل أسنان"],
  ["abdulkhaleq-alshadidi","د. عبدالخالق الشديدي","استشاري التركيبات"],
  ["abdulaziz-asiri","د. عبدالعزيز عسيري","استشاري التركيبات"],
  ["ali-alqahtani","د. علي القحطاني","استشاري تقويم الأسنان"],
  ["moayad-alqaysi","د. مؤيد القيسي","طبيب أسنان عام"],
] as const;

const initials=(name:string)=>name.replace(/^(أ\.د\.|أ\. د\.|د\.)\s*/,"").split(/\s+/).slice(0,2).map(v=>v[0]).join("");
export function getDoctors(branchId: BranchId): ExperienceItem[] {
  const branch=getBranch(branchId); const imgs=branch.galleryImages;
  return team.map(([id,title,specialty], index)=>({
    id, slug:id, title, subtitle:specialty,
    description:`تعريف بالطبيب ${title} وتخصصه ضمن فريق سعودي دنت. ربط جدول الطبيب بالفرع والمواعيد يحتاج اعتماد إدارة سعودي دنت.`,
    shortDescription:specialty, coverImage:imgs[index%imgs.length] ?? branch.heroImage,
    gallery:[imgs[index%imgs.length],imgs[(index+1)%imgs.length],imgs[(index+3)%imgs.length]].filter(Boolean),
    features:[specialty,"ضمن نخبة أطباء سعودي دنت"], services:["عرض التخصص", "معلومات الطبيب"],
    status:"approved", theme:"restaurant", targetScene:"restaurant-detail", icon:"doctor",
    visualType:"profile", initials:initials(title),
  }));
}
