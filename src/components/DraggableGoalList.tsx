import { useState, useRef } from "react";
import { SavingsGoal } from "../types";
import { GoalCardV3 } from "./GoalCardV3";
import { reorderGoals } from "../utils/goalCalculations";

type Props = {
  goals: SavingsGoal[];
  onReorder: (goals: SavingsGoal[]) => void;
  onGoalPress?: (goal: SavingsGoal) => void;
};

/** Drag-and-drop reorderable list of GoalCardV3 items */
export function DraggableGoalList({ goals, onReorder, onGoalPress }: Props) {
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragNodeRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggingIdx(index);
    dragNodeRef.current = e.currentTarget as HTMLDivElement;
    e.dataTransfer.effectAllowed = "move";
    // Transparent ghost — use a tiny delay so native ghost renders first
    setTimeout(() => {
      if (dragNodeRef.current) dragNodeRef.current.style.opacity = "0.4";
    }, 0);
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) dragNodeRef.current.style.opacity = "1";
    if (draggingIdx !== null && overIdx !== null && draggingIdx !== overIdx) {
      onReorder(reorderGoals(goals, draggingIdx, overIdx));
    }
    setDraggingIdx(null);
    setOverIdx(null);
    dragNodeRef.current = null;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (index !== overIdx) setOverIdx(index);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {goals.map((goal, idx) => {
        const isDragging = draggingIdx === idx;
        const isOver = overIdx === idx && draggingIdx !== idx;

        return (
          <div
            key={goal.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => { e.preventDefault(); }}
            style={{
              transform: isOver
                ? draggingIdx !== null && draggingIdx < idx
                  ? "translateY(-4px)"
                  : "translateY(4px)"
                : "none",
              transition: isDragging ? "none" : "transform 0.15s ease",
              opacity: isDragging ? 0.4 : 1,
            }}
          >
            <GoalCardV3
              goal={goal}
              onPress={() => onGoalPress?.(goal)}
              draggable
              dragHandleProps={{
                onMouseDown: (e) => e.stopPropagation(),
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
