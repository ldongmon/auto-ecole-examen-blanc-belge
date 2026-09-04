"use client";

import { useEffect, useState } from "react";
import type { DrawnQuestion } from "@/lib/exam/types";
import { CONFIG, MODE } from "@/lib/exam/config";
import { isSpeechSupported, speak, stopSpeaking } from "@/lib/exam/speech";
import { uiStrings } from "@/lib/exam/i18n";
import QuestionVisual from "./QuestionVisual";

interface Props {
  drawn: DrawnQuestion;
  questionNumber: number;
  total: number;
  onAnswer: (pickedIndex: number | null) => void;
}

/**
 * Affiche une question et gère son propre chronomètre. Le temps écoulé
 * déclenche une abstention automatique, comme à l'examen réel.
 * L'énoncé est lu à voix haute (CLAUDE.md §3) via le champ `tts`, jamais
 * le `stem` affiché : c'est lui qui porte septante/nonante, pas l'écran.
 */
export default function QuestionCard({ drawn, questionNumber, total, onAnswer }: Props) {
  const seconds = CONFIG[MODE].seconds;
  const [left, setLeft] = useState<number>(seconds);
  const [picked, setPicked] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const content = drawn.question[drawn.lang];
  const ttsText = drawn.question.tts[drawn.lang];
  const t = uiStrings(drawn.lang);

  useEffect(() => {
    setLeft(seconds);
    setPicked(null);
    setAnswered(false);
  }, [drawn, seconds]);

  useEffect(() => {
    speak(ttsText, drawn.lang);
    return () => stopSpeaking();
    // Une seule lecture automatique par question, pas à chaque tick du chrono.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawn.question.id, drawn.lang]);

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
    stopSpeaking();
    setAnswered(true);
    setPicked(i);
    onAnswer(i);
  }

  function skip() {
    if (answered) return;
    stopSpeaking();
    setAnswered(true);
    onAnswer(null);
  }

  return (
    <div className="card">
      <p className="kicker">{t.questionLabel(questionNumber, total, drawn.question.theme[drawn.lang])}</p>
      <div className="timer-row">
        <p className="timer" aria-live="polite">
          {left}s
        </p>
        {isSpeechSupported() && (
          <button type="button" className="listen" onClick={() => speak(ttsText, drawn.lang)} aria-label={t.listenAria}>
            {t.listen}
          </button>
        )}
      </div>
      <QuestionVisual questionId={drawn.question.id} />
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
        {t.skip}
      </button>
    </div>
  );
}
