"use client";

import { ArrowRight } from "lucide-react";
import { useExperienceStore } from "@/store/use-experience-store";

export function BackButton({ onClick, className = "", label = "رجوع" }: { onClick: () => void; className?: string; label?: string }) {
  const demoMode = useExperienceStore((state) => state.isDemoPlaying);
  if (demoMode) return null;
  return <button className={`scene-back-button ${className}`.trim()} type="button" onClick={onClick} aria-label={label}><ArrowRight /><span>{label}</span></button>;
}
