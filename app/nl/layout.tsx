import type { Metadata } from "next";

// Remplace le titre/la description FR pour tout ce qui vit sous /nl.
// Limite connue : l'attribut lang="fr" sur <html> (défini dans le layout
// racine) ne peut pas être changé depuis un layout imbriqué en App Router —
// il faudrait restructurer en /[locale] pour un <html lang> vraiment correct
// par langue. Pas fait ici pour ne pas déplacer /fr/* et casser les liens
// déjà indexés/déployés.
export const metadata: Metadata = {
  title: "Proefexamen Rijbewijs B — België",
  description: "Simulator voor het theorie-examen rijbewijs B, met de echte Belgische puntentelling.",
};

export default function NlLayout({ children }: { children: React.ReactNode }) {
  return children;
}
