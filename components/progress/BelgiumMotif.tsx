/**
 * Silhouette linéaire stylisée de l'Atomium — dessin original au trait,
 * pas une photo ni une image tierce (même principe que components/exam/signs.tsx).
 * Décoration d'ambiance sur la bannière du tableau de bord, opacité faible.
 */
export default function BelgiumMotif() {
  const nodes: [number, number][] = [
    [60, 20],
    [20, 55],
    [100, 55],
    [20, 105],
    [100, 105],
    [60, 140],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 5],
    [3, 4],
  ];

  return (
    <svg
      className="belgium-motif"
      viewBox="0 0 120 160"
      width="180"
      height="240"
      aria-hidden="true"
      focusable="false"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="2.5"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 10 : 8} fill="rgba(255,255,255,0.16)" />
      ))}
    </svg>
  );
}
