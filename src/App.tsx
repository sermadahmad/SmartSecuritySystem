import React from 'react';
import { SecurityProvider } from './context/SecurityContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <SecurityProvider>
      <AppNavigator />
    </SecurityProvider>
  );
}
