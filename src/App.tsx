import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetail from './pages/ClientDetail';
import Lines from './pages/Lines';
import SimCards from './pages/SimCards';
import Settings from './pages/Settings';
import ThemeProvider from './components/ThemeProvider';

function App() {
  const { isAuthenticated, checkAuth, loading } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Vérifier l'authentification au démarrage
        checkAuth();
        // Attendre un peu pour s'assurer que l'état est mis à jour
        setTimeout(() => {
          setIsInitialized(true);
        }, 100);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsInitialized(true);
      }
    };

    initializeApp();

    // Timeout de sécurité pour éviter le blocage
    const timeout = setTimeout(() => {
      console.warn('App initialization timeout, forcing initialization');
      setIsInitialized(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [checkAuth]);

  // Afficher un loader pendant l'initialisation (avec timeout de sécurité)
  if (!isInitialized) {
    console.log('App loading:', { isInitialized, loading, isAuthenticated });
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-provectio-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de Provectio Télécom...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  // Application principale
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetail />} />
            <Route path="/lines" element={<Lines />} />
            <Route path="/sim-cards" element={<SimCards />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
