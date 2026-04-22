import { useState, useEffect } from "react";
import { CriterionRow } from "./CriterionRow";
import type { CriterionStatus } from "./CriterionRow";

// ── Persistence ────────────────────────────────────────────────────────────
const STORAGE_KEY = "wisewallet_validation_state";

type ValidationState = Record<string, CriterionStatus>;

function loadState(): ValidationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ValidationState) : {};
  } catch {
    return {};
  }
}

function saveState(state: ValidationState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* quota exceeded, ignore */ }
}

// ── Criteria data ──────────────────────────────────────────────────────────
type Criterion = { id: string; label: string; testPath?: string };
type Section   = { id: string; title: string; criteria: Criterion[] };

const SECTIONS: Section[] = [
  {
    id: "mode1",
    title: "MODE 1 — Activation cluster_2",
    criteria: [
      { id: "m1_01", label: "SavingsGoalSuggestion banner apparaît après J+1", testPath: "Debug ▸ Simuler cluster_2 J+2 → GoalsScreen → vérifier le banner en bas d'écran." },
      { id: "m1_02", label: "Le banner affiche le message cluster_2 personnalisé", testPath: "Banner actif → lire le texte → doit mentionner l'objectif déclaré (ex : voyage)." },
      { id: "m1_03", label: "CTA \"Créer un objectif\" lance le flow IA", testPath: "Appuyer sur le bouton du banner → naviguer vers AIGoalEnrichment." },
      { id: "m1_04", label: "AI Enrichment : QuickReplyChips s'affichent correctement", testPath: "Écran AIGoalEnrichment → chips visibles sous la première question IA." },
      { id: "m1_05", label: "AI Enrichment : sélection d'un chip avance l'étape", testPath: "Sélectionner un chip → message utilisateur apparaît → étape suivante chargée." },
      { id: "m1_06", label: "AI Enrichment : slider mensuel apparaît en fin de flow", testPath: "Répondre à toutes les questions → MonthlySlider visible avec valeur initiale calculée." },
      { id: "m1_07", label: "AI Enrichment : le montant mensuel se met à jour en temps réel", testPath: "Déplacer le slider → texte récapitulatif mis à jour immédiatement." },
      { id: "m1_08", label: "GoalCreated : confetti au chargement de l'écran", testPath: "Valider le flow IA → GoalCreated → animation confetti se déclenche." },
      { id: "m1_09", label: "GoalCreated : résumé correct (nom, montant cible, durée)", testPath: "Vérifier les valeurs affichées vs celles saisies dans le flow IA." },
      { id: "m1_10", label: "AllocationPlan : budget slider fonctionne", testPath: "AllocationPlan → déplacer le slider total → les allocations se recalculent." },
      { id: "m1_11", label: "AllocationPlan : liste draggable (glisser-déposer)", testPath: "Maintenir un objectif → glisser → relâcher → nouvel ordre affiché." },
      { id: "m1_12", label: "AllocationPlan : l'ordre impacte l'allocation budgétaire", testPath: "Réordonner → l'objectif en tête reçoit le budget prioritaire." },
      { id: "m1_13", label: "AllocationPlan : \"Confirmer\" navigue vers Goals avec les cards V3", testPath: "Appuyer Confirmer → retour GoalsScreen avec les nouveaux GoalCardV3." },
      { id: "m1_14", label: "GoalCardV3 : badge emoji correct selon le template", testPath: "Objectif \"voyage\" → emoji ✈️, \"voiture\" → 🚗, \"urgence\" → 🛡️…" },
      { id: "m1_15", label: "GoalCardV3 : progress bar et pourcentage corrects", testPath: "Debug ▸ setGoalProgress(90) → card affiche 90% avec barre proportionnelle." },
      { id: "m1_16", label: "GoalCardV3 : montant mensuel et mois restants affichés", testPath: "Card → vérifier \"X €/mois\" et \"X mois restants\" cohérents avec le goal." },
      { id: "m1_17", label: "V3GoalDetail : bouton \"Affiner avec l'IA\" toujours visible", testPath: "Ouvrir un goal V3 → bouton présent dans le header et dans la carte IA." },
      { id: "m1_18", label: "V3GoalDetail : slider recalcule les mois en temps réel", testPath: "Déplacer slider mensuel → \"X mois\" se met à jour dynamiquement." },
      { id: "m1_19", label: "V3GoalDetail : navigation vers AIGoalEnrichment au clic IA", testPath: "Appuyer \"Affiner avec l'IA\" → écran AIGoalEnrichment avec le bon flow." },
    ],
  },
  {
    id: "mode2",
    title: "MODE 2 — Réactivation cluster_3",
    criteria: [
      { id: "m2_01", label: "Email réactivation : personnalisé avec le declaredGoal", testPath: "Debug ▸ cluster_3, declaredGoal = voyage → ReactivationEmail → emoji ✈️ + libellé voyage." },
      { id: "m2_02", label: "Email : calcul correct des mois nécessaires", testPath: "suggestedMonthly affiché → mois = ceil(targetAmount / suggestedMonthly) visible." },
      { id: "m2_03", label: "Email : phrase clé avec montant et durée personnalisés", testPath: "Lire \"En épargnant X €/mois tu y arrives en Y mois\"." },
      { id: "m2_04", label: "Email : CTA \"Reprendre mon plan\" navigue vers ReactivationQuiz", testPath: "Appuyer CTA → écran ReactivationQuiz Step 1 chargé." },
      { id: "m2_05", label: "ReactivationQuiz Step 1 : tiles projet s'affichent", testPath: "Quiz → 5 tuiles (voyage, voiture, immobilier, urgence, formation) visibles." },
      { id: "m2_06", label: "ReactivationQuiz Step 1 : sélection multiple possible", testPath: "Taper plusieurs tuiles → toutes restent sélectionnées (bord coloré visible)." },
      { id: "m2_07", label: "ReactivationQuiz Step 1 : au moins 1 sélection requise", testPath: "Bouton Suivant désactivé si 0 tile sélectionnée." },
      { id: "m2_08", label: "ReactivationQuiz Step 2 : un budget par projet sélectionné", testPath: "3 tiles sélectionnées Step 1 → Step 2 montre 3 sections budget distinctes." },
      { id: "m2_09", label: "ReactivationQuiz Step 2 : 3 options de budget correctes par type", testPath: "Section \"voiture\" → options 3 000, 8 000, 15 000 € (pas celles du voyage)." },
      { id: "m2_10", label: "ReactivationQuiz Step 3 : slider mensuel visible", testPath: "Après Step 2 → slider avec min 50, max 1 000, step 10." },
      { id: "m2_11", label: "ReactivationQuiz Step 3 : preview en temps réel", testPath: "Déplacer slider → récapitulatif des durées mis à jour instantanément." },
      { id: "m2_12", label: "ReactivationQuiz : résultat transmis à AllocationPlan", testPath: "Valider quiz → AllocationPlan pré-rempli avec les objectifs et budgets choisis." },
      { id: "m2_13", label: "AllocationPlan post-quiz : objectifs créés avec bons montants", testPath: "Vérifier que chaque GoalCardV3 a le targetAmount choisi à l'étape 2." },
      { id: "m2_14", label: "AllocationPlan post-quiz : retour Goals après confirmation", testPath: "Confirmer → GoalsScreen avec les nouveaux objectifs V3 listés." },
    ],
  },
  {
    id: "shared",
    title: "MOTEUR PARTAGÉ",
    criteria: [
      { id: "sh_01", label: "allocateBudget() distribue selon la priorité (ordre de la liste)", testPath: "Réordonner → debug state preview → savingsGoals[0].monthlyAmount le plus élevé." },
      { id: "sh_02", label: "reorderGoals() met à jour l'ordre après drag-and-drop", testPath: "Drag goal 3 en position 1 → order affiché en tête dans GoalsScreen." },
      { id: "sh_03", label: "monthsFor() calcul correct avec ceil", testPath: "target=1 200, monthly=100 → 12 mois ; target=1 201 → 13 mois." },
      { id: "sh_04", label: "fmtAmount() formate en euros avec espace milliers", testPath: "Montant 1200 → affiché \"1 200 €\"." },
      { id: "sh_05", label: "fmtMonths() formate singulier/pluriel", testPath: "Valeur 1 → \"1 mois\", valeur 6 → \"6 mois\"." },
      { id: "sh_06", label: "matchTemplate() retourne le bon template par declaredGoal", testPath: "voyage → { emoji: ✈️, label: Voyage }, voiture → { emoji: 🚗, label: Voiture }." },
      { id: "sh_07", label: "buildPrefillGoal() crée un objectif avec les bonnes propriétés", testPath: "buildPrefillGoal('voyage', 2000) → id unique, name, emoji, targetAmount=2000." },
      { id: "sh_08", label: "getFlow() retourne le bon flow selon declaredGoal", testPath: "getFlow('voyage') → voyageFlow avec questions liées au voyage." },
      { id: "sh_09", label: "QuickReplyChips : état disabled bloque les clics", testPath: "Après sélection → chips grisées, nouveaux clics ignorés." },
      { id: "sh_10", label: "MonthlySlider : thumb personnalisé visible et draggable", testPath: "Slider → thumb rond visible, drag fonctionnel sur mobile et desktop." },
      { id: "sh_11", label: "DraggableGoalList : opacité réduite sur l'élément draggé", testPath: "Commencer drag → élément semi-transparent, curseur grabbing." },
    ],
  },
  {
    id: "global",
    title: "GLOBAL",
    criteria: [
      { id: "gl_01", label: "DebugLayout desktop : panneau gauche 300px + iPhone frame centré", testPath: "Ouvrir en desktop (≥768px) → 2 colonnes, panel à gauche, phone centré à droite." },
      { id: "gl_02", label: "DebugLayout mobile : floating bubble + drawer slide-up", testPath: "Mobile (<768px) → bubble en haut gauche, appuyer → drawer slide-up depuis le bas." },
      { id: "gl_03", label: "DebugPanel : tous les boutons simulation fonctionnent", testPath: "Appuyer chaque bouton → toast confirme l'action + état mis à jour dans le State preview." },
      { id: "gl_04", label: "Build production : DebugLayout absent du bundle", testPath: "npm run build → grep 'DebugPanel' dist/assets/*.js → 0 résultats." },
    ],
  },
];

// ── App design tokens ──────────────────────────────────────────────────────
const BLU  = "#0404E2";
const LIME = "#C9FF27";
const DARK = "#040707";
const BDR  = "#E8E8E8";
const SUCC = "#00B14F";
const DNGR = "#EF4444";

// ── Component ──────────────────────────────────────────────────────────────
export function ValidationPanel() {
  const [statuses, setStatuses] = useState<ValidationState>(loadState);

  useEffect(() => { saveState(statuses); }, [statuses]);

  const getStatus = (id: string): CriterionStatus =>
    (statuses[id] as CriterionStatus) ?? "pending";

  const handleStatusChange = (id: string, status: CriterionStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  const resetAll = () => setStatuses({});

  // ── Global stats ─────────────────────────────────────────────────────────
  const allCriteria  = SECTIONS.flatMap((s) => s.criteria);
  const total        = allCriteria.length;
  const okCount      = allCriteria.filter((c) => getStatus(c.id) === "ok").length;
  const koCount      = allCriteria.filter((c) => getStatus(c.id) === "ko").length;
  const pendingCount = total - okCount - koCount;
  const pct          = total > 0 ? Math.round((okCount / total) * 100) : 0;

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Feature card ── */}
      <div style={{
        background: DARK,
        borderRadius: 10,
        padding: "12px 14px",
        marginBottom: 16,
        color: "#FFFFFF",
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 2, color: LIME }}>WiseWallet V3</div>
        <div style={{ fontSize: 9, color: "#888" }}>Mes Projets d'Épargne — Critères de validation</div>
        <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
          <span style={{ fontSize: 9, background: "rgba(201,255,39,0.15)", color: LIME, borderRadius: 100, padding: "2px 8px", fontWeight: 600 }}>
            {total} critères
          </span>
          <span style={{ fontSize: 9, background: "rgba(255,255,255,0.08)", color: "#888", borderRadius: 100, padding: "2px 8px" }}>
            {SECTIONS.length} sections
          </span>
        </div>
      </div>

      {/* ── Sections ── */}
      {SECTIONS.map((section) => {
        const sOk    = section.criteria.filter((c) => getStatus(c.id) === "ok").length;
        const sTotal = section.criteria.length;
        const sPct   = sTotal > 0 ? Math.round((sOk / sTotal) * 100) : 0;
        const done   = sOk === sTotal;

        return (
          <div key={section.id} style={{ marginBottom: 18 }}>
            {/* Section header */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: BLU, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {section.title}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: done ? SUCC : "#7A7A7A" }}>
                  {sOk}/{sTotal}
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ height: 3, background: "#E8E8E8", borderRadius: 100, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${sPct}%`,
                  background: done ? SUCC : BLU,
                  borderRadius: 100,
                  transition: "width 0.3s ease",
                }} />
              </div>
            </div>

            {/* Criteria rows */}
            {section.criteria.map((criterion) => (
              <CriterionRow
                key={criterion.id}
                id={criterion.id}
                label={criterion.label}
                testPath={criterion.testPath}
                status={getStatus(criterion.id)}
                onStatusChange={handleStatusChange}
              />
            ))}

            <div style={{ height: 1, background: BDR, marginTop: 10 }} />
          </div>
        );
      })}

      {/* ── Reset button ── */}
      <button
        onClick={resetAll}
        style={{
          width: "100%",
          height: 34,
          borderRadius: 8,
          border: `1.5px solid ${DNGR}`,
          background: "transparent",
          color: DNGR,
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 80,
        }}
      >
        Réinitialiser tous les critères
      </button>

      {/* ── Sticky global footer ── */}
      <div style={{
        position: "sticky",
        bottom: 0,
        background: DARK,
        borderRadius: 10,
        padding: "12px 14px",
        marginTop: -68,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#888" }}>Progression globale</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: pct === 100 ? SUCC : LIME }}>{pct}%</span>
        </div>

        {/* Global progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 100, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            height: "100%",
            width: `${pct}%`,
            background: pct === 100 ? SUCC : LIME,
            borderRadius: 100,
            transition: "width 0.3s ease",
          }} />
        </div>

        {/* Counters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: SUCC, background: "rgba(0,177,79,0.15)", borderRadius: 100, padding: "2px 8px" }}>
            {okCount} OK
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: DNGR, background: "rgba(239,68,68,0.15)", borderRadius: 100, padding: "2px 8px" }}>
            {koCount} KO
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#888", background: "rgba(255,255,255,0.05)", borderRadius: 100, padding: "2px 8px" }}>
            {pendingCount} à tester
          </span>
        </div>
      </div>
    </div>
  );
}
