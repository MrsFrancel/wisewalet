  ---
  Dans src/app/App.tsx, remplace les deux visualisations de la          fonction AnalysisScreen par des versions plus esthétiques. Voici
  exactement ce qu'il faut changer.                                   
  ---

  ## REMPLACEMENT 1 — Le graphique en camembert SVG

  Supprime tout ce bloc (le calcul des arcs + le SVG circulaire) :

  ```tsx
  let acc = 0;
  const R = 70, CX = 100, CY = 100;
  const arcs = segs.map((s) => {
    const start = (acc / 100) * 2 * Math.PI - Math.PI / 2;
    acc += s.v;
    const end = (acc / 100) * 2 * Math.PI - Math.PI / 2;
    const large = s.v > 50 ? 1 : 0;
    const x1 = CX + R * Math.cos(start), y1 = CY + R *
  Math.sin(start);
    const x2 = CX + R * Math.cos(end), y2 = CY + R * Math.sin(end);
    return { d: `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1
  ${x2} ${y2} Z`, c: s.c };
  });

  Et remplace le rendu SVG + la grille de légendes par une liste de
  barres horizontales par catégorie :

  <div className="mt-4 space-y-3">
    {segs.map((s) => (
      <div key={s.l}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{
  background: s.c }} />
            <span style={{ color: C.text, fontSize: 13, fontWeight:
  500 }}>{s.l}</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color: C.text2, fontSize: 12
  }}>{s.v}%</span>
            <span style={{ color: C.text, fontSize: 13, fontWeight:
  600 }}>{s.amt}</span>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{
  background: C.border }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${s.v * 2}%`, background: s.c }}
          />
        </div>
      </div>
    ))}
  </div>

  ---
  REMPLACEMENT 2 — Le graphique d'évolution mensuelle

  Supprime tout ce bloc de rendu :

  <div className="flex items-end justify-between h-36 gap-3">
    {evolution.map((e) => {
      const rH = hasData ? (e.r / max) * 100 : 10;
      const dH = hasData ? (e.d / max) * 100 : 10;
      return (
        <div key={e.m} className="flex-1 flex items-end justify-center
   gap-1">
          <div className="flex flex-col items-center flex-1">
            {hasData && <div style={{ color: C.success, fontSize: 9,
  fontWeight: 600 }} className="mb-1">{e.r}</div>}
            <div className="w-full rounded-t-md" style={{ height:
  `${rH}%`, background: hasData ? C.success : "#E8E8E8", minHeight: 4
  }} />
          </div>
          <div className="flex flex-col items-center flex-1">
            {hasData && <div style={{ color: C.danger, fontSize: 9,
  fontWeight: 600 }} className="mb-1">{e.d}</div>}
            <div className="w-full rounded-t-md" style={{ height:
  `${dH}%`, background: hasData ? C.danger : "#E8E8E8", minHeight: 4
  }} />
          </div>
        </div>
      );
    })}
  </div>

  Remplace par un line chart SVG avec courbes lissées, points de
  données et dégradé de remplissage :

  <div className="relative" style={{ height: 160 }}>
    <svg width="100%" height="140" viewBox="0 0 300 140"
  preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradRevenu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.success} stopOpacity="0.25"
  />
          <stop offset="100%" stopColor={C.success} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gradDepense" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.danger} stopOpacity="0.2" />
          <stop offset="100%" stopColor={C.danger} stopOpacity="0" />
        </linearGradient>
      </defs>
      {hasData && (() => {
        const W = 300, H = 120, pad = 20;
        const xs = evolution.map((_, i) => pad + (i /
  (evolution.length - 1)) * (W - pad * 2));
        const toY = (v: number) => H - pad - ((v / max) * (H - pad *
  2));
        const line = (vals: number[]) =>
          vals.map((v, i) => `${i === 0 ? "M" : "L"} ${xs[i]}
  ${toY(v)}`).join(" ");
        const area = (vals: number[]) =>
          line(vals) + ` L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H}
  Z`;
        const revenues = evolution.map(e => e.r);
        const depenses = evolution.map(e => e.d);
        return (
          <>
            <path d={area(revenues)} fill="url(#gradRevenu)" />
            <path d={area(depenses)} fill="url(#gradDepense)" />
            <path d={line(revenues)} fill="none" stroke={C.success}
  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={line(depenses)} fill="none" stroke={C.danger}
  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {revenues.map((v, i) => (
              <circle key={`r${i}`} cx={xs[i]} cy={toY(v)} r="4"
  fill={C.success} stroke={C.card} strokeWidth="2" />
            ))}
            {depenses.map((v, i) => (
              <circle key={`d${i}`} cx={xs[i]} cy={toY(v)} r="4"
  fill={C.danger} stroke={C.card} strokeWidth="2" />
            ))}
          </>
        );
      })()}
    </svg>
    <div className="flex justify-between px-5">
      {evolution.map((e) => (
        <div key={e.m} style={{ color: C.text2, fontSize: 11
  }}>{e.m}</div>
      ))}
    </div>
  </div>
  <div className="flex gap-4 mt-3">
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-0.5 rounded-full" style={{ background:
  C.success }} />
      <span style={{ color: C.text2, fontSize: 11 }}>Revenus</span>
    </div>
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-0.5 rounded-full" style={{ background:
  C.danger }} />
      <span style={{ color: C.text2, fontSize: 11 }}>Dépenses</span>
    </div>
  </div>

  ---
  NE TOUCHE PAS au reste de AnalysisScreen (header, carte
  revenus/dépenses, section "Top catégories").
  NE TOUCHE PAS aux autres fonctions du fichier.
  ```