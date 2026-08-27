import type { Metadata } from "next";
import { KhamisFirstPersonTour } from "@/components/saudident/KhamisFirstPersonTour";

export const metadata: Metadata = {
  title: "جولة خميس مشيط | سعودي دنت",
  description: "نموذج أولي لجولة حرة بمنظور الشخص الأول داخل فرع سعودي دنت بخميس مشيط.",
};

export default function KhamisWalkPage() {
  return <KhamisFirstPersonTour />;
}
