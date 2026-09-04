"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Region } from "@/lib/exam/types";

const REGIONS: { value: Region; label: string }[] = [
  { value: "WAL", label: "Wallonië" },
  { value: "BRU", label: "Brussel" },
  { value: "VLA", label: "Vlaanderen" },
];

const FEATURES = [
  {
    title: "De echte puntentelling, geen benadering",
    text: "Zware fout = −5 punten, twee zware fouten = automatische mislukking. Dat is de echte regel van het examen, niet 1 punt per fout zoals elders.",
  },
  {
    title: "Je begrijpt, niet enkel je antwoordt",
    text: "Na elke vraag in oefenmodus: het juiste antwoord, en vooral waarom — zodat je dezelfde fout niet meer maakt.",
  },
  {
    title: "Aangepast aan jouw gewest",
    text: "Wallonië, Brussel, Vlaanderen: de regels verschillen écht, niet enkel de taal. De vragen houden rekening met jouw examengewest.",
  },
  {
    title: "Gratis, zonder account",
    text: "Je oefent meteen, zonder account aan te maken of je bankkaart nodig te hebben.",
  },
];

const STEPS = [
  { n: 1, text: "Kies je examengewest" },
  { n: 2, text: "Oefen, vraag per vraag, met onmiddellijke feedback" },
  { n: 3, text: "Ontdek je zwakke hoofdstukken" },
  { n: 4, text: "Sluit af met een volledig proefexamen, in echte omstandigheden" },
];

export default function HomeNL() {
  const router = useRouter();
  const [region, setRegion] = useState<Region>("VLA");

  return (
    <main>
      <section className="hero wrap">
        <div className="card hero-card">
          <p className="kicker">Proefexamen — Rijbewijs B</p>
          <h1>De enige simulator die de echte puntentelling volgt</h1>
          <p className="lead">
            Een kandidaat die slecht geïnformeerd is, bereidt zich slecht voor en heeft dus minder kans om te
            slagen. Dit platform helpt je om de Belgische verkeersregels écht te begrijpen — niet om
            antwoorden te raden.
          </p>

          <div className="field">
            <label htmlFor="region">Examengewest</label>
            <select id="region" value={region} onChange={(e) => setRegion(e.target.value as Region)}>
              {REGIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <p className="hint">De regels verschillen écht per gewest, niet enkel de taal.</p>
          </div>

          <div className="cta-row">
            <button className="go" onClick={() => router.push(`/nl/examen?region=${region}&mode=entrainement`)}>
              Begin met oefenen
            </button>
            <button
              className="go secondary"
              onClick={() => router.push(`/nl/examen?region=${region}&mode=examen`)}
            >
              Volledig proefexamen afleggen
            </button>
          </div>

          <p className="note">Gratis, zonder account. Ontwikkelversie — de vragenbank is nog niet gevalideerd.</p>
        </div>
      </section>

      <section className="wrap section-block">
        <div className="section-inner">
          <h2>Waarom hier oefenen?</h2>
          <div className="feature-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section-block alt">
        <div className="section-inner">
          <h2>Hoe werkt het?</h2>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span className="step-n">{s.n}</span>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
