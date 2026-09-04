import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ — Examen Blanc Belge",
  description: "Questions fréquentes sur l'examen théorique du permis B en Belgique et sur ce simulateur.",
};

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Ce site est-il gratuit ?",
    a: "Oui, l'entraînement et l'examen blanc sont gratuits et ne demandent pas de compte.",
  },
  {
    q: "Les questions sont-elles celles de l'examen officiel ?",
    a: (
      <>
        Non. Ce sont des questions rédigées de façon originale à partir du code de la route belge — jamais
        copiées d'une banque de questions officielle ou d'un concurrent. Le corpus n'est en plus pas encore
        validé par un moniteur agréé (voir la mention en bas de chaque page).
      </>
    ),
  },
  {
    q: "Qu'est-ce qu'une « faute grave » ?",
    a: "Une infraction du 3e ou 4e degré selon la liste officielle des 50 fautes graves, ou tout dépassement de la vitesse autorisée. Elle coûte 5 points au lieu d'1, et deux fautes graves entraînent un échec automatique — même si le score total serait suffisant.",
  },
  {
    q: "Quelle différence entre le mode entraînement et l'examen blanc ?",
    a: (
      <>
        En <strong>entraînement</strong>, tu as une correction juste après chaque question, et tu ne peux pas
        être éjecté avant la fin du tirage. En <strong>examen blanc</strong>, aucune correction avant la fin,
        et deux fautes graves arrêtent la session — comme dans les conditions réelles.
      </>
    ),
  },
  {
    q: "Puis-je passer mon examen dans une région et ma formation dans une autre ?",
    a: "Non. Depuis le 1er janvier 2026, la formation doit se dérouler entièrement dans la même région (Wallonie, Bruxelles ou Flandre).",
  },
  {
    q: "Le site propose-t-il des questions en anglais ?",
    a: "Non, uniquement en français et en néerlandais — les deux langues de l'examen officiel.",
  },
];

export default function FaqPage() {
  return (
    <main className="wrap">
      <div className="card faq-page">
        <p className="kicker">FAQ</p>
        <h1>Questions fréquentes</h1>

        <div className="faq-list">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <p className="note">
          <Link href="/fr/infos">← Voir aussi les infos pratiques</Link>
        </p>
      </div>
    </main>
  );
}
