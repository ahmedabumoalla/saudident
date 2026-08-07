import type { BranchId, ExperienceItem } from "@/types/experience";

export type Branch = ExperienceItem & {
  id: BranchId;
  city: string;
  address: string;
  heroImage: string;
  galleryImages: string[];
  coordinates: {
    longitude: number;
    latitude: number;
  };
};

export const branches: Branch[] = [
  {
    id: "abha", slug: "abha", title: "فرع أبها", city: "أبها",
    address: "طريق الملك عبدالعزيز، حي الأندلس",
    subtitle: "سعودي دنت — أبها",
    description: "جولة تفاعلية داخل فرع سعودي دنت في أبها، من الاستقبال وصالات الانتظار إلى غرف العلاج وممرات العيادات.",
    shortDescription: "العيادات والأطباء والخدمات",
    coverImage: "/assets/branches/abha/branch-hero.webp",
    heroImage: "/assets/branches/abha/branch-hero.webp",
    galleryImages: [
      "/assets/branches/abha/reception.webp", "/assets/branches/abha/waiting-main.webp",
      "/assets/branches/abha/clinic-room.webp", "/assets/branches/abha/clinic-corridor.webp",
      "/assets/branches/abha/lobby-screen.webp", "/assets/branches/abha/waiting-entrance.webp",
    ],
    gallery: ["/assets/branches/abha/branch-hero.webp", "/assets/branches/abha/reception.webp", "/assets/branches/abha/clinic-room.webp"],
    features: [], services: [],
    stats: [{ label: "المدينة", value: "أبها" }, { label: "التجربة", value: "تفاعلية" }],
    status: "approved", theme: "hospital", targetScene: "hospital",
    coordinates: { longitude: 42.5187524, latitude: 18.2085432 },
    point: { x: 0.359, y: 0.621 }, cameraTarget: { x: 0.359, y: 0.621, scale: 1.65 },
    icon: "tooth", hotspotAlign: "end",
  },
  {
    id: "khamis-mushait", slug: "khamis-mushait", title: "فرع خميس مشيط", city: "خميس مشيط",
    address: "حي الخالدية، خميس مشيط",
    subtitle: "سعودي دنت — خميس مشيط",
    description: "استكشف مبنى سعودي دنت في خميس مشيط ومرافقه الداخلية، بما يشمل الاستقبال والعيادات والمختبر ومنطقة الأطفال.",
    shortDescription: "المبنى والمرافق والتخصصات",
    coverImage: "/assets/branches/khamis-mushait/branch-hero.webp",
    heroImage: "/assets/branches/khamis-mushait/branch-hero.webp",
    galleryImages: [
      "/assets/branches/khamis-mushait/exterior-wide.webp", "/assets/branches/khamis-mushait/logo-lobby.webp",
      "/assets/branches/khamis-mushait/reception.webp", "/assets/branches/khamis-mushait/clinic-room.webp",
      "/assets/branches/khamis-mushait/laboratory.webp", "/assets/branches/khamis-mushait/kids-area.webp",
      "/assets/branches/khamis-mushait/waiting.webp", "/assets/branches/khamis-mushait/glass-lab.webp",
    ],
    gallery: ["/assets/branches/khamis-mushait/branch-hero.webp", "/assets/branches/khamis-mushait/logo-lobby.webp", "/assets/branches/khamis-mushait/reception.webp"],
    features: [], services: [],
    stats: [{ label: "المدينة", value: "خميس مشيط" }, { label: "الصور", value: "+9" }],
    status: "approved", theme: "hospital", targetScene: "hospital",
    coordinates: { longitude: 42.6963958, latitude: 18.3042106 },
    point: { x: 0.661, y: 0.333 }, cameraTarget: { x: 0.661, y: 0.333, scale: 1.65 },
    icon: "tooth", hotspotAlign: "start",
  },
];

export const campusDestinations = branches;
export function getBranch(id?: string) { return branches.find((branch) => branch.id === id) ?? branches[1]; }
