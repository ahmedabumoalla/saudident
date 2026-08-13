"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { services } from "@/data/saudident";
import { DentalIcon } from "@/components/saudident/icons/dental-icons";

export function ServicesSection() {
  const [active, setActive] = useState(0);
  const service = services[active];
  const selectRelative = (step: number) => setActive((current) => (current + step + services.length) % services.length);

  return (
    <section id="services" className="sd-services sd-section" aria-labelledby="services-title">
      <div className="sd-section__meta" data-reveal>
        <span>04</span><p>الخدمات</p>
      </div>
      <header className="sd-services__heading" data-reveal>
        <p className="sd-eyebrow">القوس العلاجي</p>
        <h2 id="services-title">كل تخصصات الأسنان.<br />في منظومة واحدة</h2>
      </header>
      <div className="sd-services__experience" data-reveal>
        <div
          className="sd-services__arch-wrap"
          role="group"
          aria-label="اختر إحدى خدمات سعودي دنت"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") selectRelative(1);
            if (event.key === "ArrowRight") selectRelative(-1);
          }}
        >
          <svg className="sd-services__arch" viewBox="0 0 760 470" fill="none" aria-hidden="true">
            <path className="sd-services__track" d="M70 410C120 80 640 80 690 410" pathLength="100" />
            <path
              className="sd-services__progress"
              d="M70 410C120 80 640 80 690 410"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - ((active + 1) / services.length) * 100}
            />
          </svg>
          {services.map((item, index) => {
            const angle = Math.PI - (index / (services.length - 1)) * Math.PI;
            const x = 50 + Math.cos(angle) * 42;
            const y = 87 - Math.sin(angle) * 70;
            return (
              <button
                key={item.id}
                type="button"
                className={`sd-services__node${index === active ? " is-active" : ""}`}
                style={{ "--node-x": `${x}%`, "--node-y": `${y}%` } as React.CSSProperties}
                aria-label={item.title}
                aria-pressed={index === active}
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
        <div className="sd-services__detail" aria-live="polite">
          <span className="sd-services__count">{String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
          <div className="sd-services__icon" key={`${service.id}-icon`}><DentalIcon name={service.icon} /></div>
          <h3 key={`${service.id}-title`}>{service.title}</h3>
          <p key={`${service.id}-description`}>{service.description ?? "مدرجة ضمن قائمة خدمات سعودي دنت الرسمية"}</p>
          <div className="sd-services__controls">
            <button type="button" onClick={() => selectRelative(-1)} aria-label="الخدمة السابقة"><ArrowRight aria-hidden /></button>
            <button type="button" onClick={() => selectRelative(1)} aria-label="الخدمة التالية"><ArrowLeft aria-hidden /></button>
          </div>
        </div>
      </div>
      <div className="sd-services__rail" aria-hidden="true">
        {services.map((item, index) => (
          <span key={item.id} className={index === active ? "is-active" : ""}>
            {item.title}
          </span>
        ))}
      </div>
    </section>
  );
}
