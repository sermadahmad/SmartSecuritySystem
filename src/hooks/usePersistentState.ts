import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MonitoringStatus = 'security_active' | 'security_inactive' | 'alarm_triggered';

export type PersistentSettings = {
    status: MonitoringStatus;
    alarmDelay: number;
    lockDelay: number;
    selectedSound: string;
    alarmVolume: number;
    selectedDuration: number;
    sendLocation: boolean;
    sendPhotos: boolean;
    sendEventDetails: boolean;
    playAlarm: boolean;
};

const DEFAULT_SETTINGS: PersistentSettings = {
    status: 'security_active',
    alarmDelay: 5,
    lockDelay: 5,
    selectedSound: 'Default',
    alarmVolume: 1,
    selectedDuration: -1,
    sendLocation: true,
    sendPhotos: true,
    sendEventDetails: true,
    playAlarm: true,
};

export const usePersistentState = () => {
    const [settings, setSettings] = useState<PersistentSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const loadState = async () => {
            try {
                const storedSettings = await AsyncStorage.getItem('persistentSettings');
                if (storedSettings !== null) {
                    setSettings(JSON.parse(storedSettings));
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };
        loadState();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('persistentSettings', JSON.stringify(settings));
    }, [settings]);

    // Individual setters
    const setMonitoringActive = () => {
        setSettings(prev => ({ ...prev, status: 'security_active' }));
        console.log('Status set to monitoring_active');
    };

    const setMonitoringInactive = () => {
        setSettings(prev => ({ ...prev, status: 'security_inactive' }));
        console.log('Status set to monitoring_inactive');
    };

    const setAlarmTriggered = () => {
        setSettings(prev => ({ ...prev, status: 'alarm_triggered' }));
        console.log('Status set to alarm_triggered');
    };

    const setAlarmDelay = (value: number) => setSettings(prev => ({ ...prev, alarmDelay: value }));
    const setLockDelay = (value: number) => setSettings(prev => ({ ...prev, lockDelay: value }));
    const setSelectedSound = (label: string) => setSettings(prev => ({ ...prev, selectedSound: label }));
    const setAlarmVolume = (value: number) => setSettings(prev => ({ ...prev, alarmVolume: value }));
    const setSelectedDuration = (value: number) => setSettings(prev => ({ ...prev, selectedDuration: value }));
    const setSendLocation = (value: boolean) => setSettings(prev => ({ ...prev, sendLocation: value }));
    const setSendPhotos = (value: boolean) => setSettings(prev => ({ ...prev, sendPhotos: value }));
    const setSendEventDetails = (value: boolean) => setSettings(prev => ({ ...prev, sendEventDetails: value }));
    const setPlayAlarm = (value: boolean) => setSettings(prev => ({ ...prev, playAlarm: value }));
    
    const resetSettings = () => setSettings(DEFAULT_SETTINGS);


    return {
        settings,
        setMonitoringActive,
        setMonitoringInactive,
        setAlarmTriggered,
        setAlarmDelay,
        setLockDelay,
        setSelectedSound,
        setAlarmVolume,
        setSelectedDuration,
        setSendLocation,
        setSendPhotos,
        setSendEventDetails,
        setPlayAlarm,
        resetSettings,
    };
};
