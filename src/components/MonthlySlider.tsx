import { DT } from "../types";
import { fmtAmount } from "../utils/goalCalculations";

type Props = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
};

/** Styled range slider for monthly savings amount */
export function MonthlySlider({
  value,
  min = 10,
  max = 1000,
  step = 10,
  onChange,
  label = "Mensualité",
}: Props) {
  const pct = Math.round(((value - min) / (max - min)) * 100);

  return (
    <div style={{ padding: "0 4px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 13, color: DT.text2, fontWeight: 500 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: DT.primary,
          }}
        >
          {fmtAmount(value)}
        </span>
      </div>

      <div style={{ position: "relative", height: 20, display: "flex", alignItems: "center" }}>
        {/* Track background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 6,
            borderRadius: 3,
            background: DT.border,
          }}
        />
        {/* Active track */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: `${pct}%`,
            height: 6,
            borderRadius: 3,
            background: DT.primary,
            transition: "width 0.1s ease",
          }}
        />
        {/* Invisible native range input on top */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            width: "100%",
            opacity: 0,
            cursor: "pointer",
            height: 20,
            margin: 0,
          }}
        />
        {/* Custom thumb */}
        <div
          style={{
            position: "absolute",
            left: `calc(${pct}% - 11px)`,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: DT.surface,
            border: `2.5px solid ${DT.primary}`,
            boxShadow: "0 2px 8px rgba(108,99,255,0.3)",
            pointerEvents: "none",
            transition: "left 0.1s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 11, color: DT.text2 }}>{fmtAmount(min)}</span>
        <span style={{ fontSize: 11, color: DT.text2 }}>{fmtAmount(max)}</span>
      </div>
    </div>
  );
}
