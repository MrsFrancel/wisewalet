Design a complete mobile banking app called "WiseWallet" — iOS, 390x844px, dark neobank style, 14 screens with full navigation flow.

DESIGN SYSTEM
Colors: Background #0D0D14, Surface #16161F, Card #1E1E2E, Primary #6C63FF, Accent #00D4AA, Text primary #F0F0FF, Text secondary #8888AA, Danger #FF4D6D, Success #00D4AA, Border #2A2A3E
Typography: DM Sans — Display 32px/700, H1 28px/700, H2 22px/600, H3 18px/600, Body 15px/400, Caption 12px/400, Label 13px/500
Radius: Cards 20px, Buttons 14px, Pills 100px, Inputs 12px
Spacing: 8px base grid, screen padding 24px horizontal, 20px card inner padding
Shadow: 0 4px 24px rgba(0,0,0,0.4)
Bottom nav height: 80px with 34px safe area
Status bar: dark style, white icons

NAVIGATION STRUCTURE
Bottom navigation 5 tabs — Accueil, Transactions, Objectifs, Analyse, Profil
Tab icons + labels, active state Primary color, inactive secondary
Fixed to bottom across all main app screens

SCREEN 1 — WELCOME
Full screen background #0D0D14 with subtle radial gradient purple #1A1040 top center
WiseWallet wordmark centered at 40% height, minimalist geometric wallet icon above in Primary
Tagline "Gérez. Épargnez. Atteignez." H2 white centered
Subtitle "Votre argent, enfin organisé." body secondary centered
Bottom area: CTA "Commencer" full-width button Primary, ghost button "J'ai déjà un compte" below
Navigation: "Commencer" → Screen 2

SCREEN 2 — INSCRIPTION
Header: back arrow top left, "Créer un compte" H2 centered
Top progress: step 1 of 1, single step
Input fields stacked: "Prénom" — "Email" — "Mot de passe" — each Surface background, 12px radius, label above, 48px height
Password field: show/hide toggle right
Divider "ou continuer avec" caption secondary centered
Social row: Google button + Apple button side by side, outlined Surface style, icons + labels
CTA: "Créer mon compte" full-width Primary button bottom
Legal caption: "En continuant, vous acceptez nos CGU" caption secondary centered
Navigation: submit → Screen 3

SCREEN 3 — DASHBOARD HOME
Status bar top
Top bar: avatar circle 36px left (initials "A"), "Bonjour, Alex 👋" H2 white, notification bell right with unread dot Primary
Balance card: full-width Card #1E1E2E rounded 20px, label "Solde disponible" caption secondary, "2 847,00 €" Display bold white, row below: "Ce mois-ci" caption + "-342,00 €" body danger left, "+3,2%" pill Success right
Quick actions row: 4 equal pills Surface — "↑ Virer" — "↓ Recevoir" — "◎ Analyser" — "••• Plus" — icon above label, 64px height each
Section header row: "Transactions récentes" H3 left, "Voir tout" caption Primary right
Transaction list 3 items: each row — colored category circle icon 40px left, merchant name body white + date caption secondary below, amount right negative Danger — "Carrefour City · Alimentation 🛒 · -23,40€" — "Netflix · Loisirs 🎬 · -13,99€" — "Virement reçu · +500,00€" Success
Section header row: "Mes objectifs" H3 left, "+" icon Primary right
Empty state card: dashed border #6C63FF 1px, Card background, centered content — savings jar emoji 32px — "Aucun objectif créé" body secondary — "Créer mon premier objectif" ghost button Primary — low visual hierarchy, easy to ignore
Bottom navigation: Accueil active
Navigation: bell → Screen 13, transaction item → Screen 5, "Voir tout" → Screen 4, objectif CTA → Screen 6, bottom tabs active states

SCREEN 4 — LISTE TRANSACTIONS
Header: "Transactions" H1, month selector pill row below "Fév · Mar · Avr" current month Primary
Filter row: pills horizontal scroll — "Tout" active Primary — "Dépenses" — "Revenus" — "Catégories ▾" — Surface outlined
Summary row: Card surface — "Dépenses -1 247€" left Danger — "Revenus +2 100€" right Success
Transaction list full: grouped by date — date label caption secondary — items same style as dashboard — 8 items minimum — categories: Alimentation, Transport, Loisirs, Santé, Shopping, Virement
Each item tappable
Bottom navigation: Transactions active
Navigation: item tap → Screen 5

SCREEN 5 — DÉTAIL TRANSACTION / CATÉGORISATION
Header: back arrow, "Transaction" H2 centered, skip "Ignorer" caption secondary right
Merchant card center: circle placeholder 56px colored by category, "Carrefour City" H1, "-23,40 €" Display Danger, "Aujourd'hui · 14h32" caption secondary, "Paris, France" caption secondary
Section: "Catégorie détectée" label caption secondary uppercase tracking
Category pill selected full-width style: "🛒 Alimentation" — Primary background white text
Grid 2x3 category alternatives: outlined Surface pills — "🚗 Transport" — "🎬 Loisirs" — "💊 Santé" — "🛍️ Shopping" — "🏠 Logement" — "••• Autre" — 48px height each
Note input: "Ajouter une note..." Surface background optional
CTA: "Confirmer" full-width Primary button
NO savings goal prompt — this is V1 without the feature
Navigation: confirm → Screen 3

SCREEN 6 — OBJECTIFS ÉTAT VIDE
Header: "Mes Objectifs" H1, "Épargnez avec intention" body secondary below
Hero empty state centered: 🎯 emoji 64px, "Vous n'avez pas encore d'objectif" H2 center, "Les utilisateurs avec un objectif épargnent 3x plus" caption secondary center
CTA: "Créer un objectif" full-width Primary button
Section: "Objectifs populaires" label caption uppercase tracking secondary
Horizontal scroll cards 3 visible partial: Card 160px wide — emoji large + title H3 + amount caption — "🏖️ Voyage · 1 500€" — "🚗 Voiture · 5 000€" — "🏠 Apport · 20 000€" — low visual weight
Bottom navigation: Objectifs active
Navigation: CTA → Screen 7, popular card tap → Screen 7

SCREEN 7 — CRÉATION OBJECTIF ÉTAPE 1/3
Header: back arrow, "Nouvel objectif" H2, "1 / 3" caption secondary right
Progress bar: 33% fill Primary, full width top below header
Section: "Quel est votre objectif ?" H3
Name input: large Surface field, placeholder "Ex: Voyage au Japon" body, label above "Nom de l'objectif"
Section: "Choisissez une catégorie" H3
Category grid 2x3: cards 100px height — emoji large + label — "🏖️ Voyage" — "🚗 Voiture" — "🏠 Immobilier" — "💡 Urgence" — "🎓 Formation" — "✨ Autre" — selectable, Primary border on selected
CTA: "Suivant" full-width Primary button, disabled state shown
Navigation: next → Screen 8

SCREEN 8 — CRÉATION OBJECTIF ÉTAPE 2/3
Header: back arrow, "Nouvel objectif" H2, "2 / 3" caption secondary right
Progress bar: 66% fill Primary
Section: "Combien souhaitez-vous épargner ?" H3
Amount display: "1 500 €" Display bold white centered, tap to edit
Numpad: 3x4 grid Surface buttons 64px height, digits 0-9 + backspace + decimal
Section: "Pour quand ?" H3
Date selector row: month picker + year picker side by side pill style Surface
Calculation card: Card background — "À épargner par mois" label caption secondary — "125,00 €" H2 Primary — "sur 12 mois" caption secondary
CTA: "Suivant" full-width Primary
Navigation: next → Screen 9

SCREEN 9 — CRÉATION OBJECTIF ÉTAPE 3/3
Header: back arrow, "Récapitulatif" H2, "3 / 3" caption secondary right
Progress bar: 100% fill Primary
Summary card: Card background full — category emoji 48px centered top — "Voyage au Japon" H1 center — divider line — row "Montant cible" label left + "1 500 €" H3 right — row "Durée" + "12 mois" — row "Par mois" + "125 €" Primary — row "Date cible" + "Avril 2027"
Toggle row: "Activer les rappels mensuels" label left, toggle right Default on
Note: "Vous pourrez modifier cela à tout moment" caption secondary center
CTA: "Créer mon objectif 🎯" full-width Primary button
Navigation: confirm → Screen 10

SCREEN 10 — CONFIRMATION OBJECTIF CRÉÉ
Full screen celebration: background #0D0D14, large success animation placeholder circle 120px Success color glow centered, "🎉" emoji 48px above
"Objectif créé !" Display bold white centered
"Votre objectif Voyage au Japon est lancé. Épargnez 125€/mois pour y arriver." body secondary centered
Progress bar visual: 0% fill, "0 € / 1 500 €" caption below
CTA primary: "Voir mon objectif" full-width Primary
CTA secondary: "Retour à l'accueil" ghost button
Navigation: primary → Screen 11, secondary → Screen 3

SCREEN 11 — DÉTAIL OBJECTIF
Header: back arrow, "Voyage au Japon" H2, edit icon right
Hero card: Card background — emoji 40px + title H2 + "En cours" pill Success — circular progress indicator 120px center showing % — "0 €" H1 center inside circle — "sur 1 500 €" caption below — "0%" caption secondary
Stats row 3 columns: "Par mois" · "125 €" · label / "Restant" · "1 500 €" · label / "Date" · "Avr 27" · label
Section: "Historique des versements" H3
Empty state: "Aucun versement pour l'instant" caption secondary center
CTA: "Ajouter un versement" full-width Primary
Bottom navigation: Objectifs active

SCREEN 12 — ANALYSE
Header: "Analyse" H1, month selector "Avril 2026" pill center with arrows
Summary row: "Revenus +2 100€" Success left — "Dépenses -1 247€" Danger right — Card background
Donut chart: centered 200px — segments by category colored — legend below 2 columns — percentage + category + amount each row
Section: "Évolution mensuelle" H3
Bar chart: 4 months visible — grouped bars Revenus Success / Dépenses Danger — month labels below — simple clean minimal
Section: "Top catégories ce mois" H3
List 3 items: category icon + name + bar fill proportional + amount right
Bottom navigation: Analyse active

SCREEN 13 — NOTIFICATIONS
Header: back arrow, "Notifications" H1, "Tout marquer lu" caption Primary right
List grouped by date: Today / Cette semaine
Notification items: icon circle 40px colored by type left — title body white + description caption secondary — time caption secondary right — unread items Surface background, read items transparent
Types: transaction alert Danger, objectif reminder Primary, tip Accent
Empty areas between groups

SCREEN 14 — PROFIL
Header: "Mon Profil" H1
Profile card: Card background — avatar circle 72px Primary initials centered — "Alex Martin" H2 center — "alex@email.com" caption secondary center
Section: "Mon compte" label caption uppercase secondary
Menu items list: each row Surface 56px height — icon left + label body white + chevron right — "Informations personnelles" — "Sécurité" — "Notifications" — "Abonnement" — divider
Section: "Application" label caption uppercase secondary
Menu items: "Aide & Support" — "Conditions d'utilisation" — "Politique de confidentialité"
Logout row: "Se déconnecter" body Danger centered, no chevron
Bottom navigation: Profil active

PROTOTYPE CONNECTIONS
Screen 1 "Commencer" → Screen 2
Screen 2 submit → Screen 3
Screen 3 notification bell → Screen 13
Screen 3 transaction item → Screen 5
Screen 3 "Voir tout" → Screen 4
Screen 3 objectif CTA → Screen 6
Screen 4 transaction item → Screen 5
Screen 5 "Confirmer" → Screen 3
Screen 6 "Créer un objectif" → Screen 7
Screen 6 popular card → Screen 7
Screen 7 "Suivant" → Screen 8
Screen 8 "Suivant" → Screen 9
Screen 9 "Créer mon objectif" → Screen 10
Screen 10 "Voir mon objectif" → Screen 11
Screen 10 "Retour à l'accueil" → Screen 3
Bottom nav Accueil → Screen 3
Bottom nav Transactions → Screen 4
Bottom nav Objectifs → Screen 6
Bottom nav Analyse → Screen 12
Bottom nav Profil → Screen 14