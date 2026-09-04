import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bien se préparer à l'examen théorique du permis B",
  description:
    "Déroulement, tentatives, cours obligatoires après échec, documents à apporter : ce qu'il faut savoir avant de te présenter à l'examen théorique en Belgique.",
};

export default function InfosPage() {
  return (
    <main className="wrap">
      <div className="card infos-page">
        <p className="kicker">Infos pratiques</p>
        <h1>Bien se préparer à l&apos;examen théorique</h1>
        <p className="lead">
          Un candidat mal informé se prépare mal, et a donc moins de chances de réussir. Voici ce qu&apos;il
          faut savoir avant de se présenter — au-delà du contenu des questions elles-mêmes.
        </p>

        <div className="infos-section">
          <h2>Validité et documents</h2>
          <ul>
            <li>L&apos;examen théorique est accessible dès <strong>17 ans</strong>.</li>
            <li>
              Une attestation théorique réussie est valable <strong>3 ans, non prolongeable</strong> — passé
              ce délai, il faut repasser l&apos;examen complet.
            </li>
            <li>
              Il faut se présenter avec sa <strong>carte d&apos;identité belge (eID)</strong> ou un titre de
              séjour en cours de validité : sans pièce d&apos;identité valable, l&apos;accès à l&apos;examen
              est refusé.
            </li>
          </ul>
        </div>

        <div className="infos-section">
          <h2>En cas d&apos;échec</h2>
          <ul>
            <li>
              Après <strong>2 échecs consécutifs</strong>, il devient obligatoire de suivre{" "}
              <strong>12 heures de cours théoriques</strong> dans une auto-école agréée avant de pouvoir se
              représenter. Cette obligation se répète à chaque nouveau multiple de 2 échecs (après 2, 4, 6
              tentatives...).
            </li>
            <li>Ces 12 heures sont estimées entre 180 € et 360 € selon l&apos;auto-école.</li>
          </ul>
        </div>

        <div className="infos-section">
          <h2>Ça change selon la région</h2>
          <ul>
            <li>
              Depuis le 1{"ᵉʳ"} janvier 2026, ta formation (théorique et pratique) doit se dérouler{" "}
              <strong>entièrement dans la même région</strong> — les résultats ne sont pas transférables
              d&apos;une région à l&apos;autre.
            </li>
            <li>Tarif indicatif par tentative : environ 17 € en Wallonie, 19 € à Bruxelles.</li>
            <li>
              À Bruxelles, une <strong>formation aux premiers secours</strong> (gratuite, validité 2 ans) est
              également obligatoire.
            </li>
          </ul>
        </div>

        <div className="infos-caveat">
          <p>
            <strong>Sur la fiabilité de ces informations :</strong> ces règles proviennent de sources
            publiques concordantes, pas d&apos;un texte officiel consulté directement — exactement comme les
            références légales du corpus de questions, elles seront confirmées lors de la relecture par un
            moniteur agréé. En cas de doute, vérifie directement auprès de{" "}
            <a href="https://www.goca.be" target="_blank" rel="noopener noreferrer">
              goca.be
            </a>{" "}
            ou du réseau qui gère ton centre d&apos;examen.
          </p>
        </div>

        <p className="note">
          <Link href="/fr/centre">← Trouver mon centre d&apos;examen</Link>
        </p>
      </div>
    </main>
  );
}
