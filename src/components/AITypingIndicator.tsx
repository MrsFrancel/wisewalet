import { DT } from "../types";

/** Three pulsing dots — typing indicator for the AI chat interface */
export function AITypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-2 mb-2">
      {/* AI avatar */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 32, height: 32, background: DT.primary }}
      >
        <span style={{ fontSize: 14 }}>✨</span>
      </div>

      {/* Bubble with dots */}
      <div
        className="flex items-center gap-[5px] px-4 py-3 rounded-2xl"
        style={{
          background: DT.surface,
          boxShadow: DT.cardShadow,
          borderRadius: 16,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: DT.text2,
              animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: scale(1); opacity: 0.4; }
          30%            { transform: scale(1.4); opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
