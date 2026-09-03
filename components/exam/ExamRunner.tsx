"use client";

import { useMemo, useState } from "react";
import type { Lang, QuestionBank, Region } from "@/lib/exam/types";
import { CONFIG, MODE } from "@/lib/exam/config";
import { drawExam } from "@/lib/exam/draw";
import { answer, computeResult, initExam } from "@/lib/exam/scoring";
import QuestionCard from "./QuestionCard";
import ResultScreen from "./ResultScreen";

interface Props {
  bank: QuestionBank;
  lang: Lang;
  region: Region;
}

export default function ExamRunner({ bank, lang, region }: Props) {
  const deck = useMemo(() => drawExam({ bank, lang, region }), [bank, lang, region]);
  const [state, setState] = useState(() => initExam(deck));

  if (deck.length === 0) {
    return (
      <div className="card">
        <p className="stem">
          Aucune question disponible pour cette région pour le moment. Reviens un peu plus tard.
        </p>
      </div>
    );
  }

  if (state.finished) {
    const result = computeResult(state, deck.length, CONFIG[MODE].passMark);
    return <ResultScreen result={result} />;
  }

  const current = state.deck[state.index];

  return (
    <QuestionCard
      key={current.question.id}
      drawn={current}
      questionNumber={state.index + 1}
      total={deck.length}
      onAnswer={(picked) => setState((s) => answer(s, picked))}
    />
  );
}
