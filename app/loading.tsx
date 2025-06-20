import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

export default function LoadingScreen() {
  const router = useRouter();
  const [loaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      // Aguarda 2 segundos antes de navegar para a tela de splash
      const timer = setTimeout(() => {
        router.replace('/splash');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loaded, router]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/image 75.png')} 
        style={styles.loadingImage}
      />
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
  loadingImage: {
    width: 247,
    height: 189,
  },
});