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

**Recommandation en attente d'arbitrage client** : vraies photos en premier (gratuit, contrôle total de la conformité au brief), illustrateur freelance en complément pour les scènes difficiles à photographier (ex. agent qui règle la circulation).

## Prochaine étape possible

Préparer une fiche de prise de vue précise par question (angle, éléments obligatoires dans
le cadre, ce qu'il ne faut surtout pas montrer) pour que le client — ou un photographe/illustrateur
mandaté — puisse produire ces 8 visuels sans aller-retour.
