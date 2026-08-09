"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight, BriefcaseMedical, Building2, ExternalLink, Home, MapPin,
  Pause, Play, RotateCcw, Sparkles, Stethoscope, UsersRound,
} from "lucide-react";
import { saudident, branches, doctors, services, type SaudiDentDoctor } from "@/data/saudident";
import { DentalIcon } from "@/components/saudident/icons/dental-icons";
import type { Map as MapboxMap, Marker as MapboxMarker } from "mapbox-gl";

type BranchId = "khamis" | "abha";
type ExperienceState = "overview" | "focusing" | "branch";
type DetailKind = "doctors" | "services" | "departments" | "specialties";

type Facility = { name: string; image: string };

const DEMO_FRAME_DURATION = 3500;

const branchDetails: Record<BranchId, {
  coordinates: [number, number];
  hero: string;
  facilities: Facility[];
}> = {
  khamis: {
    coordinates: [42.6963958, 18.3042106],
    hero: "/assets/branches/khamis-mushait/exterior-wide.webp",
    facilities: [
      { name: "الاستقبال", image: "/assets/branches/khamis-mushait/reception.webp" },
      { name: "منطقة الأطفال", image: "/assets/branches/khamis-mushait/kids-area.webp" },
      { name: "غرفة العلاج", image: "/assets/branches/khamis-mushait/clinic-room.webp" },
      { name: "المختبر", image: "/assets/branches/khamis-mushait/laboratory.webp" },
      { name: "المختبر الزجاجي", image: "/assets/branches/khamis-mushait/glass-lab.webp" },
      { name: "الانتظار", image: "/assets/branches/khamis-mushait/waiting.webp" },
      { name: "الردهة", image: "/assets/branches/khamis-mushait/logo-lobby.webp" },
    ],
  },
  abha: {
    coordinates: [42.5187524, 18.2085432],
    hero: "/assets/branches/abha/branch-hero.webp",
    facilities: [
      { name: "الاستقبال", image: "/assets/branches/abha/reception.webp" },
      { name: "غرفة العلاج", image: "/assets/branches/abha/clinic-room.webp" },
      { name: "الممر والعيادات", image: "/assets/branches/abha/clinic-corridor.webp" },
      { name: "الانتظار الرئيسي", image: "/assets/branches/abha/waiting-main.webp" },
      { name: "مدخل الانتظار", image: "/assets/branches/abha/waiting-entrance.webp" },
      { name: "اللوبي", image: "/assets/branches/abha/lobby-screen.webp" },
      { name: "غرفة الطبيب", image: "/assets/branches/abha/doctor-room-sign.webp" },
    ],
  },
};

// Prototype branch assignment for presentation.
// Replace with Saudi Dent verified branch roster before production.
const prototypeBranchDoctorIds: Record<BranchId, string[]> = {
  khamis: [
    "youssef-alqarni", "saad-alqahtani", "mohamed-alqarni", "mohammed-alattas",
    "maryam-abdulmohsen", "jamal-baathman", "ahmed-alshahrani", "sami-alawwadh",
  ],
  abha: [
    "abdulaziz-asiri", "abdulilah-sindi", "mohammed-thamer", "saeed-alsarhani",
    "mohammed-zarba", "khalid-mujthel", "razan-alhajari", "salman-alqahtani",
  ],
};

const overviewBounds: [[number, number], [number, number]] = [
  [42.5187524, 18.2085432], [42.6963958, 18.3042106],
];

const navItems: { id: DetailKind; label: string; icon: typeof UsersRound }[] = [
  { id: "doctors", label: "الأطباء", icon: UsersRound },
  { id: "services", label: "الخدمات", icon: BriefcaseMedical },
  { id: "departments", label: "الأقسام", icon: Building2 },
  { id: "specialties", label: "التخصصات", icon: Sparkles },
];

const detailTitles: Record<DetailKind, string> = {
  doctors: "أطباء الفرع", services: "الخدمات", departments: "أقسام الفرع", specialties: "التخصصات",
};

function doctorsForBranch(id: BranchId) {
  const ids = new Set(prototypeBranchDoctorIds[id]);
  return doctors.filter((doctor) => ids.has(doctor.id) && doctor.image);
}

export function BranchMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<MapboxMarker[]>([]);
  const demoActiveRef = useRef(false);
  const demoSessionRef = useRef(0);
  const demoWaitRef = useRef<{ timer: number; resolve: (active: boolean) => void } | null>(null);
  const demoMapMotionRef = useRef(false);
  const [experienceState, setExperienceState] = useState<ExperienceState>("overview");
  const [selectedBranch, setSelectedBranch] = useState<BranchId | null>(null);
  const [activeDetail, setActiveDetail] = useState<DetailKind | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<SaudiDentDoctor | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [facilityIndex, setFacilityIndex] = useState(0);
  const [demoDoctorIndex, setDemoDoctorIndex] = useState<number | null>(null);
  const [demoServiceIndex, setDemoServiceIndex] = useState<number | null>(null);
  const [demoSpecialtyIndex, setDemoSpecialtyIndex] = useState<number | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  const cancelDemoWait = useCallback(() => {
    const pending = demoWaitRef.current;
    if (!pending) return;
    window.clearTimeout(pending.timer);
    demoWaitRef.current = null;
    pending.resolve(false);
  }, []);

  const stopDemo = useCallback(() => {
    demoActiveRef.current = false;
    demoSessionRef.current += 1;
    demoMapMotionRef.current = false;
    setDemoActive(false);
    setDemoDoctorIndex(null);
    setDemoServiceIndex(null);
    setDemoSpecialtyIndex(null);
    cancelDemoWait();
  }, [cancelDemoWait]);

  const resetDetails = useCallback(() => {
    setActiveDetail(null);
    setSelectedDoctor(null);
    setSelectedSpecialty(null);
    setFacilityIndex(0);
    setDemoDoctorIndex(null);
    setDemoServiceIndex(null);
    setDemoSpecialtyIndex(null);
  }, []);

  const focusBranch = useCallback((id: BranchId, fromDemo = false) => {
    if (!fromDemo) stopDemo();
    setExperienceState("focusing");
    setSelectedBranch(id);
    resetDetails();
    const reveal = () => setExperienceState("branch");
    const map = mapRef.current;
    if (!map) {
      window.setTimeout(reveal, 350);
      return;
    }
    map.flyTo({
      center: branchDetails[id].coordinates,
      zoom: 16.4,
      pitch: 48,
      bearing: id === "khamis" ? -5 : 4,
      duration: 2200,
      essential: true,
    });
    map.once("moveend", reveal);
  }, [resetDetails, stopDemo]);

  const showOverview = useCallback((fromDemo = false) => {
    if (!fromDemo) stopDemo();
    resetDetails();
    setExperienceState("overview");
    setSelectedBranch(null);
    const padding = window.matchMedia("(max-width: 767px)").matches ? 52 : 110;
    const map = mapRef.current;
    map?.resize();
    map?.fitBounds(overviewBounds, { padding, duration: 1400, pitch: 0, bearing: 0 });
    window.requestAnimationFrame(() => map?.resize());
  }, [resetDetails, stopDemo]);

  const openDetail = useCallback((kind: DetailKind, fromDemo = false) => {
    if (!fromDemo) stopDemo();
    setSelectedDoctor(null);
    setSelectedSpecialty(null);
    setFacilityIndex(0);
    setActiveDetail(kind);
  }, [stopDemo]);

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) return;
    let cancelled = false;
    void import("mapbox-gl").then(({ default: mapboxgl }) => {
      if (cancelled || !mapContainerRef.current) return;
      if (!mapboxgl.supported()) { setMapError(true); return; }
      const padding = window.matchMedia("(max-width: 767px)").matches ? 52 : 110;
      const map = new mapboxgl.Map({
        accessToken: token,
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        bounds: overviewBounds,
        fitBoundsOptions: { padding },
        attributionControl: true,
      });
      mapRef.current = map;
      if (!window.matchMedia("(max-width: 767px)").matches) {
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-left");
      }
      map.on("load", () => { setMapReady(true); map.resize(); });
      map.on("error", (event) => { console.error("Mapbox initialization failed", event.error); });
      map.on("dragstart", () => { if (!demoMapMotionRef.current) stopDemo(); });
      map.on("zoomstart", () => { if (!demoMapMotionRef.current) stopDemo(); });
      const resizeObserver = new ResizeObserver(() => map.resize());
      resizeObserver.observe(mapContainerRef.current);
      map.on("remove", () => resizeObserver.disconnect());
      branches.forEach((branch) => {
        const branchId = branch.id as BranchId;
        const markerElement = document.createElement("button");
        markerElement.type = "button";
        markerElement.className = "sd-branch-map__marker";
        markerElement.setAttribute("aria-label", `عرض فرع ${branch.name}`);
        const markerLabel = document.createElement("strong");
        markerLabel.className = "sd-branch-map__marker-label";
        markerLabel.textContent = branch.name;
        const markerPin = document.createElement("span");
        markerPin.className = "sd-branch-map__marker-pin";
        markerPin.setAttribute("aria-hidden", "true");
        markerElement.append(markerLabel, markerPin);
        markerElement.addEventListener("click", () => focusBranch(branchId));
        markersRef.current.push(new mapboxgl.Marker({ element: markerElement, anchor: "bottom" })
          .setLngLat(branchDetails[branchId].coordinates).addTo(map));
      });
    }).catch((error: unknown) => {
      console.error("Mapbox initialization failed", error);
      setMapError(true);
    });
    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [focusBranch, stopDemo, token]);

  useEffect(() => {
    const resizeMap = () => window.requestAnimationFrame(() => mapRef.current?.resize());
    document.addEventListener("fullscreenchange", resizeMap);
    return () => document.removeEventListener("fullscreenchange", resizeMap);
  }, []);

  useEffect(() => () => {
    demoActiveRef.current = false;
    demoSessionRef.current += 1;
    cancelDemoWait();
  }, [cancelDemoWait]);

  const isDemoSessionActive = useCallback((session: number) => (
    demoActiveRef.current && demoSessionRef.current === session
  ), []);

  const waitForDemoFrame = useCallback((session: number) => new Promise<boolean>((resolve) => {
    if (!isDemoSessionActive(session)) { resolve(false); return; }
    const timer = window.setTimeout(() => {
      demoWaitRef.current = null;
      resolve(isDemoSessionActive(session));
    }, DEMO_FRAME_DURATION);
    demoWaitRef.current = { timer, resolve };
  }), [isDemoSessionActive]);

  const waitForMapMove = useCallback((session: number, move: (map: MapboxMap) => void) => new Promise<boolean>((resolve) => {
    if (!isDemoSessionActive(session)) { resolve(false); return; }
    const map = mapRef.current;
    if (!map) {
      const timer = window.setTimeout(() => {
        demoWaitRef.current = null;
        resolve(isDemoSessionActive(session));
      }, 350);
      demoWaitRef.current = { timer, resolve };
      return;
    }
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallback);
      demoMapMotionRef.current = false;
      demoWaitRef.current = null;
      resolve(isDemoSessionActive(session));
    };
    const fallback = window.setTimeout(finish, 4000);
    demoWaitRef.current = { timer: fallback, resolve: () => finish() };
    demoMapMotionRef.current = true;
    map.once("moveend", finish);
    move(map);
  }), [isDemoSessionActive]);

  const showDemoOverview = useCallback(async (session: number) => {
    resetDetails();
    setExperienceState("overview");
    setSelectedBranch(null);
    const padding = window.matchMedia("(max-width: 767px)").matches ? 52 : 110;
    const moved = await waitForMapMove(session, (map) => {
      map.resize();
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      map.fitBounds(overviewBounds, { padding, duration: reducedMotion ? 300 : 1400, pitch: 0, bearing: 0 });
    });
    return moved && waitForDemoFrame(session);
  }, [resetDetails, waitForDemoFrame, waitForMapMove]);

  const enterDemoBranch = useCallback(async (id: BranchId, session: number) => {
    setExperienceState("focusing");
    setSelectedBranch(id);
    resetDetails();
    const moved = await waitForMapMove(session, (map) => map.flyTo({
      center: branchDetails[id].coordinates, zoom: 16.4, pitch: 48,
      bearing: id === "khamis" ? -5 : 4,
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 400 : 2200,
      essential: true,
    }));
    if (!moved) return false;
    setExperienceState("branch");
    return waitForDemoFrame(session);
  }, [resetDetails, waitForDemoFrame, waitForMapMove]);

  const runDepartmentFrames = useCallback(async (id: BranchId, session: number) => {
    openDetail("departments", true);
    for (let index = 0; index < branchDetails[id].facilities.length; index += 1) {
      setFacilityIndex(index);
      if (!await waitForDemoFrame(session)) return false;
    }
    return true;
  }, [openDetail, waitForDemoFrame]);

  const runDoctorFrames = useCallback(async (id: BranchId, session: number) => {
    openDetail("doctors", true);
    const items = doctorsForBranch(id);
    for (let index = 0; index < items.length; index += 1) {
      setDemoDoctorIndex(index);
      if (!await waitForDemoFrame(session)) return false;
    }
    setDemoDoctorIndex(null);
    return true;
  }, [openDetail, waitForDemoFrame]);

  const runServiceFrames = useCallback(async (session: number) => {
    openDetail("services", true);
    for (let index = 0; index < services.length; index += 1) {
      setDemoServiceIndex(index);
      if (!await waitForDemoFrame(session)) return false;
    }
    setDemoServiceIndex(null);
    return true;
  }, [openDetail, waitForDemoFrame]);

  const runSpecialtyFrames = useCallback(async (id: BranchId, session: number) => {
    openDetail("specialties", true);
    const items = Array.from(new Set(doctorsForBranch(id).map((doctor) => doctor.specialty)));
    for (let index = 0; index < items.length; index += 1) {
      setDemoSpecialtyIndex(index);
      if (!await waitForDemoFrame(session)) return false;
    }
    setDemoSpecialtyIndex(null);
    return true;
  }, [openDetail, waitForDemoFrame]);

  const runBranchDemo = useCallback(async (id: BranchId, session: number) => {
    if (!await enterDemoBranch(id, session)) return false;
    if (!await runDepartmentFrames(id, session)) return false;
    if (!await runDoctorFrames(id, session)) return false;
    if (!await runServiceFrames(session)) return false;
    if (!await runSpecialtyFrames(id, session)) return false;
    resetDetails();
    setExperienceState("branch");
    return waitForDemoFrame(session);
  }, [enterDemoBranch, resetDetails, runDepartmentFrames, runDoctorFrames, runServiceFrames, runSpecialtyFrames, waitForDemoFrame]);

  const runDemoLoop = useCallback(async (session: number) => {
    if (!await showDemoOverview(session)) return;
    while (isDemoSessionActive(session)) {
      if (!await runBranchDemo("khamis", session)) return;
      if (!await showDemoOverview(session)) return;
      if (!await runBranchDemo("abha", session)) return;
      if (!await showDemoOverview(session)) return;
    }
  }, [isDemoSessionActive, runBranchDemo, showDemoOverview]);

  const startDemo = useCallback(() => {
    stopDemo();
    const session = demoSessionRef.current + 1;
    demoSessionRef.current = session;
    demoActiveRef.current = true;
    setDemoActive(true);
    resetDetails();
    setExperienceState("overview");
    setSelectedBranch(null);
    void sectionRef.current?.requestFullscreen?.().catch(() => undefined);
    void runDemoLoop(session);
  }, [resetDetails, runDemoLoop, stopDemo]);

  const branch = selectedBranch ? branches.find((item) => item.id === selectedBranch) : null;
  const detail = selectedBranch ? branchDetails[selectedBranch] : null;
  const branchDoctors = useMemo(() => selectedBranch ? doctorsForBranch(selectedBranch) : [], [selectedBranch]);
  const specialties = useMemo(() => Array.from(new Set(branchDoctors.map((doctor) => doctor.specialty))), [branchDoctors]);
  const visibleDoctors = selectedSpecialty
    ? branchDoctors.filter((doctor) => doctor.specialty === selectedSpecialty)
    : branchDoctors;

  const goHome = () => {
    stopDemo();
    showOverview(true);
    document.getElementById("main-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section ref={sectionRef} className={`sd-branch-map${demoActive ? " is-demo" : ""}`} aria-labelledby="sd-branch-map-title">
      <header className="sd-branch-map__heading">
        <div><span>فروع سعودي دنت</span><h2 id="sd-branch-map-title">من عسير، تبدأ رحلتك</h2></div>
        <button type="button" className="sd-branch-map__demo" onClick={demoActive ? stopDemo : startDemo}>
          {demoActive ? <Pause aria-hidden /> : <Play aria-hidden />}
          {demoActive ? "إيقاف الجولة" : "تشغيل الجولة التلقائية"}
        </button>
      </header>

      <div className={`sd-branch-map__stage is-${experienceState}${activeDetail ? " has-detail" : ""}`}>
        <div className="sd-branch-map__canvas-wrap">
          {token && !mapError ? (
            <div ref={mapContainerRef} className={`sd-branch-map__canvas${mapReady ? " is-ready" : ""}`} />
          ) : (
            <div className="sd-branch-map__error" role="status"><MapPin aria-hidden /><p>خريطة الفروع غير متاحة حاليًا</p></div>
          )}
        </div>

        {experienceState === "overview" && <p className="sd-branch-map__hint">المس العلامة لاستكشاف الفرع</p>}

        {branch && detail && (
          <article className={`sd-branch-scene${experienceState === "branch" ? " is-visible" : ""}`} aria-label={`تجربة فرع ${branch.name}`}>
            <Image src={detail.hero} alt={`مدخل فرع ${branch.name}`} fill priority sizes="100vw" className="sd-branch-scene__hero" />
            <div className="sd-branch-scene__shade" />
            <div className="sd-branch-scene__topline">
              <div><span>استكشف الفرع</span><h3>فرع {branch.name}</h3></div>
              <a href={branch.locationUrl} target="_blank" rel="noreferrer"><MapPin aria-hidden /> موقع الفرع <ExternalLink aria-hidden /></a>
            </div>
            <div className="sd-branch-scene__controls">
              <button type="button" onClick={() => showOverview()} aria-label="رجوع للخريطة"><RotateCcw aria-hidden /><span>الخريطة</span></button>
              <button type="button" onClick={goHome} aria-label="الرئيسية"><Home aria-hidden /><span>الرئيسية</span></button>
            </div>
            <nav className="sd-branch-scene__nav" aria-label="استكشاف الفرع">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button type="button" key={id} onClick={() => openDetail(id)}><Icon aria-hidden /><span>{label}</span></button>
              ))}
            </nav>

            {activeDetail && (
              <section className="sd-branch-detail" aria-labelledby="sd-branch-detail-title">
                <header>
                  <button type="button" className="sd-branch-detail__back" onClick={() => { stopDemo(); resetDetails(); }} aria-label="رجوع لمشهد الفرع"><ArrowRight aria-hidden /> رجوع</button>
                  <div><span>فرع {branch.name}</span><h4 id="sd-branch-detail-title">{detailTitles[activeDetail]}</h4></div>
                </header>

                {activeDetail === "doctors" && (
                  demoActive && demoDoctorIndex !== null ? <DemoDoctorSpotlight doctor={branchDoctors[demoDoctorIndex]} /> :
                  selectedDoctor ? <DoctorProfile doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} /> :
                  <DoctorGrid doctors={visibleDoctors} onSelect={setSelectedDoctor} />
                )}
                {activeDetail === "services" && (
                  demoActive && demoServiceIndex !== null ? <DemoServiceSpotlight service={services[demoServiceIndex]} /> :
                  <div className="sd-branch-services">{services.map((service) => <article key={service.id}><DentalIcon name={service.icon} /><div><h5>{service.title}</h5>{service.description && <p>{service.description}</p>}</div></article>)}</div>
                )}
                {activeDetail === "specialties" && (
                  demoActive && demoSpecialtyIndex !== null ? <DemoSpecialtySpotlight specialty={specialties[demoSpecialtyIndex]} doctors={branchDoctors} /> :
                  <div className="sd-branch-specialties">
                    {!selectedSpecialty ? specialties.map((specialty) => <button key={specialty} type="button" onClick={() => setSelectedSpecialty(specialty)}><Stethoscope aria-hidden /><span>{specialty}</span><small>{branchDoctors.filter((doctor) => doctor.specialty === specialty).length} طبيب</small></button>) : <>
                      <button type="button" className="sd-branch-specialties__reset" onClick={() => setSelectedSpecialty(null)}><ArrowRight aria-hidden /> كل التخصصات</button>
                      <DoctorGrid doctors={visibleDoctors} onSelect={setSelectedDoctor} />
                    </>}
                  </div>
                )}
                {activeDetail === "departments" && (
                  <div className="sd-branch-facilities">
                    <div className="sd-branch-facilities__visual" key={detail.facilities[facilityIndex].image}>
                      <Image src={detail.facilities[facilityIndex].image} alt={detail.facilities[facilityIndex].name} fill sizes="(max-width: 767px) 100vw, 55vw" />
                      <strong>{detail.facilities[facilityIndex].name}</strong>
                    </div>
                    <div className="sd-branch-facilities__tabs">{detail.facilities.map((facility, index) => <button type="button" className={index === facilityIndex ? "is-active" : ""} key={facility.image} onClick={() => { stopDemo(); setFacilityIndex(index); }}>{facility.name}</button>)}</div>
                  </div>
                )}
              </section>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

function DoctorGrid({ doctors: items, onSelect }: { doctors: SaudiDentDoctor[]; onSelect: (doctor: SaudiDentDoctor) => void }) {
  return <div className="sd-branch-doctors">{items.map((doctor) => <button type="button" key={doctor.id} onClick={() => onSelect(doctor)}>
    <span>{doctor.image && <Image src={doctor.image} alt={`صورة ${doctor.name}`} fill sizes="(max-width: 767px) 42vw, 190px" />}</span>
    <strong>{doctor.name}</strong><small>{doctor.specialty}</small>
  </button>)}</div>;
}

function DoctorProfile({ doctor, onBack }: { doctor: SaudiDentDoctor; onBack: () => void }) {
  return <article className="sd-branch-doctor-profile">
    <button type="button" onClick={onBack}><ArrowRight aria-hidden /> كل الأطباء</button>
    {doctor.image && <div><Image src={doctor.image} alt={`صورة ${doctor.name}`} fill sizes="220px" /></div>}
    <section><h5>{doctor.name}</h5><p>{doctor.specialty}</p><a href={saudident.appointment.url} target="_blank" rel="noreferrer">احجز موعدًا</a></section>
  </article>;
}

function DemoDoctorSpotlight({ doctor }: { doctor: SaudiDentDoctor }) {
  return <article className="sd-demo-spotlight sd-demo-doctor" key={doctor.id}>
    {doctor.image && <div className="sd-demo-doctor__portrait"><Image src={doctor.image} alt={`صورة ${doctor.name}`} fill sizes="(max-width: 767px) 60vw, 360px" /></div>}
    <div><span>الفريق الطبي</span><h5>{doctor.name}</h5><p>{doctor.specialty}</p></div>
  </article>;
}

function DemoServiceSpotlight({ service }: { service: (typeof services)[number] }) {
  return <article className="sd-demo-spotlight sd-demo-service" key={service.id}>
    <div className="sd-demo-service__icon"><DentalIcon name={service.icon} /></div>
    <span>خدمات سعودي دنت</span><h5>{service.title}</h5>{service.description && <p>{service.description}</p>}
  </article>;
}

function DemoSpecialtySpotlight({ specialty, doctors: items }: { specialty: string; doctors: SaudiDentDoctor[] }) {
  const matchingDoctors = items.filter((doctor) => doctor.specialty === specialty);
  return <article className="sd-demo-spotlight sd-demo-specialty" key={specialty}>
    <Stethoscope aria-hidden /><span>تخصصات الفرع</span><h5>{specialty}</h5>
    <p>{matchingDoctors.length} طبيب</p>
    <div>{matchingDoctors.slice(0, 2).map((doctor) => <small key={doctor.id}>{doctor.name}</small>)}</div>
  </article>;
}
