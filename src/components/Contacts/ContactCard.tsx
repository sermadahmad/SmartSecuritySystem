import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { myColors } from "../../theme/colors";
import ContactActionButton from "./ContactActionButton";

type ContactCardProps = {
    email: string;
    sendLocation: boolean;
    sendPhotos: boolean;
    sendEventDetails: boolean;
    onDelete?: () => void;
};

const ContactCard: React.FC<ContactCardProps> = ({
    email,
    sendLocation,
    sendPhotos,
    sendEventDetails,
    onDelete,
}) => (
    <View style={[styles.card, {
        borderColor: myColors.secondary, backgroundColor: myColors.background,

    }]}>
        <View style={styles.topRow}>
            <Text style={[styles.email, {
                color: myColors.secondary,
            }]}>{email}</Text>
            <TouchableOpacity onPress={onDelete}>
                <Icon name="delete" size={20} color={myColors.red} />
            </TouchableOpacity>
        </View>
        <View style={styles.actionRow}>
            <ContactActionButton
                active={sendLocation}
                // onPress={() => setSendLocation(!sendLocation)}
                label="Send Location"
            />
            <ContactActionButton
                active={sendPhotos}
                // onPress={() => setSendPhotos(!sendPhotos)}
                label="Send Photos"
            />
            <ContactActionButton
                active={sendEventDetails}
                // onPress={() => setSendEventDetails(!sendEventDetails)}
                label="Send Event Details"
            />
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: {
        borderRadius: 10,
        borderWidth: 1,
        padding: 10,
        marginBottom: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
});

export default ContactCard;