"use client";

import { ChevronLeft, MapPinned } from "lucide-react";
import { useExperienceStore } from "@/store/use-experience-store";
import { getBranch } from "@/data/branches";
import { getBranchSections } from "@/data/branch-sections";
import { getClinics } from "@/data/clinics";
import { getDoctors } from "@/data/doctors";
import { getServices } from "@/data/services";
import { getFacilities } from "@/data/facilities";

const roots: Record<string, string> = { hospital: "الفرع", clinics: "العيادات", restaurants: "الأطباء", sports: "الخدمات", gallery: "جولة الفرع" };

export function Breadcrumbs() {
  const scene = useExperienceStore((state) => state.scene);
  const selectedId = useExperienceStore((state) => state.selectedId);
  const branchId = useExperienceStore((state) => state.activeBranchId);
  if (scene === "campus") return null;
  const branch = getBranch(branchId);
  const all = [...getBranchSections(branch.id), ...getClinics(branch.id), ...getDoctors(branch.id), ...getServices(branch.id), ...getFacilities(branch.id)];
  const selected = all.find((item) => item.id === selectedId)?.title;
  const root = scene === "clinic-detail" ? "العيادات" : scene === "restaurant-detail" ? "الأطباء" : scene === "sport-detail" ? "الخدمات" : scene === "hospital-facility" ? "جولة الفرع" : roots[scene] ?? "الفرع";
  return <div className="breadcrumbs" aria-label="مسار التنقل"><MapPinned /><span>سعودي دنت</span><ChevronLeft /><strong>{branch.title}</strong>{root !== "الفرع" && <><ChevronLeft /><b>{root}</b></>}{selected && selected !== root && !["clinics", "doctors", "services", "tour"].includes(selectedId ?? "") && <><ChevronLeft /><b>{selected}</b></>}</div>;
}
