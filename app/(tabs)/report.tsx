import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

export default function TabReportScreen() {
  const [fontsLoaded] = useFonts({
    "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Light": require("../../assets/fonts/Poppins-Light.ttf"),
  });

  return (
    <View style={styles.container}>
      <Ionicons name="notifications-outline" size={30} color="#33363F" style={styles.bellIcon} />
      <Ionicons name="settings-outline" size={28} color="#33363F" style={styles.settingsIcon} />
      <View style={styles.header}>
        <Text style={styles.title}>Ajuda Rápida</Text>
        <Text style={styles.subtitle}>Você não está sozinha!</Text>
        <Text style={styles.questionText}>Em que posso ajudar?</Text>
      </View>
      <View style={styles.balloonContainer}>
        <Text style={styles.balloonText}>
          Acessar <Text style={{fontWeight: 'bold'}}>Delegacia Eletrônica</Text> do DF
        </Text>
      </View>
      <View style={styles.balloonContainer2}>
        <Text style={styles.balloonText2}>
        <Text style={{fontWeight: 'bold'}}>  Ligar para 180 </Text> Violência contra{"\n"}a mulher
        </Text>
      </View>
      <View style={styles.balloonContainer3}>
        <Text style={styles.balloonText3}>
          Iniciar um <Text style={{fontWeight: 'bold'}}>Boletim{"\n"} de Ocorrência</Text>
        </Text>
      </View>
      <View style={styles.balloonContainer4}>
        <Text style={styles.balloonText4}>
          Compartilhar Localização
        </Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.supportNetworkText}>Localizar rede de apoio</Text>
      <Image 
        source={require('../../assets/images/image 67.png')} 
        style={styles.imageContainer}
      />
      <View style={styles.delegaciasBalloon}>
         <Text style={styles.delegaciasText}>Delegacias</Text>
       </View>
       <Image 
         source={require('../../assets/images/image 68.png')} 
         style={styles.imageContainer2}
       />
       <View style={styles.assistenciaBalloon}>
         <Text style={styles.assistenciaText}>Assistência Social</Text>
       </View>

       {/* Acessar mais informações e orientações text */}
       <Text style={styles.moreInfoText}>Acessar mais informações e orientações</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginTop: 20,
    marginLeft: 37,
    marginRight: 204,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#33363F',
    width: 189,
    height: 114,
    textAlignVertical: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#33363F',
    width: 271,
    height: 24,
    marginTop: 3,
    marginLeft: 0,
    marginRight: 122,
  },
  bellIcon: {
    position: 'absolute',
    top: 32,
    right: 97,
    left: 303,
    width: 30,
    height: 30,
    color: '#33363F',
  },
  settingsIcon: {
    position: 'absolute',
    top: 33,
    left: 360,
    right: 42,
    width: 28,
    height: 28,
    color: '#33363F',
  },
  questionText: {
    marginTop: 236 - 138 -57,
    width: 271,
    height: 34,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#33363F',
  },
  balloonContainer: {
    position: 'absolute',
    width: 168,
    height: 55,
    left: 38,
    top: 273,
    backgroundColor: '#D65E75',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloonText: {
    width: 130,
    height: 55,
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  balloonContainer2: {
    backgroundColor: '#D65E75',
    width: 130,
    height: 55,
    position: 'absolute',
    left: 227,
    top: 273,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloonText2: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  balloonContainer3: {
    backgroundColor: '#D65E75',
    width: 151,
    height: 55,
    position: 'absolute',
    left: 37,
    top: 343,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloonText3: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  balloonContainer4: {
    backgroundColor: '#D65E75',
    width: 130,
    height: 55,
    position: 'absolute',
    left: 206,
    top: 343,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balloonText4: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  addButton: {
    position: 'absolute',
    left: 350,
    top: 350,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000000',
    textAlign: 'center',
  },
  supportNetworkText: {
    position: 'absolute',
    left: 38,
    top: 436,
    width: 271,
    height: 34,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#33363F',
  },
  imageContainer: {
    position: 'absolute',
    left: 39,
    top: 476,
    width: 164,
    height: 117,
    borderRadius: 10,
  },
  delegaciasBalloon: {
    position: 'absolute',
    left: 38,
    top: 476,
    width: 89,
    height: 36,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delegaciasText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#33363F',
    textAlign: 'center',
  },
  imageContainer2: {
    position: 'absolute',
    left: 228,
    top: 476,
    width: 164,
    height: 117,
    borderRadius: 10,
  },
  assistenciaBalloon: {
    position: 'absolute',
    left: 228,
    top: 476,
    width: 140,
    height: 36,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assistenciaText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#33363F',
    textAlign: 'center',
  },
  moreInfoText: {
    position: 'absolute',
    left: 39,
    top: 764,
    width: 228,
    height: 48,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#33363F',
    textAlign: 'left',
  },
});
