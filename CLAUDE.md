# CLAUDE.md — Examen Blanc Belge

Contexte permanent du projet. À lire avant toute action. Mis à jour le 2026-09-03.

---

## 1. Ce qu'est ce projet

Application web de préparation à l'**examen théorique du permis B en Belgique**.
Marché B2C, bilingue **français et néerlandais**, régionalisé **Wallonie / Bruxelles / Flandre**.

**Positionnement, en une phrase :** le seul simulateur qui applique le barème réel de l'examen,
y compris les fautes graves à −5 points et l'échec automatique à deux fautes graves.

C'est le différenciateur central. Tout arbitrage de conception se tranche en faveur de la fidélité
au barème officiel. Les concurrents comptent 1 point par erreur ; nous non.

## 2. Le v0 à construire — périmètre strict

Un **examen blanc gratuit, sans compte, sans paiement**.

Dans le périmètre :
- un simulateur d'examen fidèle (voir §3),
- FR + NL, sélection de région,
- écran de résultat détaillé (voir §4),
- capture d'email,
- pages SEO par centre d'examen (32 centres, FR et NL).

**Hors périmètre du v0, ne pas construire spontanément :**
authentification, comptes utilisateurs, paiement, chapitres de cours, moteur adaptatif,
test de perception des risques, application mobile native, back-office.

Si une tâche semble exiger une de ces briques, le signaler et proposer une alternative sans elle.
Ces briques arrivent aux mois 2 à 4, dans cet ordre : paiement (sans compte, accès par lien mailé),
version NL complète, puis comptes et progression.

## 3. Moteur de score — règles métier non négociables

```
50 questions
seuil de réussite      : 41/50
faute ordinaire        : −1 point
faute grave            : −5 points
abstention sur grave   : −1 point       (voir avertissement ci-dessous)
échec automatique      : 2 fautes graves, quel que soit le total
```

Une **faute grave** correspond à une infraction du 3e ou du 4e degré, ou à toute question
portant sur un dépassement de vitesse. La liste officielle compte **50 items** depuis mars 2022,
date à laquelle l'usage d'un appareil à écran non fixé est passé du 2e au 3e degré.

**Deux fautes graves arrêtent l'examen.** Le simulateur doit reproduire cet arrêt prématuré,
pas seulement afficher un échec à la fin.

**Avertissement sur l'abstention :** la règle « ne pas répondre à une question grave coûte 1 point
au lieu de 5 » provient d'une source secondaire et **n'est pas confirmée auprès du GOCA**.
Implémenter le mécanisme, mais ne pas en faire un argument public avant confirmation écrite.
C'est potentiellement notre meilleure fonctionnalité pédagogique — aucun concurrent ne l'enseigne.

Autres contraintes d'examen à respecter : environ 30 minutes pour l'ensemble, chronomètre par
question, énoncés lus à voix haute, pas de retour en arrière sur une question validée.

## 4. Écran de résultat — c'est lui qui convertit

Ne jamais afficher un score nu. La séquence obligatoire :

1. verdict (réussi / échec),
2. score réel sur 50,
3. si fautes graves : **« Sans tes fautes graves, tu étais à X/50 »** — c'est la phrase qui fait
   comprendre au candidat pourquoi il a échoué à 44/50 ressenti,
4. liste nominative des fautes graves commises,
5. chapitres faibles classés par nombre d'erreurs,
6. capture d'email : « reçois ton plan de révision ».

## 5. Régionalisation

Depuis le 1er janvier 2026, toute la formation doit se dérouler dans la même région.
Les règles divergent réellement, ce n'est pas une question de traduction :

| | Wallonie | Bruxelles | Flandre |
| --- | --- | --- | --- |
| Hors agglomération, sans signal | 90 km/h | 70 km/h | 70 km/h |

**Langue et région sont deux dimensions indépendantes.** Un néerlandophone peut passer son examen
en Wallonie. Ne jamais fusionner les deux dans un seul champ.

## 6. Modèle de données du corpus

Le fichier `data/questions.json` est la source de vérité. Structure par question :

- `id` — stable, jamais réutilisé
- `theme`, `sous_theme` — chapitre affiché
- `gravite` — `ordinaire` | `grave`
- `degre` — `3` | `4` | `null`
- `faute_grave_ref` — item de la liste officielle des 50 fautes graves
- `ref_legale` — **attribution de travail, numérotation NON vérifiée**
- `region_scope` — `ALL` | `WAL` | `BRU` | `VLA`
- `reponse` ou `reponse_par_region` — index de la bonne réponse
- `media` — `null` ou brief de production du visuel
- `tts` — texte destiné à la synthèse vocale, par langue
- `revue` — points que le moniteur doit vérifier

En base, séparer les métadonnées indépendantes de la langue (`question`) des libellés
(`question_translation`, une ligne par locale). Ne pas dupliquer une question par langue.

## 7. Règles absolues sur le contenu

**Interdictions strictes, sans exception :**

1. **Ne jamais copier une question, une explication ou un visuel** d'un site concurrent,
   d'un manuel, ou d'une banque de questions officielle. C'est le risque juridique qui tue le projet.
   Sources autorisées : le texte légal, et la rédaction originale.
2. **Ne jamais utiliser d'image trouvée en ligne.** Photos prises par nous ou illustrations produites.
3. **Ne jamais servir en production une question dont `status` n'est pas `live`.**
   Une question ne passe à `live` qu'après signature d'un moniteur agréé.
4. **Ne jamais générer de nouvelles questions sans les marquer comme non validées**
   et sans remplir le champ `revue`. Une question inventée et servie comme vérifiée est
   une faute professionnelle : le candidat la croit et échoue à l'examen.
5. **Ne pas corriger une question douteuse à l'estime.** La retirer du tirage et la signaler.

Quatre questions du corpus portent la mention `POINT CRITIQUE` et sont bloquées à la publication :
`q24` (signaux de stationnement), `q36` (distance latérale cycliste), `q47` (trottinettes),
`q57` (GSM dans un embouteillage).

## 8. Tirage de l'examen

Le corpus est volontairement surchargé en questions graves (environ 50 %) par rapport à l'examen réel.
**L'algorithme de tirage doit rééquilibrer la proportion**, sinon le simulateur est plus sévère que
le centre d'examen — ce qui décourage sans mieux préparer.

Le tirage doit aussi respecter `region_scope` : une question `WAL` ne sort jamais pour un candidat flamand.

## 9. Stack

- **Next.js** (App Router), routes `/fr/...` et `/nl/...` en sous-répertoires.
  Pas de sous-domaines : cela diluerait l'autorité SEO.
- **PostgreSQL via Supabase** pour les données. Pas d'ORM lourd au v0.
- **PWA** installable. Pas d'application native, pas d'exécutable desktop.
- **Mollie** pour le paiement au mois 2. **Bancontact est obligatoire** — sans lui, une part
  importante de la conversion belge est perdue.
- **Web Speech API** pour la lecture vocale, gratuite et disponible en FR et NL.
- Déploiement **Vercel**.
- Le moteur adaptatif (calibration IRT) viendra plus tard dans un **service Python/FastAPI séparé**,
  pas dans le code Next.js.

## 10. Contraintes de langue

Les énoncés officiels belges sont rédigés en français soutenu, avec des doubles négations, des
expressions comme « en deçà » et « au-delà », et des distinctions fines entre termes voisins
(bande cyclable / piste cyclable). C'est une cause d'échec documentée.

Le corpus reproduit ce registre **dans l'énoncé**, et adopte une langue simple **dans l'explication**.
Conserver cette asymétrie.

Le néerlandais n'est **pas une traduction du français**. Une formulation qui sent la traduction
automatique détruit la crédibilité auprès d'un néerlandophone en trois questions.

Synthèse vocale française : les nombres se disent **septante** et **nonante**. Jamais
« soixante-dix » ni « quatre-vingt-dix » — un candidat belge entend immédiatement une voix
française et cesse de faire confiance à l'outil.

## 11. Fichiers de référence

- `data/questions.json` — corpus, source de vérité, 60 questions
- `docs/REVUE-MONITEUR.md` — protocole de validation, **généré** par `scripts/build_revue.py`
- `scripts/build_revue.py` — régénérer le protocole après toute modification du corpus
- `reference/examen-blanc-belge.jsx` — prototype de référence du moteur de score.
  Spécification vivante, pas du code de production. La logique de barème y est juste.

## 12. Conventions

- Commits en français, à l'impératif.
- Régénérer `docs/REVUE-MONITEUR.md` dans le même commit que toute modification du corpus.
- Ne pas ajouter de dépendance sans la justifier.
- Toute règle du code de la route introduite dans le code ou le contenu doit être accompagnée
  soit d'une référence, soit d'une entrée dans `revue`.
