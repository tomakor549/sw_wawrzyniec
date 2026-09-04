import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">404</p>
      <h1 className="mt-3 font-serif text-4xl text-wine">Nie znaleziono strony</h1>
      <p className="mt-4 text-stone">Ten adres nie prowadzi do żadnej podstrony parafii.</p>
      <Link href="/" className="mt-8 inline-block bg-wine px-5 py-3 text-cream">
        Wróć na stronę główną
      </Link>
    </div>
  );
}
