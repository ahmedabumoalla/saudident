"use client";

import Image from "next/image";
import { Apple, ArrowRight, BadgePercent, CalendarDays, Play, Sparkles, Users, X } from "lucide-react";
import { useRef, useState } from "react";
import type { BranchSceneHotspot } from "@/data/branch-interactive-scenes";
import { prototypeClinicDoctorAssignments } from "@/data/khamis-floor-map";
import { doctors, saudident, services } from "@/data/saudident";
import { DentalIcon } from "@/components/saudident/icons/dental-icons";
import { gsap, useGSAP } from "@/lib/gsap";

type HubView = "home" | "doctors" | "appointments" | "services" | "offers";

type PremiumSceneDetailProps = {
  hotspot: BranchSceneHotspot;
  onClose: () => void;
};

const hubOptions = [
  { id: "doctors" as const, title: "الأطباء", icon: Users },
  { id: "appointments" as const, title: "المواعيد", icon: CalendarDays },
  { id: "services" as const, title: "أبرز الخدمات", icon: Sparkles },
  { id: "offers" as const, title: "العروض", icon: BadgePercent },
];

const mappedDoctorIds = new Set(Object.values(prototypeClinicDoctorAssignments).flat());
const khamisDoctors = doctors.filter((doctor) => mappedDoctorIds.has(doctor.id) && doctor.image).slice(0, 8);
const featuredServices = services.slice(0, 6);

function SaudiDentLogo() {
  return (
    <span className="sd-premium-detail__logo-wrap">
      <Image
        className="sd-premium-detail__logo"
        src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
        alt="سعودي دنت"
        width={180}
        height={50}
        priority
      />
    </span>
  );
}

function AppLinks() {
  return (
    <div className="sd-premium-detail__app-links">
      <a href={saudident.app.appStore} target="_blank" rel="noopener noreferrer"><Apple aria-hidden />App Store</a>
      <a href={saudident.app.googlePlay} target="_blank" rel="noopener noreferrer"><Play aria-hidden fill="currentColor" />Google Play</a>
    </div>
  );
}

export function PremiumSceneDetail({ hotspot, onClose }: PremiumSceneDetailProps) {
  const rootRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<HubView>("home");

  useGSAP(() => {
    if (!rootRef.current) return;
    const timeline = gsap.timeline();
    timeline.fromTo(rootRef.current, { autoAlpha: 0, y: 14, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: "power3.out" });
    if (hotspot.contentKind === "waiting" || hotspot.contentKind === "waiting-welcome" || hotspot.contentKind === "sterilization") {
      timeline.fromTo(
        ".sd-premium-waiting__logo, .sd-premium-waiting__message",
        { autoAlpha: 0, y: 10, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.08, ease: "power2.out" },
        "-=0.16",
      );
    }
    return () => timeline.kill();
  }, { scope: rootRef, dependencies: [hotspot.contentKind] });

  useGSAP(() => {
    if (!contentRef.current) return;
    gsap.fromTo(contentRef.current, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" });
  }, { scope: contentRef, dependencies: [view] });

  const close = () => {
    if (!rootRef.current) { onClose(); return; }
    gsap.to(rootRef.current, { autoAlpha: 0, y: 14, scale: 0.985, duration: 0.28, ease: "power2.in", onComplete: onClose });
  };

  const isHub = hotspot.contentKind === "reception-hub";
  const isCenteredWaiting = hotspot.contentKind === "waiting" || hotspot.contentKind === "waiting-welcome";
  const viewTitle = view === "home" ? (isHub ? "الاستقبال" : hotspot.title) : hubOptions.find((option) => option.id === view)?.title;

  return (
    <article ref={rootRef} className={`sd-scene-detail is-premium${isCenteredWaiting ? " is-waiting" : ""}`} aria-labelledby="sd-premium-detail-title">
      <header className="sd-premium-detail__header">
        {!isCenteredWaiting && <SaudiDentLogo />}
        <div>
          {!isCenteredWaiting && <span>{isHub ? "مركز الاستقبال" : hotspot.eyebrow}</span>}
          <h2 id="sd-premium-detail-title">{viewTitle}</h2>
        </div>
        <button type="button" onClick={close} aria-label="إغلاق النافذة"><X aria-hidden /></button>
      </header>

      <div ref={contentRef} className="sd-premium-detail__body">
        {isHub && view !== "home" && (
          <button type="button" className="sd-premium-detail__back" onClick={() => setView("home")}>
            <ArrowRight aria-hidden /> رجوع
          </button>
        )}

        {isHub ? <ReceptionHub view={view} onView={setView} /> : <FocusedDetail hotspot={hotspot} />}
      </div>
    </article>
  );
}

function ReceptionHub({ view, onView }: { view: HubView; onView: (view: HubView) => void }) {
  if (view === "doctors") {
    return (
      <div className="sd-premium-doctors">
        {khamisDoctors.map((doctor) => (
          <article key={doctor.id}>
            <div><Image src={doctor.image!} alt={doctor.name} fill sizes="(max-width: 767px) 42vw, 150px" /></div>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>
          </article>
        ))}
      </div>
    );
  }

  if (view === "appointments") {
    return (
      <section className="sd-premium-booking">
        <Image src="/media/app/app-icon.png" alt="تطبيق سعودي دنت" width={58} height={58} />
        <h3>احجز موعدك بسهولة</h3>
        <p>{saudident.app.description}</p>
        <AppLinks />
        <a className="sd-premium-booking__cta" href={saudident.appointment.url} target="_blank" rel="noopener noreferrer">
          <CalendarDays aria-hidden /> احجز موعد
        </a>
      </section>
    );
  }

  if (view === "services") {
    return (
      <div className="sd-premium-services">
        {featuredServices.map((service) => (
          <article key={service.id}>
            <span><DentalIcon name={service.icon} /></span>
            <div><h3>{service.title}</h3>{service.description && <p>{service.description}</p>}</div>
          </article>
        ))}
      </div>
    );
  }

  if (view === "offers") {
    return (
      <section className="sd-premium-offers">
        <BadgePercent aria-hidden />
        <h3>العروض الحالية</h3>
        <p>تعرّف على العروض والخيارات المتاحة عبر تطبيق سعودي دنت</p>
        <AppLinks />
      </section>
    );
  }

  return (
    <div className="sd-premium-hub">
      {hubOptions.map((option) => {
        const Icon = option.icon;
        return <button type="button" key={option.id} onClick={() => onView(option.id)}><Icon aria-hidden /><strong>{option.title}</strong></button>;
      })}
    </div>
  );
}

function FocusedDetail({ hotspot }: { hotspot: BranchSceneHotspot }) {
  if (hotspot.contentKind === "coffee") {
    return (
      <div className="sd-premium-focus">
        <figure className="sd-premium-focus__image is-contained">
          <Image src="/saudident/scenes/coffee-01.jpg" alt="الكوفي في فرع سعودي دنت بخميس مشيط" fill sizes="(max-width: 767px) 96vw, 660px" />
        </figure>
        <p>استراحة خفيفة ضمن تجربة فرع خميس مشيط</p>
      </div>
    );
  }

  if (hotspot.contentKind === "waiting") {
    return (
      <div className="sd-premium-waiting">
        <div className="sd-premium-waiting__brand">
          <Image
            className="sd-premium-waiting__logo"
            src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
            alt="سعودي دنت"
            width={4096}
            height={1139}
            priority
          />
        </div>
        <p className="sd-premium-waiting__message">أهلًا بك في سعودي دنت، راحتك تبدأ من لحظة وصولك. خذ وقتك، وفريقنا معك في كل خطوة نحو ابتسامة أكثر صحة وثقة</p>
      </div>
    );
  }

  if (hotspot.contentKind === "waiting-welcome") {
    return (
      <div className="sd-premium-waiting">
        <div className="sd-premium-waiting__brand">
          <Image
            className="sd-premium-waiting__logo"
            src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
            alt="سعودي دنت"
            width={4096}
            height={1139}
            priority
          />
        </div>
        <p className="sd-premium-waiting__message">{hotspot.description}</p>
      </div>
    );
  }

  if (hotspot.contentKind === "waiting-image") {
    return (
      <div className="sd-premium-focus">
        <figure className="sd-premium-focus__image is-waiting-photo">
          <Image src="/saudident/scenes/khamis-15.jpg" alt="منطقة انتظار في فرع سعودي دنت بخميس مشيط" fill sizes="(max-width: 767px) 96vw, 660px" />
        </figure>
        <p>{hotspot.description}</p>
      </div>
    );
  }

  if (hotspot.contentKind === "sterilization") {
    return (
      <div className="sd-premium-sterilization">
        <div className="sd-premium-sterilization__brand">
          <Image
            src="/branding/intro/SaudiDent_MASTER_transparent_4K.png"
            alt="سعودي دنت"
            width={4096}
            height={1139}
            priority
          />
        </div>
        <figure className="sd-premium-sterilization__image">
          <Image
            src="/saudident/scenes/khamis-14.jpg"
            alt="إجراءات التعقيم في فرع سعودي دنت بخميس مشيط"
            fill
            sizes="(max-width: 767px) 94vw, 680px"
          />
        </figure>
        <p>{hotspot.description}</p>
      </div>
    );
  }

  if (hotspot.contentKind === "implant") {
    const activeImage = hotspot.gallery?.[0];
    return (
      <div className="sd-premium-focus">
        {activeImage && (
          <figure className="sd-premium-focus__image">
            <Image src={activeImage.src} alt={activeImage.alt} fill sizes="(max-width: 767px) 96vw, 660px" />
          </figure>
        )}
        <p>{hotspot.description}</p>
        <div className="sd-premium-clinic-sections">
          <section><h3>الخدمات</h3><ul>{hotspot.services.map((service) => <li key={service}>{service}</li>)}</ul></section>
          <section><h3>التجهيزات</h3><ul>{hotspot.equipment?.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        {hotspot.benefits?.length ? <section className="sd-premium-benefits"><h3>مزايا زراعة الأسنان</h3><ul>{hotspot.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul></section> : null}
      </div>
    );
  }

  const activeImage = hotspot.gallery?.[0];
  return (
    <div className="sd-premium-focus">
      {activeImage && (
        <figure className="sd-premium-focus__image">
          <Image src={activeImage.src} alt={activeImage.alt} fill sizes="(max-width: 767px) 96vw, 660px" />
        </figure>
      )}
      <p>{hotspot.description}</p>
      {hotspot.benefits?.length ? (
        <section className="sd-premium-benefits">
          <h3>أهم الفوائد</h3>
          <ul>{hotspot.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
        </section>
      ) : null}
    </div>
  );
}
