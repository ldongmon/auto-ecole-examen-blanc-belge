import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import centresData from "@/data/centres.json";
import type { CentreBank } from "@/lib/exam/types";
import { REGION_LABEL, REGION_SPEED_HORS_AGGLO } from "@/lib/exam/regions";

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

  const title = `Examen théorique permis B à ${centre.ville} — Entraîne-toi gratuitement`;
  const description =
    `Prépare ton examen théorique du permis B avant de te présenter au centre de ${centre.ville} ` +
    `(${REGION_LABEL[centre.region]}). Examen blanc gratuit, fidèle au vrai barème belge.`;

  return { title, description };
}

export default async function CentrePage({
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
        <p className="kicker">Centre d&apos;examen — {REGION_LABEL[region]}</p>
        <h1>Examen théorique permis B à {centre.ville}</h1>
        <p className="lead">
          Tu comptes te présenter au centre d&apos;examen de {centre.ville}, réseau {centre.reseau} ? Entraîne-toi
          d&apos;abord gratuitement avec un examen blanc qui applique le vrai barème belge : faute grave = −5
          points, deux fautes graves = échec automatique.
        </p>

        <div className="rules">
          <p>
            <strong>Règle depuis le 1{"ᵉʳ"} janvier 2026 :</strong> ta formation doit se dérouler
            entièrement dans la même région. À {centre.ville}, tu es examiné selon les règles de la région{" "}
            <strong>{REGION_LABEL[region]}</strong> — par exemple, la vitesse maximale hors agglomération sans
            signalisation y est de <strong>{REGION_SPEED_HORS_AGGLO[region]} km/h</strong>.
          </p>
        </div>

        <Link className="go" href={`/fr/examen?region=${region}`}>
          Faire un examen blanc pour la région {REGION_LABEL[region]}
        </Link>

        <p className="note">
          Pour réserver ta place, vérifier les tarifs ou les horaires du centre de {centre.ville}, passe par le
          site officiel du réseau {centre.reseau} :{" "}
          <a href={centre.operateur_url} target="_blank" rel="noopener noreferrer">
            {centre.operateur_url.replace(/^https?:\/\//, "")}
          </a>
          . Ces informations changent régulièrement, on ne les republie pas ici pour éviter qu&apos;elles se
          périment.
        </p>

        <p className="note">
          <Link href="/fr/centre">← Voir tous les centres d&apos;examen</Link>
        </p>
      </div>
    </main>
  );
}
