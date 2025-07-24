import React from 'react';
import { View, Text, Button, Linking, StyleSheet } from 'react-native';

const PermissionRequiredScreen = () => (
  <View style={styles.permissionContainer}>
    <Text style={styles.permissionTitle}>Permissions Required</Text>
    <Text style={styles.permissionText}>
      This app cannot work without the following permissions:
    </Text>
    <View style={styles.permissionList}>
      <Text style={styles.permissionItem}>• Body Sensor</Text>
      <Text style={styles.permissionItem}>• Camera</Text>
      <Text style={styles.permissionItem}>• Location (Precise & Background)</Text>
      <Text style={styles.permissionItem}>• Microphone</Text>
    </View>
    <Button
      title="Open Settings"
      onPress={() => Linking.openSettings()}
    />
    <Text style={styles.permissionNote}>
      Please grant all required permissions in your device settings.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionList: {
    marginBottom: 20,
  },
  permissionItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  permissionNote: {
    fontSize: 14,
    color: '#888',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default PermissionRequiredScreen;
