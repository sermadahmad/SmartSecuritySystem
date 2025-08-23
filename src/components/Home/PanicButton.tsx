import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { myColors } from "../../theme/colors";

type PanicButtonProps = {
  alarmTriggered: boolean;
  setAlarmTriggered: (value: boolean) => void;
};

const PanicButton: React.FC<PanicButtonProps> = ({ alarmTriggered, setAlarmTriggered }) => {
  const [triggered, setTriggered] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const holdTime = 2000; // 2 seconds

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startHold = () => {
    if (alarmTriggered) {
      setAlarmTriggered(false);
      setTriggered(false);
      progress.setValue(0);
      return;
    }
    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: holdTime,
      useNativeDriver: false,
    });
    animationRef.current.start(({ finished }) => {
      if (finished) {
        setTriggered(true);
        setAlarmTriggered(true);
        console.log("Panic Activated!");
        // TODO: trigger alarm, send photos, etc.
      }
    });
  };

  const cancelHold = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
    progress.setValue(0);
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={startHold}
        onPressOut={cancelHold}
        style={[
          alarmTriggered || triggered ? styles.alarmButton : styles.button
        ]}
      >
        <Text style={[styles.buttonText, (alarmTriggered || triggered) && { color: myColors.red }]}>
          {(alarmTriggered || triggered) ? "PANIC TRIGGERED !" : "HOLD TO PANIC"}
        </Text>
        {!(alarmTriggered || triggered) && (
          <Animated.View
            style={[styles.progress, { width: progressWidth }]}
          />
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    alignItems: "center",
  },
  button: {
    width: 250,
    height: 80,
    backgroundColor: myColors.red,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: myColors.background,
    zIndex: 2,
  },
  progress: {
    position: "absolute",
    left: 0,
    bottom: 0,
    top: 0,
    backgroundColor: myColors.tertiary,
    zIndex: 1,
  },
  alarmButton: {
    backgroundColor: myColors.background,
    borderWidth: 2,
    borderColor: myColors.red,
    width: 250,
    height: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
});

export default PanicButton;
