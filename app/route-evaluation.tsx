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
  ScrollView,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import MapView, { Marker, Polyline } from 'react-native-maps';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from 'expo-location';
import { apiService, SafetyMarker } from '../services/ApiService';
import { nominatimService, GeocodeResult } from '../services/NominatimService';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface RouteEvaluation {
  id: string;
  origin: string;
  destination: string;
  securityRating: number;
  characteristics: {
    wellLit: boolean;
    nearPolice: boolean;
    openCommerce: boolean;
    deserted: boolean;
    harassmentHistory: boolean;
  };
  comments: string;
  imageUri?: string;
  timestamp: Date;
}

export default function RouteEvaluationScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<GeocodeResult | null>(null);
  const [safetyMarkers, setSafetyMarkers] = useState<SafetyMarker[]>([]);
  const [routeEvaluations, setRouteEvaluations] = useState<RouteEvaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<RouteEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewEvaluationModal, setShowNewEvaluationModal] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState({
    origin: '',
    destination: '',
    securityRating: 0,
    characteristics: {
      wellLit: false,
      nearPolice: false,
      openCommerce: false,
      deserted: false,
      harassmentHistory: false,
    },
    comments: '',
    imageUri: '',
  });

  const [fontsLoaded] = useFonts({
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    getLocationAsync();

    loadMockEvaluations();
  }, []);

  async function getLocationAsync() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  async function loadSafetyMarkers() {
    try {
      const markers = await apiService.getSafetyMarkers();
      const validMarkers = Array.isArray(markers) ? markers : [];
      setSafetyMarkers(validMarkers);
    } catch (error) {
      console.log('Nenhum marker no backend', error);
      setSafetyMarkers([]);
    }
  }

  function loadMockEvaluations() {
    const mockEvaluations: RouteEvaluation[] = [
      {
        id: '1',
        origin: 'Shopping Conjunto Nacional',
        destination: 'Praça dos Três Poderes',
        securityRating: 4,
        characteristics: {
          wellLit: true,
          nearPolice: true,
          openCommerce: true,
          deserted: false,
          harassmentHistory: false,
        },
        comments: 'Rota bem iluminada e movimentada, com comércio aberto e presença policial',
        timestamp: new Date('2024-01-15'),
      },
      {
        id: '2',
        origin: 'Estação Central do Metrô',
        destination: 'Parque da Cidade',
        securityRating: 3,
        characteristics: {
          wellLit: true,
          nearPolice: false,
          openCommerce: true,
          deserted: false,
          harassmentHistory: true,
        },
        comments: 'Algumas áreas com pouca iluminação, histórico de assédio verbal',
        timestamp: new Date('2024-01-14'),
      },
      {
        id: '3',
        origin: 'Universidade de Brasília',
        destination: 'Setor Comercial Sul',
        securityRating: 2,
        characteristics: {
          wellLit: false,
          nearPolice: false,
          openCommerce: false,
          deserted: true,
          harassmentHistory: true,
        },
        comments: 'Evitar passar por esta rota à noite, área deserta e sem iluminação',
        timestamp: new Date('2024-01-13'),
      },
    ];
    setRouteEvaluations(mockEvaluations);
    setFilteredEvaluations(mockEvaluations);
  }

  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      searchLocations();
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
    
    filterEvaluations();
  }, [searchQuery, routeEvaluations]);

  async function searchLocations() {
    setIsSearching(true);
    try {
      const results = await nominatimService.searchPlaces(searchQuery.trim());
      setSearchResults(results);
      setShowSearchResults(results.length > 0);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  }

  function handleLocationSelect(location: GeocodeResult) {
    setSelectedLocation(location);
    setSearchQuery(location.description);
    setShowSearchResults(false);
  }

  function handleAddNewEvaluation() {
    setShowNewEvaluationModal(true);
  }

  function handleSaveEvaluation() {
    if (!newEvaluation.origin || !newEvaluation.destination || newEvaluation.securityRating === 0) {
      Alert.alert('Erro', 'Por favor, preencha origem, destino e avaliação de segurança');
      return;
    }

    const evaluation: RouteEvaluation = {
      id: Date.now().toString(),
      origin: newEvaluation.origin,
      destination: newEvaluation.destination,
      securityRating: newEvaluation.securityRating,
      characteristics: newEvaluation.characteristics,
      comments: newEvaluation.comments,
      imageUri: newEvaluation.imageUri,
      timestamp: new Date(),
    };

    setRouteEvaluations([evaluation, ...routeEvaluations]);
    setFilteredEvaluations([evaluation, ...filteredEvaluations]);
    setNewEvaluation({
      origin: '',
      destination: '',
      securityRating: 0,
      characteristics: {
        wellLit: false,
        nearPolice: false,
        openCommerce: false,
        deserted: false,
        harassmentHistory: false,
      },
      comments: '',
      imageUri: '',
    });
    setShowNewEvaluationModal(false);
  }

  function handleRatingPress(rating: number) {
    setNewEvaluation(prev => ({ ...prev, securityRating: rating }));
  }

  function handleSafetyLevelPress(level: 'safe' | 'moderate' | 'dangerous') {
    setNewEvaluation(prev => ({ ...prev, safetyLevel: level }));
  }

  function handleCharacteristicChange(characteristic: keyof typeof newEvaluation.characteristics, value: boolean) {
    setNewEvaluation(prev => ({
      ...prev,
      characteristics: {
        ...prev.characteristics,
        [characteristic]: value,
      },
    }));
  }

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setNewEvaluation(prev => ({ ...prev, imageUri: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  }

  function removeImage() {
    setNewEvaluation(prev => ({ ...prev, imageUri: '' }));
  }

  function getSafetyLevelColor(level: string) {
    switch (level) {
      case 'safe': return '#4CAF50';
      case 'moderate': return '#FF9800';
      case 'dangerous': return '#F44336';
      default: return '#999';
    }
  }

  function getSafetyLevelText(level: string) {
    switch (level) {
      case 'safe': return 'Segura';
      case 'moderate': return 'Moderada';
      case 'dangerous': return 'Perigosa';
      default: return 'Desconhecida';
    }
  }

  function renderStars(rating: number) {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? 'star' : 'star-outline'}
        size={16}
        color={index < rating ? '#FFD700' : '#CCC'}
      />
    ));
  }

  function renderEvaluationItem({ item }: { item: RouteEvaluation }) {
    return (
      <TouchableOpacity style={styles.evaluationItem}>
        <View style={styles.evaluationHeader}>
          <Text style={styles.evaluationRoute}>
            {item.origin} → {item.destination}
          </Text>
          <View style={styles.ratingContainer}>
            {renderStars(item.securityRating)}
          </View>
        </View>
        
        <View style={styles.evaluationDetails}>
          <Text style={styles.evaluationDate}>
            {item.timestamp.toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        <View style={styles.characteristicsContainer}>
          <Text style={styles.characteristicsTitle}>Características:</Text>
          <View style={styles.characteristicsList}>
            {Object.entries(item.characteristics).map(([key, value]) => (
              value && (
                <View key={key} style={styles.characteristicTag}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.characteristicTagText}>
                    {getParameterLabel(key)}
                  </Text>
                </View>
              )
            ))}
          </View>
        </View>
        
        {item.imageUri && (
          <View style={styles.evaluationImageContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.evaluationImage} />
          </View>
        )}
        
        <Text style={styles.evaluationComments} numberOfLines={3}>
          {item.comments}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderSearchResult({ item }: { item: GeocodeResult }) {
    return (
      <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => handleLocationSelect(item)}
      >
        <Ionicons name="location-outline" size={20} color="#D65E75" />
        <Text style={styles.searchResultText} numberOfLines={2}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  }

  function getParameterLabel(parameter: string): string {
    const labels: { [key: string]: string } = {
      wellLit: 'Bem iluminado',
      nearPolice: 'Próximo de Posto Polícia',
      openCommerce: 'Comércio aberto',
      deserted: 'Deserto',
      harassmentHistory: 'Histórico de assédio verbal',
    };
    return labels[parameter] || parameter;
  }

  function getParameterDescription(parameter: string): string {
    const descriptions: { [key: string]: string } = {
      wellLit: 'A rota possui boa iluminação',
      nearPolice: 'Há posto policial próximo à rota',
      openCommerce: 'Existe comércio aberto na área',
      deserted: 'A área é deserta/isolada',
      harassmentHistory: 'Histórico de assédio verbal na região',
    };
    return descriptions[parameter] || '';
  }

  function filterEvaluations() {
    if (!searchQuery.trim()) {
      setFilteredEvaluations(routeEvaluations);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = routeEvaluations.filter(evaluation => {
      if (evaluation.origin.toLowerCase().includes(query)) return true;
      
      if (evaluation.destination.toLowerCase().includes(query)) return true;
      
      if (evaluation.comments.toLowerCase().includes(query)) return true;
      
      const characteristics = Object.entries(evaluation.characteristics)
        .filter(([_, value]) => value)
        .map(([key, _]) => getParameterLabel(key))
        .join(' ')
        .toLowerCase();
      
      if (characteristics.includes(query)) return true;
      
      return false;
    });

    setFilteredEvaluations(filtered);
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
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
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Sua localização"
            pinColor="blue"
          />
          
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
                  source={require('../assets/markers/icon_danger.png')}
                  style={styles.markerIcon}
                  resizeMode="contain"
                />
              </View>
            </Marker>
          ))}
          
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="Local selecionado"
              pinColor="red"
            />
          )}
        </MapView>
      )}

      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar avaliações por local, destino ou características..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowSearchResults(true);
              }
            }}
          />
          {searchQuery.trim() && (
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
          {isSearching && (
            <ActivityIndicator size="small" color="#D65E75" style={styles.searchLoading} />
          )}
        </View>
      </View>

      {showSearchResults && searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            style={styles.searchResultsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.evaluationsContainer}>
        <View style={styles.evaluationsHeader}>
          <Text style={styles.evaluationsTitle}>
            Avaliações de Rotas
            {searchQuery.trim() && (
              <Text style={styles.filterIndicator}>
                {' '}({filteredEvaluations.length} resultado{filteredEvaluations.length !== 1 ? 's' : ''})
              </Text>
            )}
          </Text>
          <TouchableOpacity style={styles.addEvaluationButton} onPress={handleAddNewEvaluation}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.addEvaluationText}>Nova</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredEvaluations}
          renderItem={renderEvaluationItem}
          keyExtractor={(item) => item.id}
          style={styles.evaluationsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.trim() ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#CCC" />
                <Text style={styles.emptyStateTitle}>Nenhuma avaliação encontrada</Text>
                <Text style={styles.emptyStateText}>
                  Tente buscar por outros termos ou criar uma nova avaliação
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {showNewEvaluationModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Avaliação de Rota</Text>
              <TouchableOpacity 
                style={styles.closeModalButton}
                onPress={() => setShowNewEvaluationModal(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Origem *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Digite a origem"
                  value={newEvaluation.origin}
                  onChangeText={(text) => setNewEvaluation(prev => ({ ...prev, origin: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Destino *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Digite o destino"
                  value={newEvaluation.destination}
                  onChangeText={(text) => setNewEvaluation(prev => ({ ...prev, destination: text }))}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Avaliação de Segurança *</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleRatingPress(star)}
                      style={styles.starButton}
                    >
                      <Ionicons
                        name={star <= newEvaluation.securityRating ? 'star' : 'star-outline'}
                        size={30}
                        color={star <= newEvaluation.securityRating ? '#FFD700' : '#CCC'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Características</Text>
                <Text style={styles.inputSubLabel}>
                  Marque as características que se aplicam à rota
                </Text>
                
                {Object.entries(newEvaluation.characteristics).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={styles.characteristicItem}
                    onPress={() => handleCharacteristicChange(key as keyof typeof newEvaluation.characteristics, !value)}
                  >
                    <View style={styles.characteristicContent}>
                      <Ionicons
                        name={value ? 'checkbox' : 'checkbox-outline'}
                        size={24}
                        color={value ? '#D65E75' : '#CCC'}
                      />
                      <Text style={styles.characteristicText}>
                        {getParameterLabel(key)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Comentários</Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  placeholder="Adicione comentários sobre a rota..."
                  value={newEvaluation.comments}
                  onChangeText={(text) => setNewEvaluation(prev => ({ ...prev, comments: text }))}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Adicionar Imagem</Text>
                {newEvaluation.imageUri ? (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: newEvaluation.imageUri }} style={styles.selectedImage} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                    <Ionicons name="camera-outline" size={32} color="#D65E75" />
                    <Text style={styles.addImageText}>Selecionar Imagem</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowNewEvaluationModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveEvaluation}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
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
    flex: 1,
  },
  markerContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerIcon: {
    width: 25,
    height: 25,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    paddingVertical: 8,
  },
  searchLoading: {
    marginLeft: 10,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  searchResultsList: {
    maxHeight: 200,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  evaluationsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  evaluationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  evaluationsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  filterIndicator: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  addEvaluationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D65E75',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addEvaluationText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FFF',
  },
  evaluationsList: {
    flex: 1,
  },
  evaluationItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  evaluationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  evaluationRoute: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evaluationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#FFF',
  },
  evaluationDate: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  evaluationComments: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#555',
    lineHeight: 18,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  closeModalButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginBottom: 8,
  },
  inputSubLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  starButton: {
    padding: 5,
  },
  safetyLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  safetyLevelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  safetyLevelText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  safetyLevelTextActive: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 10,
    borderRadius: 8,
    backgroundColor: '#D65E75',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#fff',
  },
  parameterContainer: {
    marginBottom: 10,
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  parameterLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  parameterValue: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  parameterDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#555',
  },
  parameterStars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  parameterStarButton: {
    padding: 5,
  },
  parametersContainer: {
    marginBottom: 10,
  },
  parametersTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginBottom: 5,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  parameterItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginRight: 5,
    flex: 1,
  },
  characteristicContainer: {
    marginBottom: 10,
  },
  characteristicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  characteristicLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  characteristicValue: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  characteristicButton: {
    padding: 5,
  },
  characteristicItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 5,
  },
  characteristicContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characteristicText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    padding: 5,
  },
  addImageButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  addImageText: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  characteristicsContainer: {
    marginBottom: 10,
  },
  characteristicsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginBottom: 5,
  },
  characteristicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characteristicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  characteristicTagText: {
    marginLeft: 5,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  evaluationImageContainer: {
    marginBottom: 10,
  },
  evaluationImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
  clearSearchButton: {
    padding: 5,
  },
});