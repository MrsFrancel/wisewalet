import { DT, SavingsGoal } from "../types";
import { fmtAmount, fmtMonths, pct, monthsFor } from "../utils/goalCalculations";

type Props = {
  goal: SavingsGoal;
  onPress?: () => void;
  draggable?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
};

/** V3 savings goal card with progress bar, months remaining, and drag handle */
export function GoalCardV3({ goal, onPress, draggable, dragHandleProps }: Props) {
  const progress = pct(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;
  const monthsLeft = monthsFor(goal.targetAmount, goal.currentAmount, goal.monthlyAmount);

  return (
    <div
      onClick={onPress}
      style={{
        background: DT.surface,
        borderRadius: DT.r.card,
        padding: "16px 16px 14px",
        boxShadow: DT.cardShadow,
        cursor: onPress ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${DT.border}`,
      }}
    >
      {/* Top row: emoji + name + drag handle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Drag handle */}
        {draggable && (
          <div
            {...dragHandleProps}
            style={{
              cursor: "grab",
              color: DT.text2,
              fontSize: 16,
              padding: "0 2px",
              lineHeight: 1,
              userSelect: "none",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            ⠿
          </div>
        )}

        {/* Emoji badge */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: DT.primaryLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {goal.emoji}
        </div>

        {/* Name + monthly */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: DT.text,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {goal.name}
          </div>
          <div style={{ fontSize: 12, color: DT.text2, marginTop: 1 }}>
            {fmtAmount(goal.monthlyAmount)}/mois · {fmtMonths(monthsLeft)}
          </div>
        </div>

        {/* Target amount */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: DT.text }}>
            {fmtAmount(goal.currentAmount)}
          </div>
          <div style={{ fontSize: 11, color: DT.text2 }}>
            / {fmtAmount(goal.targetAmount)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            height: 8,
            borderRadius: 4,
            background: DT.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 4,
              background:
                progress >= 100
                  ? DT.success
                  : `linear-gradient(90deg, ${DT.primary}, #9B93FF)`,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 11, color: DT.text2 }}>{progress}% atteint</span>
          {remaining > 0 && (
            <span style={{ fontSize: 11, color: DT.text2 }}>
              {fmtAmount(remaining)} restant
            </span>
          )}
          {remaining <= 0 && (
            <span style={{ fontSize: 11, color: DT.success, fontWeight: 600 }}>
              Objectif atteint 🎉
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
