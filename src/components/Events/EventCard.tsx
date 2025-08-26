import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Linking } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { myColors } from "../../theme/colors";

type EventCardProps = {
  dateTime: string;
  onDelete?: () => void;
  triggeredBy: string;
  location: string | null;
  alarmSound: string;
  frontPhoto: any;
  backPhoto: any;
};

const EventCard: React.FC<EventCardProps> = ({
  dateTime,
  onDelete,
  triggeredBy,
  location,
  alarmSound,
  frontPhoto,
  backPhoto,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState<any>(null);

  const handleImagePress = (img: any) => {
    setModalImage(img);
    setModalVisible(true);
  };

  return (
    <View style={[styles.eventCard, { backgroundColor: myColors.background, borderColor: myColors.secondary, borderWidth: 1 }]}>
      <View style={styles.eventHeader}>
        <Text style={[styles.eventDate, { color: myColors.secondary }]}>{dateTime}</Text>
        <TouchableOpacity onPress={onDelete}>
          <Icon name="delete" size={25} color={myColors.red} />
        </TouchableOpacity>
      </View>
      <View style={styles.eventRow}>
        <Text style={[styles.eventLabel, { color: myColors.primary }]}>Triggered by:</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.eventValue, { color: myColors.secondary }]}>
          {triggeredBy}
        </Text>
      </View>
      <View style={styles.eventRow}>
        <Text style={[styles.eventLabel, { color: myColors.primary }]}>Alarm Sound:</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.eventValue, { color: myColors.secondary }]}>
          {alarmSound}
        </Text>
      </View>
      {
        location && (
          <View style={styles.eventRow}>
            <Text style={[styles.eventLabel, { color: myColors.primary }]}>Location:</Text>
            <TouchableOpacity 
            onPress={() => {
              if (location) {
                Linking.openURL(location).catch(err => console.error('Error opening map:', err));
              }
            }}
            style={{
              flex: 1,
              marginLeft: 10,
            }}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.eventLink, { color: myColors.secondary }]}>
                {location}
              </Text>
            </TouchableOpacity>
          </View>
        )
      }
      <View style={styles.eventPhotoSection}>
        <Text style={[styles.eventLabel, { color: myColors.primary }]}>Photo from Front Camera:</Text>
        <View style={styles.eventPhotoContainer}>
          <TouchableOpacity style={{
            width: '100%',
            height: 300,
          }} onPress={() => handleImagePress(frontPhoto)}>
            <Image source={frontPhoto} style={styles.eventPhoto} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.eventPhotoSection}>
        <Text style={[styles.eventLabel, { color: myColors.primary }]}>Photo from Back Camera:</Text>
        <View style={styles.eventPhotoContainer}>
          <TouchableOpacity style={{
            width: '100%',
            height: 300,
          }} onPress={() => handleImagePress(backPhoto)}>
            <Image source={backPhoto} style={styles.eventPhoto} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Fullscreen Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableOpacity style={styles.modalCloseArea} onPress={() => setModalVisible(false)} />
          <View style={styles.modalImageContainer}>
            <Image source={modalImage} style={styles.fullscreenImage} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventDate: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  eventValue: {
    fontSize: 15,
    flex: 1,
    flexShrink: 1,
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  alarmText: {
    fontSize: 15,
  },
  eventLink: {
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  eventInfo: {
    marginTop: 10,
  },
  eventPhotoSection: {
    marginTop: 10,
  },
  eventPhotoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  eventPhoto: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 1,
  },
  modalImageContainer: {
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '58%',
    backgroundColor: 'black',
    borderRadius: 10,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

export default EventCard;