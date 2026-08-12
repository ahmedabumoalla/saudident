export type FloorHotspotKind =
  | "clinic"
  | "reception"
  | "waiting"
  | "admin"
  | "patient-relations"
  | "customer-service"
  | "coffee"
  | "radiology"
  | "sterilization"
  | "prayer"
  | "meeting"
  | "kids"
  | "restroom"
  | "storage"
  | "elevator";

export type ClinicCategory =
  | "root-canal"
  | "implant"
  | "prostho"
  | "orthodontics"
  | "general"
  | "family"
  | "restorative"
  | "examination";

export type FloorGalleryImage = {
  src: string;
  alt: string;
  label: string;
};

export type FloorHotspot = {
  id: string;
  x: number;
  y: number;
  kind: FloorHotspotKind;
  title: string;
  demoOrder: number;
  clinicCategory?: ClinicCategory;
  description?: string;
  gallery?: FloorGalleryImage[];
};

export type DemoDetailFrame =
  | "doctor"
  | "services"
  | "offers"
  | "equipment"
  | "photo"
  | "booking"
  | "info";

export const FLOOR_MAP_DEBUG = false;
export const FLOOR_MAP_ASPECT_RATIO = 1448 / 1086;
export const DEMO_CONTENT_MS = 3000;

const receptionGallery: FloorGalleryImage[] = [
  { src: "/assets/branches/khamis-mushait/reception.webp", alt: "الاستقبال في فرع خميس مشيط", label: "الاستقبال" },
  { src: "/assets/branches/khamis-mushait/logo-lobby.webp", alt: "ردهة شعار سعودي دنت في فرع خميس مشيط", label: "ردهة الفرع" },
  { src: "/assets/branches/khamis-mushait/waiting.webp", alt: "منطقة الانتظار في فرع خميس مشيط", label: "منطقة الانتظار" },
];

const waitingGallery: FloorGalleryImage[] = [
  { src: "/assets/branches/khamis-mushait/waiting.webp", alt: "منطقة انتظار في فرع خميس مشيط", label: "منطقة انتظار" },
];

export const khamisFloorHotspots: FloorHotspot[] = [
  { id: "meeting-room", x: 19.8, y: 16.2, kind: "meeting", title: "غرفة الاجتماعات", demoOrder: 1, description: "مساحة اجتماعات إدارية." },
  { id: "admin-office", x: 33.6, y: 8.2, kind: "admin", title: "الإدارة", demoOrder: 2, description: "مساحة العمل الإداري في الفرع." },
  { id: "patient-relations", x: 41.8, y: 8.2, kind: "patient-relations", title: "علاقات المرضى", demoOrder: 3, description: "خدمة ملاحظات واستفسارات المراجعين." },

  { id: "root-canal-01", x: 49.4, y: 8.5, kind: "clinic", title: "عيادة علاج الجذور 1", clinicCategory: "root-canal", demoOrder: 4 },
  { id: "root-canal-02", x: 57.0, y: 8.5, kind: "clinic", title: "عيادة علاج الجذور 2", clinicCategory: "root-canal", demoOrder: 5 },
  { id: "root-canal-03", x: 64.5, y: 8.5, kind: "clinic", title: "عيادة علاج الجذور 3", clinicCategory: "root-canal", demoOrder: 6 },
  { id: "root-canal-04", x: 71.4, y: 8.5, kind: "clinic", title: "عيادة علاج الجذور 4", clinicCategory: "root-canal", demoOrder: 7 },
  { id: "family-clinic", x: 81.2, y: 9.8, kind: "clinic", title: "عيادة طب أسنان الأسرة", clinicCategory: "family", demoOrder: 8 },

  { id: "implant-01", x: 29.3, y: 22.0, kind: "clinic", title: "عيادة زراعة الأسنان 1", clinicCategory: "implant", demoOrder: 9 },
  { id: "implant-02", x: 36.0, y: 22.0, kind: "clinic", title: "عيادة زراعة الأسنان 2", clinicCategory: "implant", demoOrder: 10 },
  { id: "admin-upper-02", x: 43.1, y: 22.0, kind: "admin", title: "الإدارة", demoOrder: 11, description: "مساحة العمل الإداري في الفرع." },
  { id: "restroom-01", x: 51.6, y: 22.5, kind: "restroom", title: "دورات المياه 1", demoOrder: 12 },
  { id: "restroom-02", x: 51.6, y: 33.0, kind: "restroom", title: "دورات المياه 2", demoOrder: 13 },
  { id: "examination-01", x: 65.0, y: 22.5, kind: "clinic", title: "غرفة الفحص 1", clinicCategory: "examination", demoOrder: 14 },
  { id: "examination-02", x: 71.2, y: 22.5, kind: "clinic", title: "غرفة الفحص 2", clinicCategory: "examination", demoOrder: 15 },
  { id: "waiting-north", x: 82.4, y: 20.8, kind: "waiting", title: "منطقة الانتظار الشمالية", demoOrder: 16, gallery: waitingGallery },

  { id: "prostho-01", x: 14.7, y: 35.5, kind: "clinic", title: "عيادة التركيبات 1", clinicCategory: "prostho", demoOrder: 17 },
  { id: "waiting-middle-left", x: 40.4, y: 36.7, kind: "waiting", title: "منطقة انتظار", demoOrder: 17.5, gallery: waitingGallery },
  { id: "prostho-02", x: 13.8, y: 49.5, kind: "clinic", title: "عيادة التركيبات 2", clinicCategory: "prostho", demoOrder: 18 },
  { id: "prostho-03", x: 12.8, y: 64.5, kind: "clinic", title: "عيادة التركيبات 3", clinicCategory: "prostho", demoOrder: 19 },
  { id: "prostho-04", x: 11.7, y: 83.0, kind: "clinic", title: "عيادة التركيبات 4", clinicCategory: "prostho", demoOrder: 20 },

  { id: "kids-area", x: 33.2, y: 50.5, kind: "kids", title: "منطقة لعب الأطفال", demoOrder: 21, gallery: [{ src: "/assets/branches/khamis-mushait/kids-area.webp", alt: "منطقة لعب الأطفال في فرع خميس مشيط", label: "منطقة لعب الأطفال" }] },
  { id: "general-01", x: 38.2, y: 51.0, kind: "clinic", title: "عيادة طب الأسنان العام 1", clinicCategory: "general", demoOrder: 22 },
  { id: "general-02", x: 44.0, y: 51.0, kind: "clinic", title: "عيادة طب الأسنان العام 2", clinicCategory: "general", demoOrder: 23 },
  { id: "reception-main", x: 34.0, y: 58.7, kind: "reception", title: "الاستقبال الرئيسي", demoOrder: 24, gallery: receptionGallery },
  { id: "employee-affairs", x: 24.1, y: 61.2, kind: "admin", title: "شؤون الموظفين", demoOrder: 24.5, description: "مكتب شؤون الموظفين في الفرع." },
  { id: "reception-secondary", x: 64.8, y: 63.2, kind: "reception", title: "الاستقبال الثاني", demoOrder: 25, gallery: receptionGallery },
  { id: "storage-upper-center", x: 52.3, y: 63.0, kind: "storage", title: "المستودع", demoOrder: 25.5, description: "مساحة تشغيلية مخصصة للتخزين." },
  { id: "customer-service", x: 55.4, y: 62.5, kind: "customer-service", title: "خدمة العملاء", demoOrder: 26, description: "المساعدة في المواعيد والاستفسارات." },
  { id: "waiting-main", x: 42.0, y: 63.7, kind: "waiting", title: "منطقة الانتظار الرئيسية", demoOrder: 27, gallery: waitingGallery },
  { id: "elevator", x: 52.1, y: 69.0, kind: "elevator", title: "المصعد", demoOrder: 28, description: "نقطة الوصول الرئيسية للفرع." },
  { id: "radiology", x: 73.2, y: 40.4, kind: "radiology", title: "الأشعة المركزية", demoOrder: 29 },
  { id: "storage-center-right", x: 74.3, y: 63.0, kind: "storage", title: "المستودع", demoOrder: 30, description: "مساحة تشغيلية مخصصة للتخزين." },
  { id: "prayer-room", x: 84.0, y: 59.5, kind: "prayer", title: "المصلى", demoOrder: 31 },

  { id: "orthodontics-01", x: 84.2, y: 35.5, kind: "clinic", title: "عيادة تقويم الأسنان 1", clinicCategory: "orthodontics", demoOrder: 32 },
  { id: "orthodontics-02", x: 84.0, y: 49.7, kind: "clinic", title: "عيادة تقويم الأسنان 2", clinicCategory: "orthodontics", demoOrder: 33 },
  { id: "restorative-01", x: 83.8, y: 68.0, kind: "clinic", title: "عيادة الإصلاح والتجميل 1", clinicCategory: "restorative", demoOrder: 34 },
  { id: "restorative-02", x: 83.8, y: 83.4, kind: "clinic", title: "عيادة الإصلاح والتجميل 2", clinicCategory: "restorative", demoOrder: 35 },

  { id: "admin-area", x: 29.0, y: 85.0, kind: "admin", title: "المنطقة الإدارية", demoOrder: 36, description: "منطقة العمل الإداري في الفرع." },
  { id: "storage", x: 41.5, y: 89.0, kind: "storage", title: "المستودع", demoOrder: 37 },
  { id: "waiting-south", x: 54.5, y: 89.0, kind: "waiting", title: "منطقة الانتظار الجنوبية", demoOrder: 38, gallery: waitingGallery },
  { id: "implant-03", x: 59.4, y: 88.0, kind: "clinic", title: "عيادة زراعة الأسنان 3", clinicCategory: "implant", demoOrder: 39 },
  { id: "implant-04", x: 66.0, y: 88.0, kind: "clinic", title: "عيادة زراعة الأسنان 4", clinicCategory: "implant", demoOrder: 40 },
  { id: "implant-05", x: 79.1, y: 88.0, kind: "clinic", title: "عيادة زراعة الأسنان 5", clinicCategory: "implant", demoOrder: 41 },
  { id: "implant-06", x: 87.0, y: 88.0, kind: "clinic", title: "عيادة زراعة الأسنان 6", clinicCategory: "implant", demoOrder: 42 },
  { id: "sterilization", x: 73.0, y: 88.0, kind: "sterilization", title: "منطقة التعقيم", demoOrder: 43, description: "منطقة تجهيز وتعقيم الأدوات." },
];

// Presentation-only clinic assignment.
// Replace with Saudi Dent verified room roster before production.
export const prototypeClinicDoctorAssignments: Record<ClinicCategory, string[]> = {
  "root-canal": ["youssef-alqarni", "abdulilah-sindi", "ahmed-alshahrani", "sami-alawwadh"],
  implant: ["saad-alqahtani", "mohammed-thamer"],
  prostho: ["jamal-baathman", "abdulghafour-naji", "mohammed-zarba", "abdulkhaleq-alshadidi"],
  orthodontics: ["mohammed-alattas"],
  general: ["fares-alrabeean", "mohammed-althabit", "haitham-asiri", "khalid-mujthel", "razan-alhajari"],
  family: ["tareq-abdulkareem", "abdullah-farah"],
  restorative: ["mohamed-alqarni", "khalil-ibrahim", "saeed-alsarhani", "yasser-alharmali"],
  examination: ["fares-alrabeean", "mohammed-althabit"],
};

export const clinicServiceAssignments: Record<ClinicCategory, string[]> = {
  "root-canal": ["root-canal"],
  implant: ["implants", "gum"],
  prostho: ["prostho"],
  orthodontics: ["braces"],
  general: ["oral", "fillings"],
  family: ["oral", "fillings", "pediatric"],
  restorative: ["fillings", "smile"],
  examination: ["oral", "fillings"],
};

// Presentation-only equipment grouping.
// Replace with Saudi Dent verified room equipment inventory before production.
export const prototypeEquipment: Record<ClinicCategory, string[]> = {
  "root-canal": ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "نظام الشفط", "أدوات الفحص الأساسية"],
  implant: ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "نظام الشفط", "أدوات الفحص الأساسية"],
  prostho: ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "نظام الشفط", "أدوات الفحص الأساسية"],
  orthodontics: ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "نظام الشفط", "أدوات الفحص الأساسية"],
  general: ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "نظام الشفط", "أدوات الفحص الأساسية"],
  family: ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "نظام الشفط", "أدوات الفحص الأساسية"],
  restorative: ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "نظام الشفط", "أدوات الفحص الأساسية"],
  examination: ["وحدة وكرسي الأسنان", "وحدة إضاءة العلاج", "أدوات الفحص الأساسية"],
};
