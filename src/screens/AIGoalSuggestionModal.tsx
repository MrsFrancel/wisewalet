import { DT, SavingsGoal } from "../types";
import { fmtAmount, fmtMonths, monthsFor } from "../utils/goalCalculations";

type Props = {
  goal: SavingsGoal;
  onAccept: () => void;
  onModify: () => void;
  onDismiss: () => void;
};

/** Step 1B — AI pre-filled goal proposal modal (bottom sheet style) */
export function AIGoalSuggestionModal({ goal, onAccept, onModify, onDismiss }: Props) {
  const monthsLeft = monthsFor(goal.targetAmount, goal.currentAmount, goal.monthlyAmount);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(26,26,46,0.55)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        zIndex: 50,
      }}
      onClick={onDismiss}
    >
      {/* Sheet */}
      <div
        style={{
          background: DT.bg,
          borderRadius: "24px 24px 0 0",
          padding: "24px 20px 32px",
          maxHeight: "85%",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: DT.border,
            margin: "0 auto 20px",
          }}
        />

        {/* AI header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: DT.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            ✨
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: DT.text }}>
              Mon plan personnalisé
            </div>
            <div style={{ fontSize: 12, color: DT.text2 }}>
              Basé sur ton profil
            </div>
          </div>
        </div>

        {/* Goal card preview */}
        <div
          style={{
            background: DT.surface,
            borderRadius: DT.r.card,
            padding: 20,
            marginBottom: 16,
            boxShadow: DT.cardShadow,
          }}
        >
          {/* Emoji + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: DT.primaryLight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
              }}
            >
              {goal.emoji}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: DT.text }}>{goal.name}</div>
              <div style={{ fontSize: 13, color: DT.text2 }}>{goal.category}</div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <StatBox label="Objectif" value={fmtAmount(goal.targetAmount)} />
            <StatBox label="Mensualité" value={fmtAmount(goal.monthlyAmount)} highlight />
            <StatBox label="Durée" value={fmtMonths(monthsLeft)} />
            <StatBox label="Date cible" value={formatDate(goal.targetDate)} />
          </div>
        </div>

        {/* AI message */}
        <div
          style={{
            background: DT.primaryLight,
            borderRadius: 16,
            padding: "12px 16px",
            marginBottom: 20,
            borderLeft: `3px solid ${DT.primary}`,
          }}
        >
          <p style={{ fontSize: 13, color: DT.text, lineHeight: 1.6, margin: 0 }}>
            J'ai préparé ce plan en fonction de tes revenus et de ton objectif.
            Tu peux l'affiner en répondant à quelques questions, ou l'accepter tel quel.
          </p>
        </div>

        {/* Actions */}
        <button
          onClick={onAccept}
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
            marginBottom: 10,
          }}
        >
          Parfait, j'accepte !
        </button>

        <button
          onClick={onModify}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: DT.r.button,
            background: "transparent",
            color: DT.primary,
            fontSize: 15,
            fontWeight: 600,
            border: `1.5px solid ${DT.primary}`,
            cursor: "pointer",
          }}
        >
          Affiner avec l'IA ✨
        </button>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        background: highlight ? DT.primaryLight : DT.bg,
        borderRadius: 12,
        padding: "10px 12px",
      }}
    >
      <div style={{ fontSize: 11, color: DT.text2, marginBottom: 3 }}>{label}</div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: highlight ? DT.primary : DT.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}
