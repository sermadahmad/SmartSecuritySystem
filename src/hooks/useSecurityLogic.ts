import { useEffect, useRef, useState } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
import useDeviceLock from './DeviceLock';
import useIsStationary from './useIsStationary';
import { getGoogleMapsLink } from '../utils/locationService';
import { useForegroundService } from '../context/ForegroundServiceContext';
import { startForegroundService } from '../utils/foregroundService';
import { captureSecurityPhotos } from '../utils/cameraCapture';
import { MonitoringStatus } from './usePersistentState';
import { alarmSounds } from '../utils/alarmSounds';
import TrackPlayer from 'react-native-track-player';
import { EventLog, Contact } from '../context/SecurityProvider';
import { getFirestore, collection, addDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { usePersistentState } from '../hooks/usePersistentState';
import { sendSecurityAlertToContacts } from '../api/apiService';


export const useSecurityLogic = (
    settings: {
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
    },
    setLocation: (link: string | null) => void,
    eventLogs: EventLog[],
    setEventLogs: React.Dispatch<React.SetStateAction<EventLog[]>>,
    contacts: Contact[]
) => {
    const isLocked = useDeviceLock() ?? false;
    const isStationary = useIsStationary();
    const [securityActivated, setSecurityActivated] = useState(false);
    const lockDelayTimer = useRef<number | null>(null);
    const alarmDelayTimer = useRef<number | null>(null);
    const foregroundService = useForegroundService();
    const { userId } = usePersistentState();

    useEffect(() => {
        BackgroundTimer.start();
        return () => {
            BackgroundTimer.stop();
            if (lockDelayTimer.current) BackgroundTimer.clearTimeout(lockDelayTimer.current);
            if (alarmDelayTimer.current) BackgroundTimer.clearTimeout(alarmDelayTimer.current);
        };
    }, []);

    useEffect(() => {
        if (settings.status === 'security_active' && !securityActivated) {
            if (isLocked && isStationary) {
                if (!lockDelayTimer.current) {
                    console.log('Starting lock delay timer...');
                    lockDelayTimer.current = BackgroundTimer.setTimeout(() => {
                        console.log('Security Activated');
                        setSecurityActivated(true);
                    }, settings.lockDelay * 1000);
                }
            } else {
                if (lockDelayTimer.current) {
                    console.log('Clearing lock delay timer...');
                    BackgroundTimer.clearTimeout(lockDelayTimer.current);
                    lockDelayTimer.current = null;
                }
                setSecurityActivated(false);
            }
        }
    }, [isLocked, isStationary, settings.status, settings.lockDelay]);

    useEffect(() => {
        if (securityActivated) {
            if (!isStationary) {
                if (!alarmDelayTimer.current) {
                    console.log('Starting alarm delay timer...');
                    alarmDelayTimer.current = BackgroundTimer.setTimeout(async () => {
                        if (isLocked) {
                            console.log('Alarm Triggered!');
                            const selectedSoundObj = alarmSounds.find(s => s.label === settings.selectedSound) || alarmSounds[0];
                            await setupAlarmPlayer(selectedSoundObj.file, selectedSoundObj.label);
                            await TrackPlayer.setVolume(settings.alarmVolume);
                            await startAlarm();

                            // Play for selected duration (if not infinite)
                            if (settings.selectedDuration > 0) {
                                BackgroundTimer.setTimeout(() => {
                                    stopAlarm();
                                    if (alarmDelayTimer.current) BackgroundTimer.clearTimeout(alarmDelayTimer.current);
                                    alarmDelayTimer.current = null;
                                    setSecurityActivated(false);
                                }, settings.selectedDuration * 1000);
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
                                    console.log('Google Maps Link after alarm:', locationLink);
                                } else {
                                    console.warn('Location not available after alarm');
                                }
                                console.log('Starting automatic security photo capture...');
                                photoResult = await captureSecurityPhotos();
                                // console.log('Security photos captured:', photoResult);
                            } catch (error) {
                                console.error('Error during security response:', error);
                            } finally {
                                if (foregroundService && foregroundService.stopService) {
                                    await foregroundService.stopService();
                                    console.log('Foreground service stopped after alarm');
                                }
                            }

                            // Store event log
                            const now = new Date();
                            let eventLog: EventLog = {
                                id: '', // Add id property
                                date: now.toLocaleDateString(),
                                time: now.toLocaleTimeString(),
                                triggerType: 'Unauthorized Access',
                                alarmPlayed: true,
                                location: locationLink,
                                photoURIs: photoResult,
                                alarmSound: settings.selectedSound,
                                createdAt: serverTimestamp(),
                            };

                            try {
                                if (userId) {
                                    const db = getFirestore();
                                    // Remove 'id' before saving
                                    const { id, ...eventLogData } = eventLog;
                                    const docRef = await addDoc(collection(db, `users/${userId}/eventLogs`), eventLogData);
                                    eventLog.id = docRef.id; // Set Firestore doc ID

                                    // Send security alert to contacts via API
                                    console.log('useSecurityLogic: Sending unauthorized access alerts to contacts...');
                                    const alertData = {
                                        eventType: 'Unauthorized Access',
                                        date: now.toLocaleDateString(),
                                        time: now.toLocaleTimeString(),
                                        location: locationLink,
                                        photoURIs: photoResult,
                                        userId: userId,
                                        contacts: contacts
                                    };

                                    const apiResponse = await sendSecurityAlertToContacts(alertData);
                                    
                                    if (apiResponse.success) {
                                        console.log(`useSecurityLogic: Successfully sent ${apiResponse.emailsSent} security alerts`);
                                    } else {
                                        console.error('useSecurityLogic: Failed to send security alerts:', apiResponse.message);
                                    }
                                }
                            } catch (error) {
                                console.error('Error saving event log to Firestore or sending security alerts:', error);
                            }

                            setEventLogs(prev => [...prev, eventLog]);
                        } else {
                            console.log('Device Unlocked. Alarm Stopped.');
                            stopAlarm();
                            if (alarmDelayTimer.current) BackgroundTimer.clearTimeout(alarmDelayTimer.current);
                            alarmDelayTimer.current = null;
                            setSecurityActivated(false);
                        }
                    }, settings.alarmDelay * 1000);
                }
            }

            if (!isLocked) {
                console.log('Device Unlocked. Security Deactivated.');
                setSecurityActivated(false);
                stopAlarm();
                if (lockDelayTimer.current) {
                    BackgroundTimer.clearTimeout(lockDelayTimer.current);
                    lockDelayTimer.current = null;
                }
                if (alarmDelayTimer.current) {
                    BackgroundTimer.clearTimeout(alarmDelayTimer.current);
                    alarmDelayTimer.current = null;
                }
            }
        }
    }, [securityActivated, isLocked, isStationary, settings.alarmDelay]);

    return { securityActivated };
};
