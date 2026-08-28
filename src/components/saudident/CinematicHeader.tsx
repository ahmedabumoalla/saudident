"use client";

import Image from "next/image";
import { Apple, Menu, Play, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { saudident } from "@/data/saudident";
import { SAUDIDENT_LOGOS } from "@/lib/brand";

const links = [
  ["عن سعودي دنت", "#about"],
  ["الخدمات", "#services"],
  ["الأطباء", "#doctors"],
  ["التطبيق", "#app"],
  ["الفروع", "#branches"],
] as const;

function AppDownloadLinks({ location }: { location: "header" | "menu" }) {
  return (
    <div
      className={`sd-header__app-download sd-header__app-download--${location}`}
      role="group"
      aria-label="تحميل تطبيق سعودي دنت"
    >
      <span className="sd-header__app-label">حمّل التطبيق</span>
      <div className="sd-header__store-links">
        <a
          className="sd-header__store-link"
          href={saudident.app.googlePlay}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تحميل تطبيق سعودي دنت من Google Play — يفتح في نافذة جديدة"
          title="Google Play"
        >
          <Play aria-hidden="true" fill="currentColor" />
          <span lang="en">Google Play</span>
        </a>
        <a
          className="sd-header__store-link"
          href={saudident.app.appStore}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تحميل تطبيق سعودي دنت من App Store — يفتح في نافذة جديدة"
          title="App Store"
        >
          <Apple aria-hidden="true" />
          <span lang="en">App Store</span>
        </a>
      </div>
    </div>
  );
}

export function CinematicHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 42);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      headerRef.current?.querySelector<HTMLElement>(".sd-mobile-nav a")?.focus();
    }, 0);
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !headerRef.current) return;
      const focusable = Array.from(headerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        .filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", close);
      opener?.focus();
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className={`sd-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-menu-open" : ""}`}
    >
      <a className="sd-header__logo" href="#top" aria-label="سعودي دنت — العودة للبداية">
        <Image
          {...SAUDIDENT_LOGOS.white}
          alt="سعودي دنت"
          sizes="(max-width: 820px) 140px, 170px"
          unoptimized
          priority
        />
      </a>
      <nav className="sd-header__nav" aria-label="التنقل الرئيسي">
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </nav>
      <div className="sd-header__actions">
        <a className="sd-button sd-button--compact" href={saudident.appointment.url} target="_blank" rel="noreferrer">
          احجز موعدك
        </a>
        <AppDownloadLinks location="header" />
        <button
          ref={menuButtonRef}
          className="sd-header__menu-button"
          type="button"
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
      </div>
      <div id="mobile-navigation" className={`sd-mobile-nav${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="التنقل على الجوال">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <AppDownloadLinks location="menu" />
        </nav>
      </div>
    </header>
  );
}
