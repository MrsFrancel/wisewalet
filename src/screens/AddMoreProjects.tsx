import { useState } from "react";
import { DT, SavingsGoal } from "../types";
import { GOAL_TILES } from "../constants/goalTemplates";
import { fmtAmount } from "../utils/goalCalculations";

type Props = {
  existingGoals: SavingsGoal[];
  onAddGoal: (key: string) => void;
  onFinish: () => void;
};

/** Step 3 — Propose additional saving projects after first goal created */
export function AddMoreProjects({ existingGoals, onAddGoal, onFinish }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const existingKeys = new Set(existingGoals.map((g) => g.category.toLowerCase()));

  const tiles = GOAL_TILES.filter((t) => !existingKeys.has(t.key));

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleConfirm = () => {
    selected.forEach((key) => onAddGoal(key));
    onFinish();
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
      <div style={{ padding: "28px 24px 16px", flexShrink: 0 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: DT.text, marginBottom: 6 }}>
          Et si on allait plus loin ? 🚀
        </div>
        <div style={{ fontSize: 14, color: DT.text2, lineHeight: 1.5 }}>
          Voici d'autres projets populaires. Ajoute ceux qui te correspondent.
        </div>
      </div>

      {/* Tile grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 16px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            paddingBottom: 16,
          }}
        >
          {tiles.map((tile) => {
            const isSelected = selected.has(tile.key);
            return (
              <button
                key={tile.key}
                onClick={() => toggle(tile.key)}
                style={{
                  background: isSelected ? DT.primaryLight : DT.surface,
                  border: `2px solid ${isSelected ? DT.primary : DT.border}`,
                  borderRadius: DT.r.card,
                  padding: "18px 12px",
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                  transition: "all 0.15s ease",
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: DT.primary,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                )}
                <div style={{ fontSize: 30, marginBottom: 8 }}>{tile.emoji}</div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isSelected ? DT.primary : DT.text,
                    marginBottom: 4,
                  }}
                >
                  {tile.label}
                </div>
                <div style={{ fontSize: 12, color: DT.text2 }}>
                  ~{fmtAmount(tile.amount)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px 28px",
          background: DT.surface,
          boxShadow: "0 -1px 0 " + DT.border,
          flexShrink: 0,
        }}
      >
        {selected.size > 0 ? (
          <button
            onClick={handleConfirm}
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
            Ajouter {selected.size} projet{selected.size > 1 ? "s" : ""}
          </button>
        ) : null}
        <button
          onClick={onFinish}
          style={{
            width: "100%",
            padding: "13px 0",
            borderRadius: DT.r.button,
            background: "transparent",
            color: DT.text2,
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Non merci, continuer →
        </button>
      </div>
    </div>
  );
}
