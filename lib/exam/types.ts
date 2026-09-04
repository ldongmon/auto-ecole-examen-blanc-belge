// Types alignés sur data/questions.json (voir CLAUDE.md §6).
// Une question porte deux blocs de contenu indépendants (fr / nl) : chacun a
// son propre `reponse`, car l'énoncé ET la réponse peuvent différer par langue
// (ce n'est jamais qu'une traduction — voir CLAUDE.md §10).

export type Lang = "fr" | "nl";

/**
 * "examen" (défaut) : comportement fidèle à l'examen réel — arrêt à 2 fautes
 * graves, pas de correction avant la fin. "entrainement" : correction
 * pédagogique après chaque question, pas d'arrêt prématuré.
 */
export type ExamMode = "entrainement" | "examen";
export type Region = "WAL" | "BRU" | "VLA";
export type RegionScope = "ALL" | Region;

export interface QuestionContent {
  stem: string;
  opts: string[];
  /** Index (0-based) de la bonne réponse. Absent si `reponse_par_region` est utilisé. */
  reponse?: number;
  /** Remplace `reponse` quand la bonne réponse dépend de la région d'examen. */
  reponse_par_region?: Record<Region, number>;
  why: string;
}

export interface QuestionMedia {
  type: string;
  brief: string;
  alt_fr?: string;
  alt_nl?: string;
}

export interface Question {
  id: string;
  theme: { fr: string; nl: string };
  sous_theme: string;
  gravite: "ordinaire" | "grave";
  /** 3 | 4 | null. Une faute grave "vitesse" n'a pas de degré fixe (null). */
  degre: 3 | 4 | null;
  faute_grave_ref?: string;
  ref_legale?: string;
  region_scope: RegionScope;
  media: QuestionMedia | null;
  /**
   * Codes de panneaux réglementaires illustrant la question (résolus par
   * lib/signs/resolveSign.ts, jamais un chemin de fichier en dur). Distinct
   * de `media`, qui reste réservé aux scènes de circulation à produire plus
   * tard (voir docs/BACKLOG-VISUELS.md).
   */
  signs?: string[];
  fr: QuestionContent;
  nl: QuestionContent;
  tts: { fr: string; nl: string };
  revue: string[];
  /**
   * CLAUDE.md §7.3 : une question ne peut être servie en production que si
   * `status === "live"`, après signature d'un moniteur agréé. Le corpus actuel
   * ne porte pas encore ce champ (aucune question n'est validée) — voir
   * `resolveAnswer`/`isServable` dans draw.ts pour la porte de sécurité.
   */
  status?: "draft" | "live";
}

export interface QuestionBank {
  _meta: Record<string, unknown>;
  questions: Question[];
}

/** Une question tirée, résolue pour une langue et une région données. */
export interface DrawnQuestion {
  question: Question;
  lang: Lang;
  /** Bonne réponse déjà résolue pour la langue/région du candidat. */
  correctIndex: number;
}

export type AnswerOutcome = "correct" | "wrong" | "abstention";

export interface Centre {
  slug: string;
  ville: string;
  region: Region;
  reseau: string;
  operateur_url: string;
}

export interface CentreBank {
  _meta: Record<string, unknown>;
  centres: Centre[];
}

export interface FaultRecord {
  questionId: string;
  theme: string;
  gravite: "ordinaire" | "grave";
  outcome: AnswerOutcome;
  pointsLost: number;
  fauteGraveRef?: string;
}
