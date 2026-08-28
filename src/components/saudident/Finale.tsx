import Image from "next/image";
import { ArrowUpLeft, Mail, Phone } from "lucide-react";
import { saudident } from "@/data/saudident";
import { SAUDIDENT_LOGOS } from "@/lib/brand";

export function Finale({ onConsultation }: { onConsultation: () => void }) {
  return (
    <>
      <section className="sd-finale sd-section" aria-labelledby="finale-title">
        <Image className="sd-finale__watermark" {...SAUDIDENT_LOGOS.white} alt="" unoptimized aria-hidden="true" />
        <div className="sd-finale__content" data-reveal>
          <p className="sd-eyebrow">خطوتك التالية</p>
          <h2 id="finale-title">ابتسامتك تبدأ<br />بقرار</h2>
          <p>اختر موعدك، واترك لفريق سعودي دنت تفاصيل العناية</p>
          <div className="sd-finale__actions">
            <a className="sd-button sd-button--primary" href={saudident.appointment.url} target="_blank" rel="noreferrer">
              احجز موعدك <ArrowUpLeft aria-hidden />
            </a>
            <button className="sd-button sd-button--quiet" type="button" onClick={onConsultation}>اطلب استشارة</button>
          </div>
        </div>
      </section>
      <footer className="sd-footer">
        <div className="sd-footer__brand">
          <Image {...SAUDIDENT_LOGOS.white} alt="سعودي دنت" sizes="180px" unoptimized />
          <p>طب الأسنان الحديث بتخصصاته تحت سقف واحد</p>
          <small>خميس مشيط · أبها</small>
        </div>
        <div className="sd-footer__contact">
          <a href={saudident.contact.phoneUrl}><Phone aria-hidden />{saudident.contact.phoneDisplay}</a>
          <a href={saudident.contact.emailUrl}><Mail aria-hidden />{saudident.contact.email}</a>
        </div>
        <div className="sd-footer__social" aria-label="حسابات سعودي دنت الرسمية">
          <a href={saudident.social.instagram} target="_blank" rel="noreferrer" aria-label="إنستغرام"><span aria-hidden="true">IG</span></a>
          <a href={saudident.social.x} target="_blank" rel="noreferrer" aria-label="إكس"><span aria-hidden="true">X</span></a>
          <a href={saudident.social.facebook} target="_blank" rel="noreferrer" aria-label="فيسبوك"><span aria-hidden="true">f</span></a>
        </div>
        <p className="sd-footer__legal">© {new Date().getFullYear()} سعودي دنت</p>
      </footer>
    </>
  );
}
