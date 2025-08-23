import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Dimensions, Image } from 'react-native'
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context'
import { myColors } from '../theme/colors'
import HomeHeader from '../components/Home/HomeHeader';
import EventCard from '../components/Events/EventCard';

const { width } = Dimensions.get('window');

// events data 
const events = [
  {
    dateTime: new Date().toLocaleString(),
    triggeredBy: "Unauthorized Access/ Panic Button",
    location: "Google Maps Link",
    alarmInfo: "Alarm Played for 2 mins.",
    frontPhoto: require('../assets/image.png'),
    backPhoto: require('../assets/image.png'),
  },
  {
    dateTime: new Date().toLocaleString(),
    triggeredBy: "Unauthorized Access/ Panic Button",
    location: "Google Maps Link",
    alarmInfo: "Alarm Played for 2 mins.",
    frontPhoto: require('../assets/image.png'),
    backPhoto: require('../assets/image.png'),
  },
  {
    dateTime: new Date().toLocaleString(),
    triggeredBy: "Unauthorized Access/ Panic Button",
    location: "Google Maps Link",
    alarmInfo: "Alarm Played for 2 mins.",
    frontPhoto: require('../assets/image.png'),
    backPhoto: require('../assets/image.png'),
  },
];

const EventsScreen = () => {
  const [showTriggerDropdown, setShowTriggerDropdown] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState("Trigger Type");
  const triggerOptions = ["Show All", "Unauthorized Access", "Panic Button"];
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <View>
            <HomeHeader
              nameLogoSource={require('../assets/eventsLogo.png')}
              style={{ width: width * 0.4, marginLeft: width * 0.13 }}
            />
          </View>
          <View style={[styles.filterContainer, {
            backgroundColor: myColors.background,
          }]}>
            <Text style={[styles.filterLabel, { color: myColors.primary }]}>Filter by:</Text>
            <View style={styles.filterButtonsRow}>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity
                  style={[styles.filterButton, {
                    borderColor: myColors.secondary,
                  }]}
                  onPress={() => setShowTriggerDropdown(!showTriggerDropdown)}
                >
                  <Text style={[styles.filterButtonText, { color: myColors.primary }]}>
                    {selectedTrigger}
                  </Text>
                  <Icon name="arrow-drop-down" size={20} color={myColors.primary} />
                </TouchableOpacity>
                {showTriggerDropdown && (
                  <View style={[styles.dropdown, {
                    backgroundColor: myColors.background,
                    borderColor: myColors.secondary,
                  }]}>
                    {triggerOptions.map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setSelectedTrigger(option);
                          setShowTriggerDropdown(false);
                        }}
                      >
                        <Text style={{ color: myColors.primary }}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
          <View>
            {events.length === 0 ? (
              <Text style={{ textAlign: 'center', color: myColors.primary, fontSize: 16 }}>
                No Security events recorded yet.
              </Text>
            ) : (
              events.map((event, index) => (
                <EventCard
                  key={index}
                  dateTime={event.dateTime}
                  triggeredBy={event.triggeredBy}
                  location={event.location}
                  alarmInfo={event.alarmInfo}
                  frontPhoto={event.frontPhoto}
                  backPhoto={event.backPhoto}
                  onDelete={() => console.log("Delete event", index)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 5,
    borderRadius: 10,
    zIndex: 1,
  },
  filterLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    paddingRight: 5,
    paddingLeft: 10,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 160,
  },
  dropdownItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default EventsScreen;