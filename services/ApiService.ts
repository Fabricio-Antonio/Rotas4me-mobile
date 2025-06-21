import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, APP_CONFIG } from '../constants/Config';

// Interfaces para os tipos de dados
export interface SafetyMarker {
  id: string;
  latitude: number;
  longitude: number;
  type: 'ACCIDENT' | 'ROBBERY' | 'POOR_LIGHTING' | 'DANGER' | 'POLICE' | 'CAMERA' | 'SAFE_ZONE' | 'accident' | 'robbery' | 'poor_lighting' | 'danger' | 'police' | 'camera' | 'safe_zone';
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
}

export interface RouteRequest {
  origin: string;
  destination: string;
  avoidMarkers?: SafetyMarker[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface RouteResponse {
  route: RoutePoint[];
  distance: string;
  duration: string;
  avoidedMarkers?: SafetyMarker[]; // Opcional, pois o backend pode não retornar
}

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = APP_CONFIG.REQUEST_TIMEOUT;
    console.log('ApiService: Configurado com BASE_URL:', this.baseUrl);
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        // Se não for JSON, tenta ler como texto e lança erro
        const text = await response.text();
        throw new Error(`Expected JSON response but got: ${text}`);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Buscar todos os markers
  async getSafetyMarkers(): Promise<SafetyMarker[]> {
    try {
      console.log('ApiService: Fazendo requisição para:', `${this.baseUrl}${API_CONFIG.ENDPOINTS.MARKERS}`);
      const result = await this.makeRequest<SafetyMarker[]>(API_CONFIG.ENDPOINTS.MARKERS);
      console.log('ApiService: Resposta recebida:', result);
      return result;
    } catch (error) {
      console.error('ApiService: Erro na requisição de markers:', error);
      throw error;
    }
  }

  // Versão alternativa usando Axios para comparação
  async getSafetyMarkersWithAxios(): Promise<SafetyMarker[]> {
    try {
      const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.MARKERS}`;
      console.log('ApiService (Axios): Fazendo requisição para:', url);
      
      const response: AxiosResponse<SafetyMarker[]> = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('ApiService (Axios): Status da resposta:', response.status);
      console.log('ApiService (Axios): Headers da resposta:', response.headers);
      console.log('ApiService (Axios): Dados recebidos:', response.data);
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('ApiService (Axios): Erro Axios:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
      } else {
        console.error('ApiService (Axios): Erro desconhecido:', error);
      }
      throw error;
    }
  }

  // Buscar markers por tipo
  async getMarkersByType(types: string): Promise<SafetyMarker[]> {
    try {
      return await this.makeRequest<SafetyMarker[]>(
        `${API_CONFIG.ENDPOINTS.MARKERS_BY_TYPE}?types=${encodeURIComponent(types)}`
      );
    } catch (error) {
      console.error('Erro ao buscar markers por tipo:', error);
      throw error;
    }
  }

  // Buscar markers próximos
  async getNearbyMarkers(lat: number, lng: number, radius?: number): Promise<SafetyMarker[]> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        ...(radius && { radius: radius.toString() })
      });
      return await this.makeRequest<SafetyMarker[]>(
        `${API_CONFIG.ENDPOINTS.MARKERS_NEARBY}?${params.toString()}`
      );
    } catch (error) {
      console.error('Erro ao buscar markers próximos:', error);
      throw error;
    }
  }

  // Calcular rota
  async calculateRoute(
    origin: string, 
    destination: string, 
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'walking'
  ): Promise<RouteResponse> {
    try {
      const params = new URLSearchParams({
        origin,
        destination,
        mode,
      });
      
      const response = await this.makeRequest<RouteResponse>(
        `${API_CONFIG.ENDPOINTS.ROUTE}?${params.toString()}`
      );
      
      // Garantir que avoidedMarkers seja sempre um array
      return {
        ...response,
        avoidedMarkers: response.avoidedMarkers || []
      };
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      throw error;
    }
  }

  // Verificar se o backend está disponível
  async healthCheck(): Promise<boolean> {
    // Sempre retorna true para permitir que o app tente usar o backend
    // Se houver erro, será tratado nos métodos individuais
    return true;
  }
}

export const apiService = new ApiService();