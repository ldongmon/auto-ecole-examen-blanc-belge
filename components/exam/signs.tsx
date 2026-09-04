// Panneaux réglementaires belges reconstitués en SVG à partir de leurs
// spécifications officielles (formes/couleurs normalisées, pas d'image
// tierce copiée — cf. CLAUDE.md §7 : "aucun visuel ne doit être repris
// d'un tiers"). Premiers visuels réels du corpus, volontairement limités
// aux panneaux (formes fixes, fiables) plutôt qu'aux scènes de conduite
// (plus complexes, à produire dans une passe ultérieure).

const RED = "#c8102e";
const BLUE = "#0033a0";
const YELLOW = "#ffd400";

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-hidden="true">
      {children}
    </svg>
  );
}

/** B1 — triangle pointe en bas, cède le passage. */
export function SignB1() {
  return (
    <Base>
      <polygon points="6,10 94,10 50,90" fill={RED} />
      <polygon points="14,20 86,20 50,76" fill="#fff" />
    </Base>
  );
}

/** B9 — route prioritaire : losange jaune bordé de blanc. */
export function SignB9() {
  return (
    <Base>
      <rect x="18" y="18" width="64" height="64" fill="#fff" transform="rotate(45 50 50)" />
      <rect x="26" y="26" width="48" height="48" fill={YELLOW} transform="rotate(45 50 50)" />
    </Base>
  );
}

/** C1 — sens interdit : disque rouge, barre blanche horizontale. */
export function SignC1() {
  return (
    <Base>
      <circle cx="50" cy="50" r="45" fill={RED} />
      <circle cx="50" cy="50" r="38" fill="#fff" />
      <rect x="18" y="43" width="64" height="14" fill={RED} />
    </Base>
  );
}

/** D1 — obligation de direction : disque bleu, flèche blanche. */
export function SignD1() {
  return (
    <Base>
      <circle cx="50" cy="50" r="45" fill={BLUE} />
      <polygon points="30,50 58,32 58,44 72,44 72,56 58,56 58,68" fill="#fff" />
    </Base>
  );
}

/** E1 — stationnement interdit : disque bleu, une barre rouge. */
export function SignE1() {
  return (
    <Base>
      <circle cx="50" cy="50" r="45" fill={BLUE} />
      <circle cx="50" cy="50" r="38" fill="#fff" />
      <circle cx="50" cy="50" r="45" fill="none" stroke={RED} strokeWidth="7" />
      <line x1="20" y1="80" x2="80" y2="20" stroke={RED} strokeWidth="9" />
    </Base>
  );
}

/** E3 — arrêt et stationnement interdits : disque bleu, deux barres rouges croisées. */
export function SignE3() {
  return (
    <Base>
      <circle cx="50" cy="50" r="45" fill={BLUE} />
      <circle cx="50" cy="50" r="38" fill="#fff" />
      <circle cx="50" cy="50" r="45" fill="none" stroke={RED} strokeWidth="7" />
      <line x1="20" y1="80" x2="80" y2="20" stroke={RED} strokeWidth="9" />
      <line x1="20" y1="20" x2="80" y2="80" stroke={RED} strokeWidth="9" />
    </Base>
  );
}

/** A23 — danger enfants : triangle pointe en haut, bord rouge, pictogramme enfants. */
export function SignA23() {
  return (
    <Base>
      <polygon points="50,8 94,88 6,88" fill={RED} />
      <polygon points="50,20 84,82 16,82" fill="#fff" />
      {/* deux silhouettes simplifiées */}
      <circle cx="38" cy="55" r="6" fill="#1a1a1a" />
      <polygon points="30,78 46,78 42,60 34,60" fill="#1a1a1a" />
      <circle cx="60" cy="50" r="7" fill="#1a1a1a" />
      <polygon points="50,78 70,78 65,58 55,58" fill="#1a1a1a" />
    </Base>
  );
}

/** F4a — entrée de zone 30 : panneau carré bleu, disque de limitation. */
export function SignF4a() {
  return (
    <Base>
      <rect x="6" y="6" width="88" height="88" rx="6" fill={BLUE} />
      <circle cx="50" cy="42" r="26" fill="#fff" />
      <circle cx="50" cy="42" r="26" fill="none" stroke={RED} strokeWidth="6" />
      <text x="50" y="52" fontSize="26" fontWeight="700" textAnchor="middle" fill="#1a1a1a">
        30
      </text>
      <text x="50" y="82" fontSize="16" fontWeight="700" textAnchor="middle" fill="#fff" letterSpacing="1">
        ZONE
      </text>
    </Base>
  );
}

/** Deux signaux d'interdiction de stationner côte à côte (q24). */
export function SignsE1E3() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={{ flex: 1 }}>
        <SignE1 />
      </div>
      <div style={{ flex: 1 }}>
        <SignE3 />
      </div>
    </div>
  );
}
