import React, { useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Button, Linking } from 'react-native';
import { useSecurity } from '../context/SecurityProvider';
import colors from '../theme/colors';
import TitleLogo from '../components/TitleLogo';
import ThemeToggle from '../components/ThemeToggle';
import GreetingMessage from '../components/GreetingMessage';
import MonitoringToggle from '../components/MonitoringToggle';
import StatusIndicator from '../components/StatusIndicator';
import RecentSecurityEvent from '../components/RecentSecurityEvent';
import LogHistoryButton from '../components/LogHistoryButton';
// import { getCurrentLocation, getGoogleMapsLink } from '../utils/locationService';
// import { startForegroundService } from '../utils/foregroundService';
// import { useForegroundService } from '../context/ForegroundServiceContext';

const HomeScreen = () => {
  const { theme } = useSecurity();
  const themeColors = colors[theme]; // Get colors based on theme
  const [mapsLink, setMapsLink] = React.useState<string | null>(null);


  // const getLocation = async () => {
  //   try {
  //     const {foregroundService} = useForegroundService();
  //     // Start the foreground service
  //     await startForegroundService(foregroundService);
  //     // Get the current location
  //     const location = await getCurrentLocation();
  //     if (location) {
  //       const { latitude, longitude } = location.coords;
  //       const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
  //       setMapsLink(link);
  //       console.log('Location:', location);
  //       console.log('Google Maps Link:', link);
  //     } else {
  //       console.warn('Location not available');
  //     }
  //   } catch (error) {
  //     console.error('Error getting location:', error);
  //   }
  // }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.secondary }]}>
      <ThemeToggle />
      <TitleLogo />
      <Button
        title="Get Location"
        // onPress={getLocation}
        color={themeColors.primary}
      />
      {mapsLink && (
        <Button
          title={mapsLink}
          onPress={() => {
            // Open the Google Maps link in the default browser
            Linking.openURL(mapsLink);
          }}
          color={themeColors.primary}
        />
      )}
      
      <GreetingMessage />
      <MonitoringToggle />
      <StatusIndicator />
      <RecentSecurityEvent />
      <LogHistoryButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default HomeScreen;
