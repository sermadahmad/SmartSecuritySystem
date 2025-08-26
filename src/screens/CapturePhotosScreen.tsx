

// import React, { useEffect, useState } from 'react';
// import { View, Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
// import { Camera, useCameraDevices, useCameraPermission } from 'react-native-vision-camera';
// import { usePhotoCapture } from '../hooks/usePhotoCapture';


// const CapturePhotosScreen = () => {
//   const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
//   const { cameraRef, photos, handleCapture } = usePhotoCapture();
//   const devices = useCameraDevices();
//   const device = devices.find((d) => d.position === cameraPosition);

//   // Debugging logs
//   useEffect(() => {
//     console.log('Camera devices:', devices);
//     console.log('Selected camera position:', cameraPosition);
//     console.log('Selected device:', device);
//   }, [devices, cameraPosition, device]);


//   return (
//     <View style={styles.container}>
//       <ScrollView>
//         <Text style={styles.title}>Capture Photos</Text>
//       <View style={styles.buttonRow}>
//         <Button
//           title="Front Camera"
//           onPress={() => setCameraPosition('front')}
//           color={cameraPosition === 'front' ? '#007bff' : undefined}
//         />
//         <Button
//           title="Back Camera"
//           onPress={() => setCameraPosition('back')}
//           color={cameraPosition === 'back' ? '#007bff' : undefined}
//         />
//       </View>
//       <View style={styles.cameraContainer}>
//         {device ? (
//           <Camera
//             ref={cameraRef}
//             style={styles.camera}
//             device={device}
//             isActive={true}
//             photo={true}
//           />
//         ) : (
//           <Text style={styles.noPhotos}>Camera not available</Text>
//         )}
//       </View>
//       <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
//         <Text style={styles.captureButtonText}>Capture Photo</Text>
//       </TouchableOpacity>
//       <ScrollView contentContainerStyle={styles.photosContainer}>
//         {photos.length === 0 && <Text style={styles.noPhotos}>No photos captured yet.</Text>}
//         {photos.map((uri, idx) => (
//           <Image
//             key={uri + idx}
//             source={{ uri }}
//             style={styles.photo}
//             resizeMode="cover"
//           />
//         ))}
//       </ScrollView>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },

//   cameraContainer: {
//     width: '100%',
//     aspectRatio: 3 / 4,
//     backgroundColor: '#000',
//     borderRadius: 12,
//     overflow: 'hidden',
//     marginBottom: 16,
//   },
//   camera: {
//     flex: 1,
//   },
//   captureButton: {
//     backgroundColor: '#007bff',
//     padding: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   captureButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   photosContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   photo: {
//     width: 120,
//     height: 120,
//     margin: 8,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   noPhotos: {
//     color: '#888',
//     fontSize: 16,
//     marginTop: 40,
//     textAlign: 'center',
//   },
// });

// export default CapturePhotosScreen;