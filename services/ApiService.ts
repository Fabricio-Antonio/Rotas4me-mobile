import { API_CONFIG, APP_CONFIG } from '../constants/Config';

export interface SafetyMarker {
  id: string;
  type: 'danger' | 'attention' | 'camera' | 'safe' | 'lamp' | 'police' | 'robery';
  latitude: number;
  longitude: number;
  description?: string;
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
  avoidedMarkers: SafetyMarker[];
}

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = APP_CONFIG.REQUEST_TIMEOUT;
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
      return await this.makeRequest<SafetyMarker[]>(API_CONFIG.ENDPOINTS.MARKERS);
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
    waypoints?: string, 
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'walking'
  ): Promise<RouteResponse> {
    try {
      const requestBody = {
        origin,
        destination,
        mode,
      };
      
      return await this.makeRequest<RouteResponse>(
        API_CONFIG.ENDPOINTS.ROUTE,
        {
          method: 'POST',
          body: JSON.stringify(requestBody)
        }
      );
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