import React, { useEffect, useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import HomeScreen from '../screensNew/HomeScreen';
// import LogsScreen from '../screens/LogsScreen';
// import SettingsScreen from '../screens/SettingsScreen';
// import AboutScreen from '../screens/AboutScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSecurity } from '../context/SecurityProvider';
import colors from '../theme/colors';
import { requestPermissions } from '../permissions/locationPermission';
import { AppState, AppStateStatus } from 'react-native';
import PermissionRequiredScreen from '../screens/PermissionRequiredScreen';
import { channelConfig } from '../utils/foregroundService';
import { useForegroundService } from '../context/ForegroundServiceContext';
import { PERMISSIONS } from 'react-native-permissions';
// import CapturePhotosScreen from '../screens/CapturePhotosScreen';
// import PhotoGalleryScreen from '../screens/PhotoGalleryScreen';
import ContactsScreen from '../screensNew/ContactsScreen';
import EventsScreen from '../screensNew/EventsScreen';
import SettingsScreen from '../screensNew/SettingsScreen';
import { myColors } from '../theme/colors';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
    initialRouteName='Home'
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'help-circle-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Contacts') {
            iconName = focused ? 'account-group' : 'account-group-outline'; 
          } else if (route.name === 'Events') {
            iconName = focused ? 'calendar' : 'calendar-outline'; 
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: myColors.primary,
        tabBarInactiveTintColor: myColors.secondary,
        tabBarStyle: {
          backgroundColor: myColors.tertiary,
          height: height * 0.08,
          borderTopColor: myColors.primary,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};


const AppNavigator = () => {
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
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
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
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
