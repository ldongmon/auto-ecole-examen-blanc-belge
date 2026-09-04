"use client";

import type { DrawnQuestion } from "@/lib/exam/types";
import QuestionVisual from "./QuestionVisual";

interface Props {
  drawn: DrawnQuestion;
  pickedIndex: number | null;
  onContinue: () => void;
}

/**
 * Correction pédagogique affichée en mode entraînement, après CHAQUE
 * question : le champ `why` existe déjà dans le corpus mais n'était encore
 * jamais montré au candidat avant cette version.
 */
export default function CorrectionPanel({ drawn, pickedIndex, onContinue }: Props) {
  const content = drawn.question[drawn.lang];
  const correct = pickedIndex === drawn.correctIndex;
  const abstained = pickedIndex === null;

  return (
    <div className="card correction">
      <p className={"verdict-chip " + (correct ? "pass" : abstained ? "neutral" : "fail")}>
        {correct ? "✅ Bonne réponse" : abstained ? "◻️ Pas de réponse" : "❌ Mauvaise réponse"}
      </p>

      <QuestionVisual questionId={drawn.question.id} />

      {!correct && !abstained && (
        <p className="your-answer">
          Ta réponse : <span>{content.opts[pickedIndex]}</span>
        </p>
      )}

      <p className="right-answer">
        Bonne réponse : <strong>{content.opts[drawn.correctIndex]}</strong>
      </p>

      <div className="why-box">
        <h3>Pourquoi ?</h3>
        <p>{content.why}</p>
      </div>

      <button className="go" onClick={onContinue}>
        Continuer →
      </button>
    </div>
  );
}
