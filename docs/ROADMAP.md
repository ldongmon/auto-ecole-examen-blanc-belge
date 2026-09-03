# ROADMAP — Examen Blanc Belge

Version 1.0 — 3 septembre 2026. À relire à chaque jalon.

Cette roadmap est calée sur une contrainte externe non négociable : **la saisonnalité de la demande**. Les pics de recherche sont janvier-février et juillet-septembre. Une page indexée met environ 3 mois à produire du trafic organique significatif. Le v0 doit donc être en ligne **fin octobre 2026 au plus tard** pour capter le pic de janvier 2027. Tout retard au-delà décale la monétisation de six mois.

Hypothèse de charge : **10 à 12 heures par semaine**, en parallèle d'une activité principale.

---

## Vue d'ensemble

| Phase | Période | Objectif unique | Livrable qui prouve la phase |
| --- | --- | --- | --- |
| P0 — Fondations | 3 sept → 26 oct 2026 | Mettre en ligne un examen blanc gratuit crédible | URL publique, 100 questions validées |
| P1 — Monétisation | 27 oct → 20 déc 2026 | Encaisser le premier euro avant le pic | Un paiement Bancontact abouti |
| P2 — Pic 1 | 21 déc 2026 → 28 fév 2027 | Convertir le trafic saisonnier | Chiffres de conversion réels |
| P3 — Néerlandais | 1 mars → 30 avr 2027 | Doubler le marché adressable | Version NL en ligne |
| P4 — Rétention | 1 mai → 30 juin 2027 | Transformer l'achat unique en usage suivi | Comptes et progression |
| P5 — Pic 2 | 1 juil → 30 sept 2027 | Rentabiliser la seconde saison | Marge nette positive |
| P6 — Défensif | 1 oct 2027 → 1 juin 2028 | Absorber le nouveau Code de la voie publique | Corpus refondu à temps |

---

## P0 — Fondations (8 semaines)

**Objectif :** un examen blanc gratuit, en français, sans compte et sans paiement, en ligne et indexé.

### Contenu — le vrai chemin critique

Le corpus compte 60 questions. C'est **insuffisant** : un examen de 50 questions tiré dans un pool de 60 est presque identique d'une session à l'autre, et le candidat le voit immédiatement. Cible v0 : **100 questions**, soit 40 à rédiger.

| Tâche | Charge | Semaines |
| --- | --- | --- |
| Rédiger 40 questions FR (thèmes sous-couverts : zones particulières, documents, usagers vulnérables) | 12 h | S1-S3 |
| Faire valider les 100 questions par un moniteur agréé | 3 h de coordination | S3-S5 |
| Lever les 4 `POINT CRITIQUE` (q24, q36, q47, q57) | 2 h | S3 |
| Produire les 25 à 30 visuels | 10 h | S2-S5 |

**La validation par le moniteur est le seul poste qui ne dépend pas de toi.** Le contacter en semaine 1, pas en semaine 4. Budget : 1 500 à 3 000 €.

### Développement

| Tâche | Charge |
| --- | --- |
| Projet Next.js, i18n `/fr` et `/nl` en place (NL vide) | 4 h |
| Port du moteur de score depuis `reference/examen-blanc-belge.jsx` | 6 h |
| Arrêt prématuré de l'examen à la 2e faute grave | 2 h |
| Bouton « je ne réponds pas » et comptabilisation à −1 | 2 h |
| Lecture vocale (Web Speech API), FR avec septante/nonante | 4 h |
| Écran de résultat complet (séquence en 6 points du CLAUDE.md) | 6 h |
| Capture d'email (Resend ou Brevo) | 3 h |
| 32 pages « centre d'examen » générées depuis un fichier de données | 8 h |
| Déploiement Vercel, domaine, analytics | 3 h |

### Porte de sortie P0 — 26 octobre 2026

- ☐ 100 questions au statut `live`, signées par un moniteur
- ☐ Examen blanc jouable de bout en bout, barème conforme
- ☐ 32 pages centre en ligne et soumises à l'indexation
- ☐ Zéro question au statut `draft` servie en production

**Si le contenu n'est pas validé au 26 octobre : mettre en ligne quand même avec les questions validées disponibles, même s'il n'y en a que 70.** L'indexation ne se rattrape pas ; le corpus, si.

---

## P1 — Monétisation (8 semaines)

**Objectif :** encaisser avant le pic, pas pendant. Un tunnel de paiement qui casse le 5 janvier coûte la saison entière.

- Pack payant **19,90 €**, 30 jours, sans création de compte : accès par lien signé envoyé par mail. C'est ce choix qui permet d'éviter l'authentification jusqu'en P4.
- Mollie avec **Bancontact activé** — vérifié en conditions réelles, pas seulement en sandbox.
- Porter le corpus de 100 à **150 questions**, dont 50 réservées au pack payant.
- Mentions légales, CGV, politique de confidentialité conformes au RGPD. Non négociable pour encaisser.
- Démarrage du contenu vidéo court : format « une question, 15 secondes », **2 publications par semaine à partir de novembre**. C'est un canal qui met 8 à 12 semaines à démarrer : il doit tourner avant le pic.

### Porte de sortie P1 — 20 décembre 2026

- ☐ Un paiement Bancontact réel abouti, de bout en bout, avec accès délivré
- ☐ 150 questions validées
- ☐ 16 vidéos publiées
- ☐ Au moins 200 emails collectés

**Si moins de 50 emails collectés au 20 décembre**, le problème est l'acquisition, pas le produit. Ne pas construire davantage : corriger le SEO et le contenu.

---

## P2 — Pic 1 (10 semaines) — la phase de vérité

**Objectif :** ne rien construire, mesurer.

C'est la seule phase où le développement s'arrête volontairement. Le temps passe en publication de contenu, en corrections de bugs remontés par de vrais utilisateurs, et en lecture des chiffres.

Les quatre indicateurs à instrumenter avant le 21 décembre :

| Indicateur | Seuil de viabilité |
| --- | --- |
| Visiteurs uniques mensuels | 3 000 en février |
| Taux d'achèvement de l'examen blanc | 60 % |
| Conversion visiteur → email | 8 % |
| Conversion visiteur → payant | 2 % |
| Revenu récurrent mensuel | 300 € en février |

### Porte de décision — 28 février 2027

**C'est le point de non-retour du projet.** Trois issues, à trancher sur les chiffres et non sur l'attachement au projet :

- **Tous les seuils atteints** → P3, on double le marché avec le néerlandais.
- **Trafic correct mais conversion sous 1 %** → le produit ou le prix ne convainc pas. Rester en P2 un trimestre, retravailler l'écran de résultat et la page de vente. Ne pas lancer le NL : on dupliquerait un tunnel qui ne convertit pas.
- **Moins de 1 000 visiteurs mensuels ou moins de 150 € de MRR** → **bascule B2B**. Le corpus de 150 questions bilingues validées, taggées par région et par gravité, se licencie en marque blanche à des auto-écoles (49-99 €/mois) et se vend aux CPAS, Forem et VDAB, qui financent le permis comme levier d'insertion. C'est ce qui rend le pari raisonnable : l'actif construit garde de la valeur même si le B2C échoue.

---

## P3 — Néerlandais (8 semaines)

**Objectif :** ouvrir la Flandre, en connaissance de cause.

Avertissement stratégique : le marché NL est plus gros en volume mais la disposition à payer y est structurellement plus faible, à cause d'offres gratuites bien installées et adossées aux pouvoirs publics. **Prix NL : 14,90 €**, pas 19,90 €.

- Rédaction — pas traduction — des 150 questions en NL. Une formulation qui sent la traduction automatique détruit la crédibilité en trois questions.
- Validation par un moniteur néerlandophone agréé.
- 16 pages centre en NL.
- Vérification que les questions `region_scope: WAL` ne sortent jamais pour un candidat flamand.

### Porte de sortie P3 — 30 avril 2027

- ☐ 150 questions NL validées et signées
- ☐ Premier paiement depuis la Flandre
- ☐ Aucune fuite de question régionale entre versions

---

## P4 — Rétention (8 semaines)

**Objectif :** sortir du modèle d'achat unique, où la valeur par client plafonne à 20 €.

- Comptes utilisateurs (Supabase Auth) et migration des accès par lien.
- Suivi de progression, historique des examens blancs, chapitres faibles persistants.
- Chapitres de cours, en priorité sur les thèmes les plus échoués mesurés en P2.
- Première offre à valeur ajoutée : **garantie « réussi ou remboursé » à 29,90 €**. C'est un produit d'assurance et il se tarife comme tel — fréquence de sinistre, sévérité, et surtout contrôle de l'antisélection par des conditions d'éligibilité (par exemple : garantie active seulement après 8 examens blancs à 45/50 ou plus). Ne pas lancer cette offre avant de disposer des taux de réussite réels mesurés en P2 et P3.

---

## P5 — Pic 2 (13 semaines)

**Objectif :** la seconde saison doit être rentable, pas seulement active.

- **Test de perception des risques** en option à 14,90 €. C'est le seul module qui exige de la vidéo : compter 20 à 30 séquences filmées, poste de coût le plus lourd du projet à ce jour. À ne lancer que si P2 et P3 ont confirmé la demande.
- **Moteur adaptatif** en service Python/FastAPI séparé : calibration IRT sur les réponses accumulées depuis P2, puis affichage d'un score de réussite prédit. Cette fonctionnalité n'a de sens qu'avec du volume de données — c'est pour cela qu'elle arrive ici et pas plus tôt.
- Objectif financier : **marge nette positive sur le trimestre**, coût du contenu et de la validation inclus.

---

## P6 — Défensif (8 mois)

**Objectif :** survivre à la refonte réglementaire.

Le nouveau **Code de la voie publique entre en vigueur le 1er juin 2027** — c'est une refonte, pas un amendement. Un corpus non mis à jour devient faux du jour au lendemain, et un site qui enseigne des règles périmées perd sa raison d'être.

- Dès mars 2027 : audit du corpus contre le nouveau texte, question par question.
- Chaque question dont la réponse change reçoit une version datée ; l'ancienne est archivée, pas écrasée.
- Nouvelle passe de validation par les deux moniteurs.
- Communication offensive sur la transition : c'est un pic de recherche gratuit et une occasion de prendre des positions SEO que les concurrents mettront des mois à corriger.

À surveiller en parallèle : la modification du code entrée en vigueur le **1er juillet 2026** (vérifier son impact sur le corpus actuel) et l'alignement flamand sur la régionalisation complète, attendu **avant fin 2026**.

---

## Budget de trésorerie — 12 premiers mois

| Poste | Montant |
| --- | --- |
| Validation moniteur FR (100 puis 150 questions) | 1 500 – 3 000 € |
| Validation moniteur NL | 1 200 – 2 500 € |
| Domaine, hébergement, email (paliers gratuits au départ) | 150 – 400 € |
| Frais Mollie (≈ 2 % + frais fixes) | proportionnel |
| Production des visuels (matériel, temps) | 200 – 500 € |
| Conseil juridique — CGV, RGPD, garantie remboursement | 500 – 1 200 € |
| **Total sortie de trésorerie** | **3 500 – 7 600 €** |

Aucune ligne de publicité payante : à 20 € de valeur par client, le coût par clic sur ces mots-clés dépasse la marge. L'acquisition est organique par construction, ce n'est pas une économie mais une contrainte structurelle.

---

## Risques classés par gravité

| Risque | Impact | Mitigation |
| --- | --- | --- |
| Question fausse servie comme validée | Réputation détruite, potentiellement définitive | Statut `live` obligatoire, signature moniteur, retrait au moindre doute |
| Copie de contenu ou d'image d'un tiers | Action juridique, arrêt du projet | Rédaction originale depuis le texte légal, visuels produits en propre |
| Refonte réglementaire de juin 2027 non anticipée | Corpus entier périmé | P6 démarré dès mars 2027 |
| Retard de la validation moniteur | Rate le pic de janvier | Contact en S1, mise en ligne partielle si nécessaire |
| Trafic organique insuffisant | Pas de revenu | Porte de décision de février, bascule B2B prévue |
| Concurrent gratuit adossé aux pouvoirs publics en Flandre | Marge NL faible | Prix NL abaissé à 14,90 €, différenciation par le barème réel |
| Épuisement personnel | Abandon | Périmètre v0 délibérément minuscule, P2 sans développement |

---

## Ce qui n'est volontairement pas dans cette roadmap

Application mobile native, gamification, classements, mode multijoueur, chatbot d'aide, permis A ou C, back-office d'administration, refonte graphique.

Chacune de ces briques a une justification plausible et coûterait des semaines sans améliorer le seul chiffre qui décide de la survie du projet : le taux de conversion du visiteur en client payant.
