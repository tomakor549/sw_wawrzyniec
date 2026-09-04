import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getParish, siteUrl } from "@/lib/parish";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const parish = await getParish();
  const title = `${parish.name} | Wilchwy`;
  const description = `${parish.contact.name} w Wodzisławiu Śląskim. Msze święte, ogłoszenia, intencje i galeria.`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${parish.shortName}` },
    description,
    openGraph: {
      title,
      description,
      locale: "pl_PL",
      type: "website",
      images: [{ url: `${siteUrl}/images/parafia.jpg` }],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const parish = await getParish();
  return (
    <html lang="pl" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen">
        <a className="skip-link" href="#tresc">
          Przejdź do treści
        </a>
        <SiteHeader />
        <main id="tresc">{children}</main>
        <SiteFooter parish={parish} />
      </body>
    </html>
  );
}
