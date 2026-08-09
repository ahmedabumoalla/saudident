import { storyMoments } from "@/data/saudident";

export function StorySection() {
  return (
    <section id="about" className="sd-story sd-section" aria-labelledby="story-title">
      <div className="sd-section__meta" data-reveal>
        <span>03</span><p>من نحن</p>
      </div>
      <header className="sd-story__intro" data-reveal>
        <p className="sd-eyebrow">The nerve line story</p>
        <h2 id="story-title">رؤيةٌ تسري<br />في كل تفصيل.</h2>
        <p>سعودي دنت عيادات أسنان استشارية تجمع تخصصات طب الأسنان الحديث تحت سقف واحد.</p>
      </header>
      <div className="sd-story__journey">
        <svg className="sd-story__nerve" viewBox="0 0 180 1000" preserveAspectRatio="none" aria-hidden="true">
          <path className="sd-story__nerve-shadow" d="M88 0C15 110 160 185 82 290S145 480 76 590 158 770 90 1000" pathLength="1" />
          <path className="sd-story__nerve-line" data-nerve-path d="M88 0C15 110 160 185 82 290S145 480 76 590 158 770 90 1000" pathLength="1" />
        </svg>
        <ol className="sd-story__moments">
          {storyMoments.map((moment, index) => (
            <li key={moment.id} className={index % 2 ? "is-left" : "is-right"} data-story-moment>
              <span className="sd-story__number">{moment.index}</span>
              <div>
                <h3>{moment.title}</h3>
                <p>{moment.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
