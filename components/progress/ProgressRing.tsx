interface Props {
  percent: number;
  label: string;
  sublabel?: string;
}

/** Anneau de progression SVG — le pourcentage vient toujours d'une vraie donnée appelante, jamais inventé ici. */
export default function ProgressRing({ percent, label, sublabel }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="progress-ring">
      <svg viewBox="0 0 120 120" width="128" height="128">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5b400" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="56" textAnchor="middle" fontSize="26" fontWeight="800" fill="#fff">
          {clamped}%
        </text>
        <text x="60" y="76" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.85)">
          {label}
        </text>
      </svg>
      {sublabel && <p className="progress-ring-sub">{sublabel}</p>}
    </div>
  );
}
