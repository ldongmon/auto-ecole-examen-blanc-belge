import React, { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   CONFIGURATION DU MOTEUR — c'est ici qu'on passe du démo au réel.
   Examen officiel : 50 questions, 41/50, faute grave = -5,
   2 fautes graves = échec automatique.
------------------------------------------------------------------ */
const CONFIG = {
  demo:  { count: 10, total: 10, passMark: 8,  seconds: 15 },
  reel:  { count: 50, total: 50, passMark: 41, seconds: 15 },
};
const MODE = "demo";
const HEAVY_PENALTY = 5;
const HEAVY_FAIL_COUNT = 2;

/* ------------------------------------------------------------------
   BANQUE DE QUESTIONS
   heavy: true  -> faute grave (-5 pts, 2 = échec direct)
   answerByRegion -> la bonne réponse dépend de la région d'examen
------------------------------------------------------------------ */
const BANK = [
  {
    id: "q1", theme: { fr: "Priorité", nl: "Voorrang" }, heavy: true, sign: null,
    fr: {
      stem: "Aucun panneau n'est placé à ce carrefour. Un véhicule arrive sur ta droite en même temps que toi.",
      opts: ["Je lui cède le passage", "Je passe, j'étais engagé en premier", "Je passe en klaxonnant"],
      why: "En l'absence de signalisation, la priorité de droite s'applique. Ne pas la respecter est une infraction lourde : elle te coûte 5 points, pas 1.",
    },
    nl: {
      stem: "Er staat geen enkel verkeersbord aan dit kruispunt. Een voertuig nadert van rechts op hetzelfde moment als jij.",
      opts: ["Ik verleen voorrang", "Ik rijd door, ik was er eerst", "Ik rijd door en toeter"],
      why: "Zonder signalisatie geldt voorrang van rechts. Dit niet respecteren is een zware overtreding: 5 punten aftrek, geen 1.",
    },
    answer: 0,
  },
  {
    id: "q2", theme: { fr: "Vitesse", nl: "Snelheid" }, heavy: false, sign: null,
    fr: {
      stem: "Tu roules hors agglomération sur une route ordinaire à deux bandes. Aucun panneau de vitesse n'est visible. Quelle est la vitesse maximale autorisée ?",
      opts: ["70 km/h", "90 km/h", "120 km/h"],
      why: "La règle dépend de la région : 90 km/h en Wallonie, 70 km/h en Flandre et en Région bruxelloise, sauf indication contraire.",
    },
    nl: {
      stem: "Je rijdt buiten de bebouwde kom op een gewone weg met twee rijstroken. Er staat geen enkel snelheidsbord. Wat is de maximumsnelheid ?",
      opts: ["70 km/u", "90 km/u", "120 km/u"],
      why: "De regel verschilt per gewest : 90 km/u in Wallonië, 70 km/u in Vlaanderen en Brussel, tenzij anders aangegeven.",
    },
    answerByRegion: { WAL: 1, BRU: 0, VLA: 0 },
  },
  {
    id: "q3", theme: { fr: "Panneaux", nl: "Verkeersborden" }, heavy: false, sign: "B1",
    fr: {
      stem: "Que t'impose ce panneau ?",
      opts: ["Céder le passage", "Marquer l'arrêt complet", "Interdiction de tourner"],
      why: "Le triangle pointe en bas (B1) impose de céder le passage. Tu ne dois pas t'arrêter si la voie est libre, contrairement au STOP.",
    },
    nl: {
      stem: "Wat legt dit bord je op ?",
      opts: ["Voorrang verlenen", "Volledig stoppen", "Verbod om af te slaan"],
      why: "De omgekeerde driehoek (B1) verplicht je voorrang te verlenen. Je moet niet stoppen als de weg vrij is, in tegenstelling tot het STOP-bord.",
    },
    answer: 0,
  },
  {
    id: "q4", theme: { fr: "Panneaux", nl: "Verkeersborden" }, heavy: true, sign: "B5",
    fr: {
      stem: "Tu arrives à ce panneau. La route transversale est parfaitement dégagée.",
      opts: ["Je ralentis fortement et je passe", "Je m'arrête complètement, puis je repars", "Je passe sans ralentir"],
      why: "Le STOP impose l'arrêt complet, roues immobiles, même si la voie est vide. Passer sans s'arrêter est une infraction lourde.",
    },
    nl: {
      stem: "Je nadert dit bord. De dwarsweg is volledig vrij.",
      opts: ["Ik vertraag sterk en rijd door", "Ik stop volledig en rijd dan verder", "Ik rijd door zonder te vertragen"],
      why: "Het STOP-bord verplicht een volledige stilstand, ook als de weg leeg is. Doorrijden is een zware overtreding.",
    },
    answer: 1,
  },
  {
    id: "q5", theme: { fr: "Vitesse", nl: "Snelheid" }, heavy: false, sign: null,
    fr: {
      stem: "En agglomération, sans panneau contraire, la vitesse maximale est de :",
      opts: ["30 km/h", "50 km/h", "70 km/h"],
      why: "50 km/h est la règle de base en agglomération dans les trois régions. Beaucoup de zones sont toutefois abaissées à 30 km/h par panneau.",
    },
    nl: {
      stem: "Binnen de bebouwde kom, zonder ander bord, is de maximumsnelheid :",
      opts: ["30 km/u", "50 km/u", "70 km/u"],
      why: "50 km/u is de basisregel binnen de bebouwde kom in de drie gewesten. Veel zones zijn wel verlaagd naar 30 km/u met een bord.",
    },
    answer: 1,
  },
  {
    id: "q6", theme: { fr: "Alcool et drogues", nl: "Alcohol en drugs" }, heavy: true, sign: null,
    fr: {
      stem: "Pour un conducteur ordinaire, le taux d'alcool maximal autorisé dans le sang est de :",
      opts: ["0,2 g/l", "0,5 g/l", "0,8 g/l"],
      why: "0,5 g/l dans le sang, soit 0,22 mg/l dans l'air expiré. La limite descend à 0,2 g/l pour les conducteurs professionnels.",
    },
    nl: {
      stem: "Voor een gewone bestuurder bedraagt het maximaal toegelaten alcoholgehalte in het bloed :",
      opts: ["0,2 g/l", "0,5 g/l", "0,8 g/l"],
      why: "0,5 g/l in het bloed, of 0,22 mg/l in de uitgeademde lucht. Voor professionele bestuurders is de grens 0,2 g/l.",
    },
    answer: 1,
  },
  {
    id: "q7", theme: { fr: "Autoroute", nl: "Autosnelweg" }, heavy: false, sign: null,
    fr: {
      stem: "Sur autoroute, la vitesse minimale imposée sur la bande de gauche est de :",
      opts: ["50 km/h", "70 km/h", "90 km/h"],
      why: "70 km/h. Rouler plus lentement sur la bande de gauche gêne la circulation et est sanctionné.",
    },
    nl: {
      stem: "Op de autosnelweg bedraagt de opgelegde minimumsnelheid op de linkerrijstrook :",
      opts: ["50 km/u", "70 km/u", "90 km/u"],
      why: "70 km/u. Trager rijden op de linkerrijstrook hindert het verkeer en is strafbaar.",
    },
    answer: 1,
  },
  {
    id: "q8", theme: { fr: "Feux", nl: "Verkeerslichten" }, heavy: false, sign: null,
    fr: {
      stem: "Le feu passe à l'orange fixe alors que tu es encore à bonne distance du carrefour.",
      opts: ["J'accélère pour passer", "Je m'arrête avant le feu", "Je continue à vitesse constante"],
      why: "L'orange fixe impose l'arrêt. Tu ne peux franchir le feu que si tu es si près qu'un arrêt serait dangereux.",
    },
    nl: {
      stem: "Het licht springt op vast oranje terwijl je nog ver van het kruispunt bent.",
      opts: ["Ik versnel om er nog door te raken", "Ik stop voor het licht", "Ik rijd verder aan dezelfde snelheid"],
      why: "Vast oranje verplicht je te stoppen. Je mag enkel doorrijden als je zo dicht bent dat stoppen gevaarlijk zou zijn.",
    },
    answer: 1,
  },
  {
    id: "q9", theme: { fr: "Vitesse", nl: "Snelheid" }, heavy: false, sign: "F12a",
    fr: {
      stem: "Tu entres dans une zone signalée par ce panneau. La vitesse y est limitée à :",
      opts: ["20 km/h", "30 km/h", "50 km/h"],
      why: "En zone résidentielle ou de rencontre, la vitesse est de 20 km/h et les piétons peuvent occuper toute la largeur de la voie.",
    },
    nl: {
      stem: "Je rijdt een zone binnen die met dit bord is aangeduid. De snelheid is er beperkt tot :",
      opts: ["20 km/u", "30 km/u", "50 km/u"],
      why: "In een woonerf of erf geldt 20 km/u en mogen voetgangers de volledige breedte van de weg gebruiken.",
    },
    answer: 0,
  },
  {
    id: "q10", theme: { fr: "Le véhicule", nl: "Het voertuig" }, heavy: false, sign: null,
    fr: {
      stem: "Un passager assis à l'arrière ne veut pas mettre sa ceinture. Il a 22 ans.",
      opts: ["C'est son choix, je démarre", "Je refuse de démarrer tant qu'il n'est pas attaché", "La ceinture n'est obligatoire qu'à l'avant"],
      why: "La ceinture est obligatoire à toutes les places équipées, avant comme arrière, sur tous les trajets.",
    },
    nl: {
      stem: "Een passagier achterin wil zijn gordel niet dragen. Hij is 22 jaar.",
      opts: ["Dat is zijn keuze, ik vertrek", "Ik vertrek niet zolang hij niet vastzit", "De gordel is enkel vooraan verplicht"],
      why: "De gordel is verplicht op alle uitgeruste zitplaatsen, voor- en achteraan, op elk traject.",
    },
    answer: 1,
  },
  {
    id: "q11", theme: { fr: "Dépassement", nl: "Inhalen" }, heavy: false, sign: null,
    fr: {
      stem: "Le conducteur devant toi s'est déporté à gauche et a mis son clignotant gauche pour tourner. Tu peux :",
      opts: ["Le dépasser par la droite", "Le dépasser par la gauche", "Attendre qu'il ait terminé sa manœuvre, sans jamais le dépasser"],
      why: "C'est l'exception classique : quand un conducteur a clairement indiqué qu'il tourne à gauche et s'est déporté, le dépassement se fait par la droite.",
    },
    nl: {
      stem: "De bestuurder voor jou is naar links uitgeweken en heeft zijn linkerrichtingaanwijzer aan om af te slaan. Je mag :",
      opts: ["Hem rechts inhalen", "Hem links inhalen", "Wachten tot hij klaar is, inhalen mag nooit"],
      why: "Dit is de klassieke uitzondering : wie duidelijk aangeeft links af te slaan en is uitgeweken, haal je rechts in.",
    },
    answer: 0,
  },
  {
    id: "q12", theme: { fr: "Priorité", nl: "Voorrang" }, heavy: false, sign: null,
    fr: {
      stem: "Un tram arrive sur ta gauche à un carrefour sans signalisation particulière.",
      opts: ["Je passe, j'ai la priorité de droite", "Je cède le passage au tram", "Je klaxonne pour l'avertir"],
      why: "Le tram a la priorité sur les autres usagers, quelle que soit sa direction d'arrivée. Sa distance de freinage rend toute autre règle intenable.",
    },
    nl: {
      stem: "Een tram nadert van links op een kruispunt zonder bijzondere signalisatie.",
      opts: ["Ik rijd door, ik heb voorrang van rechts", "Ik verleen voorrang aan de tram", "Ik toeter om hem te verwittigen"],
      why: "De tram heeft voorrang op de andere weggebruikers, uit welke richting hij ook komt. Zijn remafstand maakt elke andere regel onhoudbaar.",
    },
    answer: 1,
  },
  {
    id: "q13", theme: { fr: "Autoroute", nl: "Autosnelweg" }, heavy: false, sign: null,
    fr: {
      stem: "Le trafic est totalement à l'arrêt sur l'autoroute. La bande d'arrêt d'urgence est libre.",
      opts: ["Je l'emprunte pour rejoindre la prochaine sortie", "Je reste dans la file", "Je l'emprunte si je roule au pas"],
      why: "La bande d'arrêt d'urgence est réservée aux véhicules en détresse et aux services de secours. L'embouteillage ne change rien.",
    },
    nl: {
      stem: "Het verkeer staat volledig stil op de autosnelweg. De pechstrook is vrij.",
      opts: ["Ik gebruik ze om de volgende afrit te bereiken", "Ik blijf in de file staan", "Ik gebruik ze als ik stapvoets rijd"],
      why: "De pechstrook is voorbehouden aan voertuigen in nood en aan de hulpdiensten. Een file verandert daar niets aan.",
    },
    answer: 1,
  },
  {
    id: "q14", theme: { fr: "Feux", nl: "Verkeerslichten" }, heavy: true, sign: null,
    fr: {
      stem: "Le feu est rouge et aucun véhicule n'arrive. Tu es pressé.",
      opts: ["Je franchis le feu prudemment", "Je m'arrête et j'attends le vert", "Je franchis le feu si le carrefour est vide"],
      why: "Franchir un feu rouge est une infraction lourde. À l'examen, elle te coûte 5 points ; deux fautes de ce type et tu es recalé quel que soit ton total.",
    },
    nl: {
      stem: "Het licht staat op rood en er komt geen enkel voertuig aan. Je hebt haast.",
      opts: ["Ik rijd voorzichtig door", "Ik stop en wacht op groen", "Ik rijd door als het kruispunt leeg is"],
      why: "Door rood rijden is een zware overtreding. Op het examen kost dat 5 punten; twee zulke fouten en je bent gebuisd, wat je totaal ook is.",
    },
    answer: 1,
  },
];

/* ------------------------------------------------------------------ */

const T = {
  fr: {
    kicker: "Examen blanc — permis B",
    title: "Teste-toi avec le barème réel de l'examen.",
    lead: "La plupart des sites gratuits comptent 1 point par erreur. Le centre d'examen, lui, en retire 5 pour une faute grave — et deux fautes graves te recalent, même avec un bon total.",
    ruleTitle: "Le barème appliqué ici",
    r1: "50 questions, 41 bonnes réponses pour réussir",
    r2: "Faute ordinaire : −1 point",
    r3: "Faute grave : −5 points",
    r4: "Deux fautes graves : échec automatique",
    regionLabel: "Où passes-tu ton examen ?",
    regionHint: "Depuis 2026, toute ta formation doit se faire dans la même région. Certaines réponses changent selon ton choix.",
    timerLabel: "Chronomètre de 15 secondes par question",
    start: "Commencer l'examen blanc",
    demoNote: `Prototype : ${CONFIG[MODE].count} questions au lieu de 50.`,
    question: "Question",
    of: "sur",
    heavy: "Faute grave",
    next: "Question suivante",
    seeResult: "Voir mon résultat",
    correct: "Bonne réponse",
    wrong: "Mauvaise réponse",
    timeout: "Temps écoulé",
    passed: "Réussi",
    failed: "Échec",
    scoreOf: "sur",
    heavyFailMsg: "Deux fautes graves : recalé quel que soit ton total.",
    withoutHeavy: "Sans tes fautes graves, tu étais à",
    weakTitle: "Tes chapitres à retravailler",
    noWeak: "Aucun chapitre faible. Tu es prêt.",
    heavyList: "Fautes graves commises",
    emailTitle: "Reçois ton plan de révision",
    emailLead: "Les questions que tu as ratées, regroupées par chapitre, avec l'explication de chacune.",
    emailPh: "ton@email.be",
    emailBtn: "Envoyer",
    emailDone: "Prototype : aucun mail n'est envoyé.",
    again: "Recommencer",
  },
  nl: {
    kicker: "Proefexamen — rijbewijs B",
    title: "Test jezelf met het echte puntensysteem.",
    lead: "De meeste gratis sites trekken 1 punt af per fout. Het examencentrum trekt er 5 af voor een zware fout — en twee zware fouten betekenen buizen, ook met een goed totaal.",
    ruleTitle: "Het puntensysteem hier",
    r1: "50 vragen, 41 juiste antwoorden om te slagen",
    r2: "Gewone fout : −1 punt",
    r3: "Zware fout : −5 punten",
    r4: "Twee zware fouten : automatisch gebuisd",
    regionLabel: "Waar leg je je examen af ?",
    regionHint: "Sinds 2026 moet je volledige opleiding in hetzelfde gewest gebeuren. Sommige antwoorden hangen af van je keuze.",
    timerLabel: "Chronometer van 15 seconden per vraag",
    start: "Start het proefexamen",
    demoNote: `Prototype : ${CONFIG[MODE].count} vragen in plaats van 50.`,
    question: "Vraag",
    of: "van",
    heavy: "Zware fout",
    next: "Volgende vraag",
    seeResult: "Toon mijn resultaat",
    correct: "Juist",
    wrong: "Fout",
    timeout: "Tijd om",
    passed: "Geslaagd",
    failed: "Gebuisd",
    scoreOf: "op",
    heavyFailMsg: "Twee zware fouten : gebuisd, wat je totaal ook is.",
    withoutHeavy: "Zonder je zware fouten stond je op",
    weakTitle: "Hoofdstukken om te herhalen",
    noWeak: "Geen zwakke hoofdstukken. Je bent klaar.",
    heavyList: "Gemaakte zware fouten",
    emailTitle: "Ontvang je herhalingsplan",
    emailLead: "De vragen die je fout had, gegroepeerd per hoofdstuk, met uitleg bij elk antwoord.",
    emailPh: "jouw@email.be",
    emailBtn: "Versturen",
    emailDone: "Prototype : er wordt geen mail verstuurd.",
    again: "Opnieuw",
  },
};

const REGIONS = [
  { code: "WAL", fr: "Wallonie", nl: "Wallonië" },
  { code: "BRU", fr: "Bruxelles", nl: "Brussel" },
  { code: "VLA", fr: "Flandre", nl: "Vlaanderen" },
];

function Sign({ type }) {
  if (type === "B1")
    return (
      <svg viewBox="0 0 120 108" width="112" height="100" role="img" aria-label="B1">
        <polygon points="60,100 4,6 116,6" fill="#C41230" />
        <polygon points="60,86 18,15 102,15" fill="#fff" />
      </svg>
    );
  if (type === "B5")
    return (
      <svg viewBox="0 0 110 110" width="104" height="104" role="img" aria-label="B5">
        <polygon points="34,4 76,4 106,34 106,76 76,106 34,106 4,76 4,34" fill="#C41230" />
        <text x="55" y="68" textAnchor="middle" fontSize="30" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">STOP</text>
      </svg>
    );
  if (type === "F12a")
    return (
      <svg viewBox="0 0 90 118" width="86" height="112" role="img" aria-label="F12a">
        <rect x="2" y="2" width="86" height="114" rx="4" fill="#0B5AA8" />
        <rect x="8" y="8" width="74" height="102" rx="2" fill="none" stroke="#fff" strokeWidth="2.5" />
        <circle cx="30" cy="34" r="7" fill="#fff" />
        <path d="M30 43 l-9 17 h5 l4 -8 4 8 h5 z" fill="#fff" />
        <circle cx="58" cy="40" r="5" fill="#fff" />
        <path d="M58 47 l-6 12 h4 l2 -6 2 6 h4 z" fill="#fff" />
        <rect x="16" y="76" width="58" height="14" rx="2" fill="#fff" />
        <circle cx="27" cy="94" r="5" fill="#fff" />
        <circle cx="63" cy="94" r="5" fill="#fff" />
      </svg>
    );
  return null;
}

export default function ExamenBlancBelge() {
  const [lang, setLang] = useState("fr");
  const [region, setRegion] = useState("WAL");
  const [timed, setTimed] = useState(true);
  const [screen, setScreen] = useState("home");
  const [deck, setDeck] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [log, setLog] = useState([]);
  const [left, setLeft] = useState(CONFIG[MODE].seconds);
  const [mailSent, setMailSent] = useState(false);
  const [mail, setMail] = useState("");
  const tick = useRef(null);
  const t = T[lang];

  const answerOf = (q) => (q.answerByRegion ? q.answerByRegion[region] : q.answer);

  function begin() {
    const shuffled = [...BANK].sort(() => Math.random() - 0.5).slice(0, CONFIG[MODE].count);
    setDeck(shuffled);
    setIdx(0); setPicked(null); setLog([]); setMailSent(false); setMail("");
    setLeft(CONFIG[MODE].seconds);
    setScreen("exam");
  }

  useEffect(() => {
    if (screen !== "exam" || picked !== null || !timed) return;
    tick.current = setInterval(() => {
      setLeft((v) => {
        if (v <= 1) { clearInterval(tick.current); setPicked(-1); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(tick.current);
  }, [screen, idx, picked, timed]);

  useEffect(() => {
    if (picked === null || screen !== "exam") return;
    const q = deck[idx];
    const ok = picked === answerOf(q);
    setLog((l) => [...l, { id: q.id, theme: q.theme[lang], ok, heavy: q.heavy && !ok, picked }]);
  }, [picked]);

  function advance() {
    if (idx + 1 >= deck.length) { setScreen("result"); return; }
    setIdx(idx + 1); setPicked(null); setLeft(CONFIG[MODE].seconds);
  }

  const cfg = CONFIG[MODE];
  const heavyCount = log.filter((l) => l.heavy).length;
  const lightWrong = log.filter((l) => !l.ok && !l.heavy).length;
  const rawScore = Math.max(0, cfg.total - lightWrong - heavyCount * HEAVY_PENALTY);
  const scoreNoHeavy = Math.max(0, cfg.total - lightWrong);
  const autoFail = heavyCount >= HEAVY_FAIL_COUNT;
  const passed = !autoFail && rawScore >= cfg.passMark;

  const weak = Object.entries(
    log.filter((l) => !l.ok).reduce((acc, l) => ({ ...acc, [l.theme]: (acc[l.theme] || 0) + 1 }), {})
  ).sort((a, b) => b[1] - a[1]);

  const css = `
  .eb *{box-sizing:border-box}
  .eb{--ink:#101A24;--slate:#4A5C6E;--line:#D9E0E7;--wash:#F2F5F8;--blue:#0B5AA8;--red:#C41230;--green:#157347;--amber:#B87400;
     font-family:ui-sans-serif,system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);
     background:var(--wash);min-height:100%;padding:28px 18px 44px;line-height:1.55;-webkit-font-smoothing:antialiased}
  .eb .wrap{max-width:720px;margin:0 auto}
  .eb .bar{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-bottom:26px;flex-wrap:wrap}
  .eb .seg{display:inline-flex;border:1px solid var(--line);border-radius:7px;overflow:hidden;background:#fff}
  .eb .seg button{border:0;background:#fff;padding:7px 15px;font:inherit;font-size:13px;font-weight:600;color:var(--slate);cursor:pointer}
  .eb .seg button[data-on="1"]{background:var(--ink);color:#fff}
  .eb .seg button+button{border-left:1px solid var(--line)}
  .eb .card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:30px}
  .eb .kicker{font-size:13px;font-weight:600;color:var(--blue);letter-spacing:.02em;margin:0 0 12px}
  .eb h1{font-size:33px;line-height:1.15;letter-spacing:-.022em;font-weight:700;margin:0 0 14px}
  .eb .lead{font-size:16px;color:var(--slate);margin:0 0 26px;max-width:60ch}
  .eb .rules{border-left:3px solid var(--red);padding:2px 0 2px 17px;margin:0 0 28px}
  .eb .rules h2{font-size:14px;font-weight:700;margin:0 0 9px}
  .eb .rules ul{margin:0;padding:0;list-style:none;font-size:14.5px;color:var(--slate)}
  .eb .rules li{padding:3px 0}
  .eb .rules li b{color:var(--red);font-variant-numeric:tabular-nums}
  .eb .field{margin-bottom:22px}
  .eb .field>label{display:block;font-size:14px;font-weight:700;margin-bottom:8px}
  .eb .hint{font-size:13px;color:var(--slate);margin:9px 0 0;max-width:56ch}
  .eb .check{display:flex;gap:10px;align-items:center;font-size:14.5px;color:var(--slate);cursor:pointer;margin-bottom:26px}
  .eb .go{width:100%;border:0;background:var(--ink);color:#fff;font:inherit;font-size:16px;font-weight:600;
     padding:15px;border-radius:8px;cursor:pointer}
  .eb .go:hover{background:#000}
  .eb .note{font-size:12.5px;color:var(--slate);text-align:center;margin:13px 0 0}
  .eb .head{display:flex;justify-content:space-between;align-items:baseline;font-size:13px;color:var(--slate);margin-bottom:10px}
  .eb .head b{color:var(--ink);font-variant-numeric:tabular-nums}
  .eb .track{height:4px;background:var(--line);border-radius:2px;overflow:hidden;margin-bottom:26px}
  .eb .fill{height:100%;background:var(--blue);transition:width 1s linear}
  .eb .fill[data-low="1"]{background:var(--red)}
  .eb .tag{display:inline-block;font-size:11.5px;font-weight:700;color:var(--red);border:1px solid var(--red);
     border-radius:4px;padding:2px 7px;margin-bottom:12px}
  .eb .signbox{display:flex;justify-content:center;padding:6px 0 20px}
  .eb .stem{font-size:19px;line-height:1.45;font-weight:600;margin:0 0 22px}
  .eb .opt{display:block;width:100%;text-align:left;background:#fff;border:1.5px solid var(--line);border-radius:9px;
     padding:15px 17px;font:inherit;font-size:15.5px;margin-bottom:10px;cursor:pointer}
  .eb .opt:hover:enabled{border-color:var(--ink)}
  .eb .opt:disabled{cursor:default}
  .eb .opt[data-s="good"]{border-color:var(--green);background:#EDF7F1;font-weight:600}
  .eb .opt[data-s="bad"]{border-color:var(--red);background:#FCEDEF}
  .eb .verdict{margin-top:20px;padding:16px 18px;border-radius:9px;background:var(--wash);font-size:14.5px;color:var(--slate)}
  .eb .verdict b{display:block;margin-bottom:5px;font-size:14px}
  .eb .verdict b[data-k="ok"]{color:var(--green)} .eb .verdict b[data-k="no"]{color:var(--red)}
  .eb .score{display:flex;align-items:baseline;gap:11px;margin:0 0 6px}
  .eb .score .n{font-size:58px;font-weight:700;letter-spacing:-.03em;font-variant-numeric:tabular-nums;line-height:1}
  .eb .score .d{font-size:16px;color:var(--slate)}
  .eb .stamp{display:inline-block;font-size:14px;font-weight:700;padding:5px 13px;border-radius:5px;margin-bottom:18px}
  .eb .stamp[data-p="1"]{background:#EDF7F1;color:var(--green)} .eb .stamp[data-p="0"]{background:#FCEDEF;color:var(--red)}
  .eb .callout{border-left:3px solid var(--red);padding:3px 0 3px 16px;margin:20px 0;font-size:15px}
  .eb .callout .big{font-weight:700}
  .eb .row{display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line);font-size:15px}
  .eb .row:last-child{border-bottom:0}
  .eb .row span:last-child{color:var(--red);font-weight:600;font-variant-numeric:tabular-nums}
  .eb h3{font-size:14px;font-weight:700;margin:28px 0 4px}
  .eb .capture{margin-top:26px;background:var(--ink);border-radius:11px;padding:24px;color:#fff}
  .eb .capture h3{color:#fff;margin:0 0 6px;font-size:17px}
  .eb .capture p{font-size:14px;color:#B9C6D2;margin:0 0 15px;max-width:48ch}
  .eb .mailrow{display:flex;gap:9px;flex-wrap:wrap}
  .eb .mailrow input{flex:1 1 200px;border:0;border-radius:7px;padding:12px 14px;font:inherit;font-size:15px}
  .eb .mailrow button{border:0;border-radius:7px;padding:12px 20px;font:inherit;font-size:15px;font-weight:600;
     background:#fff;color:var(--ink);cursor:pointer}
  .eb .again{width:100%;margin-top:16px;border:1.5px solid var(--line);background:#fff;color:var(--ink);
     border-radius:8px;padding:13px;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
  .eb button:focus-visible,.eb input:focus-visible{outline:2.5px solid var(--blue);outline-offset:2px}
  @media (max-width:560px){.eb h1{font-size:26px}.eb .card{padding:22px}.eb .score .n{font-size:46px}}
  @media (prefers-reduced-motion:reduce){.eb .fill{transition:none}}
  `;

  const q = deck[idx];
  const correct = q ? answerOf(q) : null;

  return (
    <div className="eb">
      <style>{css}</style>
      <div className="wrap">
        <div className="bar">
          <div className="seg">
            {["fr", "nl"].map((l) => (
              <button key={l} data-on={lang === l ? "1" : "0"} onClick={() => setLang(l)}>
                {l === "fr" ? "Français" : "Nederlands"}
              </button>
            ))}
          </div>
          {screen !== "home" && (
            <div className="seg">
              <button data-on="1">{REGIONS.find((r) => r.code === region)[lang]}</button>
            </div>
          )}
        </div>

        {screen === "home" && (
          <div className="card">
            <p className="kicker">{t.kicker}</p>
            <h1>{t.title}</h1>
            <p className="lead">{t.lead}</p>

            <div className="rules">
              <h2>{t.ruleTitle}</h2>
              <ul>
                <li>{t.r1}</li>
                <li>{t.r2}</li>
                <li><b>{t.r3}</b></li>
                <li><b>{t.r4}</b></li>
              </ul>
            </div>

            <div className="field">
              <label>{t.regionLabel}</label>
              <div className="seg">
                {REGIONS.map((r) => (
                  <button key={r.code} data-on={region === r.code ? "1" : "0"} onClick={() => setRegion(r.code)}>
                    {r[lang]}
                  </button>
                ))}
              </div>
              <p className="hint">{t.regionHint}</p>
            </div>

            <label className="check">
              <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
              {t.timerLabel}
            </label>

            <button className="go" onClick={begin}>{t.start}</button>
            <p className="note">{t.demoNote}</p>
          </div>
        )}

        {screen === "exam" && q && (
          <div className="card">
            <div className="head">
              <span>{t.question} <b>{idx + 1}</b> {t.of} <b>{deck.length}</b></span>
              {timed && <span><b>{left}</b>s</span>}
            </div>
            <div className="track">
              <div className="fill" data-low={timed && left <= 5 ? "1" : "0"}
                   style={{ width: timed ? `${(left / cfg.seconds) * 100}%` : "100%" }} />
            </div>

            {q.heavy && <div className="tag">{t.heavy}</div>}
            {q.sign && <div className="signbox"><Sign type={q.sign} /></div>}
            <p className="stem">{q[lang].stem}</p>

            {q[lang].opts.map((o, i) => {
              let s = null;
              if (picked !== null) {
                if (i === correct) s = "good";
                else if (i === picked) s = "bad";
              }
              return (
                <button key={i} className="opt" data-s={s} disabled={picked !== null}
                        onClick={() => setPicked(i)}>
                  {o}
                </button>
              );
            })}

            {picked !== null && (
              <>
                <div className="verdict">
                  <b data-k={picked === correct ? "ok" : "no"}>
                    {picked === -1 ? t.timeout : picked === correct ? t.correct : t.wrong}
                  </b>
                  {q[lang].why}
                </div>
                <button className="go" style={{ marginTop: 16 }} onClick={advance}>
                  {idx + 1 >= deck.length ? t.seeResult : t.next}
                </button>
              </>
            )}
          </div>
        )}

        {screen === "result" && (
          <div>
            <div className="card">
              <span className="stamp" data-p={passed ? "1" : "0"}>{passed ? t.passed : t.failed}</span>
              <div className="score">
                <span className="n">{rawScore}</span>
                <span className="d">{t.scoreOf} {cfg.total} — {cfg.passMark} {t.scoreOf.length ? "" : ""}{lang === "fr" ? "requis" : "vereist"}</span>
              </div>

              {autoFail && (
                <div className="callout">
                  <span className="big">{t.heavyFailMsg}</span>
                </div>
              )}
              {heavyCount > 0 && !autoFail && (
                <div className="callout">
                  {t.withoutHeavy} <span className="big">{scoreNoHeavy}/{cfg.total}</span>.
                </div>
              )}

              {heavyCount > 0 && (
                <>
                  <h3>{t.heavyList}</h3>
                  {log.filter((l) => l.heavy).map((l, i) => (
                    <div className="row" key={i}><span>{l.theme}</span><span>−{HEAVY_PENALTY}</span></div>
                  ))}
                </>
              )}

              <h3>{t.weakTitle}</h3>
              {weak.length === 0 ? (
                <div className="row"><span>{t.noWeak}</span><span /></div>
              ) : (
                weak.map(([theme, n]) => (
                  <div className="row" key={theme}><span>{theme}</span><span>{n}</span></div>
                ))
              )}
            </div>

            <div className="capture">
              <h3>{t.emailTitle}</h3>
              <p>{t.emailLead}</p>
              {mailSent ? (
                <p style={{ margin: 0, color: "#fff" }}>{t.emailDone}</p>
              ) : (
                <div className="mailrow">
                  <input type="email" placeholder={t.emailPh} value={mail}
                         onChange={(e) => setMail(e.target.value)} />
                  <button onClick={() => setMailSent(true)}>{t.emailBtn}</button>
                </div>
              )}
            </div>

            <button className="again" onClick={() => setScreen("home")}>{t.again}</button>
          </div>
        )}
      </div>
    </div>
  );
}
