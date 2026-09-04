import { SignA23, SignB1, SignB9, SignC1, SignD1, SignF4a, SignsE1E3 } from "./signs";

// Associe un id de question à son visuel réel. Volontairement partiel :
// seules les questions "panneau" ont un visuel fidèle pour l'instant (formes
// normalisées, reproductibles avec certitude). Les questions "scène de
// conduite" (rond-point, dépassement...) restent sans visuel en attendant
// une vraie production (photo ou illustration originale plus élaborée) —
// voir data/questions.json > media.brief pour la liste complète à produire.
const VISUALS: Record<string, () => React.ReactNode> = {
  q15: () => <SignB1 />,
  q21: () => <SignB9 />,
  q22: () => <SignC1 />,
  q23: () => <SignF4a />,
  q24: () => <SignsE1E3 />,
  q25: () => <SignA23 />,
  q26: () => <SignD1 />,
};

export default function QuestionVisual({ questionId }: { questionId: string }) {
  const Visual = VISUALS[questionId];
  if (!Visual) return null;
  return (
    <div className="question-visual">
      <Visual />
    </div>
  );
}
