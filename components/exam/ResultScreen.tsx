"use client";

import { useState } from "react";
import type { ExamResult } from "@/lib/exam/scoring";
import type { ExamMode } from "@/lib/exam/types";

interface Props {
  result: ExamResult;
  mode?: ExamMode;
}

type SendState = "idle" | "sending" | "sent" | "error";

/**
 * Séquence obligatoire de CLAUDE.md §4 — ne jamais afficher un score nu.
 * La capture d'email appelle app/api/subscribe (Brevo côté serveur, la clé
 * API n'est jamais exposée au client).
 */
export default function ResultScreen({ result, mode = "examen" }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SendState>("idle");

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
