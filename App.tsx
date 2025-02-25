import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Smart Security System</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});