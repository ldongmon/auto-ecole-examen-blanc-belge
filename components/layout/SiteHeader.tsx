"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/fr", label: "Accueil" },
  { href: "/fr/examen?mode=entrainement", label: "S'entraîner" },
  { href: "/fr/centre", label: "Centres d'examen" },
  { href: "/fr/infos", label: "Infos pratiques" },
  { href: "/fr/faq", label: "FAQ" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isNl = pathname?.startsWith("/nl");

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/fr" className="brand" onClick={() => setOpen(false)}>
          🚗 Examen Blanc Belge
        </Link>

        <button
          className="nav-toggle"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        <nav className={"site-nav" + (open ? " open" : "")}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href.split("?")[0] ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <span className="lang-switch">
            <Link href="/fr" className={!isNl ? "active" : ""}>
              FR
            </Link>
            <span aria-hidden="true"> · </span>
            <Link href="/nl" className={isNl ? "active" : ""}>
              NL
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
}
