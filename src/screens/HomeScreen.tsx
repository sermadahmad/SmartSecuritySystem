import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSecurity } from '../context/SecurityContext';
import ThemeToggle from '../components/ThemeToggle';
import SecurityToggle from '../components/SecurityToggle';
import LogsDisplay from '../components/LogsDisplay';
const HomeScreen = () => {
  const { theme } = useSecurity();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Security Toggle */}
      <SecurityToggle />

      {/* Logs Display */}
      <LogsDisplay />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
