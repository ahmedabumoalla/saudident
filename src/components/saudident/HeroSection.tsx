import { ArrowDownLeft } from "lucide-react";
import { saudident } from "@/data/saudident";

export function HeroSection({ onConsultation }: { onConsultation: () => void }) {
  return (
    <section id="top" className="sd-hero" aria-labelledby="hero-title">
      <div className="sd-hero__inner">
        <div className="sd-hero__content">
          <h1 id="hero-title" className="sd-hero__title" aria-label="كُن مع الصفوة">
            <span data-hero-line>كُن</span>
            <span data-hero-line>مع الصفوة</span>
          </h1>
          <p className="sd-hero__subtitle" data-hero-reveal>طب الأسنان الحديث بتخصصاته تحت سقف واحد</p>
          <div className="sd-hero__actions" data-hero-reveal>
            <a className="sd-button sd-button--primary" href={saudident.appointment.url} target="_blank" rel="noreferrer">
              احجز موعدك <ArrowDownLeft aria-hidden />
            </a>
            <button className="sd-button sd-button--quiet" type="button" onClick={onConsultation}>اطلب استشارة</button>
          </div>
        </div>
      </div>
      <a className="sd-scroll-cue" href="#proof" aria-label="انتقل إلى الأرقام">
        <span>استكشف</span><i aria-hidden="true" />
      </a>
    </section>
  );
}
