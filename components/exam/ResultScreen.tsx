"use client";

import { useState } from "react";
import type { ExamResult } from "@/lib/exam/scoring";

interface Props {
  result: ExamResult;
}

/**
 * Séquence obligatoire de CLAUDE.md §4 — ne jamais afficher un score nu.
 * La capture d'email est un stub local pour l'instant (pas d'envoi réel :
 * Resend/Brevo arrive en P0 dev, pas dans cette première passe du moteur).
 */
export default function ResultScreen({ result }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="card result">
      {/* 1. verdict */}
      <p className={"verdict " + (result.passed ? "pass" : "fail")}>
        {result.autoFailed
          ? "Échec — deux fautes graves"
          : result.passed
            ? "Réussi"
            : "Échec"}
      </p>

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

      {/* 5. chapitres faibles */}
      {result.weakThemes.length > 0 && (
        <div className="weak-themes">
          <h3>Chapitres à revoir</h3>
          <ul>
            {result.weakThemes.map((w) => (
              <li key={w.theme}>
                {w.theme} — {w.count} erreur{w.count > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. capture email */}
      <div className="email-capture">
        <h3>Reçois ton plan de révision</h3>
        {sent ? (
          <p>Merci — tu recevras ton plan de révision par email.</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input
              type="email"
              required
              placeholder="ton@email.be"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Recevoir</button>
          </form>
        )}
      </div>
    </div>
  );
}
