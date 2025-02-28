import React, { useEffect, useState } from 'react';
import { View, Text, Button, NativeModules } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { DeviceLockModule } = NativeModules;

const App = () => {
  const [isLocked, setIsLocked] = useState<boolean | null>(null);

  const checkDeviceLock = async () => {
    try {
      const locked = await DeviceLockModule.isDeviceLocked();
      setIsLocked(locked);
    } catch (error) {
      console.error('Error checking device lock:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Device Locked: {isLocked === null ? "Checking..." : isLocked ? "Yes" : "No"}</Text>
      <Button title="Check Lock Status" onPress={checkDeviceLock} />
      <Icon name="123" size={30} color="#900" />
    </View>
  );
};

export default App;
