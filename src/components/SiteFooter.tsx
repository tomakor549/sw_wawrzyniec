import Link from "next/link";
import type { Parish } from "@/types/content";

export function SiteFooter({ parish }: { parish: Parish }) {
  return (
    <footer className="mt-20 border-t border-sand/60 bg-wine-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">{parish.contact.name}</p>
          <p className="mt-3 text-cream/80">
            {parish.contact.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <p className="mt-4 text-cream/80">
            tel. {parish.contact.phone}
            {parish.contact.mobile ? (
              <>
                <br />
                kom. {parish.contact.mobile}
              </>
            ) : null}
            <br />
            <a className="underline decoration-gold/60 underline-offset-4" href={`mailto:${parish.contact.email}`}>
              {parish.contact.email}
            </a>
          </p>
        </div>
        <div>
          <p className="font-serif text-2xl">{parish.office.summary}</p>
          <ul className="mt-3 space-y-1 text-cream/80">
            {parish.office.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {parish.contact.bankAccount ? (
            <p className="mt-6 text-sm text-cream/80">
              Konto parafialne
              <br />
              <span className="font-mono text-gold-pale">{parish.contact.bankAccount}</span>
            </p>
          ) : null}
        </div>
        <div>
          <p className="font-serif text-2xl">Warto odwiedzić</p>
          <ul className="mt-3 space-y-1">
            {parish.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-cream/80 underline decoration-gold/50 underline-offset-4 hover:text-gold-pale"
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-sm text-cream/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {parish.name}. Wszelkie prawa zastrzeżone.</p>
          <p className="flex gap-4">
            <Link href="/standardy" className="hover:text-gold-pale">
              Ochrona małoletnich
            </Link>
            <Link href="/prywatnosc" className="hover:text-gold-pale">
              Prywatność
            </Link>
            <Link href="/admin" className="hover:text-gold-pale">
              Panel
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
