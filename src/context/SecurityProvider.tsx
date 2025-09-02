import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useSecurityLogic } from '../hooks/useSecurityLogic';
import { useTheme } from '../hooks/useTheme';
import { MonitoringStatus, usePersistentState } from '../hooks/usePersistentState';

export type EventLog = {
    id: string;
    date: string;
    time: string;
    triggerType: string;
    alarmPlayed: boolean;
    location: string | null;
    photoURIs: string[];
    alarmSound: string;
    createdAt: any; // Firestore timestamp
};

export type Contact = {
    id: string; 
    email: string;
    sendLocation: boolean;
    sendPhotos: boolean;
    sendEventDetails: boolean;
};

type SecurityContextType = {
    userId: string | null;
    securityActivated: boolean;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    location: string | null;
    setLocation: (location: string | null) => void;
    settings: {
        status: MonitoringStatus;
        alarmDelay: number;
        lockDelay: number;
        selectedSound: string;
        alarmVolume: number;
        selectedDuration: number;
    };
    setMonitoringActive: () => void;
    setMonitoringInactive: () => void;
    setAlarmTriggered: () => void;
    setAlarmDelay: (delay: number) => void;
    setLockDelay: (delay: number) => void;
    setSelectedSound: (sound: string) => void;
    setAlarmVolume: (volume: number) => void;
    setSelectedDuration: (duration: number) => void;
    resetSettings: () => void;
    eventLogs: EventLog[];
    setEventLogs: React.Dispatch<React.SetStateAction<EventLog[]>>;
    contacts: Contact[];
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
};

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
    const {
        userId,
        settings,
        setMonitoringActive,
        setMonitoringInactive,
        setAlarmTriggered,
        setAlarmDelay,
        setLockDelay,
        setSelectedSound,
        setAlarmVolume,
        setSelectedDuration,
        resetSettings
    } = usePersistentState();
    const [location, setLocation] = useState<string | null>(null);
    const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const { securityActivated } = useSecurityLogic(
        settings, 
        setLocation,
        eventLogs,
        setEventLogs,
        contacts
    );
    const { theme, toggleTheme } = useTheme();

    return (
        <SecurityContext.Provider value={{
            userId,
            securityActivated,
            theme,
            toggleTheme,
            location,
            setLocation,
            settings,
            setMonitoringActive,
            setMonitoringInactive,
            setAlarmTriggered,
            setAlarmDelay,
            setLockDelay,
            setSelectedSound,
            setAlarmVolume,
            setSelectedDuration,
            resetSettings,
            eventLogs,
            setEventLogs,
            contacts,
            setContacts,
        }}>
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
