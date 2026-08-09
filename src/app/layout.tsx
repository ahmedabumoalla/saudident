import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

const saudiDentArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-sd-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "سعودي دنت | Saudi Dent",
  description: "سعودي دنت — طب الأسنان الحديث بتخصصاته تحت سقف واحد في خميس مشيط وأبها.",
  applicationName: "سعودي دنت",
  metadataBase: new URL("https://saudident.sa"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "سعودي دنت | Saudi Dent",
    description: "كُن مع الصفوة — خدمات طب الأسنان الحديث بخبرات متخصصة.",
    url: "/",
    siteName: "سعودي دنت",
    locale: "ar_SA",
    type: "website",
  },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "سعودي دنت" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#02070b",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body className={saudiDentArabic.variable}>{children}</body></html>;
}
