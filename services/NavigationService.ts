import { Alert, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { RoutePoint } from './ApiService';

// Interfaces para navegação turn-by-turn
export interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  startLocation: RoutePoint;
  endLocation: RoutePoint;
  maneuver?: string;
  stepIndex: number;
}

export interface NavigationState {
  isNavigating: boolean;
  currentStep: NavigationStep | null;
  nextStep: NavigationStep | null;
  remainingDistance: number;
  remainingTime: number;
  currentLocation: RoutePoint | null;
  route: RoutePoint[];
  steps?: NavigationStep[];
  currentStepIndex?: number;
}

export class NavigationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private navigationState: NavigationState = {
    isNavigating: false,
    currentStep: null,
    nextStep: null,
    remainingDistance: 0,
    remainingTime: 0,
    currentLocation: null,
    route: [],
    steps: [],
    currentStepIndex: 0,
  };
  
  public onNavigationUpdate?: (state: NavigationState) => void;
  public onDestinationReached?: () => void;
  public onNavigationError?: (error: string) => void;
  private destination?: { latitude: number; longitude: number };

  // Iniciar navegação
  async startNavigation(
    origin: RoutePoint,
    destination: RoutePoint,
    route: RoutePoint[]
  ): Promise<boolean> {
    try {
      // Solicitar permissões de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'É necessário permitir acesso à localização para usar a navegação.'
        );
        return false;
      }

      this.navigationState.route = route;
      this.navigationState.isNavigating = true;
      
      // Converter pontos da rota em passos de navegação
      this.navigationState.steps = this.convertRouteToSteps(route);
      
      if (this.navigationState.steps.length > 0) {
        this.navigationState.currentStep = this.navigationState.steps[0];
        this.navigationState.nextStep = this.navigationState.steps[1] || null;
        this.navigationState.currentStepIndex = 0;
      }
      
      // Definir destino
      this.destination = destination;
      
      // Calcular distância e tempo total
      this.calculateRemainingDistanceAndTime();
      
      // Iniciar rastreamento de localização
      await this.startLocationTracking();
      
      this.notifyNavigationUpdate();
      return true;
    } catch (error) {
      console.error('Erro ao iniciar navegação:', error);
      this.onNavigationError?.('Falha ao iniciar navegação');
      return false;
    }
  }

  private convertRouteToSteps(route: RoutePoint[]): NavigationStep[] {
    const steps: NavigationStep[] = [];
    
    for (let i = 0; i < route.length - 1; i++) {
      const start = route[i];
      const end = route[i + 1];
      const distance = this.calculateDistance(start.latitude, start.longitude, end.latitude, end.longitude);
      
      // Gerar instrução baseada na direção
      const bearing = this.calculateBearing(start.latitude, start.longitude, end.latitude, end.longitude);
      const instruction = this.generateInstruction(bearing, distance, i);
      
      steps.push({
        instruction,
        distance,
        duration: distance / 1.4, // Velocidade média de caminhada: 1.4 m/s
        startLocation: start,
        endLocation: end,
        maneuver: this.getManeuverType(bearing),
        stepIndex: i,
      });
    }
    
    // Adicionar passo final
    if (route.length > 1) {
      const lastPoint = route[route.length - 1];
      steps.push({
        instruction: 'Você chegou ao seu destino!',
        distance: 0,
        duration: 0,
        startLocation: lastPoint,
        endLocation: lastPoint,
        maneuver: 'destination',
        stepIndex: route.length - 1,
      });
    }
    
    return steps;
  }

  // Calcular distância e tempo restantes
  private calculateRemainingDistanceAndTime() {
    if (!this.navigationState.steps || !this.navigationState.currentLocation) {
      return;
    }

    let remainingDistance = 0;
    let remainingTime = 0;

    // Somar distância dos passos restantes
    for (let i = this.navigationState.currentStepIndex || 0; i < this.navigationState.steps.length; i++) {
      remainingDistance += this.navigationState.steps[i].distance;
      remainingTime += this.navigationState.steps[i].duration;
    }

    this.navigationState.remainingDistance = remainingDistance;
    this.navigationState.remainingTime = remainingTime;
  }

  private generateInstruction(bearing: number, distance: number, stepIndex: number): string {
    const direction = this.getDirection(bearing);
    const distanceText = distance < 100 ? `${Math.round(distance)}m` : `${Math.round(distance / 100) * 100}m`;
    
    if (stepIndex === 0) {
      return `Comece seguindo ${direction} por ${distanceText}`;
    }
    
    if (distance < 50) {
      return `Continue em frente por ${distanceText}`;
    }
    
    const maneuver = this.getManeuverType(bearing);
    
    switch (maneuver) {
      case 'turn-left':
        return `Vire à esquerda e continue por ${distanceText}`;
      case 'turn-right':
        return `Vire à direita e continue por ${distanceText}`;
      case 'turn-slight-left':
        return `Mantenha-se à esquerda por ${distanceText}`;
      case 'turn-slight-right':
        return `Mantenha-se à direita por ${distanceText}`;
      case 'turn-sharp-left':
        return `Faça uma curva fechada à esquerda e continue por ${distanceText}`;
      case 'turn-sharp-right':
        return `Faça uma curva fechada à direita e continue por ${distanceText}`;
      case 'uturn-left':
      case 'uturn-right':
        return `Faça o retorno e continue por ${distanceText}`;
      default:
        return `Continue ${direction} por ${distanceText}`;
    }
  }

  private getDirection(bearing: number): string {
    const directions = [
      'norte', 'nordeste', 'leste', 'sudeste',
      'sul', 'sudoeste', 'oeste', 'noroeste'
    ];
    
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }

  // Obter tipo de manobra
  private getManeuverType(bearing: number): string {
    if (bearing >= -22.5 && bearing <= 22.5) return 'straight';
    if (bearing > 22.5 && bearing <= 67.5) return 'turn-slight-right';
    if (bearing > 67.5 && bearing <= 112.5) return 'turn-right';
    if (bearing > 112.5 && bearing <= 157.5) return 'turn-sharp-right';
    if (bearing > 157.5 || bearing <= -157.5) return 'uturn';
    if (bearing > -157.5 && bearing <= -112.5) return 'turn-sharp-left';
    if (bearing > -112.5 && bearing <= -67.5) return 'turn-left';
    return 'turn-slight-left';
  }

  // Iniciar rastreamento de localização
  private async startLocationTracking() {
    this.locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000, // Atualizar a cada segundo
        distanceInterval: 5, // Ou a cada 5 metros
      },
      (location) => {
          this.onLocationUpdate(location);
        }
    );
  }





  // Parar navegação
  stopNavigation(): void {
    this.navigationState.isNavigating = false;
    this.navigationState.currentStep = null;
    this.navigationState.nextStep = null;
    this.navigationState.remainingDistance = 0;
    this.navigationState.remainingTime = 0;
    this.navigationState.route = [];
    this.navigationState.steps = [];
    this.stopLocationTracking();
    this.notifyNavigationUpdate();
  }

  private stopLocationTracking(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  private notifyNavigationUpdate(): void {
    if (this.onNavigationUpdate) {
      this.onNavigationUpdate(this.navigationState);
    }
  }

  private advanceToNextStep(): void {
    if (!this.navigationState.steps) return;
    
    const currentIndex = this.navigationState.currentStepIndex || 0;
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < this.navigationState.steps.length) {
      this.navigationState.currentStepIndex = nextIndex;
      this.navigationState.currentStep = this.navigationState.steps[nextIndex];
      this.navigationState.nextStep = this.navigationState.steps[nextIndex + 1] || null;
      
      console.log(`Avançando para o passo ${nextIndex + 1}: ${this.navigationState.currentStep.instruction}`);
    } else {
      // Chegou ao destino
      this.navigationState.currentStep = null;
      this.navigationState.nextStep = null;
      this.handleDestinationReached();
    }
  }

  private handleDestinationReached(): void {
    this.navigationState.isNavigating = false;
    this.navigationState.remainingDistance = 0;
    this.navigationState.remainingTime = 0;
    this.stopLocationTracking();
    
    // Notificar que chegou ao destino
    console.log('Destino alcançado!');
    
    // Atualizar o passo atual para mostrar mensagem de chegada
    this.navigationState.currentStep = {
      instruction: 'Você chegou ao seu destino!',
      distance: 0,
      duration: 0,
      startLocation: this.navigationState.currentLocation!,
      endLocation: this.navigationState.currentLocation!,
      stepIndex: -1,
    };
    
    this.notifyNavigationUpdate();
    
    // Callback para notificar chegada ao destino
    if (this.onDestinationReached) {
      this.onDestinationReached();
    }
  }

  // Atualizar localização do usuário
  private onLocationUpdate(location: Location.LocationObject): void {
    if (!this.navigationState.isNavigating || !this.destination) {
      return;
    }

    const currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    this.navigationState.currentLocation = currentLocation;

    // Calcular distância até o destino
    const distanceToDestination = this.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      this.destination.latitude,
      this.destination.longitude
    );

    // Verificar se chegou ao destino (dentro de 10 metros)
    if (distanceToDestination < 10) {
      this.handleDestinationReached();
      return;
    }

    // Verificar se precisa avançar para o próximo passo
    if (this.navigationState.currentStep) {
      const distanceToStepEnd = this.calculateDistance(
        currentLocation,
        this.navigationState.currentStep.endLocation
      );

      // Se chegou perto do fim do passo atual (dentro de 20 metros), avançar
      if (distanceToStepEnd < 20) {
        this.advanceToNextStep();
      }
    }

    // Atualizar estado de navegação
    this.navigationState.remainingDistance = distanceToDestination;
    this.navigationState.remainingTime = Math.round(distanceToDestination / 1.4); // Estimativa baseada em velocidade de caminhada
    
    this.notifyNavigationUpdate();
  }

  // Obter estado atual da navegação
  getNavigationState(): NavigationState {
    return { ...this.navigationState };
  }

  // Calcular distância entre dois pontos (em metros)
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Calcular bearing entre dois pontos
  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return (θ * 180 / Math.PI + 360) % 360;
  }

  // Formatar duração em texto legível
  private formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}h ${minutes}min`;
    }
  }

  // Abrir navegação externa como fallback
  async openExternalNavigation(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number
  ): Promise<void> {
    try {
      let url: string;
      
      if (Platform.OS === 'ios') {
        // Tentar Apple Maps primeiro
        url = `maps://app?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}&dirflg=w`;
        const canOpen = await Linking.canOpenURL(url);
        
        if (!canOpen) {
          // Fallback para Google Maps
          url = `https://maps.google.com/maps?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}&dirflg=w`;
        }
      } else {
        // Android - Google Maps
        url = `google.navigation:q=${destLat},${destLng}&mode=w`;
        const canOpen = await Linking.canOpenURL(url);
        
        if (!canOpen) {
          // Fallback para web
          url = `https://maps.google.com/maps?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}&dirflg=w`;
        }
      }
      
      await Linking.openURL(url);
    } catch (error) {
      console.error('Erro ao abrir navegação externa:', error);
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas.');
    }
  }
}

export const navigationService = new NavigationService();
export default NavigationService;