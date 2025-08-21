import React, { useEffect, useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import LogsScreen from '../screens/LogsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSecurity } from '../context/SecurityProvider';
import colors from '../theme/colors';
import { requestPermissions } from '../permissions/locationPermission';
import { AppState, AppStateStatus } from 'react-native';
import PermissionRequiredScreen from '../screens/PermissionRequiredScreen';
import { channelConfig } from '../utils/foregroundService';
import { useForegroundService } from '../context/ForegroundServiceContext';
import { PERMISSIONS } from 'react-native-permissions';
import CapturePhotosScreen from '../screens/CapturePhotosScreen';
import PhotoGalleryScreen from '../screens/PhotoGalleryScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export type RootStackParamList = {
  Logs: undefined;
  Home: undefined;
  Settings: undefined;
  About: undefined;
};

const TabNavigator = () => {
  const { theme } = useSecurity();
  const themeColors = colors[theme]; // Get theme-specific colors


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'help-circle-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Logs') {
            iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information' : 'information-outline';
          } else if (route.name === 'PhotoGallery') {
            iconName = focused ? 'image' : 'image-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.primary,
        tabBarStyle: {
          backgroundColor: themeColors.secondary,
          paddingBottom: 5,
          height: 60,
          borderTopColor: themeColors.primary,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Logs" component={LogsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
      <Tab.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
    </Tab.Navigator>
  );
};


const AppNavigator = () => {
  const { theme } = useSecurity();
  const isDark = theme === 'dark';
  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const appState = useRef(AppState.currentState);

  // Function to check permissions
  const checkPermissions = async () => {
    try {
      const granted = await requestPermissions(
        [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
          PERMISSIONS.ANDROID.BODY_SENSORS,
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
        ]
      );
      setPermissionsGranted(granted);
    } catch (error) {
      setPermissionsGranted(false);
      console.error('Error requesting location permissions:', error);
    }
  };

  // Initial check
  useEffect(() => {
    checkPermissions();
  }, []);

  // Re-check permissions when app comes to foreground
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkPermissions();
      }
      appState.current = nextAppState;
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  // Initialize the foreground service channel
  const foregroundService = useForegroundService();
  useEffect(() => {
    if (foregroundService && foregroundService.createNotificationChannel) {
      foregroundService.createNotificationChannel(channelConfig)
        .then(() => console.log('Notification channel created'))
        .catch((e: any) => console.error('Failed to create notification channel', e));
    } else {
      console.warn('Foreground service is not available or createNotificationChannel is not defined');
    }
  }, []);
  
  if (permissionsGranted === false) {
    return <PermissionRequiredScreen />;
  }

  if (permissionsGranted === null) {
    // Optionally, show a splash/loading screen while checking permissions
    return null;
  }

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName='Main' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="CapturePhotosScreen" component={CapturePhotosScreen} />
        <Stack.Screen name="PhotoGallery" component={PhotoGalleryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
