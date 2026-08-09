"use client";

import { Mail, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { saudident } from "@/data/saudident";

export function ConsultationSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      opener?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sd-dialog" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="sd-consultation" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
        <button ref={closeRef} type="button" className="sd-icon-button" onClick={onClose} aria-label="إغلاق">
          <X aria-hidden />
        </button>
        <p className="sd-eyebrow">تواصل معنا</p>
        <h2 id="consultation-title">اطلب استشارة</h2>
        <p>اختر وسيلة التواصل المناسبة، وسيجيبك فريق سعودي دنت.</p>
        <div className="sd-consultation__links">
          <a href={saudident.contact.phoneUrl}>
            <Phone aria-hidden /><span><small>اتصال</small>{saudident.contact.phoneDisplay}</span>
          </a>
          <a href={saudident.contact.emailUrl}>
            <Mail aria-hidden /><span><small>بريد إلكتروني</small>{saudident.contact.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
