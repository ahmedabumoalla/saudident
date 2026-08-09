"use client";

import Image from "next/image";
import { ArrowUpLeft, Download } from "lucide-react";

import { saudident } from "@/data/saudident";

const appScreens = [
  {
    src: "/media/app/app-screen-1.webp",
    width: 289,
    height: 592,
    alt: "الشاشة الرئيسية في تطبيق سعودي دنت",
  },
  {
    src: "/media/app/app-screen-2.webp",
    width: 297,
    height: 592,
    alt: "شاشة قائمة الأطباء في تطبيق سعودي دنت",
  },
  {
    src: "/media/app/app-screen-3.webp",
    width: 307,
    height: 592,
    alt: "شاشة تفاصيل حجز موعد في تطبيق سعودي دنت",
  },
] as const;

export function AppShowcase() {
  return (
    <section id="app" className="sd-app" aria-labelledby="sd-app-title" dir="rtl">
      <div className="sd-section-shell sd-app__layout">
        <div className="sd-app__copy" data-reveal>
          <div className="sd-app__identity">
            <Image
              src="/media/app/app-icon.png"
              width={480}
              height={480}
              alt="أيقونة تطبيق سعودي دنت الرسمية"
              className="sd-app__icon"
            />
          </div>

          <p className="sd-section-kicker">تطبيق سعودي دنت</p>
          <h2 id="sd-app-title">القرار قرارك</h2>
          <p className="sd-app__description">{saudident.app.description}</p>

          <div className="sd-app__actions" aria-label="روابط تنزيل تطبيق سعودي دنت">
            <a
              className="sd-store-link"
              href={saudident.app.googlePlay}
              target="_blank"
              rel="noreferrer"
              aria-label="تنزيل تطبيق سعودي دنت من Google Play — يفتح في نافذة جديدة"
            >
              <Download aria-hidden="true" />
              <span>
                <small>متوفر على</small>
                Google Play
              </span>
              <ArrowUpLeft aria-hidden="true" />
            </a>
            <a
              className="sd-store-link"
              href={saudident.app.appStore}
              target="_blank"
              rel="noreferrer"
              aria-label="تنزيل تطبيق سعودي دنت من App Store — يفتح في نافذة جديدة"
            >
              <Download aria-hidden="true" />
              <span>
                <small>حمّله من</small>
                App Store
              </span>
              <ArrowUpLeft aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="sd-app__screens" aria-label="لقطات رسمية من تطبيق سعودي دنت" data-reveal>
          <div className="sd-app__screens-glow" aria-hidden="true" />
          {appScreens.map((screen, index) => (
            <figure
              key={screen.src}
              className={`sd-app__screen sd-app__screen--${index + 1}`}
            >
              <Image
                src={screen.src}
                width={screen.width}
                height={screen.height}
                alt={screen.alt}
                sizes="(max-width: 720px) 44vw, 18vw"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
