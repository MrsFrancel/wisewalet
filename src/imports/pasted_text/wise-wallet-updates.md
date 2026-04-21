  ---
  Prompt Figma Make — Mise à jour WiseWallet
                                                                                     Tu vas mettre à jour l'application WiseWallet selon 3 corrections précises. Voici   les changements à appliquer dans `src/app/App.tsx` :                            
  ---

  ## 1. TYPOGRAPHIE — Syne pour TOUS les titres et sous-titres

  La police **Syne** doit être utilisée pour TOUS les titres, sous-titres et
  headers. La police **Inter** est réservée uniquement au corps de texte
  (paragraphes, labels, captions, valeurs numériques).

  ### 1a. Ajouter l'import Syne dans index.html ou main.tsx
  Assure-toi que la police Syne est chargée via Google Fonts :
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;80
  0&display=swap" rel="stylesheet">

  1b. Mettre à jour le composant Header

  Dans la fonction Header({ title, onBack, right, large }), ajouter fontFamily:
  "Syne, sans-serif" au style du titre :

  // AVANT
  <div style={{ color: C.text, fontWeight: large ? 700 : 600, fontSize: large ? 28
  : 22 }}>

  // APRÈS
  <div style={{ color: C.text, fontWeight: large ? 700 : 600, fontSize: large ? 28
  : 22, fontFamily: "Syne, sans-serif" }}>

  1c. Appliquer Syne à TOUS les éléments avec fontSize >= 16 et fontWeight >= 600

  Parcours tout le fichier App.tsx et pour CHAQUE élément de style inline qui
  correspond à un titre ou sous-titre (fontSize >= 16 AND fontWeight >= 600),
  ajouter fontFamily: "Syne, sans-serif".

  Exemples typiques à corriger :
  - Les titres de pages (HomeScreen, AnalyseScreen, TransactionsScreen,
  ProfileScreen, etc.)
  - Les noms de sections ("Mes objectifs", "Analyse", "Mes transactions", etc.)
  - Les montants mis en avant (ex: solde principal sur HomeScreen si large)
  - Les titres de modals et de steps (ex: "Objectif créé !", noms d'objectifs)
  - Les sous-titres de cartes si fontSize >= 16

  Règle simple : fontFamily: "Syne, sans-serif" = tout ce qui est titre ou heading.
   fontFamily: "Inter, sans-serif" (ou rien = défaut Inter) = tout ce qui est body,
   label, caption, valeur.

  ---
  2. ÉCRAN DE BIENVENUE — Mode clair (pas sombre)

  Dans la fonction WelcomeScreen({ go }), l'écran doit être en mode clair avec fond
   blanc/gris clair.

  Changements à appliquer :

  // AVANT — fond sombre
  <div className="flex flex-col h-full relative"
       style={{ background: C.dark, color: "#FFFFFF" }}>

  // APRÈS — fond clair
  <div className="flex flex-col h-full relative"
       style={{ background: C.bg, color: C.text }}>

  Pour la barre de statut en haut :
  // AVANT
  <div style={{ color: "rgba(255,255,255,0.6)" }}>

  // APRÈS
  <div style={{ color: C.text2 }}>

  Pour le logo/wordmark "WiseWallet" :
  // Garder la couleur C.primary (#C9FF27) — visible sur fond clair
  // Si le logo est sur fond sombre, changer pour C.secondary (#0404E2) ou C.text
  (#040707)

  Pour le tagline "Gérez. Épargnez. Atteignez." :
  // AVANT — texte blanc avec "Atteignez." en C.primary
  // APRÈS — texte C.text (#040707) avec "Atteignez." en C.secondary (#0404E2)
  // Ou garder "Atteignez." en C.primary si le contraste est suffisant sur fond
  clair

  Pour le titre en Syne :
  // Le titre principal de WelcomeScreen doit aussi utiliser Syne
  style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 36, ... }}

  Pour le bouton ghost :
  // AVANT — bordure blanche, texte blanc
  style={{ border: "2px solid white", color: "white" }}

  // APRÈS — bordure foncée, texte foncé
  style={{ border: `2px solid ${C.dark}`, color: C.dark }}

  Le bouton CTA principal garde son style : fond C.primary (#C9FF27), texte
  C.onPrimary (#040707).

  ---
  3. ICÔNES — Appliquer le style navbar partout

  Toutes les icônes interactives de l'application doivent suivre le même style que
  les icônes de la BottomNav :
  - size={22} pour les icônes standard (ICON = 22)
  - strokeWidth={1.5} au repos (STROKE = 1.5)
  - strokeWidth={2} quand actif/pressé
  - fill={isActive ? C.primary : "none"} pour les icônes qui ont un état actif
  - transition active:scale-95 sur le bouton parent
  - color={isActive ? C.onPrimary : C.text2} pour la couleur du trait

  3a. Règle universelle pour les boutons icônes

  Tout <button> contenant une icône Lucide doit avoir la classe Tailwind :
  className="... transition active:scale-95"

  3b. Icônes dans les boutons ronds (IconBtn, boutons action)

  Pour les boutons circulaires (36-44px, fond surface/card, shadow), appliquer :
  <button
    onClick={...}
    className="flex items-center justify-center rounded-full transition
  active:scale-95"
    style={{ width: 40, height: 40, background: C.surface, boxShadow: "0 2px 8px
  rgba(0,0,0,0.08)" }}
  >
    <IconName size={20} color={C.text} strokeWidth={STROKE} />
  </button>

  3c. Items de liste cliquables (ProfileScreen, paramètres)

  Pour les items de liste dans ProfileScreen ou toute liste de navigation :
  // Ajouter transition active:scale-[0.99] sur le container cliquable
  className="flex items-center ... transition active:scale-[0.99]"

  3d. Bouton de déconnexion et actions critiques

  // Même pattern, avec couleur danger pour les actions destructives
  <button className="... transition active:scale-95">
    <LogOut size={ICON} color={C.danger} strokeWidth={STROKE} />
  </button>

  3e. Icônes dans les cartes et sections

  Les icônes décoratifs non-interactifs (fond coloré dans une carte) gardent :
  - size={20} ou size={24} selon le contexte
  - strokeWidth={1.5}
  - Pas de transition (pas cliquable)

  Résumé du pattern icône interactif :

  // BOUTON ICÔNE STANDARD
  <button
    onClick={handler}
    className="flex items-center justify-center transition active:scale-95"
  >
    <IconName
      size={ICON}           // 22
      color={C.text}        // ou C.text2 si secondaire
      strokeWidth={STROKE}  // 1.5
    />
  </button>

  // ICÔNE AVEC ÉTAT ACTIF (type nav ou toggle)
  <IconName
    size={ICON}
    color={isActive ? C.onPrimary : C.text2}
    strokeWidth={isActive ? 2 : STROKE}
    fill={isActive ? C.primary : "none"}
  />

  ---
  Constantes à vérifier en haut du fichier

  Assure-toi que ces constantes sont bien définies :
  const ICON = 22;
  const STROKE = 1.5;

  Et que la palette C est complète :
  const C = {
    bg: "#F5F5F5",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    primary: "#C9FF27",
    primarySoft: "#F0FFAA",
    primaryDark: "#8AB800",
    onPrimary: "#040707",
    link: "#0404E2",
    secondary: "#0404E2",
    text: "#040707",
    text2: "#7A7A7A",
    danger: "#EF4444",
    success: "#00B14F",
    border: "#E8E8E8",
    dark: "#040707",
  };

  ---
  Ordre d'application recommandé

  1. Ajouter l'import Google Fonts (Syne)
  2. Corriger WelcomeScreen (fond clair + boutons adaptés)
  3. Mettre à jour Header avec Syne
  4. Parcourir tout App.tsx et ajouter fontFamily: "Syne, sans-serif" à tous les
  titres (fontSize >= 16, fontWeight >= 600)
  5. Ajouter transition active:scale-95 à tous les boutons icônes
  6. Vérifier visuellement les 14 écrans : WelcomeScreen, HomeScreen,
  AnalyseScreen, TransactionsScreen, TransactionDetailScreen, ProfileScreen,
  NotificationsScreen, ObjectifsScreen, NouvelObjectifScreen (steps 1-3),
  ObjectifCreéScreen, ObjectifDetailScreen, DepotScreen, AddTransactionScreen

  ---