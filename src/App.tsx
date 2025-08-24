import React, { useContext, useEffect } from 'react';
import { SecurityProvider } from './context/SecurityProvider';
import AppNavigator from './navigation/AppNavigator';
import { ForegroundServiceProvider } from './context/ForegroundServiceContext';
import TrackPlayer from 'react-native-track-player';

export default function App() {
  useEffect(() => {
    TrackPlayer.setupPlayer();
  }, []);

  return (
    <ForegroundServiceProvider>
      <SecurityProvider>
        <AppNavigator />
      </SecurityProvider>
    </ForegroundServiceProvider>
  );
}
