import type { Metadata } from "next";
import Link from "next/link";
import centresData from "@/data/centres.json";
import type { Centre, CentreBank, Region } from "@/lib/exam/types";
import { REGION_LABEL_NL } from "@/lib/exam/regions";

const bank = centresData as unknown as CentreBank;

export const metadata: Metadata = {
  title: "Alle examencentra rijbewijs B in België",
  description: "Vind je theorie-examencentrum en oefen gratis voordat je je aanbiedt.",
};

function groupByRegion(centres: Centre[]): Record<Region, Centre[]> {
  return {
    WAL: centres.filter((c) => c.region === "WAL"),
    BRU: centres.filter((c) => c.region === "BRU"),
    VLA: centres.filter((c) => c.region === "VLA"),
  };
}

export default function CentresIndexPageNL() {
  const grouped = groupByRegion(bank.centres);

  return (
    <main className="wrap">
      <div className="card centre-index">
        <p className="kicker">Examencentra</p>
        <h1>Vind je centrum, oefen voor je erheen gaat</h1>
        <p className="lead">
          {bank.centres.length} examencentra voor rijbewijs B in België. Kies het jouwe voor een proefexamen
          afgestemd op de regels van dat gewest.
        </p>

        {(Object.keys(grouped) as Region[]).map((region) => (
          <div key={region} className="centre-group">
            <h2>{REGION_LABEL_NL[region]}</h2>
            <ul className="centre-list">
              {grouped[region].map((c) => (
                <li key={c.slug}>
                  <Link href={`/nl/centre/${c.slug}`}>{c.ville}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
