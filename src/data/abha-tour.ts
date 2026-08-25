export const abhaTourScenes = Array.from({ length: 11 }, (_, index) => {
  const number = index + 1;
  return {
    id: `abha-${String(number).padStart(2, "0")}`,
    number,
    image: `/assets/branches/abha/tour/abha-tour-${String(number).padStart(2, "0")}.webp`,
    alt: `المشهد رقم ${number} من الجولة التفاعلية داخل فرع سعودي دنت بأبها`,
  };
});

export type AbhaTourItemKind =
  | "arrow"
  | "clinic"
  | "sterilization"
  | "radiology"
  | "lounge"
  | "reception"
  | "prayer"
  | "examination"
  | "administration";

export type AbhaTourOverlay = {
  id: string;
  sceneId: string;
  kind: AbhaTourItemKind;
  x: number;
  y: number;
  scale: number;
  angle: number;
  tilt: number;
  depth: number;
  required?: boolean;
  targetSceneNumber?: number;
};

export const abhaTourItemLabels: Record<AbhaTourItemKind, string> = {
  arrow: "سهم انتقال",
  clinic: "عيادة",
  sterilization: "تعقيم",
  radiology: "أشعة",
  lounge: "استراحة",
  reception: "استقبال",
  prayer: "مصلى",
  examination: "فحص",
  administration: "مكتب إداري",
};
