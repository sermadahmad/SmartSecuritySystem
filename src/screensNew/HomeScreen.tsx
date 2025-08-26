import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, Animated, Easing, TouchableOpacity, Dimensions, Image } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from 'react-native-safe-area-context'
import { myColors } from '../theme/colors'
import HomeHeader from '../components/Home/HomeHeader';
import ShieldButton from '../components/Home/ShieldButton';
import StatusIndicator from "../components/Home/StatusIndicator";
import PanicButton from "../components/Home/PanicButton";
import { useSecurity } from "../context/SecurityProvider";
import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
import TrackPlayer from "react-native-track-player";
import { alarmSounds } from "../utils/alarmSounds";

const { height } = Dimensions.get('window');

const HomeScreen = () => {
  const {
    settings: {
      status,
      alarmVolume,
      selectedSound,
    },
    setAlarmTriggered,
    setMonitoringActive,
    eventLogs,
  } = useSecurity();


  const selectedSoundObj = alarmSounds.find(s => s.label === selectedSound) || alarmSounds[0];

  // Handler for Test Alarm button
  const handleTestAlarm = async () => {
    if (status !== "alarm_triggered") {
      setAlarmTriggered();
      try {
        await setupAlarmPlayer(selectedSoundObj.file, selectedSoundObj.label);
        await TrackPlayer.setVolume(alarmVolume);
        await startAlarm();
      } catch (e) {
        console.log("Error starting alarm:", e);
      }
    } else {
      await stopAlarm();
      setMonitoringActive();
    }
  };

  // Determine status text and color
  let statusText = "Security Inactive";
  let statusColor = myColors.secondary;
  if (status === "security_active") {
    statusText = "Security Active";
    statusColor = myColors.green;
  } else if (status === "alarm_triggered") {
    statusText = "Alarm Triggered";
    statusColor = myColors.red;
  }

  // Get last event from eventLogs
  const lastEvent = eventLogs && eventLogs.length > 0 ? eventLogs[eventLogs.length - 1] : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <HomeHeader
            nameLogoSource={require('../assets/nameLogo.png')}
          />
          <ShieldButton />
          <View style={styles.spacer} />
          <StatusIndicator />
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: myColors.primary }]}>Status: </Text>
            <Text style={[styles.statusValue, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
          <View style={styles.lastEventRow}>
            <Text style={[styles.lastEventLabel, { color: myColors.primary }]}>Last Event: </Text>
            <Text style={[
              styles.lastEventValue,
              { color: lastEvent ? myColors.secondary : myColors.primary }
            ]}>
              {lastEvent
                ? `${lastEvent.date} at ${lastEvent.time}`
                : 'No events yet.'}
            </Text>
          </View>
          <View style={styles.alarmButtonContainer}>
            <TouchableOpacity
              onPress={handleTestAlarm}
              style={[
                styles.alarmButton,
                { backgroundColor: myColors.background, borderColor: myColors.secondary }
              ]}
            >
              <Text style={[styles.alarmButtonText, { color: myColors.primary }]}>
                {status === "alarm_triggered" ? "Stop Alarm" : "Test Alarm"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.spacer} />
          <View>
            <PanicButton />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  spacer: {
    height: height * 0.02,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statusLabel: {
    fontSize: 22,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 22,
    fontWeight: '600',
  },
  lastEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastEventLabel: {
    fontSize: 22,
    fontWeight: '600',
  },
  lastEventValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  alarmButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  alarmButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  alarmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default HomeScreen;