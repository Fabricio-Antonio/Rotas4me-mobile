import { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy,
  LocationObject,
} from "expo-location";
import { Text, View } from "@/components/Themed";
import MapView, { Marker } from "react-native-maps";
import { useFonts } from "expo-font";

export default function TabOneScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const [fontsLoaded] = useFonts({
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  });

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
      console.log("Current Position:", currentPosition);
    } else {
      console.log("Permissão de localização negada.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, usuária!</Text>
      </View>
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
        </>
      )}
      <View style={styles.recomendation}>
        <Text style={styles.recomendationText}>
          Ações recomendadas
        </Text>
      </View>
      <View style={styles.cardsContainer}>
        
        <View
          style={[styles.recomendationCard, { justifyContent: "flex-start" }]}
        >
          <Text style={styles.cardText}>Iniciar nova rota</Text>
        </View>
        <View style={[styles.recomendationCard, { justifyContent: "center" }]}>
          <Text style={styles.cardText}>
            Adicionar uma avaliação de uma rota
          </Text>
        </View>
        <View style={[styles.recomendationCard, { justifyContent: "center" }]}>
          <Text style={styles.cardText}>
            Iniciar preenchimento de um Boletim de Ocorrência
          </Text>
        </View>
        <View
          style={[styles.recomendationCard, { justifyContent: "flex-end" }]}
        >
          <Text style={styles.cardText}>
            Localizar posto da Polícia Federal mais próximo
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    textAlign: "left",
  },
  title: {
    fontSize: 38,
    fontFamily: "Poppins-SemiBold",
  },
  map: {
    width: "78%",
    height: "40%",
    marginVertical: 10,
    marginTop: 10,
  },
  header: {
    width: "100%",
    alignItems: "flex-start",
    marginLeft: 85,
  },
  recomendation: {
    width: "100%",
    alignItems: "flex-start",
    marginLeft: 85,
    marginTop: 20,
  },
  recomendationText: {
    width: "100%",
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  cardText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    paddingHorizontal: 10,
  },
  recomendationCard: {
    width: "48%",
    height: 110,
    backgroundColor: "#D65E75",
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    display: "flex",
    alignItems: "flex-start",
  },
});
