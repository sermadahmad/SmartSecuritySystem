import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { myColors } from "../../theme/colors";

type ContactActionButtonProps = {
  active: boolean;
  onPress: () => void;
  label: string;
};

const ContactActionButton: React.FC<ContactActionButtonProps> = ({ active, onPress, label }) => (
  <TouchableOpacity
    style={[
      styles.button,
      active
        ? { backgroundColor: myColors.secondary, borderColor: myColors.secondary }
        : { backgroundColor: myColors.background, borderColor: myColors.primary }
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.buttonText,
        active
          ? { color: myColors.background }
          : { color: myColors.secondary }
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1,
  },
});

export default ContactActionButton;