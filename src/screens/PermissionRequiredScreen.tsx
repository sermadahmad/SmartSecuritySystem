import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Dimensions } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { myColors } from '../theme/colors';

const { width } = Dimensions.get('window');

const PermissionRequiredScreen = () => (
  <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
    <View style={styles.container}>
      <View style={[styles.sectionCard, {
        backgroundColor: myColors.background,
        borderColor: myColors.tertiary,
      }]}>
        <Text style={[styles.sectionHeaderText, { color: myColors.secondary }]}>
          Permissions Required
        </Text>
        <Text style={[styles.infoText, { color: myColors.primary }]}>
          This app cannot work without the following permissions:
        </Text>
        <View style={styles.permissionList}>
          <View style={styles.permissionRow}>
            <Icon name="sensors" size={22} color={myColors.secondary} />
            <Text style={[styles.permissionItem, { color: myColors.primary }]}>Body Sensor</Text>
          </View>
          <View style={styles.permissionRow}>
            <Icon name="camera-alt" size={22} color={myColors.secondary} />
            <Text style={[styles.permissionItem, { color: myColors.primary }]}>Camera</Text>
          </View>
          <View style={styles.permissionRow}>
            <Icon name="location-on" size={22} color={myColors.secondary} />
            <Text style={[styles.permissionItem, { color: myColors.primary }]}>Location (Precise & Background)</Text>
          </View>
          <View style={styles.permissionRow}>
            <Icon name="mic" size={22} color={myColors.secondary} />
            <Text style={[styles.permissionItem, { color: myColors.primary }]}>Microphone</Text>
          </View>
          <View style={styles.permissionRow}>
            <Icon name="photo-library" size={22} color={myColors.secondary} />
            <Text style={[styles.permissionItem, { color: myColors.primary }]}>Storage (Read & Write)</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.openSettingsButton, { backgroundColor: myColors.tertiary, borderColor: myColors.secondary }]}
          onPress={() => Linking.openSettings()}
        >
          <Icon name="settings" size={20} color={myColors.secondary} />
          <Text style={[styles.openSettingsText, { color: myColors.secondary }]}>Open Settings</Text>
        </TouchableOpacity>
        <Text style={[styles.permissionNote, { color: myColors.secondary }]}>
          Please grant all required permissions in your device settings for full functionality.
        </Text>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sectionCard: {
    borderRadius: 14,
    padding: 24,
    width: width > 400 ? 400 : '100%',
    borderWidth: 1,
    alignItems: 'center',
  },
  sectionHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionList: {
    marginBottom: 24,
    width: '100%',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  permissionItem: {
    fontSize: 16,
    marginLeft: 10,
  },
  openSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  openSettingsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  permissionNote: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PermissionRequiredScreen;
