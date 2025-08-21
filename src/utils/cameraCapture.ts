import { NativeModules } from 'react-native';
import { SecurityPhotoResult } from '../types/cameraCapture';

const { SecurityTriggerModule } = NativeModules;

export const captureSecurityPhotos = async (): Promise<string> => {
  try {
    console.log('Triggering security camera service...');
    const result = await SecurityTriggerModule.triggerSecurityCameraCapture();
    console.log('Security camera service triggered:', result);
    return result;
  } catch (error) {
    console.error('Error triggering security camera service:', error);
    throw error;
  }
};
