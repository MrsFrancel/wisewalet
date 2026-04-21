import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  message: string | null;
  onDismiss: () => void;
};

/**
 * Fixed bottom-center toast — renders via portal so it's never clipped
 * by any drawer or fixed-position parent. Auto-dismisses after 2500ms.
 */
export function DebugToast({ message, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    // Tiny delay so the element mounts before the CSS transition fires
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 220);
    }, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [message]);

  if (!message) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: 40,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease, transform 0.2s ease",
        background: "#1A1A2E",
        color: "#FFFFFF",
        borderRadius: 100,
        padding: "10px 20px",
        fontSize: 12,
        fontWeight: 600,
        zIndex: 9999,
        whiteSpace: "nowrap",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        pointerEvents: "none",
      }}
    >
      {message}
    </div>,
    document.body,
  );
}
