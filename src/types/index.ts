// Types pour l'authentification Networth
export interface NetwAuthResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface NetwUser {
  userId: string;
  userName: string;
  email: string;
  rights: string[];
}

// Types pour les clients
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'suspended';
  lines: Line[];
  simCards: SimCard[];
}

// Types pour les lignes téléphoniques
export interface Line {
  id: string;
  clientId: string;
  msisdn: string; // Numéro de téléphone
  simReference: string; // Référence carte SIM
  operator: 'orange' | 'bouygues';
  plan: string; // Forfait
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  assignment?: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
  consumption?: ConsumptionData;
}

// Types pour les cartes SIM
export interface SimCard {
  id: string;
  clientId: string;
  reference: string;
  status: 'available' | 'activated' | 'blocked';
  operator: 'orange' | 'bouygues';
  createdAt: string;
  activatedAt?: string;
  lineId?: string; // Si activée, référence vers la ligne
}

// Types pour les données de consommation
export interface ConsumptionData {
  lineId: string;
  period: {
    start: string;
    end: string;
  };
  data: {
    used: number; // Mo utilisés
    limit: number; // Limite du forfait
    percentage: number;
  };
  voice: {
    used: number; // Minutes utilisées
    limit: number; // Limite du forfait
    percentage: number;
  };
  sms: {
    used: number; // SMS envoyés
    limit: number; // Limite du forfait
    percentage: number;
  };
  events: ConsumptionEvent[];
}

// Types pour les événements de consommation
export interface ConsumptionEvent {
  id: string;
  lineId: string;
  type: 'data' | 'voice' | 'sms';
  timestamp: string;
  amount: number;
  description: string;
  cost?: number;
}

// Types pour l'état de l'application
export interface AppState {
  isAuthenticated: boolean;
  user: NetwUser | null;
  token: string | null;
  refreshToken: string | null;
  clients: Client[];
  selectedClient: Client | null;
  loading: boolean;
  error: string | null;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Types pour les filtres et la pagination
export interface FilterOptions {
  status?: string;
  operator?: string;
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Types pour les statistiques
export interface DashboardStats {
  totalClients: number;
  totalLines: number;
  activeLines: number;
  totalSimCards: number;
  availableSimCards: number;
  consumptionSummary: {
    totalDataUsed: number;
    totalVoiceUsed: number;
    totalSmsUsed: number;
  };
}
