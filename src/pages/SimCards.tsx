import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { SimCard } from '../types';
import { 
  MagnifyingGlassIcon, 
  CreditCardIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function SimCards() {
  const { clients, loadClients, loading } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [allSimCards, setAllSimCards] = useState<SimCard[]>([]);

  useEffect(() => {
    if (clients.length === 0) {
      loadClients();
    } else {
      // Extraire toutes les cartes SIM de tous les clients
      const simCards = clients.flatMap(client => 
        client.simCards.map(sim => ({ ...sim, clientName: client.name }))
      );
      setAllSimCards(simCards);
    }
  }, [clients, loadClients]);

  const filteredSimCards = allSimCards.filter(sim => {
    const matchesSearch = sim.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sim as any).clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperator = operatorFilter === 'all' || sim.operator === operatorFilter;
    const matchesStatus = statusFilter === 'all' || sim.status === statusFilter;
    return matchesSearch && matchesOperator && matchesStatus;
  });

  const getStatusBadge = (status: SimCard['status']) => {
    const statusConfig = {
      available: { label: 'Disponible', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      activated: { label: 'Activée', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      blocked: { label: 'Bloquée', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    };
    
    const config = statusConfig[status];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Cartes SIM
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestion du stock de cartes SIM disponibles
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter des cartes SIM
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-green-500 p-3 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Disponibles
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {allSimCards.filter(sim => sim.status === 'available').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-blue-500 p-3 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Activées
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {allSimCards.filter(sim => sim.status === 'activated').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-orange-500 p-3 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Orange
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {allSimCards.filter(sim => sim.operator === 'orange').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-telecom-500 p-3 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Bouygues
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {allSimCards.filter(sim => sim.operator === 'bouygues').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {/* Recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une carte SIM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filtre par opérateur */}
          <select
            value={operatorFilter}
            onChange={(e) => setOperatorFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les opérateurs</option>
            <option value="orange">Orange</option>
            <option value="bouygues">Bouygues Telecom</option>
          </select>

          {/* Filtre par statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="activated">Activée</option>
            <option value="blocked">Bloquée</option>
          </select>

          {/* Statistiques */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            {filteredSimCards.length} carte{filteredSimCards.length > 1 ? 's' : ''} trouvée{filteredSimCards.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des cartes SIM */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Opérateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date d'activation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Ligne associée
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSimCards.map((sim) => (
                <tr key={sim.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {sim.reference}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {sim.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {(sim as any).clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sim.operator === 'orange' 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {sim.operator === 'orange' ? 'Orange' : 'Bouygues'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(sim.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(sim.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sim.activatedAt ? new Date(sim.activatedAt).toLocaleDateString('fr-FR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {sim.lineId ? sim.lineId : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucune carte SIM trouvée */}
        {filteredSimCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500">
              <CreditCardIcon className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune carte SIM trouvée
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || operatorFilter !== 'all' || statusFilter !== 'all'
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Aucune carte SIM n\'est configurée.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
