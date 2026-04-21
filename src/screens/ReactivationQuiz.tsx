import { useState } from "react";
import { DT } from "../types";

type QuizQuestion = {
  id: string;
  question: string;
  options: { label: string; value: string }[];
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "reason",
    question: "Pourquoi as-tu mis l'épargne en pause ?",
    options: [
      { label: "Dépenses imprévues 🧾",     value: "depenses" },
      { label: "J'ai oublié 😅",             value: "oubli"    },
      { label: "Revenus en baisse 📉",        value: "revenus"  },
      { label: "Autre raison",               value: "autre"    },
    ],
  },
  {
    id: "resume",
    question: "Quand penses-tu pouvoir reprendre ?",
    options: [
      { label: "Maintenant ! 💪",            value: "now"      },
      { label: "Dans 1 semaine",             value: "week"     },
      { label: "Dans 1 mois",               value: "month"    },
      { label: "Je ne sais pas",            value: "unknown"  },
    ],
  },
  {
    id: "amount",
    question: "Combien peux-tu mettre de côté ce mois-ci ?",
    options: [
      { label: "Moins de 50 €",             value: "50"       },
      { label: "50–150 €",                  value: "100"      },
      { label: "150–300 €",                 value: "200"      },
      { label: "Plus de 300 €",             value: "300"      },
    ],
  },
];

type Props = {
  onComplete: (answers: Record<string, string>) => void;
  onSkip: () => void;
};

/** cluster_3 Step 2 — Short reactivation quiz to recalibrate savings plan */
export function ReactivationQuiz({ onComplete, onSkip }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[currentIdx];
  const isLast = currentIdx === QUIZ_QUESTIONS.length - 1;
  const progress = (currentIdx / QUIZ_QUESTIONS.length) * 100;

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
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
      <div style={{ padding: "24px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: DT.text2, fontWeight: 500 }}>
            Question {currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </div>
          <button
            onClick={onSkip}
            style={{
              background: "none",
              border: "none",
              color: DT.text2,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Passer
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: 4,
            background: DT.border,
            borderRadius: 2,
            overflow: "hidden",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress + (100 / QUIZ_QUESTIONS.length)}%`,
              background: DT.primary,
              borderRadius: 2,
              transition: "width 0.4s ease",
            }}
          />
        </div>

        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: DT.text,
            lineHeight: 1.3,
            marginBottom: 24,
          }}
        >
          {question.question}
        </div>
      </div>

      {/* Options */}
      <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                style={{
                  padding: "16px 18px",
                  borderRadius: DT.r.card,
                  background: isSelected ? DT.primaryLight : DT.surface,
                  border: `2px solid ${isSelected ? DT.primary : DT.border}`,
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? DT.primary : DT.text,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px solid ${isSelected ? DT.primary : DT.border}`,
                    background: isSelected ? DT.primary : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s ease",
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#fff",
                      }}
                    />
                  )}
                </div>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 20px 28px", flexShrink: 0 }}>
        <button
          onClick={handleNext}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "15px 0",
            borderRadius: DT.r.button,
            background: selected ? DT.primary : DT.border,
            color: selected ? "#fff" : DT.text2,
            fontSize: 16,
            fontWeight: 700,
            border: "none",
            cursor: selected ? "pointer" : "default",
            transition: "all 0.2s ease",
          }}
        >
          {isLast ? "Voir mon nouveau plan" : "Continuer →"}
        </button>
      </div>
    </div>
  );
}
