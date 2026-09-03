"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Region } from "@/lib/exam/types";

const REGIONS: { value: Region; label: string }[] = [
  { value: "WAL", label: "Wallonie" },
  { value: "BRU", label: "Bruxelles" },
  { value: "VLA", label: "Flandre" },
];

export default function Home() {
  const router = useRouter();
  const [region, setRegion] = useState<Region>("WAL");

  return (
    <main className="wrap">
      <div className="card">
        <p className="kicker">Examen blanc — Permis B</p>
        <h1>Le seul simulateur fidèle au vrai barème</h1>
        <p className="lead">
          Faute grave : -5 points. Deux fautes graves : échec automatique, quel que soit ton score.
          C&apos;est la règle réelle de l&apos;examen — pas 1 point par erreur comme ailleurs.
        </p>

        <div className="field">
          <label htmlFor="region">Région d&apos;examen</label>
          <select id="region" value={region} onChange={(e) => setRegion(e.target.value as Region)}>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <p className="hint">Les règles diffèrent réellement par région, pas seulement la langue.</p>
        </div>

        <button className="go" onClick={() => router.push(`/fr/examen?region=${region}`)}>
          Démarrer l&apos;examen blanc
        </button>
        <p className="note">Gratuit, sans compte. Version de développement — corpus non encore validé.</p>
      </div>
    </main>
  );
}
