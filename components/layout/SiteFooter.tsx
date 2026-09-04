"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();
  const isNl = pathname?.startsWith("/nl");

  if (isNl) {
    return (
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="footer-disclaimer">
            Ontwikkelversie — de vragenbank is nog niet gevalideerd door een erkende rijinstructeur. Geen
            enkele afbeelding of vraag komt van een derde partij.
          </p>
          <nav className="footer-nav">
            <Link href="/nl/centre">Examencentra</Link>
            <Link href="/nl/infos">Praktische info</Link>
            <Link href="/nl/faq">FAQ</Link>
          </nav>
          <p className="footer-copy">Examen Blanc Belge — onafhankelijk project, niet verbonden aan GOCA.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p className="footer-disclaimer">
          Version de développement — le corpus de questions n&apos;est pas encore validé par un moniteur
          d&apos;auto-école agréé. Aucun visuel ni aucune question ne provient d&apos;un tiers.
        </p>
        <nav className="footer-nav">
          <Link href="/fr/centre">Centres d&apos;examen</Link>
          <Link href="/fr/infos">Infos pratiques</Link>
          <Link href="/fr/faq">FAQ</Link>
        </nav>
        <p className="footer-copy">Examen Blanc Belge — projet indépendant, non affilié au GOCA.</p>
      </div>
    </footer>
  );
}
