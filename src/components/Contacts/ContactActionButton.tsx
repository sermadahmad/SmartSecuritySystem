import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { myColors } from "../../theme/colors";

type ContactActionButtonProps = {
  active: boolean;
  label: string;
};

const ContactActionButton: React.FC<ContactActionButtonProps> = ({ active, label }) => (
  <TouchableOpacity
    style={[
      styles.button,
      active
        ? { backgroundColor: myColors.tertiary, borderColor: myColors.secondary }
        : { backgroundColor: myColors.background, borderColor: myColors.secondary }
    ]}
    // onPress={onPress}
  >
    <Text
      style={[
        styles.buttonText,
        { fontWeight: active ? 'bold' : '500' },
        active
          ? { color: myColors.secondary }
          : { color: myColors.primary }
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