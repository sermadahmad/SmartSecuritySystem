import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
import useDeviceLock from '../customHooks/DeviceLock';
import useIsStationary from '../customHooks/useIsStationary';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type SecurityContextType = {
    monitoringEnabled: boolean;
    toggleMonitoring: () => void;
    securityActivated: boolean;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  };

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
  const isLocked = useDeviceLock() ?? false;
  const isStationary = useIsStationary();
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [securityActivated, setSecurityActivated] = useState(false);
  const securityTimer = useRef<number | null>(null);
  const alarmTimer = useRef<number | null>(null);

  const isDarkMode = useColorScheme() === 'dark'; // Get system theme
  const [theme, setTheme] = useState<'light' | 'dark'>(isDarkMode ? 'dark' : 'light');


  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) setTheme(savedTheme as 'light' | 'dark');
    };
    loadTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    (async () => {
      await setupAlarmPlayer();
    })();

    return () => {
      stopAlarm(); // Cleanup on unmount
    };
  }, []);

  useEffect(() => {
    BackgroundTimer.start();
    return () => {
      BackgroundTimer.stop();
      if (securityTimer.current) BackgroundTimer.clearTimeout(securityTimer.current);
      if (alarmTimer.current) BackgroundTimer.clearTimeout(alarmTimer.current);
    };
  }, []);

  // Security activation logic
  const handleSecurityActivation = () => {
    if (monitoringEnabled && !securityActivated) {
      if (isLocked && isStationary) {
        if (!securityTimer.current) {
          console.log('Starting security timer...');
          securityTimer.current = BackgroundTimer.setTimeout(() => {
            console.log('Security Activated');
            setSecurityActivated(true);
          }, 5000);
        }
      } else {
        if (securityTimer.current) {
          console.log('Clearing security timer...');
          BackgroundTimer.clearTimeout(securityTimer.current);
          securityTimer.current = null;
        }
        setSecurityActivated(false);
      }
    }
  };

  // Alarm trigger logic
  const handleAlarmTrigger = () => {
    if (securityActivated) {
      if (!isStationary) {
        if (!alarmTimer.current) {
          console.log('Starting alarm timer...');
          alarmTimer.current = BackgroundTimer.setTimeout(() => {
            if (isLocked) {
              console.log('Alarm Triggered!');
              startAlarm();
            } else {
              console.log('Device Unlocked. Alarm Stopped.');
              stopAlarm();
              if (alarmTimer.current) BackgroundTimer.clearTimeout(alarmTimer.current);
              alarmTimer.current = null;
              setSecurityActivated(false);
            }
          }, 5000);
        }
      }

      if (!isLocked) {
        console.log('Device Unlocked. Security Deactivated.');
        setSecurityActivated(false);
        stopAlarm();
        if (securityTimer.current) {
          BackgroundTimer.clearTimeout(securityTimer.current);
          securityTimer.current = null;
        }
        if (alarmTimer.current) {
          BackgroundTimer.clearTimeout(alarmTimer.current);
          alarmTimer.current = null;
        }
      }
    }
  };

  // Run security logic
  useEffect(() => {
    handleSecurityActivation();
  }, [isLocked, isStationary, monitoringEnabled]);

  // Run alarm logic
  useEffect(() => {
    handleAlarmTrigger();
  }, [securityActivated, isLocked, isStationary]);

  // Load state from AsyncStorage
  useEffect(() => {
    const loadState = async () => {
      try {
        const storedMonitoring = await AsyncStorage.getItem('monitoringEnabled');
        if (storedMonitoring !== null) {
          setMonitoringEnabled(JSON.parse(storedMonitoring));
        }
        
      } catch (error) {
        console.error('Error loading state:', error);
      }
    };
    
    loadState();
  }, []);

  // Save monitoringEnabled state to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem('monitoringEnabled', JSON.stringify(monitoringEnabled));
  }, [monitoringEnabled]);


  const toggleMonitoring = () => {
    setMonitoringEnabled((prev) => {
      const newValue = !prev;
      console.log(`Monitoring Enabled: ${newValue}`);
      AsyncStorage.setItem('monitoringEnabled', JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <SecurityContext.Provider value={{ monitoringEnabled, toggleMonitoring, securityActivated, theme, toggleTheme }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

