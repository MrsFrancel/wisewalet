import { useState } from "react";
import { DT, SavingsGoal } from "../types";
import { fmtAmount, pct } from "../utils/goalCalculations";

type Props = {
  goal: SavingsGoal;
  onDismiss?: () => void;
  onAction?: () => void;
};

/** Push-style notification banner for savings goal progress milestones */
export function ProgressNotificationBanner({ goal, onDismiss, onAction }: Props) {
  const [visible, setVisible] = useState(true);
  const progress = pct(goal.currentAmount, goal.targetAmount);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  const getMessage = () => {
    if (progress >= 100) return `Objectif atteint ! 🎉 Tu as économisé ${fmtAmount(goal.targetAmount)} pour « ${goal.name} ».`;
    if (progress >= 75) return `Presque là ! Tu es à ${progress}% de ton objectif « ${goal.name} ».`;
    if (progress >= 50) return `Mi-chemin ! La moitié de « ${goal.name} » est déjà épargnée.`;
    return `Continue comme ça ! ${fmtAmount(goal.currentAmount)} épargnés pour « ${goal.name} ».`;
  };

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
        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        padding: "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        transform: visible ? "translateY(0)" : "translateY(-120%)",
        opacity: visible ? 1 : 0,
        transition: "all 0.3s ease",
        border: `1px solid ${DT.border}`,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: progress >= 100 ? DT.successLight : DT.primaryLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {goal.emoji}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: DT.primary, marginBottom: 2 }}>
          WiseWallet
        </div>
        <div style={{ fontSize: 13, color: DT.text, lineHeight: 1.4 }}>
          {getMessage()}
        </div>
        {onAction && (
          <button
            onClick={onAction}
            style={{
              marginTop: 8,
              fontSize: 12,
              fontWeight: 600,
              color: DT.primary,
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            Voir l'objectif →
          </button>
        )}
      </div>

      {/* Dismiss */}
      <button
        onClick={handleDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: DT.text2,
          fontSize: 16,
          padding: 2,
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
