"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { aggregateThemes, clearHistory, loadHistory, type HistoryEntry } from "@/lib/exam/progress";
import { REGION_LABEL } from "@/lib/exam/regions";
import ProgressRing from "@/components/progress/ProgressRing";
import BelgiumMotif from "@/components/progress/BelgiumMotif";

const MODE_LABEL = { entrainement: "Entraînement", examen: "Examen blanc" } as const;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-BE", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
}

function percentOf(h: HistoryEntry): number {
  return Math.round((h.score / h.total) * 100);
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

  const percents = history.map(percentOf);
  const best = Math.max(...percents);
  const average = Math.round(percents.reduce((a, b) => a + b, 0) / percents.length);
  const themeStats = aggregateThemes(history);
  const weakThemes = themeStats.filter((t) => t.percent < 80);
  const entrainements = history.filter((h) => h.mode === "entrainement");
  const examens = history.filter((h) => h.mode === "examen");
  const last = history[history.length - 1];
  const lastPercent = percentOf(last);

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <BelgiumMotif />
        <div className="dashboard-hero-inner">
          <div className="dashboard-flag" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="dashboard-eyebrow">Permis B — Tableau de bord</p>
          <h1>Ta progression, sur cet appareil</h1>

          <div className="dashboard-hero-stats">
            <ProgressRing percent={average} label="score moyen" />
            <div className="dashboard-hero-figures">
              <div>
                <span className="fig-value">{best}%</span>
                <span className="fig-label">Meilleur score</span>
              </div>
              <div>
                <span className="fig-value">{history.length}</span>
                <span className="fig-label">Session{history.length > 1 ? "s" : ""} au total</span>
              </div>
              <div>
                <span className="fig-value">{themeStats.length}</span>
                <span className="fig-label">Chapitres suivis</span>
              </div>
            </div>
          </div>

          <div className="mode-pills">
            <span className="mode-pill training">● {entrainements.length} entraînement{entrainements.length > 1 ? "s" : ""}</span>
            <span className="mode-pill exam">● {examens.length} examen{examens.length > 1 ? "s" : ""} blanc{examens.length > 1 ? "s" : ""}</span>
          </div>
        </div>
      </section>

      <div className="wrap dashboard-body">
        <p className="progression-note">
          Propre à cet appareil et ce navigateur — pas sauvegardé en ligne, disparaît si tu vides tes données
          de navigation.
        </p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <span className="dashboard-card-icon" aria-hidden="true">📘</span>
            <h3>Mes chapitres</h3>
            <p className="dashboard-card-big">{themeStats.length - weakThemes.length}/{themeStats.length}</p>
            <p className="dashboard-card-detail">chapitres à 80 % ou plus</p>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-icon" aria-hidden="true">🎯</span>
            <h3>Mes entraînements</h3>
            <p className="dashboard-card-big">{entrainements.length}</p>
            <p className="dashboard-card-detail">
              {entrainements.length > 0
                ? `dernier : ${percentOf(entrainements[entrainements.length - 1])}%`
                : "aucun pour l'instant"}
            </p>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-icon" aria-hidden="true">⏱️</span>
            <h3>Mes examens blancs</h3>
            <p className="dashboard-card-big">{examens.length}</p>
            <p className="dashboard-card-detail">
              {examens.length > 0
                ? `dernier : ${percentOf(examens[examens.length - 1])}% — ${
                    examens[examens.length - 1].passed ? "réussi" : "échec"
                  }`
                : "aucun pour l'instant"}
            </p>
          </div>
        </div>

        <div className="last-session-card">
          <h3>Dernière session</h3>
          <p>
            {MODE_LABEL[last.mode]} · {REGION_LABEL[last.region]} · {formatDate(last.date)} —{" "}
            <strong>{last.score}/{last.total} ({lastPercent}%)</strong>
          </p>
          <p className="last-session-msg">
            {last.mode === "examen"
              ? last.passed
                ? "Réussi — continue sur cette lancée."
                : "Pas encore la bonne formule : regarde les chapitres à retravailler ci-dessous."
              : lastPercent >= 80
                ? "Bon entraînement — tu peux tenter un examen blanc complet."
                : "Encore un peu d'entraînement avant l'examen blanc."}
          </p>
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
                  <span className={"mode-pill small " + (h.mode === "entrainement" ? "training" : "exam")}>
                    {MODE_LABEL[h.mode]}
                  </span>
                  <span>{REGION_LABEL[h.region]}</span>
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
