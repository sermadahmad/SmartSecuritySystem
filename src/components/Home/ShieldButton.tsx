import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, Image, Text, StyleSheet, Dimensions, Easing } from "react-native";
import { myColors } from '../../theme/colors';
import { useSecurity } from "../../context/SecurityProvider";

const { width } = Dimensions.get('window');

const ShieldButton = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const {
    settings: {
      status
    },
    setMonitoringActive,
    setMonitoringInactive
  } = useSecurity();

  // Animation for active/alarm states
  useEffect(() => {
    if (status === "security_active" || status === "alarm_triggered") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [status]);

  // Shield color and status text based on status
  let shieldStyle = {
    backgroundColor: "#eee",
  };
  let statusText = "Security Inactive";
  let statusTextStyle = { color: "#999" };
  let helperText = "Tap to Activate";
  let helperTextColor = myColors.secondary;
  let shieldDisabled = false;

  if (status === "alarm_triggered") {
    shieldStyle = { backgroundColor: myColors.red, };
    statusText = "ALARM TRIGGERED";
    statusTextStyle = { color: myColors.red, };
    helperText = "Alarm Active!";
    helperTextColor = myColors.red;
    shieldDisabled = true;
  } else if (status === "security_active") {
    shieldStyle = { backgroundColor: myColors.green, };
    statusText = "Security Active";
    statusTextStyle = { color: myColors.green };
    helperText = "Tap to Deactivate";
    helperTextColor = myColors.primary;
  }

  // Button press logic
  const handlePress = () => {
    if (status === "security_inactive") {
      setMonitoringActive();
    } else if (status === "security_active") {
      setMonitoringInactive();
    }
    // If alarm_triggered, button is disabled
  };

  return (
    <View style={styles.shieldContainer}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={shieldDisabled}
      >
        <Animated.View
          style={[
            styles.shieldButton,
            shieldStyle,
            {
              width: width * 0.5,
              height: width * 0.5,
              shadowColor: myColors.text,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: width * 0.4,
              height: width * 0.4,
              tintColor: status === "security_inactive" ? "#888" : undefined
            }}
          />
        </Animated.View>
      </TouchableOpacity>
      <Text style={[styles.statusText, statusTextStyle]}>
        {statusText}
      </Text>
      <Text style={[styles.helperText, { color: helperTextColor }]}>
        {helperText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  shieldContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  shieldButton: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5
  },
  statusText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  helperText: {
    fontSize: 16,
  }
});

export default ShieldButton;