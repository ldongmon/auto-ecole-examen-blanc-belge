import type { DrawnQuestion, Lang, Question, QuestionBank, Region } from "./types";
import { CONFIG, MODE, TARGET_GRAVE_RATIO } from "./config";

/**
 * Une question est servable si son statut est "live" — sauf en mode "demo",
 * où l'on tire dans tout le corpus pour pouvoir développer/tester avant toute
 * validation par un moniteur agréé (CLAUDE.md §7.3).
 */
export function isServable(q: Question): boolean {
  if (MODE === "demo") return true;
  return q.status === "live";
}

function matchesRegion(q: Question, region: Region): boolean {
  return q.region_scope === "ALL" || q.region_scope === region;
}

/** Bonne réponse résolue pour une langue et une région données. */
export function resolveCorrectIndex(q: Question, lang: Lang, region: Region): number {
  const content = q[lang];
  if (content.reponse_par_region) return content.reponse_par_region[region];
  if (typeof content.reponse === "number") return content.reponse;
  throw new Error(`Question ${q.id} (${lang}) : ni reponse ni reponse_par_region.`);
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export interface DrawOptions {
  bank: QuestionBank;
  lang: Lang;
  region: Region;
}

/**
 * Tire un jeu de questions respectant :
 * - `region_scope` (une question WAL ne sort jamais pour un candidat flamand),
 * - le rééquilibrage grave/ordinaire vers TARGET_GRAVE_RATIO (le corpus brut
 *   est volontairement à ~50 % de graves, l'examen réel ne l'est pas).
 *
 * Si le corpus disponible est trop pauvre dans une des deux catégories
 * (cas attendu tant qu'on est sous la cible de 100 questions), on complète
 * avec l'autre catégorie plutôt que d'échouer, et on le signale en console.
 */
export function drawExam({ bank, lang, region }: DrawOptions): DrawnQuestion[] {
  const eligible = bank.questions.filter((q) => isServable(q) && matchesRegion(q, region));

  const graves = shuffle(eligible.filter((q) => q.gravite === "grave"));
  const ordinaires = shuffle(eligible.filter((q) => q.gravite === "ordinaire"));

  const total = Math.min(CONFIG[MODE].count, eligible.length);
  let targetGrave = Math.round(total * TARGET_GRAVE_RATIO);
  targetGrave = Math.min(targetGrave, graves.length);
  let targetOrdinaire = total - targetGrave;

  if (targetOrdinaire > ordinaires.length) {
    // Pas assez de questions ordinaires disponibles : on repioche dans les graves.
    const deficit = targetOrdinaire - ordinaires.length;
    targetOrdinaire = ordinaires.length;
    targetGrave = Math.min(targetGrave + deficit, graves.length);
  }

  if (total > graves.length + ordinaires.length) {
    console.warn(
      `[examen] Corpus insuffisant pour ${region}/${lang} : ${eligible.length} question(s) ` +
        `servable(s) pour un tirage de ${total} (cible v0 : 100 — voir docs/ROADMAP.md).`
    );
  }

  const picked = shuffle([...graves.slice(0, targetGrave), ...ordinaires.slice(0, targetOrdinaire)]);

  return picked.map((question) => ({
    question,
    lang,
    correctIndex: resolveCorrectIndex(question, lang, region),
  }));
}
