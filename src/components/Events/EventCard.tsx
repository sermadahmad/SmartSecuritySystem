import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { myColors } from "../../theme/colors";

type EventCardProps = {
  dateTime: string;
  onDelete?: () => void;
  triggeredBy: string;
  location: string;
  alarmInfo: string;
  frontPhoto: any;
  backPhoto: any;
};

const EventCard: React.FC<EventCardProps> = ({
  dateTime,
  onDelete,
  triggeredBy,
  location,
  alarmInfo,
  frontPhoto,
  backPhoto,
}) => (
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
      <Text style={[styles.eventLabel, { color: myColors.primary }]}>Location:</Text>
      <TouchableOpacity>
        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.eventLink, { color: myColors.secondary }]}>
          {location}
        </Text>
      </TouchableOpacity>
    </View>
    <View style={styles.eventInfo}>
      <Text style={[styles.alarmText, { color: myColors.red }]}>{alarmInfo}</Text>
    </View>
    <View style={styles.eventPhotoSection}>
      <Text style={[styles.eventLabel, { color: myColors.primary }]}>Photo from Front Camera:</Text>
      <View style={styles.eventPhotoContainer}>
        <Image source={frontPhoto} style={styles.eventPhoto} />
      </View>
    </View>
    <View style={styles.eventPhotoSection}>
      <Text style={[styles.eventLabel, { color: myColors.primary }]}>Photo from Back Camera:</Text>
      <View style={styles.eventPhotoContainer}>
        <Image source={backPhoto} style={styles.eventPhoto} />
      </View>
    </View>
  </View>
);

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
    height: 180,
    borderRadius: 10,
    resizeMode: 'contain',
  },
});

export default EventCard;