# Protocole de relecture — corpus questions permis B

Version du corpus : **0.2.0-draft** — 2026-09-03  
Statut : **NON VALIDÉ — aucune question ne peut être publiée avant relecture par un moniteur agréé (FR) et un moniteur agréé (NL).**

Ce document est destiné au moniteur d'auto-école agréé chargé de la validation. 
Il est généré automatiquement depuis `questions.json` : toute modification du corpus doit être suivie d'une régénération.

## 1. Composition du corpus

- Questions : **46** (q15 à q60), à ajouter aux 14 du prototype initial
- Questions éliminatoires (fautes graves) : **23** dont **4** du 4e degré
- Questions nécessitant un visuel : **15**
- Questions portant au moins un point à vérifier : **25**

Le taux de questions graves (50 %) est volontairement supérieur à celui de l'examen réel. 
Le tirage de l'examen blanc doit rééquilibrer la proportion, sinon le score simulé sera plus sévère que le score officiel.

## 2. Points critiques — blocage de publication

Ces questions ne peuvent pas être mises en ligne avant validation explicite. En cas de doute, elles sont retirées du tirage, pas corrigées à l'estime.

| ID | Thème | Ce qui doit être vérifié | Validé |
| --- | --- | --- | --- |
| `q24` | Stationnement | confirmer l'attribution des codes E1 et E3 et le nombre de barres. Ne pas publier tant que ce n'est pas vérifié. | ☐ |
| `q36` | Dépassement | confirmer les valeurs 1 m / 1,50 m et leur date d'entrée en vigueur. Vérifier aussi qu'elles sont identiques dans les trois régions. | ☐ |
| `q47` | Usagers vulnérables | réglementation récente et susceptible d'évolutions régionales. Vérifier l'âge minimal, l'interdiction de trottoir et le nombre d'occupants avant publication. | ☐ |
| `q57` | Comportement | vérifier l'interprétation de « à l'arrêt ou en stationnement » dans un embouteillage. C'est le piège classique et il doit être juridiquement exact. | ☐ |

## 3. Vérification des questions éliminatoires

Pour chaque question ci-dessous, confirmer que le comportement décrit correspond bien à un item de la liste officielle des 50 fautes graves, 
et que le degré indiqué est correct. Une question cotée à tort comme grave fausse le score de l'utilisateur de 4 points.

| ID | Degré | Item de la liste officielle rattaché | Correct |
| --- | --- | --- | --- |
| `q16` | 3 | Ne pas céder le passage au conducteur venant en sens inverse lorsqu'on tourne à gauche | ☐ |
| `q17` | 3 | Lors d'un changement de direction, ne pas céder le passage aux piétons qui traversent la chaussée sur laquelle on s'engage | ☐ |
| `q18` | 3 | Ne pas dégager à l'approche d'un véhicule prioritaire utilisant son avertisseur sonore spécial | ☐ |
| `q22` | 3 | Emprunter un sens interdit | ☐ |
| `q23` | vitesse | Tout dépassement de la vitesse autorisée | ☐ |
| `q27` | 3 | Rouler plus vite que l'allure du pas dans une zone piétonne | ☐ |
| `q28` | vitesse | Tout dépassement de la vitesse autorisée | ☐ |
| `q30` | vitesse | Tout dépassement de la vitesse autorisée | ☐ |
| `q31` | 3 | Ne pas obéir aux injonctions d'un agent qualifié | ☐ |
| `q33` | 3 | Ne pas céder le passage lorsqu'on suit une flèche verte alors que le feu est rouge | ☐ |
| `q34` | 4 | Dépasser à l'approche du sommet d'une côte ou dans un virage sans visibilité | ☐ |
| `q35` | 3 | Franchir une ligne blanche continue | ☐ |
| `q36` | 3 | Dépasser un cycliste ou un cyclomotoriste à moins d'un mètre | ☐ |
| `q37` | 3 | Accélérer ou ne pas serrer à droite alors qu'on est dépassé | ☐ |
| `q41` | 4 | S'arrêter ou stationner sur un passage à niveau | ☐ |
| `q42` | 4 | Franchir un passage à niveau fermé | ☐ |
| `q43` | 3 | Ne pas céder le passage aux piétons qui s'engagent sur un passage protégé | ☐ |
| `q44` | 3 | Couper un rang d'enfants | ☐ |
| `q45` | 3 | Ne pas ralentir fortement à l'approche d'un véhicule de transport scolaire | ☐ |
| `q46` | 3 | Ne pas utiliser un dispositif de retenue adapté pour un enfant de moins de 1,35 m | ☐ |
| `q48` | 4 | Faire demi-tour sur une autoroute | ☐ |
| `q57` | 3 | Utiliser, manipuler ou tenir en main un appareil électronique mobile doté d'un écran non fixé, sauf véhicule à l'arrêt ou en stationnement | ☐ |
| `q60` | 3 | Circuler sur la bande d'arrêt d'urgence ou emprunter la chaussée de gauche lorsque les chaussées sont séparées | ☐ |

## 4. Autres points à confirmer

**`q15` — Priorité**
- ☐ Confirmer que la formulation n'induit pas que tous les ronds-points belges portent un B1.

**`q18` — Priorité**
- ☐ Vérifier la formulation sur le franchissement de la ligne d'arrêt : elle doit rester conditionnée à la sécurité.

**`q19` — Priorité**
- ☐ Confirmer que la règle est limitée à l'agglomération.

**`q21` — Panneaux**
- ☐ Vérifier le code du signal (B9) et l'aspect exact du visuel produit.

**`q23` — Vitesse**
- ☐ Confirmer la règle de fin d'une limitation isolée par rapport à une limitation de zone.

**`q26` — Panneaux**
- ☐ Vérifier le code D1 et la variante de flèche retenue pour le visuel.

**`q27` — Zones particulières**
- ☐ Ne pas confondre zone piétonne (allure du pas) et zone résidentielle (20 km/h) : vérifier que les deux questions du corpus restent bien distinctes.

**`q29` — Vitesse**
- ☐ Confirmer l'absence de limitation spécifique par temps de pluie dans les trois régions.

**`q30` — Vitesse**
- ☐ La synthèse vocale FR doit dire « septante » et non « soixante-dix » pour un public belge.

**`q31` — Agents et feux**
- ☐ Vérifier l'ordre de priorité de la signalisation tel qu'il doit être enseigné.

**`q35` — Dépassement**
- ☐ Vérifier les exceptions éventuelles (véhicule à l'arrêt, obstacle) pour que la formulation reste exacte.

**`q38` — Stationnement**
- ☐ Confirmer la condition exacte relative au numéro d'immatriculation reproduit sur l'entrée.

**`q39` — Stationnement**
- ☐ Confirmer la valeur de 5 mètres et la formulation « en deçà » utilisée par l'examen officiel.

**`q40` — Stationnement**
- ☐ Vérifier les particularités communales et régionales éventuelles en matière de stationnement sur trottoir.

**`q45` — Usagers vulnérables**
- ☐ Vérifier la formulation exacte de l'obligation : « ralentir fortement » et non « s'arrêter systématiquement ».

**`q46` — Le véhicule**
- ☐ Confirmer le double critère âge / taille et les exceptions prévues (trajets courts, taxis, troisième enfant).

**`q49` — Autoroute**
- ☐ Confirmer le statut des cyclomoteurs de classe B sur autoroute.

**`q53` — Documents**
- ☐ Vérifier la liste exacte des documents exigés en 2026, notamment le statut du certificat de conformité et le format numérique de l'attestation d'assurance.

**`q54` — Le véhicule**
- ☐ Confirmer la périodicité 2026, une réforme du contrôle technique étant régulièrement annoncée.

**`q56` — Le véhicule**
- ☐ Confirmer la liste des équipements obligatoires à bord d'un véhicule immatriculé en Belgique.

**`q58` — Comportement**
- ☐ La règle des deux secondes est pédagogique et non réglementaire : vérifier qu'elle est présentée comme telle.

## 5. Références légales

Le champ `ref_legale` contient une attribution de travail. **La numérotation des articles n'a pas été vérifiée article par article.** 
Deux options : soit le moniteur corrige chaque référence, soit le champ est vidé et n'est pas affiché à l'utilisateur. 
Afficher une référence erronée est plus dommageable que ne rien afficher.

## 6. Production des visuels

Aucun visuel ne peut être repris d'un tiers, y compris d'un site concurrent ou d'une banque d'images non licenciée. 
Le champ `media.brief` décrit la prise de vue ou l'illustration à produire.

| ID | Brief de production |
| --- | --- |
| `q15` | Vue conducteur à l'approche d'un rond-point à deux bandes, signal B1 (triangle pointe en bas) visible à droite, deux véhicules déjà engagés sur l'anneau. |
| `q16` | Vue conducteur arrêté au centre d'un carrefour, clignotant gauche, un véhicule arrive de face sur la voie opposée. |
| `q17` | Vue conducteur tournant à droite dans une rue latérale, un piéton traverse déjà cette rue latérale. |
| `q19` | Vue conducteur en agglomération, un autobus à l'arrêt sur un arrêt de bus met son clignotant gauche pour repartir. |
| `q21` | Signal B9 : losange jaune bordé de blanc, sur poteau, en bord de chaussée. |
| `q22` | Signal C1 : disque rouge avec barre horizontale blanche, à l'entrée d'une rue étroite. |
| `q23` | Signal F4a : panneau carré bleu portant un disque de limitation à 30 et la mention ZONE. |
| `q24` | Deux signaux côte à côte : disque bleu cerclé de rouge barré d'une seule diagonale, et disque bleu cerclé de rouge barré de deux diagonales croisées. |
| `q25` | Signal A23 : triangle à bord rouge représentant deux enfants, implanté avant une école. |
| `q26` | Signal D1 : disque bleu portant une flèche blanche dirigée vers la droite, placé avant un carrefour. |
| `q31` | Agent de police en tenue réglementaire au centre d'un carrefour, bras levé verticalement. |
| `q34` | Vue conducteur derrière un tracteur lent, route à double sens montant vers un sommet de côte, visibilité nulle au-delà. |
| `q36` | Vue conducteur dépassant un cycliste sur une route hors agglomération, sans bande cyclable. |
| `q43` | Vue conducteur approchant d'un passage pour piétons, un piéton pose le pied sur la chaussée au bord du passage. |
| `q50` | Vue conducteur sur une bande d'accélération d'autoroute, trafic dense sur la bande de droite. |

## 7. Synthèse vocale

Le champ `tts` contient la version parlée de chaque énoncé, distincte du texte affiché : abréviations développées 
(« B1 » → « B un », « km/h » → « kilomètres à l'heure », « GSM » → « G S M ») et nombres écrits en mots. 
Deux vérifications à faire à l'écoute :

- ☐ Les nombres en français sont dits à la belge : **septante**, **nonante**, jamais « soixante-dix » ni « quatre-vingt-dix ».
- ☐ Aucun énoncé ne dépasse 12 secondes de lecture, faute de quoi le chronomètre de 15 secondes devient injouable.

## 8. Registre de langue

Une cause d'échec documentée est la formulation des questions officielles : français soutenu, doubles négations, 
expressions comme « en deçà » ou « au-delà », distinctions fines entre termes proches (bande cyclable / piste cyclable). 
Le corpus adopte volontairement ce registre dans l'énoncé, et une langue simple dans l'explication.

- ☐ Confirmer que les énoncés restent proches du registre officiel sans devenir ambigus.
- ☐ Confirmer que chaque explication est compréhensible par un candidat non francophone de niveau B1.

## 9. Signature

| | Nom | N° d'agrément | Date | Signature |
| --- | --- | --- | --- | --- |
| Moniteur FR | | | | |
| Moniteur NL | | | | |

Après signature, passer le champ `_meta.statut` à `VALIDÉ` et le `status` de chaque question à `live`. 
Seules les questions signées sont servies en production.