import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Client, Line, SimCard } from '../types';
import { 
  ArrowLeftIcon,
  PhoneIcon,
  CreditCardIcon,
  UserIcon,
  MapPinIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { clients, selectClient } = useAppStore();
  const [client, setClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<'lines' | 'simcards'>('lines');

  useEffect(() => {
    if (id) {
      const foundClient = clients.find(c => c.id === id);
      if (foundClient) {
        setClient(foundClient);
        selectClient(foundClient);
      }
    }
  }, [id, clients, selectClient]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-provectio-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement du client...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Actif', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      inactive: { label: 'Inactif', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
      suspended: { label: 'Suspendu', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center space-x-4">
        <Link
          to="/clients"
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Retour aux clients
        </Link>
      </div>

      {/* Informations du client */}
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-provectio-100 dark:bg-provectio-900 flex items-center justify-center">
              <span className="text-2xl font-medium text-provectio-600 dark:text-provectio-300">
                {client.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {client.name}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                {getStatusBadge(client.status)}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Créé le {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails du client */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center space-x-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {client.email || 'Non renseigné'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <PhoneIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Téléphone</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {client.phone || 'Non renseigné'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {client.address || 'Non renseignée'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-blue-500 p-3 rounded-lg">
                <PhoneIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Lignes actives
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {client.lines.filter(line => line.status === 'active').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

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
                  Cartes SIM disponibles
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {client.simCards.filter(sim => sim.status === 'available').length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-purple-500 p-3 rounded-lg">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total lignes
                </dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {client.lines.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets pour lignes et cartes SIM */}
      <div className="card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('lines')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lines'
                  ? 'border-provectio-500 text-provectio-600 dark:text-provectio-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Lignes ({client.lines.length})
            </button>
            <button
              onClick={() => setActiveTab('simcards')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'simcards'
                  ? 'border-provectio-500 text-provectio-600 dark:text-provectio-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Cartes SIM ({client.simCards.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'lines' ? (
            <LinesTab lines={client.lines} />
          ) : (
            <SimCardsTab simCards={client.simCards} />
          )}
        </div>
      </div>
    </div>
  );
}

// Composant pour l'onglet des lignes
function LinesTab({ lines }: { lines: Line[] }) {
  if (lines.length === 0) {
    return (
      <div className="text-center py-8">
        <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Aucune ligne
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ce client n'a pas encore de lignes téléphoniques.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="table-header">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Numéro
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
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {lines.map((line) => (
            <tr key={line.id} className="table-row">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {line.msisdn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {line.operator === 'orange' ? 'Orange' : 'Bouygues Telecom'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {line.plan}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {line.assignment ? `${line.assignment.firstName} ${line.assignment.lastName}` : 'Non affecté'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  line.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : line.status === 'inactive'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {line.status === 'active' ? 'Actif' : 
                   line.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Composant pour l'onglet des cartes SIM
function SimCardsTab({ simCards }: { simCards: SimCard[] }) {
  if (simCards.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Aucune carte SIM
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Ce client n'a pas encore de cartes SIM.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="table-header">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Référence
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Opérateur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Date d'activation
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {simCards.map((sim) => (
            <tr key={sim.id} className="table-row">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {sim.reference}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {sim.operator === 'orange' ? 'Orange' : 'Bouygues Telecom'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  sim.status === 'available' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : sim.status === 'activated'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {sim.status === 'available' ? 'Disponible' : 
                   sim.status === 'activated' ? 'Activée' : 'Bloquée'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {sim.activatedAt ? new Date(sim.activatedAt).toLocaleDateString('fr-FR') : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
