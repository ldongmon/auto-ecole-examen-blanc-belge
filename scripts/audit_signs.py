#!/usr/bin/env python3
"""audit_signs.py

Parcourt data/questions.json et extrait les codes de panneaux réellement
cités dans le corpus, pour dériver la liste des panneaux à produire — au
lieu de la deviner.

Champs scannés : media.brief, ref_legale, fr.stem, fr.why, nl.stem, nl.why.

Note sur le périmètre : la consigne d'origine ne citait que media.brief,
stem et why. En pratique, dans ce corpus, `E1` et `E3` (q24) n'apparaissent
QUE dans `ref_legale` ("AR 01/12/1975, signaux E1 et E3"), jamais dans le
brief ni l'énoncé — les scanner uniquement dans les trois champs prévus
aurait produit une liste incomplète. `ref_legale` a donc été ajouté au
périmètre du scan ; signalé explicitement plutôt que fait en silence.

Usage :
    python scripts/audit_signs.py
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUESTIONS_PATH = ROOT / "data" / "questions.json"

# Code de panneau belge : une lettre de série (A-M couvre A à M ; les séries
# utilisées dans ce corpus sont A/B/C/D/E/F) suivie de 1 à 3 chiffres, avec
# un suffixe optionnel d'une ou deux lettres (F4a, D1a) et/ou "bis"/"ter".
CODE_PATTERN = re.compile(r"\b([A-M]\d{1,3}[a-z]{0,2}(?:bis|ter)?)\b")

SCANNED_FIELDS = ["media.brief", "ref_legale", "fr.stem", "fr.why", "nl.stem", "nl.why"]


def extract_fields(question: dict) -> list[tuple[str, str]]:
    texts: list[tuple[str, str]] = []
    media = question.get("media")
    if media and media.get("brief"):
        texts.append(("media.brief", media["brief"]))
    if question.get("ref_legale"):
        texts.append(("ref_legale", question["ref_legale"]))
    for lang in ("fr", "nl"):
        content = question.get(lang) or {}
        if content.get("stem"):
            texts.append((f"{lang}.stem", content["stem"]))
        if content.get("why"):
            texts.append((f"{lang}.why", content["why"]))
    return texts


def main() -> None:
    data = json.loads(QUESTIONS_PATH.read_text(encoding="utf-8"))
    questions = data["questions"]

    # code -> { question_id -> set(champs où il apparaît) }
    hits: dict[str, dict[str, set[str]]] = defaultdict(lambda: defaultdict(set))

    for q in questions:
        qid = q["id"]
        for field_name, text in extract_fields(q):
            for m in CODE_PATTERN.finditer(text):
                hits[m.group(1)][qid].add(field_name)

    print(f"Corpus : {len(questions)} questions dans {QUESTIONS_PATH.relative_to(ROOT)}")
    print(f"Champs scannés : {', '.join(SCANNED_FIELDS)}\n")

    if not hits:
        print("Aucun code de panneau détecté.")
        return

    print(f"{len(hits)} code(s) de panneau cité(s) dans le corpus :\n")
    print(f"{'Code':<8} {'Questions':<10} Détail")
    print("-" * 70)
    for code in sorted(hits):
        qids = sorted(hits[code])
        detail = "; ".join(f"{qid} ({'/'.join(sorted(hits[code][qid]))})" for qid in qids)
        print(f"{code:<8} {len(qids):<10} {detail}")

    total_questions_with_signs = len({qid for per_q in hits.values() for qid in per_q})
    print(f"\n{len(hits)} panneaux distincts, cités dans {total_questions_with_signs} question(s) sur {len(questions)}.")


if __name__ == "__main__":
    main()
