import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { apiService } from '../../services/ApiService';

export default function TabCallScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [fontsLoaded] = useFonts({
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleEmergencyCall = async () => {
    setIsLoading(true);
    
    try {
      // Solicitar permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      let userLocation;
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
      }
      
      // Enviar SMS de emergência
      const result = await apiService.sendEmergencySMS(userLocation);
      
      Alert.alert(
        'Sucesso',
        'SMS de emergência enviado com sucesso!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível enviar o SMS de emergência. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        
        <Text style={styles.title}>Emergência</Text>
        <View style={styles.alertContainer}>
          <View style={styles.bellContainer}>
            <View style={styles.waveOuter}>
              <View style={styles.waveMiddle}>
                <View style={styles.waveInner}>
                  <View style={styles.bellIcon}>
                    <View style={styles.bellBody}>
                      <View style={styles.bellTop} />
                    </View>
                    <View style={styles.bellBottom} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.helpButton, isLoading && styles.helpButtonDisabled]}
          onPress={handleEmergencyCall}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.helpButtonText}>
            {isLoading ? 'Enviando...' : 'Pedido de ajuda'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 37,
    fontFamily: 'Poppins-Bold',
    color: '#33363F',
    fontWeight: 'bold',
    position: 'absolute',
    top: 100,
    letterSpacing: 2,
  },
  alertContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  bellContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: 'rgba(214, 94, 117, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveMiddle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: 'rgba(214, 94, 117, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(214, 94, 117, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBody: {
    width: 50,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    position: 'relative',
  },
  bellTop: {
    width: 12,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    position: 'absolute',
    top: -8,
    left: 19,
  },
  bellBottom: {
    width: 20,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 2,
  },
  helpButton: {
    position: 'absolute',
    left: 100,
    top: 694,
    width: 229,
    height: 60,
    backgroundColor: '#D65E75',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  helpButtonDisabled: {
    backgroundColor: '#B8B8B8',
    opacity: 0.7,
  },
  helpButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
