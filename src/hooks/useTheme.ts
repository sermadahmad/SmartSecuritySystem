import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTheme = () => {
    const isDarkMode = useColorScheme() === 'dark';
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

    return { theme, toggleTheme };
};
