export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border/70 bg-sand/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-5 sm:py-20 md:py-28">
        <p className="eyebrow fade-up">{eyebrow}</p>
        <h1 className="fade-up mt-4 max-w-3xl text-[clamp(1.9rem,7vw,3.75rem)] leading-[1.1] text-balance">
          {title}
        </h1>
        {description && (
          <p className="fade-up mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
