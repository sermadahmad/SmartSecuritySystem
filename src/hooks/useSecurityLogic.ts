// import { useEffect, useRef, useState } from 'react';
// import BackgroundTimer from 'react-native-background-timer';
// import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
// import useDeviceLock from '../customHooks/DeviceLock';
// // import useIsStationary from '../customHooks/useIsStationary';

// export const useSecurityLogic = (monitoringEnabled: boolean) => {
//     const isLocked = useDeviceLock() ?? false;
//     // const isStationary = useIsStationary();
//     const isStationary = true; // For testing purposes, always set to true
//     const [securityActivated, setSecurityActivated] = useState(false);
//     const securityTimer = useRef<number | null>(null);
//     const alarmTimer = useRef<number | null>(null);

//     useEffect(() => {
//         (async () => {
//             await setupAlarmPlayer();
//         })();

//         return () => {
//             stopAlarm();
//         };
//     }, []);

//     useEffect(() => {
//         BackgroundTimer.start();
//         return () => {
//             BackgroundTimer.stop();
//             if (securityTimer.current) BackgroundTimer.clearTimeout(securityTimer.current);
//             if (alarmTimer.current) BackgroundTimer.clearTimeout(alarmTimer.current);
//         };
//     }, []);

//     useEffect(() => {
//         if (monitoringEnabled && !securityActivated) {
//             if (isLocked && isStationary) {
//                 if (!securityTimer.current) {
//                     console.log('Starting security timer...');
//                     securityTimer.current = BackgroundTimer.setTimeout(() => {
//                         console.log('Security Activated');
//                         setSecurityActivated(true);
//                     }, 5000);
//                 }
//             } else {
//                 if (securityTimer.current) {
//                     console.log('Clearing security timer...');
//                     BackgroundTimer.clearTimeout(securityTimer.current);
//                     securityTimer.current = null;
//                 }
//                 setSecurityActivated(false);
//             }
//         }
//     }, [isLocked, isStationary, monitoringEnabled]);

//     useEffect(() => {
//         if (securityActivated) {
//             if (!isStationary) {
//                 if (!alarmTimer.current) {
//                     console.log('Starting alarm timer...');
//                     alarmTimer.current = BackgroundTimer.setTimeout(() => {
//                         if (isLocked) {
//                             console.log('Alarm Triggered!');
//                             startAlarm();
//                         } else {
//                             console.log('Device Unlocked. Alarm Stopped.');
//                             stopAlarm();
//                             if (alarmTimer.current) BackgroundTimer.clearTimeout(alarmTimer.current);
//                             alarmTimer.current = null;
//                             setSecurityActivated(false);
//                         }
//                     }, 5000);
//                 }
//             }

//             if (!isLocked) {
//                 console.log('Device Unlocked. Security Deactivated.');
//                 setSecurityActivated(false);
//                 stopAlarm();
//                 if (securityTimer.current) {
//                     BackgroundTimer.clearTimeout(securityTimer.current);
//                     securityTimer.current = null;
//                 }
//                 if (alarmTimer.current) {
//                     BackgroundTimer.clearTimeout(alarmTimer.current);
//                     alarmTimer.current = null;
//                 }
//             }
//         }
//     }, [securityActivated, isLocked, isStationary]);

//     return { securityActivated };
// };


import { useEffect, useRef, useState } from 'react';
import { setupAlarmPlayer, startAlarm, stopAlarm } from '../utils/alarmPlayer';
import useDeviceLock from '../customHooks/DeviceLock';
import useIsStationary from '../customHooks/useIsStationary';

export const useSecurityLogic = (monitoringEnabled: boolean) => {
    const isLocked = useDeviceLock() ?? false;
    const isStationary = useIsStationary();
    // const isStationary = true; // For testing purposes
    const [securityActivated, setSecurityActivated] = useState(false);
    const securityTimer = useRef<NodeJS.Timeout | null>(null);
    const alarmTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        (async () => {
            await setupAlarmPlayer();
        })();

        return () => {
            stopAlarm();
        };
    }, []);

    useEffect(() => {
        return () => {
            if (securityTimer.current) {
                clearTimeout(securityTimer.current);
                securityTimer.current = null;
            }
            if (alarmTimer.current) {
                clearTimeout(alarmTimer.current);
                alarmTimer.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (monitoringEnabled && !securityActivated) {
            if (isLocked && isStationary) {
                if (!securityTimer.current) {
                    console.log('Starting security timer...');
                    securityTimer.current = setTimeout(() => {
                        console.log('Security Activated');
                        setSecurityActivated(true);
                    }, 5000);
                }
            } else {
                if (securityTimer.current) {
                    console.log('Clearing security timer...');
                    clearTimeout(securityTimer.current);
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
                    alarmTimer.current = setTimeout(() => {
                        if (isLocked) {
                            console.log('Alarm Triggered!');
                            startAlarm();
                        } else {
                            console.log('Device Unlocked. Alarm Stopped.');
                            stopAlarm();
                            if (alarmTimer.current) {
                                clearTimeout(alarmTimer.current);
                                alarmTimer.current = null;
                            }
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
                    clearTimeout(securityTimer.current);
                    securityTimer.current = null;
                }
                if (alarmTimer.current) {
                    clearTimeout(alarmTimer.current);
                    alarmTimer.current = null;
                }
            }
        }
    }, [securityActivated, isLocked, isStationary]);

    return { securityActivated };
};
