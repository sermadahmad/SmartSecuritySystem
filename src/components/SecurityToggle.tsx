import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useSecurity } from '../context/SecurityContext';

const SecurityToggle = () => {
  const { monitoringEnabled, toggleMonitoring, theme } = useSecurity();
  const isDark = theme === 'dark';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#000' }]}>Smart Security System</Text>
      <Text style={[styles.status, { color: isDark ? '#BBBBBB' : '#555' }]}>
        Status: {monitoringEnabled ? '🟢 Active' : '🔴 Inactive'}
      </Text>

      <View style={styles.toggleContainer}>
        <Text style={[styles.label, { color: isDark ? '#FFFFFF' : '#000' }]}>Enable Security</Text>
        <Switch
          value={monitoringEnabled}
          onValueChange={toggleMonitoring}
          trackColor={{ false: '#767577', true: '#007AFF' }}
          thumbColor={monitoringEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginRight: 10,
  },
});

export default SecurityToggle;
