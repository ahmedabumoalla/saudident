"use client";

import { MapPin } from "lucide-react";
import type { Branch } from "@/data/branches";
import { getGoogleMapsUrl } from "@/lib/maps";
import { useExperienceStore } from "@/store/use-experience-store";

export function BranchLocationButton({ branch, className = "" }: { branch: Branch; className?: string }) {
  const demoPlaying = useExperienceStore((state) => state.isDemoPlaying);
  if (demoPlaying) return null;
  return <a className={`branch-location-button ${className}`.trim()} href={getGoogleMapsUrl(branch.coordinates.latitude, branch.coordinates.longitude)} target="_blank" rel="noopener noreferrer" aria-label={`فتح موقع فرع ${branch.city} في خرائط Google`}><MapPin /><span>موقع الفرع</span></a>;
}
