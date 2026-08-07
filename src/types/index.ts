export type BranchSlug = "abha" | "khamis-mushait";

export type GalleryImage = {
  src: string;
  alt: string;
  category: "reception" | "treatment" | "waiting" | "laboratory" | "kids" | "interior";
};

export type Department = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  services: string[];
};

export type Doctor = {
  name: string;
  specialty: string;
  bio: string;
  experience: number;
  image: string;
  branch: BranchSlug;
};

export type Branch = {
  id: number;
  slug: BranchSlug;
  name: string;
  city: string;
  address: string;
  description: string;
  coordinates: { lat: number; lng: number; x: number; y: number };
  heroImage: string;
  heroFallback: string;
  cardImage: string;
  gallery: GalleryImage[];
  stats: { label: string; value: string }[];
  departments: Department[];
  doctors: Doctor[];
};
