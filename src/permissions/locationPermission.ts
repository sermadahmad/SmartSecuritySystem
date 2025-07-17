
import { Platform, Alert, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestLocationPermissions = async (): Promise<boolean> => {
  // Check platform and request permissions accordingly
  if (Platform.OS === 'android') {
    try {
      const fineLocation = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      let status = await check(fineLocation);
      if (
        status === RESULTS.BLOCKED ||
        status === RESULTS.DENIED ||
        status === RESULTS.LIMITED
      ) {
        status = await request(fineLocation);
        if (status !== RESULTS.GRANTED) {
          return false;
        }
      } else if (status !== RESULTS.GRANTED) {
        return false;
      }
      // If Android 10+ (API 29+), request background location as well
      if (Platform.Version >= 29) {
        const backgroundLocation = PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION;
        let bgStatus = await check(backgroundLocation);
        if (
          bgStatus === RESULTS.BLOCKED ||
          bgStatus === RESULTS.DENIED ||
          bgStatus === RESULTS.LIMITED
        ) {
          bgStatus = await request(backgroundLocation);
          if (bgStatus !== RESULTS.GRANTED) {
            console.warn('Background location permission not granted. Some features may be limited.');
          }
        }
      }
      return true;
    } catch (e) {
      console.error('Android location permission error:', e);
      return false;
    }
  } else if (Platform.OS === 'ios') {
    try {
      // Check and request both WhenInUse and Always permissions as needed
      // Check and request WhenInUse permission
      const whenInUsePermission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      let status = await check(whenInUsePermission);
      if (
        status === RESULTS.BLOCKED ||
        status === RESULTS.DENIED ||
        status === RESULTS.LIMITED
      ) {
        status = await request(whenInUsePermission);
        if (status !== RESULTS.GRANTED) {
          return false;
        }
      } else if (status !== RESULTS.GRANTED) {
        return false;
      }
      // If Always permission is needed, request it as well
      const alwaysPermission = PERMISSIONS.IOS.LOCATION_ALWAYS;
      let alwaysStatus = await check(alwaysPermission);
      if (
        alwaysStatus === RESULTS.BLOCKED ||
        alwaysStatus === RESULTS.DENIED ||
        alwaysStatus === RESULTS.LIMITED
      ) {
        alwaysStatus = await request(alwaysPermission);
        if (alwaysStatus !== RESULTS.GRANTED) {
          console.warn('Location Always permission not granted. Some features may be limited.');
          return false;
        }
      } else if (alwaysStatus !== RESULTS.GRANTED) {
        return false;
      }
      return true;
    } catch (e) {
      console.error('iOS location permission error:', e);
      return false;
    }
  }
  return true;
}