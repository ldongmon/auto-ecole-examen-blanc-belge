import Link from "next/link";

export default function SiteFooter() {
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
