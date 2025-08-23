import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, Animated, Easing, TouchableOpacity, Dimensions, Image } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from 'react-native-safe-area-context'
import { myColors } from '../theme/colors'
import HomeHeader from '../components/Home/HomeHeader';
import ShieldButton from '../components/Home/ShieldButton';
import StatusIndicator from "../components/StatusIndicator";
import PanicButton from "../components/Home/PanicButton";

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [active, setActive] = useState(false);
  const [isLastEvent, setIsLastEvent] = useState(false);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <HomeHeader
            nameLogoSource={require('../assets/nameLogo.png')}
          />
          <ShieldButton active={active} setActive={setActive} isAlarmActive={isAlarmActive} />
          <View style={styles.spacer} />
          <StatusIndicator />
          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: myColors.primary }]}>Status: </Text>
            <Text
              style={[
                styles.statusValue,
                isAlarmActive
                  ? { color: myColors.secondary }
                  : active
                    ? { color: myColors.green }
                    : { color: myColors.primary }
              ]}
            >
              {isAlarmActive
                ? "Alarm Triggered"
                : active
                  ? "Monitoring Active"
                  : "Monitoring Inactive"}
            </Text>
          </View>
          <View style={styles.lastEventRow}>
            <Text style={styles.lastEventLabel}>Last Event: </Text>
            <Text style={[
              styles.lastEventValue,
              { color: isLastEvent ? myColors.secondary : myColors.primary }
            ]}>
              {isLastEvent ? 'On Date at Time' : 'No events yet.'}
            </Text>
          </View>
          <View style={styles.alarmButtonContainer}>
            <TouchableOpacity
              onPress={() => setIsAlarmActive(!isAlarmActive)}
              style={[
                styles.alarmButton,
                { backgroundColor: myColors.background, borderColor: myColors.primary }
              ]}
            >
              <Text style={[styles.alarmButtonText, { color: myColors.secondary }]}>Test Alarm</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.spacer} />
          <View>
            <PanicButton
              alarmTriggered={isAlarmActive}
              setAlarmTriggered={setIsAlarmActive}
            />
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
  spacer: {
    height: height * 0.02,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statusLabel: {
    fontSize: 22,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 22,
    fontWeight: '600',
  },
  lastEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastEventLabel: {
    color: myColors.primary,
    fontSize: 22,
    fontWeight: '600',
  },
  lastEventValue: {
    fontSize: 22,
    fontWeight: '600',
  },
  alarmButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  alarmButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  alarmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default HomeScreen;