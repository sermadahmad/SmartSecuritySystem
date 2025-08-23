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

const SettingsScreen = () => {
  const [alarmDelay, setAlarmDelay] = useState(0);

  const handleIncrement = () => setAlarmDelay(alarmDelay + 1);
  const handleDecrement = () => setAlarmDelay(alarmDelay > 0 ? alarmDelay - 1 : 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <HomeHeader
            nameLogoSource={require('../assets/settingsLogo.png')}
            style={{ width: width * 0.3, marginLeft: width * 0.15 }}
          />
          <View>
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Security Timers: </Text>
              </View>
              <View style={styles.timerRow}>
                <Text style={styles.timerLabel}>Alarm Delay: </Text>
                <View style={styles.timerControl}>
                  <TouchableOpacity style={styles.timerButton} onPress={handleDecrement}>
                    <Icon name="minus" size={22} color={myColors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.timerValue}>{alarmDelay}</Text>
                  <TouchableOpacity style={styles.timerButton} onPress={handleIncrement}>
                    <Icon name="plus" size={22} color={myColors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.timerInfo}>
                Lock Delay (how long device must stay locked & still before monitoring).
              </Text>
              <View style={styles.timerRow}>
                <Text style={styles.timerLabel}>Lock Delay: </Text>
                <View style={styles.timerControl}>
                  <TouchableOpacity style={styles.timerButton} onPress={handleDecrement}>
                    <Icon name="minus" size={22} color={myColors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.timerValue}>{alarmDelay}</Text>
                  <TouchableOpacity style={styles.timerButton} onPress={handleIncrement}>
                    <Icon name="plus" size={22} color={myColors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.timerInfo}>
                Alarm Delay (grace time to unlock before alarm).
              </Text>
            </>
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>Alarm Timers: </Text>
              </View>
              <Text style={styles.timerLabel}>Choose Sound: </Text>
            </>

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
  sectionHeader: {
    paddingVertical: 10,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: myColors.secondary,
    letterSpacing: 1,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: myColors.primary,
  },
  timerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timerButton: {
    padding: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: myColors.secondary,
  },
  timerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: myColors.primary,
    marginHorizontal: 8,
    minWidth: 32,
    textAlign: 'center',
  },
  timerInfo: {
    // marginTop: 8,
    // marginBottom: 16,
    fontSize: 14,
    color: myColors.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default SettingsScreen;