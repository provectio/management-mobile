import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { DashboardStats } from '../types';
import { 
  UsersIcon, 
  PhoneIcon, 
  CreditCardIcon, 
  ChartBarIcon,
  SignalIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { loadDashboardStats, clients, loading } = useAppStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await loadDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      }
    };

    fetchStats();
  }, [loadDashboardStats, clients]);

  const statCards = [
    {
      name: 'Clients',
      value: stats?.totalClients || 0,
      icon: UsersIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Lignes actives',
      value: stats?.activeLines || 0,
      icon: PhoneIcon,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Cartes SIM disponibles',
      value: stats?.availableSimCards || 0,
      icon: CreditCardIcon,
      color: 'bg-yellow-500',
      change: '-3%',
      changeType: 'negative'
    },
    {
      name: 'Total lignes',
      value: stats?.totalLines || 0,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const consumptionCards = [
    {
      name: 'Données consommées',
      value: `${(stats?.consumptionSummary.totalDataUsed || 0).toFixed(1)} Go`,
      icon: SignalIcon,
      color: 'bg-telecom-500'
    },
    {
      name: 'Minutes utilisées',
      value: `${stats?.consumptionSummary.totalVoiceUsed || 0}`,
      icon: PhoneIcon,
      color: 'bg-provectio-500'
    },
    {
      name: 'SMS envoyés',
      value: `${stats?.consumptionSummary.totalSmsUsed || 0}`,
      icon: ChatBubbleLeftRightIcon,
      color: 'bg-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-provectio-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Vue d'ensemble de votre parc télécom
        </p>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cartes de consommation */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Consommation globale
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {consumptionCards.map((stat) => (
            <div key={stat.name} className="card p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clients récents */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Clients récents
        </h2>
        <div className="card">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="table-header">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Lignes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Dernière activité
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {clients.slice(0, 5).map((client) => (
                  <tr key={client.id} className="table-row">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-provectio-100 dark:bg-provectio-900 flex items-center justify-center">
                            <span className="text-sm font-medium text-provectio-600 dark:text-provectio-300">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {client.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {client.lines.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : client.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {client.status === 'active' ? 'Actif' : 
                         client.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(client.updatedAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
