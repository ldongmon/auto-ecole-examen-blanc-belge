"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { aggregateThemes, clearHistory, loadHistory, type HistoryEntry } from "@/lib/exam/progress";
import { REGION_LABEL } from "@/lib/exam/regions";

const MODE_LABEL = { entrainement: "Entraînement", examen: "Examen blanc" } as const;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function ProgressionPage() {
  // L'historique vit dans localStorage, donc indisponible au rendu serveur :
  // on l'affiche seulement après montage pour éviter un mismatch d'hydratation.
  const [history, setHistory] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  if (history === null) {
    return (
      <main className="wrap">
        <div className="card" />
      </main>
    );
  }

  if (history.length === 0) {
    return (
      <main className="wrap">
        <div className="card">
          <p className="kicker">Ma progression</p>
          <h1>Pas encore d&apos;historique</h1>
          <p className="lead">
            Fais un entraînement ou un examen blanc pour commencer à suivre ta progression.
          </p>
          <Link className="go" href="/fr/examen?mode=entrainement">
            Commencer mon entraînement
          </Link>
        </div>
      </main>
    );
  }

  const percents = history.map((h) => Math.round((h.score / h.total) * 100));
  const best = Math.max(...percents);
  const average = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
  const weakThemes = aggregateThemes(history).filter((t) => t.percent < 80);

  return (
    <main className="wrap">
      <div className="card progression-page">
        <p className="kicker">Ma progression</p>
        <h1>{history.length} session{history.length > 1 ? "s" : ""} enregistrée{history.length > 1 ? "s" : ""}</h1>
        <p className="progression-note">
          Cette progression est propre à cet appareil et ce navigateur — elle n&apos;est pas sauvegardée en
          ligne et disparaît si tu vides tes données de navigation.
        </p>

        <div className="stat-row">
          <div className="stat-box">
            <span className="stat-value">{best}%</span>
            <span className="stat-label">Meilleur score</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{average}%</span>
            <span className="stat-label">Score moyen</span>
          </div>
        </div>

        {weakThemes.length > 0 && (
          <div className="theme-group weak">
            <h3>Chapitres à retravailler en priorité</h3>
            <ul>
              {weakThemes.map((t) => (
                <li key={t.theme}>
                  <span>{t.theme}</span>
                  <span className="theme-percent weak-percent">{t.percent}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="history-list">
          <h3>Historique récent</h3>
          <ul>
            {[...history]
              .reverse()
              .slice(0, 10)
              .map((h, i) => (
                <li key={i}>
                  <span>{formatDate(h.date)}</span>
                  <span>
                    {MODE_LABEL[h.mode]} · {REGION_LABEL[h.region]}
                  </span>
                  <span className={h.passed ? "history-score pass" : "history-score"}>
                    {h.score}/{h.total}
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <button
          className="clear-history"
          onClick={() => {
            clearHistory();
            setHistory([]);
          }}
        >
          Vider mon historique
        </button>
      </div>
    </main>
  );
}
