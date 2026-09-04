# Prompt Claude Code — Bibliothèque de panneaux datée

À coller tel quel dans une session Claude Code ouverte à la racine du projet.
Périmètre volontairement étroit : **la bibliothèque de panneaux, rien d'autre.**

---

## Le prompt

> Lis d'abord `CLAUDE.md` et `docs/ROADMAP.md`.
>
> Je veux construire une bibliothèque de panneaux de signalisation belges, **datée**. C'est le seul chantier de cette session.
>
> ### Contexte réglementaire — à respecter à la lettre
>
> Deux régimes de signalisation coexistent :
>
> - **`AR1975`** — les panneaux de l'arrêté royal du 1er décembre 1975. **C'est le régime en vigueur aujourd'hui et jusqu'au 31 mai 2027.** Ce sont ceux que nos candidats verront à leur examen. C'est le seul régime que le site doit servir pour l'instant.
> - **`CVP2027`** — les panneaux du Code de la voie publique, applicables **à partir du 1er juin 2027 seulement**. Ils diffèrent visiblement : symboles modernisés et simplifiés, bordure blanche contrastante autour des panneaux de danger et d'interdiction, plus de panneaux additionnels bleus. Vias institute publie ces images en PNG et SVG. On les stocke dès maintenant, on ne les sert pas avant la date.
>
> **Servir un panneau CVP2027 avant le 1er juin 2027 est une erreur pédagogique grave.** Le candidat apprendrait un panneau qu'il ne verra pas à son examen.
>
> Échéancier de fin de validité à encoder :
>
> | Codes | Fin de validité |
> | --- | --- |
> | E5, E7, E11 | 2027-06-01 |
> | F17, F18, marquages art. 72.5 et 72.6 | 2030-06-01 |
> | F111, F113 zonaux et « rue cyclable » | 2035-01-01 |
> | Autres panneaux AR 1975 | 2045-01-01 |
> | A45, A47, F13, F14, F15, F23 à F35, F43, F100 | inchangés, pas de fin |
>
> ### Ce que je veux que tu construises
>
> **1. Le modèle de données.** Un fichier `data/signs.json` :
>
> ```json
> {
>   "code": "B1",
>   "regime": "AR1975",
>   "valid_from": "1975-12-01",
>   "valid_until": "2045-01-01",
>   "category": "priorite",
>   "label": { "fr": "Céder le passage", "nl": "Voorrang verlenen" },
>   "asset": "assets/signs/ar1975/B1.svg",
>   "source": "redessiné depuis l'AR du 01/12/1975",
>   "licence": "acte officiel de l'autorité — non protégé",
>   "status": "draft"
> }
> ```
>
> Le champ `status` suit la même logique que les questions : `draft` → `validated` → `live`. Un panneau non validé ne doit pas être servi en production, exactement comme une question.
>
> **2. La liste des panneaux à produire — dérivée, pas devinée.** Écris `scripts/audit_signs.py` qui parcourt `data/questions.json`, extrait tous les panneaux réellement cités dans les champs `media.brief`, `stem` et `why`, et produit la liste des codes nécessaires avec le nombre de questions concernées. **Ne code aucun panneau avant d'avoir exécuté ce script et de m'avoir montré sa sortie.** Je veux voir ce que le corpus demande vraiment avant qu'on dessine quoi que ce soit.
>
> **3. Les SVG `AR1975`.** Redessine-les depuis la spécification réglementaire : forme, proportions, couleurs, symbole. Contraintes :
> - un seul fichier de vérité pour les couleurs, `assets/signs/palette.json`, référencé par tous les SVG — pas de valeur hexadécimale en dur dans un fichier de panneau ;
> - `viewBox` normalisé et cohérent entre panneaux de même forme, pour qu'ils soient interchangeables sans recalage ;
> - **aucun élément `<text>` dans les SVG livrés.** Les caractères des panneaux belges utilisent la police SNV, qui n'est pas présente sur le serveur : tout texte doit être converti en tracés au moment du build, sinon les chiffres s'afficheront dans une police de repli. Si tu ne peux pas convertir, dessine le glyphe en `<path>`.
> - pas d'ombre portée, pas de dégradé, pas d'effet — les panneaux réglementaires sont plats.
>
> **4. Le pack CVP2027.** Télécharge les archives officielles de Vias (images des signaux, signaux lumineux, marquages routiers), place-les dans `assets/signs/cvp2027/`, et enregistre leur provenance dans `data/signs.json`. Elles ne doivent **pas** être servies : le résolveur doit les écarter tant que la date courante est antérieure au 1er juin 2027.
>
> **5. Le résolveur et le composant de rendu.**
>
> ```ts
> resolveSign(code: string, atDate: Date): SignAsset | null
> ```
>
> Il choisit le régime selon la date, retourne `null` si le panneau n'est plus valide à cette date, et lève une erreur explicite si le code n'existe pas. Prévois une variable d'environnement `SIGN_DATE_OVERRIDE` pour pouvoir tester le rendu au 1er juin 2027 sans changer l'horloge système.
>
> Le composant `<Sign code="B1" />` consomme le résolveur. **Les questions référencent un code de panneau, jamais un chemin de fichier.**
>
> **6. La migration de `questions.json`.** Remplace les `media` qui décrivent un panneau par un champ `signs: ["B1"]`. Ne touche pas aux `media` qui décrivent une scène de circulation — ils restent tels quels, on traitera les scènes plus tard.
>
> **7. Les tests.**
> - tout code cité dans `questions.json` existe dans `signs.json` ;
> - aucun panneau au statut `draft` n'est servi quand `NODE_ENV=production` ;
> - `resolveSign` renvoie bien `AR1975` au 2026-09-04 et `CVP2027` au 2027-06-01 ;
> - aucun SVG livré ne contient de balise `<text>` ;
> - aucune couleur en dur hors de `palette.json`.
>
> ### Ce que tu ne dois pas faire dans cette session
>
> - **Ne construis pas le système de scènes de circulation** (carrefours, véhicules, piétons, trajectoires). C'est un chantier séparé, plus lourd, qui viendra après. Si tu identifies des besoins de scènes, note-les dans `docs/BACKLOG-VISUELS.md` et passe à la suite.
> - Ne touche pas au moteur d'examen, au barème, au tirage, au choix de région, au choix de langue, à la navigation ni aux pages existantes.
> - Ne génère aucun panneau par IA générative, ne récupère aucun fichier de panneau sur un site tiers autre que la source officielle Vias. En cas de doute sur les droits d'une ressource : ne pas l'utiliser.
> - N'ajoute pas de dépendance sans me demander.
>
> ### Avant de coder
>
> Exécute `scripts/audit_signs.py`, montre-moi sa sortie, et propose-moi l'arborescence des fichiers que tu vas créer ou modifier. Attends ma validation avant d'écrire le moindre SVG.

---

## Après cette session

Un point à traiter séparément et rapidement, indépendant de la bibliothèque : `MODE="demo"` dans `lib/exam/config.ts` sert publiquement un corpus non validé. À brancher sur une variable d'environnement avant de communiquer l'URL à qui que ce soit, moniteur inclus.

Le chantier suivant dans l'ordre de priorité n'est pas visuel : contact du moniteur agréé, corpus de 46 à 100 questions, soumission des 32 pages centre à la Search Console.
