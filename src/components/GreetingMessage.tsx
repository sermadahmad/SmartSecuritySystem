// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { useSecurity } from '../context/SecurityProvider';
// import Icon from 'react-native-vector-icons/Ionicons';
// import colors from '../theme/colors';

// const getGreeting = () => {
//   const hour = new Date().getHours();
//   if (hour < 12) return { text: 'Good Morning!', icon: 'sunny' };
//   if (hour < 18) return { text: 'Good Afternoon!', icon: 'partly-sunny' };
//   return { text: 'Good Evening!', icon: 'moon' };
// };

// const GreetingMessage = () => {
//   const { theme } = useSecurity();
//   const themeColors = colors[theme]; // Get theme-specific colors
//   const greeting = getGreeting();
//   const isDarkMode = theme === 'dark';

//   return (
//     <View style={[
//       styles.container,
//       { backgroundColor: themeColors.secondary },
//       isDarkMode ? styles.darkShadow : styles.lightShadow // Conditional shadow
//     ]}>
//       <Icon name={greeting.icon} size={28} color={themeColors.primary} style={styles.icon} />
//       <Text style={[styles.greeting, { color: themeColors.primary }]}>{greeting.text}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   lightShadow: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   darkShadow: {
//     shadowColor: '#fff', // White glow effect
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   greeting: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
// });

// export default GreetingMessage;
