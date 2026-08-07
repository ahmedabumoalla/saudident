import type { BranchId, ExperienceItem, ExperienceIconName } from "@/types/experience";
import { getBranch } from "./branches";
const labels:Array<[string,string,ExperienceIconName,string]> = [
 ["reception","الاستقبال","reception","بداية رحلة الزائر داخل الفرع"],
 ["waiting","صالات الانتظار","waiting","مساحات انتظار مريحة ومنظمة"],
 ["treatment-rooms","غرف العلاج","treatment","بيئة العلاج وتجهيزات العيادات"],
 ["corridors","ممرات العيادات","building","مسار واضح بين غرف الأطباء"],
 ["laboratory","المختبر والتجهيزات","lab","المختبر والمناطق المساندة"],
 ["kids-area","منطقة الأطفال","baby","مساحة مخصصة لتجربة الأطفال"],
];
export function getFacilities(branchId:BranchId):ExperienceItem[]{const b=getBranch(branchId),imgs=b.galleryImages;return labels.map(([id,title,icon,desc],i)=>({id,slug:id,title,subtitle:"جولة داخل الفرع",description:desc,shortDescription:"افتح معرض الصور",coverImage:imgs[i%imgs.length]??b.heroImage,gallery:[imgs[i%imgs.length],imgs[(i+1)%imgs.length],imgs[(i+2)%imgs.length]].filter(Boolean),features:[desc,"صور حقيقية من الفرع"],services:["جولة بصرية","استعراض الصور"],status:"approved",theme:"hospital",targetScene:"hospital-facility",icon}));}
