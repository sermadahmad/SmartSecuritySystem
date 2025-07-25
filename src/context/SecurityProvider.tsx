import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useSecurityLogic } from '../hooks/useSecurityLogic';
import { useTheme } from '../hooks/useTheme';
import { usePersistentState } from '../hooks/usePersistentState';
// import ForegroundService from '@voximplant/react-native-foreground-service';


type SecurityContextType = {
    // foregroundService: any;
    monitoringEnabled: boolean;
    toggleMonitoring: () => void;
    securityActivated: boolean;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    location: string | null;
    setLocation: (location: string | null) => void;

};

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
    const { monitoringEnabled, toggleMonitoring } = usePersistentState();
    const [location, setLocation] = useState<string | null>(null);
    const { securityActivated } = useSecurityLogic(monitoringEnabled, setLocation);
    const { theme, toggleTheme } = useTheme();
    // const foregroundService = new ForegroundService();

    return (
        // <SecurityContext.Provider value={{foregroundService, monitoringEnabled, toggleMonitoring, securityActivated, theme, toggleTheme }}>
        <SecurityContext.Provider value={{
            monitoringEnabled, toggleMonitoring, securityActivated, theme, toggleTheme, location, setLocation
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
