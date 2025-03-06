import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSecurity } from '../context/SecurityContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useSecurity();
  const isDark = theme === 'dark';

  return (
    <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
      <Icon name={isDark ? 'weather-sunny' : 'moon-waning-crescent'} size={24} color={isDark ? '#FFD700' : '#000'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  themeToggle: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});

export default ThemeToggle;
