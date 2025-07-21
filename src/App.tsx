import React, { useContext } from 'react';
import { SecurityProvider } from './context/SecurityProvider';
import AppNavigator from './navigation/AppNavigator';
import { ForegroundServiceProvider } from './context/ForegroundServiceContext';

export default function App() {
  return (
    <ForegroundServiceProvider>
      <SecurityProvider>
        <AppNavigator />
      </SecurityProvider>
    </ForegroundServiceProvider>
  );
}
