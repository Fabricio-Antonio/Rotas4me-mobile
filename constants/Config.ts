import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Função para detectar a URL correta do backend
function getBackendUrl(): string {
  // Prioridade 1: variável de ambiente .env (produção)
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    console.log('Backend URL (env):', process.env.EXPO_PUBLIC_BACKEND_URL);
    return process.env.EXPO_PUBLIC_BACKEND_URL;
  }
  
  // Prioridade 2: configuração do app.json (desenvolvimento)
  if (Constants.expoConfig?.extra?.backendUrl) {
    console.log('Backend URL (app.json):', Constants.expoConfig.extra.backendUrl);
    return Constants.expoConfig.extra.backendUrl;
  }
  
  // Para desenvolvimento: detectar se é simulador ou dispositivo físico
  if (__DEV__) {
    if (Platform.OS === 'ios') {
      // iOS Simulator pode usar localhost, dispositivos físicos usam IP da rede
      return Constants.platform?.ios?.simulator ? 'http://localhost:3000' : 'http://192.168.1.64:3000';
    } else if (Platform.OS === 'android') {
      // Android Emulator usa 10.0.2.2, dispositivos físicos usam IP da rede
      return Constants.platform?.android?.isDevice ? 'http://192.168.1.64:3000' : 'http://10.0.2.2:3000';
    }
  }
  
  // Fallback para IP da rede local
  return 'http://192.168.1.64:3000';
}

// Configurações do backend
export const API_CONFIG = {
  BASE_URL: getBackendUrl(),
  ENDPOINTS: {
    // Markers endpoints
    MARKERS: '/marker',
    MARKERS_BY_TYPE: '/marker/by-type',
    MARKERS_NEARBY: '/marker/nearby',
    
    // Maps endpoints
    ROUTE: '/maps/route',
    
    // User endpoints (se necessário no futuro)
    USERS: '/user',
    USERS_NEARBY: '/user/nearby',
    EMERGENCY_ALERT: '/user/{id}/emergency-alert'
  }
};

// Configurações do Google Maps e Places
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ,
  PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ,
};

// Configurações gerais
export const APP_CONFIG = {
  ENVIRONMENT: Constants.expoConfig?.extra?.environment || 'development',
  REQUEST_TIMEOUT: 10000, // 10 segundos
};