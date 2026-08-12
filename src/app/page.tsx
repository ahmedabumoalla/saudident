import { CinematicExperience } from "@/components/saudident/CinematicExperience";
import { MapFirstExperience } from "@/components/saudident/MapFirstExperience";

const ACTIVE_HOME_EXPERIENCE: "map-first" | "legacy" = "map-first";

export default function Home() {
  return ACTIVE_HOME_EXPERIENCE === "map-first"
    ? <MapFirstExperience />
    : <CinematicExperience />;
}
