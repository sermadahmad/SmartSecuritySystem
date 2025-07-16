// locationService.ts
// This file provides utility functions for location access. It does NOT use React hooks and should not be a source of 'invalid hook call' errors.
// If you need to use hooks (like useState, useEffect), do so only inside React components or custom hooks, NOT in utility files like this.

import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';

// Requests location permission (Android only)
async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS handles this differently
}

// Gets the current location (one-time fetch)
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
        // enableHighAccuracy: true, // Uncomment if you want high accuracy
        timeout: 150000,
        maximumAge: 100000,
      }
    );
  });
}

// Function to create a Google Maps link from coordinates
export function createGoogleMapsLink(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

// Fetches location and returns a Google Maps link (wrapper)
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

// NOTE: If you are not using createGoogleMapsLink elsewhere, you may comment it out. For now, it is used by getGoogleMapsLink.