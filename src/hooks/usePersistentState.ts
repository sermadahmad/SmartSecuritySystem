import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePersistentState = () => {
    const [monitoringEnabled, setMonitoringEnabled] = useState(false);

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

    return { monitoringEnabled, toggleMonitoring };
};
