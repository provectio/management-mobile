# Provectio Télécom - Gestion des abonnements Mobile

Application web moderne pour la gestion des abonnements mobiles de Provectio, développée avec React, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

- **Gestion des clients** : Visualisation et gestion des clients et sous-clients Provectio
- **Gestion des lignes** : Suivi des lignes téléphoniques et abonnements
- **Gestion des cartes SIM** : Suivi du stock de cartes SIM disponibles
- **Données de consommation** : Visualisation des consommations data, voix et SMS
- **Interface moderne** : Design responsive avec support du mode sombre
- **Authentification SSO** : Intégration avec l'API Networth

## 🛠️ Technologies utilisées

- **React 18** - Framework JavaScript
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS utilitaire
- **Zustand** - Gestion d'état
- **React Router** - Routage côté client
- **Axios** - Client HTTP
- **Heroicons** - Icônes

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Compte Networth avec accès API

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd provectio-mobile
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp env.example .env.local
   ```
   
   Éditer le fichier `.env.local` avec vos informations :
   ```env
   VITE_NETW_API_BASE_URL=https://snaic.netw.fr/api/1.0
   VITE_NETW_CLIENT_ID=your_client_id_here
   VITE_NETW_CLIENT_SECRET=your_client_secret_here
   VITE_APP_NAME=Provectio Télécom
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=development
   ```

4. **Lancer l'application**
   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:3000`

## 🔧 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production
- `npm run lint` - Vérifie le code avec ESLint

## 🔐 Authentification

L'application supporte deux modes d'authentification avec l'API Networth :

### 1. Authentification par token d'application (recommandé)
- Utilise `client_id` et `client_secret`
- Plus stable pour les applications de production
- Configurez les variables d'environnement correspondantes

### 2. Authentification par identifiants utilisateur
- Utilise nom d'utilisateur et mot de passe
- Mode SSO avec cookies sécurisés
- Limité par les restrictions de session

## 📊 Structure de l'application

```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx      # En-tête de l'application
│   ├── Layout.tsx      # Layout principal
│   ├── Sidebar.tsx     # Barre latérale de navigation
│   └── ThemeProvider.tsx # Gestion des thèmes
├── pages/              # Pages de l'application
│   ├── Dashboard.tsx   # Tableau de bord
│   ├── Clients.tsx     # Liste des clients
│   ├── ClientDetail.tsx # Détail d'un client
│   ├── Lines.tsx       # Gestion des lignes
│   ├── SimCards.tsx    # Gestion des cartes SIM
│   ├── Settings.tsx    # Paramètres
│   └── Login.tsx       # Page de connexion
├── services/           # Services API
│   └── netwApi.ts     # Service d'intégration Networth
├── store/             # Gestion d'état
│   └── useAppStore.ts # Store principal Zustand
├── types/             # Définitions TypeScript
│   └── index.ts       # Types de l'application
├── App.tsx            # Composant principal
├── main.tsx           # Point d'entrée
└── index.css          # Styles globaux
```

## 🔌 Intégration API Networth

L'application intègre l'API Networth pour :

- **Authentification** : SSO et tokens d'application
- **Clients** : Récupération des informations clients
- **Lignes** : Gestion des lignes téléphoniques
- **Cartes SIM** : Suivi du stock de cartes SIM
- **Consommation** : Données de consommation data, voix et SMS

### Endpoints utilisés

- `POST /Auth/AuthUser` - Authentification
- `POST /Auth/refreshToken` - Renouvellement de token
- `GET /Clients` - Liste des clients
- `GET /Clients/{id}/lines` - Lignes d'un client
- `GET /Clients/{id}/simcards` - Cartes SIM d'un client
- `GET /Lines/{id}/consumption` - Consommation d'une ligne

## 🎨 Personnalisation

### Thèmes
L'application supporte les modes clair et sombre. Le thème est sauvegardé dans le localStorage.

### Couleurs
Les couleurs sont définies dans `tailwind.config.js` :
- `provectio-*` : Couleurs principales de Provectio
- `telecom-*` : Couleurs secondaires pour la télécom

### Composants
Les composants utilisent les classes Tailwind personnalisées définies dans `index.css`.

## 🚀 Déploiement

### **Déploiement Docker (Recommandé)**

1. **Prérequis**
   ```bash
   # Installer Docker et Docker Compose
   # Vérifier l'installation
   docker --version
   docker-compose --version
   ```

2. **Déploiement rapide**
   ```bash
   # Cloner le repository
   git clone <votre-repo-github>
   cd provectio-mobile
   
   # Configuration
   cp env.example .env.local
   # Éditer .env.local avec vos identifiants Networth
   
   # Déploiement
   chmod +x deploy.sh
   ./deploy.sh prod
   ```

3. **Accès à l'application**
   - **URL** : http://localhost:3015
   - **Port** : 3015
   - **Documentation** : Voir `DEPLOYMENT.md`

### **Déploiement traditionnel**

1. **Build de production**
   ```bash
   npm run build
   ```

2. **Déployer le dossier `dist/`** sur votre serveur web

3. **Configuration des variables d'environnement** sur le serveur de production

## 📝 Documentation API Networth

Pour plus d'informations sur l'API Networth :
- [Documentation officielle](https://developer.netw.fr/mobility/api)
- [Guide d'authentification](https://developer.netw.fr/concepts/authentication)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est propriétaire à Provectio.

## 🆘 Support

Pour toute question ou problème :
- Créer une issue sur le repository
- Contacter l'équipe de développement Provectio
