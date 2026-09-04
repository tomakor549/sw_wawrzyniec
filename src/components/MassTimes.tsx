import type { Parish } from "@/types/content";

export function MassTimes({ parish }: { parish: Parish }) {
  return (
    <section aria-labelledby="msze-heading" className="border border-sand/70 bg-white/80 p-6 shadow-card md:p-8">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">Porządek stały</p>
      <h2 id="msze-heading" className="mt-2 font-serif text-3xl text-wine">
        Msze święte
      </h2>
      <ul className="mt-6 divide-y divide-sand/60">
        {parish.masses.map((slot) => (
          <li key={slot.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="font-medium text-ink">{slot.label}</span>
            <span className="font-serif text-xl text-wine">{slot.times.join(" · ")}</span>
          </li>
        ))}
      </ul>
      {parish.masses.some((slot) => slot.note) ? (
        <p className="mt-4 text-sm text-stone">
          {parish.masses
            .filter((slot) => slot.note)
            .map((slot) => slot.note)
            .join(" ")}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-stone">{parish.confessions}</p>
    </section>
  );
}
