import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS handles this differently
}


export async function getCurrentLocation(): Promise<GeolocationResponse | null> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    console.warn('Location permission not granted');
    return null;
  }

  return new Promise<GeolocationResponse>((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => resolve(position),
      error => reject(error),
      {
        // enableHighAccuracy: true,
        timeout: 150000,
        maximumAge: 100000,
      }
    );
  });
}

// Function to create a Google Maps link
export function createGoogleMapsLink(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

// New function to fetch location and return Google Maps link
export async function getGoogleMapsLink(): Promise<string | null> {
  try {
    const location = await getCurrentLocation();
    if (location) {
      const { latitude, longitude } = location.coords;
      return createGoogleMapsLink(latitude, longitude);
    }
    return null;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
}