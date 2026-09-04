#!/usr/bin/env node
/**
 * test_signs.mjs — vérifications de la bibliothèque de panneaux.
 *
 * Script Node natif, aucune dépendance ajoutée (assert + code de sortie),
 * conformément à ce qui a été validé pour cette session.
 *
 * Limite assumée sur les checks 2 et 3 : `lib/signs/resolveSign.ts` importe
 * `@/data/signs.json` via l'alias de chemin Next.js et utilise des types
 * TypeScript — Node ne peut pas l'exécuter tel quel sans bundler ni
 * dépendance supplémentaire (testé : `--experimental-strip-types` gère bien
 * la syntaxe TS, mais échoue sur l'alias "@/", propre au resolver de
 * webpack/Next). Ce script réimplémente donc la même logique de résolution
 * en JS simple, contre les vraies données réelles pour le check 2, et contre
 * un jeu de données synthétique pour le check 3 (aucun panneau réel n'a
 * encore de version CVP2027 — voir docs/BACKLOG-VISUELS.md). Si la logique
 * de lib/signs/resolveSign.ts change, mettre à jour ce fichier en même temps.
 *
 * Usage : node scripts/test_signs.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`  ok — ${name}`);
  } catch (err) {
    failures += 1;
    console.error(`  ÉCHEC — ${name}\n    ${err.message}`);
  }
}

function assert(cond, message) {
  if (!cond) throw new Error(message);
}

// --- Chargement des données réelles ---------------------------------------

const questions = JSON.parse(readFileSync(join(ROOT, "data", "questions.json"), "utf8")).questions;
const signsData = JSON.parse(readFileSync(join(ROOT, "data", "signs.json"), "utf8")).signs;
const palette = JSON.parse(readFileSync(join(ROOT, "assets", "signs", "palette.json"), "utf8"));

// Réimplémentation minimale de resolveSign() — voir avertissement en tête de fichier.
function resolveSign(code, atDate, dataset, nodeEnv) {
  const entries = dataset.filter((s) => s.code === code);
  if (entries.length === 0) throw new Error(`code inconnu : ${code}`);
  for (const entry of entries) {
    const from = new Date(entry.valid_from);
    const until = entry.valid_until ? new Date(entry.valid_until) : null;
    const inWindow = atDate >= from && (!until || atDate < until);
    if (!inWindow) continue;
    if (entry.status !== "live" && nodeEnv === "production") return null;
    return { code: entry.code, regime: entry.regime };
  }
  return null;
}

// --- Check 1 : tout code cité dans questions.json existe dans signs.json ---

check("tout code cité dans questions.json existe dans signs.json", () => {
  const known = new Set(signsData.map((s) => s.code));
  const missing = [];
  for (const q of questions) {
    for (const code of q.signs ?? []) {
      if (!known.has(code)) missing.push(`${q.id} -> ${code}`);
    }
  }
  assert(missing.length === 0, `codes cités mais absents de signs.json : ${missing.join(", ")}`);
});

// --- Check 2 : aucun panneau draft servi quand NODE_ENV=production ---------

check("aucun panneau au statut draft n'est servi quand NODE_ENV=production", () => {
  const now = new Date();
  const draftEntries = signsData.filter((s) => s.status !== "live");
  for (const entry of draftEntries) {
    const result = resolveSign(entry.code, now, signsData, "production");
    assert(
      result === null,
      `${entry.code} (status=${entry.status}) a été résolu alors que NODE_ENV=production`
    );
  }
});

// --- Check 3 : résolution AR1975 / CVP2027 selon la date -------------------

check("resolveSign renvoie AR1975 au 2026-09-04 et CVP2027 au 2027-06-01", () => {
  // Jeu de données synthétique : aucun panneau réel n'a encore de version
  // CVP2027 dans le vrai signs.json (pack Vias pas encore intégré).
  const fixture = [
    {
      code: "TEST",
      regime: "AR1975",
      valid_from: "1975-12-01",
      valid_until: "2027-06-01",
      status: "live",
    },
    {
      code: "TEST",
      regime: "CVP2027",
      valid_from: "2027-06-01",
      valid_until: null,
      status: "live",
    },
  ];
  const before = resolveSign("TEST", new Date("2026-09-04"), fixture, "development");
  const after = resolveSign("TEST", new Date("2027-06-01"), fixture, "development");
  assert(before?.regime === "AR1975", `attendu AR1975 au 2026-09-04, obtenu ${before?.regime}`);
  assert(after?.regime === "CVP2027", `attendu CVP2027 au 2027-06-01, obtenu ${after?.regime}`);
});

// --- Check 4 : aucun SVG livré ne contient de balise <text> ----------------

function listSvgFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listSvgFiles(full);
    return entry.name.endsWith(".svg") ? [full] : [];
  });
}

const ar1975Dir = join(ROOT, "public", "assets", "signs", "ar1975");
const svgFiles = listSvgFiles(ar1975Dir);

function stripXmlComments(content) {
  return content.replace(/<!--[\s\S]*?-->/g, "");
}

check("aucun SVG livré ne contient de balise <text>", () => {
  const offenders = svgFiles.filter((f) => /<text[\s>]/i.test(stripXmlComments(readFileSync(f, "utf8"))));
  assert(offenders.length === 0, `balise <text> trouvée dans : ${offenders.join(", ")}`);
});

// --- Check 5 : aucune couleur en dur hors de palette.json ------------------

check("aucune couleur en dur hors de palette.json", () => {
  const allowed = new Set(
    Object.entries(palette)
      .filter(([k]) => k !== "_meta")
      .map(([, v]) => String(v).toLowerCase())
  );
  const hexPattern = /#[0-9a-fA-F]{3,8}\b/g;
  const offenders = [];
  for (const file of svgFiles) {
    const content = stripXmlComments(readFileSync(file, "utf8"));
    for (const match of content.matchAll(hexPattern)) {
      if (!allowed.has(match[0].toLowerCase())) {
        offenders.push(`${file} : ${match[0]}`);
      }
    }
  }
  assert(offenders.length === 0, `couleur(s) absente(s) de palette.json : ${offenders.join(", ")}`);
});

// --- Bilan -------------------------------------------------------------

console.log(failures === 0 ? "\nTous les checks passent." : `\n${failures} check(s) en échec.`);
process.exit(failures === 0 ? 0 : 1);
