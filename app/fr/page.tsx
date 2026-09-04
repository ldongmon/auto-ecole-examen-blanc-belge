"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Region } from "@/lib/exam/types";

const REGIONS: { value: Region; label: string }[] = [
  { value: "WAL", label: "Wallonie" },
  { value: "BRU", label: "Bruxelles" },
  { value: "VLA", label: "Flandre" },
];

const FEATURES = [
  {
    title: "Le vrai barème, pas une approximation",
    text: "Faute grave = −5 points, deux fautes graves = échec automatique. C'est la règle réelle de l'examen, pas 1 point par erreur comme ailleurs.",
  },
  {
    title: "Tu comprends, pas seulement tu réponds",
    text: "Après chaque question en mode entraînement : la bonne réponse, et surtout pourquoi — pour ne plus refaire la même erreur.",
  },
  {
    title: "Adapté à ta région",
    text: "Wallonie, Bruxelles, Flandre : les règles diffèrent réellement, pas seulement la langue. Le tirage respecte ta région d'examen.",
  },
  {
    title: "Gratuit, sans compte",
    text: "Tu t'entraînes tout de suite, sans créer de compte ni sortir ta carte bancaire.",
  },
];

const STEPS = [
  { n: 1, text: "Choisis ta région d'examen" },
  { n: 2, text: "Entraîne-toi, question par question, avec correction immédiate" },
  { n: 3, text: "Repère tes chapitres faibles" },
  { n: 4, text: "Termine par un examen blanc complet, dans les conditions réelles" },
];

export default function Home() {
  const router = useRouter();
  const [region, setRegion] = useState<Region>("WAL");

  return (
    <main>
      <section className="hero wrap">
        <div className="card hero-card">
          <p className="kicker">Examen blanc — Permis B</p>
          <h1>Le seul simulateur fidèle au vrai barème</h1>
          <p className="lead">
            Un candidat mal informé se prépare mal, et a donc moins de chances de réussir. Cette plateforme
            est là pour t&apos;aider à vraiment comprendre le code de la route belge — pas juste à deviner
            des réponses.
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

          <div className="cta-row">
            <button className="go" onClick={() => router.push(`/fr/examen?region=${region}&mode=entrainement`)}>
              Commencer mon entraînement
            </button>
            <button
              className="go secondary"
              onClick={() => router.push(`/fr/examen?region=${region}&mode=examen`)}
            >
              Faire un examen blanc complet
            </button>
          </div>

          <p className="note">Gratuit, sans compte. Version de développement — corpus non encore validé.</p>
          <p className="note">
            <Link href="/fr/centre">Trouver mon centre d&apos;examen →</Link>
          </p>
        </div>
      </section>

      <section className="wrap section-block">
        <div className="section-inner">
          <h2>Pourquoi s&apos;entraîner ici ?</h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section-block alt">
        <div className="section-inner">
          <h2>Comment ça marche ?</h2>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap section-block">
        <div className="section-inner infos-teaser">
          <h2>À savoir avant de te présenter</h2>
          <ul>
            <li>L&apos;attestation théorique réussie est valable 3 ans, non prolongeable.</li>
            <li>Après 2 échecs consécutifs, 12h de cours en auto-école agréée deviennent obligatoires.</li>
            <li>Ta formation doit se dérouler entièrement dans la même région.</li>
          </ul>
          <Link className="go secondary" href="/fr/infos">
            Voir toutes les infos pratiques →
          </Link>
        </div>
      </section>
    </main>
  );
}
