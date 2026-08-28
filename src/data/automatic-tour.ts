export const AUTOMATIC_TOUR_TIMING = {
  idleBeforeStartMs: 5 * 60 * 1000,
  branchTransitionMs: 2200,
  sceneArrivalMs: 1250,
  dialogEnterMs: 920,
  featureDwellMs: 5600,
  featureEditorialDwellMs: 6400,
  featureRichDwellMs: 7200,
  dialogExitMs: 520,
  betweenFeaturesMs: 1350,
  routeResetMs: 1900,
} as const;

const RICH_KHAMIS_FEATURES = new Set<string>([
  "patient-relations",
  "lounge",
  "sterilization",
  "prayer-room",
  "women-lounge",
  "reception-right-lobby-reception",
]);

const EDITORIAL_KHAMIS_FEATURES = new Set<string>([
  "welcome",
  "equipment",
  "central-radiology",
  "administrative-office",
  "fourth-call-center",
  "fifth-preliminary-exam",
]);

export function getKhamisFeatureDwellMs(feature: string) {
  if (RICH_KHAMIS_FEATURES.has(feature)) return AUTOMATIC_TOUR_TIMING.featureRichDwellMs;
  if (EDITORIAL_KHAMIS_FEATURES.has(feature)) return AUTOMATIC_TOUR_TIMING.featureEditorialDwellMs;
  return AUTOMATIC_TOUR_TIMING.featureDwellMs;
}

export function getReadingDwellMs(...content: Array<string | undefined>) {
  const wordCount = content
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
  const readingTime = 1700 + wordCount * 220;
  return Math.min(7200, Math.max(5200, readingTime));
}

export const KHAMIS_AUTOMATIC_TOUR = {
  right: [
    { scene: "reception", features: ["patient-relations"] },
    { scene: "main-reception", features: ["welcome", "lounge", "clinic"] },
    {
      scene: "clinic-corridor",
      features: ["corridor-clinic-near", "corridor-clinic-mid", "corridor-clinic-far", "equipment", "sterilization"],
    },
    { scene: "prayer-corridor", features: ["prayer-room", "meeting-room"] },
    { scene: "xray-corridor", features: ["central-radiology", "xray-clinic", "women-lounge"] },
    { scene: "xray-corridor-next", features: ["next-clinic-left", "next-clinic-center", "next-clinic-right"] },
    { scene: "xray-corridor-third", features: ["third-corridor-lounge", "third-clinic-center", "third-clinic-right"] },
    { scene: "xray-corridor-fourth", features: ["fourth-call-center"] },
    {
      scene: "xray-corridor-fifth",
      features: ["fifth-orthodontics-left", "fifth-orthodontics-center", "fifth-orthodontics-right", "fifth-preliminary-exam"],
    },
    { scene: "khamis-lobby-side", features: ["khamis-side-lounge"] },
  ],
  left: [
    { scene: "left-lobby", features: ["administrative-office"] },
    { scene: "left-reception", features: ["left-reception-desk"] },
    {
      scene: "reception-hall",
      features: ["reception-hall-reception", "reception-hall-patient-relations", "reception-hall-lounge", "reception-hall-clinic"],
    },
    { scene: "implant-corridor", features: ["implant-corridor-clinic", "implant-corridor-clinic-right"] },
    {
      scene: "implant-unit-lobby",
      features: ["implant-unit-clinic-23", "implant-unit-clinic-24", "implant-unit-clinic-25", "implant-unit-reception", "implant-unit-lounge"],
    },
    { scene: "reception-right-corridor", features: ["reception-right-clinic-near", "reception-right-clinic-far"] },
    {
      scene: "reception-right-lobby",
      features: ["reception-right-lobby-clinic-near", "reception-right-lobby-clinic-far", "reception-right-lobby-lounge", "reception-right-lobby-reception"],
    },
  ],
} as const;

export type AutomaticKhamisFeature =
  | (typeof KHAMIS_AUTOMATIC_TOUR.right)[number]["features"][number]
  | (typeof KHAMIS_AUTOMATIC_TOUR.left)[number]["features"][number];
