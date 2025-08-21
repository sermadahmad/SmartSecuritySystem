import { useEffect, useRef, useState } from 'react';
import BackgroundTimer from 'react-native-background-timer';
import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
import useDeviceLock from '../customHooks/DeviceLock';
import useIsStationary from '../customHooks/useIsStationary';
import {  getGoogleMapsLink } from '../utils/locationService';
import { useForegroundService } from '../context/ForegroundServiceContext';
import { startForegroundService } from '../utils/foregroundService';
import { captureSecurityPhotos } from '../utils/cameraCapture';

export const useSecurityLogic = (monitoringEnabled: boolean, setLocation: (link: string | null) => void) => {
    const isLocked = useDeviceLock() ?? false;
    const isStationary = useIsStationary();
    // const isStationary = true; // For testing purposes, always set to true
    const [securityActivated, setSecurityActivated] = useState(false);
    const securityTimer = useRef<number | null>(null);
    const alarmTimer = useRef<number | null>(null);
    const foregroundService = useForegroundService();
    // const { setLocation } = useSecurity(); // This line is removed as per the edit hint

    useEffect(() => {
        (async () => {
            await setupAlarmPlayer();
        })();

        return () => {
            stopAlarm();
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

    useEffect(() => {
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
    }, [isLocked, isStationary, monitoringEnabled]);

    useEffect(() => {
        if (securityActivated) {
            if (!isStationary) {
                if (!alarmTimer.current) {
                    console.log('Starting alarm timer...');
                    alarmTimer.current = BackgroundTimer.setTimeout(async () => {
                        if (isLocked) {
                            console.log('Alarm Triggered!');
                            startAlarm();

                            // Start foreground service, get location, capture photos, then stop service
                            try {
                                if (foregroundService) {
                                    await startForegroundService(foregroundService);
                                }
                                
                                // Get location
                                const link = await getGoogleMapsLink();
                                if (link) {
                                    setLocation(link);
                                    console.log('Google Maps Link after alarm:', link);
                                } else {
                                    console.warn('Location not available after alarm');
                                }

                                // Automatically capture security photos
                                console.log('Starting automatic security photo capture...');
                                const photoResult = await captureSecurityPhotos();
                                console.log('Security photos captured:', photoResult);
                                
                            } catch (error) {
                                console.error('Error during security response:', error);
                            } finally {
                                if (foregroundService && foregroundService.stopService) {
                                    await foregroundService.stopService();
                                    console.log('Foreground service stopped after alarm');
                                }
                            }
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
    }, [securityActivated, isLocked, isStationary]);

    return { securityActivated };
};
