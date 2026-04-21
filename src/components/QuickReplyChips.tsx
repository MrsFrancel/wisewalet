import { DT } from "../types";

type Chip = { label: string; value: string };

type Props = {
  chips: Chip[];
  onSelect: (value: string) => void;
  disabled?: boolean;
};

/** Horizontally-scrollable quick reply pill buttons for the AI chat interface */
export function QuickReplyChips({ chips, onSelect, disabled }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        padding: "8px 16px 12px",
      }}
    >
      {chips.map((chip) => (
        <button
          key={chip.value}
          onClick={() => !disabled && onSelect(chip.value)}
          disabled={disabled}
          style={{
            padding: "8px 16px",
            borderRadius: DT.r.pill,
            border: `1.5px solid ${DT.primary}`,
            background: disabled ? DT.border : DT.primaryLight,
            color: disabled ? DT.text2 : DT.primary,
            fontSize: 14,
            fontWeight: 600,
            cursor: disabled ? "default" : "pointer",
            transition: "all 0.15s ease",
            whiteSpace: "nowrap",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
