import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
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
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [originCoords, setOriginCoords] = useState<{latitude: number; longitude: number} | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<{latitude: number; longitude: number} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
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
      // Tentar carregar markers do backend diretamente
      const markers = await apiService.getSafetyMarkers();
      const validMarkers = Array.isArray(markers) ? markers : [];
      setSafetyMarkers(validMarkers);
      console.log('Markers carregados do backend:', validMarkers.length);
    } catch (error) {
      console.log('Nenhum marker no backend', error);
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
        description: 'Área de risco'
      },
      {
        id: '2',
        type: 'attention',
        latitude: baseLatitude - 0.001,
        longitude: baseLongitude + 0.002,
        description: 'Atenção redobrada'
      },
      {
        id: '3',
        type: 'camera',
        latitude: baseLatitude + 0.001,
        longitude: baseLongitude - 0.001,
        description: 'Câmera de segurança'
      },
      {
        id: '4',
        type: 'robery',
        latitude: baseLatitude - 0.002,
        longitude: baseLongitude - 0.002,
        description: 'Local de assaltos'
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
        
        // Usar coordenadas em vez de endereços de texto
        const originCoordinates = originCoords || (location ? `${location.coords.latitude},${location.coords.longitude}` : originAddress);
        const destinationCoordinates = destinationCoords ? `${destinationCoords.latitude},${destinationCoords.longitude}` : destinationAddress;
        
        const routeResponse = await apiService.calculateRoute(
          typeof originCoordinates === 'object' ? `${originCoordinates.latitude},${originCoordinates.longitude}` : originCoordinates,
          destinationCoordinates,
          undefined,
          'walking'
        );
        setRouteData(routeResponse);
        console.log('Rota calculada com sucesso:', routeResponse);
      } else {
        // Fallback para rota simulada
        console.log('Backend indisponível, usando rota simulada');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay
        
        const mockRoute: RouteResponse = {
          route: generateMockRoute(),
          distance: '2.5 km',
          duration: '8 min',
          avoidedMarkers: Array.isArray(safetyMarkers) ? safetyMarkers.filter(m => m.type === 'danger' || m.type === 'robery') : []
        };
        
        setRouteData(mockRoute);
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
          avoidedMarkers: Array.isArray(safetyMarkers) ? safetyMarkers.filter(m => m.type === 'danger' || m.type === 'robery') : []
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
              title={marker.description}
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
          
          {/* Rota calculada */}
          {routeData && (
            <Polyline
              coordinates={routeData.route}
              strokeColor="#D65E75"
              strokeWidth={4}
              lineDashPattern={[5, 5]}
            />
          )}
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

      {/* Informações da rota como overlay */}
      {routeData && (
        <View style={styles.routeInfoOverlay}>
          <Text style={styles.routeInfoText}>
            Distância: {routeData.distance} • Tempo: {routeData.duration}
          </Text>
          <Text style={styles.avoidedText}>
            {routeData.avoidedMarkers.length} área(s) de risco evitada(s)
          </Text>
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
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  routeInfoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    textAlign: 'center',
  },
  avoidedText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#D65E75',
    textAlign: 'center',
    marginTop: 5,
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