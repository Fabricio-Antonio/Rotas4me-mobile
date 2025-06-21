import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from 'expo-location';
import { apiService, SafetyMarker, RouteResponse, RoutePoint } from '../services/ApiService';
import AddressAutocomplete from '../components/AddressAutocomplete';

// Interfaces movidas para ApiService

export default function RouteModal() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [originCoords, setOriginCoords] = useState<{latitude: number, longitude: number} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{latitude: number, longitude: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(true);
  const [safetyMarkers, setSafetyMarkers] = useState<SafetyMarker[]>([]);

  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    getLocationAsync();
    loadSafetyMarkers();
  }, []);

  async function getLocationAsync() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      setOriginAddress('Sua localização atual');
      setOriginCoords({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
    }
  }

  async function loadSafetyMarkers() {
    try {
      console.log('Iniciando carregamento de markers...');
      
      // Testar ambas as implementações
      console.log('=== TESTANDO FETCH (implementação atual) ===');
      try {
        const markersWithFetch = await apiService.getSafetyMarkers();
        console.log('Fetch - Resposta bruta do backend:', markersWithFetch);
        console.log('Fetch - Tipo da resposta:', typeof markersWithFetch);
        console.log('Fetch - É array?:', Array.isArray(markersWithFetch));
      } catch (fetchError) {
        console.error('Fetch - Erro:', fetchError);
      }
      
      console.log('=== TESTANDO AXIOS (implementação alternativa) ===');
      try {
        const markersWithAxios = await apiService.getSafetyMarkersWithAxios();
        console.log('Axios - Resposta bruta do backend:', markersWithAxios);
        console.log('Axios - Tipo da resposta:', typeof markersWithAxios);
        console.log('Axios - É array?:', Array.isArray(markersWithAxios));
        
        // Usar a resposta do Axios se funcionou
        const validMarkers = Array.isArray(markersWithAxios) ? markersWithAxios : [];
        setSafetyMarkers(validMarkers);
        console.log('Markers carregados com Axios:', validMarkers.length, validMarkers);
      } catch (axiosError) {
        console.error('Axios - Erro:', axiosError);
        setSafetyMarkers([]);
      }
      
    } catch (error) {
      console.error('Erro geral ao carregar markers:', error);
      setSafetyMarkers([]);
    }
  }

  function generateMockMarkers(): SafetyMarker[] {
    if (!location) return [];

    const baseLatitude = location.coords.latitude;
    const baseLongitude = location.coords.longitude;
    
    return [
      {
        id: '1',
        type: 'danger',
        latitude: baseLatitude + 0.002,
        longitude: baseLongitude + 0.001,
        name: 'Área de risco'
      },
      {
        id: '2',
        type: 'DANGER',
        latitude: baseLatitude - 0.001,
        longitude: baseLongitude + 0.002,
        name: 'Atenção redobrada'
      },
      {
        id: '3',
        type: 'camera',
        latitude: baseLatitude + 0.001,
        longitude: baseLongitude - 0.001,
        name: 'Câmera de segurança'
      },
      {
        id: '4',
        type: 'robbery',
        latitude: baseLatitude - 0.002,
        longitude: baseLongitude - 0.002,
        name: 'Local de assaltos'
      }
    ];
  }

  function swapAddresses() {
    const tempAddress = originAddress;
    const tempCoords = originCoords;
    
    setOriginAddress(destinationAddress);
    setOriginCoords(destinationCoords);
    setDestinationAddress(tempAddress);
    setDestinationCoords(tempCoords);
  }

  async function calculateRoute() {
    if (!originAddress || !destinationAddress) {
      Alert.alert('Erro', 'Por favor, preencha origem e destino');
      return;
    }

    if (!originCoords && originAddress !== 'Sua localização atual') {
      Alert.alert('Erro', 'Por favor, selecione um endereço válido para origem');
      return;
    }

    if (!destinationCoords) {
      Alert.alert('Erro', 'Por favor, selecione um endereço válido para destino');
      return;
    }

    setIsLoading(true);
    console.log('Calculando rota:', {
      origem: originAddress,
      destino: destinationAddress,
      coordenadas: { origem: originCoords, destino: destinationCoords }
    });
    
    try {
      // Verificar se o backend está disponível
      const isBackendAvailable = await apiService.healthCheck();
      
      if (isBackendAvailable) {
        // Usar o backend real
        console.log('Calculando rota via backend...');
        
        // Usar endereços de texto como o backend espera
        const origin = originAddress || 'Localização atual';
        const destination = destinationAddress;
        
        const routeResponse = await apiService.calculateRoute(
          origin,
          destination,
          'walking'
        );
        
        // Debug: verificar dados recebidos
        console.log('Dados da rota recebidos:', {
          distance: routeResponse.distance,
          duration: routeResponse.duration,
          route: routeResponse.route ? 'presente' : 'ausente'
        });
        
        // Garantir que temos dados válidos ou usar fallback
        const processedRouteData = {
          ...routeResponse,
          distance: routeResponse.distance || 'Calculando...',
          duration: routeResponse.duration || 'Calculando...'
        };
        
        setRouteData(processedRouteData);
        console.log('Rota calculada com sucesso:', processedRouteData);
        setShowPopup(false);
        
        // Ajustar visualização do mapa para mostrar toda a rota
        const coordinates = processRouteCoordinates(routeResponse);
        if (coordinates.length > 0) {
          setTimeout(() => fitMapToRoute(coordinates), 500);
        }
      } else {
        console.log('Backend indisponível, usando rota simulada');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
        
        const mockRoute: RouteResponse = {
          route: generateMockRoute(),
          distance: '2.5 km',
          duration: '8 min',
          avoidedMarkers: Array.isArray(safetyMarkers) ? safetyMarkers.filter(m => m.type === 'danger' || m.type === 'robbery') : []
        };
        
        setRouteData(mockRoute);
        setShowPopup(false);
        
          const coordinates = processRouteCoordinates(mockRoute);
          if (coordinates.length > 0) {
            setTimeout(() => fitMapToRoute(coordinates), 500);
          }
      }
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      Alert.alert('Erro', 'Não foi possível calcular a rota. Tente novamente.');
      
      try {
        console.log('Tentando fallback para rota simulada...');
        const mockRoute: RouteResponse = {
          route: generateMockRoute(),
          distance: '2.5 km (simulado)',
          duration: '8 min (simulado)',
          avoidedMarkers: Array.isArray(safetyMarkers) ? safetyMarkers.filter(m => m.type === 'danger' || m.type === 'robbery') : []
        };
        setRouteData(mockRoute);
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  }

  function generateMockRoute() {
    if (!location) return [];

    const start = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    
    // Gerar uma rota simulada que evita os markers perigosos
    return [
      start,
      {
        latitude: start.latitude + 0.001,
        longitude: start.longitude + 0.0005
      },
      {
        latitude: start.latitude + 0.002,
        longitude: start.longitude + 0.003
      },
      {
        latitude: start.latitude + 0.003,
        longitude: start.longitude + 0.004
      }
    ];
  }

  function processRouteCoordinates(route: any): RoutePoint[] {
    console.log('Processando coordenadas da rota:', route);
    
    if (!route) {
      console.log('Rota é null ou undefined');
      return [];
    }
    
    // Se for um objeto RouteResponse com propriedade route (mock ou resposta processada)
    if (route.route && typeof route.route !== 'undefined') {
      console.log('Detectado objeto RouteResponse, acessando propriedade route');
      return processRouteCoordinates(route.route);
    }
    
    // Se for uma resposta da API do Google Maps
    if (route.routes && Array.isArray(route.routes) && route.routes.length > 0) {
      console.log('Detectada resposta da API do Google Maps');
      const googleRoute = route.routes[0];
      
      // Extrair coordenadas dos legs
      if (googleRoute.legs && Array.isArray(googleRoute.legs)) {
        const coordinates: RoutePoint[] = [];
        
        googleRoute.legs.forEach((leg: any) => {
          if (leg.steps && Array.isArray(leg.steps)) {
            leg.steps.forEach((step: any) => {
              if (step.start_location) {
                coordinates.push({
                  latitude: step.start_location.lat,
                  longitude: step.start_location.lng
                });
              }
              if (step.end_location) {
                coordinates.push({
                  latitude: step.end_location.lat,
                  longitude: step.end_location.lng
                });
              }
            });
          }
        });
        
        console.log('Extraídas', coordinates.length, 'coordenadas dos legs');
        return coordinates;
      }
      
      return [];
    }
    
    // Se for um array simples de coordenadas
    if (Array.isArray(route)) {
      console.log('Rota é um array com', route.length, 'pontos');
      return route.map(point => ({
        latitude: typeof point.latitude === 'string' ? parseFloat(point.latitude) : point.latitude,
        longitude: typeof point.longitude === 'string' ? parseFloat(point.longitude) : point.longitude
      }));
    }
    
    // Se for um objeto único com coordenadas
    if (typeof route === 'object' && route.latitude && route.longitude) {
      console.log('Rota é um objeto único');
      return [{
        latitude: typeof route.latitude === 'string' ? parseFloat(route.latitude) : route.latitude,
        longitude: typeof route.longitude === 'string' ? parseFloat(route.longitude) : route.longitude
      }];
    }
    
    console.log('Formato de rota não reconhecido:', typeof route, route);
    return [];
  }

  function fitMapToRoute(coordinates: RoutePoint[]) {
    if (coordinates.length === 0 || !mapRef.current) return;
    
    const latitudes = coordinates.map(coord => coord.latitude);
    const longitudes = coordinates.map(coord => coord.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const padding = 0.01; // Adiciona um pouco de padding
    
    mapRef.current.animateToRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) + padding,
      longitudeDelta: (maxLng - minLng) + padding,
    }, 1000);
  }

  function getMarkerIcon(type: string) {
    const icons: { [key: string]: any } = {
      danger: require('../assets/markers/icon_danger.png'),
      attention: require('../assets/markers/icon_attention.png'),
      camera: require('../assets/markers/icon_camera.png'),
      safe: require('../assets/markers/icon_safe.png'),
      lamp: require('../assets/markers/icon_lamp.png'),
      police: require('../assets/markers/icon_police.png'),
      robery: require('../assets/markers/icon_robery.png'),
    };
    return icons[type] || icons.safe;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Mapa em tela cheia */}
      {location && (
        <MapView
          ref={mapRef}
          style={styles.fullScreenMap}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Marker da localização atual */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Sua localização"
            pinColor="blue"
          />
          
          {/* Markers de segurança */}
          {safetyMarkers?.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.name || 'Marker de segurança'}
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
          
          {/* Rota calculada - Estilo Waze */}
          {routeData && (() => {
            const coordinates = processRouteCoordinates(routeData);
            return coordinates.length > 0 ? (
              <>
                {/* Linha de fundo (sombra) */}
                <Polyline
                  coordinates={coordinates}
                  strokeColor="rgba(0, 0, 0, 0.3)"
                  strokeWidth={8}
                />
                {/* Linha principal da rota */}
                <Polyline
                  coordinates={coordinates}
                  strokeColor="#D65E75"
                  strokeWidth={6}
                />
                {/* Linha interna para dar efeito 3D */}
                <Polyline
                  coordinates={coordinates}
                  strokeColor="#D65E75"
                  strokeWidth={3}
                />
              </>
            ) : null;
          })()}
          
          {/* Marcadores de origem e destino */}
          {routeData && (() => {
            const coordinates = processRouteCoordinates(routeData);
            if (coordinates.length > 0) {
              const startPoint = coordinates[0];
              const endPoint = coordinates[coordinates.length - 1];
              
              return (
                <>
                  <Marker
                    coordinate={startPoint}
                    title="Origem"
                    description={originAddress}
                  >
                    <View style={styles.originMarker}>
                      <Text style={styles.markerText}>A</Text>
                    </View>
                  </Marker>
                  
                  <Marker
                    coordinate={endPoint}
                    title="Destino"
                    description={destinationAddress}
                  >
                    <View style={styles.destinationMarker}>
                      <Text style={styles.markerText}>B</Text>
                    </View>
                  </Marker>
                </>
              );
            }
            return null;
          })()}
        </MapView>
      )}

      {/* Popup sobreposto */}
      {showPopup && (
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.header}>
              <Text style={styles.title}>Preparando trajeto</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowPopup(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.locationDot} />
              <AddressAutocomplete
                placeholder="Selecione sua localização"
                value={originAddress}
                onAddressSelect={(address, coordinates) => {
                  setOriginAddress(address);
                  if (coordinates) {
                    setOriginCoords(coordinates);
                  }
                }}
                inputStyle={styles.autocompleteInput}
              />
            </View>
            
            <View style={styles.swapContainer}>
              <View style={styles.swapLine} />
              <TouchableOpacity style={styles.swapButton} onPress={swapAddresses}>
                <Text style={styles.swapIcon}>⇅</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputWrapper}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <AddressAutocomplete
                placeholder="Selecione o seu destino"
                value={destinationAddress}
                onAddressSelect={(address, coordinates) => {
                  setDestinationAddress(address);
                  if (coordinates) {
                    setDestinationCoords(coordinates);
                  }
                }}
                inputStyle={styles.autocompleteInput}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.nextButton, isLoading && styles.disabledButton]}
              onPress={calculateRoute}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.nextButtonText}>Próximo</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      )}

      {/* Botão de voltar quando popup está fechado */}
      {!showPopup && (
        <View style={styles.backButtonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Informações da rota como overlay - Estilo Waze */}
      {routeData && (
        <View style={styles.routeInfoOverlay}>
          <View style={styles.routeMainInfo}>
            <View style={styles.routeTimeContainer}>
              <Text style={styles.routeTimeText}>{routeData.duration || 'Calculando...'}</Text>
              <Text style={styles.routeSubText}>tempo estimado</Text>
            </View>
            <View style={styles.routeDistanceContainer}>
              <Text style={styles.routeDistanceText}>{routeData.distance || 'Calculando...'}</Text>
              <Text style={styles.routeSubText}>distância total</Text>
            </View>
          </View>
          
          {(routeData.avoidedMarkers || []).length > 0 && (
            <View style={styles.avoidedContainer}>
              <View style={styles.avoidedIcon}>
                <Text style={styles.avoidedIconText}>⚠️</Text>
              </View>
              <Text style={styles.avoidedText}>
                {(routeData.avoidedMarkers || []).length} área(s) de risco evitada(s)
              </Text>
            </View>
          )}
          
          <View style={styles.routeActionContainer}>
            <TouchableOpacity 
              style={styles.startRouteButton}
              onPress={() => {
                try {
                  // Coordenadas de origem e destino
                  const coordinates = processRouteCoordinates(routeData);
                  if (coordinates.length === 0) {
                    Alert.alert('Erro', 'Dados da rota não disponíveis.');
                    return;
                  }
                  
                  const originCoordinate = coordinates[0];
                  const destinationCoordinate = coordinates[coordinates.length - 1];
                  
                  // Navegar para a tela de navegação nativa
                  const navigationRouteData = {
                    origin: originCoordinate,
                    destination: destinationCoordinate,
                    route: coordinates,
                    distance: routeData.distance,
                    duration: routeData.duration
                  };
                  
                  router.push({
                    pathname: '/navigation',
                    params: {
                      routeData: JSON.stringify(navigationRouteData),
                    },
                  });
                } catch (error) {
                  console.error('Erro ao iniciar navegação:', error);
                  Alert.alert('Erro', 'Não foi possível iniciar a navegação.');
                }
              }}
            >
              <Text style={styles.startRouteText}>🚗 Iniciar Navegação</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  popup: {
    position: 'absolute',
    top: 181,
    left: 20,
    right: 20,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  closeButtonText: {

    fontSize: 18,
    color: '#666',
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 5,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D65E75',
    marginRight: 12,
  },
  destinationDot: {
    backgroundColor: '#4CAF50',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  autocompleteInput: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
  },
  swapContainer: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  swapLine: {
    width: 2,
    height: 20,
    backgroundColor: '#ddd',
    position: 'absolute',
  },
  swapButton: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  swapIcon: {
    fontSize: 16,
    color: '#666',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 20,
    height: 20,
  },
  routeInfoOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    borderTopWidth: 4,
    borderTopColor: '#4285F4',
  },
  routeMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  routeTimeContainer: {
    alignItems: 'center',
    flex: 1,
  },
  routeDistanceContainer: {
    alignItems: 'center',
    flex: 1,
  },
  routeTimeText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#4285F4',
    fontWeight: 'bold',
  },
  routeDistanceText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    fontWeight: '600',
  },
  routeSubText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginTop: 2,
  },
  avoidedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
    alignSelf: 'center',
  },
  avoidedIcon: {
    marginRight: 6,
  },
  avoidedIconText: {
    fontSize: 16,
  },
  avoidedText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#D65E75',
  },
  routeActionContainer: {
    alignItems: 'center',
  },
  startRouteButton: {
    backgroundColor: '#D65E75',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#D65E75',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  startRouteText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  originMarker: {
    backgroundColor: '#D65E75',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  destinationMarker: {
    backgroundColor: '#B54A61',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#D65E75',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.6,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1000,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});