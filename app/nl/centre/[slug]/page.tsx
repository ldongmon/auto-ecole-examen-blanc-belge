import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import centresData from "@/data/centres.json";
import type { CentreBank } from "@/lib/exam/types";
import { REGION_LABEL_NL, REGION_SPEED_HORS_AGGLO } from "@/lib/exam/regions";

const bank = centresData as unknown as CentreBank;

export function generateStaticParams() {
  return bank.centres.map((c) => ({ slug: c.slug }));
}

function findCentre(slug: string) {
  return bank.centres.find((c) => c.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const centre = findCentre(slug);
  if (!centre) return {};

  return {
    title: `Theorie-examen rijbewijs B in ${centre.ville}`,
    description: `Bereid je theorie-examen voor voordat je je aanbiedt in het centrum van ${centre.ville} (${REGION_LABEL_NL[centre.region]}). Gratis proefexamen, met de echte Belgische puntentelling.`,
  };
}

export default async function CentrePageNL({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const centre = findCentre(slug);
  if (!centre) notFound();

  const region = centre.region;

  return (
    <main className="wrap">
      <div className="card">
        <p className="kicker">Examencentrum — {REGION_LABEL_NL[region]}</p>
        <h1>Theorie-examen rijbewijs B in {centre.ville}</h1>
        <p className="lead">
          Ga je je aanbieden in het examencentrum van {centre.ville}, netwerk {centre.reseau}? Oefen eerst
          gratis met een proefexamen dat de echte Belgische puntentelling volgt: zware fout = −5 punten, twee
          zware fouten = automatische mislukking.
        </p>

        <div className="rules">
          <p>
            <strong>Regel sinds 1 januari 2026:</strong> je opleiding moet volledig in hetzelfde gewest
            verlopen. In {centre.ville} word je geëxamineerd volgens de regels van{" "}
            <strong>{REGION_LABEL_NL[region]}</strong> — de maximumsnelheid buiten de bebouwde kom zonder
            signalisatie is er bijvoorbeeld <strong>{REGION_SPEED_HORS_AGGLO[region]} km/u</strong>.
          </p>
        </div>

        <Link className="go" href={`/nl/examen?region=${region}`}>
          Proefexamen doen voor {REGION_LABEL_NL[region]}
        </Link>

        <p className="note">
          Om een plaats te reserveren of de tarieven en openingsuren van het centrum in {centre.ville} na te
          kijken, ga je naar de officiële site van {centre.reseau}:{" "}
          <a href={centre.operateur_url} target="_blank" rel="noopener noreferrer">
            {centre.operateur_url.replace(/^https?:\/\//, "")}
          </a>
          . Die informatie verandert regelmatig, daarom herhalen we ze hier niet.
        </p>

        <p className="note">
          <Link href="/nl/centre">← Alle examencentra bekijken</Link>
        </p>
      </div>
    </main>
  );
}
