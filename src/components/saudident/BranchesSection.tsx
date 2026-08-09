import Image from "next/image";
import { ArrowUpLeft, MapPin } from "lucide-react";
import { branches } from "@/data/saudident";

export function BranchesSection() {
  return (
    <section id="branches" className="sd-branches sd-section" aria-labelledby="branches-title">
      <div className="sd-section__meta" data-reveal>
        <span>07</span><p>حضورنا</p>
      </div>
      <header className="sd-branches__heading" data-reveal>
        <p className="sd-eyebrow">في قلب عسير</p>
        <h2 id="branches-title">مكانان.<br />معيار واحد.</h2>
      </header>
      <div className="sd-branches__split">
        {branches.map((branch, index) => (
          <article className="sd-branch" key={branch.id} data-reveal>
            <Image
              src={branch.image}
              alt={`فرع سعودي دنت في ${branch.name}`}
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
              className="sd-branch__image"
            />
            <div className="sd-branch__shade" />
            <span className="sd-branch__number" aria-hidden="true">0{index + 1}</span>
            <div className="sd-branch__content">
              <p>{branch.kicker}</p>
              <h3>{branch.name}</h3>
              <a href={branch.locationUrl} target="_blank" rel="noreferrer">
                <MapPin aria-hidden /> افتح الموقع <ArrowUpLeft aria-hidden />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
