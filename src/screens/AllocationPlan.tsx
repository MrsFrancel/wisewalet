import { useState } from "react";
import { DT, SavingsGoal } from "../types";
import { DraggableGoalList } from "../components/DraggableGoalList";
import { allocateBudget, fmtAmount, fmtMonths, monthsFor } from "../utils/goalCalculations";
import { MonthlySlider } from "../components/MonthlySlider";

type Props = {
  goals: SavingsGoal[];
  totalMonthly: number;
  onConfirm: (goals: SavingsGoal[], totalMonthly: number) => void;
  onBack: () => void;
};

/** cluster_3 Step 3 — Drag-to-reorder allocation plan screen */
export function AllocationPlan({ goals: initialGoals, totalMonthly: initialMonthly, onConfirm, onBack }: Props) {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialGoals);
  const [totalMonthly, setTotalMonthly] = useState(initialMonthly);

  const allocated = allocateBudget(goals, totalMonthly);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const totalCurrent = goals.reduce((s, g) => s + g.currentAmount, 0);

  const handleReorder = (reordered: SavingsGoal[]) => {
    setGoals(reordered);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: DT.bg,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: DT.surface,
          padding: "16px 20px",
          boxShadow: "0 1px 0 " + DT.border,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: DT.text,
              padding: 0,
            }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: DT.text }}>
              Mon plan d'allocation
            </div>
            <div style={{ fontSize: 12, color: DT.text2 }}>
              Glisse pour réorganiser les priorités
            </div>
          </div>
        </div>

        {/* Budget slider */}
        <MonthlySlider
          value={totalMonthly}
          min={50}
          max={2000}
          step={25}
          onChange={setTotalMonthly}
          label="Budget mensuel total"
        />
      </div>

      {/* Summary bar */}
      <div
        style={{
          background: DT.primaryLight,
          padding: "10px 20px",
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 12, color: DT.primary, fontWeight: 600 }}>
          {goals.length} projet{goals.length > 1 ? "s" : ""}
        </div>
        <div style={{ fontSize: 12, color: DT.primary, fontWeight: 600 }}>
          {fmtAmount(totalCurrent)} / {fmtAmount(totalTarget)}
        </div>
        <div style={{ fontSize: 12, color: DT.primary, fontWeight: 600 }}>
          {fmtAmount(totalMonthly)}/mois
        </div>
      </div>

      {/* Drag-to-reorder list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0" }}>
        <DraggableGoalList
          goals={allocated}
          onReorder={handleReorder}
        />

        {/* Allocation breakdown */}
        <div
          style={{
            background: DT.surface,
            borderRadius: DT.r.card,
            padding: 16,
            marginTop: 16,
            marginBottom: 16,
            boxShadow: DT.cardShadow,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: DT.text, marginBottom: 12 }}>
            Répartition mensuelle
          </div>
          {allocated.map((goal) => {
            const sharePct = totalMonthly > 0 ? Math.round((goal.monthlyAmount / totalMonthly) * 100) : 0;
            const ml = monthsFor(goal.targetAmount, goal.currentAmount, goal.monthlyAmount);
            return (
              <div key={goal.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <div style={{ fontSize: 13, color: DT.text, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{goal.emoji}</span>
                    <span style={{ fontWeight: 600 }}>{goal.name}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: DT.primary }}>
                      {fmtAmount(goal.monthlyAmount)}
                    </span>
                    <span style={{ fontSize: 11, color: DT.text2, marginLeft: 4 }}>
                      ({sharePct}%)
                    </span>
                  </div>
                </div>
                <div style={{ height: 4, background: DT.border, borderRadius: 2, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${sharePct}%`,
                      background: DT.primary,
                      borderRadius: 2,
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: DT.text2, marginTop: 2 }}>
                  Atteint en {fmtMonths(ml)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          padding: "16px 20px 28px",
          background: DT.surface,
          boxShadow: "0 -1px 0 " + DT.border,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => onConfirm(allocated, totalMonthly)}
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
          Valider ce plan ✓
        </button>
      </div>
    </div>
  );
}
