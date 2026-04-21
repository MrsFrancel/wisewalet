import { useState } from "react";
import { DebugToggle } from "./DebugToggle";
import { DebugToast } from "./DebugToast";
import type { DebugState, DebugActions } from "../layouts/DebugLayout";

// ── Design tokens ─────────────────────────────────────────────────────────
const PINK    = "#FF4D6D";
const PRIMARY = "#6C63FF";
const SUCCESS = "#00C896";
const DIVIDER = "#FFE8EC";
const DARK    = "#1A1A2E";

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 36,
  borderRadius: 9,
  border: "1px solid #E8E8F0",
  padding: "0 10px",
  fontSize: 12,
  color: DARK,
  background: "#FFFFFF",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236B6B8A'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  paddingRight: 26,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 9,
      fontWeight: 800,
      color: PINK,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: DIVIDER, margin: "14px 0" }} />;
}

function ActionBtn({
  label, color = PRIMARY, outline = false,
  onClick,
}: {
  label: string;
  color?: string;
  outline?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        height: 38,
        borderRadius: 10,
        border: outline ? `1.5px solid ${color}` : "none",
        background: outline ? "transparent" : color,
        color: outline ? color : "#FFFFFF",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 6,
        textAlign: "left",
        paddingLeft: 12,
      }}
    >
      {label}
    </button>
  );
}

type Props = {
  state: DebugState;
  actions: DebugActions;
  onClose?: () => void;
};

export function DebugPanel({ state, actions, onClose }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
  };

  // ── Simulation helpers ───────────────────────────────────────────────────
  const simCluster2 = () => {
    actions.simulateCluster2J2();
    showToast("✅ cluster_2 J+2 simulé");
  };

  const simCluster3 = () => {
    actions.simulateCluster3J14();
    showToast("✅ cluster_3 J+14 simulé");
  };

  const simNotif = () => {
    actions.triggerProgressNotif("A");
    showToast("🔔 Notification déclenchée");
  };

  const sim90 = () => {
    actions.setGoalProgress(90);
    showToast("📊 Objectif à 90% simulé");
  };

  const sim100 = () => {
    actions.setGoalProgress(100);
    showToast("🎉 Objectif atteint simulé");
  };

  const resetFeature = () => {
    actions.resetFeature();
    showToast("🔄 Feature réinitialisée");
  };

  const resetAll = () => {
    actions.resetAll();
    showToast("⚠️ État complet réinitialisé");
  };

  // ── State preview ────────────────────────────────────────────────────────
  const stateRows: [string, unknown][] = [
    ["cluster",                   state.cluster],
    ["declaredGoal",              state.declaredGoal],
    ["incomeBracket",             state.incomeBracket],
    ["userAge",                   state.userAge],
    ["savingsGoalCreated",        state.savingsGoalCreated],
    ["firstTxCategorized",        state.firstTransactionCategorized],
    ["dismissedCount",            state.dismissedSuggestionCount],
    ["firstTransactionDate",      state.firstTransactionDate ?? "null"],
    ["lastActiveDate",            state.lastActiveDate ?? "null"],
    ["savingsGoals.length",       state.savingsGoals.length],
    ["totalMonthlyBudget",        state.totalMonthlyBudget],
  ];

  const valueColor = (v: unknown) => {
    if (v === true)  return SUCCESS;
    if (v === false) return PINK;
    return "#F0F0FF";
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        paddingBottom: 14,
        marginBottom: 20,
        borderBottom: `1px solid ${DIVIDER}`,
      }}>
        <span style={{ fontSize: 16 }}>🛠</span>
        <span style={{ fontSize: 14, fontWeight: 800, color: PINK, flex: 1 }}>Debug Panel</span>
        <span style={{
          fontSize: 9, fontWeight: 800, color: "#fff",
          background: PINK, padding: "2px 7px", borderRadius: 100,
        }}>
          DEV ONLY
        </span>
        {onClose && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#6B6B8A", lineHeight: 1, padding: "0 0 0 6px" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Section 1 : Profil utilisateur ── */}
      <SectionTitle>① Profil utilisateur</SectionTitle>

      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: "#6B6B8A", display: "block", marginBottom: 4 }}>Cluster actif</label>
        <select
          value={state.cluster}
          onChange={(e) => actions.setCluster(e.target.value as "cluster_2" | "cluster_3")}
          style={selectStyle}
        >
          <option value="cluster_2">cluster_2 — Épargnants Passifs</option>
          <option value="cluster_3">cluster_3 — Inactifs</option>
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ fontSize: 11, color: "#6B6B8A", display: "block", marginBottom: 4 }}>Declared Goal</label>
        <select
          value={state.declaredGoal}
          onChange={(e) => actions.setDeclaredGoal(e.target.value)}
          style={selectStyle}
        >
          {["voyage", "voiture", "immobilier", "urgence", "formation"].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 4 }}>
        <div>
          <label style={{ fontSize: 11, color: "#6B6B8A", display: "block", marginBottom: 4 }}>Income Bracket</label>
          <select
            value={state.incomeBracket}
            onChange={(e) => actions.setIncomeBracket(e.target.value as "low" | "medium" | "high")}
            style={selectStyle}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: "#6B6B8A", display: "block", marginBottom: 4 }}>Âge</label>
          <input
            type="number"
            min={18}
            max={99}
            value={state.userAge}
            onChange={(e) => actions.setUserAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      <Divider />

      {/* ── Section 2 : État de la feature ── */}
      <SectionTitle>② État de la feature</SectionTitle>

      <DebugToggle
        label="savingsGoalCreated"
        checked={state.savingsGoalCreated}
        onChange={actions.setSavingsGoalCreated}
      />
      <DebugToggle
        label="firstTransactionCategorized"
        checked={state.firstTransactionCategorized}
        onChange={actions.setFirstTransactionCategorized}
      />

      <div style={{ marginTop: 8 }}>
        <label style={{ fontSize: 11, color: "#6B6B8A", display: "block", marginBottom: 4 }}>dismissedSuggestionCount</label>
        <input
          type="number"
          min={0}
          max={10}
          value={state.dismissedSuggestionCount}
          onChange={(e) => actions.setDismissedCount(Number(e.target.value))}
          style={inputStyle}
        />
      </div>

      <Divider />

      {/* ── Section 3 : Simulation temporelle ── */}
      <SectionTitle>③ Simulation temporelle</SectionTitle>

      <ActionBtn label="⚡ Simuler cluster_2 J+2"    color={PRIMARY}  onClick={simCluster2} />
      <ActionBtn label="⚡ Simuler cluster_3 J+14"   color={PRIMARY}  onClick={simCluster3} />
      <ActionBtn label="🔔 Notif progression"         color={SUCCESS}  onClick={simNotif} />
      <ActionBtn label="📊 Objectif à 90%"            color={SUCCESS}  onClick={sim90} />
      <ActionBtn label="🎉 Objectif atteint"          color={SUCCESS}  onClick={sim100} />

      <Divider />

      {/* ── Section 4 : Reset ── */}
      <SectionTitle>④ Reset</SectionTitle>

      <ActionBtn label="🔄 Reset feature"   color={PINK} outline onClick={resetFeature} />
      <ActionBtn label="⚠️ Reset complet"   color={PINK}         onClick={resetAll} />

      <Divider />

      {/* ── State preview ── */}
      <div style={{
        background: DARK,
        borderRadius: 10,
        padding: "10px 12px",
      }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: PRIMARY, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
          État actuel
        </div>
        {stateRows.map(([key, val]) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#8888AA" }}>{key}</span>
            <span style={{ fontSize: 10, color: valueColor(val), fontWeight: 600, fontFamily: "monospace" }}>
              {String(val)}
            </span>
          </div>
        ))}
      </div>

      {/* Toast (portal, never clipped) */}
      <DebugToast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
