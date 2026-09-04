"use client";

import { useEffect, useRef, useState } from "react";
import type { DrawnQuestion, ExamMode, Lang, QuestionBank, Region } from "@/lib/exam/types";
import { CONFIG, MODE } from "@/lib/exam/config";
import { drawExam } from "@/lib/exam/draw";
import { answer, computeResult, initExam, type ExamState } from "@/lib/exam/scoring";
import { pushHistoryEntry } from "@/lib/exam/progress";
import { uiStrings } from "@/lib/exam/i18n";
import QuestionCard from "./QuestionCard";
import CorrectionPanel from "./CorrectionPanel";
import ResultScreen from "./ResultScreen";

export interface Mistake {
  drawn: DrawnQuestion;
  pickedIndex: number | null;
}

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
  // Le tirage utilise Math.random() (drawExam -> shuffle) : le calculer
  // pendant le rendu (useMemo/useState lazy) donne un résultat différent au
  // rendu serveur et au premier rendu client, ce qui casse l'hydratation
  // React (le HTML servi ne correspond plus à ce que le client recalcule).
  // On ne tire donc qu'après le montage, côté client uniquement (useEffect
  // ne s'exécute jamais pendant le rendu serveur) — état null le temps du
  // premier rendu, identique des deux côtés, pas de désaccord possible.
  const [state, setState] = useState<ExamState | null>(null);
  const [pendingCorrection, setPendingCorrection] = useState<Mistake | null>(null);
  // Historique des réponses ratées (faux + abstentions), pour "Revoir mes
  // erreurs" côté résultat. Distinct de `state.faults` (scoring.ts) qui ne
  // garde que des identifiants/thèmes, pas la question complète à réafficher.
  const [mistakes, setMistakes] = useState<Mistake[]>([]);

  useEffect(() => {
    const deck = drawExam({ bank, lang, region });
    setState(initExam(deck));
    setPendingCorrection(null);
    setMistakes([]);
  }, [bank, lang, region]);

  if (state === null) {
    // Même balisage minimal des deux côtés le temps du tirage client — évite
    // tout flash de contenu incohérent plutôt que d'afficher un squelette.
    return <div className="card" />;
  }

  if (state.deck.length === 0) {
    return (
      <div className="card">
        <p className="stem">{uiStrings(lang).noQuestions}</p>
      </div>
    );
  }

  function handleAnswer(current: DrawnQuestion, picked: number | null) {
    setState((s) => (s ? answer(s, picked, { enforceAutoFail: mode === "examen" }) : s));
    if (picked !== current.correctIndex) {
      setMistakes((m) => [...m, { drawn: current, pickedIndex: picked }]);
    }
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
    const result = computeResult(state, state.deck.length, CONFIG[MODE].passMark);
    return (
      <FinishedExam
        result={result}
        mode={mode}
        mistakes={mistakes}
        lang={lang}
        region={region}
      />
    );
  }

  const current = state.deck[state.index];

  return (
    <QuestionCard
      key={current.question.id}
      drawn={current}
      questionNumber={state.index + 1}
      total={state.deck.length}
      onAnswer={(picked) => handleAnswer(current, picked)}
    />
  );
}

interface FinishedExamProps {
  result: ReturnType<typeof computeResult>;
  mode: ExamMode;
  mistakes: Mistake[];
  lang: Lang;
  region: Region;
}

/**
 * Enregistre le résultat dans l'historique localStorage exactement une fois
 * (au montage), puis affiche l'écran de résultat habituel. Séparé
 * d'ExamRunner pour que l'effet ne se redéclenche pas à chaque re-render.
 */
function FinishedExam({ result, mode, mistakes, lang, region }: FinishedExamProps) {
  const saved = useRef(false);

  useEffect(() => {
    if (saved.current) return;
    saved.current = true;
    pushHistoryEntry({
      date: new Date().toISOString(),
      lang,
      region,
      mode,
      score: result.score,
      total: result.total,
      passed: result.passed,
      themeStats: result.themeStats,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ResultScreen result={result} mode={mode} mistakes={mistakes} lang={lang} />;
}
