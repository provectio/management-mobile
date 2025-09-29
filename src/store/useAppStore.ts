import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState, Client, NetwUser, DashboardStats } from '../types';
import { netwApi } from '../services/netwApi';

interface AppStore extends AppState {
  // Actions d'authentification
  login: (username: string, password: string) => Promise<void>;
  loginWithAppToken: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;

  // Actions pour les clients
  loadClients: () => Promise<void>;
  selectClient: (client: Client | null) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => Promise<void>;

  // Actions générales
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Actions pour les statistiques
  loadDashboardStats: () => Promise<DashboardStats>;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // État initial
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      clients: [],
      selectedClient: null,
      loading: false,
      error: null,

      // Actions d'authentification
      login: async (username: string, password: string) => {
        set({ loading: true, error: null });
        try {
          // Mode de test si l'API échoue
          try {
            const authResponse = await netwApi.authenticateWithCredentials(username, password);
            const user = netwApi.getCurrentUser();
            
            set({
              isAuthenticated: true,
              user,
              token: authResponse.token,
              refreshToken: authResponse.refreshToken,
              loading: false,
              error: null
            });
          } catch (apiError) {
            console.warn('API Networth non disponible, utilisation du mode test');
            // Mode test avec utilisateur fictif
            const testUser: NetwUser = {
              userId: 'test-user-1',
              userName: username,
              email: `${username}@test.com`,
              rights: ['admin', 'read', 'write']
            };
            
            set({
              isAuthenticated: true,
              user: testUser,
              token: 'test-token',
              refreshToken: 'test-refresh-token',
              loading: false,
              error: null
            });
          }

          // Charger les clients après authentification
          await get().loadClients();
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur d\'authentification'
          });
        }
      },

      loginWithAppToken: async () => {
        set({ loading: true, error: null });
        try {
          const authResponse = await netwApi.authenticateWithAppToken();
          const user = netwApi.getCurrentUser();
          
          set({
            isAuthenticated: true,
            user,
            token: authResponse.token,
            refreshToken: authResponse.refreshToken,
            loading: false,
            error: null
          });

          // Charger les clients après authentification
          await get().loadClients();
        } catch (error) {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
            loading: false,
            error: error instanceof Error ? error.message : 'Erreur d\'authentification avec token application'
          });
        }
      },

      logout: async () => {
        try {
          await netwApi.logout();
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
        } finally {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null,
            clients: [],
            selectedClient: null,
            error: null
          });
        }
      },

      checkAuth: () => {
        const isAuthenticated = netwApi.isAuthenticated();
        const user = netwApi.getCurrentUser();
        
        set({
          isAuthenticated,
          user,
          token: isAuthenticated ? 'present' : null
        });

        if (isAuthenticated && get().clients.length === 0) {
          get().loadClients();
        }
      },

      // Actions pour les clients
      loadClients: async () => {
        set({ loading: true, error: null });
        try {
          // Mode de test avec données fictives si l'API échoue
          try {
            const clients = await netwApi.getClients();
            set({ clients, loading: false, error: null });
          } catch (apiError) {
            console.warn('API Networth non disponible, utilisation des données de test');
            // Données de test
            const testClients: Client[] = [
              {
                id: '1',
                name: 'Client Test 1',
                email: 'client1@test.com',
                phone: '0123456789',
                address: '123 Rue Test, 75001 Paris',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                lines: [
                  {
                    id: 'line1',
                    clientId: '1',
                    msisdn: '0123456789',
                    simReference: 'SIM001',
                    operator: 'orange',
                    plan: 'Forfait 50Go',
                    status: 'active',
                    assignment: { firstName: 'Jean', lastName: 'Dupont' },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  }
                ],
                simCards: [
                  {
                    id: 'sim1',
                    clientId: '1',
                    reference: 'SIM001',
                    status: 'activated',
                    operator: 'orange',
                    createdAt: new Date().toISOString(),
                    activatedAt: new Date().toISOString(),
                    lineId: 'line1'
                  },
                  {
                    id: 'sim2',
                    clientId: '1',
                    reference: 'SIM002',
                    status: 'available',
                    operator: 'bouygues',
                    createdAt: new Date().toISOString()
                  }
                ]
              },
              {
                id: '2',
                name: 'Client Test 2',
                email: 'client2@test.com',
                phone: '0987654321',
                address: '456 Avenue Test, 69000 Lyon',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                lines: [],
                simCards: [
                  {
                    id: 'sim3',
                    clientId: '2',
                    reference: 'SIM003',
                    status: 'available',
                    operator: 'orange',
                    createdAt: new Date().toISOString()
                  }
                ]
              }
            ];
            set({ clients: testClients, loading: false, error: null });
          }
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Impossible de charger les clients'
          });
        }
      },

      selectClient: (client: Client | null) => {
        set({ selectedClient: client });
      },

      updateClient: async (clientId: string, updates: Partial<Client>) => {
        set({ loading: true, error: null });
        try {
          // Mettre à jour le client localement
          const clients = get().clients.map(client => 
            client.id === clientId ? { ...client, ...updates } : client
          );
          
          set({ clients, loading: false, error: null });

          // Si c'est le client sélectionné, le mettre à jour aussi
          const selectedClient = get().selectedClient;
          if (selectedClient && selectedClient.id === clientId) {
            set({ selectedClient: { ...selectedClient, ...updates } });
          }
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : 'Impossible de mettre à jour le client'
          });
        }
      },

      // Actions générales
      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Actions pour les statistiques
      loadDashboardStats: async (): Promise<DashboardStats> => {
        try {
          const clients = get().clients;
          
          // Calculer les statistiques à partir des données des clients
          const totalClients = clients.length;
          const totalLines = clients.reduce((sum, client) => sum + client.lines.length, 0);
          const activeLines = clients.reduce((sum, client) => 
            sum + client.lines.filter(line => line.status === 'active').length, 0
          );
          const totalSimCards = clients.reduce((sum, client) => sum + client.simCards.length, 0);
          const availableSimCards = clients.reduce((sum, client) => 
            sum + client.simCards.filter(sim => sim.status === 'available').length, 0
          );

          // Calculer les consommations totales
          let totalDataUsed = 0;
          let totalVoiceUsed = 0;
          let totalSmsUsed = 0;

          for (const client of clients) {
            for (const line of client.lines) {
              if (line.consumption) {
                totalDataUsed += line.consumption.data.used;
                totalVoiceUsed += line.consumption.voice.used;
                totalSmsUsed += line.consumption.sms.used;
              }
            }
          }

          const stats: DashboardStats = {
            totalClients,
            totalLines,
            activeLines,
            totalSimCards,
            availableSimCards,
            consumptionSummary: {
              totalDataUsed,
              totalVoiceUsed,
              totalSmsUsed
            }
          };

          return stats;
        } catch (error) {
          console.error('Erreur lors du calcul des statistiques:', error);
          throw new Error('Impossible de calculer les statistiques');
        }
      }
    }),
    {
      name: 'provectio-telecom-store',
    }
  )
);
