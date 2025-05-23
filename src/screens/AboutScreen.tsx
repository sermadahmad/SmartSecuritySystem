import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSecurity } from '../context/SecurityProvider';

const SettingsScreen = () => {
  const { theme } = useSecurity();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
      <Text style={[styles.text, { color: isDark ? '#FFFFFF' : '#000' }]}>About Screen - Customize App</Text>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
