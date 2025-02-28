import { useEffect, useState } from 'react';
import { View, Text, NativeEventEmitter, NativeModules } from 'react-native';

const { DeviceLockModule } = NativeModules;
const deviceLockEmitter = new NativeEventEmitter(DeviceLockModule);

export default function App() {
  const [isLocked, setIsLocked] = useState<boolean | null>(null);

  useEffect(() => {
    const subscription = deviceLockEmitter.addListener(
      'onDeviceLockStatusChanged',
      (status) => {
        console.log('Lock Status Changed:', status);
        setIsLocked(status);
      }
    );

    return () => subscription.remove(); // Clean up listener
  }, [isLocked]);

  return (
    <View>
      <Text>Device Status: {isLocked ? 'Locked' : 'Unlocked'}</Text>
    </View>
  );
}
