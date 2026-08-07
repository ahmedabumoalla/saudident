import type { BranchId, ExperienceItem, ExperienceIconName } from "@/types/experience";
import { getBranch } from "./branches";
const defs:Array<[string,string,ExperienceIconName,string,string[]]> = [
 ["implant-service","زراعة الأسنان","implant","تعويض الأسنان المفقودة بخيارات زراعة حديثة.",["تقييم شامل","خطة زراعة"]],
 ["prosthodontics-service","تركيبات الأسنان","tooth","تركيبات ثابتة ومتحركة لاستعادة الوظيفة والجمال.",["تيجان وجسور","تعويض الأسنان"]],
 ["root-service","علاج الجذور وعصب الأسنان","root-canal","علاج القنوات الجذرية والمحافظة على الأسنان المتضررة.",["تشخيص دقيق","علاج العصب"]],
 ["tmj-service","أمراض الفم والمفصل الصدغي","microscope","تقييم اضطرابات الفم والمفصل الصدغي الفكي.",["فحص الفم","تقييم المفصل"]],
 ["fillings-service","الحشوات الطبية والتجميلية","treatment","ترميم الأسنان المتضررة بحشوات مناسبة للحالة.",["حشوات طبية","حشوات تجميلية"]],
 ["pediatric-service","طب أسنان الأطفال","baby","رعاية وقائية وعلاجية مخصصة للأطفال.",["وقاية مبكرة","علاج متخصص"]],
 ["orthodontics-service","تقويم الأسنان","orthodontics","خطط تقويم لتحسين اصطفاف الأسنان وعلاقة الفكين.",["تشخيص التقويم","متابعة الخطة"]],
 ["smile-service","ابتسامة هوليوود","sparkles","حلول تجميلية مصممة لتحسين مظهر الابتسامة.",["تصميم الابتسامة","قشور تجميلية"]],
];
export const services: Array<[string, string]> = defs.map(([, title, , description]) => [title, description]);
export function getServices(branchId:BranchId):ExperienceItem[]{const b=getBranch(branchId),imgs=b.galleryImages;return defs.map(([id,title,icon,description,features],i)=>({id,slug:id,title,subtitle:"خدمة سعودي دنت",description,shortDescription:features.join(" • "),coverImage:imgs[(i+2)%imgs.length]??b.heroImage,gallery:[imgs[(i+2)%imgs.length],imgs[(i+4)%imgs.length],imgs[i%imgs.length]].filter(Boolean),features,services:["تعريف بالخدمة","استعراض بيئة العلاج"],status:"approved",theme:"sports",targetScene:"sport-detail",icon}));}
