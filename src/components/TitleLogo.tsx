// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import { useSecurity } from '../context/SecurityProvider';
// import colors from '../theme/colors';

// const TitleLogo = () => {
//   const { theme } = useSecurity();
//   const themeColors = colors[theme]; // Get colors based on theme

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../assets/logo.png')}
//         style={[styles.logo, { tintColor: themeColors.primary }]} // Use theme-based icon color
//       />
//       <Text style={[styles.title, { color: themeColors.primary }]}>
//         Smart Security System
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

// export default TitleLogo;
