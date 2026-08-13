"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

import { doctors, type SaudiDentDoctor } from "@/data/saudident";

type DoctorWithImage = SaudiDentDoctor & { image: string };

type TransitionDirection = "next" | "previous";
type TransitionPhase = "idle" | "prepare" | "running";

const stageDoctors = doctors.filter(
  (doctor): doctor is DoctorWithImage => typeof doctor.image === "string",
);

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DOCTOR_TRANSITION_DURATION = 650;

function doctorMonogram(name: string) {
  const words = name
    .replace(/^(أ\.\s?د\.|د\.|أ\.د\.)\s*/u, "")
    .trim()
    .split(/\s+/u)
    .filter(Boolean);

  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? "")
    .join("");
}

type DoctorsOverlayProps = {
  open: boolean;
  onClose: () => void;
  openerRef: React.RefObject<HTMLButtonElement | null>;
};

function DoctorsOverlay({ open, onClose, openerRef }: DoctorsOverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");

  const specialties = useMemo(
    () =>
      Array.from(new Set(doctors.map((doctor) => doctor.specialty))).sort((a, b) =>
        a.localeCompare(b, "ar"),
      ),
    [],
  );

  const visibleDoctors = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ar");

    return doctors.filter((doctor) => {
      const matchesSpecialty = specialty === "all" || doctor.specialty === specialty;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        doctor.name.toLocaleLowerCase("ar").includes(normalizedQuery) ||
        doctor.specialty.toLocaleLowerCase("ar").includes(normalizedQuery);

      return matchesSpecialty && matchesQuery;
    });
  }, [query, specialty]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.offsetParent !== null);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [onClose, open, openerRef]);

  if (!open) return null;

  return createPortal(
    <div
      className="sd-doctors-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="sd-doctors-overlay__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sd-doctors-overlay-title"
        dir="rtl"
      >
        <header className="sd-doctors-overlay__header">
          <div>
            <p className="sd-section-kicker">الفريق الطبي</p>
            <h2 id="sd-doctors-overlay-title">نخبة من أطبائنا</h2>
            <p className="sd-doctors-overlay__count" aria-live="polite">
              {visibleDoctors.length} من {doctors.length} طبيبًا
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="sd-icon-button sd-doctors-overlay__close"
            onClick={onClose}
            aria-label="إغلاق قائمة الأطباء"
          >
            <X aria-hidden="true" />
          </button>
        </header>

        <div className="sd-doctors-overlay__tools">
          <label className="sd-doctors-search">
            <span className="sd-visually-hidden">ابحث باسم الطبيب أو التخصص</span>
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث باسم الطبيب أو التخصص"
              autoComplete="off"
            />
          </label>

          <label className="sd-doctors-filter">
            <span className="sd-visually-hidden">تصفية حسب التخصص</span>
            <SlidersHorizontal aria-hidden="true" />
            <select value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
              <option value="all">كل التخصصات</option>
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="sd-doctors-overlay__body">
          {visibleDoctors.length > 0 ? (
            <div className="sd-doctors-grid">
              {visibleDoctors.map((doctor) => (
                <article className="sd-doctor-card" key={doctor.id}>
                  <div className="sd-doctor-card__media">
                    {doctor.image ? (
                      <Image
                        src={doctor.image}
                        alt={`صورة ${doctor.name}`}
                        fill
                        sizes="(max-width: 640px) 86vw, (max-width: 1100px) 42vw, 25vw"
                        className="sd-doctor-card__image"
                      />
                    ) : (
                      <div
                        className="sd-doctor-card__placeholder"
                        role="img"
                        aria-label={`لا تتوفر صورة معتمدة للطبيب ${doctor.name}`}
                      >
                        <span aria-hidden="true">{doctorMonogram(doctor.name)}</span>
                        <small aria-hidden="true">سعودي دنت</small>
                      </div>
                    )}
                  </div>
                  <div className="sd-doctor-card__copy">
                    <h3>{doctor.name}</h3>
                    <p>{doctor.specialty}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="sd-doctors-empty" role="status">
              <Users aria-hidden="true" />
              <h3>لم نجد نتيجة مطابقة</h3>
              <p>جرّب كتابة اسم آخر أو اختر كل التخصصات</p>
              <button
                type="button"
                className="sd-text-button"
                onClick={() => {
                  setQuery("");
                  setSpecialty("all");
                }}
              >
                مسح عوامل البحث
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function DoctorsExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [transitionDirection, setTransitionDirection] =
    useState<TransitionDirection>("next");
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("idle");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const activeIndexRef = useRef(0);
  const dragStartX = useRef<number | null>(null);
  const overlayOpenerRef = useRef<HTMLButtonElement>(null);
  const transitionFrameRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const clearTransitionSchedule = useCallback(() => {
    if (transitionFrameRef.current !== null) {
      window.cancelAnimationFrame(transitionFrameRef.current);
      transitionFrameRef.current = null;
    }

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearTransitionSchedule, [clearTransitionSchedule]);

  const transitionTo = useCallback(
    (nextIndex: number, direction: TransitionDirection) => {
      if (stageDoctors.length < 2) return;

      const normalizedIndex =
        (nextIndex + stageDoctors.length) % stageDoctors.length;
      const currentIndex = activeIndexRef.current;

      if (normalizedIndex === currentIndex) return;

      clearTransitionSchedule();
      setPreviousIndex(currentIndex);
      setTransitionDirection(direction);
      setTransitionPhase("prepare");
      activeIndexRef.current = normalizedIndex;
      setActiveIndex(normalizedIndex);

      transitionFrameRef.current = window.requestAnimationFrame(() => {
        transitionFrameRef.current = window.requestAnimationFrame(() => {
          setTransitionPhase("running");
          transitionFrameRef.current = null;
          transitionTimerRef.current = window.setTimeout(() => {
            setPreviousIndex(null);
            setTransitionPhase("idle");
            transitionTimerRef.current = null;
          }, DOCTOR_TRANSITION_DURATION);
        });
      });
    },
    [clearTransitionSchedule],
  );

  const showPrevious = useCallback(() => {
    transitionTo(activeIndexRef.current - 1, "previous");
  }, [transitionTo]);

  const showNext = useCallback(() => {
    transitionTo(activeIndexRef.current + 1, "next");
  }, [transitionTo]);

  const handleStageKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      showNext();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      showPrevious();
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const startX = dragStartX.current;
    dragStartX.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (startX === null || Math.abs(event.clientX - startX) < 48) return;
    if (event.clientX < startX) showNext();
    else showPrevious();
  };

  const activeDoctor = stageDoctors[activeIndex];
  const previousDoctor =
    previousIndex === null ? null : stageDoctors[previousIndex];

  return (
    <section
      id="doctors"
      className="sd-doctors"
      aria-labelledby="sd-doctors-title"
      dir="rtl"
    >
      <div className="sd-section-shell">
        <header className="sd-section-heading sd-doctors__heading" data-reveal>
          <p className="sd-section-kicker">كُن مع الصفوة</p>
          <h2 id="sd-doctors-title">نخبة من أطباء سعودي دنت</h2>
          <p>
            تعرّف إلى أطباء سعودي دنت المسجلين في الدليل الرسمي، واستعرض الدليل المتاح
            بحسب الاسم أو التخصص.
          </p>
        </header>

        <div
          className="sd-doctors-stage"
          tabIndex={0}
          onKeyDown={handleStageKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { dragStartX.current = null; }}
          role="group"
          aria-roledescription="عارض أطباء"
          aria-label={`الطبيب ${activeIndex + 1} من ${stageDoctors.length}`}
          data-transition-direction={transitionDirection}
          data-transition-phase={transitionPhase}
          data-reveal
        >
          <div className="sd-doctors-stage__halo" aria-hidden="true" />

          {previousDoctor ? (
            <div
              className="sd-doctors-stage__portrait"
              data-layer="previous"
              aria-hidden="true"
            >
              <Image
                src={previousDoctor.image}
                alt=""
                fill
                sizes="(max-width: 800px) 88vw, 48vw"
                className="sd-doctors-stage__image"
                draggable={false}
              />
            </div>
          ) : null}

          <div className="sd-doctors-stage__portrait" data-layer="current">
            <Image
              src={activeDoctor.image}
              alt={`صورة ${activeDoctor.name}`}
              fill
              sizes="(max-width: 800px) 88vw, 48vw"
              className="sd-doctors-stage__image"
              draggable={false}
            />
          </div>

          {previousDoctor ? (
            <div
              className="sd-doctors-stage__copy"
              data-layer="previous"
              aria-hidden="true"
            >
              <h3>{previousDoctor.name}</h3>
              <p>{previousDoctor.specialty}</p>
            </div>
          ) : null}

          <div
            className="sd-doctors-stage__copy"
            data-layer="current"
            aria-live="polite"
            aria-atomic="true"
          >
            <h3>{activeDoctor.name}</h3>
            <p>{activeDoctor.specialty}</p>
          </div>

          <div className="sd-doctors-stage__navigation">
            <div className="sd-doctors-stage__progress">
              <span className="sd-doctors-stage__index" aria-hidden="true">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <progress
                className="sd-doctors-stage__progress-track"
                value={activeIndex + 1}
                max={stageDoctors.length}
                aria-label={`الطبيب ${activeIndex + 1} من ${stageDoctors.length}`}
              />
              <span className="sd-doctors-stage__total" aria-hidden="true">
                {String(stageDoctors.length).padStart(2, "0")}
              </span>
            </div>

            <div className="sd-doctors-stage__controls" aria-label="التنقل بين الأطباء">
              <button
                type="button"
                className="sd-icon-button"
                onClick={showPrevious}
                aria-label="الطبيب السابق"
              >
                <ArrowRight aria-hidden="true" />
              </button>
              <button
                type="button"
                className="sd-icon-button"
                onClick={showNext}
                aria-label="الطبيب التالي"
              >
                <ArrowLeft aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="sd-doctors__footer">
          <button
            ref={overlayOpenerRef}
            type="button"
            className="sd-button sd-button--outline"
            onClick={() => setOverlayOpen(true)}
          >
            <Users aria-hidden="true" />
            استكشف الفريق
          </button>
          <span>{doctors.length} سجلًا طبيًا موثقًا</span>
        </div>
      </div>

      <DoctorsOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        openerRef={overlayOpenerRef}
      />
    </section>
  );
}
