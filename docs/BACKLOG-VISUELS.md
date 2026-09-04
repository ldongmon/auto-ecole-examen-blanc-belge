# Backlog visuels — scènes de circulation

Chantier séparé de la bibliothèque de panneaux (`data/signs.json`, `lib/signs/`),
volontairement pas traité dans cette session. Les panneaux sont des formes fixes et
normalisées, reproductibles fidèlement en SVG ; les scènes de circulation demandent une
vraie prise de vue ou une illustration composée, pas quelque chose qu'on peut dessiner à
l'estime sans perdre en fiabilité.

## Questions concernées (champ `media` toujours en place, non touché par la migration)

| ID | Brief |
| --- | --- |
| `q16` | Vue conducteur arrêté au centre d'un carrefour, clignotant gauche, un véhicule arrive de face sur la voie opposée. |
| `q17` | Vue conducteur tournant à droite dans une rue latérale, un piéton traverse déjà cette rue latérale. |
| `q19` | Vue conducteur en agglomération, un autobus à l'arrêt sur un arrêt de bus met son clignotant gauche pour repartir. |
| `q31` | Agent de police en tenue réglementaire au centre d'un carrefour, bras levé verticalement. |
| `q34` | Vue conducteur derrière un tracteur lent, route à double sens montant vers un sommet de côte, visibilité nulle au-delà. |
| `q36` | Vue conducteur dépassant un cycliste sur une route hors agglomération, sans bande cyclable. |
| `q43` | Vue conducteur approchant d'un passage pour piétons, un piéton pose le pied sur la chaussée au bord du passage. |
| `q50` | Vue conducteur sur une bande d'accélération d'autoroute, trafic dense sur la bande de droite. |

## Options réelles, déjà évaluées avec le client (2026-09-04)

| Option | Qualité perçue | Coût | Risque |
| --- | --- | --- | --- |
| Vraies photos (dashcam / smartphone sur pare-brise) | Très crédible si bien cadrées | Gratuit, temps à prévoir | RGPD : flouter plaques et visages |
| Illustrateur freelance (Malt/Fiverr/Upwork) | Très pro, cohérent sur toute la série | ~200–600 € pour 15-20 scènes | Faible si le contrat cède bien les droits |
| Génération par IA image | Variable, mais dangereux ici | Quasi gratuit | **Élevé** — erreur factuelle possible sur une règle de priorité/position, inacceptable sur du contenu d'examen. Explicitement déconseillé. |
| Scène 3D réutilisable (kit de carrefour redécorable) | Pro, scalable | Fort au démarrage, faible ensuite | Compétence technique à acquérir |

**Décision du client (2026-09-04)** : vraies photos d'abord, illustrateur freelance en
complément pour ce qui est difficile à photographier soi-même.

## Répartition proposée

| Technique | Questions | Pourquoi |
| --- | --- | --- |
| **Photo** | `q16`, `q17`, `q36`, `q43` | Situations reproductibles avec un proche qui coopère (conducteur, piéton, cycliste), sur une route ordinaire, sans dépendre d'un tiers ou d'un timing rare. |
| **Photo si l'occasion se présente, sinon illustrateur** | `q19`, `q34`, `q50` | Faisable en vrai mais dépend de conditions qu'on ne maîtrise pas : un bus réel au bon moment (q19), un tracteur réel sur une route à profil de côte adéquat (q34), un trafic dense réel sur autoroute photographié en sécurité (q50). |
| **Illustrateur** | `q31` | Un agent de police en tenue réglementaire qui règle la circulation ne se met pas en scène sur commande — situation rare, personne réelle, tenue officielle. Bien plus simple et plus sûr en illustration. |

## Brief de production

Fait — voir `docs/BRIEF-SCENES.md` : fiche par question (ce qui doit/ne doit pas apparaître,
angle, ce qu'il ne faut surtout pas montrer), utilisable pour une vraie photo ou une
illustration.

## Brief de commande illustrateur

Fait — voir `docs/BRIEF-ILLUSTRATEUR.md` : prêt à poster sur Malt/Fiverr/Upwork pour `q31`
(et `q19`/`q34`/`q50` en repli si les photos ne sont pas concluantes).
