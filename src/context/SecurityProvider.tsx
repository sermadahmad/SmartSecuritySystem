import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useSecurityLogic } from '../hooks/useSecurityLogic';
import { useTheme } from '../hooks/useTheme';
import { usePersistentState } from '../hooks/usePersistentState';

type SecurityContextType = {
    monitoringEnabled: boolean;
    toggleMonitoring: () => void;
    securityActivated: boolean;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
};

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
    const { monitoringEnabled, toggleMonitoring } = usePersistentState();
    const { securityActivated } = useSecurityLogic(monitoringEnabled);
    const { theme, toggleTheme } = useTheme();

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
