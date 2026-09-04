"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/aktualnosci", label: "Aktualności" },
  { href: "/intencje", label: "Intencje" },
  { href: "/galeria", label: "Galeria" },
  { href: "/o-parafii", label: "O parafii" },
  { href: "/sakramenty", label: "Sakramenty" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-sand/50 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="min-w-0" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-sand text-wine md:hidden"
          aria-expanded={open}
          aria-controls="menu-glowne"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Zamknij menu" : "Otwórz menu"}</span>
          <span className="flex flex-col gap-1.5">
            <span className={`block h-0.5 w-5 bg-wine transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-wine transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-wine transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
        <nav
          id="menu-glowne"
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col border-b border-sand/50 bg-paper px-4 py-3 md:static md:flex md:flex-row md:flex-wrap md:items-center md:gap-1 md:border-0 md:bg-transparent md:p-0`}
        >
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-sm px-3 py-2 text-[0.95rem] transition ${
                  active ? "bg-wine text-cream" : "text-ink/80 hover:bg-cream hover:text-wine"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
