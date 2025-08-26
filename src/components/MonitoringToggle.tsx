// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useSecurity } from '../context/SecurityProvider';
// import Icon from 'react-native-vector-icons/Ionicons';
// import colors from '../theme/colors';

// const MonitoringToggle = () => {
//   const { monitoringEnabled, toggleMonitoring, theme } = useSecurity();
//   const themeColors = colors[theme]; // Get theme-specific colors

//   return (
//     <View style={styles.container}>
//       {/* Monitoring Status */}
//       <View style={styles.statusContainer}>
//         <Icon
//           name={monitoringEnabled ? 'shield-checkmark' : 'shield-outline'}
//           size={20}
//           color={themeColors.primary}
//           style={styles.statusIcon}
//         />
//         <Text style={[styles.statusText, { color: themeColors.primary }]}>
//           {monitoringEnabled ? 'Monitoring Active' : 'Monitoring Inactive'}
//         </Text>
//       </View>

//       {/* Monitoring Toggle Button */}
//       <View>
//       <TouchableOpacity
//         style={[styles.button, {
//           backgroundColor: themeColors.secondary,
//           shadowColor: themeColors.primary,
//         }]}
//         onPress={toggleMonitoring}
//       >
//         <Icon
//           name={monitoringEnabled ? 'power' : 'play'}
//           size={24}
//           color={themeColors.primary}
//           style={styles.buttonIcon}
//         />
//         <Text style={[styles.buttonText, { color: themeColors.primary }]}>
//           {monitoringEnabled ? 'Disable Monitoring' : 'Enable Monitoring'}
//         </Text>
//       </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   statusIcon: {
//     marginRight: 5,
//   },
//   statusText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 20,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   buttonIcon: {
//     marginRight: 5,
//     // borderRadius: 50,
//     // padding: 5,
//   },
// });

// export default MonitoringToggle;
