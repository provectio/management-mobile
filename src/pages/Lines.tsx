import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Line } from '../types';
import { 
  MagnifyingGlassIcon, 
  PhoneIcon,
  SignalIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function Lines() {
  const { clients, loadClients, loading } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [allLines, setAllLines] = useState<Line[]>([]);

  useEffect(() => {
    if (clients.length === 0) {
      loadClients();
    } else {
      // Extraire toutes les lignes de tous les clients
      const lines = clients.flatMap(client => 
        client.lines.map(line => ({ ...line, clientName: client.name }))
      );
      setAllLines(lines);
    }
  }, [clients, loadClients]);

  const filteredLines = allLines.filter(line => {
    const matchesSearch = line.msisdn.includes(searchTerm) ||
                         line.assignment?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         line.assignment?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         line.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOperator = operatorFilter === 'all' || line.operator === operatorFilter;
    const matchesStatus = statusFilter === 'all' || line.status === statusFilter;
    return matchesSearch && matchesOperator && matchesStatus;
  });

  const getStatusBadge = (status: Line['status']) => {
    const statusConfig = {
      active: { label: 'Actif', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      inactive: { label: 'Inactif', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      suspended: { label: 'Suspendu', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
      pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lignes téléphoniques
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gestion de l'ensemble des lignes et abonnements
        </p>
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
              placeholder="Rechercher une ligne..."
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
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
            <option value="pending">En attente</option>
          </select>

          {/* Statistiques */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            {filteredLines.length} ligne{filteredLines.length > 1 ? 's' : ''} trouvée{filteredLines.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des lignes */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Opérateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Forfait
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Affectation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Consommation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLines.map((line) => (
                <tr key={line.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {line.msisdn}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      SIM: {line.simReference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {(line as any).clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      line.operator === 'orange' 
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {line.operator === 'orange' ? 'Orange' : 'Bouygues'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {line.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {line.assignment ? `${line.assignment.firstName} ${line.assignment.lastName}` : 'Non affecté'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(line.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {line.consumption ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <SignalIcon className="h-3 w-3 mr-1" />
                          {line.consumption.data.percentage.toFixed(0)}%
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <PhoneIcon className="h-3 w-3 mr-1" />
                          {line.consumption.voice.percentage.toFixed(0)}%
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                          {line.consumption.sms.percentage.toFixed(0)}%
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Message si aucune ligne trouvée */}
        {filteredLines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500">
              <PhoneIcon className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune ligne trouvée
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || operatorFilter !== 'all' || statusFilter !== 'all'
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Aucune ligne téléphonique n\'est configurée.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
