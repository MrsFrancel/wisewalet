Dans src/app/App.tsx, ajoute les animations suivantes. Utilise
  uniquement useState, useEffect, et CSS/Tailwind — pas de librairie
  externe.

  ---                                                                 
  ## ANIMATION 1 — Solde qui compte de 0 à la valeur (HomeScreen)     
  Crée ce hook en haut du fichier, avant les composants :

  ```tsx
  function useCountUp(target: number, duration = 1200, active = true)
  {
    const [value, setValue] = useState(0);
    useEffect(() => {
      if (!active) return;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(ease * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, [target, duration, active]);
    return value;
  }

  Dans HomeScreen, remplace :

  <div style={{ color: C.text, fontSize: 32, fontWeight: 700,
  letterSpacing: -0.5, fontFamily: "Syne, sans-serif" }}
  className="mt-2">2 847,00 €</div>

  Par :

  const balance = useCountUp(284700, 1400);
  ...
  <div style={{ color: C.text, fontSize: 32, fontWeight: 700,
  letterSpacing: -0.5, fontFamily: "Syne, sans-serif" }}
  className="mt-2">
    {(balance / 100).toLocaleString("fr-FR", { minimumFractionDigits:
  2, maximumFractionDigits: 2 })} €
  </div>

  ---
  ANIMATION 2 — Barres de progression des objectifs (GoalCard)

  Dans GoalCard, remplace :

  <div className="h-full rounded-full" style={{ width: `${pct}%`,
  background: C.primary }} />

  Par :

  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);
  ...
  <div className="h-full rounded-full" style={{ width: `${width}%`,
  background: C.primary, transition: "width 1s cubic-bezier(0.34,
  1.56, 0.64, 1)" }} />

  ---
  ANIMATION 3 — Fade + slide des écrans au montage

  Ajoute ce CSS dans src/styles/index.css :

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .screen-enter {
    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .screen-fade {
    animation: fadeIn 0.25s ease both;
  }

  Sur le div racine de chaque screen (WelcomeScreen, HomeScreen,
  TransactionsScreen, GoalsScreen, AnalysisScreen, ProfileScreen),
  ajoute la classe screen-enter :

  <div className="flex flex-col h-full screen-enter" style={{
  background: C.bg }}>

  Sur les screens qui n'ont pas de slide (GoalCreatedScreen,
  NotificationsScreen), utilise screen-fade à la place.

  ---
  ANIMATION 4 — Stagger des items de liste (TransactionsScreen)

  Dans le rendu des TxRow, ajoute un délai progressif par index.
  Remplace :

  {items.map((t) => <TxRow key={t.id} t={t} onClick={() =>
  go("txDetail")} />)}

  Par :

  {items.map((t, i) => (
    <div key={t.id} style={{ animation: `slideUp 0.35s
  cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms both` }}>
      <TxRow t={t} onClick={() => go("txDetail")} />
    </div>
  ))}

  Applique le même pattern dans HomeScreen pour les TxRow du résumé.

  ---
  ANIMATION 5 — Line chart qui se dessine (AnalysisScreen)

  Dans le SVG du line chart, sur chaque <path> de ligne
  (stroke={C.success} et stroke={C.danger}), ajoute :

  <path
    d={line(revenues)}
    fill="none"
    stroke={C.success}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="300"
    strokeDashoffset="300"
    style={{ animation: "drawLine 1.2s cubic-bezier(0.16, 1, 0.3, 1)
  0.2s forwards" }}
  />
  <path
    d={line(depenses)}
    fill="none"
    stroke={C.danger}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="300"
    strokeDashoffset="300"
    style={{ animation: "drawLine 1.2s cubic-bezier(0.16, 1, 0.3, 1)
  0.4s forwards" }}
  />

  Ajoute ce keyframe dans src/styles/index.css :

  @keyframes drawLine {
    to { stroke-dashoffset: 0; }
  }

  ---
  ANIMATION 6 — Cercle de progression (GoalDetailScreen)

  Sur le cercle SVG de progression, remplace strokeDasharray statique
  par une animation au montage :

  const [dash, setDash] = useState(0);
  const circ = 2 * Math.PI * R;
  useEffect(() => {
    const t = setTimeout(() => setDash((pct / 100) * circ), 150);
    return () => clearTimeout(t);
  }, [pct, circ]);
  ...
  <circle
    cx="64" cy="64" r={R}
    stroke={C.primary} strokeWidth="10" fill="none"
    strokeDasharray={`${dash} ${circ}`}
    strokeLinecap="round"
    transform="rotate(-90 64 64)"
    style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,
  1.56, 0.64, 1)" }}
  />

  ---
  CONTRAINTE : Ne modifie aucune logique métier. Ne change pas les
  couleurs, les données, ni la structure des composants. Applique
  uniquement les animations décrites. Si un useEffect ou useState est
  déjà présent dans un composant, ajoute les nouveaux sans supprimer
  les existants.
  ```