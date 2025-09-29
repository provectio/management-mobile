import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../components/ThemeProvider';
import { 
  CogIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
  const { user, logout } = useAppStore();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'about'>('general');

  const handleLogout = async () => {
    await logout();
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: CogIcon },
    { id: 'security', name: 'Sécurité', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'about', name: 'À propos', icon: InformationCircleIcon },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configuration de l'application et de votre compte
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation des onglets */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'bg-provectio-100 dark:bg-provectio-900 text-provectio-700 dark:text-provectio-200'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="mr-3 h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="lg:col-span-3">
          <div className="card p-6">
            {activeTab === 'general' && <GeneralSettings theme={theme} toggleTheme={toggleTheme} />}
            {activeTab === 'security' && <SecuritySettings user={user} onLogout={handleLogout} />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'about' && <AboutSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les paramètres généraux
function GeneralSettings({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        Paramètres généraux
      </h2>

      {/* Thème */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Thème de l'application
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choisissez entre le mode clair et sombre
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            theme === 'dark' ? 'bg-provectio-600' : 'bg-gray-200 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Langue */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Langue
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Langue de l'interface utilisateur
          </p>
        </div>
        <select className="input-field w-32">
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Fuseau horaire */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Fuseau horaire
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fuseau horaire pour l'affichage des dates
          </p>
        </div>
        <select className="input-field w-48">
          <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
          <option value="UTC">UTC (UTC+0)</option>
        </select>
      </div>
    </div>
  );
}

// Composant pour les paramètres de sécurité
function SecuritySettings({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        Sécurité
      </h2>

      {/* Informations de connexion */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Informations de connexion
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Nom d'utilisateur
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.userName || 'N/A'}
              </p>
            </div>
            <button className="btn-secondary">
              Modifier
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Email
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || 'N/A'}
              </p>
            </div>
            <button className="btn-secondary">
              Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Session */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
          Session
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Se déconnecter
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fermer votre session actuelle
            </p>
          </div>
          <button onClick={onLogout} className="btn-secondary">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant pour les paramètres de notifications
function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        Notifications
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Notifications par email
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Recevoir des notifications par email
            </p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-provectio-600 transition-colors duration-200">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform duration-200" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Alertes de consommation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Alertes quand la consommation approche des limites
            </p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-provectio-600 transition-colors duration-200">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform duration-200" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Notifications de maintenance
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Informations sur les maintenances programmées
            </p>
          </div>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-200">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Composant pour les informations à propos
function AboutSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        À propos
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Version de l'application
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {import.meta.env.VITE_APP_VERSION || '1.0.0'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Nom de l'application
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {import.meta.env.VITE_APP_NAME || 'Provectio Télécom'}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Description
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Application de gestion des abonnements mobiles pour Provectio.
            Permet de visualiser et gérer les clients, lignes téléphoniques et cartes SIM.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            API Networth
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Intégration avec l'API Networth pour la récupération des données de téléphonie mobile.
          </p>
        </div>
      </div>
    </div>
  );
}
