export type SceneId =
  | "campus"
  | "hospital"
  | "hospital-facility"
  | "clinics"
  | "clinic-detail"
  | "restaurants"
  | "restaurant-detail"
  | "sports"
  | "sport-detail"
  | "gallery";

export type BranchId = "abha" | "khamis-mushait";
export type ContentStatus = "draft" | "approved";
export type NormalizedPoint = { x: number; y: number };
export type CameraTarget = { x: number; y: number; scale: number };
export type GeographicCoordinates = { longitude: number; latitude: number };
export type ThemeId = "campus" | "hospital" | "restaurant" | "sports";
export type ExperienceIconName =
  | "activity" | "baby" | "bone" | "building" | "calendar" | "camera"
  | "dentistry" | "doctor" | "implant" | "lab" | "map-pin" | "microscope"
  | "orthodontics" | "phone" | "reception" | "root-canal" | "shield"
  | "sparkles" | "tooth" | "treatment" | "waiting";

export type ExperienceStat = { label: string; value: string };

export type ExperienceItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  gallery: string[];
  features: string[];
  services: string[];
  status: ContentStatus;
  theme: ThemeId;
  targetScene: SceneId;
  point?: NormalizedPoint;
  coordinates?: GeographicCoordinates;
  cameraTarget?: CameraTarget;
  accent?: string;
  stats?: ExperienceStat[];
  icon?: ExperienceIconName;
  coverPosition?: string;
  galleryPositions?: string[];
  hotspotAlign?: "start" | "end";
  visualType?: "image" | "profile";
  initials?: string;
};
