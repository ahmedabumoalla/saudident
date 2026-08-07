"use client";
import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { useExperienceStore } from "@/store/use-experience-store";
import { CollectionScene } from "@/components/scenes/collection-scene";
import { DetailScene } from "@/components/scenes/detail-scene";
import { getBranch } from "@/data/branches";
import { getBranchSections } from "@/data/branch-sections";
import { getClinics } from "@/data/clinics";
import { getDoctors } from "@/data/doctors";
import { getServices } from "@/data/services";
import { getFacilities } from "@/data/facilities";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function SceneStage() {
 const scene=useExperienceStore(s=>s.scene), selectedId=useExperienceStore(s=>s.selectedId), branchId=useExperienceStore(s=>s.activeBranchId);
 const root=useRef<HTMLDivElement>(null), reduced=usePrefersReducedMotion();
 const branch=getBranch(branchId), clinics=getClinics(branch.id), doctors=getDoctors(branch.id), services=getServices(branch.id), facilities=getFacilities(branch.id);
 useGSAP(()=>{if(!root.current)return;const targets=root.current.querySelectorAll("[data-reveal], .item-card, .detail-copy");gsap.fromTo(root.current,{opacity:0},{opacity:1,duration:reduced ? 0.12 : 0.36,ease:"power2.out"});if(targets.length&&!reduced)gsap.fromTo(targets,{opacity:0,y:8},{opacity:1,y:0,duration:.42,stagger:.035,ease:"power2.out",delay:.04});},{scope:root,dependencies:[scene,selectedId,branchId,reduced],revertOnUpdate:true});
 let content:React.ReactNode;
 if(scene==="hospital") content=<CollectionScene eyebrow="داخل الفرع" title={branch.title} description={`${branch.description} — ${branch.address}`} hero={branch.heroImage} items={getBranchSections(branch.id)} theme="hospital" branch={branch}/>;
 else if(scene==="clinics") content=<CollectionScene eyebrow={branch.title} title="العيادات والتخصصات" description="طب الأسنان تحت سقف واحد؛ اختر التخصص لاستعراضه داخل تجربة الفرع." hero={branch.galleryImages[2]??branch.heroImage} items={clinics} theme="hospital"/>;
 else if(scene==="restaurants") content=<CollectionScene eyebrow={branch.title} title="نخبة الأطباء" description="تعرّف على فريق سعودي دنت وتخصصاته. صور الأطباء وربطهم بالفرع تُضاف بعد اعتماد الإدارة." hero={branch.galleryImages[1]??branch.heroImage} items={doctors} theme="restaurant"/>;
 else if(scene==="sports") content=<CollectionScene eyebrow={branch.title} title="الخدمات" description="استكشف خدمات سعودي دنت العلاجية والتجميلية ضمن رحلة بصرية واضحة." hero={branch.galleryImages[3]??branch.heroImage} items={services} theme="sports"/>;
 else if(scene==="gallery") content=<CollectionScene eyebrow={branch.title} title="جولة داخل الفرع" description="تنقّل بين الاستقبال وصالات الانتظار وغرف العلاج والمرافق الداخلية." hero={branch.galleryImages[0]??branch.heroImage} items={facilities} theme="hospital"/>;
 else {const source=scene==="hospital-facility"?facilities:scene==="clinic-detail"?clinics:scene==="restaurant-detail"?doctors:services;const item=source.find(e=>e.id===selectedId)??source[0];content=<DetailScene item={item}/>;}
 return <div ref={root} className="scene-stage" key={`${scene}-${branchId}-${selectedId??""}`}>{content}</div>;
}
