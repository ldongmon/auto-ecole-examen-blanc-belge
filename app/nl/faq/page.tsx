import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Veelgestelde vragen — Proefexamen",
  description: "Veelgestelde vragen over het theorie-examen rijbewijs B in België en over dit platform.",
};

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is dit platform gratis?",
    a: "Ja, oefenen en het proefexamen zijn gratis en vereisen geen account.",
  },
  {
    q: "Zijn dit de echte examenvragen?",
    a: (
      <>
        Nee. Dit zijn origineel geschreven vragen op basis van de Belgische verkeerswetgeving — nooit
        gekopieerd van een officiële vragenbank of concurrent. De vragenbank is bovendien nog niet
        gevalideerd door een erkende rijinstructeur (zie de vermelding onderaan elke pagina).
      </>
    ),
  },
  {
    q: "Wat is een “zware fout”?",
    a: "Een overtreding van de 3e of 4e graad volgens de officiële lijst van 50 zware fouten, of elke snelheidsovertreding. Ze kost 5 punten in plaats van 1, en twee zware fouten leiden tot automatische mislukking — zelfs als de totaalscore voldoende zou zijn.",
  },
  {
    q: "Wat is het verschil tussen oefenmodus en proefexamen?",
    a: (
      <>
        In <strong>oefenmodus</strong> krijg je meteen na elke vraag feedback, en kan je niet voortijdig
        gestopt worden. Bij een <strong>proefexamen</strong> is er geen feedback tijdens het examen, en
        stoppen twee zware fouten de sessie — zoals in de echte omstandigheden.
      </>
    ),
  },
  {
    q: "Kan ik mijn examen in het ene gewest afleggen en mijn opleiding in een ander?",
    a: "Nee. Sinds 1 januari 2026 moet de opleiding volledig in hetzelfde gewest verlopen (Wallonië, Brussel of Vlaanderen).",
  },
  {
    q: "Zijn er vragen in het Engels?",
    a: "Nee, enkel in het Nederlands en het Frans — de twee talen van het officiële examen.",
  },
];

export default function FaqPageNL() {
  return (
    <main className="wrap">
      <div className="card faq-page">
        <p className="kicker">FAQ</p>
        <h1>Veelgestelde vragen</h1>

        <div className="faq-list">
          {FAQ.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <p className="note">
          <Link href="/nl/infos">← Bekijk ook de praktische info</Link>
        </p>
      </div>
    </main>
  );
}
