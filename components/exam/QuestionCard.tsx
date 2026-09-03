"use client";

import { useEffect, useState } from "react";
import type { DrawnQuestion } from "@/lib/exam/types";
import { CONFIG, MODE } from "@/lib/exam/config";

interface Props {
  drawn: DrawnQuestion;
  questionNumber: number;
  total: number;
  onAnswer: (pickedIndex: number | null) => void;
}

/**
 * Affiche une question et gère son propre chronomètre. Le temps écoulé
 * déclenche une abstention automatique, comme à l'examen réel.
 * Lecture vocale (Web Speech API) volontairement pas encore branchée ici.
 */
export default function QuestionCard({ drawn, questionNumber, total, onAnswer }: Props) {
  const seconds = CONFIG[MODE].seconds;
  const [left, setLeft] = useState<number>(seconds);
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const content = drawn.question[drawn.lang];

  useEffect(() => {
    setLeft(seconds);
    setPicked(null);
    setAnswered(false);
  }, [drawn, seconds]);

  useEffect(() => {
    if (answered) return; // déjà répondu (ou abstenu), on n'attend plus le chrono
    if (left <= 0) {
      setAnswered(true);
      onAnswer(null);
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, answered]);

  function choose(i: number) {
    if (answered) return; // pas de retour en arrière sur une question validée
    setAnswered(true);
    setPicked(i);
    onAnswer(i);
  }

  function skip() {
    if (answered) return;
    setAnswered(true);
    onAnswer(null);
  }

  return (
    <div className="card">
      <p className="kicker">
        Question {questionNumber} / {total} — {drawn.question.theme[drawn.lang]}
      </p>
      <p className="timer" aria-live="polite">
        {left}s
      </p>
      <p className="stem">{content.stem}</p>
      <div className="opts">
        {content.opts.map((opt, i) => (
          <button
            key={i}
            className={"opt" + (picked === i ? " picked" : "")}
            onClick={() => choose(i)}
            disabled={answered}
          >
            {opt}
          </button>
        ))}
      </div>
      <button className="skip" onClick={skip} disabled={answered}>
        Je ne réponds pas
      </button>
    </div>
  );
}
