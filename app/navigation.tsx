import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { navigationService, NavigationState, NavigationStep } from '../services/NavigationService';
import { apiService, SafetyMarker, RoutePoint } from '../services/ApiService';
import { Image } from 'react-native';
import * as Location from 'expo-location';

interface RouteData {
  origin: RoutePoint;
  destination: RoutePoint;
  route: RoutePoint[];
  distance: number;
  duration: number;
}

export default function NavigationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [safetyMarkers, setSafetyMarkers] = useState<SafetyMarker[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    currentStep: null,
    nextStep: null,
    remainingDistance: 0,
    remainingTime: 0,
    currentLocation: null,
    route: [],
    steps: [],
    currentStepIndex: 0
  });

  useEffect(() => {
    const initialize = async () => {
      await getCurrentLocation();
      await initializeNavigation();
      await loadSafetyMarkers();
    };
    initialize();
    return () => {
      navigationService.stopNavigation();
    };
  }, []);

  // Animar mapa para a região da rota quando os dados estiverem carregados
  useEffect(() => {
    if (routeData && mapRef.current) {
      const region = getMapRegion();
      if (region) {
        setTimeout(() => {
          mapRef.current?.animateToRegion(region, 1000);
        }, 500);
      }
    }
  }, [routeData]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    }
  };

  const loadSafetyMarkers = async () => {
    try {
      const markers = await apiService.getSafetyMarkers();
      setSafetyMarkers(Array.isArray(markers) ? markers : []);
    } catch (error) {
      console.error('Erro ao carregar marcadores de segurança:', error);
      setSafetyMarkers([]);
    }
  };

  const initializeNavigation = async () => {
    try {
      // Parse route data from params
      const routeDataParam = params.routeData as string;
      if (!routeDataParam) {
        console.error('Route data missing');
        return;
      }

      const parsedRouteData = JSON.parse(routeDataParam) as RouteData;
      console.log('Initializing navigation with route data:', parsedRouteData);
      
      if (!parsedRouteData.origin || !parsedRouteData.destination || !parsedRouteData.route) {
        console.error('Invalid route data');
        return;
      }

      // Set up navigation callbacks
      navigationService.onNavigationUpdate = (state: NavigationState) => {
        setNavigationState(state);
      };

      // Iniciar navegação
      const success = await navigationService.startNavigation(
        parsedRouteData.origin,
        parsedRouteData.destination,
        parsedRouteData.route
      );

      if (success) {
        console.log('Navigation started successfully');
        setRouteData(parsedRouteData);
      } else {
        console.error('Failed to start navigation');
      }
    } catch (error) {
      console.error('Error initializing navigation:', error);
    }
  };

  const handleStopNavigation = () => {
    navigationService.stopNavigation();
    router.back();
  };

  const getMarkerIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      danger: require('../assets/markers/icon_danger.png'),
      attention: require('../assets/markers/icon_attention.png'),
      camera: require('../assets/markers/icon_camera.png'),
      safe: require('../assets/markers/icon_safe.png'),
      lamp: require('../assets/markers/icon_lamp.png'),
      police: require('../assets/markers/icon_police.png'),
      robery: require('../assets/markers/icon_robery.png'),
      ACCIDENT: require('../assets/markers/icon_attention.png'),
      ROBBERY: require('../assets/markers/icon_robery.png'),
      POOR_LIGHTING: require('../assets/markers/icon_lamp.png'),
      DANGER: require('../assets/markers/icon_danger.png'),
      POLICE: require('../assets/markers/icon_police.png'),
      CAMERA: require('../assets/markers/icon_camera.png'),
      SAFE_ZONE: require('../assets/markers/icon_safe.png'),
      accident: require('../assets/markers/icon_attention.png'),
      robbery: require('../assets/markers/icon_robery.png'),
      poor_lighting: require('../assets/markers/icon_lamp.png'),
      safe_zone: require('../assets/markers/icon_safe.png'),
    };
    return icons[type] || icons.safe;
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const getMapRegion = () => {
    if (!routeData || !routeData.route || routeData.route.length === 0) {
      return undefined;
    }

    const coordinates = routeData.route;
    if (coordinates.length === 1) {
      return {
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    if (coordinates.length > 1) {
      const latitudes = coordinates.map(coord => coord.latitude);
      const longitudes = coordinates.map(coord => coord.longitude);
      
      const minLat = Math.min(...latitudes);
      const maxLat = Math.max(...latitudes);
      const minLng = Math.min(...longitudes);
      const maxLng = Math.max(...longitudes);
      
      const latDelta = (maxLat - minLat) * 1.3;
      const lngDelta = (maxLng - minLng) * 1.3;
      
      return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(latDelta, 0.01),
        longitudeDelta: Math.max(lngDelta, 0.01),
      };
    }
    
    return undefined;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="#1a1a1a" 
        translucent={false}
        hidden={false}
      />
      
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#1a1a1a' }}>
        <TouchableOpacity onPress={handleStopNavigation}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>Navegação</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Mapa */}
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={routeData ? getMapRegion() : (userLocation ? {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : {
            latitude: -23.5505,
            longitude: -46.6333,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          })}
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={navigationState.isNavigating}
        >
            {/* Rota */}
            {routeData && routeData.route && Array.isArray(routeData.route) && routeData.route.length > 0 && (
              <Polyline
                coordinates={routeData.route.map((point: RoutePoint) => ({
                   latitude: point.latitude,
                   longitude: point.longitude,
                 }))}
                strokeColor="#d6d6d6"
                strokeWidth={6}
                lineJoin="round"
                lineCap="round"
              />
            )}
            
            {/* Marcador de origem - primeiro ponto da rota */}
            {routeData && routeData.route && Array.isArray(routeData.route) && routeData.route.length > 0 && (
              <Marker
                coordinate={{
                  latitude: routeData.route[0].latitude,
                  longitude: routeData.route[0].longitude,
                }}
                title="Origem"
                pinColor="green"
                anchor={{ x: 0.5, y: 1 }}
                centerOffset={{ x: 0, y: -15 }}
              />
            )}
            
            {/* Marcador de destino - último ponto da rota */}
            {routeData && routeData.route && Array.isArray(routeData.route) && routeData.route.length > 1 && (
              <Marker
                coordinate={{
                  latitude: routeData.route[routeData.route.length - 1].latitude,
                  longitude: routeData.route[routeData.route.length - 1].longitude,
                }}
                title="Destino"
                pinColor="red"
                anchor={{ x: 0.5, y: 1 }}
                centerOffset={{ x: 0, y: -15 }}
              />
            )}
            
            {/* Marcadores de segurança */}
            {safetyMarkers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.type}
                anchor={{ x: 0.5, y: 0.5 }}
                centerOffset={{ x: 0, y: 0 }}
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={getMarkerIcon(marker.type)}
                    style={styles.markerIcon}
                    resizeMode="contain"
                  />
                </View>
              </Marker>
            ))}
        </MapView>
      </View>

      {/* Instruções de navegação */}
      <View style={styles.instructionPanel}>
        {navigationState.currentStep ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="navigate" size={24} color="#007AFF" />
              <Text style={styles.distanceText}>
                {formatDistance(navigationState.currentStep?.distance || 0)}
              </Text>
            </View>
            <Text style={styles.instructionText}>
              {navigationState.currentStep?.instruction || ''}
            </Text>
            {navigationState.nextStep && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 12, color: '#666', marginBottom: 5 }}>Próximo:</Text>
                <Text style={styles.nextInstruction}>
                  {navigationState.nextStep?.instruction || ''}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Ionicons name="location" size={24} color="#007AFF" />
              <Text style={styles.distanceText}>Navegação Iniciada</Text>
            </View>
            <Text style={styles.instructionText}>
              Siga a rota destacada no mapa
            </Text>
          </View>
        )}
      </View>

      {/* Informações da rota */}
      <View style={styles.controlPanel}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20, backgroundColor: 'white', padding: 15, borderRadius: 10 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>Tempo restante</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
              {navigationState.remainingTime > 0 ? formatTime(navigationState.remainingTime) : 'Calculando...'}
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>Distância restante</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
              {navigationState.remainingDistance > 0 ? formatDistance(navigationState.remainingDistance) : 'Calculando...'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleStopNavigation} style={styles.stopButton}>
          <Text style={styles.stopButtonText}>Parar Navegação</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  map: {
    flex: 1,
  },
  instructionPanel: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  nextInstruction: {
    fontSize: 14,
    color: '#666',
  },
  distanceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    marginLeft: 10,
  },
  controlPanel: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  stopButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  stopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  markerContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 24,
    height: 24,
  },
});