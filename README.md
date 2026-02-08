# NAP TRACKER

Une PWA mobile-first pour tracker vos power naps et trouver votre format optimal.

## 🚀 Fonctionnalités

- **4 formats de sieste**: Nap 10, Nap 15, Nap 20, Coffee Nap
- **Tracking simple**: 1 slider avant + 4 questions après chaque session
- **ROI Score**: Algorithme qui calcule l'efficacité de vos siestes
- **Stats intelligentes**: Recommandations basées sur vos 14 derniers jours
- **Historique complet**: Export CSV/JSON, suppression individuelle
- **Gamification douce**: Badges débloqués selon votre progression
- **PWA installable**: Fonctionne offline, s'installe comme une app native
- **Design premium**: UI sombre, gradients doux, animations discrètes

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (mobile-first)
- **State**: Zustand (simple et efficace)
- **Routing**: React Router
- **Charts**: Recharts
- **Storage**: localStorage (100% front)
- **PWA**: vite-plugin-pwa (manifest + service worker)

## 📱 Installation

### Développement local

```bash
# Cloner le repo
git clone <repo-url>
cd nap-tracker

# Installer les dépendances
npm install

# Lancer le dev server
npm run dev
```

### Installation PWA sur mobile

1. Ouvrir `http://localhost:5173` sur votre mobile
2. Dans le navigateur, taper sur "Partager" ou "⋮"
3. Choisir "Ajouter à l'écran d'accueil"
4. L'app s'installera comme une app native

## 🎯 Utilisation

### Flow utilisateur

1. **Home**: Réglez votre énergie actuelle (0-10) et choisissez votre format
2. **Session**: Lancez l'audio (si disponible) ou terminez manuellement
3. **Debrief**: Répondez aux 4 questions (énergie, focus, grogginess, endormissement)
4. **Stats**: Consultez vos performances et recommandations

### Formats disponibles

- **Nap 10** - Reset: Rapide, pour un coup de boost
- **Nap 15** - Recharge: Équilibre optimal
- **Nap 20** - Full: Cycle complet de sommeil
- **Coffee Nap** - 20: Café + sieste pour effet maximal

### ROI Score

Formule: `(énergieAprès - énergieAvant) + (focusAprès / 2) - (grogginessAprès / 1.5)`

- **≥ 3**: Excellent reset
- **1 à 3**: Bon
- **-1 à 1**: Moyen
- **< -1**: À ajuster

## 📊 Stats et Recommandations

L'app analyse vos 14 dernières sessions pour vous recommander:

- **Meilleur format**: Basé sur le ROI moyen + grogginess minimale
- **Comparatifs**: ROI, grogginess, énergie par format
- **Évolution**: Courbe de vos scores avec moyenne mobile
- **Badges**: 10, 25, 50, 100 sessions

## 🎵 Audio Files

Les fichiers MP3 sont à ajouter manuellement dans `/public/audio/`:

```
public/audio/
├── nap10.mp3    # 10 min nap audio
├── nap15.mp3    # 15 min nap audio  
└── nap20.mp3    # 20 min nap audio (utilisé aussi pour coffee nap)
```

*Si les fichiers manquent, l'affiche un message "Audio manquant" mais continue de fonctionner.*

## 🔧 Configuration

### Build pour production

```bash
# Build
npm run build

# Preview du build
npm run preview
```

### Variables d'environnement

Pas de variables requises - tout est stocké localement.

## 📁 Structure du projet

```
src/
├── app/                 # Cœur de l'app
│   ├── App.tsx         # Composant principal
│   ├── routes.tsx      # Configuration routing
│   ├── store.ts        # État global (Zustand)
│   └── types.ts        # Types TypeScript
├── components/          # Composants réutilisables
│   ├── BigButton.tsx
│   ├── BottomNav.tsx
│   ├── Card.tsx
│   ├── ConfirmDialog.tsx
│   ├── Slider.tsx
│   └── Toast.tsx
├── pages/              # Écrans de l'app
│   ├── Home.tsx
│   ├── Session.tsx
│   ├── Debrief.tsx
│   ├── History.tsx
│   ├── Stats.tsx
│   └── Settings.tsx
└── utils/              # Fonctions utilitaires
    ├── storage.ts       # Gestion localStorage
    ├── scoring.ts       # Calculs ROI et stats
    ├── time.ts         # Formatage dates/temps
    └── csv.ts          # Export CSV
```

## 🎨 Design System

- **Colors**: Dark theme par défaut (#0f172a background)
- **Typography**: Police système (performance)
- **Spacing**: Basé sur Tailwind (mobile-first)
- **Animations**: Discrètes, fade-in/slide-up
- **Components**: Cards arrondis, ombres douces

## 📱 PWA Features

- **Offline-first**: Service worker cache les assets
- **Installable**: Manifest web complet
- **Responsive**: Optimisé pour mobile (d'abord)
- **Native feel**: Bottom navigation, gestures

## 🔒 Données

- **Stockage**: 100% localStorage (pas de serveur)
- **Export**: JSON et CSV pour vos données
- **Privacy**: Aucune donnée envoyée extérieurement
- **Reset**: Option "Tout effacer" dans réglages

## 🚀 Déploiement

### Vercel (recommandé)

```bash
# Connecter repo Vercel
# Build command: npm run build
# Output directory: dist
```

### Netlify

```bash
# Build command: npm run build  
# Publish directory: dist
```

## 🐛 Débuggage

```bash
# Logs détaillés
npm run dev -- --debug

# Build d'analyse
npm run build -- --analyze
```

## 📝 Notes

- **Pas d'alarmes**: L'audio contient la sortie de nap
- **Pas de notifications**: UX minimaliste
- **Audio optionnel**: L'app fonctionne sans fichiers MP3
- **Mobile-first**: UI optimisée pour une main
- **Performance**: Lazy loading, optimisé Vite

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche `feature/nom`
3. Commit les changements
4. Push et ouvrir une PR

## 📄 Licence

MIT License - faites-en ce que vous voulez !

---

**NAP TRACKER** - Votre partenaire pour des siestes parfaites 🚀
