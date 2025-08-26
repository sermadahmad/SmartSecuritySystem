import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, ActivityIndicator } from "react-native";
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
    loading?: boolean; // <-- Add loading prop
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
    loading = false,
}) => {
    const [error, setError] = useState("");

    // Simple email validation regex
    const validateEmail = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleSave = () => {
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        onSave();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={[styles.modalOverlay, { backgroundColor: myColors.modalOverlay }]}>
                <View style={[styles.modalContent, { backgroundColor: myColors.background, borderColor: myColors.primary }]}>
                    <Text style={[styles.modalTitle, { color: myColors.secondary }]}>Add Contact</Text>
                    <TextInput
                        style={[styles.input, { borderColor: myColors.primary, color: myColors.secondary }]}
                        placeholder="Enter email"
                        placeholderTextColor={myColors.secondary}
                        value={email}
                        onChangeText={text => {
                            setEmail(text);
                            if (error) setError("");
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    {error ? (
                        <Text style={{ color: myColors.red, marginBottom: 8, textAlign: 'center' }}>{error}</Text>
                    ) : null}
                    <View style={styles.checkboxRow}>
                        {/* Disable checkboxes when loading */}
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => !loading && setSendLocation(!sendLocation)}
                            disabled={loading}
                        >
                            <Icon
                                name={sendLocation ? "check-box" : "check-box-outline-blank"}
                                size={22}
                                color={myColors.secondary}
                            />
                            <Text style={[styles.checkboxLabel, { color: myColors.primary }]}>Send Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => !loading && setSendPhotos(!sendPhotos)}
                            disabled={loading}
                        >
                            <Icon
                                name={sendPhotos ? "check-box" : "check-box-outline-blank"}
                                size={22}
                                color={myColors.secondary}
                            />
                            <Text style={[styles.checkboxLabel, { color: myColors.primary }]}>Send Photos</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => !loading && setSendEventDetails(!sendEventDetails)}
                            disabled={loading}
                        >
                            <Icon
                                name={sendEventDetails ? "check-box" : "check-box-outline-blank"}
                                size={22}
                                color={myColors.secondary}
                            />
                            <Text style={[styles.checkboxLabel, { color: myColors.primary }]}>Send Event Details</Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color={myColors.secondary} style={{ marginVertical: 10 }} />
                    ) : (
                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: myColors.red, borderColor: myColors.secondary }]} onPress={onClose}>
                                <Text style={[styles.modalButtonText, { color: myColors.background }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: myColors.background, borderColor: myColors.secondary }]} onPress={handleSave}>
                                <Text style={[styles.modalButtonText, { color: myColors.primary }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

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
        fontSize: 16,
    },
    checkboxRow: {
        marginBottom: 15,
        marginTop: 20,
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