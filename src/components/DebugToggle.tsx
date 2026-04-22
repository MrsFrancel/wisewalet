type Props = {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
};

/** Reusable animated toggle switch for the debug panel */
export function DebugToggle({ checked, onChange, label }: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px 0",
      }}
    >
      <span style={{ fontSize: 12, color: "#040707", fontWeight: 500 }}>{label}</span>
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        style={{
          width: 38,
          height: 22,
          borderRadius: 11,
          border: "none",
          background: checked ? "#0404E2" : "#E8E8E8",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s ease",
          flexShrink: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 19 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#FFFFFF",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            transition: "left 0.2s ease",
          }}
        />
      </button>
    </div>
  );
}
