import { NativeModules } from 'react-native';

const { SecurityTriggerModule } = NativeModules;

export const captureSecurityPhotos = async (): Promise<string[]> => {
  try {
    // Record timestamp before capture
    const eventTimestamp = Date.now();
    console.log('[cameraCapture] Event timestamp:', eventTimestamp);

    console.log('[cameraCapture] Triggering security camera service...');
    await SecurityTriggerModule.triggerSecurityCameraCapture();
    await new Promise(res => setTimeout(res, 5000));

    const photosJson = await SecurityTriggerModule.getSecurityPhotos();
    // console.log('[cameraCapture] Raw photosJson:', photosJson);

    const photosArray = JSON.parse(photosJson);
    // console.log('[cameraCapture] Parsed photosArray:', photosArray);

    // Log each photo's timestamp for debugging
    photosArray.forEach((photo: any, idx: number) => {
      // console.log(`[cameraCapture] Photo[${idx}] filename: ${photo.fileName}, timestamp: ${photo.timestamp}, path: ${photo.path}`);
    });

    // Filter photos by timestamp (assuming photo.timestamp is a string like "2024-06-01 12:34:56")
    const recentPhotos = photosArray.filter((photo: any) => {
      const photoTime = new Date(photo.timestamp).getTime();
      // console.log(`[cameraCapture] Comparing photoTime (${photoTime}) >= eventTimestamp (${eventTimestamp})`);
      return photoTime >= eventTimestamp;
    });

    const photoPaths = recentPhotos.map((photo: any) => photo.path);

    console.log('[cameraCapture] Security photos captured for current event:', photoPaths);
    return photoPaths;
  } catch (error) {
    console.error('[cameraCapture] Error capturing security photos:', error);
    return [];
  }
};
