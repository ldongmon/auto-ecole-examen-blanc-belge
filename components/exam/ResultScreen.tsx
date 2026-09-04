"use client";

import { useState } from "react";
import type { ExamResult } from "@/lib/exam/scoring";
import type { ExamMode, Lang } from "@/lib/exam/types";
import { uiStrings } from "@/lib/exam/i18n";
import type { Mistake } from "./ExamRunner";

interface Props {
  result: ExamResult;
  mode?: ExamMode;
  mistakes?: Mistake[];
  lang?: Lang;
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
export default function ResultScreen({ result, mode = "examen", mistakes = [], lang = "fr" }: Props) {
  const t = uiStrings(lang);
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

  const strong = result.themeStats.filter((th) => th.percent >= STRONG_THRESHOLD);
  const weak = result.themeStats.filter((th) => th.percent < STRONG_THRESHOLD);

  return (
    <div className="card result">
      {/* 1. verdict — en entraînement, pas de cadre réussite/échec :
          le but est de s'exercer, pas d'obtenir un verdict. */}
      {mode === "entrainement" ? (
        <p className="verdict neutral">{t.verdictTraining}</p>
      ) : (
        <p className={"verdict " + (result.passed ? "pass" : "fail")}>
          {result.autoFailed ? t.verdictAutoFail : result.passed ? t.verdictPass : t.verdictFail}
        </p>
      )}

      {/* 2. score réel */}
      <p className="score">
        {result.score} / {result.total}
        <span className="passmark"> {t.passMarkLabel(result.passMark)}</span>
      </p>

      {/* 3. score sans les fautes graves */}
      {result.heavyFaults.length > 0 && (
        <p className="without-heavy">{t.withoutHeavy(result.scoreWithoutHeavyFaults, result.total)}</p>
      )}

      {/* 4. liste nominative des fautes graves */}
      {result.heavyFaults.length > 0 && (
        <div className="heavy-list">
          <h3>{t.heavyFaultsTitle}</h3>
          <ul>
            {result.heavyFaults.map((f) => (
              <li key={f.questionId}>
                <strong>{f.theme}</strong>
                {/* faute_grave_ref n'existe qu'en français dans le corpus (liste
                    officielle des 50 fautes graves) — jamais affiché côté NL
                    pour ne pas mélanger les langues dans l'interface. */}
                {f.fauteGraveRef && lang === "fr" ? ` — ${f.fauteGraveRef}` : ""}
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
              <h3>{t.weakTitle}</h3>
              <ul>
                {weak.map((th) => (
                  <li key={th.theme}>
                    <span>{th.theme}</span>
                    <span className="theme-percent weak-percent">{th.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {strong.length > 0 && (
            <div className="theme-group strong">
              <h3>{t.strongTitle}</h3>
              <ul>
                {strong.map((th) => (
                  <li key={th.theme}>
                    <span>{th.theme}</span>
                    <span className="theme-percent strong-percent">{th.percent}%</span>
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
            {showMistakes ? t.reviewHide : t.reviewToggle(mistakes.length)}
          </button>
          {showMistakes && (
            <div className="mistake-list">
              {mistakes.map((m, i) => {
                const content = m.drawn.question[m.drawn.lang];
                return (
                  <div key={m.drawn.question.id + i} className="mistake-item">
                    <p className="mistake-stem">{content.stem}</p>
                    {m.pickedIndex !== null && (
                      <p className="your-answer">
                        {t.yourAnswer} {content.opts[m.pickedIndex]}
                      </p>
                    )}
                    <p className="right-answer">
                      {t.rightAnswer} <strong>{content.opts[m.drawn.correctIndex]}</strong>
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
        <h3>{t.emailTitle}</h3>
        {state === "sent" ? (
          <p>{t.emailSent}</p>
        ) : (
          <form onSubmit={submit}>
            <input
              type="email"
              required
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === "sending"}
            />
            <button type="submit" disabled={state === "sending"}>
              {state === "sending" ? t.emailSending : t.emailSubmit}
            </button>
          </form>
        )}
        {state === "error" && <p className="form-error">{t.emailError}</p>}
      </div>
    </div>
  );
}
