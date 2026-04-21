import { useState } from "react";
import { DT } from "../types";
import { GOAL_TILES } from "../constants/goalTemplates";
import { fmtAmount } from "../utils/goalCalculations";
import { MonthlySlider } from "../components/MonthlySlider";

// Budget suggestions per project type (low / mid / high)
const BUDGET_OPTIONS: Record<string, number[]> = {
  voyage:     [1000,  2000,  4000],
  voiture:    [3000,  8000,  15000],
  immobilier: [10000, 20000, 40000],
  urgence:    [1000,  3000,  6000],
  formation:  [1500,  3000,  8000],
  autre:      [500,   1500,  5000],
};

export type QuizResult = {
  projects: string[];
  budgets: Record<string, number>;
  monthly: number;
};

type Props = {
  onComplete: (result: QuizResult) => void;
  onSkip: () => void;
};

type Step = "projects" | "budgets" | "monthly";

/** cluster_3 Step 2 — Visual project quiz: tile selection → budget → monthly slider */
export function ReactivationQuiz({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState<Step>("projects");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [monthly, setMonthly] = useState(150);

  // ── Step 1: Project tiles ──────────────────────────────────────────────
  const toggleProject = (key: string) => {
    setSelectedProjects((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleProjectsNext = () => {
    if (selectedProjects.length === 0) return;
    // Pre-fill budgets with the mid option
    const defaults: Record<string, number> = {};
    selectedProjects.forEach((k) => {
      const opts = BUDGET_OPTIONS[k] ?? [1500];
      defaults[k] = opts[1] ?? opts[0];
    });
    setBudgets(defaults);
    setStep("budgets");
  };

  // ── Step 2: Budget per project ─────────────────────────────────────────
  const setBudgetFor = (key: string, amount: number) => {
    setBudgets((prev) => ({ ...prev, [key]: amount }));
  };

  // ── Step 3: Monthly slider → complete ─────────────────────────────────
  const handleComplete = () => {
    onComplete({ projects: selectedProjects, budgets, monthly });
  };

  const stepIndex = step === "projects" ? 0 : step === "budgets" ? 1 : 2;
  const pct = ((stepIndex + 1) / 3) * 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: DT.bg }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: DT.text2, fontWeight: 500 }}>
            Question {stepIndex + 1} / 3
          </div>
          <button
            onClick={onSkip}
            style={{ background: "none", border: "none", color: DT.text2, fontSize: 13, cursor: "pointer" }}
          >
            Passer
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: DT.border, borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: DT.primary,
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* ── STEP 1 : Project tiles ── */}
      {step === "projects" && (
        <>
          <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: DT.text, lineHeight: 1.3, marginBottom: 6 }}>
              Quels sont tes projets ?
            </div>
            <div style={{ fontSize: 13, color: DT.text2 }}>Sélectionne tout ce qui te correspond</div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, paddingBottom: 16 }}>
              {GOAL_TILES.map((tile) => {
                const isSel = selectedProjects.includes(tile.key);
                return (
                  <button
                    key={tile.key}
                    onClick={() => toggleProject(tile.key)}
                    style={{
                      padding: "18px 12px",
                      borderRadius: DT.r.card,
                      border: `2px solid ${isSel ? DT.primary : DT.border}`,
                      background: isSel ? DT.primaryLight : DT.surface,
                      textAlign: "center",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.15s",
                    }}
                  >
                    {isSel && (
                      <div style={{
                        position: "absolute", top: 8, right: 8,
                        width: 18, height: 18, borderRadius: "50%",
                        background: DT.primary, color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                      }}>✓</div>
                    )}
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{tile.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isSel ? DT.primary : DT.text, marginBottom: 2 }}>
                      {tile.label}
                    </div>
                    <div style={{ fontSize: 11, color: DT.text2 }}>~{fmtAmount(tile.amount)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: "12px 20px 28px", flexShrink: 0 }}>
            <button
              onClick={handleProjectsNext}
              disabled={selectedProjects.length === 0}
              style={{
                width: "100%", padding: "15px 0", borderRadius: DT.r.button,
                background: selectedProjects.length > 0 ? DT.primary : DT.border,
                color: selectedProjects.length > 0 ? "#fff" : DT.text2,
                fontSize: 16, fontWeight: 700, border: "none",
                cursor: selectedProjects.length > 0 ? "pointer" : "default",
                transition: "all 0.2s",
              }}
            >
              Continuer →
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2 : Budget per project ── */}
      {step === "budgets" && (
        <>
          <div style={{ padding: "0 20px 16px", flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: DT.text, lineHeight: 1.3, marginBottom: 6 }}>
              Quel budget pour chacun ?
            </div>
            <div style={{ fontSize: 13, color: DT.text2 }}>Sélectionne l'estimation la plus proche</div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
            {selectedProjects.map((key) => {
              const tile = GOAL_TILES.find((t) => t.key === key)!;
              const opts = BUDGET_OPTIONS[key] ?? [1500];
              return (
                <div key={key} style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DT.text, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{tile.emoji}</span> {tile.label}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {opts.map((amount) => {
                      const isSel = budgets[key] === amount;
                      return (
                        <button
                          key={amount}
                          onClick={() => setBudgetFor(key, amount)}
                          style={{
                            flex: 1, padding: "12px 8px",
                            borderRadius: 12,
                            border: `2px solid ${isSel ? DT.primary : DT.border}`,
                            background: isSel ? DT.primaryLight : DT.surface,
                            fontSize: 13, fontWeight: isSel ? 700 : 500,
                            color: isSel ? DT.primary : DT.text,
                            cursor: "pointer", transition: "all 0.15s",
                            textAlign: "center",
                          }}
                        >
                          {fmtAmount(amount)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "12px 20px 28px", flexShrink: 0 }}>
            <button
              onClick={() => setStep("monthly")}
              style={{
                width: "100%", padding: "15px 0", borderRadius: DT.r.button,
                background: DT.primary, color: "#fff",
                fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
              }}
            >
              Continuer →
            </button>
          </div>
        </>
      )}

      {/* ── STEP 3 : Monthly slider ── */}
      {step === "monthly" && (
        <>
          <div style={{ padding: "0 20px 24px", flexShrink: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: DT.text, lineHeight: 1.3, marginBottom: 6 }}>
              Tu peux mettre combien de côté par mois ?
            </div>
            <div style={{ fontSize: 13, color: DT.text2, marginBottom: 24 }}>
              On répartira entre tes projets selon leur priorité
            </div>
            <MonthlySlider
              value={monthly}
              min={50}
              max={1000}
              step={25}
              onChange={setMonthly}
              label="Mensualité totale"
            />
          </div>

          {/* Live allocation preview */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: DT.text2, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Répartition estimée
            </div>
            {selectedProjects.map((key, i) => {
              const tile = GOAL_TILES.find((t) => t.key === key)!;
              const budget = budgets[key] ?? tile.amount;
              // Simple equal split for preview
              const share = Math.round(monthly / selectedProjects.length);
              const months = share > 0 ? Math.ceil(budget / share) : 999;
              return (
                <div key={key} style={{
                  background: DT.surface,
                  borderRadius: 12,
                  padding: "12px 14px",
                  marginBottom: 8,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{tile.emoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: DT.text }}>{tile.label}</div>
                      <div style={{ fontSize: 11, color: DT.text2 }}>{fmtAmount(budget)} · {months} mois</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: DT.primary }}>
                    {fmtAmount(share)}/mois
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "12px 20px 28px", flexShrink: 0 }}>
            <button
              onClick={handleComplete}
              style={{
                width: "100%", padding: "15px 0", borderRadius: DT.r.button,
                background: DT.primary, color: "#fff",
                fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
              }}
            >
              Voir mon plan de répartition →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
