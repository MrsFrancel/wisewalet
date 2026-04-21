import { useState, useEffect, useRef } from "react";
import { DT, SavingsGoal } from "../types";
import { AITypingIndicator } from "../components/AITypingIndicator";
import { QuickReplyChips } from "../components/QuickReplyChips";
import { MonthlySlider } from "../components/MonthlySlider";
import { getFlow, FlowResult } from "../constants/aiConversationFlows";
import { buildPrefillGoal } from "../constants/goalTemplates";
import { fmtAmount, fmtMonths } from "../utils/goalCalculations";
import type { UserState } from "../types";

type ChatMessage = {
  id: string;
  role: "ai" | "user";
  text: string;
};

type Props = {
  userState: UserState;
  onComplete: (goal: SavingsGoal) => void;
  onBack: () => void;
};

/** Step 2 — Conversational AI goal enrichment screen */
export function AIGoalEnrichment({ userState, onComplete, onBack }: Props) {
  const flow = getFlow(userState.declaredGoal);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<FlowResult | null>(null);
  const [monthly, setMonthly] = useState(150);
  const [chipsDisabled, setChipsDisabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Send first AI message on mount
  useEffect(() => {
    const firstStep = flow.steps[0];
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages([{ id: "msg-0", role: "ai", text: firstStep.message }]);
    }, 900);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleReply = (value: string) => {
    if (chipsDisabled) return;
    const step = flow.steps[stepIdx];
    const chosen = step.replies.find((r) => r.value === value);
    if (!chosen) return;

    // Disable chips + add user bubble
    setChipsDisabled(true);
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    setMessages((prev) => [
      ...prev,
      { id: `msg-user-${stepIdx}`, role: "user", text: chosen.label },
    ]);

    // Determine next step
    const nextId = step.next ? step.next(value) : null;
    const nextStepIdx = nextId
      ? flow.steps.findIndex((s) => s.id === nextId)
      : -1;

    if (nextStepIdx >= 0) {
      // Next question
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `msg-ai-${nextStepIdx}`, role: "ai", text: flow.steps[nextStepIdx].message },
        ]);
        setStepIdx(nextStepIdx);
        setChipsDisabled(false);
      }, 900);
    } else {
      // End of flow — compute result
      const baseAmount = buildPrefillGoal(userState.declaredGoal, userState.incomeBracket).targetAmount;
      const calc = flow.calculate(newAnswers, baseAmount);
      setResult(calc);
      setMonthly(calc.monthly);

      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "msg-result",
            role: "ai",
            text: calc.summary,
          },
        ]);
        setDone(true);
      }, 1200);
    }
  };

  const handleConfirm = () => {
    if (!result) return;
    const base = buildPrefillGoal(userState.declaredGoal, userState.incomeBracket, monthly);
    const target = new Date();
    target.setMonth(target.getMonth() + result.months);
    const goal: SavingsGoal = {
      ...base,
      targetAmount: result.calculatedAmount,
      monthlyAmount: monthly,
      targetDate: target.toISOString().split("T")[0],
    };
    onComplete(goal);
  };

  const currentStep = flow.steps[stepIdx];

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          background: DT.surface,
          boxShadow: "0 1px 0 " + DT.border,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            color: DT.text,
            padding: 0,
            lineHeight: 1,
          }}
        >
          ←
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: DT.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          ✨
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: DT.text }}>
            Assistant IA
          </div>
          <div style={{ fontSize: 11, color: DT.success, fontWeight: 500 }}>
            ● En ligne
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 0 8px",
        }}
      >
        {messages.map((msg) =>
          msg.role === "ai" ? (
            <AIMessage key={msg.id} text={msg.text} />
          ) : (
            <UserMessage key={msg.id} text={msg.text} />
          )
        )}

        {typing && <AITypingIndicator />}

        {/* Result adjustments */}
        {done && result && (
          <div style={{ padding: "12px 16px" }}>
            <div
              style={{
                background: DT.surface,
                borderRadius: DT.r.card,
                padding: 16,
                boxShadow: DT.cardShadow,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: DT.text2,
                  marginBottom: 14,
                  marginTop: 0,
                }}
              >
                Tu peux ajuster la mensualité :
              </p>
              <MonthlySlider
                value={monthly}
                min={50}
                max={Math.max(500, result.monthly * 2)}
                step={10}
                onChange={setMonthly}
              />
              <div
                style={{
                  marginTop: 10,
                  fontSize: 12,
                  color: DT.text2,
                  textAlign: "center",
                }}
              >
                Objectif atteint en{" "}
                <strong>
                  {fmtMonths(Math.ceil(result.calculatedAmount / Math.max(10, monthly)))}
                </strong>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick replies or confirm button */}
      <div style={{ background: DT.surface, boxShadow: "0 -1px 0 " + DT.border, flexShrink: 0 }}>
        {done ? (
          <div style={{ padding: "12px 16px" }}>
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
              }}
            >
              Créer cet objectif — {fmtAmount(result?.calculatedAmount ?? 0)}
            </button>
          </div>
        ) : (
          !typing && !chipsDisabled && currentStep && (
            <QuickReplyChips
              chips={currentStep.replies}
              onSelect={handleReply}
              disabled={chipsDisabled}
            />
          )
        )}
      </div>
    </div>
  );
}

function AIMessage({ text }: { text: string }) {
  // Support **bold** markdown
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "4px 16px 4px", marginBottom: 4 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: DT.primary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        ✨
      </div>
      <div
        style={{
          maxWidth: "75%",
          padding: "10px 14px",
          borderRadius: "18px 18px 18px 4px",
          background: DT.surface,
          boxShadow: DT.cardShadow,
          fontSize: 14,
          color: DT.text,
          lineHeight: 1.5,
        }}
      >
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "4px 16px 4px",
        marginBottom: 4,
      }}
    >
      <div
        style={{
          maxWidth: "65%",
          padding: "10px 14px",
          borderRadius: "18px 18px 4px 18px",
          background: DT.primary,
          color: "#fff",
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.5,
        }}
      >
        {text}
      </div>
    </div>
  );
}
