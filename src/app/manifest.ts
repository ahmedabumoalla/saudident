import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "سعودي دنت | Saudi Dent",
    short_name: "سعودي دنت",
    description: "طب الأسنان الحديث بتخصصاته تحت سقف واحد.",
    start_url: "/",
    display: "standalone",
    background_color: "#02070b",
    theme_color: "#073245",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
