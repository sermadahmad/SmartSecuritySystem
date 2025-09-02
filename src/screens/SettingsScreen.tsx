import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { myColors } from '../theme/colors';
import HomeHeader from '../components/Home/HomeHeader';
import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
import TrackPlayer from 'react-native-track-player';
import { useSecurity } from "../context/SecurityProvider";
import { alarmSounds } from "../utils/alarmSounds";
import { getFirestore, collection, getDocs, deleteDoc, doc, FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { usePersistentState } from "../hooks/usePersistentState";

const { width } = Dimensions.get('window');

const playDurations = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
  { label: "Infinite", value: -1 },
];

const SettingsScreen = () => {
  const {
    settings,
    setAlarmDelay,
    setLockDelay,
    setSelectedSound,
    setAlarmVolume,
    setSelectedDuration,
    resetSettings,
    setEventLogs,
  } = useSecurity();
  const { userId } = usePersistentState();

  const [playingSound, setPlayingSound] = useState<string | null>(null);
  const [showSoundDropdown, setShowSoundDropdown] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);

  // Use settings state for all values
  const alarmDelay = settings.alarmDelay;
  const lockDelay = settings.lockDelay;
  const selectedSound = alarmSounds.find(s => s.label === settings.selectedSound) || alarmSounds[0];
  const alarmVolume = settings.alarmVolume;
  const selectedDuration = playDurations.find(d => d.value === settings.selectedDuration) || playDurations[0];

  const handleIncrementAlarmDelay = () => setAlarmDelay(alarmDelay + 1);
  const handleDecrementAlarmDelay = () => setAlarmDelay(alarmDelay > 0 ? alarmDelay - 1 : 0);

  const handleIncrementLockDelay = () => setLockDelay(lockDelay + 1);
  const handleDecrementLockDelay = () => setLockDelay(lockDelay > 0 ? lockDelay - 1 : 0);

  const playSound = async (sound: { label: string; file: any }) => {
    try {
      console.log("playSound called with:", sound.label);
      await setupAlarmPlayer(sound.file, sound.label);
      await TrackPlayer.setVolume(alarmVolume);
      console.log("setupAlarmPlayer finished");
      await startAlarm();
      console.log("startAlarm finished");
      setPlayingSound(sound.label);
    } catch (e) {
      console.log("Error playing sound:", e);
      setPlayingSound(null);
    }
  };

  const stopSoundHandler = async () => {
    try {
      console.log("stopSoundHandler called");
      await stopAlarm();
      console.log("stopAlarm finished");
      setPlayingSound(null);
    } catch (e) {
      console.log("Error stopping sound:", e);
    }
  };

  const handleClearEventLogs = async () => {
    if (!userId) return;
    setClearingLogs(true);
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, `users/${userId}/eventLogs`));
      const batchDeletes = querySnapshot.docs.map((docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        deleteDoc(doc(db, `users/${userId}/eventLogs/${docSnap.id}`))
      );
      await Promise.all(batchDeletes);
      setEventLogs([]); // Clear local state
      console.log("All event logs cleared from Firestore.");
    } catch (error) {
      console.error("Error clearing event logs:", error);
    } finally {
      setClearingLogs(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <HomeHeader
            nameLogoSource={require('../assets/settingsLogo.png')}
            style={{ width: width * 0.3, marginLeft: width * 0.15 }}
          />
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderText, { color: myColors.secondary }]}>
                Security Timers:
              </Text>
            </View>
            <View style={styles.timerRow}>
              <Text style={[styles.timerLabel, { color: myColors.primary }]}>Alarm Delay: </Text>
              <View style={styles.timerControl}>
                <TouchableOpacity style={[styles.timerButton, { borderColor: myColors.secondary }]} onPress={handleDecrementAlarmDelay}>
                  <MaterialCommunityIcons name="minus" size={22} color={myColors.primary} />
                </TouchableOpacity>
                <Text style={[styles.timerValue, { color: myColors.primary }]}>{alarmDelay}</Text>
                <TouchableOpacity style={[styles.timerButton, { borderColor: myColors.secondary }]} onPress={handleIncrementAlarmDelay}>
                  <MaterialCommunityIcons name="plus" size={22} color={myColors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.timerInfo, { color: myColors.secondary }]}>
              Alarm Delay in seconds (grace time to unlock before alarm).
            </Text>
            <View style={styles.timerRow}>
              <Text style={[styles.timerLabel, { color: myColors.primary }]}>Lock Delay: </Text>
              <View style={styles.timerControl}>
                <TouchableOpacity style={[styles.timerButton, { borderColor: myColors.secondary }]} onPress={handleDecrementLockDelay}>
                  <MaterialCommunityIcons name="minus" size={22} color={myColors.primary} />
                </TouchableOpacity>
                <Text style={[styles.timerValue, { color: myColors.primary }]}>{lockDelay}</Text>
                <TouchableOpacity style={[styles.timerButton, { borderColor: myColors.secondary }]} onPress={handleIncrementLockDelay}>
                  <MaterialCommunityIcons name="plus" size={22} color={myColors.primary} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.timerInfo, { color: myColors.secondary }]}>
              Lock Delay in seconds (how long device must stay locked & still before monitoring).
            </Text>
          </>
          <View style={{
            backgroundColor: myColors.text,
            height: 1,
            marginTop: 5,
          }} />
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionHeaderText, { color: myColors.secondary }]}>
              Alarm Timers:
            </Text>
            <>
              <View style={styles.chooseSoundRow}>
                <Text style={[styles.timerLabel, { color: myColors.primary }]}>Choose Sound:</Text>
                <TouchableOpacity
                  style={[styles.chooseSoundButton, { borderColor: myColors.secondary, backgroundColor: myColors.tertiary }]}
                  onPress={() => setShowSoundDropdown(!showSoundDropdown)}
                >
                  <Text style={[styles.selectedSoundText, { color: myColors.secondary }]}>
                    {selectedSound.label}
                  </Text>
                  <Icon name="arrow-drop-down" size={22} color={myColors.secondary} />
                </TouchableOpacity>
              </View>
              {showSoundDropdown && (
                <View style={[styles.soundDropdown, { backgroundColor: myColors.background, borderColor: myColors.secondary }]}>
                  {alarmSounds.map((sound) => (
                    <View key={sound.label} style={styles.soundRow}>
                      <TouchableOpacity
                        style={[
                          styles.soundOption,
                          {
                            borderColor: selectedSound.label === sound.label ? myColors.secondary : myColors.secondary,
                            backgroundColor: selectedSound.label === sound.label ? myColors.tertiary : myColors.background,
                          }
                        ]}
                        onPress={() => {
                          setSelectedSound(sound.label);
                          setShowSoundDropdown(false);
                          stopSoundHandler();
                        }}
                      >
                        <Text style={{
                          color: selectedSound.label === sound.label ? myColors.secondary : myColors.primary,
                          fontWeight: selectedSound.label === sound.label ? 'bold' : 'normal'
                        }}>
                          {sound.label}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.playButton, { borderColor: myColors.secondary, backgroundColor: myColors.background }]}
                        onPress={() =>
                          playingSound === sound.label
                            ? stopSoundHandler()
                            : playSound(sound)
                        }
                      >
                        <Icon
                          name={playingSound === sound.label ? "stop" : "play-arrow"}
                          size={22}
                          color={myColors.secondary}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <Text style={[styles.timerLabel, { color: myColors.primary }]}>Alarm Volume:</Text>
                <View style={styles.volumeRow}>
                  <TouchableOpacity
                    style={[styles.volumeButton, { borderColor: myColors.secondary }]}
                    onPress={() => setAlarmVolume(Math.max(alarmVolume - 0.1, 0))}
                  >
                    <MaterialCommunityIcons name="volume-minus" size={22} color={myColors.primary} />
                  </TouchableOpacity>
                  <Text style={[styles.volumeValue, { color: myColors.secondary }]}>
                    {Math.round(alarmVolume * 100)}%
                  </Text>
                  <TouchableOpacity
                    style={[styles.volumeButton, { borderColor: myColors.secondary }]}
                    onPress={() => setAlarmVolume(Math.min(alarmVolume + 0.1, 1))}
                  >
                    <MaterialCommunityIcons name="volume-plus" size={22} color={myColors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.durationSection}>
                <Text style={[styles.timerLabel, { color: myColors.primary }]}>Play Duration:</Text>
                <View style={[styles.durationOptionsRow, {
                  backgroundColor: myColors.background,
                }]}>
                  {playDurations.map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      style={[
                        styles.durationOption,
                        { borderColor: myColors.secondary },
                        selectedDuration.value === option.value && {
                          backgroundColor: myColors.tertiary,
                          borderColor: myColors.secondary,
                        },
                      ]}
                      onPress={() => setSelectedDuration(option.value)}
                    >
                      <Text style={{
                        color: selectedDuration.value === option.value ? myColors.secondary : myColors.primary,
                        fontWeight: selectedDuration.value === option.value ? 'bold' : 'normal'
                      }}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={[styles.timerInfo, { color: myColors.secondary }]}>
                  Select how long the alarm should play. "Infinite" will play until you stop or unlock the device.
                </Text>
              </View>
            </>
          </View>
          <View style={{
            backgroundColor: myColors.text,
            height: 1,
            marginVertical: 10,
          }} />
          <View>
            <Text style={[styles.sectionHeaderText, { color: myColors.secondary }]}>
              General:
            </Text>
            <View style={styles.generalButtonsRow}>
              <TouchableOpacity
                style={[styles.generalButton, { backgroundColor: myColors.tertiary, borderColor: myColors.secondary }]}
                onPress={resetSettings}
              >
                <Icon name="restore" size={20} color={myColors.secondary} />
                <Text style={[styles.generalButtonText, { color: myColors.secondary }]}>Reset to Defaults</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.generalButton, { backgroundColor: myColors.red, borderColor: myColors.secondary }]}
                onPress={handleClearEventLogs}
                disabled={clearingLogs}
              >
                <Icon name="delete-forever" size={20} color={myColors.background} />
                {clearingLogs ? (
                  <ActivityIndicator size="small" color={myColors.background} />
                ) : (
                  <Text style={[styles.generalButtonText, { color: myColors.background }]}>Clear Event Logs</Text>
                )}
              </TouchableOpacity>
            </View>
            <Text style={[styles.timerInfo, { color: myColors.secondary }]}>
              Use these options to restore all settings to their default values or clear all recorded security event logs from your device.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 20,
    padding: 10,
  },
  sectionHeader: {
    paddingTop: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  timerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  timerButton: {
    padding: 6,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 32,
    textAlign: 'center',
  },
  timerInfo: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 5,
  },
  chooseSoundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  chooseSoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
  },
  selectedSoundText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  soundDropdown: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    zIndex: 10,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
  soundOption: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  playButton: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'flex-start',
  },
  volumeButton: {
    padding: 6,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  volumeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 48,
    textAlign: 'center',
  },
  durationSection: {
    marginTop: 12,
    marginBottom: 10,
  },
  durationOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  durationOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  checkboxRow: {
    marginTop: 15,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  generalButtonsRow: {
    marginVertical: 10,
    gap: 10,
  },
  generalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  generalButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;