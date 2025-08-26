// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { useSecurity } from '../context/SecurityProvider';
// import colors from '../theme/colors';

// const RecentSecurityEvent = () => {
//     const { theme } = useSecurity();
//     const themeColors = colors[theme]; // Get theme-specific colors

//     return (
//         <View style={[styles.container, { backgroundColor: themeColors.secondary, shadowColor: themeColors.primary }]}>
//             <Icon
//                 name="alert-circle-outline"
//                 size={28}
//                 color={themeColors.primary}
//                 style={styles.icon}
//             />
//             <Text style={[styles.eventText, { color: themeColors.primary }]}>
//                 No Recent Events
//             </Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 20,
//         marginBottom: 20,
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3,
//     },
//     icon: {
//         marginRight: 10,
//     },
//     eventText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
// });

// export default RecentSecurityEvent;
