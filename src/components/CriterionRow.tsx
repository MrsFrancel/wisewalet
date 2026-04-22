import { useState, useRef } from "react";
import { Check, ChevronRight } from "lucide-react";

export type CriterionStatus = "pending" | "ok" | "ko";

type Props = {
  id: string;
  label: string;
  testPath?: string;
  status: CriterionStatus;
  onStatusChange: (id: string, status: CriterionStatus) => void;
};

const STATUS_CYCLE: CriterionStatus[] = ["pending", "ok", "ko"];

const STATUS_LABELS: Record<CriterionStatus, string> = {
  pending: "À tester",
  ok: "OK",
  ko: "KO",
};

// App design tokens
const BLU  = "#0404E2";
const SUCC = "#00B14F";
const DNGR = "#EF4444";
const DARK = "#040707";

const STATUS_STYLES: Record<CriterionStatus, { bg: string; color: string }> = {
  pending: { bg: "#E8E8E8",                     color: "#7A7A7A" },
  ok:      { bg: SUCC,                          color: "#FFFFFF" },
  ko:      { bg: DNGR,                          color: "#FFFFFF" },
};

export function CriterionRow({ id, label, testPath, status, onStatusChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cycleStatus = () => {
    const idx = STATUS_CYCLE.indexOf(status);
    onStatusChange(id, STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStatusChange(id, status === "ok" ? "pending" : "ok");
  };

  const handlePillClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cycleStatus();
  };

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => { cycleStatus(); }, 600);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const { bg, color } = STATUS_STYLES[status];
  const isOk = status === "ok";

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ marginBottom: 6, userSelect: "none" }}
    >
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>

        {/* Checkbox — 20px, square with rounded corners */}
        <button
          onClick={handleCheckboxClick}
          style={{
            flexShrink: 0,
            marginTop: 1,
            width: 20,
            height: 20,
            borderRadius: 5,
            border: isOk ? "none" : `1.5px solid #BEBEBE`,
            background: isOk ? BLU : "#FFFFFF",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s, border-color 0.15s",
            padding: 0,
          }}
          aria-label={isOk ? "Décocher" : "Cocher"}
        >
          {isOk && <Check size={11} color="#FFFFFF" strokeWidth={2.5} />}
        </button>

        {/* Label */}
        <span style={{
          flex: 1,
          fontSize: 11,
          color: isOk ? "#BEBEBE" : DARK,
          textDecoration: isOk ? "line-through" : "none",
          lineHeight: 1.45,
        }}>
          {label}
        </span>

        {/* Status pill */}
        <button
          onClick={handlePillClick}
          style={{
            flexShrink: 0,
            padding: "2px 7px",
            borderRadius: 100,
            background: bg,
            color,
            fontSize: 9,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            transition: "background 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {STATUS_LABELS[status]}
        </button>

        {/* Expand toggle — ChevronRight icon */}
        {testPath && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            style={{
              flexShrink: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 0 0",
              display: "inline-flex",
              alignItems: "center",
              transition: "transform 0.2s",
              transform: expanded ? "rotate(90deg)" : "none",
            }}
            aria-label="Comment tester"
          >
            <ChevronRight size={13} color="#BEBEBE" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Collapsible test path */}
      {expanded && testPath && (
        <div style={{
          marginTop: 6,
          marginLeft: 28,
          background: "#F5F5F5",
          borderLeft: `2px solid ${BLU}`,
          borderRadius: "0 6px 6px 0",
          padding: "6px 10px",
          fontSize: 10,
          color: "#7A7A7A",
          lineHeight: 1.55,
        }}>
          <span style={{ fontWeight: 700, color: BLU }}>Comment tester : </span>
          {testPath}
        </div>
      )}
    </div>
  );
}
