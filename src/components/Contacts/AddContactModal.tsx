import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { myColors } from "../../theme/colors";

type AddContactModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: () => void;
    email: string;
    setEmail: (email: string) => void;
    sendLocation: boolean;
    setSendLocation: (v: boolean) => void;
    sendPhotos: boolean;
    setSendPhotos: (v: boolean) => void;
    sendEventDetails: boolean;
    setSendEventDetails: (v: boolean) => void;
};

const AddContactModal: React.FC<AddContactModalProps> = ({
    visible,
    onClose,
    onSave,
    email,
    setEmail,
    sendLocation,
    setSendLocation,
    sendPhotos,
    setSendPhotos,
    sendEventDetails,
    setSendEventDetails,
}) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
    >
        <View style={[styles.modalOverlay, {
            backgroundColor: myColors.modalOverlay,
        }]}>
            <View style={[styles.modalContent, {
                backgroundColor: myColors.background, borderColor: myColors.primary,

            }]}>
                <Text style={[styles.modalTitle, {
                    color: myColors.secondary,
                }]}>Add Contact</Text>
                <TextInput
                    style={[styles.input, {
                        borderColor: myColors.primary, color: myColors.secondary,

                    }]}
                    placeholder="Enter email"
                    placeholderTextColor={myColors.secondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View style={styles.checkboxRow}>
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => setSendLocation(!sendLocation)}
                    >
                        <Icon
                            name={sendLocation ? "check-box" : "check-box-outline-blank"}
                            size={22}
                            color={myColors.secondary}
                        />
                        <Text style={[styles.checkboxLabel, {
                            color: myColors.primary,
                        }]}>Send Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => setSendPhotos(!sendPhotos)}
                    >
                        <Icon
                            name={sendPhotos ? "check-box" : "check-box-outline-blank"}
                            size={22}
                            color={myColors.secondary}
                        />
                        <Text style={[styles.checkboxLabel, {
                            color: myColors.primary,
                        }]}>Send Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.checkbox}
                        onPress={() => setSendEventDetails(!sendEventDetails)}
                    >
                        <Icon
                            name={sendEventDetails ? "check-box" : "check-box-outline-blank"}
                            size={22}
                            color={myColors.secondary}
                        />
                        <Text style={[styles.checkboxLabel, {
                            color: myColors.primary,
                        }]}>Send Event Details</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.modalButtonRow}>
                    <TouchableOpacity style={[styles.modalButton, {
                        backgroundColor: myColors.red, borderColor: myColors.secondary,

                    }]} onPress={onClose}>
                        <Text style={[styles.modalButtonText, {
                            color: myColors.background
                        }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, {
                        backgroundColor: myColors.background, borderColor: myColors.secondary,

                    }]} onPress={onSave}>
                        <Text style={[styles.modalButtonText, {
                            color: myColors.primary,
                        }]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        borderRadius: 15,
        padding: 20,
        width: '85%',
        borderWidth: 1,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    checkboxRow: {
        marginBottom: 15,
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 5,
        borderWidth: 1,
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default AddContactModal;