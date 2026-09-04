export function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-12">
      {kicker ? (
        <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">{kicker}</p>
      ) : null}
      <h1 className="mt-2 font-serif text-4xl text-wine md:text-5xl">{title}</h1>
      {lead ? <p className="mt-4 max-w-2xl text-lg text-stone">{lead}</p> : null}
      <div className="gold-rule mt-8" />
    </div>
  );
}
