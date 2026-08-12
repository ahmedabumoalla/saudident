"use client";

import Image from "next/image";
import { Apple, ArrowLeft, ChevronLeft, ChevronRight, Mail, Phone, Play } from "lucide-react";
import { useMemo, useRef } from "react";
import {
  clinicServiceAssignments,
  prototypeClinicDoctorAssignments,
  prototypeEquipment,
  type DemoDetailFrame,
  type FloorHotspot,
} from "@/data/khamis-floor-map";
import { doctors, saudident, services } from "@/data/saudident";
import { gsap, useGSAP } from "@/lib/gsap";

type ClinicSection = "doctor" | "services" | "offers" | "equipment";

type FloorHotspotDetailProps = {
  hotspot: FloorHotspot;
  galleryIndex: number;
  demoActive: boolean;
  demoFrame: DemoDetailFrame | null;
  onGalleryIndex: (index: number) => void;
  onBack: () => void;
  onUserInteraction: () => void;
};

const clinicSections: { id: ClinicSection; label: string }[] = [
  { id: "doctor", label: "الطبيب" },
  { id: "services", label: "الخدمات" },
  { id: "offers", label: "العروض" },
  { id: "equipment", label: "التجهيزات" },
];

const appScreens = [
  { src: "/media/app/app-screen-1.webp", alt: "الشاشة الرئيسية في تطبيق سعودي دنت" },
  { src: "/media/app/app-screen-2.webp", alt: "قائمة الأطباء في تطبيق سعودي دنت" },
  { src: "/media/app/app-screen-3.webp", alt: "تفاصيل الحجز في تطبيق سعودي دنت" },
];

function clinicOrdinal(id: string) {
  const value = Number(id.match(/(\d+)$/)?.[1] ?? 1);
  return Number.isFinite(value) ? Math.max(1, value) : 1;
}

function useClinicContent(hotspot: FloorHotspot) {
  const category = hotspot.clinicCategory!;
  const assignedDoctors = useMemo(() => {
    const ids = prototypeClinicDoctorAssignments[category];
    const selectedId = ids[(clinicOrdinal(hotspot.id) - 1) % ids.length];
    return doctors.filter((doctor) => doctor.id === selectedId && doctor.image);
  }, [category, hotspot.id]);
  const assignedServices = useMemo(() => {
    const ids = new Set(clinicServiceAssignments[category]);
    return services.filter((service) => ids.has(service.id));
  }, [category]);
  return { assignedDoctors, assignedServices, equipment: prototypeEquipment[category] };
}

export function FloorHotspotDetail({
  hotspot,
  galleryIndex,
  demoActive,
  demoFrame,
  onGalleryIndex,
  onBack,
  onUserInteraction,
}: FloorHotspotDetailProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!frameRef.current) return;
    gsap.fromTo(frameRef.current, { autoAlpha: 0, y: 12 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.44,
      ease: "power2.out",
      overwrite: true,
    });
  }, { dependencies: [hotspot.id, demoFrame, galleryIndex] });

  const goBack = () => {
    onUserInteraction();
    onBack();
  };

  return (
    <aside className="sd-floor-detail" aria-labelledby="sd-floor-detail-title">
      <header className="sd-floor-detail__header">
        <button type="button" className="sd-floor-control" onClick={goBack}>
          <ArrowLeft aria-hidden />
          رجوع
        </button>
        <div>
          <span>فرع خميس مشيط</span>
          <h2 id="sd-floor-detail-title">{hotspot.title}</h2>
        </div>
      </header>

      <div className="sd-floor-detail__body">
        <div ref={frameRef} className="sd-floor-detail__frame">
          {hotspot.kind === "clinic" && hotspot.clinicCategory ? (
            demoActive ? (
              demoFrame ? <ClinicDemoFrame hotspot={hotspot} frame={demoFrame} /> : <div className="sd-floor-demo-frame" aria-hidden="true" />
            ) : (
              <ClinicDetail hotspot={hotspot} onUserInteraction={onUserInteraction} />
            )
          ) : hotspot.kind === "reception" ? (
            <ReceptionDetail
              hotspot={hotspot}
              galleryIndex={galleryIndex}
              demoActive={demoActive}
              demoFrame={demoFrame}
              onGalleryIndex={onGalleryIndex}
              onUserInteraction={onUserInteraction}
            />
          ) : (
            <FacilityDetail
              hotspot={hotspot}
              galleryIndex={galleryIndex}
              demoActive={demoActive}
              onGalleryIndex={onGalleryIndex}
              onUserInteraction={onUserInteraction}
            />
          )}
        </div>
      </div>
    </aside>
  );
}

function ClinicDetail({ hotspot, onUserInteraction }: { hotspot: FloorHotspot; onUserInteraction: () => void }) {
  const { assignedDoctors, assignedServices, equipment } = useClinicContent(hotspot);
  const sectionId = (id: ClinicSection) => `sd-clinic-${hotspot.id}-${id}`;
  const jumpTo = (id: ClinicSection) => {
    onUserInteraction();
    document.getElementById(sectionId(id))?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sd-floor-clinic-scroll">
      <nav className="sd-floor-tabs" aria-label="الانتقال بين تفاصيل العيادة">
        {clinicSections.map((section) => (
          <button type="button" key={section.id} onClick={() => jumpTo(section.id)}>{section.label}</button>
        ))}
      </nav>

      <section id={sectionId("doctor")} className="sd-floor-section" aria-labelledby={`${sectionId("doctor")}-title`}>
        <h3 id={`${sectionId("doctor")}-title`} className="sd-floor-section__title">الطبيب</h3>
        <DoctorCards assignedDoctors={assignedDoctors} />
      </section>

      <section id={sectionId("services")} className="sd-floor-section" aria-labelledby={`${sectionId("services")}-title`}>
        <h3 id={`${sectionId("services")}-title`} className="sd-floor-section__title">الخدمات</h3>
        <ServiceCards assignedServices={assignedServices} />
      </section>

      <section id={sectionId("offers")} className="sd-floor-section" aria-labelledby={`${sectionId("offers")}-title`}>
        <h3 id={`${sectionId("offers")}-title`} className="sd-floor-section__title">العروض</h3>
        <OffersCard />
      </section>

      <section id={sectionId("equipment")} className="sd-floor-section" aria-labelledby={`${sectionId("equipment")}-title`}>
        <h3 id={`${sectionId("equipment")}-title`} className="sd-floor-section__title">التجهيزات</h3>
        <EquipmentList items={equipment} />
      </section>
    </div>
  );
}

function ClinicDemoFrame({ hotspot, frame }: { hotspot: FloorHotspot; frame: DemoDetailFrame }) {
  const { assignedDoctors, assignedServices, equipment } = useClinicContent(hotspot);
  return (
    <section className="sd-floor-demo-frame" aria-live="polite">
      {frame === "doctor" && <><span>الطبيب</span><DoctorCards assignedDoctors={assignedDoctors} demo /></>}
      {frame === "services" && <><span>خدمات العيادة</span><h3>{hotspot.title}</h3><ServiceCards assignedServices={assignedServices} /></>}
      {frame === "offers" && <><span>العروض</span><OffersCard /></>}
      {frame === "equipment" && <><span>تجهيزات العيادة</span><EquipmentList items={equipment} /></>}
    </section>
  );
}

function DoctorCards({ assignedDoctors, demo = false }: { assignedDoctors: typeof doctors; demo?: boolean }) {
  return (
    <div className={`sd-floor-doctors${demo ? " is-demo" : ""}`}>
      {assignedDoctors.map((doctor) => (
        <article key={doctor.id} className="sd-floor-doctor">
          <div className="sd-floor-doctor__image">
            <Image src={doctor.image!} alt={`صورة ${doctor.name}`} fill sizes="(max-width: 767px) 120px, 180px" />
          </div>
          <div>
            <h3>{doctor.name}</h3>
            <p>{doctor.specialty}</p>
            {!demo && <a href={saudident.appointment.url} target="_blank" rel="noreferrer">احجز مع الطبيب</a>}
          </div>
        </article>
      ))}
    </div>
  );
}

function ServiceCards({ assignedServices }: { assignedServices: typeof services }) {
  return (
    <div className="sd-floor-list">
      {assignedServices.map((service) => (
        <article key={service.id}>
          <h3>{service.title}</h3>
          {service.description && <p>{service.description}</p>}
        </article>
      ))}
    </div>
  );
}

function EquipmentList({ items }: { items: string[] }) {
  return <ul className="sd-floor-equipment">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function OffersCard() {
  return (
    <section className="sd-floor-offers">
      <h3>العروض الحالية عبر تطبيق سعودي دنت</h3>
      <p>اطّلع على الخيارات المتاحة واحجز موعدك من التطبيق.</p>
      <AppLinks />
    </section>
  );
}

function ReceptionDetail({
  hotspot,
  galleryIndex,
  demoActive,
  demoFrame,
  onGalleryIndex,
  onUserInteraction,
}: {
  hotspot: FloorHotspot;
  galleryIndex: number;
  demoActive: boolean;
  demoFrame: DemoDetailFrame | null;
  onGalleryIndex: (index: number) => void;
  onUserInteraction: () => void;
}) {
  const showPhoto = !demoActive || demoFrame === "photo";
  const showBooking = !demoActive || demoFrame === "booking";
  const showOffers = demoActive && demoFrame === "offers";
  return (
    <div className="sd-reception-detail">
      {showPhoto && (
        <FloorGallery images={hotspot.gallery ?? []} index={galleryIndex} demoActive={demoActive} onIndex={onGalleryIndex} onUserInteraction={onUserInteraction} />
      )}
      {showBooking && <BookingCard />}
      {showOffers && <OffersCard />}
    </div>
  );
}

function BookingCard() {
  return (
    <section className="sd-reception-app">
      <div className="sd-reception-app__heading">
        <Image src="/media/app/app-icon.png" alt="أيقونة تطبيق سعودي دنت" width={48} height={48} />
        <div><span>تطبيق سعودي دنت</span><h3>احجز موعدك من التطبيق</h3></div>
      </div>
      <div className="sd-reception-app__screens">
        {appScreens.map((screen) => <div key={screen.src}><Image src={screen.src} alt={screen.alt} fill sizes="90px" /></div>)}
      </div>
      <AppLinks />
    </section>
  );
}

function FacilityDetail({
  hotspot,
  galleryIndex,
  demoActive,
  onGalleryIndex,
  onUserInteraction,
}: {
  hotspot: FloorHotspot;
  galleryIndex: number;
  demoActive: boolean;
  onGalleryIndex: (index: number) => void;
  onUserInteraction: () => void;
}) {
  const hasContact = ["admin", "patient-relations", "customer-service"].includes(hotspot.kind);
  const equipment = hotspot.kind === "radiology"
    ? ["جهاز الأشعة المركزي الموجود في الغرفة", "منطقة إجراء الأشعة"]
    : hotspot.kind === "sterilization"
      ? ["أجهزة التعقيم", "منطقة تجهيز الأدوات"]
      : [];

  return (
    <div className="sd-facility-detail">
      {hotspot.gallery?.length ? (
        <FloorGallery images={hotspot.gallery} index={galleryIndex} demoActive={demoActive} onIndex={onGalleryIndex} onUserInteraction={onUserInteraction} />
      ) : (
        <div className="sd-facility-detail__map-note">يظهر موقع المساحة محددًا على مخطط الفرع.</div>
      )}
      {hotspot.description && <p>{hotspot.description}</p>}
      {equipment.length > 0 && <EquipmentList items={equipment} />}
      {hasContact && (
        <div className="sd-facility-contact">
          <a href={saudident.contact.phoneUrl}><Phone aria-hidden />{saudident.contact.phoneDisplay}</a>
          <a href={saudident.contact.emailUrl}><Mail aria-hidden />{saudident.contact.email}</a>
        </div>
      )}
    </div>
  );
}

function FloorGallery({
  images,
  index,
  demoActive,
  onIndex,
  onUserInteraction,
}: {
  images: NonNullable<FloorHotspot["gallery"]>;
  index: number;
  demoActive: boolean;
  onIndex: (index: number) => void;
  onUserInteraction: () => void;
}) {
  const safeIndex = Math.min(index, Math.max(0, images.length - 1));
  const image = images[safeIndex];
  if (!image) return null;

  const change = (next: number) => {
    onUserInteraction();
    onIndex((next + images.length) % images.length);
  };

  return (
    <div className="sd-floor-gallery">
      <div className="sd-floor-gallery__image">
        <Image src={image.src} alt={image.alt} fill sizes="(max-width: 767px) 100vw, 420px" />
        <span>{image.label}</span>
      </div>
      {images.length > 1 && !demoActive && (
        <div className="sd-floor-gallery__controls">
          <button type="button" onClick={() => change(safeIndex - 1)} aria-label="الصورة السابقة"><ChevronRight aria-hidden /></button>
          <span>{safeIndex + 1} / {images.length}</span>
          <button type="button" onClick={() => change(safeIndex + 1)} aria-label="الصورة التالية"><ChevronLeft aria-hidden /></button>
        </div>
      )}
    </div>
  );
}

function AppLinks() {
  return (
    <div className="sd-floor-app-links">
      <a href={saudident.app.appStore} target="_blank" rel="noreferrer"><Apple aria-hidden />App Store</a>
      <a href={saudident.app.googlePlay} target="_blank" rel="noreferrer"><Play aria-hidden fill="currentColor" />Google Play</a>
    </div>
  );
}
