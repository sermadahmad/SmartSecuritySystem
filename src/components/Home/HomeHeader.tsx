import React from 'react'
import { View, Image, StyleSheet, Dimensions, ImageSourcePropType } from 'react-native'

const { width } = Dimensions.get('window');

type HomeHeaderProps = {
  nameLogoSource: ImageSourcePropType;
  style?: object;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({ nameLogoSource, style }) => (
  <View style={styles.logoRow}>
    <Image
      source={require('../../assets/logo.png')}
      style={styles.logo}
    />
    <Image
      source={nameLogoSource}
      style={[styles.nameLogo, style]}
    />
  </View>
);

const styles = StyleSheet.create({
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.17,
    height: width * 0.17,
  },
  nameLogo: {
    width: width * 0.70,
    height: width * 0.17,
    resizeMode: 'contain',
  },
});

export default HomeHeader;