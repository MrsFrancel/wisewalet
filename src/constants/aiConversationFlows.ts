/** Conversational enrichment flows for AIGoalEnrichment screen */

export type QuickReply = { label: string; value: string };

export type ConversationStep = {
  id: string;
  message: string;
  replies: QuickReply[];
  /** Compute the next step id given the chosen reply value */
  next?: (value: string) => string | null;
};

export type FlowResult = {
  calculatedAmount: number;
  months: number;
  monthly: number;
  summary: string;
};

export type ConversationFlow = {
  steps: ConversationStep[];
  calculate: (answers: Record<string, string>, baseAmount: number) => FlowResult;
};

// ── VOYAGE ────────────────────────────────────────────────────────────────
export const voyageFlow: ConversationFlow = {
  steps: [
    {
      id: "dest",
      message: "Tu veux partir en voyage ? Où ça ? 🌍",
      replies: [
        { label: "Europe 🌍",   value: "europe"   },
        { label: "Asie 🌏",     value: "asie"     },
        { label: "Amériques 🌎",value: "ameriques"},
        { label: "Autre ✏️",    value: "autre"    },
      ],
      next: () => "persons",
    },
    {
      id: "persons",
      message: "Combien de personnes partent avec toi ?",
      replies: [
        { label: "Seul(e)",       value: "1" },
        { label: "En couple",     value: "2" },
        { label: "En famille",    value: "4" },
        { label: "Entre amis",    value: "3" },
      ],
      next: () => "style",
    },
    {
      id: "style",
      message: "Plutôt budget ou confort ? 😊",
      replies: [
        { label: "Budget 💰",    value: "budget"    },
        { label: "Équilibré ✨", value: "equi"      },
        { label: "Confort 🌟",   value: "confort"   },
      ],
      next: () => null,
    },
  ],
  calculate(answers, base) {
    const persons  = parseInt(answers["persons"] || "1", 10);
    const style    = answers["style"] || "equi";
    const dest     = answers["dest"] || "europe";

    const destMult: Record<string, number> = { europe: 1, asie: 1.5, ameriques: 1.6, autre: 1.2 };
    const styleMult: Record<string, number> = { budget: 0.7, equi: 1.0, confort: 1.5 };

    const amount = Math.round(base * persons * (destMult[dest] ?? 1) * (styleMult[style] ?? 1));
    const months = 12;
    const monthly = Math.ceil(amount / months);
    return {
      calculatedAmount: amount,
      months,
      monthly,
      summary: `Pour ${persons} personne${persons > 1 ? "s" : ""}, je te suggère **${amount.toLocaleString("fr-FR")} €** — soit **${monthly} €/mois** pendant ${months} mois.`,
    };
  },
};

// ── VOITURE ───────────────────────────────────────────────────────────────
export const voitureFlow: ConversationFlow = {
  steps: [
    {
      id: "budget",
      message: "Tu as un budget en tête ? 🚗",
      replies: [
        { label: "Moins de 5 000 €", value: "4000"  },
        { label: "5 000–15 000 €",   value: "10000" },
        { label: "Plus de 15 000 €", value: "18000" },
      ],
      next: () => "when",
    },
    {
      id: "when",
      message: "C'est pour quand ?",
      replies: [
        { label: "Dans 6 mois", value: "6"  },
        { label: "Dans 1 an",   value: "12" },
        { label: "Dans 2 ans",  value: "24" },
        { label: "Pas de rush", value: "36" },
      ],
      next: () => null,
    },
  ],
  calculate(answers) {
    const amount = parseInt(answers["budget"] || "8000", 10);
    const months = parseInt(answers["when"] || "12", 10);
    const monthly = Math.ceil(amount / months);
    return { calculatedAmount: amount, months, monthly, summary: `${amount.toLocaleString("fr-FR")} € en ${months} mois — soit **${monthly} €/mois**.` };
  },
};

// ── IMMOBILIER ────────────────────────────────────────────────────────────
export const immobilierFlow: ConversationFlow = {
  steps: [
    {
      id: "city",
      message: "Dans quelle ville tu envisages d'acheter ? 🏠",
      replies: [
        { label: "Paris",         value: "paris"  },
        { label: "Grande ville",  value: "grande" },
        { label: "Ville moyenne", value: "moyenne"},
        { label: "Campagne",      value: "campagne"},
      ],
      next: () => "type",
    },
    {
      id: "type",
      message: "Quel type de bien ?",
      replies: [
        { label: "Studio",       value: "studio"  },
        { label: "2-3 pièces",   value: "t2"      },
        { label: "Maison",       value: "maison"  },
      ],
      next: () => null,
    },
  ],
  calculate(answers, base) {
    const cityMult: Record<string, number> = { paris: 2.5, grande: 1.5, moyenne: 1.0, campagne: 0.7 };
    const typeMult: Record<string, number> = { studio: 0.7, t2: 1.0, maison: 1.5 };
    const amount = Math.round(base * (cityMult[answers["city"]] ?? 1) * (typeMult[answers["type"]] ?? 1));
    const months = 36;
    const monthly = Math.ceil(amount / months);
    return { calculatedAmount: amount, months, monthly, summary: `Pour ton projet immobilier, je suggère **${amount.toLocaleString("fr-FR")} €** — soit **${monthly} €/mois** sur ${months} mois.` };
  },
};

// ── DEFAULT ───────────────────────────────────────────────────────────────
export const defaultFlow: ConversationFlow = {
  steps: [
    {
      id: "when",
      message: "C'est pour dans combien de temps ? 🗓️",
      replies: [
        { label: "3 mois",         value: "3"  },
        { label: "6 mois",         value: "6"  },
        { label: "1 an",           value: "12" },
        { label: "2 ans ou plus",  value: "24" },
      ],
      next: () => "monthly",
    },
    {
      id: "monthly",
      message: "Tu peux mettre combien de côté par mois ? 💰",
      replies: [
        { label: "50–100 €",   value: "75"  },
        { label: "100–200 €",  value: "150" },
        { label: "200–500 €",  value: "350" },
        { label: "500 € +",    value: "600" },
      ],
      next: () => null,
    },
  ],
  calculate(answers, base) {
    const months  = parseInt(answers["when"] || "12", 10);
    const monthly = parseInt(answers["monthly"] || "150", 10);
    const amount  = Math.max(base, monthly * months);
    return { calculatedAmount: amount, months, monthly, summary: `En mettant **${monthly} €/mois** pendant ${months} mois, tu atteindrais **${amount.toLocaleString("fr-FR")} €**.` };
  },
};

/** Pick the right flow from declared goal string */
export function getFlow(declaredGoal: string): ConversationFlow {
  const lower = declaredGoal.toLowerCase();
  if (lower.includes("voyage") || lower.includes("travel") || lower.includes("vacances")) return voyageFlow;
  if (lower.includes("voiture") || lower.includes("car") || lower.includes("auto")) return voitureFlow;
  if (lower.includes("immobilier") || lower.includes("maison") || lower.includes("apport")) return immobilierFlow;
  return defaultFlow;
}
