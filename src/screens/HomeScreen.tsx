import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { useSecurity } from '../context/SecurityProvider';
import colors from '../theme/colors';
import TitleLogo from '../components/TitleLogo';
import ThemeToggle from '../components/ThemeToggle';
import GreetingMessage from '../components/GreetingMessage';
import MonitoringToggle from '../components/MonitoringToggle';
import StatusIndicator from '../components/StatusIndicator';
import RecentSecurityEvent from '../components/RecentSecurityEvent';
import LogHistoryButton from '../components/LogHistoryButton';


const HomeScreen = () => {
  const { theme } = useSecurity();
  const themeColors = colors[theme]; // Get colors based on theme

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.secondary }]}>
      <ThemeToggle />
      <TitleLogo />
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
