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
import { getCurrentLocation, getGoogleMapsLink } from '../utils/locationService';


const HomeScreen = () => {
  const { theme } = useSecurity();
  const themeColors = colors[theme]; // Get colors based on theme
  const [mapsLink, setMapsLink] = React.useState<string | null>(null);


  const getLocation = async () => {
    const mapsLink = await getGoogleMapsLink();
    if (mapsLink) {
      console.log('Google Maps Link:', mapsLink);
      setMapsLink(mapsLink);
    } else {
      console.warn('Failed to fetch location');
      setMapsLink(null);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.secondary }]}>
      <ThemeToggle />
      <TitleLogo />
      <Button
        title="Get Location"
        onPress={getLocation}
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
