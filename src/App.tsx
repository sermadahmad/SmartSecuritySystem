import { View, Text, StyleSheet } from 'react-native';
import useDeviceLock from './customHooks/DeviceLock';
import useIsStationary from './customHooks/useIsStationary';
import React, { useEffect, useRef, useState } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import KeepAwake from 'react-native-keep-awake';

export default function App() {
  const isLocked = useDeviceLock() ?? false;
  const isStationary = useIsStationary();
  const [securityActivated, setSecurityActivated] = useState(false);
  const securityTimer = useRef<number | null>(null);
  const alarmTimer = useRef<number | null>(null);

  // Start BackgroundTimer on mount and stop on unmount
  useEffect(() => {
    BackgroundTimer.start();
    return () => {
      BackgroundTimer.stop();
      if (securityTimer.current) BackgroundTimer.clearTimeout(securityTimer.current);
      if (alarmTimer.current) BackgroundTimer.clearTimeout(alarmTimer.current);
    };
  }, []);

  // Handle security activation
  const handleSecurityActivation = () => {
    if (!securityActivated) {
      if (isLocked && isStationary) {
        if (!securityTimer.current) {
          console.log('Starting security timer...');
          securityTimer.current = BackgroundTimer.setTimeout(() => {
            console.log('Security Activated');
            setSecurityActivated(true);
          }, 5000); // 5 seconds
        }
      } else {
        if (securityTimer.current) {
          console.log('Clearing security timer...');
          BackgroundTimer.clearTimeout(securityTimer.current);
          securityTimer.current = null;
        }
        setSecurityActivated(false); // Reset security state
      }
    }
  };

  // Handle alarm trigger
  const handleAlarmTrigger = () => {
    if (securityActivated) {
      if (!isStationary) {
        if (!alarmTimer.current) {
          console.log('Starting alarm timer...');
          alarmTimer.current = BackgroundTimer.setTimeout(() => {
            if (isLocked) {
              console.log('Alarm Triggered!');
            } else {
              console.log('Device Unlocked. Alarm Stopped. Clearing Alarm Timer');
              if (alarmTimer.current) BackgroundTimer.clearTimeout(alarmTimer.current);
              alarmTimer.current = null;
              setSecurityActivated(false);
            }
          }, 5000); // 5 seconds
        }
      }
      if(!isLocked){
        setSecurityActivated(false);
        console.log('Device Unlocked. Alarm Stopped. Security Deactivated');
        // clear security timer
        if (securityTimer.current) {
          console.log('Clearing security timer...');
          BackgroundTimer.clearTimeout(securityTimer.current);
          securityTimer.current = null;
        }
        // clear alarm timer
        if (alarmTimer.current) {
          console.log('Clearing alarm timer...');
          BackgroundTimer.clearTimeout(alarmTimer.current);
          alarmTimer.current = null;
        }
      }
    }
  };

  // Run security activation logic
  useEffect(() => {
    handleSecurityActivation();
  }, [isLocked, isStationary]);

  // Run alarm trigger logic
  useEffect(() => {
    handleAlarmTrigger();
  }, [securityActivated, isLocked, isStationary]);

  return (
    <View style={styles.container}>
      <KeepAwake />
      <Text style={styles.title}>Device Security System</Text>
      <Text style={styles.title}>Device Status: {isLocked ? 'Locked' : 'Unlocked'}</Text>
      <Text style={styles.title}>Device Motion: {isStationary ? 'Stationary' : 'In Motion'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  alert: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
  },
});