import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Dimensions } from 'react-native'
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context'
import { myColors } from '../theme/colors'
import HomeHeader from '../components/Home/HomeHeader';
import ContactCard from '../components/Contacts/ContactCard';
import AddContactModal from '../components/Contacts/AddContactModal';

const { width, height } = Dimensions.get('window');

const ContactsScreen = () => {
  const [sendLocation, setsendLocation] = useState(false);
  const [sendPhotos, setsendPhotos] = useState(false);
  const [sendEventDetails, setsendEventDetails] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newSendLocation, setNewSendLocation] = useState(false);
  const [newSendPhotos, setNewSendPhotos] = useState(false);
  const [newSendEventDetails, setNewSendEventDetails] = useState(false);

  type Contact = {
    email: string;
    sendLocation: boolean;
    setSendLocation: (v: boolean) => void;
    sendPhotos: boolean;
    setSendPhotos: (v: boolean) => void;
    sendEventDetails: boolean;
    setSendEventDetails: (v: boolean) => void;
    onDelete?: () => void;
  };
  
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleAddContact = () => {
    setModalVisible(true);
  };

  const handleSaveContact = () => {
    if (!newEmail.trim()) return;
    setContacts([
      ...contacts,
      {
        email: newEmail,
        sendLocation: newSendLocation,
        setSendLocation: setNewSendLocation,
        sendPhotos: newSendPhotos,
        setSendPhotos: setNewSendPhotos,
        sendEventDetails: newSendEventDetails,
        setSendEventDetails: setNewSendEventDetails,
        onDelete: () => {
        },
      }
    ]);
    setModalVisible(false);
    setNewEmail("");
    setNewSendLocation(false);
    setNewSendPhotos(false);
    setNewSendEventDetails(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <HomeHeader
            nameLogoSource={require('../assets/contactsLogo.png')}
            style={{ width: width * 0.65, marginLeft: width * 0.02 }}
          />
          <View >
            {contacts.length === 0 ? (
              <Text style={{ textAlign: 'center', color: myColors.primary, fontSize: 16 }}>
                No contacts yet.
              </Text>
            ) : (
              contacts.map((contact, index) => (
                <ContactCard
                  key={index}
                  email={contact.email}
                  sendLocation={contact.sendLocation}
                  setSendLocation={contact.setSendLocation}
                  sendPhotos={contact.sendPhotos}
                  setSendPhotos={contact.setSendPhotos}
                  sendEventDetails={contact.sendEventDetails}
                  setSendEventDetails={contact.setSendEventDetails}
                  onDelete={contact.onDelete}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={[styles.fab, {
        backgroundColor: myColors.secondary,
      }]} onPress={handleAddContact}>
        <Icon name="add" size={28} color={myColors.background} />
      </TouchableOpacity>
      <AddContactModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveContact}
        email={newEmail}
        setEmail={setNewEmail}
        sendLocation={newSendLocation}
        setSendLocation={setNewSendLocation}
        sendPhotos={newSendPhotos}
        setSendPhotos={setNewSendPhotos}
        sendEventDetails={newSendEventDetails}
        setSendEventDetails={setNewSendEventDetails}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactsScreen;