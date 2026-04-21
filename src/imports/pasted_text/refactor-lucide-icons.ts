---
  FILE: src/app/App.tsx

  OPERATION: FULL_REFACTOR_EMOJI_TO_LUCIDE

  ---

  STEP_1: UPDATE_IMPORTS

  FIND:
  import {
    ArrowLeft, Bell, ArrowUpRight, ArrowDownLeft, Target,
  MoreHorizontal,
    Home, Receipt, BarChart3, User, ChevronRight, Plus,
    Eye, EyeOff, Pencil, Delete, LogOut, PieChart,
  } from "lucide-react";

  REPLACE:
  import {
    ArrowLeft, Bell, ArrowUpRight, ArrowDownLeft, Target,
  MoreHorizontal,
    Home, Receipt, BarChart3, User, ChevronRight, Plus,
    Eye, EyeOff, Pencil, Delete, LogOut, PieChart,
    ShoppingCart, Film, Banknote, Car, Pill, ShoppingBag,
    Plane, Building, Zap, GraduationCap, Star, Trophy, Archive,
  } from "lucide-react";

  ---

  STEP_2: ADD_TYPE_ALIAS
  INSERT after the imports block:

  type LucideIcon = React.ComponentType<{ size?: number; color?:
  string; strokeWidth?: number; fill?: string }>;

  ---

  STEP_3: UPDATE_TYPE_Tx

  FIND:
  type Tx = {
    id: string; merchant: string; cat: string; emoji: string; color:
  string;
    amount: number; date: string; dateLabel: string; location?:
  string;
  };

  REPLACE:
  type Tx = {
    id: string; merchant: string; cat: string; icon: LucideIcon;
  color: string;
    amount: number; date: string; dateLabel: string; location?:
  string;
  };

  ---

  STEP_4: UPDATE_TYPE_Goal

  FIND:
  type Goal = {
    id: string;
    name: string;
    emoji: string;
    category: string;
    amount: number;
    saved: number;
    durationMonths: number;
    targetDate: string; // pretty
  };

  REPLACE:
  type Goal = {
    id: string;
    name: string;
    icon: LucideIcon;
    category: string;
    amount: number;
    saved: number;
    durationMonths: number;
    targetDate: string;
  };

  ---

  STEP_5: UPDATE_TXS_DATA

  FIND:
  const TXS: Tx[] = [
    { id: "t1", merchant: "Carrefour City", cat: "Alimentation",
  emoji: "🛒", color: "#FF8A3D", amount: -23.4, date: "Aujourd'hui ·
  14h32", dateLabel: "Aujourd'hui", location: "Paris, France" },
    { id: "t2", merchant: "Netflix", cat: "Loisirs", emoji: "🎬",
  color: "#E53E5A", amount: -13.99, date: "Aujourd'hui · 09h12",
  dateLabel: "Aujourd'hui" },
    { id: "t3", merchant: "Virement reçu", cat: "Virement", emoji:
  "💸", color: "#00C896", amount: 500, date: "Aujourd'hui · 08h00",
  dateLabel: "Aujourd'hui" },
    { id: "t4", merchant: "Uber", cat: "Transport", emoji: "🚗",
  color: "#0404E2", amount: -12.5, date: "Hier · 19h45", dateLabel:
  "Hier" },
    { id: "t5", merchant: "Pharmacie", cat: "Santé", emoji: "💊",
  color: "#00C896", amount: -8.9, date: "Hier · 11h22", dateLabel:
  "Hier" },
    { id: "t6", merchant: "Zara", cat: "Shopping", emoji: "🛍️", color:
   "#F2C94C", amount: -79.9, date: "18 avril · 16h10", dateLabel: "18
  avril" },
    { id: "t7", merchant: "Salaire", cat: "Virement", emoji: "💸",
  color: "#00C896", amount: 1600, date: "15 avril · 09h00", dateLabel:
   "15 avril" },
    { id: "t8", merchant: "Spotify", cat: "Loisirs", emoji: "🎬",
  color: "#E53E5A", amount: -9.99, date: "14 avril · 07h30",
  dateLabel: "14 avril" },
  ];

  REPLACE:
  const TXS: Tx[] = [
    { id: "t1", merchant: "Carrefour City", cat: "Alimentation", icon:
   ShoppingCart, color: "#FF8A3D", amount: -23.4, date: "Aujourd'hui ·
   14h32", dateLabel: "Aujourd'hui", location: "Paris, France" },
    { id: "t2", merchant: "Netflix", cat: "Loisirs", icon: Film,
  color: "#E53E5A", amount: -13.99, date: "Aujourd'hui · 09h12",
  dateLabel: "Aujourd'hui" },
    { id: "t3", merchant: "Virement reçu", cat: "Virement", icon:
  Banknote, color: "#00C896", amount: 500, date: "Aujourd'hui ·
  08h00", dateLabel: "Aujourd'hui" },
    { id: "t4", merchant: "Uber", cat: "Transport", icon: Car, color:
  "#0404E2", amount: -12.5, date: "Hier · 19h45", dateLabel: "Hier" },
    { id: "t5", merchant: "Pharmacie", cat: "Santé", icon: Pill,
  color: "#00C896", amount: -8.9, date: "Hier · 11h22", dateLabel:
  "Hier" },
    { id: "t6", merchant: "Zara", cat: "Shopping", icon: ShoppingBag,
  color: "#F2C94C", amount: -79.9, date: "18 avril · 16h10",
  dateLabel: "18 avril" },
    { id: "t7", merchant: "Salaire", cat: "Virement", icon: Banknote,
  color: "#00C896", amount: 1600, date: "15 avril · 09h00", dateLabel:
   "15 avril" },
    { id: "t8", merchant: "Spotify", cat: "Loisirs", icon: Film,
  color: "#E53E5A", amount: -9.99, date: "14 avril · 07h30",
  dateLabel: "14 avril" },
  ];

  ---

  STEP_6: UPDATE_CATEGORIES

  FIND:
  const CATEGORIES: { e: string; l: string }[] = [
    { e: "🏖️", l: "Voyage" }, { e: "🚗", l: "Voiture" }, { e: "🏠", l:
   "Immobilier" },
    { e: "💡", l: "Urgence" }, { e: "🎓", l: "Formation" }, { e: "✨",
   l: "Autre" },
  ];

  REPLACE:
  const CATEGORIES: { icon: LucideIcon; l: string }[] = [
    { icon: Plane, l: "Voyage" }, { icon: Car, l: "Voiture" }, { icon:
   Building, l: "Immobilier" },
    { icon: Zap, l: "Urgence" }, { icon: GraduationCap, l: "Formation"
   }, { icon: Star, l: "Autre" },
  ];

  ---

  STEP_7: UPDATE_TxRow_RENDER

  FIND:
        <div className="w-10 h-10 rounded-full flex items-center
  justify-center" style={{ background: `${t.color}1A` }}>
          <span style={{ fontSize: 18 }}>{t.emoji}</span>
        </div>

  REPLACE:
        <div className="w-10 h-10 rounded-full flex items-center
  justify-center" style={{ background: `${t.color}1A` }}>
          <t.icon size={18} color={t.color} strokeWidth={STROKE}
  fill="none" />
        </div>

  ---

  STEP_8: UPDATE_GoalCard_RENDER

  FIND:
        <div className="w-12 h-12 rounded-full flex items-center
  justify-center" style={{ background: C.primarySoft, fontSize: 24
  }}>{g.emoji}</div>

  REPLACE:
        <div className="w-12 h-12 rounded-full flex items-center
  justify-center" style={{ background: C.primarySoft }}>
          <g.icon size={24} color={C.secondary} strokeWidth={STROKE}
  fill="none" />
        </div>

  ---

  STEP_9: UPDATE_GoalsScreen_EMPTY_STATE

  FIND:
                <div style={{ fontSize: 64 }}>🎯</div>

  REPLACE:
                <Target size={64} color={C.primary} strokeWidth={1}
  fill="none" />

  ---

  STEP_10: UPDATE_GoalsScreen_POPULAR_CARDS

  FIND:
                      <div style={{ fontSize: 32 }}>{p.e}</div>

  REPLACE:
                      <p.icon size={32} color={C.secondary}
  strokeWidth={STROKE} fill="none" />

  AND UPDATE popular cards data inside GoalsScreen:

  FIND:
    const pop = [
      { e: "🏖️", t: "Voyage", a: "1 500€" },
      { e: "🚗", t: "Voiture", a: "5 000€" },
      { e: "🏠", t: "Apport", a: "20 000€" },
    ];

  REPLACE:
    const pop = [
      { icon: Plane, t: "Voyage", a: "1 500€" },
      { icon: Car, t: "Voiture", a: "5 000€" },
      { icon: Building, t: "Apport", a: "20 000€" },
    ];

  ---

  STEP_11: UPDATE_GoalStep1_CATEGORY_GRID

  FIND:
                    <span style={{ fontSize: 28 }}>{c.e}</span>

  REPLACE:
                    <c.icon size={28} color={C.secondary}
  strokeWidth={STROKE} fill="none" />

  ---

  STEP_12: UPDATE_GoalStep3_RECAP

  FIND:
              <div className="flex justify-center"><span style={{
  fontSize: 48 }}>{draft.emoji || "🎯"}</span></div>

  REPLACE:
              <div className="flex justify-center">
                {draft.icon
                  ? <draft.icon size={48} color={C.secondary}
  strokeWidth={1} fill="none" />
                  : <Target size={48} color={C.secondary}
  strokeWidth={1} fill="none" />}
              </div>

  ---

  STEP_13: UPDATE_GoalCreatedScreen

  FIND:
            <span style={{ fontSize: 48 }}>🎉</span>

  REPLACE:
            <Trophy size={48} color={C.success} strokeWidth={1.5}
  fill="none" />

  ---

  STEP_14: UPDATE_GoalDetailScreen_HEADER_ICON

  FIND:
                <span style={{ fontSize: 32 }}>{goal.emoji}</span>

  REPLACE:
                <goal.icon size={32} color={C.secondary}
  strokeWidth={STROKE} fill="none" />

  ---

  STEP_15: UPDATE_GoalDetailScreen_CIRCLE_CENTER

  FIND:
                    <div style={{ color: C.text, fontSize: 24,
  fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>{goal.saved}
  €</div>

  NO_CHANGE: keep as-is.

  ---

  STEP_16: UPDATE_HomeScreen_EMPTY_GOALS

  FIND:
                <div style={{ fontSize: 32 }}>🫙</div>

  REPLACE:
                <Archive size={32} color={C.text2}
  strokeWidth={STROKE} fill="none" />

  ---

  STEP_17: UPDATE_onCreate_GOAL_CREATION

  FIND:
        emoji: draft.emoji || "🎯",

  REPLACE:
        icon: draft.icon || Target,

  ---

  STEP_18: UPDATE_GoalCreatedScreen_PROGRESS_ICON
  In GoalCreatedScreen, remove any remaining emoji reference to goal.

  FIND:
            Votre objectif {goal?.name} est lancé.

  REPLACE:
            Votre objectif {goal?.name} est lancé.

  NO_CHANGE: keep as-is.

  ---

  CONSTRAINT: All icon components rendered via variable (t.icon,
  g.icon, c.icon, p.icon, draft.icon) must use JSX dynamic component
  syntax: const IconComp = t.icon; <IconComp ... /> — OR use direct
  lowercase via spread if JSX requires. Do NOT write <t.icon />
  directly if the runtime rejects lowercase dot-notation; assign to a
  capitalized const first.

  EXAMPLE_PATTERN:
    const TxIcon = t.icon;
    <TxIcon size={18} color={t.color} strokeWidth={STROKE} fill="none"
   />

  APPLY_THIS_PATTERN_TO: TxRow, GoalCard, GoalStep1 category grid,
  GoalsScreen popular cards.

  NO_OTHER_CHANGES: true