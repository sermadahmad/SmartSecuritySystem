import React from 'react';
import { SecurityProvider } from './context/SecurityProvider';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SecurityProvider>
      <AppNavigator />
    </SecurityProvider>
  );
}
