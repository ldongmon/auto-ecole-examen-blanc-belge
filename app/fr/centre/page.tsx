import type { Metadata } from "next";
import Link from "next/link";
import centresData from "@/data/centres.json";
import type { Centre, CentreBank, Region } from "@/lib/exam/types";
import { REGION_LABEL } from "@/lib/exam/regions";

const bank = centresData as unknown as CentreBank;

export const metadata: Metadata = {
  title: "Tous les centres d'examen du permis B en Belgique",
  description:
    "Trouve ton centre d'examen théorique du permis B et entraîne-toi gratuitement avant de t'y présenter.",
};

function groupByRegion(centres: Centre[]): Record<Region, Centre[]> {
  return {
    WAL: centres.filter((c) => c.region === "WAL"),
    BRU: centres.filter((c) => c.region === "BRU"),
    VLA: centres.filter((c) => c.region === "VLA"),
  };
}

export default function CentresIndexPage() {
  const grouped = groupByRegion(bank.centres);

  return (
    <main className="wrap">
      <div className="card centre-index">
        <p className="kicker">Centres d&apos;examen</p>
        <h1>Trouve ton centre, entraîne-toi avant d&apos;y aller</h1>
        <p className="lead">
          {bank.centres.length} centres d&apos;examen du permis B en Belgique. Choisis le tien pour un examen
          blanc calé sur les règles de sa région.
        </p>

        {(Object.keys(grouped) as Region[]).map((region) => (
          <div key={region} className="centre-group">
            <h2>{REGION_LABEL[region]}</h2>
            <ul className="centre-list">
              {grouped[region].map((c) => (
                <li key={c.slug}>
                  <Link href={`/fr/centre/${c.slug}`}>{c.ville}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
