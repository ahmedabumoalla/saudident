import { CinematicExperience } from "@/components/saudident/CinematicExperience";
import { CinematicScreenExperience } from "@/components/saudident/CinematicScreenExperience";
import { MapFirstExperience } from "@/components/saudident/MapFirstExperience";

const ACTIVE_HOME_EXPERIENCE: "map-first" | "legacy" = "map-first";
const CINEMATIC_SCREEN_PRESENTATION_ENABLED = true;

export default function Home() {
  if (ACTIVE_HOME_EXPERIENCE === "legacy") return <CinematicExperience />;
  return CINEMATIC_SCREEN_PRESENTATION_ENABLED
    ? <CinematicScreenExperience />
    : <MapFirstExperience />;
}
