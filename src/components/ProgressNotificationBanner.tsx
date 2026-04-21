import { useState } from "react";
import { DT, SavingsGoal } from "../types";
import { fmtAmount, pct, fmtMonths, monthsFor } from "../utils/goalCalculations";

type Props = {
  goal: SavingsGoal;
  /** How much was saved this month (demo value) */
  monthlySaved: number;
  onDismiss?: () => void;
  onAction?: () => void;
  /** Called when user taps "Augmenter mon effort" */
  onAdjust?: () => void;
};

/**
 * Push-style notification banner matching Notion spec messages:
 * "Ce mois-ci tu as épargné 300€. Ta voiture est à 43% — encore 4 mois ! 🚗"
 * "Plus que 2 mois pour ton voyage. Tu veux augmenter ton effort ce mois-ci ?"
 */
export function ProgressNotificationBanner({ goal, monthlySaved, onDismiss, onAction, onAdjust }: Props) {
  const [visible, setVisible] = useState(true);
  const progress = pct(goal.currentAmount, goal.targetAmount);
  const monthsLeft = monthsFor(goal.targetAmount, goal.currentAmount, goal.monthlyAmount);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  // Build the message & CTA label to match spec format exactly
  const { message, ctaLabel } = buildContent(goal, progress, monthsLeft, monthlySaved);

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 100,
        background: DT.surface,
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        padding: "14px 14px 12px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        transform: visible ? "translateY(0)" : "translateY(-130%)",
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        border: `1px solid ${DT.border}`,
      }}
    >
      {/* App icon */}
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: progress >= 100 ? DT.successLight : DT.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {goal.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* App label + timestamp */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: DT.primary }}>WiseWallet</span>
          <span style={{ fontSize: 11, color: DT.text2 }}>maintenant</span>
        </div>

        {/* Main message */}
        <div style={{ fontSize: 13, color: DT.text, lineHeight: 1.45, marginBottom: 8 }}>
          {message}
        </div>

        {/* Action row */}
        <div style={{ display: "flex", gap: 8 }}>
          {onAdjust && ctaLabel && (
            <button
              onClick={() => { onAdjust(); handleDismiss(); }}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                background: DT.primary,
                border: "none",
                borderRadius: 8,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              {ctaLabel}
            </button>
          )}
          {onAction && (
            <button
              onClick={() => { onAction(); handleDismiss(); }}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: DT.primary,
                background: DT.primaryLight,
                border: "none",
                borderRadius: 8,
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Voir l'objectif
            </button>
          )}
        </div>
      </div>

      {/* Dismiss × */}
      <button
        onClick={handleDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: DT.text2,
          fontSize: 18,
          padding: "0 2px",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

// ── Message factory — matches Notion spec wording exactly ─────────────────
function buildContent(
  goal: SavingsGoal,
  progress: number,
  monthsLeft: number,
  monthlySaved: number,
): { message: string; ctaLabel: string | null } {
  const name = goal.name;
  const emoji = goal.emoji;

  // 100% reached
  if (progress >= 100) {
    return {
      message: `Objectif atteint ! 🎉 Tu as économisé ${fmtAmount(goal.targetAmount)} pour « ${name} ». Bravo !`,
      ctaLabel: null,
    };
  }

  // Very close — "Plus que N mois" + invite to increase effort
  if (monthsLeft <= 3) {
    return {
      message: `Plus que ${fmtMonths(monthsLeft)} pour ${name} ${emoji}. Tu veux augmenter ton effort ce mois-ci ?`,
      ctaLabel: "Augmenter mon effort",
    };
  }

  // Standard monthly progress report
  const savedStr = fmtAmount(monthlySaved);
  const monthsStr = fmtMonths(monthsLeft);
  return {
    message: `Ce mois-ci tu as épargné ${savedStr}. ${name} est à ${progress}% — encore ${monthsStr} ! ${emoji}`,
    ctaLabel: null,
  };
}
