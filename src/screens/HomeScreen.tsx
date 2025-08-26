// import React, { useEffect, useState } from 'react';
// import { View, SafeAreaView, StyleSheet, Button, Linking, Alert, Text } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useSecurity } from '../context/SecurityProvider';
// import colors from '../theme/colors';
// import TitleLogo from '../components/TitleLogo';
// import ThemeToggle from '../components/ThemeToggle';
// import GreetingMessage from '../components/GreetingMessage';
// import MonitoringToggle from '../components/MonitoringToggle';
// import StatusIndicator from '../components/Home/StatusIndicator';
// import RecentSecurityEvent from '../components/RecentSecurityEvent';
// import LogHistoryButton from '../components/LogHistoryButton';
// import { captureSecurityPhotos } from '../utils/cameraCapture';

// const HomeScreen = () => {
//   const { theme, location } = useSecurity();
//   const themeColors = colors[theme];
//   const [captureStatus, setCaptureStatus] = useState<string>('');
//   const navigation = useNavigation();

//   const handleCameraCapture = async () => {
//     Alert.alert(
//       'Camera Capture',
//       'This will trigger the security system to capture photos from both cameras.',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Capture',
//           onPress: async () => {
//             try {
//               setCaptureStatus('Triggering camera service...');
//               const result = await captureSecurityPhotos();
//               setCaptureStatus(`Camera service triggered: ${result}`);
//               Alert.alert('Success', 'Security camera service started successfully!');
//             } catch (error) {
//               setCaptureStatus('Service trigger failed');
//               Alert.alert('Error', `Failed to trigger camera service: ${error}`);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const navigateToPhotoGallery = () => {
//     navigation.navigate('PhotoGallery' as never);
//   };

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: themeColors.secondary }]}>
//       <ThemeToggle />
//       <TitleLogo />
//       {location && (
//         <Button
//           title={location}
//           onPress={() => {
//             Linking.openURL(location);
//           }}
//           color={themeColors.primary}
//         />
//       )}
      
//       <GreetingMessage />
//       <MonitoringToggle />
//       <StatusIndicator />
//       <RecentSecurityEvent />
      
//       <View style={styles.buttonContainer}>
//         <Button
//           title="📸 Capture Security Photos"
//           onPress={handleCameraCapture}
//           color={themeColors.primary}
//         />
//         <Button
//           title="🖼️ View Photo Gallery"
//           onPress={navigateToPhotoGallery}
//           color={themeColors.primary}
//         />
//         {captureStatus ? (
//           <Text style={[styles.statusText, { color: themeColors.primary }]}>
//             {captureStatus}
//           </Text>
//         ) : null}
//       </View>
      
//       <LogHistoryButton />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     width: '100%',
//   },
//   statusText: {
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });

// export default HomeScreen;
