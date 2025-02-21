import React, { useEffect, useState } from "react";
import { View, Text, NativeModules, NativeEventEmitter, StyleSheet } from "react-native";

const { DeviceLock } = NativeModules;
const eventEmitter = new NativeEventEmitter(DeviceLock);

const App = () => {
  const [isLocked, setIsLocked] = useState(null); // Store current lock state
  const [prevLocked, setPrevLocked] = useState(null); // Store previous lock state

  useEffect(() => {
    // Start monitoring when the app launches
    DeviceLock.startMonitoring();

    // Listen for lock status updates
    const subscription = eventEmitter.addListener("DeviceLockStatus", (locked) => {
      if (locked !== prevLocked) { // Only log if state changes
        console.log("🔍 Phone Lock State Changed:", locked ? "🔒 Locked" : "🔓 Unlocked");
        setPrevLocked(locked);
      }
      setIsLocked(locked);
    });

    return () => {
      subscription.remove();
      DeviceLock.stopMonitoring(); // Stop service when app closes (optional)
    };
  }, [prevLocked]); // Add `prevLocked` as a dependency to track state changes

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Phone is {isLocked === null ? "Loading..." : isLocked ? "🔒 Locked" : "🔓 Unlocked"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default App;


// import React, { useEffect } from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
// import { NativeModules } from 'react-native';

// const { DeviceLock } = NativeModules;

// // Start monitoring when the app launches
// DeviceLock.startMonitoring();


// const App = () => {
//   // const [locked, setLocked] = React.useState(false);

//   // async function checkDeviceLock() {
//   //   try {
//   //     const isLocked = await DeviceLock.isDeviceLocked();
//   //     console.log(isLocked ? "Phone is locked" : "Phone is unlocked");
//   //     setLocked(isLocked);
//   //   } catch (error) {
//   //     console.error("Error checking lock status:", error);
//   //   }
//   // }

//   // useEffect(() => {
//   //   checkDeviceLock();
//   // });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Smart Security System</Text>
//       {/* <Text style={styles.text}>{locked ? "Phone is locked" : "Phone is unlocked"}</Text> */}
//     </View>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
// });