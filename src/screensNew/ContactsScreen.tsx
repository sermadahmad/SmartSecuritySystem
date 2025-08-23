import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, Animated, Easing, TouchableOpacity, Dimensions, Image } from 'react-native'
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context'
import { myColors } from '../theme/colors'
import HomeHeader from '../components/Home/HomeHeader';
import ShieldButton from '../components/Home/ShieldButton';
import StatusIndicator from "../components/StatusIndicator";
import PanicButton from "../components/Home/PanicButton";
import ContactActionButton from "../components/Contacts/ContactActionButton";
import ContactCard from '../components/Contacts/ContactCard';

const { width, height } = Dimensions.get('window');

// data for contacts
const contacts = [
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
  {
    email: 'user@gmail.com',
    sendLocation: false,
    setSendLocation: (v: boolean) => { },
    sendPhotos: false,
    setSendPhotos: (v: boolean) => { },
    sendEventDetails: false,
    setSendEventDetails: (v: boolean) => { },
    onDelete: () => {
      // handle delete
    }
  },
];

// const contacts =[];

const ContactsScreen = () => {
  const [sendLocation, setsendLocation] = useState(false);
  const [sendPhotos, setsendPhotos] = useState(false);
  const [sendEventDetails, setsendEventDetails] = useState(false);

  const handleAddContact = () => {
    // TODO: Add your logic to add a contact
    console.log("Add Contact pressed");
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
              <Text style={{ textAlign: 'center', color: myColors.secondary, fontSize: 16 }}>
                No contacts yet.
              </Text>
            ) : (
              contacts.map((contact, index) => (
                <ContactCard
                  key={index}
                  email={contact.email}
                  sendLocation={sendLocation}
                  setSendLocation={setsendLocation}
                  sendPhotos={sendPhotos}
                  setSendPhotos={setsendPhotos}
                  sendEventDetails={sendEventDetails}
                  setSendEventDetails={setsendEventDetails}
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
  locationButton: {
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  locationButtonText: {
    fontSize: 8,
    fontWeight: '500',
    letterSpacing: 1,
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