import { useState, useEffect } from "react";
import { DebugPanel } from "../components/DebugPanel";
import type { SavingsGoal, Cluster, IncomeBracket } from "../types";

// ── Exported types — imported by App.tsx and DebugPanel.tsx ───────────────

export type DebugState = {
  cluster: Cluster;
  declaredGoal: string;
  incomeBracket: IncomeBracket;
  userAge: number;
  savingsGoalCreated: boolean;
  firstTransactionCategorized: boolean;
  dismissedSuggestionCount: number;
  firstTransactionDate: string | null;
  lastActiveDate: string | null;
  savingsGoals: SavingsGoal[];
  totalMonthlyBudget: number;
};

export type DebugActions = {
  setCluster: (c: Cluster) => void;
  setDeclaredGoal: (g: string) => void;
  setIncomeBracket: (b: IncomeBracket) => void;
  setUserAge: (a: number) => void;
  setSavingsGoalCreated: (v: boolean) => void;
  setFirstTransactionCategorized: (v: boolean) => void;
  setDismissedCount: (n: number) => void;
  setFirstTransactionDate: (d: string | null) => void;
  setLastActiveDate: (d: string | null) => void;
  setSavingsGoals: (goals: SavingsGoal[]) => void;
  /** Trigger the progress notification banner with a given goal */
  triggerProgressNotif: (type: "A" | "B" | "C") => void;
  /** Set goals[0].currentAmount to percent% of target and show notif */
  setGoalProgress: (percent: number) => void;
  /** Simulation shortcuts */
  simulateCluster2J2: () => void;
  simulateCluster3J14: () => void;
  resetFeature: () => void;
  resetAll: () => void;
};

type Props = {
  children: React.ReactNode;
  debugState: DebugState;
  debugActions: DebugActions;
};

const PANEL_WIDTH = 300;
const BREAKPOINT = 768;

/**
 * Responsive debug wrapper.
 *
 * Desktop (≥768px) — two-column:
 *   [debug panel 300px | right col with iPhone frame]
 *
 * Mobile (<768px) — passthrough:
 *   existing app layout + floating 🛠 bubble + slide-up drawer
 *
 * Excluded from production automatically via import.meta.env.DEV check.
 */
export function DebugLayout({ children, debugState, debugActions }: Props) {
  // In production builds this entire component returns children unchanged
  if (!import.meta.env.DEV) return <>{children}</>;

  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= BREAKPOINT);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── DESKTOP layout ────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Left — debug panel */}
        <div
          style={{
            width: PANEL_WIDTH,
            minWidth: 280,
            flexShrink: 0,
            background: "#FFF8F9",
            borderRight: "1.5px solid #FF4D6D",
            overflowY: "auto",
            padding: "20px 16px",
          }}
        >
          <DebugPanel state={debugState} actions={debugActions} />
        </div>

        {/* Right — iPhone frame */}
        <div
          className="debug-layout-right"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#F0F0F8",
            padding: 40,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // ── MOBILE layout — passthrough + floating bubble + drawer ────────────────
  return (
    <>
      {/* App renders full-screen, unchanged */}
      {children}

      {/* Floating bubble */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Ouvrir le debug panel"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "#FF4D6D",
          border: "none",
          boxShadow: "0 4px 16px rgba(255,77,109,0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          cursor: "pointer",
          animation: "debugPulse 2s ease-in-out infinite",
        }}
      >
        🛠
      </button>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1001,
          }}
        />
      )}

      {/* Slide-up drawer */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#FFF8F9",
            borderRadius: "20px 20px 0 0",
            border: "1.5px solid #FF4D6D",
            borderBottom: "none",
            padding: "16px 20px 40px",
            maxHeight: "80vh",
            overflowY: "auto",
            zIndex: 1002,
            animation: "debugSlideUp 300ms ease-out",
          }}
        >
          {/* Drag handle */}
          <div style={{ width: 36, height: 4, background: "#FFE8EC", borderRadius: 2, margin: "0 auto 16px" }} />
          <DebugPanel
            state={debugState}
            actions={debugActions}
            onClose={() => setDrawerOpen(false)}
          />
        </div>
      )}
    </>
  );
}
