import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft, Bell, ArrowUpRight, ArrowDownLeft, Target, MoreHorizontal,
  Home, Receipt, BarChart3, User, ChevronRight, Plus,
  Eye, EyeOff, Pencil, Delete, LogOut, PieChart,
  ShoppingCart, Film, Banknote, Car, Pill, ShoppingBag,
  Plane, Building, Zap, GraduationCap, Star, Trophy, Archive,
} from "lucide-react";

type LucideIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; fill?: string }>;

type Screen =
  | "welcome" | "signup" | "home" | "transactions" | "txDetail"
  | "goals" | "goalStep1" | "goalStep2" | "goalStep3" | "goalCreated"
  | "goalDetail" | "analysis" | "notifications" | "profile";

const C = {
  bg: "#F5F5F5",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  primary: "#C9FF27",
  primarySoft: "#F0FFAA",
  primaryDark: "#8AB800",
  onPrimary: "#040707",
  link: "#0404E2",
  linkSoft: "#CECEFF",
  secondary: "#0404E2",
  text: "#040707",
  text2: "#7A7A7A",
  danger: "#EF4444",
  dangerSoft: "#FFF5F5",
  success: "#00B14F",
  successSoft: "#E6F7EE",
  border: "#E8E8E8",
  borderStrong: "#BEBEBE",
  dark: "#040707",
};

const SHADOW = "inset 0 0 0 1px #E8E8E8";
const SHADOW_LG = "none";

const ICON = 22;
const STROKE = 1.5;

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

type Tx = {
  id: string; merchant: string; cat: string; icon: LucideIcon; color: string;
  amount: number; date: string; dateLabel: string; location?: string;
};

const TXS: Tx[] = [
  { id: "t1", merchant: "Carrefour City", cat: "Alimentation", icon: ShoppingCart, color: "#FF8A3D", amount: -23.4, date: "Aujourd'hui · 14h32", dateLabel: "Aujourd'hui", location: "Paris, France" },
  { id: "t2", merchant: "Netflix", cat: "Loisirs", icon: Film, color: "#E53E5A", amount: -13.99, date: "Aujourd'hui · 09h12", dateLabel: "Aujourd'hui" },
  { id: "t3", merchant: "Virement reçu", cat: "Virement", icon: Banknote, color: "#00C896", amount: 500, date: "Aujourd'hui · 08h00", dateLabel: "Aujourd'hui" },
  { id: "t4", merchant: "Uber", cat: "Transport", icon: Car, color: "#0404E2", amount: -12.5, date: "Hier · 19h45", dateLabel: "Hier" },
  { id: "t5", merchant: "Pharmacie", cat: "Santé", icon: Pill, color: "#00C896", amount: -8.9, date: "Hier · 11h22", dateLabel: "Hier" },
  { id: "t6", merchant: "Zara", cat: "Shopping", icon: ShoppingBag, color: "#F2C94C", amount: -79.9, date: "18 avril · 16h10", dateLabel: "18 avril" },
  { id: "t7", merchant: "Salaire", cat: "Virement", icon: Banknote, color: "#00C896", amount: 1600, date: "15 avril · 09h00", dateLabel: "15 avril" },
  { id: "t8", merchant: "Spotify", cat: "Loisirs", icon: Film, color: "#E53E5A", amount: -9.99, date: "14 avril · 07h30", dateLabel: "14 avril" },
];

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function useCountUp(target: number, duration = 1200, active = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return value;
}

// ---------- primitives ----------
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1" style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>
      <span>9:41</span>
      <div className="flex items-center gap-1" style={{ fontSize: 12 }}>
        <span>••••</span><span>•••</span><span>100%</span>
      </div>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[52px] rounded-full transition-all active:scale-[0.98]"
      style={{
        background: disabled ? "#E8E8E8" : C.primary,
        color: disabled ? C.text2 : C.onPrimary,
        fontWeight: 600,
        fontSize: 15,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-[52px] rounded-full transition-all active:scale-[0.98]"
      style={{ background: "transparent", color: C.text, fontWeight: 600, fontSize: 15, border: `2px solid ${C.text}` }}
    >
      {children}
    </button>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 rounded-full flex items-center justify-center transition active:scale-95" style={{ background: C.surface, boxShadow: SHADOW }}>
      {children}
    </button>
  );
}

function Header({ title, onBack, right, large }: { title: string; onBack?: () => void; right?: React.ReactNode; large?: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 pt-2 pb-4">
      <div className="w-9">
        {onBack && (
          <IconBtn onClick={onBack}><ArrowLeft size={ICON} strokeWidth={STROKE} color={C.text} fill="none" /></IconBtn>
        )}
      </div>
      <div style={{ color: C.text, fontWeight: large ? 700 : 600, fontSize: large ? 28 : 22, fontFamily: "Syne, sans-serif" }} className={large ? "flex-1" : "flex-1 text-center"}>
        {title}
      </div>
      <div className="w-auto min-w-9 flex justify-end">{right}</div>
    </div>
  );
}

const TABS: { key: Screen; label: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number; fill?: string }> }[] = [
  { key: "home", label: "Accueil", icon: Home },
  { key: "transactions", label: "Transactions", icon: Receipt },
  { key: "goals", label: "Objectifs", icon: Target },
  { key: "analysis", label: "Analyse", icon: PieChart },
  { key: "profile", label: "Profil", icon: User },
];

function BottomNav({ active, go }: { active: Screen; go: (s: Screen) => void }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0"
      style={{ height: 80 + 34, background: C.surface, borderTop: `1px solid ${C.border}`, paddingBottom: 34 }}
    >
      <div className="flex items-center justify-around h-[80px] px-2">
        {TABS.map((t) => {
          const isActive =
            active === t.key ||
            (t.key === "goals" && (active === "goalDetail" || active === "goalStep1" || active === "goalStep2" || active === "goalStep3" || active === "goalCreated"));
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => go(t.key)} className="flex flex-col items-center gap-1 flex-1 transition active:scale-95">
              <Icon
                size={ICON}
                color={isActive ? C.onPrimary : C.text2}
                strokeWidth={isActive ? 2 : STROKE}
                fill={isActive ? C.primary : "none"}
              />
              <span style={{ color: isActive ? C.onPrimary : C.text2, fontSize: 11, fontWeight: isActive ? 600 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ScreenBody({ children, pad = true }: { children: React.ReactNode; pad?: boolean }) {
  return <div className={`flex-1 overflow-y-auto ${pad ? "pb-[140px]" : ""}`}>{children}</div>;
}

function TxRow({ t, onClick }: { t: Tx; onClick?: () => void }) {
  const positive = t.amount > 0;
  const TxIcon = t.icon;
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-3 transition active:scale-[0.99]">
      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${t.color}1A` }}>
        <TxIcon size={18} color={t.color} strokeWidth={STROKE} fill="none" />
      </div>
      <div className="flex-1 text-left">
        <div style={{ color: C.text, fontSize: 15, fontWeight: 500 }}>{t.merchant}</div>
        <div style={{ color: C.text2, fontSize: 12 }}>{t.cat}</div>
      </div>
      <div style={{ color: positive ? C.success : C.danger, fontSize: 15, fontWeight: 600 }}>
        {positive ? "+" : ""}{t.amount.toFixed(2).replace(".", ",")}€
      </div>
    </button>
  );
}

// Brand icons for social login
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function AppleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#040707">
      <path d="M17.05 12.536c-.03-2.94 2.4-4.348 2.51-4.418-1.36-1.99-3.48-2.26-4.24-2.29-1.8-.18-3.52 1.06-4.44 1.06-.92 0-2.34-1.03-3.84-1-1.98.03-3.8 1.15-4.82 2.92-2.05 3.56-.52 8.82 1.48 11.71.98 1.41 2.14 3 3.66 2.94 1.47-.06 2.03-.95 3.81-.95 1.78 0 2.28.95 3.84.92 1.58-.03 2.59-1.44 3.56-2.86 1.12-1.64 1.58-3.23 1.61-3.31-.04-.02-3.09-1.18-3.13-4.72zM14.5 4.09c.81-.98 1.36-2.34 1.21-3.69-1.17.05-2.59.78-3.43 1.75-.75.86-1.41 2.24-1.24 3.56 1.31.1 2.64-.65 3.46-1.62z"/>
    </svg>
  );
}

// Category map
const CATEGORIES: { icon: LucideIcon; l: string }[] = [
  { icon: Plane, l: "Voyage" }, { icon: Car, l: "Voiture" }, { icon: Building, l: "Immobilier" },
  { icon: Zap, l: "Urgence" }, { icon: GraduationCap, l: "Formation" }, { icon: Star, l: "Autre" },
];

// ---------- screens ----------
function WelcomeScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-col h-full relative screen-enter" style={{ background: C.bg, color: C.text }}>
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: C.primary }}>
          <div className="w-8 h-6 rounded-md border-2" style={{ borderColor: C.onPrimary }} />
        </div>
        <div style={{ color: C.text, fontSize: 32, fontWeight: 800, letterSpacing: -0.5, fontFamily: "Syne, sans-serif" }}>WiseWallet</div>
        <div className="mt-12 text-center" style={{ color: C.text, fontSize: 36, fontWeight: 800, fontFamily: "Syne, sans-serif", lineHeight: 1.1 }}>
          Gérez. Épargnez. <span style={{ color: C.secondary }}>Atteignez.</span>
        </div>
        <div className="mt-4 text-center" style={{ color: C.text2, fontSize: 15 }}>
          Votre argent, enfin organisé.
        </div>
      </div>
      <div className="px-6 pb-12 space-y-3">
        <PrimaryButton onClick={() => go("signup")}>Commencer</PrimaryButton>
        <GhostButton onClick={() => go("home")}>J'ai déjà un compte</GhostButton>
      </div>
    </div>
  );
}

function SignupScreen({ go, setFirstName, firstName }: { go: (s: Screen) => void; firstName: string; setFirstName: (n: string) => void }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const inputStyle = { background: C.surface, color: C.text, border: `1px solid ${C.border}`, fontSize: 15 };
  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <StatusBar />
      <Header title="Créer un compte" onBack={() => go("welcome")} />
      <ScreenBody pad={false}>
        <div className="px-6">
          <div className="mb-4">
            <div style={{ color: C.text2, fontSize: 13, fontWeight: 500 }} className="mb-2">Prénom</div>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alex"
              className="w-full h-12 rounded-[12px] px-4 outline-none focus:border-[#C9FF27]" style={inputStyle} />
          </div>
          <div className="mb-4">
            <div style={{ color: C.text2, fontSize: 13, fontWeight: 500 }} className="mb-2">Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="alex@email.com"
              className="w-full h-12 rounded-[12px] px-4 outline-none focus:border-[#C9FF27]" style={inputStyle} />
          </div>
          <div className="mb-4">
            <div style={{ color: C.text2, fontSize: 13, fontWeight: 500 }} className="mb-2">Mot de passe</div>
            <div className="relative">
              <input value={pwd} onChange={(e) => setPwd(e.target.value)} type={show ? "text" : "password"} placeholder="••••••••"
                className="w-full h-12 rounded-[12px] pl-4 pr-12 outline-none focus:border-[#C9FF27]" style={inputStyle} />
              <button onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {show ? <EyeOff size={18} strokeWidth={STROKE} color={C.text2} /> : <Eye size={18} strokeWidth={STROKE} color={C.text2} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: C.border }} />
            <span style={{ color: C.text2, fontSize: 12 }}>ou continuer avec</span>
            <div className="flex-1 h-px" style={{ background: C.border }} />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="h-12 rounded-[12px] flex items-center justify-center gap-2 transition active:scale-[0.98]"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontWeight: 500 }}>
              <GoogleIcon />Google
            </button>
            <button className="h-12 rounded-[12px] flex items-center justify-center gap-2 transition active:scale-[0.98]"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 14, fontWeight: 500 }}>
              <AppleIcon />Apple
            </button>
          </div>
        </div>
      </ScreenBody>
      <div className="px-6 pb-6 space-y-3">
        <PrimaryButton onClick={() => go("home")}>Créer mon compte</PrimaryButton>
        <div className="text-center" style={{ color: C.text2, fontSize: 12 }}>
          En continuant, vous acceptez nos CGU
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ go, firstName, goals }: { go: (s: Screen) => void; firstName: string; goals: Goal[] }) {
  const initial = (firstName || "A")[0].toUpperCase();
  const balance = useCountUp(284700, 1400);
  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: C.bg }}>
      <StatusBar />
      <div className="flex items-center justify-between px-6 pt-2 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.primary, color: C.onPrimary, fontWeight: 600 }}>{initial}</div>
          <div style={{ color: C.text, fontSize: 22, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>Bonjour, {firstName || "Alex"} 👋</div>
        </div>
        <button onClick={() => go("notifications")} className="relative w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95" style={{ background: C.surface, boxShadow: SHADOW }}>
          <Bell size={ICON} strokeWidth={STROKE} color={C.text} fill="none" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: C.primary }} />
        </button>
      </div>
      <ScreenBody>
        <div className="px-6">
          <div className="rounded-[20px] p-5" style={{ background: C.card, boxShadow: SHADOW }}>
            <div style={{ color: C.text2, fontSize: 12 }}>Solde disponible</div>
            <div style={{ color: C.text, fontSize: 32, fontWeight: 700, letterSpacing: -0.5 , fontFamily: "Syne, sans-serif" }} className="mt-2">
              {(balance / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <div className="flex items-center justify-between mt-3">
              <div>
                <span style={{ color: C.text2, fontSize: 12 }}>Ce mois-ci </span>
                <span style={{ color: C.danger, fontSize: 15, fontWeight: 600 }}>-342,00 €</span>
              </div>
              <div className="px-3 py-1 rounded-full" style={{ background: C.successSoft, color: C.success, fontSize: 12, fontWeight: 600 }}>+3,2%</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { icon: ArrowUpRight, label: "Virer" },
              { icon: ArrowDownLeft, label: "Recevoir" },
              { icon: BarChart3, label: "Analyser" },
              { icon: MoreHorizontal, label: "Plus" },
            ].map((a) => (
              <button key={a.label} className="h-16 rounded-[14px] flex flex-col items-center justify-center gap-1 transition active:scale-95 active:bg-[#F0FFAA]" style={{ background: C.surface, boxShadow: SHADOW }}>
                <a.icon size={ICON} strokeWidth={STROKE} color={C.text} fill="none" />
                <span style={{ color: C.text, fontSize: 12 }}>{a.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 mb-2">
            <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>Transactions récentes</div>
            <button onClick={() => go("transactions")} style={{ color: C.link, fontSize: 12, fontWeight: 500 }}>Voir tout</button>
          </div>
          {TXS.slice(0, 3).map((t, i) => (
            <div key={t.id} style={{ animation: `slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms both` }}>
              <TxRow t={t} onClick={() => go("txDetail")} />
            </div>
          ))}

          <div className="flex items-center justify-between mt-6 mb-2">
            <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>Mes objectifs</div>
            <button onClick={() => go("goalStep1")} className="w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95" style={{ background: C.primary }}>
              <Plus size={16} strokeWidth={STROKE} color={C.onPrimary} />
            </button>
          </div>

          {goals.length === 0 ? (
            <div
              className="rounded-[20px] p-5 flex flex-col items-center text-center"
              style={{ background: C.card, border: `1px dashed ${C.primary}` }}
            >
              <Archive size={32} color={C.text2} strokeWidth={STROKE} fill="none" />
              <div style={{ color: C.text2, fontSize: 14 }} className="mt-2">Aucun objectif créé</div>
              <button onClick={() => go("goalStep1")} style={{ color: C.link, fontSize: 14, fontWeight: 600 }} className="mt-2">
                Créer mon premier objectif
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((g) => <GoalCard key={g.id} g={g} onClick={() => go("goalDetail")} />)}
            </div>
          )}
        </div>
      </ScreenBody>
      <BottomNav active="home" go={go} />
    </div>
  );
}

function GoalCard({ g, onClick }: { g: Goal; onClick?: () => void }) {
  const pct = Math.min(100, Math.round((g.saved / g.amount) * 100));
  const GIcon = g.icon;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <button onClick={onClick} className="w-full rounded-[20px] p-4 flex items-center gap-3 text-left transition active:scale-[0.99]" style={{ background: C.card, boxShadow: SHADOW }}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: C.primarySoft }}>
        <GIcon size={24} color={C.secondary} strokeWidth={STROKE} fill="none" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div style={{ color: C.text, fontSize: 15, fontWeight: 600 }} className="truncate">{g.name}</div>
          <div style={{ color: C.text2, fontSize: 11 }}>{g.targetDate}</div>
        </div>
        <div className="h-1.5 rounded-full mt-2" style={{ background: C.border }}>
          <div className="h-full rounded-full" style={{ width: `${width}%`, background: C.primary, transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div style={{ color: C.text2, fontSize: 11 }}>{g.saved.toLocaleString("fr-FR")} € / {g.amount.toLocaleString("fr-FR")} €</div>
          <div style={{ color: C.link, fontSize: 11, fontWeight: 600 }}>{pct}%</div>
        </div>
      </div>
    </button>
  );
}

function TransactionsScreen({ go }: { go: (s: Screen) => void }) {
  const [month, setMonth] = useState("Avr");
  const [filter, setFilter] = useState("Tout");

  const filtered = useMemo(() => {
    if (filter === "Dépenses") return TXS.filter((t) => t.amount < 0);
    if (filter === "Revenus") return TXS.filter((t) => t.amount > 0);
    return TXS;
  }, [filter]);

  const grouped = useMemo(() => {
    const map: Record<string, Tx[]> = {};
    filtered.forEach((t) => (map[t.dateLabel] ||= []).push(t));
    return map;
  }, [filtered]);

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: C.bg }}>
      <StatusBar />
      <Header title="Transactions" large />
      <ScreenBody>
        <div className="px-6">
          <div className="flex gap-2 mb-4">
            {["Fév", "Mar", "Avr"].map((m) => (
              <button key={m} onClick={() => setMonth(m)} className="px-4 h-9 rounded-full transition active:scale-95"
                style={{ background: month === m ? C.primary : C.surface, color: month === m ? C.onPrimary : C.text2, fontSize: 13, fontWeight: 500, boxShadow: month === m ? "none" : SHADOW }}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {["Tout", "Dépenses", "Revenus"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className="px-4 h-9 rounded-full whitespace-nowrap transition active:scale-95"
                style={{ background: filter === f ? C.primary : C.surface, color: filter === f ? C.onPrimary : C.text2, border: `1px solid ${filter === f ? C.primary : C.border}`, fontSize: 13, fontWeight: 500 }}>
                {f}
              </button>
            ))}
          </div>
          <div className="rounded-[20px] p-4 flex justify-between mb-4" style={{ background: C.card, boxShadow: SHADOW }}>
            <div>
              <div style={{ color: C.text2, fontSize: 12 }}>Dépenses</div>
              <div style={{ color: C.danger, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>-1 247 €</div>
            </div>
            <div className="text-right">
              <div style={{ color: C.text2, fontSize: 12 }}>Revenus</div>
              <div style={{ color: C.success, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>+2 100 €</div>
            </div>
          </div>
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="mb-2">
              <div style={{ color: C.text2, fontSize: 12 }} className="mb-1 mt-3">{date}</div>
              {items.map((t, i) => (
                <div key={t.id} style={{ animation: `slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms both` }}>
                  <TxRow t={t} onClick={() => go("txDetail")} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScreenBody>
      <BottomNav active="transactions" go={go} />
    </div>
  );
}

function TxDetailScreen({ go }: { go: (s: Screen) => void }) {
  const [selected, setSelected] = useState("Alimentation");
  const alts = [
    { e: "🚗", l: "Transport" }, { e: "🎬", l: "Loisirs" }, { e: "💊", l: "Santé" },
    { e: "🛍️", l: "Shopping" }, { e: "🏠", l: "Logement" }, { e: "•••", l: "Autre" },
  ];
  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <StatusBar />
      <Header title="Transaction" onBack={() => go("home")} right={<button style={{ color: C.text2, fontSize: 12 }}>Ignorer</button>} />
      <ScreenBody pad={false}>
        <div className="px-6 flex flex-col items-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#FF8A3D1A" }}>
            <span style={{ fontSize: 26 }}>🛒</span>
          </div>
          <div style={{ color: C.text, fontSize: 28, fontWeight: 700 , fontFamily: "Syne, sans-serif" }} className="mt-3">Carrefour City</div>
          <div style={{ color: C.danger, fontSize: 32, fontWeight: 700 , fontFamily: "Syne, sans-serif" }} className="mt-1">-23,40 €</div>
          <div style={{ color: C.text2, fontSize: 12 }} className="mt-1">Aujourd'hui · 14h32</div>
          <div style={{ color: C.text2, fontSize: 12 }}>Paris, France</div>
        </div>
        <div className="px-6 mt-6">
          <div style={{ color: C.text2, fontSize: 11, letterSpacing: 1 }} className="uppercase mb-2">Catégorie détectée</div>
          <div className="w-full h-12 rounded-full flex items-center justify-center gap-2"
            style={{ background: C.primary, color: C.onPrimary, fontSize: 15, fontWeight: 600 }}>
            🛒 Alimentation
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {alts.map((a) => (
              <button key={a.l} onClick={() => setSelected(a.l)} className="h-12 rounded-full flex items-center justify-center gap-1 transition active:scale-95"
                style={{
                  background: selected === a.l ? C.primarySoft : C.surface,
                  border: `1px solid ${selected === a.l ? C.primary : C.border}`,
                  color: C.text, fontSize: 13, fontWeight: 500,
                }}>
                <span>{a.e}</span><span>{a.l}</span>
              </button>
            ))}
          </div>
          <input placeholder="Ajouter une note..." className="w-full h-12 rounded-[12px] px-4 outline-none mt-4 focus:border-[#C9FF27]"
            style={{ background: C.surface, color: C.text, border: `1px solid ${C.border}`, fontSize: 14 }} />
        </div>
      </ScreenBody>
      <div className="px-6 pb-6">
        <PrimaryButton onClick={() => go("home")}>Confirmer</PrimaryButton>
      </div>
    </div>
  );
}

function GoalsScreen({ go, goals }: { go: (s: Screen) => void; goals: Goal[] }) {
  const pop = [
    { icon: Plane, t: "Voyage", a: "1 500€" },
    { icon: Car, t: "Voiture", a: "5 000€" },
    { icon: Building, t: "Apport", a: "20 000€" },
  ];
  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: C.bg }}>
      <StatusBar />
      <div className="px-6 pt-2 pb-2">
        <div style={{ color: C.text, fontSize: 28, fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>Mes Objectifs</div>
        <div style={{ color: C.text2, fontSize: 15 }} className="mt-1">Épargnez avec intention</div>
      </div>
      <ScreenBody>
        {goals.length === 0 ? (
          <>
            <div className="px-6 mt-8 flex flex-col items-center text-center">
              <Target size={64} color={C.primary} strokeWidth={1} fill="none" />
              <div style={{ color: C.text, fontSize: 22, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-4">Vous n'avez pas encore d'objectif</div>
              <div style={{ color: C.text2, fontSize: 13 }} className="mt-2 max-w-[280px]">
                Les utilisateurs avec un objectif épargnent 3x plus
              </div>
              <div className="w-full mt-6">
                <PrimaryButton onClick={() => go("goalStep1")}>Créer un objectif</PrimaryButton>
              </div>
            </div>
            <div className="mt-8">
              <div className="px-6" style={{ color: C.text2, fontSize: 11, letterSpacing: 1 }}>OBJECTIFS POPULAIRES</div>
              <div className="flex gap-3 px-6 mt-3 overflow-x-auto pb-2">
                {pop.map((p) => {
                  const PIcon = p.icon;
                  return (
                  <button key={p.t} onClick={() => go("goalStep1")} className="rounded-[20px] p-4 shrink-0 text-left transition active:scale-[0.98]"
                    style={{ background: C.card, width: 160, boxShadow: SHADOW }}>
                    <PIcon size={32} color={C.secondary} strokeWidth={STROKE} fill="none" />
                    <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-3">{p.t}</div>
                    <div style={{ color: C.text2, fontSize: 12 }} className="mt-1">{p.a}</div>
                  </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="px-6">
            <div className="mb-4">
              <PrimaryButton onClick={() => go("goalStep1")}>Créer un objectif</PrimaryButton>
            </div>
            <div className="space-y-3">
              {goals.map((g) => <GoalCard key={g.id} g={g} onClick={() => go("goalDetail")} />)}
            </div>
          </div>
        )}
      </ScreenBody>
      <BottomNav active="goals" go={go} />
    </div>
  );
}

function ProgressHeader({ onBack, step }: { onBack: () => void; step: 1 | 2 | 3 }) {
  return (
    <>
      <Header title={step === 3 ? "Récapitulatif" : "Nouvel objectif"} onBack={onBack}
        right={<span style={{ color: C.text2, fontSize: 12 }}>{step} / 3</span>} />
      <div className="px-6 mb-4">
        <div className="h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(step / 3) * 100}%`, background: C.primary }} />
        </div>
      </div>
    </>
  );
}

function GoalStep1({ go, draft, setDraft }: { go: (s: Screen) => void; draft: Partial<Goal>; setDraft: (d: Partial<Goal>) => void }) {
  const ready = !!draft.name && !!draft.category;
  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <StatusBar />
      <ProgressHeader onBack={() => go("goals")} step={1} />
      <ScreenBody pad={false}>
        <div className="px-6">
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>Quel est votre objectif ?</div>
          <div style={{ color: C.text2, fontSize: 13, fontWeight: 500 }} className="mt-4 mb-2">Nom de l'objectif</div>
          <input value={draft.name || ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Ex: Voyage au Japon" className="w-full h-12 rounded-[12px] px-4 outline-none focus:border-[#C9FF27]"
            style={{ background: C.surface, color: C.text, border: `1px solid ${C.border}`, fontSize: 15 }} />
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-6">Choisissez une catégorie</div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {CATEGORIES.map((c) => {
              const sel = draft.category === c.l;
              const CIcon = c.icon;
              return (
                <button key={c.l} onClick={() => setDraft({ ...draft, category: c.l, icon: c.icon })}
                  className="h-24 rounded-[14px] flex flex-col items-center justify-center gap-1 transition active:scale-95"
                  style={{
                    background: sel ? C.primarySoft : C.surface,
                    border: `1px solid ${sel ? C.primary : C.border}`,
                    boxShadow: sel ? "none" : SHADOW,
                  }}>
                  <CIcon size={28} color={C.secondary} strokeWidth={STROKE} fill="none" />
                  <span style={{ color: C.text, fontSize: 12 }}>{c.l}</span>
                </button>
              );
            })}
          </div>
        </div>
      </ScreenBody>
      <div className="px-6 pb-6">
        <PrimaryButton onClick={() => go("goalStep2")} disabled={!ready}>Suivant</PrimaryButton>
      </div>
    </div>
  );
}

function GoalStep2({ go, draft, setDraft }: { go: (s: Screen) => void; draft: Partial<Goal> & { _amountStr?: string; _month?: number; _year?: number }; setDraft: (d: any) => void }) {
  const now = new Date();
  const amountStr = draft._amountStr ?? "";
  const month = draft._month ?? (now.getMonth() + 12) % 12;
  const year = draft._year ?? now.getFullYear() + 1;
  const amount = Number(amountStr.replace(",", ".")) || 0;

  const targetDate = new Date(year, month, 1);
  const monthsBetween = Math.max(1, (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth()));
  const monthly = amount / monthsBetween;

  const tap = (k: string) => {
    let v = amountStr;
    if (k === "<") v = v.slice(0, -1);
    else if (k === ".") v = v.includes(".") ? v : (v || "0") + ".";
    else v = v + k;
    setDraft({ ...draft, _amountStr: v, amount });
  };
  const keys = ["1","2","3","4","5","6","7","8","9",".","0","<"];
  const hasVal = amountStr.length > 0 && amount > 0;

  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <StatusBar />
      <ProgressHeader onBack={() => go("goalStep1")} step={2} />
      <ScreenBody pad={false}>
        <div className="px-6">
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>Combien souhaitez-vous épargner ?</div>
          <div className="text-center mt-4" style={{
            color: C.text, fontSize: 32, fontWeight: 700,
            opacity: hasVal ? 1 : 0.4,
            fontFamily: "Syne, sans-serif",
          }}>
            {hasVal ? `${amount.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €` : "0 €"}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {keys.map((k) => (
              <button key={k} onClick={() => tap(k)}
                className="h-14 rounded-[14px] flex items-center justify-center transition active:scale-95"
                style={{ background: C.surface, color: C.text, fontSize: 20, fontWeight: 600, boxShadow: SHADOW , fontFamily: "Syne, sans-serif" }}>
                {k === "<" ? <Delete size={18} strokeWidth={STROKE} color={C.text} /> : k}
              </button>
            ))}
          </div>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-5">Pour quand ?</div>
          <div className="flex gap-3 mt-3">
            <select value={month} onChange={(e) => setDraft({ ...draft, _month: Number(e.target.value) })}
              className="flex-1 h-11 rounded-full px-4 outline-none" style={{ background: C.surface, color: C.text, fontSize: 14, border: `1px solid ${C.border}` }}>
              {MONTHS_FR.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setDraft({ ...draft, _year: Number(e.target.value) })}
              className="flex-1 h-11 rounded-full px-4 outline-none" style={{ background: C.surface, color: C.text, fontSize: 14, border: `1px solid ${C.border}` }}>
              {[0,1,2,3,4].map((o) => <option key={o} value={now.getFullYear() + o}>{now.getFullYear() + o}</option>)}
            </select>
          </div>
          <div className="rounded-[20px] p-4 mt-4" style={{ background: C.card, boxShadow: SHADOW }}>
            <div style={{ color: C.text2, fontSize: 12 }}>À épargner par mois</div>
            <div style={{ color: C.link, fontSize: 22, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-1">
              {monthly.toLocaleString("fr-FR", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} €
            </div>
            <div style={{ color: C.text2, fontSize: 12 }} className="mt-1">sur {monthsBetween} mois</div>
          </div>
        </div>
      </ScreenBody>
      <div className="px-6 pb-6">
        <PrimaryButton onClick={() => {
          setDraft({ ...draft, amount, durationMonths: monthsBetween, targetDate: `${MONTHS_FR[month].slice(0,3)} ${year}` });
          go("goalStep3");
        }} disabled={!hasVal}>Suivant</PrimaryButton>
      </div>
    </div>
  );
}

function GoalStep3({ go, draft, onCreate }: { go: (s: Screen) => void; draft: Partial<Goal>; onCreate: () => void }) {
  const [remind, setRemind] = useState(true);
  const amount = draft.amount || 0;
  const months = draft.durationMonths || 1;
  const monthly = amount / months;
  const rows: [string, string, boolean?][] = [
    ["Montant cible", `${amount.toLocaleString("fr-FR")} €`],
    ["Durée", `${months} mois`],
    ["Par mois", `${monthly.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} €`, true],
    ["Date cible", draft.targetDate || "-"],
  ];
  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <StatusBar />
      <ProgressHeader onBack={() => go("goalStep2")} step={3} />
      <ScreenBody pad={false}>
        <div className="px-6">
          <div className="rounded-[20px] p-5" style={{ background: C.card, boxShadow: SHADOW }}>
            <div className="flex justify-center">
              {draft.icon
                ? <draft.icon size={48} color={C.secondary} strokeWidth={1} fill="none" />
                : <Target size={48} color={C.secondary} strokeWidth={1} fill="none" />}
            </div>
            <div className="text-center mt-2" style={{ color: C.text, fontSize: 28, fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>{draft.name || "Mon objectif"}</div>
            <div className="h-px my-4" style={{ background: C.border }} />
            {rows.map(([l, v, p]) => (
              <div key={l} className="flex justify-between py-2">
                <div style={{ color: C.text2, fontSize: 14 }}>{l}</div>
                <div style={{ color: p ? C.link : C.text, fontSize: 16, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-5 p-4 rounded-[14px]" style={{ background: C.surface, boxShadow: SHADOW }}>
            <span style={{ color: C.text, fontSize: 14 }}>Activer les rappels mensuels</span>
            <button onClick={() => setRemind((r) => !r)} className="w-11 h-6 rounded-full relative transition"
              style={{ background: remind ? C.primary : C.border }}>
              <div className="absolute top-0.5 w-5 h-5 rounded-full transition" style={{ background: "#fff", left: remind ? 22 : 2, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>
          <div className="text-center mt-3" style={{ color: C.text2, fontSize: 12 }}>
            Vous pourrez modifier cela à tout moment
          </div>
        </div>
      </ScreenBody>
      <div className="px-6 pb-6">
        <PrimaryButton onClick={() => { onCreate(); go("goalCreated"); }}>Créer mon objectif 🎯</PrimaryButton>
      </div>
    </div>
  );
}

function GoalCreatedScreen({ go, goal }: { go: (s: Screen) => void; goal?: Goal }) {
  const monthly = goal ? goal.amount / goal.durationMonths : 0;
  return (
    <div className="flex flex-col h-full screen-fade" style={{ background: C.bg }}>
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="relative w-32 h-32 rounded-full flex items-center justify-center" style={{ background: C.successSoft, boxShadow: `0 0 60px ${C.success}55` }}>
          <Trophy size={48} color={C.success} strokeWidth={1.5} fill="none" />
        </div>
        <div style={{ color: C.text, fontSize: 32, fontWeight: 700 , fontFamily: "Syne, sans-serif" }} className="mt-6">Objectif créé !</div>
        <div style={{ color: C.text2, fontSize: 15 }} className="mt-3 max-w-[300px]">
          Votre objectif {goal?.name} est lancé. Épargnez {monthly.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}€/mois pour y arriver.
        </div>
        <div className="w-full mt-8">
          <div className="h-2 rounded-full" style={{ background: C.border }}>
            <div className="h-full rounded-full" style={{ width: "0%", background: C.primary }} />
          </div>
          <div style={{ color: C.text2, fontSize: 12 }} className="mt-2">0 € / {goal?.amount.toLocaleString("fr-FR")} €</div>
        </div>
      </div>
      <div className="px-6 pb-12 space-y-3">
        <PrimaryButton onClick={() => go("goalDetail")}>Voir mon objectif</PrimaryButton>
        <GhostButton onClick={() => go("home")}>Retour à l'accueil</GhostButton>
      </div>
    </div>
  );
}

function GoalDetailScreen({ go, goal }: { go: (s: Screen) => void; goal?: Goal }) {
  if (!goal) return null;
  const pct = Math.round((goal.saved / goal.amount) * 100);
  const monthly = goal.amount / goal.durationMonths;
  const R = 56;
  const circ = 2 * Math.PI * R;
  const [dash, setDash] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDash((pct / 100) * circ), 150);
    return () => clearTimeout(t);
  }, [pct, circ]);
  return (
    <div className="flex flex-col h-full" style={{ background: C.bg }}>
      <StatusBar />
      <Header title={goal.name} onBack={() => go("goals")}
        right={<IconBtn><Pencil size={16} strokeWidth={STROKE} color={C.text} fill="none" /></IconBtn>} />
      <ScreenBody>
        <div className="px-6">
          <div className="rounded-[20px] p-5" style={{ background: C.card, boxShadow: SHADOW }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <goal.icon size={32} color={C.secondary} strokeWidth={STROKE} fill="none" />
                <span style={{ color: C.text, fontSize: 22, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>{goal.category}</span>
              </div>
              <span className="px-3 py-1 rounded-full" style={{ background: C.successSoft, color: C.success, fontSize: 12, fontWeight: 600 }}>En cours</span>
            </div>
            <div className="flex justify-center mt-6">
              <div className="relative w-32 h-32">
                <svg width="128" height="128" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r={R} stroke={C.border} strokeWidth="10" fill="none" />
                  <circle cx="64" cy="64" r={R} stroke={C.primary} strokeWidth="10" fill="none"
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                    transform="rotate(-90 64 64)"
                    style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div style={{ color: C.text, fontSize: 24, fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>{goal.saved} €</div>
                  <div style={{ color: C.text2, fontSize: 11 }}>sur {goal.amount.toLocaleString("fr-FR")} €</div>
                  <div style={{ color: C.link, fontSize: 11, fontWeight: 600 }}>{pct}%</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              ["Par mois", `${monthly.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} €`],
              ["Restant", `${(goal.amount - goal.saved).toLocaleString("fr-FR")} €`],
              ["Date", goal.targetDate],
            ].map(([l, v]) => (
              <div key={l} className="rounded-[14px] p-3 text-center" style={{ background: C.surface, boxShadow: SHADOW }}>
                <div style={{ color: C.text2, fontSize: 11 }}>{l}</div>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }} className="mt-1">{v}</div>
              </div>
            ))}
          </div>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-6">Historique des versements</div>
          <div className="text-center py-8" style={{ color: C.text2, fontSize: 13 }}>
            Aucun versement pour l'instant
          </div>
        </div>
      </ScreenBody>
      <div className="absolute left-0 right-0 px-6" style={{ bottom: 80 + 34 + 12 }}>
        <PrimaryButton>Ajouter un versement</PrimaryButton>
      </div>
      <BottomNav active="goals" go={go} />
    </div>
  );
}

function AnalysisScreen({ go }: { go: (s: Screen) => void }) {
  const segs = [
    { l: "Alimentation", v: 35, c: "#FF8A3D", amt: "436 €" },
    { l: "Transport", v: 20, c: "#0404E2", amt: "249 €" },
    { l: "Loisirs", v: 18, c: "#E53E5A", amt: "224 €" },
    { l: "Shopping", v: 15, c: "#F2C94C", amt: "187 €" },
    { l: "Santé", v: 12, c: "#00C896", amt: "151 €" },
  ];
  const evolution = [
    { m: "Jan", r: 2100, d: 980 },
    { m: "Fév", r: 2100, d: 1247 },
    { m: "Mar", r: 2100, d: 1100 },
    { m: "Avr", r: 2100, d: 1247 },
  ];
  const max = Math.max(...evolution.flatMap((e) => [e.r, e.d]));
  const hasData = evolution.some((e) => e.r > 0 || e.d > 0);

  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: C.bg }}>
      <StatusBar />
      <div className="px-6 pt-2 pb-4">
        <div style={{ color: C.text, fontSize: 28, fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>Analyse</div>
      </div>
      <ScreenBody>
        <div className="px-6">
          <div className="flex justify-center mb-4">
            <div className="px-4 h-9 rounded-full flex items-center gap-3" style={{ background: C.surface, boxShadow: SHADOW }}>
              <span style={{ color: C.text2 }}>‹</span>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>Avril 2026</span>
              <span style={{ color: C.text2 }}>›</span>
            </div>
          </div>
          <div className="rounded-[20px] p-4 flex justify-between" style={{ background: C.card, boxShadow: SHADOW }}>
            <div>
              <div style={{ color: C.text2, fontSize: 12 }}>Revenus</div>
              <div style={{ color: C.success, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>+2 100 €</div>
            </div>
            <div className="text-right">
              <div style={{ color: C.text2, fontSize: 12 }}>Dépenses</div>
              <div style={{ color: C.danger, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }}>-1 247 €</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {segs.map((s) => (
              <div key={s.l}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.c }} />
                    <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{s.l}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: C.text2, fontSize: 12 }}>{s.v}%</span>
                    <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{s.amt}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
                  <div className="h-full rounded-full" style={{ width: `${s.v * 2}%`, background: s.c }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-6">Évolution mensuelle</div>
          <div className="rounded-[20px] p-4 mt-3 relative" style={{ background: C.card, boxShadow: SHADOW }}>
            {!hasData && (
              <div className="absolute inset-0 flex items-center justify-center" style={{ color: C.text2, fontSize: 13 }}>
                Pas encore de données
              </div>
            )}
            <div className="relative" style={{ height: 160 }}>
              <svg width="100%" height="140" viewBox="0 0 300 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradRevenu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.success} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={C.success} stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradDepense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.danger} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={C.danger} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {hasData && (() => {
                  const W = 300, H = 120, pad = 20;
                  const xs = evolution.map((_, i) => pad + (i / (evolution.length - 1)) * (W - pad * 2));
                  const toY = (v: number) => H - pad - ((v / max) * (H - pad * 2));
                  const line = (vals: number[]) =>
                    vals.map((v, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${toY(v)}`).join(" ");
                  const area = (vals: number[]) =>
                    line(vals) + ` L ${xs[xs.length - 1]} ${H} L ${xs[0]} ${H} Z`;
                  const revenues = evolution.map(e => e.r);
                  const depenses = evolution.map(e => e.d);
                  return (
                    <>
                      <path d={area(revenues)} fill="url(#gradRevenu)" />
                      <path d={area(depenses)} fill="url(#gradDepense)" />
                      <path d={line(revenues)} fill="none" stroke={C.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="300" strokeDashoffset="300" style={{ animation: "drawLine 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards" }} />
                      <path d={line(depenses)} fill="none" stroke={C.danger} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="300" strokeDashoffset="300" style={{ animation: "drawLine 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards" }} />
                      {revenues.map((v, i) => (
                        <circle key={`r${i}`} cx={xs[i]} cy={toY(v)} r="4" fill={C.success} stroke={C.card} strokeWidth="2" />
                      ))}
                      {depenses.map((v, i) => (
                        <circle key={`d${i}`} cx={xs[i]} cy={toY(v)} r="4" fill={C.danger} stroke={C.card} strokeWidth="2" />
                      ))}
                    </>
                  );
                })()}
              </svg>
              <div className="flex justify-between px-5">
                {evolution.map((e) => (
                  <div key={e.m} style={{ color: C.text2, fontSize: 11 }}>{e.m}</div>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{ background: C.success }} />
                <span style={{ color: C.text2, fontSize: 11 }}>Revenus</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{ background: C.danger }} />
                <span style={{ color: C.text2, fontSize: 11 }}>Dépenses</span>
              </div>
            </div>
          </div>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-6 mb-2">Top catégories ce mois</div>
          {segs.slice(0, 3).map((s) => (
            <div key={s.l} className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${s.c}1A` }}>
                <div className="w-4 h-4 rounded-full" style={{ background: s.c }} />
              </div>
              <div className="flex-1">
                <div style={{ color: C.text, fontSize: 14 }}>{s.l}</div>
                <div className="h-1.5 rounded-full mt-1" style={{ background: C.border }}>
                  <div className="h-full rounded-full" style={{ width: `${s.v * 2}%`, background: s.c }} />
                </div>
              </div>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{s.amt}</div>
            </div>
          ))}
        </div>
      </ScreenBody>
      <BottomNav active="analysis" go={go} />
    </div>
  );
}

function NotificationsScreen({ go, firstName }: { go: (s: Screen) => void; firstName: string }) {
  void firstName;
  const notifs = [
    { g: "Aujourd'hui", items: [
      { c: C.danger, t: "Dépense importante", d: "Carrefour City · 23,40€", time: "14h32", unread: true },
      { c: C.primary, t: "Rappel d'objectif", d: "N'oubliez pas votre versement", time: "09h00", unread: true },
    ]},
    { g: "Cette semaine", items: [
      { c: C.secondary, t: "Astuce", d: "Économisez 10% ce mois-ci", time: "Hier", unread: false },
      { c: C.danger, t: "Alerte transaction", d: "Netflix · 13,99€", time: "2j", unread: false },
    ]},
  ];
  return (
    <div className="flex flex-col h-full screen-fade" style={{ background: C.bg }}>
      <StatusBar />
      <div className="flex items-center justify-between px-6 pt-2 pb-4">
        <IconBtn onClick={() => go("home")}><ArrowLeft size={ICON} strokeWidth={STROKE} color={C.text} fill="none" /></IconBtn>
        <div style={{ color: C.text, fontSize: 22, fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>Notifications</div>
        <button style={{ color: C.primary, fontSize: 12, fontWeight: 500 }}>Tout lu</button>
      </div>
      <ScreenBody pad={false}>
        <div className="px-6">
          {notifs.map((g) => (
            <div key={g.g} className="mb-5">
              <div style={{ color: C.text2, fontSize: 12 }} className="mb-2">{g.g}</div>
              {g.items.map((n, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-[14px] mb-2"
                  style={{ background: n.unread ? C.surface : "transparent", boxShadow: n.unread ? SHADOW : "none" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${n.c}1A` }}>
                    <div className="w-4 h-4 rounded-full" style={{ background: n.c }} />
                  </div>
                  <div className="flex-1">
                    <div style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{n.t}</div>
                    <div style={{ color: C.text2, fontSize: 12 }}>{n.d}</div>
                  </div>
                  <div style={{ color: C.text2, fontSize: 11 }}>{n.time}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScreenBody>
    </div>
  );
}

function ProfileScreen({ go, firstName }: { go: (s: Screen) => void; firstName: string }) {
  const Item = ({ label }: { label: string }) => (
    <button className="w-full h-14 rounded-[14px] flex items-center px-4 mb-2 transition active:scale-[0.99]"
      style={{ background: C.surface, boxShadow: SHADOW }}>
      <div className="w-8 h-8 rounded-full mr-3" style={{ background: C.primarySoft }} />
      <span className="flex-1 text-left" style={{ color: C.text, fontSize: 15 }}>{label}</span>
      <ChevronRight size={16} strokeWidth={STROKE} color={C.text2} fill="none" />
    </button>
  );
  const initial = (firstName || "A")[0].toUpperCase();
  return (
    <div className="flex flex-col h-full screen-enter" style={{ background: C.bg }}>
      <StatusBar />
      <div className="px-6 pt-2 pb-4">
        <div style={{ color: C.text, fontSize: 28, fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>Mon Profil</div>
      </div>
      <ScreenBody>
        <div className="px-6">
          <div className="rounded-[20px] p-5 flex flex-col items-center" style={{ background: C.card, boxShadow: SHADOW }}>
            <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
              style={{ background: C.primary, color: C.onPrimary, fontSize: 28, fontWeight: 700 , fontFamily: "Syne, sans-serif" }}>{initial}</div>
            <div style={{ color: C.text, fontSize: 22, fontWeight: 600 , fontFamily: "Syne, sans-serif" }} className="mt-3">{firstName || "Alex"} Martin</div>
            <div style={{ color: C.text2, fontSize: 12 }}>{(firstName || "alex").toLowerCase()}@email.com</div>
          </div>
          <div style={{ color: C.text2, fontSize: 11, letterSpacing: 1 }} className="uppercase mt-6 mb-2">Mon compte</div>
          <Item label="Informations personnelles" />
          <Item label="Sécurité" />
          <Item label="Notifications" />
          <Item label="Abonnement" />
          <div style={{ color: C.text2, fontSize: 11, letterSpacing: 1 }} className="uppercase mt-6 mb-2">Application</div>
          <Item label="Aide & Support" />
          <Item label="Conditions d'utilisation" />
          <Item label="Politique de confidentialité" />
          <button onClick={() => go("welcome")} className="w-full h-14 flex items-center justify-center gap-2 mt-4 transition active:scale-95"
            style={{ color: C.danger, fontSize: 15, fontWeight: 600 }}>
            <LogOut size={18} strokeWidth={STROKE} color={C.danger} fill="none" />
            Se déconnecter
          </button>
        </div>
      </ScreenBody>
      <BottomNav active="profile" go={go} />
    </div>
  );
}

// ---------- app ----------
export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [firstName, setFirstName] = useState("Alex");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [draft, setDraft] = useState<Partial<Goal> & { _amountStr?: string; _month?: number; _year?: number }>({});
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);

  const go = (s: Screen) => {
    if (s === "goalStep1") setDraft({});
    setScreen(s);
  };

  const onCreate = () => {
    const id = `g${Date.now()}`;
    const g: Goal = {
      id,
      name: draft.name || "Mon objectif",
      icon: draft.icon || Target,
      category: draft.category || "Autre",
      amount: draft.amount || 0,
      saved: 0,
      durationMonths: draft.durationMonths || 1,
      targetDate: draft.targetDate || "-",
    };
    setGoals((arr) => [...arr, g]);
    setActiveGoalId(id);
  };

  const activeGoal = goals.find((g) => g.id === activeGoalId) || goals[goals.length - 1];

  const render = () => {
    switch (screen) {
      case "welcome": return <WelcomeScreen go={go} />;
      case "signup": return <SignupScreen go={go} firstName={firstName} setFirstName={setFirstName} />;
      case "home": return <HomeScreen go={go} firstName={firstName} goals={goals} />;
      case "transactions": return <TransactionsScreen go={go} />;
      case "txDetail": return <TxDetailScreen go={go} />;
      case "goals": return <GoalsScreen go={go} goals={goals} />;
      case "goalStep1": return <GoalStep1 go={go} draft={draft} setDraft={setDraft} />;
      case "goalStep2": return <GoalStep2 go={go} draft={draft} setDraft={setDraft} />;
      case "goalStep3": return <GoalStep3 go={go} draft={draft} onCreate={onCreate} />;
      case "goalCreated": return <GoalCreatedScreen go={go} goal={activeGoal} />;
      case "goalDetail": return <GoalDetailScreen go={go} goal={activeGoal} />;
      case "analysis": return <AnalysisScreen go={go} />;
      case "notifications": return <NotificationsScreen go={go} firstName={firstName} />;
      case "profile": return <ProfileScreen go={go} firstName={firstName} />;
    }
  };

  return (
    <div
      className="size-full flex items-center justify-center"
      style={{ background: "#E8E8E8", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: 390, height: 844, background: C.bg,
          borderRadius: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div className="h-full flex flex-col">{render()}</div>
      </div>
    </div>
  );
}
