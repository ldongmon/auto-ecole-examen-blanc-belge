import { resolveSign } from "@/lib/signs/resolveSign";

interface Props {
  code: string;
  lang?: "fr" | "nl";
}

/**
 * Affiche un panneau réglementaire résolu par code (jamais par chemin de
 * fichier en dur — voir lib/signs/resolveSign.ts). Ne rend rien si le
 * panneau n'est pas valide à la date courante (pas encore en vigueur, plus
 * en vigueur, ou pas encore `live` en production) : un composant qui
 * disparaît proprement plutôt que d'afficher un panneau non validé.
 */
export default function Sign({ code, lang = "fr" }: Props) {
  const sign = resolveSign(code);
  if (!sign) return null;

  return (
    <img
      src={`/${sign.asset}`}
      alt={sign.label[lang]}
      width={140}
      height={140}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
}
