import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function SplashScreen() {
  const router = useRouter();
  const [loaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  });

  const handleStartPress = () => {
    router.replace('/(tabs)');
  };

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/image 75.png')} 
        style={styles.splashImage}
      />
      <View style={styles.messageContainer}>
        <Text style={styles.welcomeText}>Bem-vinda ao Rotas4Me</Text>
        <Text style={styles.subtitleText}>A melhor forma de encontrar rotas seguras diariamente</Text>
      </View>
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={handleStartPress}
      >
        <Text style={styles.startButtonText}>Começar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: 247,
    height: 189,
    position: 'absolute',
    left: 93,
    top: 206,
  },
  startButton: {
    position: 'absolute',
    left: 153,
    top: 685,
    width: 129,
    height: 42,
    borderRadius: 50,
    backgroundColor: '#D65e75',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  messageContainer: {
    position: 'absolute',
    left: 50,
    top: 451,
    right: 50,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    color: '#D65E75',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#33363F',
    textAlign: 'center',
    maxWidth: 280,
  },
});