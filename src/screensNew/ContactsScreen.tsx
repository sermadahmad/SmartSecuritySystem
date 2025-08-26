import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from 'react-native'
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context'
import { myColors } from '../theme/colors'
import HomeHeader from '../components/Home/HomeHeader';
import ContactCard from '../components/Contacts/ContactCard';
import AddContactModal from '../components/Contacts/AddContactModal';
import { useSecurity } from "../context/SecurityProvider";
import { getFirestore, collection, addDoc, serverTimestamp, deleteDoc, doc, getDocs } from '@react-native-firebase/firestore';
import { usePersistentState } from '../hooks/usePersistentState';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const ContactsScreen = () => {
  const { contacts, setContacts } = useSecurity();
  const { userId } = usePersistentState();

  const [modalVisible, setModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newSendLocation, setNewSendLocation] = useState(false);
  const [newSendPhotos, setNewSendPhotos] = useState(false);
  const [newSendEventDetails, setNewSendEventDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch contacts from Firestore
  const fetchContacts = useCallback(async () => {
    if (!userId) return;
    setLoading(true); // <-- Start loading
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, `users/${userId}/contacts`));
      const fetchedContacts = querySnapshot.docs.map((docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false); // <-- End loading
    }
  }, [userId, setContacts]);

  useEffect(() => {
    fetchContacts();
  }, [userId, fetchContacts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  }, [fetchContacts]);

  const handleAddContact = () => {
    setModalVisible(true);
  };

  const handleSaveContact = async () => {
    if (!newEmail.trim()) return;
    setLoading(true);
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, `users/${userId}/contacts`), {
        email: newEmail,
        sendLocation: newSendLocation,
        sendPhotos: newSendPhotos,
        sendEventDetails: newSendEventDetails,
        createdAt: serverTimestamp(),
      });
      setContacts([
        ...contacts,
        {
          id: docRef.id, // <-- Save Firestore doc ID
          email: newEmail,
          sendLocation: newSendLocation,
          sendPhotos: newSendPhotos,
          sendEventDetails: newSendEventDetails,
        }
      ]);
      setModalVisible(false);
      setNewEmail("");
      setNewSendLocation(false);
      setNewSendPhotos(false);
      setNewSendEventDetails(false);
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id: string, index: number) => {
    try {
      const db = getFirestore();
      await deleteDoc(doc(db, `users/${userId}/contacts/${id}`));
      setContacts(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[myColors.secondary]}
            tintColor={myColors.secondary}
          />
        }
      >
        <View style={styles.container}>
          <HomeHeader
            nameLogoSource={require('../assets/contactsLogo.png')}
            style={{ width: width * 0.65, marginLeft: width * 0.02 }}
          />
          <View>
            {loading && !refreshing ? (
              <ActivityIndicator size="large" color={myColors.secondary} style={{ marginVertical: 32 }} />
            ) : contacts.length === 0 ? (
              <Text style={{ textAlign: 'center', color: myColors.primary, fontSize: 16 }}>
                No contacts yet.
              </Text>
            ) : (
              contacts.map((contact, index) => (
                <ContactCard
                  key={contact.id || index}
                  id={contact.id}
                  email={contact.email}
                  sendLocation={contact.sendLocation}
                  sendPhotos={contact.sendPhotos}
                  sendEventDetails={contact.sendEventDetails}
                  onDelete={() => handleDeleteContact(contact.id, index)}
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
        loading={loading}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollViewContent: { flexGrow: 1 },
  container: { paddingHorizontal: 20, paddingTop: 10 },
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