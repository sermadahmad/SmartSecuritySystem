import { useRef, useState, useCallback } from 'react';
import { Camera } from 'react-native-vision-camera';
import { Alert } from 'react-native';

export function usePhotoCapture() {
  const cameraRef = useRef<Camera>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleCapture = useCallback(async () => {
    if (cameraRef.current == null) {
      console.warn('Camera ref is null');
      return;
    }
    try {
      console.log('Taking photo...');
      const photo = await cameraRef.current.takePhoto({});
      console.log('Photo captured:', photo);
      setPhotos((prev) => [...prev, 'file://' + photo.path]);
    } catch (e) {
      console.error('Error capturing photo:', e);
      Alert.alert('Error capturing photo', String(e));
    }
  }, []);

  return {
    cameraRef,
    photos,
    setPhotos,
    handleCapture,
  };
}
