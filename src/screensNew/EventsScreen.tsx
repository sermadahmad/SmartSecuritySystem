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

const EventsScreen = () => {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: myColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={myColors.background} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <HomeHeader
            nameLogoSource={require('../assets/eventsLogo.png')}
            style={{ width: width * 0.4, marginLeft: width * 0.13}}

          />
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
});

export default EventsScreen;