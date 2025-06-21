import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
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
import { Image } from "react-native";
import { View as RNView } from "react-native";
import { useRouter } from "expo-router";

export default function TabOneScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<LocationObject | null>(null);

  const [fontsLoaded] = useFonts({
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
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
        <Text style={styles.title}>Olá, usuária! </Text>
      </View>
      {location && (
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
      )}
      <View style={styles.recomendation}>
        <Text style={styles.recomendationText}>Ações recomendadas</Text>
      </View>
      <View style={styles.cardsContainer}>
        <TouchableOpacity 
          style={[styles.recomendationCard, styles.cardNewRoute]}
          onPress={() => router.push('/modal')}
        >
          <Text style={styles.cardText}>Iniciar{"\n"}nova rota</Text>
          <Image
            source={require("../../assets/images/hand.png")}
            style={{ width: 60, height: 60 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={[styles.recomendationCard, { justifyContent: "center" }]}>
          <Text style={styles.cardText}>
            Adicionar uma avaliação de uma rota
          </Text>
        </View>
        <View style={[styles.recomendationCard, { justifyContent: "center" }]}>
          <Text style={styles.cardText}>
            Iniciar preenchimento de um{" "}
            <Text style={styles.boldText}>Boletim de Ocorrência</Text>
          </Text>
        </View>
        <View style={[styles.recomendationCard, styles.cardLocateStation]}>
          <Image
            source={require("../../assets/images/lupe.png")}
            style={styles.iconStyle}
            resizeMode="contain"
          />
          <RNView style={styles.cardLocateTextWrapper}>
            <Text style={styles.cardLocateText}>
              Localizar{"\n"}posto da{"\n"}
              <Text style={styles.boldText}>PF</Text>
              {"\n"}próximo
            </Text>
          </RNView>
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
    marginTop: 20,
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
    fontFamily: "Poppins-Medium",
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#FFFFFF",
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
  cardNewRoute: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardLocateStation: {
    backgroundColor: "#D65E75",
    flexDirection: "row",
    alignItems: "center",
    height: 110,
    width: "48%",
    borderRadius: 12,
    textAlign: "left",
  },
  iconStyle: {
    width: 40,
    height: 40,
    marginRight: 8,
  },

  cardLocateTextWrapper: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "70%",
  },

  cardLocateText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "left",
    lineHeight: 16,
    flexShrink: 1,
  },

  boldText: {
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
});
