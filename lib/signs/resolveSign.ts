import signsData from "@/data/signs.json";

export type SignRegime = "AR1975" | "CVP2027";

export interface SignEntry {
  code: string;
  regime: SignRegime;
  valid_from: string;
  valid_until: string | null;
  category: string;
  label: { fr: string; nl: string };
  asset: string;
  source: string;
  licence: string;
  status: "draft" | "validated" | "live";
}

export interface SignAsset {
  code: string;
  regime: SignRegime;
  asset: string;
  label: { fr: string; nl: string };
}

const ALL_SIGNS = (signsData as { signs: SignEntry[] }).signs;

/**
 * Date effective pour la résolution des panneaux. `SIGN_DATE_OVERRIDE`
 * (ISO 8601, ex. "2027-06-01") permet de tester le rendu à une date donnée
 * sans changer l'horloge système — utilisé par scripts/test_signs.mjs.
 * Côté client, la variable doit être préfixée NEXT_PUBLIC_ pour être inline
 * au build ; on regarde les deux pour couvrir serveur et navigateur.
 */
export function getEffectiveDate(): Date {
  const override =
    (typeof process !== "undefined" &&
      (process.env.SIGN_DATE_OVERRIDE || process.env.NEXT_PUBLIC_SIGN_DATE_OVERRIDE)) ||
    null;
  return override ? new Date(override) : new Date();
}

/**
 * Résout un code de panneau à une date donnée.
 *
 * - Choisit l'entrée (AR1975 ou CVP2027) dont la fenêtre de validité contient
 *   `atDate`. Retourne `null` si aucune fenêtre ne correspond (panneau plus
 *   valide, ou pas encore).
 * - Lève une erreur explicite si le code n'existe dans aucun régime.
 * - N'importe jamais un panneau au statut différent de `live` quand
 *   `NODE_ENV=production` — même logique que le statut des questions
 *   (CLAUDE.md §7.3) : un panneau non validé par un moniteur ne doit jamais
 *   atteindre un vrai candidat, même si sa fenêtre de date est valide.
 *
 * `dataset` est injectable (défaut : le vrai data/signs.json) pour permettre
 * de tester la logique de bascule de régime avec un jeu de données maîtrisé —
 * utile tant qu'aucun panneau réel n'a encore de version CVP2027 dans le vrai
 * fichier (le pack Vias n'est pas encore intégré, voir docs/BACKLOG-VISUELS.md).
 */
export function resolveSign(
  code: string,
  atDate: Date = getEffectiveDate(),
  dataset: SignEntry[] = ALL_SIGNS
): SignAsset | null {
  const entries = dataset.filter((s) => s.code === code);
  if (entries.length === 0) {
    throw new Error(`resolveSign: panneau inconnu "${code}" (absent de data/signs.json).`);
  }

  for (const entry of entries) {
    const from = new Date(entry.valid_from);
    const until = entry.valid_until ? new Date(entry.valid_until) : null;
    const inWindow = atDate >= from && (!until || atDate < until);
    if (!inWindow) continue;

    if (entry.status !== "live" && process.env.NODE_ENV === "production") {
      // Fenêtre de date correcte, mais pas encore validé par un moniteur :
      // on n'expose jamais ce panneau à un vrai candidat.
      return null;
    }

    return { code: entry.code, regime: entry.regime, asset: entry.asset, label: entry.label };
  }

  return null;
}
