import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Goed voorbereid naar het theorie-examen",
  description:
    "Verloop, pogingen, verplichte lessen na mislukking, benodigde documenten: wat je moet weten voordat je je aanbiedt voor het theorie-examen in België.",
};

export default function InfosPageNL() {
  return (
    <main className="wrap">
      <div className="card infos-page">
        <p className="kicker">Praktische info</p>
        <h1>Goed voorbereid naar het theorie-examen</h1>
        <p className="lead">
          Een kandidaat die slecht geïnformeerd is, bereidt zich slecht voor en heeft dus minder kans om te
          slagen. Dit is wat je moet weten vóór je je aanbiedt — los van de inhoud van de vragen zelf.
        </p>

        <div className="infos-section">
          <h2>Geldigheid en documenten</h2>
          <ul>
            <li>Het theorie-examen is toegankelijk vanaf <strong>17 jaar</strong>.</li>
            <li>
              Een geslaagd theorie-examen is <strong>3 jaar geldig, niet verlengbaar</strong> — na die termijn
              moet je het volledige examen opnieuw afleggen.
            </li>
            <li>
              Je moet je aanmelden met je <strong>Belgische identiteitskaart (eID)</strong> of een geldige
              verblijfsvergunning: zonder geldig identiteitsbewijs word je niet tot het examen toegelaten.
            </li>
          </ul>
        </div>

        <div className="infos-section">
          <h2>Bij mislukking</h2>
          <ul>
            <li>
              Na <strong>2 opeenvolgende mislukkingen</strong> ben je verplicht om <strong>12 uur
              theorielessen</strong> te volgen bij een erkende rijschool voordat je opnieuw mag aantreden. Die
              verplichting herhaalt zich bij elk volgend veelvoud van 2 mislukkingen (na 2, 4, 6 pogingen...).
            </li>
            <li>Die 12 uur worden geschat op 180 tot 360 € afhankelijk van de rijschool.</li>
          </ul>
        </div>

        <div className="infos-section">
          <h2>Het verschilt per gewest</h2>
          <ul>
            <li>
              Sinds 1 januari 2026 moet je opleiding (theorie én praktijk) <strong>volledig in hetzelfde
              gewest</strong> verlopen — resultaten zijn niet overdraagbaar tussen gewesten.
            </li>
            <li>Richtprijs per poging: ongeveer 17 € in Wallonië, 19 € in Brussel.</li>
            <li>
              In Brussel is een <strong>opleiding eerste hulp</strong> (gratis, 2 jaar geldig) eveneens
              verplicht.
            </li>
          </ul>
        </div>

        <div className="infos-caveat">
          <p>
            <strong>Over de betrouwbaarheid van deze informatie:</strong> deze regels komen uit
            overeenstemmende openbare bronnen, niet uit een rechtstreeks geraadpleegde officiële tekst — net
            zoals de wettelijke referenties in de vragenbank, worden ze bevestigd bij de controle door een
            erkende rijinstructeur. Twijfel je, controleer dan rechtstreeks bij{" "}
            <a href="https://www.goca.be" target="_blank" rel="noopener noreferrer">
              goca.be
            </a>{" "}
            of het netwerk dat jouw examencentrum beheert.
          </p>
        </div>

        <p className="note">
          <Link href="/nl/centre">← Mijn examencentrum vinden</Link>
        </p>
      </div>
    </main>
  );
}
