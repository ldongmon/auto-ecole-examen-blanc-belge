// Configuration du moteur — c'est ici qu'on passe du mode démo au mode réel.
// Reprend telle quelle la logique de reference/examen-blanc-belge.jsx.

export const CONFIG = {
  demo: { count: 10, passMark: 8, seconds: 15 },
  reel: { count: 50, passMark: 41, seconds: 15 },
} as const;

/**
 * "demo" tire dans TOUTES les questions du corpus, y compris non `live` —
 * indispensable tant qu'aucune question n'est signée par un moniteur.
 * Passer à "reel" seulement quand au moins `CONFIG.reel.count` questions
 * sont au statut `live` (CLAUDE.md §7.3 : ne jamais servir une question
 * non validée en dehors de ce mode de développement).
 */
export const MODE: "demo" | "reel" = "demo";

export const HEAVY_PENALTY = 5;
export const ORDINARY_PENALTY = 1;
export const HEAVY_FAIL_COUNT = 2;

/**
 * Abstention sur une question grave : coûte 1 point au lieu de 5, ET ne compte
 * pas dans le compteur d'échec automatique. Règle documentée dans CLAUDE.md §3
 * comme "non confirmée auprès du GOCA" — implémentée mais à ne pas mettre en
 * avant publiquement avant confirmation écrite.
 */
export const ABSTENTION_HEAVY_PENALTY = 1;
export const ABSTENTION_ORDINARY_PENALTY = 1;

/**
 * Proportion de fautes graves visée dans un tirage, pour rééquilibrer un
 * corpus volontairement à ~50 % de questions graves (CLAUDE.md §8).
 * VALEUR PROVISOIRE, non confirmée par un moniteur — à ajuster dès que
 * la vraie proportion de l'examen officiel est connue avec certitude.
 */
export const TARGET_GRAVE_RATIO = 0.3;
