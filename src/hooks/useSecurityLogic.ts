import { useEffect, useRef, useState } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
import useDeviceLock from '../customHooks/DeviceLock';
import useIsStationary from '../customHooks/useIsStationary';
import { getGoogleMapsLink } from '../utils/locationService';
import { useForegroundService } from '../context/ForegroundServiceContext';
import { startForegroundService } from '../utils/foregroundService';
import { captureSecurityPhotos } from '../utils/cameraCapture';
import { MonitoringStatus } from './usePersistentState';
import { alarmSounds } from '../utils/alarmSounds';
import TrackPlayer from 'react-native-track-player';
import { EventLog } from '../context/SecurityProvider';


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
    setEventLogs: React.Dispatch<React.SetStateAction<EventLog[]>>
) => {
    const isLocked = useDeviceLock() ?? false;
    const isStationary = useIsStationary();
    const [securityActivated, setSecurityActivated] = useState(false);
    const lockDelayTimer = useRef<number | null>(null);
    const alarmDelayTimer = useRef<number | null>(null);
    const foregroundService = useForegroundService();

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
                            const eventLog: EventLog = {
                                date: now.toLocaleDateString(),
                                time: now.toLocaleTimeString(),
                                triggerType: 'Unauthorized Access',
                                alarmPlayed: true,
                                location: locationLink,
                                photoURIs: photoResult,
                                alarmSound: settings.selectedSound,
                            };
                            console.log('Event Log:', eventLog);
                            // console.log('Photo URIs:', eventLog.photoURIs);
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
