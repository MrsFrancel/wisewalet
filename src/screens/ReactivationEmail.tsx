import { DT, SavingsGoal } from "../types";
import { fmtAmount, pct, fmtMonths, monthsFor } from "../utils/goalCalculations";

type Props = {
  goals: SavingsGoal[];
  userName?: string;
  onCTA: () => void;
  onDismiss: () => void;
};

/** cluster_3 Step 1 — Simulated reactivation email screen */
export function ReactivationEmail({ goals, userName = "toi", onCTA, onDismiss }: Props) {
  const topGoal = goals[0];
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const globalPct = pct(totalSaved, totalTarget);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#F0F0F5",
        overflowY: "auto",
      }}
    >
      {/* Email chrome bar */}
      <div
        style={{
          background: DT.surface,
          padding: "14px 16px",
          borderBottom: `1px solid ${DT.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: 11, color: DT.text2, marginBottom: 2 }}>
          De : WiseWallet &lt;hello@wisewallet.app&gt;
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: DT.text }}>
          💸 {userName}, tes économies t'attendent…
        </div>
        <div style={{ fontSize: 11, color: DT.text2, marginTop: 2 }}>
          Aujourd'hui, 09:42
        </div>
      </div>

      {/* Email body */}
      <div style={{ flex: 1, padding: "0 16px 24px" }}>
        {/* Hero */}
        <div
          style={{
            background: `linear-gradient(135deg, ${DT.primary}, #9B93FF)`,
            borderRadius: "0 0 24px 24px",
            padding: "28px 24px",
            marginBottom: 20,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            On te cherchait !
          </div>
          <div style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
            Ça fait un moment qu'on ne t'a pas vu.
            Tes projets d'épargne ont besoin de toi.
          </div>
        </div>

        {/* Progress summary */}
        {topGoal && (
          <div
            style={{
              background: DT.surface,
              borderRadius: DT.r.card,
              padding: 20,
              marginBottom: 16,
              boxShadow: DT.cardShadow,
            }}
          >
            <div style={{ fontSize: 13, color: DT.text2, marginBottom: 12 }}>
              Voici où en sont tes projets
            </div>

            {goals.slice(0, 3).map((goal) => {
              const p = pct(goal.currentAmount, goal.targetAmount);
              const ml = monthsFor(goal.targetAmount, goal.currentAmount, goal.monthlyAmount);
              return (
                <div key={goal.id} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: DT.text }}>
                      {goal.emoji} {goal.name}
                    </span>
                    <span style={{ fontSize: 13, color: DT.text2 }}>
                      {fmtAmount(goal.currentAmount)} / {fmtAmount(goal.targetAmount)}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: DT.border,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${p}%`,
                        background: DT.primary,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <div
                    style={{ fontSize: 11, color: DT.text2, marginTop: 3 }}
                  >
                    {p}% · encore {fmtMonths(ml)}
                  </div>
                </div>
              );
            })}

            <div
              style={{
                marginTop: 8,
                padding: "10px 14px",
                background: DT.primaryLight,
                borderRadius: 10,
                fontSize: 13,
                color: DT.primary,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              Total épargné : {fmtAmount(totalSaved)} sur {fmtAmount(totalTarget)} ({globalPct}%)
            </div>
          </div>
        )}

        {/* Motivational block */}
        <div
          style={{
            background: DT.surface,
            borderRadius: DT.r.card,
            padding: 20,
            marginBottom: 20,
            boxShadow: DT.cardShadow,
          }}
        >
          <div style={{ fontSize: 20, marginBottom: 8 }}>🎯</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DT.text, marginBottom: 6 }}>
            Ne laisse pas tes projets s'endormir
          </div>
          <div style={{ fontSize: 13, color: DT.text2, lineHeight: 1.6 }}>
            Chaque mois sans épargne, c'est du temps perdu.
            Reprends là où tu t'es arrêté — on t'aide à te remettre sur les rails.
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onCTA}
          style={{
            width: "100%",
            padding: "16px 0",
            borderRadius: DT.r.button,
            background: DT.primary,
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          Je reprends mes projets 💪
        </button>

        <button
          onClick={onDismiss}
          style={{
            width: "100%",
            padding: "12px 0",
            background: "none",
            border: "none",
            color: DT.text2,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Se désabonner
        </button>
      </div>
    </div>
  );
}
