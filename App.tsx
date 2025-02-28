import { View, Text, StyleSheet } from 'react-native';
import { useDeviceLock } from './customHooks/DeviceLock';
import useIsStationary from './customHooks/useIsStationary';

export default function App() {
  const isLocked = useDeviceLock(); // Use the custom hook
  const isStationary = useIsStationary(); // Use the custom hook
  console.log('isLocked:', isLocked);
  console.log('isStationary:', isStationary);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Device Status: {isLocked ? 'Locked' : 'Unlocked'}</Text>
      <Text style={styles.title}>Device Motion: {isStationary ? 'Stationary' : 'In Motion'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
});