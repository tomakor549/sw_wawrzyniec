import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-dim">Redakcja</p>
      <h1 className="mt-2 font-serif text-4xl text-wine">Panel parafii</h1>
      <p className="mt-3 text-stone">Hasło ustawiasz w pliku środowiska ADMIN_PASSWORD.</p>
      <form action="/api/admin/login" method="post" className="mt-8 space-y-4">
        <label className="block text-sm">
          Hasło
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full border border-sand bg-white px-3 py-3"
          />
        </label>
        {error ? <p className="text-sm text-brick">Nieprawidłowe hasło.</p> : null}
        <button type="submit" className="w-full bg-wine py-3 text-cream">
          Zaloguj
        </button>
      </form>
    </div>
  );
}
