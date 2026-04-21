import { DT, SavingsGoal } from "../types";
import { fmtAmount, fmtMonths, pct, monthsFor } from "../utils/goalCalculations";
import { MonthlySlider } from "../components/MonthlySlider";
import { useState } from "react";

type Props = {
  goal: SavingsGoal;
  onBack: () => void;
  onRefineAI: () => void;
  onMonthlyChange: (newMonthly: number) => void;
};

/** V3 savings goal detail screen — with AI refine button always accessible */
export function V3GoalDetail({ goal, onBack, onRefineAI, onMonthlyChange }: Props) {
  const [monthly, setMonthly] = useState(goal.monthlyAmount);
  const progress = pct(goal.currentAmount, goal.targetAmount);
  const monthsLeft = monthsFor(goal.targetAmount, goal.currentAmount, monthly);
  const R = 54;
  const circ = 2 * Math.PI * R;
  const dash = (progress / 100) * circ;

  const handleMonthlyChange = (val: number) => {
    setMonthly(val);
    onMonthlyChange(val);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: DT.bg }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: DT.surface, boxShadow: "0 1px 0 " + DT.border, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: DT.text, padding: 0 }}>←</button>
        <div style={{ fontSize: 22, }}>{goal.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: DT.text }}>{goal.name}</div>
          <div style={{ fontSize: 12, color: DT.text2 }}>{goal.category}</div>
        </div>
        {/* AI refine — toujours accessible */}
        <button
          onClick={onRefineAI}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 13px",
            borderRadius: DT.r.pill,
            background: DT.primaryLight,
            border: `1.5px solid ${DT.primary}`,
            color: DT.primary,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ✨ Affiner avec l'IA
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Progress circle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "28px 0 16px" }}>
          <div style={{ position: "relative", width: 128, height: 128 }}>
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r={R} stroke={DT.border} strokeWidth="10" fill="none" />
              <circle
                cx="64" cy="64" r={R}
                stroke={progress >= 100 ? DT.success : DT.primary}
                strokeWidth="10" fill="none"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 64 64)"
                style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: DT.text }}>{progress}%</div>
              <div style={{ fontSize: 11, color: DT.text2 }}>atteint</div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px 16px" }}>
          {[
            { label: "Épargné", value: fmtAmount(goal.currentAmount) },
            { label: "Objectif", value: fmtAmount(goal.targetAmount) },
            { label: "Restant", value: fmtAmount(Math.max(0, goal.targetAmount - goal.currentAmount)) },
            { label: "Durée restante", value: fmtMonths(monthsLeft) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: DT.surface, borderRadius: 14, padding: "12px 14px", boxShadow: DT.cardShadow }}>
              <div style={{ fontSize: 11, color: DT.text2, marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: DT.text }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Monthly slider — modifiable at any time */}
        <div style={{ background: DT.surface, margin: "0 16px 16px", borderRadius: DT.r.card, padding: 16, boxShadow: DT.cardShadow }}>
          <MonthlySlider
            value={monthly}
            min={10}
            max={Math.max(500, goal.monthlyAmount * 3)}
            step={10}
            onChange={handleMonthlyChange}
            label="Mensualité"
          />
          <div style={{ fontSize: 12, color: DT.text2, textAlign: "center", marginTop: 8 }}>
            À ce rythme : objectif dans <strong style={{ color: DT.primary }}>{fmtMonths(monthsLeft)}</strong>
          </div>
        </div>

        {/* AI agent card — persistent invitation */}
        <div
          style={{
            margin: "0 16px 16px",
            background: `linear-gradient(135deg, ${DT.primary}15, ${DT.primary}08)`,
            border: `1.5px solid ${DT.primary}30`,
            borderRadius: DT.r.card,
            padding: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: DT.primary, marginBottom: 4 }}>
            ✨ Agent IA disponible
          </div>
          <div style={{ fontSize: 13, color: DT.text, lineHeight: 1.5, marginBottom: 12 }}>
            Changer la destination, réviser le budget, repousser la date… L'IA repose une question à la fois et met à jour ton objectif en temps réel.
          </div>
          <button
            onClick={onRefineAI}
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: DT.r.button,
              background: DT.primary,
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Affiner cet objectif avec l'IA ✨
          </button>
        </div>

        {/* Payment history placeholder */}
        <div style={{ margin: "0 16px 32px", background: DT.surface, borderRadius: DT.r.card, padding: 16, boxShadow: DT.cardShadow }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: DT.text, marginBottom: 10 }}>Historique des versements</div>
          <div style={{ textAlign: "center", padding: "16px 0", color: DT.text2, fontSize: 13 }}>
            Aucun versement pour l'instant
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ padding: "12px 16px 28px", background: DT.surface, boxShadow: "0 -1px 0 " + DT.border, flexShrink: 0 }}>
        <button
          style={{
            width: "100%",
            padding: "15px 0",
            borderRadius: DT.r.button,
            background: DT.primary,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          Ajouter un versement
        </button>
      </div>
    </div>
  );
}
