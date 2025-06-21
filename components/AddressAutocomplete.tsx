import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { nominatimService, GeocodeResult } from '../services/NominatimService';

interface AddressAutocompleteProps {
  placeholder: string;
  value: string;
  onAddressSelect: (address: string, coordinates?: { latitude: number; longitude: number }) => void;
  style?: any;
  inputStyle?: any;
}

export default function AddressAutocomplete({
  placeholder,
  value,
  onAddressSelect,
  style,
  inputStyle,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<GeocodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchRef = useRef<string>('');

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    // Cancelar busca anterior se existir
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Não fazer busca se for a mesma query anterior
    if (query.trim() === lastSearchRef.current) {
      return;
    }

    if (query.trim().length >= 3) {
      setIsLoading(true);
      
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          // Verificar se a query ainda é a mesma antes de fazer a requisição
          if (query.trim() === lastSearchRef.current) {
            setIsLoading(false);
            return;
          }
          
          lastSearchRef.current = query.trim();
          console.log('Buscando endereços para:', query.trim());
          
          const results = await nominatimService.searchPlaces(query.trim());
          
          // Verificar se a query ainda é atual após a resposta
          if (query.trim() === lastSearchRef.current) {
            setSuggestions(results);
            setShowSuggestions(results.length > 0);
          }
        } catch (error) {
          console.error('Erro na busca:', error);
          if (query.trim() === lastSearchRef.current) {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } finally {
          setIsLoading(false);
        }
      }, 800); // Debounce aumentado para 800ms para respeitar rate limit
    } else {
      setIsLoading(false);
      setSuggestions([]);
      setShowSuggestions(false);
      lastSearchRef.current = '';
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  const handleInputChange = (text: string) => {
    setQuery(text);
    if (text.trim().length < 3) {
      setShowSuggestions(false);
      setSuggestions([]);
      setIsLoading(false);
      lastSearchRef.current = '';
    }
  };

  const handleSuggestionPress = (suggestion: GeocodeResult) => {
    setQuery(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);
    onAddressSelect(suggestion.description, {
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
  };

  const renderSuggestion = ({ item }: { item: GeocodeResult }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
    >
      <Text style={styles.suggestionText} numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={query}
        onChangeText={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#D65E75" />
        </View>
      )}
      
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            bounces={false}
            removeClippedSubviews={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    margin: 0,
  },
  loadingContainer: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
    overflow: 'hidden',
  },
  suggestionsList: {
    maxHeight: 200,
    flexGrow: 0,
  },
  suggestionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
});