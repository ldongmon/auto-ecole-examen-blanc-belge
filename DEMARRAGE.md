# DEMARRAGE.md — première session Claude Code

## 1. Installer le dossier

Dézippe l'archive où tu veux travailler, puis :

```bash
cd examen-blanc-belge
git init
git add .
git commit -m "Poser les fondations : corpus, contexte projet, roadmap"
```

## 2. Ouvrir Claude Code

Dans le dossier `examen-blanc-belge`. Claude Code lit automatiquement `CLAUDE.md` au démarrage : tu n'as pas à réexpliquer le projet.

## 3. Le prompt à coller en premier

> Lis `CLAUDE.md`, `docs/ROADMAP.md` et `reference/examen-blanc-belge.jsx`, puis initialise un projet Next.js avec App Router et i18n en sous-répertoires `/fr` et `/nl` (NL vide pour l'instant).
>
> Ne construis rien d'autre que la phase P0 de la roadmap. Le premier objectif est uniquement le moteur d'examen : lecture de `data/questions.json`, tirage respectant `region_scope`, barème conforme au §3 de CLAUDE.md, arrêt de l'examen à la deuxième faute grave, bouton « je ne réponds pas » compté à −1.
>
> Avant de coder, propose-moi l'arborescence des fichiers que tu vas créer et attends ma validation.

## 4. Ce qu'il faut lui refuser

Claude Code proposera spontanément des briques hors périmètre : authentification, base de données, back-office, tests end-to-end complets, refonte du design. Elles sont toutes défendables et toutes hors sujet en P0. Le §2 de `CLAUDE.md` liste le périmètre ; renvoie-le dessus.

## 5. Après chaque modification du corpus

```bash
python3 scripts/build_revue.py
```

Le protocole de relecture est **généré**, jamais édité à la main. Il doit être régénéré dans le même commit que la modification du corpus, sinon le document signé par le moniteur ne correspond plus au contenu servi.

## 6. À faire cette semaine, hors code

1. **Contacter un moniteur d'auto-école agréé francophone.** C'est le chemin critique de la phase P0 et le seul poste qui ne dépend pas de toi. Lui envoyer `docs/REVUE-MONITEUR.md` et demander un devis pour la validation de 100 questions.
2. **Lever les 4 points critiques** : `q24` (signaux de stationnement), `q36` (distance latérale cycliste), `q47` (trottinettes), `q57` (GSM dans un embouteillage).
3. **Réserver le nom de domaine.**
