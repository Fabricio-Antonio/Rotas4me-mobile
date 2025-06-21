import Constants from 'expo-constants';

// Configurações do backend
export const API_CONFIG = {
  BASE_URL: Constants.expoConfig?.extra?.backendUrl || process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000',
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
  API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBzbZbLPhU2Iq4AXR7RqDxRCy0er492Oig',
  PLACES_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || 'AIzaSyBzbZbLPhU2Iq4AXR7RqDxRCy0er492Oig',
};

// Configurações gerais
export const APP_CONFIG = {
  ENVIRONMENT: Constants.expoConfig?.extra?.environment || 'development',
  REQUEST_TIMEOUT: 10000, // 10 segundos
};