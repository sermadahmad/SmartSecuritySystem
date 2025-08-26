import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Dimensions, Image } from 'react-native'
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from 'react-native-safe-area-context'
import { myColors } from '../theme/colors'
import HomeHeader from '../components/Home/HomeHeader';
import EventCard from '../components/Events/EventCard';
import { useSecurity } from "../context/SecurityProvider";

const { width } = Dimensions.get('window');

const EventsScreen = () => {
  const {
    eventLogs,
    setEventLogs,
  } = useSecurity();

  const [showTriggerDropdown, setShowTriggerDropdown] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState("Show All");
  const triggerOptions = ["Show All", "Unauthorized Access", "Panic Button"];

  // Filter event logs based on selected trigger
  const filteredLogs = selectedTrigger === "Show All"
    ? eventLogs
    : eventLogs.filter(log => log.triggerType === selectedTrigger);

  // Sort logs by date and time (newest first)
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    // Convert to ISO string for reliable parsing
    const toISO = (date: string, time: string) => {
      // Example: "8/26/2025" + "7:57:21 PM" => "2025-08-26T19:57:21"
      const [month, day, year] = date.split('/');
      let [timePart, ampm] = time.split(' ');
      let [hour, minute, second] = timePart.split(':');
      hour = ampm === 'PM' && hour !== '12' ? String(Number(hour) + 12) : hour;
      hour = ampm === 'AM' && hour === '12' ? '00' : hour;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}:${second}`;
    };

    const aDate = new Date(toISO(a.date, a.time));
    const bDate = new Date(toISO(b.date, b.time));
    return bDate.getTime() - aDate.getTime();
  });

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
            {sortedLogs.length === 0 ? (
              <Text style={{ textAlign: 'center', color: myColors.primary, fontSize: 16 }}>
                No Security events recorded yet.
              </Text>
            ) : (
              sortedLogs.map((event, index) => (
                <EventCard
                  key={index}
                  dateTime={`${event.date} ${event.time}`}
                  triggeredBy={event.triggerType}
                  location={event.location}
                  alarmSound={event.alarmSound}
                  frontPhoto={
                    event.photoURIs?.[0]
                      ? { uri: event.photoURIs[0].startsWith('file://') ? event.photoURIs[0] : `file://${event.photoURIs[0]}` }
                      : require('../assets/image.png')
                  }
                  backPhoto={
                    event.photoURIs?.[1]
                      ? { uri: event.photoURIs[1].startsWith('file://') ? event.photoURIs[1] : `file://${event.photoURIs[1]}` }
                      : require('../assets/image.png')
                  }
                  onDelete={() => {
                    setEventLogs(prev => prev.filter((_, i) => i !== index));
                  }}
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