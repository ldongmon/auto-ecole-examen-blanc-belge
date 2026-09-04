import type { MetadataRoute } from "next";
import centresData from "@/data/centres.json";
import type { CentreBank } from "@/lib/exam/types";

const bank = centresData as unknown as CentreBank;

// SITE_URL doit être renseigné en prod (URL réelle après déploiement Vercel) ;
// on retombe sur localhost en dev pour ne pas planter le build en local.
const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "/fr",
    "/fr/centre",
    "/fr/infos",
    "/fr/faq",
    "/nl",
    "/nl/centre",
    "/nl/infos",
    "/nl/faq",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const centrePages = bank.centres.flatMap((c) => [
    { url: `${SITE_URL}/fr/centre/${c.slug}`, lastModified: new Date() },
    { url: `${SITE_URL}/nl/centre/${c.slug}`, lastModified: new Date() },
  ]);

  return [...staticPages, ...centrePages];
}
