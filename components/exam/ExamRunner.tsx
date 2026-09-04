"use client";

import { useMemo, useState } from "react";
import type { DrawnQuestion, ExamMode, Lang, QuestionBank, Region } from "@/lib/exam/types";
import { CONFIG, MODE } from "@/lib/exam/config";
import { drawExam } from "@/lib/exam/draw";
import { answer, computeResult, initExam } from "@/lib/exam/scoring";
import QuestionCard from "./QuestionCard";
import CorrectionPanel from "./CorrectionPanel";
import ResultScreen from "./ResultScreen";

interface Props {
  bank: QuestionBank;
  lang: Lang;
  region: Region;
  /**
   * "examen" (défaut) : comportement historique, fidèle à l'examen réel —
   * arrêt à 2 fautes graves, pas de correction avant la fin.
   * "entrainement" : correction pédagogique après chaque question, pas
   * d'arrêt prématuré (on veut que le candidat s'exerce sur tout le tirage).
   */
  mode?: ExamMode;
}

export default function ExamRunner({ bank, lang, region, mode = "examen" }: Props) {
  const deck = useMemo(() => drawExam({ bank, lang, region }), [bank, lang, region]);
  const [state, setState] = useState(() => initExam(deck));
  const [pendingCorrection, setPendingCorrection] = useState<{
    drawn: DrawnQuestion;
    pickedIndex: number | null;
  } | null>(null);

  if (deck.length === 0) {
    return (
      <div className="card">
        <p className="stem">
          Aucune question disponible pour cette région pour le moment. Reviens un peu plus tard.
        </p>
      </div>
    );
  }

  function handleAnswer(current: DrawnQuestion, picked: number | null) {
    setState((s) => answer(s, picked, { enforceAutoFail: mode === "examen" }));
    if (mode === "entrainement") {
      setPendingCorrection({ drawn: current, pickedIndex: picked });
    }
  }

  if (pendingCorrection) {
    return (
      <CorrectionPanel
        drawn={pendingCorrection.drawn}
        pickedIndex={pendingCorrection.pickedIndex}
        onContinue={() => setPendingCorrection(null)}
      />
    );
  }

  if (state.finished) {
    const result = computeResult(state, deck.length, CONFIG[MODE].passMark);
    return <ResultScreen result={result} mode={mode} />;
  }

  const current = state.deck[state.index];

  return (
    <QuestionCard
      key={current.question.id}
      drawn={current}
      questionNumber={state.index + 1}
      total={deck.length}
      onAnswer={(picked) => handleAnswer(current, picked)}
    />
  );
}
