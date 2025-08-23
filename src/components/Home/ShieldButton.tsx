import React, { useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, Image, Text, StyleSheet, Dimensions, Easing } from "react-native";
import { myColors } from '../../theme/colors';

const { width } = Dimensions.get('window');

type ShieldButtonProps = {
  active: boolean;
  setActive: (active: boolean) => void;
  isAlarmActive: boolean;
};

const ShieldButton: React.FC<ShieldButtonProps> = ({ active, setActive, isAlarmActive }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active || isAlarmActive) {
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
  }, [active, isAlarmActive]);

  // Determine shield color
  let shieldStyle = styles.shieldInactive;
  if (isAlarmActive) {
    shieldStyle = styles.shieldAlarm;
  } else if (active) {
    shieldStyle = styles.shieldActive;
  }

  // Determine status text and color
  let statusText = "Security Inactive";
  let statusTextStyle = styles.inactiveText;
  let helperText = "Tap to Activate";
  let helperTextColor = myColors.primary;

  if (isAlarmActive) {
    statusText = "ALARM TRIGGERED";
    statusTextStyle = styles.alarmText;
    helperText = "Alarm Active!";
    helperTextColor = myColors.red;
  } else if (active) {
    statusText = "Security Active";
    statusTextStyle = styles.activeText;
    helperText = "Tap to Deactivate";
    helperTextColor = myColors.secondary;
  }

  return (
    <View style={styles.shieldContainer}>
      <TouchableOpacity
        onPress={() => setActive(!active)}
        activeOpacity={0.8}
        disabled={isAlarmActive} // Optionally disable toggle when alarm is active
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
              tintColor: !active && !isAlarmActive ? "#888" : undefined
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
  shieldActive: {
    backgroundColor: myColors.green,
  },
  shieldInactive: {
    backgroundColor: "#eee",
  },
  shieldAlarm: {
    backgroundColor: myColors.red,
  },
  statusText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  activeText: {
    color: myColors.green
  },
  inactiveText: {
    color: "#999"
  },
  alarmText: {
    color: myColors.red,
  },
  helperText: {
    fontSize: 16,
  }
});

export default ShieldButton;