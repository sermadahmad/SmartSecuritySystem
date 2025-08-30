import { useEffect, useState } from 'react';
import { accelerometer, gyroscope, SensorData, setUpdateIntervalForType } from 'react-native-sensors';

// Thresholds for detecting if the phone is stationary
const ACCELERATION_THRESHOLD = 10; // Adjust for sensitivity
const ROTATION_THRESHOLD = 0.1; // Adjust for sensitivity

// Set the update interval for the sensors
setUpdateIntervalForType('accelerometer', 200); // 200ms
setUpdateIntervalForType('gyroscope', 200); // 200ms

export default function useIsStationary() {
  const [isStationary, setIsStationary] = useState<boolean>(false);

  useEffect(() => {
    let accelerationValue = 0;
    let rotationValue = 0;

    const accelerationSubscription = accelerometer.subscribe((data: SensorData) => {
      accelerationValue = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
    //   console.log("acceleration "+accelerationValue);
      accelerationValue = Math.abs(accelerationValue); // Ensure positive value
    //   console.log(accelerationValue);

      updateStationaryState();
    });

    const rotationSubscription = gyroscope.subscribe((data: SensorData) => {
      rotationValue = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
        // console.log("rotation"+rotationValue);

      updateStationaryState();
    });

    const updateStationaryState = () => {
      if (accelerationValue < ACCELERATION_THRESHOLD && rotationValue < ROTATION_THRESHOLD) {
        setIsStationary(true);
      } else {
        setIsStationary(false);
      }
    };

    return () => {
      accelerationSubscription.unsubscribe();
      rotationSubscription.unsubscribe();
    };
  }, []);

  return isStationary;
}
