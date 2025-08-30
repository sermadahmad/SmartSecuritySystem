import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { myColors } from "../../theme/colors";
import { useSecurity } from "../../context/SecurityProvider";
import { alarmSounds } from "../../utils/alarmSounds";
import { setupAlarmPlayer, startAlarm, stopAlarm } from "../../utils/alarmPlayer";
import TrackPlayer from "react-native-track-player";
import { getGoogleMapsLink } from "../../utils/locationService";
import { captureSecurityPhotos } from "../../utils/cameraCapture";
import { startForegroundService } from "../../utils/foregroundService";
import { useForegroundService } from "../../context/ForegroundServiceContext";
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { usePersistentState } from '../../hooks/usePersistentState';
import { EventLog } from '../../context/SecurityProvider'; // Import your EventLog type
import emailjs from "emailjs-com";
import { sendEventEmail } from "../../utils/sendEventEmail";

const PanicButton = () => {
  const {
    settings: {
      selectedDuration,
      selectedSound,
      alarmVolume,
    },
    setAlarmTriggered,
    setMonitoringActive,
    setEventLogs,
    setLocation,
    contacts
  } = useSecurity();

  const foregroundService = useForegroundService();
  const { userId } = usePersistentState();

  const [triggered, setTriggered] = useState(false);
  const [alarmActive, setAlarmActive] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const holdTime = 2000; // 2 seconds

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startHold = () => {
    if (alarmActive) {
      // Stop alarm and reset status
      stopAlarm();
      setAlarmActive(false);
      setMonitoringActive();
      setTriggered(false);
      progress.setValue(0);
      return;
    }
    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: holdTime,
      useNativeDriver: false,
    });
    animationRef.current.start(async ({ finished }) => {
      if (finished) {
        setTriggered(true);
        setAlarmActive(true);
        setAlarmTriggered();
        // --- Panic logic: play alarm, capture photos, get location, store event log ---
        const selectedSoundObj = alarmSounds.find(s => s.label === selectedSound) || alarmSounds[0];
        await setupAlarmPlayer(selectedSoundObj.file, selectedSoundObj.label);
        await TrackPlayer.setVolume(alarmVolume);
        await startAlarm();

        // Play for selected duration (if not infinite)
        if (selectedDuration > 0) {
          setTimeout(() => {
            stopAlarm();
            setAlarmActive(false);
            setMonitoringActive();
            setTriggered(false);
            progress.setValue(0);
          }, selectedDuration * 1000);
        }

        let locationLink: string | null = null;
        let photoResult: string[] = [];
        try {
          if (foregroundService) {
            await startForegroundService(foregroundService);
          }
          locationLink = await getGoogleMapsLink();
          if (locationLink) {
            setLocation(locationLink);
          }
          photoResult = await captureSecurityPhotos();
        } catch (error) {
          console.error('PanicButton: Error during panic response:', error);
        } finally {
          if (foregroundService && foregroundService.stopService) {
            await foregroundService.stopService();
          }
        }

        // Store event log
        const now = new Date();
        let eventLog: EventLog = {
          id: '', // <-- Add id property
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          triggerType: 'Panic Button',
          alarmPlayed: true,
          location: locationLink,
          photoURIs: photoResult,
          alarmSound: selectedSound,
          createdAt: serverTimestamp(),
        };

        try {
          if (userId) {
            const db = getFirestore();
            const { id, ...eventLogData } = eventLog;
            const docRef = await addDoc(collection(db, `users/${userId}/eventLogs`), eventLogData);
            eventLog.id = docRef.id; // Set Firestore doc ID

            // for (const contact of contacts) {
            //   if (contact.email) {
            //     await sendEventEmail(contact, eventLog);
            //   }
            // }
          }
        } catch (error) {
          console.error('Error saving event log to Firestore or sending email:', error);
        }

        setEventLogs(prev => [...prev, eventLog]);
      }
    });
  };

  const cancelHold = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    progress.setValue(0);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={startHold}
        onPressOut={cancelHold}
        style={[
          alarmActive || triggered ? styles.alarmButton : styles.button
        ]}
      >
        <Text style={[styles.buttonText, (alarmActive || triggered) && { color: myColors.red }]}>
          {(alarmActive || triggered) ? "PANIC TRIGGERED !" : "HOLD TO PANIC"}
        </Text>
        {!(alarmActive || triggered) && (
          <Animated.View
            style={[styles.progress, { width: progressWidth }]}
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    width: 250,
    height: 80,
    backgroundColor: myColors.red,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: myColors.background,
    zIndex: 2,
  },
  progress: {
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    backgroundColor: myColors.tertiary,
    zIndex: 1,
  },
  alarmButton: {
    backgroundColor: myColors.background,
    borderWidth: 2,
    borderColor: myColors.red,
    width: 250,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
});

export default PanicButton;
