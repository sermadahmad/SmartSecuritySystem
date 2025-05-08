import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSecurity } from '../context/SecurityProvider';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../theme/colors';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useSecurity();
  const themeColors = colors[theme]; // Get theme-specific colors
  const isDarkMode = theme === 'dark';

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleTheme} style={[styles.button, { backgroundColor: themeColors.secondary, shadowColor: themeColors.primary }]}>
        <Icon 
          name={theme === 'dark' ? 'moon' : 'sunny'} 
          size={30} 
          color={themeColors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
});

export default ThemeToggle;
