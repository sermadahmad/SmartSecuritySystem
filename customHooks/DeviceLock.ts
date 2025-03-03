import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { DeviceLockModule } = NativeModules;
const deviceLockEmitter = new NativeEventEmitter(DeviceLockModule);

export default function useDeviceLock() {
  const [isLocked, setIsLocked] = useState<boolean | null>(null);

  useEffect(() => {
    const subscription = deviceLockEmitter.addListener(
      'onDeviceLockStatusChanged',
      (status) => {
        // console.log('Lock Status Changed:', status);
        setIsLocked(status);
      }
    );

    return () => subscription.remove(); // Clean up listener
  }, []);

  return isLocked;
}
