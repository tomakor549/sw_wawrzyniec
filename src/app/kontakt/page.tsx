import { MassTimes } from "@/components/MassTimes";
import { PageHero } from "@/components/PageHero";
import { getParish } from "@/lib/parish";

export default async function ContactPage() {
  const parish = await getParish();
  return (
    <>
      <PageHero kicker="Kancelaria" title="Kontakt" lead="Zapraszamy osobiście, telefonicznie i listownie." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 lg:grid-cols-2">
        <div className="space-y-8">
          <section className="border border-sand/70 bg-white/80 p-6 shadow-card">
            <h2 className="font-serif text-2xl text-wine">{parish.contact.name}</h2>
            <p className="mt-3 text-stone">
              {parish.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p className="mt-4">
              tel. <a href={`tel:+48${parish.contact.phone.replace(/\s/g, "")}`}>{parish.contact.phone}</a>
              <br />
              {parish.contact.mobile ? (
                <>
                  kom. <a href={`tel:+48${parish.contact.mobile.replace(/\s/g, "")}`}>{parish.contact.mobile}</a>
                  <br />
                </>
              ) : null}
              <a className="text-brick underline decoration-gold underline-offset-4" href={`mailto:${parish.contact.email}`}>
                {parish.contact.email}
              </a>
            </p>
            {parish.contact.mapUrl ? (
              <a
                className="mt-4 inline-block text-sm text-brick underline decoration-gold underline-offset-4"
                href={parish.contact.mapUrl}
                rel="noreferrer"
                target="_blank"
              >
                Otwórz mapę
              </a>
            ) : null}
          </section>
          {parish.clergy.map((person) => (
            <section key={person.name} className="border border-sand/70 bg-cream/60 p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-gold-dim">{person.role}</p>
              <h2 className="mt-1 font-serif text-2xl text-wine">{person.name}</h2>
              {person.phone ? <p className="mt-2">tel. {person.phone}</p> : null}
              {person.email ? (
                <a className="text-brick underline decoration-gold underline-offset-4" href={`mailto:${person.email}`}>
                  {person.email}
                </a>
              ) : null}
            </section>
          ))}
          {parish.contact.bankAccount ? (
            <section className="border border-gold/40 bg-white p-6">
              <h2 className="font-serif text-2xl text-wine">Konto parafialne</h2>
              <p className="mt-2 font-mono">{parish.contact.bankAccount}</p>
              <p className="mt-2 text-sm text-stone">{parish.construction.accountNote}</p>
            </section>
          ) : null}
        </div>
        <div className="space-y-8">
          <MassTimes parish={parish} />
          <section className="border border-sand/70 bg-white/80 p-6">
            <h2 className="font-serif text-2xl text-wine">{parish.office.summary}</h2>
            <ul className="mt-3 space-y-1 text-stone">
              {parish.office.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="border border-sand/70 bg-white/80 p-6">
            <h2 className="font-serif text-2xl text-wine">Nabożeństwa stałe</h2>
            <ul className="mt-4 divide-y divide-sand/50">
              {parish.devotions.map((item) => (
                <li key={item.name} className="py-3">
                  <p className="font-medium text-wine">{item.name}</p>
                  <p className="text-sm text-stone">{item.when}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
