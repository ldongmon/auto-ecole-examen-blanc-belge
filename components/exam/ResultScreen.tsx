"use client";

import { useState } from "react";
import type { ExamResult } from "@/lib/exam/scoring";
import type { ExamMode } from "@/lib/exam/types";
import type { Mistake } from "./ExamRunner";

interface Props {
  result: ExamResult;
  mode?: ExamMode;
  mistakes?: Mistake[];
}

type SendState = "idle" | "sending" | "sent" | "error";

// Seuil au-delà duquel un chapitre est considéré comme un point fort plutôt
// qu'un point à améliorer.
const STRONG_THRESHOLD = 80;

/**
 * Séquence obligatoire de CLAUDE.md §4 — ne jamais afficher un score nu.
 * La capture d'email appelle app/api/subscribe (Brevo côté serveur, la clé
 * API n'est jamais exposée au client).
 */
export default function ResultScreen({ result, mode = "examen", mistakes = [] }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SendState>("idle");
  const [showMistakes, setShowMistakes] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  const strong = result.themeStats.filter((t) => t.percent >= STRONG_THRESHOLD);
  const weak = result.themeStats.filter((t) => t.percent < STRONG_THRESHOLD);

  return (
    <div className="card result">
      {/* 1. verdict — en entraînement, pas de cadre réussite/échec :
          le but est de s'exercer, pas d'obtenir un verdict. */}
      {mode === "entrainement" ? (
        <p className="verdict neutral">Session d&apos;entraînement terminée</p>
      ) : (
        <p className={"verdict " + (result.passed ? "pass" : "fail")}>
          {result.autoFailed
            ? "Échec — deux fautes graves"
            : result.passed
              ? "Réussi"
              : "Échec"}
        </p>
      )}

      {/* 2. score réel */}
      <p className="score">
        {result.score} / {result.total}
        <span className="passmark"> (seuil de réussite : {result.passMark})</span>
      </p>

      {/* 3. score sans les fautes graves */}
      {result.heavyFaults.length > 0 && (
        <p className="without-heavy">
          Sans tes fautes graves, tu étais à {result.scoreWithoutHeavyFaults} / {result.total}.
        </p>
      )}

      {/* 4. liste nominative des fautes graves */}
      {result.heavyFaults.length > 0 && (
        <div className="heavy-list">
          <h3>Fautes graves commises</h3>
          <ul>
            {result.heavyFaults.map((f) => (
              <li key={f.questionId}>
                <strong>{f.theme}</strong>
                {f.fauteGraveRef ? ` — ${f.fauteGraveRef}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 5. analyse par chapitre : points forts / points à améliorer */}
      {result.themeStats.length > 0 && (
        <div className="theme-stats">
          {weak.length > 0 && (
            <div className="theme-group weak">
              <h3>Points à améliorer</h3>
              <ul>
                {weak.map((t) => (
                  <li key={t.theme}>
                    <span>{t.theme}</span>
                    <span className="theme-percent weak-percent">{t.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {strong.length > 0 && (
            <div className="theme-group strong">
              <h3>Points forts</h3>
              <ul>
                {strong.map((t) => (
                  <li key={t.theme}>
                    <span>{t.theme}</span>
                    <span className="theme-percent strong-percent">{t.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Revoir mes erreurs */}
      {mistakes.length > 0 && (
        <div className="review-mistakes">
          <button className="go secondary" onClick={() => setShowMistakes((s) => !s)}>
            {showMistakes ? "Masquer mes erreurs" : `Revoir mes erreurs (${mistakes.length})`}
          </button>
          {showMistakes && (
            <div className="mistake-list">
              {mistakes.map((m, i) => {
                const content = m.drawn.question[m.drawn.lang];
                return (
                  <div key={m.drawn.question.id + i} className="mistake-item">
                    <p className="mistake-stem">{content.stem}</p>
                    {m.pickedIndex !== null && (
                      <p className="your-answer">Ta réponse : {content.opts[m.pickedIndex]}</p>
                    )}
                    <p className="right-answer">
                      Bonne réponse : <strong>{content.opts[m.drawn.correctIndex]}</strong>
                    </p>
                    <p className="mistake-why">{content.why}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. capture email */}
      <div className="email-capture">
        <h3>Reçois ton plan de révision</h3>
        {state === "sent" ? (
          <p>Merci — tu recevras ton plan de révision par email.</p>
        ) : (
          <form onSubmit={submit}>
            <input
              type="email"
              required
              placeholder="ton@email.be"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === "sending"}
            />
            <button type="submit" disabled={state === "sending"}>
              {state === "sending" ? "Envoi..." : "Recevoir"}
            </button>
          </form>
        )}
        {state === "error" && (
          <p className="form-error">Inscription impossible pour le moment — réessaie dans un instant.</p>
        )}
      </div>
    </div>
  );
}
