import json
import sys
from pathlib import Path

try:
    # Windows: la console par défaut n'est pas en UTF-8, or le corpus contient
    # des accents et des caractères type ☐ — sans ça, `python scripts/build_revue.py`
    # plante avant même d'écrire le fichier.
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent

d = json.load(open(ROOT / 'data' / 'questions.json', encoding='utf-8'))
qs = d['questions']

CRIT = [q for q in qs if any('POINT CRITIQUE' in r for r in q.get('revue', []))]
AUTRES = [q for q in qs if q.get('revue') and q not in CRIT]
GRAVES = [q for q in qs if q['gravite'] == 'grave']
D4 = [q for q in GRAVES if q.get('degre') == 4]
IMG = [q for q in qs if q.get('media')]

L = []
w = L.append

w("# Protocole de relecture — corpus questions permis B\n")
w(f"Version du corpus : **{d['_meta']['version']}** — {d['_meta']['date']}  ")
w(f"Statut : **{d['_meta']['statut']}**\n")
w("Ce document est destiné au moniteur d'auto-école agréé chargé de la validation. ")
w("Il est généré automatiquement depuis `questions.json` : toute modification du corpus doit être suivie d'une régénération.\n")

w("## 1. Composition du corpus\n")
w(f"- Questions : **{len(qs)}** (q15 à q60), à ajouter aux 14 du prototype initial")
w(f"- Questions éliminatoires (fautes graves) : **{len(GRAVES)}** dont **{len(D4)}** du 4e degré")
w(f"- Questions nécessitant un visuel : **{len(IMG)}**")
w(f"- Questions portant au moins un point à vérifier : **{len(qs and [q for q in qs if q.get('revue')])}**\n")

w("Le taux de questions graves (50 %) est volontairement supérieur à celui de l'examen réel. ")
w("Le tirage de l'examen blanc doit rééquilibrer la proportion, sinon le score simulé sera plus sévère que le score officiel.\n")

w("## 2. Points critiques — blocage de publication\n")
w("Ces questions ne peuvent pas être mises en ligne avant validation explicite. En cas de doute, elles sont retirées du tirage, pas corrigées à l'estime.\n")
w("| ID | Thème | Ce qui doit être vérifié | Validé |")
w("| --- | --- | --- | --- |")
for q in CRIT:
    pts = ' '.join(r.replace('POINT CRITIQUE : ', '') for r in q['revue'])
    w(f"| `{q['id']}` | {q['theme']['fr']} | {pts} | ☐ |")
w("")

w("## 3. Vérification des questions éliminatoires\n")
w("Pour chaque question ci-dessous, confirmer que le comportement décrit correspond bien à un item de la liste officielle des 50 fautes graves, ")
w("et que le degré indiqué est correct. Une question cotée à tort comme grave fausse le score de l'utilisateur de 4 points.\n")
w("| ID | Degré | Item de la liste officielle rattaché | Correct |")
w("| --- | --- | --- | --- |")
for q in GRAVES:
    deg = q.get('degre') or 'vitesse'
    w(f"| `{q['id']}` | {deg} | {q.get('faute_grave_ref', '—')} | ☐ |")
w("")

w("## 4. Autres points à confirmer\n")
for q in AUTRES:
    w(f"**`{q['id']}` — {q['theme']['fr']}**")
    for r in q['revue']:
        w(f"- ☐ {r}")
    w("")

w("## 5. Références légales\n")
w("Le champ `ref_legale` contient une attribution de travail. **La numérotation des articles n'a pas été vérifiée article par article.** ")
w("Deux options : soit le moniteur corrige chaque référence, soit le champ est vidé et n'est pas affiché à l'utilisateur. ")
w("Afficher une référence erronée est plus dommageable que ne rien afficher.\n")

w("## 6. Production des visuels\n")
w("Aucun visuel ne peut être repris d'un tiers, y compris d'un site concurrent ou d'une banque d'images non licenciée. ")
w("Le champ `media.brief` décrit la prise de vue ou l'illustration à produire.\n")
w("| ID | Brief de production |")
w("| --- | --- |")
for q in IMG:
    w(f"| `{q['id']}` | {q['media']['brief']} |")
w("")

w("## 7. Synthèse vocale\n")
w("Le champ `tts` contient la version parlée de chaque énoncé, distincte du texte affiché : abréviations développées ")
w("(« B1 » → « B un », « km/h » → « kilomètres à l'heure », « GSM » → « G S M ») et nombres écrits en mots. ")
w("Deux vérifications à faire à l'écoute :\n")
w("- ☐ Les nombres en français sont dits à la belge : **septante**, **nonante**, jamais « soixante-dix » ni « quatre-vingt-dix ».")
w("- ☐ Aucun énoncé ne dépasse 12 secondes de lecture, faute de quoi le chronomètre de 15 secondes devient injouable.\n")

w("## 8. Registre de langue\n")
w("Une cause d'échec documentée est la formulation des questions officielles : français soutenu, doubles négations, ")
w("expressions comme « en deçà » ou « au-delà », distinctions fines entre termes proches (bande cyclable / piste cyclable). ")
w("Le corpus adopte volontairement ce registre dans l'énoncé, et une langue simple dans l'explication.\n")
w("- ☐ Confirmer que les énoncés restent proches du registre officiel sans devenir ambigus.")
w("- ☐ Confirmer que chaque explication est compréhensible par un candidat non francophone de niveau B1.\n")

w("## 9. Signature\n")
w("| | Nom | N° d'agrément | Date | Signature |")
w("| --- | --- | --- | --- | --- |")
w("| Moniteur FR | | | | |")
w("| Moniteur NL | | | | |")
w("")
w("Après signature, passer le champ `_meta.statut` à `VALIDÉ` et le `status` de chaque question à `live`. ")
w("Seules les questions signées sont servies en production.")

open(ROOT / 'docs' / 'REVUE-MONITEUR.md', 'w', encoding='utf-8').write('\n'.join(L))
print('\n'.join(L)[:1200])
