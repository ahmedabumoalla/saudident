"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Menu, Phone, X } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { brand } from "@/lib/brand";

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={`site-header ${overlay ? "header-overlay" : ""}`}>
      <div className="header-inner">
        <BrandMark light={overlay} />
        <nav className={open ? "nav-open" : ""} aria-label="التنقل الرئيسي">
          <Link href="/">الرئيسية</Link><Link href="/#branches">فروعنا</Link><Link href="/#experience">عن المجمع</Link>
          <a href={`tel:${brand.phone.replaceAll(" ", "")}`}><Phone size={17} /> {brand.phone}</a>
        </nav>
        <a className="button button-small header-book" href="#contact"><CalendarDays size={17} /> احجز موعدك</a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="فتح القائمة">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div><BrandMark light /><p>رعاية متخصصة، تجربة هادئة، وابتسامة تبدأ بالثقة.</p></div>
        <div><span>تواصل معنا</span><a href={`tel:${brand.phone.replaceAll(" ", "")}`}>{brand.phone}</a><small>يومياً · 9 صباحاً — 11 مساءً</small></div>
        <div><span>الفروع</span><Link href="/branch/abha">أبها</Link><Link href="/branch/khamis-mushait">خميس مشيط</Link></div>
      </div>
      <div className="footer-bottom">© 2026 سعودي دنت — جميع الحقوق محفوظة</div>
    </footer>
  );
}
