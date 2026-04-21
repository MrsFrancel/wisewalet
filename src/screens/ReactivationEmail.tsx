import { DT, SavingsGoal } from "../types";
import { fmtAmount, monthsFor } from "../utils/goalCalculations";
import { matchTemplate } from "../constants/goalTemplates";

type Props = {
  goals: SavingsGoal[];
  declaredGoal: string;
  userName?: string;
  suggestedMonthly?: number;
  onCTA: () => void;
  onDismiss: () => void;
};

/** cluster_3 Step 1 — Simulated reactivation email, personalised with declaredGoal */
export function ReactivationEmail({
  goals,
  declaredGoal,
  userName = "toi",
  suggestedMonthly = 150,
  onCTA,
  onDismiss,
}: Props) {
  // Resolve template to get target amount & label
  const tpl = matchTemplate(declaredGoal);
  const targetAmount = tpl.amounts["medium"];
  const monthsNeeded = suggestedMonthly > 0 ? Math.ceil(targetAmount / suggestedMonthly) : 12;

  // Human-readable goal label from template or raw string
  const goalLabel = tpl.name !== "Mon objectif"
    ? tpl.name.replace("Mon ", "").replace("Ma ", "").toLowerCase()
    : declaredGoal;

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
      {/* Email chrome */}
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
          {tpl.emoji} {userName}, ton {goalLabel} t'attend toujours…
        </div>
        <div style={{ fontSize: 11, color: DT.text2, marginTop: 2 }}>
          Aujourd'hui, 09:42
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "0 16px 24px" }}>
        {/* Hero gradient */}
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
          <div style={{ fontSize: 40, marginBottom: 10 }}>{tpl.emoji}</div>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>
            Tu voulais {goalLabel}.
          </div>
          {/* KEY sentence from Notion spec */}
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              padding: "12px 16px",
            }}
          >
            Sais-tu qu'en épargnant{" "}
            <strong>{fmtAmount(suggestedMonthly)}/mois</strong>, tu y arrives en{" "}
            <strong>{monthsNeeded} mois</strong> ?
            <br />
            On t'a préparé un plan.
          </div>
        </div>

        {/* Existing goals recap — only if goals exist */}
        {goals.length > 0 && (
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
              Tes projets en cours
            </div>
            {goals.slice(0, 3).map((goal) => {
              const ml = monthsFor(goal.targetAmount, goal.currentAmount, goal.monthlyAmount);
              return (
                <div key={goal.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{goal.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: DT.text }}>{goal.name}</div>
                      <div style={{ fontSize: 11, color: DT.text2 }}>encore {ml} mois</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: DT.primary }}>
                    {fmtAmount(goal.monthlyAmount)}/mois
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Highlight card matching Notion spec message style */}
        <div
          style={{
            background: DT.surface,
            borderRadius: DT.r.card,
            padding: 20,
            marginBottom: 20,
            boxShadow: DT.cardShadow,
            borderLeft: `4px solid ${DT.primary}`,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: DT.text, marginBottom: 8 }}>
            📊 Ton plan en un coup d'œil
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, color: DT.text2 }}>Objectif</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: DT.text }}>{fmtAmount(targetAmount)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: DT.text2 }}>Effort mensuel</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: DT.primary }}>{fmtAmount(suggestedMonthly)}/mois</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: DT.text2 }}>Durée</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: DT.text }}>{monthsNeeded} mois</div>
            </div>
          </div>
          <div style={{ height: 6, background: DT.border, borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "0%", background: DT.primary, borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 11, color: DT.text2, marginTop: 4 }}>Départ : maintenant 🚀</div>
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
