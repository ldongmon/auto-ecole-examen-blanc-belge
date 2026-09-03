import type { AnswerOutcome, DrawnQuestion, FaultRecord } from "./types";
import {
  ABSTENTION_HEAVY_PENALTY,
  ABSTENTION_ORDINARY_PENALTY,
  HEAVY_FAIL_COUNT,
  HEAVY_PENALTY,
  ORDINARY_PENALTY,
} from "./config";

export interface ExamState {
  deck: DrawnQuestion[];
  index: number;
  pointsLost: number;
  heavyFaultCount: number;
  faults: FaultRecord[];
  finished: boolean;
  /** Arrêt prématuré à la 2e faute grave, distinct d'une fin normale du tirage. */
  autoFailed: boolean;
}

export function initExam(deck: DrawnQuestion[]): ExamState {
  return { deck, index: 0, pointsLost: 0, heavyFaultCount: 0, faults: [], finished: false, autoFailed: false };
}

/**
 * Fait avancer l'examen d'une question : `pickedIndex` est l'option choisie,
 * ou `null` pour une abstention ("je ne réponds pas").
 * Ne modifie pas `state`, retourne le nouvel état.
 */
export function answer(state: ExamState, pickedIndex: number | null): ExamState {
  if (state.finished) return state;

  const current = state.deck[state.index];
  const isHeavy = current.question.gravite === "grave";
  const correct = pickedIndex !== null && pickedIndex === current.correctIndex;

  let outcome: AnswerOutcome;
  let pointsLost = 0;
  let heavyFaultDelta = 0;

  if (correct) {
    outcome = "correct";
  } else if (pickedIndex === null) {
    outcome = "abstention";
    pointsLost = isHeavy ? ABSTENTION_HEAVY_PENALTY : ABSTENTION_ORDINARY_PENALTY;
    // Volontairement pas de heavyFaultDelta ici : c'est tout l'intérêt de la
    // règle d'abstention (CLAUDE.md §3) — elle épargne aussi le compteur
    // d'échec automatique, pas seulement des points.
  } else {
    outcome = "wrong";
    pointsLost = isHeavy ? HEAVY_PENALTY : ORDINARY_PENALTY;
    heavyFaultDelta = isHeavy ? 1 : 0;
  }

  const faults = [...state.faults];
  if (outcome !== "correct") {
    faults.push({
      questionId: current.question.id,
      theme: current.question.theme[current.lang],
      gravite: current.question.gravite,
      outcome,
      pointsLost,
      fauteGraveRef: current.question.faute_grave_ref,
    });
  }

  const heavyFaultCount = state.heavyFaultCount + heavyFaultDelta;
  const nextIndex = state.index + 1;
  const autoFailed = heavyFaultCount >= HEAVY_FAIL_COUNT;
  const finished = autoFailed || nextIndex >= state.deck.length;

  return {
    ...state,
    index: nextIndex,
    pointsLost: state.pointsLost + pointsLost,
    heavyFaultCount,
    faults,
    finished,
    autoFailed,
  };
}

export interface ExamResult {
  passed: boolean;
  score: number;
  total: number;
  passMark: number;
  autoFailed: boolean;
  /** Score si les fautes graves n'avaient coûté que le tarif ordinaire (-1). */
  scoreWithoutHeavyFaults: number;
  heavyFaults: FaultRecord[];
  /** Chapitres classés par nombre d'erreurs, décroissant. */
  weakThemes: { theme: string; count: number }[];
}

export function computeResult(state: ExamState, total: number, passMark: number): ExamResult {
  const score = Math.max(0, total - state.pointsLost);
  const heavyFaults = state.faults.filter((f) => f.gravite === "grave" && f.outcome === "wrong");

  // "Sans tes fautes graves, tu étais à X/50" : on retire la surcharge des -5
  // (on ne retire que le delta 5→1, une faute grave reste une erreur réelle).
  const heavyOvercharge = heavyFaults.length * (HEAVY_PENALTY - ORDINARY_PENALTY);
  const scoreWithoutHeavyFaults = Math.min(total, score + heavyOvercharge);

  const weakByTheme = new Map<string, number>();
  for (const f of state.faults) {
    weakByTheme.set(f.theme, (weakByTheme.get(f.theme) ?? 0) + 1);
  }
  const weakThemes = [...weakByTheme.entries()]
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count);

  return {
    passed: !state.autoFailed && score >= passMark,
    score,
    total,
    passMark,
    autoFailed: state.autoFailed,
    scoreWithoutHeavyFaults,
    heavyFaults,
    weakThemes,
  };
}
