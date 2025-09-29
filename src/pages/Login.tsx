import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PhoneIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const { login, loginWithAppToken, loading, error, clearError } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useAppToken, setUseAppToken] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (useAppToken) {
      await loginWithAppToken();
    } else {
      if (!username || !password) {
        return;
      }
      await login(username, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-provectio-50 to-telecom-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-provectio-500 to-telecom-500 rounded-full flex items-center justify-center">
            <PhoneIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Provectio Télécom
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestion des abonnements Mobile
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Toggle pour le mode d'authentification */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Mode d'authentification
              </span>
              <button
                type="button"
                onClick={() => setUseAppToken(!useAppToken)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  useAppToken ? 'bg-provectio-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    useAppToken ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {useAppToken ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connexion avec le token d'application configuré
                </p>
              </div>
            ) : (
              <>
                {/* Champ nom d'utilisateur */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom d'utilisateur
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field mt-1"
                    placeholder="Votre nom d'utilisateur"
                  />
                </div>

                {/* Champ mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field mt-1"
                    placeholder="Votre mot de passe"
                  />
                </div>
              </>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={loading || (!useAppToken && (!username || !password))}
                className="btn-primary w-full flex justify-center py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>

          {/* Informations de configuration */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="mb-2">
                <strong>Configuration requise :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Token d'application Networth (client_id et client_secret)</li>
                <li>Ou identifiants utilisateur pour l'authentification SSO</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
