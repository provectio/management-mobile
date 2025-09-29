import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { NetwAuthResponse, NetwUser, Client, Line, SimCard, ConsumptionData, ApiResponse } from '../types';

// Configuration axios pour éviter les problèmes de CORS
axios.defaults.withCredentials = false;

class NetwApiService {
  private api: AxiosInstance;
  private baseURL: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_NETW_API_BASE_URL || 'https://snaic.netw.fr/api/1.0';
    this.clientId = import.meta.env.VITE_NETW_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_NETW_CLIENT_SECRET || '';

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les erreurs d'authentification
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expiré, essayer de le renouveler
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            try {
              await this.refreshAccessToken();
              // Retry la requête originale
              return this.api.request(error.config);
            } catch (refreshError) {
              // Refresh échoué, déconnecter l'utilisateur
              this.logout();
              window.location.href = '/login';
            }
          } else {
            this.logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Gestion des tokens
  private getToken(): string | null {
    return Cookies.get('netw_token') || null;
  }

  private getRefreshToken(): string | null {
    return Cookies.get('netw_refresh_token') || null;
  }

  private setTokens(token: string, refreshToken: string): void {
    Cookies.set('netw_token', token, { expires: 1 }); // 1 jour
    Cookies.set('netw_refresh_token', refreshToken, { expires: 7 }); // 7 jours
  }

  private clearTokens(): void {
    Cookies.remove('netw_token');
    Cookies.remove('netw_refresh_token');
  }

  // Authentification
  async authenticateWithCredentials(username: string, password: string): Promise<NetwAuthResponse> {
    try {
      const response: AxiosResponse<NetwAuthResponse> = await this.api.post('/Auth/AuthUser', {
        username,
        password,
        return: 'TOKEN'
      });

      const { token, refreshToken } = response.data;
      this.setTokens(token, refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      throw new Error('Échec de l\'authentification');
    }
  }

  async authenticateWithAppToken(): Promise<NetwAuthResponse> {
    try {
      const response: AxiosResponse<NetwAuthResponse> = await this.api.post('/Auth/AuthUser', {
        client_name: this.clientId,
        client_secret: this.clientSecret,
        return: 'PTOKEN'
      });

      const { token, refreshToken } = response.data;
      this.setTokens(token, refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Erreur d\'authentification avec token app:', error);
      throw new Error('Échec de l\'authentification avec token application');
    }
  }

  async refreshAccessToken(): Promise<NetwAuthResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible');
      }

      const response: AxiosResponse<NetwAuthResponse> = await this.api.post('/Auth/refreshToken', {
        refreshtoken: refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data;
      this.setTokens(token, newRefreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Erreur de renouvellement du token:', error);
      throw new Error('Échec du renouvellement du token');
    }
  }

  async logout(): Promise<void> {
    this.clearTokens();
  }

  // Gestion des clients
  async getClients(): Promise<Client[]> {
    try {
      const response: AxiosResponse<ApiResponse<Client[]>> = await this.api.get('/Clients');
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      throw new Error('Impossible de récupérer les clients');
    }
  }

  async getClient(clientId: string): Promise<Client> {
    try {
      const response: AxiosResponse<ApiResponse<Client>> = await this.api.get(`/Clients/${clientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      throw new Error('Impossible de récupérer le client');
    }
  }

  // Gestion des lignes
  async getClientLines(clientId: string): Promise<Line[]> {
    try {
      const response: AxiosResponse<ApiResponse<Line[]>> = await this.api.get(`/Clients/${clientId}/lines`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes:', error);
      throw new Error('Impossible de récupérer les lignes du client');
    }
  }

  async getLine(lineId: string): Promise<Line> {
    try {
      const response: AxiosResponse<ApiResponse<Line>> = await this.api.get(`/Lines/${lineId}`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la ligne:', error);
      throw new Error('Impossible de récupérer la ligne');
    }
  }

  // Gestion des cartes SIM
  async getClientSimCards(clientId: string): Promise<SimCard[]> {
    try {
      const response: AxiosResponse<ApiResponse<SimCard[]>> = await this.api.get(`/Clients/${clientId}/simcards`);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des cartes SIM:', error);
      throw new Error('Impossible de récupérer les cartes SIM du client');
    }
  }

  // Données de consommation
  async getLineConsumption(lineId: string, period?: { start: string; end: string }): Promise<ConsumptionData> {
    try {
      const params = period ? { start: period.start, end: period.end } : {};
      const response: AxiosResponse<ApiResponse<ConsumptionData>> = await this.api.get(`/Lines/${lineId}/consumption`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la consommation:', error);
      throw new Error('Impossible de récupérer les données de consommation');
    }
  }

  // Vérification de l'état de l'authentification
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Récupération des informations utilisateur depuis le token
  getCurrentUser(): NetwUser | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Vérifier si le token est un JWT valide
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Token n\'est pas un JWT valide');
        return null;
      }

      // Décoder le JWT pour récupérer les informations utilisateur
      const payload = JSON.parse(atob(parts[1]));
      return {
        userId: payload.data?.userId || payload.userId || '',
        userName: payload.data?.userName || payload.userName || '',
        email: payload.data?.email || payload.email || '',
        rights: payload.data?.rights || payload.rights || []
      };
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
}

// Instance singleton
export const netwApi = new NetwApiService();
export default netwApi;
