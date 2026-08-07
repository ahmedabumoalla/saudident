export function SectionTitle({ eyebrow, title, description, count }: { eyebrow: string; title: string; description: string; count?: number }) {
  return (
    <header className="section-title">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {typeof count === "number" && <small>{count} وجهات قابلة للاستكشاف</small>}
    </header>
  );
}
