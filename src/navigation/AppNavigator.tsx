import React from 'react';
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
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { theme } = useSecurity();
  const isDark = theme === 'dark';

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
