import { useEffect, useState } from 'react';
import { accelerometer, gyroscope, SensorData, setUpdateIntervalForType } from 'react-native-sensors';
import { filter } from 'rxjs/operators';

// Thresholds for detecting if the phone is stationary
const ACCELERATION_THRESHOLD = 0.3; // Adjust for sensitivity
const ROTATION_THRESHOLD = 0.3; // Adjust for sensitivity

// Set the update interval for the sensors
setUpdateIntervalForType('accelerometer', 200); // 100ms
setUpdateIntervalForType('gyroscope', 200); // 100ms

export default function useIsStationary() {
  const [isStationary, setIsStationary] = useState<boolean>(false);

  useEffect(() => {
    const accelerationSubscription = accelerometer.subscribe((data: SensorData) => {
      const acceleration = Math.sqrt(data.x ** 2 + data.y ** 2 + (data.z-9.8) ** 2);
      if (acceleration > ACCELERATION_THRESHOLD) {
        setIsStationary(false);
      }
      else {setIsStationary(true);}
    });

    const rotationSubscription = gyroscope.subscribe((data: SensorData) => {
      const rotation = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      if (rotation > ROTATION_THRESHOLD) {
        setIsStationary(false);
      }
      else {setIsStationary(true);}
    });

    return () => {
      accelerationSubscription.unsubscribe();
      rotationSubscription.unsubscribe();
    };
    
  }, []);

  return isStationary;
}
