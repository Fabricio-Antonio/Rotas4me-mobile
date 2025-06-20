import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Platform, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import UserIcon from '@/assets/icons/UserIcon';
import MegaPhoneIcon from '@/assets/icons/MegaPhoneIcon';
import HomeIcon from '@/assets/icons/HomeIcon';
import PhoneIcon from '@/assets/icons/PhoneIcon';
import AlertIcon from '@/assets/icons/AlertIcon';

const icons = [
  UserIcon,
  MegaPhoneIcon,
  HomeIcon,
  PhoneIcon,
  AlertIcon,
];

const tabNames = ['profile', 'report', 'index', 'call', 'info'];

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const animatedValues = useRef(state.routes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    animatedValues.forEach((anim, idx) => {
      Animated.timing(anim, {
        toValue: state.index === idx ? 1 : 0,
        duration: 350,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }).start();
    });
  }, [state.index]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || 12 }]}> 
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const Icon = icons[index];
        const animatedStyle = {
          transform: [
            {
              translateY: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0, -10],
              }),
            },
            {
              scale: animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2],
              }),
            },
          ],
        };
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tab}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.iconWrapper,
                isFocused && styles.activeIconWrapper,
                animatedStyle,
                isFocused && route.name === 'index' && { marginTop: 2 },
              ]}
            >
              <Icon 
                stroke={isFocused ? '#fff' : '#222'} 
                fill={isFocused ? '#222' : 'none'}
                width={30}
                height={30}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
  },
  iconWrapper: {
    backgroundColor: 'transparent',
    borderRadius: 32,
    padding: 10,
    transition: 'all 0.3s ease',
    ...Platform.select({ web: { transition: 'all 0.3s ease' } }),
  },
  activeIconWrapper: {
    backgroundColor: '#222',
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
}); 