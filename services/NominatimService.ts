export interface NominatimResult {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

export interface GeocodeResult {
  id: string;
  description: string;
  latitude: number;
  longitude: number;
}

interface CacheEntry {
  data: GeocodeResult[];
  timestamp: number;
}

class NominatimService {
  private baseUrl = 'https://nominatim.openstreetmap.org';
  private cache = new Map<string, CacheEntry>();
  private lastRequestTime = 0;
  private readonly RATE_LIMIT_MS = 1100; // 1.1 segundos para ser seguro
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos
  private requestQueue: Array<() => void> = [];
  private isProcessingQueue = false;

  private async throttledRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const now = Date.now();
          const timeSinceLastRequest = now - this.lastRequestTime;
          
          if (timeSinceLastRequest < this.RATE_LIMIT_MS) {
            const waitTime = this.RATE_LIMIT_MS - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
          
          this.lastRequestTime = Date.now();
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();
      if (request) {
        await request();
      }
    }
    
    this.isProcessingQueue = false;
  }

  private getCacheKey(query: string, countryCode: string): string {
    return `search_${query.toLowerCase().trim()}_${countryCode}`;
  }

  private isValidCache(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.CACHE_DURATION_MS;
  }

  async searchPlaces(query: string, countryCode: string = 'br'): Promise<GeocodeResult[]> {
    if (!query || query.trim().length < 3) {
      return [];
    }

    // Verificar cache primeiro
    const cacheKey = this.getCacheKey(query, countryCode);
    const cachedEntry = this.cache.get(cacheKey);
    
    if (cachedEntry && this.isValidCache(cachedEntry)) {
      console.log('Resultado do cache para:', query);
      return cachedEntry.data;
    }

    try {
      const result = await this.throttledRequest(async () => {
        const encodedQuery = encodeURIComponent(query.trim());
        const url = `${this.baseUrl}/search?format=json&addressdetails=1&limit=5&countrycodes=${countryCode}&q=${encodedQuery}`;
        
        console.log('Fazendo requisição para Nominatim:', query);
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Rotas4me-mobile/1.0.0',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: NominatimResult[] = await response.json();
        
        return data.map((item) => ({
          id: item.place_id,
          description: item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
        }));
      });

      // Armazenar no cache
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Erro ao buscar endereços:', error);
      return [];
    }
  }

  async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    // Cache para geocodificação reversa
    const cacheKey = `reverse_${latitude.toFixed(6)}_${longitude.toFixed(6)}`;
    const cachedEntry = this.cache.get(cacheKey);
    
    if (cachedEntry && this.isValidCache(cachedEntry)) {
      console.log('Resultado do cache para geocodificação reversa');
      return cachedEntry.data[0]?.description || 'Endereço não encontrado';
    }

    try {
      const result = await this.throttledRequest(async () => {
        const url = `${this.baseUrl}/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;
        
        console.log('Fazendo requisição reversa para Nominatim');
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Rotas4me-mobile/1.0.0',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: NominatimResult = await response.json();
        return data.display_name || 'Endereço não encontrado';
      });

      // Armazenar no cache
      this.cache.set(cacheKey, {
        data: [{ id: '', description: result, latitude, longitude }],
        timestamp: Date.now()
      });

      return result;
    } catch (error) {
      console.error('Erro ao buscar endereço reverso:', error);
      return 'Endereço não encontrado';
    }
  }

  // Método para limpar cache antigo
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValidCache(entry)) {
        this.cache.delete(key);
      }
    }
  }
}

export const nominatimService = new NominatimService();