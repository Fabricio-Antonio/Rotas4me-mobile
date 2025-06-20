import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationObject,
} from 'expo-location';
import { Text, View } from '@/components/Themed';
import MapView, { Marker } from 'react-native-maps';

export default function TabOneScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  useEffect(() => {
    let subscription: any;

    const startWatching = async () => {
      subscription = await watchPositionAsync(
        {
          accuracy: LocationAccuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  async function getLocationAsync() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
      console.log('Current Position:', currentPosition);
    } else {
      console.log('Permissão de localização negada.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, usuária!</Text>
      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Você está aqui"
            />
          </MapView>
          <Text>
            Latitude: {location.coords.latitude}
            {'\n'}
            Longitude: {location.coords.longitude}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    width: '78%',
    height: '40%',
    marginVertical: 10,
  },
});
