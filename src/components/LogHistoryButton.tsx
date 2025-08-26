// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { useNavigation, NavigationProp } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import colors from '../theme/colors';
// import { useSecurity } from '../context/SecurityProvider';
// import { RootStackParamList } from '../navigation/AppNavigator';

// const LogHistoryButton = () => {
//   const { theme } = useSecurity();
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Use NavigationProp
//   const themeColors = colors[theme];

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: themeColors.secondary, shadowColor: themeColors.primary }]}
//         onPress={() => navigation.navigate('Logs')} // No TypeScript error now
//       >
//         <Icon name="list-outline" size={24} color={themeColors.primary} style={styles.icon} />
//         <Text style={[styles.buttonText, { color: themeColors.primary }]}>
//           Show Complete Log History
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     marginTop: 20,

//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LogHistoryButton;
