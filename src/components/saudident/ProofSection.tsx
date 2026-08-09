import { stats } from "@/data/saudident";

export function ProofSection() {
  return (
    <section id="proof" className="sd-proof sd-section" aria-labelledby="proof-title">
      <div className="sd-section__meta" data-reveal>
        <span>02</span><p>دليل حقيقي</p>
      </div>
      <div className="sd-section__heading" data-reveal>
        <p className="sd-eyebrow">أرقام من واقع سعودي دنت</p>
        <h2 id="proof-title">خبرة تنمو.<br />وحضور يتّسع.</h2>
      </div>
      <div className="sd-proof__installation">
        <svg className="sd-proof__arch" viewBox="0 0 1000 430" fill="none" aria-hidden="true">
          <path className="sd-proof__arch-shadow" d="M50 380C190 45 810 45 950 380" pathLength="1" />
          <path className="sd-proof__arch-line" data-draw-path d="M50 380C190 45 810 45 950 380" pathLength="1" />
        </svg>
        <ul className="sd-proof__stats">
          {stats.map((stat, index) => (
            <li key={stat.label} className={`sd-proof__stat sd-proof__stat--${index + 1}`} data-proof-stat>
              <strong dir="ltr">{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
