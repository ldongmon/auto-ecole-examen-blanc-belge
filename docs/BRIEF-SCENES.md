# Brief de production — 8 scènes de circulation

Destiné à qui produit les visuels (toi-même, un photographe, ou un illustrateur freelance).
Utilisable pour une vraie photo **ou** une illustration — le contenu exigé est le même,
seule la technique change. Voir `docs/BACKLOG-VISUELS.md` pour l'arbitrage entre les deux.

## Règle absolue pour chaque scène

Le visuel doit représenter **exactement** la situation décrite dans l'énoncé, sans ambiguïté
qui pourrait laisser croire à une autre réponse que la bonne. Un cadrage flou sur ce point
est pire qu'aucun visuel : le candidat s'entraîne sur une image qui contredit la règle.

Point commun à toutes les scènes avec des personnes : si photo, flouter toute plaque
d'immatriculation et tout visage reconnaissable avant publication.

---

### q16 — Priorité en tournant à gauche

**Doit apparaître :** vue conducteur (POV), véhicule arrêté au centre d'un carrefour,
clignotant gauche actif, un second véhicule arrivant *en face*, clairement engagé sur la
voie opposée et poursuivant tout droit (pas à l'arrêt, pas en train de tourner lui-même).

**Ne doit pas apparaître :** un panneau de priorité qui trancherait la situation autrement
(pas de B1/B9/panneau de priorité dans le cadre — la règle testée est la priorité générale
au véhicule venant en face lors d'un tourne-à-gauche, pas une priorité signalée).

**Angle :** POV conducteur, carrefour classique en agglomération, 2x1 voies.

---

### q17 — Piéton dans la rue latérale

**Doit apparaître :** vue conducteur tournant à droite dans une rue latérale ; un piéton
**déjà engagé**, un pied sur la chaussée de cette rue latérale (pas sur la rue principale).

**Ne doit pas apparaître :** de passage protégé marqué au sol — l'énoncé et le `why`
précisent que la règle s'applique "qu'il y ait un passage protégé ou non" ; mettre un passage
protégé bien visible détournerait l'attention vers une mauvaise raison.

**Angle :** POV conducteur, au moment précis du changement de direction, piéton visible sur
la gauche ou la droite selon le sens du virage.

---

### q19 — Autobus qui quitte son arrêt

**Doit apparaître :** vue conducteur en agglomération, autobus à l'arrêt sur un arrêt
matérialisé, clignotant gauche actif signalant le redémarrage.

**Ne doit pas apparaître :** l'autobus déjà en mouvement ou déboîté — il doit être encore
à l'arrêt, seul le clignotant indique l'intention.

**Angle :** POV conducteur derrière ou à côté du bus, environnement urbain reconnaissable
(pas une route rurale).

---

### q31 — Agent qui règle la circulation

**Doit apparaître :** agent en tenue réglementaire belge (uniforme de police, pas un simple
gilet jaune), au centre d'un carrefour, **bras levé verticalement**, feu tricolore visible
au vert dans la direction du conducteur.

**Ne doit pas apparaître :** un agent bras tendu horizontalement (ça signifierait autre
chose) ; le feu doit être visiblement vert, pas rouge ni orange, pour que le conflit
feu-vert/agent-qui-arrête soit net.

**Angle :** POV conducteur à l'approche du carrefour, agent visible de face ou de profil,
geste du bras sans ambiguïté.

---

### q34 — Dépassement au sommet d'une côte

**Doit apparaître :** POV conducteur derrière un tracteur lent, route à double sens montant,
sommet de côte proche avec **visibilité nulle au-delà**, ligne de marquage au sol
**discontinue** (pas continue — l'énoncé insiste sur ce point : la ligne autorise
techniquement mais la visibilité l'interdit quand même).

**Ne doit pas apparaître :** le sommet de la côte avec une vue dégagée derrière — il faut
que l'absence de visibilité soit évidente à l'œil.

**Angle :** POV conducteur, route de campagne, pente ascendante marquée.

---

### q36 — Dépassement d'un cycliste

**Doit apparaître :** POV conducteur dépassant un cycliste, route hors agglomération,
**absence de bande cyclable séparée** (sinon la question de distance latérale ne se pose
pas de la même façon).

**Ne doit pas apparaître :** de bande cyclable marquée au sol.

**Angle :** POV conducteur au moment du dépassement, cycliste visible sur la droite,
route à caractère rural ou périurbain.

---

### q43 — Piéton sur un passage protégé

**Doit apparaître :** POV conducteur approchant un passage pour piétons marqué
(bandes blanches), un piéton **posant le pied sur la chaussée**, au bord du passage.

**Ne doit pas apparaître :** le piéton encore sur le trottoir (l'énoncé et le `why`
insistent : le passage à l'action déclenche l'obligation, pas l'intention visible de loin).

**Angle :** POV conducteur, distance courte à moyenne du passage, piéton net et identifiable.

---

### q50 — Insertion sur autoroute

**Doit apparaître :** POV conducteur sur une bande d'accélération d'autoroute, **trafic
dense** clairement visible sur la bande de droite de l'autoroute.

**Ne doit pas apparaître :** une bande de droite vide ou peu chargée — la densité du trafic
est le cœur de la question (l'usager qui s'insère doit céder malgré la difficulté).

**Angle :** POV conducteur, bande d'accélération bien identifiable (marquage, signalisation
d'insertion), plusieurs véhicules visibles sur la bande de droite.

---

## Si le choix se porte sur un illustrateur (brief technique complémentaire)

- Format livrable : SVG ou PNG haute résolution, fond transparent ou couleur unie
- Point de vue cohérent sur les 8 scènes (même hauteur d'œil, même style de rendu)
- Palette cohérente avec le reste du site (voir `assets/signs/palette.json` pour les
  couleurs déjà utilisées ailleurs dans l'app)
- Pas de texte intégré à l'image (mêmes contraintes que les panneaux — voir
  `assets/signs/ar1975/*.svg`)
